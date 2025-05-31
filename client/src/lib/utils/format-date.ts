export function formatDateRange(startDate: string | Date, endDate: string | Date): string {
  // Handle date parsing more robustly
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Check if dates are valid
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'Date TBD';
  }
  
  // Format the dates
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
  const startFormatted = start.toLocaleDateString('en-US', options);
  
  // If start and end are in the same month and year
  if (
    start.getMonth() === end.getMonth() && 
    start.getFullYear() === end.getFullYear()
  ) {
    return `${start.toLocaleDateString('en-US', { month: 'short' })} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`;
  }
  
  // If start and end are in the same year but different months
  if (start.getFullYear() === end.getFullYear()) {
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${start.getFullYear()}`;
  }
  
  // Different years
  return `${startFormatted} - ${end.toLocaleDateString('en-US', options)}`;
}
