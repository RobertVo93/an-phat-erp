import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "An Phat ERP API",
      version: "1.0.0",
      description: "API documentation for An Phat ERP system",
    },
  },
  apis: [path.resolve(process.cwd(), "app/api/**/*{.ts,.js}")], // Path to the API docs
}); 