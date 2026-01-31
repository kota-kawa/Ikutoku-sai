import { authCookie } from "../../server/auth";

export const runtime = "nodejs";

function redirect(location: string, headers: HeadersInit = {}): Response {
  return new Response(null, {
    status: 302,
    headers: { Location: location, ...headers }
  });
}

export async function POST(request: Request): Promise<Response> {
  const form = await request.formData();
  const password = String(form.get("password") ?? "");
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";

  if (adminPassword && password === adminPassword) {
    return redirect("/bingo", {
      "Set-Cookie": authCookie()
    });
  }

  return redirect("/login?error=1");
}

export function GET(): Response {
  return new Response("Method Not Allowed", { status: 405 });
}
