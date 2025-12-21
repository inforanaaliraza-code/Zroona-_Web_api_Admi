# Environment Variables Setup Guide

## Quick Setup

1. Copy the example file to create your `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Update the values in `.env` with your actual credentials.

## Required Environment Variables

### Daftra API Configuration
```env
DAFTRA_SUBDOMAIN=tdb
DAFTRA_API_KEY=a287194bdf648c16341ecb843cea1fbae7392962
```

### Moyasar Payment Gateway
```env
MOYASAR_SECRET_KEY=Sk_test_@sG6LYsSoX4hixpSwCZEiaac1TSLtKXMy91Yen6B
MOYASAR_SIGNATURE_SECRET=your_webhook_secret_here
```

### Other Required Variables
```env
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key
PORT=3000
NODE_ENV=development
```

## Notes

- `.env` file is already in `.gitignore` - it won't be committed to git
- Never commit actual credentials to version control
- For production, set these in your hosting platform's environment variables

