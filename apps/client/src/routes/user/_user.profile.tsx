// src/pages/user/_user/profile.tsx

import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertCircle,
  Upload,
  User,
  CalendarIcon,
  Turtle,
  Cat,
  Dog,
  Rabbit,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { PhoneInput } from "@/components/ui/phone-input";
import { MainNav } from "@/components/dashboard/patient/main-nav";
import { UserNav } from "@/components/dashboard/patient/user-nav";

import { fetchUserProfile, updateUserProfile } from "@/lib/api"; // Import API functions
import { toast } from "@/hooks/use-toast";
import specialization from "../../data/specialization.json"; // Import the specialization JSON
import { MultiSelect } from "@/components/ui/multi-seletc";
import { InputTags } from "@/components/ui/input-tags";

const frameworksList = [
  { value: "Malay", label: "Malay", icon: Turtle },
  { value: "English", label: "English", icon: Cat },
  { value: "Mandarin", label: "Mandarin", icon: Dog },
  { value: "Tamil", label: "Tamil", icon: Rabbit },
];
// Base schema with common fields
const baseSchema = {
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .optional()
    .or(z.literal("")),
  confirmPassword: z.string().optional().or(z.literal("")),
  contactDetails: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
};

// Patient-specific schema
const patientSchema = z
  .object({
    ...baseSchema,
    dob: z.date({
      required_error: "Date of birth is required.",
    }),
    gender: z.enum(["male", "female", "other"], {
      required_error: "Please select a gender.",
    }),
  })
  .refine(
    (data) => {
      if (data.password || data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }
  );

// Therapist-specific schema
const therapistSchema = z
  .object({
    ...baseSchema,
    specialization: z.string().min(1, "Specialization is required").optional(),
    qualification: z.array(z.string()).default([]), // Default to empty array
    experience: z.preprocess(
      (val) => Number(val),
      z.number().min(0).optional()
    ),
    language: z.array(z.string()).default([]), // Default to empty array
  })
  .refine(
    (data) => {
      if (data.password || data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }
  );
type PatientData = z.infer<typeof patientSchema>;
type TherapistData = z.infer<typeof therapistSchema>;
type FormData = PatientData | TherapistData;

export const Route = createFileRoute("/user/_user/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const [isTherapist, setIsTherapist] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const [fetchError, setFetchError] = useState<string | null>(null); // Fetch error state
  const [successMessage] = useState<string | null>(null); // Success message state

  const form = useForm<FormData>({
    resolver: zodResolver(isTherapist ? therapistSchema : patientSchema),
    defaultValues: isTherapist
      ? {
          name: "",
          password: "",
          confirmPassword: "",
          contactDetails: "",
          specialization: "",
          qualification: [],
          experience: 0,
          language: [],
        }
      : {
          name: "",
          password: "",
          confirmPassword: "",
          contactDetails: "",
          dob: undefined as Date | undefined,
          gender: undefined,
        },
  });

  // Fetch user profile data on component mount
  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setIsTherapist(!!data.User?.therapistID);

        if (data) {
          const commonFields = {
            name: data.name || "",
            contactDetails: data.contactDetails || "",
            password: "",
            confirmPassword: "",
          };

          if (data.User?.therapistID) {
            form.reset({
              ...commonFields,
              specialization: data.specialization || "",
              qualification: data.qualification || [],
              experience: data.experience || 0,
              language: data.language || [],
            } as TherapistData);
          } else {
            const dobDate = data.dob ? new Date(data.dob) : undefined;
            form.reset({
              ...commonFields,
              dob: dobDate,
              gender: data.gender || undefined,
            } as PatientData);
          }

          if (data.avatar) {
            const apiBaseUrl = "http://localhost:5431";
            const avatarUrl = `${apiBaseUrl}/${data.avatar}`;
            console.log("Avatar URL:", avatarUrl);

            setAvatar(avatarUrl);
          }
        }
      } catch (err: any) {
        console.error("Error fetching user profile:", err);
        setFetchError(err.message || "Failed to fetch user profile");
      } finally {
        setIsLoading(false);
      }
    };

    getUserProfile();
  }, [form]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (formData: FormData) => {
    try {
      const fileInput = document.getElementById(
        "avatar-upload"
      ) as HTMLInputElement;
      const avatarFile = fileInput?.files?.[0];

      // Prepare the data for update based on user type
      const updateData = {
        name: formData.name,
        contactDetails: formData.contactDetails,
        password: formData.password || undefined,
        avatarFile: avatarFile,
        ...(isTherapist
          ? {
              specialization: (formData as TherapistData).specialization,
              qualification: Array.isArray(
                (formData as TherapistData).qualification
              )
                ? (formData as TherapistData).qualification
                : [(formData as TherapistData).qualification].filter(Boolean),
              experience: (formData as TherapistData).experience,
              language: Array.isArray((formData as TherapistData).language)
                ? (formData as TherapistData).language
                : [(formData as TherapistData).language].filter(Boolean),
            }
          : {
              dob: (formData as PatientData).dob,
              gender: (formData as PatientData).gender,
            }),
      };

      const cleanedData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== undefined)
      );
      console.log("cleaner  data", cleanedData);
      const updatedProfile = await updateUserProfile(cleanedData);

      if (updatedProfile) {
        const updatedFormData = {
          name: updatedProfile.name,
          contactDetails: updatedProfile.contactDetails,
          password: "",
          confirmPassword: "",
          ...(isTherapist
            ? {
                specialization: updatedProfile.specialization,
                qualification: updatedProfile.qualification,
                experience: updatedProfile.experience,
                language: updatedProfile.language,
              }
            : {
                dob: updatedProfile.dob
                  ? new Date(updatedProfile.dob)
                  : undefined,
                gender: updatedProfile.gender || undefined,
              }),
        };

        form.reset(updatedFormData);

        if (updatedProfile.avatarUrl) {
          setAvatar(updatedProfile.avatarUrl);
        }

        toast({
          variant: "default",
          title: "Success",
          description: "Profile updated successfully",
        });
      }
    } catch (err: any) {
      console.error("Error updating profile:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to update profile",
      });
    }
  };
  // Conditional Rendering Based on Loading and Error States
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <MainNav />
          <UserNav />
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>
              Update your {isTherapist ? "therapist" : "personal"} information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Common Fields */}
                {/* Avatar Upload Section */}
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={avatar || ""}
                      alt="Profile picture"
                      onError={(e) => {
                        const imgElement = e.target as HTMLImageElement;
                        imgElement.style.display = "none";
                      }}
                    />
                    <AvatarFallback>
                      <User className="h-12 w-12" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <Label
                      htmlFor="avatar-upload"
                      className="flex cursor-pointer items-center justify-center w-full border rounded-md px-4 py-2 hover:bg-muted transition"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      <span>Upload new avatar</span>
                    </Label>
                  </div>
                </div>

                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your name"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Contact Details */}
                <FormField
                  control={form.control}
                  name="contactDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <PhoneInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Conditional Fields based on user type */}
                {isTherapist ? (
                  // Therapist-specific fields
                  <>
                    <FormField
                      control={form.control}
                      name="specialization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specialization</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a specialization" />
                              </SelectTrigger>
                              <SelectContent>
                                {specialization.specializations.map((name) => (
                                  <SelectItem key={name} value={name}>
                                    {name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years of Experience</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="qualification"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Qualification</FormLabel>
                          <FormControl>
                            <InputTags
                              {...field}
                              placeholder="Enter qualifications "
                              onChange={field.onChange}
                              value={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Language</FormLabel>
                          <FormControl>
                            <MultiSelect
                              options={frameworksList}
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              placeholder="Select Languages.."
                              variant="inverted"
                              animation={2}
                              maxCount={3}
                            />
                            {/* <Input
                              {...field}
                              placeholder="Enter languages separated by commas"
                              onChange={(e) => {
                                const languages = e.target.value
                                  .split(",")
                                  .map((l) => l.trim());
                                field.onChange(languages);
                              }}
                              value={
                                Array.isArray(field.value)
                                  ? field.value.join(", ")
                                  : ""
                              }
                            /> */}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                ) : (
                  // Patient-specific fields
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date of Birth */}
                    <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem className="">
                          <FormLabel>Date of birth</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Gender */}
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select your gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password (optional)</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Save Changes
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
