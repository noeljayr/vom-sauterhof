"use client";

import Banner from "@/components/Banner";
import familyImg from "@/public/family.png";
import famImg from "@/public/farm.png";
import Hunderudel from "@/public/Hunderudel.png";
import IMG_7126 from "@/public/IMG_7126_edited_edited_edited.png";
import Image from "next/image";
import { AboutContent } from "@/types/about";
import { useSearchParams } from "next/navigation";
import EditableTextAbout from "@/components/EditableTextAbout";

type Props = {
  content: AboutContent;
};

export default function AboutUsClient({ content }: Props) {
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("mode") === "edit";

  return (
    <div className="flex flex-col gap-16">
      <Banner
        name={content.bannerTitle}
        description={content.bannerDescription}
        isEditMode={isEditMode}
      />

      <div className="w-[60%] flex flex-col gap-16 mx-auto">
        <div className="flex flex-col items-center gap-2">
          <EditableTextAbout
            initialValue={content.welcomeHeading || ""}
            fieldName="welcomeHeading"
            isEditMode={isEditMode}
            className=""
            as="h3"
          />
          <EditableTextAbout
            initialValue={content.welcomeText || ""}
            fieldName="welcomeText"
            isEditMode={isEditMode}
            className="w-full text-center font-p3 opacity-75"
            as="p"
            multiline
          />
        </div>

        <div className="grid grid-cols-[1fr_40%] items-center gap-10 w-full border border-[var(--c-border)] p-8 rounded-[1rem]">
          <div className="flex flex-col">
            <EditableTextAbout
              initialValue={content.homeHeading || ""}
              fieldName="homeHeading"
              isEditMode={isEditMode}
              className=""
              as="h4"
            />
            <EditableTextAbout
              initialValue={content.homeText || ""}
              fieldName="homeText"
              isEditMode={isEditMode}
              className="w-full font-p3 opacity-75"
              as="p"
              multiline
            />
          </div>

          <Image
            src={familyImg}
            alt="family"
            className="h-[15rem] w-full object-cover rounded-[0.85rem]"
          />
        </div>

        <div className="grid grid-cols-[50%_1fr] items-center gap-10 w-full ">
          <Image
            src={famImg}
            alt="fam"
            className="h-[15rem] w-full object-cover rounded-[0.85rem]"
          />

          <div className="flex flex-col">
            <EditableTextAbout
              initialValue={content.breedingHeading || ""}
              fieldName="breedingHeading"
              isEditMode={isEditMode}
              className=""
              as="h4"
            />
            <EditableTextAbout
              initialValue={content.breedingText || ""}
              fieldName="breedingText"
              isEditMode={isEditMode}
              className="w-full font-p3 opacity-75"
              as="p"
              multiline
            />
          </div>
        </div>

        <div className="grid grid-cols-[1fr_50%] items-center gap-10 w-full ">
          <div className="flex flex-col">
            <EditableTextAbout
              initialValue={content.packHeading || ""}
              fieldName="packHeading"
              isEditMode={isEditMode}
              className=""
              as="h4"
            />
            <EditableTextAbout
              initialValue={content.packText || ""}
              fieldName="packText"
              isEditMode={isEditMode}
              className="w-full font-p3 opacity-75"
              as="p"
              multiline
            />
          </div>

          <Image
            src={Hunderudel}
            alt="Hunderudel"
            className="h-[15rem] w-full object-cover rounded-[0.85rem]"
          />
        </div>

        <div className="grid grid-cols-[50%_1fr] items-center gap-10 w-full ">
          <Image
            src={IMG_7126}
            alt="IMG_7126"
            className="h-[15rem] w-full object-cover rounded-[0.85rem]"
          />

          <div className="flex flex-col">
            <EditableTextAbout
              initialValue={content.finalText || ""}
              fieldName="finalText"
              isEditMode={isEditMode}
              className="w-full font-p3 opacity-75"
              as="p"
              multiline
            />
          </div>
        </div>
      </div>
    </div>
  );
}
