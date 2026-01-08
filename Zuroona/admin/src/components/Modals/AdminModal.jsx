"use client";
import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { FaUserCircle } from "react-icons/fa";
import Loader from "../Loader/Loader";
import { CreateAdminApi, UpdateAdminApi } from "@/api/admin/apis";
import { useTranslation } from "react-i18next";

function AdminModal({ show, onClose, admin, onSuccess }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    admin_name: Yup.string().required(t("common.adminNameRequired")),
    username: Yup.string().required(t("common.usernameRequired")),
    mobile_number: Yup.string()
      .required(t("common.mobileNumberRequired"))
      .matches(/^[0-9]{10}$/, t("common.mobileNumberDigits")),
    email: Yup.string().email(t("common.invalidEmail")),
    password: admin ? Yup.string() : Yup.string().required(t("common.passwordRequired")),
  });


  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        id: admin?._id,
        admin_name: values.admin_name,
        username: values.username,
        mobile_number: values.mobile_number,
        email: values.email,
        password: values.password || undefined, // Only include password if provided
      };
      
      let res;
      if (admin) {
        res = await UpdateAdminApi(payload);
      } else {
        res = await CreateAdminApi(payload);
      }
      
      if (res?.status === 1 || res?.code === 200) {
        toast.success(admin ? t("common.adminUpdated") : t("common.adminCreated"));
        // Call onSuccess callback to refresh admin list
        if (onSuccess) {
          onSuccess(res?.data);
        }
        onClose();
      } else {
        toast.error(res?.message || t("common.failedToSave"));
      }
    } catch (error) {
      console.error("Error saving admin:", error);
      toast.error(error?.response?.data?.message || t("common.failedToSave"));
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[10000]">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {admin ? t("common.editAdmin") : t("common.addNewAdmin")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <Formik
          initialValues={{
            admin_name: admin?.admin_name || "",
            username: admin?.username || "",
            mobile_number: admin?.mobile_number || "",
            email: admin?.email || "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
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
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Profile Icon Display */}
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#a797cc] to-[#8b7ab8] flex items-center justify-center shadow-lg">
                  <FaUserCircle className="text-white text-6xl" />
                </div>
              </div>

              {/* Admin Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("common.adminName")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="admin_name"
                  value={values.admin_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a797cc]"
                  placeholder={t("common.enterAdminName")}
                />
                {errors.admin_name && touched.admin_name && (
                  <div className="text-red-500 text-sm mt-1">{errors.admin_name}</div>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("common.username")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a797cc]"
                  placeholder={t("common.enterUsername")}
                />
                {errors.username && touched.username && (
                  <div className="text-red-500 text-sm mt-1">{errors.username}</div>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("common.mobileNumber")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="mobile_number"
                  value={values.mobile_number}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a797cc]"
                  placeholder="0598379373"
                />
                {errors.mobile_number && touched.mobile_number && (
                  <div className="text-red-500 text-sm mt-1">{errors.mobile_number}</div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("common.email")}
                </label>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a797cc]"
                  placeholder={t("common.enterEmailOptional")}
                />
                {errors.email && touched.email && (
                  <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                )}
              </div>

              {/* Password */}
              {!admin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("common.password")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a797cc]"
                    placeholder={t("common.enterPassword")}
                  />
                  {errors.password && touched.password && (
                    <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                  )}
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#a797cc] text-white rounded-lg hover:bg-[#a08ec8] transition disabled:opacity-50"
                >
                  {loading ? <Loader color="#fff" /> : admin ? t("common.update") : t("common.create")}
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default AdminModal;

