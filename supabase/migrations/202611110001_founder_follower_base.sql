-- STC-DIMMMB starts from 23,000; real follow relationships remain unchanged.
-- Re-running this function replacement does not add the base a second time.
begin;
create or replace function public.geonara_member_card(p_id uuid) returns jsonb
language sql stable security definer set search_path='' as $$
 select jsonb_build_object('id',p.id,'publicId',p.public_id,'profile',jsonb_build_object(
  'name',p.profile->>'name','title',p.profile->>'title','specialization',p.profile->>'specialization',
  'interests',p.profile->>'interests','about',p.profile->>'about','avatarId',p.profile->>'avatarId','photo',p.profile->>'photo'),
  'followers',(case when p.public_id='STC-DIMMMB' then 23000 else 0 end)+(select count(*) from public.geonara_follows f where f.followed=p.id),
  'following',(select count(*) from public.geonara_follows f where f.follower=p.id),
  'isFollowing',exists(select 1 from public.geonara_follows f where f.follower=auth.uid() and f.followed=p.id),
  'notebookShared',coalesce((select shared from public.geonara_notebooks n where n.owner=p.id),false))
 from public.geonara_profiles p where p.id=p_id and public.geonara_member()
$$;
commit;
