const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const output = path.resolve("test-results");
fs.mkdirSync(output, { recursive: true });
(async () => {
  const b = await chromium.launch({
    executablePath:
      process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.setDefaultTimeout(15000);
  const button = (name) => page.getByRole("button", { name, exact: true });
  await page.goto(process.env.PROTOTYPE_URL || "http://127.0.0.1:8082", {
    waitUntil: "networkidle",
  });
  for (let i = 0; i < 2; i++) await button("Далі").click();
  await button("Собака").click();
  await button("Далі").click();
  await button("Для сім’ї з дітьми").click();
  await button("Показати тварин").click();
  await page.getByText("Знайдено тварин:", { exact: false }).waitFor();
  await page.screenshot({ path: output + "/prytulok-results.png" });
  await button("Відкрити профіль: Луна").click();
  await button("Додати в обране").click();
  await button("Через Email").click();
  await page
    .getByRole("textbox", { name: "Ваше ім’я", exact: true })
    .fill("Олена");
  await page
    .getByRole("textbox", { name: "Email", exact: true })
    .fill("olena@example.com");
  await button("Продовжити").click();
  await button("Видалити з обраного").waitFor();
  await page.screenshot({ path: output + "/prytulok-detail.png" });
  await button("Познайомитися").click();
  await button("Надіслати заявку").click();
  await page.getByRole("alert").waitFor();
  await button("Квартира").click();
  await page.getByRole("checkbox").click();
  await page
    .getByRole("textbox", {
      name: "Що хочете розповісти? (необов’язково)",
      exact: true,
    })
    .fill("Маю досвід догляду за собаками.");
  await button("Надіслати заявку").click();
  await page.getByText("Знайомство вже ближче!", { exact: true }).waitFor();
  await page.screenshot({ path: output + "/prytulok-success.png" });
  await button("Перейти до повідомлень").click();
  await page
    .getByRole("textbox", { name: "Ваше повідомлення" })
    .fill("Доброго дня! Коли можемо познайомитися?");
  await button("Надіслати повідомлення").click();
  await page
    .getByText("Доброго дня! Коли можемо познайомитися?", { exact: true })
    .waitFor();
  await button("Назад").click();
  await page.getByRole("tab", { name: "Акаунт", exact: true }).click();
  await button("Відкрити профіль: Луна").click();
  await button("Підтримати").click();
  await page.getByRole("textbox", { name: "Сума допомоги, ₴" }).fill("0");
  await button("Продовжити").click();
  await page.getByRole("alert").waitFor();
  await button("500 ₴").click();
  await button("Щомісяця").click();
  await button("Продовжити").click();
  await button("Підтвердити демо-підтримку").click();
  await page.getByText("Дякуємо за ваше тепло!", { exact: true }).waitFor();
  await button("На головну").click();
  await page.screenshot({ path: output + "/prytulok-home.png" });
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("tab", { name: "Акаунт", exact: true }).click();
  await page.getByText("Олена", { exact: true }).waitFor();
  await button("Відкрити профіль: Луна").waitFor();
  await page.getByRole("tab", { name: "Підтримую", exact: true }).click();
  await button("Відкрити профіль: Луна").waitFor();
  await page.screenshot({ path: output + "/prytulok-account.png" });
  await page.getByRole("tab", { name: "Пошук", exact: true }).click();
  await button("Очистити").click();
  await button("Кіт").click();
  await button("Показати: 2").click();
  assert.equal(
    await page.getByRole("button", { name: /Відкрити профіль:/ }).count(),
    2,
  );
  await button("Назад").click();
  await button("Харків").click();
  await button("Показати: 0").click();
  await page.getByText("Поки без збігів", { exact: true }).waitFor();
  await button("Змінити фільтри").click();
  for (const width of [320, 430]) {
    await page.setViewportSize({ width, height: 844 });
    await page.screenshot({ path: `${output}/prytulok-search-${width}.png` });
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      "Horizontal overflow",
    );
  }
  const guest = await b.newPage({ viewport: { width: 390, height: 844 } });
  guest.on("pageerror", (e) => errors.push(e.message));
  await guest.goto(process.env.PROTOTYPE_URL || "http://127.0.0.1:8082", {
    waitUntil: "networkidle",
  });
  await guest.getByRole("button", { name: "Пропустити", exact: true }).click();
  await guest
    .getByRole("button", { name: "Відкрити профіль: Луна", exact: true })
    .click();
  await guest
    .getByRole("button", { name: "Познайомитися", exact: true })
    .click();
  await guest
    .getByRole("button", { name: "Продовжити з Google", exact: true })
    .click();
  await guest
    .getByRole("textbox", { name: "Ваше ім’я", exact: true })
    .fill("Марія");
  await guest.getByRole("button", { name: "Продовжити", exact: true }).click();
  await guest
    .getByRole("button", { name: "Надіслати заявку", exact: true })
    .waitFor();
  await guest.close();
  assert.deepEqual(errors, []);
  console.log(
    "PASS: onboarding, personalized results, auth resume, favorite, form validation, application, chat, support validation, monthly demo payment, persistence, filters, empty results, 320/390/430 layouts; no page errors",
  );
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
