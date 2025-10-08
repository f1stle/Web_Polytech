document.addEventListener('DOMContentLoaded', function() {
    
    const tours = [
        { id: 1, name: "Озеро Байкал", desc: "Самое глубокое озеро в мире с кристально чистой водой и уникальной природой.", price: 25000, img: "../scr/scale_1200.jpg", category: "nature" },
        { id: 2, name: "Алтайские горы", desc: "Величественные горы, чистые реки и нетронутая природа Алтая.", price: 20000, img: "../scr/73de6146d554467a50feb195bdf1f683.jpg", category: "nature" },
        { id: 3, name: "Камчатка", desc: "Вулканы, гейзеры и дикая природа Дальнего Востока России.", price: 45000, img: "../scr/scale_33330 (1).jpg", category: "nature" },
        
        { id: 4, name: "Золотое кольцо России", desc: "Древние города России с богатой историей и архитектурой.", price: 18000, img: "../scr/scale_4514.jpg", category: "cultural" },
        { id: 5, name: "Санкт-Петербург", desc: "Культурная столица России с дворцами, музеями и каналами.", price: 22000, img: "../scr/orig.jpg", category: "cultural" },
        { id: 6, name: "Казань", desc: "Слияние восточной и западной культур в столице Татарстана.", price: 19000, img: "../scr/d85d3114-356f-5e97-bddb-c5535bc4593b.jpg", category: "cultural" },

        { id: 7, name: "Треккинг на Эльбрус", desc: "Восхождение на высочайшую вершину России и Европы.", price: 35000, img: "../scr/scale_elb.jpg", category: "adventure" },
        { id: 8, name: "Сплавы по рекам Сибири", desc: "Экстремальные сплавы по горным рекам Сибири и Дальнего Востока.", price: 28000, img: "../scr/1677239693_klau-club-p-rasteniya.jpg", category: "adventure" },
        { id: 9, name: "Сафари на снегоходах", desc: "Экстремальные зимние приключения в заснеженных просторах России.", price: 15000, img: "../scr/ea7b49a9b73189ee74d9996c3f05e477.jpg", category: "adventure" },

        { id: 10, name: "Черноморское побережье", desc: "Тёплое море, галечные и песчаные пляжи Сочи, Анапы и Геленджика.", price: 20000, img: "../scr/imgpreview.jpg", category: "relax" },
        { id: 11, name: "Куршская коса", desc: "Уникальный природный заповедник с песчаными дюнами на Балтийском море.", price: 25000, img: "../scr/scale_cosa.jpg", category: "relax" },
        { id: 12, name: "Озеро Селигер", desc: "Чистейшие озёра и живописные острова в Тверской области.", price: 15000, img: "../scr/7afd2830fc7ae6e6e6f196a6f2316a2a.jpg", category: "relax" }
    ];

    const combos = [
        {
            type: "combo-classic",
            title: 'Комбо "Классика России"',
            price: 65000,
            originalPrice: 76400,
            desc: "Три культурные жемчужины России в одном путешествии",
            benefits: [
                "Экономия 15% на пакете",
                "Единый транспорт между городами",
                "Сопровождение гида на всем маршруте",
                "Проживание в исторических отелях"
            ],
            tours: [
                { name: "Санкт-Петербург", img: "../scr/orig.jpg" },
                { name: "Золотое кольцо", img: "../scr/scale_4514.jpg" },
                { name: "Казань", img: "../scr/d85d3114-356f-5e97-bddb-c5535bc4593b.jpg" }
            ]
        },
        {
            type: "combo-nature",
            title: 'Комбо "Природа Сибири"',
            price: 74400,
            originalPrice: 93000,
            desc: "Величественная природа Сибири от озер до горных рек",
            benefits: [
                "Экономия 20% на пакете",
                "Трансферы между локациями",
                "Снаряжение включено",
                "Экологический туризм"
            ],
            tours: [
                { name: "Байкал", img: "../scr/scale_1200.jpg" },
                { name: "Алтай", img: "../scr/73de6146d554467a50feb195bdf1f683.jpg" },
                { name: "Сплавы", img: "../scr/1677239693_klau-club-p-rasteniya.jpg" }
            ]
        },
        {
            type: "combo-extreme",
            title: 'Комбо "Экстрим и адреналин"',
            price: 80900,
            originalPrice: 98600,
            desc: "Максимум адреналина от вулканов до горных вершин",
            benefits: [
                "Экономия 18% на пакете",
                "Профессиональные инструкторы",
                "Полное снаряжение",
                "Страховка включена"
            ],
            tours: [
                { name: "Камчатка", img: "../scr/scale_33330 (1).jpg" },
                { name: "Эльбрус", img: "../scr/scale_elb.jpg" },
                { name: "Снегоходы", img: "../scr/ea7b49a9b73189ee74d9996c3f05e477.jpg" }
            ]
        }
    ];

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

    renderCombos();

    function renderTours() {
        const containers = {
            nature: document.getElementById('nature-container'),
            cultural: document.getElementById('cultural-container'),
            adventure: document.getElementById('adventure-container'),
            relax: document.getElementById('relax-container')
        };

        tours.forEach(t => {
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
            containers[t.category].appendChild(card);
        });
    }

    renderTours();
    let selectedTours = [];
    let currentTour = null;
    
    const comboModal = document.getElementById('comboModal');
    const closeModal = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    
    loadSelectedTours();
    
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
    
    const continueBtn = document.getElementById('continue-btn');
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
                toursToSelect = getComboTours(['5', '4', '6'], 0.15);
                break;
            case 'combo-nature':
                toursToSelect = getComboTours(['1', '2', '8'], 0.20);
                break;
            case 'combo-extreme':
                toursToSelect = getComboTours(['3', '7', '9'], 0.18);
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
        const tours = [];
        const tourData = {
            '1': { name: 'Озеро Байкал', price: 25000, category: 'nature' },
            '2': { name: 'Алтайские горы', price: 20000, category: 'nature' },
            '3': { name: 'Камчатка', price: 45000, category: 'nature' },
            '4': { name: 'Золотое кольцо России', price: 18000, category: 'cultural' },
            '5': { name: 'Санкт-Петербург', price: 22000, category: 'cultural' },
            '6': { name: 'Казань', price: 19000, category: 'cultural' },
            '7': { name: 'Треккинг на Эльбрус', price: 35000, category: 'adventure' },
            '8': { name: 'Сплавы по рекам Сибири', price: 28000, category: 'adventure' },
            '9': { name: 'Сафари на снегоходах', price: 15000, category: 'adventure' }
        };
        
        tourIds.forEach(id => {
            if (tourData[id]) {
                const discountedPrice = Math.round(tourData[id].price * (1 - discount));
                tours.push({
                    id: id,
                    name: tourData[id].name,
                    price: discountedPrice,
                    category: tourData[id].category,
                    originalPrice: tourData[id].price
                });
            }
        });
        
        return tours;
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