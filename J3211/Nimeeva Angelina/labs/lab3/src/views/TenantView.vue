<script setup>
import { ref, reactive } from 'vue'
import StatusBadge from '../components/StatusBadge.vue'
import { useAuth } from '../composables/useAuth.js'
import { useToast } from '../composables/useToast.js'

const { user } = useAuth()
const { showToast } = useToast()

const tenantName = user.value?.name || 'ООО «Северная линия»'
const tenantRoom = user.value?.room || '3.18'

const formatDate = (d = new Date()) =>
  new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)

const meterForm = reactive({ month: '', electricity: '', water: '', heating: '' })
const readings = ref([
  { month: 'Февраль 2026', electricity: '1484 кВт·ч', water: '32 м³', heating: '3.9 Гкал', status: 'accepted' },
  { month: 'Январь 2026', electricity: '1396 кВт·ч', water: '30 м³', heating: '4.4 Гкал', status: 'accepted' },
])
const submitMeter = () => {
  if (!meterForm.month) { showToast('Выберите месяц.'); return }
  readings.value.unshift({
    month: meterForm.month,
    electricity: meterForm.electricity + ' кВт·ч',
    water: meterForm.water + ' м³',
    heating: meterForm.heating + ' Гкал',
    status: 'pending',
  })
  Object.assign(meterForm, { month: '', electricity: '', water: '', heating: '' })
  showToast('Показания отправлены.')
}

const uploadType = ref('Заявка')
const uploadedDocs = ref([
  { name: 'Заявка на пропуск подрядчика.pdf', type: 'Заявка', date: '14.03.2026', status: 'pending' },
  { name: 'Акт оказанных услуг за февраль.pdf', type: 'Закрывающий документ', date: '03.03.2026', status: 'accepted' },
])
const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  if (!files.length) { showToast('Добавьте хотя бы один файл.'); return }
  files.forEach(f => {
    uploadedDocs.value.unshift({ name: f.name, type: uploadType.value, date: formatDate(), status: 'received' })
  })
  event.target.value = ''
  showToast('Документы отправлены.')
}

const signDocs = ref([
  { name: 'Допсоглашение № 3', deadline: '18.03.2026', status: 'pending', note: 'Размещено администрацией 13.03.2026' },
  { name: 'Акт сверки за март', deadline: '20.03.2026', status: 'pending', note: 'Нужно подписать до 20.03.2026' },
  { name: 'Счет на эксплуатационные расходы', deadline: '11.03.2026', status: 'signed', note: 'Подписан главным бухгалтером 11.03.2026' },
])
const signModal = reactive({ visible: false, docName: '', person: '', position: '', agree: false, index: -1 })

const openSign = (i) => {
  signModal.visible = true; signModal.docName = signDocs.value[i].name
  signModal.person = ''; signModal.position = ''; signModal.agree = false; signModal.index = i
}
const submitSign = () => {
  if (!signModal.agree) { showToast('Подтвердите электронное подписание.'); return }
  signDocs.value[signModal.index].status = 'signed'
  signDocs.value[signModal.index].note = 'Подписан ' + formatDate()
  signModal.visible = false
  showToast(`Документ «${signModal.docName}» подписан.`)
}
</script>

