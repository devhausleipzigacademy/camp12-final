"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";

export default function Login() {
  return (
    <div className="h-screen flex flex-col items-center bg-white">
      <img
        className="w-screen flex-1 object-cover object-left"
        src="signin-hero.jpg"
        alt="Person sitting on a ping pong table"
      />
      <div className="flex flex-1 px-5 flex-col items-center justify-evenly w-full">
        <div className="text-center">
          <h1 className="text-3xl font-semibold mb-2">Hi there!</h1>
          <h2 className="text-sm text-muted-foreground">
            Spin, Smash, Socialize <br /> Discover Ping Pong Partners Near You!
          </h2>
        </div>
        <div className="flex flex-col gap-6 items-center w-full">
          <div className="flex flex-col w-full gap-3">
            <Input placeholder="your@mail.com" />
            <Button>Sign in with email</Button>
          </div>
          <div className="w-full flex gap-3 items-center">
            <div className="h-px bg-muted-foreground/20 flex-1"></div>
            <p className="text-muted-foreground text-xs">or continue with</p>
            <div className="h-px bg-muted-foreground/20 flex-1"></div>
          </div>
          <Button variant="outline" className="w-full gap-2" asChild>
            <Link href="/api/oauth/google">
              <FcGoogle className="size-5" />
              Sign in with Google
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
