package lk.bookrental.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "rentals")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Rental {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private LocalDate rentalDate;
    private LocalDate returnDate;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;
}
