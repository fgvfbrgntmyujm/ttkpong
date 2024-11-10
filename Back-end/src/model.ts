import { Database } from "bun:sqlite";
import path from "path";
import bcrypt from "bcryptjs";

// Define the path for the database file
const dbPath = path.join(process.cwd(), "mydb.sqlite");
const db = new Database(dbPath);

// Create `users` and `books` tables if they don't exist
db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );
`).run();

db.query(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    author TEXT,
    price REAL
  );
`).run();

// Function to add a new user with hashed password
export const createUser = async (user: { email: string; password: string }) => {
  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    db.query("INSERT INTO users (email, password) VALUES ($email, $password);").run({
      $email: user.email,
      $password: hashedPassword
    });
    console.log("User added successfully!");
    return { status: 'ok' };
  } catch (error) {
    console.error("Error adding user:", error.message);
    return { status: 'error' };
  }
};

// Function to verify user's password
export const checkPassword = async (email: string, password: string): Promise<boolean> => {
  try {
    const result = db.query("SELECT password FROM users WHERE email = $email;").get({ $email: email });
    if (!result) throw new Error("User not found");

    const isMatch = await bcrypt.compare(password, result.password);
    if (!isMatch) throw new Error("Incorrect password");

    return true;
  } catch (error) {
    console.error("Error checking password:", error.message);
    return false;
  }
};

// Function to add a new book
export const createBook = (book: { name: string; author: string; price: number }) => {
  try {
    db.query("INSERT INTO books (name, author, price) VALUES ($name, $author, $price);").run({
      $name: book.name,
      $author: book.author,
      $price: book.price
    });
    console.log("Book added successfully!");
    return { status: 'ok' };
  } catch (error) {
    console.error("Error adding book:", error.message);
    return { status: 'error' };
  }
};

// Function to retrieve all books
export const getBooks = () => {
  try {
    const result = db.query("SELECT * FROM books;").all();
    return result;
  } catch (error) {
    console.error("Error fetching books:", error.message);
    return [];
  }
};

// Function to retrieve a book by its ID
export const getBook = (id: number) => {
  try {
    const result = db.query("SELECT * FROM books WHERE id = $id;").get({ $id: id });
    return result;
  } catch (error) {
    console.error("Error fetching book by ID:", error.message);
    return null;
  }
};

// Function to update a book by its ID
export const updateBook = (id: number, book: { name: string; author: string; price: number }) => {
  try {
    db.query("UPDATE books SET name = $name, author = $author, price = $price WHERE id = $id;").run({
      $id: id,
      $name: book.name,
      $author: book.author,
      $price: book.price
    });
    console.log("Book updated successfully!");
    return { status: 'ok' };
  } catch (error) {
    console.error("Error updating book:", error.message);
    return { status: 'error' };
  }
};

// Function to delete a book by its ID
export const deleteBook = (id: number) => {
  try {
    db.query("DELETE FROM books WHERE id = $id;").run({ $id: id });
    console.log(`Book with ID ${id} deleted successfully!`);
    return { status: 'ok' };
  } catch (error) {
    console.error("Error deleting book:", error.message);
    return { status: 'error' };
  }
};
