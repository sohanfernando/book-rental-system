package lk.bookrental.backend.dto.response;

import lk.bookrental.backend.model.AvailabilityStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookResponse {
    private Long id;
    private String title;
    private String author;
    private String genre;
    private AvailabilityStatus availabilityStatus;
}


