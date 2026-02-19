"use client";
import { Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { TOKEN_NAME } from "@/until";
import Loader from "../Loader/Loader";
import { changePasswordApi, resetPasswordApi } from "@/api/setting";
import { FaEye, FaEyeSlash, FaLock, FaCheckCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";

function ResetAndChangePassword(props) {
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  // Separate toggle states for each password field
  const [toggleOldPassword, setToggleOldPassword] = useState(false);
  const [toggleNewPassword, setToggleNewPassword] = useState(false);
  const [toggleChangePassword, setToggleChangePassword] = useState(false);

  return (
    <>
      <Formik
        initialValues={{
          oldPassword: "",
          newPassword: "",
          changePassword: "",
          toggle: false,
          toggle1: false,
          toggle2: false,
        }}
        validationSchema={Yup.object({
          oldPassword:
            props.page === "change" && Yup.string().required(t("common.required")),
          newPassword: Yup.string().required(t("common.required")),
          changePassword: Yup.string()
            .required(t("common.required"))
            .oneOf([Yup.ref("newPassword"), null], t("common.passwordsMustMatch")),
        })}
        onSubmit={(values, action) => {
          setLoading(true);
          if (props.page === "change") {
            changePasswordApi({
              current_password: values.oldPassword,
              new_password: values.newPassword,
            }).then((res) => {
              if (res?.code === 1) {
                toast.success(res?.message);
                Cookies.remove(TOKEN_NAME);
                push("/");
              } else {
                toast?.error(res?.message);
                setLoading(false);
              }
            });
          } else {
            resetPasswordApi({
              password: values.newPassword,
            }).then((res) => {
              if (res?.code === 1) {
                toast.success(res?.message);
                Cookies.remove(TOKEN_NAME);
                push("/");
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
            className="form-style space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit();
            }}
          >
            <div className="grid grid-cols-1 gap-6">
              {/* Current Password Field */}
              {props.page === "change" && (
                <div className="animate-fade-in">
                  <label 
                    htmlFor="oldPassword" 
                    className="block text-sm font-semibold text-gray-700 mb-3"
                  >
                    {t("common.currentPassword")} <span className="text-[#a797cc]">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <FaLock className="text-[#a3cc69] group-focus-within:text-[#a797cc] transition-colors duration-300" />
                    </div>
                    <input
                      type={toggleOldPassword ? "text" : "password"}
                      className="block w-full px-12 pr-[7.5rem] py-4 text-gray-900 border-2 border-gray-200 rounded-xl focus:border-[#a3cc69] focus:ring-4 focus:ring-[#a3cc69]/20 transition-all duration-300 sm:text-base placeholder:text-gray-400 placeholder:font-medium"
                      placeholder={t("common.enterCurrentPassword")}
                      name="oldPassword"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.oldPassword}
                      id="oldPassword"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-4 flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#a797cc] hover:bg-[#a08ec8] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                      onClick={() => setToggleOldPassword(!toggleOldPassword)}
                    >
                      {toggleOldPassword ? (
                        <><FaEyeSlash className="mr-1" /> {t("common.hide")}</>
                      ) : (
                        <><FaEye className="mr-1" /> {t("common.show")}</>
                      )}
                    </button>
                  </div>
                  {errors.oldPassword && touched.oldPassword && (
                    <div className="text-red-500 mt-2 text-sm font-medium flex items-center gap-1 animate-shake">
                      <span>⚠️</span> {errors.oldPassword}
                    </div>
                  )}
                  
                  {/* Forgot Password Link */}
                  <div className="text-right mt-3">
                    <Link href="/forgot-password">
                        <span className="text-sm text-[#a3cc69] hover:text-[#a797cc] font-semibold cursor-pointer transition-colors duration-300 flex items-center justify-end gap-1">
                          {t("common.forgotPassword")} →
                      </span>
                    </Link>
                  </div>
                </div>
              )}

              {/* New Password Field */}
              <div className="animate-fade-in" style={{animationDelay: '0.1s'}}>
                <label 
                  htmlFor="newPassword" 
                  className="block text-sm font-semibold text-gray-700 mb-3"
                >
                  {t("common.newPassword")} <span className="text-[#a797cc]">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <FaLock className="text-[#a3cc69] group-focus-within:text-[#a797cc] transition-colors duration-300" />
                  </div>
                  <input
                    id="newPassword"
                    type={toggleNewPassword ? "text" : "password"}
                    name="newPassword"
                    className="block w-full px-12 pr-[7.5rem] py-4 text-gray-900 border-2 border-gray-200 rounded-xl focus:border-[#a3cc69] focus:ring-4 focus:ring-[#a3cc69]/20 transition-all duration-300 sm:text-base placeholder:text-gray-400 placeholder:font-medium"
                    placeholder={t("common.enterNewPassword")}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.newPassword}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-4 flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#a797cc] hover:bg-[#a08ec8] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                    onClick={() => setToggleNewPassword(!toggleNewPassword)}
                  >
                    {toggleNewPassword ? (
                      <><FaEyeSlash className="mr-1" /> {t("common.hide")}</>
                    ) : (
                      <><FaEye className="mr-1" /> {t("common.show")}</>
                    )}
                  </button>
                </div>
                {errors.newPassword && touched.newPassword && (
                  <div className="text-red-500 mt-2 text-sm font-medium flex items-center gap-1 animate-shake">
                    <span>⚠️</span> {errors.newPassword}
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
                <label 
                  htmlFor="changePassword" 
                  className="block text-sm font-semibold text-gray-700 mb-3"
                >
                  {t("common.confirmNewPassword")} <span className="text-[#a797cc]">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <FaCheckCircle className={`transition-colors duration-300 ${
                      values.changePassword && values.changePassword === values.newPassword 
                        ? 'text-[#a3cc69]' 
                        : 'text-gray-400'
                    }`} />
                  </div>
                  <input
                    id="changePassword"
                    type={toggleChangePassword ? "text" : "password"}
                    name="changePassword"
                    className="block w-full px-12 pr-[7.5rem] py-4 text-gray-900 border-2 border-gray-200 rounded-xl focus:border-[#a3cc69] focus:ring-4 focus:ring-[#a3cc69]/20 transition-all duration-300 sm:text-base placeholder:text-gray-400 placeholder:font-medium"
                    placeholder={t("common.enterConfirmNewPassword")}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.changePassword}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-4 flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#a797cc] hover:bg-[#a08ec8] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                    onClick={() => setToggleChangePassword(!toggleChangePassword)}
                  >
                    {toggleChangePassword ? (
                      <><FaEyeSlash className="mr-1" /> {t("common.hide")}</>
                    ) : (
                      <><FaEye className="mr-1" /> {t("common.show")}</>
                    )}
                  </button>
                </div>
                {errors.changePassword && touched.changePassword && (
                  <div className="text-red-500 mt-2 text-sm font-medium flex items-center gap-1 animate-shake">
                    <span>⚠️</span> {errors.changePassword}
                  </div>
                )}
                {!errors.changePassword && values.changePassword && values.changePassword === values.newPassword && (
                    <div className="text-[#a3cc69] mt-2 text-sm font-medium flex items-center gap-1">
                      <FaCheckCircle /> {t("common.passwordsMatch")}
                    </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="mt-8 animate-fade-in" style={{animationDelay: '0.3s'}}>
                <button
                  type="submit"
                  className="flex justify-center items-center gap-x-3 w-full px-6 py-4 text-white bg-gradient-to-r from-[#a3cc69] to-[#a797cc] hover:from-[#9fb68b] hover:to-[#a08ec8] rounded-xl text-lg font-bold uppercase shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader color="#fff" />
                  ) : (
                    <>
                      <span>{t("common.submit")}</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </Formik>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </>
  );
}

export default ResetAndChangePassword;
