// hooks/useSubmitReport.ts
import axios from "axios";
import { useState } from "react";

export function useSubmitReport() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const submitReport = async (data: any) => {
		setLoading(true);
		setError(null);

		try {
			const response = await axios.post("/api/report-venue", data);
			console.log(`response: ${response}`);
			console.log(response.data);

			return response.data;
		} catch (error: any) {
			setError(
				error.response?.data?.error || "An unknown error occurred - hook"
			);
			return null;
		} finally {
			setLoading(false);
		}
	};

	return { submitReport, loading, error };
}
