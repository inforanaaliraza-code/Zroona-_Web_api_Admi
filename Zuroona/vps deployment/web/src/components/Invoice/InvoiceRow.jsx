"use client";
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { formatDate } from '@/utils/dateUtils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip-shadcn";

const InvoiceRow = ({ booking }) => {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const currentLocale = i18n.language || 'en';

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
        <>
            <div className="flex items-center gap-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsOpen(true)}
                            className="h-8 px-3 text-xs border-green-300 text-green-700 hover:bg-green-50"
                        >
                            <Icon icon="mdi:file-document-check-outline" className="w-4 h-4 mr-1" />
                            {t('invoice.view') || 'Invoice'}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t('invoice.viewDetails') || 'View invoice details'}</p>
                    </TooltipContent>
                </Tooltip>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Icon icon="mdi:file-document-check-outline" className="w-5 h-5 text-green-600" />
                            {t('invoice.title') || 'Payment Invoice'}
                        </DialogTitle>
                        <DialogDescription>
                            {t('invoice.subtitle') || 'Receipt & Payment Details'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                        {/* Invoice ID */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <p className="text-xs text-gray-600 mb-2">{t('invoice.invoiceId') || 'Invoice ID'}</p>
                            <div className="flex items-center justify-between">
                                <p className="font-bold text-gray-800">
                                    #{booking.invoice_id || booking.order_id || t('common.notAvailable') || 'N/A'}
                                </p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCopy}
                                    className="h-8 w-8 p-0"
                                >
                                    <Icon icon="mdi:content-copy" className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Amount Paid */}
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <p className="text-xs text-gray-600 mb-2">{t('invoice.amount') || 'Amount Paid'}</p>
                            <p className="font-bold text-green-700 text-2xl">
                                {booking.total_amount || 0} {t('common.currency') || 'SAR'}
                            </p>
                        </div>

                        {/* Payment Details */}
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <Icon icon="mdi:information-outline" className="w-4 h-4 text-green-600" />
                                {t('invoice.paymentDetails') || 'Payment Details'}
                            </h4>
                            <div className="space-y-2 text-sm">
                                {booking.payment_id && (
                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-600">{t('invoice.paymentId') || 'Payment ID'}:</span>
                                        <span className="font-medium text-gray-800">{booking.payment_id}</span>
                                    </div>
                                )}
                                {booking.order_id && (
                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-600">{t('invoice.orderId') || 'Order ID'}:</span>
                                        <span className="font-medium text-gray-800">{booking.order_id}</span>
                                    </div>
                                )}
                                <div className="flex justify-between py-1">
                                    <span className="text-gray-600">{t('invoice.paymentDate') || 'Payment Date'}:</span>
                                    <span className="font-medium text-gray-800">
                                        {booking.payment_date 
                                            ? formatDate(booking.payment_date, 'MMM dd, yyyy HH:mm', currentLocale)
                                            : formatDate(new Date().toISOString(), 'MMM dd, yyyy HH:mm', currentLocale)}
                                    </span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-gray-600">{t('invoice.attendees') || 'Attendees'}:</span>
                                    <span className="font-medium text-gray-800">{booking.attendees || booking.no_of_attendees || 1}</span>
                                </div>
                                <div className="flex justify-between pt-2 mt-2 border-t border-gray-200">
                                    <span className="text-gray-700 font-semibold">{t('invoice.totalAmount') || 'Total Amount'}:</span>
                                    <span className="font-bold text-green-700 text-lg">
                                        {booking.total_amount || 0} {t('common.currency') || 'SAR'}
                                    </span>
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

                        {/* Download Button */}
                        <Button
                            onClick={handleDownload}
                            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 hover:from-green-700 hover:to-green-800"
                        >
                            <Icon icon="mdi:file-download-outline" className="w-5 h-5 mr-2" />
                            {t('invoice.downloadInvoice') || 'Download Invoice'}
                        </Button>

                        {/* Additional Info */}
                        <p className="text-xs text-gray-500 text-center">
                            <Icon icon="mdi:shield-check-outline" className="inline-block w-3 h-3 mr-1" />
                            {t('invoice.secureNote') || 'This is an official receipt generated by Zuroona'}
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default InvoiceRow;
