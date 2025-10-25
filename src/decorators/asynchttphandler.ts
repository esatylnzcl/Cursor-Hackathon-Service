import { NextFunction, Request, Response } from "express";

function http_asynchandler(target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
  const fn = descriptor.value;
  descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
    try {
      await fn.call(this, req, res, next);
    } catch (error) {
      next(error);
    }
  };
  return descriptor;
}

export { http_asynchandler as ahandler };
