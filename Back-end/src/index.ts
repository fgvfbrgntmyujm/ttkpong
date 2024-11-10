import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger"; // Import swagger plugin
import { getBooks, createBook, getBook, updateBook, deleteBook } from "./model";

const app = new Elysia();

// เพิ่ม swagger plugin
app.use(
  swagger({
    documentationPath: "/api-docs", // Path for Swagger UI documentation
    info: {
      title: "Book API",
      description: "API for managing books",
      version: "1.0.0",
    },
  })
);

// เส้นทาง GET สำหรับดึงข้อมูลหนังสือทั้งหมด
app.get("/books", () => {
  return getBooks();
});

// เส้นทาง POST สำหรับเพิ่มหนังสือใหม่
app.post("/books", async ({ body }) => {
  try {
    const response = createBook({
      name: body.name,
      author: body.author,
      price: body.price,
    });
    if (response.status === "error") {
      return { message: "Insert incomplete" };
    }
    return { message: "Book added successfully!" };
  } catch (error) {
    console.error("Error:", error);
    return { message: "Error occurred during insertion" };
  }
});

// เส้นทาง PUT สำหรับอัปเดตหนังสือ
app.put("/books/:id", async ({ params, body }) => {
  try {
    const bookId = parseInt(params.id);
    if (isNaN(bookId)) {
      return { message: "Invalid book ID" };
    }

    // ตรวจสอบว่าหนังสือมีอยู่จริงหรือไม่
    const existingBook = await getBook(bookId); // เพิ่ม await เพื่อรอผลลัพธ์จากฐานข้อมูล
    if (!existingBook) {
      return { message: `Book with ID ${bookId} not found` };
    }

    const response = updateBook(bookId, {
      name: body.name,
      author: body.author,
      price: body.price,
    });
    if (response.status === "error") {
      return { message: "Update incomplete" };
    }
    return { message: "Book updated successfully!" };
  } catch (error) {
    console.error("Error:", error);
    return { message: "Error occurred during update" };
  }
});

// เส้นทาง DELETE สำหรับลบหนังสือโดย ID
app.delete("/books/:id", async ({ params }) => {
  try {
    const bookId = parseInt(params.id);
    if (isNaN(bookId)) {
      return { message: "Invalid book ID" };
    }

    // ตรวจสอบว่าหนังสือมีอยู่จริงหรือไม่
    const existingBook = await getBook(bookId); // เพิ่ม await เพื่อรอผลลัพธ์จากฐานข้อมูล
    if (!existingBook) {
      return { message: `Book with ID ${bookId} not found` };
    }

    const response = deleteBook(bookId);
    if (response.status === "error") {
      return { message: "Delete incomplete" };
    }
    return { message: `Book with ID ${bookId} deleted successfully!` };
  } catch (error) {
    console.error("Error:", error);
    return { message: "Error occurred during deletion" };
  }
});

// เริ่มเซิร์ฟเวอร์
app.listen(8000);
console.log("🦊 Elysia is running at http://localhost:8000");
console.log("Swagger documentation available at http://localhost:8000/api-docs");
