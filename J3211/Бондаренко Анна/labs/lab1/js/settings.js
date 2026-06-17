document.addEventListener('DOMContentLoaded', function() {
    const categoryContainer = document.getElementById('categoryListBody');
    const rulesContainer = document.getElementById('rulesListBody');

    if (!categoryContainer || !rulesContainer) return;

    const renderSettingsUI = function() {
        const rules = USERS.userData.rules;
        const categories = USERS.userData.categories;

        if (rules.length === 0) {
            rulesContainer.innerHTML = '<p>[ ПУСТО ]</p>';
        } else {
            rulesContainer.innerHTML = rules.map(function(rule, index) {
                return `
                <div class="item-row">
                    <span>"${rule.triggerWord}" &rarr; <b>${rule.category}</b></span>
                    <button class="delete-btn" onclick="window.deleteRule(${index})">[ X ]</button>
                </div>`;
            }).join('');
        }

        categoryContainer.innerHTML = categories.map(function(category, index) {
            return `
            <div class="item-row">
                <span>${category}</span>
                <button class="delete-btn" onclick="window.deleteCategory(${index})">[ X ]</button>
            </div>`;
        }).join('');

        const ruleCategorySelect = document.getElementById('ruleCategory');
        if (ruleCategorySelect) {
            ruleCategorySelect.innerHTML = categories.map(function(category) {
                return `<option value="${category}">${category}</option>`;
            }).join('');
        }
    };

    window.deleteRule = function(index) {
        if (confirm("УДАЛИТЬ ПРАВИЛО?")) {
            USERS.userData.rules.splice(index, 1);
            USERS.save();
            renderSettingsUI();
        }
    };

    window.deleteCategory = function(index) {
        if (confirm("УДАЛИТЬ КАТЕГОРИЮ?")) {
            USERS.userData.categories.splice(index, 1);
            USERS.save();
            renderSettingsUI();
        }
    };

    const addCategoryForm = document.getElementById('addCategoryForm');
    if (addCategoryForm) {
        addCategoryForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const categoryInput = document.getElementById('newCategoryName');
            const categoryValue = categoryInput.value.trim().toUpperCase();

            if (categoryValue !== "") {
                USERS.userData.categories.push(categoryValue);
                USERS.save();
                renderSettingsUI();
                addCategoryForm.reset();
            }
        });
    }

    const ruleForm = document.getElementById('ruleForm');
    if (ruleForm) {
        ruleForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const keywordInput = document.getElementById('ruleKeyword');
            const categorySelect = document.getElementById('ruleCategory');
            const keywordValue = keywordInput.value.trim().toUpperCase();

            if (keywordValue !== "") {
                USERS.userData.rules.push({
                    triggerWord: keywordValue,
                    category: categorySelect.value
                });
                USERS.save();
                renderSettingsUI();
                ruleForm.reset();
            }
        });
    }

    const fileInput = document.getElementById('csvFileInput');
    const triggerCsvButton = document.getElementById('triggerCsvUpload');

    if (triggerCsvButton) {
        triggerCsvButton.onclick = function() {
            fileInput.click();
        };
    }

    if (fileInput) {
        fileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();

            reader.onload = function(readerEvent) {
                const fileContent = readerEvent.target.result;
                const lines = fileContent.split('\n');
                let importedCount = 0;

                lines.forEach(function(line) {
                    const trimmedLine = line.trim();
                    if (trimmedLine === "") {
                        return;
                    }

                    const columns = trimmedLine.split(',').map(function(column) {
                        return column.trim();
                    });

                    const csvDate = columns[0];
                    const csvAccountName = columns[1];
                    const csvDescription = columns[2].toUpperCase();
                    const csvSum = parseFloat(columns[3]);

                    const targetAccount = USERS.userData.accounts.find(function(account) {
                        return account.name === csvAccountName.toUpperCase();
                    });

                    if (targetAccount && !isNaN(csvSum)) {
                        let detectedCategory = 'РАЗНОЕ';
                        const activeRules = USERS.userData.rules;

                        activeRules.forEach(function(rule) {
                            if (csvDescription.includes(rule.triggerWord.toUpperCase())) {
                                detectedCategory = rule.category;
                            }
                        });

                        targetAccount.balance = targetAccount.balance + csvSum;

                        USERS.userData.transactions.push({
                            account: targetAccount.name,
                            date: csvDate,
                            desc: csvDescription,
                            category: detectedCategory,
                            sum: csvSum
                        });

                        importedCount++;
                    }
                });

                USERS.save();

                const statusDisplay = document.getElementById('importStatus');
                if (statusDisplay) {
                    statusDisplay.innerText = `[ ЗАГРУЖЕНО: ${importedCount} ]`;
                }

                setTimeout(function() {
                    location.reload();
                }, 1000);
            };
            reader.readAsText(file);
        });
    }

    renderSettingsUI();
});