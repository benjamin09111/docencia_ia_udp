import { NextResponse } from "next/server";
import { getDevelopmentDemoAccounts } from "@/lib/server/userStore";

export async function GET() {
  const accounts = getDevelopmentDemoAccounts();
  return NextResponse.json({
    accounts: accounts.map((a) => ({
      id: a.id,
      email: a.email,
      username: a.username,
      name: a.name,
      role: a.role,
      isOwner: a.isOwner,
      demoPass: a.demoPass,
    })),
  });
}
