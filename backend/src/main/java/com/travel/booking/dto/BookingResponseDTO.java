package com.travel.booking.dto;

public class BookingResponseDTO {

    private Long id;
    private Long userId;
    private String userEmail;
    private String type;
    private Long itemId;
    private String status;

    public BookingResponseDTO(Long id, Long userId, String userEmail, String type, Long itemId, String status) {
        this.id = id;
        this.userId = userId;
        this.userEmail = userEmail;
        this.type = type;
        this.itemId = itemId;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public String getType() {
        return type;
    }

    public Long getItemId() {
        return itemId;
    }

    public String getStatus() {
        return status;
    }
}
