import { useEffect, useState } from "react";
import { fetchAllTherapistPublic } from "../lib/api";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GraduationCap, Briefcase, MapPin, Globe, User } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

type Therapist = {
  avatar: string | null;
  therapistID: number;
  name: string;
  specialization: string;
  qualification: string[];
  experience: number | null;
  businessName: string;
  location: string;
  image?: string;
  language?: string[];
};

export const TherapistList = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getTherapists() {
      try {
        const data = await fetchAllTherapistPublic();
        console.log("data therapistPublic", data);

        console.log("data avatar", data.data.avatar);
        const apiBaseUrl = "http://localhost:5431";
        // Map the data to include full avatar URLs
        const therapistsWithAvatar = data.data.map((therapist: Therapist) => ({
          ...therapist,
          avatar: therapist.avatar
            ? `${apiBaseUrl}/${therapist.avatar.replace(/\\/g, "/")}` // Replace backslashes with forward slashes
            : null, // Keep null if no avatar
        }));

        setTherapists(therapistsWithAvatar);
        console.log("Processed Therapists:", therapistsWithAvatar);
      } catch (err) {
        setError("Failed to fetch therapists.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    getTherapists();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {therapists.map((therapist) => (
        <Card key={therapist.therapistID} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={
                      therapist.avatar ||
                      "https://static.vecteezy.com/system/resources/previews/009/749/645/non_2x/teacher-avatar-man-icon-cartoon-male-profile-mascot-illustration-head-face-business-user-logo-free-vector.jpg"
                    }
                    alt={therapist.name}
                    onError={(e) => {
                      const imgElement = e.target as HTMLImageElement;
                      imgElement.style.display = "none";
                    }}
                  />
                  <AvatarFallback>{therapist.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{therapist.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {therapist.specialization}
                  </p>
                </div>
              </div>
              <Badge variant="secondary">{therapist.businessName}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>
                  {therapist.experience
                    ? `${therapist.experience} years`
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{therapist.location || "N/A"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span>
                  {therapist.qualification.length > 0
                    ? therapist.qualification.join(", ")
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>
                  {therapist.language?.length
                    ? therapist.language.join(", ")
                    : "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end items-center pt-2">
            {/* <Dialog>
              <DialogTrigger asChild>
                <Button variant="link" className="p-0">
                  <User className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{therapist.name}</DialogTitle>
                  <DialogDescription>
                    Fill out the form below to add a new therapist.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog> */}

            <Link
              to="/findDoctor/$therapistID"
              params={{ therapistID: therapist.therapistID.toString() }}
            >
              <Button>Book Appointment</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
