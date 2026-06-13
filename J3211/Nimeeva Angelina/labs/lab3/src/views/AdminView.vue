<script setup>
import { ref, reactive } from 'vue'
import StatusBadge from '../components/StatusBadge.vue'
import { useToast } from '../composables/useToast.js'

const { showToast } = useToast()

const formatDate = (d = new Date()) =>
  new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)

const readings = ref([
  { space: '3.18', tenant: 'ООО «Северная линия»', data: '1540 кВт·ч / 36 м³ / 4.2 Гкал', status: 'pending' },
  { space: '2.11', tenant: 'ИП Волкова',           data: '982 кВт·ч / 18 м³ / 2.1 Гкал',  status: 'pending' },
  { space: '4.07', tenant: 'ООО «Сфера»',           data: '1278 кВт·ч / 24 м³ / 3.6 Гкал', status: 'accepted' },
])
const confirmReading = (i) => {
  readings.value[i].status = 'accepted'
  showToast(`Показания для помещения ${readings.value[i].space} подтверждены.`)
}

const incomingDocs = ref([
  { title: 'Заявка на пропуск подрядчика.pdf', tenant: 'ООО «Северная линия»', status: 'review',    comment: 'Проверка службы эксплуатации.' },
  { title: 'Письмо по перепланировке.docx',   tenant: 'ООО «Сфера»',           status: 'received',  comment: 'Нужно согласование юриста.' },
  { title: 'Акт оказанных услуг за февраль.pdf', tenant: 'ИП Волкова',          status: 'accepted',  comment: 'Передано в бухгалтерию.' },
])
const processModal = reactive({ visible: false, docName: '', status: 'review', comment: '', index: -1 })

const openProcess = (i) => {
  processModal.visible = true
  processModal.docName = incomingDocs.value[i].title
  processModal.status = incomingDocs.value[i].status
  processModal.comment = incomingDocs.value[i].comment
  processModal.index = i
}
const submitProcess = () => {
  incomingDocs.value[processModal.index].status = processModal.status
  incomingDocs.value[processModal.index].comment = processModal.comment
  processModal.visible = false
  showToast('Статус документа обновлён.')
}

const publishForm = reactive({ tenant: '', type: '', deadline: '' })
const outbox = ref([
  { label: 'Счет за март.pdf', detail: 'Отправлено для ООО «Северная линия» 12.03.2026.' },
  { label: 'Допсоглашение № 3.pdf', detail: 'Ожидает подписи арендатора до 18.03.2026.' },
])
const publishFile = ref(null)

const handlePublishFile = (e) => { publishFile.value = e.target.files[0] || null }

const submitPublish = () => {
  if (!publishForm.tenant || !publishForm.type || !publishFile.value) {
    showToast('Заполните арендатора, тип и файл.'); return
  }
  outbox.value.unshift({
    label: `${publishForm.type}: ${publishFile.value.name}`,
    detail: `Отправлено для ${publishForm.tenant} только что.`,
  })
  Object.assign(publishForm, { tenant: '', type: '', deadline: '' })
  publishFile.value = null
  showToast('Документ отправлен в кабинет арендатора.')
}
</script>

