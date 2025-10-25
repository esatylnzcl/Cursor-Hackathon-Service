import zod from "zod";

export const Validate = <T extends zod.ZodObject<zod.ZodRawShape>>(
  objectToValidate: object,
  validationSchema: T
): zod.infer<T> => {
  try {
    const strictSchema = validationSchema.strict() as T;
    const validatedData = strictSchema.parse(objectToValidate);
    return validatedData;
  } catch (error: unknown) {
    if (error instanceof zod.ZodError) {
      if (process.env.NODE_ENV === "development") {
        console.error("Zod Validation Error (Development Mode):", error); // Zod hatalarını daha detaylı gösterir
      }
      throw error; // Hataları fırlat
    }
    if (process.env.NODE_ENV === "development") {
      console.error("Unexpected Error (Development Mode):", error);
    }
    throw error;
  }
};
