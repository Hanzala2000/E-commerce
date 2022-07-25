// Uncaught Exception

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Server Shut Down Due To UnCaught Exception");

  process.exit(1);
});

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const mainRouter = require("./route/index");
const dotEnv = require("dotenv");
const bd = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 8080;
const connectDatabase = require("./config/database");
const errorMiddleware = require("./middleware/error");
app.use(cors());
app.use(express.json());
// app.use(fileUpload())
app.use(cookieParser());
app.use(
  bd.urlencoded({
    extended: true,
  })
);
// app.use(bd.json());
app.use(mainRouter);
dotEnv.config({ path: "config/config.env" });
connectDatabase();
// cloudinary.config({
//     cloud_name:process.env.CLOUDINARY_NAME,
//     api_key:process.env.API_KEY,
//     api_secret:process.env.API_SECRET,
// })
app.use(errorMiddleware);

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

// unhandled promose rejection

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Server Shut Down Due To Unhandled Rejection");

  server.close(() => {
    process.exit(1);
  });
});
