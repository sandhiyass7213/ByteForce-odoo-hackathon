# Leave Requests Collection

## Purpose

The `leave_requests` collection stores employee leave applications and the approval workflow.

## Fields

| Field | Data Type | Required | Description |
|---|---|---:|---|
| `employeeId` | ObjectId | Yes | Reference to employee |
| `leaveTypeId` | ObjectId | Yes | Reference to leave type |
| `startDate` | Date | Yes | Leave start date |
| `endDate` | Date | Yes | Leave end date |
| `numberOfDays` | Number | Yes | Number of leave days |
| `reason` | String | Yes | Reason for leave |
| `attachmentUrl` | String | No | Supporting document URL |
| `status` | String | Yes | Leave request status |
| `reviewedBy` | ObjectId | No | Admin/HR reviewer |
| `reviewedAt` | Date | No | Review date |
| `adminComment` | String | No | Admin/HR comment |
| `createdAt` | Date | Yes | Request creation date |

## Allowed Status

- `PENDING`
- `APPROVED`
- `REJECTED`
- `CANCELLED`

## Validation

- Start date cannot be after end date.
- Number of days must be greater than zero.
- Leave status must contain an allowed value.
- Employee ID and leave type ID are required.
- Approved or rejected requests should contain the appropriate review information.
