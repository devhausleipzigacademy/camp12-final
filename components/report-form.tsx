"use client";
import { CalendarIcon } from "@radix-ui/react-icons";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
// import { prisma } from "@/lib/db";
// import { redirect } from "next/navigation";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { toast } from "sonner";
import { format } from "date-fns";

// form Schema for report
const formSchema = z.object({
	damages: z.enum(["net", "surface", "uneven", "edges", "safety", "other"], {
		required_error: "Choose what is damaged",
	}),
	date: z.date(),
	details: z.string().trim().optional(),
});

// Server action to handle form submission
// export async function addReport(formData: FormData) {
// 	const issue = formData.get("issue") as string;
// 	const date = formData.get("date") as string;
// 	const date = formData.get("date") as string;
// 	const detail = formData.get("detail") as string;
// 	const venueId = formData.get("venueId") as string;

// 	if (!issue || !date || !date || !venueId) {
// 		throw new Error("Missing required fields");
// 	}

// 	await prisma.report.create({
// 		data: {
// 			issue,
// 			date: new Date(date),
// 			date,
// 			detail,
// 			venueId,
// 		},
// 	});

// 	// Redirect after successful submission
// 	redirect("/profile");
// }

export default function ReportForm() {
	const [issue, setIssue] = useState<string>("");
	const [details, setDetails] = useState<string>("");
	const [isOpen, setIsOpen] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			date: new Date(),
			details: "",
		},
	});

	const date = useWatch({
		control: form.control,
		name: "date",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!issue) {
			alert("Please fill out all required fields.");
			return;
		}
	};

	// // Assuming venueId is known and passed to this form
	// const venueId = "some-venue-id"; // Replace with actual venue ID

	// Create FormData object to submit to server action
	// 	const formData = new FormData();
	// 	formData.append("issue", issue);
	// 	formData.append("detail", details);
	// 	formData.append("venueId", venueId);

	// 	try {
	// 		await addReport(formData); // Call server action with form data
	// 		alert("Report submitted successfully!");
	// 	} catch (error) {
	// 		alert("Failed to submit the report.");
	// 	}
	// };
	// Handling form submission
	async function onSubmit(data: z.infer<typeof formSchema>) {
		console.log("SUBMITTED", data);
		// Shadcn Sonner pop up message
		toast.success(`Issue reported succesfully!`);
	}
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='flex flex-col gap-4 m-10'
			>
				<FormField
					control={form.control}
					name='damages'
					render={({ field }) => (
						<FormItem>
							<FormLabel>What is Wrong with the Venue?</FormLabel>
							<FormControl className='flex flex-col m-3 text-sm gap-7'>
								{/* <p className='font-semibold'>What is wrong with this venue?</p> */}
								<Select onValueChange={(value) => setIssue(value)}>
									<SelectTrigger>
										<SelectValue placeholder='Choose an issue' />
									</SelectTrigger>
									<SelectContent className='bg-white p-3'>
										<SelectGroup>
											<SelectItem value='net'>No net/net damaged</SelectItem>
											<SelectItem value='surface'>
												Surface severely damaged
											</SelectItem>
											<SelectItem value='uneven'>Surface uneven</SelectItem>
											<SelectItem value='edges'>Chipped edges</SelectItem>
											<SelectItem value='safety'>
												Safety hazards - please specify below
											</SelectItem>
											<SelectItem value='other'>
												Other - please specify below
											</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
							</FormControl>
						</FormItem>
					)}
				/>

				{/* Date */}
				<Popover
					open={isOpen}
					onOpenChange={setIsOpen}
				>
					<PopoverTrigger asChild>
						<FormControl>
							<Button
								variant={"outline"}
								className={cn(
									"w-full font-normal",
									!date && "text-muted-foreground"
								)}
							>
								{date ? `${format(date, "PPP")}` : <span>Pick a date</span>}
								<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
							</Button>
						</FormControl>
					</PopoverTrigger>
					<PopoverContent
						className='w-auto p-0'
						align='start'
					>
						<Calendar
							mode='single'
							captionLayout='dropdown'
							selected={date}
							onSelect={(selectedDate) => {
								form.setValue("date", selectedDate ?? new Date());
							}}
							onDayClick={() => setIsOpen(false)}
							fromYear={new Date().getFullYear()}
							toYear={new Date().getFullYear() + 1}
							disabled={(date) =>
								Number(date) < Date.now() - 1000 * 60 * 60 * 24 ||
								Number(date) > Date.now() + 1000 * 60 * 60 * 24 * 30
							}
						/>
					</PopoverContent>
				</Popover>

				<FormField
					control={form.control}
					name='details'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Details</FormLabel>
							<FormControl>
								<Textarea
									placeholder='Do you have any details to report?'
									{...field}
									className='w-[270px]'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* <div className='flex flex-col m-3 text-sm gap-7'>
					<p className='font-semibold'>Do you have more details to report?</p>
					<Textarea
						placeholder='Type in details'
						className='h-20'
						value={details}
						onChange={(e) => setDetails(e.target.value)}
					/>
				</div> */}
				<Button
					type='submit'
					className='m-5'
				>
					Report
				</Button>
			</form>
		</Form>
	);
}
