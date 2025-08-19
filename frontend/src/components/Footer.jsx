function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white/50 backdrop-blur-sm dark:border-gray-600 dark:bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            © {new Date().getFullYear()} BookRental. Built with ❤️ for book lovers.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
