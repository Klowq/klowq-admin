'use client';

import { useState } from "react";
import { GoSearch } from "react-icons/go";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Badge } from "@/components/organisms/Badge";
import InsightChip from "@/components/InsightChip";

const ITEMS_PER_PAGE = 9;
const TOTAL_ITEMS = 15;
const TOTAL_PAGES = Math.ceil(TOTAL_ITEMS / ITEMS_PER_PAGE);

export default function BlogsPage() {
  const [search, setSearch] = useState("");
  const [sortFilter, setSortFilter] = useState("latest");
  const [durationFilter, setDurationFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSortFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortFilter(e.target.value);
  };

  const handleDurationFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDurationFilter(e.target.value);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto mb-8 mt-4 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <GoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" aria-hidden />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search insights..."
              aria-label="Search insights"
              className="w-full pl-10 pr-4 py-3 border border-border bg-background rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/40 focus:outline-none text-foreground"
            />
          </div>
          <div className="flex gap-4">
            <label htmlFor="filter-sort" className="sr-only">
              Sort insights
            </label>
            <select
              id="filter-sort"
              value={sortFilter}
              onChange={handleSortFilter}
              className="w-full px-4 py-3 border border-border rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/40 text-foreground bg-background"
              title="Sort insights"
              aria-label="Sort insights"
            >
              <option value="latest">Latest</option>
              <option value="popular">Popular</option>
              <option value="featured">Featured</option>
            </select>
            <label htmlFor="duration-filter" className="sr-only">
              Filter by duration
            </label>
            <select
              id="duration-filter"
              value={durationFilter}
              onChange={handleDurationFilter}
              className="w-full px-4 py-3 border border-border rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/40 text-foreground bg-background"
              title="Filter by duration"
              aria-label="Filter by duration"
            >
              <option value="all">All</option>
              <option value="3">3 mins</option>
              <option value="5">5 mins</option>
              <option value="7">7 mins</option>
              <option value="10">10 mins</option>
              <option value="15">15 mins</option>
              <option value="20">20 mins</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 mb-16">
          {Array.from({ length: 15 }).map((_, index) => (
            <InsightChip key={index} />
          ))}
        </div>

        <div className="flex justify-center items-center gap-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p: number) => p - 1)}
            className="px-4 py-2 rounded-xl border border-border text-muted-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition"
          >
            Previous
          </button>
          {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-xl border transition ${
                currentPage === i + 1
                  ? "bg-primary text-white border-primary"
                  : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            type="button"
            disabled={currentPage === TOTAL_PAGES}
            onClick={() => setCurrentPage((p: number) => p + 1)}
            className="px-4 py-2 rounded-xl border border-border text-muted-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition"
          >
            Next
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
