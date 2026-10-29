import type { Metadata } from "next";
import TaskUp from "./components/TaskUp";
import { info } from "./info";

export const metadata: Metadata = {
  title: `${info.proyecto} · HUB IAE LIFE`,
  description: info.descripcion,
};

export default function Page() {
  return <TaskUp />;
}
