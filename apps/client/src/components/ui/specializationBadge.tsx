import { Badge } from "@/components/ui/badge";

const getSpecializationBadgeStyles = (specialization: string): string => {
  const specializationStyles: { [key: string]: string } = {
    "Orthopedic Physiotherapy":
      "bg-red-500 hover:bg-red-600 text-white border-none",
    "Neurological Physiotherapy":
      "bg-blue-500 hover:bg-blue-600 text-white border-none",
    "Cardiovascular and Pulmonary Physiotherapy":
      "bg-teal-500 hover:bg-teal-600 text-white border-none",
    "Pediatric Physiotherapy":
      "bg-green-500 hover:bg-green-600 text-white border-none",
    "Geriatric Physiotherapy":
      "bg-orange-500 hover:bg-orange-600 text-white border-none",
    "Sports Physiotherapy":
      "bg-purple-500 hover:bg-purple-600 text-white border-none",
    "Women's Health Physiotherapy":
      "bg-pink-500 hover:bg-pink-600 text-white border-none",
    "Oncological Physiotherapy":
      "bg-yellow-500 hover:bg-yellow-600 text-white border-none",
    "Vestibular Rehabilitation":
      "bg-indigo-500 hover:bg-indigo-600 text-white border-none",
    "Chronic Pain Management":
      "bg-gray-500 hover:bg-gray-600 text-white border-none",
  };

  return (
    specializationStyles[specialization] ||
    "bg-gray-500 hover:bg-gray-600 text-white border-none"
  );
};

const SpecializationBadge = ({
  specialization,
}: {
  specialization: string;
}) => {
  const className = getSpecializationBadgeStyles(specialization);

  return <Badge className={className}>{specialization}</Badge>;
};

export default SpecializationBadge;
