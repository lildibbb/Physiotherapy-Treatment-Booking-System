import { Link } from "react-router-dom"; // Import Link for navigation within the SPA
import { ArrowRightIcon } from "@radix-ui/react-icons";

export function Announcement() {
  return (
    <Link
      to="/docs/components/sidebar"
      className="group inline-flex items-center px-0.5 text-sm font-medium"
    >
      <span className="underline-offset-4 group-hover:underline">
        New sidebar component
      </span>
      <ArrowRightIcon className="ml-1 h-4 w-4" />
    </Link>
  );
}
