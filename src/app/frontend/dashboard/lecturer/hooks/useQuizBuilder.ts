// src\app\frontend\dashboard\lecturer\hooks\useQuizBuilder.ts
import { useState } from "react";
import { QuestionType } from "../types/material";

export function useQuizBuilder() {
  const [questions, setQuestions] = useState<QuestionType[]>([]);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: `q-${Date.now()}`,
        text: "",
        type: "multiple_choice",
        options: [
          { id: `o-${Date.now()}-1`, text: "", is_correct: true },
          { id: `o-${Date.now()}-2`, text: "", is_correct: false },
        ],
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuestionText = (index: number, text: string) => {
    const updated = [...questions];
    updated[index].text = text;
    setQuestions(updated);
  };

  const updateQuestionType = (
    index: number,
    type: "multiple_choice" | "checkbox"
  ) => {
    const updated = [...questions];
    updated[index].type = type;
    updated[index].options.forEach((opt, i) => {
      opt.is_correct = type === "multiple_choice" ? i === 0 : opt.is_correct;
    });
    setQuestions(updated);
  };

  const addOption = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options.push({
      id: `o-${Date.now()}`,
      text: "",
      is_correct: false,
    });
    setQuestions(updated);
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const updated = [...questions];
    if (updated[qIndex].options.length > 1) {
      updated[qIndex].options.splice(oIndex, 1);
      setQuestions(updated);
    }
  };

  const toggleCorrectOption = (qIndex: number, oIndex: number) => {
    const updated = [...questions];
    const q = updated[qIndex];

    if (q.type === "multiple_choice") {
      q.options.forEach((opt, i) => {
        opt.is_correct = i === oIndex;
      });
    } else {
      q.options[oIndex].is_correct = !q.options[oIndex].is_correct;
    }

    setQuestions(updated);
  };

  const updateOptionText = (qIndex: number, oIndex: number, text: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex].text = text;
    setQuestions(updated);
  };

  return {
    questions,
    setQuestions,
    addQuestion,
    removeQuestion,
    updateQuestionText,
    updateQuestionType,
    addOption,
    removeOption,
    toggleCorrectOption,
    updateOptionText,
  };
}
