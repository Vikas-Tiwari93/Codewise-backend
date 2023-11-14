const mongoose = require("mongoose");
export const dbInit = () =>
  mongoose.connect("mongodb://127.0.0.1:27017/codewise", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

mongoose.connection.on("error", (err: string) => {
  console.log("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});
