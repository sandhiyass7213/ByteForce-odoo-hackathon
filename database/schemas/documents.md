# Documents Collection

## Purpose

The `documents` collection stores metadata and file references for employee documents.

## Fields

| Field | Data Type | Required | Description |
|---|---|---:|---|
| `employeeId` | ObjectId | Yes | Reference to employee |
| `documentType` | String | Yes | Type of document |
| `documentName` | String | Yes | Document name |
| `fileUrl` | String | Yes | Stored document URL |
| `uploadedAt` | Date | Yes | Upload date |
| `uploadedBy` | ObjectId | Yes | User who uploaded the document |

## Validation

- Employee ID is required.
- Document type is required.
- Document name is required.
- File URL must be provided.
- Uploaded date must be valid.
