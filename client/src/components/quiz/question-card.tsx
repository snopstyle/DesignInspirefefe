import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Question } from "@/lib/quiz-logic";
import { useState, useEffect } from "react";
import { TagOptions } from "./tag-options";
import { RankingOptions } from "./ranking-options";

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string | string[], preventSubmit?: boolean) => void;
  currentAnswer?: string | string[];
}

export function QuestionCard({ question, onAnswer, currentAnswer }: QuestionCardProps) {
  const [multipleChoiceAnswers, setMultipleChoiceAnswers] = useState<string[]>([]);

useEffect(() => {
  if (Array.isArray(currentAnswer)) {
    setMultipleChoiceAnswers(currentAnswer);
  } else if (currentAnswer) {
    setMultipleChoiceAnswers([currentAnswer as string]);
  } else {
    setMultipleChoiceAnswers([]);
  }
}, [currentAnswer, question.id]);

  const isMultipleSelectionQuestion = question.format === "Multiple selection";

  useEffect(() => {
    console.log('Question Data:', {
      id: question.id,
      format: question.format,
      optionsCount: question.options.length,
      options: question.options,
      currentAnswers: multipleChoiceAnswers
    });
  }, [question, multipleChoiceAnswers]);

  const shouldUseTagLayout = (question.format === "Multiple choice" || question.format === "Multiple selection") && question.options.length > 8;

  const answerElementStyle =
    "flex items-center justify-center rounded-2xl border border-white/10 p-4 transition-all duration-300 cursor-pointer text-center text-lg font-medium w-full h-full hover:bg-gradient-to-r hover:from-orange-500/30 hover:to-purple-500/30 hover:border-white/50";

  const handleMultipleSelection = (option: string) => {
    let newAnswers;
    const maxSelections = question.maxSelections || 5;

    if (multipleChoiceAnswers.includes(option)) {
      newAnswers = multipleChoiceAnswers.filter(a => a !== option);
    } else if (!maxSelections || multipleChoiceAnswers.length < maxSelections) {
      newAnswers = [...multipleChoiceAnswers, option];
    } else {
      return; // Maximum selections reached
    }

    setMultipleChoiceAnswers(newAnswers);
    if (!isMultipleSelectionQuestion) {
      onAnswer(newAnswers, true);
    }
  };

  const renderAnswerInput = () => {
    switch (question.format) {
      case "Single choice":
        return (
          <ScrollArea className="h-[60vh]">
            <div className="flex flex-col items-center justify-center h-full px-6" data-radix-scroll-area-content>
              <RadioGroup
                value={currentAnswer as string}
                onValueChange={(value) => onAnswer(value)}
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

      case "Multiple selection":
        if (shouldUseTagLayout) {
          return (
            <ScrollArea className="h-[60vh]">
              <TagOptions
                options={question.options}
                selectedOptions={multipleChoiceAnswers}
                onToggle={handleMultipleSelection}
              />
            </ScrollArea>
          );
        }

        return (
          <ScrollArea className="h-[60vh]">
            <div
              className="grid w-full px-6 gap-4"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
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
                  <div
                    className={`${answerElementStyle} ${
                      multipleChoiceAnswers.includes(option) 
                        ? "bg-gradient-to-r from-orange-500/30 to-purple-500/30 border-white/50" 
                        : ""
                    }`}
                    onClick={() => handleMultipleSelection(option)}
                  >
                    <span className="text-white/90 group-hover:text-white transition-colors break-words">
                      {option}
                    </span>
                  </div>
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

      case "Text":
        return (
          <Input
            value={currentAnswer as string}
            onChange={(e) => onAnswer(e.target.value)}
            placeholder="Tapez votre réponse ici..."
            className="w-full max-w-md mx-auto rounded-2xl p-6"
          />
        );
      default:
        return null;
    }
  };

  const hasValidAnswer = () => {
    switch (question.format) {
      case "Multiple selection":
        return multipleChoiceAnswers.length > 0 && multipleChoiceAnswers.length <= (question.maxSelections || 5);
      case "Single choice":
        return false; // Ne pas afficher le bouton pour les questions à choix simple
      case "Drag-and-drop ranking":
        return Array.isArray(currentAnswer) && currentAnswer.length === question.options.length;
      case "Text":
        return Boolean(currentAnswer && (currentAnswer as string).trim());
      default:
        return false;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-full max-w-2xl mx-auto"
    >

      <Card className="bg-background/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
        <CardHeader className="space-y-6">
          <motion.div
            key={question.text}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-purple-500">
              {question.text}
            </CardTitle>
          </motion.div>
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
                className="w-full bg-gradient-neo from-orange-500/90 to-purple-500/90 hover:from-orange-600 hover:to-purple-600 text-white rounded-2xl p-6 text-lg font-medium shadow-md"
                onClick={() => {
                  if (isMultipleSelectionQuestion) {
                    onAnswer(multipleChoiceAnswers, false);
                  } else {
                    onAnswer(currentAnswer!, false);
                  }
                }}
              >
                {question.id === 37 ? (
                  <>
                    Terminer le Quiz
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Question Suivante
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