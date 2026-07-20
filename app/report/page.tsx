"use client";

import { useEffect, useState } from "react";

import ImageUploader from "@/components/report/ImageUploader";
import LocationCard from "@/components/report/LocationCard";
import PollutionForm from "@/components/report/PollutionForm";

export default function ReportPage() {
  // Image State
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // GPS State
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // GPS Error
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      () => {
        setLocationError(
          "Location permission denied. Please enable location services."
        );
      }
    );
  }, []);

  function handleImage(file: File) {
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">

      {/* Hero */}

      <section className="text-center py-14 px-6">

        <h1 className="text-5xl font-extrabold">
          Report Environmental Pollution
        </h1>

        <p className="text-gray-600 mt-5 max-w-3xl mx-auto">
          Upload a pollution photo, describe the incident,
          and let Gemma AI analyze environmental risks,
          predict air quality impact and recommend action.
        </p>

      </section>

      {/* Main */}

      <section className="max-w-7xl mx-auto px-6 pb-20">

        <div className="grid lg:grid-cols-2 gap-8">

          {/* LEFT */}

          <div className="space-y-6">

            <ImageUploader
              image={image}
              preview={preview}
              onImageSelect={handleImage}
              error=""
            />

            <PollutionForm
              image={image}
              latitude={latitude}
              longitude={longitude}
            />

          </div>

          {/* RIGHT */}

          <div className="space-y-6">

            <LocationCard
              latitude={latitude}
              longitude={longitude}
              error={locationError}
            />

            <div className="rounded-2xl bg-white border shadow-lg p-8">

              <h2 className="text-2xl font-bold">
                Why Your Report Matters
              </h2>

              <ul className="mt-6 space-y-4">

                <li>🌍 Builds a real-time pollution map.</li>

                <li>🤖 Gemma AI identifies pollution sources.</li>

                <li>📈 Predicts air quality over the next 24 hours.</li>

                <li>🚨 Alerts environmental authorities.</li>

                <li>❤️ Helps keep communities healthier.</li>

              </ul>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}