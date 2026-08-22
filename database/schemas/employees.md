# Employees Collection

## Purpose

The `employees` collection stores employee personal, contact and job-related information.

## Fields

| Field | Data Type | Required | Unique | Description |
|---|---|---|---|---|
| userId | ObjectId | Yes | Yes | Reference to the users collection |
| employeeId | String | Yes | Yes | Unique employee identifier |
| firstName | String | Yes | No | Employee first name |
| lastName | String | Yes | No | Employee last name |
| dateOfBirth | Date | No | No | Employee date of birth |
| gender | String | No | No | Employee gender |
| nationality | String | No | No | Employee nationality |
| maritalStatus | String | No | No | Employee marital status |
| personalEmail | String | No | No | Personal email address |
| mobile | String | Yes | No | Employee mobile number |
| address | String | No | No | Residential address |
| department | String | Yes | No | Employee department |
| jobPosition | String | Yes | No | Employee job position |
| manager | String | No | No | Employee manager |
| location | String | No | No | Work location |
| dateOfJoining | Date | Yes | No | Employee joining date |
| profilePicture | String | No | No | Profile picture URL |
| about | String | No | No | Employee description |
| skills | Array | No | No | Employee skills |
| certifications | Array | No | No | Employee certifications |

## Validation Rules

- `userId` is required.
- `employeeId` is required and must be unique.
- `firstName` is required.
- `lastName` is required.
- `mobile` is required.
- `department` is required.
- `jobPosition` is required.
- `dateOfJoining` is required.
- Email fields must contain valid email addresses when provided.
