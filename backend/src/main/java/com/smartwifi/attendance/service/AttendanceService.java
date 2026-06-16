package com.smartwifi.attendance.service;

import com.smartwifi.attendance.config.WifiProperties;
import com.smartwifi.attendance.dto.AttendanceDtos.*;
import com.smartwifi.attendance.entity.*;
import com.smartwifi.attendance.exception.ApiException;
import com.smartwifi.attendance.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;
    private final LeaveRequestRepository leaveRepository;
    private final NotificationService notificationService;
    private final WifiProperties wifiProperties;

    private static final LocalTime LATE_THRESHOLD = LocalTime.of(9, 30);

    @Transactional
    public AttendanceResponse checkIn(Long userId, CheckInRequest req, String ip) {
        if (!wifiProperties.isAuthorized(req.getWifiSsid(), req.getWifiBssid()))
            throw ApiException.forbidden("Connected Wi-Fi network is not authorized");

        Device device = deviceRepository.findByUserIdAndMacAddressIgnoreCase(userId, req.getMacAddress())
                .orElseThrow(() -> ApiException.forbidden("Device not registered for this user"));
        if (!device.isVerified())
            throw ApiException.forbidden("Device pending verification by admin");

        LocalDate today = LocalDate.now();

        // Block check-in if user is on approved leave today
        boolean onLeave = !leaveRepository
                .findByUserIdAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                        userId, LeaveStatus.APPROVED, today, today).isEmpty();
        if (onLeave) throw ApiException.badRequest("You are on approved leave today");

        Attendance att = attendanceRepository.findByUserIdAndAttendanceDate(userId, today)
                .orElseGet(() -> Attendance.builder()
                        .user(userRepository.getReferenceById(userId))
                        .attendanceDate(today).build());

        if (att.getCheckIn() == null) {
            LocalDateTime now = LocalDateTime.now();
            att.setCheckIn(now);
            att.setDevice(device);
            att.setWifiSsid(req.getWifiSsid());
            att.setWifiBssid(req.getWifiBssid());
            att.setIpAddress(ip);
            att.setStatus(now.toLocalTime().isAfter(LATE_THRESHOLD)
                    ? AttendanceStatus.LATE : AttendanceStatus.PRESENT);
            attendanceRepository.save(att);
            notificationService.create(userId, "Attendance Marked",
                    "Your attendance was marked as " + att.getStatus());
        }
        return toDto(att);
    }

    @Transactional
    public AttendanceResponse checkOut(Long userId) {
        LocalDate today = LocalDate.now();
        Attendance att = attendanceRepository.findByUserIdAndAttendanceDate(userId, today)
                .orElseThrow(() -> ApiException.badRequest("No check-in record found for today"));
        if (att.getCheckOut() == null) {
            att.setCheckOut(LocalDateTime.now());
            attendanceRepository.save(att);
        }
        return toDto(att);
    }

    public List<AttendanceResponse> history(Long userId) {
        return attendanceRepository.findByUserIdOrderByAttendanceDateDesc(userId)
                .stream().map(this::toDto).toList();
    }

    public List<AttendanceResponse> allForDate(LocalDate date) {
        return attendanceRepository.findByAttendanceDate(date).stream().map(this::toDto).toList();
    }

    private AttendanceResponse toDto(Attendance a) {
        return AttendanceResponse.builder()
                .id(a.getId())
                .userId(a.getUser().getId())
                .fullName(a.getUser().getFullName())
                .attendanceDate(a.getAttendanceDate())
                .checkIn(a.getCheckIn()).checkOut(a.getCheckOut())
                .wifiSsid(a.getWifiSsid()).wifiBssid(a.getWifiBssid())
                .status(a.getStatus())
                .deviceName(a.getDevice() != null ? a.getDevice().getDeviceName() : null)
                .build();
    }
}
