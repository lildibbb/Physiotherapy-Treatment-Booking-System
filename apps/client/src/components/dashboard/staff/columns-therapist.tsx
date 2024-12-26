// columns-therapist.tsx

"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Clock, MoreHorizontal, ChevronRight } from "lucide-react";

import { DataTableColumnHeader } from "./data-table-column-header";
import { Badge } from "../../ui/badge";
import { Checkbox } from "../../ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { updateAvailability } from "@/lib/api"; // Ensure the path is correct

// Import ShadCN's DatePicker or any compatible date picker component
import { DatePicker } from "@/components/ui/date-picker"; // Adjust the path accordingly
import { AvailabilityPayload } from "@/types/types";

// --------------------
// Type Definitions
// --------------------

export interface Availability {
  availabilityID: number;
  therapistID: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isAvailable: number;
  specialDate?: string | null;
}

export type Therapist = {
  therapistID: number;
  name: string;
  contactDetails: string;
  availability: Availability[];
};

// --------------------
// Helper Functions
// --------------------

// Formats time from "HH:mm" to "h:mm a"
const formatTime = (time: string) => {
  try {
    const [hours, minutes] = time.split(":");
    return format(
      new Date().setHours(Number(hours), Number(minutes)),
      "h:mm a"
    );
  } catch {
    return time;
  }
};

// Groups availability slots by day of the week
const groupAvailabilitiesByDay = (
  availabilities: Availability[]
): Record<string, Availability[]> => {
  return availabilities.reduce(
    (acc, curr) => {
      const day = curr.dayOfWeek;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(curr);
      return acc;
    },
    {} as Record<string, Availability[]>
  );
};

// --------------------
// Availability Detail Component
// --------------------

