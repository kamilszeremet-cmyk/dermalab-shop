import "@testing-library/jest-dom/vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("DermaLab storefront", () => {
  it("renders a sharper brand mark in the top navigation", () => {
    render(<App />);

    const logo = screen.getByTestId("brand-logo-svg");

    expect(logo).toHaveAccessibleName("DermaLab");
    expect(logo).toHaveAttribute("viewBox", "0 0 224 52");
  });

  it("renders the clinical homepage, supplier readiness, ROI, and trust sections", () => {
    render(<App />);

    expect(screen.getByRole("heading", { level: 1, name: /piel/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /filtry kliniczne/i })).toBeInTheDocument();
    expect(screen.getByText(/ICO Cosmetics/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Stripe Checkout/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/bariera hydrolipidowa/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /reguły marży/i })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { name: /zwroty i reklamacje/i }).length).toBeGreaterThanOrEqual(1);
  });

  it("shows production setup status for feed, legal data, deployment and tracking", () => {
    render(<App />);

    expect(screen.getByText(/demo feed active/i)).toBeInTheDocument();
    expect(screen.getAllByText(/production feed url/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/dane firmy do uzupe/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/ga4/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/vercel/i)).toBeInTheDocument();
  });

  it("renders legal policy drafts for store launch", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: /regulamin sklepu/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /polityka prywatno/i })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { name: /zwroty i reklamacje/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("heading", { name: /dostawa i p/i })).toBeInTheDocument();
    expect(screen.getAllByText(/14 dni/i).length).toBeGreaterThanOrEqual(1);

    const footer = screen.getByRole("contentinfo");
    expect(within(footer).getByRole("link", { name: /regulamin/i })).toHaveAttribute("href", "#regulamin");
    expect(within(footer).getByRole("link", { name: /polityka prywatno/i })).toHaveAttribute(
      "href",
      "#polityka-prywatnosci",
    );
    expect(within(footer).getByRole("link", { name: /zwroty i reklamacje/i })).toHaveAttribute(
      "href",
      "#zwroty-i-reklamacje",
    );
  });

  it("asks for cookie consent before marketing tracking can run", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("region", { name: /zgody cookies/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /tylko niezb/i }));

    expect(screen.queryByRole("region", { name: /zgody cookies/i })).not.toBeInTheDocument();
  });

  it("adds a product to cart and shows payment and delivery handoff state", async () => {
    const user = userEvent.setup();
    render(<App />);

    const addButtons = screen.getAllByRole("button", { name: /dodaj/i });
    await user.click(addButtons[0]);

    expect(screen.getByRole("complementary", { name: /koszyk/i })).toBeInTheDocument();
    expect(screen.getByText(/koszyk gotowy/i)).toBeInTheDocument();
    expect(screen.getByText(/endpoint checkoutu/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dostawa/i)).toBeInTheDocument();
  });

  it("filters the catalog from an SEO landing CTA", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /zobacz zestaw: bariera/i }));

    expect(screen.getByRole("combobox", { name: /problem/i })).toHaveValue("bariera");
    expect(screen.getAllByRole("article").length).toBeGreaterThanOrEqual(2);
  });
});
