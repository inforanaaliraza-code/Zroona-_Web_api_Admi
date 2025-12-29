"use client";
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const InvoiceCard = ({ booking }) => {
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState(false);

    if (!booking || booking.payment_status !== 1 || !booking.invoice_url) {
        return null;
    }

    const handleDownload = () => {
        window.open(booking.invoice_url, '_blank');
        toast.success(t('invoice.downloadStarted') || 'Invoice download started');
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(booking.invoice_id || booking.order_id);
        toast.success(t('invoice.copiedToClipboard') || 'Invoice ID copied to clipboard');
    };

    return (
        <div className="bg-gradient-to-br from-green-50 to-green-100/50 border-2 border-green-200 rounded-xl p-5 shadow-md animate-fade-in hover:shadow-lg transition-all duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                        <Icon icon="mdi:file-document-check-outline" className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">{t('invoice.title') || 'Payment Invoice'}</h3>
                        <p className="text-xs text-gray-500">{t('invoice.subtitle') || 'Receipt & Payment Details'}</p>
                    </div>
                </div>
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-green-600 hover:text-green-700 transition-transform duration-200"
                >
                    <Icon icon={expanded ? "mdi:chevron-up" : "mdi:chevron-down"} className="w-6 h-6" />
                </button>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-green-200/50">
                    <p className="text-xs text-gray-600 mb-1">{t('invoice.invoiceId') || 'Invoice ID'}</p>
                    <div className="flex items-center justify-between">
                        <p className="font-bold text-gray-800 text-sm truncate">#{booking.invoice_id || booking.order_id || 'N/A'}</p>
                        <button 
                            onClick={handleCopy}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                            title={t('common.copy') || 'Copy'}
                        >
                            <Icon icon="mdi:content-copy" className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-green-200/50">
                    <p className="text-xs text-gray-600 mb-1">{t('invoice.amount') || 'Amount Paid'}</p>
                    <p className="font-bold text-green-700 text-lg">{booking.total_amount || 0} SAR</p>
                </div>
            </div>

            {/* Expanded Details */}
            {expanded && (
                <div className="space-y-3 animate-slide-down">
                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-green-200/50">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <Icon icon="mdi:information-outline" className="w-4 h-4 text-green-600" />
                            {t('invoice.paymentDetails') || 'Payment Details'}
                        </h4>
                        <div className="space-y-2 text-sm">
                            {booking.payment_id && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">{t('invoice.paymentId') || 'Payment ID'}:</span>
                                    <span className="font-medium text-gray-800">{booking.payment_id}</span>
                                </div>
                            )}
                            {booking.order_id && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">{t('invoice.orderId') || 'Order ID'}:</span>
                                    <span className="font-medium text-gray-800">{booking.order_id}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-600">{t('invoice.paymentDate') || 'Payment Date'}:</span>
                                <span className="font-medium text-gray-800">
                                    {booking.payment_date 
                                        ? format(new Date(booking.payment_date), 'MMM dd, yyyy HH:mm')
                                        : format(new Date(), 'MMM dd, yyyy HH:mm')}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">{t('invoice.attendees') || 'Attendees'}:</span>
                                <span className="font-medium text-gray-800">{booking.attendees || booking.no_of_attendees || 1}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-green-200">
                                <span className="text-gray-700 font-semibold">{t('invoice.totalAmount') || 'Total Amount'}:</span>
                                <span className="font-bold text-green-700 text-lg">{booking.total_amount || 0} SAR</span>
                            </div>
                        </div>
                    </div>

                    {/* VAT Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                        <Icon icon="mdi:information-outline" className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-blue-800">
                            <p className="font-semibold mb-1">{t('invoice.vatNote') || 'VAT Included'}</p>
                            <p>{t('invoice.vatDescription') || 'This invoice includes 15% VAT as per Saudi Arabia tax regulations.'}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Download Button */}
            <button
                onClick={handleDownload}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 px-4 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
            >
                <Icon icon="mdi:file-download-outline" className="w-5 h-5" />
                {t('invoice.downloadInvoice') || 'Download Invoice'}
            </button>

            {/* Additional Info */}
            <p className="text-xs text-gray-500 text-center mt-3">
                <Icon icon="mdi:shield-check-outline" className="inline-block w-3 h-3 mr-1" />
                {t('invoice.secureNote') || 'This is an official receipt generated by Zuroona'}
            </p>
        </div>
    );
};

export default InvoiceCard;


