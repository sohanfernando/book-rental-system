package lk.bookrental.backend.service;

import jakarta.persistence.EntityNotFoundException;
import lk.bookrental.backend.dto.request.BookRequest;
import lk.bookrental.backend.dto.response.BookResponse;
import lk.bookrental.backend.model.AvailabilityStatus;
import lk.bookrental.backend.model.Book;
import lk.bookrental.backend.repository.BookRepository;
import lk.bookrental.backend.service.impl.BookServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookServiceImplTest {

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private BookServiceImpl bookService;

    @BeforeEach
    void setup() {
        // no-op
    }

    @Test
    void createBook_setsDefaultAvailabilityWhenNull() {
        BookRequest request = new BookRequest("Dune", "Frank Herbert", "Sci-Fi", null);

        when(bookRepository.save(any(Book.class))).thenAnswer(invocation -> {
            Book toSave = invocation.getArgument(0);
            toSave.setId(1L);
            return toSave;
        });

        BookResponse response = bookService.createBook(request);

        ArgumentCaptor<Book> captor = ArgumentCaptor.forClass(Book.class);
        verify(bookRepository).save(captor.capture());
        Book saved = captor.getValue();

        assertThat(saved.getAvailabilityStatus()).isEqualTo(AvailabilityStatus.AVAILABLE);
        assertThat(response.getAvailabilityStatus()).isEqualTo(AvailabilityStatus.AVAILABLE);
        assertThat(response.getId()).isEqualTo(1L);
    }

    @Test
    void updateBook_updatesFields_andKeepsAvailabilityWhenNullInRequest() {
        Book existing = Book.builder()
                .id(5L)
                .title("Old Title")
                .author("Old Author")
                .genre("Old Genre")
                .availabilityStatus(AvailabilityStatus.UNAVAILABLE)
                .build();

        when(bookRepository.findById(5L)).thenReturn(Optional.of(existing));
        when(bookRepository.save(any(Book.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BookRequest request = new BookRequest("New Title", "New Author", "New Genre", null);
        BookResponse response = bookService.updateBook(5L, request);

        assertThat(response.getTitle()).isEqualTo("New Title");
        assertThat(response.getAuthor()).isEqualTo("New Author");
        assertThat(response.getGenre()).isEqualTo("New Genre");
        assertThat(response.getAvailabilityStatus()).isEqualTo(AvailabilityStatus.UNAVAILABLE);
    }

    @Test
    void updateBook_setsAvailabilityWhenProvided() {
        Book existing = Book.builder()
                .id(7L)
                .title("X")
                .author("Y")
                .genre("Z")
                .availabilityStatus(AvailabilityStatus.UNAVAILABLE)
                .build();

        when(bookRepository.findById(7L)).thenReturn(Optional.of(existing));
        when(bookRepository.save(any(Book.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BookRequest req = new BookRequest("X2", "Y2", "Z2", AvailabilityStatus.AVAILABLE);
        BookResponse res = bookService.updateBook(7L, req);

        assertThat(res.getAvailabilityStatus()).isEqualTo(AvailabilityStatus.AVAILABLE);
    }

    @Test
    void deleteBook_throwsWhenNotFound() {
        when(bookRepository.existsById(99L)).thenReturn(false);
        assertThrows(EntityNotFoundException.class, () -> bookService.deleteBook(99L));
        verify(bookRepository, never()).deleteById(anyLong());
    }
}


