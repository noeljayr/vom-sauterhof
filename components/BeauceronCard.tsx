import { Beauceron } from "@/types/Beauceron";
import { IconArrowUpRight } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

type Props = {
  beauceron: Beauceron;
};

function BeauceronCard({ beauceron }: Props) {
  return (
    <Link
      href={`"/unsere-rassezucht/${beauceron.slug}`}
      className="flex relative flex-col overflow-hidden rounded-[1rem]"
    >
      <img
        src={`/beauceron/${beauceron.image}`}
        className="aspect-[3.7_/_4] relative z-0 object-cover"
      />

      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(70, 57, 47, 0.05) 0%, #332A23 91.62%)",
        }}
        className="absolute p-4 justify-end left-0 bottom-0 w-full h-full flex flex-col"
      >
        <div className="grid grid-cols-[1fr_auto] w-full truncate gap-2 mt-auto items-center">
          <span
            title={beauceron.name}
            className="font-bold text-white truncate"
          >
            {beauceron.name}
          </span>
          <span className="h-6 w-6 bg-white rounded-full flex items-center justify-center ml-auto">
            <IconArrowUpRight color="black" className="h-4 w-4" />
          </span>
        </div>
        <span
          style={{ fontSize: "calc(var(--p4) * 0.95)" }}
          className="text-white my-3.5 h-[6.5rem] line-clamp-5  opacity-75"
        >
          {beauceron.descrtiption}
        </span>

        <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center w-full">
          <div className="flex flex-col gap-1">
            <span
              style={{ fontSize: "calc(var(--p4) * 0.95)" }}
              className="font-medium opacity-50 text-white"
            >
              Geburtsdatum
            </span>
            <span className="text-white font-p4">{beauceron.dob}</span>
          </div>
          <span className="w-[1px] h-[50%] bg-[#675545] mx-4"></span>
          <div className="flex flex-col gap-1">
            <span
              style={{ fontSize: "calc(var(--p4) * 0.95)" }}
              className="font-medium opacity-50 text-white"
            >
              Höhe
            </span>
            <span className="text-white font-p4">
              {beauceron.height ? beauceron.height : "-"}
            </span>
          </div>
          <span className="w-[1px] h-[50%] bg-[#675545] mx-4"></span>
          <div className="flex flex-col gap-1">
            <span
              style={{ fontSize: "calc(var(--p4) * 0.95)" }}
              className="font-medium opacity-50 text-white"
            >
              Gewicht
            </span>
            <span className="text-white font-p4">
              {beauceron.weight ? beauceron.weight : "-"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default BeauceronCard;
