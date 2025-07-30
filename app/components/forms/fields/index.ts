import FloatField from "./Float";
import InputField from "./Input";

export const fieldComponents: Record<string, React.FC<any>> = {
  text: InputField,
  email: InputField,
  password: InputField,
  number: InputField,
  float: FloatField,
  // textarea: TextAreaField,
  // select: SelectField,
  // checkbox: CheckboxField,
};