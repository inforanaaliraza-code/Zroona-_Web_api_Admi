"use client";

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import GuestNavbar from "@/components/Header/GuestNavbar";
import { useState } from "react";

const HomePageLayout = (props) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  return (
    <div>
      <Header bgColor="#fff" />
      <GuestNavbar search={search} setSearch={setSearch} setPage={setPage} />
      <div>{props.children}</div>
      <Footer />
    </div>
  );
};

export default HomePageLayout;
