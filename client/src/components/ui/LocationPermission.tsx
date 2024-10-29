import { useState, useEffect, useCallback } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LocationPermissionProps {
  onLocationFound: (location: { lat: number; lng: number }) => void;
  onError: (error: string) => void;
  defaultLocation: { lat: number; lng: number };
}

const LocationPermission: React.FC<LocationPermissionProps> = ({
  onLocationFound,
  onError,
  defaultLocation,
}) => {
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Store the last known position in localStorage
  const saveLastKnownPosition = (location: { lat: number; lng: number }) => {
    try {
      localStorage.setItem("lastKnownLocation", JSON.stringify(location));
    } catch (error) {
      console.error("Error saving location to localStorage:", error);
    }
  };

  // Get the last known position from localStorage
  const getLastKnownPosition = useCallback(() => {
    try {
      const stored = localStorage.getItem("lastKnownLocation");
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Error reading location from localStorage:", error);
      return null;
    }
  }, []);

  const handleLocationSuccess = useCallback(
    (position: GeolocationPosition) => {
      const newLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      saveLastKnownPosition(newLocation);
      onLocationFound(newLocation);
      setLocationError(null);
      setIsLoading(false);
    },
    [onLocationFound]
  );

  const handleLocationError = useCallback(
    (error: GeolocationPositionError) => {
      console.log("Location error occurred:", error);

      // Try to use last known position first
      const lastKnownPosition = getLastKnownPosition();
      if (lastKnownPosition) {
        console.log("Using last known position");
        onLocationFound(lastKnownPosition);
        setIsLoading(false);
        return;
      }

      // If no last known position, use default location
      let errorMessage = "Location access denied.";
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage =
            "Location permission was denied. Using default location.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage =
            "Location information is unavailable. Using default location.";
          break;
        case error.TIMEOUT:
          errorMessage = "Location request timed out. Using default location.";
          break;
        default:
          errorMessage = "An unknown error occurred. Using default location.";
      }

      console.log("Using default location due to error:", errorMessage);
      setLocationError(errorMessage);
      onError(errorMessage);
      onLocationFound(defaultLocation);
      setIsLoading(false);
    },
    [onError, onLocationFound, defaultLocation, getLastKnownPosition]
  );

  // Initial location setup
  useEffect(() => {
    let isMounted = true;

    if (!isInitialLoad) return;

    const initializeLocation = async () => {
      // Try to use last known position immediately
      const lastKnownPosition = getLastKnownPosition();
      if (lastKnownPosition && isMounted) {
        onLocationFound(lastKnownPosition);
        setIsLoading(false);
      }

      // Then try to get current position
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (isMounted) {
              handleLocationSuccess(position);
              setIsInitialLoad(false);
            }
          },
          (error) => {
            if (isMounted) {
              handleLocationError(error);
              setIsInitialLoad(false);
            }
          },
          {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 300000,
          }
        );
      } else {
        if (isMounted) {
          const errorMessage =
            "Geolocation is not supported by your browser. Using default location.";
          setLocationError(errorMessage);
          onError(errorMessage);
          onLocationFound(defaultLocation);
          setIsLoading(false);
          setIsInitialLoad(false);
        }
      }
    };

    initializeLocation();

    return () => {
      isMounted = false;
    };
  }, [
    defaultLocation,
    getLastKnownPosition,
    handleLocationError,
    handleLocationSuccess,
    onError,
    onLocationFound,
    isInitialLoad,
  ]);

  if (isLoading && !getLastKnownPosition()) {
    return (
      <Alert className="mb-4">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        <AlertDescription>Getting your location...</AlertDescription>
      </Alert>
    );
  }

  if (locationError) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertDescription>{locationError}</AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default LocationPermission;
