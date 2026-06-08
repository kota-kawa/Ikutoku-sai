import type { Metadata } from "next";
import { festivalConfig } from "../../../config/festival";
import MapPageContent from "./MapClient";

export const metadata: Metadata = {
  title: "統合マップ",
  description: `${festivalConfig.festivalName}の会場マップです。`,
};

export default function MapPage() {
  return <MapPageContent />;
}
