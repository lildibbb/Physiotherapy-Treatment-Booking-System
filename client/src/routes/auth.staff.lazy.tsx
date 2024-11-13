import { createLazyFileRoute } from "@tanstack/react-router";
import * as React from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import RoleBadge from "@/components/ui/roleBadge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import RegisterStaffForm from "../components/forms/registerStaff";
import { roles } from "../data/roles.json";
import { sendAccountCreatedEmail } from "../emails/accountCreatedEmail";
import { useMediaQuery } from "../hooks/useMediaQuery";
import {
	fetchStaffDetails,
	registerStaff,
	updateStaffDetails,
} from "../lib/api";

interface StaffData {
	staffID?: string;
	email: string;
	password: string;
	name: string;
	role: string;
}

export const Route = createLazyFileRoute("/auth/staff")({
	component: RouteComponent,
});

function RouteComponent() {
	const [staff, setStaff] = useState<StaffData[]>([]);
	const [loading, setLoading] = useState(true);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [editFormData, setEditFormData] = useState<StaffData | null>(null);
	const [isSheetOpen, setIsSheetOpen] = useState(false);

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
			const newStaff = await registerStaff(
				data.email,
				data.password,
				data.name,
				data.role,
			);
			// Add the `id` returned by the API to the new staff data
			setStaff((prevStaff) => [...prevStaff, { ...data, id: newStaff.id }]);
			setIsSheetOpen(false);

			await sendAccountCreatedEmail({
				name: data.name,
				role: data.role,
				email: data.email,
				tempPassword: data.password,
				loginUrl: "http://localhost:3000/auth/login", // Update this to your actual login URL
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
			prevData ? { ...prevData, [name]: value } : null,
		);
	};
	const handleRoleChange = (value: string) => {
		setEditFormData((prevData) =>
			prevData ? { ...prevData, role: value } : null,
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
					editFormData.role,
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
		<SidebarProvider>
			<div className="flex min-h-screen">
				<AppSidebar />
			</div>
		</SidebarProvider>
	);
}
