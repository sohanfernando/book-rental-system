package lk.bookrental.backend.dto.request;

import lk.bookrental.backend.model.AvailabilityStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookRequest {
    private String title;
    private String author;
    private String genre;
    private AvailabilityStatus availabilityStatus; // optional; defaults to AVAILABLE if null
}


