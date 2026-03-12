/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect} from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

const ItemDetailsImage = ({ images: adImages } : any) => {
  const images =
    adImages?.length > 0
      ? adImages.map((img : any) => img.url)
      : ["/placeholder.jpg"];

  const [mainImg, setMainImg] = useState(images[0]);
  const [zoomStyle, setZoomStyle] = useState({
    display: "none",
    transformOrigin: "center",
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMainImg(images[0]);
  }, [adImages]);

  // --- 🎯 Pixel-Perfect Zoom Logic ---
  const handleMouseMove = (e: any) => {
    const container = e.currentTarget;
    const { left, top, width, height } = container.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      display: "block",
      transformOrigin: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none", transformOrigin: "center" });
  };

  // --- Carousel Navigation ---
  const navigate = (direction: any) => {
    const currentIndex = images.indexOf(mainImg);
    if (direction === "prev") {
      setMainImg(images[(currentIndex - 1 + images.length) % images.length]);
    } else {
      setMainImg(images[(currentIndex + 1) % images.length]);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4 h-[550px]">
      {/* 🚀 Featured Image with Smooth Zoom */}
      <div className="col-span-3 relative rounded-[2.5rem] overflow-hidden bg-white border border-slate-100 group shadow-sm">
        <div
          className="relative w-full h-full overflow-hidden cursor-zoom-in"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={mainImg}
            alt="Product Main"
            className="w-full h-full object-cover transition-transform duration-200 ease-out"
            style={{
              transform:
                zoomStyle.display === "block" ? "scale(2.2)" : "scale(1)",
              transformOrigin: zoomStyle.transformOrigin,
            }}
          />
        </div>

        {/* Navigation Arrows */}
        <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <button
            onClick={() => navigate("prev")}
            className="pointer-events-auto bg-white/95 hover:bg-[#0064AE] hover:text-white p-3 rounded-full shadow-xl transition-all active:scale-90"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => navigate("next")}
            className="pointer-events-auto bg-white/95 hover:bg-[#0064AE] hover:text-white p-3 rounded-full shadow-xl transition-all active:scale-90"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Zoom Indicator */}
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm p-2 rounded-xl border border-slate-200">
          <Maximize2 size={18} className="text-[#0064AE]" />
        </div>
      </div>

      {/* 📸 Professional Thumbnails Scroll */}
      <div className="col-span-1 flex flex-col gap-3 overflow-y-auto pr-2 no-scrollbar scroll-smooth">
        {images.map((img : string, i : number) => (
          <div
            key={i}
            onClick={() => setMainImg(img)}
            className={`relative min-h-[125px] flex-shrink-0 rounded-3xl overflow-hidden bg-slate-50 border-2 transition-all duration-300 cursor-pointer ${
              mainImg === img
                ? "border-[#0064AE] shadow-md scale-[0.96]"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <img
              src={img}
              alt={`Thumb ${i}`}
              className="w-full h-full object-cover"
            />
            {mainImg === img && (
              <div className="absolute inset-0 bg-[#0064AE]/5 border-2 border-[#0064AE]/20 rounded-3xl" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemDetailsImage;
