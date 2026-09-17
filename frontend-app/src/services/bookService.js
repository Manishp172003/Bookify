// Book Service for managing book catalog and filtered lists for Coupon scoping

export const mockBooks = [
  {
    id: "b1",
    title: "The Silent Mind",
    author: "Rahul Verma",
    category: "Self Help",
    status: "Published",
    price: 499,
    isCurrentAuthor: false
  },
  {
    id: "b2",
    title: "Inner Peace",
    author: "Eckhart T.",
    category: "Self Help",
    status: "Published",
    price: 399,
    isCurrentAuthor: false
  },
  {
    id: "b3",
    title: "The Power of Habit",
    author: "Charles Duhigg",
    category: "Personal Growth",
    status: "Published",
    price: 299,
    isCurrentAuthor: false
  },
  {
    id: "b4",
    title: "Atomic Habits",
    author: "James Clear",
    category: "Motivation",
    status: "Published",
    price: 549,
    isCurrentAuthor: false
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
