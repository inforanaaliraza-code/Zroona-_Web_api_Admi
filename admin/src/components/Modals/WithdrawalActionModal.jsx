"use client";

import { useState } from "react";
import { FaTimes, FaCheckCircle, FaTimesCircle, FaMoneyBillWave, FaUser, FaCalendar, FaBuilding, FaCreditCard } from "react-icons/fa";
import Image from "next/image";

export default function WithdrawalActionModal({ show, onClose, onConfirm, request, actionType }) {
  const [adminNotes, setAdminNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [transactionRef, setTransactionRef] = useState("");
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleSubmit = async () => {
    setLoading(true);
    const data = {
      id: request._id,
      status: actionType === "approve" ? 1 : 2,
      admin_notes: adminNotes || undefined,
    };

    if (actionType === "reject" && rejectionReason) {
      data.rejection_reason = rejectionReason;
    }

    if (actionType === "approve" && transactionRef) {
      data.transaction_reference = transactionRef;
    }

    await onConfirm(data);
    setLoading(false);
    handleClose();
  };

  const handleClose = () => {
    setAdminNotes("");
    setRejectionReason("");
    setTransactionRef("");
    onClose();
  };

  const isApprove = actionType === "approve";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className={`p-6 border-b ${isApprove ? 'bg-gradient-to-r from-green-50 to-emerald-50' : 'bg-gradient-to-r from-red-50 to-rose-50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isApprove ? (
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <FaCheckCircle className="text-white text-2xl" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <FaTimesCircle className="text-white text-2xl" />
                </div>
              )}
              <div>
                <h2 className={`text-2xl font-bold ${isApprove ? 'text-green-700' : 'text-red-700'}`}>
                  {isApprove ? 'Approve Withdrawal Request' : 'Reject Withdrawal Request'}
                </h2>
                <p className="text-gray-600 text-sm">Review and {isApprove ? 'approve' : 'reject'} this request</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <FaTimes className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Request Details */}
        <div className="p-6">
          {/* Host Info */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaUser className="text-[#a797cc]" />
              Host Information
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <Image
                  src={request.host_image || "/assets/images/dummyImage.png"}
                  alt={request.host_name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">{request.host_name}</h4>
                {request.organizer?.email && (
                  <p className="text-gray-600 text-sm">{request.organizer.email}</p>
                )}
                {request.organizer?.phone_number && (
                  <p className="text-gray-600 text-sm">+{request.organizer.country_code || ''} {request.organizer.phone_number}</p>
                )}
              </div>
            </div>
          </div>

          {/* Amount Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-[#a3cc69] to-[#9fb68b] rounded-xl p-5 text-white">
              <div className="flex items-center gap-3 mb-2">
                <FaMoneyBillWave className="text-2xl" />
                <h4 className="font-semibold">Withdrawal Amount</h4>
              </div>
              <p className="text-3xl font-bold">{request.amount} {request.currency || 'SAR'}</p>
            </div>

            <div className="bg-gradient-to-br from-[#a797cc] to-[#b0a0df] rounded-xl p-5 text-white">
              <div className="flex items-center gap-3 mb-2">
                <FaCalendar className="text-2xl" />
                <h4 className="font-semibold">Request Date</h4>
              </div>
              <p className="text-xl font-bold">
                {new Date(request.createdAt || request.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Bank Details */}
          {request.bank_details || request.organizer?.bank_details ? (
            <div className="bg-blue-50 rounded-xl p-5 mb-6 border-2 border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <FaBuilding className="text-blue-600" />
                Bank Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {(request.bank_details?.bank_name || request.organizer?.bank_details?.bank_name) && (
                  <div>
                    <p className="text-gray-600 font-medium">Bank Name</p>
                    <p className="text-gray-900 font-semibold">{request.bank_details?.bank_name || request.organizer?.bank_details?.bank_name}</p>
                  </div>
                )}
                {(request.bank_details?.account_holder_name || request.organizer?.bank_details?.account_holder_name) && (
                  <div>
                    <p className="text-gray-600 font-medium">Account Holder</p>
                    <p className="text-gray-900 font-semibold">{request.bank_details?.account_holder_name || request.organizer?.bank_details?.account_holder_name}</p>
                  </div>
                )}
                {(request.bank_details?.account_number || request.organizer?.bank_details?.account_number) && (
                  <div>
                    <p className="text-gray-600 font-medium">Account Number</p>
                    <p className="text-gray-900 font-semibold font-mono">{request.bank_details?.account_number || request.organizer?.bank_details?.account_number}</p>
                  </div>
                )}
                {(request.bank_details?.iban || request.organizer?.bank_details?.iban) && (
                  <div>
                    <p className="text-gray-600 font-medium">IBAN</p>
                    <p className="text-gray-900 font-semibold font-mono">{request.bank_details?.iban || request.organizer?.bank_details?.iban}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-yellow-800 font-medium">⚠️ No bank details available for this host</p>
            </div>
          )}

          {/* Action Form */}
          <div className="space-y-4">
            {isApprove && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaCreditCard className="inline mr-2" />
                  Transaction Reference (Optional)
                </label>
                <input
                  type="text"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="Enter transaction reference number"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#a3cc69] focus:ring-4 focus:ring-[#a3cc69]/20 transition-all"
                />
              </div>
            )}

            {!isApprove && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejection (required)"
                  rows={3}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all resize-none"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Notes (Optional)
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add internal notes (optional)"
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#a797cc] focus:ring-4 focus:ring-[#a797cc]/20 transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t flex gap-3 justify-end">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || (!isApprove && !rejectionReason.trim())}
            className={`px-8 py-3 rounded-xl font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
              isApprove
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700'
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                {isApprove ? <FaCheckCircle /> : <FaTimesCircle />}
                {isApprove ? 'Approve Request' : 'Reject Request'}
              </>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}


