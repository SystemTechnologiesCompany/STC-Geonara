begin;

create table public.geonara_follows(
 follower uuid not null references public.geonara_profiles(id) on delete cascade,
 followed uuid not null references public.geonara_profiles(id) on delete cascade,
 created_at timestamptz not null default now(),
 primary key(follower,followed), check(follower<>followed)
);
create index geonara_follows_target on public.geonara_follows(followed);
alter table public.geonara_follows enable row level security;
grant select,insert,delete on public.geonara_follows to authenticated;
create policy follows_read on public.geonara_follows for select to authenticated using(public.geonara_member());
create policy follows_insert on public.geonara_follows for insert to authenticated with check(public.geonara_member() and follower=auth.uid());
create policy follows_delete on public.geonara_follows for delete to authenticated using(public.geonara_member() and follower=auth.uid());

-- Only an explicitly shared snapshot is visible to other members. Private drafts stay on device.
create table public.geonara_notebooks(
 owner uuid primary key references public.geonara_profiles(id) on delete cascade,
 shared boolean not null default false,
 observations jsonb not null default '[]'::jsonb check(jsonb_typeof(observations)='array' and jsonb_array_length(observations)<=250 and octet_length(observations::text)<=25000000),
 updated_at timestamptz not null default now()
);
alter table public.geonara_notebooks enable row level security;
grant select,insert,update on public.geonara_notebooks to authenticated;
create policy notebook_read on public.geonara_notebooks for select to authenticated using(public.geonara_member() and (owner=auth.uid() or shared));
create policy notebook_insert on public.geonara_notebooks for insert to authenticated with check(public.geonara_member() and owner=auth.uid());
create policy notebook_update on public.geonara_notebooks for update to authenticated using(public.geonara_member() and owner=auth.uid()) with check(public.geonara_member() and owner=auth.uid());

-- Deliberately project public fields; saved research and email are never exposed.
create function public.geonara_member_card(p_id uuid) returns jsonb
language sql stable security definer set search_path='' as $$
 select jsonb_build_object('id',p.id,'profile',jsonb_build_object(
  'name',p.profile->>'name','title',p.profile->>'title','specialization',p.profile->>'specialization',
  'interests',p.profile->>'interests','about',p.profile->>'about','avatarId',p.profile->>'avatarId','photo',p.profile->>'photo'),
  'followers',(select count(*) from public.geonara_follows f where f.followed=p.id),
  'following',(select count(*) from public.geonara_follows f where f.follower=p.id),
  'isFollowing',exists(select 1 from public.geonara_follows f where f.follower=auth.uid() and f.followed=p.id),
  'notebookShared',coalesce((select shared from public.geonara_notebooks n where n.owner=p.id),false))
 from public.geonara_profiles p where p.id=p_id and public.geonara_member()
$$;
create function public.geonara_find_members(p_query text default '',p_relation text default '',p_owner uuid default null,p_offset integer default 0) returns jsonb
language sql stable security definer set search_path='' as $$
 select coalesce(jsonb_agg(jsonb_build_object('id',m.id,'profile',jsonb_build_object('name',m.profile->>'name','title',m.profile->>'title','specialization',m.profile->>'specialization','avatarId',m.profile->>'avatarId'),
 'isFollowing',exists(select 1 from public.geonara_follows f where f.follower=auth.uid() and f.followed=m.id)) order by lower(m.profile->>'name'),m.id),'[]'::jsonb)
 from (select p.id,p.profile from public.geonara_profiles p
 where public.geonara_member() and length(coalesce(p_query,''))<=120
 and (coalesce(p_query,'')='' or strpos(lower(p.profile->>'name'),lower(p_query))>0 or strpos(p.id::text,lower(p_query))=1)
 and (p_relation='' or (p_relation='followers' and exists(select 1 from public.geonara_follows f where f.followed=p_owner and f.follower=p.id))
 or (p_relation='following' and exists(select 1 from public.geonara_follows f where f.follower=p_owner and f.followed=p.id)))
 order by lower(p.profile->>'name'),p.id limit 21 offset greatest(0,least(coalesce(p_offset,0),100000))) m
$$;
revoke all on function public.geonara_member_card(uuid), public.geonara_find_members(text,text,uuid,integer) from public;
grant execute on function public.geonara_member_card(uuid), public.geonara_find_members(text,text,uuid,integer) to authenticated;
commit;
