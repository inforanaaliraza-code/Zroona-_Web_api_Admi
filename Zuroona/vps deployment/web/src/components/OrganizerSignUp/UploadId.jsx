// components/UploadId/UploadId.js
"use client";

import { OrganizerUpdateProfileApi, UploadFileApi } from "@/app/api/setting";
import { useFormik } from "formik";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import * as Yup from "yup";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";
import { showGreenTick } from "@/utils/toastHelpers";
import { useTranslation } from "react-i18next";
import TermsOfServiceModal from "@/components/Modal/TermsOfServiceModal";
import PrivacyPolicyModal from "@/components/Modal/PrivacyPolicyModal";
import { BASE_API_URL } from "@/until";

// Image compression utility
const compressImage = (file, maxWidth = 1920, quality = 0.8) => {
	return new Promise((resolve, reject) => {
		if (!file.type.startsWith('image/')) {
			// For PDFs or non-images, return original file
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

const UploadId = ({ title, buttonName, labelName, onNext, showGovtId }) => {
	const { t } = useTranslation();
	const router = useRouter();
	
	// Refs to store file objects
	const fileRefFront = useRef(null);
	
	// Preview URLs (object URLs for instant preview)
	const [previewUrlFront, setPreviewUrlFront] = useState(null);
	
	// Server URLs (after upload)
	const [serverUrlFront, setServerUrlFront] = useState(null);
	
	// Loading states
	const [fileLoadingFront, setFileLoadingFront] = useState(false);
	const [loading, setLoding] = useState(false);
	
	// File names
	const [fileNameFront, setFileNameFront] = useState(null);
	
	// Terms modals
	const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
	const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

	const formik = useFormik({
		initialValues: {
			govt_id_front: "",
			acceptTerms: false,
			acceptPrivacy: false,
		},
		validationSchema: Yup.object({
			govt_id_front: Yup.string().required(t("signup.tab16") || "CNIC Front is required"),
			acceptTerms: Yup.boolean().oneOf([true], t("signup.tab16") || "You must accept the Terms & Conditions"),
			acceptPrivacy: Yup.boolean().oneOf([true], t("signup.tab16") || "You must accept the Privacy Policy"),
		}),
		onSubmit: async (values, { setFieldTouched, setFieldError }) => {
			// Pre-submit validation with specific error messages
			if (!values.govt_id_front || values.govt_id_front.trim() === "") {
				setFieldTouched("govt_id_front", true);
				setFieldError("govt_id_front", t("signup.govtIdFrontRequired") || "Please upload front side of your ID");
				toast.error(t("signup.govtIdFrontRequired") || "Please upload front side of your ID");
				return;
			}

			if (!values.acceptTerms || !values.acceptPrivacy) {
				setFieldTouched("acceptTerms", true);
				setFieldTouched("acceptPrivacy", true);
				toast.error(t("signup.tab16") || "You must accept the Terms & Conditions and Privacy Policy");
				return;
			}

			setLoding(true);
			try {
				const organizerId = localStorage.getItem("organizer_id");
				if (!organizerId) {
					toast.error(t("common.error") || "Organizer ID not found. Please restart the signup process.");
					setLoding(false);
					return;
				}
				
				const govt_id = values.govt_id_front; // Only front side now
				const payload = {
					organizer_id: organizerId,
					govt_id: govt_id,
					registration_step: 4, // Final step: Upload ID
				};
				
				console.log("[CNIC-UPLOAD] Submitting with organizer_id:", organizerId);

				const response = await OrganizerUpdateProfileApi(payload);
				
				if (response?.status === 1) {
					showGreenTick();
					// Clean up object URLs
					if (previewUrlFront && typeof URL !== "undefined" && URL.revokeObjectURL) {
						try {
							URL.revokeObjectURL(previewUrlFront);
						} catch (error) {
							console.warn("UploadId: Error revoking front URL after upload", error);
						}
					}
					// Clear localStorage items used during registration
					localStorage.removeItem("organizer_id");
					localStorage.removeItem("organizer_personal_info");
					localStorage.removeItem("organizer_bank_info");
					localStorage.removeItem("organizer_cnic");
					onNext?.();
				} else {
					toast.error(response?.message || t("common.error") || "Failed to upload CNIC");
				}
			} catch (error) {
				console.error("[CNIC-UPLOAD] Error:", error);
				toast.error(error?.response?.data?.message || t("common.error") || "Failed to save CNIC");
			} finally {
				setLoding(false);
			}
		},
	});

	// Optimized file handler with compression
	const handleFile = useCallback(async (file) => {
		if (!file) {
			toast.error(t("signup.selectFile") || "Please select a file");
			return;
		}

		// Validate file type
		const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
		if (!validTypes.includes(file.type)) {
			toast.error(t("signup.validImageOrPdf") || "Please upload a valid image (JPG, PNG, WebP) or PDF file");
			return;
		}

		// Validate file size (max 5MB)
		const maxSize = 5 * 1024 * 1024;
		if (file.size > maxSize) {
			toast.error(t("signup.fileSizeLimit") || "File size should be less than 5MB");
			return;
		}

		// Set loading state (only front now)
		setFileLoadingFront(true);
		setFileNameFront(file.name);
		fileRefFront.current = file;

		// Create instant preview URL
		const previewUrl = createPreviewUrl(file);
		// Revoke old URL if exists
		if (previewUrlFront && typeof URL !== "undefined" && URL.revokeObjectURL) {
			try {
				URL.revokeObjectURL(previewUrlFront);
			} catch (error) {
				console.warn("UploadId: Error revoking old front URL", error);
			}
		}
		setPreviewUrlFront(previewUrl);

		try {
			// Compress image before upload (only for images, not PDFs)
			let fileToUpload = file;
			if (file.type.startsWith('image/')) {
				fileToUpload = await compressImage(file, 1920, 0.85);
			}

			// Upload to server
			const resp = await UploadFileApi({ file: fileToUpload, dirName: "Zuroona" });
			
			if (resp?.status === 1 && resp?.data?.location) {
				const imageUrl = resp.data.location;
				
				// Store server URL for form submission, but keep previewUrl for display
				// Preview URL (blob) will be used until form is successfully submitted
				
				// Store server URL in formik for form submission
				formik.setFieldValue("govt_id_front", imageUrl);
				setServerUrlFront(imageUrl);
				setFileLoadingFront(false);
				
				// Update localStorage with server URL for persistence
				const cnicData = JSON.parse(localStorage.getItem("organizer_cnic") || "{}");
				cnicData.front = imageUrl;
				localStorage.setItem("organizer_cnic", JSON.stringify(cnicData));
				
				showGreenTick();
				// Note: previewUrlFront is kept for display - it will be cleared only when form is submitted successfully
			} else {
				throw new Error(resp?.message || resp?.error || "Upload failed");
			}
		} catch (error) {
			console.error(`[CNIC-UPLOAD] upload error:`, error);
			const errorMsg = error?.response?.data?.message || 
							error?.response?.data?.error || 
							error?.message || 
							"File upload failed. Please try again.";
			toast.error(errorMsg);
			
			// Reset state on error
			setFileLoadingFront(false);
			setFileNameFront(null);
			setPreviewUrlFront(null);
			fileRefFront.current = null;
		}
	}, [previewUrlFront, formik]);

	const handleFileChange = useCallback((e) => {
		const file = e.target.files?.[0];
			if (file) {
			handleFile(file);
		}
		// Reset input to allow selecting same file again
		e.target.value = '';
	}, [handleFile]);

	// Load saved data from localStorage (only once)
	useEffect(() => {
		// Only run on client side
		if (typeof window === "undefined" || typeof localStorage === "undefined") {
			return;
		}

		const savedCnicData = localStorage.getItem("organizer_cnic");
		if (savedCnicData) {
			try {
				const cnicData = JSON.parse(savedCnicData);
				if (cnicData.front && !formik.values.govt_id_front) {
					// Only set server URL if it's not a blob URL (blob URLs don't persist across reloads)
					if (!cnicData.front.startsWith('blob:')) {
						setServerUrlFront(cnicData.front);
						formik.setFieldValue("govt_id_front", cnicData.front);
					}
				}
				if (cnicData.back && !formik.values.govt_id_back) {
					// Only set server URL if it's not a blob URL
					if (!cnicData.back.startsWith('blob:')) {
						setServerUrlBack(cnicData.back);
						formik.setFieldValue("govt_id_back", cnicData.back);
					}
				}
			} catch (error) {
				console.error("[CNIC-UPLOAD] Error parsing localStorage:", error);
			}
		}

		// Also check showGovtId prop if provided
		if (showGovtId && !savedCnicData) {
			if (Array.isArray(showGovtId)) {
				if (showGovtId[0] && !formik.values.govt_id_front) {
					// Only set server URL if it's not a blob URL
					if (!showGovtId[0].startsWith('blob:')) {
						setServerUrlFront(showGovtId[0]);
						formik.setFieldValue("govt_id_front", showGovtId[0]);
					}
				}
				if (showGovtId[1] && !formik.values.govt_id_back) {
					// Only set server URL if it's not a blob URL
					if (!showGovtId[1].startsWith('blob:')) {
						setServerUrlBack(showGovtId[1]);
						formik.setFieldValue("govt_id_back", showGovtId[1]);
					}
				}
			} else if (typeof showGovtId === 'string') {
				const ids = showGovtId.split(',');
				if (ids[0] && !formik.values.govt_id_front) {
					const frontUrl = ids[0].trim();
					// Only set server URL if it's not a blob URL
					if (!frontUrl.startsWith('blob:')) {
						setServerUrlFront(frontUrl);
						formik.setFieldValue("govt_id_front", frontUrl);
					}
				}
				if (ids[1] && !formik.values.govt_id_back) {
					const backUrl = ids[1].trim();
					// Only set server URL if it's not a blob URL
					if (!backUrl.startsWith('blob:')) {
						setServerUrlBack(backUrl);
						formik.setFieldValue("govt_id_back", backUrl);
					}
				}
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Run only once on mount

	// Cleanup object URLs on unmount
	useEffect(() => {
		return () => {
			if (previewUrlFront && typeof URL !== "undefined" && URL.revokeObjectURL) {
				try {
					URL.revokeObjectURL(previewUrlFront);
				} catch (error) {
					// Silently handle errors (e.g., URL already revoked)
					console.warn("UploadId: Error revoking front preview URL", error);
				}
			}
		};
	}, [previewUrlFront]);

	// Helper function to convert relative path to absolute URL
	const getImageUrl = (url) => {
		if (!url) return null;
		// If already absolute URL or blob URL, return as is
		if (url.includes("https://") || url.includes("httpss://") || url.startsWith("blob:")) {
			return url;
		}
		// If relative path (starts with /uploads/), construct absolute URL
		if (url.startsWith("/uploads/")) {
			const apiBase = BASE_API_URL.replace(/\/api\/?$/, "");
			return `${apiBase}${url}`;
		}
		return url;
	};

	// Memoized display URL (prefer preview URL for display, fallback to server URL)
	// IMPORTANT: Always prefer previewUrl (blob) for display until form is submitted
	// This prevents 404 errors from server URLs that don't exist yet
	// Server URL is stored separately for form submission
	const displayUrlFront = useMemo(() => {
		const url = previewUrlFront || serverUrlFront;
		return url ? getImageUrl(url) : null;
	}, [previewUrlFront, serverUrlFront]);
	

	return (
		<div className="flex-grow bg-white h-max p-5 sm:p-7 rounded-xl">
			<h1 className="text-xl font-bold mb-4">{title}</h1>

			<form onSubmit={formik.handleSubmit}>
				{/* CNIC Front Upload */}
				<div className="mb-6">
					<label className="block text-gray-700 text-sm font-semibold mb-2">
						{t("signup.cnicFront") || "CNIC Front"} *
					</label>

					<label htmlFor="file-upload-front" className="w-full cursor-pointer">
						<div className="w-full h-52 border-2 bg-[#fdfdfd] border-[#a797cc] rounded-lg flex items-center justify-center mb-2 overflow-hidden">
							<div className="text-center w-full h-full">
								{fileLoadingFront ? (
									<div className="w-full h-full flex items-center justify-center">
										<Loader height="30" />
									</div>
								) : (
									<div className="flex flex-col items-center justify-center h-full">
										{fileNameFront?.toLowerCase().endsWith(".pdf") ? (
											<Image
												src="/assets/images/icons/pdf.png"
												height={35}
												width={35}
												alt="PDF Icon"
												priority
											/>
										) : displayUrlFront ? (
											<div className="relative w-full h-full max-h-[200px] flex items-center justify-center">
												{/* Use regular img tag for uploaded images (blob URLs or server URLs) */}
												<img
													key={displayUrlFront}
													src={getImageUrl(displayUrlFront) || displayUrlFront}
													alt="CNIC Front"
													className="max-w-full max-h-full object-contain rounded"
													loading="eager"
													onError={(e) => {
														// Fallback to upload icon if image fails to load
														e.target.style.display = "none";
														e.target.nextElementSibling?.style?.removeProperty("display");
													}}
												/>
											</div>
										) : (
											<Icon
												icon="lucide:upload"
												className="w-24 h-16 text-[#a797cc]"
											/>
										)}
										<p className="text-gray-500 text-sm mt-3">
											{t("signup.uploadCnicFront") || "Upload CNIC Front Side"}
										</p>
									</div>
								)}
								{fileNameFront?.toLowerCase().endsWith(".pdf") && (
									<p className="text-gray-600 text-xs mt-2">
										{t("signup.uploaded") || "Uploaded"}: {fileNameFront}
									</p>
								)}
							</div>
						</div>
						<input
							id="file-upload-front"
							type="file"
							accept="image/*,application/pdf"
							className="hidden"
							onChange={handleFileChange}
							disabled={fileLoadingFront}
						/>
					</label>
					{formik.errors.govt_id_front && formik.touched.govt_id_front && (
						<p className="text-red-500 text-xs mt-1 font-semibold">
							{formik.errors.govt_id_front}
						</p>
					)}
				</div>

				{/* Terms and Conditions & Privacy Policy - Moved to last step */}
				<div className="mb-6">
					<div className="flex items-start gap-3">
						<div className="flex items-center h-5">
							<input
								id="acceptTermsAndPrivacy"
								type="checkbox"
								className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-[#a797cc] text-[#a797cc]"
								checked={formik.values.acceptTerms && formik.values.acceptPrivacy}
								onChange={(e) => {
									const isChecked = e.target.checked;
									formik.setFieldValue("acceptTerms", isChecked);
									formik.setFieldValue("acceptPrivacy", isChecked);
									formik.setFieldTouched("acceptTerms", true);
									formik.setFieldTouched("acceptPrivacy", true);
								}}
							/>
						</div>
						<div className="ml-3 text-sm">
							<label
								htmlFor="acceptTermsAndPrivacy"
								className="font-medium text-gray-900 cursor-pointer"
							>
								{t("signup.tab22") || "By signing up, you agree to our"}{" "}
								<button
									type="button"
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										setIsTermsModalOpen(true);
									}}
									className="text-[#a797cc] hover:underline font-semibold focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:ring-offset-1 rounded"
								>
									{t("signup.tab23") || "Terms & Conditions"}
								</button>
								{" "}{t("signup.tab24") || "and"}{" "}
								<button
									type="button"
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										setIsPrivacyModalOpen(true);
									}}
									className="text-[#a797cc] hover:underline font-semibold focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:ring-offset-1 rounded"
								>
									{t("signup.tab25") || "Privacy Policy"}
								</button>
								<span className="text-red-500 ml-1">*</span>
							</label>
							{(formik.touched.acceptTerms && formik.errors.acceptTerms) || 
							 (formik.touched.acceptPrivacy && formik.errors.acceptPrivacy) ? (
								<p className="text-red-500 text-xs mt-1 font-semibold">
									{formik.errors.acceptTerms || formik.errors.acceptPrivacy || 
									 "You must accept the Terms & Conditions and Privacy Policy"}
								</p>
							) : null}
						</div>
					</div>
				</div>

				{/* Submit Button */}
				<div className="px-10 mt-10">
					<button
						type="submit"
						className="w-full py-4 bg-[#a797cc] text-white font-semibold rounded-xl hover:bg-[#8ba179] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={loading || fileLoadingFront}
					>
						{loading ? (
							<Loader color="#fff" height="30" />
						) : (
							buttonName
						)}
					</button>
				</div>
			</form>
			
			{/* Terms & Conditions and Privacy Policy Modals */}
			<TermsOfServiceModal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} />
			<PrivacyPolicyModal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} />
		</div>
	);
};

export default UploadId;
