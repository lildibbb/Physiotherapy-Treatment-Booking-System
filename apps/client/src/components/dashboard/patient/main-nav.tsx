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
        href="/"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Home
      </Link>

      <Link
        href="/user/appointment"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Appointment
      </Link>
      <Link
        href="/findDoctor"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Booking
      </Link>
    </nav>
  );
}
