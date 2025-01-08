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
type TherapistProps = {
  therapists: Therapist[];
};
export const TherapistList: React.FC<TherapistProps> = ({ therapists }) => {
  if (!therapists || therapists.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        No therapists found. Try adjusting your search criteria.
      </div>
    );
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
                  <h3 className="text-lg font-semibold">
                    {" "}
                    Physiotherapist {therapist.name}
                  </h3>
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
