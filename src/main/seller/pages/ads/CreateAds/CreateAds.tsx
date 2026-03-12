/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";
import {
  Loader2,
  Upload,
  X,
  MapPin,
  ShieldCheck,
  Crosshair,
} from "lucide-react";

// --- Leaflet Imports ---
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  useGetAllCategoriesQuery,
  useGetSingleCategoryQuery,
} from "@/redux/fetures/admin/admin-category.api";
import { useCreateAdMutation } from "@/redux/fetures/ads.api";

// Marker Icon Fix
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface AdFormData {
  title: string;
  description: string;
  type: string;
  price: string;
  propertyFor: string;
  state: string;
  city: string;
  zipCode: string;
  country: string;
  categoryId: string;
  subCategoryId: string;
  showAddress: boolean;
  allowPhone: boolean;
  allowEmail: boolean;
  latitude: number;
  longitude: number;
  [key: `spec_${string}`]: any;
}

const CreateAds = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<string>("");
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    23.8103, 90.4125,
  ]);

  const { data: categoriesResponse } = useGetAllCategoriesQuery({
    page: 1,
    limit: 1000,
  });
  const categories = categoriesResponse?.data || [];

  const { data: categoryDetails } = useGetSingleCategoryQuery(selectedCatId, {
    skip: !selectedCatId,
  });
  const [createAd, { isLoading: isPosting }] = useCreateAdMutation();

  const subCategories = categoryDetails?.subCategories || [];

  const { register, handleSubmit, setValue, watch, control } =
    useForm<AdFormData>({
      defaultValues: {
        type: "FIXED",
        propertyFor: "SALE",
        showAddress: true,
        allowPhone: true,
        allowEmail: true,
        country: "Bangladesh",
        latitude: 23.8103,
        longitude: 90.4125,
      },
    });

  const [selectedSubCat, setSelectedSubCat] = useState<any>(null);
  const currentLat = watch("latitude");
  const currentLng = watch("longitude");

  // --- Reverse Geocoding Function ---
  const fetchAddressDetails = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      );
      const data = await response.json();
      if (data && data.address) {
        const addr = data.address;
        setValue("country", addr.country || "");
        setValue("state", addr.state || addr.province || addr.division || "");
        setValue(
          "city",
          addr.city || addr.town || addr.village || addr.suburb || "",
        );
        setValue("zipCode", addr.postcode || "");
        toast.info("Location details updated from map");
      }
    } catch (error) {
      console.error("Geocoding Error:", error);
    }
  };

  // --- Map Click Logic ---
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setValue("latitude", lat);
        setValue("longitude", lng);
        fetchAddressDetails(lat, lng);
      },
    });
    return null;
  }

  const getDeviceLocation = () => {
    if (!navigator.geolocation)
      return toast.error("Geolocation is not supported");
    toast.info("Fetching location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setValue("latitude", latitude);
        setValue("longitude", longitude);
        setMapCenter([latitude, longitude]);
        fetchAddressDetails(latitude, longitude);
        toast.success("Location updated!");
      },
      (error) => toast.error("Error: " + error.message),
    );
  };

  const handleCategoryChange = (id: string) => {
    setSelectedCatId(id);
    setValue("categoryId", id);
    setValue("subCategoryId", "");
    setSelectedSubCat(null);
  };

  const handleSubCategoryChange = (id: string) => {
    const sub = subCategories.find((s: any) => s.id === id);
    setSelectedSubCat(sub || null);
    setValue("subCategoryId", id);
  };

 const onSubmit = async (data: AdFormData) => {
   const formData = new FormData();

   const standardFields = [
     "title",
     "description",
     "type",
     "price",
     "propertyFor",
     "state",
     "city",
     "zipCode",
     "country",
     "categoryId",
     "subCategoryId",
     "latitude",
     "longitude",
   ];

   standardFields.forEach((field) => {
     const value = data[field as keyof AdFormData];
     if (value !== undefined && value !== null) {
       formData.append(field, String(value));
     }
   });
console.log(data.showAddress);
console.log(data.allowPhone);
console.log(data.allowEmail);
   formData.append("showAddress", data.showAddress ? "true" : "false");
   formData.append("allowPhone", data.allowPhone ? "true" : "false");
   formData.append("allowEmail", data.allowEmail ? "true" : "false");

   // Specifications
   const specs: Record<string, any> = {};
   selectedSubCat?.specFields?.forEach((f: any) => {
     const val = data[`spec_${f.key}`];
     if (val !== undefined && val !== "") {
       specs[f.key] = f.type === "number" ? Number(val) : val;
     }
   });
   formData.append("specifications", JSON.stringify(specs));

   // Images
   images.forEach((file) => formData.append("images", file));

   try {
     await createAd(formData).unwrap();
     toast.success("Ad posted successfully!");
     navigate("/seller/dashboard/all-ads");
   } catch (err: any) {
     toast.error(err?.data?.message || "Failed to post ad");
   }
 };

  return (
    <div className="p-4 mx-auto space-y-8 ">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>
                    Ad Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...register("title", { required: true })}
                    placeholder="Modern Villa"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select onValueChange={handleCategoryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c: any) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Sub Category *</Label>
                    <Select
                      onValueChange={handleSubCategoryChange}
                      disabled={!subCategories.length}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {subCategories.map((s: any) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ad Type</Label>
                    <Input value="FIXED" disabled className="bg-slate-100" />
                  </div>
                  <div className="space-y-2">
                    <Label>Property For</Label>
                    <Select
                      onValueChange={(v) => setValue("propertyFor", v)}
                      defaultValue="SALE"
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SALE">For Sale</SelectItem>
                        <SelectItem value="RENT">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Price ($) *</Label>
                  <Input
                    type="number"
                    {...register("price", { required: true })}
                    placeholder="50000"
                  />
                </div>
              </CardContent>
            </Card>

            {selectedSubCat?.specFields?.length > 0 && (
              <Card className="bg-slate-50 border-dashed">
                <CardHeader>
                  <CardTitle className="text-lg">Specifications</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  {selectedSubCat.specFields.map((field: any) => (
                    <div key={field.key} className="space-y-2">
                      <Label>
                        {field.label}{" "}
                        {field.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </Label>
                      {field.type === "select" ? (
                        <Select
                          onValueChange={(v) =>
                            setValue(`spec_${field.key}`, v)
                          }
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Choose" />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((o: string) => (
                              <SelectItem key={o} value={o}>
                                {o}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          className="bg-white"
                          type={field.type === "number" ? "number" : "text"}
                          {...register(`spec_${field.key}`, {
                            required: field.required,
                          })}
                        />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  {...register("description")}
                  rows={6}
                  placeholder="Describe your ad..."
                />
              </CardContent>
            </Card>
          </div>

          <div className="w-full lg:w-[400px] space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-[#0064AE]" />
                  <CardTitle className="text-lg">Location</CardTitle>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={getDeviceLocation}
                  className="text-xs h-8"
                >
                  <Crosshair size={14} className="mr-1" /> My Location
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-[200px] w-full rounded-md overflow-hidden border">
                  <MapContainer
                    center={mapCenter}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker
                      position={[currentLat, currentLng]}
                      icon={customIcon}
                      draggable={true}
                      eventHandlers={{
                        dragend: (e) => {
                          const pos = e.target.getLatLng();
                          setValue("latitude", pos.lat);
                          setValue("longitude", pos.lng);
                          fetchAddressDetails(pos.lat, pos.lng);
                        },
                      }}
                    />
                    <MapClickHandler />
                  </MapContainer>
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input {...register("country")} />
                </div>
                <div className="space-y-2">
                  <Label>State *</Label>
                  <Input {...register("state", { required: true })} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>City *</Label>
                    <Input {...register("city", { required: true })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Zip Code</Label>
                    <Input {...register("zipCode")} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <ShieldCheck size={18} className="text-green-600" />
                <CardTitle className="text-lg">Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Show Address</Label>
                  <Controller
                    name="showAddress"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Allow Phone</Label>
                  <Controller
                    name="allowPhone"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Allow Email</Label>
                  <Controller
                    name="allowEmail"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Media</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="relative aspect-square border rounded-lg overflow-hidden group"
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        className="w-full h-full object-cover"
                        alt="Preview"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setImages((p) => p.filter((_, idx) => idx !== i))
                        }
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square border-2 border-dashed flex flex-col items-center justify-center rounded-lg cursor-pointer hover:bg-slate-50">
                    <Upload size={20} className="text-slate-400" />
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) =>
                        e.target.files &&
                        setImages((p) => [...p, ...Array.from(e.target.files!)])
                      }
                    />
                  </label>
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={isPosting}
              className="w-full bg-[#0064AE] h-12 text-lg"
            >
              {isPosting ? <Loader2 className="animate-spin" /> : "Publish Ad"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateAds;
