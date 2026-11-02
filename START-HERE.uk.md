# Почніть тут

Це нова хмарна основа «Притулку»: Expo SDK 58, React Native, TypeScript.
Файли з `C:\Users\007\Desktop\vibe-session\my-app` сюди не переносилися.
Поки є лише екран «Застосунок запущено ✅». Сервер, дизайн та авторизація не потрібні.

## Браузерний Codex

Відкрийте завдання для цього GitHub-репозиторію. Попросіть Codex прочитати цей файл і внести потрібні зміни.
Кожне завдання вже ізольоване: використовуйте наявний checkout, не створюйте Git worktree без окремого запиту.
У терміналі Codex команди виконуються в `/workspace/-prytulok-app`:

```bash
npm ci
npm run check
npm run doctor
npm run export:android
npm audit
```

`npm ci` встановлює залежності точно за `package-lock.json`. Не видаляйте lock-файл.
`check` перевіряє TypeScript та ESLint. `export:android` збирає Android JavaScript у `dist/android`; це не APK.

Щоб запустити Metro у хмарі:

```bash
npm start -- --localhost
```

Це локальна перевірка сервера у хмарі. Доступ телефона до цього сервера не перевірений.
Для першого запуску на телефоні використовуйте Windows за інструкцією нижче.
Не вимикайте TLS і не використовуйте `npm audit fix --force`.

Зміни мають потрапити на GitHub через коміт і push або pull request. Локальний коміт Codex сам по собі ще не означає, що файли вже на GitHub.

## Отримання на Windows

Установіть Git та Node.js 24 LTS (щонайменше 24.3). Відкрийте PowerShell.
Збережіть свій наявний `my-app`: наведені команди створять окрему папку `prytulok-cloud`.
Після появи змін на GitHub виконайте:

```powershell
cd C:\Users\007\Desktop\vibe-session
git clone https://github.com/sergienkomm-crypto/-prytulok-app.git prytulok-cloud
cd prytulok-cloud
npm ci
npm run check
```

Якщо зміни ще в pull request, спочатку злийте його на GitHub. Для наступних оновлень у папці `prytulok-cloud`:

```powershell
git pull --ff-only
npm ci
```

Якщо Git повідомляє про ваші незбережені зміни, не видаляйте їх: попросіть допомогти зберегти їх перед оновленням.

## Запуск на Android

Команди нижче виконуються **на Windows**, у папці `prytulok-cloud`:

```powershell
npm start -- --lan
```

Комп'ютер і телефон мають бути в одній Wi-Fi мережі. Установлений Expo Go має підтримувати SDK 58.
Відкрийте Expo Go на Android і відскануйте QR-код із термінала.
Очікуваний екран: «Притулок» і «Застосунок запущено ✅».
Залишайте термінал відкритим; для зупинки натисніть Ctrl+C.
Якщо телефон не підключається, перевірте Wi-Fi, VPN і дозвіл Node.js у Windows Firewall для приватної мережі. Не вимикайте брандмауер повністю.
Не запускайте `npm run android` без підключеного через ADB телефона або Android-емулятора: ця команда намагається відкрити пристрій автоматично.

## Figma

У цьому сеансі Codex інструментів Figma не знайдено; файл Figma не читався.
Наступний крок для Figma: підключіть інтеграцію Figma у налаштуваннях Codex/ChatGPT, якщо вона доступна вашому обліковому запису.
Після підключення для перевірки знадобиться посилання на доступний вам файл. Для цього стартового екрана Figma не потрібна.

## Офіційні джерела

- [Оновлення та перевірка SDK](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/)
- [Налаштування середовища](https://docs.expo.dev/get-started/set-up-your-environment/)
- [Expo Go для потрібного SDK](https://expo.dev/go)
- [Офіційний шаблон TypeScript](https://github.com/expo/expo/tree/main/templates/expo-template-blank-typescript)

Під час підготовки сайт docs.expo.dev повертав HTTP 403. Прочитано офіційні вихідні файли документації в expo/expo на GitHub і шаблон npm `expo-template-blank-typescript@58.0.31`. SDK залишено 58.

## Результати перевірки у хмарі

- TypeScript та ESLint: пройдено.
- Повторне встановлення `npm ci` з lock-файлу: пройдено.
- Android production export: пройдено (Hermes, 616 модулів).
- Metro: отримано Android manifest для SDK 58 і development bundle (744 модулі).
- На фізичному Android запуск ще не перевірявся; APK не збирався.
- Expo Doctor: 18/20. Перевірки схеми Expo config та React Native Directory заблоковані мережею. Це не повний успішний результат Doctor.
- Локальна перевірка версій Expo: залежності узгоджені; online-перевірка заблокована.
- `npm audit`: 24 moderate, 0 high, 0 critical. Два вихідних попередження стосуються `glob` (GHSA-3g3m-2fjr-6pw4) та `minimatch` (GHSA-g3hv-75wg-m249); решта — залежні пакети. Сухий запуск виправлення без force залишає 24 попередження. Несумісні примусові оновлення чи downgrade SDK не застосовувалися.
- У чернетці середовища збережено install_script, start_skill та доступ до docs.expo.dev, api.expo.dev, exp.host, reactnative.directory. Щоб застосувати: перегляньте й збережіть налаштування середовища, потім опублікуйте середовище. Після цього повторіть `npm run doctor`; до повторної успішної перевірки блокування не вважається усуненим.
