import mongoose from "mongoose";
const host = "127.0.0.1";
export const dbInit = () =>
  mongoose.connect(
    `mongodb://${host}:27017/codewise?replicaSet=rs0,${host}:27018/codewise?replicaSet=rs0, ${host}:27019/codewise?replicaSet=rs0`,
    {
      replicaSet: "rs0",
    }
  );

mongoose.connection.on("error", (err: string) => {
  console.log("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});
export default mongoose;
