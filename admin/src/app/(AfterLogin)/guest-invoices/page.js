"use client";

import { useState, useEffect, useCallback, useMemo, memo } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Loader from "@/components/Loader/Loader";
import Paginations from "@/components/Paginations/Pagination";
import { toast } from "react-toastify";
import { FaFileExcel, FaPrint, FaEye, FaDownload, FaSearch, FaFilter, FaCalendarAlt } from "react-icons/fa";
import { GetGuestInvoicesApi } from "@/api/admin/apis";
import { format } from "date-fns";
import Image from "next/image";
import { Icon } from "@iconify/react";
import dynamic from "next/dynamic";
const InvoiceStatsDashboard = dynamic(() => import("@/components/Invoice/InvoiceStatsDashboard"), {
  ssr: false,
  loading: () => <div className="flex justify-center items-center py-10">Loading statistics...</div>
});
const InvoiceDetailModal = dynamic(() => import("@/components/Modals/InvoiceDetailModal"), {
  ssr: false,
  loading: () => null
});
const DatePicker = dynamic(() => import("react-datepicker"), {
  ssr: false,
  loading: () => <div className="h-10 w-full bg-gray-100 rounded animate-pulse" />
});

// Lazy load CSS
if (typeof window !== "undefined") {
  import("react-datepicker/dist/react-datepicker.css");
}

