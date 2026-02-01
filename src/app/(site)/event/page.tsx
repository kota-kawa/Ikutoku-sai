import type { Metadata } from "next";
import EventPageContent from "./EventClient";

export const metadata: Metadata = {
  title: "宇宙祭 | 企画紹介",
};

export default function EventPage() {
  return <EventPageContent />;
}