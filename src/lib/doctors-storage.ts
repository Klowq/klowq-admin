import { promises as fs } from "fs";
import path from "path";
import type { Doctor } from "@/types/doctor";

const dataDir = path.join(process.cwd(), "data");
const doctorsFile = path.join(dataDir, "doctors.json");

async function ensureDataDir() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch {
    // ignore if already exists
  }
}

export async function getDoctors(): Promise<Doctor[]> {
  await ensureDataDir();
  try {
    const data = await fs.readFile(doctorsFile, "utf-8");
    return JSON.parse(data);
  } catch {
    // if file missing, return empty list
    return [];
  }
}

