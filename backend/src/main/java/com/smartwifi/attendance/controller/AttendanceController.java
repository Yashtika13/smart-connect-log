package com.smartwifi.attendance.controller;

import com.smartwifi.attendance.dto.AttendanceDtos.*;
import com.smartwifi.attendance.security.UserPrincipal;
import com.smartwifi.attendance.service.AttendanceService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/check-in")
    public AttendanceResponse checkIn(@AuthenticationPrincipal UserPrincipal p,
                                      @Valid @RequestBody CheckInRequest req,
                                      HttpServletRequest http) {
        return attendanceService.checkIn(p.getId(), req, http.getRemoteAddr());
    }

    @PostMapping("/check-out")
    public AttendanceResponse checkOut(@AuthenticationPrincipal UserPrincipal p) {
        return attendanceService.checkOut(p.getId());
    }

    @GetMapping("/me")
    public List<AttendanceResponse> myHistory(@AuthenticationPrincipal UserPrincipal p) {
        return attendanceService.history(p.getId());
    }

    @GetMapping("/by-date")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public List<AttendanceResponse> byDate(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return attendanceService.allForDate(date);
    }
}
