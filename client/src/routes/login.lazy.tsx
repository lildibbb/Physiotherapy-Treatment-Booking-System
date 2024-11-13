import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { createLazyFileRoute } from "@tanstack/react-router";
import type React from "react";
import { useState } from "react";
import { loginUser } from "../lib/api";

import Header from "@/components/ui/header";
import { Link, useNavigate } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/login")({
	component: RouteComponent,
});

function RouteComponent() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { toast } = useToast();
	const navigate = useNavigate();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const response = await loginUser(email, password);
			console.log("Login successful:", response);

			localStorage.setItem("token", response.token);

			// Redirect to dashboard upon successful login
			navigate("/auth/dashboard");
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Login failed",
				description: "Please check your credentials.",
			});
		}
	};

	return <div className="min-h-screen bg-gray-100 dark:bg-gray-900">aaaaa</div>;
}
