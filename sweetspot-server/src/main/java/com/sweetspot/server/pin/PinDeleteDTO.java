package com.sweetspot.server.pin;

public class PinDeleteDTO {
    private Long pinId;
    private Long userId;

    public Long getPinId() { return pinId; }
    public void setPinId(Long pinId) { this.pinId = pinId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
