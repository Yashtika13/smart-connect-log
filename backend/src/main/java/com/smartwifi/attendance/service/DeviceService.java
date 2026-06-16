package com.smartwifi.attendance.service;

import com.smartwifi.attendance.dto.DeviceDtos.*;
import com.smartwifi.attendance.entity.Device;
import com.smartwifi.attendance.entity.User;
import com.smartwifi.attendance.exception.ApiException;
import com.smartwifi.attendance.repository.DeviceRepository;
import com.smartwifi.attendance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DeviceService {

    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;

    public List<DeviceResponse> listByUser(Long userId) {
        return deviceRepository.findByUserId(userId).stream().map(this::toDto).toList();
    }

    @Transactional
    public DeviceResponse register(Long userId, RegisterDeviceRequest req) {
        String mac = req.getMacAddress().trim();
        if (deviceRepository.existsByMacAddressIgnoreCase(mac))
            throw ApiException.conflict("Device with this MAC is already registered");
        User u = userRepository.findById(userId).orElseThrow(() -> ApiException.notFound("User not found"));
        Device d = Device.builder()
                .user(u).deviceName(req.getDeviceName())
                .macAddress(mac).deviceType(req.getDeviceType())
                .primary(req.isPrimary()).verified(false).build();
        return toDto(deviceRepository.save(d));
    }

    @Transactional
    public DeviceResponse verify(Long deviceId) {
        Device d = deviceRepository.findById(deviceId)
                .orElseThrow(() -> ApiException.notFound("Device not found"));
        d.setVerified(true);
        return toDto(deviceRepository.save(d));
    }

    @Transactional
    public void delete(Long userId, Long deviceId) {
        Device d = deviceRepository.findById(deviceId)
                .orElseThrow(() -> ApiException.notFound("Device not found"));
        if (!d.getUser().getId().equals(userId))
            throw ApiException.forbidden("Not your device");
        deviceRepository.delete(d);
    }

    private DeviceResponse toDto(Device d) {
        return DeviceResponse.builder()
                .id(d.getId()).deviceName(d.getDeviceName())
                .macAddress(d.getMacAddress()).deviceType(d.getDeviceType())
                .primary(d.isPrimary()).verified(d.isVerified())
                .registeredAt(d.getRegisteredAt()).build();
    }
}
