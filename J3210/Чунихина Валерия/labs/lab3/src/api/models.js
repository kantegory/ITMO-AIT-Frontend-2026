import { huggingFaceApi } from '@/api/http'

function buildFilterTags({ task, license, frameworks }) {
  const tags = []

  if (task) tags.push(task)
  if (license) tags.push(`license:${license}`)
  if (frameworks?.length) tags.push(...frameworks)

  return tags
}

export async function fetchModels({ search = '', task = '', license = '', frameworks = [], limit = 9 } = {}) {
  const filterTags = buildFilterTags({ task, license, frameworks })

  const { data } = await huggingFaceApi.get('', {
    params: {
      sort: 'downloads',
      direction: -1,
      limit,
      full: true,
      search: search || undefined,
      filter: filterTags.length ? filterTags.join(',') : undefined
    }
  })

  return data
}

export async function fetchTrendingModels(limit = 6) {
  const { data } = await huggingFaceApi.get('', {
    params: {
      sort: 'downloads',
      direction: -1,
      limit
    }
  })

  return data
}

export async function fetchModelById(modelId) {
  const { data } = await huggingFaceApi.get(`/${encodeURIComponent(modelId).replace('%2F', '/')}`)
  return data
}
