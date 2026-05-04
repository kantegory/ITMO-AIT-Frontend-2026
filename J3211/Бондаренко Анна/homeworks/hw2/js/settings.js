window.initSettingsPage = function () {
    const categoryList = document.getElementById('categoryListBody');
    const rulesList = document.getElementById('rulesListBody');

    if (!categoryList || !rulesList) {
        return;
    }

    const renderSettings = function () {
        const rules = window.USERS.userData.rules;
        const categories = window.USERS.userData.categories;

        if (rules.length === 0) {
            rulesList.innerHTML = '<p>[ ПУСТО ]</p>';
        } else {
            rulesList.innerHTML = rules.map(function (rule) {
                return `
                <div class="item-row">
                    <span>"${rule.triggerWord}" &rarr; <b>${rule.category}</b></span>
                    <button class="delete-btn" onclick="window.deleteRuleRecordById('${rule.id}')">
                        [ X ]
                    </button>
                </div>`;
            }).join('');
        }

        categoryList.innerHTML = categories.map(function (category) {
            const name = category.name || category;
            const id = category.id;

            return `
            <div class="item-row">
                <span>${name}</span>
                <button class="delete-btn" onclick="window.deleteCategoryRecordById('${id}')">
                    [ X ]
                </button>
            </div>`;
        }).join('');

        const categorySelect = document.getElementById('ruleCategory');

        if (categorySelect) {
            categorySelect.innerHTML = categories.map(function (category) {
                const name = category.name || category;
                return `
                    <option value="${name}">
                        ${name}
                    </option>
                `;
            }).join('');
        }
    };

    window.deleteRuleRecordById = async function (id) {
        if (confirm("УДАЛИТЬ ПРАВИЛО?")) {
            await window.API.deleteRule(id);
            location.reload();
        }
    };

    window.deleteCategoryRecordById = async function (id) {
        if (confirm("УДАЛИТЬ КАТЕГОРИЮ?")) {
            await window.API.deleteCategory(id);
            location.reload();
        }
    };

    const categoryForm = document.getElementById('addCategoryForm');

    if (categoryForm) {
        categoryForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const nameInput = document.getElementById('newCategoryName');
            const name = nameInput.value.trim().toUpperCase();

            if (name !== "") {
                await window.API.createCategory({
                    name: name
                });
                location.reload();
            }
        });
    }

    const ruleForm = document.getElementById('ruleForm');

    if (ruleForm) {
        ruleForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const keywordInput = document.getElementById('ruleKeyword');
            const categorySelect = document.getElementById('ruleCategory');
            const keyword = keywordInput.value.trim().toUpperCase();

            if (keyword !== "") {
                await window.API.createRule({
                    userId: Number(window.USERS.currentUserId), triggerWord: keyword, category: categorySelect.value
                });
                location.reload();
            }
        });
    }

    const csvInput = document.getElementById('csvFileInput');
    const uploadBtn = document.getElementById('triggerCsvUpload');

    if (uploadBtn) {
        uploadBtn.onclick = function () {
            csvInput.click();
        };
    }

    if (csvInput) {
        csvInput.addEventListener('change', function (event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();

            reader.onload = async function (e) {
                const content = e.target.result;
                const lines = content.split('\n');
                let count = 0;

                for (const line of lines) {
                    const cleanLine = line.trim();
                    if (cleanLine === "") continue;

                    const cols = cleanLine.split(/[,;]/).map(col => col.trim());

                    if (cols.length < 4) continue;

                    const date = cols[0];
                    const accountName = cols[1].toUpperCase();
                    const description = cols[2].toUpperCase();
                    const sum = parseFloat(cols[3].replace(',', '.'));

                    const account = window.USERS.userData.accounts.find(acc => acc.name.toUpperCase() === accountName);

                    if (account && !isNaN(sum)) {
                        let categoryName = 'РАЗНОЕ';
                        const activeRules = window.USERS.userData.rules;

                        activeRules.forEach(function (rule) {
                            if (description.includes(rule.triggerWord.toUpperCase())) {
                                categoryName = rule.category;
                            }
                        });

                        await window.API.createTransaction({
                            userId: Number(window.USERS.currentUserId),
                            account: account.name,
                            date: date,
                            desc: description,
                            category: categoryName,
                            sum: sum
                        });

                        const newBalance = Number(account.balance) + sum;
                        await window.API.updateAccount(account.id, {balance: newBalance});

                        count++;
                    }
                }

                alert(`УСПЕХ: ЗАГРУЖЕНО ${count} СТРОК`);
                location.reload();
            };
            reader.readAsText(file);
        });
    }
    renderSettings();
};