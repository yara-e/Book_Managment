import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

export const setupSwagger = (app: Express) => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Book Management API",
        version: "1.0.0",
        description: "API for managing books and categories",
      },
      tags: [
        { name: "Books", description: "APIs related to books" },
        { name: "Categories", description: "APIs related to categories" },
      ],

      components: {
        schemas: {

          Category: {
            type: "object",
            properties: {
              id: { type: "number" },
              name: { type: "string" },
              description: { type: "string" },
            },
          },

          BookWithCategory: {
            type: "object",
            properties: {
              id: { type: "number" },
              name: { type: "string" },
              description: { type: "string" },
              price: { type: "number" },
              author: { type: "string" },
              stock: { type: "number" },
              categoryId: { type: "number" },
              category: {
                $ref: "#/components/schemas/Category",
              },
            },
          },
          Book: {
            type: "object",
            properties: {
              id: { type: "number" },
              name: { type: "string" },
              description: { type: "string" },
              price: { type: "number" },
              author: { type: "string" },
              stock: { type: "number" },
              categoryId: { type: "number" },
            },
          },

          CreateBookInput: {
            type: "object",
            required: ["name", "description", "price", "author", "stock", "categoryId"],
            properties: {
              name: { type: "string" },
              description: { type: "string" },
              price: { type: "number" },
              author: { type: "string" },
              stock: { type: "number" },
              categoryId: { type: "number" },
            },
          },
          CreateCategoryInput: {
            type: "object",
            required: ["name", "description"],
            properties: {
              name: { type: "string" },
              description: { type: "string" },
            },
          },

        },



      }
    },



    apis: ["./src/app/books/book.routes.ts",
      "./src/app/categories/category.routes.ts"
    ],

  };

  const specs = swaggerJsdoc(options);


  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(specs);
  });
};
