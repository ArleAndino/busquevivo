import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const file = path.join(process.cwd(), "public/mockdata/bitacora.json");
  const data = fs.readFileSync(file, "utf8");
  return NextResponse.json(JSON.parse(data));
}
