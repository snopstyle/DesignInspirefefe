
import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RankingOptionsProps {
  options: string[];
  onRankingChange: (rankedOptions: string[]) => void;
  currentRanking?: string[];
}

export function RankingOptions({ options, onRankingChange, currentRanking = [] }: RankingOptionsProps) {
  const [items, setItems] = useState(currentRanking.length ? currentRanking : options);

  const handleReorder = (newOrder: string[]) => {
    setItems(newOrder);
  };

  const handleUpdate = () => {
    onRankingChange(items);
  };

  return (
    <div className="space-y-6">
      <Reorder.Group 
        axis="y" 
        values={items} 
        onReorder={handleReorder}
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          className="w-full bg-gradient-neo from-orange-500/80 to-purple-500/80 hover:from-orange-500 hover:to-purple-500 text-white"
          onClick={handleUpdate}
        >
          Validate Ranking
        </Button>
      </motion.div>
    </div>
  );
}
