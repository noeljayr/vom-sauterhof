"use client";

import React from "react";
import DocumentUpload from "./DocumentUpload";

type Props = {
  close: () => void;
};

function Stammbaum({ close }: Props) {
  return <DocumentUpload close={close} type="stammbaum" />;
}

export default Stammbaum;
