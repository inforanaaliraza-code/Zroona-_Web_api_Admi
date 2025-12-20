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

function ResetAndChangePassword(props) {
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);

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
            props.page === "change" && Yup.string().required("Required"),
          newPassword: Yup.string().required("Required"),
          changePassword: Yup.string()
            .required("Required")
            .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
        })}
        onSubmit={(values, action) => {
          setLoading(true);
          // toast.success("Change Password Successfully");
          // push("/");
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
            className="form-style"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit();
            }}
          >
            <div className="grid grid-cols-1">
              {props.page === "change" && (
                <>
                  {" "}
                  <div className="">
                    <label htmlFor="oldPassword" className="block text-sm font-semibold text-gray-700">Current Password <span className="text-red-700 font-semibold">*</span></label>
                    <div className="relative mt-3">
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
                        type={toggleOldPassword ? "text" : "password"}
                        className="block w-full px-10 pr-20 md:px-12 py-2 md:py-4 text-gray-900 border border-gray-200 rounded-md focus:border-[#f47c0c] focus-visible:outline-none sm:text-base placeholder:text-gray-400 placeholder:medium md:placeholder:font-semibold placeholder:text-sm md:placeholder:text-base"
                        placeholder="Enter Current Password"
                        name="oldPassword"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.oldPassword}
                        id="oldPassword"
                      />
                      <span className="absolute inset-y-0 right-2 flex items-center cursor-pointer text-gray-500">
                        <button
                          type="button"
                          className="py-1 md:py-2 px-3 rounded-md text-sm text-white bg-[#f5ac0f]"
                          onClick={() => setToggleOldPassword(!toggleOldPassword)}
                        >
                          {toggleOldPassword ? "Hide" : "Show"}
                        </button>
                      </span>
                      {errors.oldPassword && touched.oldPassword && (
                        <div className="text-[#f47c0c] mt-1 text-sm"> {errors.oldPassword}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <Link href="/forgot-password">
                      <span className="text-sm text-[#f47c0f] font-bold cursor-pointer">
                        Forgot Password?
                      </span>
                    </Link>
                  </div>
                </>
              )}
              <div className="mb-7">
                <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700">
                  New Password *
                </label>
                <div className="relative mt-3">
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
                    id="newPassword"
                    type={toggleNewPassword ? "text" : "password"}
                    name="newPassword"
                    className="block w-full px-10 pr-20 md:px-12 py-2 md:py-4 text-gray-900 border border-gray-200 rounded-md focus:border-[#f47c0c] focus-visible:outline-none sm:text-base placeholder:text-gray-400 placeholder:medium md:placeholder:font-semibold placeholder:text-sm md:placeholder:text-base"
                    placeholder="Enter new Password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.newPassword}
                  />
                  <span className="absolute inset-y-0 right-2 flex items-center cursor-pointer text-gray-500">
                    <button
                      type="button"
                      className="py-1 md:py-2 px-3 rounded-md text-sm text-white bg-[#f5ac0f]"
                      onClick={() => setToggleNewPassword(!toggleNewPassword)}
                    >
                      {toggleNewPassword ? "Hide" : "Show"}
                    </button>
                  </span>
                </div>
                {errors.newPassword && touched.newPassword && (
                  <div className="text-[#f47c0c] mt-1 text-sm"> {errors.newPassword}</div>
                )}
              </div>
              <div className="mb-7">
                <label htmlFor="changePassword" className="block text-sm font-semibold text-gray-700">
                  Change New Password *
                </label>
                <div className="relative mt-3">
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
                    id="changePassword"
                    type={toggleChangePassword? "text" : "password"}
                    name="changePassword"
                    className="block w-full px-10 pr-20 md:px-12 py-2 md:py-4 text-gray-900 border border-gray-200 rounded-md focus:border-[#f47c0c] focus-visible:outline-none sm:text-base placeholder:text-gray-400 placeholder:medium md:placeholder:font-semibold placeholder:text-sm md:placeholder:text-base"
                    placeholder="Enter confirm new Password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.changePassword}
                  />
                  <span className="absolute inset-y-0 right-2 flex items-center cursor-pointer text-gray-500">
                    <button
                      type="button"
                      className="py-1 md:py-2 px-3 rounded-md text-sm text-white bg-[#f5ac0f]"
                      onClick={() =>
                        setToggleChangePassword(!toggleChangePassword)
                      }
                    >
                      {toggleChangePassword ? "Hide" : "Show"}
                    </button>
                  </span>
                  {/* <span className="absolute inset-y-0 right-2 flex items-center cursor-pointer text-gray-500">
                    <button
                      type="button"
                      className="py-1 md:py-2 px-3 rounded-md text-sm text-white bg-[#f5ac0f]"
                      onClick={() => setFieldValue("toggle", !values.toggle)}
                    >
                      {values.toggle ? "Hide" : "Show"}
                    </button>
                  </span> */}
                </div>
                {errors.changePassword && touched.changePassword && (
                  <div className="text-[#f47c0c] mt-1 text-sm"> {errors.changePassword}</div>
                )}
              </div>
              <div className="mt-5">
                <button
                  type="submit"
                  className="flex justify-center items-center gap-x-2 w-full px-4 py-3 text-white bg-[#f47c0c] rounded-md text-1xl uppercase font-semibold"
                  disabled={loading ? "disabled" : ""}
                >
                  {loading ? (
                    <Loader color="#fff" />
                  ) : (
                    <>
                      <span>Submit</span>
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
        )}
      </Formik >
    </>
  );
}

export default ResetAndChangePassword;
