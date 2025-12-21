# Environment Variables Setup Guide

## Quick Setup

1. Create a `.env.local` file in the `web` directory:
   ```bash
   touch .env.local
   ```

2. Add the following content:
   ```env
   NEXT_PUBLIC_MOYASAR_KEY=pk_test_GUUdMyrNufV9xb59FBSAYi9jniyhvVDa9U2524pV
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

## Required Environment Variables

### Moyasar Payment Gateway
```env
NEXT_PUBLIC_MOYASAR_KEY=pk_test_GUUdMyrNufV9xb59FBSAYi9jniyhvVDa9U2524pV
```

### API Configuration
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Notes

- `.env.local` file is now in `.gitignore` - it won't be committed to git
- `NEXT_PUBLIC_*` variables are exposed to the browser
- Never commit actual credentials to version control
- For production, set these in your hosting platform's environment variables

