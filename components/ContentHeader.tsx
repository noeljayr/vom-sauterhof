import React from "react";
import logo from "@/public/logo.png";
import Image from "next/image";
import { IconChevronDown } from "@tabler/icons-react";

function ContentHeader() {
  return (
    <div className="flex items-center">
      <Image
        src={logo}
        alt="logo"
        className="h-12 w-12 mx-auto object-contain"
      />
    </div>
  );
}

export default ContentHeader;
