import { authFormSchema } from "../lib/zod-validations";

describe("authFormSchema", () => {
  it("accepts valid data", () => {
    expect(() =>
      authFormSchema.parse({ email: "test@example.com", password: "password123" })
    ).not.toThrow();
  });

  it("rejects invalid email", () => {
    expect(() =>
      authFormSchema.parse({ email: "invalid", password: "password123" })
    ).toThrow();
  });

  it("rejects short password", () => {
    expect(() =>
      authFormSchema.parse({ email: "test@example.com", password: "short" })
    ).toThrow();
  });
});