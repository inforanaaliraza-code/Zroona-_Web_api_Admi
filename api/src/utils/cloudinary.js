const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary - This runs when module is loaded
let cloudinaryConfigured = false;

// Parse CLOUDINARY_URL and configure Cloudinary
const configureCloudinary = () => {
    try {
        if (process.env.CLOUDINARY_URL) {
            // Parse CLOUDINARY_URL format: cloudinary://api_key:api_secret@cloud_name
            const url = process.env.CLOUDINARY_URL;
            const match = url.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
            
            if (match) {
                const [, api_key, api_secret, cloud_name] = match;
                cloudinary.config({
                    cloud_name: cloud_name,
                    api_key: api_key,
                    api_secret: api_secret,
                });
                cloudinaryConfigured = true;
                console.log('✅ Cloudinary configured using CLOUDINARY_URL');
                console.log(`   Cloud Name: ${cloud_name}`);
                console.log(`   API Key: ${api_key.substring(0, 5)}...`);
                return true;
            } else {
                // Try direct config (Cloudinary SDK might handle it)
                try {
                    cloudinary.config(process.env.CLOUDINARY_URL);
                    const config = cloudinary.config();
                    if (config.cloud_name && config.api_key) {
                        cloudinaryConfigured = true;
                        console.log('✅ Cloudinary configured using CLOUDINARY_URL (direct)');
                        return true;
                    }
                } catch (e) {
                    console.warn('⚠️ Direct CLOUDINARY_URL config failed, trying parse...');
                }
            }
        }
        
        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
            // Use individual environment variables
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
            });
            cloudinaryConfigured = true;
            console.log('✅ Cloudinary configured using individual credentials');
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('❌ Error configuring Cloudinary:', error.message);
        return false;
    }
};

// Configure on module load
if (!configureCloudinary()) {
    console.warn('⚠️ Cloudinary credentials not found in environment variables.');
    console.warn('   Please set CLOUDINARY_URL or individual CLOUDINARY_* variables in api/.env file');
    console.warn('   Example: CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME');
}

/**
 * Upload file to Cloudinary
 * @param {Buffer} fileBuffer - File buffer data
 * @param {string} folder - Folder name in Cloudinary (e.g., 'Zuroona/events', 'Zuroona/profiles')
 * @param {string} fileName - Original file name
 * @param {string} mimeType - File MIME type
 * @returns {Promise<Object>} - Cloudinary upload result with secure_url
 */
const uploadToCloudinary = async (fileBuffer, folder = 'Jeena', fileName = null, mimeType = 'image/jpeg') => {
    return new Promise((resolve, reject) => {
        try {
            // Validate file buffer
            if (!fileBuffer || !Buffer.isBuffer(fileBuffer)) {
                throw new Error('Invalid file buffer provided');
            }

            // Check if Cloudinary is configured
            const config = cloudinary.config();
            
            // Debug: Log environment variables (without exposing secrets)
            const envCheck = {
                has_CLOUDINARY_URL: !!process.env.CLOUDINARY_URL,
                has_CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME,
                has_CLOUDINARY_API_KEY: !!process.env.CLOUDINARY_API_KEY,
                has_CLOUDINARY_API_SECRET: !!process.env.CLOUDINARY_API_SECRET,
                CLOUDINARY_URL_length: process.env.CLOUDINARY_URL ? process.env.CLOUDINARY_URL.length : 0,
                CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET'
            };
            
            console.log('🔍 Cloudinary config check:', {
                cloudinaryConfigured,
                config_cloud_name: config.cloud_name || 'NOT SET',
                config_hasApiKey: !!config.api_key,
                config_hasApiSecret: !!config.api_secret,
                envCheck
            });
            
            if (!config.cloud_name || !config.api_key || !config.api_secret) {
                console.error('❌ Cloudinary config missing. Environment variables:', envCheck);
                console.error('❌ Please add to api/.env file:');
                console.error('   CLOUDINARY_URL=cloudinary://275299651367734:tmeCNmcjzDQ0kUUDTV9U4dhmtUM@dw1v8b9hz');
                throw new Error('Cloudinary is not configured. Please add CLOUDINARY_URL to api/.env file and restart the server.');
            }

            // Determine resource type based on MIME type
            let resourceType = 'image';
            if (mimeType && mimeType.startsWith('video/')) {
                resourceType = 'video';
            } else if (mimeType && mimeType.startsWith('audio/')) {
                resourceType = 'raw';
            } else if (mimeType && !mimeType.startsWith('image/')) {
                resourceType = 'raw';
            }

            // Generate unique public_id
            const timestamp = Date.now();
            const sanitizedName = fileName 
                ? fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
                : `upload-${timestamp}`;
            const publicId = `${folder}/${timestamp}-${sanitizedName}`;

            const uploadOptions = {
                folder: folder,
                public_id: publicId.replace(`${folder}/`, ''), // Remove folder prefix from public_id
                resource_type: resourceType,
                overwrite: false,
                invalidate: true, // Invalidate CDN cache
            };

            // Add transformation only for images
            if (resourceType === 'image') {
                uploadOptions.transformation = [
                    {
                        quality: 'auto:good', // Auto quality optimization
                        fetch_format: 'auto', // Auto format (WebP when supported)
                    }
                ];
            }

            console.log('📤 Uploading to Cloudinary:', {
                folder,
                fileName: sanitizedName,
                resourceType,
                size: fileBuffer.length,
                mimeType
            });

            // Upload to Cloudinary
            const uploadStream = cloudinary.uploader.upload_stream(
                uploadOptions,
                (error, result) => {
                    if (error) {
                        console.error('❌ Cloudinary upload error:', {
                            message: error.message,
                            http_code: error.http_code,
                            name: error.name,
                            error: error.error || error
                        });
                        reject(new Error(error.message || `Cloudinary upload failed: ${error.http_code || 'Unknown error'}`));
                    } else if (!result) {
                        console.error('❌ Cloudinary upload error: No result returned');
                        reject(new Error('Cloudinary upload failed: No result returned'));
                    } else {
                        console.log('✅ Cloudinary upload success:', {
                            public_id: result.public_id,
                            secure_url: result.secure_url,
                            format: result.format,
                            bytes: result.bytes
                        });
                        resolve({
                            public_id: result.public_id,
                            secure_url: result.secure_url,
                            url: result.url,
                            format: result.format,
                            bytes: result.bytes,
                            width: result.width,
                            height: result.height,
                            resource_type: result.resource_type,
                        });
                    }
                }
            );

            // Handle stream errors
            uploadStream.on('error', (streamError) => {
                console.error('❌ Cloudinary stream error:', streamError);
                reject(new Error(`Cloudinary stream error: ${streamError.message || 'Unknown error'}`));
            });

            // Pipe file buffer to upload stream
            uploadStream.end(fileBuffer);
        } catch (error) {
            console.error('❌ Error in uploadToCloudinary:', error);
            reject(error);
        }
    });
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Cloudinary public_id
 * @param {string} resourceType - Resource type ('image', 'video', 'raw')
 * @returns {Promise<Object>} - Deletion result
 */
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
            invalidate: true,
        });
        return result;
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw error;
    }
};

/**
 * Extract public_id from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string|null} - Public ID or null
 */
const extractPublicId = (url) => {
    if (!url) return null;
    
    // Match Cloudinary URL pattern
    // Example: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/filename.jpg
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
    return match ? match[1] : null;
};

module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary,
    extractPublicId,
    cloudinary,
};

