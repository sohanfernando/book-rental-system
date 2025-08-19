import './index.css'
import { useEffect, useMemo, useState } from 'react'
import Books from './components/Books'
import Rentals from './components/Rentals'
import Header from './components/Header'
import Footer from './components/Footer'

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
  const [isDarkMode, setIsDarkMode] = useState(false)

  const availableBooks = useMemo(() => books.filter(b => b.availabilityStatus === 'AVAILABLE'), [books])

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    
    if (newMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

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



  return (
    <div className="min-h-screen gradient-bg">
      <Header 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 animate-fade-in">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 dark:bg-red-900/20 dark:border-red-700">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-800 font-medium dark:text-red-200">{error}</span>
                <button 
                  onClick={() => setError('')}
                  className="ml-auto text-red-400 hover:text-red-600 dark:hover:text-red-300"
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Books</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{books.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center dark:bg-blue-600/20">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Available</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{availableBooks.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center dark:bg-green-600/20">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Rentals</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{rentals.filter(r => !r.returnDate).length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center dark:bg-purple-600/20">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      <Footer />
    </div>
  )
}

export default App