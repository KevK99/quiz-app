package de.kevinKlebula.quiz.repository;

import de.kevinKlebula.quiz.entity.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {

    // SELECT * FROM user_progress WHERE user_id = ? AND correct = true
    List<UserProgress> findByUserIdAndCorrectTrue(Long userId);

    // SELECT * FROM user_progress WHERE user_id = ? AND question_id = ?
    // Optional because the entry may not exist (= question not yet answered)
    Optional<UserProgress> findByUserIdAndQuestionId(Long userId, Long questionId);

    // SELECT COUNT(*) ... WHERE user_id = ? AND category_id = ? AND correct = true
    // → For the score: "X questions answered correctly"
    long countByUserIdAndQuestionCategoryIdAndCorrectTrue(Long userId, Long categoryId);

    // SELECT COUNT(*) ... WHERE user_id = ? AND category_id = ?
    // → For the progress bar: "Question X of Y" (all answered, not just correct ones)
    long countByUserIdAndQuestionCategoryId(Long userId, Long categoryId);
}