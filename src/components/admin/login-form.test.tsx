import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LoginForm } from "@/components/admin/login-form";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

vi.mock("@/lib/supabase/client", () => ({
  createSupabaseBrowserClient: vi.fn()
}));

describe("LoginForm", () => {
  it("shows a form error when Supabase browser configuration is missing", async () => {
    vi.mocked(createSupabaseBrowserClient).mockImplementation(() => {
      throw new Error("Supabase public environment variables are not configured");
    });

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "admin@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /magic link/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Không thể gửi magic link.");
    });
  });
});
