import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import Header from "@/components/ui/header";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registerUser } from "../lib/api";

// Define Zod schema for form validation
const formSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Invalid email address"),
	password: z
		.string()
		.min(6, "Password must be at least 6 characters")
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
			"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
		),
});

type FormData = z.infer<typeof formSchema>;

export const Route = createFileRoute("/signup")({
	component: RouteComponent,
});

function RouteComponent() {
	const { toast } = useToast();

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
	});

	const onSubmit = async (data: FormData) => {
		try {
			const response = await registerUser(data.name, data.email, data.password);
			console.log("Registration successful:", response);

			toast({
				variant: "default",
				title: "Registration Successful",
				description: "Your account has been created. You can now log in.",
			});
		} catch (error) {
			console.error(error);
			toast({
				variant: "destructive",
				title: "Registration failed",
				description: "Email is already in use",
			});
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 dark:bg-gray-900">
			<Header /> {/* Include the Header at the top */}
			<div className="flex items-center justify-center pt-8">
				<Card className="w-full max-w-md p-4">
					<CardHeader>
						<CardTitle className="font-semibold tracking-tight text-2xl text-center">
							Sign Up
						</CardTitle>
						<CardDescription className="text-center">
							Create your account to get started
						</CardDescription>
					</CardHeader>

					<CardContent>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Name</FormLabel>
											<FormControl>
												<Input placeholder="Full Name" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input placeholder="Email" type="email" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													placeholder="Password"
													type="password"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button type="submit" className="w-full">
									Sign Up
								</Button>
							</form>
						</Form>
					</CardContent>

					<CardFooter className="flex flex-col items-center">
						<p className="text-sm text-center">
							Already have an account?{" "}
							<Link to="/login" className="text-blue-500 hover:underline">
								Login
							</Link>
						</p>
					</CardFooter>

					<p className="px-8 text-center text-sm text-muted-foreground">
						By clicking continue, you agree to our Terms of Service and Privacy
						Policy.
					</p>
				</Card>
			</div>
		</div>
	);
}
