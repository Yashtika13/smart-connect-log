package com.smartwifi.attendance.service;

import com.smartwifi.attendance.dto.AnalyticsDtos.*;
import com.smartwifi.attendance.entity.AttendanceStatus;
import com.smartwifi.attendance.entity.Role;
import com.smartwifi.attendance.repository.AttendanceRepository;
import com.smartwifi.attendance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final UserRepository userRepository;
    private final AttendanceRepository attendanceRepository;

    public DashboardStats dashboard() {
        LocalDate today = LocalDate.now();
        long total = userRepository.count();
        long students = userRepository.countByRole(Role.STUDENT);
        long staff = userRepository.countByRole(Role.STAFF);
        long present = attendanceRepository.countByAttendanceDateAndStatus(today, AttendanceStatus.PRESENT);
        long late = attendanceRepository.countByAttendanceDateAndStatus(today, AttendanceStatus.LATE);
        long leave = attendanceRepository.countByAttendanceDateAndStatus(today, AttendanceStatus.ON_LEAVE);
        long absent = Math.max(0, total - present - late - leave);
        double rate = total == 0 ? 0 : ((present + late) * 100.0) / total;

        List<Object[]> rows = attendanceRepository.aggregateBetween(today.minusDays(6), today);
        List<DailyPoint> series = new ArrayList<>();
        for (Object[] r : rows) {
            Object d = r[0];
            String dateStr = (d instanceof LocalDate ld) ? ld.toString()
                    : (d instanceof Date sd) ? sd.toLocalDate().toString() : String.valueOf(d);
            series.add(new DailyPoint(dateStr, ((Number) r[1]).longValue()));
        }

        Map<String, Long> byDept = new LinkedHashMap<>();
        for (Object[] r : attendanceRepository.presentByDepartment(today)) {
            byDept.put(r[0] == null ? "Unassigned" : r[0].toString(), ((Number) r[1]).longValue());
        }

        return DashboardStats.builder()
                .totalUsers(total).totalStudents(students).totalFaculty(staff)
                .presentToday(present).absentToday(absent).lateToday(late).onLeaveToday(leave)
                .attendanceRate(Math.round(rate * 100.0) / 100.0)
                .last7Days(series).presentByDepartment(byDept).build();
    }
}
