"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

function ContentNavigation() {
  const pathname = usePathname();
  return (
    <>
      <Link
        style={{
          transition: "ease 0.5s",
          fontSize: "calc(var(--p3) * 0.9)",
        }}
        href={"/content/news"}
        className={`py-1 px-4 font-medium border border-[var(--c-border)] ${
          pathname.startsWith("/content/news") ? "bg-[#E8DBD1]" : "bg-[#F9ECE1]"
        } h-[2rem] flex items-center justify-center rounded-[0.35rem]`}
      >
        News
      </Link>

      <Link
        style={{
          transition: "ease 0.5s",
          fontSize: "calc(var(--p3) * 0.9)",
        }}
        href={"/content/beauceron"}
        className={`py-1 px-4 font-medium border border-[var(--c-border)] ${
          pathname.startsWith("/content/beauceron")
            ? "bg-[#E8DBD1]"
            : "bg-[#F9ECE1]"
        } rounded-[0.35rem] h-[2rem] flex items-center justify-center`}
      >
        Beauceron
      </Link>
    </>
  );
}

export default ContentNavigation;
