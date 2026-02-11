import "dotenv/config";
import { prisma } from "./common/db/prisma"

async function main() {
  // 1. Clear existing data (optional)
  await prisma.book.deleteMany();
  await prisma.category.deleteMany();

  // Create categories
  const categories = await prisma.category.createMany({
    data: [
      { name: "Fiction", description: "Fiction books including novels and literature." },
      { name: "Science", description: "Books related to science, technology, and research." },
      { name: "History", description: "Books covering historical events and biographies." },
      { name: "Self-Help", description: "Books for personal development and motivation." },
      { name: "Children", description: "Books for children and young readers." },
    ],
    skipDuplicates: true,
  });

  // Fetch category IDs
  const allCategories = await prisma.category.findMany();

  // Map categories by name for easy reference
  const catMap: Record<string, number> = {};
  allCategories.forEach((cat) => {
    catMap[cat.name] = cat.id;
  });

  // Create books
  await prisma.book.createMany({
    data: [
      { name: "The Great Gatsby", description: "Classic novel by F. Scott Fitzgerald", price: 15.99, author: "F. Scott Fitzgerald", stock: 10, categoryId: catMap["Fiction"] },
      { name: "1984", description: "Dystopian novel by George Orwell", price: 12.5, author: "George Orwell", stock: 8, categoryId: catMap["Fiction"] },
      { name: "To Kill a Mockingbird", description: "Novel by Harper Lee", price: 14.99, author: "Harper Lee", stock: 12, categoryId: catMap["Fiction"] },
      { name: "A Brief History of Time", description: "Science book by Stephen Hawking", price: 20, author: "Stephen Hawking", stock: 5, categoryId: catMap["Science"] },
      { name: "The Selfish Gene", description: "Evolutionary biology by Richard Dawkins", price: 18, author: "Richard Dawkins", stock: 7, categoryId: catMap["Science"] },
      { name: "Sapiens", description: "History of humankind by Yuval Noah Harari", price: 22, author: "Yuval Noah Harari", stock: 6, categoryId: catMap["History"] },
      { name: "Guns, Germs, and Steel", description: "Historical analysis by Jared Diamond", price: 19.5, author: "Jared Diamond", stock: 4, categoryId: catMap["History"] },
      { name: "Atomic Habits", description: "Self-help book by James Clear", price: 16, author: "James Clear", stock: 15, categoryId: catMap["Self-Help"] },
      { name: "The 7 Habits of Highly Effective People", description: "Classic self-help by Stephen Covey", price: 17.5, author: "Stephen Covey", stock: 10, categoryId: catMap["Self-Help"] },
      { name: "The Power of Now", description: "Spiritual guide by Eckhart Tolle", price: 14, author: "Eckhart Tolle", stock: 8, categoryId: catMap["Self-Help"] },
      { name: "Harry Potter and the Sorcerer's Stone", description: "Fantasy novel by J.K. Rowling", price: 12.99, author: "J.K. Rowling", stock: 20, categoryId: catMap["Children"] },
      { name: "Charlotte's Web", description: "Children's classic by E.B. White", price: 11.5, author: "E.B. White", stock: 15, categoryId: catMap["Children"] },
      { name: "Matilda", description: "Children's book by Roald Dahl", price: 13, author: "Roald Dahl", stock: 12, categoryId: catMap["Children"] },
      { name: "Green Eggs and Ham", description: "Book by Dr. Seuss", price: 9.99, author: "Dr. Seuss", stock: 25, categoryId: catMap["Children"] },
      { name: "The Cat in the Hat", description: "Classic Dr. Seuss book", price: 10.5, author: "Dr. Seuss", stock: 20, categoryId: catMap["Children"] },
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
