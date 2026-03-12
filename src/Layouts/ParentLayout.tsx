import Navbar from "@/components/navbar/Navbar";
import { Outlet } from "react-router-dom";
import { useSocketInitialize } from "@/hooks/useSocketInitialize";
import Footer from "@/components/footer/Footer";
import ScrollToTop from "@/components/ScrollToTop";


function ParentLayout() {
  // Initialize socket connection
  useSocketInitialize();
  return (
    <div className="">
      <ScrollToTop />
      <div className="fixed w-full top-0 z-50">
        <Navbar />
      </div>
      <div className="mt-18 w-[90%] mx-auto">
      
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default ParentLayout;
