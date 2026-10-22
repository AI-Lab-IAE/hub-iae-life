import type { Metadata } from "next";
import { Suspense } from "react";
import { Estudiar } from "../components/Estudiar";

export const metadata: Metadata = {
  title: "Estudiar · EstudIA",
};

export default function PaginaEstudiar() {
  return (
    <Suspense>
      <Estudiar />
    </Suspense>
  );
}
