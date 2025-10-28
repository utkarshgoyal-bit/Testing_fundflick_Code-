// types.ts
export interface IValidation {
  required?: {
    value: boolean;
    message: string;
  };
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  min?: { value: number; message: string };
  max?: { value: number; message: string };
  confirm?: { value: string; message: string };
}
export interface IFieldConfig {
  label: string;
  name: string;
  type:
    | "text"
    | "password"
    | "number"
    | "date"
    | "select"
    | "radio"
    | "checkbox"
    | "email"
    | "file"
    | "multiselect"
    | "phone";
  placeholder?: string;
  options?: { value: string; label: string }[]; // For select and radio
  validations: IValidation;
  multiple?: boolean;
  disabled?: boolean;
}
