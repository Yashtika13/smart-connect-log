package com.smartwifi.attendance.repository;

import com.smartwifi.attendance.entity.Attendance;
import com.smartwifi.attendance.entity.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByUserIdAndAttendanceDate(Long userId, LocalDate date);

    List<Attendance> findByUserIdOrderByAttendanceDateDesc(Long userId);

    List<Attendance> findByAttendanceDate(LocalDate date);

    long countByAttendanceDateAndStatus(LocalDate date, AttendanceStatus status);

    @Query("SELECT a.attendanceDate AS date, COUNT(a) AS total " +
            "FROM Attendance a WHERE a.attendanceDate BETWEEN :from AND :to " +
            "GROUP BY a.attendanceDate ORDER BY a.attendanceDate")
    List<Object[]> aggregateBetween(@Param("from") LocalDate from, @Param("to") LocalDate to);

    @Query("SELECT a.user.department, COUNT(a) FROM Attendance a " +
            "WHERE a.attendanceDate = :date AND a.status = 'PRESENT' " +
            "GROUP BY a.user.department")
    List<Object[]> presentByDepartment(@Param("date") LocalDate date);
}
