<template>
  <div class="bg-light min-vh-100">
    <AppNavbar />
    <main class="container-fluid" id="main-content">
      <div class="row" v-if="workspace">
        <!-- Сайдбар -->
        <aside class="col-md-2 border-end bg-white min-vh-100" aria-label="Информация о пространстве">
          <div class="p-3">
            <div class="small text-muted mb-1">Workspace</div>
            <h1 class="h6 mb-0">{{ workspace.name }}</h1>
            <div v-if="workspace.description" class="small text-muted mt-1">{{ workspace.description }}</div>
            <span class="badge bg-secondary text-capitalize mt-2">{{ workspace.type }}</span>
          </div>
        </aside>

        <!-- Редактор -->
        <div class="col-md-10">
          <section class="p-3">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h2 class="h5 mb-0">Редактор графа</h2>
              <div>
                <button class="btn btn-sm btn-outline-secondary me-2" @click="saveGraph" :disabled="running">Сохранить</button>
                <button class="btn btn-sm btn-primary" @click="runGraph" :disabled="running">
                  {{ running ? '⏳ Выполняется...' : '▶ Запустить' }}
                </button>
              </div>
            </div>

            <p class="small text-muted mb-2">Добавляйте узлы через палитру и соединяйте их.</p>
            <div id="graph-area" ref="graphEl" class="border rounded"
              style="height:420px;position:relative;" role="region" aria-label="Граф"></div>

            <!-- Палитра узлов -->
            <section class="mt-3">
              <h3 class="h6 small text-muted mb-2">Палитра узлов</h3>
              <div class="d-flex gap-2 flex-wrap">
                <button v-for="n in nodeTypes" :key="n.type"
                  class="btn btn-sm btn-outline-secondary"
                  @click="addNode(n.type)">
                  {{ n.label }}
                </button>
              </div>
            </section>

            <!-- Лог выполнения -->
            <section class="mt-3" v-if="logs.length || running">
              <h3 class="h6 small text-muted mb-2">Лог выполнения</h3>
              <div class="border rounded p-3 small font-monospace"
                style="background:var(--n3n-surface);max-height:220px;overflow-y:auto;" ref="logBox">
                <div v-for="(line, i) in logs" :key="i" :class="line.type === 'error' ? 'text-danger' : line.type === 'success' ? 'text-success' : ''">
                  <span class="text-muted">{{ line.time }}</span> {{ line.text }}
                </div>
                <div v-if="running" class="text-muted">
                  <span class="spinner-border spinner-border-sm me-1"></span> Выполняется...
                </div>
              </div>
            </section>

          </section>
        </div>
      </div>

      <div v-else-if="loading" class="p-5 text-muted text-center">Загрузка...</div>
      <div v-else class="p-5 text-danger text-center">Пространство не найдено</div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'
import { getWorkspaceById, updateWorkspace } from '@/api/workspaces'

const route = useRoute()
const workspace = ref(null)
const loading = ref(true)
const graphEl = ref(null)
const logBox = ref(null)
const logs = ref([])
const running = ref(false)
let editor = null

// ─── Типы узлов ───
const nodeTypes = [
  { type: 'weather',   label: 'Погода СПб' },
  { type: 'currency',  label: 'Курсы валют' },
  { type: 'steam',     label: 'Hacker News' },
  { type: 'transform', label: 'LLM' },
  { type: 'log',       label: 'Лог' },
]

// ─── Загрузка воркспейса ───
onMounted(async () => {
  try {
    const { data } = await getWorkspaceById(route.params.id)
    workspace.value = data
    await initDrawflow(data.graph)
  } catch {
    workspace.value = null
  } finally {
    loading.value = false
  }
})

// ─── Инициализация Drawflow ───
async function initDrawflow(graph) {
  const { default: Drawflow } = await import('drawflow')
  await import('drawflow/dist/drawflow.min.css')
  editor = new Drawflow(graphEl.value)
  editor.reroute = true
  editor.start()

  if (graph && Object.keys(graph).length > 0) {
    editor.import(graph)
  } else {
    // Дефолтный граф: Погода -> LLM -> Лог
    editor.addNode('weather',   0, 1, 60,  180, 'weather',   {}, nodeHtml('weather'))
    editor.addNode('transform', 1, 1, 320, 180, 'transform', {}, nodeHtml('transform'))
    editor.addNode('log',       1, 0, 580, 180, 'log',       {}, nodeHtml('log'))
    editor.addConnection(1, 2, 'output_1', 'input_1')
    editor.addConnection(2, 3, 'output_1', 'input_1')
  }
}

function nodeHtml(type) {
  const labels = {
    weather:   'Погода СПб',
    currency:  'Курсы валют',
    steam:     'Hacker News',
    transform: 'LLM',
    log:       'Лог',
  }
  return `<div style="padding:6px 10px;font-size:13px;">${labels[type] || type}</div>`
}

// ─── Добавление узла ───
function addNode(type) {
  if (!editor) return
  const rect = graphEl.value.getBoundingClientRect()
  const posX = editor.precanvas.scrollLeft + rect.width / 2 - 80
  const posY = editor.precanvas.scrollTop + rect.height / 2 - 40
  const isSource = ['weather', 'currency', 'steam'].includes(type)
  const isSink   = type === 'log'
  editor.addNode(type, isSource ? 0 : 1, isSink ? 0 : 1, posX, posY, type, {}, nodeHtml(type))
}

