import { createFileRoute } from "@tanstack/react-router";
import { TherapistList } from "@/components/therapistList";
import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Search,
  Filter,
  X,
  HelpCircle,
  BookOpen,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import specialization from "../../data/specialization.json";
import { useEffect, useState } from "react";
import { fetchAllTherapistPublic } from "@/lib/api";

export const Route = createFileRoute("/findDoctor/")({
  component: RouteComponent,
});

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

function RouteComponent() {
  const [searchParams, setSearchParams] = useState({
    location: "",
    query: "",
    specialization: "",
  });
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = () => {
    console.log("Search initiated with params:", searchParams);
  };

  useEffect(() => {
    async function getTherapists() {
      try {
        const data = await fetchAllTherapistPublic();
        const apiBaseUrl = "http://192.168.0.139:5431";
        const therapistsWithAvatar = data.data.map((therapist: Therapist) => ({
          ...therapist,
          avatar: therapist.avatar
            ? `${apiBaseUrl}/${therapist.avatar.replace(/\\/g, "/")}`
            : null,
        }));
        setTherapists(therapistsWithAvatar);
      } catch (err) {
        setError("Failed to fetch therapists.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    getTherapists();
  }, []);

  const filteredTherapists = therapists.filter((therapist) => {
    const matchesLocation =
      searchParams.location === "" ||
      therapist.location
        ?.toLowerCase()
        .includes(searchParams.location.toLowerCase());

    const matchesQuery =
      searchParams.query === "" ||
      therapist.name.toLowerCase().includes(searchParams.query.toLowerCase());

    const matchesSpecialization =
      searchParams.specialization === "" ||
      therapist.specialization === searchParams.specialization;

    return matchesLocation && matchesQuery && matchesSpecialization;
  });

  const hasActiveFilters =
    searchParams.location !== "" ||
    searchParams.query !== "" ||
    searchParams.specialization !== "";

  return (
    <div className="min-h-screen ">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8 mt-16">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold">Find a Therapist</h1>
              <Badge variant="secondary" className="text-sm">
                {filteredTherapists.length} therapists available
              </Badge>
            </div>
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Enter location"
                      className="pl-10 w-full bg-background"
                      value={searchParams.location}
                      onChange={(e) =>
                        setSearchParams((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search by name..."
                      className="pl-10 w-full bg-background"
                      value={searchParams.query}
                      onChange={(e) =>
                        setSearchParams((prev) => ({
                          ...prev,
                          query: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <Select
                    onValueChange={(value) =>
                      setSearchParams((prev) => ({
                        ...prev,
                        specialization: value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialization.specializations.map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      className="w-full md:w-auto"
                      onClick={() =>
                        setSearchParams({
                          location: "",
                          query: "",
                          specialization: "",
                        })
                      }
                    >
                      <X className="w-4 h-4 mr-2" />
                      Clear Filters
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="w-full">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <Skeleton className="h-16 w-16 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-1/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-4 w-1/3" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <Card className="w-full">
                <CardContent className="p-6 text-center text-red-500">
                  {error}
                </CardContent>
              </Card>
            ) : (
              <TherapistList therapists={filteredTherapists} />
            )}
          </div>

          <div className="lg:w-1/3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Not sure which therapist is right for you? Our team can help
                  you find the perfect match.
                </p>
                <Button className="w-full" variant="default">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Us
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Therapy Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    Understanding Different Therapy Types
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    Preparing for Your First Session
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    Mental Health Self-Assessment Tools
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
