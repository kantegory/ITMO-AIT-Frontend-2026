<template>
  <base-layout>
    <div class="text-start"> 
      <h2 class="text-cold-beige mb-4 fw-bold">Платежные аккаунты</h2>

      <div class="row g-4">
        <div class="col-lg-7">
          <div class="widget-card border-blue p-4">
            <h3 class="text-cold-beige mb-4 h5">Активные интеграции</h3>
            
            <div id="accountsList">
              <div v-for="bank in banks" :key="bank.id" class="bank-item d-flex justify-content-between align-items-center mb-3 p-3">
                <div class="d-flex align-items-center">
                  <div class="icon-circle me-3">
                    <svg class="icon-svg" style="font-size: 1.5rem;"><use href="#icon-bank"></use></svg>
                  </div>
                  <div>
                    <div class="fw-bold">{{ bank.name }}</div>
                    <div class="small text-success">{{ bank.status }}</div>
                  </div>
                </div>
                <button class="btn btn-outline-danger btn-sm px-3" @click="removeBank(bank.id)">Отключить</button>
              </div>
              <p v-if="banks.length === 0" class="text-muted text-center py-3">Нет активных подключений</p>
            </div>

            <button class="btn-widget mt-3 w-auto px-4 d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#addBankModal">
              <svg class="icon-svg me-2"><use href="#icon-plus"></use></svg>
              Добавить банк
            </button>
          </div>

          <div class="widget-card border-indigo mt-4 p-4">
            <h3 class="text-cold-beige mb-3 h5">Автоматические правила</h3>
            <div class="table-responsive">
              <table class="table m-0">
                <thead>
                  <tr>
                    <th>Если содержит</th>
                    <th>Категория</th>
                    <th class="text-end">Удалить</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(rule, index) in rules" :key="index">
                    <td class="py-3">{{ rule.keyword }}</td>
                    <td class="py-3">{{ rule.category }}</td>
                    <td class="text-end py-3">
                      <button class="btn btn-link text-danger p-0" @click="rules.splice(index, 1)">❌</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button class="btn-widget mt-3 d-flex align-items-center justify-content-center" data-bs-toggle="modal" data-bs-target="#addRuleModal">
              <svg class="icon-svg me-2"><use href="#icon-plus"></use></svg>Добавить правило
            </button>
          </div>
        </div>

        <div class="col-lg-5">
          <div class="widget-card border-gold h-100 p-4 d-flex flex-column">
            <h3 class="text-cold-beige mb-3 h5">Импорт транзакций</h3>
            <div class="upload-zone border border-dashed border-secondary rounded p-5 text-center my-auto" style="border-style: dashed !important; cursor: pointer">
              <svg class="icon-svg mb-3" style="font-size: 3rem;"><use href="#icon-upload"></use></svg>
              <p class="m-0 text-secondary">Перетащите файл выписки сюда или нажмите для выбора</p>
            </div>
            <button class="btn-custom mt-4" @click="startImport">Начать импорт</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="addBankModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-secondary">
          <div class="modal-header border-secondary"><h5 class="modal-title">Выберите банк</h5><button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button></div>
          <div class="modal-body p-0">
            <div class="list-group list-group-flush">
              <button v-for="b in availableBanks" :key="b" @click="addBank(b)" class="list-group-item list-group-item-action bg-transparent border-secondary py-3 text-start" data-bs-dismiss="modal">
                {{ b }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="addRuleModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-secondary p-3">
          <div class="modal-header border-secondary"><h5 class="modal-title">Новое правило</h5><button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button></div>
          <div class="modal-body text-start">
            <label class="small text-muted mb-2">Название сервиса или ключевое слово</label>
            <input type="text" v-model="newRule.keyword" class="custom-input mb-4" placeholder="Например: Netflix">
            <label class="small text-muted mb-2">Назначить категорию</label>
            <select v-model="newRule.category" class="custom-input">
              <option>Продукты</option><option>Транспорт</option><option>Развлечения</option><option>Подписки</option>
            </select>
            <button class="btn-custom mt-4" @click="saveRule" data-bs-dismiss="modal">Сохранить правило</button>
          </div>
        </div>
      </div>
    </div>
  </base-layout>
</template>

<script setup>
import BaseLayout from '../layouts/BaseLayout.vue'
import { ref } from 'vue'

const banks = ref([
    { id: 1, name: 'Т-Банк', status: 'Синхронизировано' },
    { id: 2, name: 'Альфа-Банк', status: 'Подключено' }
])

const rules = ref([
    { keyword: 'Yandex Go / Uber', category: 'Транспорт' },
    { keyword: 'VkusVill', category: 'Продукты' }
])

const availableBanks = ['Сбербанк', 'ВТБ', 'Газпромбанк', 'Райффайзен', 'Почта Банк']
const newRule = ref({ keyword: '', category: 'Подписки' })

const addBank = (name) => {
  banks.value.push({ id: Date.now(), name, status: 'Подключено' })
}

const removeBank = (id) => {
  if(confirm('Отключить интеграцию с этим банком?')) {
    banks.value = banks.value.filter(b => b.id !== id)
  }
}

const saveRule = () => {
  if(newRule.value.keyword) {
    rules.value.push({ ...newRule.value })
    newRule.value.keyword = ''
  }
}

const startImport = () => alert('Файл принят. Начинаем импорт транзакций...')
</script>

<style scoped>
.bank-item {
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: transform 0.2s;
}
.bank-item:hover { transform: translateY(-2px); border-color: var(--gold-accent); }
</style>