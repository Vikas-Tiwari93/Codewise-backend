import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";
import { dbInit } from "./utilities/db";
import { AuthRouter } from "./apis/auth/auth.router";
import { imageUploadConfig } from "./services/uploadsDownloads/imageUpload/image";
import { initalServicesInit } from "./utilities/initialservices/initialServices";

dbInit();
const app = express();
initalServicesInit();
const port = 5000;

// MongoDB connection

app.use(bodyParser.json());
app.use(cors());
app.use(imageUploadConfig);
app.use("/auth", AuthRouter);
// Sign-up route

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
