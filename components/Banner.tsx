"use client";

import React from "react";
import EditableTextAbout from "./EditableTextAbout";

type Props = {
  name?: string;
  description?: string;
  isEditMode?: boolean;
};

function Banner({ name, description, isEditMode = false }: Props) {
  return (
    <div className="w-screen flex items-center justify-center flex-col pb-32 mb-12 pt-40 bg-[#BFA999] border-b-[15px] border-b-[#58483B]">
      {name && (
        <EditableTextAbout
          initialValue={name}
          fieldName="bannerTitle"
          isEditMode={isEditMode}
          className=""
          as="h1"
        />
      )}
      {description && (
        <EditableTextAbout
          initialValue={description}
          fieldName="bannerDescription"
          isEditMode={isEditMode}
          className="opacity-75 font-p3 w-[65ch] text-center mt-2"
          as="p"
          multiline
        />
      )}
    </div>
  );
}

export default Banner;
