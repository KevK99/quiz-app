package de.kevinKlebula.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CategoryProgressDTO {

    private Long id;
    private String name;

    private long totalQuestions;
    private long correctAnswers;

    private double progressPercentage;
}