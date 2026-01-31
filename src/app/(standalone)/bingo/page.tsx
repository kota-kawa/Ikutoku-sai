import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import BingoClient from "../../../components/BingoClient";
import { isAuthenticated } from "../../../server/auth";

export default function BingoPage() {
  const cookieHeader = cookies()
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  if (!isAuthenticated(cookieHeader)) {
    redirect("/login");
  }

  return <BingoClient />;
}
