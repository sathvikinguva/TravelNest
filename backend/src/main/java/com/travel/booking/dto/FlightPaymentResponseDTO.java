package com.travel.booking.dto;

public class FlightPaymentResponseDTO {

    private Long id;
    private Long bookingId;
    private Long userId;
    private String userEmail;
    private Long flightId;
    private String travelerName;
    private Integer guestCount;
    private String paymentMethod;
    private String paymentReference;
    private String cardLast4;
    private String upiId;
    private String totalAmount;
    private String currency;
    private String paidAt;

    public FlightPaymentResponseDTO(
            Long id,
            Long bookingId,
            Long userId,
            String userEmail,
            Long flightId,
            String travelerName,
            Integer guestCount,
            String paymentMethod,
            String paymentReference,
            String cardLast4,
            String upiId,
            String totalAmount,
            String currency,
            String paidAt
    ) {
        this.id = id;
        this.bookingId = bookingId;
        this.userId = userId;
        this.userEmail = userEmail;
        this.flightId = flightId;
        this.travelerName = travelerName;
        this.guestCount = guestCount;
        this.paymentMethod = paymentMethod;
        this.paymentReference = paymentReference;
        this.cardLast4 = cardLast4;
        this.upiId = upiId;
        this.totalAmount = totalAmount;
        this.currency = currency;
        this.paidAt = paidAt;
    }

    public Long getId() { return id; }
    public Long getBookingId() { return bookingId; }
    public Long getUserId() { return userId; }
    public String getUserEmail() { return userEmail; }
    public Long getFlightId() { return flightId; }
    public String getTravelerName() { return travelerName; }
    public Integer getGuestCount() { return guestCount; }
    public String getPaymentMethod() { return paymentMethod; }
    public String getPaymentReference() { return paymentReference; }
    public String getCardLast4() { return cardLast4; }
    public String getUpiId() { return upiId; }
    public String getTotalAmount() { return totalAmount; }
    public String getCurrency() { return currency; }
    public String getPaidAt() { return paidAt; }
}
