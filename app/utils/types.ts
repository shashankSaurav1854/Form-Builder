export interface BaseFieldProps {
  label: string;
  required: boolean;
  helpText?: string;
}

export interface TextFieldProps extends BaseFieldProps {
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
}

export interface TextareaFieldProps extends TextFieldProps {
  rows?: number;
}

export interface DropdownFieldProps extends BaseFieldProps {
  options: string[];
}

export interface CheckboxFieldProps {
  label: string;
  required: boolean;
}

export interface DateFieldProps extends BaseFieldProps {}

export type FieldProps = TextFieldProps | TextareaFieldProps | DropdownFieldProps | CheckboxFieldProps | DateFieldProps;

export type FieldType = 'text' | 'textarea' | 'dropdown' | 'checkbox' | 'date' | 'email' | 'phone';

export interface FormField {
  id: string;
  type: FieldType;
  props: FieldProps;
}

export interface FieldTypeConfig {
  label: string;
  icon: string;
  defaultProps: FieldProps;
}

export interface FormTemplate {
  name: string;
  fields: FormField[];
}

export interface SavedForm {
  id: string;
  name: string;
  fields: FormField[];
  isMultiStep: boolean;
  createdAt: string;
}

export interface ValidationError {
  [fieldId: string]: string | null;
}

export interface FormData {
  [fieldId: string]: string | boolean | undefined;
}

export type PreviewMode = 'desktop' | 'tablet' | 'mobile';

export interface FieldRendererProps {
  field: FormField;
  value: string | boolean | undefined;
  error: string | null | undefined;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onChange: (value: string | boolean) => void;
}

export interface FieldPropertiesProps {
  field: FormField;
  onUpdate: (newProps: Partial<FieldProps>) => void;
}