<template>
  <main class="container py-4 py-lg-5">
    <section class="hero-card mb-4">
      <div class="row g-4 align-items-end">
        <div class="col-lg-7">
          <span class="eyebrow">Администрация</span>
          <h1>Работа с арендаторами и документами</h1>
          <p class="section-text">Проверьте показания, обработайте входящие документы и отправьте файл арендатору.</p>
        </div>
        <div class="col-lg-5">
          <div class="stat-grid">
            <div class="stat-card"><strong>{{ readings.filter(r => r.status === 'pending').length }}</strong><span>показаний на проверке</span></div>
            <div class="stat-card"><strong>{{ incomingDocs.length }}</strong><span>входящих документов</span></div>
            <div class="stat-card"><strong>3</strong><span>помещения в резерве</span></div>
          </div>
        </div>
      </div>
    </section>

    <div class="row g-4">
      <div class="col-xl-8">
        <section class="page-card mb-4">
          <span class="eyebrow" style="color: var(--eyebrow-accent)">Показания</span>
          <h2 class="section-title">Проверка счётчиков</h2>
          <div class="table-responsive mt-3">
            <table class="table data-table align-middle">
              <thead><tr><th>Помещение</th><th>Арендатор</th><th>Показания</th><th>Статус</th><th>Действие</th></tr></thead>
              <tbody>
                <tr v-for="(r, i) in readings" :key="i">
                  <td>{{ r.space }}</td>
                  <td>{{ r.tenant }}</td>
                  <td>{{ r.data }}</td>
                  <td><StatusBadge :status="r.status === 'accepted' ? 'accepted' : 'pending'" /></td>
                  <td>
                    <button
                      class="btn btn-sm"
                      :class="r.status === 'accepted' ? 'btn-outline-brand' : 'btn-brand'"
                      :disabled="r.status === 'accepted'"
                      @click="confirmReading(i)"
                    >{{ r.status === 'accepted' ? 'Готово' : 'Проверить' }}</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="page-card mb-4">
          <span class="eyebrow" style="color: var(--eyebrow-accent)">Входящие</span>
          <h2 class="section-title">Документы от арендаторов</h2>
          <div class="table-responsive mt-3">
            <table class="table data-table align-middle">
              <thead><tr><th>Документ</th><th>Арендатор</th><th>Статус</th><th>Комментарий</th><th>Действие</th></tr></thead>
              <tbody>
                <tr v-for="(d, i) in incomingDocs" :key="i">
                  <td>{{ d.title }}</td>
                  <td>{{ d.tenant }}</td>
                  <td><StatusBadge :status="d.status" /></td>
                  <td class="text-body-secondary small">{{ d.comment }}</td>
                  <td>
                    <button class="btn btn-brand btn-sm" type="button" @click="openProcess(i)">Обработать</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="page-card">
          <span class="eyebrow" style="color: var(--eyebrow-accent)">Исходящие</span>
          <h2 class="section-title">Отправить документ арендатору</h2>
          <form class="row g-3 mt-1" @submit.prevent="submitPublish">
            <div class="col-md-4">
              <label class="form-label" for="publishTenant">Арендатор</label>
              <select v-model="publishForm.tenant" class="form-select" id="publishTenant" required>
                <option value="">Выберите арендатора</option>
                <option>ООО «Северная линия»</option>
                <option>ООО «Сфера»</option>
                <option>ИП Волкова</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label" for="publishType">Тип документа</label>
              <select v-model="publishForm.type" class="form-select" id="publishType" required>
                <option value="">Выберите тип</option>
                <option>Счет</option><option>Договор</option><option>Допсоглашение</option><option>Акт</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label" for="publishDeadline">Срок подписи</label>
              <input v-model="publishForm.deadline" class="form-control" id="publishDeadline" type="date" />
            </div>
            <div class="col-md-8">
              <label class="form-label" for="publishFile">Файл</label>
              <input class="form-control" id="publishFile" type="file" required @change="handlePublishFile" />
            </div>
            <div class="col-md-4 d-flex align-items-end">
              <button class="btn btn-brand w-100" type="submit">Отправить</button>
            </div>
          </form>
          <div class="page-card compact mt-4">
            <span class="eyebrow" style="color: var(--eyebrow-accent)">Последние отправки</span>
            <ul class="outbox-list mb-0">
              <li v-for="(item, i) in outbox" :key="i">
                <strong>{{ item.label }}</strong>
                <span>{{ item.detail }}</span>
              </li>
            </ul>
          </div>
        </section>
      </div>

      <div class="col-xl-4">
        <section class="page-card mb-4">
          <span class="eyebrow" style="color: var(--eyebrow-accent)">Сводка</span>
          <h2 class="section-title">Коротко по дню</h2>
          <ul class="info-list mt-3">
            <li>5 документов ждут подписи.</li>
            <li>4 помещения есть в публичном каталоге.</li>
            <li>3 новых заявки на просмотр за неделю.</li>
          </ul>
          <RouterLink class="btn btn-outline-brand mt-3" to="/search">Открыть витрину помещений</RouterLink>
        </section>
        <section class="page-card">
          <span class="eyebrow" style="color: var(--eyebrow-accent)">Контакты</span>
          <h2 class="section-title">Отделы</h2>
          <ul class="info-list mt-3">
            <li>Юристы: legal@krnit.ru</li>
            <li>Бухгалтерия: finance@krnit.ru</li>
            <li>Приёмная: +7 (812) 612-87-34</li>
          </ul>
        </section>
      </div>
    </div>
  </main>

  <template v-if="processModal.visible">
    <div class="modal-backdrop fade show"></div>
    <div class="modal d-block" tabindex="-1" @click.self="processModal.visible = false">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title fs-4">Обработка документа</h2>
            <button class="btn-close" type="button" @click="processModal.visible = false" aria-label="Закрыть"></button>
          </div>
          <form @submit.prevent="submitProcess">
            <div class="modal-body">
              <p class="mb-3">Документ: <strong>{{ processModal.docName }}</strong></p>
              <div class="mb-3">
                <label class="form-label" for="processStatus">Статус</label>
                <select v-model="processModal.status" class="form-select" id="processStatus">
                  <option value="received">Получено</option>
                  <option value="review">На проверке</option>
                  <option value="accepted">Принято</option>
                  <option value="rejected">Отклонено</option>
                </select>
              </div>
              <div>
                <label class="form-label" for="processComment">Комментарий</label>
                <textarea v-model="processModal.comment" class="form-control" id="processComment" rows="3" placeholder="Например: приложите подписанную версию"></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-outline-brand" type="button" @click="processModal.visible = false">Отмена</button>
              <button class="btn btn-brand" type="submit">Сохранить</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
</template>

