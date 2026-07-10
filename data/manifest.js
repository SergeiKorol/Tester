/**
 * Каталог тем и путей к файлам с вопросами (US6).
 * Каждый path MUST быть подключён в index.html через <script src="..."> (обязательно для Android).
 */
window.QUIZ_MANIFEST = [
  {
    id: "types",
    path: "data_type.js",
    title: "Типы данных в Python"
  },
  {
    id: "pytest",
    path: "pytest.js",
    title: "pytest"
  },
  {
    id: "playwright",
    path: "playwright.js",
    title: "Playwright"
  },
  {
    id: "manual",
    path: "manual.js",
    title: "Ручное тестирование"
  }
];
