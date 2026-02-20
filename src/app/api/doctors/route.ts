import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDoctors } from "@/lib/doctors-storage";

// GET /api/doctors - Get all doctors
export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const doctors = await getDoctors();
    return NextResponse.json(doctors);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch doctors" },
      { status: 500 },
    );
  }
}

