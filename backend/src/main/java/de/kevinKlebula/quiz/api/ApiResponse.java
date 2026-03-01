package de.kevinKlebula.quiz.api;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ApiResponse<T> {

    private boolean success;
    private T data;
    private ApiError error;
    private LocalDateTime timestamp;
}