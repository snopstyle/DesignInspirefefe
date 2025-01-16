import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Question, QuestionFormat } from "@/lib/quiz-logic";
import { useState } from "react";

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string | string[]) => void;
  currentAnswer?: string | string[];
}

export function QuestionCard({ question, onAnswer, currentAnswer }: QuestionCardProps) {
  const [multipleChoiceAnswers, setMultipleChoiceAnswers] = useState<string[]>(
    Array.isArray(currentAnswer) ? currentAnswer : []
  );

  const renderAnswerInput = () => {
    switch (question.format as QuestionFormat) {
      case "Single choice":
        return (
          <RadioGroup 
            value={currentAnswer as string} 
            onValueChange={onAnswer} 
            className="space-y-6"
          >
            {question.options.map((option, index) => (
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
        );

      case "Multiple choice":
        return (
          <div className="space-y-6">
            {question.options.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="flex items-center space-x-3 rounded-lg border border-white/10 p-4 hover:bg-white/5 transition-colors">
                  <Checkbox
                    id={`option-${index}`}
                    checked={multipleChoiceAnswers.includes(option)}
                    onCheckedChange={(checked) => {
                      const newAnswers = checked
                        ? [...multipleChoiceAnswers, option]
                        : multipleChoiceAnswers.filter(a => a !== option);
                      setMultipleChoiceAnswers(newAnswers);
                      onAnswer(newAnswers);
                    }}
                  />
                  <Label 
                    htmlFor={`option-${index}`}
                    className="text-lg text-white/90 group-hover:text-white transition-colors cursor-pointer w-full"
                  >
                    {option}
                  </Label>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case "Scale":
        return (
          <div className="space-y-8">
            <Slider
              min={1}
              max={5}
              step={1}
              value={[parseInt(currentAnswer as string) || 3]}
              onValueChange={(value) => onAnswer(value[0].toString())}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-white/70">
              {question.options.map((label, index) => (
                <span key={index}>{label}</span>
              ))}
            </div>
          </div>
        );

      case "Text":
        return (
          <Input
            value={currentAnswer as string}
            onChange={(e) => onAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full"
          />
        );

      default:
        return null;
    }
  };

  const hasValidAnswer = () => {
    switch (question.format) {
      case "Single choice":
        return Boolean(currentAnswer);
      case "Multiple choice":
        return Array.isArray(multipleChoiceAnswers) && multipleChoiceAnswers.length > 0;
      case "Scale":
        return Boolean(currentAnswer);
      case "Text":
        return Boolean(currentAnswer && (currentAnswer as string).trim());
      default:
        return false;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-2xl mx-auto bg-background/80 backdrop-blur-sm border-white/10 shadow-xl">
        <CardHeader className="space-y-4">
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-purple-500">
            {question.text}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            {renderAnswerInput()}
          </div>
          {hasValidAnswer() && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button 
                className="w-full bg-gradient-neo from-orange-500/80 to-purple-500/80 hover:from-orange-500 hover:to-purple-500 text-white"
                onClick={() => onAnswer(currentAnswer!)}
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