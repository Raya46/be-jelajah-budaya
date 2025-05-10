import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerDefinition from "./docs/index";
import serverless from "serverless-http";

import budayaRoute from "../src/routes/BudayaRoute";
import daerahRoute from "../src/routes/DaerahRoute";
import eventRoute from "../src/routes/EventRoute";
import provinsiRoute from "../src/routes/ProvinsiRoute";
import requestRoute from "../src/routes/RequestRoute";
import userEventRateRoute from "../src/routes/UserEventRateRoute";
import userRoute from "../src/routes/UserRoute";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: "*",
    allowedHeaders: ["Content-type", "Authorization"],
  })
);
app.use(helmet());
app.use(compression());

app.use("/users", userRoute);
app.use("/events", eventRoute);
app.use("/provinsi", provinsiRoute);
app.use("/daerah", daerahRoute);
app.use("/budaya", budayaRoute);
app.use("/event-ratings", userEventRateRoute);
app.use("/requests", requestRoute);

const options = {
  definition: swaggerDefinition,
  apis: ["./routes/*.ts", "./docs/paths/*.ts", "./docs/schemas/*.ts"],
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});

export default serverless(app);
