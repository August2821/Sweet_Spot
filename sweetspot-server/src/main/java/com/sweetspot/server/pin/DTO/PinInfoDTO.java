package com.sweetspot.server.pin.DTO;

public class PinInfoDTO {
    private Long pinId;
    private Double latitude;
    private Double longitude;

    public Long getPinId() { return pinId; }
    public void setPinId(Long pinId) { this.pinId = pinId; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
}
