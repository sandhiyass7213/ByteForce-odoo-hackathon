# Attendance Collection

## Purpose

The `attendance` collection stores daily employee attendance records including check-in, check-out and working hours.

## Fields

| Field | Data Type | Required | Description |
|---|---|---|---|
| employeeId | ObjectId | Yes | Reference to the employee |
| date | Date | Yes | Attendance date |
| checkIn | Date | No | Employee check-in time |
| checkOut | Date | No | Employee check-out time |
| workHours | Number | No | Total working hours |
| extraHours | Number | No | Extra working hours |
| status | String | Yes | Attendance status |
| createdAt | Date | Yes | Record creation date |

## Allowed Status Values

- PRESENT
- ABSENT
- HALF_DAY
- LEAVE

## Validation Rules

- `employeeId` is required.
- `date` is required.
- `status` is required.
- `status` must be one of the allowed values.
- `workHours` cannot be negative.
- `extraHours` cannot be negative.
- `checkOut` should not be earlier than `checkIn`.

## Attendance Rules

An employee can have only one attendance record for a particular date.
