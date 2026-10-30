// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";

import { initBtnCraft, setLoading } from "../src/index.js";

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("initBtnCraft", () => {
  it("enhances buttons marked with data-btncraft", () => {
    document.body.innerHTML = `
      <button data-btncraft>Save</button>
      <button>Cancel</button>
    `;

    const instance = initBtnCraft();

    const target = document.querySelector("[data-btncraft]");
    const normal = document.querySelector("button:not([data-btncraft])");

    expect(target.classList.contains("bc-btn")).toBe(true);
    expect(normal.classList.contains("bc-btn")).toBe(false);

    instance.destroy();

    expect(target.classList.contains("bc-btn")).toBe(false);
  });

  it("does not duplicate the class on repeated initialization", () => {
    document.body.innerHTML = `<button data-btncraft>Save</button>`;

    initBtnCraft();
    initBtnCraft();

    const button = document.querySelector("button");

    expect(button.classList.length).toBe(1);
    expect(button.classList.contains("bc-btn")).toBe(true);
  });

  it("allows reinitialization after destroy", () => {
    document.body.innerHTML = `<button data-btncraft>Save</button>`;

    const button = document.querySelector("button");

    const first = initBtnCraft();

    expect(button.classList.contains("bc-btn")).toBe(true);

    first.destroy();

    expect(button.classList.contains("bc-btn")).toBe(false);

    const second = initBtnCraft();

    expect(button.classList.contains("bc-btn")).toBe(true);

    second.destroy();
  });

  it("does not create duplicate spinners on repeated loading calls", () => {
    const button = document.createElement("button");
    button.textContent = "Save";

    setLoading(button, true);
    setLoading(button, true);

    expect(button.querySelectorAll(".bc-spinner").length).toBe(1);

    setLoading(button, false);

    expect(button.querySelectorAll(".bc-spinner").length).toBe(0);
  });

  it("restores existing accessibility attributes", () => {
    const button = document.createElement("button");

    button.setAttribute("aria-busy", "false");
    button.setAttribute("aria-label", "Save document");

    setLoading(button, true, "Saving document");
    setLoading(button, false);

    expect(button.getAttribute("aria-busy")).toBe("false");
    expect(button.getAttribute("aria-label")).toBe("Save document");
  });

  it("preserves a class that existed before initialization", () => {
  const button = document.createElement("button");

  button.classList.add("bc-btn");
  button.setAttribute("data-btncraft", "");

  document.body.appendChild(button);

  const instance = initBtnCraft();
  instance.destroy();

  expect(button.classList.contains("bc-btn")).toBe(true);
});
});

describe("setLoading", () => {
  it("disables the button and restores its state", () => {
    document.body.innerHTML = `<button>Save</button>`;

    const button = document.querySelector("button");

    setLoading(button, true, "Saving");

    expect(button.disabled).toBe(true);
    expect(button.getAttribute("aria-busy")).toBe("true");
    expect(button.getAttribute("aria-label")).toBe("Saving");
    expect(button.querySelector(".bc-spinner")).not.toBeNull();

    setLoading(button, false);

    expect(button.disabled).toBe(false);
    expect(button.hasAttribute("aria-busy")).toBe(false);
    expect(button.hasAttribute("aria-label")).toBe(false);
    expect(button.querySelector(".bc-spinner")).toBeNull();
  });

  it("preserves an originally disabled button", () => {
    const button = document.createElement("button");
    button.disabled = true;

    setLoading(button, true);
    setLoading(button, false);

    expect(button.disabled).toBe(true);
  });

  it("throws when the target is not a DOM element", () => {
    expect(() => setLoading(null, true)).toThrow("Expected a DOM element");
  });

  it("throws when the target is not a button", () => {
    const div = document.createElement("div");

    expect(() => setLoading(div, true)).toThrow("Expected a button element");
  });


});
