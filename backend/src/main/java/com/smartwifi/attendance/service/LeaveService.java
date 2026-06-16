package com.smartwifi.attendance.service;

import com.smartwifi.attendance.dto.LeaveDtos.*;
import com.smartwifi.attendance.entity.*;
import com.smartwifi.attendance.exception.ApiException;
import com.smartwifi.attendance.repository.LeaveRequestRepository;
import com.smartwifi.attendance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaveService {

    private final LeaveRequestRepository leaveRepo;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public LeaveResponse create(Long userId, LeaveRequestDto dto) {
        if (dto.getEndDate().isBefore(dto.getStartDate()))
            throw ApiException.badRequest("End date must be on/after start date");
        User u = userRepository.findById(userId).orElseThrow(() -> ApiException.notFound("User not found"));
        LeaveRequest l = LeaveRequest.builder()
                .user(u).startDate(dto.getStartDate()).endDate(dto.getEndDate())
                .reason(dto.getReason()).status(LeaveStatus.PENDING).build();
        return toDto(leaveRepo.save(l));
    }

    public List<LeaveResponse> myRequests(Long userId) {
        return leaveRepo.findByUserIdOrderByCreatedAtDesc(userId).stream().map(this::toDto).toList();
    }

    public List<LeaveResponse> pending() {
        return leaveRepo.findByStatusOrderByCreatedAtDesc(LeaveStatus.PENDING).stream().map(this::toDto).toList();
    }

    @Transactional
    public LeaveResponse decide(Long leaveId, Long adminId, LeaveDecision decision) {
        if (decision.getStatus() == LeaveStatus.PENDING)
            throw ApiException.badRequest("Decision must be APPROVED or REJECTED");
        LeaveRequest l = leaveRepo.findById(leaveId)
                .orElseThrow(() -> ApiException.notFound("Leave request not found"));
        l.setStatus(decision.getStatus());
        l.setReviewedBy(adminId);
        leaveRepo.save(l);
        notificationService.create(l.getUser().getId(), "Leave " + decision.getStatus(),
                "Your leave from " + l.getStartDate() + " to " + l.getEndDate() + " was " + decision.getStatus());
        return toDto(l);
    }

    private LeaveResponse toDto(LeaveRequest l) {
        return LeaveResponse.builder()
                .id(l.getId()).userId(l.getUser().getId()).fullName(l.getUser().getFullName())
                .startDate(l.getStartDate()).endDate(l.getEndDate())
                .reason(l.getReason()).status(l.getStatus()).createdAt(l.getCreatedAt()).build();
    }
}
