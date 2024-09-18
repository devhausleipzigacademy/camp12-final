// app/report-venue/page.tsx
import { BackArrow } from "@/components/BackArrow";
import ReportForm from "@/components/report-form";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function ReportVenuePage() {
  const venues = await prisma.venue.findMany({
    select: { id: true, name: true },
  });
  return (
		<main className='m-4'>
			<BackArrow variant='link' />
			<section className='flex flex-col items-center gap-3'>
				<h1 className='text-2xl font-bold'>Report about a venue</h1>
				<h2 className='text-base'>is there something wrong?</h2>
			</section>
			<section className='flex flex-col '>
				<ReportForm venues={venues} />
			</section>
		</main>
	);
}
