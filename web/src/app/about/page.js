"use client";

import CommunitySection from "@/components/AboutContent/Community";
import WhatYouCanDo from "@/components/AboutContent/WhatYouCanDo";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import { getProfile } from "@/redux/slices/profileInfo";
import { TOKEN_NAME } from "@/until";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

export default function AboutUsPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
 
  const token = Cookies.get(TOKEN_NAME);
  const { profile } = useSelector((state) => state.profileData);

  const breadcrumbItems = [
    ...(profile?.user?.role === 1
      ? [{ label: t("breadcrumb.tab1"), href: "/" }] 
      : [{ label: t("breadcrumb.tab1"), href: "/joinUsEvent" }]),
    { label: t("breadcrumb.tab8"), href: "/about" },
  ];

  useEffect(() => {
    if (token) {
      dispatch(getProfile());
    }
  }, [token, dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
		<Header /> 
		<div className="flex flex-col flex-1 gap-y-6 items-center px-4 py-8 mx-auto w-full max-w-7xl">
			<h1 className="text-4xl font-bold">{t("about.heading")}</h1>
			<pre className="w-full text-base font-normal text-center text-black whitespace-pre-wrap break-words font-ibm-arabic">
			{t("about.content")}
			</pre>
		</div>
		<Footer />
    </div>
  );
}
