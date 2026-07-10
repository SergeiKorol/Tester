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


/**
 * Загрузка данных: импорт JSON через File API + кэш IndexedDB.
 * Оболочка не содержит вопросов; контент подгружается на устройстве (FR-015, FR-016).
 */
(function (global) {
  "use strict";

  var DB_NAME = "sobes-aqa-quiz";
  var DB_VERSION = 1;
  var STORE_NAME = "cache";
  var CACHE_KEY = "snapshot";
  var loadedTopics = [];

  function validateQuestion(q, index) {
    if (!q || typeof q !== "object") {
      return "Вопрос #" + (index + 1) + ": неверный формат";
    }
    if (typeof q.id !== "number" || q.id < 1) {
      return "Вопрос #" + (index + 1) + ": id должен быть числом ≥ 1";
    }
    if (!q.question || typeof q.question !== "string" || !q.question.trim()) {
      return "Вопрос id=" + q.id + ": пустой текст вопроса";
    }
    if (!Array.isArray(q.options) || q.options.length < 2) {
      return "Вопрос id=" + q.id + ": минимум 2 варианта ответа";
    }
    for (let i = 0; i < q.options.length; i++) {
      if (typeof q.options[i] !== "string" || !q.options[i].trim()) {
        return "Вопрос id=" + q.id + ": пустой вариант ответа";
      }
    }
    if (typeof q.correct !== "number" || q.correct < 0 || q.correct >= q.options.length) {
      return "Вопрос id=" + q.id + ": неверный индекс correct";
    }
    if (!q.explanation || typeof q.explanation !== "string" || !q.explanation.trim()) {
      return "Вопрос id=" + q.id + ": пустое пояснение";
    }
    return null;
  }

  function validateQuestionsArray(questions, sourceLabel) {
    if (!Array.isArray(questions) || questions.length < 1) {
      return sourceLabel + ": массив questions пуст или отсутствует";
    }
    const ids = new Set();
    for (let i = 0; i < questions.length; i++) {
      const err = validateQuestion(questions[i], i);
      if (err) {
        return sourceLabel + ": " + err;
      }
      const id = questions[i].id;
      if (ids.has(id)) {
        return sourceLabel + ": дублирующийся id вопроса " + id;
      }
      ids.add(id);
    }
    return null;
  }

  function validateTopicData(data, sourceLabel) {
    if (!data || typeof data !== "object") {
      return sourceLabel + ": ожидается объект с полем questions";
    }
    return validateQuestionsArray(data.questions, sourceLabel);
  }

  function validateManifest(manifest) {
    if (!Array.isArray(manifest) || manifest.length < 1) {
      return "manifest.json: ожидается непустой массив тем";
    }
    const ids = new Set();
    for (let i = 0; i < manifest.length; i++) {
      const entry = manifest[i];
      if (!entry || typeof entry !== "object") {
        return "manifest.json: запись #" + (i + 1) + " неверного формата";
      }
      if (!entry.id || typeof entry.id !== "string" || !entry.id.trim()) {
        return "manifest.json: запись #" + (i + 1) + " без id";
      }
      if (!entry.path || typeof entry.path !== "string" || !entry.path.trim()) {
        return "manifest.json: тема \"" + entry.id + "\" без path";
      }
      if (ids.has(entry.id)) {
        return "manifest.json: дублирующийся id темы \"" + entry.id + "\"";
      }
      ids.add(entry.id);
    }
    return null;
  }

  function validateGlobalQuestionIds(questions) {
    const ids = new Set();
    for (let i = 0; i < questions.length; i++) {
      const id = questions[i].id;
      if (ids.has(id)) {
        return "Дублирующийся id вопроса между файлами тем: " + id;
      }
      ids.add(id);
    }
    return null;
  }

  function fileBaseName(file) {
    const name = file.name || "";
    const parts = name.split(/[/\\]/);
    return parts[parts.length - 1];
  }

  function readFileAsText(file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = function () {
        resolve(String(reader.result || ""));
      };
      reader.onerror = function () {
        reject(new Error("Не удалось прочитать файл " + fileBaseName(file)));
      };
      reader.readAsText(file, "UTF-8");
    });
  }

  function normalizeQuestions(questions, entry, sourceLabel) {
    const label = sourceLabel || entry.path + " (тема \"" + entry.id + "\")";
    const err = validateQuestionsArray(questions, label);
    if (err) {
      throw new Error(err);
    }
    return questions.map(function (q) {
      const copy = Object.assign({}, q);
      if (copy.category && copy.category.trim() && copy.category.trim() !== entry.id) {
        throw new Error(
          "Вопрос id=" +
            copy.id +
            " в " +
            entry.path +
            ": category \"" +
            copy.category +
            "\" не совпадает с id темы \"" +
            entry.id +
            "\""
        );
      }
      copy.category = entry.id;
      return copy;
    });
  }

  function buildResultFromSnapshot(snapshot) {
    const manifest = snapshot.manifest;
    const topicMap = snapshot.topics;
    const allQuestions = [];
    const topics = [];

    manifest.forEach(function (entry) {
      const questions = topicMap[entry.id];
      if (!questions) {
        throw new Error("В кэше отсутствует тема \"" + entry.id + "\"");
      }
      const title = entry.title && entry.title.trim() ? entry.title.trim() : entry.id;
      topics.push({ id: entry.id, title: title });
      normalizeQuestions(questions, entry).forEach(function (q) {
        allQuestions.push(q);
      });
    });

    const globalErr = validateGlobalQuestionIds(allQuestions);
    if (globalErr) {
      throw new Error(globalErr);
    }
    if (allQuestions.length < 1) {
      throw new Error("После загрузки всех тем не осталось ни одного вопроса");
    }

    loadedTopics = topics;
    return { questions: allQuestions, topics: topics, snapshot: snapshot };
  }

  function openDatabase() {
    return new Promise(function (resolve, reject) {
      if (!global.indexedDB) {
        reject(new Error("IndexedDB недоступен в этом браузере"));
        return;
      }
      const request = global.indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = function () {
        reject(new Error("Не удалось открыть IndexedDB"));
      };
      request.onupgradeneeded = function (event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = function () {
        resolve(request.result);
      };
    });
  }

  function saveSnapshot(snapshot) {
    return openDatabase().then(function (db) {
      return new Promise(function (resolve, reject) {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        store.put(snapshot, CACHE_KEY);
        tx.oncomplete = function () {
          db.close();
          resolve();
        };
        tx.onerror = function () {
          db.close();
          reject(new Error("Не удалось сохранить данные в IndexedDB"));
        };
      });
    });
  }

  function loadSnapshot() {
    return openDatabase().then(function (db) {
      return new Promise(function (resolve, reject) {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const request = store.get(CACHE_KEY);
        request.onsuccess = function () {
          db.close();
          resolve(request.result || null);
        };
        request.onerror = function () {
          db.close();
          reject(new Error("Не удалось прочитать кэш IndexedDB"));
        };
      });
    });
  }

  /**
   * Импортирует manifest.json и файлы тем из FileList.
   * @param {FileList|File[]} files
   * @returns {Promise<{questions: object[], topics: object[], snapshot: object}>}
   */
  function importQuizData(files) {
    const list = Array.from(files || []);
    if (list.length < 1) {
      return Promise.reject(new Error("Файлы не выбраны"));
    }

    let manifestFile = null;
    const byName = new Map();

    list.forEach(function (file) {
      const base = fileBaseName(file);
      byName.set(base, file);
      if (base === "manifest.json") {
        manifestFile = file;
      }
    });

    if (!manifestFile) {
      return Promise.reject(
        new Error("Выберите manifest.json вместе с файлами тем")
      );
    }

    return readFileAsText(manifestFile).then(function (manifestText) {
      let manifest;
      try {
        manifest = JSON.parse(manifestText);
      } catch (parseErr) {
        throw new Error("manifest.json: невалидный JSON");
      }

      const manifestErr = validateManifest(manifest);
      if (manifestErr) {
        throw new Error(manifestErr);
      }

      const topicPromises = manifest.map(function (entry) {
        const topicFile = byName.get(entry.path);
        if (!topicFile) {
          throw new Error("Не выбран файл темы: " + entry.path);
        }
        return readFileAsText(topicFile).then(function (topicText) {
          let topicData;
          try {
            topicData = JSON.parse(topicText);
          } catch (parseErr) {
            throw new Error(entry.path + ": невалидный JSON");
          }
          const topicErr = validateTopicData(topicData, entry.path);
          if (topicErr) {
            throw new Error(topicErr);
          }
          return {
            id: entry.id,
            questions: normalizeQuestions(topicData.questions, entry),
          };
        });
      });

      return Promise.all(topicPromises).then(function (topicResults) {
        const topicsMap = {};
        topicResults.forEach(function (item) {
          topicsMap[item.id] = item.questions;
        });

        const snapshot = {
          version: 1,
          manifest: manifest,
          topics: topicsMap,
        };

        return saveSnapshot(snapshot).then(function () {
          return buildResultFromSnapshot(snapshot);
        });
      });
    });
  }

  /**
   * Загружает вопросы из IndexedDB. Если кэш пуст — resolve(null).
   * @returns {Promise<{questions: object[], topics: object[]}|null>}
   */
  function loadQuestions() {
    return loadSnapshot().then(function (snapshot) {
      if (!snapshot || !snapshot.manifest || !snapshot.topics) {
        return null;
      }
      const result = buildResultFromSnapshot(snapshot);
      return { questions: result.questions, topics: result.topics };
    });
  }

  function getTopics() {
    return loadedTopics.slice();
  }

  global.QuizDataLoader = {
    importQuizData: importQuizData,
    loadQuestions: loadQuestions,
    getTopics: getTopics,
    validateManifest: validateManifest,
    validateTopicData: validateTopicData,
  };
})(window);


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
   * Главный экран: импорт данных, список тем или одна кнопка старта.
   * @param {{id: string, title: string}[]} topics
   * @param {function(string|null): void} onStart null = все темы
   */
  function renderHome(topics, onStart) {
    const startBtn = document.querySelector('[data-testid="home-start-btn"]');
    const list = document.querySelector('[data-testid="home-category-list"]');
    const importBtn = document.querySelector('[data-testid="home-import-btn"]');
    const reimportBtn = document.querySelector('[data-testid="home-reimport-btn"]');
    const importHint = document.querySelector('[data-testid="home-import-hint"]');

    const hasData = topics.length > 0;

    setVisible(importBtn, !hasData);
    setVisible(importHint, !hasData);
    setVisible(reimportBtn, hasData);

    list.innerHTML = "";

    if (!hasData) {
      setVisible(startBtn, false);
      setVisible(list, false);
      return;
    }

    if (topics.length > 1) {
      setVisible(startBtn, false);
      setVisible(list, true);

      const allLi = document.createElement("li");
      const allBtn = document.createElement("button");
      allBtn.type = "button";
      allBtn.className = "btn btn-category btn-category--all";
      allBtn.setAttribute("data-testid", "home-all-topics-btn");
      allBtn.textContent = "Все темы";
      allBtn.addEventListener("click", function () {
        onStart(null);
      });
      allLi.appendChild(allBtn);
      list.appendChild(allLi);

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
        onStart(topics.length === 1 ? topics[0].id : null);
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
        if (lastAnswer && index === lastAnswer.selectedIndex) {
          btn.setAttribute("aria-checked", "true");
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
   * Показывает главный экран с темами из кэша.
   */
  function showHomeScreen() {
    session = QuizState.createSession();

    QuizUI.renderHome(topics, function (categoryId) {
      const cat =
        topics.length > 1
          ? categoryId
          : topics.length === 1
            ? categoryId
            : null;
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
   * Применяет загруженные данные и показывает главный экран.
   * @param {{questions: object[], topics: object[]}} data
   */
  function applyQuizData(data) {
    allQuestions = data.questions;
    topics = data.topics;
    showHomeScreen();
  }

  /**
   * Открывает диалог выбора JSON-файлов.
   */
  function triggerImportDialog() {
    const input = document.querySelector('[data-testid="home-import-input"]');
    if (input) {
      input.value = "";
      input.click();
    }
  }

  /**
   * @param {Event} event
   */
  function handleImportFiles(event) {
    const input = event.target;
    const files = input && input.files;
    if (!files || files.length < 1) {
      return;
    }

    QuizDataLoader.importQuizData(files)
      .then(function (data) {
        applyQuizData(data);
      })
      .catch(function (err) {
        const msg =
          err && err.message
            ? err.message
            : "Не удалось импортировать тесты.";
        QuizUI.renderError(msg);
      });
  }

  function bindImportHandlers() {
    const importBtn = document.querySelector('[data-testid="home-import-btn"]');
    const reimportBtn = document.querySelector('[data-testid="home-reimport-btn"]');
    const fileInput = document.querySelector('[data-testid="home-import-input"]');

    if (importBtn) {
      importBtn.addEventListener("click", triggerImportDialog);
    }
    if (reimportBtn) {
      reimportBtn.addEventListener("click", triggerImportDialog);
    }
    if (fileInput) {
      fileInput.addEventListener("change", handleImportFiles);
    }
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
    bindImportHandlers();

    QuizDataLoader.loadQuestions()
      .then(function (data) {
        if (data) {
          applyQuizData(data);
        } else {
          allQuestions = [];
          topics = [];
          showHomeScreen();
        }
      })
      .catch(function (err) {
        const msg =
          err && err.message
            ? err.message + ". Попробуйте загрузить тесты заново."
            : "Не удалось загрузить кэш тестов.";
        QuizUI.renderError(msg);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
