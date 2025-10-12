// src\models\index.ts

import User from "./User";
import Course from "./Course";
import Category from "./Category";
import Enrollment from "./Enrollment";
import Material from "./Material";
import MaterialDetail from "./MaterialDetail";
import Payment from "./Payment";
import Certificate from "./Certificate";
import Quiz from "./Quiz";
import QuizQuestion from "./QuizQuestion";
import QuizAnswerOption from "./QuizAnswerOption";
import StudentQuizAnswer from "./StudentQuizAnswer";
import StudentProgress from "./StudentProgress";
import Notification from "./Notification";
import Review from "./Review";
import { Assignment } from "./Assignment";
import { AssignmentSubmission } from "./AssignmentSubmission";

// 2. Definisikan SEMUA asosiasi di satu tempat

// ======= USER ASSOCIATIONS =======
// User <-> Course (instructor relationship)
User.hasMany(Course, {
  foreignKey: "user_id",
  as: "courses",
});
Course.belongsTo(User, {
  foreignKey: "user_id",
  as: "lecturer",
});

// User <-> Enrollment
User.hasMany(Enrollment, {
  foreignKey: "user_id",
  as: "enrollments",
});
Enrollment.belongsTo(User, {
  foreignKey: "user_id",
  as: "student",
});

// User <-> Payment
User.hasMany(Payment, {
  foreignKey: "user_id",
  as: "payments",
});
Payment.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// User <-> Notification
User.hasMany(Notification, {
  foreignKey: "user_id",
  as: "notifications",
});
Notification.belongsTo(User, {
  foreignKey: "user_id",
  as: "recipient",
});

// User <-> Review
User.hasMany(Review, {
  foreignKey: "user_id",
  as: "reviews",
});
Review.belongsTo(User, {
  foreignKey: "user_id",
  as: "reviewer",
});

// User <-> Certificate
User.hasMany(Certificate, {
  foreignKey: "user_id",
  as: "certificates",
});
Certificate.belongsTo(User, {
  foreignKey: "user_id",
  as: "recipient",
});

// User <-> StudentProgress
User.hasMany(StudentProgress, {
  foreignKey: "user_id",
  as: "progress",
});
StudentProgress.belongsTo(User, {
  foreignKey: "user_id",
  as: "student",
});

// User <-> StudentQuizAnswer
User.hasMany(StudentQuizAnswer, {
  foreignKey: "user_id",
  as: "quizAnswers",
});
StudentQuizAnswer.belongsTo(User, {
  foreignKey: "user_id",
  as: "student",
});

// ✅ User <-> AssignmentSubmission (as student)
User.hasMany(AssignmentSubmission, {
  foreignKey: "user_id",
  as: "assignmentSubmissions",
});
AssignmentSubmission.belongsTo(User, {
  foreignKey: "user_id",
  as: "student",
});

// ✅ User <-> AssignmentSubmission (as reviewer/instructor)
User.hasMany(AssignmentSubmission, {
  foreignKey: "reviewed_by",
  as: "reviewedSubmissions",
});
AssignmentSubmission.belongsTo(User, {
  foreignKey: "reviewed_by",
  as: "reviewer",
});

// ======= COURSE ASSOCIATIONS =======
// Category <-> Course
Category.hasMany(Course, {
  foreignKey: "category_id",
  as: "courses",
});
Course.belongsTo(Category, {
  foreignKey: "category_id",
  as: "category",
});

// Course <-> Enrollment
Course.hasMany(Enrollment, {
  foreignKey: "course_id",
  as: "enrollments",
});
Enrollment.belongsTo(Course, {
  foreignKey: "course_id",
  as: "course",
});

// Course <-> Payment
Course.hasMany(Payment, {
  foreignKey: "course_id",
  as: "payments",
});
Payment.belongsTo(Course, {
  foreignKey: "course_id",
  as: "course",
});

// Course <-> Material
Course.hasMany(Material, {
  foreignKey: "course_id",
  as: "materials",
});
Material.belongsTo(Course, {
  foreignKey: "course_id",
  as: "course",
});

// Course <-> Quiz
Course.hasMany(Quiz, {
  foreignKey: "course_id",
  as: "quizzes",
});
Quiz.belongsTo(Course, {
  foreignKey: "course_id",
  as: "course",
});

// Course <-> Review
Course.hasMany(Review, {
  foreignKey: "course_id",
  as: "reviews",
});
Review.belongsTo(Course, {
  foreignKey: "course_id",
  as: "course",
});

// Course <-> Certificate
Course.hasMany(Certificate, {
  foreignKey: "course_id",
  as: "certificates",
});
Certificate.belongsTo(Course, {
  foreignKey: "course_id",
  as: "course",
});

// Course <-> StudentProgress
Course.hasMany(StudentProgress, {
  foreignKey: "course_id",
  as: "progress",
});
StudentProgress.belongsTo(Course, {
  foreignKey: "course_id",
  as: "course",
});

