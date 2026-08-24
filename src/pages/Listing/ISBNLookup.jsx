import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DUMMY_BOOKS = {
  isbn: {
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
    publisher: "MIT Press",
    edition: "3rd Edition",
    year: "2009",
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300"
  },
  title: {
    title: "Cracking the Coding Interview",
    author: "Gayle Laakmann McDowell",
    publisher: "CareerCup",
    edition: "6th Edition",
    year: "2015",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=300"
  }
};

export default function ISBNLookup() {
  const navigate = useNavigate();
  const [isbn, setIsbn] = useState('');
  const [title, setTitle] = useState('');
  const [searchedBook, setSearchedBook] = useState(null);

  const handleIsbnLookup = (e) => {
    e.preventDefault();
    if (!isbn.trim()) return;
    setSearchedBook(DUMMY_BOOKS.isbn);
  };

  const handleTitleSearch = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSearchedBook(DUMMY_BOOKS.title);
  };

  const handleReset = () => {
    setIsbn('');
    setTitle('');
    setSearchedBook(null);
  };

  return (
    <div className="max-w-3xl mx-auto py-2">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/sell')}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary transition font-inter cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </button>

      <div className="bg-cards p-6 md:p-10 rounded-3xl border border-gray-200/50 shadow-xs">
        <h1 className="text-3xl font-extrabold text-text-main mb-2 font-poppins">Find Your Book</h1>
        <p className="text-gray-500 font-inter text-sm mb-8">
          Enter your book's ISBN or title to populate details automatically.
        </p>

        {/* Input Methods */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative">
          
          {/* Method A: ISBN */}
          <form onSubmit={handleIsbnLookup} className="space-y-4">
            <div>
              <label htmlFor="isbn" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 font-inter">
                Enter ISBN
              </label>
              <input
                type="text"
                id="isbn"
                placeholder="e.g. 9780262033848"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition font-inter text-sm text-text-main"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3.5 px-6 rounded-xl transition duration-200 shadow-sm cursor-pointer font-inter text-sm"
            >
              Lookup ISBN
            </button>
          </form>

          {/* Divider */}
          <div className="hidden lg:flex flex-col items-center justify-center h-full absolute left-1/2 -translate-x-1/2 pointer-events-none">
            <div className="w-[1px] h-10 bg-gray-200"></div>
            <span className="my-2 text-xs font-bold text-gray-400 font-inter uppercase bg-cards px-2">OR</span>
            <div className="w-[1px] h-10 bg-gray-200"></div>
          </div>

          <div className="flex lg:hidden items-center justify-center my-2">
            <div className="h-[1px] w-full bg-gray-200"></div>
            <span className="mx-4 text-xs font-bold text-gray-400 font-inter uppercase">OR</span>
            <div className="h-[1px] w-full bg-gray-200"></div>
          </div>

          {/* Method B: Title Search */}
          <form onSubmit={handleTitleSearch} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 font-inter">
                Search by Title
              </label>
              <input
                type="text"
                id="title"
                placeholder="e.g. Cracking the Coding Interview"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition font-inter text-sm text-text-main"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3.5 px-6 rounded-xl transition duration-200 shadow-sm cursor-pointer font-inter text-sm"
            >
              Search by Title
            </button>
          </form>
        </div>

        {/* Search Results Display */}
        {searchedBook && (
          <div className="mt-10 pt-10 border-t border-gray-100 animate-fadeIn">
            <div className="flex flex-col md:flex-row gap-6 bg-background p-6 rounded-2xl border border-gray-200/40">
              {/* Cover Image */}
              <div className="w-full md:w-40 h-56 rounded-xl overflow-hidden shadow-sm shrink-0 bg-gray-200 border border-gray-300/40 relative">
                <img 
                  src={searchedBook.cover} 
                  alt={searchedBook.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Book Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-1 font-inter">
                    Verified Match
                  </div>
                  <h3 className="text-xl md:text-2xl font-extrabold text-text-main mb-2 font-poppins leading-tight">
                    {searchedBook.title}
                  </h3>
                  <p className="text-sm font-medium text-gray-600 font-inter mb-4">
                    by <span className="text-text-main">{searchedBook.author}</span>
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-inter text-gray-500 pt-2">
                    <div>
                      <span className="block font-bold text-gray-400 uppercase text-[10px] tracking-wider mb-0.5">Publisher</span>
                      <span className="text-text-main font-medium">{searchedBook.publisher}</span>
                    </div>
                    <div>
                      <span className="block font-bold text-gray-400 uppercase text-[10px] tracking-wider mb-0.5">Edition</span>
                      <span className="text-text-main font-medium">{searchedBook.edition}</span>
                    </div>
                    <div>
                      <span className="block font-bold text-gray-400 uppercase text-[10px] tracking-wider mb-0.5">Year</span>
                      <span className="text-text-main font-medium">{searchedBook.year}</span>
                    </div>
                    <div>
                      <span className="block font-bold text-gray-400 uppercase text-[10px] tracking-wider mb-0.5">Format</span>
                      <span className="text-text-main font-medium">Paperback</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-gray-200/50">
                  <button
                    onClick={() => navigate('/sell/condition')}
                    className="flex-1 sm:flex-initial bg-cta hover:bg-cta/90 text-white font-bold py-3 px-8 rounded-xl shadow-xs transition cursor-pointer font-inter text-sm text-center"
                  >
                    Confirm & Continue
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 sm:flex-initial bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold py-3 px-6 rounded-xl transition cursor-pointer font-inter text-sm text-center"
                  >
                    Not my book? Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
