# Leave Balances Collection

## Purpose

The `leave_balances` collection stores the leave allocation and current balance of each employee.

## Fields

| Field | Data Type | Required | Description |
|---|---|---:|---|
| `employeeId` | ObjectId | Yes | Reference to employee |
| `leaveTypeId` | ObjectId | Yes | Reference to leave type |
| `totalAllocated` | Number | Yes | Total allocated leave |
| `used` | Number | Yes | Leave already used |
| `pending` | Number | Yes | Leave currently pending |
| `remaining` | Number | Yes | Remaining leave balance |

## Validation

- Employee ID is required.
- Leave type ID is required.
- Leave values cannot be negative.
- Remaining balance must be calculated correctly.
- Employee and leave type combination should be unique.
