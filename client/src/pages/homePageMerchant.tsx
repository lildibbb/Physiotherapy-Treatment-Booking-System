import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Header from "@/components/ui/header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const MerchantHomePage: React.FC = () => {
  return (
    <div className="min-h-screen " style={{ backgroundImage: "url(../asse)" }}>
      {/* Header Section */}
      <Header />

      {/* Hero Section */}
      <div className="flex justify-center items-center">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/merchant">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/merchant">Merchant</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Be a merchant</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="relative w-full h-auto py-10  flex justify-center items-center">
        <div className="text-center px-6">
          <h2 className="text-5xl font-semibold mb-4">
            Join Our Physiotherapy Booking Platform & Grow Your Practice
          </h2>
          <p className="text-lg mb-6">
            Get more clients and increase your visibility. Start taking
            appointments with just a few simple steps!
          </p>
          <Link to="/auth/signup/business">
            <Button className="text-xl py-3 px-8">
              Sign me up as a Physiotherapist
            </Button>
          </Link>
        </div>
        <div className="text-center px-6">
          <h1>sss</h1>
        </div>
      </div>

      {/* Why Join Us Section */}
      <div className="py-16 text-center">
        <h2 className="text-3xl font-semibold mb-4">Why Join Our Platform?</h2>
        <p className="text-lg mb-8">
          Take your physiotherapy business to the next level with easy access to
          a wide range of clients in need of your services.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
          <Card className="p-6 shadow-lg ">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Increase Your Visibility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">
                We bring your practice to clients in need. With our platform,
                you will be easily found and booked.
              </p>
            </CardContent>
          </Card>
          <Card className="p-6 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Hassle-Free Booking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">
                Let us handle the scheduling. You just focus on providing
                top-notch care to your clients.
              </p>
            </CardContent>
          </Card>
          <Card className="p-6 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Flexible Payment Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">
                Enjoy secure and flexible payment options to get paid fast and
                easily after every session.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="py-16 text-center">
        <h2 className="text-3xl font-semibold mb-4">
          Getting Started is Simple
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
          <Card className="p-6 shadow-lg ">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Step 1: Register Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">
                Fill in your basic information and start setting up your
                profile.
              </p>
            </CardContent>
          </Card>
          <Card className="p-6 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Step 2: Set Your Availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">
                Choose your working hours and set up your booking preferences.
              </p>
            </CardContent>
          </Card>
          <Card className="p-6 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Step 3: Start Taking Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">
                Let clients find and book appointments with you. Start earning
                right away!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 text-center">
        <h2 className="text-3xl font-semibold mb-8">
          What Our Physiotherapists Say
        </h2>
        <div className="flex justify-center space-x-8">
          <div className="max-w-md p-6 bg-teal-100 rounded-lg shadow-lg">
            <p className="text-lg text-gray-700">
              "Joining this platform has made it so much easier for me to
              connect with patients. My schedule has never been more full!"
            </p>
            <p className="mt-4 font-semibold">- Sarah M., Physiotherapist</p>
          </div>
          <div className="max-w-md p-6 bg-teal-100 rounded-lg shadow-lg">
            <p className="text-lg text-gray-700">
              "The booking system is seamless, and I love that I can manage my
              appointments on the go. Highly recommend!"
            </p>
            <p className="mt-4 font-semibold">- John D., Physiotherapist</p>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="py-8">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <p className="text-sm">
            &copy; 2024 Physiotherapy Booking System. All Rights Reserved.
          </p>
          <div className="space-x-4">
            <Link to="/terms" className="hover:text-yellow-500 text-sm">
              Terms of Service
            </Link>
            <Link to="/privacy" className="hover:text-yellow-500 text-sm">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MerchantHomePage;
