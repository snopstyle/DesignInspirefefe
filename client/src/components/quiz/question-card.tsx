import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Question, QuestionFormat } from "@/lib/quiz-logic";
import { useState, useEffect } from "react";
import { TagOptions } from "./tag-options";
import { RankingOptions } from "./ranking-options";
import { parseSliderOptions } from "@/lib/quiz-logic";

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string | string[], preventSubmit?: boolean) => void; // Added preventSubmit
  currentAnswer?: string | string[];
}

export function QuestionCard({ question, onAnswer, currentAnswer }: QuestionCardProps) {
  const [multipleChoiceAnswers, setMultipleChoiceAnswers] = useState<string[]>(
    Array.isArray(currentAnswer) ? currentAnswer : []
  );

  useEffect(() => {
    console.log('Question Data:', {
      id: question.id,
      format: question.format,
      optionsCount: question.options.length,
      options: question.options
    });
  }, [question]);

  const shouldUseTagLayout = (question.format === "Multiple choice" || question.format === "Multiple selection") && question.options.length > 8;

  // Standardized styling for answer elements
  const answerElementStyle =
    "flex items-center justify-center rounded-2xl border border-white/10 p-4 hover:bg-white/5 transition-colors cursor-pointer text-center text-lg font-medium w-full h-full"; // Full width and height

  const renderAnswerInput = () => {
    switch (question.format as QuestionFormat) {
      case "Single choice":
        return (
          <ScrollArea className="h-[60vh]">
            <div
              className="flex flex-col items-center justify-center h-full px-6"
              data-radix-scroll-area-content
            >
              <RadioGroup
                value={currentAnswer as string}
                onValueChange={(value) => {
                  if (question.format === "Single choice") {
                    onAnswer(value);
                  }
                }}
                className="space-y-4 w-full max-w-2xl mx-auto"
              >
                {question.options.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <Label
                      htmlFor={`option-${index}`}
                      className={answerElementStyle}
                      onClick={() => onAnswer(option)}
                    >
                      <span className="text-white/90 group-hover:text-white transition-colors break-words">
                        {option}
                      </span>
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
            </div>
          </ScrollArea>
        );

      case "Multiple choice":
      case "Multiple selection":
        if (shouldUseTagLayout) {
          return (
            <ScrollArea className="h-[60vh]">
              <TagOptions
                options={question.options}
                selectedOptions={multipleChoiceAnswers}
                onToggle={(option) => {
                  const newAnswers = multipleChoiceAnswers.includes(option)
                    ? multipleChoiceAnswers.filter(a => a !== option)
                    : [...multipleChoiceAnswers, option];
                  console.log('Toggled option:', option, 'New answers:', newAnswers);
                  setMultipleChoiceAnswers(newAnswers);
                  onAnswer(newAnswers, true); // Prevent auto-submit
                }}
              />
            </ScrollArea>
          );
        }

        return (
          <ScrollArea className="h-[60vh]">
            <div
              className="grid w-full px-6 gap-4"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", // Dynamically adjust columns
              }}
            >
              {question.options.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Label
                    htmlFor={`option-${index}`}
                    className={answerElementStyle}
                    onClick={() => {
                      const newAnswers = multipleChoiceAnswers.includes(option)
                        ? multipleChoiceAnswers.filter(a => a !== option)
                        : [...multipleChoiceAnswers, option];
                      setMultipleChoiceAnswers(newAnswers);
                      onAnswer(newAnswers, true); // Prevent auto-submit
                    }}
                  >
                    <span className="text-white/90 group-hover:text-white transition-colors break-words">
                      {option}
                    </span>
                  </Label>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        );

      case "Drag-and-drop ranking":
        return (
          <ScrollArea className="h-[60vh]">
            <RankingOptions
              options={question.options}
              currentRanking={Array.isArray(currentAnswer) ? currentAnswer : []}
              onRankingChange={onAnswer}
            />
          </ScrollArea>
        );

      case "Scale":
        return (
          <div className="space-y-6 w-full max-w-md mx-auto px-6">
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
            className="w-full max-w-md mx-auto rounded-2xl p-6"
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
      case "Multiple selection":
        return Array.isArray(multipleChoiceAnswers) && multipleChoiceAnswers.length > 0;
      case "Drag-and-drop ranking":
        return Array.isArray(currentAnswer) && currentAnswer.length === question.options.length;
      case "Scale":
        return Boolean(currentAnswer);
      case "Text":
        return Boolean(currentAnswer && (currentAnswer as string).trim());
      case "Slider":
        const value = parseInt(currentAnswer as string);
        const { min, max } = parseSliderOptions(question.options[0]);
        return !isNaN(value) && value >= min && value <= max;
      default:
        return false;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-6 text-center"
      >
        <span className="inline-block px-6 py-3 rounded-2xl bg-gradient-neo from-orange-500/40 to-purple-500/40 backdrop-blur-md text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-500 text-lg font-bold border border-white/20 shadow-lg">
          {question.section}
        </span>
      </motion.div>
      <Card className="bg-background/80 backdrop-blur-sm border-white/10 shadow-xl rounded-2xl">
        <CardHeader className="space-y-6">
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-purple-500">
            {question.text}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 px-0">
          <div className="mb-8">
            {renderAnswerInput()}
          </div>
          {hasValidAnswer() && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="px-6"
            >
              <Button
                className="w-full bg-gradient-neo from-orange-500/80 to-purple-500/80 hover:from-orange-500 hover:to-purple-500 text-white rounded-2xl p-6 text-lg font-medium"
                onClick={() => onAnswer(currentAnswer!, false)} // Added false to prevent auto-submit on "Finish Quiz"
              >
                {question.id === 55 ? (
                  <>
                    Finish Quiz
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Next Question
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}