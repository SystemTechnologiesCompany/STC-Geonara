-- Apply to a new STC Geonara Supabase project through its SQL Editor.
begin;
create table if not exists public.geonara_admins(email text primary key check(email=lower(email)));
alter table public.geonara_admins enable row level security;
revoke all on public.geonara_admins from anon, authenticated;
create or replace function public.geonara_member() returns boolean language sql stable set search_path='' as $$
 select auth.uid() is not null and auth.jwt()->'app_metadata'->>'provider'='google'
$$;
create or replace function public.geonara_admin() returns boolean language sql stable security definer set search_path='' as $$
 select public.geonara_member() and exists(select 1 from public.geonara_admins where email=lower(auth.jwt()->>'email'))
$$;
revoke all on function public.geonara_member(),public.geonara_admin() from public;
grant execute on function public.geonara_member(),public.geonara_admin() to authenticated;

create table if not exists public.geonara_profiles(
 id uuid primary key references auth.users(id) on delete cascade,
 profile jsonb not null check(jsonb_typeof(profile)='object' and length(profile->>'name') between 1 and 120),
 saved text[] not null default '{}' check(cardinality(saved)<=5000), created_at timestamptz not null default now()
);
create table if not exists public.geonara_posts(
 id uuid primary key default gen_random_uuid(), owner uuid not null references auth.users(id),
 title text not null check(length(title)<=160), has_title boolean not null default true,
 text text not null default '' check(length(text)<=6000), type text not null default 'Post' check(type in ('Post','Question','Discovery')),
 author text not null check(length(author)<=120), avatar_id text not null check(avatar_id ~ '^avatar-(0[1-9]|1[0-6])$'),
 created_at timestamptz not null default now()
);
create table if not exists public.geonara_comments(
 id uuid primary key default gen_random_uuid(), post_id uuid not null references public.geonara_posts(id) on delete cascade,
 owner uuid not null references auth.users(id), text text not null check(length(btrim(text)) between 1 and 6000),
 author text not null check(length(author)<=120), avatar_id text not null check(avatar_id ~ '^avatar-(0[1-9]|1[0-6])$'), created_at timestamptz not null default now()
);
create table if not exists public.geonara_likes(
 post_id uuid not null references public.geonara_posts(id) on delete cascade, owner uuid not null references auth.users(id),
 primary key(post_id,owner)
);
create table if not exists public.geonara_media(
 id uuid primary key default gen_random_uuid(), owner uuid not null references auth.users(id),
 post_id uuid references public.geonara_posts(id) on delete cascade,
 path text not null unique, kind text not null check(kind in ('image','video')), mime text not null,
 name text not null check(length(name)<=180), size bigint not null check(size>0 and size<=26214400),
 created_at timestamptz not null default now(),
 check(path=owner::text||'/'||id::text),
 check((kind='image' and mime in ('image/jpeg','image/png','image/webp') and size<=10485760) or (kind='video' and mime in ('video/mp4','video/webm')))
);
create table if not exists public.geonara_research(
 id uuid primary key default gen_random_uuid(), owner uuid not null references auth.users(id),
 title text not null check(length(btrim(title)) between 1 and 200), authors text not null check(length(btrim(authors)) between 1 and 300),
 abstract text not null check(length(btrim(abstract)) between 1 and 8000), topic text not null,
 year integer not null check(year between 1800 and 2200), url text not null default '' check(url='' or (length(url)<=2000 and url ~ '^https://')),
 status text not null default 'pending' check(status in ('pending','approved','rejected')),
 pdf_path text unique, pdf_name text, pdf_size bigint check(pdf_size between 1 and 10485760),
 review_note text not null default '' check(length(review_note)<=1000), submitted_at timestamptz not null default now(), reviewed_at timestamptz, published_at timestamptz,
 check(url<>'' or pdf_path is not null),check(pdf_path is null or pdf_path=owner::text||'/'||id::text),
 check(topic in ('Agriculture and Forestry','Atmospheric Science','Climate Science','Cryosphere','Earth Sciences','Ecology','Energy Resources','Environmental Chemistry','Environmental Science','Geochemistry','Geology','Geomorphology','Geophysics','Hydrology','Mineralogy','Natural Hazards','Natural Resources','Oceanography','Palaeontology','Petroleum Geology','Petrology','Planetary Science','Remote Sensing and GIS','Sedimentology','Soil Science','Space and Solar Physics','Stratigraphy','Structural Geology'))
);
create index if not exists geonara_posts_date on public.geonara_posts(created_at desc);
create index if not exists geonara_comments_post on public.geonara_comments(post_id,created_at);
create index if not exists geonara_media_post on public.geonara_media(post_id);
create index if not exists geonara_research_owner on public.geonara_research(owner,status);

