/**
 * Точка входа приложения.
 */
(function () {
  "use strict";

  /** @type {object[]} */
  let allQuestions = [];

  /** @type {{id: string, title: string}[]} */
  let topics = [];

  /** @type {object} */
  let session = QuizState.createSession();

  /**
   * Показывает главный экран с темами из manifest.
   */
  function showHomeScreen() {
    session = QuizState.createSession();

    QuizUI.renderHome(topics, function (categoryId) {
      const cat = topics.length > 1 ? categoryId : topics.length === 1 ? categoryId : null;
      QuizState.startQuiz(session, allQuestions, topics.length > 1 ? categoryId : cat);
      if (session.questions.length === 0) {
        QuizUI.renderError("В выбранной теме нет вопросов.");
        return;
      }
      QuizUI.renderQuestion(session, handleSelectOption, handleNext);
    });

    QuizUI.showScreen("home");
  }

  /**
   * @param {number} index
   */
  function handleSelectOption(index) {
    if (!QuizState.selectOption(session, index)) {
      return;
    }
    QuizUI.renderQuestion(session, handleSelectOption, handleNext);
  }

  function handleNext() {
    const action = QuizState.goNext(session);
    if (action === "next") {
      QuizUI.renderQuestion(session, handleSelectOption, handleNext);
    } else if (action === "complete") {
      const result = QuizState.calculateResult(session);
      QuizUI.renderResults(result);
    }
  }

  function handleRetry() {
    QuizState.retryQuiz(session, allQuestions);
    QuizUI.renderQuestion(session, handleSelectOption, handleNext);
  }

  function bindStaticHandlers() {
    const retryBtn = document.querySelector('[data-testid="retry-btn"]');
    const homeBtn = document.querySelector('[data-testid="home-btn"]');
    const errorRetry = document.querySelector('[data-testid="error-retry-load"]');

    if (retryBtn) {
      retryBtn.addEventListener("click", handleRetry);
    }
    if (homeBtn) {
      homeBtn.addEventListener("click", showHomeScreen);
    }
    if (errorRetry) {
      errorRetry.addEventListener("click", function () {
        window.location.reload();
      });
    }
  }

  function init() {
    bindStaticHandlers();

    QuizDataLoader.loadQuestions()
      .then(function (data) {
        allQuestions = data.questions;
        topics = data.topics;
        showHomeScreen();
      })
      .catch(function (err) {
        const msg =
          err && err.message
            ? err.message +
              ". Проверьте manifest.js, файлы тем и теги <script> в index.html."
            : "Не удалось загрузить вопросы.";
        QuizUI.renderError(msg);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
