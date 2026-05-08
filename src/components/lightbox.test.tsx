import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Lightbox } from "@/components/lightbox";

describe("Lightbox", () => {
  const photos = [
    { id: "1", src: "/one.jpg", alt: "One", caption: "First" },
    { id: "2", src: "/two.jpg", alt: "Two", caption: "Second" }
  ];

  it("opens and closes a photo dialog", () => {
    render(<Lightbox photos={photos} />);

    fireEvent.click(screen.getByRole("button", { name: /one/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Đóng" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("navigates between photos", () => {
    render(<Lightbox photos={photos} />);

    fireEvent.click(screen.getByRole("button", { name: /one/i }));
    fireEvent.click(screen.getByRole("button", { name: "Ảnh sau" }));

    expect(within(screen.getByRole("dialog")).getByAltText("Two")).toBeInTheDocument();
  });

  it("supports keyboard navigation and escape", () => {
    render(<Lightbox photos={photos} />);

    fireEvent.click(screen.getByRole("button", { name: /one/i }));
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(within(screen.getByRole("dialog")).getByAltText("Two")).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(within(screen.getByRole("dialog")).getByAltText("One")).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
