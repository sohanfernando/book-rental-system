import React from 'react'

function Books({
	books,
	availableBooks,
	loadingBooks,
	bookForm,
	setBookForm,
	editingBookId,
	editBookForm,
	setEditBookForm,
	startEditBook,
	cancelEditBook,
	handleAddBook,
	handleUpdateBook,
	handleDeleteBook
}) {
	return (
		<div className="space-y-8">
			{/* Available Books Section */}
			<section className="animate-fade-in">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h2 className="text-2xl font-bold text-gray-900">Available Books</h2>
						<p className="text-gray-600 mt-1">Books ready for rental</p>
					</div>
					<div className="flex items-center space-x-2">
						<div className="w-3 h-3 bg-green-500 rounded-full"></div>
						<span className="text-sm text-gray-600">{availableBooks.length} available</span>
					</div>
				</div>
				
				{loadingBooks ? (
					<div className="flex items-center justify-center py-12">
						<div className="loading-spinner"></div>
						<span className="ml-3 text-gray-600">Loading books...</span>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{availableBooks.map(book => (
							<div key={book.id} className="card p-6 group hover:scale-105 transition-transform duration-300">
								<div className="flex items-start justify-between mb-4">
									<div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
										<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
										</svg>
									</div>
									<span className="status-badge status-available">Available</span>
								</div>
								
								<h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{book.title}</h3>
								<p className="text-gray-600 text-sm mb-1">by {book.author}</p>
								<p className="text-gray-500 text-xs mb-4">{book.genre}</p>
								
								<div className="flex items-center justify-between">
									<span className="text-xs text-gray-400">ID: {book.id}</span>
									<button 
										onClick={() => startEditBook(book)}
										className="btn-ghost opacity-0 group-hover:opacity-100 transition-opacity duration-200"
									>
										Edit
									</button>
								</div>
							</div>
						))}
						
						{availableBooks.length === 0 && (
							<div className="col-span-full">
								<div className="text-center py-12">
									<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
										<svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
										</svg>
									</div>
									<h3 className="text-lg font-medium text-gray-900 mb-2">No available books</h3>
									<p className="text-gray-600">Add some books to get started!</p>
								</div>
							</div>
						)}
					</div>
				)}
			</section>

			{/* Manage Books Section */}
			<section className="animate-fade-in">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h2 className="text-2xl font-bold text-gray-900">Manage Books</h2>
						<p className="text-gray-600 mt-1">All books in your library</p>
					</div>
					<div className="flex items-center space-x-2">
						<div className="w-3 h-3 bg-blue-500 rounded-full"></div>
						<span className="text-sm text-gray-600">{books.length} total</span>
					</div>
				</div>
				
				{loadingBooks ? (
					<div className="flex items-center justify-center py-12">
						<div className="loading-spinner"></div>
						<span className="ml-3 text-gray-600">Loading books...</span>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{books.map(book => (
							<div key={book.id} className="card p-6">
								{editingBookId === book.id ? (
									<form onSubmit={handleUpdateBook} className="space-y-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
											<input 
												className="input-field" 
												placeholder="Book title" 
												value={editBookForm.title} 
												onChange={e => setEditBookForm(v => ({ ...v, title: e.target.value }))} 
												required 
											/>
										</div>
										
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
											<input 
												className="input-field" 
												placeholder="Author name" 
												value={editBookForm.author} 
												onChange={e => setEditBookForm(v => ({ ...v, author: e.target.value }))} 
												required 
											/>
										</div>
										
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
											<input 
												className="input-field" 
												placeholder="Book genre" 
												value={editBookForm.genre} 
												onChange={e => setEditBookForm(v => ({ ...v, genre: e.target.value }))} 
												required 
											/>
										</div>
										
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
											<select 
												className="select-field" 
												value={editBookForm.availabilityStatus} 
												onChange={e => setEditBookForm(v => ({ ...v, availabilityStatus: e.target.value }))}
											>
												<option value="AVAILABLE">Available</option>
												<option value="UNAVAILABLE">Unavailable</option>
											</select>
										</div>
										
										<div className="flex space-x-2 pt-2">
											<button type="submit" className="btn-success flex-1">
												<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
												</svg>
												Save
											</button>
											<button type="button" onClick={cancelEditBook} className="btn-secondary flex-1">
												<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
												</svg>
												Cancel
											</button>
										</div>
									</form>
								) : (
									<>
										<div className="flex items-start justify-between mb-4">
											<div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
												<svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
												</svg>
											</div>
											<span className={`status-badge ${book.availabilityStatus === 'AVAILABLE' ? 'status-available' : 'status-unavailable'}`}>
												{book.availabilityStatus}
											</span>
										</div>
										
										<h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{book.title}</h3>
										<p className="text-gray-600 text-sm mb-1">by {book.author}</p>
										<p className="text-gray-500 text-xs mb-4">{book.genre}</p>
										
										<div className="flex items-center justify-between">
											<span className="text-xs text-gray-400">ID: {book.id}</span>
											<div className="flex space-x-2">
												<button 
													onClick={() => startEditBook(book)}
													className="btn-ghost rounded"
												>
													Edit
												</button>
												<button 
													onClick={() => handleDeleteBook(book.id)}
													className="btn-danger rounded"
												>
													Delete
												</button>
											</div>
										</div>
									</>
								)}
							</div>
						))}
						
						{books.length === 0 && (
							<div className="col-span-full">
								<div className="text-center py-12">
									<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
										<svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
										</svg>
									</div>
									<h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
									<p className="text-gray-600">Add your first book to get started!</p>
								</div>
							</div>
						)}
					</div>
				)}
			</section>

			{/* Add New Book Section */}
			<section className="animate-fade-in">
				<div className="card p-8">
					<div className="flex items-center mb-6">
						<div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center mr-4">
							<svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
							</svg>
						</div>
						<div>
							<h2 className="text-xl font-bold text-gray-900">Add New Book</h2>
							<p className="text-gray-600">Add a new book to your library</p>
						</div>
					</div>
					
					<form onSubmit={handleAddBook} className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
							<input 
								className="input-field" 
								placeholder="Enter book title" 
								value={bookForm.title} 
								onChange={e => setBookForm(v => ({ ...v, title: e.target.value }))} 
								required 
							/>
						</div>
						
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
							<input 
								className="input-field" 
								placeholder="Enter author name" 
								value={bookForm.author} 
								onChange={e => setBookForm(v => ({ ...v, author: e.target.value }))} 
								required 
							/>
						</div>
						
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
							<input 
								className="input-field" 
								placeholder="Enter book genre" 
								value={bookForm.genre} 
								onChange={e => setBookForm(v => ({ ...v, genre: e.target.value }))} 
								required 
							/>
						</div>
						
						<div className="md:col-span-3">
							<button type="submit" className="btn-primary rounded">
								<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
								</svg>
								Add Book
							</button>
						</div>
					</form>
				</div>
			</section>
		</div>
	)
}

export default Books