"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import OTPInput from "react-otp-input";
import Modal from "../common/Modal";
import { OTPVerificationApi, ResendOtpApi } from "@/app/api/setting"; // Make sure to import the resend API function
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { TOKEN_NAME } from "@/until";
import { getProfile } from "@/redux/slices/profileInfo";
import { useDispatch } from "react-redux";
import Loader from "../Loader/Loader";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import useAuthStore from "@/store/useAuthStore";

export default function OtpVerificationModal({
	isOpen,
	onClose,
	token,
	phoneNumber,
	countryCode,
	returnUrl = null,
}) {
	const { t } = useTranslation();
	const [loading, setLoading] = useState(false);
	const [seconds, setSeconds] = useState(30);
	const [timerActive, setTimerActive] = useState(false);
	const { push } = useRouter();
	const dispatch = useDispatch();

	// Add useEffect hook to check localStorage after state changesa
	useEffect(() => {
		// Don't do anything on initial render
		if (!isOpen) return;
	}, [isOpen]);

	useEffect(() => {
		let timer;
		if (isOpen && seconds > 0) {
			setTimerActive(true);
			timer = setInterval(() => {
				setSeconds((prev) => {
					if (prev <= 1) {
						clearInterval(timer);
						setTimerActive(false);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		}
		return () => clearInterval(timer); // Cleanup on unmount or modal close
	}, [isOpen, seconds]);

	const formik = useFormik({
		initialValues: { otp: "" },
		validationSchema: Yup.object({
			otp: Yup.string().required(t("OTP.tab7")).length(6, t("OTP.tab8")),
		}),
		onSubmit: (values) => {
			setLoading(true);
			const payload = {
				otp: Number(values.otp),
			};

			OTPVerificationApi(payload, token)
				.then((data) => {
					setLoading(false);

					if (data?.status == 1) {
						// First dispatch getProfile to update Redux state
						dispatch(getProfile());

						// Set authentication state in Zustand store
						useAuthStore
							.getState()
							.login(data?.data?.token, data?.data?.user);

						// Also set cookie for backward compatibility
						Cookies.set(TOKEN_NAME, data?.data?.token);

					// Show success message
					toast.success(data.message);

					// Close modal
					onClose();

					// If returnUrl is provided, use it first
					if (returnUrl) {
						push(returnUrl);
					} else {
						// Redirect based on user role and registration step
						if (data?.data?.user?.role == 1) {
							push("/events");
						} else if (data?.data?.user?.role == 2) {
							if (data?.data?.user?.registration_step == 1) {
								push("/organizerSignup/otherInfo");
							} else if (
								data?.data?.user?.registration_step == 2
							) {
								push("/organizerSignup/interviewQ");
							} else if (
								data?.data?.user?.registration_step == 3
							) {
								push("/organizerSignup/bankDetail");
							} else if (
								data?.data?.user?.registration_step == 4
							) {
								push("/joinUsEvent");
							} else {
								toast.error(
									"You are not authorized to access this page."
								);
							}
						} else {
							toast.error(
								"You are not authorized to access this page."
							);
						}
					}
					} else {
						toast.error(data.message);
					}
				})
				.catch((error) => {
					setLoading(false);
					toast.error("An error occurred during verification.");
				});
		},
	});

	const resendCode = () => {
		ResendOtpApi({
			phone_number: phoneNumber,
			country_code: countryCode,
		})
			.then((data) => {
				if (data?.status === 1) {
					toast.success(data?.message);
					setSeconds(30); // Reset the timer
					setTimerActive(true);
				} else {
					toast.error(data?.message);
				}
			})
			.catch((error) => {
				toast.error("Failed to resend OTP. Please try again.");
			});
	};

	const handleClose = () => {
		formik.resetForm(); // Reset form values
		onClose(); // Call the onClose function to close the modal
	};

	// Animation variants
	const fadeIn = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				duration: 0.3,
			},
		},
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose} width="lg">
			<div className="relative overflow-hidden bg-white rounded-2xl">
				{/* Background pattern */}
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
					<div className="max-w-md mx-auto">
						<div className="flex justify-center mb-6">
              <Image
                src="/assets/images/main-logo.png"
                alt="Zuroona Logo"
								width={134}
								height={45}
								className="h-auto"
							/>
						</div>

						<motion.div
							initial="hidden"
							animate="visible"
							variants={fadeIn}
							className="text-center"
						>
							<div className="flex items-center justify-center gap-3 mb-7">
								<div className="flex items-center gap-2">
									<div className="w-[40px]">
										<Image
											src="/assets/images/login/otp-img.png"
											alt="OTP"
											width={59}
											height={37}
											className="w-full h-auto"
										/>
									</div>
									<h2 className="text-base font-semibold whitespace-nowrap sm:text-xl">
										{t("OTP.tab1")}
									</h2>
								</div>
							</div>

							<p className="mb-6 text-sm text-gray-600">
								{t("OTP.tab2")} <br />
								<span className="font-medium text-gray-800">
									{countryCode} {phoneNumber}
								</span>
							</p>

							<form
								onSubmit={formik.handleSubmit}
								className="space-y-6"
							>
								<div className="flex justify-center my-4 space-x-2 sm:space-x-4 passcode-wrapper">
									<OTPInput
										containerStyle="flex gap-2 md:gap-5 justify-center"
										value={formik.values.otp}
										onChange={(val) => {
											// Allow only numeric values
											const numericVal = val.replace(
												/[^0-9]/g,
												""
											);
											formik.setFieldValue(
												"otp",
												numericVal
											);
										}}
										inputStyle={{
											width: "3rem",
											height: "3rem",
											textAlign: "center",
											border: "1px solid #d1d5db",
											borderRadius: "10px",
											fontSize: "1rem",
											outline: "none",
                          color: "theme('colors.brand-orange')",
                          borderColor:
												formik.errors.otp &&
												formik.touched.otp
													? "#bc611ebd"
													: "#d1d5db",
										}}
										numInputs={6}
										separator={<span> </span>}
										shouldAutoFocus={true}
										renderInput={(props) => (
											<input
												{...props}
												inputMode="numeric"
												onInput={(e) => {
													e.target.value =
														e.target.value.replace(
															/[^0-9]/g,
															""
														);
												}}
											/>
										)}
									/>
								</div>
                    {formik.errors.otp && formik.touched.otp && (
                      <p className="text-brand-orange text-center text-xs mt-2 font-semibold">
										{formik.errors.otp}
									</p>
								)}

								<div className="flex items-center justify-center my-4">
                      <span className="text-brand-orange text-sm">
										00:
										{seconds > 9
											? seconds
											: `0${seconds}`}{" "}
									</span>
								</div>

								<button
                      type="submit"
                      className="w-full bg-primary text-white font-semibold py-3 rounded-xl shadow-sm hover:shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									disabled={
										loading ||
										formik.values.otp.length !== 6
									}
								>
									{loading ? (
										<Loader color="#fff" height="25" />
									) : (
										t("OTP.tab6")
									)}
								</button>
							</form>

							<div className="mt-4 text-sm text-center text-gray-800">
								{t("OTP.tab4")}{" "}
								{!timerActive && (
                      <span
                        className="text-brand-orange underline cursor-pointer"
										onClick={resendCode}
									>
										{t("OTP.tab5")}
									</span>
								)}
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</Modal>
	);
}
