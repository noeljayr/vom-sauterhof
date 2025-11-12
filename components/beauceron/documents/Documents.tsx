"use client";
import { useUrlModal } from "@/hooks/useUrlModal";
import { closeModal } from "@/lib/modalFunctions";
import { IconX } from "@tabler/icons-react";
import Stammbaum from "./Stammbaum";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Arbeitsresultate from "./Arbeitsresultate";
import Ausstellungsresultate from "./Ausstellungsresultate";
import Zucht from "./Zucht";

const tabs = [
  "stammbaum",
  "arbeitsresultate",
  "ausstellungsresultate",
  "zucht",
];

function Documents() {
  const { isOpen: open } = useUrlModal("beauceron-documents");
  const [activeTab, setActiveTab] = useState("");
  const [beauceronName, setBeauceronName] = useState("");
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const beauceronId = searchParams.get("id");

  useEffect(() => {
    if (!tab) return;
    setActiveTab(tab);
  }, [tab]);

  useEffect(() => {
    if (!beauceronId) return;

    const fetchBeauceron = async () => {
      try {
        const response = await fetch(`/api/beauceron/get?id=${beauceronId}`);
        const data = await response.json();
        if (data.success && data.beauceron) {
          setBeauceronName(data.beauceron.name);
        }
      } catch (error) {
        console.error("Error fetching beauceron:", error);
      }
    };

    fetchBeauceron();
  }, [beauceronId]);

  const close = () => {
    closeModal("beauceron-documents");
    closeModal("id");
    closeModal("tab");
  };

  return (
    <>
      {open && (
        <>
          <div className="flex fixed z-10 w-screen h-screen top-0 left-0 bg-black opacity-20"></div>

          <div className="top-8 py-2 gap-4 bg-white w-[40rem] max-sm:w-[90%] self-center rounded-[0.5rem] border border-black/10 fixed z-10">
            <div
              key={"title"}
              className="grid grid-cols-[1fr_auto] gap-4 items-center pb-2 border-b border-b-black/10 px-4"
            >
              <span className="font-medium truncate">
                {beauceronName ? `Dokumente für ${beauceronName}` : "Dokumente"}
              </span>
              <span
                onClick={close}
                style={{ transition: "ease 0.5s" }}
                className="p-1 bg-white cursor-pointer ml-auto rounded-[0.35rem] hover:brightness-95"
              >
                <IconX className="h-4 w-4" />
              </span>
            </div>

            <div key={"tabs"} className="flex gap-2 my-4 px-4">
              {tabs.map((t) => (
                <button
                  onClick={() => setActiveTab(t)}
                  style={{
                    transition: "ease 0.5s",
                    fontSize: "calc(var(--p4) * 0.9)",
                  }}
                  className={`py-1 px-4 font-medium capitalize border border-[var(--c-border)]  hover:brightness-95 rounded-[0.35rem] cursor-pointer ${
                    activeTab.toLowerCase() === t
                      ? "bg-[rgba(0,0,0,0.07)]"
                      : "bg-white"
                  } `}
                >
                  {t}
                </button>
              ))}
            </div>
            {activeTab.toLowerCase() == "stammbaum" && (
              <Stammbaum key={"stammbaum"} close={close} />
            )}
            {activeTab.toLowerCase() == "arbeitsresultate" && (
              <Arbeitsresultate key={"arbeitsresultate"} close={close} />
            )}
            {activeTab.toLowerCase() == "ausstellungsresultate" && (
              <Ausstellungsresultate
                key={"ausstellungsresultate"}
                close={close}
              />
            )}
            {activeTab.toLowerCase() == "zucht" && (
              <Zucht key={"zucht"} close={close} />
            )}
          </div>
        </>
      )}
    </>
  );
}

export default Documents;
