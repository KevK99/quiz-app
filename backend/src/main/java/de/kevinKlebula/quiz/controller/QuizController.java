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

@RestController              // Combines @Controller + @ResponseBody: always returns JSON
@RequestMapping("/api")      // All endpoints are prefixed with /api
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from the Next.js frontend (CORS)
@RequiredArgsConstructor
public class QuizController {

    private final QuizService service;

    // Hardcoded for now — replace with real authentication later
    private final Long TEST_USER_ID = 1L;

    // GET /api/categories
    // Returns all categories with progress → displayed on the HomePage
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryProgressDTO>>> getCategories() {
        List<CategoryProgressDTO> data = service.getCategoriesWithProgress(TEST_USER_ID);
        return ResponseEntity.ok(ApiResponseFactory.success(data));
    }

    // GET /api/categories/{id}/next-question
    // Returns the next unanswered question for the given category
    @GetMapping("/categories/{id}/next-question")
    public ResponseEntity<?> nextQuestion(@PathVariable Long id) {
        QuestionDTO question = service.getNextQuestion(id, TEST_USER_ID);
        return ResponseEntity.ok(question);
    }

    // POST /api/questions/{id}/answer
    // Receives the selected answer and returns whether it was correct
    @PostMapping("/questions/{id}/answer")
    public AnswerResponseDTO answer(
            @PathVariable Long id,
            @RequestBody AnswerRequestDTO request) { // request body is automatically deserialized from JSON
        return service.answerQuestion(id, request.getSelectedIndex(), TEST_USER_ID);
    }
}