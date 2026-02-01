import type { Metadata } from "next";
import MapPageContent from "./MapClient";

export const metadata: Metadata = {
  title: "統合マップ",
  description: "宇宙祭の会場マップです。",
};

export default function MapPage() {
  return <MapPageContent />;
}