(function (global) {
  'use strict';

  var STORAGE_KEY = 'projecthub_lang';

  var t = {
    ru: {
      nav_home: 'Главная',
      nav_login: 'Вход',
      nav_register: 'Регистрация',
      nav_dashboard: 'Личный кабинет',
      nav_search: 'Поиск',
      nav_project: 'Проект',
      nav_cabinet: 'Кабинет',
      nav_logout: 'Выйти',
      index_hero: 'Управляйте проектами и командой в одном месте',
      index_lead: 'Создавайте проекты, распределяйте задачи, отслеживайте сроки и обсуждайте идеи с командой.',
      index_start: 'Начать бесплатно',
      index_login: 'Войти',
      index_tagline: 'Сервис для управления проектами и командной работы',
      index_footer: 'Лабораторная работа 1.',
      login_title: 'Вход в аккаунт',
      login_email: 'Email',
      login_password: 'Пароль',
      login_remember: 'Запомнить меня',
      login_submit: 'Войти',
      login_no_account: 'Нет аккаунта?',
      login_register_link: 'Зарегистрироваться',
      reg_title: 'Регистрация',
      reg_name: 'Имя',
      reg_email: 'Email',
      reg_password: 'Пароль',
      reg_confirm: 'Подтверждение пароля',
      reg_hint: 'Минимум 6 символов.',
      reg_submit: 'Зарегистрироваться',
      reg_has_account: 'Уже есть аккаунт?',
      reg_login_link: 'Войти',
      dash_title: 'Личный кабинет',
      dash_projects: 'Мои проекты',
      dash_tasks: 'Мои задачи',
      dash_notifications: 'Уведомления',
      dash_add_project: 'Добавить проект',
      dash_new_project: 'Новый проект',
      dash_project_name: 'Название',
      dash_project_desc: 'Описание (необязательно)',
      dash_cancel: 'Отмена',
      dash_add: 'Добавить',
      search_title: 'Поиск задач и проектов',
      search_query: 'Поиск',
      search_query_ph: 'Название задачи или проекта',
      search_status: 'Статус',
      search_priority: 'Приоритет',
      search_assignee: 'Исполнитель',
      search_any: 'Любой',
      search_btn: 'Найти',
      search_reset: 'Сбросить',
      search_results: 'Результаты',
      search_open: 'Открыть',
      status_new: 'Новая',
      status_progress: 'В работе',
      status_review: 'На проверке',
      status_done: 'Выполнена',
      priority_low: 'Низкий',
      priority_medium: 'Средний',
      priority_high: 'Высокий',
      priority_critical: 'Критический',
      project_add_task: 'Добавить задачу',
      project_new_task: 'Новая задача',
      project_roles: 'Роли и права в команде',
      project_board: 'Доска задач',
      project_deadlines: 'Сроки',
      project_files: 'Файлы',
      project_discussions: 'Обсуждения',
      project_task_name: 'Название',
      project_task_title_ph: 'Название задачи',
      project_deadline: 'Срок',
      project_send: 'Отправить',
      project_disc_ph: 'Написать сообщение...',
      project_task: 'Задача',
      project_assignee: 'Исполнитель',
      project_deadline_date: 'Срок',
      project_status: 'Статус'
    },
    en: {
      nav_home: 'Home',
      nav_login: 'Log in',
      nav_register: 'Sign up',
      nav_dashboard: 'Dashboard',
      nav_search: 'Search',
      nav_project: 'Project',
      nav_cabinet: 'Cabinet',
      nav_logout: 'Log out',
      index_hero: 'Manage projects and your team in one place',
      index_lead: 'Create projects, assign tasks, track deadlines and discuss ideas with your team.',
      index_start: 'Get started free',
      index_login: 'Log in',
      index_tagline: 'Project management and team collaboration service',
      index_footer: 'Lab work 1.',
      login_title: 'Log in to your account',
      login_email: 'Email',
      login_password: 'Password',
      login_remember: 'Remember me',
      login_submit: 'Log in',
      login_no_account: "Don't have an account?",
      login_register_link: 'Sign up',
      reg_title: 'Sign up',
      reg_name: 'Name',
      reg_email: 'Email',
      reg_password: 'Password',
      reg_confirm: 'Confirm password',
      reg_hint: 'At least 6 characters.',
      reg_submit: 'Sign up',
      reg_has_account: 'Already have an account?',
      reg_login_link: 'Log in',
      dash_title: 'Dashboard',
      dash_projects: 'My projects',
      dash_tasks: 'My tasks',
      dash_notifications: 'Notifications',
      dash_add_project: 'Add project',
      dash_new_project: 'New project',
      dash_project_name: 'Name',
      dash_project_desc: 'Description (optional)',
      dash_cancel: 'Cancel',
      dash_add: 'Add',
      search_title: 'Search tasks and projects',
      search_query: 'Search',
      search_query_ph: 'Task or project name',
      search_status: 'Status',
      search_priority: 'Priority',
      search_assignee: 'Assignee',
      search_any: 'Any',
      search_btn: 'Search',
      search_reset: 'Reset',
      search_results: 'Results',
      search_open: 'Open',
      status_new: 'New',
      status_progress: 'In progress',
      status_review: 'In review',
      status_done: 'Done',
      priority_low: 'Low',
      priority_medium: 'Medium',
      priority_high: 'High',
      priority_critical: 'Critical',
      project_add_task: 'Add task',
      project_new_task: 'New task',
      project_roles: 'Roles and permissions',
      project_board: 'Board',
      project_deadlines: 'Deadlines',
      project_files: 'Files',
      project_discussions: 'Discussions',
      project_task_name: 'Title',
      project_task_title_ph: 'Task title',
      project_deadline: 'Deadline',
      project_send: 'Send',
      project_disc_ph: 'Write a message...',
      project_task: 'Task',
      project_assignee: 'Assignee',
      project_deadline_date: 'Deadline',
      project_status: 'Status'
    }
  };

  function getLang() {
    var saved = localStorage.getItem(STORAGE_KEY);
    return (saved === 'en' || saved === 'ru') ? saved : 'ru';
  }

  function setLang(lang) {
    if (lang !== 'ru' && lang !== 'en') return;
    localStorage.setItem(STORAGE_KEY, lang);
    applyLang(lang);
  }

  function applyLang(lang) {
    var L = t[lang] || t.ru;
    document.documentElement.lang = lang === 'en' ? 'en' : 'ru';

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (L[key] !== undefined) {
        el.textContent = L[key];
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (L[key] !== undefined) el.placeholder = L[key];
    });

    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-title');
      if (L[key] !== undefined) el.title = L[key];
    });
  }

  function initSwitcher() {
    document.querySelectorAll('[data-i18n-set="ru"]').forEach(function (el) {
      el.addEventListener('click', function (e) { e.preventDefault(); setLang('ru'); });
    });
    document.querySelectorAll('[data-i18n-set="en"]').forEach(function (el) {
      el.addEventListener('click', function (e) { e.preventDefault(); setLang('en'); });
    });
  }

  function init() {
    applyLang(getLang());
    initSwitcher();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  global.ProjectHubI18n = { getLang: getLang, setLang: setLang, applyLang: applyLang, t: t };
})(typeof window !== 'undefined' ? window : this);
