# Private direct messages

Any signed-in member can open another member's profile and choose **Message**. The navigation message icon opens the inbox. `#messages?to=STC-XXXXXX` links directly to a conversation; message headers link back to the member's profile. No follow relationship is required.

Messages are stored in Supabase, not browser-only sample threads. The UI supports plain text up to 4,000 characters, chronological history, older-message pagination, more conversations, stable retries, draft preservation while navigating, and Sent/Seen status. Enter sends; Shift+Enter inserts a newline. On mobile, the inbox and conversation occupy separate views with a back control.

The active inbox/conversation polls about every three seconds while visible; the navigation unread count polls every eight seconds. Read state advances when the conversation is visible, focused and scrolled near the latest messages. Drafts and pending send identifiers stay in memory and clear when accounts change. A failed request retains the same send identifier so retrying does not duplicate an already-delivered message.

## Installation

Apply `supabase/migrations/202611110002_direct_messages.sql` after the member/short-ID migrations, then restart the Node server. It adds the message table and private RPCs without modifying existing profiles, followers, posts or research. Netlify builds include the messaging assets automatically.

## Privacy and limits

Only sender and recipient may read their messages. Research admins do not gain access to unrelated conversations. The server derives the sender from the verified Google session; a client cannot choose another sender, mark another recipient's messages read, or write directly to the message table. Message IDs use string cursors; text is escaped before rendering. Sending is capped at 30 new messages per minute per account in the database, including across server instances. Idempotent retries do not create a new row.

This implementation is private one-to-one text chat. It does not claim end-to-end encryption, online presence, group chats, attachments or operating-system push notifications. Supabase/database administrators retain their ordinary infrastructure-level access.

## Verification

`npm run check` includes actual PostgreSQL tests with independent sender, recipient, unrelated member, non-Google and anonymous roles. These verify delivery, ownership, sender spoof prevention, privacy, read receipts, pagination, idempotency and throttling. API and frontend checks cover profile routing, signed-out denial, cursor/length validation, large-ID merging, HTML escaping and EN/FR/AR text. No test messages are sent to real members' production accounts.
