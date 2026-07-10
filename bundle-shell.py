#!/usr/bin/env python3
"""Bundle app shell (styles + quiz-app.js) into a single index.html for Android."""

from pathlib import Path

APP_DIR = Path(__file__).resolve().parent

HTML_BODY = """<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Подготовка к собеседованию AQA</title>
  <style>
{css}
  </style>
</head>
<body>
  <div id="app-root" data-testid="app-root">
    <section data-screen="home" data-testid="home-screen" class="screen active" aria-label="Главный экран">
      <h1 data-testid="home-title">Подготовка к собеседованию</h1>
      <p class="subtitle">Выберите тему или начните тест</p>
      <p data-testid="home-import-hint" class="subtitle home-import-hint hidden">
        Выберите manifest.json и все JSON-файлы тем из папки content/.
      </p>
      <input type="file" data-testid="home-import-input" class="hidden" accept=".json,application/json" multiple>
      <button type="button" data-testid="home-import-btn" class="btn btn-primary hidden">Загрузить тесты</button>
      <button type="button" data-testid="home-reimport-btn" class="btn btn-secondary hidden">Обновить тесты</button>
      <button type="button" data-testid="home-start-btn" class="btn btn-primary hidden">Начать тест</button>
      <ul data-testid="home-category-list" class="category-list hidden" role="list"></ul>
    </section>
    <section data-screen="question" data-testid="question-screen" class="screen" aria-label="Вопрос">
      <div class="progress-wrap">
        <span data-testid="progress-text" class="progress-text">1 из 1</span>
        <div data-testid="progress-bar" class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar__fill"></div>
        </div>
      </div>
      <p data-testid="question-text" class="question-text"></p>
      <div data-testid="options-group" class="options-group" role="radiogroup" aria-label="Варианты ответа"></div>
      <div data-testid="explanation" class="explanation hidden" aria-live="polite"></div>
      <button type="button" data-testid="next-btn" class="btn btn-primary" disabled>Далее</button>
    </section>
    <section data-screen="results" data-testid="results-screen" class="screen" aria-label="Результаты">
      <h2>Результаты теста</h2>
      <p data-testid="results-score" class="results-score"></p>
      <p data-testid="results-percent" class="results-percent"></p>
      <ul data-testid="results-details" class="results-details"></ul>
      <div class="results-actions">
        <button type="button" data-testid="retry-btn" class="btn btn-primary">Пройти заново</button>
        <button type="button" data-testid="home-btn" class="btn btn-secondary">На главную</button>
      </div>
    </section>
    <section data-screen="error" data-testid="error-screen" class="screen" aria-label="Ошибка">
      <h2>Не удалось загрузить данные</h2>
      <p data-testid="error-message" class="error-message"></p>
      <button type="button" data-testid="error-retry-load" class="btn btn-primary">Обновить страницу</button>
    </section>
  </div>
  <script>
{js}
  </script>
</body>
</html>
"""


def main() -> None:
    css_path = APP_DIR / "styles.css"
    js_path = APP_DIR / "quiz-app.js"
    if not css_path.is_file():
        raise SystemExit(f"Missing: {css_path}")
    if not js_path.is_file():
        raise SystemExit(f"Missing: {js_path}")

    css = css_path.read_text(encoding="utf-8")
    js = js_path.read_text(encoding="utf-8").replace("</script>", r"<\/script>")
    html = HTML_BODY.format(css=css, js=js)
    out = APP_DIR / "index.html"
    out.write_text(html, encoding="utf-8")
    print(f"OK: {out} ({out.stat().st_size // 1024} KB shell)")


if __name__ == "__main__":
    main()
