"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  image: File | null;
  latitude: number |null;
  longitude: number | null;
};

export default function PollutionForm({
  image,
  latitude,
  longitude,
}: Props) {
  const router = useRouter();

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [severity, setSeverity] = useState("");

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    image: "",
    description: "",
    location: "",
  });

  function validate() {
    const newErrors = {
      image: "",
      description: "",
      location: "",
    };

    let valid = true;

    if (!image) {
      newErrors.image = "Please upload a pollution photo.";
      valid = false;
    }

    if (description.trim().length < 10) {
      newErrors.description =
        "Please provide a meaningful description (minimum 10 characters).";
      valid = false;
    }

    if (latitude === null || longitude === null) {
      newErrors.location =
        "Unable to detect your current location.";
      valid = false;
    }

    setErrors(newErrors);

    return valid;
  }

  async function analyze() {
    if (!validate()) return;

    if (!image) return;

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("image", image);

      formData.append("description", description);

      formData.append("latitude", latitude!.toString());

      formData.append("longitude", longitude!.toString());

      formData.append("category", category);

      formData.append("severity", severity);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      console.log("Analyze Response:", data);

      if (!data.success) {
        alert(data.error || "Gemma failed to analyze the report.");
        return;
      }

      router.push(`/analysis/${data.reportId}`);

    } catch (error) {
      console.error(error);

      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border bg-white shadow-lg p-6 space-y-6">

      <div>
        <h2 className="text-2xl font-bold">
          Pollution Details
        </h2>

        <p className="text-gray-500 mt-1">
          Help Gemma understand the environmental incident.
        </p>
      </div>

      {errors.image && (
        <p className="text-red-600 font-medium">
          📷 {errors.image}
        </p>
      )}

      {errors.location && (
        <p className="text-red-600 font-medium">
          📍 {errors.location}
        </p>
      )}

      <div>

        <label className="font-semibold">
          Description
        </label>

        <Textarea
          rows={6}
          placeholder="Describe the pollution incident..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-between mt-2">

          {errors.description ? (
            <span className="text-red-600 text-sm">
              {errors.description}
            </span>
          ) : (
            <span />
          )}

          <span className="text-sm text-gray-500">
            {description.length}/500
          </span>

        </div>

      </div>

      <div>

        <label className="font-semibold">
          Pollution Category
        </label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border p-3 mt-2"
        >
          <option value="">
            Let Gemma Detect Automatically
          </option>

          <option>Smoke</option>

          <option>Dust</option>

          <option>Garbage Burning</option>

          <option>Industrial Emissions</option>

          <option>Water Pollution</option>

          <option>Chemical Spill</option>

        </select>

      </div>

      <div>

        <label className="font-semibold">
          Estimated Severity (Optional)
        </label>

        <div className="flex gap-3 mt-3">

          {["Low", "Medium", "High"].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setSeverity(level)}
              className={`px-5 py-2 rounded-full border transition ${
                severity === level
                  ? "bg-emerald-600 text-white"
                  : "hover:bg-emerald-50"
              }`}
            >
              {level}
            </button>
          ))}

        </div>

      </div>

      <Button
        onClick={analyze}
        disabled={loading}
        className="w-full h-14 text-lg"
      >
        {loading
          ? "Analyzing with Gemma..."
          : "✨ Analyze with Gemma"}
      </Button>

    </div>
  );
}