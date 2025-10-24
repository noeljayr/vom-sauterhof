"use client";

import Banner from "@/components/Banner";
import { IconArrowLeft, IconFileTypePdf } from "@tabler/icons-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Beauceron } from "@/types/Beauceron";
import { beauceron as data } from "@/data/beauceron";

function Page() {
  const { slug } = useParams<{ slug: string }>();
  const [beauceron, setBeauceron] = useState<Beauceron | null>(null);

  useEffect(() => {
    if (!slug) return;

    const foundBeauceron = data.find((item) => item.slug === slug);
    setBeauceron(foundBeauceron || null);
  }, [slug]);

  return (
    <div className="flex flex-col gap-16">
      <Banner
        name="Beauceron"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      />

      <div className="flex flex-col gap-12 section-container mx-auto">
        <Link
          href="/unsere-rassezucht"
          className="bg-[#FBF2EA] w-fit font-medium flex font-p4 items-center border border-[var(--c-border)] px-2 py-1 rounded-3xl"
        >
          <IconArrowLeft className="h-4 w-4 mr-2" color="#CD6917" />
          Zurück zur Übersicht
        </Link>

        <div className="flex items-center w-full">
          <div className="flex items-center space-x-4">
            <img
              src={`/beauceron/${beauceron?.image}`}
              className="h-16 w-16 rounded-full object-cover"
            />
            <div className="flex flex-col space-y-2">
              <span className="font-bold">{beauceron?.name}</span>

              <div className="flex space-x-8 font-p4 items-center">
                <span className="flex items-center">
                  <span className="opacity-50 mr-2">Geburtsdatum:</span>
                  <span>{beauceron?.dob}</span>
                </span>

                <span className="font-bold opacity-25">•</span>

                <span className="flex items-center">
                  <span className="opacity-50 mr-2">Geburtsdatum:</span>
                  <span>{beauceron?.dob}</span>
                </span>

                <span className="font-bold opacity-25">•</span>

                <span className="flex items-center">
                  <span className="opacity-50 mr-2">Höhe:</span>
                  <span>{beauceron?.height ? beauceron.height : "-"}</span>
                </span>

                <span className="font-bold opacity-25">•</span>

                <span className="flex items-center">
                  <span className="opacity-50 mr-2">Gewicht:</span>
                  <span>{beauceron?.weight ? beauceron.weight : "-"}</span>
                </span>
              </div>
            </div>
          </div>

          <button className="font-medium flex items-center ml-auto border border-[rgba(26,_26,_26,_0.05)] bg-[#EEE5DD] px-4 py-2 rounded-[0.5rem] font-p4">
            <IconFileTypePdf className="h-4 w-4 mr-2" />
            Stammbaum
          </button>
        </div>

        <div className="w-full grid grid-cols-[1fr_auto_12rem] gap-16 items-center border border-[rgba(0,_0,_0,_0.15)] p-4 rounded-[1rem]">
          <div className="flex">
            <p className="opacity-75 font-p3">
              Our Akela is our first Beauceron and the trunk dog of our
              breeding. It is a harmonious and compact beauceron bitch with
              strong bone structure. Akela has a very friendly and open nature,
              is sporty, extremely faithful and a good watchdog. She is a
              sovereign boss of our dog pack.  <br />
              <br />
              She likes to work as a train dog (canicross, dogscooter, dog trike
              team) and drives our chickens to the stable with great enthusiasm.
              Even if she is allowed to help out with the sheep, she is full of
              enthusiasm. Chatwise, we have already participated in an agility
              competition. Akela is 62 cm tall and weighs 35 kg.
            </p>
          </div>

          <span className="w-[1px] h-[75%] bg-[#EDE0D6]"></span>

          <div className="flex flex-col gap-4">
            <button className=" w-full font-medium flex items-center ml-auto border border-[rgba(26,_26,_26,_0.05)] bg-[#EEE5DD] px-4 py-2 rounded-[0.5rem] font-p4">
              <IconFileTypePdf className="h-4 w-4 mr-2" />
              Stammbaum
            </button>
            <button className=" w-full font-medium flex items-center ml-auto border border-[rgba(26,_26,_26,_0.05)] bg-[#EEE5DD] px-4 py-2 rounded-[0.5rem] font-p4">
              <IconFileTypePdf className="h-4 w-4 mr-2" />
              Arbeitsresultate
            </button>
            <button className=" w-full font-medium flex items-center ml-auto border border-[rgba(26,_26,_26,_0.05)] bg-[#EEE5DD] px-4 py-2 rounded-[0.5rem] font-p4">
              <IconFileTypePdf className="h-4 w-4 mr-2" />
              Zucht
            </button>
          </div>
        </div>


        <div className="grid grid-cols-3 gap-4 ">
            <img className="w-full aspect-square object-cover rounded-[1rem]" src={'/beauceron/sample/1.png'} />
            <img className="w-full aspect-square object-cover rounded-[1rem]" src={'/beauceron/sample/2.png'} />
            <img className="w-full aspect-square object-cover rounded-[1rem]" src={'/beauceron/sample/3.png'} />
        </div>
      </div>
    </div>
  );
}

export default Page;
