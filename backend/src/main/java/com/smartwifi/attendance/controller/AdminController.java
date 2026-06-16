package com.smartwifi.attendance.controller;

import com.smartwifi.attendance.dto.AnalyticsDtos.DashboardStats;
import com.smartwifi.attendance.entity.User;
import com.smartwifi.attendance.repository.UserRepository;
import com.smartwifi.attendance.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final AnalyticsService analyticsService;

    @GetMapping("/users")
    public List<User> users() { return userRepository.findAll(); }

    @GetMapping("/dashboard")
    public DashboardStats dashboard() { return analyticsService.dashboard(); }

    @PatchMapping("/users/{id}/toggle")
    public User toggle(@PathVariable Long id) {
        User u = userRepository.findById(id).orElseThrow();
        u.setEnabled(!u.isEnabled());
        return userRepository.save(u);
    }
}
