# DayFlow Database Indexes

## Purpose

Indexes are used to improve query performance and maintain data uniqueness.

## Users Collection

| Field | Index Type | Purpose |
|---|---|---|
| `loginId` | Unique | Prevent duplicate login IDs |
| `email` | Unique | Prevent duplicate email addresses |
| `employeeId` | Unique | Prevent duplicate employee references |

## Employees Collection

| Field | Index Type | Purpose |
|---|---|---|
| `employeeId` | Unique | Prevent duplicate employee IDs |
| `userId` | Unique | Maintain one employee profile per user |

## Attendance Collection

| Fields | Index Type | Purpose |
|---|---|---|
| `employeeId + date` | Unique Compound | Prevent duplicate attendance for the same employee and date |

## Leave Balances Collection

| Fields | Index Type | Purpose |
|---|---|---|
| `employeeId + leaveTypeId` | Unique Compound | Maintain one balance per employee and leave type |

## Salary Structures Collection

| Field | Index Type | Purpose |
|---|---|---|
| `employeeId` | Index | Faster employee salary queries |

## Documents Collection

| Field | Index Type | Purpose |
|---|---|---|
| `employeeId` | Index | Faster employee document queries |

## Notifications Collection

| Fields | Index Type | Purpose |
|---|---|---|
| `userId + isRead` | Compound Index | Faster unread notification queries |
