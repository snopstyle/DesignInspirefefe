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
    <div className="flex flex-col h-[calc(100vh-300px)]">
      <div className="flex-1 overflow-auto">
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
              "bg-white/15 hover:bg-white/30 shadow-md hover:shadow-lg transition-all",
              "transition-colors duration-200"
            )}
          >
            <GripVertical className="h-5 w-5 text-white/50" />
            <span className="text-white/90">{item}</span>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-4"
      >
        <Button
          className="w-full bg-gradient-neo from-orange-500/80 to-purple-500/80 hover:from-orange-500 hover:to-purple-500 text-white"
          onClick={handleUpdate}
        >
          Valider le Classement
        </Button>
      </motion.div>
    </div>
  );
}