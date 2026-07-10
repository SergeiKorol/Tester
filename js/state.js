/**
 * Управление состоянием сессии прохождения теста.
 * Состояние хранится только в памяти (сброс при F5).
 */
(function (global) {
  "use strict";

  /**
   * Создаёт пустую сессию.
   * @returns {object} QuizSession
   */
  function createSession() {
    return {
      category: null,
      questions: [],
      currentIndex: 0,
      answers: [],
      phase: "idle",
      lockedQuestionIndex: null,
      lastCategory: null,
    };
  }

  /**
   * Группирует вопросы по категориям.
   * @param {object[]} questions
   * @returns {Map<string, object[]>}
   */
  function groupByCategory(questions) {
    const map = new Map();
    questions.forEach(function (q) {
      const cat = q.category && q.category.trim() ? q.category.trim() : "Общее";
      if (!map.has(cat)) {
        map.set(cat, []);
      }
      map.get(cat).push(q);
    });
    return map;
  }

  /**
   * Возвращает отсортированные имена категорий.
   * @param {Map<string, object[]>} groups
   * @returns {string[]}
   */
  function getCategoryNames(groups) {
    return Array.from(groups.keys()).sort(function (a, b) {
      return a.localeCompare(b, "ru");
    });
  }

  /**
   * Запускает тест для категории или всех вопросов.
   * @param {object} session
   * @param {object[]} allQuestions
   * @param {string|null} category null = все вопросы
   */
  function startQuiz(session, allQuestions, category) {
    let questions;
    if (category === null) {
      questions = allQuestions.slice();
    } else {
      questions = allQuestions.filter(function (q) {
        const cat = q.category && q.category.trim() ? q.category.trim() : "Общее";
        return cat === category;
      });
    }

    session.category = category;
    session.lastCategory = category;
    session.questions = questions;
    session.currentIndex = 0;
    session.answers = [];
    session.phase = questions.length > 0 ? "in_progress" : "idle";
    session.lockedQuestionIndex = null;
  }

  /**
   * Текущий вопрос или null.
   * @param {object} session
   * @returns {object|null}
   */
  function getCurrentQuestion(session) {
    if (session.phase !== "in_progress") {
      return null;
    }
    return session.questions[session.currentIndex] || null;
  }

  /**
   * Фиксирует ответ (только первый клик на вопросе).
   * @param {object} session
   * @param {number} selectedIndex
   * @returns {boolean} true если ответ принят
   */
  function selectOption(session, selectedIndex) {
    if (session.phase !== "in_progress") {
      return false;
    }
    if (session.lockedQuestionIndex === session.currentIndex) {
      return false;
    }

    const question = getCurrentQuestion(session);
    if (!question) {
      return false;
    }
    if (selectedIndex < 0 || selectedIndex >= question.options.length) {
      return false;
    }

    session.lockedQuestionIndex = session.currentIndex;
    session.answers.push({
      questionId: question.id,
      selectedIndex: selectedIndex,
      isCorrect: selectedIndex === question.correct,
      questionText: question.question,
      explanation: question.explanation,
    });
    return true;
  }

  /**
   * Переход к следующему вопросу или завершение.
   * @param {object} session
   * @returns {"next"|"complete"|"blocked"}
   */
  function goNext(session) {
    if (session.phase !== "in_progress") {
      return "blocked";
    }
    if (session.lockedQuestionIndex !== session.currentIndex) {
      return "blocked";
    }

    if (session.currentIndex < session.questions.length - 1) {
      session.currentIndex += 1;
      session.lockedQuestionIndex = null;
      return "next";
    }

    session.phase = "completed";
    return "complete";
  }

  /**
   * Считает итог сессии.
   * @param {object} session
   * @returns {object} SessionResult
   */
  function calculateResult(session) {
    const total = session.questions.length;
    const correctCount = session.answers.filter(function (a) {
      return a.isCorrect;
    }).length;
    const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    const details = session.answers.map(function (a) {
      return {
        question: a.questionText,
        isCorrect: a.isCorrect,
        selectedIndex: a.selectedIndex,
        explanation: a.explanation,
      };
    });

    return { total, correctCount, percent, details };
  }

  /**
   * Сброс для повторного прохождения той же категории.
   * @param {object} session
   * @param {object[]} allQuestions
   */
  function retryQuiz(session, allQuestions) {
    startQuiz(session, allQuestions, session.lastCategory);
  }

  global.QuizState = {
    createSession: createSession,
    groupByCategory: groupByCategory,
    getCategoryNames: getCategoryNames,
    startQuiz: startQuiz,
    getCurrentQuestion: getCurrentQuestion,
    selectOption: selectOption,
    goNext: goNext,
    calculateResult: calculateResult,
    retryQuiz: retryQuiz,
  };
})(window);
