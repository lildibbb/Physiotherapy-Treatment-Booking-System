import { useState, useEffect, useCallback } from "react";
import { AlertCircle, Navigation } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LocationPermissionProps {
  onLocationFound: (location: { lat: number; lng: number }) => void;
  onError: (error: string) => void;
}

const DEFAULT_LOCATION = {
  lat: 3.139, // Default to Kuala Lumpur or your preferred default
  lng: 101.6869,
};

const LocationPermission: React.FC<LocationPermissionProps> = ({
  onLocationFound,
  onError,
}) => {
  const [locationError, setLocationError] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

  const handleLocationError = useCallback(
    (error: GeolocationPositionError) => {
      let errorMessage = "Location access denied.";

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage =
            "Location permission was denied. Using default location.";
          onLocationFound(DEFAULT_LOCATION);
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage =
            "Location information is unavailable. Using default location.";
          onLocationFound(DEFAULT_LOCATION);
          break;
        case error.TIMEOUT:
          errorMessage = "Location request timed out. Using default location.";
          onLocationFound(DEFAULT_LOCATION);
          break;
        default:
          errorMessage = "An unknown error occurred. Using default location.";
          onLocationFound(DEFAULT_LOCATION);
      }

      setLocationError(errorMessage);
      onError(errorMessage);
    },
    [onLocationFound, onError]
  );

  const startLocationWatch = useCallback(() => {
    if ("geolocation" in navigator) {
      // Get initial position
      navigator.geolocation.getCurrentPosition((position) => {
        onLocationFound({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      }, handleLocationError);

      // Watch for position updates
      const id = navigator.geolocation.watchPosition(
        (position) => {
          onLocationFound({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationError(null); // Clear any previous errors
        },
        handleLocationError,
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );

      setWatchId(id);
    } else {
      const errorMessage =
        "Geolocation is not supported by your browser. Using default location.";
      setLocationError(errorMessage);
      onError(errorMessage);
      onLocationFound(DEFAULT_LOCATION);
    }
  }, [onLocationFound, handleLocationError, onError]);

  useEffect(() => {
    startLocationWatch();

    // Cleanup function
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [startLocationWatch, watchId]);

  if (locationError) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{locationError}</AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default LocationPermission;
