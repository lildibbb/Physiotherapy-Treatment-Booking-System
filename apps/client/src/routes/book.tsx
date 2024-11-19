import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/book")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col lg:flex-row bg-gray-50 min-h-screen p-6">
      {/* Left Section: Doctor Information */}
      <div className="w-full lg:w-2/3 bg-white shadow-md rounded-lg p-6 space-y-6">
        {/* Doctor Header */}
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <img
              src="https://via.placeholder.com/150"
              alt="Doctor"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              Dr Wan Izwin Najla Binti Wan Hassan
            </h1>
            <p className="text-lg text-gray-600">Consultant Psychiatrist</p>
            <p className="text-sm text-gray-500">
              14 Years Experience{" "}
              <span className="text-green-500 font-semibold">✔ Verified</span>
            </p>
            <div className="flex space-x-2 mt-2">
              <button className="px-4 py-1 bg-blue-500 text-white rounded-lg text-sm">
                Video
              </button>
            </div>
          </div>
        </div>
        {/* Doctor Highlights */}
        <div className="flex space-x-6 border-t border-gray-200 pt-4">
          <p className="flex items-center text-sm text-green-600">
            ⭐ Highly recommended
          </p>
          <p className="flex items-center text-sm text-yellow-600">
            ⏳ Excellent wait time
          </p>
        </div>
        {/* Doctor Details */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">About Doctor</h2>
          <p className="text-sm text-gray-700">
            Dr. Wan Izwin Najla Wan Hassan is a Consultant Psychiatrist
            specializing in Geriatric Psychiatry at Subang Jaya Medical Centre.
            She obtained her medical degree...
            <span className="text-blue-500 cursor-pointer"> See More</span>
          </p>
          {/* Practices */}
          <div>
            <h3 className="text-md font-semibold">Practices</h3>
            <ul className="list-disc list-inside text-sm text-blue-500">
              <li>Subang Jaya Medical Centre</li>
              <li>ParkCity Medical Centre</li>
              <li>Ara Damansara Medical Centre</li>
            </ul>
          </div>
          {/* Specialization */}
          <div>
            <h3 className="text-md font-semibold">Specialization</h3>
            <p className="text-sm">Consultant Psychiatrist, Psychiatry</p>
          </div>
          {/* Qualifications */}
          <div>
            <h3 className="text-md font-semibold">Qualifications</h3>
            <p className="text-sm">MBChB (UK), MRCPsych (UK)</p>
          </div>
          {/* Medical Registry */}
          <div>
            <h3 className="text-md font-semibold">Medical Registry</h3>
            <p className="text-sm">
              Malaysia Medical Council: 75101 <br />
              National Specialist Register: 136503
            </p>
          </div>
          {/* Languages */}
          <div>
            <h3 className="text-md font-semibold">Languages</h3>
            <p className="text-sm">English, Malay</p>
          </div>
        </div>
      </div>

      {/* Right Section: Booking Steps */}
      <div className="w-full lg:w-1/3 bg-white shadow-md rounded-lg p-6 mt-6 lg:mt-0 lg:ml-6 space-y-6">
        <h2 className="text-lg font-semibold">
          Step 1: Choose Consultation Type
        </h2>
        <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg">
          <span>📹</span> <span className="ml-2">Video</span>
        </button>

        <h2 className="text-lg font-semibold">Step 2: Choose Date & Time</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-gray-100 rounded-lg">
            Wed Nov 20
          </button>
          <button className="px-4 py-2 bg-gray-100 rounded-lg">
            Thu Nov 21
          </button>
          <button className="px-4 py-2 bg-gray-100 rounded-lg">
            Fri Nov 22
          </button>
          <button className="px-4 py-2 bg-gray-100 rounded-lg">
            Sat Nov 23
          </button>
        </div>
        <div className="mt-4">
          <h3 className="text-md font-semibold">Morning</h3>
          <div className="px-4 py-2 bg-gray-200 rounded-lg text-sm">12:30</div>
          <h3 className="text-md font-semibold mt-4">Afternoon</h3>
          <div className="px-4 py-2 bg-gray-200 rounded-lg text-sm">
            Not Available
          </div>
        </div>
      </div>
    </div>
  );
}

export default RouteComponent;
