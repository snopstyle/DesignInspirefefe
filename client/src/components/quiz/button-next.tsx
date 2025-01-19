import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ButtonNextProps {
  onClick: () => void;
  disabled?: boolean;
}

export function ButtonNext({ onClick, disabled }: ButtonNextProps) {
  return (
    <Button 
      onClick={onClick}
      disabled={disabled}
      className="w-full mt-4"
    >
      Question suivante
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  );
}
