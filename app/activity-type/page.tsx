"use client";

import { useForm } from "react-hook-form";
import { NextPage } from "next";
import { useState } from "react";
import { createActivityType } from "@/actions/activity-type"; // Import the server action
import { BackArrow } from "@/components/BackArrow";

type FormValues = {
  name: string;
  description?: string;
  requiredNumberOfParticipants: number;
};

const CreateActivityTypePage: NextPage = () => {
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      requiredNumberOfParticipants: 1,
    },
  });

  const [error, setError] = useState<string | null>(null);

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    try {
      await createActivityType(data); // Call the server action
      reset(); // Reset the form after successful submission
    } catch (error) {
      setError("Error creating activity");
      console.error("Error creating activity:", error);
    }
  };

  return (
		<div className='flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50'>
			<BackArrow variant='link' />
			<h1 className='text-2xl font-bold mb-6'>Create Activity</h1>

			{error && <p className='text-red-500 mb-4'>{error}</p>}

			<form
				onSubmit={handleSubmit(onSubmit)}
				className='w-full max-w-md'
			>
				<input
					type='text'
					placeholder='Enter new activity type'
					{...register("name", { required: true })}
					className='mb-4 p-2 border border-gray-300 rounded w-full'
				/>

				<label className='text-lg font-semibold mb-2'>
					Required Number of Participants
				</label>
				<input
					type='number'
					min={1}
					{...register("requiredNumberOfParticipants", {
						required: true,
						valueAsNumber: true,
					})}
					className='mb-4 p-2 border border-gray-300 rounded w-full'
				/>

				<h2 className='text-lg font-semibold mb-2'>Description</h2>

				<textarea
					{...register("description")}
					className='mb-6 p-2 border border-gray-300 rounded w-full'
				/>

				<button
					type='submit'
					className='bg-black text-white p-2 rounded w-full'
				>
					Create
				</button>
			</form>
		</div>
	);
};

export default CreateActivityTypePage;