alter table public.geonara_profiles enable row level security;
alter table public.geonara_posts enable row level security;
alter table public.geonara_comments enable row level security;
alter table public.geonara_likes enable row level security;
alter table public.geonara_media enable row level security;
alter table public.geonara_research enable row level security;
create policy profile_read on public.geonara_profiles for select to authenticated using(public.geonara_member() and id=auth.uid());
create policy profile_insert on public.geonara_profiles for insert to authenticated with check(public.geonara_member() and id=auth.uid());
create policy profile_update on public.geonara_profiles for update to authenticated using(public.geonara_member() and id=auth.uid()) with check(id=auth.uid());
create policy post_read on public.geonara_posts for select to authenticated using(public.geonara_member());
create policy post_delete on public.geonara_posts for delete to authenticated using(public.geonara_member() and owner=auth.uid());
create policy comment_read on public.geonara_comments for select to authenticated using(public.geonara_member());
create policy comment_insert on public.geonara_comments for insert to authenticated with check(public.geonara_member() and owner=auth.uid());
create policy like_read on public.geonara_likes for select to authenticated using(public.geonara_member());
create policy like_insert on public.geonara_likes for insert to authenticated with check(public.geonara_member() and owner=auth.uid());
create policy like_delete on public.geonara_likes for delete to authenticated using(public.geonara_member() and owner=auth.uid());
create policy media_read on public.geonara_media for select to authenticated using(public.geonara_member() and (owner=auth.uid() or post_id is not null));
create policy media_insert on public.geonara_media for insert to authenticated with check(public.geonara_member() and owner=auth.uid() and post_id is null);
create policy media_delete on public.geonara_media for delete to authenticated using(public.geonara_member() and owner=auth.uid() and post_id is null);
create policy research_read on public.geonara_research for select to authenticated using(public.geonara_member() and (status='approved' or owner=auth.uid() or public.geonara_admin()));
create policy research_insert on public.geonara_research for insert to authenticated with check(public.geonara_member() and owner=auth.uid() and status='pending' and review_note='' and reviewed_at is null and published_at is null);
revoke all on public.geonara_profiles,public.geonara_posts,public.geonara_comments,public.geonara_likes,public.geonara_media,public.geonara_research from anon,authenticated;
grant select,insert,update on public.geonara_profiles to authenticated;
grant select,delete on public.geonara_posts to authenticated;
grant select,insert on public.geonara_comments to authenticated;
grant select,insert,delete on public.geonara_likes to authenticated;
grant select,insert,delete on public.geonara_media to authenticated;
grant select,insert on public.geonara_research to authenticated;

-- Attachment ownership and post creation are committed in one database transaction.
create or replace function public.geonara_publish(p_id uuid,p_title text,p_text text,p_type text,p_media uuid[]) returns uuid
language plpgsql security definer set search_path='' as $$
declare n integer; videos integer; who jsonb; ids uuid[]:=coalesce(p_media,'{}');
begin
 if not public.geonara_member() then raise exception 'Sign in with Google to continue.'; end if;
 if cardinality(ids)>4 or cardinality(ids)<>(select count(distinct i) from unnest(ids) i) then raise exception 'Invalid attachments.'; end if;
 if length(btrim(p_text))=0 and cardinality(ids)=0 then raise exception 'Write a post or add media.'; end if;
 perform 1 from public.geonara_media where id=any(ids) for update;
 select count(*),count(*) filter(where kind='video') into n,videos from public.geonara_media where id=any(ids) and owner=auth.uid() and post_id is null;
 if n<>cardinality(ids) or (videos>0 and n<>1) then raise exception 'Invalid attachments.'; end if;
 select profile into who from public.geonara_profiles where id=auth.uid();
 if who is null then raise exception 'Profile is required.'; end if;
 insert into public.geonara_posts(id,owner,title,has_title,text,type,author,avatar_id)
 values(p_id,auth.uid(),coalesce(nullif(btrim(p_title),''),nullif(left(btrim(p_text),100),''),'Field media'),length(btrim(p_title))>0,p_text,p_type,who->>'name',who->>'avatarId');
 update public.geonara_media set post_id=p_id where id=any(ids);
 return p_id;
end $$;
create or replace function public.geonara_review(p_id uuid,p_status text,p_note text) returns void
language plpgsql security definer set search_path='' as $$
begin
 if not public.geonara_admin() then raise exception 'Admin access is required.'; end if;
 if p_status not in ('approved','rejected') or length(p_note)>1000 then raise exception 'Invalid review.'; end if;
 perform 1 from public.geonara_research where id=p_id and status='pending' for update;
 if not found then raise exception 'Submission has already been reviewed or does not exist.'; end if;
 update public.geonara_research set status=p_status,review_note=p_note,reviewed_at=now(),published_at=case when p_status='approved' then now() else null end where id=p_id;
end $$;
revoke all on function public.geonara_publish(uuid,text,text,text,uuid[]),public.geonara_review(uuid,text,text) from public;
grant execute on function public.geonara_publish(uuid,text,text,text,uuid[]),public.geonara_review(uuid,text,text) to authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values
 ('geonara-community','geonara-community',false,26214400,array['image/jpeg','image/png','image/webp','video/mp4','video/webm']),
 ('geonara-research','geonara-research',false,10485760,array['application/pdf'])
on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
create or replace function public.geonara_read_object(bucket text,object_path text) returns boolean
language sql stable security definer set search_path='' as $$
 select public.geonara_member() and (
 (bucket='geonara-community' and (split_part(object_path,'/',1)=auth.uid()::text or exists(select 1 from public.geonara_media m where m.path=object_path and m.post_id is not null))) or
 (bucket='geonara-research' and (split_part(object_path,'/',1)=auth.uid()::text or exists(select 1 from public.geonara_research r where r.pdf_path=object_path and (r.status='approved' or public.geonara_admin()))))
 )
$$;
revoke all on function public.geonara_read_object(text,text) from public;
grant execute on function public.geonara_read_object(text,text) to authenticated;
create policy geonara_file_read on storage.objects for select to authenticated using(public.geonara_read_object(bucket_id,name));
create policy geonara_file_insert on storage.objects for insert to authenticated with check(public.geonara_member() and bucket_id in ('geonara-community','geonara-research') and (storage.foldername(name))[1]=auth.uid()::text);
create policy geonara_file_delete on storage.objects for delete to authenticated using(public.geonara_member() and bucket_id in ('geonara-community','geonara-research') and (storage.foldername(name))[1]=auth.uid()::text);
commit;
