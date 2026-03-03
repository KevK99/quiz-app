package de.kevinKlebula.quiz.service;

import de.kevinKlebula.quiz.dto.AnswerResponseDTO;
import de.kevinKlebula.quiz.dto.CategoryProgressDTO;
import de.kevinKlebula.quiz.dto.QuestionDTO;
import de.kevinKlebula.quiz.entity.Category;
import de.kevinKlebula.quiz.entity.Question;
import de.kevinKlebula.quiz.entity.UserProgress;
import de.kevinKlebula.quiz.exception.BadRequestException;
import de.kevinKlebula.quiz.exception.ResourceNotFoundException;
import de.kevinKlebula.quiz.repository.CategoryRepository;
import de.kevinKlebula.quiz.repository.QuestionRepository;
import de.kevinKlebula.quiz.repository.UserProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import lombok.extern.slf4j.Slf4j;

@Service           // Spring registers this class as a service bean (can be injected anywhere)
@RequiredArgsConstructor  // Lombok generates a constructor for all final fields → automatic dependency injection
@Slf4j             // Lombok provides a logger: log.info(...), log.error(...) etc.
public class QuizService implements QuizServiceInterface {

    // Spring injects these repositories automatically via the generated constructor
    private final CategoryRepository categoryRepository;
    private final QuestionRepository questionRepository;
    private final UserProgressRepository progressRepository;

    /**
     * Loads all categories and calculates the user's progress for each one.
     * Result is displayed on the HomePage: category name, X/Y correct, progress bar.
     */
    @Override
    public List<CategoryProgressDTO> getCategoriesWithProgress(Long userId) {

        // Load all categories from the DB and convert them to DTOs
        return categoryRepository.findAll().stream()
                .map(category -> {

                    // Total number of questions in this category (e.g. 4)
                    long totalQuestions =
                            questionRepository.countByCategoryId(category.getId());

                    // How many questions has this user answered CORRECTLY?
                    long correctAnswers =
                            progressRepository.countByUserIdAndQuestionCategoryIdAndCorrectTrue(
                                    userId, category.getId()
                            );

                    // Calculate percentage progress, guard against division by zero
                    double percentage = totalQuestions == 0
                            ? 0
                            : (double) correctAnswers / totalQuestions * 100;

                    return CategoryProgressDTO.builder()
                            .id(category.getId())
                            .name(category.getName())
                            .totalQuestions(totalQuestions)
                            .correctAnswers(correctAnswers)
                            .progressPercentage(Math.round(percentage * 100.0) / 100.0) // round to 2 decimal places
                            .build();
                })
                .toList();
    }

    /**
     * Returns the next unanswered question in the selected category.
     *
     * The DTO also includes the current progress data so the frontend
     * can display "Question 3 of 8" and the progress bar correctly —
     * without the frontend having to count manually.
     */
    @Override
    public QuestionDTO getNextQuestion(Long categoryId, Long userId) {

        // Validate that the category exists — throws HTTP 404 if not
        categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id " + categoryId));

        // Load all questions belonging to this category
        List<Question> questions = questionRepository.findByCategoryId(categoryId);

        long totalQuestions = questions.size();

        // Questions the user has answered CORRECTLY → used for the score display
        long correctAnswers =
                progressRepository.countByUserIdAndQuestionCategoryIdAndCorrectTrue(
                        userId, categoryId);

        // ALL answered questions (correct + wrong) → used for "Question X of Y"
        // Example: user answered 2 questions → next one is question 3
        long answeredQuestions =
                progressRepository.countByUserIdAndQuestionCategoryId(
                        userId, categoryId);

        // Progress in % based on answered questions (not just correct ones)
        double percentage = totalQuestions == 0
                ? 0
                : (double) answeredQuestions / totalQuestions * 100;

        // Iterate through questions and return the first one not yet answered
        for (Question question : questions) {
            boolean alreadyAnswered =
                    progressRepository.findByUserIdAndQuestionId(userId, question.getId())
                            .isPresent();

            if (!alreadyAnswered) {
                return mapToDTO(question, totalQuestions, correctAnswers, answeredQuestions, percentage);
            }
        }

        // Loop completed without a match → all questions have been answered
        // id = null signals to the frontend that the category is complete
        return QuestionDTO.builder()
                .id(null)
                .text("All questions answered!")
                .answers(List.of())
                .totalQuestions(totalQuestions)
                .correctAnswers(correctAnswers)
                .answeredQuestions(totalQuestions)
                .progressPercentage(100.0)
                .build();
    }

    /**
     * Receives the user's answer, evaluates it and saves the result.
     */
    @Override
    public AnswerResponseDTO answerQuestion(Long questionId, int selectedIndex, Long userId) {

        // Load the question — throws 404 if it does not exist
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Question not found with id " + questionId));

        // Validation: index must be between 1 and 4 (corresponds to the 4 answer options)
        if (selectedIndex < 1 || selectedIndex > 4) {
            throw new BadRequestException("Selected index must be between 1 and 4");
        }

        // Prevent answering the same question twice (e.g. duplicate API call)
        if (progressRepository.findByUserIdAndQuestionId(userId, questionId).isPresent()) {
            throw new BadRequestException("Question already answered");
        }

        // Evaluate the answer: correctIndex stored in DB is also 1–4
        boolean correct = question.getCorrectIndex() == selectedIndex;

        // Persist the result to the DB
        progressRepository.save(
                UserProgress.builder()
                        .userId(userId)
                        .question(question)
                        .correct(correct)
                        .build()
        );

        return AnswerResponseDTO.builder()
                .correct(correct)
                .correctIndex(question.getCorrectIndex()) // allows frontend to highlight the correct answer
                .message(correct ? "Correct answer!" : "Wrong answer!")
                .build();
    }

    /**
     * Helper method: maps a Question entity to a QuestionDTO for the frontend.
     * Combines the 4 individual option fields (option1–4) into a single list.
     */
    private QuestionDTO mapToDTO(Question question, long totalQuestions,
                                 long correctAnswers, long answeredQuestions,
                                 double percentage) {
        return QuestionDTO.builder()
                .id(question.getId())
                .text(question.getText())
                // Combine the 4 answer options into a list
                .answers(List.of(
                        question.getOption1(),
                        question.getOption2(),
                        question.getOption3(),
                        question.getOption4()
                ))
                .totalQuestions(totalQuestions)
                .correctAnswers(correctAnswers)
                .answeredQuestions(answeredQuestions)
                .progressPercentage(Math.round(percentage * 100.0) / 100.0)
                .build();
    }
}