/**
 * Конфигурация для управления отправкой форм на бэкенде.
 */
export const sendConfig = {
  // Настройки для режима разработки (process.env.NODE_ENV === 'development')
  dev: {
    sendTelegram: true, // отправлять в Telegram в dev-режиме (true/false)
    sendEmail: true,    // отправлять на Email в dev-режиме (true/false)
    spamProtection: true, // защита от спама в dev-режиме (выключена)
    minSubmissionTimeMs: 15000, // минимальное время заполнения формы в dev (мс)
  },
  // Настройки для продакшена
  prod: {
    sendTelegram: true, // отправлять в Telegram в продакшене (true/false)
    sendEmail: true,    // отправлять на Email в продакшене (true/false)
    spamProtection: true,  // защита от спама в продакшене (включена)
    minSubmissionTimeMs: 15000, // минимальное время заполнения формы в prod (мс)
  }
};
