package com.travel.booking.dto;

import com.travel.booking.entity.BookingType;
import jakarta.validation.constraints.NotNull;

public class BookingRequestDTO {

    @NotNull
    private BookingType type;

    @NotNull
    private Long itemId;

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
}
