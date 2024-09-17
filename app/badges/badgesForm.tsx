"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Badge } from "@prisma/client";
import { BackArrow } from "@/components/BackArrow";

type BadgesFormProps = {
	badges: Badge[];
};

export default function BadgesForm({ badges }: BadgesFormProps) {
	console.log(badges);

	const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

	return (
		<div className='max-w-sm mx-auto bg-white p-4 font-sans'>
			<div className='mb-4'>
				<BackArrow variant='link' />
			</div>

			<h1 className='text-xl text-center font-bold pt-8 mb-12'>Badges</h1>

			<div className='bg-gray-200 rounded-lg p-4 mb-4'>
				<h2 className='text-lg font-semibold mb-2'>Your Badges</h2>
				<div className='grid grid-cols-4 gap-2'>
					{badges.map((badge) => (
						<div
							key={badge.name}
							className='flex flex-col items-center'
						>
							<button
								className='w-16 h-16 bg-white rounded-full overflow-hidden'
								onClick={() => setSelectedBadge(badge)}
							>
								<Image
									src={badge.icon || "/placeholder.svg"}
									alt={badge.name}
									width={64}
									height={64}
									objectFit='cover'
								/>
							</button>
							{/* <span>{badge.name}</span> */}
						</div>
					))}
				</div>
			</div>

			<div
				className={`bg-gray-200 rounded-lg p-4 ${
					selectedBadge ? "" : "hidden"
				}`}
			>
				<h2 className='text-lg font-semibold mb-2'>Badge Detail</h2>
				<div className='flex items-center mb-2'>
					<div className='w-16 h-16 bg-white rounded-full overflow-hidden mr-4'>
						<Image
							src={selectedBadge?.icon || "/placeholder.svg"}
							alt={selectedBadge?.name || "Badge"}
							width={64}
							height={64}
							objectFit='cover'
						/>
					</div>
					<span className='font-semibold'>{selectedBadge?.name}</span>
				</div>
				<h3 className='font-semibold mb-1'>Description</h3>
				{/* <h3 className="font-semibold mb-1">{selectedBadge?.description}</h3> */}
				<div className='bg-gray-100 border border-black p-3 rounded-lg'>
					{selectedBadge?.description
						?.split("\n")
						.map((line, index) => <p key={index}>{line}</p>) || (
						<p>No description available</p>
					)}
				</div>

				{/* 
        I don't know what this is: 
        But it's not in the database so we'll leave it for later
        <p className="mt-2 text-sm text-gray-600">
          Acquired: {selectedBadge.acquired}
        </p> */}
			</div>
		</div>
	);
}
