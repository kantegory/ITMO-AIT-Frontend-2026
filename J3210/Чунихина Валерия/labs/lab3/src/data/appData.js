export const localUsers = [
  {
    id: '1',
    name: 'Валерия Чунихина',
    email: 'chunikhinaval@gmail.com',
    city: 'Санкт-Петербург'
  },
  {
    id: 'Kvh2BK6gcts',
    name: 'Эрнест Андреев',
    email: 'ernest@gmail.com',
    city: 'Москва'
  }
]

export const localInventory = [
  {
    id: '1',
    userId: 'Kvh2BK6gcts',
    name: 'Forest-Vision v2',
    slug: 'forest-vision-v2',
    type: 'model',
    task: 'Computer Vision',
    framework: 'PyTorch',
    license: 'MIT',
    size: '450 MB',
    stars: 1205,
    description: 'Анализ состояния лесов по спутниковым снимкам.'
  },
  {
    id: '2',
    userId: '7mVy544WgEw',
    name: 'Russian-GPT-Flora',
    slug: 'russian-gpt-flora',
    type: 'dataset',
    task: 'NLP',
    framework: 'Transformers',
    license: 'Apache 2.0',
    size: '1.2 GB',
    stars: 850,
    description: 'Датасет описаний растений для задач генерации текста.'
  },
  {
    id: '3',
    userId: 'Kvh2BK6gcts',
    name: 'Dataset-Botanical-Seeds',
    slug: 'dataset-botanical-seeds',
    type: 'dataset',
    task: 'Computer Vision',
    framework: 'PyTorch',
    license: 'CC BY 4.0',
    size: '450 MB',
    stars: 412,
    description: 'Набор данных для обучения моделей распознавания растений.'
  }
]

export const localSubscriptions = [
  {
    id: 'sub-1',
    name: 'Нейро-Ботаник',
    models: 42,
    label: 'Топ-1 месяца'
  },
  {
    id: 'sub-2',
    name: 'Eco Vision Lab',
    models: 17,
    label: 'Remote sensing'
  }
]

export const localDetails = {
  'forest-vision-v2': {
    title: 'Forest-Vision v2',
    emoji: '🌳',
    author: 'Нейро-Ботаник',
    updatedAt: 'Обновлено 2 дня назад',
    stars: 1205,
    forks: 240,
    downloadsLabel: 'Загрузить (450MB)',
    breadcrumbs: ['Поиск', 'Forest-Vision v2'],
    verification: [
      { label: 'Наличие исходного кода', value: '✔', tone: 'success' },
      { label: 'Окружение (Docker/Requirements)', value: '✔', tone: 'success' },
      { label: 'Доступность обучающих данных', value: '⚠ Частично', tone: 'warning' },
      { label: 'Совпадение метрик с заявленными', value: '✔ (99.2% совпадения)', tone: 'success' }
    ],
    description: [
      'Forest-Vision v2 — это глубокая нейронная сеть на базе архитектуры Vision Transformer (ViT), специально обученная для сегментации лесных массивов по спутниковым снимкам.',
      'Решение подходит для экологического мониторинга, анализа пожароопасности и оценки состояния лесных экосистем.'
    ],
    metrics: [
      { label: 'Accuracy', val: '96.4%', test: '95.1%', tone: 'success' },
      { label: 'F1-Score', val: '0.92', test: '0.90', tone: 'accent' },
      { label: 'Inference Time (ms)', val: '12.5 ms', test: '14.0 ms', tone: 'default' }
    ],
    codeSnippet: `import aibloom
from aibloom.models import ForestVision

model = ForestVision.from_pretrained("forest-vision-v2")
image = "satellite_forest_01.jpg"
prediction = model.predict(image)

print(prediction.labels)`,
    comments: [
      {
        id: 'c1',
        author: 'Алексей Иванов',
        timeLabel: '2 часа назад',
        text: 'Модель отлично работает на снимках хвойных лесов, но на лиственных точность чуть ниже.'
      }
    ],
    info: [
      { label: 'Фреймворк', value: 'PyTorch', badge: 'model' },
      { label: 'Лицензия', value: 'MIT License' },
      { label: 'Размер модели', value: '450 MB' },
      { label: 'Воспроизводимость', value: '● Проверено AIBloom', tone: 'success' }
    ]
  },
  'dataset-botanical-seeds': {
    title: 'Dataset-Botanical-Seeds',
    emoji: '🌱',
    author: 'Эрнест Андреев',
    updatedAt: 'Обновлено 1 неделю назад',
    stars: 412,
    forks: 81,
    downloadsLabel: 'Скачать (450MB)',
    breadcrumbs: ['Поиск', 'Dataset-Botanical-Seeds'],
    verification: [
      { label: 'Описание набора данных', value: '✔', tone: 'success' },
      { label: 'Классы и разметка', value: '✔', tone: 'success' },
      { label: 'Документация формата', value: '✔', tone: 'success' }
    ],
    description: [
      'Набор данных с изображениями семян и молодых растений для задач компьютерного зрения.',
      'Используется для обучения моделей классификации культур, видов растений и качества всходов.'
    ],
    metrics: [
      { label: 'Images', val: '24 000', test: '24 000', tone: 'default' },
      { label: 'Classes', val: '18', test: '18', tone: 'default' },
      { label: 'Formats', val: 'JPG / PNG', test: 'CSV labels', tone: 'default' }
    ],
    codeSnippet: `from datasets import load_dataset

dataset = load_dataset("aibloom/dataset-botanical-seeds")
print(dataset["train"][0])`,
    comments: [
      {
        id: 'c2',
        author: 'Data Curator',
        timeLabel: 'вчера',
        text: 'Удобный датасет для быстрых экспериментов в CV и визуализации ошибок модели.'
      }
    ],
    info: [
      { label: 'Тип', value: 'Dataset', badge: 'dataset' },
      { label: 'Лицензия', value: 'CC BY 4.0' },
      { label: 'Размер', value: '450 MB' }
    ]
  },
  'agrotext-insight': {
    title: 'AgroText Insight',
    emoji: '🌾',
    author: 'Валерия Чунихина',
    updatedAt: 'Обновлено 4 дня назад',
    stars: 530,
    forks: 97,
    downloadsLabel: 'Скачать (280MB)',
    breadcrumbs: ['Поиск', 'AgroText Insight'],
    verification: [
      { label: 'Описание датасета', value: '✔', tone: 'success' },
      { label: 'Примеры использования', value: '✔', tone: 'success' }
    ],
    description: [
      'Модель анализа текстовых описаний аграрных и экологических данных.',
      'Подходит для классификации отзывов, отчётов полевых наблюдений и коротких заметок.'
    ],
    metrics: [
      { label: 'Accuracy', val: '93.8%', test: '92.1%', tone: 'success' },
      { label: 'F1-Score', val: '0.89', test: '0.87', tone: 'accent' }
    ],
    codeSnippet: `from transformers import pipeline

clf = pipeline("text-classification", model="agrotext-insight")
print(clf("Почва влажная, урожайность высокая"))`,
    comments: [],
    info: [
      { label: 'Фреймворк', value: 'Transformers', badge: 'model' },
      { label: 'Лицензия', value: 'Apache 2.0' },
      { label: 'Размер модели', value: '280 MB' }
    ]
  }
}
