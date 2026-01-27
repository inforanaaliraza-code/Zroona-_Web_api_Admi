import Footer from "@/components/Footer/Footer";
import HeroSection from "@/components/HeroSection/HeroSection";
import Categories from "@/components/HomeContent/Categories";
// import EventsNear from "@/components/HomeContent/EventsNear";
import UpcomingEvents from "@/components/HomeContent/UpcomingEvents";
import Works from "@/components/HomeContent/Works";
import AuthRedirect from "@/components/auth/AuthRedirect";

export default function Home() {
  return (
    <>
      <AuthRedirect />
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
