"use client";

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import HostNavbar from "@/components/Header/HostNavbar";
import { store } from "@/redux/store";
import { Provider } from "react-redux";

const HomePageLayout = (props) => {
  return (
    <div style={{ overflowX: 'hidden' }}>
      <Provider store={store}>
        <Header />
        <HostNavbar />
        <div>{props.children}</div>
        <Footer />
      </Provider>
    </div>
  );
};

export default HomePageLayout;
