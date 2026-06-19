import { ref } from 'vue'

const ru = {
  // Navigation
  'nav.dashboard': 'Личный кабинет',
  'nav.experiments': 'Эксперименты',
  'nav.models': 'Модели',
  'nav.settings': 'Настройки',
  'nav.logout': 'Выйти',

  // Common table headers
  'common.cancel': 'Отмена',
  'common.name': 'Название',
  'common.model': 'Модель',
  'common.metric': 'Метрика',
  'common.metricValue': 'Значение метрики',
  'common.date': 'Дата',
  'common.duration': 'Длительность',
  'common.status': 'Статус',
  'common.actions': 'Действия',
  'common.loading': 'Загрузка...',
  'common.serverError': 'Не удалось связаться с сервером',

  // Settings
  'settings.title': 'Настройки профиля',
  'settings.appearance': 'Внешний вид',
  'settings.darkMode': 'Темная тема',
  'settings.language': 'Язык интерфейса',
  'settings.deleteProfile': 'Удалить профиль',
  'settings.save': 'Сохранить',
  'settings.deleteConfirm': 'ВНИМАНИЕ! Это необратимое действие. Удалить профиль и все данные?',
  'settings.deleteError': 'Не удалось удалить профиль.',

  // New Experiment Modal
  'expModal.title': 'Создать новый эксперимент',
  'expModal.modelLabel': 'Модель',
  'expModal.selectModel': 'Выберите модель...',
  'expModal.nameLabel': 'Название эксперимента',
  'expModal.nameHint': 'Автозаполняется при выборе модели. Можно изменить вручную.',
  'expModal.namePlaceholder': 'Experiment_N',
  'expModal.creating': 'Создание...',
  'expModal.create': 'Создать',
  'expModal.selectModelError': 'Выберите модель!',
  'expModal.nameError': 'Введите название эксперимента!',
  'expModal.duplicateError': 'Эксперимент с таким названием уже существует!',
  'expModal.createError': 'Ошибка при создании эксперимента',

  // New Model Modal
  'modelModal.title': 'Регистрация новой модели',
  'modelModal.nameLabel': 'Название модели',
  'modelModal.namePlaceholder': 'Например, CV_model',
  'modelModal.framework': 'Библиотека / Фреймворк',
  'modelModal.selectFramework': 'Выберите библиотеку...',
  'modelModal.artifactPath': 'Путь к артефактам',
  'modelModal.artifactHint': 'Укажите путь к хранилищу весов модели.',
  'modelModal.stage': 'Начальная стадия',
  'modelModal.description': 'Описание',
  'modelModal.saving': 'Сохранение...',
  'modelModal.register': 'Зарегистрировать',
  'modelModal.nameError': 'Введите название модели!',
  'modelModal.frameworkError': 'Выберите фреймворк!',
  'modelModal.duplicateError': 'Модель с таким названием уже существует!',
  'modelModal.createError': 'Ошибка при создании модели',

  // Dashboard
  'dashboard.title': 'Обзор пайплайнов',
  'dashboard.newExperiment': 'Новый эксперимент',
  'dashboard.totalExperiments': 'Всего экспериментов',
  'dashboard.totalModels': 'Всего моделей',
  'dashboard.recentExperiments': 'Последние эксперименты',
  'dashboard.allExperiments': 'Все эксперименты',
  'dashboard.deleteConfirm': 'Удалить запись?',

  // Experiments
  'experiments.title': 'Эксперименты',
  'experiments.filtersLabel': 'Фильтры экспериментов',
  'experiments.searchLabel': 'Поиск по названию',
  'experiments.searchPlaceholder': 'Например, ResNet или CV',
  'experiments.searchAriaLabel': 'Поиск эксперимента по названию',
  'experiments.dateLabel': 'Дата создания',
  'experiments.datePlaceholder': 'дд.мм.гггг',
  'experiments.dateAriaLabel': 'Фильтр по дате создания',
  'experiments.metricLabel': 'Значение метрики',
  'experiments.metricAriaLabel': 'Сортировка по значению метрики',
  'experiments.noSort': 'Не сортировать',
  'experiments.sortDesc': 'По убыванию',
  'experiments.sortAsc': 'По возрастанию',
  'experiments.apply': 'Применить',
  'experiments.tableLabel': 'Список экспериментов',
  'experiments.notFound': 'Эксперименты не найдены',
  'experiments.deleteConfirm': 'Удалить запись?',

  // Experiment Details
  'expDetails.back': '← Назад к списку',
  'expDetails.started': 'Запущен:',
  'expDetails.metricsTab': 'Метрики',
  'expDetails.logsTab': 'Логи обучения',
  'expDetails.artifactsTab': 'Файлы и артефакты',
  'expDetails.usedModel': 'Используемая модель',
  'expDetails.chartTitle': 'Визуализация обучения',
  'expDetails.chartPlaceholder': 'Здесь будет график',
  'expDetails.consoleLogs': 'Вывод консоли',
  'expDetails.modelFiles': 'Файлы модели',
  'expDetails.downloadAll': 'Скачать всё (.zip)',
  'expDetails.download': 'Скачать',
  'expDetails.view': 'Посмотреть',
  'expDetails.loadError': 'Не удалось загрузить данные эксперимента.',

  // Models
  'models.title': 'Реестр моделей',
  'models.register': 'Зарегистрировать модель',
  'models.description': 'Управление версиями моделей и их статусами.',
  'models.searchSectionLabel': 'Поиск моделей',
  'models.searchLabel': 'Поиск по названию',
  'models.searchPlaceholder': 'Например, ResNet',
  'models.searchAriaLabel': 'Поиск модели по названию',
  'models.searchBtn': 'Найти',
  'models.resetBtn': 'Сбросить',
  'models.resetAriaLabel': 'Сбросить поиск',
  'models.notFound': 'Модели не найдены',
  'models.lastUpdated': 'Последнее обновление:',
  'models.unknown': 'Неизвестно',
  'models.showVersions': 'Показать версии',
  'models.hideVersions': 'Скрыть версии',
  'models.versionCol': 'Версия',
  'models.stageCol': 'Стадия',
  'models.metricsCol': 'Метрики',
  'models.actionsCol': 'Действия',
  'models.noVersions': 'Версии не найдены',
  'models.details': 'Детали',
  'models.deleteConfirm': 'Вы уверены, что хотите удалить эту модель?',

  // Login
  'login.title': 'MLPipelines',
  'login.subtitle': 'Вход в систему',
  'login.email': 'Email',
  'login.emailPlaceholder': 'name@yandex.ru',
  'login.password': 'Пароль',
  'login.passwordPlaceholder': '********',
  'login.submit': 'Войти',
  'login.loading': 'Вход...',
  'login.noAccount': 'Нет аккаунта?',
  'login.register': 'Зарегистрироваться',
  'login.invalidCredentials': 'Неверный email или пароль',

  // Register
  'register.title': 'MLPipelines',
  'register.subtitle': 'Регистрация',
  'register.name': 'Имя',
  'register.email': 'Email',
  'register.password': 'Пароль',
  'register.submit': 'Зарегистрироваться',
  'register.loading': 'Регистрация...',
  'register.hasAccount': 'Уже есть аккаунт?',
  'register.login': 'Войти',
  'register.emailExists': 'Этот email уже зарегистрирован',
}

