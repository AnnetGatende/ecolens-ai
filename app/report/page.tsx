"use client";

import { useState, useEffect } from "react";
import PollutionForm from "@/components/report/PollutionForm";
import { Button } from "@/components/ui/button";
import { Camera, MapPin } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { reverseGeocode } from "@/lib/geocoding"; 

export default function ReportPage() {
  const { language } = useLanguage();

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  // FIX 1: Completely removed hardcoded Likoni coordinates. Everything starts null.
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [displayLocation, setDisplayLocation] = useState<string>("");
  const [detecting, setDetecting] = useState(false);
  
  // FIX 2: Track if the user has actively pulled fresh GPS data
  const [gpsRefreshed, setGpsRefreshed] = useState(false);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  function detectLocation() {
    setDetecting(true);
    if ("geolocation" in navigator) {
      // FIX 3: Force the browser to ignore cached locations and use maximum accuracy hardware
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setGpsRefreshed(true); // Unlocks the form
          setDetecting(false);
        },
        (error) => {
          console.error(error);
          alert(language === "en" ? "Failed to detect location. Please ensure location permissions are granted." : "Imeshindwa kupata eneo. Tafadhali hakikisha ruhusa ya eneo imewashwa.");
          setDetecting(false);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 } 
      );
    } else {
      alert(language === "en" ? "Geolocation is not supported by your browser." : "Ufuatiliaji wa eneo hauungwa mkono na kivinjari chako.");
      setDetecting(false);
    }
  }

  useEffect(() => {
    async function fetchAddress() {
      if (latitude && longitude) {
        const data = await reverseGeocode(latitude, longitude);
        setDisplayLocation(data.displayLocation);
      }
    }
    fetchAddress();
  }, [latitude, longitude]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            {language === "en" ? "Report Environmental Pollution" : "Ripoti Uchafuzi wa Kimazingira"}
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            {language === "en"
              ? "Upload a pollution photo, describe the incident, and let Gemma AI analyze environmental risks, predict air quality impact and recommend action."
              : "Pakia picha ya uchafuzi, eleza tukio hilo, na uruhusu Gemma AI ichanganue hatari za kimazingira, itabiri athari za ubora wa hewa na kupendekeza hatua."}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          
          {/* Left Column: Image Upload & Form */}
          <div className="space-y-6">
            <div className="rounded-2xl border-2 border-dashed border-emerald-300 bg-white p-6 shadow-sm text-center relative overflow-hidden group hover:border-emerald-500 transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              {preview ? (
                <div className="relative h-64 w-full rounded-xl overflow-hidden">
                  <img src={preview} alt="Upload preview" className="object-cover w-full h-full" />
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center">
                  <div className="rounded-full bg-emerald-50 p-4 mb-4 text-emerald-600">
                    <Camera size={36} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {language === "en" ? "Upload Pollution Photo" : "Pakia Picha ya Uchafuzi"}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {language === "en" ? "Click to upload or drag & drop" : "Bora kubofya au kuburuta picha hapa"}
                  </p>
                </div>
              )}
            </div>

            {/* FIX 4: Block the form entirely until GPS is refreshed */}
            {gpsRefreshed ? (
              <PollutionForm image={image} latitude={latitude} longitude={longitude} />
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50 p-6 text-center shadow-sm">
                <p className="text-amber-800 font-bold text-lg mb-2">
                  {language === "en" ? "⚠️ Location Required" : "⚠️ Eneo Linahitajika"}
                </p>
                <p className="text-amber-700 text-sm">
                  {language === "en" 
                    ? "You must verify your live coordinates using the 'Refresh GPS' button before submitting a report." 
                    : "Lazima uthibitishe eneo lako ukitumia kitufe cha 'Sasisha GPS' kabla ya kutuma ripoti."}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: GPS and Why It Matters */}
          <div className="space-y-6">
            
            <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="text-red-500" />
                  <h3 className="font-bold text-lg text-slate-800">
                    {language === "en" ? "GPS Location" : "Eneo la GPS"}
                  </h3>
                </div>
                <Button variant={gpsRefreshed ? "outline" : "default"} size="sm" onClick={detectLocation} disabled={detecting} className={!gpsRefreshed ? "bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse" : ""}>
                  {detecting 
                    ? (language === "en" ? "Detecting..." : "Inatafuta...") 
                    : (language === "en" ? "Refresh GPS" : "Sasisha GPS")}
                </Button>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                {displayLocation ? (
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">
                      {language === "en" ? "Detected Area" : "Eneo Lililogunduliwa"}
                    </p>
                    <p className="text-lg font-bold text-emerald-900 leading-snug">
                      📍 {displayLocation}
                    </p>
                    <div className="flex gap-4 mt-3 text-xs text-slate-400 font-mono">
                      <span>Lat: {latitude?.toFixed(6)}</span>
                      <span>Lon: {longitude?.toFixed(6)}</span>
                    </div>
                  </div>
                ) : latitude && longitude ? (
                  <p className="text-slate-500 font-medium">
                    {language === "en" ? "Formatting location..." : "Inatafsiri eneo..."}
                  </p>
                ) : (
                  <p className="text-slate-500 font-medium">
                    {language === "en" ? "Click 'Refresh GPS' to detect your live location." : "Bofya 'Sasisha GPS' kupata eneo lako."}
                  </p>
                )}
              </div>
            </div>

            {/* Why Your Report Matters Card */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-lg text-slate-800">
                {language === "en" ? "Why Your Report Matters" : "Kwa Nini Ripoti Yako Ni Muhimu"}
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-3">
                  <span>🌍</span> {language === "en" ? "Builds a real-time pollution map." : "Inajenga ramani ya uchafuzi ya wakati halisi."}
                </li>
                <li className="flex items-center gap-3">
                  <span>🤖</span> {language === "en" ? "Gemma AI identifies pollution sources." : "Gemma AI inatambua vyanzo vya uchafuzi."}
                </li>
                <li className="flex items-center gap-3">
                  <span>📈</span> {language === "en" ? "Predicts air quality over the next 24 hours." : "Inatabiri ubora wa hewa kwa saa 24 zijazo."}
                </li>
                <li className="flex items-center gap-3">
                  <span>🚨</span> {language === "en" ? "Alerts environmental authorities." : "Inatahadharisha mamlaka za mazingira."}
                </li>
                <li className="flex items-center gap-3">
                  <span>❤️</span> {language === "en" ? "Helps keep communities healthier." : "Inasaidia kuweka jamii salama na yenye afya."}
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}