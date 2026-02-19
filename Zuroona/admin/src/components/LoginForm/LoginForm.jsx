"use client";
import { Formik } from "formik";
import * as Yup from "yup";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, Phone } from "lucide-react";
import { TOKEN_NAME } from "@/until";
import Loader from "../Loader/Loader";
import { forgotPasswordApi, LoginApi } from "@/api/setting";
import { useTranslation } from "react-i18next";

function LoginForm(props) {
  const { t, i18n } = useTranslation();
  const isRTLByI18n = i18n?.language === "ar";
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering translations after mount
  useEffect(() => {
    // Use double RAF to ensure React hydration is complete
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setMounted(true);
        // Ensure i18n is in English during SSR, then switch after mount
        if (typeof window !== "undefined") {
          const storedLanguage = localStorage.getItem("i18nextLng");
          if (storedLanguage && storedLanguage !== i18n.language) {
            i18n.changeLanguage(storedLanguage);
          }
        }
      });
    });
  }, [i18n]);

  // Create validation schema with proper fallbacks to prevent hydration mismatch
  const validationSchema = useMemo(() => {
    return Yup.object({
      email: props.page !== "forgot" 
        ? Yup.string().email(mounted ? t("validation.invalidEmail") : "Invalid email").required(mounted ? t("validation.required") : "Required")
        : Yup.string(),
      mobile_number: props.page === "forgot"
        ? Yup.string().required(mounted ? t("common.mobileNumberRequired") : "Mobile number is required").matches(/^[0-9]{10}$/, mounted ? t("common.mobileNumberDigits") : "Must be 10 digits")
        : Yup.string(),
      password:
        props.page !== "forgot" && Yup.string().required(mounted ? t("validation.required") : "Required"),
    });
  }, [mounted, props.page, t]);

  // Don't render form until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="rounded-md bg-white">
        <div className="grid grid-cols-1">
          <div className="mb-6">
            <label className="block text-base font-semibold text-gray-700">
              {props.page === "forgot" ? "Mobile Number *" : "Email *"}
            </label>
            <div className="relative mt-3">
              <div className={`absolute inset-y-0 ${isRTLByI18n ? "right-3" : "left-3"} flex items-center pointer-events-none`}>
                {props.page === "forgot" ? (
                  <Phone className="w-6 h-6 text-[#a797cc]" />
                ) : (
                  <Mail className="w-6 h-6 text-[#a797cc]" />
                )}
              </div>
              <input
                type={props.page === "forgot" ? "tel" : "email"}
                className={`block w-full px-3 ${isRTLByI18n ? "pr-12 text-right" : "pl-12 text-left"} py-2 md:py-4 text-gray-900 border-2 border-gray-200 rounded-lg shadow-sm bg-gray-50`}
                placeholder={props.page === "forgot" ? "Enter mobile number" : "Enter email id"}
                disabled
              />
            </div>
          </div>
          {props.page !== "forgot" && (
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-[#a797cc]" />
                </div>
                <input
                  type="password"
                  className="block w-full px-3 pl-12 py-2 md:py-4 text-gray-900 border-2 border-gray-200 rounded-lg shadow-sm bg-gray-50"
                  placeholder="Enter Password"
                  disabled
                />
              </div>
            </div>
          )}
          <div className="text-center mt-3">
            <button
              type="button"
              className="flex justify-center items-center gap-x-2 w-full px-4 py-3 md:py-4 text-white bg-gradient-to-r from-[#a797cc] to-[#8b7bb3] rounded-lg text-base md:text-lg uppercase font-semibold opacity-70 cursor-not-allowed"
              disabled
            >
              <span>{props.page === "forgot" ? "Continue" : "Login"}</span>
                      <Image
                        src="/assets/images/login/arrow.png"
                        alt={mounted ? t("common.arrow") : "Arrow"}
                        height={22}
                        width={20}
                      />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Formik
        initialValues={{
          email: "",
          mobile_number: "",
          password: "",
          toggle: false,
          error: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, action) => {
          setLoading(true);
          // if (props.page === "forgot") {
          //   toast.success("OTP is successfully sent");
          //   push("/otp-verify");
          // } else {
          // toast.success("Login Successfully");
          //   push("/organizer");
          //   Cookies.set(TOKEN_NAME, "token");
          // }
          if (props.page === "forgot") {
            // For SMS OTP, use mobile number
            Cookies.set("mobile_number", values.mobile_number || values.email);
            forgotPasswordApi({
              mobile_number: values.mobile_number || values.email, // Support both for backward compatibility
            }).then((res) => {
              if (res?.status === 1) {
                toast.success(res?.message || t("common.otpSentToMobile") || "OTP sent to your mobile number");
                Cookies.set(TOKEN_NAME, res?.data?.token);
                push("/otp-verify");
              } else {
                toast?.error(res?.message);
                setLoading(false);
              }
            });
          } else {
            LoginApi({
              email: values.email,
              password: values.password,
            }).then((res) => {
              if (res?.status === 1) {
                toast.success(t("auth.loginSuccess") || res?.message);
                Cookies.set(TOKEN_NAME, res?.data?.token);
                push("/organizer");
              } else {
                toast?.error(res?.message);
                setLoading(false);
              }
            });
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFormikState,
          setFieldValue,
        }) => (
          <form
            className="rounded-md bg-white"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit();
            }}
          >
            <div className="grid grid-cols-1">
              {/* Email/Mobile Input - For forgot password, use mobile number */}
              <div className="mb-6">
                <label htmlFor={props.page === "forgot" ? "mobile_number" : "email"} className="block text-base font-semibold text-gray-700" suppressHydrationWarning>
                  {mounted ? (props.page === "forgot" ? t("common.mobileNumberLabel") : t("common.emailLabel")) : (props.page === "forgot" ? "Mobile Number *" : "Email *")}
                </label>
                <div className="relative mt-3">
                  <div className={`absolute inset-y-0 ${isRTLByI18n ? "right-3" : "left-3"} flex items-center pointer-events-none`}>
                    {props.page === "forgot" ? (
                      <Phone className="w-6 h-6 text-[#a797cc]" />
                    ) : (
                      <Mail className="w-6 h-6 text-[#a797cc]" />
                    )}
                  </div>
                  <input
                    type={props.page === "forgot" ? "tel" : "email"}
                    id={props.page === "forgot" ? "mobile_number" : "email"}
                    name={props.page === "forgot" ? "mobile_number" : "email"}
                    className={`block w-full px-3 ${isRTLByI18n ? "pr-12 text-right" : "pl-12 text-left"} py-2 md:py-4 text-gray-900 border-2 border-gray-200 rounded-lg shadow-sm focus:border-[#a797cc] focus:ring-2 focus:ring-[#a797cc]/20 focus-visible:outline-none sm:text-base placeholder:text-gray-400 placeholder:font-semibold transition-all duration-200`}
                    placeholder={mounted ? (props.page === "forgot" ? t("common.enterMobileNumber") : t("common.enterEmailId")) : (props.page === "forgot" ? "Enter mobile number" : "Enter email id")}
                    suppressHydrationWarning
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={props.page === "forgot" ? (values.mobile_number || values.email) : values.email}
                  />

                </div>
                {((props.page === "forgot" && errors.mobile_number && touched.mobile_number) || 
                  (props.page !== "forgot" && errors.email && touched.email)) && (
                  <div className="text-[#a797cc] mt-1 text-sm">
                    {props.page === "forgot" ? errors.mobile_number : errors.email}
                  </div>
                )}
              </div>

              {props.page !== "forgot" && (
                <div className="mb-2">
                  <label htmlFor="password-field" className="block text-sm font-medium text-gray-700" suppressHydrationWarning>
                    {mounted ? t("common.passwordLabel") : "Password"}
                  </label>
                  <div className="relative mt-1">
                    <div className={`absolute inset-y-0 ${isRTLByI18n ? "right-3" : "left-3"} flex items-center pointer-events-none`}>
                        <Lock className="w-4 h-4 text-[#a797cc]" />
                      </div>
                      <input
                        id="password-field"
                        type={values.toggle ? "text" : "password"}
                        name="password"
                        className={`block w-full px-3 ${isRTLByI18n ? "pr-12 text-right" : "pl-12 text-left"} py-2 md:py-4 text-gray-900 border-2 border-gray-200 rounded-lg shadow-sm focus:border-[#a797cc] focus:ring-2 focus:ring-[#a797cc]/20 focus-visible:outline-none sm:text-base placeholder:text-gray-400 placeholder:font-semibold transition-all duration-200`}
                        placeholder={mounted ? t("common.enterPasswordPlaceholder") : "Enter Password"}
                        suppressHydrationWarning
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                      />
                      <span className={`absolute inset-y-0 ${isRTLByI18n ? "left-2" : "right-2"} flex items-center cursor-pointer text-gray-500`}>
                        <button
                          type="button"
                          className="py-1 md:py-2 px-3 md:px-4 rounded-lg text-sm text-white bg-gradient-to-r from-[#a797cc] to-[#8b7bb3] hover:from-[#8b7bb3] hover:to-[#6d5a9a] transition-all duration-200 shadow-md"
                          onClick={() => setFieldValue("toggle", !values.toggle)}
                        >
                          {mounted ? (values.toggle ? t("common.hide") : t("common.show")) : (values.toggle ? "Hide" : "Show")}
                        </button>
                      </span>
                  </div>
                  {errors.password && touched.password && (
                    <div className="text-[#a797cc] mt-1 text-sm"> {errors.password}</div>
                  )}
                </div>
              )}

              {props.page !== "forgot" && (
                <div className={`${isRTLByI18n ? "text-left" : "text-right"} mb-10`}>
                  <Link href="/forgot-password">
                    <span className="text-sm text-[#a797cc] font-bold cursor-pointer hover:text-[#8b7bb3] transition-colors" suppressHydrationWarning>
                      {mounted ? t("common.forgotPassword") : "Forgot Password?"}
                    </span>
                  </Link>
                </div>
              )}

              {/* Static Submit Button */}
              <div className="text-center mt-3">
                <button
                  type="submit"
                  className="flex justify-center items-center gap-x-2 w-full px-4 py-3 md:py-4 text-white bg-gradient-to-r from-[#a797cc] to-[#8b7bb3] rounded-lg text-base md:text-lg uppercase font-semibold hover:from-[#8b7bb3] hover:to-[#6d5a9a] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader color="#fff" />
                  ) : (
                    <>
                      <span suppressHydrationWarning>
                        {mounted 
                          ? (props.page === "forgot" ? t("common.continue") : t("common.login"))
                          : (props.page === "forgot" ? "Continue" : "Login")
                        }
                      </span>
                      <Image
                        src="/assets/images/login/arrow.png"
                        alt={mounted ? t("common.arrow") : "Arrow"}
                        height={22}
                        width={20}
                      />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )
        }
      </Formik>
    </>
  );
}

export default LoginForm;
