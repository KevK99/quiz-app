package de.kevinKlebula.quiz.api;

import java.time.LocalDateTime;

public class ApiResponseFactory {

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .error(null)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static ApiResponse<Object> error(int status, String message) {
        return ApiResponse.builder()
                .success(false)
                .data(null)
                .error(ApiError.builder()
                        .status(status)
                        .message(message)
                        .build())
                .timestamp(LocalDateTime.now())
                .build();
    }
}

