"use client";
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { format } from 'date-fns';

const InvoiceDetailModal = ({ show, onClose, invoice }) => {
    const { t } = useTranslation();

    if (!show || !invoice) return null;

    const getStatusColor = (status) => {
        if (status === 0 || status === 1) return "bg-yellow-100 text-yellow-700 border-yellow-300";
        if (status === 2) return "bg-green-100 text-green-700 border-green-300";
        if (status === 3 || status === 4) return "bg-red-100 text-red-700 border-red-300";
        if (status === 5) return "bg-blue-100 text-blue-700 border-blue-300";
        if (status === 6) return "bg-gray-100 text-gray-700 border-gray-300";
        return "bg-gray-100 text-gray-700 border-gray-300";
    };

    const getStatusText = (status) => {
        const statusMap = {
            0: t('invoice.status.pending') || 'Pending',
            1: t('invoice.status.approved') || 'Approved',
            2: t('invoice.status.confirmed') || 'Confirmed',
            3: t('invoice.status.cancelled') || 'Cancelled',
            4: t('invoice.status.rejected') || 'Rejected',
            5: t('invoice.status.completed') || 'Completed',
            6: t('invoice.status.refunded') || 'Refunded',
        };
        return statusMap[status] || t('invoice.status.unknown') || 'Unknown';
    };

    const getPaymentStatusColor = (status) => {
        return status === 1 ? "bg-green-100 text-green-700 border-green-300" : "bg-yellow-100 text-yellow-700 border-yellow-300";
    };

    const getPaymentStatusText = (status) => {
        return status === 1 ? (t('invoice.payment.paid') || 'Paid') : (t('invoice.payment.unpaid') || 'Unpaid');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[10000] animate-fade-in">
            <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto mx-4 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#a3cc69] to-[#a797cc] flex items-center justify-center shadow-md">
                            <Icon icon="mdi:file-document-outline" className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{t('invoice.modal.title')}</h2>
                            <p className="text-sm text-gray-500">#{invoice.invoice_id || invoice.order_id || invoice._id}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                        <Icon icon="mdi:close" className="w-6 h-6" />
                    </button>
                </div>

                {/* Status Badges */}
                <div className="flex gap-3 mb-6">
                    <span className={`px-4 py-2 rounded-lg text-sm font-semibold border ${getPaymentStatusColor(invoice.payment_status)}`}>
                        <Icon icon="mdi:cash-check" className="inline-block w-4 h-4 mr-1" />
                        {getPaymentStatusText(invoice.payment_status)}
                    </span>
                    <span className={`px-4 py-2 rounded-lg text-sm font-semibold border ${getStatusColor(invoice.book_status)}`}>
                        <Icon icon="mdi:checkbox-marked-circle-outline" className="inline-block w-4 h-4 mr-1" />
                        {getStatusText(invoice.book_status)}
                    </span>
                </div>

                {/* Main Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Guest Information */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <Icon icon="mdi:account-outline" className="w-5 h-5 text-[#a797cc]" />
                            {t('invoice.modal.guestInfo')}
                        </h3>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                                <Image
                                    src={invoice.user?.profile_image ? (invoice.user.profile_image.includes('http') ? invoice.user.profile_image : `${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3434"}${invoice.user.profile_image}`) : "/assets/images/dummyImage.png"}
                                    alt="Guest"
                                    width={48}
                                    height={48}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">{invoice.user?.first_name} {invoice.user?.last_name}</p>
                                <p className="text-sm text-gray-500">{invoice.user?.email}</p>
                            </div>
                        </div>
                        {invoice.user?.phone_number && (
                            <p className="text-sm text-gray-600">
                                <Icon icon="mdi:phone-outline" className="inline-block w-4 h-4 mr-1" />
                                {invoice.user.phone_number}
                            </p>
                        )}
                    </div>

                    {/* Event Information */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <Icon icon="mdi:calendar-star" className="w-5 h-5 text-[#a797cc]" />
                            {t('invoice.modal.eventInfo')}
                        </h3>
                        {invoice.event?.event_main_image && (
                            <div className="w-full h-24 rounded-lg overflow-hidden mb-2 border border-gray-200">
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3434"}${invoice.event.event_main_image}`}
                                    alt="Event"
                                    width={200}
                                    height={96}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        )}
                        <p className="font-semibold text-gray-800 mb-1">{invoice.event?.event_name || 'N/A'}</p>
                        {invoice.event?.event_date && (
                            <p className="text-sm text-gray-600">
                                <Icon icon="mdi:calendar-clock" className="inline-block w-4 h-4 mr-1" />
                                {format(new Date(invoice.event.event_date), 'MMM dd, yyyy')}
                            </p>
                        )}
                        <p className="text-sm text-gray-600 mt-1">
                            <Icon icon="mdi:ticket-outline" className="inline-block w-4 h-4 mr-1" />
                            {invoice.no_of_attendees || 1} {t('invoice.modal.attendees')}
                        </p>
                    </div>

                    {/* Organizer Information */}
                    {invoice.organizer && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <Icon icon="mdi:account-tie" className="w-5 h-5 text-[#a797cc]" />
                                {t('invoice.modal.organizerInfo')}
                            </h3>
                            <p className="font-semibold text-gray-800">
                                {invoice.organizer.group_name || `${invoice.organizer.first_name} ${invoice.organizer.last_name}`}
                            </p>
                        </div>
                    )}

                    {/* Payment Information */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <Icon icon="mdi:cash-multiple" className="w-5 h-5 text-[#a797cc]" />
                            {t('invoice.modal.paymentInfo')}
                        </h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">{t('invoice.modal.amount')}:</span>
                                <span className="text-lg font-bold text-gray-800">{invoice.total_amount?.toFixed(2) || '0.00'} SAR</span>
                            </div>
                            {invoice.payment_id && (
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">{t('invoice.modal.paymentId')}:</span>
                                    <span className="text-sm font-medium text-gray-700">{invoice.payment_id}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">{t('invoice.modal.date')}:</span>
                                <span className="text-sm text-gray-700">{format(new Date(invoice.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Invoice Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    {invoice.invoice_url && (
                        <a
                            href={invoice.invoice_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 bg-[#a3cc69] text-white rounded-lg font-semibold hover:bg-[#89b35e] transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            <Icon icon="mdi:file-download-outline" className="w-5 h-5" />
                            {t('invoice.modal.downloadInvoice')}
                        </a>
                    )}
                    <button
                        onClick={onClose}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
                    >
                        {t('common.close') || 'Close'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetailModal;

