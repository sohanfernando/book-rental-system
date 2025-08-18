package lk.bookrental.backend.service.impl;

import jakarta.persistence.EntityNotFoundException;
import lk.bookrental.backend.dto.request.BookRequest;
import lk.bookrental.backend.dto.response.BookResponse;
import lk.bookrental.backend.model.AvailabilityStatus;
import lk.bookrental.backend.model.Book;
import lk.bookrental.backend.repository.BookRepository;
import lk.bookrental.backend.service.BookService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;

    public BookServiceImpl(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    public BookResponse createBook(BookRequest request) {
        Book book = Book.builder()
                .title(request.getTitle())
                .author(request.getAuthor())
                .genre(request.getGenre())
                .availabilityStatus(request.getAvailabilityStatus() != null ? request.getAvailabilityStatus() : AvailabilityStatus.AVAILABLE)
                .build();
        book = bookRepository.save(book);
        return toResponse(book);
    }

    @Override
    public BookResponse updateBook(Long id, BookRequest request) {
        Book book = bookRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Book not found"));
        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setGenre(request.getGenre());
        if (request.getAvailabilityStatus() != null) {
            book.setAvailabilityStatus(request.getAvailabilityStatus());
        }
        book = bookRepository.save(book);
        return toResponse(book);
    }

    @Override
    public void deleteBook(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new EntityNotFoundException("Book not found");
        }
        bookRepository.deleteById(id);
    }

    @Override
    public BookResponse getBookById(Long id) {
        Book book = bookRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Book not found"));
        return toResponse(book);
    }

    @Override
    public List<BookResponse> getAllBooks() {
        return bookRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    private BookResponse toResponse(Book book) {
        return BookResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .genre(book.getGenre())
                .availabilityStatus(book.getAvailabilityStatus())
                .build();
    }
}


