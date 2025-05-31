import { type Hackathon } from "@shared/schema";
import { Calendar, MapPin, Home, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateRange } from "@/lib/utils/format-date";

interface HackathonCardProps {
  hackathon: Hackathon;
  onViewDetails: (id: number) => void;
}

export default function HackathonCard({ hackathon, onViewDetails }: HackathonCardProps) {
  // Function to determine status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-green-100 text-green-800";
      case "Closing Soon":
        return "bg-yellow-100 text-yellow-800";
      case "Closed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get icon based on format type
  const getFormatIcon = (format: string) => {
    switch (format) {
      case "In-person":
        return <Home className="h-4 w-4 text-muted-foreground mr-2" />;
      case "Virtual":
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>;
      case "Hybrid":
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>;
      default:
        return <Home className="h-4 w-4 text-muted-foreground mr-2" />;
    }
  };

  // Default image in case none is provided
  const defaultImage = "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&h=50&q=80";

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden flex items-center justify-center">
              {hackathon.imageUrl ? (
                <img 
                  src={hackathon.imageUrl} 
                  alt={hackathon.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              )}
            </div>
            <div className="ml-2">
              <h3 className="font-semibold text-base">{hackathon.name}</h3>
              <p className="text-muted-foreground text-sm">{hackathon.organizerName}</p>
            </div>
          </div>
          <Badge className={getStatusBadgeClass(hackathon.status)}>
            {hackathon.status}
          </Badge>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
            <span>{formatDateRange(hackathon.startDate, hackathon.endDate)}</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
            <span>{hackathon.location}</span>
          </div>
          <div className="flex items-center text-sm">
            {getFormatIcon(hackathon.format)}
            <span>{hackathon.format}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {hackathon.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-gray-100 text-muted-foreground text-xs px-2 py-1 rounded">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm">
            {hackathon.prizePool ? (
              <>
                <span className="font-medium text-foreground">
                  ${hackathon.prizePool.toLocaleString()}
                </span>
                <span className="text-muted-foreground"> prize pool</span>
              </>
            ) : (
              <span className="text-muted-foreground">No prize info</span>
            )}
          </div>
          <Button 
            variant="link" 
            className="text-primary hover:text-primary/80 text-sm font-medium"
            onClick={() => onViewDetails(hackathon.id)}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}
