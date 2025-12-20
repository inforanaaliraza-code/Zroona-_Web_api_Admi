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
import { forgotPasswordApi, LoginApi } from "@/api/setting";

function LoginForm(props) {
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
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
        validationSchema={Yup.object({
          email: props.page !== "forgot" 
            ? Yup.string().email("Enter a valid email address").required("Required")
            : Yup.string(),
          mobile_number: props.page === "forgot"
            ? Yup.string().required("Mobile number is required").matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
            : Yup.string(),
          password:
            props.page !== "forgot" && Yup.string().required("Required"),
        })}
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
                toast.success(res?.message || "OTP sent to your mobile number");
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
                toast.success(res?.message);
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
                <label htmlFor={props.page === "forgot" ? "mobile_number" : "email"} className="block text-base font-semibold text-gray-700">
                  {props.page === "forgot" ? "Mobile Number *" : "Email *"}
                </label>
                <div className="relative mt-3">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Image
                      src={props.page === "forgot" ? "/assets/images/login/phone.png" : "/assets/images/login/email.png"}
                      alt={props.page === "forgot" ? "Phone icon" : "Email icon"}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <input
                    type={props.page === "forgot" ? "tel" : "email"}
                    id={props.page === "forgot" ? "mobile_number" : "email"}
                    name={props.page === "forgot" ? "mobile_number" : "email"}
                    className="block w-full px-3 pl-12 py-2 md:py-4 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:border-[#f47c0c] focus-visible:outline-none sm:text-base placeholder:text-gray-400 placeholder:font-semibold"
                    placeholder={props.page === "forgot" ? "Enter mobile number" : "Enter email id"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={props.page === "forgot" ? (values.mobile_number || values.email) : values.email}
                  />

                </div>
                {((props.page === "forgot" && errors.mobile_number && touched.mobile_number) || 
                  (props.page !== "forgot" && errors.email && touched.email)) && (
                  <div className="text-[#f47c0c] mt-1 text-sm">
                    {props.page === "forgot" ? errors.mobile_number : errors.email}
                  </div>
                )}
              </div>

              {props.page !== "forgot" && (
                <div className="mb-2">
                  <label htmlFor="password-field" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Image
                        src="/assets/images/login/lock.png"
                        alt="Password icon"
                        width={16}
                        height={16}
                        className="object-contain"
                      />
                    </div>
                    <input
                      id="password-field"
                      type={values.toggle ? "text" : "password"}
                      name="password"
                      className="block w-full px-3 pl-12 py-2 md:py-4 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:border-[#f47c0c] focus-visible:outline-none sm:text-base placeholder:text-gray-400 placeholder:font-semibold"
                      placeholder="Enter Password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                    />
                    <span className="absolute inset-y-0 right-2 flex items-center cursor-pointer text-gray-500">
                      <button
                        type="button"
                        className="py-1 md:py-2 px-3 rounded-md text-sm text-white bg-[#f5ac0f]"
                        onClick={() => setFieldValue("toggle", !values.toggle)}
                      >
                        {values.toggle ? "Hide" : "Show"}
                      </button>
                    </span>
                  </div>
                  {errors.password && touched.password && (
                    <div className="text-[#f47c0c] mt-1 text-sm"> {errors.password}</div>
                  )}
                </div>
              )}

              {props.page !== "forgot" && (
                <div className="text-right mb-10">
                  <Link href="/forgot-password">
                    <span className="text-sm text-[#f47c0f] font-bold cursor-pointer">
                      Forgot Password?
                    </span>
                  </Link>
                </div>
              )}

              {/* Static Submit Button */}
              <div className="text-center mt-3">
                <button
                  type="submit"
                  className="flex justify-center items-center gap-x-2 w-full px-4 py-3 text-white bg-[#f47c0c] rounded-md text-1xl uppercase font-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader color="#fff" />
                  ) : (
                    <>
                      <span>{props.page === "forgot" ? "Continue" : "LogIn"}</span>
                      <Image
                        src="/assets/images/login/arrow.png"
                        alt="Arrow"
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
