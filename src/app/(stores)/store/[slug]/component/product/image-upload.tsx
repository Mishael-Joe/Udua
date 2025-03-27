"use client";

import type { ChangeEvent } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

type ImageUploadProps = {
  name: string;
  label: string;
  description?: string;
  value: File[];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  previews: string[];
  maxFiles?: number;
  accept?: string;
  required?: boolean;
};

const ImageUpload = ({
  name,
  label,
  description,
  value,
  onChange,
  previews,
  maxFiles = 3,
  accept = "image/*",
  required = false,
}: ImageUploadProps) => {
  return (
    <div className="grid gap-2 pb-6">
      <Label htmlFor={name} className="text-base-semibold text-light-2">
        {label}
      </Label>

      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      <button
        type="button"
        className="flex aspect-square relative w-full items-center justify-center rounded-md"
        aria-label={`Upload ${label}`}
      >
        <Upload className="h-10 z-10 w-10 text-muted-foreground" />
        <span className="sr-only">Upload</span>
        <Input
          id={name}
          name={name}
          onChange={onChange}
          className="block absolute h-full w-full border-dashed px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
          type="file"
          multiple={maxFiles > 1}
          accept={accept}
          placeholder={label}
          aria-label={label}
          aria-required={required}
        />
      </button>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-2 pt-2">
          {previews.map((src, index) => (
            <div key={index} className="relative">
              <Image
                className="aspect-square rounded-md object-cover"
                height="200"
                src={src || "/placeholder.svg"}
                alt={`${label} preview ${index + 1}`}
                width="200"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}

      {value.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {value.length} file{value.length !== 1 ? "s" : ""} selected
          {maxFiles > 1 && ` (max ${maxFiles})`}
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
