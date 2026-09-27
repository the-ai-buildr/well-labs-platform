import { type NextRequest, NextResponse } from "next/server";

import { clientInputSchema } from "@/lib/validation/clients";
import { getCurrentUser } from "@/server/dal/auth";
import { createClientRecord, listClients } from "@/server/dal/clients";

/**
 * JSON API for external callers (webhooks, mobile, scripts). UI code should
 * call the DAL from Server Components / Server Actions instead of fetching this.
 */
export async function GET() {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ data: await listClients() });
}

export async function POST(request: NextRequest) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = clientInputSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  return NextResponse.json(
    { data: await createClientRecord(parsed.data) },
    { status: 201 },
  );
}
