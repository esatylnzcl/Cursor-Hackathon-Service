import { NextFunction, Request, Response } from "express";
import { MongoServerError } from "mongodb";
import { ErrorResponse } from "../../logic/models/ErrorResponse";
import {
  AuthenticationError,
  CredentialsError,
  DuplicationError,
  InvalidOperationError,
  InvalidParameter,
  NotFoundError,
  SessionError,
  UnauthorizedError,
} from "../../logic/models/CustomErrors";
import { ZodError } from "zod";

const errorHandlers = new Map<
  any,
  (err: any) => {
    statusCode: number;
    message: string;
    errorType: string;
    details: any;
  }
>();

errorHandlers.set(MongoServerError, (err: MongoServerError) => {
  if (err.code === 11000) {
    const duplicateKeys = Object.keys(err.keyValue).join(", ");
    return {
      statusCode: 400,
      message: `Duplicate value error`,
      errorType: "Database Error",
      details: `${duplicateKeys} field(s) is/are duplicated`,
    };
  }
  return {
    statusCode: 500,
    message: "A database operation failed unexpectedly.",
    errorType: "DatabaseError",
    details: process.env.NODE_ENV === "development" ? err.message : undefined,
  };
});

errorHandlers.set(ZodError, (err: ZodError) => ({
  statusCode: 400,
  message: "Validation Error",
  errorType: "Validation Error",
  details:
    process.env.NODE_ENV === "development"
      ? JSON.stringify(err.issues)
      : undefined,
}));

errorHandlers.set(AuthenticationError, (err: AuthenticationError) => ({
  statusCode: 401,
  message: err.message,
  errorType: "Authentication Error",
  details: process.env.NODE_ENV === "development" ? err.stack : undefined,
}));

errorHandlers.set(UnauthorizedError, (err: UnauthorizedError) => ({
  statusCode: 403,
  message: err.message,
  errorType: "Authorization Error",
  details: process.env.NODE_ENV === "development" ? err.stack : undefined,
}));

errorHandlers.set(NotFoundError, (err: NotFoundError) => ({
  statusCode: 200,
  message: err.message,
  errorType: "Not Found (No Content)",
  details: process.env.NODE_ENV === "development" ? err.stack : undefined,
}));

errorHandlers.set(DuplicationError, (err: DuplicationError) => ({
  statusCode: 409,
  message: err.message,
  errorType: "Duplication Error",
  details:
    process.env.NODE_ENV === "development"
      ? JSON.stringify(err.data)
      : undefined,
}));

errorHandlers.set(CredentialsError, (err: CredentialsError) => ({
  statusCode: 400,
  message: err.message,
  errorType: "Credentials Error",
  details: process.env.NODE_ENV === "development" ? err.stack : undefined,
}));

errorHandlers.set(InvalidParameter, (err: InvalidParameter) => ({
  statusCode: 400,
  message: err.message,
  errorType: "Invalid Parameters Error",
  details: process.env.NODE_ENV === "development" ? err.stack : undefined,
}));

errorHandlers.set(InvalidOperationError, (err: InvalidOperationError) => ({
  statusCode: 400,
  message: err.message,
  errorType: "Invalid Operation Error",
  details: process.env.NODE_ENV === "development" ? err.stack : undefined,
}));

errorHandlers.set(SessionError, (err: SessionError) => ({
  statusCode: 401,
  message: err.message,
  errorType: "Session Error",
  details: process.env.NODE_ENV === "development" ? err.stack : undefined,
}));

// BSON Error Handler (handled by name as it's not a direct class)
errorHandlers.set("BSONError", (err: Error) => {
  const stackLines = err.stack ? err.stack.split("\n") : [];
  const relevantStackLine = stackLines.find(
    (line) => line.includes("ObjectId") || line.includes("BSON")
  );
  const details =
    process.env.NODE_ENV === "development"
      ? `Geçersiz ID veya veri formatı: ${err.message}${
          relevantStackLine
            ? `\nKaynak Fonksiyon: ${relevantStackLine.trim()}`
            : ""
        }`
      : undefined;
  return {
    statusCode: 400,
    message: "Geçersiz ID veya veri formatı: " + err.message,
    errorType: "Veri Formatı Hatası (BSON)",
    details: details,
  };
});

function GlobalErrorHandler(
  err: Error | MongoServerError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let handler = errorHandlers.get(err.constructor);
  console.log(err);
  if (!handler && err.name) {
    handler = errorHandlers.get(err.name);
  }

  const { statusCode, message, errorType, details } = handler
    ? handler(err)
    : {
        statusCode: 500,
        message: "An unexpected error occurred!",
        errorType: "Internal Server Error",
        details:
          process.env.NODE_ENV === "development" ? String(err) : undefined,
      };

  const response: ErrorResponse<any> = new ErrorResponse(message, {
    errorType,
    details,
  });

  res.status(statusCode).json(response);
}

export { GlobalErrorHandler as ErrHandler };
