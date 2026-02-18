"use client";

import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  HiOutlineChat,
  HiOutlineBell,
  HiOutlineDotsVertical,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineTrendingUp,
  HiOutlineTrendingDown,
  HiOutlineUser,
  HiOutlineDocumentText,
} from "react-icons/hi";
import { FaUserDoctor } from "react-icons/fa6";

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

const recentAppointments = [
  {
    id: 1,
    serial: "001",
    date: "15 Jul 2025",
    patientName: "John Doe",
    doctor: "Dr. Sarah Smith",
    room: "Room 101",
    status: "Completed",
  },
  {
    id: 2,
    serial: "002",
    date: "16 Jul 2025",
    patientName: "Jane Smith",
    doctor: "Dr. Mike Johnson",
    room: "Room 102",
    status: "Pending",
  },
  {
    id: 3,
    serial: "003",
    date: "17 Jul 2025",
    patientName: "Robert Brown",
    doctor: "Dr. Sarah Smith",
    room: "Room 103",
    status: "In Progress",
  },
  {
    id: 4,
    serial: "004",
    date: "18 Jul 2025",
    patientName: "Emily Davis",
    doctor: "Dr. Lisa Wilson",
    room: "Room 101",
    status: "Scheduled",
  },
  {
    id: 5,
    serial: "005",
    date: "19 Jul 2025",
    patientName: "James Wilson",
    doctor: "Dr. Mike Johnson",
    room: "Room 104",
    status: "Pending",
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
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div
          className={`w-10 h-10 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center text-lg font-bold`}
        >
          {icon}
        </div>
        <button
          type="button"
          className="p-1 rounded hover:bg-gray-100 text-gray-400"
          aria-label="Options"
        >
          <HiOutlineDotsVertical className="w-5 h-5" />
        </button>
      </div>
      <p className="text-gray-500 text-sm font-medium mb-0.5">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`text-sm font-medium flex items-center gap-0.5 ${trend === "up" ? "text-green-600" : "text-red-600"}`}
        >
          {trend === "up" ? (
            <HiOutlineTrendingUp className="w-4 h-4" />
          ) : (
            <HiOutlineTrendingDown className="w-4 h-4" />
          )}
          {change}%
        </span>
        <span className="text-gray-400 text-sm">{label}</span>
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
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome back, {userName}
            </h2>
            <p className="text-gray-500 mt-0.5">
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
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-lg font-bold">
                  V
                </div>
                <h3 className="font-bold text-gray-900">Visitors Statistics</h3>
              </div>
              <select
                aria-label="Select time range"
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-[#3C3C6F]/20 focus:border-[#3C3C6F]"
              >
                <option>Last 30 days</option>
                <option>Last 7 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-6 mb-5">
              <div>
                <p className="text-gray-500 text-sm">Total Visitors</p>
                <p className="text-xl font-bold text-gray-900">42,345</p>
                <p className="text-green-600 text-sm font-medium flex items-center gap-1">
                  47% ↑ From last month
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Patients</p>
                <p className="text-xl font-bold text-gray-900">2,345</p>
                <p className="text-red-600 text-sm font-medium flex items-center gap-1">
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
                    stroke="#f0f0f0"
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
                className="p-1 rounded hover:bg-gray-100 text-gray-400"
                aria-label="Options"
              >
                <HiOutlineDotsVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-5">
            {/* Blood Cancer Patient */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center text-lg font-bold">
                  B
                </div>
                <button
                  type="button"
                  className="p-1 rounded hover:bg-gray-100 text-gray-400"
                  aria-label="Options"
                >
                  <HiOutlineDotsVertical className="w-5 h-5" />
                </button>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">
                Blood Cancer Patient
              </h3>
              <p className="text-2xl font-bold text-gray-900 mb-0.5">1,060</p>
              <p className="text-green-600 text-sm font-medium mb-2">10% ↑</p>
              <p className="text-gray-500 text-sm mb-4">
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
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">
              Recent Patient Appointment
            </h3>
            <p className="text-gray-500 text-sm mt-0.5">
              Keep track of patient data and others information.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <div className="relative flex-1 min-w-[200px]">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search patient..."
                  aria-label="Search patient"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3C3C6F]/20 focus:border-[#3C3C6F]"
                />
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <HiOutlineFilter className="w-5 h-5" />
                Filters
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                  <th className="py-3 px-4">Serial Number ↓</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Assign To Doctor</th>
                  <th className="py-3 px-4">Room</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-100 hover:bg-gray-50/50"
                  >
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {row.serial}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{row.date}</td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {row.patientName}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{row.doctor}</td>
                    <td className="py-3 px-4 text-gray-600">{row.room}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          row.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : row.status === "Pending"
                              ? "bg-amber-100 text-amber-700"
                              : row.status === "In Progress"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        className="text-[#3C3C6F] font-medium hover:underline"
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
