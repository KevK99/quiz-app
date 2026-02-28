package de.kevinKlebula.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AnswerResponseDTO {

    private boolean correct;
    private Integer correctIndex;
    private String message;
}
