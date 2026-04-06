package com.travel.booking.dto;

import com.travel.booking.entity.BookingType;
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
    private String paymentMethod;

    @NotNull
    @Size(min = 2, max = 40)
    private String paymentReference;

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
