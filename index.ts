import express from "express";
import cors from "cors";
import { createServer, request } from "http";
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
import requestRoute from "./routes/RequestRoute";
import userEventRateRoute from "./routes/UserEventRateRoute";

dotenv.config();
const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(compression());

// Register routes
app.use("/users", userRoute);
app.use("/events", eventRoute);
app.use("/provinsi", provinsiRoute);
app.use("/daerah", daerahRoute);
app.use("/budaya", budayaRoute);
app.use("/event-ratings", userEventRateRoute);
app.use("/requests", requestRoute);

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

const options = {
  definition: swaggerDefinition,
  apis: ["./routes/*.ts", "./docs/paths/*.ts", "./docs/schemas/*.ts"], // Adjust the paths as needed
};


const swaggerDocs = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
);

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});


