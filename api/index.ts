import app from "../dist/src/app";
import serverless from "serverless-http";

export default serverless(app);
