import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const Spinner = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-16 w-16",
  };

  return (
    <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
  );
};

export default Spinner;
