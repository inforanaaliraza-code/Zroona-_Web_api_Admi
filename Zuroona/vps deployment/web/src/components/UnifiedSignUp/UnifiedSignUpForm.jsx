"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { TOKEN_NAME } from "@/until";
import { SignUpApi, OrganizerSignUpApi } from "@/app/api/setting";
import { NumberInput } from "@/components/ui/number-input";
import { DatePickerTime } from "@/components/ui/date-picker-time";
import ProfileImageUpload from "../ProfileImageUpload/ProfileImageUpload";
import OtpVerificationModal from "../Modal/OtpVerificationModal";
import Loader from "../Loader/Loader";
import Steper from "../Steper/Steper";
import { Icon } from "@iconify/react";

const ACCOUNT_TYPES = {
	USER: "user",
	ORGANIZER: "organizer",
};

const countries = [
	{ code: "AF", name: "Afghanistan" },
	{ code: "AL", name: "Albania" },
	{ code: "DZ", name: "Algeria" },
	{ code: "AD", name: "Andorra" },
	{ code: "AO", name: "Angola" },
	{ code: "AG", name: "Antigua and Barbuda" },
	{ code: "AR", name: "Argentina" },
	{ code: "AM", name: "Armenia" },
	{ code: "AU", name: "Australia" },
	{ code: "AT", name: "Austria" },
	{ code: "AZ", name: "Azerbaijan" },
	{ code: "BS", name: "Bahamas" },
	{ code: "BH", name: "Bahrain" },
	{ code: "BD", name: "Bangladesh" },
	{ code: "BB", name: "Barbados" },
	{ code: "BY", name: "Belarus" },
	{ code: "BE", name: "Belgium" },
	{ code: "BZ", name: "Belize" },
	{ code: "BJ", name: "Benin" },
	{ code: "BT", name: "Bhutan" },
	{ code: "BO", name: "Bolivia" },
	{ code: "BA", name: "Bosnia and Herzegovina" },
	{ code: "BW", name: "Botswana" },
	{ code: "BR", name: "Brazil" },
	{ code: "BN", name: "Brunei" },
	{ code: "BG", name: "Bulgaria" },
	{ code: "BF", name: "Burkina Faso" },
	{ code: "BI", name: "Burundi" },
	{ code: "CV", name: "Cabo Verde" },
	{ code: "KH", name: "Cambodia" },
	{ code: "CM", name: "Cameroon" },
	{ code: "CA", name: "Canada" },
	{ code: "CF", name: "Central African Republic" },
	{ code: "TD", name: "Chad" },
	{ code: "CL", name: "Chile" },
	{ code: "CN", name: "China" },
	{ code: "CO", name: "Colombia" },
	{ code: "KM", name: "Comoros" },
	{ code: "CG", name: "Congo" },
	{ code: "CR", name: "Costa Rica" },
	{ code: "HR", name: "Croatia" },
	{ code: "CU", name: "Cuba" },
	{ code: "CY", name: "Cyprus" },
	{ code: "CZ", name: "Czech Republic" },
	{ code: "DK", name: "Denmark" },
	{ code: "DJ", name: "Djibouti" },
	{ code: "DM", name: "Dominica" },
	{ code: "DO", name: "Dominican Republic" },
	{ code: "EC", name: "Ecuador" },
	{ code: "EG", name: "Egypt" },
	{ code: "SV", name: "El Salvador" },
	{ code: "GQ", name: "Equatorial Guinea" },
	{ code: "ER", name: "Eritrea" },
	{ code: "EE", name: "Estonia" },
	{ code: "SZ", name: "Eswatini" },
	{ code: "ET", name: "Ethiopia" },
	{ code: "FJ", name: "Fiji" },
	{ code: "FI", name: "Finland" },
	{ code: "FR", name: "France" },
	{ code: "GA", name: "Gabon" },
	{ code: "GM", name: "Gambia" },
	{ code: "GE", name: "Georgia" },
	{ code: "DE", name: "Germany" },
	{ code: "GH", name: "Ghana" },
	{ code: "GR", name: "Greece" },
	{ code: "GD", name: "Grenada" },
	{ code: "GT", name: "Guatemala" },
	{ code: "GN", name: "Guinea" },
	{ code: "GW", name: "Guinea-Bissau" },
	{ code: "GY", name: "Guyana" },
	{ code: "HT", name: "Haiti" },
	{ code: "HN", name: "Honduras" },
	{ code: "HU", name: "Hungary" },
	{ code: "IS", name: "Iceland" },
	{ code: "IN", name: "India" },
	{ code: "ID", name: "Indonesia" },
	{ code: "IR", name: "Iran" },
	{ code: "IQ", name: "Iraq" },
	{ code: "IE", name: "Ireland" },
	{ code: "IL", name: "Israel" },
	{ code: "IT", name: "Italy" },
	{ code: "JM", name: "Jamaica" },
	{ code: "JP", name: "Japan" },
	{ code: "JO", name: "Jordan" },
	{ code: "KZ", name: "Kazakhstan" },
	{ code: "KE", name: "Kenya" },
	{ code: "KI", name: "Kiribati" },
	{ code: "KP", name: "North Korea" },
	{ code: "KR", name: "South Korea" },
	{ code: "KW", name: "Kuwait" },
	{ code: "KG", name: "Kyrgyzstan" },
	{ code: "LA", name: "Laos" },
	{ code: "LV", name: "Latvia" },
	{ code: "LB", name: "Lebanon" },
	{ code: "LS", name: "Lesotho" },
	{ code: "LR", name: "Liberia" },
	{ code: "LY", name: "Libya" },
	{ code: "LI", name: "Liechtenstein" },
	{ code: "LT", name: "Lithuania" },
	{ code: "LU", name: "Luxembourg" },
	{ code: "MG", name: "Madagascar" },
	{ code: "MW", name: "Malawi" },
	{ code: "MY", name: "Malaysia" },
	{ code: "MV", name: "Maldives" },
	{ code: "ML", name: "Mali" },
	{ code: "MT", name: "Malta" },
	{ code: "MH", name: "Marshall Islands" },
	{ code: "MR", name: "Mauritania" },
	{ code: "MU", name: "Mauritius" },
	{ code: "MX", name: "Mexico" },
	{ code: "FM", name: "Micronesia" },
	{ code: "MD", name: "Moldova" },
	{ code: "MC", name: "Monaco" },
	{ code: "MN", name: "Mongolia" },
	{ code: "ME", name: "Montenegro" },
	{ code: "MA", name: "Morocco" },
	{ code: "MZ", name: "Mozambique" },
	{ code: "MM", name: "Myanmar" },
	{ code: "NA", name: "Namibia" },
	{ code: "NR", name: "Nauru" },
	{ code: "NP", name: "Nepal" },
	{ code: "NL", name: "Netherlands" },
	{ code: "NZ", name: "New Zealand" },
	{ code: "NI", name: "Nicaragua" },
	{ code: "NE", name: "Niger" },
	{ code: "NG", name: "Nigeria" },
	{ code: "MK", name: "North Macedonia" },
	{ code: "NO", name: "Norway" },
	{ code: "OM", name: "Oman" },
	{ code: "PK", name: "Pakistan" },
	{ code: "PW", name: "Palau" },
	{ code: "PS", name: "Palestine" },
	{ code: "PA", name: "Panama" },
	{ code: "PG", name: "Papua New Guinea" },
	{ code: "PY", name: "Paraguay" },
	{ code: "PE", name: "Peru" },
	{ code: "PH", name: "Philippines" },
	{ code: "PL", name: "Poland" },
	{ code: "PT", name: "Portugal" },
	{ code: "QA", name: "Qatar" },
	{ code: "RO", name: "Romania" },
	{ code: "RU", name: "Russia" },
	{ code: "RW", name: "Rwanda" },
	{ code: "KN", name: "Saint Kitts and Nevis" },
	{ code: "LC", name: "Saint Lucia" },
	{ code: "VC", name: "Saint Vincent and the Grenadines" },
	{ code: "WS", name: "Samoa" },
	{ code: "SM", name: "San Marino" },
	{ code: "ST", name: "Sao Tome and Principe" },
	{ code: "SA", name: "Saudi Arabia" },
	{ code: "SN", name: "Senegal" },
	{ code: "RS", name: "Serbia" },
	{ code: "SC", name: "Seychelles" },
	{ code: "SL", name: "Sierra Leone" },
	{ code: "SG", name: "Singapore" },
	{ code: "SK", name: "Slovakia" },
	{ code: "SI", name: "Slovenia" },
	{ code: "SB", name: "Solomon Islands" },
	{ code: "SO", name: "Somalia" },
	{ code: "ZA", name: "South Africa" },
	{ code: "SS", name: "South Sudan" },
	{ code: "ES", name: "Spain" },
	{ code: "LK", name: "Sri Lanka" },
	{ code: "SD", name: "Sudan" },
	{ code: "SR", name: "Suriname" },
	{ code: "SE", name: "Sweden" },
	{ code: "CH", name: "Switzerland" },
	{ code: "SY", name: "Syria" },
	{ code: "TW", name: "Taiwan" },
	{ code: "TJ", name: "Tajikistan" },
	{ code: "TZ", name: "Tanzania" },
	{ code: "TH", name: "Thailand" },
	{ code: "TL", name: "Timor-Leste" },
	{ code: "TG", name: "Togo" },
	{ code: "TO", name: "Tonga" },
	{ code: "TT", name: "Trinidad and Tobago" },
	{ code: "TN", name: "Tunisia" },
	{ code: "TR", name: "Turkey" },
	{ code: "TM", name: "Turkmenistan" },
	{ code: "TV", name: "Tuvalu" },
	{ code: "UG", name: "Uganda" },
	{ code: "UA", name: "Ukraine" },
	{ code: "AE", name: "United Arab Emirates" },
	{ code: "GB", name: "United Kingdom" },
	{ code: "US", name: "United States" },
	{ code: "UY", name: "Uruguay" },
	{ code: "UZ", name: "Uzbekistan" },
	{ code: "VU", name: "Vanuatu" },
	{ code: "VA", name: "Vatican City" },
	{ code: "VE", name: "Venezuela" },
	{ code: "VN", name: "Vietnam" },
	{ code: "YE", name: "Yemen" },
	{ code: "ZM", name: "Zambia" },
	{ code: "ZW", name: "Zimbabwe" },
];

