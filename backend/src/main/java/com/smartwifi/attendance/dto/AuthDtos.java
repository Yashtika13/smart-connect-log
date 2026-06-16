package com.smartwifi.attendance.dto;

import com.smartwifi.attendance.entity.Role;
import jakarta.validation.constraints.*;
import lombok.*;

public class AuthDtos {
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class RegisterRequest {
        @NotBlank @Size(min = 3, max = 80) private String username;
        @NotBlank @Email private String email;
        @NotBlank @Size(min = 6, max = 120) private String password;
        @NotBlank private String fullName;
        private String department;
        @NotNull private Role role;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class LoginRequest {
        @NotBlank private String usernameOrEmail;
        @NotBlank private String password;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class AuthResponse {
        private String token;
        private String tokenType;
        private Long userId;
        private String username;
        private String email;
        private String fullName;
        private Role role;
    }
}
