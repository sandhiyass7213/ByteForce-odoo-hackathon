# Salary Structures Collection

## Purpose

The `salary_structures` collection stores employee salary configuration and salary components.

## Fields

| Field | Data Type | Required | Description |
|---|---|---:|---|
| `employeeId` | ObjectId | Yes | Reference to employee |
| `wageType` | String | Yes | Salary/wage type |
| `monthlyWage` | Number | Yes | Monthly wage |
| `yearlyWage` | Number | Yes | Yearly wage |
| `workingDaysPerWeek` | Number | Yes | Working days per week |
| `breakTime` | Number | Yes | Break time |
| `effectiveFrom` | Date | Yes | Salary effective date |
| `effectiveTo` | Date | No | Salary end date |
| `components` | Array | Yes | Salary components |

## Salary Components

- Basic Salary
- House Rent Allowance
- Standard Allowance
- Performance Bonus
- Leave Travel Allowance
- Fixed Allowance
- Provident Fund
- Professional Tax

## Validation

- Monthly wage cannot be negative.
- Yearly wage cannot be negative.
- Working days per week must be within the allowed range.
- Salary component values must be valid.
- Salary components must not exceed the defined wage according to the configured salary rules.
