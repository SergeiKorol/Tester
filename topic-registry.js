/**
 * Реестр тем, загруженных статическими <script> в index.html.
 * Нужен для Android (content://), где динамическая подгрузка .js заблокирована.
 */
(function (global) {
  "use strict";

  /** @type {Object.<string, object[]>} */
  var topics = {};

  /**
   * Регистрирует вопросы темы (вызывается из data/<тема>.js).
   * @param {string} topicId
   * @param {object[]} questions
   */
  function register(topicId, questions) {
    if (!topicId || typeof topicId !== "string" || !topicId.trim()) {
      throw new Error("QuizTopicRegistry.register: пустой topicId");
    }
    if (!Array.isArray(questions) || questions.length < 1) {
      throw new Error("QuizTopicRegistry.register: questions должен быть непустым массивом");
    }
    topics[topicId.trim()] = questions;
  }

  /**
   * @param {string} topicId
   * @returns {boolean}
   */
  function has(topicId) {
    return Object.prototype.hasOwnProperty.call(topics, topicId);
  }

  /**
   * @param {string} topicId
   * @returns {object[]|null}
   */
  function get(topicId) {
    if (!has(topicId)) {
      return null;
    }
    return topics[topicId].map(function (q) {
      return Object.assign({}, q);
    });
  }

  global.QuizTopicRegistry = {
    register: register,
    has: has,
    get: get,
  };
})(window);
