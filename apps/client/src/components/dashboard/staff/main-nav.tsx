import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/staff/dashboard"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Overview
      </Link>
      <Link
        href="/staff/appointment"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Appointment
      </Link>
      <Link
        href="/staff/therapist_list"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Physiotherapists
      </Link>
    </nav>
  );
}
