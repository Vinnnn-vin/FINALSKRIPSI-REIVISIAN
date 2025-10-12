// src\app\api\dashboard\student\learn\[enrollmentId]\quiz\submit\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import sequelize from "@/lib/database";
import { QueryTypes } from "sequelize";
import {
  Enrollment,
  Quiz,
  StudentQuizAnswer,
} from "@/models";

// ================== POST: Submit Quiz ==================
export async function POST(
  request: NextRequest,
  { params }: { params: { enrollmentId: string } }
) {
  // Keep existing POST implementation
  const t = await sequelize.transaction();
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "student") {
      await t.rollback();
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const userId = parseInt((session.user as any).id);
    const { enrollmentId } = params;
    const body = await request.json();
    const { quizId, answers } = body;

    if (!quizId || !answers) {
      await t.rollback();
      return NextResponse.json(
        { error: "quizId & answers required" },
        { status: 400 }
      );
    }

    const enrollment = await Enrollment.findOne({
      where: { enrollment_id: enrollmentId, user_id: userId },
      transaction: t,
    });
    if (!enrollment) {
      await t.rollback();
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    const quiz = await Quiz.findByPk(quizId, { transaction: t });
    if (!quiz) {
      await t.rollback();
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const lastAttempt = await StudentQuizAnswer.findOne({
      where: { user_id: userId, quiz_id: quizId },
      attributes: [
        [sequelize.fn("MAX", sequelize.col("attempt_session")), "lastAttempt"],
      ],
      raw: true,
      transaction: t,
    });
    const newAttemptNumber = ((lastAttempt as any)?.lastAttempt || 0) + 1;

    // Simplified scoring without complex associations
    // let correctCount = 0;
    const saveAnswers: any[] = [];

    for (const qid in answers) {
      const qId = parseInt(qid);
      const studentAns = answers[qid];
      
      const currentTimestamp = new Date();

      saveAnswers.push({
        user_id: userId,
        quiz_id: quizId,
        question_id: qId,
        selected_option_id: Array.isArray(studentAns) ? null : studentAns || null,
        answer_text: Array.isArray(studentAns) ? JSON.stringify(studentAns) : null,
        is_correct: 0, // Will be calculated later
        attempt_session: newAttemptNumber,
        score: 0,
        status: "",
        completed_at: currentTimestamp,
        answered_at: currentTimestamp,
      });
    }

    const finalScore = 0; // Will be calculated based on actual correct answers
    const status = "failed"; // Will be updated after proper calculation

    saveAnswers.forEach((ans) => {
      ans.score = finalScore;
      ans.status = status;
    });

    await StudentQuizAnswer.bulkCreate(saveAnswers, { transaction: t });
    await t.commit();

    return NextResponse.json({
      quiz: {
        id: (quiz as any).quiz_id,
        title: (quiz as any).quiz_title,
        passing_score: (quiz as any).passing_score || 70,
      },
      attemptId: newAttemptNumber,
      score: finalScore,
      status,
      attempt_date: new Date().toISOString(),
      message: "Quiz submitted successfully"
    });
  } catch (err) {
    await t.rollback();
    console.error("Quiz Submit Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// ================== GET: Fetch Quiz Result ==================
export async function GET(
  request: NextRequest,
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const userId = parseInt((session.user as any).id);
    const { searchParams } = new URL(request.url);
    const quizId = parseInt(searchParams.get("quizId") || "0");
    const attemptId = parseInt(searchParams.get("attemptId") || "0");

    console.log('=== QUIZ RESULT DEBUG ===');
    console.log('User ID:', userId);
    console.log('Quiz ID:', quizId);
    console.log('Attempt ID:', attemptId);

    if (!quizId || !attemptId) {
      return NextResponse.json(
        { error: "quizId & attemptId required" },
        { status: 400 }
      );
    }

    // Get quiz info
    const quiz = await Quiz.findByPk(quizId);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Get student answers
    const studentAnswers = await StudentQuizAnswer.findAll({
      where: { 
        user_id: userId, 
        quiz_id: quizId, 
        attempt_session: attemptId 
      },
      raw: true,
    });

    console.log('Found student answers:', studentAnswers.length);

    if (!studentAnswers || studentAnswers.length === 0) {
      return NextResponse.json({ 
        error: "Quiz result not found"
      }, { status: 404 });
    }

    // Use direct SQL queries to get questions and options
    const questionsQuery = `
      SELECT question_id, quiz_id, question_text, question_type 
      FROM quiz_questions 
      WHERE quiz_id = ?
      ORDER BY question_id ASC
    `;
    
    const questionsResult = await sequelize.query(questionsQuery, {
      replacements: [quizId],
      type: QueryTypes.SELECT,
    });

    console.log('Questions found:', questionsResult.length);

    const optionsQuery = `
      SELECT option_id, quiz_id, question_id, option_text, is_correct
      FROM quiz_answer_options 
      WHERE quiz_id = ?
      ORDER BY question_id ASC, option_id ASC
    `;

    const optionsResult = await sequelize.query(optionsQuery, {
      replacements: [quizId],
      type: QueryTypes.SELECT,
    });

    console.log('Options found:', optionsResult.length);

    // Type the results properly
    const questions = questionsResult as Array<{
      question_id: number;
      quiz_id: number;
      question_text: string;
      question_type: string;
    }>;

    const options = optionsResult as Array<{
      option_id: number;
      quiz_id: number;
      question_id: number;
      option_text: string;
      is_correct: number;
    }>;

    // Group options by question_id
    const optionsMap = new Map<number, typeof options>();
    options.forEach((option) => {
      if (!optionsMap.has(option.question_id)) {
        optionsMap.set(option.question_id, []);
      }
      optionsMap.get(option.question_id)!.push(option);
    });

    // Build detailed results with score calculation
    let totalCorrect = 0;
    
    const detailedResults = studentAnswers.map((answer: any) => {
      const question = questions.find(q => q.question_id === answer.question_id);
      const questionOptions = optionsMap.get(answer.question_id) || [];
      
      if (!question) {
        console.warn('Question not found:', answer.question_id);
        return {
          question_id: answer.question_id,
          text: `Question ${answer.question_id} (Not found)`,
          question_type: 'unknown',
          selected_option: answer.selected_option_id,
          options: [],
          is_correct: false,
        };
      }
      
      // Handle answer types and calculate correctness
      let selectedOption: number | any[];
      let isCorrect = false;
      
      if (answer.answer_text && answer.answer_text !== 'null') {
        // Checkbox questions - multiple answers
        try {
          const parsed = JSON.parse(answer.answer_text);
          selectedOption = Array.isArray(parsed) ? parsed : [parsed];
          
          // Get correct options for this question
          const correctOptions = questionOptions
            .filter(opt => opt.is_correct === 1)
            .map(opt => opt.option_id);
          
          // Check if selected answers match correct answers exactly
          isCorrect = selectedOption.length === correctOptions.length &&
                     selectedOption.every((id: number) => correctOptions.includes(id));
                     
        } catch {
          selectedOption = answer.selected_option_id;
          isCorrect = false;
        }
      } else {
        // Single choice questions
        selectedOption = answer.selected_option_id;
        
        // Find the selected option and check if it's correct
        const selectedOpt = questionOptions.find(opt => opt.option_id === selectedOption);
        isCorrect = selectedOpt ? selectedOpt.is_correct === 1 : false;
      }
      
      if (isCorrect) {
        totalCorrect++;
      }
      
      return {
        question_id: answer.question_id,
        text: question.question_text,
        question_type: question.question_type,
        selected_option: selectedOption,
        is_correct: isCorrect,
        options: questionOptions.map(opt => ({
          id: opt.option_id,
          text: opt.option_text,
          is_correct: opt.is_correct === 1,
        })),
      };
    });

    detailedResults.sort((a, b) => a.question_id - b.question_id);

    // Calculate actual score
    const totalQuestions = detailedResults.length;
    const actualScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    const passingScore = (quiz as any).passing_score || 70;
    const actualStatus = actualScore >= passingScore ? "passed" : "failed";

    console.log('Score calculation:', {
      totalQuestions,
      totalCorrect,
      actualScore,
      passingScore,
      actualStatus
    });

    const result = {
      quiz: {
        id: quizId,
        title: (quiz as any).quiz_title || "Quiz",
        passing_score: (quiz as any).passing_score || 70,
      },
      attemptId,
      score: actualScore, // Use calculated score
      status: actualStatus, // Use calculated status
      attempt_date: studentAnswers[0].completed_at || new Date(),
      detailedResults,
    };

    console.log('Final result structure:', {
      questionsCount: detailedResults.length,
      firstQuestion: detailedResults[0]?.text?.substring(0, 50),
      firstQuestionOptionsCount: detailedResults[0]?.options?.length,
    });

    return NextResponse.json(result);

  } catch (err) {
    console.error("Quiz Result Error:", err);
    return NextResponse.json(
      { 
        error: "Internal Server Error",
        details: err instanceof Error ? err.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}