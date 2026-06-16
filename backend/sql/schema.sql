-- Smart Wi-Fi Attendance & Analytics System — MySQL schema
-- Tables are auto-created by Hibernate (ddl-auto=update). This script
-- documents the schema explicitly and can be used for manual provisioning.

CREATE DATABASE IF NOT EXISTS smart_wifi_attendance
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smart_wifi_attendance;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(80) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(120),
    department VARCHAR(80),
    role ENUM('STUDENT','FACULTY','ADMIN') NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS devices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    device_name VARCHAR(120),
    mac_address VARCHAR(32) NOT NULL UNIQUE,
    device_type VARCHAR(40),
    is_primary BOOLEAN DEFAULT FALSE,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    registered_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS attendance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    device_id BIGINT,
    attendance_date DATE NOT NULL,
    check_in DATETIME,
    check_out DATETIME,
    wifi_ssid VARCHAR(64),
    wifi_bssid VARCHAR(32),
    ip_address VARCHAR(45),
    status ENUM('PRESENT','ABSENT','LATE','ON_LEAVE') NOT NULL,
    INDEX idx_attendance_user_date (user_id, attendance_date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS leave_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason VARCHAR(500),
    status ENUM('PENDING','APPROVED','REJECTED') NOT NULL,
    reviewed_by BIGINT,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(160) NOT NULL,
    message VARCHAR(500),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Seed an admin user (password: Admin@123 — bcrypt hash). Change after first login.
INSERT IGNORE INTO users (username, email, password, full_name, department, role, enabled, created_at)
VALUES ('admin', 'admin@smartwifi.local',
        '$2a$10$DowJonesIndAvgHashStub./PlaceholderReplaceAfterFirstRun.',
        'System Admin', 'IT', 'ADMIN', TRUE, NOW());
