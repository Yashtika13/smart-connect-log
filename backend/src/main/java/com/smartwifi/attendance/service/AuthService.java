package com.smartwifi.attendance.service;

import com.smartwifi.attendance.dto.AuthDtos.*;
import com.smartwifi.attendance.entity.User;
import com.smartwifi.attendance.exception.ApiException;
import com.smartwifi.attendance.repository.UserRepository;
import com.smartwifi.attendance.security.JwtUtils;
import com.smartwifi.attendance.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw ApiException.conflict("Email already registered");
        if (userRepository.existsByUsername(req.getUsername()))
            throw ApiException.conflict("Username already taken");

        User u = User.builder()
                .username(req.getUsername())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName())
                .department(req.getDepartment())
                .role(req.getRole())
                .enabled(true)
                .build();
        userRepository.save(u);
        return buildResponse(u);
    }

    public AuthResponse login(LoginRequest req) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsernameOrEmail(), req.getPassword()));
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        User u = userRepository.findById(principal.getId())
                .orElseThrow(() -> ApiException.notFound("User not found"));
        return buildResponse(u);
    }

    private AuthResponse buildResponse(User u) {
        String token = jwtUtils.generateToken(new UserPrincipal(u));
        return AuthResponse.builder()
                .token(token).tokenType("Bearer")
                .userId(u.getId()).username(u.getUsername())
                .email(u.getEmail()).fullName(u.getFullName())
                .role(u.getRole()).build();
    }
}
