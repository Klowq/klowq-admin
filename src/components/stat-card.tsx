 "use client";

 import type { ReactNode } from "react";
 import {
  HiOutlineDotsVertical,
  HiOutlineTrendingUp,
  HiOutlineTrendingDown,
 } from "react-icons/hi";

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

 export interface StatCardProps {
  title: string;
  value: string;
  change: number;
  trend: "up" | "down";
  label: string;
  iconBg: string;
  iconColor: string;
  sparkline: number[];
  chartType?: "bar" | "line";
  icon: ReactNode;
 }

 export function StatCard({
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
 }: StatCardProps) {
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

