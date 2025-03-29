const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Netflix Clone API",
            version: "1.0.0",
            description: "API cho hệ thống Netflix Clone - Phát video trực tuyến",
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Local server"
            }
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [{ BearerAuth: [] }] // 🛑 Thêm BearerAuth cho tất cả API
    },
    apis: ["./src/routes/*.js"], // Quét tất cả các file trong routes để lấy API Docs
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log("📄 Swagger Docs: http://localhost:5000/api-docs");
};

module.exports = swaggerDocs;
