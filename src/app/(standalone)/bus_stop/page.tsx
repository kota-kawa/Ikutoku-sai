import type { Metadata } from "next";
import BusStopPageContent from "./BusStopClient";

export const metadata: Metadata = {
  title: "統合マップ（K1・K2のみ）",
  description: "バス停のマップです。",
};

export default function BusStopPage() {
  return <BusStopPageContent />;
}