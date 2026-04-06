package com.travel.booking.dto;

public class BookingResponseDTO {

    private Long id;
    private Long userId;
    private String userEmail;
    private String type;
    private Long itemId;
    private String status;
    private String travelerName;
    private String travelerNotes;
    private String travelDate;
    private Integer guestCount;
    private String paymentMethod;
    private String paymentReference;
    private String baseAmount;
    private String taxAmount;
    private String totalAmount;
    private String currency;

    public BookingResponseDTO(
            Long id,
            Long userId,
            String userEmail,
            String type,
            Long itemId,
            String status,
            String travelerName,
            String travelerNotes,
            String travelDate,
            Integer guestCount,
            String paymentMethod,
            String paymentReference,
            String baseAmount,
            String taxAmount,
            String totalAmount,
            String currency
    ) {
        this.id = id;
        this.userId = userId;
        this.userEmail = userEmail;
        this.type = type;
        this.itemId = itemId;
        this.status = status;
        this.travelerName = travelerName;
        this.travelerNotes = travelerNotes;
        this.travelDate = travelDate;
        this.guestCount = guestCount;
        this.paymentMethod = paymentMethod;
        this.paymentReference = paymentReference;
        this.baseAmount = baseAmount;
        this.taxAmount = taxAmount;
        this.totalAmount = totalAmount;
        this.currency = currency;
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

    public String getTravelerName() {
        return travelerName;
    }

    public String getTravelerNotes() {
        return travelerNotes;
    }

    public String getTravelDate() {
        return travelDate;
    }

    public Integer getGuestCount() {
        return guestCount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public String getPaymentReference() {
        return paymentReference;
    }

    public String getBaseAmount() {
        return baseAmount;
    }

    public String getTaxAmount() {
        return taxAmount;
    }

    public String getTotalAmount() {
        return totalAmount;
    }

    public String getCurrency() {
        return currency;
    }
}
