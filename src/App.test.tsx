import "@testing-library/jest-dom/vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";
import { beforeEach } from "vitest";

beforeEach(() => {
  window.localStorage.clear();
});

describe("customer view", () => {
  it("hides internal panels and config status without ?admin=1", () => {
    render(<App admin={false} />);

    expect(screen.queryByRole("heading", { name: /reguły marży/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/SEO produktu/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/demo feed/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /dane firmy/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/endpoint checkoutu/i)).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /regulamin sklepu/i })).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("uses product names as image alt text", () => {
    render(<App admin={false} />);
    const imgs = screen.getAllByRole("img").filter((img) => img.tagName === "IMG");
    expect(imgs.length).toBeGreaterThan(0);
    for (const img of imgs) expect(img).toHaveAttribute("alt", expect.stringMatching(/\S/));
  });

  it("removes a line, persists the cart, and closes the drawer with Escape", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App admin={false} />);
    await user.click(screen.getAllByRole("button", { name: /^dodaj do koszyka:/i })[0]);
    expect(screen.getByRole("dialog", { name: /koszyk/i })).toBeInTheDocument();
    expect(window.localStorage.getItem("dermalab_cart")).toContain("quantity");

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: /koszyk/i })).not.toBeInTheDocument();
    unmount();

    render(<App admin={false} />);
    expect(screen.getByRole("button", { name: /otwórz koszyk/i })).toHaveTextContent("1");
    await user.click(screen.getByRole("button", { name: /otwórz koszyk/i }));
    await user.click(screen.getByRole("button", { name: /^usuń:/i }));
    expect(screen.getByText(/koszyk jest pusty/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /przejdź do płatności/i })).toBeDisabled();
  });
});

describe("DermaLab storefront", () => {
  it("renders a sharper brand mark in the top navigation", () => {
    render(<App admin />);

    const logo = screen.getByTestId("brand-logo-svg");

    expect(logo).toHaveAccessibleName("DermaLab");
    expect(logo).toHaveAttribute("viewBox", "0 0 224 52");
  });

  it("renders the clinical homepage, supplier readiness, ROI, and trust sections", () => {
    render(<App admin />);

    expect(screen.getByRole("heading", { level: 1, name: /piel/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /filtry kliniczne/i })).toBeInTheDocument();
    expect(screen.getByText(/ICO Cosmetics/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Stripe Checkout/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/bariera hydrolipidowa/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /reguły marży/i })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { name: /zwroty i reklamacje/i }).length).toBeGreaterThanOrEqual(1);
  });

  it("shows production setup status for feed, legal data, deployment and tracking", () => {
    render(<App admin />);

    expect(screen.getByText(/demo feed active/i)).toBeInTheDocument();
    expect(screen.getAllByText(/production feed url/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/dane firmy do uzupe/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/ga4/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/vercel/i)).toBeInTheDocument();
  });

  it("renders legal policy drafts for store launch", () => {
    render(<App admin />);

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
    render(<App admin />);

    expect(screen.getByRole("region", { name: /zgody cookies/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /tylko niezb/i }));

    expect(screen.queryByRole("region", { name: /zgody cookies/i })).not.toBeInTheDocument();
  });

  it("adds a product to cart and shows payment and delivery handoff state", async () => {
    const user = userEvent.setup();
    render(<App admin />);

    const addButtons = screen.getAllByRole("button", { name: /dodaj/i });
    await user.click(addButtons[0]);

    expect(screen.getByRole("dialog", { name: /koszyk/i })).toBeInTheDocument();
    expect(screen.getByText(/koszyk gotowy/i)).toBeInTheDocument();
    expect(screen.getByText(/endpoint checkoutu/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dostawa/i)).toBeInTheDocument();
  });

  it("filters the catalog from an SEO landing CTA", async () => {
    const user = userEvent.setup();
    render(<App admin />);

    await user.click(screen.getByRole("button", { name: /zobacz zestaw: bariera/i }));

    expect(screen.getByRole("combobox", { name: /problem/i })).toHaveValue("bariera");
    expect(screen.getAllByRole("article").length).toBeGreaterThanOrEqual(2);
  });
});

describe("cart quantity editing and drawer behaviour", () => {
  async function openCartWithOne(user: ReturnType<typeof userEvent.setup>) {
    render(<App admin={false} />);
    await user.click(screen.getAllByRole("button", { name: /^dodaj do koszyka:/i })[0]);
    return screen.getByRole("spinbutton", { name: /ilość/i }) as HTMLInputElement;
  }

  it("keeps the line while the quantity field is empty and commits on blur", async () => {
    const user = userEvent.setup();
    const input = await openCartWithOne(user);
    await user.clear(input);
    expect(screen.getByRole("spinbutton", { name: /ilość/i })).toBeInTheDocument();
    expect(screen.queryByText(/koszyk jest pusty/i)).not.toBeInTheDocument();
    await user.type(input, "3");
    expect(input).toHaveValue(3);
    await user.clear(input);
    await user.tab();
    expect(input).toHaveValue(3);
  });

  it("floors decimals and removes the line when 0 is committed", async () => {
    const user = userEvent.setup();
    const input = await openCartWithOne(user);
    await user.clear(input);
    await user.type(input, "2.7");
    await user.tab();
    expect(input).toHaveValue(2);
    await user.clear(input);
    await user.type(input, "0");
    await user.tab();
    expect(screen.getByText(/koszyk jest pusty/i)).toBeInTheDocument();
    expect(screen.queryByText(/suma:/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/dostawa/i)).not.toBeInTheDocument();
  });

  it("clamps quantity to stock and exposes dialog semantics, backdrop close and focus return", async () => {
    const user = userEvent.setup();
    const input = await openCartWithOne(user);
    expect(input).toHaveAttribute("max");
    const max = Number(input.getAttribute("max"));
    await user.clear(input);
    await user.type(input, "999999");
    await user.tab();
    expect(input).toHaveValue(max);
    const dialog = screen.getByRole("dialog", { name: /koszyk/i });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    await user.click(dialog.parentElement as HTMLElement);
    expect(screen.queryByRole("dialog", { name: /koszyk/i })).not.toBeInTheDocument();
  });

  it("hides the cookie banner while the cart is open", async () => {
    const user = userEvent.setup();
    render(<App admin={false} />);
    expect(screen.getByRole("region", { name: /zgody cookies/i })).toBeInTheDocument();
    await user.click(screen.getAllByRole("button", { name: /^dodaj do koszyka:/i })[0]);
    expect(screen.queryByRole("region", { name: /zgody cookies/i })).not.toBeInTheDocument();
  });

  it("shows no internal marketing notes to customers and toggles the mobile menu", async () => {
    const user = userEvent.setup();
    render(<App admin={false} />);
    expect(screen.queryByText(/przekaz reklamowy|pod kampanie/i)).not.toBeInTheDocument();
    const toggle = screen.getByRole("button", { name: /otwórz menu/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(screen.getByRole("button", { name: /zamknij menu/i })).toHaveAttribute("aria-expanded", "true");
  });
});

