package com.sweetspot.server.user.DTO.update;

public class UserNicknameUpdateDTO {
    private Long userId;
    private String newNickname;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getNewNickname() { return newNickname; }
    public void setNewNickname(String newNickname) { this.newNickname = newNickname; }
}
