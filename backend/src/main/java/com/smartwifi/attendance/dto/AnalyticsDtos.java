package com.smartwifi.attendance.dto;

import lombok.*;

import java.util.List;
import java.util.Map;

public class AnalyticsDtos {
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class DashboardStats {
        private long totalUsers;
        private long totalStudents;
        private long totalFaculty;
        private long presentToday;
        private long absentToday;
        private long lateToday;
        private long onLeaveToday;
        private double attendanceRate;
        private List<DailyPoint> last7Days;
        private Map<String, Long> presentByDepartment;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class DailyPoint {
        private String date;
        private long total;
    }
}
