# Notifications Collection

## Purpose

The `notifications` collection stores system notifications for employees, HR and administrators.

## Fields

| Field | Data Type | Required | Description |
|---|---|---:|---|
| `userId` | ObjectId | Yes | Reference to user |
| `title` | String | Yes | Notification title |
| `message` | String | Yes | Notification message |
| `type` | String | Yes | Notification type |
| `referenceId` | ObjectId | No | Related record ID |
| `isRead` | Boolean | Yes | Indicates whether notification is read |
| `createdAt` | Date | Yes | Notification creation date |

## Validation

- User ID is required.
- Title and message are required.
- Notification type is required.
- Read status must be Boolean.
- Created date must be valid.
