"use client";

import { useState, useEffect } from "react";
import S3 from "react-aws-s3";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import Image from "next/image";
import Loader from "../Loader/Loader";
import { useDataStore } from "@/app/api/store/store";
import { getData } from "@/app/api/index";
import { OrganizerEditProfileApi, UploadFileApi } from "@/app/api/setting";
import { useTranslation } from "react-i18next";

const UploadId = ({ title, buttonName, labelName }) => {
    const { t } = useTranslation();
    const [s3Client, setS3Client] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [fileLoading, setFileLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState(null); // State for file name

    const detail = useDataStore((store) => store.ProfileDetail);
    const { fetchProfileDetail } = useDataStore();

    useEffect(() => {
        fetchProfileDetail().then(() => { });
        // Load S3 credentials dynamically from backend
        getData("get-s3-credentials")
            .then((res) => {
                if (res?.status === 1 && res?.data) {
                    const creds = res.data;
                    const dynamicConfig = {
                        bucketName: creds.bucketName,
                        region: creds.region,
                        accessKeyId: creds.accessKeyId,
                        secretAccessKey: creds.secretAccessKey,
                        s3Url: `https://s3.${creds.region}.amazonaws.com/${creds.bucketName}`,
                        dirName: "Jeena",
                        acl: "private",
                    };
                    setS3Client(new S3(dynamicConfig));
                } else {
                    toast.error("Unable to load upload configuration");
                }
            })
            .catch(() => {
                toast.error("Unable to load upload configuration");
            });
    }, []);

    const formik = useFormik({
        initialValues: {
            // registration_step: 2,
            govt_id: detail?.user?.govt_id || "",
        },
        enableReinitialize: true,
        onSubmit: (values) => {
            setLoading(true);
            const payload = {
                ...values,
            };

            OrganizerEditProfileApi(payload)
                .then((res) => {
                    setLoading(false);
                    if (res.status === 1) {
                        toast.success(res.message);
                    } else {
                        toast.error(res.message);
                    }
                })
                .catch((e) => {
                    setLoading(false);
                    toast.error("An error occurred.");
                });
        },
    });

    const handleFile = (file) => {
        if (file) {
            setFileLoading(true);
            setFileName(file.name); // Set the file name
            UploadFileApi({ file, dirName: "Jeena" })
                .then((resp) => {
                    if (resp?.status === 1 && resp?.data?.location) {
                        formik.setFieldValue("govt_id", resp.data.location);
                        setPreviewUrl(resp.data.location);
                        setFileLoading(false);
                    } else {
                        throw new Error(resp?.message || "Upload failed");
                    }
                })
                .catch(() => {
                    toast.error("File upload failed");
                    setFileLoading(false);
                });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFile(file);
        }
    };

    return (
        <div className="flex-grow bg-white h-max p-7 rounded-xl">
            <h1 className="text-xl font-bold mb-4">{title}</h1>
            {formik.values.govt_id && formik.values.govt_id.toLowerCase().includes(".pdf") && (
                <div className="bg-[#fdfdfd] border-orange-300 border p-3 py-2 rounded-lg flex items-center justify-between mt-8 mb-5">
                    <div className="flex items-center w-full justify-between gap-x-4 sm:gap-x-7">
                        <div className="flex items-center gap-3">
                            <Image
                                src="/assets/images/icons/pdf.png"
                                height={35}
                                width={27}
                                alt="PDF Icon"
                            />
                            <span className="text-xs text-gray-800 font-semibold sm:mr-3">
                                {fileName}
                            </span>
                        </div>
                        {/* PDF View Button */}
                        <div className="flex">
                            {formik.values.govt_id && (
                                <a
                                    href={formik.values.govt_id}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-2 px-4 bg-[#a797cc] text-sm text-white rounded-md hover:bg-orange-600"
                                >
                                    {t('signup.tab59')}
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* Form */}
            <form onSubmit={formik.handleSubmit}>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                    {labelName}
                </label>

                {/* Upload Box */}
                <label htmlFor="file-upload" className="w-full cursor-pointer">
                    <div className="w-full h-52 border-2 bg-[#fdfdfd] border-orange-300 rounded-lg flex items-center justify-center mb-4">
                        <div className="text-start">
                            {fileLoading ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Loader />
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    {formik.values.govt_id && formik.values.govt_id.toLowerCase().includes(".pdf") ? (
                                        // Show PDF icon if the file is a PDF
                                        <Image
                                            src="/assets/images/icons/pdf.png"
                                            height={35}
                                            width={35}
                                            alt="PDF Icon"
                                        />
                                    ) : previewUrl ? (
                                        // Show image preview if the file is an image
                                        <Image
                                            src={previewUrl}
                                            alt="Uploaded Event Image"
                                            height={71}
                                            width={104}
                                        />
                                    ) : formik.values.govt_id ? (
                                        // Show existing image if no new upload is present
                                        <Image
                                            src={formik.values.govt_id}
                                            alt="Existing Event Image"
                                            height={71}
                                            width={104}
                                        />
                                    ) : (
                                        // Show default upload icon if no file is uploaded
                                        <Image
                                            src="/assets/images/icons/upload.png"
                                            height={71}
                                            width={104}
                                            alt="Upload Icon"
                                        />
                                    )}
                                </div>
                            )}
                            <p className="text-gray-500 text-sm mt-5 text-center">{t('signup.tab30')}</p>
                        </div>


                    </div>
                    <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
                </label>

                {/* Next Button */}
                <div className="px-10 mt-10">
                    <button
                        type="submit"
                        className="w-full py-4 bg-[#a797cc] text-white font-semibold rounded-xl hover:bg-orange-600"
                    >
                        {loading ? <Loader color="#fff" height='30' /> : buttonName}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UploadId;
