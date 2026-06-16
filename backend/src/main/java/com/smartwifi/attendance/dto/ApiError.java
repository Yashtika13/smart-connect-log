package com.smartwifi.attendance.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ApiError {
    private int status;
    private String error;
    private String message;
    private String path;
    private long timestamp;
}
