package com.smartwifi.attendance.controller;

import com.smartwifi.attendance.dto.DeviceDtos.*;
import com.smartwifi.attendance.security.UserPrincipal;
import com.smartwifi.attendance.service.DeviceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/devices")
@RequiredArgsConstructor
public class DeviceController {

    private final DeviceService deviceService;

    @GetMapping("/me")
    public List<DeviceResponse> mine(@AuthenticationPrincipal UserPrincipal p) {
        return deviceService.listByUser(p.getId());
    }

    @PostMapping("/me")
    public DeviceResponse register(@AuthenticationPrincipal UserPrincipal p,
                                   @Valid @RequestBody RegisterDeviceRequest req) {
        return deviceService.register(p.getId(), req);
    }

    @DeleteMapping("/me/{id}")
    public void delete(@AuthenticationPrincipal UserPrincipal p, @PathVariable Long id) {
        deviceService.delete(p.getId(), id);
    }

    @PostMapping("/{id}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public DeviceResponse verify(@PathVariable Long id) {
        return deviceService.verify(id);
    }
}
