package com.smartwifi.attendance.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Component
@Getter
public class WifiProperties {
    private final Set<String> allowedSsids;
    private final Set<String> allowedBssids;

    public WifiProperties(@Value("${app.wifi.allowed-ssids:}") String ssids,
                         @Value("${app.wifi.allowed-bssids:}") String bssids) {
        this.allowedSsids = new HashSet<>(Arrays.asList(ssids.toLowerCase().split(",")));
        this.allowedBssids = new HashSet<>(Arrays.asList(bssids.toLowerCase().split(",")));
    }

    public boolean isAuthorized(String ssid, String bssid) {
        if (ssid != null && allowedSsids.contains(ssid.toLowerCase())) return true;
        if (bssid != null && allowedBssids.contains(bssid.toLowerCase())) return true;
        return false;
    }
}
