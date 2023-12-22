import { Request, Response } from "express";
import {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  SUCCESS,
  UNAUTHORIZED,
} from "../../utilities/constants/http-constants";
import { secretKey } from "../../utilities/constants/keys";
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
      const newClass = await createSingleRecord(Classes, {
        className,
        adminId,
        classId,
        isActive: true,
        isDeleted: false,
      });
      let newClassAdmin = {
        className,
        adminId,
        classId,
      };
      await updateRecord(
        Admin,
        { adminId },
        { $push: { classes: newClassAdmin } }
      );

      if (newClass.hasData) {
        res.status(SUCCESS).json({ newClass, message: "class added" });
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
      const result = await updateRecord(Classes, { classId }, { className });
      await updateRecord(
        Admin,
        { adminId, "classes.classId": classId },
        { $set: { "classes.$.className": newClassName } }
      );
      await updateRecord(
        Student,
        { adminId, "classes.classId": classId },
        { $set: { "classes.$.className": newClassName } }
      );

      result.hasData
        ? res.status(SUCCESS).json({ result })
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
      const result = await deleteManyRecord(Classes, { adminId, classId });
      await deleteManyRecord(Student, { classId });
      await deleteManyRecord(Admin, { classId });
      result.hasData
        ? res.status(SUCCESS).json({ result, message: "Class deleted" })
        : res.status(BAD_REQUEST).json({ message: "Bad delete request" });
    } else {
      res.status(UNAUTHORIZED).json({ message: "credentials don't match" });
    }
  } catch (error) {
    res.status(SERVER_ERROR).json({ error: "Server Error" });
  }
};
