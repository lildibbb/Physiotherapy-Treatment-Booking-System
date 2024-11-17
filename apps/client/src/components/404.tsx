import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
export const NotFound = () => {
  return (
    <div className="h-screen">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] font-bold leading-tight">404</h1>
        <span className="font-medium">Oops! Page Not Found!</span>
        <p className="text-center text-muted-foreground">
          It seems like the page you're looking for <br />
          does not exist or might have been removed.
        </p>
        <div className="mt-6 flex gap-4">
          <Button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-gray-300 bg-white text-black shadow-sm hover:bg-gray-100 h-9 px-4 py-2"
          >
            Go Back
          </Button>

          <Link to="/">
            <Button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
