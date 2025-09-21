// Ascent Application
class Ascent {
    constructor() {
        this.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        this.budgets = JSON.parse(localStorage.getItem('budgets')) || [];
        this.currentSection = 'dashboard';
        this.editingTransaction = null;
        this.editingBudget = null;
        this.expenseChart = null;
        this.confirmCallback = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showSection('dashboard'); // Ensure dashboard is active on load
        this.updateDashboard();
        this.renderTransactions();
        this.renderBudgets();
        this.setDefaultDate();
        
        // Initialize chart after a small delay to ensure DOM is ready
        setTimeout(() => {
            this.initExpenseChart();
            this.updateExpenseChart();
        }, 100);
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.showSection(section);
            });
        });

        // Quick action buttons
        document.getElementById('addIncome').addEventListener('click', () => {
            this.openTransactionModal('income');
        });

        document.getElementById('addExpense').addEventListener('click', () => {
            this.openTransactionModal('expense');
        });

        document.getElementById('setBudget').addEventListener('click', () => {
            this.openBudgetModal();
        });

        document.getElementById('viewReports').addEventListener('click', () => {
            this.showSection('reports');
        });

        // Transaction modal
        document.getElementById('addTransactionBtn').addEventListener('click', () => {
            this.openTransactionModal();
        });

        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal('transactionModal');
        });

        document.getElementById('cancelTransaction').addEventListener('click', () => {
            this.closeModal('transactionModal');
        });

        document.getElementById('transactionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTransaction();
        });

        // Budget modal
        document.getElementById('createBudgetBtn').addEventListener('click', () => {
            this.openBudgetModal();
        });

        document.getElementById('closeBudgetModal').addEventListener('click', () => {
            this.closeModal('budgetModal');
        });

        document.getElementById('cancelBudget').addEventListener('click', () => {
            this.closeModal('budgetModal');
        });

        document.getElementById('budgetForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveBudget();
        });

        // Filters
        document.getElementById('transactionType').addEventListener('change', () => {
            this.renderTransactions();
        });

        document.getElementById('transactionCategory').addEventListener('change', () => {
            this.renderTransactions();
        });

        document.getElementById('dateFilter').addEventListener('change', () => {
            this.renderTransactions();
        });

        // Transaction type change
        document.getElementById('transactionTypeSelect').addEventListener('change', (e) => {
            this.updateCategoryOptions(e.target.value);
        });

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });

        // Export report
        document.getElementById('exportReportBtn').addEventListener('click', () => {
            this.exportReport();
        });

        // Custom modal event listeners
        document.getElementById('closeEditBudgetModal').addEventListener('click', () => {
            this.closeModal('editBudgetModal');
        });

        document.getElementById('cancelEditBudget').addEventListener('click', () => {
            this.closeModal('editBudgetModal');
        });

        document.getElementById('editBudgetForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateBudget();
        });

        document.getElementById('removeBudget').addEventListener('click', () => {
            this.removeBudget();
        });

        document.getElementById('closeConfirmModal').addEventListener('click', () => {
            this.closeModal('confirmModal');
        });

        document.getElementById('cancelConfirm').addEventListener('click', () => {
            this.closeModal('confirmModal');
        });

        document.getElementById('confirmAction').addEventListener('click', () => {
            this.executeConfirmAction();
        });

        // Learning article button
        const buyingCarBtn = document.getElementById('buyingCarBtn');
        if (buyingCarBtn) {
            buyingCarBtn.addEventListener('click', () => {
                this.openArticle('buying-a-car');
            });
        }

        // Car calculator
        const calculateCarBtn = document.getElementById('calculateCar');
        if (calculateCarBtn) {
            calculateCarBtn.addEventListener('click', () => {
                this.calculateCarPurchase();
            });
        }

        // Down payment slider functionality
        const downPaymentSlider = document.getElementById('downPaymentPercent');
        const carPriceInput = document.getElementById('carPrice');
        
        if (downPaymentSlider && carPriceInput) {
            // Update slider when car price changes
            carPriceInput.addEventListener('input', () => {
                this.updateDownPaymentDisplay();
            });
            
            // Update display when slider changes
            downPaymentSlider.addEventListener('input', () => {
                this.updateDownPaymentDisplay();
            });
        }
    }

    showSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const navBtn = document.querySelector(`[data-section="${sectionName}"]`);
        if (navBtn) {
            navBtn.classList.add('active');
        }

        // Update content
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update main wrapper class for styling
        const mainWrapper = document.querySelector('.main-wrapper');
        if (mainWrapper) {
            // Remove all section classes
            mainWrapper.classList.remove('dashboard', 'transactions', 'budget', 'reports', 'learning', 'article');
            // Add current section class
            mainWrapper.classList.add(sectionName);
        }

        this.currentSection = sectionName;

        // Update specific sections
        if (sectionName === 'reports') {
            this.updateReports();
        }
    }

    openTransactionModal(type = null) {
        const form = document.getElementById('transactionForm');
        const title = document.getElementById('modalTitle');
        
        form.reset();
        this.setDefaultDate();
        
        if (type) {
            document.getElementById('transactionTypeSelect').value = type;
            this.updateCategoryOptions(type);
        }
        
        title.textContent = this.editingTransaction ? 'Edit Transaction' : 'Add Transaction';
        this.openModal('transactionModal');
    }

    openBudgetModal() {
        const form = document.getElementById('budgetForm');
        
        form.reset();
        this.openModal('budgetModal');
    }

    openModal(modalId) {
        document.getElementById(modalId).style.display = 'flex';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
        this.editingTransaction = null;
    }

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('transactionDate').value = today;
    }

    updateCategoryOptions(type) {
        const categorySelect = document.getElementById('transactionCategorySelect');
        const currentValue = categorySelect.value;
        
        // Clear existing options
        categorySelect.innerHTML = '<option value="">Select Category</option>';
        
        if (type === 'income') {
            categorySelect.innerHTML += `
                <optgroup label="Income">
                    <option value="salary">Salary</option>
                    <option value="freelance">Freelance</option>
                    <option value="investment">Investment</option>
                    <option value="business">Business</option>
                    <option value="other">Other</option>
                </optgroup>
            `;
        } else {
            categorySelect.innerHTML += `
                <optgroup label="Expenses">
                    <option value="food">Food & Dining</option>
                    <option value="transportation">Transportation</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="utilities">Utilities</option>
                    <option value="shopping">Shopping</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="housing">Housing</option>
                    <option value="savings">Savings</option>
                    <option value="education">Education</option>
                    <option value="travel">Travel</option>
                    <option value="other">Other</option>
                </optgroup>
            `;
        }
        
        // Restore previous value if it exists
        if (currentValue && categorySelect.querySelector(`option[value="${currentValue}"]`)) {
            categorySelect.value = currentValue;
        }
    }

    saveTransaction() {
        const form = document.getElementById('transactionForm');
        const formData = new FormData(form);
        
        const transaction = {
            id: this.editingTransaction ? this.editingTransaction.id : Date.now(),
            description: document.getElementById('transactionDescription').value,
            amount: parseFloat(document.getElementById('transactionAmount').value),
            category: document.getElementById('transactionCategorySelect').value,
            type: document.getElementById('transactionTypeSelect').value,
            date: document.getElementById('transactionDate').value,
            createdAt: this.editingTransaction ? this.editingTransaction.createdAt : new Date().toISOString()
        };

        if (this.editingTransaction) {
            const index = this.transactions.findIndex(t => t.id === this.editingTransaction.id);
            this.transactions[index] = transaction;
        } else {
            this.transactions.unshift(transaction);
        }

        this.saveToStorage();
        this.closeModal('transactionModal');
        this.updateDashboard();
        this.renderTransactions();
        this.renderBudgets();
    }

    saveBudget() {
        const form = document.getElementById('budgetForm');
        
        const budget = {
            id: Date.now(),
            category: document.getElementById('budgetCategory').value,
            amount: parseFloat(document.getElementById('budgetAmount').value),
            period: document.getElementById('budgetPeriod').value,
            createdAt: new Date().toISOString()
        };

        // Check if budget for this category already exists
        const existingIndex = this.budgets.findIndex(b => b.category === budget.category);
        if (existingIndex >= 0) {
            this.budgets[existingIndex] = budget;
        } else {
            this.budgets.push(budget);
        }

        this.saveToStorage();
        this.closeModal('budgetModal');
        this.renderBudgets();
        this.updateDashboard();
    }

    editBudget(id) {
        const budget = this.budgets.find(b => b.id === id);
        if (!budget) return;

        this.editingBudget = budget;
        document.getElementById('editBudgetCategory').value = this.formatCategory(budget.category);
        document.getElementById('editBudgetAmount').value = budget.amount;
        this.openModal('editBudgetModal');
    }

    updateBudget() {
        if (!this.editingBudget) return;

        const newAmount = parseFloat(document.getElementById('editBudgetAmount').value);
        
        if (!isNaN(newAmount) && newAmount >= 0) {
            this.editingBudget.amount = newAmount;
            this.saveToStorage();
            this.renderBudgets();
            this.updateDashboard();
            this.closeModal('editBudgetModal');
            this.editingBudget = null;
        }
    }

    removeBudget() {
        if (!this.editingBudget) return;

        this.confirmCallback = () => {
            this.budgets = this.budgets.filter(b => b.id !== this.editingBudget.id);
            this.saveToStorage();
            this.renderBudgets();
            this.updateDashboard();
            this.closeModal('editBudgetModal');
            this.editingBudget = null;
        };
        
        document.getElementById('confirmMessage').textContent = `Are you sure you want to remove the budget for ${this.formatCategory(this.editingBudget.category)}?`;
        this.openModal('confirmModal');
    }

    deleteTransaction(id) {
        this.confirmCallback = () => {
            this.transactions = this.transactions.filter(t => t.id !== id);
            this.saveToStorage();
            this.updateDashboard();
            this.renderTransactions();
            this.renderBudgets();
        };
        
        document.getElementById('confirmMessage').textContent = 'Are you sure you want to delete this transaction?';
        this.openModal('confirmModal');
    }

    executeConfirmAction() {
        if (this.confirmCallback) {
            this.confirmCallback();
            this.confirmCallback = null;
        }
        this.closeModal('confirmModal');
    }

    editTransaction(id) {
        const transaction = this.transactions.find(t => t.id === id);
        if (transaction) {
            this.editingTransaction = transaction;
            
            // Fill form with transaction data
            document.getElementById('transactionDescription').value = transaction.description;
            document.getElementById('transactionAmount').value = transaction.amount;
            document.getElementById('transactionCategorySelect').value = transaction.category;
            document.getElementById('transactionTypeSelect').value = transaction.type;
            document.getElementById('transactionDate').value = transaction.date;
            
            this.updateCategoryOptions(transaction.type);
            this.openTransactionModal();
        }
    }

    saveToStorage() {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
        localStorage.setItem('budgets', JSON.stringify(this.budgets));
    }

    updateDashboard() {
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
        const monthlyTransactions = this.transactions.filter(t => 
            t.date.startsWith(currentMonth)
        );

        const income = monthlyTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = monthlyTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const savingsContributions = monthlyTransactions
            .filter(t => t.type === 'expense' && t.category === 'savings')
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = income - expenses;
        // Savings rate calculation: savings contributions / income * 100
        const savingsRate = income > 0 ? (savingsContributions / income * 100) : 0;

        // Update dashboard cards
        document.getElementById('totalBalance').textContent = this.formatCurrency(balance);
        document.getElementById('monthlyIncome').textContent = this.formatCurrency(income);
        document.getElementById('monthlyExpenses').textContent = this.formatCurrency(expenses);
        document.getElementById('savingsRate').textContent = `${savingsRate.toFixed(1)}%`;

        // Update balance card color
        const balanceCard = document.querySelector('.balance-card');
        balanceCard.className = `card balance-card ${balance >= 0 ? 'positive' : 'negative'}`;

        // Update recent transactions
        this.renderRecentTransactions();
        
        // Update expense chart
        this.updateExpenseChart();
    }

    renderRecentTransactions() {
        const container = document.getElementById('recentTransactionsList');
        const recentTransactions = this.transactions.slice(0, 5);

        if (recentTransactions.length === 0) {
            container.innerHTML = `
                <div class="no-transactions">
                    <i class="fas fa-receipt"></i>
                    <p>No transactions yet. Add your first transaction to get started!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = recentTransactions.map(transaction => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-description">${transaction.description}</div>
                    <div class="transaction-category">${this.formatCategory(transaction.category)}</div>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}${this.formatCurrency(transaction.amount)}
                </div>
            </div>
        `).join('');
    }

    renderTransactions() {
        const tbody = document.getElementById('transactionsTableBody');
        const typeFilter = document.getElementById('transactionType').value;
        const categoryFilter = document.getElementById('transactionCategory').value;
        const dateFilter = document.getElementById('dateFilter').value;

        let filteredTransactions = this.transactions;

        // Apply filters
        if (typeFilter !== 'all') {
            filteredTransactions = filteredTransactions.filter(t => t.type === typeFilter);
        }

        if (categoryFilter !== 'all') {
            filteredTransactions = filteredTransactions.filter(t => t.category === categoryFilter);
        }

        if (dateFilter) {
            filteredTransactions = filteredTransactions.filter(t => t.date === dateFilter);
        }

        // Sort by date (newest first)
        filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (filteredTransactions.length === 0) {
            tbody.innerHTML = `
                <tr class="no-data">
                    <td colspan="6">No transactions found. Add your first transaction!</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = filteredTransactions.map(transaction => `
            <tr>
                <td>${this.formatDate(transaction.date)}</td>
                <td>${transaction.description}</td>
                <td>${this.formatCategory(transaction.category)}</td>
                <td>
                    <span class="transaction-type ${transaction.type}">
                        ${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </span>
                </td>
                <td class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}${this.formatCurrency(transaction.amount)}
                </td>
                <td>
                    <button class="btn btn-secondary" onclick="ascent.editTransaction(${transaction.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-secondary" onclick="ascent.deleteTransaction(${transaction.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    renderBudgets() {
        const container = document.getElementById('budgetCategoriesGrid');
        const currentMonth = new Date().toISOString().slice(0, 7);

        if (this.budgets.length === 0) {
            container.innerHTML = `
                <div class="no-budgets">
                    <i class="fas fa-wallet"></i>
                    <p>No budgets created yet. Create your first budget category!</p>
                </div>
            `;
            return;
        }

        // Calculate budget summary
        const totalBudget = this.budgets.reduce((sum, b) => sum + b.amount, 0);
        const monthlyTransactions = this.transactions.filter(t => 
            t.date.startsWith(currentMonth) && t.type === 'expense'
        );

        const totalSpent = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0);
        const remaining = totalBudget - totalSpent;

        // Update budget summary
        document.getElementById('totalBudget').textContent = this.formatCurrency(totalBudget);
        document.getElementById('totalSpent').textContent = this.formatCurrency(totalSpent);
        document.getElementById('budgetRemaining').textContent = this.formatCurrency(remaining);

        // Render budget categories
        container.innerHTML = this.budgets.map(budget => {
            const categorySpent = monthlyTransactions
                .filter(t => t.category === budget.category)
                .reduce((sum, t) => sum + t.amount, 0);
            
            const percentage = (categorySpent / budget.amount) * 100;
            const isOverBudget = categorySpent > budget.amount;

            return `
                <div class="budget-category-card" data-budget-id="${budget.id}">
                    <div class="budget-category-header">
                        <h4>${this.formatCategory(budget.category)}</h4>
                        <div class="budget-amount-container">
                            <span class="budget-amount">${this.formatCurrency(budget.amount)}</span>
                            <button class="edit-budget-btn" onclick="ascent.editBudget(${budget.id})" title="Edit budget amount">
                                <i class="fas fa-edit"></i>
                            </button>
                        </div>
                    </div>
                    <div class="budget-progress">
                        <div class="progress-bar">
                            <div class="progress-fill ${isOverBudget ? 'over-budget' : ''}" 
                                 style="width: ${Math.min(percentage, 100)}%"></div>
                        </div>
                        <div class="budget-stats">
                            <span class="spent">Spent: ${this.formatCurrency(categorySpent)}</span>
                            <span class="percentage ${isOverBudget ? 'over-budget' : ''}">
                                ${percentage.toFixed(1)}%
                            </span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateReports() {
        // This would typically integrate with a charting library like Chart.js
        // For now, we'll show placeholder content
        const currentMonth = new Date().toISOString().slice(0, 7);
        const monthlyTransactions = this.transactions.filter(t => 
            t.date.startsWith(currentMonth)
        );

        const income = monthlyTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = monthlyTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        // Update chart placeholders with actual data
        document.getElementById('incomeExpenseChart').innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h4>Income vs Expenses</h4>
                <p>Income: ${this.formatCurrency(income)}</p>
                <p>Expenses: ${this.formatCurrency(expenses)}</p>
                <p>Net: ${this.formatCurrency(income - expenses)}</p>
            </div>
        `;

        // Expense categories breakdown
        const categoryBreakdown = {};
        monthlyTransactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
            });

        const categoryHtml = Object.entries(categoryBreakdown)
            .map(([category, amount]) => `
                <div style="display: flex; justify-content: space-between; margin: 0.5rem 0;">
                    <span>${this.formatCategory(category)}</span>
                    <span>${this.formatCurrency(amount)}</span>
                </div>
            `).join('');

        document.getElementById('expenseCategoriesChart').innerHTML = `
            <div style="padding: 1rem;">
                <h4>Expense Categories</h4>
                ${categoryHtml || '<p>No expenses this month</p>'}
            </div>
        `;

        document.getElementById('monthlyTrendsChart').innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h4>Monthly Trends</h4>
                <p>Track your spending patterns over time</p>
                <p><em>Chart visualization would go here</em></p>
            </div>
        `;
    }

    exportReport() {
        const currentMonth = new Date().toISOString().slice(0, 7);
        const monthlyTransactions = this.transactions.filter(t => 
            t.date.startsWith(currentMonth)
        );

        const income = monthlyTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = monthlyTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const reportData = {
            period: currentMonth,
            summary: {
                totalIncome: income,
                totalExpenses: expenses,
                netIncome: income - expenses,
                savingsRate: income > 0 ? ((income - expenses) / income * 100) : 0
            },
            transactions: monthlyTransactions,
            budgets: this.budgets
        };

        const dataStr = JSON.stringify(reportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `ascent-report-${currentMonth}.json`;
        link.click();
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatCategory(category) {
        return category.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    initExpenseChart() {
        const ctx = document.getElementById('expenseChart');
        if (!ctx) return;

        this.expenseChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#4ade80', 
                        '#f59e0b', 
                        '#3b82f6', 
                        '#ef4444', 
                        '#8b5cf6', 
                        '#06b6d4', 
                        '#f97316', 
                        '#84cc16', 
                        '#ec4899', 
                        '#6b7280'  
                    ],
                    borderWidth: 0,
                    cutout: '60%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                layout: {
                    padding: 10
                }
            }
        });
    }

    updateExpenseChart() {
        if (!this.expenseChart) return;

        const currentMonth = new Date().toISOString().slice(0, 7);
        const monthlyExpenses = this.transactions.filter(t => 
            t.date.startsWith(currentMonth) && t.type === 'expense'
        );

        // Group expenses by category
        const categoryBreakdown = {};
        monthlyExpenses.forEach(transaction => {
            const category = this.formatCategory(transaction.category);
            categoryBreakdown[category] = (categoryBreakdown[category] || 0) + transaction.amount;
        });

        // Sort categories by amount (descending)
        const sortedCategories = Object.entries(categoryBreakdown)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5); // Show top 5 categories

        if (sortedCategories.length === 0) {
            this.expenseChart.data.labels = ['No Expenses'];
            this.expenseChart.data.datasets[0].data = [1];
            this.expenseChart.data.datasets[0].backgroundColor = ['#6b7280'];
        } else {
            this.expenseChart.data.labels = sortedCategories.map(([category]) => category);
            this.expenseChart.data.datasets[0].data = sortedCategories.map(([, amount]) => amount);
        }

        this.expenseChart.update();

        this.updateChartLegend(sortedCategories);
    }

    updateChartLegend(categories) {
        const legendContainer = document.getElementById('expenseChartLegend');
        if (!legendContainer) return;

        if (categories.length === 0) {
            legendContainer.innerHTML = '<div class="legend-item"><span>No expenses this month</span></div>';
            return;
        }

        const colors = [
            '#4ade80', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6',
            '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#6b7280'
        ];

        legendContainer.innerHTML = categories.map(([category, amount], index) => `
            <div class="legend-item">
                <div class="legend-color" style="background-color: ${colors[index]}"></div>
                <span class="legend-label">${category}</span>
                <span class="legend-value">${this.formatCurrency(amount)}</span>
            </div>
        `).join('');
    }

    openArticle(articleId) {
        // Set article content based on the article ID
        if (articleId === 'budgeting-basics') {
            document.getElementById('articleTitle').textContent = 'Budgeting Basics: Your Path to Financial Control';
            document.getElementById('articleCategory').textContent = 'Personal Finance';
            document.getElementById('articleDate').textContent = new Date().toLocaleDateString();
            
            // Show budgeting content, hide car content
            const budgetingContent = document.getElementById('budgeting-basics-content');
            const carContent = document.getElementById('car-buying-content');
            const carCalculator = document.querySelector('.car-calculator');
            if (budgetingContent) budgetingContent.style.display = 'block';
            if (carContent) carContent.style.display = 'none';
            if (carCalculator) carCalculator.style.display = 'none';
            
            this.showSection('article');
        } else if (articleId === 'buying-a-car') {
            document.getElementById('articleTitle').textContent = 'Buying a Car: A Complete Guide';
            document.getElementById('articleCategory').textContent = 'Vehicle Purchase';
            document.getElementById('articleDate').textContent = new Date().toLocaleDateString();
            
            // Show car content, hide budgeting content
            const budgetingContent = document.getElementById('budgeting-basics-content');
            const carContent = document.getElementById('car-buying-content');
            const carCalculator = document.querySelector('.car-calculator');
            if (budgetingContent) budgetingContent.style.display = 'none';
            if (carContent) carContent.style.display = 'block';
            if (carCalculator) carCalculator.style.display = 'block';
            
            this.showSection('article');
        } else if (articleId === 'debt-management') {
            this.showSection('debt-management-article');
        }
    }

    goBackToLearning() {
        this.showSection('learning');
    }

    calculateCarPurchase() {
        // Get input values
        const grossIncome = parseFloat(document.getElementById('grossIncome').value) || 0;
        const carPrice = parseFloat(document.getElementById('carPrice').value) || 0;
        const downPaymentPercent = parseFloat(document.getElementById('downPaymentPercent').value) || 20;
        const downPayment = (carPrice * downPaymentPercent) / 100;
        const loanTerm = parseInt(document.getElementById('loanTerm').value) || 36;
        const interestRate = parseFloat(document.getElementById('interestRate').value) || 5.5;

        // Validate inputs
        if (grossIncome <= 0 || carPrice <= 0) {
            alert('Please enter valid values for income and car price.');
            return;
        }

        document.getElementById('carResults').style.display = 'block';

        // Calculate down payment percentage (already calculated above)
        
        // Calculate loan amount
        const loanAmount = carPrice - downPayment;
        
        // Calculate monthly payment using loan formula
        const monthlyRate = interestRate / 100 / 12;
        const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / 
                              (Math.pow(1 + monthlyRate, loanTerm) - 1);
        
        // Calculate total interest and total cost
        const totalInterest = (monthlyPayment * loanTerm) - loanAmount;
        const totalCost = carPrice + totalInterest;
        
        // Calculate income percentage
        const incomePercent = (monthlyPayment / grossIncome) * 100;

        // Check rules
        const downPaymentPass = downPaymentPercent >= 20;
        const loanTermPass = loanTerm <= 36;
        const incomePass = incomePercent <= 8;

        // Update rule checks
        this.updateRuleCheck('downPaymentCheck', downPaymentPass, 
            `Your down payment is ${downPaymentPercent.toFixed(1)}% ${downPaymentPass ? '(Great!)' : '(Aim for at least 20%)'}`);

        this.updateRuleCheck('loanTermCheck', loanTermPass,
            `Your loan term is ${loanTerm} months ${loanTermPass ? '(Perfect!)' : '(Stick to 36 months or less)'}`);

        this.updateRuleCheck('incomeCheck', incomePass,
            `Your payment is ${incomePercent.toFixed(1)}% of your income ${incomePass ? '(Excellent!)' : '(Should be 8% or less)'}`);

        // Update overall result
        const passCount = [downPaymentPass, loanTermPass, incomePass].filter(Boolean).length;
        let overallStatus, overallMessage, overallIcon;

        if (passCount === 3) {
            overallStatus = 'pass';
            overallMessage = 'Congratulations! You meet all three rules of the 20/3/8 strategy.';
            overallIcon = '<i class="fas fa-trophy"></i>';
        } else if (passCount >= 1) {
            overallStatus = 'warning';
            overallMessage = `You meet ${passCount} out of 3 rules. Consider adjusting your car choice.`;
            overallIcon = '<i class="fas fa-balance-scale"></i>';
        } else {
            overallStatus = 'fail';
            overallMessage = 'This car purchase doesn\'t align with the 20/3/8 rule. Consider a less expensive option.';
            overallIcon = '<i class="fas fa-times-circle"></i>';
        }

        this.updateOverallResult(overallStatus, overallMessage, overallIcon);

        // Update payment details
        document.getElementById('monthlyPayment').textContent = this.formatCurrency(monthlyPayment);
        document.getElementById('totalInterest').textContent = this.formatCurrency(totalInterest);
        document.getElementById('totalCost').textContent = this.formatCurrency(totalCost);

        // Generate recommendations
        this.generateRecommendations(downPaymentPass, loanTermPass, incomePass, grossIncome, carPrice, downPayment, loanTerm);
    }

    updateRuleCheck(elementId, passed, message) {
        const element = document.getElementById(elementId);
        const icon = element.querySelector('.rule-icon');
        const status = element.querySelector('.rule-status');

        element.className = `rule-check ${passed ? 'pass' : 'fail'}`;
        icon.innerHTML = passed ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-exclamation-triangle"></i>';
        status.textContent = message;
    }

    updateOverallResult(status, message, icon) {
        const element = document.getElementById('overallResult');
        const iconElement = element.querySelector('.result-icon');
        const messageElement = element.querySelector('.result-message');

        element.className = `overall-result ${status}`;
        iconElement.innerHTML = icon;
        messageElement.textContent = message;
    }

    generateRecommendations(downPaymentPass, loanTermPass, incomePass, grossIncome, carPrice, downPayment, loanTerm) {
        const recommendations = [];
        
        if (!downPaymentPass) {
            const neededDownPayment = carPrice * 0.2;
            recommendations.push(`Increase your down payment to at least ${this.formatCurrency(neededDownPayment)} (20% of car price)`);
        }
        
        if (!loanTermPass) {
            recommendations.push('Choose a loan term of 36 months or less to build equity faster');
        }
        
        if (!incomePass) {
            const maxPayment = grossIncome * 0.08;
            const maxCarPrice = (maxPayment * loanTerm) + downPayment;
            recommendations.push(`Consider a car priced at ${this.formatCurrency(maxCarPrice)} or less to stay within 8% of your income`);
        }
        
        if (downPaymentPass && loanTermPass && incomePass) {
            recommendations.push('You\'re following the 20/3/8 rule perfectly! This is a smart financial decision.');
        }

        const list = document.getElementById('recommendationList');
        list.innerHTML = recommendations.map(rec => `<li>${rec}</li>`).join('');
    }

    updateDownPaymentDisplay() {
        const carPrice = parseFloat(document.getElementById('carPrice').value) || 0;
        const downPaymentPercent = parseFloat(document.getElementById('downPaymentPercent').value) || 20;
        const downPaymentAmount = (carPrice * downPaymentPercent) / 100;
        
        // Update percentage display
        document.getElementById('downPaymentPercentValue').textContent = `${downPaymentPercent}%`;
        
        // Update dollar amount display
        document.getElementById('downPaymentAmount').textContent = this.formatCurrency(downPaymentAmount);
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.ascent = new Ascent();
});

// Add some CSS for budget progress bars
const additionalStyles = `
    .budget-category-card {
        background: #1a1a1a;
        border: 1px solid #2a2a2a;
        border-radius: 10px;
        padding: 1rem;
        margin-bottom: 1rem;
        position: relative;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .budget-category-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    .budget-category-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    .budget-category-header h4 {
        margin: 0;
        color: #ffffff;
        font-weight: 600;
    }

    .budget-amount-container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .budget-amount {
        font-weight: 700;
        color: #4ade80;
    }

    .edit-budget-btn {
        background: transparent;
        border: none;
        color: #6b7280;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        transition: all 0.2s ease;
        opacity: 0;
        transform: scale(0.8);
    }

    .budget-category-card:hover .edit-budget-btn {
        opacity: 1;
        transform: scale(1);
    }

    .edit-budget-btn:hover {
        color: #4ade80;
        background: rgba(74, 222, 128, 0.1);
    }

    .budget-progress {
        margin-top: 0.5rem;
    }

    .progress-bar {
        width: 100%;
        height: 8px;
        background: #2a2a2a;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 0.5rem;
    }

    .progress-fill {
        height: 100%;
        background: #4ade80;
        transition: width 0.3s ease;
    }

    .progress-fill.over-budget {
        background: #e74c3c;
    }

    .budget-stats {
        display: flex;
        justify-content: space-between;
        font-size: 0.9rem;
    }

    .budget-stats .spent {
        color: #d4d4d4;
    }

    .budget-stats .percentage {
        font-weight: 600;
        color: #4ade80;
    }

    .budget-stats .percentage.over-budget {
        color: #e74c3c;
    }

    .transaction-type {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
    }

    .transaction-type.income {
        background: #d5f4e6;
        color: #4ade80;
    }

    .transaction-type.expense {
        background: #fadbd8;
        color: #e74c3c;
    }

    .balance-card.positive .card-content .amount {
        color: #4ade80;
    }

    .balance-card.negative .card-content .amount {
        color: #e74c3c;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
