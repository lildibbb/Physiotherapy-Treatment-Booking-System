import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { HospitalData } from "../../types/types";
import HospitalMarker from "./HospitalMarker";
import { Button } from "@/components/ui/button";
import { Navigation, Loader2 } from "lucide-react";

interface MapComponentProps {
  userLocation: { lat: number; lng: number };
  hospitals: HospitalData[];
  isInteractionDisabled: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const MapController = ({
  center,
  onMapReady,
}: {
  center: { lat: number; lng: number };
  onMapReady: () => void;
}) => {
  const map = useMap();
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      map.setView([center.lat, center.lng], 13);
      isFirstMount.current = false;
      onMapReady();
    }
  }, [center.lat, center.lng, map, onMapReady]);

  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({
  userLocation,
  hospitals,
  isInteractionDisabled,
  onOpenChange,
}) => {
  const [isMapReady, setIsMapReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  const userIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const handleMapReady = () => {
    setIsMapReady(true);
  };

  const handleRecenter = () => {
    setIsLoading(true);

    const options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 300000,
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          if (mapRef.current) {
            mapRef.current.setView([newLocation.lat, newLocation.lng], 13, {
              animate: true,
              duration: 1,
            });
          }
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to current map center
          setIsLoading(false);
        },
        options
      );
    }
  };

  // Show loading state if we don't have valid coordinates yet
  if (!userLocation || (userLocation.lat === 0 && userLocation.lng === 0)) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-gray-100 rounded-lg">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <p className="text-gray-600">Loading map location...</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <MapContainer
        ref={mapRef}
        center={[userLocation.lat, userLocation.lng]}
        zoom={13}
        scrollWheelZoom={true}
        dragging={true}
        zoomControl={true}
        className="h-full w-full rounded-lg shadow-md z-0"
        minZoom={3}
        maxZoom={18}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={userLocation} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>
        {hospitals.map((hospital, index) => (
          <HospitalMarker
            key={`hospital-${hospital.id || index}`}
            hospital={hospital}
            onOpenChange={onOpenChange}
          />
        ))}
        <MapController center={userLocation} onMapReady={handleMapReady} />
      </MapContainer>

      {isMapReady && (
        <Button
          className="absolute bottom-4 right-4 z-[1000] shadow-lg"
          onClick={handleRecenter}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4 mr-2" />
          )}
          {isLoading ? "Centering..." : "Center on me"}
        </Button>
      )}
    </div>
  );
};

export default MapComponent;