export default function GuestInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("1"); // Default: paid only
  const [bookStatusFilter, setBookStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = {
        page,
        limit: itemsPerPage,
        ...(searchQuery && { search: searchQuery }),
        ...(paymentStatusFilter && { payment_status: paymentStatusFilter }),
        ...(bookStatusFilter !== "all" && { book_status: bookStatusFilter }),
        ...(startDate && { from_date: startDate.toISOString() }),
        ...(endDate && { to_date: endDate.toISOString() }),
      };
      const res = await GetGuestInvoicesApi(queryParams);
      if (res?.status === 1 || res?.code === 200) {
        const invoiceData = res?.data || [];
        setInvoices(invoiceData);
        setTotalCount(res?.total_count || invoiceData.length);
      } else {
        toast.error(res?.message || "Failed to fetch guest invoices");
      }
    } catch (error) {
      console.error("Error fetching guest invoices:", error);
      toast.error("Failed to fetch guest invoices");
    } finally {
      setLoading(false);
    }
  }, [page, itemsPerPage, searchQuery, paymentStatusFilter, bookStatusFilter, startDate, endDate]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const getStatusBadge = (status) => {
    const statusMap = {
      0: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
      1: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
      2: { label: "Confirmed", color: "bg-green-100 text-green-800" },
      3: { label: "Cancelled", color: "bg-red-100 text-red-800" },
      4: { label: "Rejected", color: "bg-red-100 text-red-800" },
      5: { label: "Completed", color: "bg-blue-100 text-blue-800" },
      6: { label: "Refunded", color: "bg-gray-100 text-gray-800" },
    };
    const statusInfo = statusMap[status] || { label: "Unknown", color: "bg-gray-100 text-gray-800" };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    if (status === 1) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          Paid
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
        Unpaid
      </span>
    );
  };

  const handleViewInvoice = (invoiceUrl) => {
    if (invoiceUrl) {
      window.open(invoiceUrl, "_blank");
    } else {
      toast.error("Invoice URL not available");
    }
  };

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailModal(true);
  };

  const exportToCSV = () => {
    // Enhanced CSV export functionality
    const headers = [
      "Invoice ID", 
      "Order ID", 
      "Guest Name", 
      "Guest Email", 
      "Guest Phone", 
      "Event Name", 
      "Event Date", 
      "Attendees", 
      "Amount (SAR)", 
      "Payment Status", 
      "Booking Status", 
      "Payment ID", 
      "Invoice Date", 
      "Organizer"
    ];
    const rows = invoices.map((inv) => [
      inv.invoice_id || "N/A",
      inv.order_id || "N/A",
      `${inv.user?.first_name || ""} ${inv.user?.last_name || ""}`.trim() || "N/A",
      inv.user?.email || "N/A",
      inv.user?.phone_number || "N/A",
      inv.event?.event_name || "N/A",
      inv.event?.event_date ? format(new Date(inv.event.event_date), "yyyy-MM-dd") : "N/A",
      inv.no_of_attendees || 1,
      inv.total_amount || 0,
      inv.payment_status === 1 ? "Paid" : "Unpaid",
      getStatusBadge(inv.book_status).props.children,
      inv.payment_id || "N/A",
      inv.createdAt ? format(new Date(inv.createdAt), "yyyy-MM-dd HH:mm:ss") : "N/A",
      inv.organizer ? (inv.organizer.group_name || `${inv.organizer.first_name} ${inv.organizer.last_name}`) : "N/A",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => {
        const cellStr = String(cell).replace(/"/g, '""');
        return cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n') ? `"${cellStr}"` : cellStr;
      }).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `guest-invoices-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Invoices exported to CSV successfully!");
  };

  return (
    <DefaultLayout search={searchQuery} setSearch={setSearchQuery} setPage={setPage}>
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black">Guest Invoices & Receipts</h1>
        </div>

        {/* Statistics Dashboard */}
        <InvoiceStatsDashboard />

        {/* Filters and Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 mt-8 border border-gray-100 animate-slide-up">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            {/* Search Input */}
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                placeholder="Search by invoice ID, guest name, email, or event..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a797cc] focus:border-transparent transition-all duration-200"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Payment Status Filter */}
            <div className="relative">
              <select
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a797cc] focus:border-transparent transition-all duration-200 appearance-none"
                value={paymentStatusFilter}
                onChange={(e) => { setPaymentStatusFilter(e.target.value); setPage(1); }}
              >
                <option value="1">Paid Only</option>
                <option value="0">Unpaid Only</option>
                <option value="">All Payment Status</option>
              </select>
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Icon icon="mdi:chevron-down" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Booking Status Filter */}
            <div className="relative">
              <select
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a797cc] focus:border-transparent transition-all duration-200 appearance-none"
                value={bookStatusFilter}
                onChange={(e) => { setBookStatusFilter(e.target.value); setPage(1); }}
              >
                <option value="all">All Booking Status</option>
                <option value="1">Pending</option>
                <option value="2">Confirmed</option>
                <option value="3">Cancelled</option>
                <option value="4">Rejected</option>
                <option value="5">Completed</option>
                <option value="6">Refunded</option>
              </select>
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Icon icon="mdi:chevron-down" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Date Range Filter */}
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-gray-400" />
              <DatePicker
                selected={startDate}
                onChange={(date) => { setStartDate(date); setPage(1); }}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Start Date"
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a797cc] focus:border-transparent transition-all duration-200"
              />
              <span>-</span>
              <DatePicker
                selected={endDate}
                onChange={(date) => { setEndDate(date); setPage(1); }}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText="End Date"
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a797cc] focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Export Buttons */}
            <div className="flex gap-3 ml-auto">
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md"
                disabled={invoices.length === 0}
              >
                <FaFileExcel /> Export CSV
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md"
              >
                <FaPrint /> Print
              </button>
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 animate-fade-in">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg">
              <thead className="bg-[#f3f7ff] border-b border-gray-200">
                <tr className="text-sm text-gray-600 uppercase">
                  <th className="px-4 py-3 text-left font-semibold">Invoice ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Guest</th>
                  <th className="px-4 py-3 text-left font-semibold">Event</th>
                  <th className="px-4 py-3 text-left font-semibold">Attendees</th>
                  <th className="px-4 py-3 text-left font-semibold">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Date</th>
                  <th className="px-4 py-3 text-center font-semibold">Details</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center">
                      <Loader />
                    </td>
                  </tr>
                ) : invoices.length > 0 ? (
                  invoices.map((invoice) => (
                    <tr
                      key={invoice._id}
                      className="border-b border-gray-100 last:border-0 text-sm text-gray-800 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-4 py-3">
                        {invoice.invoice_id ? (
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">#{invoice.invoice_id}</span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                            <Image
                              src={invoice.user?.profile_image ? (invoice.user.profile_image.includes('http') ? invoice.user.profile_image : `${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3434"}${invoice.user.profile_image}`) : "/assets/images/dummyImage.png"}
                              alt={invoice.user?.first_name}
                              height={36}
                              width={36}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold">{invoice.user?.first_name} {invoice.user?.last_name}</p>
                            <p className="text-xs text-gray-500">{invoice.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="max-w-xs">
                          <p className="font-semibold truncate">{invoice.event?.event_name || "N/A"}</p>
                          {invoice.event?.event_date && (
                            <p className="text-xs text-gray-500">
                              <Icon icon="mdi:calendar-clock" className="inline-block w-3 h-3 mr-1" />
                              {format(new Date(invoice.event.event_date), "MMM dd, yyyy")}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-semibold">{invoice.no_of_attendees || 1}</td>
                      <td className="px-4 py-3 font-semibold text-[#a797cc]">{invoice.total_amount?.toFixed(2) || "0.00"} SAR</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          {getPaymentStatusBadge(invoice.payment_status)}
                          {getStatusBadge(invoice.book_status)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{invoice.createdAt ? format(new Date(invoice.createdAt), "MMM dd, yyyy\nHH:mm") : "N/A"}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex gap-2 justify-center items-center">
                          <button
                            onClick={() => handleViewDetails(invoice)}
                            className="text-[#a797cc] hover:text-[#8b85b1] transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
                            title="View Details"
                          >
                            <FaEye size={18} />
                          </button>
                          {invoice.invoice_url && (
                            <button
                              onClick={() => handleViewInvoice(invoice.invoice_url)}
                              className="text-green-600 hover:text-green-800 transition-colors duration-200 p-2 rounded-full hover:bg-green-50"
                              title="Download Invoice"
                            >
                              <FaDownload size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-gray-500 text-lg">
                      <Icon icon="mdi:file-document-remove-outline" className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                      No invoices found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {totalCount > itemsPerPage && (
          <div className="mt-8 flex justify-center">
            <Paginations
              handlePage={setPage}
              page={page}
              total={totalCount}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}

        {/* Invoice Detail Modal */}
        {showDetailModal && (
          <InvoiceDetailModal
            show={showDetailModal}
            onClose={() => setShowDetailModal(false)}
            invoice={selectedInvoice}
          />
        )}
      </div>
    </DefaultLayout>
  );
}

