"use server";
import { SuccessPage } from "@/components/SuccessPage";
import { protectPage } from "@/lib/auth";

const Success = async () => {
	const userId = (await protectPage()).id;

	return <SuccessPage userId={userId} />;
};

export default Success;