<template>
  <main class="container py-4 py-lg-5">
    <section class="hero-card mb-4">
      <div class="row g-4 align-items-end">
        <div class="col-lg-7">
          <span class="eyebrow">{{ tenantName }}</span>
          <h1>Помещение {{ tenantRoom }}</h1>
          <p class="section-text">Передайте показания, загрузите документы и подпишите файлы от администрации.</p>
        </div>
        <div class="col-lg-5">
          <div class="stat-grid">
            <div class="stat-card"><strong>25 марта</strong><span>крайний срок по показаниям</span></div>
            <div class="stat-card"><strong>{{ signDocs.filter(d => d.status === 'pending').length }}</strong><span>документа ждут подписи</span></div>
            <div class="stat-card"><strong>2</strong><span>счета лежат в архиве</span></div>
          </div>
        </div>
      </div>
    </section>

    <div class="row g-4">
      <div class="col-xl-8">
        <section class="page-card mb-4">
          <span class="eyebrow" style="color: var(--eyebrow-accent)">Показания</span>
          <h2 class="section-title">Передать счётчики</h2>
          <form class="row g-3 mt-1" @submit.prevent="submitMeter">
            <div class="col-md-6">
              <label class="form-label" for="meterMonth">Месяц</label>
              <select v-model="meterForm.month" class="form-select" id="meterMonth">
                <option value="">Выберите месяц</option>
                <option>Март 2026</option><option>Февраль 2026</option><option>Январь 2026</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label" for="electricityValue">Электроэнергия</label>
              <input v-model="meterForm.electricity" class="form-control" id="electricityValue" type="number" placeholder="1540" required />
            </div>
            <div class="col-md-6">
              <label class="form-label" for="waterValue">Вода</label>
              <input v-model="meterForm.water" class="form-control" id="waterValue" type="number" placeholder="36" required />
            </div>
            <div class="col-md-6">
              <label class="form-label" for="heatingValue">Тепло</label>
              <input v-model="meterForm.heating" class="form-control" id="heatingValue" type="number" step="0.01" placeholder="4.2" required />
            </div>
            <div class="col-12 pt-2">
              <button class="btn btn-brand" type="submit">Отправить показания</button>
            </div>
          </form>
          <div class="table-responsive mt-4">
            <table class="table data-table align-middle">
              <thead><tr><th>Месяц</th><th>Электроэнергия</th><th>Вода</th><th>Тепло</th><th>Статус</th></tr></thead>
              <tbody>
                <tr v-for="(r, i) in readings" :key="i">
                  <td>{{ r.month }}</td><td>{{ r.electricity }}</td><td>{{ r.water }}</td><td>{{ r.heating }}</td>
                  <td><StatusBadge :status="r.status === 'accepted' ? 'accepted' : 'pending'" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="page-card mb-4">
          <span class="eyebrow" style="color: var(--eyebrow-accent)">Документы</span>
          <h2 class="section-title">Загрузить файлы</h2>
          <div class="upload-zone">
            <div class="row g-3 align-items-end">
              <div class="col-lg-5">
                <label class="form-label" for="uploadType">Тип документа</label>
                <select v-model="uploadType" class="form-select" id="uploadType">
                  <option>Заявка</option><option>Письмо</option><option>Закрывающий документ</option><option>Акт</option>
                </select>
              </div>
              <div class="col-lg-7">
                <label class="form-label" for="uploadFiles">Файлы</label>
                <input class="form-control" id="uploadFiles" type="file" multiple @change="handleFileUpload" />
              </div>
            </div>
          </div>
          <div class="table-responsive mt-4">
            <table class="table data-table align-middle">
              <thead><tr><th>Документ</th><th>Тип</th><th>Дата</th><th>Статус</th></tr></thead>
              <tbody>
                <tr v-for="(d, i) in uploadedDocs" :key="i">
                  <td>{{ d.name }}</td><td>{{ d.type }}</td><td>{{ d.date }}</td>
                  <td><StatusBadge :status="d.status" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="page-card">
          <span class="eyebrow" style="color: var(--eyebrow-accent)">Подпись</span>
          <h2 class="section-title">Документы на подпись</h2>
          <div class="table-responsive mt-3">
            <table class="table data-table align-middle">
              <thead><tr><th>Документ</th><th>Срок</th><th>Статус</th><th>Действие</th></tr></thead>
              <tbody>
                <tr v-for="(d, i) in signDocs" :key="i">
                  <td>
                    <strong>{{ d.name }}</strong>
                    <div class="text-body-secondary small">{{ d.note }}</div>
                  </td>
                  <td>{{ d.deadline }}</td>
                  <td><StatusBadge :status="d.status === 'signed' ? 'accepted' : 'pending'" /></td>
                  <td>
                    <span v-if="d.status === 'signed'" class="text-body-secondary small">{{ d.note }}</span>
                    <button v-else class="btn btn-brand btn-sm" type="button" @click="openSign(i)">Подписать</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div class="col-xl-4">
        <section class="page-card mb-4">
          <span class="eyebrow" style="color: var(--eyebrow-accent)">Быстрый доступ</span>
          <h2 class="section-title">Что здесь есть</h2>
          <ul class="info-list mt-3">
            <li>Передача показаний в пару полей.</li>
            <li>Загрузка файлов без отдельного раздела.</li>
            <li>Переход в общий архив через поиск.</li>
          </ul>
          <RouterLink class="btn btn-outline-brand mt-3" to="/archive">Открыть архив</RouterLink>
        </section>
        <section class="page-card">
          <span class="eyebrow" style="color: var(--eyebrow-accent)">Контакты</span>
          <h2 class="section-title">Администрация</h2>
          <ul class="info-list mt-3">
            <li>Куратор: Мария Соловьёва, доб. 204</li>
            <li><a class="text-decoration-none" href="mailto:arenda@krnit.ru">arenda@krnit.ru</a></li>
            <li><a class="text-decoration-none" href="tel:+78126128734">+7 (812) 612-87-34</a></li>
          </ul>
        </section>
      </div>
    </div>
  </main>

  <template v-if="signModal.visible">
    <div class="modal-backdrop fade show"></div>
    <div class="modal d-block" tabindex="-1" @click.self="signModal.visible = false">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title fs-4">Электронная подпись</h2>
            <button class="btn-close" type="button" @click="signModal.visible = false" aria-label="Закрыть"></button>
          </div>
          <form @submit.prevent="submitSign">
            <div class="modal-body">
              <p class="mb-3">Документ: <strong>{{ signModal.docName }}</strong></p>
              <div class="mb-3">
                <label class="form-label" for="signPerson">ФИО</label>
                <input v-model="signModal.person" class="form-control" id="signPerson" type="text" placeholder="Анна Петрова" required />
              </div>
              <div class="mb-3">
                <label class="form-label" for="signPosition">Должность</label>
                <input v-model="signModal.position" class="form-control" id="signPosition" type="text" placeholder="Генеральный директор" required />
              </div>
              <div class="form-check">
                <input v-model="signModal.agree" class="form-check-input" id="signAgreement" type="checkbox" />
                <label class="form-check-label" for="signAgreement">Подтверждаю электронное подписание.</label>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-outline-brand" type="button" @click="signModal.visible = false">Отмена</button>
              <button class="btn btn-brand" type="submit">Подписать</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
</template>