const AvailabilityDetail = ({
  availabilities,
}: {
  availabilities: Availability[];
}) => {
  const groupedAvailabilities = groupAvailabilitiesByDay(availabilities);

  return (
    <div className="space-y-4">
      {Object.entries(groupedAvailabilities).map(
        ([day, slots]: [string, Availability[]]) => (
          <div key={day} className="rounded-md border p-3">
            <div className="font-medium text-lg mb-2">{day}</div>
            <div className="grid gap-2">
              {slots.map((slot) => (
                <div
                  key={slot.availabilityID}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </span>
                  </div>
                  <Badge
                    variant={slot.isAvailable ? "default" : "secondary"}
                    className="ml-2"
                  >
                    {slot.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

// --------------------
// Edit Availability Form Component
// --------------------

const EditAvailabilityForm = ({
  therapist,
  onSave,
}: {
  therapist: Therapist;
  onSave: (updatedAvailability: Availability[]) => void;
}) => {
  const [availability, setAvailability] = useState<Availability[]>(
    therapist.availability
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Validates the availability slot
  const validateAvailability = (slot: Availability): string | null => {
    if (!slot.therapistID) return "Therapist ID is required.";
    if (!slot.availabilityID) return "Availability ID is required.";
    if (!slot.dayOfWeek) return "Day of the week is required.";
    if (!slot.startTime) return "Start time is required.";
    if (!slot.endTime) return "End time is required.";
    if (slot.isAvailable === undefined || slot.isAvailable === null)
      return "Availability status is required.";
    // Additional validations can be added here
    return null;
  };

  // Handles changes to input fields
  const handleChange = (
    index: number,
    field: keyof Availability,
    value: string | number | null
  ) => {
    const updated = [...availability];
    updated[index] = { ...updated[index], [field]: value };
    setAvailability(updated);
  };

  // Handles the save operation by calling the updateAvailability API function
  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Validate each slot
      for (const slot of availability) {
        const validationError = validateAvailability(slot);
        if (validationError) {
          throw new Error(validationError);
        }
      }

      // Prepare the batch payload
      const batchPayload: AvailabilityPayload[] = availability.map((slot) => ({
        therapistID: slot.therapistID,
        availabilityID: slot.availabilityID,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isAvailable: slot.isAvailable,
        specialDate: slot.specialDate ?? null,
      }));
      console.log(batchPayload);
      console.log("Batch Payload:", JSON.stringify(batchPayload, null, 2));

      // Send batch request
      await updateAvailability(batchPayload);

      // Call onSave callback after successful batch update
      onSave(availability);
    } catch (err: any) {
      console.error("Error updating availability:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {availability.map((slot, index) => (
        <div
          key={slot.availabilityID}
          className="flex flex-col space-y-2 p-4 border rounded-md"
        >
          {/* Day of the Week (Read-Only) */}
          <div className="flex items-center space-x-2">
            <span className="font-medium w-24">{slot.dayOfWeek}:</span>
            {/* Read-Only Display */}
            <span>{slot.dayOfWeek}</span>
          </div>

          {/* Start Time */}
          <div className="flex items-center space-x-2">
            <span className="font-medium w-24">Start Time:</span>
            <input
              type="time"
              value={slot.startTime}
              onChange={(e) => handleChange(index, "startTime", e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* End Time */}
          <div className="flex items-center space-x-2">
            <span className="font-medium w-24">End Time:</span>
            <input
              type="time"
              value={slot.endTime}
              onChange={(e) => handleChange(index, "endTime", e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Availability Checkbox */}
          <div className="flex items-center space-x-2">
            <span className="font-medium w-24">Available:</span>
            <Checkbox
              checked={slot.isAvailable === 1}
              onCheckedChange={(checked) =>
                handleChange(index, "isAvailable", checked ? 1 : 0)
              }
              aria-label="Available"
              className="translate-y-[2px]"
            />
          </div>

          {/* Special Date Picker */}
          <div className="flex items-center space-x-2">
            <span className="font-medium w-24">Special Date:</span>
            <DatePicker
              selected={slot.specialDate ? new Date(slot.specialDate) : null}
              onChange={(date: Date | null) =>
                handleChange(
                  index,
                  "specialDate",
                  date ? date.toISOString().split("T")[0] : null
                )
              }
              className="border p-2 rounded w-full"
              placeholder="Select a date"
              isClearable
            />
          </div>
        </div>
      ))}

      {error && <div className="text-red-500 mt-2">{error}</div>}

      <Button onClick={handleSave} className="mt-4" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};

// --------------------
// Columns Definition
// --------------------

// Define the columns for the TanStack Table
export const columns: ColumnDef<Therapist>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Therapist" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px] truncate">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "contactDetails",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact Details" />
    ),
    cell: ({ row }) => (
      <div className="w-[300px] truncate">{row.getValue("contactDetails")}</div>
    ),
  },
  {
    accessorKey: "availability",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Availability" />
    ),
    cell: ({ row }) => {
      const availabilities = row.original.availability;
      const [isViewOpen, setIsViewOpen] = useState<boolean>(false);
      const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
      const isDesktop = useMediaQuery("(min-width: 768px)");

      if (availabilities.length === 0) {
        return (
          <div className="flex items-center text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            No availability set
          </div>
        );
      }

      // Show only first two availabilities in the table
      const groupedAvailabilities = groupAvailabilitiesByDay(availabilities);
      const firstTwoDays = Object.entries(groupedAvailabilities).slice(0, 2);

      return (
        <>
          <Button
            variant="ghost"
            className="w-[300px] justify-between p-2 hover:bg-accent"
            onClick={() => setIsViewOpen(true)}
          >
            <div className="flex flex-col space-y-1">
              {firstTwoDays.map(([day, slots]) => (
                <div key={day} className="flex items-center text-sm">
                  <span className="font-medium mr-2">{day}:</span>
                  <span className="text-muted-foreground">
                    {formatTime(slots[0].startTime)} -{" "}
                    {formatTime(slots[0].endTime)}
                  </span>
                </div>
              ))}
              {Object.keys(groupedAvailabilities).length > 2 && (
                <div className="text-sm text-muted-foreground">
                  + {Object.keys(groupedAvailabilities).length - 2} more days
                </div>
              )}
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Button>

          {/* Dialog for Viewing Availability on Desktop */}
          {isViewOpen && isDesktop && (
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
              <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    Availability Schedule - {row.getValue("name")}
                  </DialogTitle>
                </DialogHeader>
                <AvailabilityDetail availabilities={availabilities} />
                <Button onClick={() => setIsViewOpen(false)} className="mt-4">
                  Close
                </Button>
              </DialogContent>
            </Dialog>
          )}

          {/* Drawer for Viewing Availability on Mobile */}
          {isViewOpen && !isDesktop && (
            <Drawer open={isViewOpen} onOpenChange={setIsViewOpen}>
              <DrawerContent className="overflow-y-auto">
                <DrawerHeader>
                  <DrawerTitle>
                    Availability Schedule - {row.getValue("name")}
                  </DrawerTitle>
                </DrawerHeader>
                <div className="p-4">
                  <AvailabilityDetail availabilities={availabilities} />
                </div>
                <Button onClick={() => setIsViewOpen(false)} className="mt-4">
                  Close
                </Button>
              </DrawerContent>
            </Drawer>
          )}

          {/* Edit Availability Dialog for Desktop */}
          {isEditOpen && isDesktop && (
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    Edit Availability - {row.getValue("name")}
                  </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  <EditAvailabilityForm
                    therapist={row.original}
                    onSave={(_) => {
                      // After successful save, close the dialog
                      setIsEditOpen(false);
                      // Optionally, refresh the table data here
                    }}
                  />
                </DialogDescription>
                <Button onClick={() => setIsEditOpen(false)} className="mt-4">
                  Cancel
                </Button>
              </DialogContent>
            </Dialog>
          )}

          {/* Edit Availability Drawer for Mobile */}
          {isEditOpen && !isDesktop && (
            <Drawer open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DrawerContent className="overflow-y-auto">
                <DrawerHeader>
                  <DrawerTitle>
                    Edit Availability - {row.getValue("name")}
                  </DrawerTitle>
                </DrawerHeader>
                <div className="p-4">
                  <EditAvailabilityForm
                    therapist={row.original}
                    onSave={(_) => {
                      // After successful save, close the drawer
                      setIsEditOpen(false);
                      // Optionally, refresh the table data here
                    }}
                  />
                </div>
                <Button onClick={() => setIsEditOpen(false)} className="mt-4">
                  Cancel
                </Button>
              </DrawerContent>
            </Drawer>
          )}
        </>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const therapist = row.original;
      const [isViewOpen, setIsViewOpen] = useState<boolean>(false);
      const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
      const isDesktop = useMediaQuery("(min-width: 768px)");

      // Handles viewing therapist details
      const viewTherapist = () => {
        setIsViewOpen(true);
      };

      // Handles editing therapist availability
      const editTherapist = () => {
        setIsEditOpen(true);
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={viewTherapist}>
                View Therapist
              </DropdownMenuItem>
              <DropdownMenuItem onClick={editTherapist}>
                Edit Availability
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dialog for Viewing Therapist on Desktop */}
          {isViewOpen && isDesktop && (
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
              <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    Therapist Details - {therapist.name}
                  </DialogTitle>
                </DialogHeader>
                <AvailabilityDetail availabilities={therapist.availability} />
                <Button onClick={() => setIsViewOpen(false)} className="mt-4">
                  Close
                </Button>
              </DialogContent>
            </Dialog>
          )}

          {/* Drawer for Viewing Therapist on Mobile */}
          {isViewOpen && !isDesktop && (
            <Drawer open={isViewOpen} onOpenChange={setIsViewOpen}>
              <DrawerContent className="overflow-y-auto">
                <DrawerHeader>
                  <DrawerTitle>
                    Therapist Details - {therapist.name}
                  </DrawerTitle>
                </DrawerHeader>
                <div className="p-4">
                  <AvailabilityDetail availabilities={therapist.availability} />
                </div>
                <Button onClick={() => setIsViewOpen(false)} className="mt-4">
                  Close
                </Button>
              </DrawerContent>
            </Drawer>
          )}

          {/* Dialog for Editing Availability on Desktop */}
          {isEditOpen && isDesktop && (
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    Edit Availability - {therapist.name}
                  </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  <EditAvailabilityForm
                    therapist={therapist}
                    onSave={(_) => {
                      // After successful save, close the dialog
                      setIsEditOpen(false);
                      // Optionally, refresh the table data here
                    }}
                  />
                </DialogDescription>
                <Button onClick={() => setIsEditOpen(false)} className="mt-4">
                  Cancel
                </Button>
              </DialogContent>
            </Dialog>
          )}

          {/* Drawer for Editing Availability on Mobile */}
          {isEditOpen && !isDesktop && (
            <Drawer open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DrawerContent className="overflow-y-auto">
                <DrawerHeader>
                  <DrawerTitle>
                    Edit Availability - {therapist.name}
                  </DrawerTitle>
                </DrawerHeader>
                <div className="p-4">
                  <EditAvailabilityForm
                    therapist={therapist}
                    onSave={(_) => {
                      // After successful save, close the drawer
                      setIsEditOpen(false);
                      // Optionally, refresh the table data here
                    }}
                  />
                </div>
                <Button onClick={() => setIsEditOpen(false)} className="mt-4">
                  Cancel
                </Button>
              </DrawerContent>
            </Drawer>
          )}
        </>
      );
    },
  },
];
