# Firestore Collection Structure

## 1. Users Collection

| Collection Name | Document ID | Fields                                                                                                          |
| --------------- | ----------- | --------------------------------------------------------------------------------------------------------------- |
| `users`         | `user_id`   | - `username: string` <br> - `email: string` <br> - `profile_image: string (URL)` <br> - `created_at: timestamp` |

---

## 2. Chats Collection

| Collection Name | Document ID | Fields                                                                                                                                                                              |
| --------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `chats`         | `chat_id`   | - `chat_type: string ('1v1' or 'group')` <br> - `chat_name: string (for group chats only)` <br> - `created_by: user_id` <br> - `created_at: timestamp` <br> - `participants: array` |

### Participants Array:

| Field       | Description                       |
| ----------- | --------------------------------- |
| `user_id`   | ID of the participant             |
| `joined_at` | Timestamp of when the user joined |

---

## 3. Messages Sub-collection

| Collection Name            | Document ID  | Fields                                                                                                                                                                                                            |
| -------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `chats/{chat_id}/messages` | `message_id` | - `sender_id: string` <br> - `content: string` <br> - `message_type: string ('text', 'image', 'file')` <br> - `sent_at: timestamp` <br> - `status: object (per user)` <br> - `reactions: object (user reactions)` |

### Status Object:

| Field     | Description                                        |
| --------- | -------------------------------------------------- |
| `user_id` | ID of the participant                              |
| `status`  | Message status (`'sent'`, `'delivered'`, `'read'`) |

### Reactions Object:

| Field        | Description                            |
| ------------ | -------------------------------------- |
| `user_id`    | ID of the user reacting to the message |
| `emoji_code` | Reaction emoji (e.g., 👍, ❤️, 😂)      |

---

## 4. User Status Collection (Optional for typing/online indicators)

| Collection Name | Document ID | Fields                                                                                 |
| --------------- | ----------- | -------------------------------------------------------------------------------------- |
| `user_status`   | `user_id`   | - `online: boolean` <br> - `typing_in_chat_id: string` <br> - `last_active: timestamp` |
