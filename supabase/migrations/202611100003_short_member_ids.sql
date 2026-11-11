begin;
create sequence public.geonara_member_number minvalue 0 maxvalue 2176782335 start 0 no cycle;
alter table public.geonara_profiles add column public_id text;
create function public.geonara_next_member_id() returns text language plpgsql security definer set search_path='' as $$
declare n bigint; result text := ''; alphabet constant text := '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
begin
 n := (nextval('public.geonara_member_number') * 15485863 + 817349123) % 2176782336;
 for i in 1..6 loop result := substr(alphabet,(n%36)::integer+1,1)||result; n:=n/36; end loop;
 return 'STC-'||result;
end $$;
revoke all on function public.geonara_next_member_id() from public,anon,authenticated;
revoke all on sequence public.geonara_member_number from public,anon,authenticated;
update public.geonara_profiles set public_id=public.geonara_next_member_id();
alter table public.geonara_profiles alter column public_id set not null;
alter table public.geonara_profiles add constraint geonara_profiles_public_id_key unique(public_id);
alter table public.geonara_profiles add constraint geonara_profiles_public_id_format check(public_id ~ '^STC-[0-9A-Z]{6}$');
create function public.geonara_assign_member_id() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if TG_OP='INSERT' then NEW.public_id:=public.geonara_next_member_id();
 elsif NEW.public_id is distinct from OLD.public_id then raise exception 'User ID cannot be changed.'; end if;
 return NEW;
end $$;
revoke all on function public.geonara_assign_member_id() from public,anon,authenticated;
create trigger geonara_profile_id before insert or update on public.geonara_profiles for each row execute function public.geonara_assign_member_id();
create or replace function public.geonara_member_card(p_id uuid) returns jsonb
language sql stable security definer set search_path='' as $$
 select jsonb_build_object('id',p.id,'publicId',p.public_id,'profile',jsonb_build_object(
  'name',p.profile->>'name','title',p.profile->>'title','specialization',p.profile->>'specialization',
  'interests',p.profile->>'interests','about',p.profile->>'about','avatarId',p.profile->>'avatarId','photo',p.profile->>'photo'),
  'followers',(select count(*) from public.geonara_follows f where f.followed=p.id),
  'following',(select count(*) from public.geonara_follows f where f.follower=p.id),
  'isFollowing',exists(select 1 from public.geonara_follows f where f.follower=auth.uid() and f.followed=p.id),
  'notebookShared',coalesce((select shared from public.geonara_notebooks n where n.owner=p.id),false))
 from public.geonara_profiles p where p.id=p_id and public.geonara_member()
$$;
create or replace function public.geonara_find_members(p_query text default '',p_relation text default '',p_owner uuid default null,p_offset integer default 0) returns jsonb
language sql stable security definer set search_path='' as $$
 select coalesce(jsonb_agg(jsonb_build_object('id',m.id,'publicId',m.public_id,'profile',jsonb_build_object('name',m.profile->>'name','title',m.profile->>'title','specialization',m.profile->>'specialization','avatarId',m.profile->>'avatarId'),
 'isFollowing',exists(select 1 from public.geonara_follows f where f.follower=auth.uid() and f.followed=m.id)) order by lower(m.profile->>'name'),m.id),'[]'::jsonb)
 from (select p.id,p.profile,p.public_id from public.geonara_profiles p
 where public.geonara_member() and length(coalesce(p_query,''))<=120
 and (coalesce(p_query,'')='' or strpos(lower(p.profile->>'name'),lower(p_query))>0 or strpos(lower(p.public_id),lower(p_query))=1)
 and (p_relation='' or (p_relation='followers' and exists(select 1 from public.geonara_follows f where f.followed=p_owner and f.follower=p.id))
 or (p_relation='following' and exists(select 1 from public.geonara_follows f where f.follower=p_owner and f.followed=p.id)))
 order by lower(p.profile->>'name'),p.id limit 21 offset greatest(0,least(coalesce(p_offset,0),100000))) m
$$;

create function public.geonara_resolve_member(p_public_id text) returns uuid language sql stable security definer set search_path='' as $$
 select id from public.geonara_profiles where public_id=upper(p_public_id) and public.geonara_member()
$$;
create function public.geonara_public_ids(p_ids uuid[]) returns jsonb language sql stable security definer set search_path='' as $$
 select coalesce(jsonb_object_agg(id::text,public_id),'{}'::jsonb) from public.geonara_profiles
 where public.geonara_member() and cardinality(p_ids)<=2000 and id=any(p_ids)
$$;
revoke all on function public.geonara_resolve_member(text),public.geonara_public_ids(uuid[]) from public,anon;
grant execute on function public.geonara_resolve_member(text),public.geonara_public_ids(uuid[]) to authenticated;
commit;
