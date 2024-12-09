import type * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar-therapist";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SpecializationBadge from "@/components/ui/specializationBadge";
import {
  fetchTherapistDetails,
  registerTherapist,
  updateTherapistDetails,
} from "../../lib/api";
import RegisterTherapistForm from "../../components/forms/registerTherapist";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import specialization from "../../data/specialization.json"; // Import the specialization JSON
import { sendAccountCreatedEmail } from "@/emails/accountCreatedEmail";

interface TherapistData {
  therapistID?: string;
  email: string;
  password: string;
  name: string;
  specialization: string;
  contactDetails: string;
}

export const Route = createFileRoute("/business/_business/therapist_list")({
  component: RouteComponent,
});

function RouteComponent() {
  const [therapists, setTherapists] = useState<TherapistData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<TherapistData | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const fetchTherapists = async () => {
      setLoading(true);
      try {
        const data = await fetchTherapistDetails();
        setTherapists(data);
      } catch (error) {
        console.error("Error fetching therapist details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, []);

  const handleRegisterTherapist = async (
    data: TherapistData
  ): Promise<Partial<TherapistData> | null> => {
    try {
      const newTherapist = await registerTherapist(
        data.email,
        data.password,
        data.name,
        data.specialization,
        data.contactDetails
      );
      setTherapists((prevTherapists) => [
        ...prevTherapists,
        { ...data, therapistID: newTherapist.id }, // Ensure correct ID assignment
      ]);
      setIsSheetOpen(false);

      await sendAccountCreatedEmail({
        name: data.name,
        role: data.specialization,
        email: data.email,
        tempPassword: data.password,
        loginUrl: "http://localhost:3000/login", // Update to actual login URL
        to: data.email,
      });

      return null; // Indicate success
    } catch (error: any) {
      console.error("Registration error:", error);

      const formErrors: Partial<TherapistData> = {};
      if (error?.email) {
        formErrors.email = error.email;
      }
      if (error?.contactDetails) {
        formErrors.contactDetails = error.contactDetails;
      }

      // Optionally, handle other error fields

      return formErrors; // Return the errors to the form
    }
    // Adding this return ensures all code paths return a value
    // Even though it's unreachable, TypeScript requires it
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return null as Partial<TherapistData> | null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prevData) =>
      prevData ? { ...prevData, [name]: value } : null
    );
  };

  const handleSpecializationChange = (name: string) => {
    setEditFormData((prevData) =>
      prevData ? { ...prevData, specialization: name } : null
    );
  };

  const handleSaveClick = async (index: number) => {
    if (editFormData) {
      try {
        const therapistID = therapists[index]?.therapistID;
        if (!therapistID) {
          alert("Therapist ID is missing. Cannot update.");
          return;
        }
        await updateTherapistDetails(
          therapistID,
          editFormData.email,
          editFormData.password,
          editFormData.name,
          editFormData.specialization,
          editFormData.contactDetails
        );

        const updatedTherapists = [...therapists];
        updatedTherapists[index] = editFormData;
        setTherapists(updatedTherapists);

        setEditingIndex(null);
        setEditFormData(null);
      } catch (error) {
        console.error("Failed to update therapist details:", error);
        alert("Failed to update therapist details. Please try again.");
      }
    }
  };

  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setEditFormData(therapists[index]);
  };

  const handleCancelClick = () => {
    setEditingIndex(null);
    setEditFormData(null);
  };

  const MobileTherapistCard = ({
    therapist,
    index,
  }: {
    therapist: TherapistData;
    index: number;
  }) => (
    <div className="mb-4 p-4  rounded-lg shadow border">
      {editingIndex === index ? (
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              name="email"
              value={editFormData?.email || ""}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              name="password"
              value={editFormData?.password || ""}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              name="name"
              value={editFormData?.name || ""}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Specialization</label>
            <Select
              value={editFormData?.specialization || ""}
              onValueChange={handleSpecializationChange}
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
          </div>
          <div>
            <label className="text-sm font-medium">Contact Details</label>
            <Input
              name="contactDetails"
              value={editFormData?.contactDetails || ""}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={() => handleSaveClick(index)} className="flex-1">
              Save
            </Button>
            <Button
              variant="outline"
              onClick={handleCancelClick}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">{therapist.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditClick(index)}
              >
                Edit
              </Button>
            </div>
            <div className="text-sm">
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Email:</span>
                <span>{therapist.email}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500">Specialization:</span>
                <SpecializationBadge
                  specialization={therapist.specialization}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex-1 p-4 md:p-6">
          <SidebarTrigger className="mb-4" />
          <header className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">
              Therapist Details
            </h1>
            <p className="text-base md:text-lg text-gray-500">
              Here's a list of therapists in your business.
            </p>
          </header>
          <div className="mb-4 flex items-center gap-4">
            <Input placeholder="Filter therapists..." className="flex-1" />
            {isMobile ? (
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline">+ Add</Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[90vh] rounded-t-xl">
                  <SheetHeader className="mb-4">
                    <SheetTitle>Register Therapist</SheetTitle>
                    <SheetDescription>
                      Fill out the form below to add a new therapist.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="overflow-y-auto h-full pb-20">
                    <RegisterTherapistForm onSubmit={handleRegisterTherapist} />
                  </div>
                  <SheetFooter className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
                    <Button
                      variant="outline"
                      onClick={() => setIsSheetOpen(false)}
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">+ Add Therapist</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Register Therapist</DialogTitle>
                    <DialogDescription>
                      Fill out the form below to add a new therapist.
                    </DialogDescription>
                  </DialogHeader>
                  <RegisterTherapistForm onSubmit={handleRegisterTherapist} />
                </DialogContent>
              </Dialog>
            )}
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : therapists.length > 0 ? (
            isMobile ? (
              <div className="space-y-4">
                {therapists.map((therapist, index) => (
                  <MobileTherapistCard
                    key={index}
                    therapist={therapist}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <Card className="shadow-md rounded-lg overflow-hidden">
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Password</TableHead>

                        <TableHead>Specialization</TableHead>
                        <TableHead>Contact Details</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {therapists.map((therapist, index) => (
                        <TableRow key={index}>
                          {editingIndex === index ? (
                            <>
                              <TableCell>
                                <Input
                                  name="name"
                                  value={editFormData?.name || ""}
                                  onChange={handleInputChange}
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  name="email"
                                  value={editFormData?.email || ""}
                                  onChange={handleInputChange}
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="password"
                                  name="password"
                                  value={editFormData?.password || ""}
                                  onChange={handleInputChange}
                                />
                              </TableCell>

                              <TableCell>
                                <Select
                                  value={editFormData?.specialization || ""}
                                  onValueChange={handleSpecializationChange}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a specialization" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {specialization.specializations.map(
                                      (name) => (
                                        <SelectItem key={name} value={name}>
                                          {name}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <Input
                                  name="contactDetails"
                                  value={editFormData?.contactDetails || ""}
                                  onChange={handleInputChange}
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => handleSaveClick(index)}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={handleCancelClick}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell>{therapist.name}</TableCell>
                              <TableCell>{therapist.email}</TableCell>
                              <TableCell>******</TableCell>

                              <TableCell>
                                <SpecializationBadge
                                  specialization={therapist.specialization}
                                />
                              </TableCell>
                              <TableCell>{therapist.contactDetails}</TableCell>
                              <TableCell>
                                <Button onClick={() => handleEditClick(index)}>
                                  Edit
                                </Button>
                              </TableCell>
                            </>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )
          ) : (
            <p>No therapists found.</p>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
}
