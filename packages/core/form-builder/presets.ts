import type { FormConfig, FormData } from "@/components/module/form-builder/types";
import {
  createField,
  createForm,
  createSection,
  OptionHelpers,
  ValidationHelpers,
} from "@/components/module/form-builder/config-builder";

export const FormPresets = {
  contactForm: (id = "contact-form"): FormConfig =>
    createForm(id)
      .withTitle("Contact Us")
      .withDescription("Get in touch with our team")
      .addSection(
        createSection("contact-info")
          .withTitle("Contact Information")
          .withFields([
            createField("name", "text", "Full Name")
              .asRequired()
              .withPlaceholder("Enter your full name")
              .build(),

            createField("email", "email", "Email Address")
              .asRequired()
              .addValidation(ValidationHelpers.email())
              .withPlaceholder("your.email@example.com")
              .build(),

            createField("phone", "text", "Phone Number")
              .addValidation(ValidationHelpers.phone())
              .withPlaceholder("+1 (555) 123-4567")
              .build(),

            createField("subject", "select", "Subject")
              .asRequired()
              .withOptions([
                { label: "General Inquiry", value: "general" },
                { label: "Support", value: "support" },
                { label: "Sales", value: "sales" },
                { label: "Partnership", value: "partnership" },
              ])
              .build(),

            createField("message", "textarea", "Message")
              .asRequired()
              .addValidation(ValidationHelpers.minLength(10))
              .withPlaceholder("Tell us how we can help...")
              .build(),
          ])
          .build(),
      )
      .withLayout({ columns: 1, spacing: "md" })
      .withSubmission({
        submitText: "Send Message",
        validation: "onSubmit",
      })
      .build(),

  registrationForm: (id = "registration-form"): FormConfig =>
    createForm(id)
      .withTitle("Create Account")
      .withDescription("Join our platform today")
      .addSection(
        createSection("personal-info")
          .withTitle("Personal Information")
          .withFields([
            createField("firstName", "text", "First Name")
              .asRequired()
              .withGrid({ colSpan: 6 })
              .build(),

            createField("lastName", "text", "Last Name")
              .asRequired()
              .withGrid({ colSpan: 6 })
              .build(),

            createField("email", "email", "Email Address")
              .asRequired()
              .addValidation(ValidationHelpers.email())
              .build(),

            createField("password", "password", "Password")
              .asRequired()
              .addValidation(ValidationHelpers.password())
              .build(),

            createField("confirmPassword", "password", "Confirm Password")
              .asRequired()
              .addValidation(
                ValidationHelpers.custom((value, allValues: FormData) => {
                  return (
                    value === (allValues.password as string) ||
                    "Passwords must match"
                  );
                }),
              )
              .build(),
          ])
          .build(),
      )
      .addSection(
        createSection("preferences")
          .withTitle("Preferences")
          .withFields([
            createField("newsletter", "checkbox", "Subscribe to Newsletter")
              .withDescription(
                "Receive updates about new features and promotions",
              )
              .build(),

            createField("terms", "checkbox", "Accept Terms and Conditions")
              .asRequired(true, "You must accept the terms and conditions")
              .build(),
          ])
          .build(),
      )
      .withLayout({ columns: 12, spacing: "md" })
      .withSubmission({
        submitText: "Create Account",
        validation: "onSubmit",
      })
      .build(),

  surveyForm: (id = "survey-form"): FormConfig =>
    createForm(id)
      .withTitle("Customer Satisfaction Survey")
      .withDescription("Help us improve our services")
      .addSection(
        createSection("basic-info")
          .withTitle("Basic Information")
          .withFields([
            createField("customerType", "radio", "Customer Type")
              .asRequired()
              .withOptions([
                { label: "Individual", value: "individual" },
                { label: "Small Business", value: "small-business" },
                { label: "Enterprise", value: "enterprise" },
              ])
              .build(),

            createField("industry", "select", "Industry")
              .withOptions([
                { label: "Technology", value: "tech" },
                { label: "Healthcare", value: "healthcare" },
                { label: "Finance", value: "finance" },
                { label: "Education", value: "education" },
                { label: "Other", value: "other" },
              ])
              .dependsOn("customerType", "individual", "notEquals", "show")
              .build(),
          ])
          .build(),
      )
      .addSection(
        createSection("satisfaction")
          .withTitle("Satisfaction Rating")
          .withFields([
            createField("overallSatisfaction", "radio", "Overall Satisfaction")
              .asRequired()
              .withOptions([
                { label: "Very Satisfied", value: "5" },
                { label: "Satisfied", value: "4" },
                { label: "Neutral", value: "3" },
                { label: "Dissatisfied", value: "2" },
                { label: "Very Dissatisfied", value: "1" },
              ])
              .build(),

            createField("recommendation", "radio", "Would you recommend us?")
              .asRequired()
              .withOptions(OptionHelpers.yesNo())
              .build(),

            createField(
              "improvements",
              "textarea",
              "Suggestions for Improvement",
            )
              .withPlaceholder("Tell us how we can improve...")
              .build(),
          ])
          .build(),
      )
      .withLayout({ columns: 1, spacing: "lg" })
      .withSubmission({
        submitText: "Submit Survey",
        validation: "onSubmit",
      })
      .build(),

  jobApplicationForm: (id = "job-application"): FormConfig =>
    createForm(id)
      .withTitle("Job Application")
      .withDescription("Apply for a position at our company")
      .addSection(
        createSection("personal")
          .withTitle("Personal Information")
          .withFields([
            createField("fullName", "text", "Full Name")
              .asRequired()
              .build(),

            createField("email", "email", "Email Address")
              .asRequired()
              .addValidation(ValidationHelpers.email())
              .build(),

            createField("phone", "text", "Phone Number")
              .asRequired()
              .addValidation(ValidationHelpers.phone())
              .build(),

            createField("position", "select", "Position Applied For")
              .asRequired()
              .withOptions([
                { label: "Software Engineer", value: "software-engineer" },
                { label: "Product Manager", value: "product-manager" },
                { label: "Designer", value: "designer" },
                { label: "Sales Representative", value: "sales-rep" },
                { label: "Marketing Specialist", value: "marketing" },
              ])
              .build(),
          ])
          .build(),
      )
      .addSection(
        createSection("experience")
          .withTitle("Experience")
          .withFields([
            createField("experience", "radio", "Years of Experience")
              .asRequired()
              .withOptions([
                { label: "0-2 years", value: "0-2" },
                { label: "3-5 years", value: "3-5" },
                { label: "6-10 years", value: "6-10" },
                { label: "10+ years", value: "10+" },
              ])
              .build(),

            createField("skills", "textarea", "Relevant Skills")
              .asRequired()
              .withPlaceholder("List your relevant skills and technologies...")
              .build(),

            createField("coverLetter", "textarea", "Cover Letter")
              .withDescription(
                "Tell us why you're interested in this position",
              )
              .withPlaceholder("Dear Hiring Manager...")
              .build(),
          ])
          .build(),
      )
      .withLayout({ columns: 1, spacing: "md" })
      .withSubmission({
        submitText: "Submit Application",
        validation: "onSubmit",
      })
      .build(),
};
