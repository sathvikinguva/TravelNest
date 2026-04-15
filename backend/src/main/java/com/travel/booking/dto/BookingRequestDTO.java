package com.travel.booking.dto;

import com.travel.booking.entity.BookingType;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public class BookingRequestDTO {

    @NotNull
    private BookingType type;

    @NotNull
    private Long itemId;

    @NotNull
    @Size(min = 2, max = 120)
    @Pattern(regexp = "^[A-Za-z ]+$", message = "Traveler name must contain alphabets and spaces only")
    private String travelerName;

    @Size(max = 500)
    private String travelerNotes;

    @NotNull
    private LocalDate travelDate;

    @NotNull
    @Min(1)
    private Integer guestCount;

    @NotNull
    @Size(min = 2, max = 40)
    @Pattern(regexp = "^(CARD|UPI)$", message = "Payment method must be CARD or UPI")
    private String paymentMethod;

    @NotNull
    @Size(min = 2, max = 40)
    @Pattern(regexp = "^[A-Za-z0-9_-]+$", message = "Payment reference must be alphanumeric")
    private String paymentReference;

    @Pattern(regexp = "^$|^[0-9]{4}$", message = "Card last4 must be exactly 4 digits")
    private String cardLast4;

    @Pattern(regexp = "^$|^[A-Za-z0-9._-]+@[A-Za-z]+$", message = "UPI ID format is invalid")
    private String upiId;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal baseAmount;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal taxAmount;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal totalAmount;

    @NotNull
    @Size(min = 3, max = 3)
    private String currency;

    public BookingType getType() {
        return type;
    }

    public void setType(BookingType type) {
        this.type = type;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public String getTravelerName() {
        return travelerName;
    }

    public void setTravelerName(String travelerName) {
        this.travelerName = travelerName;
    }

    public String getTravelerNotes() {
        return travelerNotes;
    }

    public void setTravelerNotes(String travelerNotes) {
        this.travelerNotes = travelerNotes;
    }

    public LocalDate getTravelDate() {
        return travelDate;
    }

    public void setTravelDate(LocalDate travelDate) {
        this.travelDate = travelDate;
    }

    public Integer getGuestCount() {
        return guestCount;
    }

    public void setGuestCount(Integer guestCount) {
        this.guestCount = guestCount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentReference() {
        return paymentReference;
    }

    public void setPaymentReference(String paymentReference) {
        this.paymentReference = paymentReference;
    }

    public String getCardLast4() {
        return cardLast4;
    }

    public void setCardLast4(String cardLast4) {
        this.cardLast4 = cardLast4;
    }

    public String getUpiId() {
        return upiId;
    }

    public void setUpiId(String upiId) {
        this.upiId = upiId;
    }

    public BigDecimal getBaseAmount() {
        return baseAmount;
    }

    public void setBaseAmount(BigDecimal baseAmount) {
        this.baseAmount = baseAmount;
    }

    public BigDecimal getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}