// ✅ Course <-> AssignmentSubmission
Course.hasMany(AssignmentSubmission, {
  foreignKey: "course_id",
  as: "assignmentSubmissions",
});
AssignmentSubmission.belongsTo(Course, {
  foreignKey: "course_id",
  as: "course",
});

// ======= ENROLLMENT ASSOCIATIONS =======
// Enrollment <-> Payment
Enrollment.hasMany(Payment, {
  foreignKey: "enrollment_id",
  as: "payments",
});
Payment.belongsTo(Enrollment, {
  foreignKey: "enrollment_id",
  as: "enrollment",
});

// Enrollment <-> Certificate
Enrollment.hasOne(Certificate, {
  foreignKey: "enrollment_id",
  as: "certificate",
});
Certificate.belongsTo(Enrollment, {
  foreignKey: "enrollment_id",
  as: "enrollment",
});

// ✅ Enrollment <-> AssignmentSubmission
Enrollment.hasMany(AssignmentSubmission, {
  foreignKey: "enrollment_id",
  as: "assignmentSubmissions",
});
AssignmentSubmission.belongsTo(Enrollment, {
  foreignKey: "enrollment_id",
  as: "enrollment",
});

// ======= MATERIAL ASSOCIATIONS =======
// Material <-> MaterialDetail
Material.hasMany(MaterialDetail, {
  foreignKey: "material_id",
  as: "details",
});
MaterialDetail.belongsTo(Material, {
  foreignKey: "material_id",
  as: "material",
});

// Material <-> Quiz
Material.hasMany(Quiz, {
  foreignKey: "material_id",
  as: "quizzes",
});
Quiz.belongsTo(Material, {
  foreignKey: "material_id",
  as: "material",
});

// MaterialDetail <-> StudentProgress
MaterialDetail.hasMany(StudentProgress, {
  foreignKey: "material_detail_id",
  as: "progress",
});
StudentProgress.belongsTo(MaterialDetail, {
  foreignKey: "material_detail_id",
  as: "materialDetail",
});

// MaterialDetail <-> Assignment
MaterialDetail.hasOne(Assignment, {
  foreignKey: "material_detail_id",
  as: "assignment",
});
Assignment.belongsTo(MaterialDetail, {
  foreignKey: "material_detail_id",
  as: "detail",
});

// ✅ MaterialDetail <-> AssignmentSubmission
MaterialDetail.hasMany(AssignmentSubmission, {
  foreignKey: "material_detail_id",
  as: "assignmentSubmissions",
});
AssignmentSubmission.belongsTo(MaterialDetail, {
  foreignKey: "material_detail_id",
  as: "materialDetail",
});

// ======= QUIZ ASSOCIATIONS =======
// Quiz <-> QuizQuestion
Quiz.hasMany(QuizQuestion, {
  foreignKey: "quiz_id",
  as: "questions",
});
QuizQuestion.belongsTo(Quiz, {
  foreignKey: "quiz_id",
  as: "quiz",
});

// Quiz <-> QuizAnswerOption (direct relationship for some operations)
Quiz.hasMany(QuizAnswerOption, {
  foreignKey: "quiz_id",
  as: "answerOptions",
});
QuizAnswerOption.belongsTo(Quiz, {
  foreignKey: "quiz_id",
  as: "quiz",
});

// ✅ PENTING: Quiz <-> StudentQuizAnswer
Quiz.hasMany(StudentQuizAnswer, {
  foreignKey: "quiz_id",
  as: "studentAnswers",
});
StudentQuizAnswer.belongsTo(Quiz, {
  foreignKey: "quiz_id",
  as: "quiz",
});

// ======= QUIZ QUESTION ASSOCIATIONS =======
// QuizQuestion <-> QuizAnswerOption
QuizQuestion.hasMany(QuizAnswerOption, {
  foreignKey: "question_id",
  as: "answerOptions",
});
QuizAnswerOption.belongsTo(QuizQuestion, {
  foreignKey: "question_id",
  as: "question",
});

// QuizQuestion <-> StudentQuizAnswer
QuizQuestion.hasMany(StudentQuizAnswer, {
  foreignKey: "question_id",
  as: "studentAnswers",
});
StudentQuizAnswer.belongsTo(QuizQuestion, {
  foreignKey: "question_id",
  as: "question",
});

// ======= QUIZ ANSWER OPTION ASSOCIATIONS =======
// QuizAnswerOption <-> StudentQuizAnswer
QuizAnswerOption.hasMany(StudentQuizAnswer, {
  foreignKey: "selected_option_id",
  as: "studentAnswers",
});
StudentQuizAnswer.belongsTo(QuizAnswerOption, {
  foreignKey: "selected_option_id",
  as: "selectedOption",
});

// 3. Export semua model
export {
  User,
  Course,
  Category,
  Enrollment,
  Material,
  MaterialDetail,
  Payment,
  Certificate,
  Quiz,
  QuizQuestion,
  QuizAnswerOption,
  StudentQuizAnswer,
  StudentProgress,
  Notification,
  Review,
  Assignment,
  AssignmentSubmission,
};