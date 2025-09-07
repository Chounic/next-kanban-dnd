import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SignInForm } from '@/components/auth/SignInForm';
import { authFormSchema } from '@/lib/zod-validations';

const push = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

const signinMock = jest.fn();
jest.mock('@/action/auth-server', () => ({
  signin: (...args: any[]) => signinMock(...args),
}));

function getRequiredFieldMessages(data: any) {
  const result = authFormSchema.safeParse(data);
  if (result.success) return [];
  return result.error.issues.filter( i => i.code === 'too_small' && i.minimum == 1).map(i => i.message);
}

describe("SignIn Form", () => {
  beforeEach(() => {
    push.mockReset();
    signinMock.mockReset();
  });

  it("renders email, password fields and submit button", () => {
    render(<SignInForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /se connecter/i })).toBeInTheDocument();
  });

  it("shows validation errors for empty submission", async () => {
    render(<SignInForm />);
    fireEvent.click(screen.getByRole("button", { name: /se connecter/i }));

    const expected = getRequiredFieldMessages({ email: '', password: '' });
    await waitFor(() => {
      expected.forEach(msg => {
        expect(screen.getByText(msg)).toBeInTheDocument();
      });
    });
  });

  it('calls signin with credentials and navigates on success', async () => {
    signinMock.mockResolvedValue({ success: "random success message" }); // simulate success
    render(<SignInForm />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(signinMock).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/');
    });
  });
  it("displays error message on failed login", async () => {
    render(<SignInForm />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "wrong@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "wrongpass" } });
    fireEvent.click(screen.getByRole("button", { name: /se connecter/i }));
    signinMock.mockResolvedValue({ error: "Invalid credentials" });
    
    expect(await screen.findByTestId("error-message")).toBeInTheDocument();
  });
});
