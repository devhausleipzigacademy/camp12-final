import Search from "@/components/Search";
import { prisma } from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { protectPage } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const SearchPage = async ({
  searchParams,
}: {
  searchParams: { q: string };
}) => {

  console.log("Search Params", searchParams.q);

  const user = await protectPage();

  const searchQuery = searchParams.q || "";

  const users = await prisma.user.findMany({
        where: {
            name: { contains: searchQuery, mode: "insensitive" }
        },
    });
    
    console.log(users);

    return (
    <div className="container mx-auto p-4">
    <Link href="/">
      <ArrowLeft className="w-6 h-6 mb-5" />
    </Link>
    <h1 className="text-2xl font-bold mb-4">
      Search results for: {searchQuery}
    </h1>

    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-2">Users</h2>
      {users.length > 0 ? (
        <ul className="space-y-2">
          {users.map((result) => (
            <li key={result.id} className="border p-2 rounded">
              <div className="flex justify-between">
                <div>
                <a className="font-medium text-lg">{result.name}</a>
              <p className="text-sm text-zinc-500">{result.email}</p>
                </div>
                <div>
                  <Link href={`api/send-friend-request?from=${user.id}&to=${result.id}`}>
                    <Button>Send Friend Request</Button>
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No Users found</p>
      )}
    </div>
  </div>
    )

};

export default SearchPage;