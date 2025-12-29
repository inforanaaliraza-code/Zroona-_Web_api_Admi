import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";

const ImageUploader = ({ formik, ReactS3Client, fieldName = "" }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  const handleFileChange = (file) => {
    if (file) {
      setImageLoading(true);
      ReactS3Client.uploadFile(file)
        .then((data) => {
          formik.setFieldValue(fieldName, data.location); // Dynamically set field
          setPreviewUrl(data.location);
          setImageLoading(false);
        })
        .catch((err) => {
          toast.error(t('common.imageUploadFailed') || "Image upload failed");
          setImageLoading(false);
        });
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    handleFileChange(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] }, // Accept any image type
    maxSize: 10485760, // 10MB limit
  });

  return (
    <div
      {...getRootProps()}
      className={`mt-2 flex justify-center rounded-lg border border-gray-900/25 px-6 py-10 cursor-pointer ${
        isDragActive ? "bg-gray-100" : ""
      }`}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        {imageLoading ? (
          <Loader />
        ) : previewUrl ? (
          <img
            src={previewUrl}
            alt="New Image Preview"
            className="w-72 h-48 object-contain mb-4"
          />
        ) : (
          <svg
            className="mx-auto h-12 w-12 text-gray-300"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
              clipRule="evenodd"
            ></path>
          </svg>
        )}
        <p className="text-sm leading-6 text-gray-900 font-medium">
          <span className="font-semibold text-[#bc611e] underline">Upload an Image</span> or {isDragActive ? "Drop the files here..." : "Drag and drop"}
        </p>
        <p className="text-sm leading-5 font-medium text-gray-300">PNG, JPG up to 10MB</p>
      </div>
    </div>
  );
};

export default ImageUploader;
