const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  emptyFilters,
  matchesPet,
  initialState,
  addApplication,
  toggleItem,
  validContact,
  validAmount,
} = require("../src/state/domain.ts");
const pet = {
  name: "Луна",
  city: "Дніпро",
  kind: "Собака",
  sex: "Дівчинка",
  size: "M",
  ageGroup: "Дорослий",
  compatible: ["Діти", "Коти"],
  tags: ["Лагідна", "Вакцинована"],
  vaccinated: true,
  sterilized: true,
  special: false,
  shelter: "Чотири лапи",
};
test("search combines independent filters and all selected compatibility constraints", () => {
  assert(
    matchesPet(pet, {
      ...emptyFilters,
      query: "  ЛУНА  ",
      kind: "Собака",
      compatible: ["Діти", "Коти"],
      vaccinated: true,
    }),
  );
  assert(!matchesPet(pet, { ...emptyFilters, city: "Київ" }));
  assert(!matchesPet(pet, { ...emptyFilters, compatible: ["Діти", "Собаки"] }));
  assert(!matchesPet(pet, { ...emptyFilters, kind: "Кіт" }));
  assert(!matchesPet(pet, { ...emptyFilters, special: true }));
  assert(matchesPet(pet, { ...emptyFilters, character: ["Лагідний"] }));
});
test("favorites can be added and removed without mutating the original", () => {
  const original = ["luna"];
  assert.deepEqual(toggleItem(original, "luna"), []);
  assert.deepEqual(toggleItem(original, "max"), ["luna", "max"]);
  assert.deepEqual(original, ["luna"]);
});
test("application creates one connected chat and remains idempotent", () => {
  const next = addApplication(initialState, "luna");
  assert.deepEqual(next.applications, ["luna"]);
  assert.equal(next.conversations[0].petId, "luna");
  assert.equal(next.conversations[0].application, true);
  assert.equal(next.conversations[0].unread, true);
  assert.equal(addApplication(next, "luna"), next);
  assert.deepEqual(initialState.applications, []);
});
test("application preserves previous conversation messages", () => {
  const state = {
    ...initialState,
    conversations: [
      {
        petId: "luna",
        application: false,
        unread: false,
        messages: [{ id: "before", mine: true, text: "Вітаю!" }],
      },
    ],
  };
  const next = addApplication(state, "luna");
  assert.equal(next.conversations.length, 1);
  assert.equal(next.conversations[0].messages[0].text, "Вітаю!");
  assert.equal(next.conversations[0].messages.length, 2);
});
test("contact validation accepts an email or Ukrainian phone", () => {
  for (const value of [
    "test@example.com",
    "+380 (67) 123-45-67",
    "380671234567",
  ])
    assert(validContact(value));
  for (const value of ["", "abc", "123", "a@b", "+11234567890"])
    assert(!validContact(value));
});
test("payment rejects zero, negative, non-finite, fractional and oversized amounts", () => {
  for (const value of ["10", "200", "100000"]) assert(validAmount(value));
  for (const value of [
    "",
    "0",
    "-100",
    "1.5",
    "Infinity",
    "100001",
    "1e3",
    " 20 ",
  ])
    assert(!validAmount(value));
});
