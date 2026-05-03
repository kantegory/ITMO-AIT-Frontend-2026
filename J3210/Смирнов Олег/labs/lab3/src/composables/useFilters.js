import { ref, computed, unref } from 'vue';

export function useFilters(items, tagFields) {
  const query = ref('');
  const sort = ref('');
  const activeTags = ref(new Set());

  function toggleTag(tag) {
    const next = new Set(activeTags.value);
    if (next.has(tag)) next.delete(tag);
    else next.add(tag);
    activeTags.value = next;
  }

  function clearFilters() {
    query.value = '';
    sort.value = '';
    activeTags.value = new Set();
  }

  const availableTags = computed(() => {
    const fields = unref(tagFields);
    const set = new Set();
    for (const item of items.value) {
      for (const field of fields) {
        if (item[field]) set.add(item[field]);
      }
    }
    return [...set];
  });

  const filteredItems = computed(() => {
    const q = query.value.trim().toLowerCase();
    const tags = activeTags.value;
    const fields = unref(tagFields);

    let result = items.value.filter((item) => {
      const matchQuery =
        !q ||
        (item.slug && item.slug.toLowerCase().includes(q)) ||
        (item.task && item.task.toLowerCase().includes(q)) ||
        (item.author && item.author.toLowerCase().includes(q));
      const matchTags =
        tags.size === 0 ||
        fields.some((field) => item[field] && tags.has(item[field]));
      return matchQuery && matchTags;
    });

    if (sort.value === 'stars') {
      result = [...result].sort((a, b) => b.stars - a.stars);
    } else if (sort.value === 'downloads') {
      result = [...result].sort((a, b) => b.downloads - a.downloads);
    }

    return result;
  });

  return {
    query,
    sort,
    activeTags,
    toggleTag,
    clearFilters,
    availableTags,
    filteredItems,
  };
}
