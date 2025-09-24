// tour-selector.js
document.addEventListener('DOMContentLoaded', function() {
    let selectedTours = [];
    
    // Загружаем сохраненные туры из localStorage
    loadSelectedTours();
    
    // Обработчик выбора тура
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('select-tour-btn')) {
            const tourCard = e.target.closest('.tour-card');
            const tourId = e.target.getAttribute('data-id');
            const tourName = e.target.getAttribute('data-name');
            const tourPrice = parseInt(e.target.getAttribute('data-price'));
            const tourCategory = tourCard.getAttribute('data-category');
            
            const tour = {
                id: tourId,
                name: tourName,
                price: tourPrice,
                category: tourCategory
            };
            
            // Проверяем, выбран ли уже этот тур
            const existingIndex = selectedTours.findIndex(t => t.id === tourId);
            
            if (existingIndex > -1) {
                // Удаляем тур, если уже выбран
                deselectTour(tourId);
            } else {
                // Удаляем предыдущий тур из той же категории (если есть)
                const sameCategoryIndex = selectedTours.findIndex(t => t.category === tourCategory);
                if (sameCategoryIndex > -1) {
                    deselectTour(selectedTours[sameCategoryIndex].id);
                }
                selectTour(tour);
            }
            
            updateOrderSummary();
            saveSelectedTours();
        }
    });
    
    // Обработчик кнопки перехода к оформлению
    const continueBtn = document.getElementById('continue-btn');
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            if (selectedTours.length > 0) {
                // Сохраняем выбранные туры в localStorage
                saveSelectedTours();
                // Переходим на страницу оформления
                window.location.href = 'order.html';
            }
        });
    }
    
    function selectTour(tour) {
        // Выделяем новый тур
        const currentCard = document.querySelector(`.tour-card[data-id="${tour.id}"]`);
        if (currentCard) {
            currentCard.classList.add('selected');
            const btn = currentCard.querySelector('.select-tour-btn');
            if (btn) {
                btn.textContent = 'Добавлено';
                btn.classList.add('added');
            }
        }
        
        // Добавляем тур в массив
        selectedTours.push(tour);
    }
    
    function deselectTour(tourId) {
        const tourIndex = selectedTours.findIndex(t => t.id === tourId);
        if (tourIndex > -1) {
            const tour = selectedTours[tourIndex];
            const prevCard = document.querySelector(`.tour-card[data-id="${tour.id}"]`);
            if (prevCard) {
                prevCard.classList.remove('selected');
                const btn = prevCard.querySelector('.select-tour-btn');
                if (btn) {
                    btn.textContent = 'Выбрать тур';
                    btn.classList.remove('added');
                }
            }
            selectedTours.splice(tourIndex, 1);
        }
    }
    
    function updateOrderSummary() {
        const orderContainer = document.getElementById('tour-order');
        const totalElement = document.getElementById('order-total');
        const continueBtn = document.getElementById('continue-btn');
        
        // Очищаем контейнер
        orderContainer.innerHTML = '';
        
        // Проверяем, есть ли выбранные туры
        if (selectedTours.length === 0) {
            // Если ничего не выбрано
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-order';
            emptyMessage.textContent = 'Выберите туры из списка';
            orderContainer.appendChild(emptyMessage);
            totalElement.style.display = 'none';
            continueBtn.disabled = true;
            return;
        }
        
        // Добавляем выбранные туры
        let total = 0;
        selectedTours.forEach(tour => {
            total += tour.price;
            
            const tourElement = document.createElement('div');
            tourElement.className = 'selected-tour';
            tourElement.innerHTML = `
                <strong>${getCategoryName(tour.category)}</strong><br>
                <span class="tour-name-small">${tour.name}</span><br>
                <span class="tour-price-small">${tour.price.toLocaleString()}₽</span>
            `;
            orderContainer.appendChild(tourElement);
        });
        
        // Обновляем итоговую стоимость
        const totalSpan = totalElement.querySelector('span');
        if (totalSpan) {
            totalSpan.textContent = total.toLocaleString();
        }
        totalElement.style.display = 'block';
        continueBtn.disabled = false;
    }
    
    function getCategoryName(category) {
        const names = {
            nature: 'Природный тур',
            cultural: 'Культурный тур',
            adventure: 'Приключенческий тур',
            relax: 'Пляжный отдых'
        };
        return names[category] || category;
    }
    
    function saveSelectedTours() {
        localStorage.setItem('selectedTours', JSON.stringify(selectedTours));
    }
    
    function loadSelectedTours() {
        const savedTours = localStorage.getItem('selectedTours');
        if (savedTours) {
            try {
                selectedTours = JSON.parse(savedTours);
                
                // Восстанавливаем выделение туров
                selectedTours.forEach(tour => {
                    if (tour && tour.id) {
                        const card = document.querySelector(`.tour-card[data-id="${tour.id}"]`);
                        if (card) {
                            card.classList.add('selected');
                            const btn = card.querySelector('.select-tour-btn');
                            if (btn) {
                                btn.textContent = 'Добавлено';
                                btn.classList.add('added');
                            }
                        }
                    }
                });
                
                updateOrderSummary();
            } catch (e) {
                console.error('Ошибка загрузки туров из localStorage:', e);
                // Очищаем невалидные данные
                selectedTours = [];
                localStorage.removeItem('selectedTours');
            }
        }
    }
    
    // Инициализация при загрузке
    updateOrderSummary();
});
// === Фильтрация туров ===
const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');
const durationFilter = document.getElementById('durationFilter');
const searchFilter = document.getElementById('searchFilter');

function applyFilters() {
    const maxPrice = parseInt(priceRange.value);
    const duration = durationFilter.value;
    const searchText = searchFilter.value.toLowerCase();

    document.querySelectorAll('.tour-card').forEach(card => {
        const price = parseInt(card.querySelector('.select-tour-btn').dataset.price);
        const name = card.querySelector('.tour-title').textContent.toLowerCase();
        const desc = card.querySelector('.tour-description').textContent.toLowerCase();

        let show = true;

        // Фильтр по цене
        if (price > maxPrice) show = false;

        // Фильтр по длительности (берем из tours-data, если хотите — можно привязать dataset-duration)
        if (duration === 'short' && !desc.includes('день') && price > 25000) show = false;
        if (duration === 'medium' && !(price >= 20000 && price <= 40000)) show = false;
        if (duration === 'long' && price < 40000) show = false;

        // Поиск по названию и описанию
        if (searchText && !name.includes(searchText) && !desc.includes(searchText)) {
            show = false;
        }

        card.style.display = show ? '' : 'none';
    });
}

// События фильтрации
if (priceRange) {
    priceRange.addEventListener('input', () => {
        priceValue.textContent = parseInt(priceRange.value).toLocaleString() + ' ₽';
        applyFilters();
    });
}

if (durationFilter) durationFilter.addEventListener('change', applyFilters);
if (searchFilter) searchFilter.addEventListener('input', applyFilters);
