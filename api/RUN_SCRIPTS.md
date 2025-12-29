# Database Management Scripts

This document explains how to use the database management scripts.

## Prerequisites

1. Make sure your `.env` file has the correct `MONGO_URI` or `MONGODB_URI` configured
2. Ensure you're in the `api` directory when running scripts

## Scripts

### 1. Delete All Events

This script deletes **ALL** events from the database, including:
- Completed events
- Pending events
- Rejected events
- Upcoming events
- All related bookings

**⚠️ WARNING: This action is irreversible!**

**Usage:**
```bash
cd api
npm run script:delete-events
```

Or directly:
```bash
cd api
node src/scripts/deleteAllEvents.js
```

### 2. Create Test Users

This script creates two test users:
- **Guest User** (role: 1)
- **Host/Organizer User** (role: 2)

**Usage:**
```bash
cd api
npm run script:create-users
```

Or directly:
```bash
cd api
node src/scripts/createTestUsers.js
```

**Note:** If users with the same email already exist, they will be deleted and recreated.

## Test User Credentials

After running the `createTestUsers.js` script, you'll receive login credentials:

### Guest User
- **Email:** `guest@test.com`
- **Password:** `Guest123!`
- **Phone:** `+11234567890`

### Host/Organizer User
- **Email:** `host@test.com`
- **Password:** `Host123!`
- **Phone:** `+19876543210`

## Quick Start

To delete all events and create fresh test users:

```bash
cd api

# Delete all events
npm run script:delete-events

# Create test users
npm run script:create-users
```

