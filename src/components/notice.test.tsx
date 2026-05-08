import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NoticeMessage } from "@/components/notice";

describe("NoticeMessage", () => {
  it("renders nothing without a notice", () => {
    const { container } = render(<NoticeMessage notice={null} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders errors as alerts", () => {
    render(<NoticeMessage notice={{ tone: "error", message: "Could not save album" }} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Could not save album");
  });

  it("renders successful messages as status updates", () => {
    render(<NoticeMessage notice={{ tone: "success", message: "Saved" }} />);

    expect(screen.getByRole("status")).toHaveTextContent("Saved");
  });
});
