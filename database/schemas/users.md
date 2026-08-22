# Users Collection

## Purpose

The `users` collection stores authentication, login and role information for DayFlow users.

## Fields

| Field | Data Type | Required | Unique | Description |
|---|---|---|---|---|
| employeeId | ObjectId | Yes | Yes | Reference to the employee |
| loginId | String | Yes | Yes | System-generated login ID |
| email | String | Yes | Yes | User email address |
| passwordHash | String | Yes | No | Hashed user password |
| role | String | Yes | No | User role |
| firstLogin | Boolean | Yes | No | Indicates whether the user is logging in for the first time |
| isActive | Boolean | Yes | No | Indicates whether the account is active |
| isVerified | Boolean | Yes | No | Indicates whether the email is verified |
| createdAt | Date | Yes | No | Account creation date |
| updatedAt | Date | Yes | No | Last update date |

## Allowed Roles

- ADMIN
- HR
- EMPLOYEE

## Validation Rules

- `employeeId` is required.
- `loginId` is required and must be unique.
- `email` is required and must be unique.
- `passwordHash` is required.
- `role` is required.
- `role` must be one of the allowed roles.
- `firstLogin` must be a Boolean value.
- `isActive` must be a Boolean value.
- `isVerified` must be a Boolean value.

## Security

The actual password must never be stored in plain text.

The backend must hash the password before storing it in the database.
