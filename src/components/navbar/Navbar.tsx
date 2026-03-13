/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { User, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useGetAllCategoriesQuery } from "@/redux/fetures/admin/admin-category.api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetMeQuery } from "@/redux/fetures/users.api";
import LanguageDropdown from "../translation/LanguageDropdown";







// import { useSelector } from "react-redux";

const Navbar = () => {
  const navigate = useNavigate();
  const { data: categoriesRes, isLoading } = useGetAllCategoriesQuery({
    page: 1,
    limit: 20,
  });

  const { data: userData } = useGetMeQuery();

  const allCategories = categoriesRes?.data || [];

  const visibleCategories = allCategories.slice(0, 5);
  const hiddenCategories = allCategories.slice(5);

  const handleNavClick = (slug: string) => {
    navigate(`/search?search=${encodeURIComponent(slug)}`);
  };
  // console.log(userData.data, "me");
  const dashboardNavigate = ()=> {
       if(userData?.data?.role === "USER"){
        navigate("/user/dashboard")
       } else if (userData?.data?.role === "SELLER"){
         navigate("/seller/dashboard")
       } else if (userData?.data?.role === "ADMIN"){
             navigate("/admin/dashboard");
       } else{
        navigate("/")
       }
  }

  return (
    <nav className="bg-[#0064AE] text-white px-6 py-3 sticky top-0 z-[100] shadow-md">
      <div className="w-[95%] lg:w-[90%] mx-auto flex items-center justify-between">
        {/* --- Logo --- */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-90">
          <div className="w-7 h-7 bg-white rounded flex items-center justify-center">
            <span className="text-[#0064AE] font-bold text-xs uppercase italic">
              F
            </span>
          </div>
          <h1 className="text-sm font-black text-white uppercase tracking-widest">
            Finn
          </h1>
        </Link>

        {/* --- Nav Links --- */}
        <div className="hidden md:flex items-center gap-6 text-[12px] font-bold  tracking-wider">
          <Link to="/" className="hover:text-slate-200 transition-colors">
            Home
          </Link>

          {isLoading ? (
            <Loader2 className="animate-spin w-4 h-4 text-white/50" />
          ) : (
            <>
              {visibleCategories.map((cat: any) => (
                <button
                  key={cat.id}
                  onClick={() => handleNavClick(cat.slug)}
                  className="hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {cat.name}
                </button>
              ))}

              {hiddenCategories.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 hover:text-slate-200 outline-none cursor-pointer">
                    More <ChevronDown size={14} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white text-slate-800 rounded-xl shadow-xl border-none mt-2 p-2 min-w-[180px]">
                    {hiddenCategories.map((cat: any) => (
                      <DropdownMenuItem
                        key={cat.id}
                        onClick={() => handleNavClick(cat.slug)}
                        className="cursor-pointer hover:bg-slate-100 rounded-lg py-2 font-semibold text-[12px] uppercase text-slate-600"
                      >
                        {cat.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              
            </>
          )}
        </div>

        {/* --- Actions --- */}
       {/* {
        userData?  <div className="flex items-center gap-4">
          <Button
            onClick={() => dashboardNavigate()}
            className="bg-black cursor-pointer  hover:bg-zinc-800 text-white border-none rounded-md px-5 py-2 flex gap-2 font-bold text-[10px] uppercase shadow-lg transition-transform active:scale-95"
          >
            <div className="p-2 hover:bg-white/10 rounded-full transition-all">
              <User className="w-5 h-5" />
            </div>
            Dashboard
          </Button>
        </div> :
        <div>
           <Button className=" cursor-pointer" onClick={()=> navigate("login")}>
            Login
           </Button>
        </div>
       } */}
       {/* --- Actions --- */}
<div className="flex items-center gap-3">
  {/* <LanguageDropdown/> */}
      {/* <LanguageDropdownNav/> */}
      <LanguageDropdown/>
  {userData ? (
    <Button onClick={() => dashboardNavigate()} className="bg-black hover:bg-zinc-800 ...">
      <User className="w-4 h-4" /> Dashboard
    </Button>
  ) : (
     <Button onClick={() => navigate("login")}>Login</Button>
  )}
</div>
      </div>
    </nav>
  );
};

export default Navbar;
