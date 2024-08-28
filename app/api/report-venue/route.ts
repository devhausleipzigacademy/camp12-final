// // app/api/reports/route.ts
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/db"; // Adjust this path as necessary
// import { randomUUID } from "crypto";

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const { damages, date, details } = body;

//     // Save the report to the database using Prisma
//     const report = await prisma.report.create({
//       data: {
//         issue: damages,
//         date: new Date(date),
//         time: new Date(date).toLocaleTimeString(),
//         detail: details,
//         venueId: randomUUID.toString() , // Replace this with the actual venue ID you want to use
//       },
//     });

//     return NextResponse.json(report, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to create report - api" }, { status: 500 });
//   }
// }

// app/api/reports/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db"; // Adjust this path as necessary
import { randomUUID } from "crypto";

// const prisma = new PrismaClient({
//   log: ['query', 'info', 'warn', 'error'],
// });


export async function POST(request: Request) {
  
  try {
    const body = await request.json();
    const { damages, date, details } = body;

    // Save the report to the database using Prisma
    const report = await prisma.report.create({
      data: {
        issue: damages,
        date: new Date(date),
        time: new Date(date).toLocaleTimeString(),
        detail: details,
        venueId: randomUUID.toString(), // Replace this with the actual venue ID you want to use
      },
    });

    return NextResponse.json(report, { status: 200 });
  } catch (error) {
    console.error("Error creating report:", error);  // Log the error for debugging
    return NextResponse.json({ error: "Failed to create report - api" }, { status: 500 });
  }
}
