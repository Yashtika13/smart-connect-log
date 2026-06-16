package com.smartwifi.attendance.controller;

import com.smartwifi.attendance.entity.Notification;
import com.smartwifi.attendance.security.UserPrincipal;
import com.smartwifi.attendance.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/me")
    public List<Notification> mine(@AuthenticationPrincipal UserPrincipal p) {
        return notificationService.listForUser(p.getId());
    }

    @GetMapping("/me/unread-count")
    public Map<String, Long> unread(@AuthenticationPrincipal UserPrincipal p) {
        return Map.of("count", notificationService.unreadCount(p.getId()));
    }

    @PatchMapping("/{id}/read")
    public void markRead(@PathVariable Long id) { notificationService.markRead(id); }
}
