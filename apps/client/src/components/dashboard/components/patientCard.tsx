import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

interface PatientInfo {
  patientName: string;
  patientId: string;
  appointmentTime: string;
  patientStatus: string;
  patientImage: string;
}

export const PatientCard = ({
  patientName,
  patientId,
  appointmentTime,
  patientStatus,
  patientImage,
}: PatientInfo) => {
  return (
    <Card className="mb-4 shadow-lg rounded-lg border border-gray-200">
      <CardHeader className="p-4">
        <div className="flex items-center space-x-4">
          <img
            src={patientImage}
            alt={patientName}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
          />
          <div className="items-center ">
            <CardTitle className="text-lg font-semibold">
              {patientName}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              ID: {patientId}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between">
          <div className="text-sm">Next Appointment:</div>
          <div className="text-sm">{appointmentTime}</div>
        </div>
        <div className="mt-2 flex justify-between">
          <div className="text-sm">Status:</div>
          <div
            className={`text-sm ${patientStatus === "active" ? "text-green-500" : "text-red-500"}`}
          >
            {patientStatus === "active" ? "Active" : "Inactive"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientCard;
