"use client";

import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  HiOutlineDotsVertical,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineTrendingUp,
  HiOutlineTrendingDown,
  HiOutlineUser,
  HiOutlineDocumentText,
  HiOutlineEye,
} from "react-icons/hi";
import { FaUserDoctor } from "react-icons/fa6";
import { Button } from "@/components/organisms/Button";
import Link from "next/link";

// Mock data for dashboard
const summaryCards = [
  {
    title: "Total Patients",
    value: "2,420",
    change: 47,
    trend: "up" as const,
    label: "From last month",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    sparkline: [20, 35, 28, 45, 52, 48, 65, 72, 68, 85, 90, 95],
  },
  {
    title: "Total Doctors",
    value: "226",
    change: 10,
    trend: "down" as const,
    label: "From last month",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    sparkline: [80, 72, 65, 70, 58, 55, 48, 52, 45, 42, 38, 35],
  },
  {
    title: "Total Blogs",
    value: "193",
    change: 25,
    trend: "up" as const,
    label: "From last month",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    sparkline: [15, 22, 18, 30, 35, 42, 38, 50, 55, 62, 70, 78],
  },
];

const visitorsData = [
  { day: "1", visitors: 8000, patients: 600 },
  { day: "5", visitors: 12000, patients: 800 },
  { day: "10", visitors: 18000, patients: 1100 },
  { day: "13", visitors: 12345, patients: 345 },
  { day: "15", visitors: 22000, patients: 1400 },
  { day: "20", visitors: 28000, patients: 1800 },
  { day: "25", visitors: 35000, patients: 2100 },
  { day: "30", visitors: 42345, patients: 2345 },
];

// Doctors data for dashboard table
const doctorsData = [
  {
    id: "DOC001",
    name: "Dr. Sarah Smith",
    specialization: "Cardiology",
    title: "Senior Consultant",
    blogCount: 12,
    status: "Completed",
  },
  {
    id: "DOC002",
    name: "Dr. Mike Johnson",
    specialization: "General Medicine",
    title: "Consultant",
    blogCount: 8,
    status: "Pending",
  },
  {
    id: "DOC003",
    name: "Dr. Lisa Wilson",
    specialization: "Pediatrics",
    title: "Senior Consultant",
    blogCount: 15,
    status: "In Review",
  },
  {
    id: "DOC004",
    name: "Dr. James Chen",
    specialization: "Orthopedics",
    title: "Consultant",
    blogCount: 3,
    status: "Completed",
  },
  {
    id: "DOC005",
    name: "Dr. Emily Davis",
    specialization: "Dermatology",
    title: "Associate Consultant",
    blogCount: 0,
    status: "Rejected",
  },
  {
    id: "DOC006",
    name: "Dr. Michael Brown",
    specialization: "Cardiology",
    title: "Senior Consultant",
    blogCount: 10,
    status: "In Review",
  },
  {
    id: "DOC007",
    name: "Dr. David Lee",
    specialization: "Pediatrics",
    title: "Senior Consultant",
    blogCount: 12,
    status: "Rejected",
  },
  {
    id: "DOC008",
    name: "Dr. Olivia Wilson",
    specialization: "Cardiology",
    title: "Senior Consultant",
    blogCount: 10,
    status: "Pending",
  },
  {
    id: "DOC009",
    name: "Dr. Daniel Garcia",
    specialization: "Cardiology",
    title: "Senior Consultant",
    blogCount: 10,
    status: "Completed",
  },
  {
    id: "DOC010",
    name: "Dr. Sophia Martinez",
    specialization: "Cardiology",
    title: "Senior Consultant",
    blogCount: 10,
    status: "Completed",
  },
];

