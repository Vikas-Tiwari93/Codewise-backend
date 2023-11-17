import fs from "fs";

export const path = `${process.cwd()}/uploads/`;

export const makeDirectories = (path: string) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
};

export const initalServicesInit = () => {
  makeDirectories(path);
};
