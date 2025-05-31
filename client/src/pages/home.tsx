import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import SearchBar from "@/components/search-bar";
import FilterSidebar from "@/components/filter-sidebar";
import HackathonList from "@/components/hackathon-list";
import { type Hackathon } from "@shared/schema";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    format: [] as string[],
    location: "",
    experienceLevel: [] as string[],
    timeFrame: "All", // Changed from "This Month" to "All" to show all hackathons by default
    hasPrize: false,
  });
  const [sortBy, setSortBy] = useState("date-asc");

  // Fetch hackathons from the API
  const { data: hackathons = [], isLoading } = useQuery<Hackathon[]>({
    queryKey: ["/api/hackathons"],
  });

  // Search function to filter hackathons by name, organizer, or location
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Filter function to apply selected filters
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  // Sort function to change the sort order
  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      format: [],
      location: "",
      experienceLevel: [],
      timeFrame: "All",
      hasPrize: false,
    });
  };

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:flex gap-8">
          <FilterSidebar 
            filters={filters} 
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
          />

          <HackathonList 
            hackathons={hackathons} 
            isLoading={isLoading}
            searchQuery={searchQuery}
            filters={filters}
            sortBy={sortBy}
            onSortChange={handleSortChange}
          />
        </div>
      </main>
    </>
  );
}
