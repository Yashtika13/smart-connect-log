package com.smartwifi.attendance.controller;

import com.smartwifi.attendance.dto.LeaveDtos.*;
import com.smartwifi.attendance.security.UserPrincipal;
import com.smartwifi.attendance.service.LeaveService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leaves")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;

    @PostMapping
    public LeaveResponse create(@AuthenticationPrincipal UserPrincipal p, @Valid @RequestBody LeaveRequestDto dto) {
        return leaveService.create(p.getId(), dto);
    }

    @GetMapping("/me")
    public List<LeaveResponse> mine(@AuthenticationPrincipal UserPrincipal p) {
        return leaveService.myRequests(p.getId());
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public List<LeaveResponse> pending() { return leaveService.pending(); }

    @PatchMapping("/{id}/decision")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public LeaveResponse decide(@AuthenticationPrincipal UserPrincipal p,
                                @PathVariable Long id, @Valid @RequestBody LeaveDecision decision) {
        return leaveService.decide(id, p.getId(), decision);
    }
}
