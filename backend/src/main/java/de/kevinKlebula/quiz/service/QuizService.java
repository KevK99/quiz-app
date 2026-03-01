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

@Service
@RequiredArgsConstructor
@Slf4j
public class QuizService implements QuizServiceInterface {

    private final CategoryRepository categoryRepository;
    private final QuestionRepository questionRepository;
    private final UserProgressRepository progressRepository;

    @Override
    public List<CategoryProgressDTO> getCategoriesWithProgress(Long userId) {

        return categoryRepository.findAll().stream()
                .map(category -> {

                    long totalQuestions =
                            questionRepository.countByCategoryId(category.getId());

                    long correctAnswers =
                            progressRepository.countByUserIdAndQuestionCategoryIdAndCorrectTrue(
                                    userId,
                                    category.getId()
                            );

                    double percentage = totalQuestions == 0
                            ? 0
                            : (double) correctAnswers / totalQuestions * 100;

                    return CategoryProgressDTO.builder()
                            .id(category.getId())
                            .name(category.getName())
                            .totalQuestions(totalQuestions)
                            .correctAnswers(correctAnswers)
                            .progressPercentage(
                                    Math.round(percentage * 100.0) / 100.0
                            )
                            .build();
                })
                .toList();
    }

    @Override
    public QuestionDTO getNextQuestion(Long categoryId, Long userId) {
        categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category not found with id "
                        )
                );

        List<Category> categories = categoryRepository.findAll();

        for (Category category : categories) {
            long totalQuestions = questionRepository.countByCategoryId(categoryId);

            long correctAnswers =
                    progressRepository.countByUserIdAndQuestionCategoryIdAndCorrectTrue(
                            userId,
                            categoryId
                    );

            double percentage = totalQuestions == 0
                    ? 0
                    : (double) correctAnswers / totalQuestions * 100;

            List<Question> questions =
                    questionRepository.findByCategoryId(category.getId());

            for (Question question : questions) {

                Optional<UserProgress> progress =
                        progressRepository.findByUserIdAndQuestionId(
                                userId,
                                question.getId()
                        );

                if (progress.isEmpty()) {
                    return mapToDTO(question, totalQuestions, correctAnswers, percentage);
                }
            }
        }

        long totalQuestions = questionRepository.findAll().size();

        long correctAnswers =
                progressRepository.countByUserIdAndQuestionCategoryIdAndCorrectTrue(
                        userId,
                        categoryId
                );

        return QuestionDTO.builder()
                .id(null)
                .text("Alle Fragen beantwortet!")
                .answers(List.of())
                .totalQuestions(totalQuestions)
                .correctAnswers(correctAnswers)
                .progressPercentage(100.0)
                .build();
    }

    @Override
    public AnswerResponseDTO answerQuestion(Long questionId,
                                            int selectedIndex,
                                            Long userId) {

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Question not found with id " + questionId)
                );

        if (selectedIndex < 1 || selectedIndex > 4) {
            throw new BadRequestException("Selected index must be between 1 and 4");
        }

        Optional<UserProgress> existing =
                progressRepository.findByUserIdAndQuestionId(userId, questionId);

        if (existing.isPresent()) {
            throw new BadRequestException("Question already answered");
        }

        boolean correct = question.getCorrectIndex() == selectedIndex;

        progressRepository.save(
                UserProgress.builder()
                        .userId(userId)
                        .question(question)
                        .correct(correct)
                        .build()
        );

        return AnswerResponseDTO.builder()
                .correct(correct)
                .correctIndex(question.getCorrectIndex())
                .message(correct ? "Correct answer!" : "Wrong answer!")
                .build();
    }

    private QuestionDTO mapToDTO(Question question, long totalQuestions, long correctAnswers, double percentage) {
        return QuestionDTO.builder()
                .id(question.getId())
                .text(question.getText())
                .answers(List.of(
                        question.getOption1(),
                        question.getOption2(),
                        question.getOption3(),
                        question.getOption4()
                ))
                .totalQuestions(totalQuestions)
                .correctAnswers(correctAnswers)
                .progressPercentage(Math.round(percentage * 100.0) / 100.0)
                .build();
    }
}