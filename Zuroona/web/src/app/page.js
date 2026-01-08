"use client";

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import HeroSection from "@/components/HeroSection/HeroSection";
import Categories from "@/components/HomeContent/Categories";
// import EventsNear from "@/components/HomeContent/EventsNear";
import UpcomingEvents from "@/components/HomeContent/UpcomingEvents";
import Works from "@/components/HomeContent/Works";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import Loader from "@/components/Loader/Loader";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only redirect after component is mounted (client-side)
    if (!isMounted) return;

    // Check if user is authenticated
    if (isAuthenticated && user) {
      // Redirect based on user role
      if (user.role === 2) {
        // Host/Organizer - redirect to events management
        router.replace("/joinUsEvent");
      } else if (user.role === 1) {
        // Guest - redirect to events page
        router.replace("/events");
      }
    }
  }, [isAuthenticated, user, isMounted, router]);

  // Show loader while checking authentication
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  // If authenticated, don't render home page (will redirect)
  if (isAuthenticated && user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  // Only show home page if user is NOT authenticated
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
