import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import connectDB from "./db.js";

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(` server listening on http://localhost:${PORT}`);
  });
});
