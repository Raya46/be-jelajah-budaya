import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerDefinition from "./docs/index";

// Import routes
import userRoute from "./routes/UserRoute";
import eventRoute from "./routes/EventRoute";
import provinsiRoute from "./routes/ProvinsiRoute";
import daerahRoute from "./routes/DaerahRoute";
import budayaRoute from "./routes/BudayaRoute";
import userEventRateRoute from "./routes/UserEventRateRoute";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());

const options = {
  definition: swaggerDefinition,
  apis: ["./routes/*.ts", "./docs/paths/*.ts", "./docs/schemas/*.ts"], // Adjust the paths as needed
};

const swaggerDocs = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Register routes
app.use("/api", userRoute);
app.use("/api", eventRoute);
app.use("/api", provinsiRoute);
app.use("/api", daerahRoute);
app.use("/api", budayaRoute);
app.use("/api", userEventRateRoute);

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(
    `Swagger documentation available at http://localhost:${PORT}/api-docs`
  );
});
