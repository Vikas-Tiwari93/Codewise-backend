import { Request, Response } from "express";
import mongoose from "mongoose";
import {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  SUCCESS,
  UNAUTHORIZED,
} from "../../utilities/constants/http-constants";

import { RequestWithUser } from "../../utilities/tokenGenerators/jwt";
import {
  createSingleRecord,
  getRecordDetails,
  updateRecord,
} from "../../utilities/db/dbwrapper";
import { Classes } from "../../utilities/schemas/classes";
import { v4 as uuidv4 } from "uuid";
import { deleteManyRecord } from "../../utilities/db/dblayer";
import { Student } from "../../utilities/schemas/student";
import { Admin } from "../../utilities/schemas/admin";
import {
  createSingleRecordWithTransactions,
  deleteManyRecordWithTransactions,
  updateRecordWithTransactions,
} from "../../utilities/transations/dblayer";
import { executeOperationsInTransaction } from "../../utilities/transations/transations.methods";

type ClassBody = {
  className: string;
  adminId: string;
};
type UpdateClassBody = {
  className: string;
  adminId: string;
  classId: string;
  newClassName: string;
};

export const getClassDetails = async (req: RequestWithUser, res: Response) => {
  const classId = req.query.classId;
  const adminId = req.params.id;
  const user = req.user;
  console.log(user);
  try {
    if (user) {
      const selectedClass = await getRecordDetails(Classes, {
        adminId,
        classId,
      });

      if (selectedClass.hasData) {
        res.status(SUCCESS).json({ selectedClass, message: "class found" });
      } else {
        res.status(NOT_FOUND).json({ message: "class not found" });
      }
    }
  } catch (error) {
    res.status(SERVER_ERROR).json({ error: "Error in password change" });
  }
};
export const addNewClass = async (req: RequestWithUser, res: Response) => {
  const { className, adminId } = <ClassBody>(<unknown>req.body);

  const user = req.user;
  const classId = uuidv4();
  console.log(user);
  try {
    if (user) {
      let newClassAdmin = {
        className,
        adminId,
        classId,
      };
      let createClassOperations = [
        async (session: mongoose.mongo.ClientSession) =>
          await createSingleRecordWithTransactions(
            Classes,
            {
              className,
              adminId,
              classId,
              isActive: true,
              isDeleted: false,
            },
            session
          ),
        async (session: mongoose.mongo.ClientSession) =>
          await updateRecordWithTransactions(
            Admin,
            { adminId },
            { $push: { classes: newClassAdmin } },
            session
          ),
      ];

      const newClass = await executeOperationsInTransaction(
        createClassOperations
      );

      if (newClass && newClass[0]?.hasData) {
        res
          .status(SUCCESS)
          .json({ newClass: newClass[0], message: "class added" });
      } else {
        res.status(BAD_REQUEST).json({ message: "error in while class" });
      }
    } else {
      res.status(UNAUTHORIZED).json({ message: "credentials don't match" });
    }
  } catch (error) {
    res.status(SERVER_ERROR).json({ error: "Error in password change" });
  }
};
export const updateCLassDetails = async (
  req: RequestWithUser,
  res: Response
) => {
  const { className, newClassName, adminId, classId } = <UpdateClassBody>(
    (<unknown>req.body)
  );
  const user = req.user;
  try {
    if (user) {
      let updateClassOperations = [
        async (session: mongoose.mongo.ClientSession) =>
          await updateRecordWithTransactions(
            Admin,
            { adminId, "classes.classId": classId },
            { $set: { "classes.$.className": newClassName } },
            session
          ),
        async (session: mongoose.mongo.ClientSession) =>
          await updateRecordWithTransactions(
            Classes,
            { classId },
            { className },
            session
          ),
        async (session: mongoose.mongo.ClientSession) =>
          await updateRecordWithTransactions(
            Student,
            { adminId, "classes.classId": classId },
            { $set: { "classes.$.className": newClassName } },
            session
          ),
      ];
      const updatedClass = await executeOperationsInTransaction(
        updateClassOperations
      );

      updatedClass && updatedClass[1].hasData
        ? res.status(SUCCESS).json({ updatedClass: updatedClass[1] })
        : res.status(BAD_REQUEST).json({ message: "Coundn't find class" });
    } else {
      res.status(UNAUTHORIZED).json({ message: "credentials don't match" });
    }
  } catch (error) {
    res.status(SERVER_ERROR).json({ error: "Error in password change" });
  }
};
export const deleteClass = async (req: RequestWithUser, res: Response) => {
  const adminId = req.params.id;
  const classId = req.query.classId as string;

  const user = req.user;

  try {
    if (user) {
      const deleteOperations = [
        async (session: mongoose.mongo.ClientSession) =>
          await deleteManyRecordWithTransactions(
            Classes,
            { adminId, classId },
            session
          ),
        async (session: mongoose.mongo.ClientSession) =>
          await deleteManyRecordWithTransactions(Student, { classId }, session),
        async (session: mongoose.mongo.ClientSession) =>
          await deleteManyRecordWithTransactions(Admin, { classId }, session),
      ];
      const result = await executeOperationsInTransaction(deleteOperations);

      result && result[0].hasData
        ? res.status(SUCCESS).json({ result, message: "Class deleted" })
        : res.status(BAD_REQUEST).json({ message: "Bad delete request" });
    } else {
      res.status(UNAUTHORIZED).json({ message: "credentials don't match" });
    }
  } catch (error) {
    res.status(SERVER_ERROR).json({ error: "Server Error" });
  }
};
