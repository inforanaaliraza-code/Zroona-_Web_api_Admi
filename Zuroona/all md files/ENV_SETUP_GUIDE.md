# Environment Variables Setup Guide

یہ گائیڈ آپ کو production environment variables setup کرنے میں مدد کرے گی۔

## API Environment Variables (.env)

`api/.env` file میں یہ variables شامل کریں:

```env
# Server Configuration
NODE_ENV=production
PORT=3434
HOST=0.0.0.0

# Base URLs (Production Domains)
BASE_URL=https://api.zuroona.sa
FRONTEND_URL=https://zuroona.sa
ADMIN_URL=https://admin.zuroona.sa
WEB_URL=https://zuroona.sa

# Database Configuration
MONGO_URI=mongodb+srv://aditya:1234@cluster0.jw8wy.mongodb.net/jeena
MONGODB_URI=mongodb+srv://aditya:1234@cluster0.jw8wy.mongodb.net/jeena

# JWT Configuration
SECRET_KEY=e058705f0b8f1f936f57d9bf1bac33a91aa9d333e6cd3197db79488c1751aed0
JWT_SECRET=e058705f0b8f1f936f57d9bf1bac33a91aa9d333e6cd3197db79488c1751aed0
JWT_EXPIRES_IN=7d

# Cookie Configuration
COOKIE_SECRET=e117081cda739e6b5727f76e7f6484d80d6558b61001420aaf576be37b2ff208

# AWS S3 Configuration (for file uploads)
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=NJHgnq0F//RnrjrtTrfia4CnyQQIlLBlwdqdQ4Eb
AWS_BUCKET_NAME=zuroona-files
AWS_REGION=eu-north-1

# Cloudinary Configuration (alternative to S3 - currently commented)
#CLOUDINARY_URL=cloudinary://275299651367734:tmeCNmcjzDQ0kUUDTV9U4dhmtUM@dw1v8b9hz

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=shanwaqarfarooq982@gmail.com
SMTP_PASS=lcwbkjtiulnuegry
MAIL_FROM=noreply@Zuroona.sa
MAIL_FROM_NAME=Zuroona PlateForm

# Email Configuration (MailJS)
MAILJS_PUBLIC_KEY=OSfCgupc61dwFtXNI
MAILJS_PRIVATE_KEY=fj4w33dz06Qafqvr46ZrK

# SMS Configuration (Msegat)
MSEGAT_API_URL=https://www.msegat.com/gw/sendsms.php
MSEGAT_USERNAME=Naif Alkahtani
MSEGAT_PASSWORD=AA8B&578CD
MSEGAT_API_KEY=EB06B371F04B29061D124C8E3495F57E
#MSEGAT_API_KEY=3808F5D4D89B1B23E61632C0B475A342
#MSEGAT_SENDER_NAME=Zuroona

# OneSignal Configuration (for push notifications)
ONESIGNAL_APP_ID=0c335e7c-4c22-4a1d-bd44-82ce1b2ad6a3
ONESIGNAL_REST_API_KEY=os_v2_app_bqzv47cmejfb3pkeqlhbwkwwunahhk62ttrewietshmfvxsnajy5awtv2bs6z6tute6e6tpul45jm6xfvoizme6pxornddy5gdjbr2a

# Payment Gateway Configuration (Moyasar)
MOYASAR_PUBLISHABLE_KEY=pk_test_GUUdMyrNufV9xb59FBSAYi9jniyhvVDa9U2524pV
MOYASAR_SECRET_KEY=sk_test_@sG6LYsSoX4hixpSwCZEiaac1TSLtKXMy91Yen6B
# Alternative (for backward compatibility)
MOYASAR_API_KEY=sk_test_@sG6LYsSoX4hixpSwCZEiaac1TSLtKXMy91Yen6B
MOYASAR_SECRET=sk_test_@sG6LYsSoX4hixpSwCZEiaac1TSLtKXMy91Yen6B

# Daftra API Configuration (Invoice Management)
DAFTRA_SUBDOMAIN=zuroonainvoice
DAFTRA_API_KEY=8a8059a0c1c4df926f0c266345996e56265029b0

# Sentry Error Tracking
SENTRY_DSN=https://0b9a0508554c83f26e4f17fceca22a09@o4510574507851776.ingest.us.sentry.io/4510574510604288

# Admin & Support Email
ADMIN_EMAIL=info.rana.aliraza@gmail.com
CAREER_EMAIL=info.rana.aliraza@gmail.com

# Logging Configuration
LOG_LEVEL=info

# Feature Flags
ENABLE_AUTO_CLOSE_GROUP_CHATS=true
ENABLE_AUTO_COMPLETE_BOOKINGS=true
ENABLE_AUTO_CANCEL_UNPAID_BOOKINGS=true
ENABLE_HOST_RESPONSE_REMINDERS=true
ENABLE_HOLD_EXPIRED_NOTIFICATIONS=true
ENABLE_REVIEW_PROMPTS=true
```

## Web Application Environment Variables (.env.local)

`web/.env.local` file میں یہ variables شامل کریں:

```env
# Next.js Configuration
NODE_ENV=production

# API Base URL (Production)
NEXT_PUBLIC_API_BASE_URL=https://api.zuroona.sa/api/
NEXT_PUBLIC_API_URL=https://api.zuroona.sa/api/

# Web Domain (Production)
NEXT_PUBLIC_WEB_URL=https://zuroona.sa
NEXT_PUBLIC_BASE_URL=https://zuroona.sa

# AWS S3 Configuration (if needed for client-side uploads)
NEXT_PUBLIC_AWS_REGION=us-west-1
NEXT_PUBLIC_AWS_BUCKET_NAME=your_bucket_name
NEXT_PUBLIC_S3_URL=https://s3.us-west-1.amazonaws.com/your_bucket_name

# Google Maps API Key (if used)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Admin Panel Environment Variables (.env.local)

`admin/.env.local` file میں یہ variables شامل کریں:

```env
# Next.js Configuration
NODE_ENV=production

# API Base URL (Production)
NEXT_PUBLIC_API_BASE_URL=https://api.zuroona.sa/api/admin/
NEXT_PUBLIC_API_BASE=https://api.zuroona.sa/api/admin/

# Admin Domain (Production)
NEXT_PUBLIC_ADMIN_URL=https://admin.zuroona.sa
NEXT_PUBLIC_BASE_URL=https://admin.zuroona.sa

# AWS S3 Configuration (if needed for client-side uploads)
NEXT_PUBLIC_AWS_REGION=us-west-1
NEXT_PUBLIC_AWS_BUCKET_NAME=your_bucket_name
NEXT_PUBLIC_S3_URL=https://s3.us-west-1.amazonaws.com/your_bucket_name
```

## Important Notes

1. **Security**: کبھی بھی `.env` files کو git میں commit نہ کریں
2. **Production URLs**: Production میں ہمیشہ `https://` استعمال کریں
3. **API URL**: Web اور Admin دونوں `https://api.zuroona.sa` استعمال کریں گی
4. **Environment Detection**: Code automatically development/production detect کرتا ہے

## Development vs Production

### Development
- API: `http://localhost:3434/api/`
- Web: `http://localhost:3000`
- Admin: `http://localhost:3001`

### Production
- API: `https://api.zuroona.sa/api/`
- Web: `https://zuroona.sa`
- Admin: `https://admin.zuroona.sa`

Code automatically environment detect کرتا ہے اور appropriate URLs استعمال کرتا ہے۔
