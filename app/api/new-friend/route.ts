import { NextRequest, NextResponse } from 'next/server';
import { addFriend } from '@/lib/utils/add-friend';


export async function GET(req: NextRequest) {
  const userIdOne = req.nextUrl.searchParams.get("user-one") as string
  const userIdTwo = req.nextUrl.searchParams.get("user-two") as string

  try {
    // Call the addFriend function to add a friend
    await addFriend(userIdOne, userIdTwo);
        
    // Redirect to another page after adding a friend
    return new Response(null, {
			status: 302,
			headers: {
				Location: `/success`,
			},
		});  } catch (error) {
    return NextResponse.json({ error: 'Failed to add into friends list' }, { status: 500 });
  }
}
