# Leave Types Collection

## Purpose

The `leave_types` collection stores the different types of leave available to employees.

## Fields

| Field | Data Type | Required | Description |
|---|---|---:|---|
| `name` | String | Yes | Leave type name |
| `description` | String | No | Leave description |
| `defaultAllocation` | Number | Yes | Default allocated leave |
| `requiresAttachment` | Boolean | Yes | Indicates whether an attachment is required |
| `isActive` | Boolean | Yes | Indicates whether the leave type is active |

## Leave Types

- Paid Time Off
- Sick Time Off
- Unpaid Leave

## Validation

- Leave type name is required.
- Leave type name should be unique.
- Default allocation cannot be negative.
- Attachment requirement must be Boolean.
