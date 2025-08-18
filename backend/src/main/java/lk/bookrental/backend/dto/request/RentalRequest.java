package lk.bookrental.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RentalRequest {
    private String username;
    private LocalDate rentalDate;
    private LocalDate returnDate; // optional on create
    private Long bookId;
}


