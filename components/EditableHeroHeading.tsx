"use client";

import { IconEdit, IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";

type Props = {
  initialTitle: string;
  isEditMode: boolean;
};

export default function EditableHeroHeading({
  initialTitle,
  isEditMode,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [tempTitle, setTempTitle] = useState(initialTitle);
  const [isHovered, setIsHovered] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/homepage/update-hero-title", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ heroTitle: tempTitle }),
      });

      if (response.ok) {
        setTitle(tempTitle);
        setIsEditing(false);
      } else {
        alert("Failed to save changes");
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempTitle(title);
    setIsEditing(false);
  };

  if (!isEditMode) {
    return (
      <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-black mb-4 md:mb-6 leading-tight">
        {title.split("\n").map((line, i) => (
          <span key={i}>
            {line}
            {i === 0 && <br />}
          </span>
        ))}
      </h1>
    );
  }

  return (
    <div
      className="relative group w-[45ch]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isEditing ? (
        <div className="space-y-1">
          <textarea
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            className="w-fit font-h2 md:text-4xl lg:text-5xl xl:text-6xl font-bold text-black leading-tight border-1 border-[#58483B] rounded-lg p-4 focus:outline-none focus:ring-1 focus:ring-[#58483B]"
            rows={3}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              style={{
                fontSize: "calc(var(--p4) * 0.9)",
              }}
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-[#58483B] text-white px-2 py-1 rounded-[0.35rem] cursor-pointer hover:opacity-95 transition-opacity disabled:opacity-50"
            >
              <IconCheck className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              style={{
                fontSize: "calc(var(--p4) * 0.9)",
              }}
              onClick={handleCancel}
              disabled={isSaving}
              className="flex items-center gap-2 bg-gray-300 text-black px-2 py-1 rounded-[0.35rem] cursor-pointer hover:bg-gray-400 transition-colors disabled:opacity-50"
            >
              <IconX className="h-4 w-4" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="w-full text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-black mb-4 md:mb-6 leading-tight">
            {title.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i === 0 && <br />}
              </span>
            ))}
          </h1>
          {isHovered && (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute -top-2 -right-2 bg-[#58483B] text-white p-2 rounded-full hover:bg-[#6d5a4a] cursor-pointer transition-colors shadow-lg"
              aria-label="Edit heading"
            >
              <IconEdit size={20} />
            </button>
          )}
        </>
      )}
    </div>
  );
}
