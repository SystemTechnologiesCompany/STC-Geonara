# Members and following

Community → Find people searches member names or permanent, unique user IDs in the form `STC-XXXXXX` (six uppercase letters or digits). Search supports prefixes of IDs, literal name substrings, pagination, and follower/following filters. Authors of posts and comments link to `#member?id=STC-XXXXXX`.

Member pages show display name, avatar/photo, professional title, specialization, bio, research interests and follow counts. They do not expose email, saved research or account tokens. Following is idempotent, owned by the authenticated follower and protected against self-following and forged owners.

The owner-requested counter base is configured in `supabase/migrations/202611110001_founder_follower_base.sql`: only `STC-DIMMMB` displays 23,000 plus its actual inbound follow relationships. Other members start at zero. Real follows/unfollows increment/decrement that total; the follower list contains actual accounts only. The base is computed once when reading the count, so reapplying the function replacement does not accumulate another 23,000. No accounts or follow relationships are fabricated. Counts use the selected language's number formatting.

My profile → View profile opens the member-facing page. My profile → Manage notebook sharing opens notebook privacy controls.

## Notebook privacy

Draft notebooks are separated by authenticated account in IndexedDB. Earlier unscoped browser notes are preserved and can be imported using **Import earlier notebook**; they are never shared automatically.

Notebooks are private by default. **Share notebook** publishes the current non-deleted observations, including photos, written locations and notes. Latitude and longitude fields are omitted. Later edits remain local until the owner selects **Update shared notebook**. **Make private** immediately revokes other members' database access and clears the cloud snapshot; it leaves local drafts intact. Sharing supports 250 observations and a 25 MB request limit. Other members see only shared snapshots. Content already read or copied by a member cannot be recalled.

## Installation and checks

Apply `supabase/migrations/202611100002_members.sql` and then `supabase/migrations/202611100003_short_member_ids.sql` after the base migration, then restart the Node server. Existing accounts and posts are retained. Short IDs are assigned to existing and new accounts, are immutable, and have a database unique constraint. A bounded sequence permuted into the six-character base-36 space avoids truncation collisions. Legacy UUID profile links still resolve and are replaced with the short ID in the address bar. All member and notebook endpoints require a verified Google account. Supabase row-level policies enforce ownership and privacy independently of the website UI. Public profile functions project a fixed set of fields instead of opening the private profiles table.

Run `npm run check`. The PostgreSQL tests verify follower ownership, duplicate/self-follow prevention, private notebook isolation, shared-read access and revocation, profile field projection, search and provider restrictions. Member API and template checks cover pagination, forged ownership, coordinate removal, unsafe images, escaping and EN/FR/AR text.
