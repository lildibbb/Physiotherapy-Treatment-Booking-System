import { Badge } from "@/components/ui/badge";

const getRoleBadgeStyles = (role: string): string => {
  const roleStyles: { [key: string]: string } = {
    administrator: "bg-red-500 hover:bg-red-600 text-white border-none",
    manager: "bg-blue-500 hover:bg-blue-600 text-white border-none",
    supervisor: "bg-purple-500 hover:bg-purple-600 text-white border-none",
    staff: "bg-green-500 hover:bg-green-600 text-white border-none",
    "customer service":
      "bg-orange-500 hover:bg-orange-600 text-white border-none",
    accountant: "bg-teal-500 hover:bg-teal-600 text-white border-none",
  };

  return (
    roleStyles[role.toLowerCase()] ||
    "bg-gray-500 hover:bg-gray-600 text-white border-none"
  );
};

const RoleBadge = ({ role }: { role: string }) => {
  const className = getRoleBadgeStyles(role);

  return <Badge className={className}>{role}</Badge>;
};

export default RoleBadge;
