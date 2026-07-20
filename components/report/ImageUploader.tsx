"use client";

import { useRef } from "react";
import { Upload, ImageIcon } from "lucide-react";

type Props = {
  image: File | null;
  preview: string | null;
  onImageSelect: (file: File) => void;
  error?: string;
};

export default function ImageUploader({
  image,
  preview,
  onImageSelect,
  error,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-3">
      <div
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 transition
        ${
          error
            ? "border-red-500 bg-red-50"
            : "border-emerald-500 bg-emerald-50 hover:bg-emerald-100"
        }`}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="rounded-xl max-h-72 mx-auto object-cover"
          />
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-emerald-600 mb-4" />
            <h2 className="text-xl font-bold">Upload Pollution Photo</h2>
            <p className="text-gray-500 mt-2">
              Click to upload or drag & drop
            </p>
            <ImageIcon className="mt-5 text-gray-400" />
          </div>
        )}

        <input
          hidden
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onImageSelect(file);
            }
          }}
        />
      </div>

      {error && (
        <p className="text-red-600 text-sm font-medium">
          {error}
        </p>
      )}
    </div>
  );
}