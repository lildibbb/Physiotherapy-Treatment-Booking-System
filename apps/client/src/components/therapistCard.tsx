import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { CheckCircle, Star, Clock, Video } from "lucide-react";

const TherapistCard = () => {
  return (
    <Card className="w-full max-w-lg bg-white shadow-md rounded-lg p-6">
      {/* Header Section */}
      <CardHeader className="flex items-center space-x-4">
        {/* Profile Image */}
        <div className="w-24 h-24 rounded-full overflow-hidden">
          <img
            src="https://via.placeholder.com/150"
            alt="Therapist"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Text Details */}
        <div>
          <CardTitle className="text-2xl font-bold">
            Dr Wan Izwin Najla Binti Wan Hassan
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Consultant Psychiatrist
          </CardDescription>
          <p className="text-sm text-gray-500 flex items-center">
            14 Years Experience
            <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
            <span className="ml-1 text-green-500">Verified</span>
          </p>
          <button className="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded-lg flex items-center">
            <Video className="w-4 h-4 mr-2" />
            Video
          </button>
        </div>
      </CardHeader>

      {/* Footer Section */}
      <CardFooter className="flex justify-between border-t border-gray-200 pt-4">
        <p className="text-sm text-green-600 flex items-center">
          <Star className="w-4 h-4 mr-2" />
          Highly recommended
        </p>
        <p className="text-sm text-yellow-600 flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          Excellent wait time
        </p>
      </CardFooter>
    </Card>
  );
};

export default TherapistCard;
