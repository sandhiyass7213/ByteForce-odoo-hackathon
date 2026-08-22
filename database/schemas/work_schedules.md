# Work Schedules Collection

## Purpose

The `work_schedules` collection stores employee working days, working hours and overtime settings.

## Fields

| Field | Data Type | Required | Description |
|---|---|---|---|
| employeeId | ObjectId | Yes | Reference to the employee |
| workingDays | Array | Yes | List of working days |
| startTime | String | Yes | Work start time |
| endTime | String | Yes | Work end time |
| breakTime | Number | Yes | Break duration in minutes |
| minimumHours | Number | Yes | Minimum required working hours |
| overtimeEnabled | Boolean | Yes | Indicates whether overtime is enabled |

## Validation Rules

- `employeeId` is required.
- `workingDays` is required.
- `workingDays` must contain valid day values.
- `startTime` is required.
- `endTime` is required.
- `breakTime` must be a non-negative number.
- `minimumHours` must be a positive number.
- `overtimeEnabled` must be Boolean.

## Working Day Values

- MON
- TUE
- WED
- THU
- FRI
- SAT
- SUN
