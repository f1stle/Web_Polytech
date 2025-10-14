document.addEventListener('DOMContentLoaded', function() {
    let tours = [];
    let combos = [];
    let selectedTours = [];
    let currentTour = null;
    
    const comboModal = document.getElementById('comboModal');
    const closeModal = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const continueBtn = document.getElementById('continue-btn');
    
    loadToursData();
    
    function loadToursData() {
        fetch('/api/tours')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                tours = data.tours;
                combos = data.combos;
                renderTours();
                renderCombos();
                loadSelectedTours();
            })
            .catch(error => {
                console.error('Error loading tours data from API:', error);
                loadLocalToursData();
            });
    }
    
    function loadLocalToursData() {
        fetch('tours_data.json')
            .then(response => response.json())
            .then(data => {
                tours = data.tours;
                combos = data.combos;
                renderTours();
                renderCombos();
                loadSelectedTours();
            })
            .catch(error => {
                console.error('Error loading local tours data:', error);
            });
    }
    
    function renderCombos() {
        const comboContainer = document.querySelector(".combo-options");
        if (!comboContainer) return;
        comboContainer.innerHTML = "";

        const singleOption = document.createElement("div");
        singleOption.className = "combo-option";
        singleOption.dataset.type = "single";
        singleOption.innerHTML = `
            <div class="option-header">
                <h3>Только этот тур</h3>
                <span class="price-badge">от <span id="singleTourPrice">0</span>₽</span>
            </div>
            <div class="option-image" id="singleTourImage"></div>
            <p class="option-description" id="singleTourDesc">Насладитесь выбранным направлением в полной мере</p>
            <ul class="option-benefits">
                <li>✓ Полное погружение в локацию</li>
                <li>✓ Гибкие даты путешествия</li>
                <li>✓ Индивидуальная программа</li>
            </ul>
            <button class="select-option-btn" data-type="single">Выбрать этот тур</button>
        `;
        comboContainer.appendChild(singleOption);

        combos.forEach(combo => {
            const comboDiv = document.createElement("div");
            comboDiv.className = "combo-option";
            comboDiv.dataset.type = combo.type;

            const toursHTML = combo.tours.map(
                t => `
                    <div class="preview-tour">
                        <div class="preview-image" style="background-image: url('${t.img}')"></div>
                        <span>${t.name}</span>
                    </div>`
            ).join("");

            const benefitsHTML = combo.benefits.map(b => `<li>✓ ${b}</li>`).join("");

            comboDiv.innerHTML = `
                <div class="option-header">
                    <h3>${combo.title}</h3>
                    <span class="price-badge discount">${combo.price.toLocaleString()}₽ <span class="original-price">${combo.originalPrice.toLocaleString()}₽</span></span>
                </div>
                <div class="combo-tours-preview">${toursHTML}</div>
                <p class="option-description">${combo.desc}</p>
                <ul class="option-benefits">${benefitsHTML}</ul>
                <button class="select-option-btn" data-type="${combo.type}">Выбрать комбо</button>
            `;
            comboContainer.appendChild(comboDiv);
        });
    }

    function renderTours() {
        const containers = {
            nature: document.getElementById('nature-container'),
            cultural: document.getElementById('cultural-container'),
            adventure: document.getElementById('adventure-container'),
            relax: document.getElementById('relax-container')
        };

        Object.values(containers).forEach(container => {
            if (container) container.innerHTML = '';
        });

        tours.forEach(t => {
            const container = containers[t.category];
            if (!container) return;
            
            const card = document.createElement('div');
            card.className = 'tour-card';
            card.dataset.category = t.category;
            card.dataset.id = t.id;
            card.innerHTML = `
                <div class="tour-image" style="background-image: url('${t.img}')"></div>
                <div class="tour-content">
                    <h3 class="tour-title">${t.name}</h3>
                    <p class="tour-description">${t.desc}</p>
                    <p class="tour-price">от ${t.price.toLocaleString()} ₽</p>
                    <button class="select-tour-btn" data-id="${t.id}" data-name="${t.name}" data-price="${t.price}">Выбрать тур</button>
                </div>
            `;
            container.appendChild(card);
        });
    }
    
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('select-tour-btn')) {
            const tourId = e.target.getAttribute('data-id');
            const tourName = e.target.getAttribute('data-name');
            const tourPrice = parseInt(e.target.getAttribute('data-price'));
            const tourCard = e.target.closest('.tour-card');
            const tourImage = tourCard.querySelector('.tour-image').style.backgroundImage;
            const tourDescription = tourCard.querySelector('.tour-description').textContent;
            
            currentTour = {
                id: tourId,
                name: tourName,
                price: tourPrice,
                image: tourImage,
                description: tourDescription,
                category: tourCard.getAttribute('data-category')
            };
            
            showComboModal(currentTour);
        }
    });
    
    if (closeModal) {
        closeModal.addEventListener('click', closeComboModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeComboModal);
    }
    
    window.addEventListener('click', function(e) {
        if (e.target === comboModal) {
            closeComboModal();
        }
    });
    
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('select-option-btn')) {
            const optionType = e.target.getAttribute('data-type');
            handleOptionSelection(optionType);
        }
    });
    
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            if (validateTourSelection()) {
                saveSelectedTours();
                window.location.href = 'order.html';
            }
        });
    }
    
    function showComboModal(tour) {
        document.getElementById('singleTourPrice').textContent = tour.price.toLocaleString();
        document.getElementById('singleTourDesc').textContent = tour.description;
        
        const singleTourImage = document.getElementById('singleTourImage');
        singleTourImage.style.backgroundImage = tour.image;
        
        comboModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    function closeComboModal() {
        comboModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        currentTour = null;
    }
    
    function handleOptionSelection(optionType) {
        let toursToSelect = [];
        
        switch(optionType) {
            case 'single':
                toursToSelect = [currentTour];
                break;
            case 'combo-classic':
                toursToSelect = getComboTours([4, 5, 6], 0.15); // Исправлены ID
                break;
            case 'combo-nature':
                toursToSelect = getComboTours([1, 2, 8], 0.20);
                break;
            case 'combo-extreme':
                toursToSelect = getComboTours([3, 7, 9], 0.18);
                break;
        }
        
        selectedTours.forEach(tour => {
            deselectTour(tour.id);
        });
        selectedTours = [];
        
        toursToSelect.forEach(tour => {
            selectTour(tour);
        });
        
        updateOrderSummary();
        saveSelectedTours();
        closeComboModal();
        
        showNotification(
            optionType === 'single' 
                ? `Тур "${currentTour.name}" добавлен!` 
                : 'Комбо-пакет успешно выбран!',
            'success'
        );
    }
    
    function getComboTours(tourIds, discount) {
        const toursToReturn = [];
        
        tourIds.forEach(id => {
            const tour = tours.find(t => t.id === id);
            if (tour) {
                const discountedPrice = Math.round(tour.price * (1 - discount));
                toursToReturn.push({
                    id: tour.id.toString(),
                    name: tour.name,
                    price: discountedPrice,
                    category: tour.category,
                    originalPrice: tour.price,
                    image: tour.img,
                    description: tour.desc
                });
            }
        });
        
        return toursToReturn;
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
        let hasCombo = selectedTours.length > 1;
        
        selectedTours.forEach(tour => {
            total += tour.price;
            
            const tourElement = document.createElement('div');
            tourElement.className = 'selected-tour';
            
            if (tour.originalPrice) {
                tourElement.innerHTML = `
                    <strong>${getCategoryName(tour.category)}</strong><br>
                    <span class="tour-name-small">${tour.name}</span><br>
                    <span class="tour-price-small">${tour.price.toLocaleString()}₽</span>
                    <span style="text-decoration: line-through; color: #999; font-size: 0.8rem; margin-left: 5px;">
                        ${tour.originalPrice.toLocaleString()}₽
                    </span>
                `;
            } else {
                tourElement.innerHTML = `
                    <strong>${getCategoryName(tour.category)}</strong><br>
                    <span class="tour-name-small">${tour.name}</span><br>
                    <span class="tour-price-small">${tour.price.toLocaleString()}₽</span>
                `;
            }
            
            orderContainer.appendChild(tourElement);
        });
        
        if (hasCombo) {
            const savings = selectedTours.reduce((sum, tour) => sum + (tour.originalPrice || tour.price) - tour.price, 0);
            if (savings > 0) {
                const savingsElement = document.createElement('div');
                savingsElement.className = 'selected-tour';
                savingsElement.style.background = 'linear-gradient(135deg, #e8f5e8, #c8e6c9)';
                savingsElement.innerHTML = `
                    <strong>Экономия на комбо</strong><br>
                    <span class="tour-price-small" style="color: #4caf50;">-${savings.toLocaleString()}₽</span>
                `;
                orderContainer.appendChild(savingsElement);
            }
        }
        
        const totalSpan = totalElement.querySelector('span');
        if (totalSpan) {
            totalSpan.textContent = total.toLocaleString();
        }
        totalElement.style.display = 'block';
        continueBtn.disabled = false;
    }
    
    function validateTourSelection() {
        if (selectedTours.length === 0) {
            showNotification('Пожалуйста, выберите хотя бы один тур', 'error');
            return false;
        }
        return true;
    }
    
    function showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.custom-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `custom-notification ${type}`;
        
        const typeIcons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">${typeIcons[type] || typeIcons.info}</div>
                <div class="notification-message">${message}</div>
                <button class="notification-ok-btn">Окей</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        notification.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            font-family: 'Roboto', sans-serif;
        `;
        
        const content = notification.querySelector('.notification-content');
        content.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            animation: fadeIn 0.3s ease;
        `;
        
        const okBtn = notification.querySelector('.notification-ok-btn');
        okBtn.style.cssText = `
            background: #1a5276;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            margin-top: 20px;
            transition: all 0.3s ease;
        `;
        
        okBtn.addEventListener('mouseenter', function() {
            this.style.background = '#154360';
            this.style.color = '#f8f9fa';
        });
        
        okBtn.addEventListener('mouseleave', function() {
            this.style.background = '#1a5276';
            this.style.color = 'white';
        });
        
        okBtn.addEventListener('click', function() {
            notification.remove();
        });
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.8); }
                to { opacity: 1; transform: scale(1); }
            }
            .notification-icon { font-size: 2rem; margin-bottom: 15px; }
            .notification-message { font-size: 1.1rem; margin-bottom: 20px; color: #333; }
        `;
        document.head.appendChild(style);
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
    
        fetch('/api/save-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tours: selectedTours,
                total: selectedTours.reduce((sum, tour) => sum + tour.price, 0),
                timestamp: new Date().toISOString()
            })
        }).catch(error => {
            console.error('Error saving order to server:', error);
        });
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
    
            if (price > maxPrice) show = false;
    
            if (duration === 'short' && !desc.includes('день') && price > 25000) show = false;
            if (duration === 'medium' && !(price >= 20000 && price <= 40000)) show = false;
            if (duration === 'long' && price < 40000) show = false;
    
            if (searchText && !name.includes(searchText) && !desc.includes(searchText)) {
                show = false;
            }
    
            card.style.display = show ? '' : 'none';
        });
    }
    
    if (priceRange) {
        priceRange.addEventListener('input', () => {
            priceValue.textContent = parseInt(priceRange.value).toLocaleString() + ' ₽';
            applyFilters();
        });
    }
    
    if (durationFilter) durationFilter.addEventListener('change', applyFilters);
    if (searchFilter) searchFilter.addEventListener('input', applyFilters);
    
    updateOrderSummary();
});