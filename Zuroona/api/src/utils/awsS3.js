const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand: _GetObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

// Configure AWS S3 - This runs when module is loaded
let s3Configured = false;
let s3Client = null;

// Configure AWS S3 Client
const configureS3 = () => {
    try {
        const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
        const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
        const region = process.env.AWS_REGION || 'us-east-1';
        const bucketName = process.env.AWS_BUCKET_NAME;

        if (!accessKeyId || !secretAccessKey || !bucketName) {
            console.warn('⚠️ AWS S3 credentials not found in environment variables.');
            console.warn('   Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_NAME, and AWS_REGION in api/.env file');
            return false;
        }

        s3Client = new S3Client({
            region: region,
            credentials: {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
            },
        });

        s3Configured = true;
        console.log('✅ AWS S3 configured successfully');
        console.log(`   Region: ${region}`);
        console.log(`   Bucket: ${bucketName}`);
        console.log(`   Access Key: ${accessKeyId.substring(0, 5)}...`);
        return true;
    } catch (error) {
        console.error('❌ Error configuring AWS S3:', error.message);
        return false;
    }
};

// Configure on module load
if (!configureS3()) {
    console.warn('⚠️ AWS S3 credentials not found. File uploads will fail.');
}

/**
 * Upload file to AWS S3
 * @param {Buffer} fileBuffer - File buffer data
 * @param {string} folder - Folder name in S3 (e.g., 'Zuroona/events', 'Zuroona/profiles')
 * @param {string} fileName - Original file name
 * @param {string} mimeType - File MIME type
 * @returns {Promise<Object>} - S3 upload result with url
 */
const uploadToS3 = async (fileBuffer, folder = 'Zuroona', fileName = null, mimeType = 'image/jpeg') => {
    try {
        // Validate file buffer
        if (!fileBuffer || !Buffer.isBuffer(fileBuffer)) {
            throw new Error('Invalid file buffer provided');
        }

        // Check if S3 is configured
        if (!s3Configured || !s3Client) {
            const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
            const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
            const bucketName = process.env.AWS_BUCKET_NAME;
            const region = process.env.AWS_REGION || 'us-east-1';

            if (!accessKeyId || !secretAccessKey || !bucketName) {
                throw new Error('AWS S3 is not configured. Please add AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_NAME, and AWS_REGION to api/.env file and restart the server.');
            }

            // Reconfigure if needed
            s3Client = new S3Client({
                region: region,
                credentials: {
                    accessKeyId: accessKeyId,
                    secretAccessKey: secretAccessKey,
                },
            });
            s3Configured = true;
        }

        const bucketName = process.env.AWS_BUCKET_NAME;
        const region = process.env.AWS_REGION || 'us-east-1';

        // Generate unique file key
        const timestamp = Date.now();
        const sanitizedName = fileName 
            ? fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
            : `upload-${timestamp}`;
        const key = `${folder}/${timestamp}-${sanitizedName}`;

        // Upload to S3
        console.log('📤 Uploading to AWS S3:', {
            bucket: bucketName,
            key: key,
            folder: folder,
            fileName: sanitizedName,
            size: fileBuffer.length,
            mimeType: mimeType
        });

        const putParams = {
            Bucket: bucketName,
            Key: key,
            Body: fileBuffer,
            ContentType: mimeType || 'application/octet-stream',
            ACL: 'public-read', // Make file publicly accessible
        };

        try {
            await s3Client.send(new PutObjectCommand(putParams));
        } catch (uploadError) {
            // Handle PermanentRedirect error (region mismatch)
            if (uploadError.name === 'PermanentRedirect' && uploadError.Endpoint) {
                // Extract region from endpoint (e.g., zuroona-files.s3.eu-north-1.amazonaws.com)
                const endpointMatch = uploadError.Endpoint.match(/\.s3\.([^.]+)\.amazonaws\.com/);
                if (endpointMatch) {
                    const correctRegion = endpointMatch[1];
                    console.error(`❌ Region mismatch! Bucket is in ${correctRegion}, but code is using ${region}`);
                    console.error(`   Please set AWS_REGION=${correctRegion} in api/.env file`);
                    throw new Error(`AWS S3 region mismatch. Bucket is in ${correctRegion}, but AWS_REGION is set to ${region}. Please update AWS_REGION in api/.env file to ${correctRegion}.`);
                }
            }
            // Re-throw other errors
            throw uploadError;
        }

        // Construct public URL
        // Format: https://bucket-name.s3.region.amazonaws.com/key
        const url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

        console.log('✅ AWS S3 upload success:', {
            key: key,
            url: url,
            size: fileBuffer.length
        });

        return {
            key: key,
            url: url,
            location: url,
            secure_url: url, // For compatibility with Cloudinary format
            public_id: key, // For compatibility with Cloudinary format
            format: mimeType ? mimeType.split('/')[1] : 'unknown',
            bytes: fileBuffer.length,
        };
    } catch (error) {
        console.error('❌ Error in uploadToS3:', error);
        
        // Better error messages for common issues
        if (error.name === 'PermanentRedirect') {
            throw new Error('AWS S3 region mismatch. Please check your AWS_REGION environment variable matches your bucket region.');
        }
        if (error.name === 'NoSuchBucket') {
            throw new Error('AWS S3 bucket not found. Please check your AWS_BUCKET_NAME environment variable.');
        }
        if (error.name === 'AccessDenied' || error.message?.includes('Access Denied')) {
            throw new Error('AWS S3 access denied. Please check your IAM user permissions and bucket policy.');
        }
        
        throw error;
    }
};

/**
 * Delete file from AWS S3
 * @param {string} key - S3 object key
 * @returns {Promise<Object>} - Deletion result
 */
const deleteFromS3 = async (key) => {
    try {
        if (!s3Configured || !s3Client) {
            throw new Error('AWS S3 is not configured');
        }

        const bucketName = process.env.AWS_BUCKET_NAME;

        const deleteParams = {
            Bucket: bucketName,
            Key: key,
        };

        await s3Client.send(new DeleteObjectCommand(deleteParams));
        console.log('✅ File deleted from S3:', key);
        return { success: true, key: key };
    } catch (error) {
        console.error('❌ Error deleting from S3:', error);
        throw error;
    }
};

/**
 * Extract key from S3 URL
 * @param {string} url - S3 URL
 * @returns {string|null} - Key or null
 */
const extractKey = (url) => {
    if (!url) return null;
    
    // Match S3 URL pattern
    // Example: https://bucket-name.s3.region.amazonaws.com/folder/file.jpg
    const match = url.match(/\.amazonaws\.com\/(.+)$/);
    return match ? match[1] : null;
};

module.exports = {
    uploadToS3,
    deleteFromS3,
    extractKey,
    s3Client,
};

