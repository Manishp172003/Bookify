// Book Service for managing book catalog and filtered lists for Coupon scoping

export const mockBooks = [
  {
    id: "b1",
    title: "The Silent Mind",
    author: "Current Author",
    category: "Self Help",
    status: "Published",
    price: 499,
    isCurrentAuthor: true
  },
  {
    id: "b2",
    title: "Inner Peace",
    author: "Current Author",
    category: "Self Help",
    status: "Published",
    price: 399,
    isCurrentAuthor: true
  },
  {
    id: "b3",
    title: "The Power of Habit",
    author: "Current Author",
    category: "Personal Growth",
    status: "Draft",
    price: 299,
    isCurrentAuthor: true
  },
  {
    id: "b4",
    title: "Unlock Your Potential",
    author: "Current Author",
    category: "Motivation",
    status: "Under Review",
    price: 549,
    isCurrentAuthor: true
  },
  {
    id: "b5",
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Software Engineering",
    status: "Published",
    price: 450,
    isCurrentAuthor: false
  },
  {
    id: "b6",
    title: "Data Structures",
    author: "Seymour Lipschutz",
    category: "Computer Science",
    status: "Published",
    price: 250,
    isCurrentAuthor: false
  },
  {
    id: "b7",
    title: "Operating System",
    author: "Galvin",
    category: "Computer Science",
    status: "Published",
    price: 300,
    isCurrentAuthor: false
  },
  {
    id: "b8",
    title: "Let Us C",
    author: "Yashavant Kanetkar",
    category: "Programming",
    status: "Published",
    price: 200,
    isCurrentAuthor: false
  }
];

// Returns all published books across the entire platform (for Admin)
export const getAllPlatformPublishedBooks = () => {
  return mockBooks.filter((book) => book.status === "Published");
};

// Returns ONLY published books created/published by the logged-in author (for Author)
export const getAuthorPublishedBooks = () => {
  return mockBooks.filter(
    (book) => book.isCurrentAuthor && book.status === "Published"
  );
};
