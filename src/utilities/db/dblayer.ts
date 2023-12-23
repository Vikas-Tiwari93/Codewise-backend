import * as Mongoose from "mongoose";
//Create
export const createSingleRecord = async <T>(
  model: Mongoose.Model<T>,
  payload: Partial<T>
) => {
  try {
    const resultSet = await model.create(payload);
    if (!resultSet) {
      return prepareResponse("Failed to create record");
    }
    await resultSet.save();
    return prepareResponse("Records created successfully", true, resultSet);
  } catch (error) {
    console.log("@@@Error:", error);
    return prepareResponse("Unable to create record");
  }
};

//Create multiple
export const createMultipleRecord = async <T>(
  model: Mongoose.Model<T>,
  payload: T
) => {
  try {
    const resultSet = await model.insertMany(payload);
    if (!resultSet) {
      return prepareResponse("Failed to create records");
    }
    console.log(resultSet);
    return prepareResponse("Record added successful", true, resultSet);
  } catch (error) {
    console.log("@@@Error:", error);
    return prepareResponse("Unable to create record");
  }
};

//Read
export const getRecordDetails = async <T>(
  model: Mongoose.Model<T>,
  query: Mongoose.FilterQuery<T>
) => {
  try {
    const resultSet = await model.findOne(query);
    console.log(resultSet);

    if (!resultSet) {
      return prepareResponse("No record found");
    }
    return prepareResponse("Record details found", true, resultSet);
  } catch (error) {
    console.log("@@@Error: ", error);
    return prepareResponse("Unable to fetch record");
  }
};

export const getRecordById = async <T>(
  model: Mongoose.Model<T>,
  query: Mongoose.FilterQuery<T>
) => {
  try {
    const resultSet = await model.findById(query);
    if (!resultSet) {
      return prepareResponse("No record found");
    }
    return prepareResponse("Record details found", true, resultSet);
  } catch (error) {
    console.log("@@@Error: ", error);
    return prepareResponse("Unable to fetch record");
  }
};

export const getRecords = async <T>(
  model: Mongoose.Model<T>,
  query: Mongoose.FilterQuery<T>
) => {
  try {
    const resultSet = await model.find(query);
    if (!resultSet || resultSet.length === 0) {
      return prepareResponse("No records found");
    }
    return prepareResponse("Record list found", true, resultSet);
  } catch (error) {
    console.log("@@@Error: ", error);
    return prepareResponse("Unable to fetch records");
  }
};

//Update
export const updateRecord = async <T>(
  model: Mongoose.Model<T>,
  query: Mongoose.FilterQuery<T>,
  payload: Mongoose.UpdateQuery<T>
) => {
  try {
    const resultSet = await model.findOneAndUpdate(query, payload, {
      new: true,
    });
    if (!resultSet) {
      return prepareResponse("No records updated");
    }
    return prepareResponse("Records updated successfully", true, resultSet);
  } catch (error) {
    return prepareResponse("Unable to update records");
  }
};

//Delete record
export const deleteRecord = async <T>(
  model: Mongoose.Model<T>,
  query: Mongoose.FilterQuery<T>
) => {
  try {
    const resultSet = await model.findOneAndDelete(query);
    if (!resultSet) {
      return prepareResponse("No records deleted.");
    }
    return prepareResponse("Records deleted successfully.", true, resultSet);
  } catch (error) {
    console.log("@@@MJ Error:", error);
    return prepareResponse("Unable to deleted records.");
  }
};
export const deleteManyRecord = async <T>(
  model: Mongoose.Model<T>,
  query: Mongoose.FilterQuery<T>
) => {
  try {
    const resultSet = await model.deleteMany(query);
    if (!resultSet) {
      return prepareResponse("No records deleted.");
    }

    return prepareResponse(
      `Records deleted successfully. Deleted records.`,
      true
    );
  } catch (error) {
    console.log("@@@MJ Error:", error);
    return prepareResponse("Unable to deleted records.");
  }
};

//Aggregate record
export const aggreateRecord = async <T>(
  model: Mongoose.Model<T>,
  query: Mongoose.PipelineStage[]
) => {
  try {
    const resultSet = await model.aggregate(query);
    if (!resultSet) {
      return prepareResponse("No records found.");
    }
    return prepareResponse("Records found successfully.", true, resultSet);
  } catch (error) {
    console.log("@@@MJ Error:", error);
    return prepareResponse("Unable to found records.");
  }
};

export const prepareResponse = <T>(
  message: string,
  hasData?: boolean,
  resultSet?: any
) => {
  const hasDataResponse = hasData ? hasData : false;
  return { hasData: hasDataResponse, message, resultSet };
};
