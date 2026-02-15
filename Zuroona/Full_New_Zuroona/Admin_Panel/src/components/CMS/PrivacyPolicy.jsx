"use client";
import { AddEditCMSApi } from "@/api/setting";
import { useDataStore } from "@/api/store/store";
import Loader from "@/components/Loader/Loader";
import { useFormik } from "formik";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { showGreenTick } from "@/utils/toastHelpers";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

const EnhancedTextEditor = dynamic(() => import("@/components/CMS/EnhancedTextEditor"), {
  ssr: false,
  loading: () => <div className="h-32 bg-gray-100 rounded animate-pulse" />
});

const EnhancedTextEditorAr = dynamic(() => import("@/components/CMS/EnhancedTextEditorAr"), {
  ssr: false,
  loading: () => <div className="h-32 bg-gray-100 rounded animate-pulse" />
});

function PrivacyPolicy(props) {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const quillRef = useRef();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const isRTL = mounted ? i18n.language === "ar" : false;

  const CMSDetail = useDataStore((store) => store.CMSDetail);
  const CMSDetailLoading = useDataStore((store) => store.CMSDetailLoading);
  const { fetchCMSDetail } = useDataStore();

  useEffect(() => {
    setDataLoaded(false);
    fetchCMSDetail({ cms_type: props.status }).then(() => {
      setDataLoaded(true);
    });
  }, [props.status]);

  const initialValues = {
    content: dataLoaded && CMSDetail?.description ? CMSDetail.description : "",
    content_ar: dataLoaded && CMSDetail?.description_ar ? CMSDetail.description_ar : "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      content: Yup.string().required(t("cms.required")),
      content_ar: Yup.string().required(t("cms.required")),
    }),
    enableReinitialize: true,
    onSubmit: (values, { isSubmitting, resetForm }) => {
      setLoading(true);
      const payload = {
        cms_type: parseInt(props.status),
        title: "Zuroona Privacy Policy",
        description: values.content,
        description_ar: values.content_ar,
        id: CMSDetail?._id,
      };

      AddEditCMSApi(payload).then((data) => {
        setLoading(false);
        if (data?.status === 1) {
          showGreenTick();
          fetchCMSDetail({ cms_type: props.status });
        } else {
          setLoading(false);
          toast.error(data.message);
        }
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      {/* English Content */}
      <div className="mb-6">
        <label className={`block text-sm font-semibold text-gray-700 mb-3 ${isRTL ? 'text-right' : ''}`}>
          {t("cms.englishContent")}
        </label>
        <EnhancedTextEditor
          ref={quillRef}
          name="content"
          value={formik.values.content}
          onBlur={formik.onBlur}
          formik={formik}
        />
        {formik.errors.content && formik.touched.content && (
          <div className="text-red-500 text-sm mt-2">{formik.errors.content}</div>
        )}
      </div>

      {/* Arabic Content */}
      <div className="mb-6">
        <label className={`block text-sm font-semibold text-gray-700 mb-3 ${isRTL ? 'text-right' : 'text-right'}`}>
          {t("cms.arabicContent")} (المحتوى العربي)
        </label>
        <EnhancedTextEditorAr
          ref={quillRef}
          name="content_ar"
          value={formik.values.content_ar}
          onBlur={formik.onBlur}
          formik={formik}
        />
        {formik.errors.content_ar && formik.touched.content_ar && (
          <div className="text-red-500 text-sm mt-2">{formik.errors.content_ar}</div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center mt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-12 py-3 text-white bg-[#a3cc69] hover:bg-[#92b85d] transition-all duration-200 rounded-lg text-base font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader color="#fff" />
              <span>{t("cms.saving")}</span>
            </div>
          ) : props.status ? (
            t("cms.update")
          ) : (
            t("cms.save")
          )}
        </button>
      </div>
    </form>
  );
}

export default PrivacyPolicy;
