import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface FilterSidebarProps {
  filters: {
    format: string[];
    location: string;
    experienceLevel: string[];
    timeFrame: string;
    hasPrize: boolean;
  };
  onFilterChange: (filters: FilterSidebarProps["filters"]) => void;
  onClearFilters: () => void;
}

export default function FilterSidebar({ 
  filters, 
  onFilterChange,
  onClearFilters 
}: FilterSidebarProps) {
  // Available options for filters
  const formats = ["In-person", "Virtual", "Hybrid"];
  const locations = [
    "All Locations", 
    "Australia, Sydney",
    "France, Paris",
    "Germany, Berlin",
    "Japan, Tokyo",
    "Singapore, Singapore",
    "USA, Boston", 
    "USA, Chicago",
    "USA, Los Angeles",
    "USA, New York",
    "USA, San Francisco", 
    "USA, Seattle", 
    "USA, Washington DC",
    "Remote, Virtual"
  ];
  const experienceLevels = ["Beginner", "Intermediate", "Advanced", "All Levels"];
  const timeFrames = ["All", "This Week", "This Month", "Next Month"];

  // Handle checkbox filter changes
  const handleFormatChange = (format: string, checked: boolean) => {
    let newFormats = [...filters.format];
    
    if (checked) {
      newFormats.push(format);
    } else {
      newFormats = newFormats.filter(f => f !== format);
    }
    
    onFilterChange({
      ...filters,
      format: newFormats
    });
  };

  // Handle experience level filter changes
  const handleExperienceLevelChange = (level: string, checked: boolean) => {
    let newLevels = [...filters.experienceLevel];
    
    if (checked) {
      newLevels.push(level);
    } else {
      newLevels = newLevels.filter(l => l !== level);
    }
    
    onFilterChange({
      ...filters,
      experienceLevel: newLevels
    });
  };

  // Handle location change
  const handleLocationChange = (value: string) => {
    onFilterChange({
      ...filters,
      location: value
    });
  };

  // Handle time frame change
  const handleTimeFrameChange = (value: string) => {
    onFilterChange({
      ...filters,
      timeFrame: value
    });
  };

  // Handle prize filter change
  const handlePrizeChange = (checked: boolean) => {
    onFilterChange({
      ...filters,
      hasPrize: checked
    });
  };

  return (
    <div className="lg:w-64 mb-6 lg:mb-0">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Filters</h2>
          <Button 
            variant="link" 
            className="text-primary text-sm font-medium hover:text-primary/80"
            onClick={onClearFilters}
          >
            Clear All
          </Button>
        </div>
        
        {/* Format Filter */}
        <div className="mb-6">
          <h3 className="font-medium text-sm text-muted-foreground uppercase mb-2">Format</h3>
          <div className="space-y-2">
            {formats.map(format => (
              <div key={format} className="flex items-center space-x-2">
                <Checkbox 
                  id={`format-${format}`} 
                  checked={filters.format.includes(format)}
                  onCheckedChange={(checked) => handleFormatChange(format, checked as boolean)}
                />
                <Label htmlFor={`format-${format}`} className="text-sm cursor-pointer">
                  {format}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Location Filter */}
        <div className="mb-6">
          <h3 className="font-medium text-sm text-muted-foreground uppercase mb-2">Location</h3>
          <Select 
            value={filters.location} 
            onValueChange={handleLocationChange}
          >
            <SelectTrigger className="w-full text-sm">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              {locations.map(location => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Experience Level Filter */}
        <div className="mb-6">
          <h3 className="font-medium text-sm text-muted-foreground uppercase mb-2">Experience Level</h3>
          <div className="space-y-2">
            {experienceLevels.map(level => (
              <div key={level} className="flex items-center space-x-2">
                <Checkbox 
                  id={`experience-${level}`} 
                  checked={filters.experienceLevel.includes(level)}
                  onCheckedChange={(checked) => handleExperienceLevelChange(level, checked as boolean)}
                />
                <Label htmlFor={`experience-${level}`} className="text-sm cursor-pointer">
                  {level}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Time Frame Filter */}
        <div className="mb-6">
          <h3 className="font-medium text-sm text-muted-foreground uppercase mb-2">Date</h3>
          <RadioGroup 
            value={filters.timeFrame}
            onValueChange={handleTimeFrameChange}
            className="space-y-2"
          >
            {timeFrames.map(timeFrame => (
              <div key={timeFrame} className="flex items-center space-x-2">
                <RadioGroupItem id={`timeFrame-${timeFrame}`} value={timeFrame} />
                <Label htmlFor={`timeFrame-${timeFrame}`} className="text-sm cursor-pointer">
                  {timeFrame}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        {/* Has Prize Filter */}
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="has-prize" 
              checked={filters.hasPrize}
              onCheckedChange={(checked) => handlePrizeChange(checked as boolean)}
            />
            <Label htmlFor="has-prize" className="text-sm font-medium cursor-pointer">
              Has Prize Pool
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
