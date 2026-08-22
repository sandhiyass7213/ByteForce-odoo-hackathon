# DayFlow Database

## Overview

The DayFlow database is designed to support the core functionality of the DayFlow Human Resource Management System (HRMS).

The database stores employee information, authentication details, work schedules, attendance, leave management, salary structures, documents, and notifications.

## Database Technology

- Database: MongoDB
- Database Hosting: MongoDB Atlas

## Collections

The DayFlow database contains the following collections:

1. users
2. employees
3. work_schedules
4. attendance
5. leave_types
6. leave_balances
7. leave_requests
8. salary_structures
9. documents
10. notifications

## Collection Responsibilities

| Collection | Purpose |
|---|---|
| users | Authentication, login and role information |
| employees | Employee personal and job information |
| work_schedules | Employee working days and working hours |
| attendance | Daily check-in, check-out and attendance records |
| leave_types | Available leave types |
| leave_balances | Employee leave allocation and remaining balance |
| leave_requests | Employee leave applications and approval status |
| salary_structures | Employee salary and salary components |
| documents | Employee document information |
| notifications | System notifications and alerts |

## Database Relationships

The main relationship structure is:

users
    |
    | userId
    v
employees
    |
    +----> attendance
    |
    +----> work_schedules
    |
    +----> leave_balances
    |
    +----> leave_requests
    |
    +----> salary_structures
    |
    +----> documents

users
    |
    +----> notifications

leave_types
    |
    +----> leave_balances
    |
    +----> leave_requests

## Validation

MongoDB schema validation is configured for the required collections to maintain data consistency and prevent invalid data.

Validation includes:

- Required fields
- Data types
- Allowed values
- Email format validation
- Numeric value validation
- Date validation
- Unique field constraints where required

## Security

Sensitive information such as passwords and secret keys must not be stored in GitHub.

Passwords are stored as hashed values by the backend application.

MongoDB connection credentials are stored using environment variables.

## Indexing

Indexes are used to improve query performance and maintain uniqueness for important fields.

Refer to [indexes.md](indexes.md) for the database indexes.

## Database Responsibility

The database layer is responsible for:

- Storing application data
- Maintaining data consistency
- Enforcing database validation
- Maintaining unique constraints
- Supporting efficient data retrieval
- Supporting relationships between application entities
