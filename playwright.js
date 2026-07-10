/**
 * Вопросы темы Playwright.
 * id вопросов MUST быть уникальны среди всех файлов тем.
 */
QuizTopicRegistry.register("playwright", [
  {
    id: 5,
    question: "Какой метод Playwright используют для явного ожидания видимости элемента?",
    options: ["page.wait()", "locator.waitFor()", "expect(locator).toBeVisible()", "sleep(1000)"],
    correct: 2,
    explanation:
      "expect(locator).toBeVisible() — явное ожидание в стиле Playwright Test; time.sleep в автотестах не используют.",
  },
  {
    id: 6,
    question: "Что такое Page Object в UI-автоматизации?",
    options: [
      "HTML-страница в браузере",
      "Класс, инкапсулирующий элементы и действия страницы",
      "Скриншот при падении теста",
      "Конфигурационный файл",
    ],
    correct: 1,
    explanation:
      "Page Object скрывает селекторы и шаги взаимодействия; тест описывает ЧТО проверяем, PO — КАК.",
  },
  {
    id: 7,
    question: "Какой атрибут рекомендуется для стабильных селекторов в тестах?",
    options: ["class", "id", "data-testid", "style"],
    correct: 2,
    explanation: "data-testid не зависит от визуального оформления и меняется реже, чем CSS-классы.",
  },
  {
    id: 8,
    question: "Что делает метод page.goto(url)?",
    options: [
      "Открывает указанный URL в текущей вкладке",
      "Создаёт новый браузер",
      "Закрывает страницу",
      "Делает скриншот",
    ],
    correct: 0,
    explanation: "goto выполняет навигацию на URL, аналог открытия адреса в адресной строке.",
  },
]);
