export function getSubjectName(subject) {
  const map = {
    'deep-learning': 'Deep Learning',
    'nlp': 'NLP',
    'cv': 'Computer Vision',
    'rl': 'RL',
    'gen-ai': 'Gen AI',
    'ml-basics': 'Основы ML'
  }
  return map[subject] || subject
}

export function getSubjectIcon(subject) {
  const map = {
    'deep-learning': 'icon-network-wired',
    'nlp': 'icon-comments',
    'cv': 'icon-eye',
    'rl': 'icon-gamepad',
    'gen-ai': 'icon-wand-magic-sparkles',
    'ml-basics': 'icon-seedling'
  }
  return map[subject] || 'icon-book'
}

export function getSubjectBadgeClass(subject) {
  const map = {
    'deep-learning': 'tag-deep',
    'nlp': 'tag-nlp',
    'cv': 'tag-cv',
    'rl': 'tag-rl',
    'gen-ai': 'tag-gen',
    'ml-basics': 'bg-secondary'
  }
  return map[subject] || 'bg-secondary'
}
