import './index.css'
import { useEffect, useMemo, useState } from 'react'
import Books from './components/Books'
import Rentals from './components/Rentals'

function App() {
  const [books, setBooks] = useState([])
  const [loadingBooks, setLoadingBooks] = useState(false)
  const [bookForm, setBookForm] = useState({ title: '', author: '', genre: '' })
  const [editingBookId, setEditingBookId] = useState(null)
  const [editBookForm, setEditBookForm] = useState({ title: '', author: '', genre: '', availabilityStatus: 'AVAILABLE' })
  const [rentals, setRentals] = useState([])
  const [loadingRentals, setLoadingRentals] = useState(false)
  const [rentalForm, setRentalForm] = useState({ username: '', bookId: '', rentalDate: '', returnDate: '' })
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('books')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const availableBooks = useMemo(() => books.filter(b => b.availabilityStatus === 'AVAILABLE'), [books])

  async function fetchBooks() {
    setLoadingBooks(true)
    setError('')
    try {
      const res = await fetch('/api/books')
      if (!res.ok) throw new Error('Failed to load books')
      const data = await res.json()
      setBooks(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoadingBooks(false)
    }
  }

  async function fetchRentals() {
    setLoadingRentals(true)
    setError('')
    try {
      const res = await fetch('/api/rentals')
      if (!res.ok) throw new Error('Failed to load rentals')
      const data = await res.json()
      setRentals(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoadingRentals(false)
    }
  }

  useEffect(() => {
    fetchBooks()
    fetchRentals()
  }, [])

  async function handleAddBook(e) {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: bookForm.title,
          author: bookForm.author,
          genre: bookForm.genre
        })
      })
      if (!res.ok) throw new Error('Failed to add book')
      setBookForm({ title: '', author: '', genre: '' })
      await fetchBooks()
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleRentBook(e) {
    e.preventDefault()
    setError('')
    try {
      const payload = {
        username: rentalForm.username,
        bookId: rentalForm.bookId ? Number(rentalForm.bookId) : null,
        rentalDate: rentalForm.rentalDate
      }
      if (rentalForm.returnDate) {
        payload.returnDate = rentalForm.returnDate
      }
      const res = await fetch('/api/rentals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Failed to create rental')
      setRentalForm({ username: '', bookId: '', rentalDate: '', returnDate: '' })
      await Promise.all([fetchBooks(), fetchRentals()])
    } catch (e) {
      setError(e.message)
    }
  }

  function startEditBook(book) {
    setEditingBookId(book.id)
    setEditBookForm({
      title: book.title || '',
      author: book.author || '',
      genre: book.genre || '',
      availabilityStatus: book.availabilityStatus || 'AVAILABLE'
    })
  }

  function cancelEditBook() {
    setEditingBookId(null)
    setEditBookForm({ title: '', author: '', genre: '', availabilityStatus: 'AVAILABLE' })
  }

  async function handleUpdateBook(e) {
    e.preventDefault()
    if (!editingBookId) return
    setError('')
    try {
      const res = await fetch(`/api/books/${editingBookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editBookForm.title,
          author: editBookForm.author,
          genre: editBookForm.genre,
          availabilityStatus: editBookForm.availabilityStatus
        })
      })
      if (!res.ok) throw new Error('Failed to update book')
      cancelEditBook()
      await fetchBooks()
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleDeleteBook(id) {
    if (!id) return
    if (!window.confirm('Delete this book?')) return
    setError('')
    try {
      const res = await fetch(`/api/books/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete book')
      if (editingBookId === id) cancelEditBook()
      await fetchBooks()
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleMarkReturned(rentalId) {
    if (!rentalId) return
    setError('')
    try {
      const today = new Date().toISOString().slice(0, 10)
      const res = await fetch(`/api/rentals/${rentalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returnDate: today })
      })
      if (!res.ok) throw new Error('Failed to mark returned')
      await Promise.all([fetchRentals(), fetchBooks()])
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleDeleteRental(id) {
    if (!id) return
    if (!window.confirm('Delete this rental?')) return
    setError('')
    try {
      const res = await fetch(`/api/rentals/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete rental')
      await Promise.all([fetchRentals(), fetchBooks()])
    } catch (e) {
      setError(e.message)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="glass-effect sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  BookRental
                </h1>
                <p className="text-xs text-gray-600">Manage your library</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'books' 
                    ? 'bg-white text-gray-900 shadow-md' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
                onClick={() => setActiveTab('books')}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Books</span>
                </div>
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'rentals' 
                    ? 'bg-white text-gray-900 shadow-md' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
                onClick={() => setActiveTab('rentals')}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Rentals</span>
                </div>
              </button>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-white/50 transition-all duration-200"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden animate-fade-in">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 backdrop-blur-sm rounded-lg mt-2 shadow-lg border border-white/20">
                <button
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === 'books' 
                      ? 'bg-blue-100 text-blue-900' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => handleTabChange('books')}
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>Books</span>
                  </div>
                </button>
                <button
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === 'rentals' 
                      ? 'bg-blue-100 text-blue-900' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => handleTabChange('rentals')}
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Rentals</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 animate-fade-in">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-800 font-medium">{error}</span>
                <button 
                  onClick={() => setError('')}
                  className="ml-auto text-red-400 hover:text-red-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-2xl font-bold text-gray-900">{books.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-green-600">{availableBooks.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Rentals</p>
                <p className="text-2xl font-bold text-purple-600">{rentals.filter(r => !r.returnDate).length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-slide-in">
          {activeTab === 'books' ? (
            <Books
              books={books}
              availableBooks={availableBooks}
              loadingBooks={loadingBooks}
              bookForm={bookForm}
              setBookForm={setBookForm}
              editingBookId={editingBookId}
              editBookForm={editBookForm}
              setEditBookForm={setEditBookForm}
              startEditBook={startEditBook}
              cancelEditBook={cancelEditBook}
              handleAddBook={handleAddBook}
              handleUpdateBook={handleUpdateBook}
              handleDeleteBook={handleDeleteBook}
            />
          ) : (
            <Rentals
              rentals={rentals}
              loadingRentals={loadingRentals}
              rentalForm={rentalForm}
              setRentalForm={setRentalForm}
              availableBooks={availableBooks}
              handleRentBook={handleRentBook}
              handleMarkReturned={handleMarkReturned}
              handleDeleteRental={handleDeleteRental}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} BookRental. Built with ❤️ for book lovers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App