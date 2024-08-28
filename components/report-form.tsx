"use client";
import { CalendarIcon } from "@radix-ui/react-icons";
import { useState } from "react";
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
import { useSubmitReport } from "../lib/hooks/useSubmitReport"; // Import your custom hook
import { redirect } from "next/navigation";

// Form Schema for report
const formSchema = z.object({
	damages: z.enum(["net", "surface", "uneven", "edges", "safety", "other"], {
		required_error: "Choose what is damaged",
	}),
	date: z.date(),
	details: z.string().trim().optional(),
});

export default function ReportForm() {
	const [isOpen, setIsOpen] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			date: new Date(),
			details: "",
		},
	});

	const { submitReport, loading, error } = useSubmitReport();

	const date = useWatch({
		control: form.control,
		name: "date",
	});

	// When form is submitted
	async function onSubmit(data: z.infer<typeof formSchema>) {
		const response = await submitReport({
			damages: data.damages,
			date: data.date.toISOString(),
			details: data.details,
		});

		if (response) {
			toast.success("Report submitted successfully! - this is the hook!");
			redirect("/profile");
		} else {
			toast.error("Failed to submit report - this is the hook!");
		}
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
								<Select onValueChange={field.onChange}>
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
									className='w-full'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type='submit'
					className='m-5'
					disabled={loading}
				>
					{loading ? "Submitting..." : "Report"}
				</Button>

				{error && <p className='text-red-500 mt-2'>{error}</p>}
			</form>
		</Form>
	);
}
