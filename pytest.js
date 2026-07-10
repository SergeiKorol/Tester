/**
 * Вопросы темы pytest.
 * id вопросов MUST быть уникальны среди всех файлов тем.
 */
QuizTopicRegistry.register("pytest", [
  {
    id: 1,
    question: "Какой scope у фикстуры по умолчанию в pytest?",
    options: ["function", "module", "session", "package"],
    correct: 0,
    explanation:
      "По умолчанию scope — function: фикстура создаётся заново для каждого теста, что обеспечивает изоляцию.",
  },
  {
    id: 2,
    question: "Для чего используется декоратор @pytest.mark.parametrize?",
    options: [
      "Параллельный запуск тестов",
      "Один тест с разными наборами данных",
      "Пропуск теста",
      "Измерение времени выполнения",
    ],
    correct: 1,
    explanation:
      "parametrize позволяет запустить одну и ту же логику теста с разными входными данными без дублирования кода.",
  },
  {
    id: 3,
    question: "Какой фикстурой в pytest обычно настраивают браузер для UI-тестов?",
    options: ["browser", "driver", "page", "client"],
    correct: 2,
    explanation:
      "В pytest-playwright типичная фикстура — page: готовая вкладка браузера для взаимодействия с UI.",
  },
  {
    id: 4,
    question: "Что означает паттерн Arrange-Act-Assert в тесте?",
    options: [
      "Подготовка — действие — проверка",
      "Запуск — ожидание — отчёт",
      "Импорт — класс — метод",
      "Setup — teardown — assert",
    ],
    correct: 0,
    explanation:
      "AAA структурирует тест: подготовка данных (Arrange), выполнение (Act), проверка результата (Assert).",
  },
  {
    id: 12,
    question: "Зачем нужен conftest.py в pytest?",
    options: [
      "Хранить секреты",
      "Общие фикстуры и хуки для тестов в каталоге",
      "Запускать CI",
      "Генерировать отчёты HTML",
    ],
    correct: 1,
    explanation:
      "conftest.py автоматически подхватывается pytest и предоставляет общие фикстуры без явного импорта.",
  },
]);
