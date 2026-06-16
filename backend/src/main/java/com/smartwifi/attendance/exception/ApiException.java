package com.smartwifi.attendance.exception;

public class ApiException extends RuntimeException {
    private final int status;
    public ApiException(String message, int status) { super(message); this.status = status; }
    public int getStatus() { return status; }
    public static ApiException badRequest(String m) { return new ApiException(m, 400); }
    public static ApiException unauthorized(String m) { return new ApiException(m, 401); }
    public static ApiException forbidden(String m) { return new ApiException(m, 403); }
    public static ApiException notFound(String m) { return new ApiException(m, 404); }
    public static ApiException conflict(String m) { return new ApiException(m, 409); }
}
