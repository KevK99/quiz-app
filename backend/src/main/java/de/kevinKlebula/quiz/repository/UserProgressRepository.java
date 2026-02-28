package de.kevinKlebula.quiz.repository;

import de.kevinKlebula.quiz.entity.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {

    List<UserProgress> findByUserIdAndCorrectTrue(Long userId);

    Optional<UserProgress> findByUserIdAndQuestionId(Long userId, Long questionId);

    long countByUserIdAndQuestionCategoryIdAndCorrectTrue(Long userId, Long categoryId);
}