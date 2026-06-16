package com.smartwifi.attendance.dto;

import com.smartwifi.attendance.entity.AttendanceStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class AttendanceDtos {
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class CheckInRequest {
        @NotBlank private String macAddress;
        @NotBlank private String wifiSsid;
        private String wifiBssid;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class AttendanceResponse {
        private Long id;
        private Long userId;
        private String fullName;
        private LocalDate attendanceDate;
        private LocalDateTime checkIn;
        private LocalDateTime checkOut;
        private String wifiSsid;
        private String wifiBssid;
        private AttendanceStatus status;
        private String deviceName;
    }
}
