"use client";

import React from "react";
import EditableTextAbout from "./EditableTextAbout";
import EditableTextBanner from "./EditableTextBanner";

type Props = {
  name?: string;
  description?: string;
  isEditMode?: boolean;
  page?: string; // "about" or "news"
};

function Banner({
  name,
  description,
  isEditMode = false,
  page = "about",
}: Props) {
  const EditableComponent =
    page === "about" ? EditableTextAbout : EditableTextBanner;

  return (
    <div className="w-screen flex items-center justify-center flex-col pb-32 mb-12 pt-40 bg-[#BFA999] border-b-[15px] border-b-[#58483B]">
      {name &&
        (page === "about" ? (
          <EditableTextAbout
            initialValue={name}
            fieldName="bannerTitle"
            isEditMode={isEditMode}
            className="text-center w-fit"
            as="h1"
          />
        ) : (
          <EditableTextBanner
            initialValue={name}
            fieldName="title"
            isEditMode={isEditMode}
            page={page}
            className="text-center w-fit"
            as="h1"
          />
        ))}
      {description &&
        (page === "about" ? (
          <EditableTextAbout
            initialValue={description}
            fieldName="bannerDescription"
            isEditMode={isEditMode}
            className="opacity-75 font-p3 w-[65ch] mx-auto text-center mt-2"
            as="p"
            multiline
          />
        ) : (
          <EditableTextBanner
            initialValue={description}
            fieldName="description"
            isEditMode={isEditMode}
            page={page}
            className="opacity-75 font-p3 w-[65ch] mx-auto text-center mt-2"
            as="p"
            multiline
          />
        ))}
    </div>
  );
}

export default Banner;
