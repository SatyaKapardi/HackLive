import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { insertHackathonSchema } from "@shared/schema";

// Create extended schema with proper validation
const hackathonFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  organizerName: z.string().min(1, "Organizer name is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  location: z.string().min(1, "Location is required"),
  format: z.string().min(1, "Format is required"),
  description: z.string().min(1, "Description is required"),
  tags: z.string().min(1, "At least one tag is required"),
  experienceLevel: z.string().min(1, "Experience level is required"),
  status: z.string().min(1, "Status is required"),
  prizePool: z.string().optional(),
  registrationDeadline: z.string().optional(),
  imageUrl: z.string().optional(),
  websiteUrl: z.string().optional(),
});

type HackathonFormValues = z.infer<typeof hackathonFormSchema>;

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Check if user is authenticated
  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const authHeader = `Basic ${btoa('nameismike2002@gmail.com:Krushna@2002')}`;
        const response = await fetch("/api/auth/status", {
          headers: {
            Authorization: authHeader
          }
        });
        
        if (response.ok) {
          setAuthenticated(true);
        } else {
          toast({
            title: "Authentication required",
            description: "Please log in to access the admin dashboard",
            variant: "destructive",
          });
          setLocation("/admin-login");
        }
      } catch (error) {
        toast({
          title: "Authentication error",
          description: "An error occurred while checking authentication. Please try again.",
          variant: "destructive",
        });
        setLocation("/admin-login");
      } finally {
        setAuthLoading(false);
      }
    }
    
    checkAuthStatus();
  }, [toast, setLocation]);

  // Initialize form
  const form = useForm<HackathonFormValues>({
    resolver: zodResolver(hackathonFormSchema),
    defaultValues: {
      name: "",
      organizerName: "",
      startDate: "",
      endDate: "",
      location: "",
      format: "In-person",
      description: "",
      tags: "",
      experienceLevel: "All Levels",
      status: "Open",
      prizePool: "",
      registrationDeadline: "",
      imageUrl: "",
      websiteUrl: "",
    },
  });

  // Available options for form selects
  const formats = ["In-person", "Virtual", "Hybrid"];
  const experienceLevels = ["Beginner", "Intermediate", "Advanced", "All Levels"];
  const statuses = ["Open", "Closing Soon", "Closed"];
  
  // Location options grouped by country
  const locations = [
    "Remote, Virtual",
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
  ];

  // Handle form submission
  const onSubmit = async (values: HackathonFormValues) => {
    setIsLoading(true);
    try {
      // Use authentication header
      const authHeader = `Basic ${btoa('nameismike2002@gmail.com:Krushna@2002')}`;
      
      // Pre-process form data
      const formData = {
        ...values,
        // Convert tags from comma-separated string to array
        tags: values.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        // Convert prizePool to number if provided
        prizePool: values.prizePool ? parseInt(values.prizePool) : null,
      };
      
      const response = await fetch("/api/hackathons", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
          "Authorization": authHeader
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create hackathon");
      }
      
      // Invalidate hackathons query cache to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/hackathons"] });

      toast({
        title: "Success!",
        description: "Hackathon has been created successfully.",
      });

      // Reset the form
      form.reset();
    } catch (error: any) {
      console.error("Error creating hackathon:", error);
      toast({
        title: "Failed to create hackathon",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>;
  }

  // Only show content if authenticated
  if (!authenticated) {
    return null; // Redirect handled in useEffect
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button 
          variant="outline" 
          onClick={() => setLocation("/")}
        >
          Back to Home
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Add New Hackathon</CardTitle>
          <CardDescription>
            Fill in the details to create a new hackathon listing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hackathon Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Hackathon Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="organizerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organizer Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Organizer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date*</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date*</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="registrationDeadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration Deadline</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prizePool"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prize Pool</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="format"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Format*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {formats.map((format) => (
                            <SelectItem key={format} value={format}>
                              {format}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experienceLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience Level*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select experience level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {experienceLevels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags*</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="AI, Web3, Beginner Friendly" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Separate tags with commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/image.jpg" 
                          {...field} 
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="websiteUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com" 
                          {...field} 
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description*</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide a detailed description of the hackathon" 
                        rows={5}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Hackathon"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}