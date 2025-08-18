package lk.bookrental.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RentalResponse {
    private Long id;
    private String username;
    private LocalDate rentalDate;
    private LocalDate returnDate;
    private BookResponse book;
}


