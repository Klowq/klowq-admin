"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard-layout";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/organisms/Button";
import {
  HiOutlineUser,
  HiOutlineDocumentText,
  HiOutlineSearch,
  HiOutlineFilter,
} from "react-icons/hi";
import { FaUserDoctor } from "react-icons/fa6";
import type { Doctor } from "@/types/doctor";

const summaryCards = [
  {
    title: "Total Doctors",
    value: "226",
    change: 12,
    trend: "up" as const,
    label: "From last month",
    iconBg: "bg-sky-500/10",
    iconColor: "text-sky-400",
    sparkline: [40, 55, 48, 60, 72, 68, 80, 90],
  },
  {
    title: "Pending Approvals",
    value: "18",
    change: 5,
    trend: "down" as const,
    label: "Awaiting review",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    sparkline: [30, 28, 26, 24, 22, 20, 18, 18],
  },
  {
    title: "Specialties Covered",
    value: "24",
    change: 3,
    trend: "up" as const,
    label: "Across all doctors",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    sparkline: [10, 12, 14, 16, 18, 20, 22, 24],
  },
];

const PAGE_SIZE = 10;

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/doctors");
        if (!res.ok) {
          throw new Error("Failed to fetch doctors");
        }
        const data: Doctor[] = await res.json();
        setDoctors(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return doctors;
    return doctors.filter((doctor) => {
      return (
        doctor.id.toLowerCase().includes(q) ||
        doctor.name.toLowerCase().includes(q) ||
        doctor.specialization.toLowerCase().includes(q) ||
        doctor.title.toLowerCase().includes(q)
      );
    });
  }, [doctors, search]);

  const totalPages = Math.max(1, Math.ceil(filteredDoctors.length / PAGE_SIZE));

  const paginatedDoctors = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredDoctors.slice(start, start + PAGE_SIZE);
  }, [filteredDoctors, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
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

        <div className="bg-card rounded-xl mb-6 border border-border shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-foreground">Doctors</h3>
                <p className="text-muted-foreground text-sm mt-0.5">
                  Keep track of doctor data and others information.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <div className="relative flex-1 min-w-[200px]">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search doctor..."
                  aria-label="Search doctor"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
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
                {loading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-6 px-4 text-center text-muted-foreground"
                    >
                      Loading doctors...
                    </td>
                  </tr>
                )}
                {!loading && error && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-6 px-4 text-center text-destructive"
                    >
                      {error}
                    </td>
                  </tr>
                )}
                {!loading && !error && paginatedDoctors.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-6 px-4 text-center text-muted-foreground"
                    >
                      No doctors found.
                    </td>
                  </tr>
                )}
                {!loading && !error && paginatedDoctors.map((doctor) => (
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
                          doctor.status === "Verified"
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
          {!loading && !error && filteredDoctors.length > 0 && (
            <div className="flex items-center justify-between gap-4 px-4 py-3 border-t border-border bg-muted/30">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, filteredDoctors.length)} of{" "}
                {filteredDoctors.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) => Math.max(1, p - 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-muted-foreground px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
