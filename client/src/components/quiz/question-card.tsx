import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface QuestionCardProps {
  question: string;
  options: string[];
  onAnswer: (answer: string) => void;
  currentAnswer?: string;
}

export function QuestionCard({ question, options, onAnswer, currentAnswer }: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-2xl mx-auto bg-background/80 backdrop-blur-sm border-white/10 shadow-xl">
        <CardHeader className="space-y-4">
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-purple-500">
            {question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={currentAnswer} onValueChange={onAnswer} className="space-y-6">
            {options.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="flex items-center space-x-3 rounded-lg border border-white/10 p-4 hover:bg-white/5 transition-colors">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label 
                    htmlFor={`option-${index}`} 
                    className="text-lg text-white/90 group-hover:text-white transition-colors cursor-pointer w-full"
                  >
                    {option}
                  </Label>
                </div>
              </motion.div>
            ))}
          </RadioGroup>
          {currentAnswer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button 
                className="mt-8 w-full bg-gradient-neo from-orange-500/80 to-purple-500/80 hover:from-orange-500 hover:to-purple-500 text-white"
                onClick={() => onAnswer(currentAnswer)}
              >
                Next Question
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}