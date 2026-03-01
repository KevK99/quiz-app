package de.kevinKlebula.quiz.api;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApiError {

    private int status;
    private String message;
}