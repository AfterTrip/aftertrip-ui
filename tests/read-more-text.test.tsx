import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ReadMoreText } from "@/components/ui/read-more-text";

describe("ReadMoreText", () => {
  it("collapses long text and toggles the full content", () => {
    const text =
      "A long travel note with enough detail to require a compact preview before expanding into the full traveler story.";

    render(<ReadMoreText text={text} limit={42} />);

    expect(screen.getByText(/A long travel note/)).toHaveTextContent("...");
    expect(screen.queryByText(text)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Read more" }));
    expect(screen.getByText(text)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Read less" }));
    expect(screen.queryByText(text)).not.toBeInTheDocument();
  });

  it("does not render a toggle for short text", () => {
    render(<ReadMoreText text="Short note." limit={50} />);

    expect(screen.getByText("Short note.")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /read/i })
    ).not.toBeInTheDocument();
  });
});