// ─── Сохранение ───
async function saveGraph() {
  if (!editor) return
  await updateWorkspace(route.params.id, { graph: editor.export() })
  addLog('✅ Граф сохранён', 'success')
}

// ─── Запуск графа ───
async function runGraph() {
  if (!editor || running.value) return
  logs.value = []
  running.value = true

  try {
    const exported = editor.export()
    const nodes = exported?.drawflow?.Home?.data
    if (!nodes || !Object.keys(nodes).length) {
      addLog('⚠️ Граф пустой', 'error')
      running.value = false
      return
    }

    // Топологический порядок: сначала узлы без входящих связей
    const order = topoSort(nodes)
    let context = {}

    for (const nodeId of order) {
      const node = nodes[nodeId]
      await delay(400)
      context = await executeNode(node, context)
    }

    addLog('✅ Выполнение завершено', 'success')
  } catch (e) {
    addLog(`❌ Ошибка: ${e.message}`, 'error')
  } finally {
    running.value = false
  }
}

// ─── Топологическая сортировка ───
function topoSort(nodes) {
  const inDegree = {}
  const adj = {}

  for (const id of Object.keys(nodes)) {
    inDegree[id] = 0
    adj[id] = []
  }

  for (const [id, node] of Object.entries(nodes)) {
    for (const out of Object.values(node.outputs || {})) {
      for (const conn of out.connections || []) {
        adj[id].push(conn.node)
        inDegree[conn.node] = (inDegree[conn.node] || 0) + 1
      }
    }
  }

  const queue = Object.keys(nodes).filter(id => inDegree[id] === 0)
  const result = []

  while (queue.length) {
    const cur = queue.shift()
    result.push(cur)
    for (const next of adj[cur] || []) {
      inDegree[next]--
      if (inDegree[next] === 0) queue.push(next)
    }
  }

  return result
}

// ─── Выполнение узла ───
async function executeNode(node, context) {
  const type = node.name

  if (type === 'weather') {
  addLog('Погода СПб: запрос к wttr.in...')
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000) // 5 сек макс
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=59.95&longitude=30.32&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code')
    const data = await res.json()
    const c = data.current
    const result = `🌡 ${c.temperature_2m}°C, 💧 ${c.relative_humidity_2m}%, 💨 ${c.wind_speed_10m} км/ч`
    addLog(`   ${result}`, 'success')
    return { ...context, weather: result }
  } catch (e) {
    const msg = e.name === 'AbortError' ? 'таймаут (>5с)' : e.message
    addLog(`   ⚠️ wttr.in недоступен: ${msg} - используем кэш`, 'error')
    return { ...context, weather: '🌡 Данные временно недоступны' }
  }
}

  if (type === 'currency') {
    addLog('Курсы валют: запрос к open.er-api.com...')
    const res = await fetch('https://open.er-api.com/v6/latest/RUB')
    const data = await res.json()
    const usd = (1 / data.rates.USD).toFixed(2)
    const cny = (1 / data.rates.CNY).toFixed(2)
    const kzt = (1 / data.rates.KZT).toFixed(4)
    const result = `USD: ${usd}₽  |  CNY: ${cny}₽  |  KZT: ${kzt}₽`
    addLog(`${result}`, 'success')
    return { ...context, currency: result }
  }

  if (type === 'steam') {
    addLog('Hacker News: загрузка топ-5 постов...')
    const topRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
    const ids = await topRes.json()
    const top5 = ids.slice(0, 5)
    const stories = await Promise.all(
        top5.map(id => fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json()))
    )
    const result = stories.map((s, i) => `${i + 1}. ${s.title} (${s.score} pts)`).join('\n')
    addLog(`   Загружено ${stories.length} постов`, 'success')
    stories.forEach((s, i) => addLog(`   ${i + 1}. ${s.title} — ${s.score} pts`, 'success'))
    return { ...context, steam: result }
  }

  if (type === 'transform') {
    addLog('LLM: форматирование данных...')
    const parts = []
    if (context.weather)  parts.push(`Погода: ${context.weather}`)
    if (context.currency) parts.push(`Курсы: ${context.currency}`)
    if (context.steam)    parts.push(`Steam: ${context.steam}`)
    const result = parts.length ? parts.join('\n') : '(нет входных данных)'
    addLog(`   Сформировано ${parts.length} блок(а) данных`, 'success')
    return { ...context, output: result }
  }

  if (type === 'log') {
    addLog('Лог: вывод результата')
    const output = context.output
      || [context.weather, context.currency, context.steam].filter(Boolean).join('\n')
      || '(нет данных)'
    output.split('\n').forEach(line => addLog(`   ${line}`, 'success'))
    return context
  }

  addLog(`Узел "${type}" пропущен (нет обработчика)`)
  return context
}

// ─── Вспомогательные ───
function addLog(text, type = 'info') {
  const now = new Date()
  const time = `[${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}]`
  logs.value.push({ time, text, type })
  nextTick(() => {
    if (logBox.value) logBox.value.scrollTop = logBox.value.scrollHeight
  })
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
</script>