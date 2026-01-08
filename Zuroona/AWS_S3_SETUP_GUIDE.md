# AWS S3 Setup Guide - Zuroona Project

## Step-by-Step AWS S3 Setup

### 1. AWS Console mein Login karein
- https://aws.amazon.com/ par jayein
- "Sign In to the Console" click karein
- Apna AWS account credentials se login karein

### 2. S3 Bucket Create karein
1. AWS Console mein **S3** search karein aur click karein
2. **"Create bucket"** button click karein
3. Bucket settings:
   - **Bucket name**: `zuroona-files` (unique name, lowercase only)
   - **AWS Region**: `us-east-1` (ya apna preferred region)


   - **Object Ownership**: "ACLs enabled" select karein


   - **Block Public Access**: **UNCHECK** karein (files public access ke liye)


     - "I acknowledge that the current settings might result in this bucket and the objects within becoming public" checkbox tick karein
   - **Bucket Versioning**: Disable (default)
   - **Default encryption**: Enable (optional but recommended)
4. **"Create bucket"** click karein

### 3. IAM User Create karein (S3 access ke liye)
1. AWS Console mein **IAM** search karein
2. Left sidebar mein **"Users"** click karein


3. **"Create user"** button click karein
4. User name: `zuroona-s3-user`
5. **"Next"** click karein
6. **"Attach policies directly"** select karein
7. **"AmazonS3FullAccess"** policy select karein (ya custom policy bana sakte hain)
8. **"Next"** click karein
9. **"Create user"** click karein

### 4. Access Keys Create karein


1. Abhi create kiye gaye user par click karein
2. **"Security credentials"** tab click karein
3. **"Create access key"** button click karein
4. **"Application running outside AWS"** select karein
5. **"Next"** click karein
6. Description: `Zuroona S3 Access`
7. **"Create access key"** click karein


8. **IMPORTANT**: Ab aapko dikhega:
   - **Access Key ID**: Copy karein (yeh `AWS_ACCESS_KEY_ID` hai)
   - **Secret Access Key**: Copy karein (yeh `AWS_SECRET_ACCESS_KEY` hai)
   - ⚠️ **Secret key sirf ek baar dikhega, isko save kar lein!**

### 5. Bucket Policy Set karein (Public Read Access)
1. S3 Console mein apne bucket par click karein
2. **"Permissions"** tab click karein
3. **"Bucket policy"** section mein **"Edit"** click karein
4. Neeche diya hua policy paste karein (bucket name replace karein):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::zuroona-files/*"
        }
    ]
}
```

5. **"Save changes"** click karein

### 6. CORS Configuration (agar frontend se direct upload karna ho)
1. S3 bucket mein **"Permissions"** tab
2. **"Cross-origin resource sharing (CORS)"** section
3. **"Edit"** click karein
4. Neeche diya hua CORS config paste karein:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": ["ETag"]
    }
]
```

5. **"Save changes"** click karein

### 7. Project mein Environment Variables Add karein

`api/.env` file mein yeh variables add karein:

```env
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_BUCKET_NAME=zuroona-files
AWS_REGION=us-east-1
```

**Example:**
```env
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_BUCKET_NAME=zuroona-files
AWS_REGION=us-east-1
```

### 8. Cloudinary Environment Variables Remove karein

`api/.env` file se yeh lines remove/comment out karein:
```env
# CLOUDINARY_URL=cloudinary://...
# CLOUDINARY_CLOUD_NAME=...
# CLOUDINARY_API_KEY=...
# CLOUDINARY_API_SECRET=...
```

### 9. Server Restart karein

```bash
cd api
npm start
# ya
npm run dev
```

### 10. Test karein

File upload API call karein aur check karein ke file S3 mein upload ho rahi hai.

---

## Important Notes

### Security Best Practices:
1. ✅ IAM user ko sirf S3 access diya hai (not full AWS access)
2. ✅ Access keys ko `.env` file mein rakhein (git mein commit na karein)
3. ✅ Production mein bucket policy ko restrict karein (specific origins ke liye)
4. ✅ Regular access key rotation karein

### Cost Considerations:
- S3 storage: ~$0.023 per GB/month
- PUT requests: ~$0.005 per 1,000 requests
- GET requests: ~$0.0004 per 1,000 requests
- Data transfer out: First 100 GB/month free, phir charges

### Common Issues:

**Issue**: "Access Denied" error
- **Solution**: IAM user ko S3 permissions check karein
- Bucket policy check karein

**Issue**: "Bucket not found"
- **Solution**: `AWS_BUCKET_NAME` correct hai ya nahi check karein
- Region correct hai ya nahi verify karein

**Issue**: Files public nahi dikh rahi
- **Solution**: Bucket policy aur ACL settings check karein
- Block Public Access settings verify karein

---

## Quick Checklist

- [ ] AWS account created/login
- [ ] S3 bucket created with public read access
- [ ] IAM user created with S3 permissions
- [ ] Access keys generated and saved
- [ ] Bucket policy configured
- [ ] CORS configured (if needed)
- [ ] Environment variables added to `api/.env`
- [ ] Cloudinary variables removed
- [ ] Server restarted
- [ ] File upload tested

---

## Support

Agar koi issue aaye to:
1. Server logs check karein
2. AWS CloudWatch logs check karein
3. IAM permissions verify karein
4. Bucket policy aur CORS settings review karein

