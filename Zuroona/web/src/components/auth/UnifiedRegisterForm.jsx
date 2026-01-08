import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { SignUpApi } from "@/app/api/setting";

// List of countries for the nationality dropdown
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

const UnifiedRegisterForm = () => {
	const { t } = useTranslation();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState({});

	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phoneNumber: "",
		nationality: "",
		country_code: "+966",
	});

	const validationSchema = Yup.object().shape({
		firstName: Yup.string().required("First name is required"),
		lastName: Yup.string().required("Last name is required"),
		email: Yup.string()
			.required("Email is required")
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
		phoneNumber: Yup.string()
			.required("Phone number is required")
			.matches(/^[0-9]+$/, "Phone number must contain only digits")
			.min(9, "Phone number must be at least 9 digits")
			.max(9, "Phone number must be at most 9 digits"),
		nationality: Yup.string().required("Nationality is required"),
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});

		// Mark field as touched
		setTouched({
			...touched,
			[name]: true,
		});

		// Validate field
		validateField(name, value);
	};

	const validateField = async (name, value) => {
		try {
			await Yup.reach(validationSchema, name).validate(value);
			setErrors({
				...errors,
				[name]: undefined,
			});
		} catch (error) {
			setErrors({
				...errors,
				[name]: error.message,
			});
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			setIsSubmitting(true);

			// Validate all form data
			await validationSchema.validate(formData, { abortEarly: false });

			// Make API call (passwordless)
			const response = await SignUpApi({
				first_name: formData.firstName,
				last_name: formData.lastName,
				email: formData.email,
				phone_number: parseInt(formData.phoneNumber),
				country_code: formData.country_code || "+966",
				nationality: formData.nationality,
			});

			if (response.status) {
				// Handle successful registration
				console.log("Registration successful");
			} else {
				// Handle registration error
				console.error("Registration failed:", response.message);
			}
		} catch (error) {
			if (error.inner) {
				// Yup validation errors
				const newErrors = {};
				error.inner.forEach((err) => {
					newErrors[err.path] = err.message;
				});
				setErrors(newErrors);
			} else {
				// Other errors
				console.error("Registration error:", error);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{/* First Name */}
			<div className="mb-4">
				<label
					htmlFor="firstName"
					className="block mb-2 text-sm font-medium text-gray-700"
				>
					{t("auth.firstName")}
				</label>
				<input
					type="text"
					id="firstName"
					name="firstName"
					value={formData.firstName}
					onChange={handleChange}
					className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#a797cc] ${
						errors.firstName && touched.firstName
							? "border-red-500"
							: "border-gray-300"
					}`}
					placeholder={t("auth.enterFirstName")}
				/>
				{errors.firstName && touched.firstName && (
					<p className="mt-1 text-sm text-red-500">
						{errors.firstName}
					</p>
				)}
			</div>

			{/* Last Name */}
			<div className="mb-4">
				<label
					htmlFor="lastName"
					className="block mb-2 text-sm font-medium text-gray-700"
				>
					{t("auth.lastName")}
				</label>
				<input
					type="text"
					id="lastName"
					name="lastName"
					value={formData.lastName}
					onChange={handleChange}
					className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#a797cc] ${
						errors.lastName && touched.lastName
							? "border-red-500"
							: "border-gray-300"
					}`}
					placeholder={t("auth.enterLastName")}
				/>
				{errors.lastName && touched.lastName && (
					<p className="mt-1 text-sm text-red-500">
						{errors.lastName}
					</p>
				)}
			</div>

			{/* Email */}
			<div className="mb-4">
				<label
					htmlFor="email"
					className="block mb-2 text-sm font-medium text-gray-700"
				>
					{t("auth.email")}
				</label>
				<input
					type="email"
					id="email"
					name="email"
					value={formData.email}
					onChange={handleChange}
					className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#a797cc] ${
						errors.email && touched.email
							? "border-red-500"
							: "border-gray-300"
					}`}
					placeholder={t("auth.enterEmail")}
				/>
				{errors.email && touched.email && (
					<p className="mt-1 text-sm text-red-500">{errors.email}</p>
				)}
			</div>


			{/* Phone Number */}
			<div className="mb-4">
				<label
					htmlFor="phoneNumber"
					className="block mb-2 text-sm font-medium text-gray-700"
				>
					{t("auth.phoneNumber")}
				</label>
				<input
					type="tel"
					id="phoneNumber"
					name="phoneNumber"
					value={formData.phoneNumber}
					onChange={handleChange}
					className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#a797cc] ${
						errors.phoneNumber && touched.phoneNumber
							? "border-red-500"
							: "border-gray-300"
					}`}
					placeholder={t("auth.enterPhoneNumber")}
				/>
				{errors.phoneNumber && touched.phoneNumber && (
					<p className="mt-1 text-sm text-red-500">
						{errors.phoneNumber}
					</p>
				)}
			</div>

			{/* Nationality Dropdown */}
			<div className="mb-4">
				<label
					htmlFor="nationality"
					className="block mb-2 text-sm font-medium text-gray-700"
				>
					{t("auth.nationality")}
				</label>
				<select
					id="nationality"
					name="nationality"
					value={formData.nationality}
					onChange={handleChange}
					className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#a797cc] ${
						errors.nationality && touched.nationality
							? "border-red-500"
							: "border-gray-300"
					}`}
				>
					<option value="">{t("auth.selectNationality")}</option>
					{countries.map((country) => (
						<option key={country.code} value={country.code}>
							{country.name}
						</option>
					))}
				</select>
				{errors.nationality && touched.nationality && (
					<p className="mt-1 text-sm text-red-500">
						{errors.nationality}
					</p>
				)}
			</div>

			{/* Submit Button */}
			<button
				type="submit"
				disabled={isSubmitting}
				className="w-full px-4 py-2 text-white bg-[#a797cc] rounded-md hover:bg-[#e06c0c] focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:ring-opacity-50 disabled:opacity-50"
			>
				{isSubmitting ? t("auth.registering") : t("auth.register")}
			</button>
		</form>
	);
};

export default UnifiedRegisterForm;
