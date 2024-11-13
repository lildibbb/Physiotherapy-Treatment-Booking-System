import { useState, useEffect } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { HospitalData } from "../../types/types";
import hospitalIconUrl from "../../assets/hospital-icon.png";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Route } from "lucide-react"; // Replacing with available icons

interface HospitalMarkerProps {
  hospital: HospitalData;
  onOpenChange: (isOpen: boolean) => void;
}

const hospitalIcon = L.icon({
  iconUrl: hospitalIconUrl,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const HospitalMarker: React.FC<HospitalMarkerProps> = ({
  hospital,
  onOpenChange,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleShowMoreClick = () => {
    setIsDialogOpen(true);
    onOpenChange(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    onOpenChange(false);
  };

  return (
    <>
      <Marker position={hospital.coordinates} icon={hospitalIcon}>
        <Popup>
          <div className="p-2 text-center">
            <h3 className="font-semibold">{hospital.name}</h3>
            <Button variant="link" onClick={handleShowMoreClick}>
              Show More
            </Button>
          </div>
        </Popup>
      </Marker>

      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="z-50">
          <DialogTitle>{hospital.name}</DialogTitle>
          <DialogDescription>
            <div>
              <MapPin className="inline-block mr-2" /> {hospital.location}
              <br />
              <Route className="inline-block mr-2" /> {hospital.distance} km
              from your location
            </div>
          </DialogDescription>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HospitalMarker;
