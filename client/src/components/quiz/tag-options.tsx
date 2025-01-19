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
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              "border border-white/10 hover:border-white/30",
              "focus:outline-none focus:ring-2 focus:ring-white/20",
              isSelected ? 
                "bg-gradient-to-r from-orange-500/80 to-purple-500/80 text-white" :
                "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
            )}
          >
            {option}
          </motion.button>
        )}
      )}
    </div>
  );
}
