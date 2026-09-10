/* eslint-disable @next/next/no-img-element */
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "@/app/page";

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    fill: ignoredFill,
    priority: ignoredPriority,
    sizes: ignoredSizes,
    ...props
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    priority?: boolean;
    sizes?: string;
    [key: string]: unknown;
  }) => {
    void ignoredFill;
    void ignoredPriority;
    void ignoredSizes;

    return <img src={src} alt={alt} {...props} />;
  }
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() })
}));

describe("AfterTrip landing page", () => {
  it("renders the complete landing page content with semantic landmarks", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /real journeys\.\s+beautifully shared\./i
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("search")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Featured Trips" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Popular Destinations" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "How AfterTrip Works" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Community Reviews" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Ready to share/i })
    ).toBeInTheDocument();
  });
});
