import { useState, useMemo } from "react";
import { type Hackathon } from "@shared/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import HackathonCard from "./hackathon-card";
import { Pagination } from "./ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

interface HackathonListProps {
  hackathons: Hackathon[];
  isLoading: boolean;
  searchQuery: string;
  filters: {
    format: string[];
    location: string;
    experienceLevel: string[];
    timeFrame: string;
    hasPrize: boolean;
  };
  sortBy: string;
  onSortChange: (value: string) => void;
}

export default function HackathonList({
  hackathons,
  isLoading,
  searchQuery,
  filters,
  sortBy,
  onSortChange,
}: HackathonListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // View details handler (would be expanded in a real implementation)
  const handleViewDetails = (id: number) => {
    console.log(`View details for hackathon ID: ${id}`);
    // In a full implementation, this could navigate to a details page
    // or open a modal with more information
  };

  // Apply filters and search to the hackathons list
  const filteredHackathons = useMemo(() => {
    if (!hackathons.length) return [];

    return hackathons.filter(hackathon => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
          hackathon.name.toLowerCase().includes(searchLower) || 
          hackathon.organizerName.toLowerCase().includes(searchLower) ||
          hackathon.location.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }
      
      // Format filter
      if (filters.format.length > 0 && !filters.format.includes(hackathon.format)) {
        return false;
      }
      
      // Location filter
      if (filters.location && filters.location !== "All Locations" && hackathon.location !== filters.location) {
        return false;
      }
      
      // Experience level filter
      if (filters.experienceLevel.length > 0 && !filters.experienceLevel.includes(hackathon.experienceLevel)) {
        return false;
      }
      
      // Time frame filter
      if (filters.timeFrame !== "All") {
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        
        const nextMonth = new Date();
        nextMonth.setMonth(today.getMonth() + 1);
        
        const startDate = new Date(hackathon.startDate);
        
        if (filters.timeFrame === "This Week" && (startDate < today || startDate > nextWeek)) {
          return false;
        }
        
        if (filters.timeFrame === "This Month" && 
            (startDate.getMonth() !== today.getMonth() || 
             startDate.getFullYear() !== today.getFullYear())) {
          return false;
        }
        
        if (filters.timeFrame === "Next Month" && 
            (startDate.getMonth() !== nextMonth.getMonth() || 
             startDate.getFullYear() !== nextMonth.getFullYear())) {
          return false;
        }
      }
      
      // Has prize filter
      if (filters.hasPrize && !hackathon.prizePool) {
        return false;
      }
      
      return true;
    });
  }, [hackathons, searchQuery, filters]);

  // Sort the filtered hackathons
  const sortedHackathons = useMemo(() => {
    return [...filteredHackathons].sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case "date-desc":
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        case "prize-desc":
          const prizeA = a.prizePool || 0;
          const prizeB = b.prizePool || 0;
          return prizeB - prizeA;
        case "registration-closing":
          const deadlineA = a.registrationDeadline ? new Date(a.registrationDeadline).getTime() : Number.MAX_SAFE_INTEGER;
          const deadlineB = b.registrationDeadline ? new Date(b.registrationDeadline).getTime() : Number.MAX_SAFE_INTEGER;
          return deadlineA - deadlineB;
        case "location":
          // Sort by location (country first, then city)
          const locationA = a.location || "";
          const locationB = b.location || "";
          
          // For virtual events, always put them at the end
          if (locationA.includes("Virtual") && !locationB.includes("Virtual")) return 1;
          if (!locationA.includes("Virtual") && locationB.includes("Virtual")) return -1;
          
          // Otherwise sort alphabetically by location
          return locationA.localeCompare(locationB);
        default:
          return 0;
      }
    });
  }, [filteredHackathons, sortBy]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedHackathons.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedHackathons = sortedHackathons.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of list
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex-1">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Upcoming Hackathons</h1>
          <p className="text-muted-foreground">
            Showing {filteredHackathons.length} hackathons
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="border-gray-300 rounded text-sm w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-asc">Soonest First</SelectItem>
              <SelectItem value="date-desc">Latest First</SelectItem>
              <SelectItem value="prize-desc">Prize Pool (High to Low)</SelectItem>
              <SelectItem value="location">Location</SelectItem>
              <SelectItem value="registration-closing">Registration Closing Soon</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Hackathon Cards Grid */}
      {isLoading ? (
        // Loading state with skeletons
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <Skeleton className="w-10 h-10 rounded-md" />
                  <div className="ml-2">
                    <Skeleton className="h-5 w-40 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="space-y-2 mb-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-6 w-16 rounded" />
                <Skeleton className="h-6 w-16 rounded" />
                <Skeleton className="h-6 w-24 rounded" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : paginatedHackathons.length > 0 ? (
        // Hackathon cards
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginatedHackathons.map((hackathon) => (
            <HackathonCard 
              key={hackathon.id} 
              hackathon={hackathon} 
              onViewDetails={handleViewDetails} 
            />
          ))}
        </div>
      ) : (
        // No results state
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Hackathons Found</h3>
          <p className="text-muted-foreground mb-4">
            No hackathons match your current filters. Try adjusting your filters or search query.
          </p>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
