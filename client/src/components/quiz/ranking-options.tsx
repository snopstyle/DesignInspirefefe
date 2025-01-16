import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";

interface RankingOptionsProps {
  options: string[];
  onRankingChange: (rankedOptions: string[]) => void;
  currentRanking?: string[];
}

export function RankingOptions({ options, onRankingChange, currentRanking = [] }: RankingOptionsProps) {
  const [items, setItems] = useState(currentRanking.length ? currentRanking : options);

  return (
    <Reorder.Group 
      axis="y" 
      values={items} 
      onReorder={(newOrder) => {
        setItems(newOrder);
        onRankingChange(newOrder);
      }}
      className="space-y-2"
    >
      {items.map((item) => (
        <Reorder.Item
          key={item}
          value={item}
          className={cn(
            "flex items-center gap-3 p-4 rounded-lg cursor-move",
            "bg-white/5 hover:bg-white/10 border border-white/10",
            "transition-colors duration-200"
          )}
        >
          <GripVertical className="h-5 w-5 text-white/50" />
          <span className="text-white/90">{item}</span>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}
