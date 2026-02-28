package de.kevinKlebula.quiz.service;

import de.kevinKlebula.quiz.dto.AnswerResponseDTO;
import de.kevinKlebula.quiz.dto.CategoryProgressDTO;
import de.kevinKlebula.quiz.dto.QuestionDTO;

import java.util.List;

public interface QuizService {

    List<CategoryProgressDTO> getCategoriesWithProgress(Long userId);

    QuestionDTO getNextQuestion(Long categoryId, Long userId);

    AnswerResponseDTO answerQuestion(Long questionId, int selectedIndex, Long userId);
}
