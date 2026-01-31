import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "../../../components/LoginForm";
import { isAuthenticated } from "../../../server/auth";

export default function LoginPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const cookieHeader = cookies()
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  if (isAuthenticated(cookieHeader)) {
    redirect("/bingo");
  }

  const error = searchParams?.error === "1";

  return <LoginForm showError={Boolean(error)} />;
}
