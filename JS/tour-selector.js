document.addEventListener('DOMContentLoaded', function() {
    let selectedTours = [];
    
    loadSelectedTours();

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

            const existingIndex = selectedTours.findIndex(t => t.id === tourId);
            
            if (existingIndex > -1) {
                deselectTour(tourId);
            } else {
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

    const continueBtn = document.getElementById('continue-btn');
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            if (selectedTours.length > 0) {
                saveSelectedTours();
                window.location.href = 'order.html';
            }
        });
    }
    
    function selectTour(tour) {
        const currentCard = document.querySelector(`.tour-card[data-id="${tour.id}"]`);
        if (currentCard) {
            currentCard.classList.add('selected');
            const btn = currentCard.querySelector('.select-tour-btn');
            if (btn) {
                btn.textContent = 'Добавлено';
                btn.classList.add('added');
            }
        }

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

        orderContainer.innerHTML = '';

        if (selectedTours.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-order';
            emptyMessage.textContent = 'Выберите туры из списка';
            orderContainer.appendChild(emptyMessage);
            totalElement.style.display = 'none';
            continueBtn.disabled = true;
            return;
        }

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
                selectedTours = [];
                localStorage.removeItem('selectedTours');
            }
        }
    }

    updateOrderSummary();
});