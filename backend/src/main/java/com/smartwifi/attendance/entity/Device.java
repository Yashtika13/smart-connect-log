package com.smartwifi.attendance.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "devices", uniqueConstraints = @UniqueConstraint(columnNames = {"mac_address"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Device {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "device_name", length = 120)
    private String deviceName;

    @Column(name = "mac_address", nullable = false, length = 32)
    private String macAddress;

    @Column(name = "device_type", length = 40)
    private String deviceType;

    @Column(name = "is_primary")
    private boolean primary;

    @Column(nullable = false)
    private boolean verified = false;

    @Column(name = "registered_at", nullable = false, updatable = false)
    private LocalDateTime registeredAt;

    @PrePersist
    void onCreate() { this.registeredAt = LocalDateTime.now(); }
}
