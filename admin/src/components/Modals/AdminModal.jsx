"use client";
import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Image from "next/image";
import Loader from "../Loader/Loader";
import { CreateAdminApi, UpdateAdminApi } from "@/api/admin/apis";

function AdminModal({ show, onClose, admin }) {
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (admin?.profile_image) {
      setPreviewImage(admin.profile_image);
    }
  }, [admin]);

  const validationSchema = Yup.object({
    admin_name: Yup.string().required("Admin name is required"),
    username: Yup.string().required("Username is required"),
    mobile_number: Yup.string()
      .required("Mobile number is required")
      .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
    email: Yup.string().email("Invalid email address"),
    password: admin ? Yup.string() : Yup.string().required("Password is required"),
  });

  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFieldValue("profile_image", file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        id: admin?._id,
        admin_name: values.admin_name,
        username: values.username,
        mobile_number: values.mobile_number,
        email: values.email,
        password: values.password,
        profile_image: values.profile_image
      };
      
      let res;
      if (admin) {
        res = await UpdateAdminApi(payload);
      } else {
        res = await CreateAdminApi(payload);
      }
      
      if (res?.status === 1 || res?.code === 200) {
        toast.success(admin ? "Admin updated successfully" : "Admin created successfully");
        onClose();
      } else {
        toast.error(res?.message || "Failed to save admin");
      }
    } catch (error) {
      console.error("Error saving admin:", error);
      toast.error("Failed to save admin");
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
            {admin ? "Edit Admin" : "Add New Admin"}
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
            profile_image: null,
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
              {/* Profile Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300">
                    <Image
                      src={previewImage || "/assets/images/home/Profile.png"}
                      alt="Profile"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, setFieldValue)}
                    className="text-sm text-gray-600"
                  />
                </div>
              </div>

              {/* Admin Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="admin_name"
                  value={values.admin_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f47c0c]"
                  placeholder="Enter admin name"
                />
                {errors.admin_name && touched.admin_name && (
                  <div className="text-red-500 text-sm mt-1">{errors.admin_name}</div>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f47c0c]"
                  placeholder="Enter username"
                />
                {errors.username && touched.username && (
                  <div className="text-red-500 text-sm mt-1">{errors.username}</div>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="mobile_number"
                  value={values.mobile_number}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f47c0c]"
                  placeholder="0598379373"
                />
                {errors.mobile_number && touched.mobile_number && (
                  <div className="text-red-500 text-sm mt-1">{errors.mobile_number}</div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f47c0c]"
                  placeholder="Enter email (optional)"
                />
                {errors.email && touched.email && (
                  <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                )}
              </div>

              {/* Password */}
              {!admin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f47c0c]"
                    placeholder="Enter password"
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
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#f47c0c] text-white rounded-lg hover:bg-[#e66b00] transition disabled:opacity-50"
                >
                  {loading ? <Loader color="#fff" /> : admin ? "Update" : "Create"}
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

