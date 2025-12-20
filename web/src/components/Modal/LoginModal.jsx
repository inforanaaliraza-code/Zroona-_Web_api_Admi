"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

import Modal from "../common/Modal";
import Loader from "../Loader/Loader";
import { LoginApi } from "@/app/api/setting";
import { TOKEN_NAME } from "@/until";
import useAuthStore from "@/store/useAuthStore";

export default function LoginModal({ isOpen, onClose, returnUrl = "/" }) {
	const { t, i18n } = useTranslation();
	const { push } = useRouter();
	const [loading, setLoading] = useState(false);
	const [showResendLink, setShowResendLink] = useState(false);
	const login = useAuthStore((state) => state.login);

	const validationSchema = Yup.object({
		email: Yup.string()
			.required(t("auth.emailRequired") || "Email is required")
			.email(t("auth.emailInvalid") || "Invalid email address"),
		password: Yup.string()
			.required(t("auth.passwordRequired") || "Password is required"),
	});

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		validationSchema,
		onSubmit: async (values) => {
			setLoading(true);
			setShowResendLink(false);

			try {
				const loginPayload = {
					email: values.email.toLowerCase().trim(),
					password: values.password,
				};

				console.log("[LOGIN-MODAL] Attempting login for:", loginPayload.email);

				const response = await LoginApi(loginPayload);

				console.log("[LOGIN-MODAL] Response:", response);

				if (response?.status === 1 || response?.status === true || response?.data?.token) {
					const token = response?.data?.token || response?.token;
					const user = response?.data?.user || response?.data?.organizer || response?.data?.result;

					if (!user) {
						toast.error(t("auth.loginFailed") || "Login failed. User data not found.");
						return;
					}

					// Store token
					Cookies.set(TOKEN_NAME, token, { expires: 30 });

					// Store role in localStorage
					if (user.role) {
						localStorage.setItem("user_role", user.role.toString());
						console.log("[LOGIN-MODAL] Role stored in localStorage:", user.role);
					}

					// Update auth store
					login(token, user);

					toast.success(
						response.message || 
						t("auth.loginSuccess") || 
						"Login successful!"
					);

					// Close modal
					onClose();

					// Navigate based on role or returnUrl
					if (returnUrl && returnUrl !== "/") {
						push(returnUrl);
					} else if (user.role === 2) {
						// Organizer/Host
						push("/joinUsEvent");
					} else if (user.role === 1) {
						// Guest
						push("/events");
					} else {
						push("/events");
					}
				} else {
					const errorMessage = response?.message || 
						t("auth.loginFailed") || 
						"Login failed. Please try again.";
					
					toast.error(errorMessage);

					// Check for approval-related errors
					if (errorMessage.toLowerCase().includes("approval") || 
						errorMessage.toLowerCase().includes("pending") ||
						errorMessage.toLowerCase().includes("rejected") ||
						errorMessage.toLowerCase().includes("not approved")) {
						// Don't show resend link for approval issues
						setShowResendLink(false);
					} else if (errorMessage.toLowerCase().includes("verify") || 
						errorMessage.toLowerCase().includes("verification") ||
						errorMessage.toLowerCase().includes("not verified")) {
						setShowResendLink(true);
					}
				}
			} catch (error) {
				console.error("[LOGIN-MODAL] Error:", error);
				
				const errorMessage = error?.response?.data?.message || 
					error?.message || 
					t("auth.loginError") || 
					"An error occurred. Please try again.";
				
				toast.error(errorMessage);

				// Check for approval-related errors
				if (errorMessage.toLowerCase().includes("approval") || 
					errorMessage.toLowerCase().includes("pending") ||
					errorMessage.toLowerCase().includes("rejected") ||
					errorMessage.toLowerCase().includes("not approved")) {
					// Don't show resend link for approval issues
					setShowResendLink(false);
				} else if (errorMessage.toLowerCase().includes("verify") || 
					errorMessage.toLowerCase().includes("verification") ||
					errorMessage.toLowerCase().includes("not verified")) {
					setShowResendLink(true);
				}
			} finally {
				setLoading(false);
			}
		},
	});

	const handleResendVerification = async () => {
		if (!formik.values.email) {
			toast.error(t("auth.enterEmailFirst") || "Please enter your email first");
			return;
		}

		setLoading(true);

		try {
			const axios = require("axios");
			const { BASE_API_URL } = require("@/until");

			const response = await axios.post(
				`${BASE_API_URL}user/resend-verification`,
				{
					email: formik.values.email.toLowerCase().trim(),
				},
				{
					headers: {
						"Content-Type": "application/json",
						lang: i18n.language || "en",
					},
				}
			);

			if (response.data?.status === 1) {
				toast.success(
					t("auth.verificationEmailResent") || 
					"Verification email sent! Please check your inbox."
				);
				setShowResendLink(false);
			} else {
				toast.error(
					response.data?.message || 
					t("auth.resendFailed") || 
					"Failed to resend verification email"
				);
			}
		} catch (error) {
			console.error("[RESEND] Error:", error);
			toast.error(
				error?.response?.data?.message || 
				t("auth.resendError") || 
				"An error occurred while resending verification email"
			);
		} finally {
			setLoading(false);
		}
	};

	// Reset form when modal is closed
	const handleModalClose = () => {
		formik.resetForm();
		setShowResendLink(false);
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={handleModalClose} width="lg">
			<div className="overflow-hidden relative bg-white rounded-2xl">
				{/* Decorative pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/10 to-transparent">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(theme('colors.brand-orange') 0.5px, transparent 0.5px), radial-gradient(theme('colors.brand-orange') 0.5px, transparent 0.5px)`,
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0,10px 10px",
              opacity: "0.1",
              zIndex: 0,
            }}
					></div>
				</div>

				<div className="relative z-10 p-8">
					<div className="mx-auto max-w-md">
						{/* Logo */}
						<div className="flex justify-center mb-6">
							<Image
								src="/assets/images/main-logo.png"
								alt="Zuroona Logo"
								width={134}
								height={45}
								className="h-auto"
							/>
						</div>

						{/* Header */}
						<div className="text-center mb-8">
							<h2 className="text-2xl font-bold text-gray-900">
								{t("login.tab1") || t("auth.welcomeBack") || "Login"}
							</h2>
						</div>

						{/* Form */}
						<form onSubmit={formik.handleSubmit} className="space-y-6">
							{/* Email Field */}
							<div>
								<label className="block mb-2 text-sm font-medium text-gray-700">
									{t("auth.email") || "Email"} *
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Icon icon="material-symbols:mail" className="w-5 h-5 text-brand-orange" />
									</div>
									<input
										type="email"
										name="email"
										value={formik.values.email}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
                                        className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent ${
											formik.touched.email && formik.errors.email
												? "border-red-500"
												: "border-gray-300"
										}`}
										placeholder={t("auth.emailPlaceholder") || "Enter your email"}
										disabled={loading}
										autoComplete="email"
									/>
								</div>
								{formik.touched.email && formik.errors.email && (
									<p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
								)}
							</div>

							{/* Password Field */}
							<div>
								<label className="block mb-2 text-sm font-medium text-gray-700">
									{t("auth.password") || "Password"} *
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Icon icon="material-symbols:lock" className="w-5 h-5 text-brand-orange" />
									</div>
									<input
										type="password"
										name="password"
										value={formik.values.password}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
                                        className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent ${
											formik.touched.password && formik.errors.password
												? "border-red-500"
												: "border-gray-300"
										}`}
										placeholder={t("auth.enterPassword") || "Enter your password"}
										disabled={loading}
										autoComplete="current-password"
									/>
								</div>
								{formik.touched.password && formik.errors.password && (
									<p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
								)}
							</div>

							{/* Resend Verification Link */}
							{showResendLink && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
								>
									<div className="flex items-start">
										<Icon icon="material-symbols:info" className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
										<div className="flex-1">
											<p className="text-sm text-yellow-800 mb-2">
												{t("auth.emailNotVerified") || "Your email is not verified yet."}
											</p>
											<button
												type="button"
												onClick={handleResendVerification}
												disabled={loading}
												className="text-sm font-semibold text-yellow-700 hover:text-yellow-900 underline"
											>
												{t("auth.resendVerificationEmail") || "Resend Verification Email"}
											</button>
										</div>
									</div>
								</motion.div>
							)}

							{/* Submit Button */}
							<button
								type="submit"
								disabled={loading || !formik.isValid}
								className="w-full bg-[#a797cc] text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
							>
								{loading ? (
									<>
										<Loader />
										<span>{t("auth.loggingIn") || "Logging in..."}</span>
									</>
								) : (
									<>
										<Icon icon="material-symbols:login" className="w-5 h-5" />
										<span>{t("login.tab1") || t("auth.login") || "Login"}</span>
									</>
								)}
							</button>

							{/* Sign Up Link */}
							<div className="flex gap-2 justify-center items-center text-sm">
								<span className="text-gray-600">{t("auth.dontHaveAccount") || "Don't have an account?"}</span>
								<Link href="/signup" className="text-brand-orange font-medium hover:text-brand-orange/90">
									{t("header.tab4") || "Sign Up"}
								</Link>
							</div>
						</form>
					</div>
				</div>
			</div>
		</Modal>
	);
}
