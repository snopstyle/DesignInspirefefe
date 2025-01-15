import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = (current / total) * 100;

  return (
    <motion.div 
      className="w-full max-w-2xl mx-auto mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between mb-2 text-white/90">
        <span className="text-sm font-medium">Question {current} of {total}</span>
        <span className="text-sm font-medium">{Math.round(progress)}%</span>
      </div>
      <Progress 
        value={progress} 
        className="h-2 bg-white/10" 
      />
      <div className="h-px w-full bg-gradient-to-r from-orange-500/20 via-purple-500/20 to-transparent mt-1" />
    </motion.div>
  );
}