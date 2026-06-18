package com.smartwifi.attendance.controller;

import com.smartwifi.attendance.dto.AnalyticsDtos.DashboardStats;
import com.smartwifi.attendance.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public DashboardStats dashboard() { return analyticsService.dashboard(); }
}
