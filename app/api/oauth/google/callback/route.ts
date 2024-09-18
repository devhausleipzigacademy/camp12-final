import { lucia } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { google } from "@/lib/oauth";
import { OAuth2RequestError } from "arctic";
import axios from "axios";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    return Response.json(
      { error: "Invalid state, missing parameters" },
      { status: 400 }
    );
  }

  const storedState = cookies().get("google_oauth_state")?.value ?? null;
  const storedCodeVerifier =
    cookies().get("google_oauth_verifier")?.value ?? null;

  if (!storedState || !storedCodeVerifier) {
    return Response.json(
      { error: "Invalid request, can't verify" },
      { status: 400 }
    );
  }

  if (storedState !== state) {
    return Response.json({ error: "State mismatch" }, { status: 400 });
  }

  try {
    const { accessToken } = await google.validateAuthorizationCode(
      code,
      storedCodeVerifier
    );
    const { data: googleUser } = await axios.get<GoogleUser>(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const exisitingUser = await prisma.user.findUnique({
      where: { googleId: googleUser.id },
    });

    console.log({ exisitingUser });

    if (exisitingUser) {
      const session = await lucia.createSession(exisitingUser.id, {});
      const sessionCookie = await lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
      const intendedPath = cookies().get("location")?.value || "/";

      return NextResponse.redirect(new URL(intendedPath, request.url), 302);
    }

    const userId = generateIdFromEntropySize(10);

    await prisma.user.create({
      data: {
        id: userId,
        googleId: googleUser.id,
        email: googleUser.email,
        picture: googleUser.picture,
        name: googleUser.name,
        settings: {
          create: {
            friendsVisibility: "Private",
            profileVisibility: "Private",
          },
        },
      },
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = await lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    const intendedPath = cookies().get("location")?.value || "/";

    return NextResponse.redirect(new URL(intendedPath, request.url), 302);
  } catch (err) {
    if (err instanceof OAuth2RequestError) {
      return new Response(null, { status: 400 });
    }
    return new Response(null, { status: 500 });
  }
}
