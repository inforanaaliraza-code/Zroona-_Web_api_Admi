"use client";
import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import { UpdateUserApi } from "@/api/user/apis";
import { useTranslation } from "react-i18next";

function EditUserModal({ show, onClose, user, onSuccess }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    phone_number: Yup.number()
      .required(t("common.phoneNumber") + " " + t("common.required"))
      .integer(t("validation.invalidPhone")),
    country_code: Yup.string().required(t("common.countryCode") + " " + t("common.required")),
    email: Yup.string().email(t("common.invalidEmail")),
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        userId: user?._id,
        phone_number: values.phone_number,
        country_code: values.country_code,
        email: values.email || null,
      };

      const res = await UpdateUserApi(payload);
      if (res?.status === 1 || res?.code === 200) {
        toast.success(t("common.userUpdated"));
        onSuccess?.();
        onClose();
      } else {
        toast.error(res?.message || t("common.failedToUpdate"));
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(t("common.failedToUpdate"));
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#a797cc] to-[#b0a0df] p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">{t("common.editUserDetails")}</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition"
            >
              <FaTimes className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Form */}
        <Formik
          initialValues={{
            phone_number: user?.phone_number || "",
            country_code: user?.country_code || "+966",
            email: user?.email || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
            <form onSubmit={handleSubmit} className="p-6">
              {/* Phone Number */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("common.phoneNumber")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={values.phone_number}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a797cc]"
                  placeholder="598379373"
                />
                {errors.phone_number && touched.phone_number && (
                  <div className="text-red-500 text-sm mt-1">{errors.phone_number}</div>
                )}
              </div>

              {/* Country Code */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("common.countryCode")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="country_code"
                  value={values.country_code}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a797cc]"
                  placeholder="+966"
                />
                {errors.country_code && touched.country_code && (
                  <div className="text-red-500 text-sm mt-1">{errors.country_code}</div>
                )}
              </div>

              {/* Email */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("common.emailAddress")}
                </label>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a797cc]"
                  placeholder="user@example.com"
                />
                {errors.email && touched.email && (
                  <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-[#a797cc] to-[#b0a0df] text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? t("common.updatingUser") : t("common.updateUser")}
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default EditUserModal;

