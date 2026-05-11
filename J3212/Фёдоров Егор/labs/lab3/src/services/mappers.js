export function mapModel(item) {
  return {
    id: item.id,
    title: item.id,
    author: item.author || item.id?.split('/')[0] || 'unknown',
    description: item.description || item.cardData?.summary || 'Описание отсутствует.',
    tags: Array.isArray(item.tags) ? item.tags.slice(0, 8) : [],
    pipelineTag: item.pipeline_tag || item.pipelineTag || 'Model',
    downloads: item.downloads || 0,
    likes: item.likes || 0,
    updatedAt: item.lastModified || '',
    license: item.cardData?.license || item.license || '—',
    source: 'huggingface',
    resourceType: 'model',
  }
}

export function mapDataset(item) {
  return {
    id: item.id,
    title: item.id,
    author: item.author || item.id?.split('/')[0] || 'unknown',
    description: item.description || item.cardData?.summary || 'Описание отсутствует.',
    tags: Array.isArray(item.tags) ? item.tags.slice(0, 8) : [],
    taskCategories: item.cardData?.task_categories || [],
    downloads: item.downloads || 0,
    likes: item.likes || 0,
    updatedAt: item.lastModified || '',
    license: item.cardData?.license || item.license || '—',
    source: 'huggingface',
    resourceType: 'dataset',
  }
}