function SparklineBar({ values }: { values: number[] }) {
  const max = Math.max(...values);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {values.map((v, i) => (
        <div
          key={i}
          className="w-1.5 rounded-sm bg-primary min-h-[2px]"
          style={{ height: `${(v / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

function SparklineLine({ values }: { values: number[] }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const w = 60;
  const h = 28;
  const points = values
    .map(
      (v, i) =>
        `${(i / (values.length - 1)) * w},${h - ((v - min) / range) * h}`,
    )
    .join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        className="text-primary"
      />
    </svg>
  );
}

function StatCard({
  title,
  value,
  change,
  trend,
  label,
  iconBg,
  iconColor,
  sparkline,
  chartType = "bar",
  icon,
}: {
  title: string;
  value: string;
  change: number;
  trend: "up" | "down";
  label: string;
  iconBg: string;
  iconColor: string;
  sparkline: number[];
  chartType?: "bar" | "line";
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div
          className={`w-10 h-10 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center text-lg font-bold`}
        >
          {icon}
        </div>
        <button
          type="button"
          className="p-1 rounded hover:bg-muted text-muted-foreground"
          aria-label="Options"
        >
          <HiOutlineDotsVertical className="w-5 h-5" />
        </button>
      </div>
      <p className="text-muted-foreground text-sm font-medium mb-0.5">
        {title}
      </p>
      <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`text-sm font-medium flex items-center gap-0.5 ${trend === "up" ? "text-green-500" : "text-red-400"}`}
        >
          {trend === "up" ? (
            <HiOutlineTrendingUp className="w-4 h-4" />
          ) : (
            <HiOutlineTrendingDown className="w-4 h-4" />
          )}
          {change}%
        </span>
        <span className="text-muted-foreground text-sm">{label}</span>
      </div>
      <div className="flex justify-end">
        {chartType === "bar" ? (
          <SparklineBar values={sparkline} />
        ) : (
          <SparklineLine values={sparkline} />
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const { data: session } = useSession();
  const userName = session?.user?.name ?? "Richard";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome + quick actions */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Welcome back, {userName}
            </h2>
            <p className="text-muted-foreground mt-0.5">
              Track, manage and forecast your patient reports and data.
            </p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCard
            {...summaryCards[0]}
            chartType="bar"
            icon={<HiOutlineUser className="w-6 h-6" />}
          />
          <StatCard
            {...summaryCards[1]}
            chartType="line"
            icon={<FaUserDoctor className="w-6 h-6" />}
          />
          <StatCard
            {...summaryCards[2]}
            chartType="bar"
            icon={<HiOutlineDocumentText className="w-6 h-6" />}
          />
        </div>

        {/* Second row: Visitors chart + two patient cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Visitors Statistics */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center text-lg font-bold">
                  V
                </div>
                <h3 className="font-bold text-foreground">
                  Visitors Statistics
                </h3>
              </div>
              <select
                aria-label="Select time range"
                className="px-3 py-2 rounded-lg border border-border text-sm text-foreground bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option>Last 30 days</option>
                <option>Last 7 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-6 mb-5">
              <div>
                <p className="text-muted-foreground text-sm">Total Visitors</p>
                <p className="text-xl font-bold text-foreground">42,345</p>
                <p className="text-green-500 text-sm font-medium flex items-center gap-1">
                  47% ↑ From last month
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Patients</p>
                <p className="text-xl font-bold text-foreground">2,345</p>
                <p className="text-red-400 text-sm font-medium flex items-center gap-1">
                  10% ↓ From last month
                </p>
              </div>
            </div>
            <div className="h-56 relative">
              <svg
                viewBox="0 0 400 120"
                className="w-full h-full"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="visitorsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0, 24, 48, 72, 96, 120].map((y) => (
                  <line
                    key={y}
                    x1={0}
                    y1={y}
                    x2={400}
                    y2={y}
                    className="stroke-border"
                    strokeWidth="0.5"
                  />
                ))}
                <polyline
                  fill="url(#visitorsGrad)"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={visitorsData
                    .map(
                      (d, i) =>
                        `${(i / (visitorsData.length - 1)) * 380 + 10},${110 - (d.visitors / 45000) * 100}`,
                    )
                    .join(" ")}
                />
                <polyline
                  fill="none"
                  stroke="#94A3B8"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                  strokeLinecap="round"
                  points={visitorsData
                    .map(
                      (d, i) =>
                        `${(i / (visitorsData.length - 1)) * 380 + 10},${110 - (d.patients / 2500) * 100}`,
                    )
                    .join(" ")}
                />
              </svg>
            </div>
            <div className="flex justify-end -mt-2">
              <button
                type="button"
                className="p-1 rounded hover:bg-muted text-muted-foreground"
                aria-label="Options"
              >
                <HiOutlineDotsVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-5">
            {/* Blood Cancer Patient */}
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center text-lg font-bold">
                  B
                </div>
                <button
                  type="button"
                  className="p-1 rounded hover:bg-muted text-muted-foreground"
                  aria-label="Options"
                >
                  <HiOutlineDotsVertical className="w-5 h-5" />
                </button>
              </div>
              <h3 className="font-bold text-foreground mb-1">
                Blood Cancer Patient
              </h3>
              <p className="text-2xl font-bold text-foreground mb-0.5">1,060</p>
              <p className="text-green-500 text-sm font-medium mb-2">10% ↑</p>
              <p className="text-muted-foreground text-sm mb-4">
                Patients has been admitted
              </p>
              <div className="flex items-end justify-around h-20 gap-1">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95].map((h, i) => (
                  <div key={i} className="flex flex-col items-center flex-1">
                    <div
                      className="w-2 rounded-full bg-red-400"
                      style={{ height: `${h}%` }}
                    />
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-0.5" />
                  </div>
                ))}
              </div>
            </div>

            {/* Kidney Damage Patient - dark card */}
            <div className="bg-primary/10 rounded-xl border border-primary/10 p-5 shadow-sm">
              <h3 className="font-bold text-primary mb-1">
                Kidney Damage Patient
              </h3>
              <p className="text-2xl font-bold text-primary mb-0.5">3,672</p>
              <p className="text-red-400 text-sm font-medium mb-2">10% ↓</p>
              <p className="text-primary text-sm mb-4">
                Patients has been admitted
              </p>
              <div className="flex items-end justify-around h-20 gap-1">
                {[50, 65, 45, 70, 55, 95, 60, 75, 55, 70].map((h, i) => (
                  <div key={i} className="flex-1 flex justify-center">
                    <div
                      className="w-2 rounded-sm"
                      style={{
                        height: `${h}%`,
                        background: i === 5 ? "#f97316" : "#475569",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Patient Appointment */}
        <div className="bg-card rounded-xl mb-6 border border-border shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-foreground">Doctors</h3>
                <p className="text-muted-foreground text-sm mt-0.5">
                  Keep track of doctor data and others information.
                </p>
              </div>
              <div>
                <Link href="/doctors">
                  <Button variant="secondary">
                    View All
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <div className="relative flex-1 min-w-[200px]">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search doctor..."
                  aria-label="Search doctor"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border text-foreground bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
              >
                <HiOutlineFilter className="w-5 h-5" />
                Filters
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                  <th className="py-3 px-4">ID Number</th>
                  <th className="py-3 px-4">Doctor Name</th>
                  <th className="py-3 px-4">Specialization</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Blog(s)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {doctorsData.map((doctor) => (
                  <tr
                    key={doctor.id}
                    className="border-b border-border hover:bg-muted/30"
                  >
                    <td className="py-3 px-4 font-medium text-foreground">
                      {doctor.id}
                    </td>
                    <td className="py-3 px-4 text-foreground">{doctor.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {doctor.specialization}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {doctor.title}
                    </td>
                    <td className="py-3 px-4 text-foreground">
                      {doctor.blogCount}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          doctor.status === "Completed"
                            ? "bg-green-500/20 text-green-400"
                            : doctor.status === "Pending"
                              ? "bg-amber-500/20 text-amber-400"
                              : doctor.status === "In Review"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {doctor.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        className="text-primary font-medium hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
