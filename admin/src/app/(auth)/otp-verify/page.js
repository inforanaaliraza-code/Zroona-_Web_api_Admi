"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { TOKEN_NAME } from "@/until";
import Loader from "@/components/Loader/Loader";
import { forgotPasswordApi, OTPVerificationApi } from "@/api/setting";

function OTP() {
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);

  const mobileNumber = Cookies.get("mobile_number") || Cookies.get("email");

  const [seconds, setSeconds] = useState(30);
  useEffect(() => {
    if (seconds > 0) {
      setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);
    }
  }, [seconds]);

  const resendCode = () => {
    forgotPasswordApi({
      mobile_number: mobileNumber,
    }).then((data) => {
      if (data?.code === 1 || data?.status === 1) {
        toast.success(data?.message || "OTP resent successfully");
      } else {
        toast.error(data?.message);
      }
    });
  };

  return (
    <>
      <section className="bg-[url('/assets/images/bg-img.png')] bg-cover bg-center h-screen bg-[#fdf6e6]">
        <div className="container mx-auto px-4 md:px-12 lg:px-20">
          <div className="flex flex-col lg:flex-row justify-between gap-y-6 lg:gap-y-0 h-screen">
            <div className="mt-10 w-[80px] lg:w-[120px]">
              <Image
                src="/assets/images/logo.png"
                alt=""
                height={120}
                width={120}
                className="w-full h-auto"
              />
            </div>
            <div className="w-full flex items-center justify-center lg:justify-end h-full">
              <div className="w-full sm:w-full md:w-9/12 lg:w-7/12">
                <div className="bg-white rounded-2xl px-4 md:px-16 md:py-10 lg:px-28 py-4 lg:py-14">
                  <div className="flex justify-start items-center gap-x-5 mb-16">
                    <div className="w-[90px] lg:w-[120px]">
                      <Image
                        src="/assets/images/login/otp-img.png"
                        alt="OTP"
                        width={120}
                        height={120}
                        quality={100}
                        priority
                        className="object-contain mx-auto"
                      />
                    </div>
                    <div>
                      <h3 className="mt-2 text-2xl md:text-4xl font-semibold text-[#f47c0c]">
                        Verification Code
                      </h3>
                      <p className="font-semibold text-gray-900">
                        Please enter the 6-digit code sent to your registered
                        mobile number.
                      </p>
                    </div>
                  </div>

                  <Formik
                    initialValues={{
                      otp: "",
                    }}
                    validationSchema={Yup.object({
                      otp: Yup.string().required("Required"),
                    })}
                    onSubmit={(values, action) => {
                      setLoading(true);
                      // toast.success("OTP verified successfully");
                      // Cookies.remove("email");
                      // push("/reset-password");
                      OTPVerificationApi({
                        mobile_number: mobileNumber,
                        sms_otp: values.otp, // Changed from email_otp to sms_otp
                      }).then((res) => {
                        if (res?.code === 1 || res?.status === 1) {
                          toast.success(res?.message);
                          Cookies.set(TOKEN_NAME, res?.data?.token);
                          Cookies.remove("mobile_number");
                          Cookies.remove("email");
                          push("/reset-password");
                        } else {
                          toast?.error(res?.message);
                          setLoading(false);
                        }
                      });
                    }}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      setFieldValue,
                    }) => (
                      <form
                        className="form-style"
                        onSubmit={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSubmit();
                        }}
                      >
                        <div className="mb-5">
                          <OtpInput
                            containerStyle="flex justify-center gap-3 md:gap-4 lg-gap-5"
                            value={values.otp}
                            onChange={(val) => setFieldValue("otp", val)}
                            inputStyle="border border-gray-100 rounded-lg shadow-[3px_3px_3px_rgb(233_233_233_/_44%)] !w-10 h-10 md:!w-14 md:h-14 lg:!w-16 lg:h-16 text-center text-2xl text-[#e86700] font-semibold focus:border-[#e86700] focus:shadow-[3px_3px_0px_rgb(244_124_12)] active:border-[#e86700] active:shadow-[3px_3px_0px_rgb(244_124_12)] focus-visible:outline-none transition-all duration-200"
                            numInputs={6}
                            separator={<span> </span>}
                            shouldAutoFocus={true}
                            inputType="tel"
                            renderInput={(props) => <input {...props} />}
                          />
                          {errors.otp && touched.otp && (
                            <div className="text-red-500 text-center mt-2">
                              {errors.otp}
                            </div>
                          )}
                        </div>

                        <div className="text-center mb-3">
                          <p className="mb-0">
                            <span className="text-black text-lg">
                              00:{seconds > 9 ? seconds : `0${seconds}`}
                            </span>
                          </p>
                        </div>

                        <div className="text-center mb-3">
                          <button
                            type="submit"
                            className="flex justify-center items-center gap-x-2 w-full px-4 py-4 text-white bg-[#f47c0c] rounded-md text-1xl uppercase font-semibold"
                            disabled={loading}
                          >
                            {loading ? (
                              <Loader color="#fff" />
                            ) : (
                              <>
                                <span>Verify</span>
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

                        <div className="text-center">
                          {seconds === 0 && (
                            <span
                              className="cursor-pointer text-[#f47c0c] underline"
                              onClick={() => {
                                resendCode();
                                setSeconds(30);
                              }}
                            >
                              Resend Code
                            </span>
                          )}
                        </div>
                      </form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default OTP;
