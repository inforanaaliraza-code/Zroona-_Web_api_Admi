"use client";

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import HeroSection from "@/components/HeroSection/HeroSection";
import Categories from "@/components/HomeContent/Categories";
// import EventsNear from "@/components/HomeContent/EventsNear";
import UpcomingEvents from "@/components/HomeContent/UpcomingEvents";
import Works from "@/components/HomeContent/Works";
import React from "react";

export default function Home() {
  return (
    <>
      {/* <Header /> */}
      <HeroSection />
      <Works />
      <Categories />
      {/* <EventsNear /> */}
      <UpcomingEvents />
      <Footer />
    </>
  );
}
