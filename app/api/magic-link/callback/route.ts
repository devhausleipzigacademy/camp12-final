// pages/api/auth/login.ts
import { lucia } from "@/lib/auth"; // Import lucia for authentication
import { prisma } from "@/lib/db"; // Import prisma for database interactions
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers"; // Import cookies to handle sessions
import { NextRequest, NextResponse } from "next/server"; // Import Next.js request/response objects

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const state = url.searchParams.get("state") as string;
  const email = url.searchParams.get("email") as string;
  const intendedPath = cookies().get("location")?.value || "/";

  if (!state) {
    return NextResponse.json({ error: "State is required" }, { status: 400 });
  }

  const storedState = cookies().get("magic-link-state")?.value;

  console.log({ storedState, state });

  if (state !== storedState) {
    return NextResponse.json({ error: "Invalid state" }, { status: 400 });
  }

  // searchparams

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Check if the user already exists in the database
  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // If the user does not exist, create a new user
    user = await prisma.user.create({
      data: {
        id: generateIdFromEntropySize(10),
        email,
        settings: {
          create: {
            friendsVisibility: "Private",
            profileVisibility: "Private",
          },
        },
      },
    });
  }

  // Create a session for the user using Lucia
  const session = await lucia.createSession(user.id, {});
  const sessionCookie = await lucia.createSessionCookie(session.id);

  // Set the session cookie
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  // Respond with a success message or redirect
  return NextResponse.redirect(new URL(intendedPath, request.url), 302);
}
