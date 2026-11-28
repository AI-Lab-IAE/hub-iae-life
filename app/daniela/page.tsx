import type { Metadata } from "next";
import TaskUp from "./components/TaskUp";
import { info } from "./info";

export const metadata: Metadata = {
  title: "Organiza",
  description: info.descripcion,
};

export default function Page() {
  return <TaskUp />;
}
