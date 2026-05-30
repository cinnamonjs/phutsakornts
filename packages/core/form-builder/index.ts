export type {
  ButtonAdapterProps,
  ComponentAdapter,
  ComponentAdapterProviderProps,
  FieldInputProps,
  FormItemWrapperProps,
  IconName,
  SectionWrapperProps,
} from "@/components/module/form-builder/component-adapter";
export {
  ComponentAdapterProvider,
  defaultAdapter,
  useComponentAdapter,
} from "@/components/module/form-builder/component-adapter";
export type { FieldBuilderOf, TypedFormSection } from "@/components/module/form-builder/config-builder";
// New config-builder exports
export {
  ConditionalHelpers,
  createCustomSection,
  createField as createFieldBuilder,
  createFieldGroup as createFieldGroupBuilder,
  createForm as createFormBuilder,
  createSection as createSectionBuilder,
  DEFAULT_I18N_CONFIG,
  DEFAULT_LAYOUT_CONFIG,
  DEFAULT_SUBMISSION_CONFIG,
  defineCustomField,
  FieldConfigBuilder as FieldBuilder,
  FormConfigBuilder as _FormConfigBuilder,
  FormSectionBuilder as SectionBuilder,
  loadFormConfigFromJSON,
  OptionHelpers,
  saveFormConfigToJSON,
  ValidationHelpers,
} from "./config-builder";
export { FieldRenderer } from "./field-renderer";
export { cleanEmpty, FormBuilder } from "./form-builder";
export { FormSection } from "./form-section";
export {
  createPlugin,
  PluginProvider,
  usePlugins,
  withPlugins,
} from "./plugin-manager";
export { FormPresets } from "./presets";
export * from "./types";
export { useFormMethods } from "./use-form-methods";
export * from "./utils";
