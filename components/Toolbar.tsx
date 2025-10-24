"use client";

import { IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Toolbar() {
  const pathname = usePathname();
  return (
    <div className="w-full items-center">
      <div className="flex items-center space-x-2">
        <Link
          style={{
            transition: "ease 0.5s",
            fontSize: 'calc(var(--p4) * 0.9)'
        }}
          href={"/content/news"}
          className={`py-1 px-2 font-medium border border-[var(--c-border)] ${
            pathname.startsWith("/content/news")
              ? "bg-[#E8DBD1]"
              : "bg-[#F9ECE1]"
          } rounded-[0.35rem]`}
        >
          News
        </Link>

        <Link
          style={{
            transition: "ease 0.5s",
            fontSize: 'calc(var(--p4) * 0.9)'
        }}
          href={"/content/beauceron"}
          className={`py-1 px-2 font-medium border border-[var(--c-border)] ${
            pathname.startsWith("/content/beauceron")
              ? "bg-[#E8DBD1]"
              : "bg-[#F9ECE1]"
          } rounded-[0.35rem]`}
        >
          Beauceron
        </Link>

        <div className="grid grid-cols-[1fr_auto] ml-auto p-1 border border-[var(--c-border)] rounded-[0.5rem] w-[20rem] bg-[#F7E4D4]">
          <input
            type="text"
            placeholder={"Search"}
            className="outline-0 border-0 bg-transparent h-full font-p3 pl-2 font-medium w-full"
          />
          <button className="bg-[#58483B] h-[1.35rem] w-[1.35rem] cursor-pointer rounded-[0.35rem] flex items-center justify-center">
            <IconSearch className="h-3 w-3 opacity-75 " color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Toolbar;
