// Utility to resolve real, authentic textbook cover images across Bokify

const KNOWN_COVERS = [
  {
    matches: ["cracking the coding interview", "cracking coding"],
    cover: "https://covers.openlibrary.org/b/isbn/9780984782857-L.jpg"
  },
  {
    matches: ["introduction to algorithms", "algorithms 3rd", "cormen", "clrs"],
    cover: "https://covers.openlibrary.org/b/isbn/9780262033848-L.jpg"
  },
  {
    matches: ["compiler design", "compilers: principles", "dragon book"],
    cover: "https://covers.openlibrary.org/b/isbn/9780321486813-L.jpg"
  },
  {
    matches: ["operating system concepts", "operating system"],
    cover: "https://covers.openlibrary.org/b/isbn/9781118063330-L.jpg"
  },
  {
    matches: ["core java", "java: an integrated approach"],
    cover: "https://covers.openlibrary.org/b/isbn/9789351199342-L.jpg"
  },
  {
    matches: ["database system concepts", "database system", "korth"],
    cover: "https://covers.openlibrary.org/b/isbn/9780073523323-L.jpg"
  },
  {
    matches: ["concepts of physics", "hc verma"],
    cover: "https://covers.openlibrary.org/b/isbn/9788177091878-L.jpg"
  },
  {
    matches: ["organic chemistry", "wade"],
    cover: "https://covers.openlibrary.org/b/isbn/9780321811295-L.jpg"
  },
  {
    matches: ["calculus: early transcendentals", "stewart calculus", "calculus"],
    cover: "https://covers.openlibrary.org/b/isbn/9781285741550-L.jpg"
  },
  {
    matches: ["clean code", "robert c. martin"],
    cover: "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg"
  },
  {
    matches: ["the pragmatic programmer", "pragmatic programmer"],
    cover: "https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg"
  },
  {
    matches: ["computer networks", "tanenbaum"],
    cover: "https://covers.openlibrary.org/b/isbn/9780132126953-L.jpg"
  },
  {
    matches: ["artificial intelligence", "modern approach", "russell norvig"],
    cover: "https://covers.openlibrary.org/b/isbn/9780136042594-L.jpg"
  },
  {
    matches: ["head first design patterns", "design patterns"],
    cover: "https://covers.openlibrary.org/b/isbn/9780596007126-L.jpg"
  },
  {
    matches: ["let us c", "yashavant kanetkar"],
    cover: "https://covers.openlibrary.org/b/isbn/9789387284494-L.jpg"
  },
  {
    matches: ["to kill a mockingbird"],
    cover: "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg"
  }
];

export const DEFAULT_BOOK_COVER = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60";

/**
 * Resolves a real book cover URL for any book object or title.
 * Checks existing image properties first, then matches title to known academic covers.
 */
export function getBookCover(bookOrTitle) {
  if (!bookOrTitle) return DEFAULT_BOOK_COVER;

  // If a string was passed directly
  if (typeof bookOrTitle === "string") {
    const raw = bookOrTitle.trim();
    if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("data:") || raw.startsWith("/")) {
      return raw;
    }
    const lower = raw.toLowerCase();
    const found = KNOWN_COVERS.find((item) => item.matches.some((m) => lower.includes(m)));
    if (found) return found.cover;
    return DEFAULT_BOOK_COVER;
  }

  // If an object was passed
  const title = bookOrTitle.title || bookOrTitle.name || "";
  const directImage =
    bookOrTitle.coverImage ||
    bookOrTitle.image ||
    bookOrTitle.cover ||
    (Array.isArray(bookOrTitle.photos) && bookOrTitle.photos[0]) ||
    bookOrTitle.photo;

  // If already a valid real URL
  if (directImage && typeof directImage === "string" && directImage.trim() !== "") {
    return directImage;
  }

  // Lookup by title
  const lowerTitle = title.toLowerCase();
  const matched = KNOWN_COVERS.find((item) => item.matches.some((m) => lowerTitle.includes(m)));
  if (matched) return matched.cover;

  return DEFAULT_BOOK_COVER;
}
