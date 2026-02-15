"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { showGreenTick } from "@/utils/toastHelpers";
import Loader from "../Loader/Loader";
import { useTranslation } from "react-i18next";
import { UploadFileApi } from "@/app/api/setting";
import { Icon } from "@iconify/react";
import { BASE_API_URL } from "@/until";

// Image compression utility
const compressImage = (file, maxWidth = 800, quality = 0.85) => {
	return new Promise((resolve, reject) => {
		if (!file.type.startsWith('image/')) {
			resolve(file);
			return;
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			const img = new window.Image();
			img.onload = () => {
				const canvas = document.createElement('canvas');
				let width = img.width;
				let height = img.height;

				// Resize if larger than maxWidth
				if (width > maxWidth) {
					height = (height * maxWidth) / width;
					width = maxWidth;
				}

				canvas.width = width;
				canvas.height = height;

				const ctx = canvas.getContext('2d');
				ctx.drawImage(img, 0, 0, width, height);

				canvas.toBlob(
					(blob) => {
						if (blob) {
							const compressedFile = new File([blob], file.name, {
								type: file.type,
								lastModified: Date.now(),
							});
							resolve(compressedFile);
						} else {
							reject(new Error('Compression failed'));
						}
					},
					file.type,
					quality
				);
			};
			img.onerror = reject;
			img.src = e.target.result;
		};
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
};

// Create preview URL from file (for instant preview)
const createPreviewUrl = (file) => {
	if (!file) return null;
	return URL.createObjectURL(file);
};

export default function ProfileImageUpload({ 
	formik, 
	fieldName = "profile_image",
	onImageChange // Alternative callback if formik is not provided
}) {
	const [previewUrl, setPreviewUrl] = useState(null);
	const [serverUrl, setServerUrl] = useState(null);
	const [imageLoading, setImageLoading] = useState(false);
	const fileRef = useRef(null);
	const { t } = useTranslation();

	// Load saved profile image from localStorage or formik on mount
	useEffect(() => {
		// Only run on client side
		if (typeof window === "undefined" || typeof localStorage === "undefined") {
			return;
		}

		let loadedUrl = null;
		
		// Check localStorage first (for both organizer and guest)
		const savedProfileData = localStorage.getItem("organizer_personal_info");
		if (savedProfileData) {
			try {
				const data = JSON.parse(savedProfileData);
				if (data.profile_image) {
					loadedUrl = data.profile_image;
					setServerUrl(data.profile_image);
					console.log("[PROFILE-UPLOAD] Loaded image from localStorage:", data.profile_image);
					
					if (formik?.setFieldValue && formik.values && !formik.values[fieldName]) {
						formik.setFieldValue(fieldName, data.profile_image);
					}
					// Call onImageChange callback if provided
					if (onImageChange && typeof onImageChange === 'function') {
						onImageChange(data.profile_image);
					}
				}
			} catch (error) {
				console.error("[PROFILE-UPLOAD] Error parsing localStorage:", error);
			}
		}

		// Check formik value (if formik is provided and no URL loaded yet)
		if (!loadedUrl && formik?.values && formik.values[fieldName]) {
			loadedUrl = formik.values[fieldName];
			setServerUrl(formik.values[fieldName]);
			console.log("[PROFILE-UPLOAD] Loaded image from formik:", formik.values[fieldName]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Cleanup object URL on unmount
	useEffect(() => {
		return () => {
			if (previewUrl && typeof URL !== "undefined" && URL.revokeObjectURL) {
				try {
					URL.revokeObjectURL(previewUrl);
				} catch (error) {
					// Silently handle errors (e.g., URL already revoked)
					console.warn("ProfileImageUpload: Error revoking object URL", error);
				}
			}
		};
	}, [previewUrl]);

	const handleFileChange = useCallback(async (file) => {
		if (!file) {
			toast.error("Please select a file");
			return;
		}

		// Validate file type
		const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
		if (!validTypes.includes(file.type)) {
			toast.error("Please upload a valid image (JPG, PNG, WebP)");
			return;
		}

		// Validate file size (max 5MB)
		const maxSize = 5 * 1024 * 1024;
		if (file.size > maxSize) {
			toast.error("File size should be less than 5MB");
			return;
		}

		setImageLoading(true);
		fileRef.current = file;

		// Create instant preview URL
		const newPreviewUrl = createPreviewUrl(file);
		
		// Clear old preview URL if it exists
		setPreviewUrl((prev) => {
			if (prev && typeof URL !== "undefined" && URL.revokeObjectURL) {
				try {
					URL.revokeObjectURL(prev);
				} catch (error) {
					// Silently handle errors (e.g., URL already revoked)
					console.warn("ProfileImageUpload: Error revoking old preview URL", error);
				}
			}
			return newPreviewUrl;
		});

		try {
			// Compress image before upload
			const compressedFile = await compressImage(file, 800, 0.85);

			// Upload to server using local upload API
			const resp = await UploadFileApi({ file: compressedFile, dirName: "Zuroona" });

			if (resp?.status === 1 && resp?.data?.location) {
				const imageUrl = resp.data.location;
				
				// Store server URL for form submission, but keep previewUrl for display
				// Preview URL (blob) will be used until form is successfully submitted
				setServerUrl(imageUrl);
				
				// Store in formik if available (optional) - store server URL for submission
				if (formik?.setFieldValue) {
					try {
						formik.setFieldValue(fieldName, imageUrl);
					} catch (error) {
						console.warn("[PROFILE-UPLOAD] Could not set formik value:", error);
					}
				}
				
				// Call onImageChange callback with server URL for form submission
				if (onImageChange && typeof onImageChange === 'function') {
					try {
						onImageChange(imageUrl);
					} catch (error) {
						console.warn("[PROFILE-UPLOAD] Error in onImageChange callback:", error);
					}
				}

				// Store in localStorage for both organizer and guest (reusable key)
				const personalInfoData = localStorage.getItem("organizer_personal_info");
				if (personalInfoData) {
					try {
						const data = JSON.parse(personalInfoData);
						data.profile_image = imageUrl;
						localStorage.setItem("organizer_personal_info", JSON.stringify(data));
						console.log("[PROFILE-UPLOAD] Saved profile image to localStorage:", imageUrl);
					} catch (error) {
						console.error("[PROFILE-UPLOAD] Error saving to localStorage:", error);
					}
				} else {
					// Create new entry if doesn't exist
					localStorage.setItem("organizer_personal_info", JSON.stringify({
						profile_image: imageUrl
					}));
					console.log("[PROFILE-UPLOAD] Created new localStorage entry with profile image:", imageUrl);
				}

				setImageLoading(false);
				showGreenTick();
				// Note: previewUrl is kept for display - it will be cleared only when form is submitted successfully
			} else {
				throw new Error(resp?.message || resp?.error || "Upload failed");
			}
		} catch (error) {
			console.error("[PROFILE-UPLOAD] Upload error:", error);
			const errorMsg = error?.response?.data?.message || 
							error?.response?.data?.error || 
							error?.message || 
							"Image upload failed. Please try again.";
			toast.error(errorMsg);
			setImageLoading(false);
			// Clear both URLs on error using functional updates
			setPreviewUrl((prev) => {
				if (prev && typeof URL !== "undefined" && URL.revokeObjectURL) {
					try {
						URL.revokeObjectURL(prev);
					} catch (error) {
						// Silently handle errors (e.g., URL already revoked)
						console.warn("ProfileImageUpload: Error revoking preview URL on error", error);
					}
				}
				return null;
			});
			setServerUrl(null);
			fileRef.current = null;
		}
	}, [formik, fieldName, onImageChange]);

	const handleImageChange = useCallback((e) => {
		const file = e.target.files?.[0];
		if (file) {
			handleFileChange(file);
		}
		// Reset input to allow selecting same file again
		e.target.value = '';
	}, [handleFileChange]);

	// Display priority: previewUrl (blob) > serverUrl (only if no preview) > formik value
	// IMPORTANT: Always prefer previewUrl (blob) for display until form is submitted
	// This prevents 404 errors from server URLs that don't exist yet
	// Server URL is stored separately for form submission
	const displayUrl = previewUrl || (serverUrl || (formik?.values?.[fieldName]) || null);
	
	// Only show dummy image if no image is uploaded/selected
	const showDummyImage = !displayUrl && !imageLoading;

	return (
		<div className="flex flex-col items-center bg-white h-max p-7 pt-5 rounded-xl mb-8 md:mb-0">
			<div className="relative">
				<div className="absolute right-2 top-2 z-10">
					<Icon
						icon="lucide:camera"
						className="w-6 h-6 text-brand-gray-purple-2"
					/>
				</div>
				<div className="w-32 h-32 rounded-full overflow-hidden mb-3 relative bg-gray-100">
					{imageLoading ? (
						<div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-full">
							<Loader height="30" />
						</div>
					) : displayUrl ? (
						// Use regular img tag for uploaded images (server URLs or preview)
						// Key prop forces React to unmount/remount when URL changes, preventing stale image display
						<img
							key={displayUrl}
							src={(() => {
								// Convert relative path to absolute URL if needed
								if (!displayUrl.includes("https://") && !displayUrl.includes("httpss://") && !displayUrl.startsWith("blob:")) {
									if (displayUrl.startsWith("/uploads/")) {
										const apiBase = BASE_API_URL.replace(/\/api\/?$/, "");
										return `${apiBase}${displayUrl}`;
									}
								}
								return displayUrl;
							})()}
							alt="Profile"
							className="w-full h-full object-cover rounded-full"
							loading="eager"
							onError={(e) => {
								console.error("[PROFILE-UPLOAD] Image load error for URL:", displayUrl);
								// Only fallback if it's not already the dummy image
								if (!e.target.src.includes("user-dummy.png")) {
									e.target.onerror = null; // Prevent infinite loop
									e.target.src = "/assets/images/home/user-dummy.png";
								}
							}}
							onLoad={() => {
								console.log("[PROFILE-UPLOAD] Image loaded successfully:", displayUrl);
							}}
						/>
					) : showDummyImage ? (
						<Image
							src="/assets/images/home/user-dummy.png"
							alt="Profile Placeholder"
							fill
							className="object-cover rounded-full"
							sizes="128px"
							priority
						/>
					) : null}
				</div>
			</div>
			<label className="bg-[#a797cc] text-sm text-white px-4 py-3 rounded-xl cursor-pointer hover:bg-[#8ba179] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
				{t('signup.tab20') || "Upload New"}
				<input
					type="file"
					className="hidden"
					accept="image/*"
					onChange={handleImageChange}
					disabled={imageLoading}
				/>
			</label>
		</div>
	);
}
