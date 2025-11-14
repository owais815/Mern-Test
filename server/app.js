/*

================== Most Important ==================
* Issue 1 :
In uploads folder you need create 3 folder like bellow.
Folder structure will be like:
public -> uploads -> 1. products 2. customize 3. categories
*** Now This folder will automatically create when we run the server file

* Issue 2:
For admin signup just go to the auth
controller then newUser obj, you will
find a role field. role:1 for admin signup &
role: 0 or by default it for customer signup.
go user model and see the role field.

*/

const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Import Router
const authRouter = require("./routes/auth");
const categoryRouter = require("./routes/categories");
const productRouter = require("./routes/products");
const brainTreeRouter = require("./routes/braintree");
const orderRouter = require("./routes/orders");
const usersRouter = require("./routes/users");
const customizeRouter = require("./routes/customize");
// Import Auth middleware for check user login or not~
const { loginCheck } = require("./middleware/auth");
const CreateAllFolder = require("./config/uploadFolderCreateScript");

/* Create All Uploads Folder if not exists | For Uploading Images */
CreateAllFolder();

// Database Connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() =>
    console.log(
      "==============Mongodb Database Connected Successfully=============="
    )
  )
  .catch((err) => console.log("Database Not Connected !!!"));

// Middleware
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes - Must be before static middleware to avoid conflicts
app.use("/api", authRouter);
app.use("/api/user", usersRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api", brainTreeRouter);
app.use("/api/order", orderRouter);
app.use("/api/customize", customizeRouter);

// Static files - Serve React app after API routes (exclude /api paths)
app.use((req, res, next) => {
  // Skip static file serving for API routes
  if (req.path.startsWith("/api")) {
    return next();
  }
  express.static("public")(req, res, next);
});

// Catch-all handler for React app (must be last, and exclude /api)
app.get("*", (req, res, next) => {
  // Don't serve React app for API routes
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API endpoint not found", path: req.path });
  }
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Run Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Server is running on ", PORT);
});
