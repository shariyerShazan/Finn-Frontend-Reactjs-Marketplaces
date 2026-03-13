import { createBrowserRouter } from "react-router-dom";
import ParentLayout from "../Layouts/ParentLayout";
import SignUp from "../AuthLayout/SignUp/SignUp";
import Login from "../AuthLayout/Login/Login";
import RegistrationDone from "../AuthLayout/RegistrationDone/RegistrationDone";
import UserDashboardLayout from "../Layouts/UserDashboardLayout";
// import UserProfile from "../UserDashboard/UserProfile/UserProfile";
// import UserChatbox from "../UserDashboard/UserChatbox/UserChatbox";
import ChangePassword from "../UserDashboard/ChangePassword/ChangePassword";
import SellerDetails from "../AuthLayout/SellerDetails/SellerDetails";
// import VerifyOtp from "@/AuthLayout/SignUp/_components/verifyOtp";
import VerifyRegisterOtp from "@/AuthLayout/SignUp/_components/verifyOtp";
import ForgotPassword from "@/AuthLayout/ForgotPassword/ForgotPassword";
import HomePage from "@/main/user/Pages/HomePage/HomePage";
import SearchPage from "@/main/user/Pages/SearchPage/SearchPage";
import ItemDetailsPage from "@/main/user/Pages/ItemDetailsPage/ItemDetailsPage";
import AdminDashboardLayout from "@/Layouts/AdminDashboardLayout";
import AdminOverview from "@/main/admin/pages/overview/AdminOverview";
import AllBuyers from "@/main/admin/pages/allUsers/AllBuyers";
import AllSellers from "@/main/admin/pages/allSellers/AllSellers";
// import ViewUser from "@/main/admin/_components/viewUser/ViewUser";
// import ViewBuyerD from "@/main/admin/pages/allUsers/_components/ViewBuyerD";
// import ViewSellerD from "@/main/admin/pages/allSellers/_components/ViewSellerD";
import AdminReport from "@/main/admin/pages/report/AdminReport";
// import ReportDetails from "@/main/admin/pages/report/_components/ReportDetails";
import AdminTransactions from "@/main/admin/pages/Transactions/AdminTransactions";
import Category from "@/main/admin/pages/Category/Category/Category";
import SubCategory from "@/main/admin/pages/Category/SubCategory/SubCategory";
import SellerDashboardLayout from "@/Layouts/SelllerDashboardLayout";
import SellerOverview from "@/main/seller/pages/dashboard/Overview";
import CreateAds from "@/main/seller/pages/ads/CreateAds/CreateAds";
import SellerChat from "@/main/seller/pages/chats/SellerChat";
import SellerAllAds from "@/main/seller/pages/ads/allAds/SellerAllAds";
// import SellerPayments from "@/main/seller/pages/payments/SellerPayments";
import CompleteSellerProfile from "@/main/seller/pages/create-profile/CompleteSellerProfile";
import SellerEditAds from "@/main/seller/pages/ads/editAds/EditAds";
import SellerPurchases from "@/main/user/Pages/my-purches/SellerPurchases";
import UserChat from "@/main/user/Pages/chats/UserChat";
import SellerRequests from "@/main/admin/pages/seller-request/SellerRequests";
import Subscription from "@/main/admin/pages/subscription/Subscription";
import SellerSubscriptionPage from "@/main/seller/pages/subscription/SellerSubscriptionPage";
import Profile from "@/main/user/Pages/profile/Profile";
import PrivateRoute from "./PrivateRoute";
import TermsAndConditions from "@/components/pg/Terms/TermsAndConditions";
import PrivacyPolicy from "@/components/pg/privacy/PrivacyPolicy";
import AboutUs from "@/components/pg/about/AboutUs";
import ContactUs from "@/components/pg/contact/ContactUs";
import ClassifiedAdPolicy from "@/components/pg/classifiedadpolicy/ClassifiedAdPolicy";
import FraudPrevention from "@/components/FraudPrevention";
import FAQs from "@/components/FAQs";
import { useEffect } from "react";
function ErrorBoundary() {
  useEffect(() => {
    window.location.reload();
  }, []);

  return null;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
     
       
        <ParentLayout />
     
    ),
    errorElement:<ErrorBoundary/>,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "create-seller-profile",
        element: <CompleteSellerProfile />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "register",
        element: <SignUp />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "verify-otp",
        element: <VerifyRegisterOtp />,
      },
      {
        path: "login",
        element: <Login />,
      },
      //   if the role is seller navigate to this below route
      {
        path: "registration-done",
        element: <RegistrationDone />,
      },
      {
        path: "seller-details",
        element: <SellerDetails />,
      },
      {
        path: "user-profile",
        element: <SignUp />,
      },

      {
        path: "item-details/:id",
        element: <ItemDetailsPage />,
      },
      {
        path: "terms",
        element: <TermsAndConditions />,
      },
      {
        path: "privacy",
        element: <PrivacyPolicy />,
      },
      {
        path: "classified",
        element: <ClassifiedAdPolicy />,
      },
      {
        path: "fraud-prevention",
        element: <FraudPrevention />,
      },
      {
        path: "faq",
        element: <FAQs />,
      },
      {
        path: "about",
        element: <AboutUs />,
      },
      {
        path: "contact",
        element: <ContactUs />,
      },

      // if the role is user then show user dashboard layout after login or signup ..............User Dashboard Routes
    ],
  },
  {
    path: "user/dashboard",
    element: (
      <PrivateRoute allowedRoles={["USER"]}>
        <UserDashboardLayout />
      </PrivateRoute>
    ),
    errorElement:<ErrorBoundary/>,
    children: [
      {
        index: true,
        element: <Profile />,
      },
      {
        path: "chat",
        element: <UserChat />,
      },
      {
        path: "change-password",
        element: <ChangePassword />,
      },
      {
        path: "my-purchases",
        element: <SellerPurchases />,
      },
    ],
  },
  {
    path: "admin/dashboard",
    element: (
      <PrivateRoute allowedRoles={["ADMIN"]}>
        <AdminDashboardLayout />
      </PrivateRoute>
    ),
    errorElement:<ErrorBoundary/>,
    children: [
      {
        index: true,
        element: <AdminOverview />,
      },
      {
        path: "users",
        element: <AllBuyers />,
      },
      {
        path: "sellers",
        element: <AllSellers />,
      },
      {
        path: "requested-seller",
        element: <SellerRequests />,
      },
      // {
      //   path: "users/:id",
      //   element: <ViewBuyerD />,
      // },
      // {
      //   path: "sellers/:id",
      //   element: <ViewSellerD />,
      // },
      {
        path: "reports",
        element: <AdminReport />,
      },
      // {
      //   path: "reports/:id",
      //   element: <ReportDetails />,
      // },
      {
        path: "Transactions",
        element: <AdminTransactions />,
      },
      {
        path: "category",
        element: <Category />,
      },
      {
        path: "sub-category",
        element: <SubCategory />,
      },
      {
        path: "subscription",
        element: <Subscription />,
      },
    ],
  },
  {
    path: "seller/dashboard",
    element: (
      <PrivateRoute allowedRoles={["SELLER"]}>
        <SellerDashboardLayout />
      </PrivateRoute>
      
    ),
    errorElement:<ErrorBoundary/>,
    children: [
      {
        index: true,
        element: <SellerOverview />,
      },
      {
        path: "ads/create",
        element: <CreateAds />,
      },
      {
        path: "ads/edit/:id",
        element: <SellerEditAds />,
      },
      {
        path: "chat",
        element: <SellerChat />,
      },
      {
        path: "all-ads",
        element: <SellerAllAds />,
      },
      // {
      //   path: "payments",
      //   element: <SellerPayments />,
      // },
      {
        path: "subscription",
        element: <SellerSubscriptionPage />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
]);
