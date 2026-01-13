# Environment Variables Setup Guide (Sanitized)

یہ گائیڈ production میں مطلوبہ environment variables کی فہرست دیتی ہے۔ تمام حساس keys کو اپنی `.env` فائلوں میں رکھیں اور انہیں git میں کبھی commit نہ کریں۔

## API (`api/.env`)
```
NODE_ENV=production
PORT=3434
HOST=0.0.0.0

# Base URLs
BASE_URL=https://api.zuroona.sa
FRONTEND_URL=https://zuroona.sa
ADMIN_URL=https://admin.zuroona.sa
WEB_URL=https://zuroona.sa

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT / Cookies
JWT_SECRET=your_jwt_secret
SECRET_KEY=your_jwt_secret
COOKIE_SECRET=your_cookie_secret

# AWS / Storage (do not commit real keys)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your_bucket_name
AWS_REGION=your_region

# Cloudinary (optional)
CLOUDINARY_URL=cloudinary://<key>:<secret>@<cloud>

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_app_password
MAIL_FROM=noreply@zuroona.sa
MAIL_FROM_NAME=Zuroona Platform

# MailJS (optional)
MAILJS_PUBLIC_KEY=your_public_key
MAILJS_PRIVATE_KEY=your_private_key

# SMS (Msegat)
MSEGAT_API_URL=https://www.msegat.com/gw/sendsms.php
MSEGAT_USERNAME=your_username
MSEGAT_PASSWORD=your_password
MSEGAT_API_KEY=your_api_key

# OneSignal (push)
ONESIGNAL_APP_ID=your_onesignal_app_id
ONESIGNAL_REST_API_KEY=your_onesignal_rest_api_key

# Payments (Moyasar)
MOYASAR_PUBLISHABLE_KEY=your_publishable_key
MOYASAR_SECRET_KEY=your_secret_key
MOYASAR_API_KEY=your_secret_key
MOYASAR_SECRET=your_secret_key

# Daftra (invoicing)
DAFTRA_SUBDOMAIN=your_subdomain
DAFTRA_API_KEY=your_api_key

# Sentry
SENTRY_DSN=your_sentry_dsn

# Admin & Support
ADMIN_EMAIL=info.rana.aliraza@gmail.com
CAREER_EMAIL=info.rana.aliraza@gmail.com

# Logging
LOG_LEVEL=info

# Feature flags
ENABLE_AUTO_CLOSE_GROUP_CHATS=true
ENABLE_AUTO_COMPLETE_BOOKINGS=true
ENABLE_AUTO_CANCEL_UNPAID_BOOKINGS=true
ENABLE_HOST_RESPONSE_REMINDERS=true
ENABLE_HOLD_EXPIRED_NOTIFICATIONS=true
ENABLE_REVIEW_PROMPTS=true
```

## Web (`web/.env.local`)
```
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://api.zuroona.sa/api/
NEXT_PUBLIC_API_URL=https://api.zuroona.sa/api/
NEXT_PUBLIC_WEB_URL=https://zuroona.sa
NEXT_PUBLIC_BASE_URL=https://zuroona.sa
NEXT_PUBLIC_S3_BUCKET=your_bucket_name
NEXT_PUBLIC_S3_REGION=your_region
NEXT_PUBLIC_S3_URL=https://s3.your-region.amazonaws.com/your_bucket_name
NEXT_PUBLIC_S3_DIR=Zuroona
NEXT_PUBLIC_MAPS_API_KEY=your_maps_api_key
```

## Admin (`admin/.env.local`)
```
NODE_ENV=production
NEXT_PUBLIC_API_BASE=https://api.zuroona.sa/api/admin/
NEXT_PUBLIC_API_BASE_URL=https://api.zuroona.sa/api/admin/
NEXT_PUBLIC_ADMIN_URL=https://admin.zuroona.sa
NEXT_PUBLIC_BASE_URL=https://admin.zuroona.sa
NEXT_PUBLIC_S3_BUCKET=your_bucket_name
NEXT_PUBLIC_S3_REGION=your_region
NEXT_PUBLIC_S3_URL=https://s3.your-region.amazonaws.com/your_bucket_name
NEXT_PUBLIC_S3_DIR=Zuroona
NEXT_PUBLIC_MAPS_API_KEY=your_maps_api_key
```

### اہم ہدایات
- `.env*` فائلیں git میں commit مت کریں۔
- سامنے والے (frontend) میں کبھی بھی secret keys نہ رکھیں؛ صرف public keys استعمال کریں۔
- اگر پہلے سے کوئی secret commit ہو گیا تھا، فوراً rotate کریں اور نیا secret استعمال کریں۔
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
