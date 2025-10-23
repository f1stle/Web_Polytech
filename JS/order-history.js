document.addEventListener('DOMContentLoaded', function() {
    const SERVER_BASE_URL = 'https://web-polytech-server.onrender.com';
    
    const ordersContainer = document.getElementById('orders-container');
    const ordersLoading = document.getElementById('orders-loading');
    const noOrdersMessage = document.getElementById('no-orders-message');
    const searchInput = document.getElementById('search-orders');
    const searchBtn = document.getElementById('search-btn');
    const statusFilter = document.getElementById('status-filter');
    const dateFilter = document.getElementById('date-filter');
    
    const detailsModal = document.getElementById('order-details-modal');
    const editModal = document.getElementById('edit-order-modal');
    const deleteModal = document.getElementById('delete-confirm-modal');
    
    let allOrders = [];
    let filteredOrders = [];

    loadOrdersHistory();
    setupEventListeners();

    function setupEventListeners() {
        searchBtn.addEventListener('click', applyFilters);
        searchInput.addEventListener('input', applyFilters);
        statusFilter.addEventListener('change', applyFilters);
        dateFilter.addEventListener('change', applyFilters);

        document.querySelectorAll('.close-modal').forEach(closeBtn => {
            closeBtn.addEventListener('click', closeAllModals);
        });

        document.getElementById('close-details-btn').addEventListener('click', () => closeModal(detailsModal));
        document.getElementById('cancel-edit-btn').addEventListener('click', () => closeModal(editModal));
        document.getElementById('cancel-delete-btn').addEventListener('click', () => closeModal(deleteModal));
        
        document.getElementById('save-edit-btn').addEventListener('click', saveOrderChanges);
        document.getElementById('confirm-delete-btn').addEventListener('click', confirmDeleteOrder);

        window.addEventListener('click', function(event) {
            if (event.target === detailsModal) closeModal(detailsModal);
            if (event.target === editModal) closeModal(editModal);
            if (event.target === deleteModal) closeModal(deleteModal);
        });
    }

    function loadOrdersHistory() {
        ordersLoading.style.display = 'block';
        ordersContainer.style.display = 'none';
        noOrdersMessage.style.display = 'none';

        fetch(`${SERVER_BASE_URL}/api/orders`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    allOrders = data.orders || [];
                    filteredOrders = [...allOrders];
                    renderOrders();
                } else {
                    throw new Error(data.message || 'Failed to load orders');
                }
            })
            .catch(error => {
                console.error('Error loading orders:', error);
                showNotification('Ошибка загрузки истории заказов', 'error');
                allOrders = [];
                filteredOrders = [];
                renderOrders();
            });
    }

    function renderOrders() {
        ordersLoading.style.display = 'none';

        if (filteredOrders.length === 0) {
            ordersContainer.style.display = 'none';
            noOrdersMessage.style.display = 'block';
            return;
        }

        ordersContainer.style.display = 'block';
        noOrdersMessage.style.display = 'none';

        filteredOrders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        ordersContainer.innerHTML = filteredOrders.map(order => `
            <div class="order-card" data-order-id="${order.order_id}">
                <div class="order-card-header">
                    <div class="order-info">
                        <h3>Заказ #${order.order_id}</h3>
                        <div class="order-meta">
                            <span>${formatDate(order.timestamp)}</span>
                            <span>${order.tours.length} ${getTourWord(order.tours.length)}</span>
                            <span>${order.customer.name}</span>
                        </div>
                    </div>
                    <div class="order-status">
                        <span class="status-${order.status || 'pending'} order-status">${getStatusText(order.status)}</span>
                    </div>
                </div>
                
                <div class="order-tours-preview">
                    ${order.tours.slice(0, 2).map(tour => `
                        <div class="tour-preview-item">
                            <div class="tour-preview-image" style="background-image: url('${tour.image || getDefaultTourImage(tour.category)}')"></div>
                            <div class="tour-preview-info">
                                <div class="tour-preview-name">${tour.name}</div>
                                <div class="tour-preview-price">${tour.price.toLocaleString()}₽</div>
                            </div>
                        </div>
                    `).join('')}
                    ${order.tours.length > 2 ? `<div style="text-align: center; color: #666; padding: 10px;">... и еще ${order.tours.length - 2} туров</div>` : ''}
                </div>
                
                <div class="order-card-footer">
                    <div class="order-total">Итого: ${order.total.toLocaleString()}₽</div>
                    <div class="order-actions">
                        <button class="action-btn primary details-btn" data-order-id="${order.order_id}">
                            📋 Подробнее
                        </button>
                        <button class="action-btn secondary edit-btn" data-order-id="${order.order_id}">
                            ✏️ Редактировать
                        </button>
                        <button class="action-btn danger delete-btn" data-order-id="${order.order_id}">
                            🗑️ Удалить
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        document.querySelectorAll('.details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => showOrderDetails(e.target.dataset.orderId));
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => showEditOrderForm(e.target.dataset.orderId));
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => showDeleteConfirmation(e.target.dataset.orderId));
        });
    }

    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const statusValue = statusFilter.value;
        const dateValue = dateFilter.value;

        filteredOrders = allOrders.filter(order => {
            const matchesSearch = !searchTerm || 
                order.tours.some(tour => tour.name.toLowerCase().includes(searchTerm)) ||
                order.customer.name.toLowerCase().includes(searchTerm) ||
                order.order_id.toLowerCase().includes(searchTerm);

            const matchesStatus = !statusValue || order.status === statusValue;
            const matchesDate = filterByDate(order.timestamp, dateValue);

            return matchesSearch && matchesStatus && matchesDate;
        });

        renderOrders();
    }

    function filterByDate(timestamp, filterType) {
        if (!filterType) return true;

        const orderDate = new Date(timestamp);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        switch (filterType) {
            case 'today':
                return orderDate.toDateString() === today.toDateString();
            case 'week':
                const weekAgo = new Date(today);
                weekAgo.setDate(today.getDate() - 7);
                return orderDate >= weekAgo;
            case 'month':
                const monthAgo = new Date(today);
                monthAgo.setMonth(today.getMonth() - 1);
                return orderDate >= monthAgo;
            case 'year':
                const yearAgo = new Date(today);
                yearAgo.setFullYear(today.getFullYear() - 1);
                return orderDate >= yearAgo;
            default:
                return true;
        }
    }

    function showOrderDetails(orderId) {
        const order = allOrders.find(o => o.order_id === orderId);
        if (!order) return;

        const detailsContent = document.getElementById('order-details-content');
        detailsContent.innerHTML = `
            <div class="order-details-section">
                <h3>Информация о клиенте</h3>
                <div class="customer-info-grid">
                    <div class="info-item">
                        <span class="info-label">ФИО:</span>
                        <span class="info-value">${order.customer.name}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Email:</span>
                        <span class="info-value">${order.customer.email}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Телефон:</span>
                        <span class="info-value">${order.customer.phone}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Статус:</span>
                        <span class="info-value status-${order.status}">${getStatusText(order.status)}</span>
                    </div>
                </div>
            </div>

            <div class="order-details-section">
                <h3>Детали бронирования</h3>
                <div class="customer-info-grid">
                    <div class="info-item">
                        <span class="info-label">Даты путешествия:</span>
                        <span class="info-value">${order.booking.dates}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Количество участников:</span>
                        <span class="info-value">${order.booking.participants}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Дата создания:</span>
                        <span class="info-value">${formatDate(order.timestamp)}</span>
                    </div>
                </div>
                ${order.booking.comments ? `
                    <div class="info-item" style="margin-top: 15px;">
                        <span class="info-label">Дополнительные пожелания:</span>
                        <span class="info-value">${order.booking.comments}</span>
                    </div>
                ` : ''}
            </div>

            <div class="order-details-section">
                <h3>Выбранные туры</h3>
                ${order.tours.map(tour => `
                    <div class="details-tour-item">
                        <div class="details-tour-image" style="background-image: url('${tour.image || getDefaultTourImage(tour.category)}')"></div>
                        <div class="details-tour-info">
                            <div class="details-tour-name">${tour.name}</div>
                            <div class="details-tour-category">${getCategoryName(tour.category)} • ${tour.duration || '7 дней'}</div>
                            <div class="details-tour-price">${tour.price.toLocaleString()}₽</div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="order-summary-details">
                <div class="summary-row">
                    <span>Количество туров:</span>
                    <span>${order.tours.length}</span>
                </div>
                <div class="summary-row">
                    <span>Участников:</span>
                    <span>${order.booking.participants}</span>
                </div>
                <div class="summary-row total">
                    <span>Общая стоимость:</span>
                    <span>${order.total.toLocaleString()}₽</span>
                </div>
            </div>
        `;

        openModal(detailsModal);
    }

    function showEditOrderForm(orderId) {
        const order = allOrders.find(o => o.order_id === orderId);
        if (!order) return;

        document.getElementById('edit-order-id').value = order.order_id;
        document.getElementById('edit-dates').value = order.booking.dates;
        document.getElementById('edit-participants').value = order.booking.participants;
        document.getElementById('edit-comments').value = order.booking.comments || '';
        document.getElementById('edit-status').value = order.status || 'pending';

        openModal(editModal);
    }

    function showDeleteConfirmation(orderId) {
        document.getElementById('delete-order-id').value = orderId;
        openModal(deleteModal);
    }

    function saveOrderChanges() {
        const orderId = document.getElementById('edit-order-id').value;
        const orderIndex = allOrders.findIndex(o => o.order_id === orderId);
        
        if (orderIndex === -1) {
            showNotification('Заказ не найден', 'error');
            return;
        }

        const updatedOrder = {
            ...allOrders[orderIndex],
            booking: {
                ...allOrders[orderIndex].booking,
                dates: document.getElementById('edit-dates').value,
                participants: parseInt(document.getElementById('edit-participants').value),
                comments: document.getElementById('edit-comments').value
            },
            status: document.getElementById('edit-status').value
        };

        updateOrderOnServer(updatedOrder)
            .then(success => {
                if (success) {
                    allOrders[orderIndex] = updatedOrder;
                    filteredOrders = [...allOrders];
                    renderOrders();
                    closeModal(editModal);
                    showNotification('Заказ успешно обновлен', 'success');
                }
            });
    }

    function confirmDeleteOrder() {
        const orderId = document.getElementById('delete-order-id').value;
        
        deleteOrderFromServer(orderId)
            .then(success => {
                if (success) {
                    allOrders = allOrders.filter(o => o.order_id !== orderId);
                    filteredOrders = [...allOrders];
                    renderOrders();
                    closeModal(deleteModal);
                    showNotification('Заказ успешно удален', 'success');
                }
            });
    }

    function updateOrderOnServer(updatedOrder) {
        return fetch(`${SERVER_BASE_URL}/api/update-order`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedOrder)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                return true;
            } else {
                throw new Error(data.message || 'Failed to update order');
            }
        })
        .catch(error => {
            console.error('Error updating order:', error);
            showNotification('Ошибка обновления заказа: ' + error.message, 'error');
            return false;
        });
    }

    function deleteOrderFromServer(orderId) {
        return fetch(`${SERVER_BASE_URL}/api/delete-order`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ order_id: orderId })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                return true;
            } else {
                throw new Error(data.message || 'Failed to delete order');
            }
        })
        .catch(error => {
            console.error('Error deleting order:', error);
            showNotification('Ошибка удаления заказа: ' + error.message, 'error');
            return false;
        });
    }

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function getStatusText(status) {
        const statusMap = {
            'pending': 'Ожидание',
            'confirmed': 'Подтвержден',
            'cancelled': 'Отменен',
            'completed': 'Завершен'
        };
        return statusMap[status] || 'Неизвестно';
    }

    function getTourWord(count) {
        if (count % 10 === 1 && count % 100 !== 11) return 'тур';
        if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) return 'тура';
        return 'туров';
    }

    function getCategoryName(category) {
        const categoryMap = {
            'nature': 'Природный тур',
            'cultural': 'Культурный тур',
            'adventure': 'Приключенческий тур',
            'relax': 'Пляжный отдых'
        };
        return categoryMap[category] || category;
    }

    function getDefaultTourImage(category) {
        const defaultImages = {
            'nature': '../scr/scale_1200.jpg',
            'cultural': '../scr/orig.jpg',
            'adventure': '../scr/scale_elb.jpg',
            'relax': '../scr/imgpreview.jpg'
        };
        return defaultImages[category] || '../scr/default-tour.jpg';
    }

    function openModal(modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function closeAllModals() {
        closeModal(detailsModal);
        closeModal(editModal);
        closeModal(deleteModal);
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10001;
            font-weight: 500;
            max-width: 300px;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);

        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
});
