import type { Metadata } from "next";
import { festivalConfig } from "../../../config/festival";
import EventPageContent from "./EventClient";

export const metadata: Metadata = {
  title: `${festivalConfig.festivalName} | 企画紹介`,
};

export default function EventPage() {
  return <EventPageContent />;
}
