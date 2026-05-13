import { ref, reactive } from 'vue'

export function useChapters() {
  const chapters = ref([])
  const currentChapterIndex = ref(0)

  function initChapters(existingChapters = null) {
    if (existingChapters && existingChapters.length > 0) {
      chapters.value = existingChapters.map((ch, idx) => ({
        id: idx,
        title: ch.title || `Глава ${idx + 1}`,
        content: ch.content || ''
      }))
      currentChapterIndex.value = 0
    } else {
      chapters.value = [{
        id: 0,
        title: 'Глава 1',
        content: ''
      }]
      currentChapterIndex.value = 0
    }
  }

  function addChapter() {
    const newId = chapters.value.length
    chapters.value.push({
      id: newId,
      title: `Глава ${newId + 1}`,
      content: ''
    })
    currentChapterIndex.value = newId
  }

  function removeChapter(index) {
    if (chapters.value.length <= 1) {
      return { success: false, error: 'Нельзя удалить единственную главу' }
    }
    
    chapters.value.splice(index, 1)
    
    if (currentChapterIndex.value >= chapters.value.length) {
      currentChapterIndex.value = chapters.value.length - 1
    }
    
    return { success: true }
  }

  function switchChapter(index) {
    if (index >= 0 && index < chapters.value.length) {
      currentChapterIndex.value = index
    }
  }

  function formatText(chapterIndex, textareaRef, type) {
    const textarea = textareaRef
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    let selectedText = text.substring(start, end)
    let formattedText = ''

    switch (type) {
      case 'bold':
        formattedText = `**${selectedText}**`
        break
      case 'italic':
        formattedText = `*${selectedText}*`
        break
      case 'heading':
        formattedText = `\n<h2>${selectedText || 'Название главы'}</h2>\n`
        break
    }

    const newText = text.substring(0, start) + formattedText + text.substring(end)
    textarea.value = newText
  }

  function parseContentToChapters(htmlContent) {
    const result = []
    const h2Regex = /<h2>(.*?)<\/h2>/g
    const titles = []
    let match

    while ((match = h2Regex.exec(htmlContent)) !== null) {
      titles.push(match[1])
    }

    if (titles.length === 0) {
      let content = htmlContent
        .replace(/<br\s*\/?>/g, '\n')
        .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
        .replace(/<em>(.*?)<\/em>/g, '*$1*')
        .replace(/<[^>]*>/g, '')

      result.push({ title: 'Глава 1', content })
    } else {
      let currentPos = 0

      for (let i = 0; i < titles.length; i++) {
        const titlePattern = new RegExp(
          `<h2>${escapeRegex(titles[i])}<\\/h2>`, 'i'
        )
        const matchObj = titlePattern.exec(htmlContent.substring(currentPos))

        if (matchObj) {
          const startPos = currentPos + matchObj.index + matchObj[0].length
          const endPos = i < titles.length - 1
            ? currentPos + htmlContent.substring(currentPos).search(
                new RegExp(`<h2>${escapeRegex(titles[i + 1])}<\\/h2>`, 'i')
              )
            : htmlContent.length

          let content = htmlContent
            .substring(startPos, endPos)
            .replace(/<br\s*\/?>/g, '\n')
            .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
            .replace(/<em>(.*?)<\/em>/g, '*$1*')
            .replace(/<[^>]*>/g, '')
            .trim()

          result.push({ title: titles[i], content })
          currentPos = endPos
        }
      }
    }

    return result
  }

  function buildFullContent() {
    let fullContent = ''

    chapters.value.forEach((chapter) => {
      if (chapter.content.trim()) {
        fullContent += `<h2>${escapeHtml(chapter.title)}</h2>\n`
        
        let formattedContent = chapter.content
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/\n/g, '<br>')
        
        fullContent += formattedContent
        fullContent += '\n\n'
      }
    })

    return fullContent
  }

  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  function escapeHtml(str) {
    if (!str) return ''
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
  }

  return {
    chapters,
    currentChapterIndex,
    initChapters,
    addChapter,
    removeChapter,
    switchChapter,
    formatText,
    parseContentToChapters,
    buildFullContent
  }
}