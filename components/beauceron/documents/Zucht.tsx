"use client";

import React from "react";
import DocumentUpload from "./DocumentUpload";

type Props = {
  close: () => void;
};

function Zucht({ close }: Props) {
  return <DocumentUpload close={close} type="zucht" />;
}

export default Zucht;
