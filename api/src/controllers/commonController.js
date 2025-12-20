const resp_messages = require('../helpers/resp_messages');
const Response = require('../helpers/response');
const Cms = require('../models/cmsModel');
const CmsService = require('../services/cmsService');
const EventCategoryService = require('../services/EventCategoriesService');
const organizerService = require('../services/organizerService');
const UserService = require('../services/userService');
// ========== AWS S3 IMPORTS - COMMENTED OUT ==========
// const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
// const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
// ==================================================
const fs = require('fs');
const path = require('path');
const { uploadToCloudinary, extractPublicId } = require('../utils/cloudinary');

require('dotenv').config();

const commonController = {
    uploadFile: async (req, res) => {
        try {
            // ========== AWS S3 CREDENTIALS CHECK - COMMENTED OUT ==========
            // const credentials = {
            //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            //     bucketName: process.env.AWS_BUCKET_NAME,
            //     region: process.env.AWS_REGION,
            // };

            // if (!credentials.accessKeyId || !credentials.secretAccessKey || !credentials.region || !credentials.bucketName) {
            //     return Response.badRequestResponse(res, 'S3 credentials not found');
            // }
            // ==================================================

            // Debug logging
            console.log('Upload request received:', {
                hasFiles: !!req.files,
                filesKeys: req.files ? Object.keys(req.files) : [],
                hasBody: !!req.body,
                bodyKeys: req.body ? Object.keys(req.body) : [],
                contentType: req.headers['content-type']
            });

            if (!req.files || !req.files.file) {
                // Check if file might be in a different format
                const fileKeys = req.files ? Object.keys(req.files) : [];
                if (fileKeys.length > 0) {
                    console.log('File keys found:', fileKeys);
                    // Try to use the first file if 'file' key doesn't exist
                    const firstFileKey = fileKeys[0];
                    if (req.files[firstFileKey]) {
                        req.files.file = req.files[firstFileKey];
                    } else {
                        return Response.badRequestResponse(res, `file is required. Received keys: ${fileKeys.join(', ')}`);
                    }
                } else {
                    return Response.badRequestResponse(res, 'file is required. No files found in request.');
                }
            }

            const uploaded = req.files.file;
            
            // Handle both temp files and in-memory files
            let fileData;
            let originalName;
            
            if (uploaded.tempFilePath) {
                // File was saved to temp directory (useTempFiles: true)
                fileData = fs.readFileSync(uploaded.tempFilePath);
                originalName = uploaded.name || uploaded.tempFilePath.split('/').pop() || `upload-${Date.now()}`;
            } else if (uploaded.data) {
                // File is in memory (useTempFiles: false)
                fileData = uploaded.data;
                originalName = uploaded.name || `upload-${Date.now()}`;
            } else {
                return Response.badRequestResponse(res, 'File data not found. File may not have been uploaded correctly.');
            }
            
            // ========== AWS S3 UPLOAD CODE - COMMENTED OUT ==========
            // const keyPrefix = req.body.dirName || 'Zuroona';
            // const key = `${keyPrefix}/${Date.now()}-${originalName}`;

            // const s3 = new S3Client({
            //     region: credentials.region,
            //     credentials: {
            //         accessKeyId: credentials.accessKeyId,
            //         secretAccessKey: credentials.secretAccessKey,
            //     },
            // });

            // const putParams = {
            //     Bucket: credentials.bucketName,
            //     Key: key,
            //     Body: fileData,
            //     ContentType: uploaded.mimetype || 'application/octet-stream',
            //     // If your bucket blocks public ACLs, remove ACL and serve via signed URLs instead.
            //     ACL: 'public-read',
            // };

            // await s3.send(new PutObjectCommand(putParams));

            // Clean up temp file if it was used
            // if (uploaded.tempFilePath) {
            //     const fs = require('fs');
            //     try {
            //         fs.unlinkSync(uploaded.tempFilePath);
            //     } catch (err) {
            //         console.warn('Failed to delete temp file:', err.message);
            //     }
            // }

            // const url = `https://${credentials.bucketName}.s3.${credentials.region}.amazonaws.com/${key}`;
            // return Response.ok(res, { location: url, key }, 200, 'File uploaded successfully');
            // ==================================================

            // ========== CLOUDINARY UPLOAD ==========
            const dirName = req.body.dirName || 'Jeena';
            
            // Check Cloudinary credentials
            const hasCloudinaryUrl = !!process.env.CLOUDINARY_URL;
            const hasIndividualCreds = process.env.CLOUDINARY_CLOUD_NAME && 
                                      process.env.CLOUDINARY_API_KEY && 
                                      process.env.CLOUDINARY_API_SECRET;
            
            if (!hasCloudinaryUrl && !hasIndividualCreds) {
                return Response.badRequestResponse(
                    res,
                    'Cloudinary credentials not configured. Please set CLOUDINARY_URL or individual CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.'
                );
            }

            // Upload to Cloudinary
            console.log('📤 Starting Cloudinary upload:', {
                dirName,
                originalName,
                mimetype: uploaded.mimetype,
                fileSize: fileData.length
            });
            
            const cloudinaryResult = await uploadToCloudinary(
                fileData,
                dirName,
                originalName,
                uploaded.mimetype || 'image/jpeg'
            );
            
            if (!cloudinaryResult || !cloudinaryResult.secure_url) {
                throw new Error('Cloudinary upload failed: No URL returned');
            }

            // Clean up temp file if it was used
            if (uploaded.tempFilePath) {
                try {
                    fs.unlinkSync(uploaded.tempFilePath);
                } catch (err) {
                    console.warn('Failed to delete temp file:', err.message);
                }
            }

            // Return Cloudinary URL
            return Response.ok(
                res,
                {
                    location: cloudinaryResult.secure_url,
                    url: cloudinaryResult.secure_url,
                    public_id: cloudinaryResult.public_id,
                    format: cloudinaryResult.format,
                    bytes: cloudinaryResult.bytes,
                },
                200,
                'File uploaded successfully to Cloudinary'
            );
            // ==================================================
        } catch (error) {
            // Log full error details for debugging
            console.error('❌ Upload error details:', {
                message: error?.message || 'No error message',
                code: error?.code || 'No error code',
                name: error?.name || 'No error name',
                http_code: error?.http_code || 'No HTTP code',
                error: error?.error || 'No error details',
                stack: error?.stack ? error.stack.split('\n').slice(0, 5).join('\n') : 'No stack trace'
            });

            // Handle Cloudinary-specific errors
            if (error?.http_code) {
                let userMessage = 'File upload failed';
                if (error.http_code === 401) {
                    userMessage = 'Cloudinary authentication failed. Please check your API credentials.';
                } else if (error.http_code === 400) {
                    userMessage = `Cloudinary upload failed: ${error.message || 'Invalid request'}`;
                } else if (error.http_code === 403) {
                    userMessage = 'Cloudinary access denied. Please check your API key permissions.';
                } else if (error.http_code === 404) {
                    userMessage = 'Cloudinary resource not found. Please check your cloud name.';
                } else {
                    userMessage = `Cloudinary upload failed (HTTP ${error.http_code}): ${error.message || 'Unknown error'}`;
                }
                return Response.serverErrorResponse(res, userMessage);
            }

            // Handle credential errors
            if (error?.message && error.message.includes('Cloudinary') && error.message.includes('not configured')) {
                return Response.badRequestResponse(
                    res,
                    'Cloudinary credentials not configured. Please set CLOUDINARY_URL or individual CLOUDINARY_* environment variables.'
                );
            }

            // Return user-friendly error message
            const errorMessage = error?.message || error?.toString() || 'Unknown error occurred during file upload';
            return Response.serverErrorResponse(
                res,
                `File upload failed: ${errorMessage}. Please check server logs for details.`
            );
        }
    },
    // ========== AWS S3 VIEW FILE - COMMENTED OUT (using express.static for local files) ==========
    // viewFile: async (req, res) => {
    //     try {
    //         const { key } = req.query;
    //         if (!key) {
    //             return Response.badRequestResponse(res, 'key is required');
    //         }

    //         const credentials = {
    //             accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //             secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    //             bucketName: process.env.AWS_BUCKET_NAME,
    //             region: process.env.AWS_REGION,
    //         };

    //         if (!credentials.accessKeyId || !credentials.secretAccessKey || !credentials.region || !credentials.bucketName) {
    //             return Response.badRequestResponse(res, 'S3 credentials not found');
    //         }

    //         const s3 = new S3Client({
    //             region: credentials.region,
    //             credentials: {
    //                 accessKeyId: credentials.accessKeyId,
    //                 secretAccessKey: credentials.secretAccessKey,
    //             },
    //         });

    //         const command = new GetObjectCommand({
    //             Bucket: credentials.bucketName,
    //             Key: key,
    //         });

    //         const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 10 }); // 10 minutes
    //         return res.redirect(302, signedUrl);
    //     } catch (error) {
    //         console.log(error.message);
    //         return Response.serverErrorResponse(res);
    //     }
    // },
    // ==================================================
    getS3Credentials: async (req, res) => {
        try {

            const credentials = {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                bucketName: process.env.AWS_BUCKET_NAME,
                region: process.env.AWS_REGION,
            };

            if (!credentials.accessKeyId || !credentials.secretAccessKey || !credentials.region) {
                return Response.badRequestResponse(res, 'S3 credentials not found');
            }

            return Response.ok(res, credentials, 200)


        } catch (error) {
            return Response.serverErrorResponse(res)

        }
    },
    getCms: async (req, res) => {
        const { lang } = req.headers || 'en';
        try {
            const { type } = req.query;
            if (!type) {
                return Response.badRequestResponse(res, resp_messages(lang).cmsTypeRequired)
            }
            const matchStage = { $match: { type: type } };
            const projectStage = {
                $project: {
                    type: 1,
                    description: lang === "ar" ? "$description_ar" : "$description"
                }
            };
            const result = await CmsService.AggregateService([matchStage, projectStage]);

            // const result = await CmsService.AggregateService([
            //     { $match: { type: type } },
            //     {
            //         $project: {
            //             type: 1,
            //             description: {
            //                 $cond: {
            //                     if: { $eq: [lang, "ar"] },
            //                     then: "$description_ar",
            //                     else: "$description"
            //                 }
            //             }
            //         }
            //     }
            // ]);

            if (!result) {
                return Response.notFoundResponse(res, resp_messages(lang).cmsNotFound)
            }
            return Response.ok(res, result[0], 200, resp_messages(lang).fetched_data)
        } catch (error) {
            console.log(error.message)
            return Response.serverErrorResponse(res)

        }
    },
    deviceToken: async (req, res) => {
        try {
            const { userId, role } = req;
            const { fcm_token } = req.body;

            const service = role == 1 ? UserService : organizerService;

            if (!fcm_token) {
                return Response.badRequestResponse(res, {}, 400, 'fcm_token is required')
            }
            await service.FindByIdAndUpdateService(userId, { fcm_token });
            return Response.ok(res, {}, 200, 'Device token updated successfully');
        } catch (error) {
            return Response.serverErrorResponse(res);

        }
    },

    staticDataAdd: async (req, res) => {
        try {
            const option_item = await EventCategoryService.CreateService(req.body);

            return Response.ok(res, option_item, resp_messages(req.lang).success);

        } catch (error) {
            console.log(error.message)
            return Response.serverErrorResponse(res)

        }
    },
}

module.exports = commonController;