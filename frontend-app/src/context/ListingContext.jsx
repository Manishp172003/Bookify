import React, { createContext, useContext, useState, useEffect } from 'react';

const ListingContext = createContext();

const INITIAL_DRAFT = {
  isbn: '',
  title: 'Introduction to Algorithms',
  author: 'Thomas H. Cormen, Charles E. Leiserson',
  publisher: 'MIT Press',
  edition: '3rd Edition',
  year: '2009',
  category: 'Computer Science & Engineering',
  courseCode: 'CS201',
  cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300',
  condition: 'very-good',
  conditionNotes: 'Clean pages, no markings or torn sheets.',
  photos: [
    'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600'
  ],
  mode: 'sell',
  price: 499,
  mrp: 1200,
  rentalPrice: 199,
  rentalDuration: 'semester',
  exchangeWish: 'Operating Systems by Silberschatz or Data Structures',
  allowNegotiation: true,
  pickupCampus: 'Main Campus (Library / Student Center)'
};

export function ListingProvider({ children }) {
  const [listingData, setListingData] = useState(() => {
    try {
      const saved = localStorage.getItem('bookify_listing_draft');
      return saved ? JSON.parse(saved) : INITIAL_DRAFT;
    } catch {
      return INITIAL_DRAFT;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('bookify_listing_draft', JSON.stringify(listingData));
    } catch (e) {
      console.error('Failed to save listing draft', e);
    }
  }, [listingData]);

  const updateListingData = (updates) => {
    setListingData((prev) => ({ ...prev, ...updates }));
  };

  const resetListing = () => {
    setListingData(INITIAL_DRAFT);
    try {
      localStorage.removeItem('bookify_listing_draft');
    } catch {}
  };

  return (
    <ListingContext.Provider
      value={{
        listingData,
        updateListingData,
        resetListing,
      }}
    >
      {children}
    </ListingContext.Provider>
  );
}

export function useListing() {
  const context = useContext(ListingContext);
  if (!context) {
    throw new Error('useListing must be used within a ListingProvider');
  }
  return context;
}
