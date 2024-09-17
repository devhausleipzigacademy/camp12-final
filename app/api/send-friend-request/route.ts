import { NextRequest, NextResponse } from 'next/server';
import { sendFriendRequest } from '@/lib/utils/add-friend';

export async function GET(req: NextRequest) {
  const userIdOne = req.nextUrl.searchParams.get("from") as string
  const userIdTwo = req.nextUrl.searchParams.get("to") as string

  console.log(userIdOne);
  console.log(userIdTwo);

  try {
    // Call the addFriend function to add a friend
    await sendFriendRequest(userIdOne, userIdTwo);
        
    // Redirect to another page after adding a friend
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/profile/me`,
      },
    });  } catch (error) {
    return NextResponse.json({ error: 'Failed to add into friends list' }, { status: 500 });
  }
}
