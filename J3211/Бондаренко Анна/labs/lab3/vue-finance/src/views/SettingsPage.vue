<template>
  <BaseLayout>
    <div class="container">
      <div class="row">
        <div class="col-md-5">
          <div class="dashboard-block h-100">
            <h2 class="block-title">&gt; КОНФИГУРАЦИЯ_СИСТЕМЫ</h2>

            <div class="mb-4">
              <p style="font-size: 11px; color: var(--accent-color);">[ 1 ] ИМПОРТ_ТРАНЗАКЦИЙ</p>
              <input type="file" ref="fileInput" @change="handleCsvUpload" accept=".csv" style="display: none;"
                     id="csvFile">
              <button class="terminal-btn w-100" @click="$refs.fileInput.click()">[ ЗАГРУЗИТЬ_CSV ]</button>
            </div>

            <hr>

            <div class="mb-4">
              <label for="newCatInput"
                     style="font-size: 11px; color: var(--accent-color); display: block; margin-bottom: 5px;">[ 2 ]
                НОВАЯ_КАТЕГОРИЯ</label>
              <form @submit.prevent="addCategory" class="category-row d-flex gap-2">
                <input type="text" id="newCatInput" v-model="newCatName" class="terminal-input"
                       placeholder="ПУТЕШЕСТВИЕ">
                <button type="submit" class="terminal-btn btn-inline" style="margin-top:0">[ + ]</button>
              </form>
            </div>

            <hr>

            <div>
              <p style="font-size: 11px; color: var(--accent-color);">[ 3 ] ПРАВИЛО_АВТОМАТИЗАЦИИ</p>
              <form @submit.prevent="addRule">
                <div class="input-group mb-2">
                  <label class="input-prefix" for="ruleKeyword" style="font-size: 11px;">ЕСЛИ:</label>
                  <input type="text" id="ruleKeyword" v-model="ruleForm.keyword" class="terminal-input"
                         placeholder="КЛЮЧЕВОЕ_СЛОВО">
                </div>
                <div class="input-group mb-3">
                  <label class="input-prefix" for="ruleCategory" style="font-size: 11px;">ТО:</label>
                  <select id="ruleCategory" v-model="ruleForm.category" class="terminal-input">
                    <option value="" disabled selected>ВЫБЕРИТЕ_КАТЕГОРИЮ</option>
                    <option v-for="cat in financeStore.categories" :key="cat.id" :value="cat.name || cat">
                      {{ cat.name || cat }}
                    </option>
                  </select>
                </div>
                <button type="submit" class="terminal-btn w-100">[ СОЗДАТЬ_ПРАВИЛО ]</button>
              </form>
            </div>
          </div>
        </div>

        <div class="col-md-7">
          <div class="dashboard-block h-100 d-flex flex-column">
            <h2 class="block-title">&gt; СПИСОК_ПРАВИЛ</h2>
            <div style="flex: 1; max-height: 250px; overflow-y: auto; margin-bottom: 20px;">
              <SettingsItem
                  v-for="rule in financeStore.rules"
                  :key="rule.id"
                  @delete="removeRule(rule.id)"
              >
                <span>"{{ rule.triggerWord }}" &rarr; <b>{{ rule.category }}</b></span>
              </SettingsItem>
            </div>

            <h2 class="block-title">&gt; СПИСОК_КАТЕГОРИЙ</h2>
            <div style="flex: 1; max-height: 250px; overflow-y: auto;">
              <SettingsItem
                  v-for="cat in financeStore.categories"
                  :key="cat.id"
                  @delete="removeCategory(cat.id)"
              >
                <span>{{ cat.name }}</span>
              </SettingsItem>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import BaseLayout from '../layouts/BaseLayout.vue'
import {useFinanceStore} from '../stores/finance'
import {useAuthStore} from '../stores/auth'
import {financeApi} from '../api'
import SettingsItem from "@/components/SettingsItem.vue";

const financeStore = useFinanceStore()
const authStore = useAuthStore()

onMounted(() => financeStore.loadAllData(authStore.userId))

const newCatName = ref('')
const ruleForm = ref({keyword: '', category: ''})

const addCategory = async () => {
  if (!newCatName.value) return
  await financeApi.createCategory({name: newCatName.value.toUpperCase()})
  newCatName.value = ''
  await financeStore.loadAllData(authStore.userId)
}

const removeCategory = async (id) => {
  if (confirm("УДАЛИТЬ КАТЕГОРИЮ?")) {
    await financeApi.deleteCategory(id)
    await financeStore.loadAllData(authStore.userId)
  }
}

const addRule = async () => {
  if (!ruleForm.value.keyword || !ruleForm.value.category) return
  await financeApi.createRule({
    userId: Number(authStore.userId),
    triggerWord: ruleForm.value.keyword.toUpperCase(),
    category: ruleForm.value.category
  })
  ruleForm.value = {keyword: '', category: ''}
  await financeStore.loadAllData(authStore.userId)
}

const removeRule = async (id) => {
  if (confirm("УДАЛИТЬ ПРАВИЛО?")) {
    await financeApi.deleteRule(id)
    await financeStore.loadAllData(authStore.userId)
  }
}

const handleCsvUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = async (e) => {
    const lines = e.target.result.split('\n')
    let count = 0
    for (const line of lines) {
      const cols = line.trim().split(/[,;]/).map(c => c.trim())
      if (cols.length < 4) continue
      const account = financeStore.accounts.find(a => a.name.toUpperCase() === cols[1].toUpperCase())
      if (account) {
        let cat = 'РАЗНОЕ'
        financeStore.rules.forEach(r => {
          if (cols[2].toUpperCase().includes(r.triggerWord)) cat = r.category
        })
        const sum = parseFloat(cols[3].replace(',', '.'))
        await financeApi.createTransaction({
          userId: Number(authStore.userId),
          account: account.name, date: cols[0],
          desc: cols[2].toUpperCase(),
          category: cat,
          sum: sum
        })
        await financeApi.updateAccount(account.id, {balance: account.balance + sum})
        count++
      }
    }
    alert(`УСПЕХ: ЗАГРУЖЕНО ${count} СТРОК`)
    await financeStore.loadAllData(authStore.userId)
  }
  reader.readAsText(file)
}
</script>