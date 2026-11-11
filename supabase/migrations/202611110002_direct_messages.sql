begin;
create table public.geonara_messages(
 seq bigint generated always as identity primary key,
 sender uuid not null references public.geonara_profiles(id),
 recipient uuid not null references public.geonara_profiles(id),
 client_id uuid not null,
 text text not null check(length(btrim(text)) between 1 and 4000),
 created_at timestamptz not null default now(),read_at timestamptz,
 check(sender<>recipient),unique(sender,client_id)
);
create index geonara_messages_recipient on public.geonara_messages(recipient,seq desc);
create index geonara_messages_sender on public.geonara_messages(sender,seq desc);
create index geonara_messages_unread on public.geonara_messages(recipient,sender,seq) where read_at is null;
alter table public.geonara_messages enable row level security;
revoke all on public.geonara_messages from anon,authenticated;
grant select on public.geonara_messages to authenticated;
create policy messages_private on public.geonara_messages for select to authenticated using(public.geonara_member() and auth.uid() in (sender,recipient));

create function public.geonara_send_message(p_recipient uuid,p_text text,p_client_id uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare m public.geonara_messages; u uuid:=auth.uid();
begin
 if not public.geonara_member() then raise exception 'Sign in required.'; end if;
 if p_recipient is null or p_recipient=u or not exists(select 1 from public.geonara_profiles where id=p_recipient) then raise exception 'Member not found.'; end if;
 if p_client_id is null or p_text is null or length(btrim(p_text)) not between 1 and 4000 then raise exception 'Invalid message.'; end if;
 perform pg_advisory_xact_lock(hashtextextended(u::text,0));
 select * into m from public.geonara_messages where sender=u and client_id=p_client_id;
 if found then
  if m.recipient<>p_recipient or m.text<>btrim(p_text) then raise exception 'Message identifier already used.'; end if;
 else
  if (select count(*) from public.geonara_messages where sender=u and created_at>now()-interval '1 minute')>=30 then raise exception 'Message rate limit reached.'; end if;
  insert into public.geonara_messages(sender,recipient,client_id,text) values(u,p_recipient,p_client_id,btrim(p_text)) returning * into m;
 end if;
 return jsonb_build_object('id',m.seq::text,'clientId',m.client_id,'text',m.text,'mine',true,'createdAt',m.created_at,'readAt',m.read_at);
end $$;

create function public.geonara_message_thread(p_peer uuid,p_before bigint default null,p_after bigint default null) returns jsonb language sql stable security definer set search_path='' as $$
 select jsonb_build_object('messages',coalesce(jsonb_agg(jsonb_build_object('id',m.seq::text,'clientId',m.client_id,'text',m.text,'mine',m.sender=auth.uid(),'createdAt',m.created_at,'readAt',m.read_at) order by m.seq),'[]'::jsonb),'hasMore',count(*)=50)
 from (select * from public.geonara_messages where public.geonara_member()
 and ((sender=auth.uid() and recipient=p_peer) or (recipient=auth.uid() and sender=p_peer))
 and (p_before is null or seq<p_before) and (p_after is null or seq>p_after)
 order by case when p_after is not null then seq end asc,seq desc limit 50) m
$$;
create function public.geonara_read_messages(p_peer uuid,p_upto bigint) returns void language plpgsql security definer set search_path='' as $$
begin
 if not public.geonara_member() then raise exception 'Sign in required.'; end if;
 update public.geonara_messages set read_at=now() where recipient=auth.uid() and sender=p_peer and seq<=p_upto and read_at is null;
end $$;
create function public.geonara_message_unread() returns bigint language sql stable security definer set search_path='' as $$
 select count(*) from public.geonara_messages where public.geonara_member() and recipient=auth.uid() and read_at is null
$$;
create function public.geonara_message_inbox(p_offset integer default 0) returns jsonb language sql stable security definer set search_path='' as $$
 with own as (select m.*,case when m.sender=auth.uid() then m.recipient else m.sender end peer from public.geonara_messages m where public.geonara_member() and auth.uid() in (m.sender,m.recipient)),
 latest as (select distinct on(peer) * from own order by peer,seq desc),
 page as (select l.*,p.public_id,p.profile from latest l join public.geonara_profiles p on p.id=l.peer order by l.seq desc limit 21 offset greatest(0,least(coalesce(p_offset,0),100000)))
 select jsonb_build_object('conversations',coalesce(jsonb_agg(jsonb_build_object('member',jsonb_build_object('id',p.peer,'publicId',p.public_id,'profile',jsonb_build_object('name',p.profile->>'name','avatarId',p.profile->>'avatarId','specialization',p.profile->>'specialization')),
 'last',jsonb_build_object('text',p.text,'mine',p.sender=auth.uid(),'createdAt',p.created_at,'id',p.seq::text),
 'unread',(select count(*) from own x where x.peer=p.peer and x.recipient=auth.uid() and x.read_at is null)) order by p.seq desc),'[]'::jsonb),'unreadTotal',public.geonara_message_unread()) from page p
$$;
revoke all on function public.geonara_send_message(uuid,text,uuid),public.geonara_message_thread(uuid,bigint,bigint),public.geonara_read_messages(uuid,bigint),public.geonara_message_unread(),public.geonara_message_inbox(integer) from public,anon;
grant execute on function public.geonara_send_message(uuid,text,uuid),public.geonara_message_thread(uuid,bigint,bigint),public.geonara_read_messages(uuid,bigint),public.geonara_message_unread(),public.geonara_message_inbox(integer) to authenticated;
commit;
