"use client";
import { AddEditCMSApi } from "@/api/setting";
import { useDataStore } from "@/api/store/store";
import Loader from "@/components/Loader/Loader";
import { useFormik } from "formik";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

const TextEditor = dynamic(() => import("@/components/TextEditor/TextEditor"), {
  ssr: false,
});

const TextEditorAr = dynamic(() => import("@/components/TextEditorAr/TextEditorAr"), {
  ssr: false,
});


function TermsConditions(props) {
  const [loading, setLoading] = useState(false);
  const quillRef = useRef();

  const CMSDetail = useDataStore((store) => store.CMSDetail);
  const { fetchCMSDetail } = useDataStore();

  useEffect(() => {
    fetchCMSDetail({ cms_type: props.status });
  }, []);

  const initialValues = {
    content: props.status ? CMSDetail?.description : "",
    content_ar: props.status ? CMSDetail?.description_ar : "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      content: Yup.string().required("Required"),
      content_ar: Yup.string().required("Required"),
    }),
    enableReinitialize: true,
    onSubmit: (values, { isSubmitting, resetForm }) => {
      setLoading(true);
      const payload = {
        cms_type: parseInt(props.status),
        title: "Zuroona Terms & Conditions",
        description: values.content,
        description_ar: values.content_ar,
        id: CMSDetail?._id,
      };

      AddEditCMSApi(payload).then((data) => {
        setLoading(false);
        if (data?.status === 1) {
          toast.success(data.message);
          fetchCMSDetail({ cms_type: props.status });
        } else {
          setLoading(false);
          toast.error(data.message);
        }
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col items-center">
      <div className="flex justify-center mb-4 w-full">
        <div className="mb-4 max-w-5xl w-5/6">
          <TextEditor
            ref={quillRef}
            name="content"
            value={formik.values.content}
            onBlur={formik.onBlur}
            formik={formik}
          />
          {formik.errors.content && formik.touched.content && (
            <div className="text-red-500">{formik.errors.content}</div>
          )}
        </div>
      </div>
      <div className="flex justify-center mb-4 w-full">
        <div className="mb-4 max-w-5xl w-5/6">
          <TextEditorAr
            ref={quillRef}
            name="content_ar"
            value={formik.values.content_ar}
            onBlur={formik.onBlur}
            formik={formik}
          />
          {formik.errors.content_ar && formik.touched.content_ar && (
            <div className="text-red-500">{formik.errors.content_ar}</div>
          )}
        </div>
      </div>
      <div className="w-full flex justify-center">
        <button
          type="submit"
          className="gap-x-2 px-48 py-3 text-white bg-[#a3cc69] hover:bg-[#9fb68b] transition-all duration-300 rounded-md text-1xl uppercase font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          {loading ? (
            <Loader color="#fff" />
          ) : props.status ? (
            "Update"
          ) : (
            "Save"
          )}
        </button>
      </div>
    </form>
  );
}

export default TermsConditions;
