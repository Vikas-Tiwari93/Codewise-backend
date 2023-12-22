import mongoose from "mongoose";
const executeOperationsInTransaction = async (
  operations: [(session: mongoose.mongo.ClientSession) => void]
) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const results = await Promise.all(operations.map((op) => op(session)));

      await session.commitTransaction();
      session.endSession();

      return results;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error starting transaction:", error);
    }
  } catch (error) {
    console.error("Error starting transaction:", error);
  }
};

// const operations = [
//   async (session) =>
//     await deleteManyRecordInTransaction(Classes, { adminId, classId }, session),
//   async (session) =>
//     await deleteManyRecordInTransaction(Student, { classId }, session),
//   async (session) =>
//     await deleteManyRecordInTransaction(Admin, { classId }, session),
// ];
