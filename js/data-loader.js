/**
 * Загрузка данных: manifest + файлы тем.
 * Android (content://): только статические <script> в index.html + QuizTopicRegistry.
 * Desktop file://: статика или динамическая подгрузка как fallback.
 */
(function (global) {
  "use strict";

  var MANIFEST_GLOBAL = "QUIZ_MANIFEST";
  var DATA_GLOBAL = "QUIZ_DATA";
  var loadedTopics = [];

  function getManifestPath() {
    const meta = document.querySelector('meta[name="quiz-manifest-path"]');
    return meta && meta.content ? meta.content.trim() : "manifest.js";
  }

  /**
   * Протоколы, где динамическая подгрузка <script> ненадёжна.
   * @returns {boolean}
   */
  function isRestrictedProtocol() {
    if (!global.location) {
      return true;
    }
    const protocol = global.location.protocol;
    return protocol === "file:" || protocol === "content:" || protocol === "blob:";
  }

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
      return "manifest: ожидается непустой массив тем";
    }
    const ids = new Set();
    for (let i = 0; i < manifest.length; i++) {
      const entry = manifest[i];
      if (!entry || typeof entry !== "object") {
        return "manifest: запись #" + (i + 1) + " неверного формата";
      }
      if (!entry.id || typeof entry.id !== "string" || !entry.id.trim()) {
        return "manifest: запись #" + (i + 1) + " без id";
      }
      if (!entry.path || typeof entry.path !== "string" || !entry.path.trim()) {
        return "manifest: тема \"" + entry.id + "\" без path";
      }
      if (ids.has(entry.id)) {
        return "manifest: дублирующийся id темы \"" + entry.id + "\"";
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

  function androidScriptHint(paths) {
    return (
      "На Android добавьте в index.html теги <script src=\"…\"> для: " +
      paths.join(", ") +
      " (динамическая загрузка при content:// заблокирована)."
    );
  }

  function loadScriptGlobal(path, globalKey, missingMessage) {
    return new Promise(function (resolve, reject) {
      const hadOwn = Object.prototype.hasOwnProperty.call(global, globalKey);
      const previous = global[globalKey];
      global[globalKey] = undefined;

      const script = document.createElement("script");
      script.src = path;
      script.async = false;

      script.onload = function () {
        const value = global[globalKey];
        if (!hadOwn) {
          delete global[globalKey];
        } else {
          global[globalKey] = previous;
        }
        if (value === undefined || value === null) {
          reject(new Error(missingMessage.replace("{path}", path)));
          return;
        }
        resolve(value);
      };

      script.onerror = function () {
        if (!hadOwn) {
          delete global[globalKey];
        } else {
          global[globalKey] = previous;
        }
        reject(new Error("Не удалось загрузить " + path));
      };

      document.head.appendChild(script);
    });
  }

  function ensureManifest() {
    if (global[MANIFEST_GLOBAL]) {
      const err = validateManifest(global[MANIFEST_GLOBAL]);
      if (err) {
        return Promise.reject(new Error(err));
      }
      return Promise.resolve(global[MANIFEST_GLOBAL]);
    }
    if (isRestrictedProtocol()) {
      return Promise.reject(
        new Error(
          "Manifest не загружен. Добавьте <script src=\"" +
            getManifestPath() +
            "\"> в index.html (обязательно для Android)."
        )
      );
    }
    return loadScriptGlobal(
      getManifestPath(),
      MANIFEST_GLOBAL,
      "В {path} не найден window." + MANIFEST_GLOBAL
    ).then(function (manifest) {
      const err = validateManifest(manifest);
      if (err) {
        throw new Error(err);
      }
      return manifest;
    });
  }

  function normalizeQuestions(questions, entry) {
    const label = entry.path + " (тема \"" + entry.id + "\")";
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

  function mergeFromRegistry(manifest) {
    const allQuestions = [];
    const topics = [];
    const missing = [];

    manifest.forEach(function (entry) {
      if (!global.QuizTopicRegistry || !global.QuizTopicRegistry.has(entry.id)) {
        missing.push(entry.path);
        return;
      }
      const title = entry.title && entry.title.trim() ? entry.title.trim() : entry.id;
      topics.push({ id: entry.id, title: title });
      const questions = global.QuizTopicRegistry.get(entry.id);
      normalizeQuestions(questions, entry).forEach(function (q) {
        allQuestions.push(q);
      });
    });

    if (missing.length > 0) {
      throw new Error(androidScriptHint(missing));
    }

    const globalErr = validateGlobalQuestionIds(allQuestions);
    if (globalErr) {
      throw new Error(globalErr);
    }
    if (allQuestions.length < 1) {
      throw new Error("После загрузки всех тем не осталось ни одного вопроса");
    }

    loadedTopics = topics;
    return { questions: allQuestions, topics: topics };
  }

  function loadTopicFileDynamic(entry) {
    const label = entry.path + " (тема \"" + entry.id + "\")";
    return loadScriptGlobal(
      entry.path,
      DATA_GLOBAL,
      "В {path} не найден window." + DATA_GLOBAL
    ).then(function (data) {
      const err = validateTopicData(data, label);
      if (err) {
        throw new Error(err);
      }
      return normalizeQuestions(data.questions, entry);
    });
  }

  function loadAllTopicsDynamic(manifest) {
    const allQuestions = [];
    const topics = [];
    let chain = Promise.resolve();

    manifest.forEach(function (entry) {
      chain = chain.then(function () {
        if (global.QuizTopicRegistry && global.QuizTopicRegistry.has(entry.id)) {
          const title = entry.title && entry.title.trim() ? entry.title.trim() : entry.id;
          topics.push({ id: entry.id, title: title });
          normalizeQuestions(global.QuizTopicRegistry.get(entry.id), entry).forEach(function (q) {
            allQuestions.push(q);
          });
          return;
        }
        return loadTopicFileDynamic(entry).then(function (questions) {
          const title = entry.title && entry.title.trim() ? entry.title.trim() : entry.id;
          topics.push({ id: entry.id, title: title });
          questions.forEach(function (q) {
            allQuestions.push(q);
          });
        });
      });
    });

    return chain.then(function () {
      const globalErr = validateGlobalQuestionIds(allQuestions);
      if (globalErr) {
        throw new Error(globalErr);
      }
      if (allQuestions.length < 1) {
        throw new Error("После загрузки всех тем не осталось ни одного вопроса");
      }
      loadedTopics = topics;
      return { questions: allQuestions, topics: topics };
    });
  }

  function allTopicsInRegistry(manifest) {
    if (!global.QuizTopicRegistry) {
      return false;
    }
    return manifest.every(function (entry) {
      return global.QuizTopicRegistry.has(entry.id);
    });
  }

  function loadQuestions() {
    return ensureManifest().then(function (manifest) {
      if (allTopicsInRegistry(manifest)) {
        return mergeFromRegistry(manifest);
      }
      if (isRestrictedProtocol()) {
        const missing = manifest
          .filter(function (entry) {
            return !global.QuizTopicRegistry || !global.QuizTopicRegistry.has(entry.id);
          })
          .map(function (entry) {
            return entry.path;
          });
        return Promise.reject(new Error(androidScriptHint(missing)));
      }
      return loadAllTopicsDynamic(manifest);
    });
  }

  function getTopics() {
    return loadedTopics.slice();
  }

  global.QuizDataLoader = {
    getManifestPath: getManifestPath,
    loadQuestions: loadQuestions,
    getTopics: getTopics,
    validateManifest: validateManifest,
    validateTopicData: validateTopicData,
    isRestrictedProtocol: isRestrictedProtocol,
  };
})(window);