export default function UnifiedSignUpForm({
	defaultType = ACCOUNT_TYPES.USER,
	onSuccess,
	showBySigning = false,
	currentStep = 1,
	hideSteper = false,
}) {
	const [accountType, setAccountType] = useState(defaultType);
	const [loading, setLoading] = useState(false);
	const [isOtpOpen, setIsOtpOpen] = useState(false);
	const [token, setToken] = useState("");
	const { t, i18n } = useTranslation();

	const closeOtpModal = () => setIsOtpOpen(false);

	const formik = useFormik({
		initialValues: {
			profile_image: "",
			first_name: "",
			last_name: "",
			email: "",
			country_code: "+966",
			phone_number: "",
			gender: "",
			nationality: "",
			date_of_birth: "",
			description: "",
			bio: "",
			termsAccepted: false,
		},
		validationSchema: Yup.object({
			// For organizer, require email, phone, and terms (passwordless)
					...(accountType === ACCOUNT_TYPES.ORGANIZER
						? {
								email: Yup.string()
									.required(t("signup.tab16"))
									.test('gmail-only', "Only Gmail addresses are allowed. Please use an email ending with @gmail.com", function(value) {
										if (!value) return true;
										const emailLower = value.toLowerCase().trim();
										return emailLower.endsWith('@gmail.com');
									})
									.test('gmail-format', "Invalid Gmail address format", function(value) {
										if (!value) return true;
										const emailLower = value.toLowerCase().trim();
										const localPart = emailLower.split('@')[0];
										if (!localPart) return false;
										return /^[a-z0-9.+]+$/.test(localPart);
									})
									.email("Invalid email"),
								phone_number: Yup.string()
									.required(t("signup.tab16")),
								termsAccepted: Yup.boolean()
									.oneOf([true], "Terms must be accepted")
									.required("Terms must be accepted"),
						  }
				: {
						// For user, require all fields
						first_name: Yup.string().required(t("signup.tab16")),
						last_name: Yup.string().required(t("signup.tab16")),
						email: Yup.string()
							.required(t("signup.tab16"))
							.test('gmail-only', "Only Gmail addresses are allowed. Please use an email ending with @gmail.com", function(value) {
								if (!value) return true;
								const emailLower = value.toLowerCase().trim();
								return emailLower.endsWith('@gmail.com');
							})
							.test('gmail-format', "Invalid Gmail address format", function(value) {
								if (!value) return true;
								const emailLower = value.toLowerCase().trim();
								const localPart = emailLower.split('@')[0];
								if (!localPart) return false;
								return /^[a-z0-9.+]+$/.test(localPart);
							})
							.email("Invalid email"),
						phone_number: Yup.string().required(t("signup.tab16")),
						gender: Yup.string().required(t("signup.tab16")),
						nationality: Yup.string().required(t("signup.tab16")),
						date_of_birth: Yup.string().required(t("signup.tab16")),
						description: Yup.string().required(t("signup.tab16")),
				  }),
		}),
		onSubmit: async (values) => {
			setLoading(true);
			try {
				// const formData = new FormData();
				// Object.keys(values).forEach((key) => {
				//   if (values[key] !== null && values[key] !== "") {
				//     formData.append(key, values[key]);
				//   }
				// });

				const api =
					accountType === ACCOUNT_TYPES.USER
						? SignUpApi
						: OrganizerSignUpApi;
				
				// For organizer, combine personal info from Step 1 with email/phone from Step 2 (passwordless)
				let payload;
				if (accountType === ACCOUNT_TYPES.ORGANIZER) {
					// Get personal info from localStorage (stored in Step 1)
					const personalInfoStr = localStorage.getItem("organizer_personal_info");
					const personalInfo = personalInfoStr ? JSON.parse(personalInfoStr) : {};
					
					// Combine personal info with email/phone (passwordless)
					payload = {
						...personalInfo,
						email: values.email.toLowerCase().trim(),
						phone_number: values.phone_number || personalInfo.phone_number,
						country_code: values.country_code || personalInfo.country_code || "+966",
						registration_step: 4, // Complete registration
						language: i18n.language || "en",
					};
					
					// Clear localStorage after using it
					localStorage.removeItem("organizer_personal_info");
				} else {
					payload = values;
				}
				
				const response = await api(payload);

				console.log("Registration response:", response);

				if (response?.status === 1 || response?.status === true) {
					toast.success(
						response?.message || 
						(accountType === ACCOUNT_TYPES.ORGANIZER 
							? "Registration successful! Please check your email to verify your account."
							: "Registration successful!")
					);

					// For organizer, don't show OTP modal - they need to verify email
					// and then continue with the multi-step process
					if (accountType === ACCOUNT_TYPES.ORGANIZER) {
						// Save organizer ID from response for use in subsequent steps
						const organizerId = response?.data?.organizer?._id || response?.organizer?._id;
						if (organizerId) {
							localStorage.setItem("organizer_id", organizerId);
							console.log("[REGISTRATION] Saved organizer ID:", organizerId);
						}
						
						// Save token if available for authenticated requests
						if (response?.data?.token) {
							Cookies.set(TOKEN_NAME, response.data.token, { expires: 30 });
							console.log("[REGISTRATION] Saved authentication token");
						}
						
						// Organizer flow: email verification required before continuing
						// The API should send verification email
						// After email verification, user can continue with steps
						onSuccess?.();
					} else {
						// User/Guest flow: show OTP modal
						if (response?.data?.token) {
							console.log(
								"Setting token from registration:",
								response.data.token
							);
							Cookies.set(TOKEN_NAME, response?.data?.token);
							setToken(response?.data?.token);
						}
						setIsOtpOpen(true);
						onSuccess?.();
					}
				} else {
					toast.error(response?.message || "Registration failed. Please try again.");
				}
			} catch (error) {
				toast.error("Something went wrong");
				console.error("Registration error:", error);
			} finally {
				setLoading(false);
			}
		},
	});

	const handleGenderSelect = (gender) => {
		formik.setFieldValue("gender", gender);
	};

	const inputClasses = `w-full px-4 py-4 rounded-xl border bg-[#fdfdfd] transition-all duration-200
    ${formik.touched && formik.errors ? "border-red-300" : "border-[#f2dfba]"}
    focus:outline-none text-[#333333] placeholder:text-[#666666] focus:border-[#a797cc]
    [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer`;

	const labelClasses = "block text-sm font-semibold text-[#333333] mb-1";
	const iconContainerClasses = `absolute flex items-center ${
		i18n.language === "ar"
			? "inset-y-0 right-0 pr-3"
			: "inset-y-0 left-0 pl-3"
	}`;
	const errorClasses = "mt-1 text-xs font-semibold text-red-500";

	return (
		<div className="w-full">
			<div className="max-w-2xl mx-auto">
				{/* Account Type Selection - Only show if not defaulted to organizer */}
				{defaultType !== ACCOUNT_TYPES.ORGANIZER && (
				<div className="mb-8">
					<div className="flex justify-center space-x-4">
						<button
							type="button"
							onClick={() =>
								setAccountType(ACCOUNT_TYPES.USER)
							}
							className={`px-6 py-2 rounded-lg font-medium transition-all ${
								accountType === ACCOUNT_TYPES.USER
									? "bg-[#a797cc] text-white"
									: "bg-white text-gray-700 hover:bg-gray-100"
							}`}
						>
							{t("signup.userType")}
						</button>
						<button
							type="button"
							onClick={() =>
								setAccountType(ACCOUNT_TYPES.ORGANIZER)
							}
							className={`px-6 py-2 rounded-lg font-medium transition-all ${
								accountType === ACCOUNT_TYPES.ORGANIZER
									? "bg-[#a797cc] text-white"
									: "bg-white text-gray-700 hover:bg-gray-100"
							}`}
						>
							{t("signup.organizerType")}
						</button>
					</div>
				</div>
				)}

				{/* Form Header - Show for organizer after step indicator (if hideSteper is true, means steper is shown outside) */}
				{accountType === ACCOUNT_TYPES.ORGANIZER && hideSteper && (
					<div className="mb-8 text-center">
						<h2 className="mb-2 text-3xl font-bold text-[#333333]">
							{t("signup.title")}
						</h2>
						<p className="text-[#666666]">{t("signup.subtitle")}</p>
					</div>
				)}

				{/* Steper - Only show for Organizer if not hidden (when shown outside) */}
				{accountType === ACCOUNT_TYPES.ORGANIZER && !hideSteper && (
					<div className="mb-8">
						<Steper currentStep={currentStep} />
					</div>
				)}

				{/* Form Header - Show for organizer before form if steper is inside */}
				{accountType === ACCOUNT_TYPES.ORGANIZER && !hideSteper && (
					<div className="mb-8 text-center">
						<h2 className="mb-2 text-3xl font-bold text-[#333333]">
							{t("signup.title")}
						</h2>
						<p className="text-[#666666]">{t("signup.subtitle")}</p>
					</div>
				)}

				{/* Form Header - Show for user at top */}
				{accountType === ACCOUNT_TYPES.USER && (
					<div className="mb-8 text-center">
						<h2 className="mb-2 text-3xl font-bold text-[#333333]">
							{t("signup.title")}
						</h2>
						<p className="text-[#666666]">{t("signup.subtitle")}</p>
					</div>
				)}

					{/* Main Form */}
					<div className="p-8 bg-white rounded-xl">
						<form
							onSubmit={formik.handleSubmit}
							className="space-y-6"
						>
							{/* Profile Image Upload - Only for User */}
							{accountType === ACCOUNT_TYPES.USER && (
								<div className="flex justify-center mb-8">
									<ProfileImageUpload
										formik={formik}
										fieldName="profile_image"
									/>
								</div>
							)}

							{/* Name Fields - Only for User */}
							{accountType === ACCOUNT_TYPES.USER && (
							<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
								<div>
									<label
										htmlFor="first_name"
										className={labelClasses}
									>
										{t("signup.tab2")}
									</label>
									<div className="relative mt-1">
										<span className={iconContainerClasses}>
											<Icon
												icon="lucide:user"
												className="w-4 h-4 text-[#a797cc]"
											/>
										</span>
										<input
											type="text"
											id="first_name"
											className={`${inputClasses} ${
												i18n.language === "ar"
													? "pr-10"
													: "pl-10"
											}`}
											placeholder={t("signup.tab12")}
											{...formik.getFieldProps(
												"first_name"
											)}
										/>
									</div>
									{formik.touched.first_name &&
										formik.errors.first_name && (
											<p className={errorClasses}>
												{formik.errors.first_name}
											</p>
										)}
								</div>

								<div>
									<label
										htmlFor="last_name"
										className={labelClasses}
									>
										{t("signup.tab3")}
									</label>
									<div className="relative mt-1">
										<span className={iconContainerClasses}>
											<Icon
												icon="lucide:user"
												className="w-4 h-4 text-[#a797cc]"
											/>
										</span>
										<input
											type="text"
											id="last_name"
											className={`${inputClasses} ${
												i18n.language === "ar"
													? "pr-10"
													: "pl-10"
											}`}
											placeholder={t("signup.tab13")}
											{...formik.getFieldProps(
												"last_name"
											)}
										/>
									</div>
									{formik.touched.last_name &&
										formik.errors.last_name && (
											<p className={errorClasses}>
												{formik.errors.last_name}
											</p>
										)}
								</div>
							</div>
							)}

							{/* Contact Information */}
							<div>
								<label htmlFor="email" className={labelClasses}>
									{t("signup.tab5")}
								</label>
								<div className="relative mt-1">
									<span className={iconContainerClasses}>
										<Icon
											icon="lucide:mail"
											className="w-4 h-4 text-[#a797cc]"
										/>
									</span>
									<input
										type="email"
										id="email"
										className={`${inputClasses} ${
											i18n.language === "ar"
												? "pr-10"
												: "pl-10"
										}`}
										placeholder={t("signup.tab14")}
										{...formik.getFieldProps("email")}
									/>
								</div>
								{formik.touched.email &&
									formik.errors.email && (
										<p className={errorClasses}>
											{formik.errors.email}
										</p>
									)}
							</div>

							{/* Phone Input - For both User and Organizer */}
							<div>
								<label className={labelClasses}>
									{t("signup.tab4")}
								</label>
								<NumberInput
									formik={formik}
									mobileNumberField="phone_number"
									countryCodeField="country_code"
								/>
							</div>

							{/* Gender Selection - Only for User */}
							{accountType === ACCOUNT_TYPES.USER && (
							<div>
								<label className={labelClasses}>
									{t("signup.tab6")}
								</label>
								<div className="grid grid-cols-2 gap-4">
									<button
										type="button"
										onClick={() => handleGenderSelect("1")}
										className={`p-4 text-center rounded-xl border transition-all text-[#333333] ${
											formik.values.gender === "1"
												? "border-[#a797cc] bg-orange-50 text-[#a797cc] font-medium"
												: "border-[#f2dfba] hover:border-[#a797cc] hover:text-[#a797cc]"
										}`}
									>
										{t("signup.tab7")}
									</button>
									<button
										type="button"
										onClick={() => handleGenderSelect("2")}
										className={`p-4 text-center rounded-xl border transition-all text-[#333333] ${
											formik.values.gender === "2"
												? "border-[#a797cc] bg-orange-50 text-[#a797cc] font-medium"
												: "border-[#f2dfba] hover:border-[#a797cc] hover:text-[#a797cc]"
										}`}
									>
										{t("signup.tab8")}
									</button>
								</div>
								{formik.touched.gender &&
									formik.errors.gender && (
										<p className={errorClasses}>
											{formik.errors.gender}
										</p>
									)}
							</div>
							)}

							{/* Nationality - Only for User */}
							{accountType === ACCOUNT_TYPES.USER && (
							<div>
								<label
									htmlFor="nationality"
									className={labelClasses}
								>
									{t("auth.nationality")}
								</label>
								<div className="relative mt-1">
									<span className={iconContainerClasses}>
										<Icon
											icon="lucide:user"
											className="w-4 h-4 text-[#a797cc]"
										/>
									</span>
									<select
										id="nationality"
										name="nationality"
										value={formik.values.nationality}
										onChange={formik.handleChange}
										className={`${inputClasses} ${
											i18n.language === "ar"
												? "pr-10"
												: "pl-10"
										} appearance-none`}
									>
										<option value="">
											{t("auth.selectNationality")}
										</option>
										{countries.map((country) => (
											<option
												key={country.code}
												value={country.code}
											>
												{country.name}
											</option>
										))}
									</select>
									<span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
										<svg
											className="w-5 h-5 text-gray-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="https://www.w3.org/2000/svg"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M19 9l-7 7-7-7"
											></path>
										</svg>
									</span>
								</div>
								{formik.touched.nationality &&
									formik.errors.nationality && (
										<p className={errorClasses}>
											{formik.errors.nationality}
										</p>
									)}
							</div>
							)}

							{/* Date of Birth - Only for User */}
							{accountType === ACCOUNT_TYPES.USER && (
							<div>
								<DatePickerTime
									date={formik.values.date_of_birth}
									onDateChange={(date) => {
										formik.setFieldValue("date_of_birth", date);
										formik.setFieldTouched("date_of_birth", true);
									}}
									dateLabel={t("signup.tab10")}
									dateId="date_of_birth"
									showDate={true}
									showTime={false}
									fullWidth={true}
									maxDate={new Date().toISOString().split("T")[0]}
									dateError={formik.touched.date_of_birth && !!formik.errors.date_of_birth}
									dateErrorMessage={formik.errors.date_of_birth}
									className="w-full"
								/>
								{formik.touched.date_of_birth &&
									formik.errors.date_of_birth && (
										<p className={errorClasses}>
											{formik.errors.date_of_birth}
										</p>
									)}
							</div>
							)}

							{/* Description/Bio - Only for User */}
							{accountType === ACCOUNT_TYPES.USER && (
							<div>
								<label
									htmlFor={
										accountType === ACCOUNT_TYPES.USER
											? "description"
											: "bio"
									}
									className={labelClasses}
								>
									{t("signup.tab11")}
								</label>
								<textarea
									id={
										accountType === ACCOUNT_TYPES.USER
											? "description"
											: "bio"
									}
									className={`${inputClasses} min-h-[120px]`}
									placeholder={t("signup.tab15")}
									{...formik.getFieldProps(
										accountType === ACCOUNT_TYPES.USER
											? "description"
											: "bio"
									)}
								/>
								{accountType === ACCOUNT_TYPES.USER
									? formik.touched.description &&
									  formik.errors.description && (
											<p className={errorClasses}>
												{formik.errors.description}
											</p>
									  )
									: formik.touched.bio &&
									  formik.errors.bio && (
											<p className={errorClasses}>
												{formik.errors.bio}
											</p>
									  )}
							</div>
							)}

							{/* Terms and Conditions for Organizer */}
							{accountType === ACCOUNT_TYPES.ORGANIZER && (
								<div className="flex items-start">
									<div className="flex items-center h-5">
										<input
											id="termsAccepted"
											type="checkbox"
											className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-orange-300"
											{...formik.getFieldProps(
												"termsAccepted"
											)}
										/>
									</div>
									<div className="ml-3 text-sm">
										<label
											htmlFor="termsAccepted"
											className="font-medium text-gray-900"
										>
											{t("signup.tab23") || "Terms & Condition"}
										</label>
										{formik.touched.termsAccepted &&
											formik.errors.termsAccepted && (
												<p className={errorClasses}>
													{
														formik.errors
															.termsAccepted
													}
												</p>
											)}
									</div>
								</div>
							)}

							{/* Submit Button */}
							<div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full px-4 py-4 text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
								>
									{loading ? (
										<Loader className="w-6 h-6 mx-auto" />
									) : (
										t(
											accountType === ACCOUNT_TYPES.USER
												? "signup.tab17"
												: "signup.tab21"
										)
									)}
								</button>
							</div>

							{showBySigning && (
								<div className="mt-4 text-center">
									<p className="text-sm text-[#666666]">
										{t("signup.bySigning")}
									</p>
								</div>
							)}
						</form>
					</div>
			</div>

			{/* OTP Modal */}
			<OtpVerificationModal
				isOpen={isOtpOpen}
				onClose={closeOtpModal}
				token={token}
				phoneNumber={formik.values.phone_number}
				countryCode={formik.values.country_code}
			/>
		</div>
	);
}
