"use client";

import { useDataStore } from "@/api/store/store";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ChangeStatusOrganizerApi } from "@/api/organizer/apis";
import RejectOrganizerModal from "@/components/Modals/RejectOrganizerModal";
import { useTranslation } from "react-i18next";

export default function EventOrganizerDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const detail = useDataStore((store) => store.OrganizerDetail);
  const { fetchOrganizerDetail } = useDataStore();

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchOrganizerDetail({ id: id })
        .then(() => setLoading(false))
        .catch((err) => {
          setLoading(false);
          toast.error("Failed to fetch Organizer details");
        });
    }
  }, [id, fetchOrganizerDetail]);

  // Function to change status
  const ChangeStatus = (newStatus, rejectionReason = "") => {
    setLoading(true);
    
    const data = {
      userId: detail._id,
      is_approved: newStatus, // 2 for approved, 3 for rejected
      rejectionReason: rejectionReason || null,
    };

    ChangeStatusOrganizerApi(data)
      .then((res) => {
        if (res?.status === 1) {
          toast.success(res?.message);
          fetchOrganizerDetail({ id: detail._id }); // Refresh details after status change
          setShowRejectModal(false);
        } else {
          toast.error(res?.message);
        }
      })
      .catch((err) => {
        toast.error(t("organizerDetail.failedToUpdateStatus"));
      })
      .finally(() => setLoading(false));
  };

  const handleReject = (reason) => {
    ChangeStatus(3, reason); // 3 = Rejected
  };

  return (
    <DefaultLayout>
      <div className="min-h-screen pb-10">
        <div className="flex justify-between py-5">
          {/* Header */}
          <div className="flex w-[60%] items-end">
            <h1 className="text-xl font-bold text-black">{t("organizerDetail.title")}</h1>
          </div>
        </div>

        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Organizer Info */}
            <div className="flex items-center sm:items-start flex-col sm:flex-row md:flex-row xl:flex-col lg:items-start xl:items-center col-span-full lg:col-span-full xl:col-span-1">
              <div className="relative w-full sm:w-[290px] h-[290px] rounded-lg overflow-hidden border-2 border-gray-200 shadow-md">
                <Image
                  src={(() => {
                    const getImageUrl = (imgPath) => {
                      if (!imgPath) return "/assets/images/dummyImage.png";
                      if (imgPath.includes("http://") || imgPath.includes("https://")) return imgPath;
                      if (imgPath.startsWith("/uploads/")) {
                        const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3434";
                        const baseUrl = apiBase.replace(/\/api\/admin\/?$/, "").replace(/\/api\/?$/, "");
                        return `${baseUrl}${imgPath}`;
                      }
                      return "/assets/images/dummyImage.png";
                    };
                    return getImageUrl(detail?.profile_image);
                  })()}
                  alt={detail?.first_name || "Organizer"}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.target.src = "/assets/images/dummyImage.png";
                  }}
                />
              </div>
              <div className="w-full py-5 sm:py-0 xl:py-5 px-0 sm:px-5 xl:px-0">
                <table className="table-auto w-full">
                  <tbody>
                    {/* Table Row - Organizer ID */}
                    <tr className="border-b border-gray-300">
                      <td className="w-2/5 py-2 xl:py-1 text-left text-sm font-semibold text-gray-800 whitespace-nowrap">
                        {t("organizerDetail.organizerId")}:
                      </td>
                      <td className="py-2 xl:py-1 text-left text-sm text-gray-600 font-semibold break-all">
                        #{detail?._id}
                      </td>
                    </tr>

                    {/* Table Row - Name */}
                    <tr className="border-b border-gray-300">
                      <td className="w-2/5 py-2 xl:py-1 text-left text-sm font-semibold text-gray-800 whitespace-nowrap">
                        {t("organizerDetail.name")}:
                      </td>
                      <td className="py-2 xl:py-1 text-left text-sm text-gray-600 font-semibold break-all">
                        {detail?.first_name} {detail?.last_name}
                      </td>
                    </tr>

                    {/* Table Row - Email */}
                    <tr className="border-b border-gray-300">
                      <td className="flex py-2 xl:py-1 text-left text-sm font-semibold text-gray-800 whitespace-nowrap">
                        {t("organizerDetail.emailAddress")}:
                      </td>
                      <td className="py-2 xl:py-1 text-left text-sm text-gray-600 font-semibold break-all">
                        {detail?.email}
                      </td>
                    </tr>

                    {/* Table Row - Phone No */}
                    <tr className="border-b border-gray-300">
                      <td className="w-2/5 py-2 xl:py-1 text-left text-sm font-semibold text-gray-800 whitespace-nowrap">
                        {t("organizerDetail.phoneNo")}:
                      </td>
                      <td className="py-2 xl:py-1 text-left text-sm text-gray-600 font-semibold break-all">
                        {detail?.country_code} {detail?.phone_number}
                      </td>
                    </tr>

                    {/* Table Row - Gender */}
                    <tr className="border-b border-gray-300">
                      <td className="w-2/5 py-2 xl:py-1 text-left text-sm font-semibold text-gray-800 whitespace-nowrap">
                        {t("organizerDetail.gender")}:
                      </td>
                      <td className="py-2 xl:py-1 text-left text-sm text-gray-600 font-semibold break-all">
                        {detail?.gender === 1 ? t("organizerDetail.male") : t("organizerDetail.female")}
                      </td>
                    </tr>

                    {/* Table Row - Date of birth */}
                    <tr className="border-b border-gray-300">
                      <td className="w-2/5 py-2 xl:py-1 text-left text-sm font-semibold text-gray-800 whitespace-nowrap">
                        {t("organizerDetail.dateOfBirth")}:
                      </td>
                      <td className="py-2 xl:py-1 text-left text-sm text-gray-600 font-semibold break-all">
                        {detail?.date_of_birth
                          ? new Date(detail?.date_of_birth).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>

                    {/* Table Row - City */}
                    <tr className="border-b border-gray-300">
                      <td className="w-2/5 py-2 xl:py-1 text-left text-sm font-semibold text-gray-800 whitespace-nowrap">
                        {t("organizerDetail.city")}:
                      </td>
                      <td className="py-2 xl:py-1 text-left text-sm text-gray-600 font-semibold break-all">
                        {detail?.address}
                      </td>
                    </tr>
                    {/* Table Row - Registration Type */}
                    <tr className="border-b border-gray-300">
                      <td className="w-2/5 py-2 xl:py-1 text-left text-sm font-semibold text-gray-800 whitespace-nowrap">
                        {t("organizerDetail.registrationType")}:
                      </td>
                      <td className="py-2 xl:py-1 text-left text-sm text-gray-600 font-semibold break-all">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          detail?.registration_type === 'Re-apply' 
                            ? 'bg-orange-100 text-orange-700 border border-orange-300' 
                            : 'bg-blue-100 text-blue-700 border border-blue-300'
                        }`}>
                          {detail?.registration_type || 'New'}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bio Section */}
            <div className="col-span-full lg:col-span-full xl:col-span-3">
              <div className="bg-white p-6 rounded-lg py-8">
                <h2 className="font-bold text-lg text-gray-900">{t("organizerDetail.bio")}:</h2>
                <p className="text-sm text-gray-800 font-semibold mt-2">
                  {detail?.bio || t("organizerDetail.noBioAvailable")}
                </p>
              </div>
              {/* Govt. ID Section with Image Preview */}
              <div className="bg-white p-6 rounded-lg mt-8">
                <h3 className="font-semibold text-xl text-gray-900 mb-4">
                  {t("organizerDetail.governmentId")}
                </h3>
                {detail?.govt_id && (() => {
                  // Handle comma-separated URLs (front,back) or single URL
                  const govtIdStr = detail.govt_id || '';
                  const govtIdUrls = govtIdStr.includes(',') 
                    ? govtIdStr.split(',').map(url => url.trim()).filter(url => url)
                    : [govtIdStr.trim()].filter(url => url);
                  
                  // Get API base URL (without /api/admin/)
                  const getApiBaseUrl = () => {
                    if (typeof window !== 'undefined') {
                      const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3434/api/admin/';
                      // Extract base URL: http://localhost:3434
                      const match = apiBase.match(/^(https?:\/\/[^\/]+)/);
                      return match ? match[1] : 'http://localhost:3434';
                    }
                    return 'http://localhost:3434';
                  };
                  
                  // Helper to construct full URL
                  const getFullUrl = (url) => {
                    if (!url) return null;
                    
                    // If already absolute URL (starts with http:// or https://), return as is
                    if (url.startsWith('http://') || url.startsWith('https://')) {
                      return url;
                    }
                    
                    // If relative path (starts with /uploads/), construct absolute URL
                    const baseUrl = getApiBaseUrl();
                    const cleanPath = url.startsWith('/') ? url : `/${url}`;
                    return `${baseUrl}${cleanPath}`;
                  };
                  
                  // Download handler
                  const handleDownload = async (url, index) => {
                    try {
                      const fullUrl = getFullUrl(url);
                      if (!fullUrl) {
                        toast.error(t("organizerDetail.invalidFileUrl"));
                        return;
                      }
                      
                      const link = document.createElement('a');
                      link.href = fullUrl;
                      link.download = `govt_id_${index === 0 ? 'front' : 'back'}.${url.split('.').pop() || 'png'}`;
                      link.target = '_blank';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    } catch (error) {
                      console.error('Download error:', error);
                      toast.error(t("organizerDetail.failedToDownload"));
                    }
                  };
                  
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {govtIdUrls.map((url, index) => {
                        const fullUrl = getFullUrl(url);
                        if (!fullUrl) return null;
                        
                        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
                        
                        return (
                          <div key={index} className="border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                            <div className="p-3 border-b border-gray-200 bg-white">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold text-gray-700">
                                  {govtIdUrls.length > 1 ? (index === 0 ? t("organizerDetail.frontId") : t("organizerDetail.backId")) : t("organizerDetail.governmentId")}
                                </h4>
                                <button
                                  onClick={() => handleDownload(url, index)}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-[#a797cc] text-white rounded hover:bg-[#8b7bb3] transition-colors text-xs font-medium"
                                  title={t("organizerDetail.download")}
                                >
                                  <Image
                                    src="/assets/images/home/download.png"
                                    height={16}
                                    width={16}
                                    alt={t("organizerDetail.download")}
                                  />
                                  {t("organizerDetail.download")}
                                </button>
                              </div>
                            </div>
                            <div className="relative w-full h-64 bg-gray-100">
                              {isImage ? (
                                <Image
                                  src={fullUrl}
                                  alt={`${index === 0 ? 'Front' : 'Back'} Government ID`}
                                  fill
                                  className="object-contain"
                                  onError={(e) => {
                                    e.target.src = "/assets/images/dummyImage.png";
                                  }}
                                />
                              ) : (
                                <div className="flex flex-col items-center justify-center h-full p-4">
                                  <Image
                                    src="/assets/images/home/pdf.png"
                                    height={64}
                                    width={64}
                                    alt="PDF Document"
                                    className="mb-2"
                                  />
                                  <p className="text-sm text-gray-600 text-center">
                                    {url.split('/').pop() || 'Government ID Document'}
                                  </p>
                                  <button
                                    onClick={() => window.open(fullUrl, '_blank')}
                                    className="mt-2 text-xs text-[#a797cc] hover:underline hover:text-[#a08ec8]"
                                  >
                                    {t("organizerDetail.viewDocument")}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
                {!detail?.govt_id && (
                  <p className="text-sm text-gray-500 italic">{t("organizerDetail.noGovtIdUploaded")}</p>
                )}
              </div>

              {/* Questions Answered Section */}
              {detail?.questions && detail?.questions?.length > 0 && (
                <div className="bg-white p-6 rounded-lg mt-8">
                  <h2 className="font-bold text-lg text-gray-900 mb-4">{t("organizerDetail.questionsAnswered")}</h2>
                  <div className="space-y-4">
                    {detail.questions.map((question, index) => (
                      <div key={index} className="border-b border-gray-200 pb-3 last:border-0">
                        <p className="text-sm font-semibold text-gray-800 mb-1">
                          Q{index + 1}: {question.question || question}
                        </p>
                        <p className="text-sm text-gray-600">
                          A: {question.answer || "N/A"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bank Information Section */}
              {(detail?.bank_account || detail?.bank_name || detail?.account_number || detail?.iban || detail?.bank_info) && (
                <div className="bg-white p-6 rounded-lg mt-8">
                  <h2 className="font-bold text-lg text-gray-900 mb-4">{t("organizerDetail.bankInformation")}</h2>
                  <table className="table-auto w-full">
                    <tbody>
                      {detail?.bank_name && (
                        <tr className="border-b border-gray-300">
                          <td className="w-2/5 py-2 text-left text-sm font-semibold text-gray-800 whitespace-nowrap">
                            {t("organizerDetail.bankName")}:
                          </td>
                          <td className="py-2 text-left text-sm text-gray-600 font-semibold break-all">
                            {detail.bank_name}
                          </td>
                        </tr>
                      )}
                      {detail?.account_number && (
                        <tr className="border-b border-gray-300">
                          <td className="w-2/5 py-2 text-left text-sm font-semibold text-gray-800 whitespace-nowrap">
                            {t("organizerDetail.accountNumber")}:
                          </td>
                          <td className="py-2 text-left text-sm text-gray-600 font-semibold break-all">
                            {detail.account_number}
                          </td>
                        </tr>
                      )}
                      {detail?.iban && (
                        <tr className="border-b border-gray-300">
                          <td className="w-2/5 py-2 text-left text-sm font-semibold text-gray-800 whitespace-nowrap">
                            {t("organizerDetail.iban")}:
                          </td>
                          <td className="py-2 text-left text-sm text-gray-600 font-semibold break-all">
                            {detail.iban}
                          </td>
                        </tr>
                      )}
                      {detail?.account_holder_name && (
                        <tr className="border-b border-gray-300">
                          <td className="w-2/5 py-2 text-left text-sm font-semibold text-gray-800 whitespace-nowrap">
                            {t("organizerDetail.accountHolderName")}:
                          </td>
                          <td className="py-2 text-left text-sm text-gray-600 font-semibold break-all">
                            {detail.account_holder_name}
                          </td>
                        </tr>
                      )}
                      {detail?.bank_info && typeof detail.bank_info === 'object' && (
                        Object.entries(detail.bank_info).map(([key, value]) => (
                          <tr key={key} className="border-b border-gray-300">
                            <td className="w-2/5 py-2 text-left text-sm font-semibold text-gray-800 whitespace-nowrap">
                              {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                            </td>
                            <td className="py-2 text-left text-sm text-gray-600 font-semibold break-all">
                              {value || "N/A"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Govt. ID Section */}
          </div>

          {/* Accept/Reject Buttons */}
          <div className="flex justify-center pt-10 xl:pt-0">
            <div className="flex flex-col md:flex-row gap-x-5  gap-y-5 mt-6">
              {detail?.is_approved === 1 && (
                <>
                  <button
                    onClick={() => ChangeStatus(2)} // Approve
                    className="bg-green-600 text-white py-3 px-24 sm:px-28 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors duration-300"
                  >
                    {t("organizerDetail.acceptIt")}
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)} // Show reject modal with reason
                    className="bg-red-600 text-white py-3 px-24 sm:px-28 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors duration-300"
                  >
                    {t("organizerDetail.rejectIt")}
                  </button>
                </>
              )}
              {detail?.is_approved === 2 && (
                <button
                  className="bg-[#a797cc] text-white py-3 px-24 sm:px-28 rounded-lg text-lg font-semibold hover:bg-[#a08ec8] transition"
                  disabled
                >
                  {t("organizerDetail.accepted")}
                </button>
              )}
              {detail?.is_approved === 3 && (
                <button
                  className="bg-[#e94e2e] text-white py-3 px-24 sm:px-28 rounded-lg text-lg font-semibold"
                  disabled
                >
                  {t("organizerDetail.rejected")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      <RejectOrganizerModal
        show={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleReject}
        title="Reject Organizer"
        message="Are you sure you want to reject this organizer? Please provide a reason below."
      />
    </DefaultLayout>
  );
}
