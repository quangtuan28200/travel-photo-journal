import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ErrorPage from "@/app/error";

describe("ErrorPage", () => {
  it("shows a global error notice and lets users retry", () => {
    const reset = vi.fn();
    const error = new Error("Database unavailable");
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<ErrorPage error={error} reset={reset} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Không thể tải trang.");

    fireEvent.click(screen.getByRole("button", { name: "Thử lại" }));

    expect(reset).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(error);
  });
});
