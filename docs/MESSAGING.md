# Incoming messages and unread counts

The Messages icon shows the unread total, capped visually at `99+`. Conversation rows show their own unread counts. Opening a conversation marks its messages as read. Outgoing messages do not increase unread counts. Duplicate incoming IDs are ignored, and read status is saved with the conversation data.

This change adds frontend receipt and unread handling. It does not establish a server connection or deliver messages between people.

Connect an authenticated messaging transport to either of these entry points:

```js
window.STCGeonara.receiveMessage({
  id: 'server-message-id',
  contactId: 'colleague',
  text: 'A new message'
});

window.dispatchEvent(new CustomEvent('stc:message-received', {
  detail: { id: 'another-server-id', contactId: 'mentor', text: 'Another message' }
}));
```

The current contact IDs are `mentor`, `colleague`, and `student`. Unknown contacts, empty or oversized messages, invalid IDs, and messages marked `from: 'me'` are rejected. Register real contacts in the contact list before forwarding their messages.

Messages in the active foreground conversation are read immediately. New messages in other conversations display the red badge. Tabs on the same origin also synchronize updates through the browser storage event.

Run `npm run check` to validate unread counting, duplicate suppression, read transitions, persistence, and incoming payload validation.
