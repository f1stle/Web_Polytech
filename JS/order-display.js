// order-display.js
document.addEventListener('DOMContentLoaded', function() {
    const orderContent = document.getElementById('order-content');
    const selectedToursInput = document.getElementById('selected-tours');
    const bookingForm = document.querySelector('.booking-form');
    
    // Загружаем выбранные туры
    const selectedTours = JSON.parse(localStorage.getItem('selectedTours') || '{}');
    let total = 0;
    let hasSelectedTours = false;
    
    // Проверяем, есть ли выбранные туры
    const hasAnyTour = Object.values(selectedTours).some(tour => tour !== null);
    
    if (!hasAnyTour) {
        // Если ничего не выбрано
        orderContent.innerHTML = `
            <div class="empty-order-message">
                <h3>Вы еще не выбрали туры</h3>
                <p>Вернитесь на страницу выбора туров, чтобы добавить их в заказ</p>
            </div>
        `;
        if (bookingForm) bookingForm.style.display = 'none';
        return;
    }
    
    // Создаем заголовок для выбранных туров
    const selectedHeader = document.createElement('h2');
    selectedHeader.className = 'selected-header';
    selectedHeader.textContent = 'Выбранные туры:';
    orderContent.appendChild(selectedHeader);
    
    // Отображаем выбранные туры по категориям
    const categories = [
        { key: 'nature', name: '🌿 Природные туры' },
        { key: 'cultural', name: '🏛️ Культурные туры' },
        { key: 'adventure', name: '⚡ Приключенческие туры' },
        { key: 'relax', name: '🏖️ Пляжный отдых' }
    ];
    
    // Собираем выбранные туры для отправки
    const selectedToursData = [];
    
    categories.forEach(category => {
        const tour = selectedTours[category.key];
        
        const categoryElement = document.createElement('div');
        categoryElement.className = 'order-category';
        
        if (tour) {
            hasSelectedTours = true;
            total += tour.price;
            selectedToursData.push(tour.keyword);
            
            categoryElement.innerHTML = `
                <h3>${category.name}</h3>
                <div class="selected-tour-info">
                    <div class="tour-name">${tour.name}</div>
                    <div class="tour-duration">${tour.duration}</div>
                    <div class="tour-price">${tour.price.toLocaleString()}₽</div>
                </div>
            `;
        } else {
            categoryElement.innerHTML = `
                <h3>${category.name}</h3>
                <div class="not-selected">Тур не выбран</div>
            `;
        }
        
        orderContent.appendChild(categoryElement);
    });
    
    // Добавляем итоговую стоимость
    if (hasSelectedTours) {
        const totalElement = document.createElement('div');
        totalElement.className = 'total-price';
        totalElement.innerHTML = `
            <div class="total-label">Общая стоимость:</div>
            <div class="total-amount">${total.toLocaleString()}₽</div>
        `;
        orderContent.appendChild(totalElement);
        
        // Сохраняем выбранные туры в скрытое поле
        if (selectedToursInput && selectedToursData.length > 0) {
            selectedToursInput.value = selectedToursData.join(',');
            console.log('Selected tours:', selectedToursInput.value); // Для отладки
        }
    } else {
        // Скрываем форму, если нет выбранных туров
        if (bookingForm) bookingForm.style.display = 'none';
    }
});