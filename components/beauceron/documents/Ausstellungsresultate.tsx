"use client";

import React from "react";
import DocumentUpload from "./DocumentUpload";

type Props = {
  close: () => void;
};

function Ausstellungsresultate({ close }: Props) {
  return <DocumentUpload close={close} type="ausstellungsresultate" />;
}

export default Ausstellungsresultate;
