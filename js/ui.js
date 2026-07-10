/**
 * Рендеринг экранов и UI-обновления.
 */
(function (global) {
  "use strict";

  /**
   * Показывает один экран по имени.
   * @param {string} screenName home|question|results|error
   */
  function showScreen(screenName) {
    document.querySelectorAll("[data-screen]").forEach(function (el) {
      el.classList.toggle("active", el.getAttribute("data-screen") === screenName);
    });
  }

  /**
   * @param {HTMLElement} el
   * @param {boolean} visible
   */
  function setVisible(el, visible) {
    if (!el) {
      return;
    }
    el.classList.toggle("hidden", !visible);
  }

  /**
   * Главный экран: одна кнопка или список тем из manifest.
   * @param {{id: string, title: string}[]} topics
   * @param {function(string|null): void} onStart
   */
  function renderHome(topics, onStart) {
    const startBtn = document.querySelector('[data-testid="home-start-btn"]');
    const list = document.querySelector('[data-testid="home-category-list"]');

    list.innerHTML = "";

    if (topics.length > 1) {
      setVisible(startBtn, false);
      setVisible(list, true);
      topics.forEach(function (topic) {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn btn-category";
        btn.setAttribute("data-testid", "home-category-item");
        btn.setAttribute("data-category", topic.id);
        btn.textContent = topic.title;
        btn.addEventListener("click", function () {
          onStart(topic.id);
        });
        li.appendChild(btn);
        list.appendChild(li);
      });
    } else {
      setVisible(list, false);
      setVisible(startBtn, true);
      startBtn.onclick = function () {
        const cat = topics.length === 1 ? topics[0].id : null;
        onStart(topics.length === 1 ? cat : null);
      };
    }
  }

  /**
   * Экран ошибки.
   * @param {string} message
   */
  function renderError(message) {
    const msgEl = document.querySelector('[data-testid="error-message"]');
    if (msgEl) {
      msgEl.textContent = message;
    }
    showScreen("error");
  }

  /**
   * Обновляет прогресс «k из N» и полосу.
   * @param {number} currentIndex 0-based
   * @param {number} total
   */
  function updateProgress(currentIndex, total) {
    const k = currentIndex + 1;
    const textEl = document.querySelector('[data-testid="progress-text"]');
    if (textEl) {
      textEl.textContent = k + " из " + total;
    }

    const bar = document.querySelector('[data-testid="progress-bar"]');
    const fill = bar && bar.querySelector(".progress-bar__fill");
    if (bar && fill) {
      const pct = total > 0 ? Math.round((k / total) * 100) : 0;
      bar.setAttribute("aria-valuenow", String(pct));
      fill.style.width = pct + "%";
    }
  }

  /**
   * Рендер экрана вопроса.
   * @param {object} session
   * @param {function(number): void} onSelect
   * @param {function(): void} onNext
   */
  function renderQuestion(session, onSelect, onNext) {
    const question = global.QuizState.getCurrentQuestion(session);
    if (!question) {
      return;
    }

    const total = session.questions.length;
    updateProgress(session.currentIndex, total);

    const textEl = document.querySelector('[data-testid="question-text"]');
    if (textEl) {
      textEl.textContent = question.question;
    }

    const group = document.querySelector('[data-testid="options-group"]');
    const explanationEl = document.querySelector('[data-testid="explanation"]');
    const nextBtn = document.querySelector('[data-testid="next-btn"]');

    group.innerHTML = "";
    setVisible(explanationEl, false);
    if (explanationEl) {
      explanationEl.textContent = "";
    }

    const isLocked = session.lockedQuestionIndex === session.currentIndex;
    const lastAnswer = isLocked ? session.answers[session.answers.length - 1] : null;

    question.options.forEach(function (optionText, index) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-item";
      btn.setAttribute("role", "radio");
      btn.setAttribute("data-testid", "option-item");
      btn.setAttribute("data-index", String(index));
      btn.setAttribute("aria-checked", "false");
      btn.textContent = optionText;

      if (isLocked) {
        btn.classList.add("option--disabled");
        btn.disabled = true;
        if (index === question.correct) {
          btn.classList.add("option--correct");
        }
        if (lastAnswer && index === lastAnswer.selectedIndex && !lastAnswer.isCorrect) {
          btn.classList.add("option--incorrect");
        }
        if (lastAnswer && index === lastAnswer.selectedIndex && lastAnswer.isCorrect) {
          btn.classList.add("option--correct");
        }
      } else {
        btn.addEventListener("click", function () {
          onSelect(index);
        });
      }

      group.appendChild(btn);
    });

    if (isLocked && explanationEl) {
      explanationEl.textContent = question.explanation;
      setVisible(explanationEl, true);
    }

    if (nextBtn) {
      const isLast = session.currentIndex === total - 1;
      nextBtn.textContent = isLast ? "Завершить" : "Далее";
      nextBtn.disabled = !isLocked;
      nextBtn.onclick = onNext;
    }

    showScreen("question");
  }

  /**
   * Экран результатов.
   * @param {object} result
   */
  function renderResults(result) {
    const scoreEl = document.querySelector('[data-testid="results-score"]');
    const percentEl = document.querySelector('[data-testid="results-percent"]');
    const detailsEl = document.querySelector('[data-testid="results-details"]');

    if (scoreEl) {
      scoreEl.textContent = result.correctCount + " из " + result.total + " правильных";
    }
    if (percentEl) {
      percentEl.textContent = result.percent + "%";
    }
    if (detailsEl) {
      detailsEl.innerHTML = "";
      result.details.forEach(function (item, idx) {
        const li = document.createElement("li");
        li.setAttribute("data-testid", "results-detail-item");
        li.setAttribute("data-correct", item.isCorrect ? "true" : "false");
        const mark = item.isCorrect ? "✓" : "✗";
        li.textContent = mark + " " + (idx + 1) + ". " + item.question;
        detailsEl.appendChild(li);
      });
    }

    showScreen("results");
  }

  global.QuizUI = {
    showScreen: showScreen,
    renderHome: renderHome,
    renderError: renderError,
    updateProgress: updateProgress,
    renderQuestion: renderQuestion,
    renderResults: renderResults,
  };
})(window);
