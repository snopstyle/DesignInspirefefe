import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TagOptionsProps {
  options: string[];
  selectedOptions: string[];
  onToggle: (option: string) => void;
}

export function TagOptions({ options, selectedOptions, onToggle }: TagOptionsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 px-6">
      {options.map((option, index) => {
        const isSelected = selectedOptions.includes(option);
        return (
          <motion.button
            key={index}
            onClick={() => onToggle(option)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              "border border-white/20", // Increased border opacity
              "focus:outline-none focus:ring-2 focus:ring-white/40", // Increased focus ring opacity
              isSelected ? 
                "bg-gradient-to-r from-orange-500/40 to-purple-500/40 text-white border-white/50 shadow-md" : // Increased opacity and added shadow
                "bg-white/10 hover:bg-gradient-to-r hover:from-orange-500/40 hover:to-purple-500/40 hover:border-white/50 text-white/80 hover:text-white shadow-sm hover:shadow-md" // Increased opacity, added shadow and hover effects
            )}
          >
            {option}
          </motion.button>
        )}
      )}
    </div>
  );
}