const en = {
  // Navigation
  'nav.dashboard': 'Dashboard',
  'nav.experiments': 'Experiments',
  'nav.models': 'Models',
  'nav.settings': 'Settings',
  'nav.logout': 'Logout',

  // Common table headers
  'common.cancel': 'Cancel',
  'common.name': 'Name',
  'common.model': 'Model',
  'common.metric': 'Metric',
  'common.metricValue': 'Metric Value',
  'common.date': 'Date',
  'common.duration': 'Duration',
  'common.status': 'Status',
  'common.actions': 'Actions',
  'common.loading': 'Loading...',
  'common.serverError': 'Could not connect to server',

  // Settings
  'settings.title': 'Profile Settings',
  'settings.appearance': 'Appearance',
  'settings.darkMode': 'Dark mode',
  'settings.language': 'Interface Language',
  'settings.deleteProfile': 'Delete Profile',
  'settings.save': 'Save',
  'settings.deleteConfirm': 'WARNING! This is irreversible. Delete profile and all data?',
  'settings.deleteError': 'Failed to delete profile.',

  // New Experiment Modal
  'expModal.title': 'Create New Experiment',
  'expModal.modelLabel': 'Model',
  'expModal.selectModel': 'Select a model...',
  'expModal.nameLabel': 'Experiment Name',
  'expModal.nameHint': 'Auto-filled when selecting a model. Can be changed manually.',
  'expModal.namePlaceholder': 'Experiment_N',
  'expModal.creating': 'Creating...',
  'expModal.create': 'Create',
  'expModal.selectModelError': 'Please select a model!',
  'expModal.nameError': 'Please enter an experiment name!',
  'expModal.duplicateError': 'An experiment with this name already exists!',
  'expModal.createError': 'Error creating experiment',

  // New Model Modal
  'modelModal.title': 'Register New Model',
  'modelModal.nameLabel': 'Model Name',
  'modelModal.namePlaceholder': 'e.g. CV_model',
  'modelModal.framework': 'Library / Framework',
  'modelModal.selectFramework': 'Select a library...',
  'modelModal.artifactPath': 'Artifact Path',
  'modelModal.artifactHint': 'Specify the path to model weights storage.',
  'modelModal.stage': 'Initial Stage',
  'modelModal.description': 'Description',
  'modelModal.saving': 'Saving...',
  'modelModal.register': 'Register',
  'modelModal.nameError': 'Please enter a model name!',
  'modelModal.frameworkError': 'Please select a framework!',
  'modelModal.duplicateError': 'A model with this name already exists!',
  'modelModal.createError': 'Error creating model',

  // Dashboard
  'dashboard.title': 'Pipeline Overview',
  'dashboard.newExperiment': 'New Experiment',
  'dashboard.totalExperiments': 'Total Experiments',
  'dashboard.totalModels': 'Total Models',
  'dashboard.recentExperiments': 'Recent Experiments',
  'dashboard.allExperiments': 'All Experiments',
  'dashboard.deleteConfirm': 'Delete record?',

  // Experiments
  'experiments.title': 'Experiments',
  'experiments.filtersLabel': 'Experiment Filters',
  'experiments.searchLabel': 'Search by Name',
  'experiments.searchPlaceholder': 'e.g. ResNet or CV',
  'experiments.searchAriaLabel': 'Search experiment by name',
  'experiments.dateLabel': 'Creation Date',
  'experiments.datePlaceholder': 'dd.mm.yyyy',
  'experiments.dateAriaLabel': 'Filter by creation date',
  'experiments.metricLabel': 'Metric Value',
  'experiments.metricAriaLabel': 'Sort by metric value',
  'experiments.noSort': 'No sorting',
  'experiments.sortDesc': 'Descending',
  'experiments.sortAsc': 'Ascending',
  'experiments.apply': 'Apply',
  'experiments.tableLabel': 'Experiment List',
  'experiments.notFound': 'No experiments found',
  'experiments.deleteConfirm': 'Delete record?',

  // Experiment Details
  'expDetails.back': '← Back to list',
  'expDetails.started': 'Started:',
  'expDetails.metricsTab': 'Metrics',
  'expDetails.logsTab': 'Training Logs',
  'expDetails.artifactsTab': 'Files and Artifacts',
  'expDetails.usedModel': 'Model Used',
  'expDetails.chartTitle': 'Training Visualization',
  'expDetails.chartPlaceholder': 'Chart will be here',
  'expDetails.consoleLogs': 'Console Output',
  'expDetails.modelFiles': 'Model Files',
  'expDetails.downloadAll': 'Download All (.zip)',
  'expDetails.download': 'Download',
  'expDetails.view': 'View',
  'expDetails.loadError': 'Failed to load experiment data.',

  // Models
  'models.title': 'Model Registry',
  'models.register': 'Register Model',
  'models.description': 'Manage model versions and their statuses.',
  'models.searchSectionLabel': 'Model Search',
  'models.searchLabel': 'Search by Name',
  'models.searchPlaceholder': 'e.g. ResNet',
  'models.searchAriaLabel': 'Search model by name',
  'models.searchBtn': 'Search',
  'models.resetBtn': 'Reset',
  'models.resetAriaLabel': 'Clear search',
  'models.notFound': 'No models found',
  'models.lastUpdated': 'Last updated:',
  'models.unknown': 'Unknown',
  'models.showVersions': 'Show Versions',
  'models.hideVersions': 'Hide Versions',
  'models.versionCol': 'Version',
  'models.stageCol': 'Stage',
  'models.metricsCol': 'Metrics',
  'models.actionsCol': 'Actions',
  'models.noVersions': 'No versions found',
  'models.details': 'Details',
  'models.deleteConfirm': 'Are you sure you want to delete this model?',

  // Login
  'login.title': 'MLPipelines',
  'login.subtitle': 'Sign In',
  'login.email': 'Email',
  'login.emailPlaceholder': 'name@yandex.ru',
  'login.password': 'Password',
  'login.passwordPlaceholder': '********',
  'login.submit': 'Sign In',
  'login.loading': 'Signing in...',
  'login.noAccount': "Don't have an account?",
  'login.register': 'Sign Up',
  'login.invalidCredentials': 'Invalid email or password',

  // Register
  'register.title': 'MLPipelines',
  'register.subtitle': 'Sign Up',
  'register.name': 'Name',
  'register.email': 'Email',
  'register.password': 'Password',
  'register.submit': 'Sign Up',
  'register.loading': 'Signing up...',
  'register.hasAccount': 'Already have an account?',
  'register.login': 'Sign In',
  'register.emailExists': 'This email is already registered',
}

const dictionaries = { ru, en }
const locale = ref(localStorage.getItem('locale') || 'ru')

export function useLocale() {
  function t(key) {
    return dictionaries[locale.value]?.[key] ?? dictionaries.ru[key] ?? key
  }

  function setLocale(lang) {
    locale.value = lang
    localStorage.setItem('locale', lang)
  }

  return { locale, t, setLocale }
}
