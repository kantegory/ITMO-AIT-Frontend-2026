function renderRules(rules) {
  const rulesBody = document.getElementById('rulesBody');
  if (!rulesBody) return;

  if (!rules.length) {
    rulesBody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-secondary">Правила пока не добавлены</td>
      </tr>
    `;
    return;
  }

  rulesBody.innerHTML = rules.map((rule) => `
    <tr>
      <td>${rule.condition}</td>
      <td>${rule.action}</td>
      <td>${rule.source}</td>
      <td><span class="badge text-bg-success rounded-pill">${rule.status}</span></td>
    </tr>
  `).join('');
}

function isCurrentUserRule(record, userId) {
  return String(record.userId) === String(userId);
}

async function loadUserRules(user) {
  const allRules = await apiRequest('/rules');
  return allRules.filter((rule) => isCurrentUserRule(rule, user.id));
}

async function initIntegrationsPage() {
  const user = requireAuth();
  if (!user) return;

  try {
    const rules = await loadUserRules(user);
    renderRules(rules);

    document.getElementById('importTransactionsBtn')?.addEventListener('click', async () => {
      try {
        const importBatch = [
          {
            userId: user.id,
            date: '2026-03-11',
            category: 'Продукты',
            description: 'Market Import',
            type: 'expense',
            amount: 1210
          },
          {
            userId: user.id,
            date: '2026-03-11',
            category: 'Транспорт',
            description: 'Metro Card',
            type: 'expense',
            amount: 240
          }
        ];

        await Promise.all(
          importBatch.map((item) =>
            apiRequest('/transactions', {
              method: 'POST',
              body: JSON.stringify(item)
            })
          )
        );

        const importStatus = document.getElementById('importStatus');

        if (importStatus) {
          importStatus.classList.remove('d-none');
          importStatus.innerHTML =
            '<strong>Импорт выполнен.</strong><br>Загружены демонстрационные транзакции из платёжного аккаунта.';
        }

        showToast('Импорт транзакций выполнен');
      } catch (error) {
        showToast('Ошибка импорта');
        console.error(error);
      }
    });

    document.getElementById('ruleForm')?.addEventListener('submit', async (event) => {
      event.preventDefault();

      const condition = document.getElementById('ruleCondition').value.trim();
      const action = document.getElementById('ruleAction').value.trim();

      try {
        await apiRequest('/rules', {
          method: 'POST',
          body: JSON.stringify({
            userId: user.id,
            condition,
            action,
            source: 'Пользовательское',
            status: 'Активно'
          })
        });

        const updatedRules = await loadUserRules(user);
        renderRules(updatedRules);

        const modalEl = document.getElementById('ruleModal');
        bootstrap.Modal.getInstance(modalEl)?.hide();

        event.target.reset();
        showToast('Правило добавлено');
      } catch (error) {
        showToast('Ошибка при добавлении правила');
        console.error(error);
      }
    });
  } catch (error) {
    console.error(error);
    showToast('Не удалось загрузить правила');
  }
}