import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface QuestionCardProps {
  question: string;
  options: string[];
  onAnswer: (answer: string) => void;
  currentAnswer?: string;
}

export function QuestionCard({ question, options, onAnswer, currentAnswer }: QuestionCardProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto bg-background/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{question}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={currentAnswer} onValueChange={onAnswer}>
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 mb-4">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="text-lg">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
        {currentAnswer && (
          <Button 
            className="mt-4 w-full"
            onClick={() => onAnswer(currentAnswer)}
          >
            Next Question
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
