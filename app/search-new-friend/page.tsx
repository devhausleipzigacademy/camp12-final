import { Button } from "@/components/ui/button";

import SearchFriend from "@/components/SearchFriend";
import { FriendCard } from "@/components/friend-card";
import { findFriends } from "@/actions/friends";
import { validateRequest } from "@/lib/auth";
import Link from "next/link";
import React from "react";
import { protectPage } from "@/lib/auth";

export default async function FriendSearchPage() {

  await protectPage();
  
  return <>
    <SearchFriend />
  </>
};