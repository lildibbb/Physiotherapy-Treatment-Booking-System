import type * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar-business";
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
import RoleBadge from "@/components/ui/roleBadge";
import {
  fetchStaffDetails,
  registerStaff,
  updateStaffDetails,
} from "../../lib/api";
import RegisterStaffForm from "../../components/forms/registerStaff";
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
import { roles } from "../../data/roles.json";
import { sendAccountCreatedEmail } from "../../emails/accountCreatedEmail";
import { MainNav } from "@/components/dashboard/business/main-nav";
import { UserNav } from "@/components/dashboard/business/user-nav";
import { toast } from "@/hooks/use-toast";
interface StaffData {
  staffID?: string;
  email: string;
  password: string;
  name: string;
  role: string;
  contactDetails: string;
}

export const Route = createFileRoute("/business/_business/staff_list")({
  component: RouteComponent,
});

function RouteComponent() {
  const [staff, setStaff] = useState<StaffData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<StaffData | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  // Detect if the screen is mobile-sized
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      try {
        const data = await fetchStaffDetails();
        console.log("Fetched staff data:", data);
        setStaff(data);
      } catch (error) {
        console.error("Error fetching staff details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const handleRegisterStaff = async (data: Omit<StaffData, "id">) => {
    try {
      console.log(data.contactDetails);
      const newStaff = await registerStaff(
        data.email,
        data.password,
        data.name,
        data.role,
        data.contactDetails
      );
      console.log(newStaff.message);
      console.log("New staff registered:", newStaff);
      // Add the `id` returned by the API to the new staff data
      setStaff((prevStaff) => [...prevStaff, { ...data, id: newStaff.id }]);
      setIsSheetOpen(false);
      toast({
        title: "Staff registered",
        description: "Your staff has been registered",
        className: "bg-green-500 text-white",
      });
      await sendAccountCreatedEmail({
        name: data.name,
        role: data.role,
        email: data.email,
        tempPassword: data.password,
        loginUrl: `${import.meta.env.VITE_API_BASE_URL}/login`, // Update this to your actual login URL
        to: data.email,
      });
    } catch (error) {
      console.error("Failed to register staff:", error);
    }
  };
  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setEditFormData(staff[index]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prevData) =>
      prevData ? { ...prevData, [name]: value } : null
    );
  };
  const handleRoleChange = (value: string) => {
    setEditFormData((prevData) =>
      prevData ? { ...prevData, role: value } : null
    );
  };

  const handleSaveClick = async (index: number) => {
    if (editFormData) {
      try {
        // Access staffID from the updated `staff` array with `id` property
        const staffID = staff[index]?.staffID;
        console.log("staffID:", staffID);
        if (!staffID) {
          alert("Staff ID is missing. Cannot update.");
          return;
        }
        await updateStaffDetails(
          staffID,
          editFormData.email,
          editFormData.password,
          editFormData.name,
          editFormData.role
        );

        // Update the local state if the API call succeeds
        const updatedStaff = [...staff];
        updatedStaff[index] = editFormData;
        setStaff(updatedStaff);

        // Clear editing state
        setEditingIndex(null);
        setEditFormData(null);
      } catch (error) {
        console.error("Failed to update staff details:", error);
        alert("Failed to update staff details. Please try again.");
      }
    }
  };
  const handleCancelClick = () => {
    setEditingIndex(null);
    setEditFormData(null);
  };

  const MobileStaffCard = ({
    staffMember,
    index,
  }: {
    staffMember: StaffData;
    index: number;
  }) => (
    <div className="mb-4 p-4 bg-white rounded-lg shadow border">
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
            <label className="text-sm font-medium">Role</label>
            <Input
              name="role"
              value={editFormData?.role || ""}
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
              <span className="font-medium">{staffMember.name}</span>
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
                <span>{staffMember.email}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500">Role:</span>
                <RoleBadge role={staffMember.role} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      {isSmallScreen ? (
        <header className="border-b">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <MainNav />
            <UserNav />
          </div>
        </header>
      ) : null}
      <div className="flex-1 p-4 md:p-6">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Staff Details</h1>
          <p className="text-base md:text-lg text-gray-500">
            Here's a list of staff members in your business.
          </p>
        </header>
        <div className="mb-4 flex items-center gap-4">
          <Input placeholder="Filter staff..." className="flex-1" />
          {isMobile ? (
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline">+ Add</Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[90vh] rounded-t-xl">
                <SheetHeader className="mb-4">
                  <SheetTitle>Register Staff</SheetTitle>
                  <SheetDescription>
                    Fill out the form below to add a new staff member.
                  </SheetDescription>
                </SheetHeader>
                <div className="overflow-y-auto h-full pb-20">
                  <RegisterStaffForm onSubmit={handleRegisterStaff} />
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
                <Button variant="outline">+ Add Staff</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Register Staff</DialogTitle>
                  <DialogDescription>
                    Fill out the form below to add a new staff member.
                  </DialogDescription>
                </DialogHeader>
                <RegisterStaffForm onSubmit={handleRegisterStaff} />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : staff.length > 0 ? (
          isMobile ? (
            <div className="space-y-4">
              {staff.map((staffMember, index) => (
                <MobileStaffCard
                  key={index}
                  staffMember={staffMember}
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
                      <TableHead>Email</TableHead>
                      <TableHead>Password</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staff.map((staffMember, index) => (
                      <TableRow key={index}>
                        {editingIndex === index ? (
                          <>
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
                              <Input
                                name="name"
                                value={editFormData?.name || ""}
                                onChange={handleInputChange}
                              />
                            </TableCell>
                            <TableCell>
                              <Select
                                value={editFormData?.role || ""}
                                onValueChange={handleRoleChange}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                  {roles.map((role) => (
                                    <SelectItem key={role} value={role}>
                                      {role}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button onClick={() => handleSaveClick(index)}>
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
                            <TableCell>{staffMember.email}</TableCell>
                            <TableCell>******</TableCell>
                            <TableCell>{staffMember.name}</TableCell>
                            <TableCell>
                              <RoleBadge role={staffMember.role} />
                            </TableCell>
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
          <p>No staff found.</p>
        )}
      </div>
    </div>
  );
}
