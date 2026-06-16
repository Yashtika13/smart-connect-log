package com.smartwifi.attendance.dto;

import com.smartwifi.attendance.entity.LeaveStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class LeaveDtos {
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class LeaveRequestDto {
        @NotNull private LocalDate startDate;
        @NotNull private LocalDate endDate;
        private String reason;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class LeaveResponse {
        private Long id;
        private Long userId;
        private String fullName;
        private LocalDate startDate;
        private LocalDate endDate;
        private String reason;
        private LeaveStatus status;
        private LocalDateTime createdAt;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class LeaveDecision {
        @NotNull private LeaveStatus status; // APPROVED or REJECTED
    }
}
