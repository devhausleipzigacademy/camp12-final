import React from "react";
import { ArrowLeft } from "lucide-react";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import Link from "next/link";
import { protectPage } from "@/lib/auth";
import { BackArrow } from "@/components/BackArrow";

export default async function QRPage() {

  const user = await protectPage();

  return (
		<div className='flex flex-col items-center justify-between min-h-screen bg-white p-4'>
			<div className='w-full max-w-sm bg-white rounded-lg p-6 flex flex-col justify-between flex-grow'>
				<BackArrow variant='link' />
				<div className='flex flex-col items-center flex-grow justify-center'>
					<h1 className='text-3xl font-bold text-center mb-2'>
						let&#39;s become friends
					</h1>
					<p className='text-center text-gray-600 mb-6'>
						Share the code and
						<br />
						grow your own community
					</p>
					<div className='m-14'>
						<QRCodeGenerator userId={user.id} />
					</div>
				</div>
			</div>
		</div>
	);
}
