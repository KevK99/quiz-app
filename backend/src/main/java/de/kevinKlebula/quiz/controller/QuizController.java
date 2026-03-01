package de.kevinKlebula.quiz.controller;

import de.kevinKlebula.quiz.api.ApiResponse;
import de.kevinKlebula.quiz.api.ApiResponseFactory;
import de.kevinKlebula.quiz.dto.AnswerRequestDTO;
import de.kevinKlebula.quiz.dto.AnswerResponseDTO;
import de.kevinKlebula.quiz.dto.CategoryProgressDTO;
import de.kevinKlebula.quiz.dto.QuestionDTO;
import de.kevinKlebula.quiz.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService service;

    private final Long TEST_USER_ID = 1L;

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryProgressDTO>>> getCategories() {

        List<CategoryProgressDTO> data =
                service.getCategoriesWithProgress(TEST_USER_ID);

        return ResponseEntity.ok(
                ApiResponseFactory.success(data)
        );
    }

    @GetMapping("/categories/{id}/next-question")
    public ResponseEntity<?> nextQuestion(@PathVariable Long id) {
        QuestionDTO question = service.getNextQuestion(id, TEST_USER_ID);

        return ResponseEntity.ok(Objects.requireNonNullElse(question, "Alle Fragen richtig beantwortet 🎉"));

    }

    @PostMapping("/questions/{id}/answer")
    public AnswerResponseDTO answer(
            @PathVariable Long id,
            @RequestBody AnswerRequestDTO request) {

        return service.answerQuestion(id, request.getSelectedIndex(), TEST_USER_ID);
    }
}
