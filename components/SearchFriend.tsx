"use client";

import React, { useState, useRef, useEffect } from "react";
import { LuSearch } from "react-icons/lu";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export default function SearchFriend() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();

    console.log("Search submitted with query:", searchQuery);

    const encodedSearchQuery = encodeURI(searchQuery);
    console.log(`/search-friend?q=${encodedSearchQuery}`);
    
    router.push(`/search-new-friend/results?q=${encodedSearchQuery}`);
  };

  const toggleSearch = () => setIsOpen((prev) => !prev);
  const closeSearch = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        className=" absolute z-[9999] top-4 left-4 flex w-11 h-11 rounded-xl p-3 bg-white justify-center items-center cursor-pointer"
        onClick={toggleSearch}
      >
        <LuSearch className="size-6" />
      </button>
    );
  }

  return (
    <form
      ref={searchRef}
      onSubmit={onSearch}
      className="absolute z-[9999] top-4 inset-x-3 flex gap-2 items-center "
    >
      <Input
        ref={inputRef}
        type="search"
        placeholder="Search..."
        className="flex-grow border-none focus:outline-none"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
      />
      <Button type="submit" className="flex w-11 h-11 rounded-xl p-3">
        <LuSearch className="size-6 cursor-pointer flex-shrink-0" />
      </Button>
    </form>
  );
}
