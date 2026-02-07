"use client";
// Updated: White background
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import BalanceCard from "@/components/Earning/BalanceCard";
import WithdrawalHistory from "@/components/Earning/WithdrawalHistory";
import Loader from "@/components/Loader/Loader";
import WithdrawModal from "@/components/Modal/WithdrawModal";
import Paginations from "@/components/Paginations/Pagination";
import { getEarning } from "@/redux/slices/Earning";
import { getWithdrawalList } from "@/redux/slices/WithdrawalList";

export default function Withdrawals() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const breadcrumbItems = [
    { label: t("breadcrumb.tab1"), href: "/joinUsEvent" },
    { label: t("breadcrumb.tab17"), href: "/withdrawal" },
  ];

  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const handlePage = (value) => {
    setPage(value);
  };

  const { Earning, loading } = useSelector((state) => state.EarningData);
  const { WithdrawalList, loadingWithdrawal } = useSelector(
    (state) => state.WithdrawalListData
  );

  useEffect(() => {
    dispatch(getEarning({ page: page }));
  }, [page, dispatch]);

  useEffect(() => {
    dispatch(getWithdrawalList({ page: page, limit: itemsPerPage }));
  }, [page, itemsPerPage, dispatch]);

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <section className="bg-white py-16 ">
        <div className="mx-auto px-4 md:px-8 lg:px-28">
          <div className="grid grid-cols-3 gap-6">
            {/* Summary and Income Breakdown */}
            <div className="col-span-full lg:col-span-1">
              <div className="space-y-4">
                <BalanceCard data={Earning} />
              </div>
            </div>
            <div className="col-span-full lg:col-span-2">
              <h3 className="text-2xl font-bold mb-4">{t("earning.tab4")}</h3>
              {loadingWithdrawal ? (
                <div className="flex justify-center items-center w-full">
                  <Loader />
                </div>
              ) : (
                <WithdrawalHistory data={WithdrawalList} />
              )}

              {WithdrawalList?.total_count > 6 && (
                <Paginations
                  handlePage={handlePage}
                  page={page}
                  total={WithdrawalList.total_count}
                  itemsPerPage={itemsPerPage}
                />
              )}

              <div className="mt-8 flex justify-end items-center">
                <button
                  onClick={() => setIsWithdrawModalOpen(true)}
                  className="bg-[#a797cc] py-3 px-10 rounded-lg text-base text-white"
                >
                  {t("earning.tab1") || "Withdraw"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Withdraw Modal */}
      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        data={Earning}
        page={page}
        limit={itemsPerPage}
      />
    </>
  );
}
