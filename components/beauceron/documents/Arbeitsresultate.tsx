"use client";

import React from "react";
import DocumentUpload from "./DocumentUpload";

type Props = {
  close: () => void;
};

function Arbeitsresultate({ close }: Props) {
  return <DocumentUpload close={close} type="arbeitsresultate" />;
}

export default Arbeitsresultate;
