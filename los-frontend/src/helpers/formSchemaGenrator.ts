import { z, ZodType } from "zod";
import { IFieldConfig } from "@/lib/interfaces";

const createSchema = (validationConfig: IFieldConfig[]) => {
  let isConfirm = false;
  const shape: any = {};
  for (const field of validationConfig) {
    if (field.validations.confirm?.value) {
      isConfirm = true;
    }
    const { name, validations, type } = field;
    let validation: ZodType<any, any> =
      type === "number"
        ? z.number()
        : type == "multiselect"
          ? z.array(z.string())
          : z.string();
    if (validations.required?.value) {
      validation =
        type === "number"
          ? validation
          : (validation as z.ZodString).nonempty({
            message: validations.required.message,
          });
    }
    if (validations.minLength) {
      validation = (validation as z.ZodString).min(
        validations.minLength.value,
        { message: validations.minLength.message }
      );
    }
    if (validations.maxLength) {
      validation = (validation as z.ZodString).max(
        validations.maxLength.value,
        { message: validations.maxLength.message }
      );
    }
    if (validations.min) {
      validation = (validation as z.ZodNumber).min(validations.min.value, {
        message: validations.min.message,
      });
    }
    if (validations.max) {
      validation = (validation as z.ZodNumber).max(validations.max.value, {
        message: validations.max.message,
      });
    }
    if (validations.confirm) {
      validation = validation.refine(
        (val) => val === validations.confirm?.value,
        { message: validations.confirm.message }
      );
    }
    shape[name] = validation;
  }
  if (isConfirm) {
    let confirmValidation = z.object(shape);
    return confirmValidation.refine(
      (data) => data.password !== data.confirmPassword,
      {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      }
    );
  } else {
    return z.object(shape);
  }
};

export default createSchema;
