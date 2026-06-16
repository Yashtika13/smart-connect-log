package com.smartwifi.attendance.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

public class DeviceDtos {
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class RegisterDeviceRequest {
        @NotBlank private String deviceName;
        @NotBlank private String macAddress;
        private String deviceType;
        private boolean primary;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class DeviceResponse {
        private Long id;
        private String deviceName;
        private String macAddress;
        private String deviceType;
        private boolean primary;
        private boolean verified;
        private LocalDateTime registeredAt;
    }
}
