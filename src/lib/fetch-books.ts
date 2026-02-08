import { BookData } from "@/types";

export default async function fetchBooks(q?: string): Promise<BookData[]> {
  let url = `http://localhost:8080/book`;

  if (q) {
    url += `/search?q=${q}`;
  }

  try {
    const response = await fetch(url);
    if (!response) throw new Error("");

    return await response.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}
