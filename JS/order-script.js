document.addEventListener('DOMContentLoaded', function() {
    const selectedTours = JSON.parse(localStorage.getItem('selectedTours') || '[]');
    const orderContent = document.getElementById('order-content');
    const comboDetails = document.getElementById('combo-details');
    const selectedToursInput = document.getElementById('selected-tours');
    const bookingForm = document.querySelector('.booking-form');

    const calendarModal = document.getElementById('calendar-modal');
    const calendarToggle = document.getElementById('calendar-toggle');
    const datesInput = document.getElementById('dates');
    const calendarMonthYear = document.getElementById('calendar-month-year');
    const calendarGrid = document.getElementById('calendar-grid');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const clearDatesBtn = document.getElementById('clear-dates');
    const applyDatesBtn = document.getElementById('apply-dates');
    const selectedDatesDisplay = document.getElementById('selected-dates-display');

    let currentDate = new Date();
    let selectedStartDate = null;
    let selectedEndDate = null;
    let tempEndDate = null;

    const allToursData = {
        '1': { 
            name: 'Озеро Байкал', 
            price: 25000, 
            category: 'nature',
            image: '../scr/scale_1200.jpg',
            description: 'Самое глубокое озеро в мире с кристально чистой водой и уникальной природой.',
            duration: '7 дней'
        },
        '2': { 
            name: 'Алтайские горы', 
            price: 20000, 
            category: 'nature',
            image: '../scr/73de6146d554467a50feb195bdf1f683.jpg',
            description: 'Величественные горы, чистые реки и нетронутая природа Алтая.',
            duration: '6 дней'
        },
        '3': { 
            name: 'Камчатка', 
            price: 45000, 
            category: 'nature',
            image: '../scr/scale_33330 (1).jpg',
            description: 'Вулканы, гейзеры и дикая природа Дальнего Востока России.',
            duration: '10 дней'
        },
        '4': { 
            name: 'Золотое кольцо России', 
            price: 18000, 
            category: 'cultural',
            image: '../scr/scale_4514.jpg',
            description: 'Древние города России с богатой историей и архитектурой.',
            duration: '5 дней'
        },
        '5': { 
            name: 'Санкт-Петербург', 
            price: 22000, 
            category: 'cultural',
            image: '../scr/orig.jpg',
            description: 'Культурная столица России с дворцами, музеями и каналами.',
            duration: '4 дня'
        },
        '6': { 
            name: 'Казань', 
            price: 19000, 
            category: 'cultural',
            image: '../scr/d85d3114-356f-5e97-bddb-c5535bc4593b.jpg',
            description: 'Слияние восточной и западной культур в столице Татарстана.',
            duration: '3 дня'
        },
        '7': { 
            name: 'Треккинг на Эльбрус', 
            price: 35000, 
            category: 'adventure',
            image: '../scr/scale_elb.jpg',
            description: 'Восхождение на высочайшую вершину России и Европы.',
            duration: '8 дней'
        },
        '8': { 
            name: 'Сплавы по рекам Сибири', 
            price: 28000, 
            category: 'adventure',
            image: '../scr/1677239693_klau-club-p-rasteniya.jpg',
            description: 'Экстремальные сплавы по горным рекам Сибири и Дальнего Востока.',
            duration: '7 дней'
        },
        '9': { 
            name: 'Сафари на снегоходах', 
            price: 15000, 
            category: 'adventure',
            image: '../scr/ea7b49a9b73189ee74d9996c3f05e477.jpg',
            description: 'Экстремальные зимние приключения в заснеженных просторах России.',
            duration: '2 дня'
        }
    };

    const comboPatterns = {
        'combo-classic': {
            name: 'Классика России',
            tours: ['5', '4', '6'],
            discount: 0.15,
            benefits: [
                'Единый транспорт между городами',
                'Сопровождение гида на всем маршруте',
                'Проживание в исторических отелях',
                'Входные билеты в музеи включены'
            ],
            totalWithoutDiscount: 59000,
            totalWithDiscount: 50150
        },
        'combo-nature': {
            name: 'Природа Сибири',
            tours: ['1', '2', '8'],
            discount: 0.20,
            benefits: [
                'Трансферы между локациями',
                'Снаряжение включено',
                'Экологический туризм',
                'Профессиональные гиды-инструкторы'
            ],
            totalWithoutDiscount: 73000,
            totalWithDiscount: 58400
        },
        'combo-extreme': {
            name: 'Экстрим и адреналин',
            tours: ['3', '7', '9'],
            discount: 0.18,
            benefits: [
                'Профессиональные инструкторы',
                'Полное снаряжение',
                'Страховка включена',
                'Специальная экипировка'
            ],
            totalWithoutDiscount: 95000,
            totalWithDiscount: 77900
        }
    };

    function initCalendar() {
        renderCalendar();
        setupCalendarEventListeners();
    }

    function setupCalendarEventListeners() {
        calendarToggle.addEventListener('click', toggleCalendar);
        datesInput.addEventListener('click', toggleCalendar);
        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });

        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });

        clearDatesBtn.addEventListener('click', clearSelectedDates);
        applyDatesBtn.addEventListener('click', applySelectedDates);

        calendarModal.addEventListener('click', (e) => {
            if (e.target === calendarModal) {
                closeCalendar();
            }
        });
    }

    function toggleCalendar() {
        if (calendarModal.style.display === 'flex') {
            closeCalendar();
        } else {
            openCalendar();
        }
    }

    function openCalendar() {
        calendarModal.style.display = 'flex';
        renderCalendar();
    }

    function closeCalendar() {
        calendarModal.style.display = 'none';
    }

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        const monthNames = [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];
        calendarMonthYear.textContent = `${monthNames[month]} ${year}`;

        calendarGrid.innerHTML = '';

        const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        dayNames.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day-header';
            dayElement.textContent = day;
            calendarGrid.appendChild(dayElement);
        });

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

        for (let i = 0; i < startingDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day other-month';
            calendarGrid.appendChild(emptyDay);
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            dayElement.dataset.date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            const currentDay = new Date(year, month, day);
            currentDay.setHours(0, 0, 0, 0);

            if (currentDay.getTime() === today.getTime()) {
                dayElement.classList.add('today');
            }

            if (selectedStartDate && currentDay.getTime() === selectedStartDate.getTime()) {
                dayElement.classList.add('start-date');
            } else if (selectedEndDate && currentDay.getTime() === selectedEndDate.getTime()) {
                dayElement.classList.add('end-date');
            } else if (isDateInRange(currentDay)) {
                dayElement.classList.add('range');
            }

            if (currentDay < today) {
                dayElement.classList.add('other-month');
                dayElement.style.cursor = 'not-allowed';
            } else {
                dayElement.addEventListener('click', () => selectDate(currentDay));
            }

            calendarGrid.appendChild(dayElement);
        }

        updateSelectedDatesDisplay();
    }

    function selectDate(date) {
        if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
            selectedStartDate = date;
            selectedEndDate = null;
            tempEndDate = null;
        } else {
            if (date < selectedStartDate) {
                selectedEndDate = selectedStartDate;
                selectedStartDate = date;
            } else {
                selectedEndDate = date;
            }
            tempEndDate = null;
        }
        renderCalendar();
    }

    function isDateInRange(date) {
        if (!selectedStartDate) return false;
        if (selectedEndDate) {
            return date > selectedStartDate && date < selectedEndDate;
        }
        if (tempEndDate) {
            return date > selectedStartDate && date < tempEndDate;
        }
        return false;
    }

    function clearSelectedDates() {
        selectedStartDate = null;
        selectedEndDate = null;
        tempEndDate = null;
        renderCalendar();
    }

    function applySelectedDates() {
        if (selectedStartDate && selectedEndDate) {
            const formatDate = (date) => {
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return `${day}.${month}.${year}`;
            };

            datesInput.value = `${formatDate(selectedStartDate)} - ${formatDate(selectedEndDate)}`;
            closeCalendar();
        } else {
            alert('Пожалуйста, выберите диапазон дат (начальную и конечную дату)');
        }
    }

    function updateSelectedDatesDisplay() {
        if (selectedStartDate && selectedEndDate) {
            const formatDate = (date) => {
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return `${day}.${month}.${year}`;
            };
            selectedDatesDisplay.textContent = `${formatDate(selectedStartDate)} - ${formatDate(selectedEndDate)}`;
        } else if (selectedStartDate) {
            const formatDate = (date) => {
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return `${day}.${month}.${year}`;
            };
            selectedDatesDisplay.textContent = `${formatDate(selectedStartDate)} - выберите конечную дату`;
        } else {
            selectedDatesDisplay.textContent = 'Не выбрано';
        }
    }

    if (selectedTours.length === 0) {
        orderContent.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h3 style="color: #666; margin-bottom: 15px;">Вы еще не выбрали ни одного тура</h3>
                <p style="color: #888; margin-bottom: 20px;">Вернитесь на страницу выбора туров, чтобы добавить их в заказ.</p>
                <a href="tours.html" class="submit-btn" style="display: inline-block; text-decoration: none;">Выбрать туры</a>
            </div>
        `;
        comboDetails.innerHTML = `
            <div class="empty-combo-message">
                <p>Выберите туры, чтобы увидеть детали вашего путешествия</p>
            </div>
        `;
        if (bookingForm) bookingForm.style.display = 'none';
        return;
    }

    function renderOrder() {
        let total = 0;
        let isCombo = false;
        let currentCombo = null;

        for (const [comboId, combo] of Object.entries(comboPatterns)) {
            const selectedIds = selectedTours.map(tour => tour.id);
            if (combo.tours.every(id => selectedIds.includes(id)) && 
                selectedIds.every(id => combo.tours.includes(id))) {
                isCombo = true;
                currentCombo = combo;
                break;
            }
        }

        let orderHTML = '<h3 style="color: #1e3c72; margin-bottom: 20px;">Ваш заказ:</h3>';
        
        selectedTours.forEach((tour, index) => {
            total += tour.price;
            const tourData = allToursData[tour.id];
            
            orderHTML += `
                <div class="order-item">
                    <div class="order-item-info">
                        <div class="order-item-name">${tour.name}</div>
                        <div class="order-item-category">${getCategoryName(tour.category)} • ${tourData?.duration || '7 дней'}</div>
                        <div class="order-item-price">${tour.price.toLocaleString()}₽</div>
                    </div>
                    <button class="delete-btn" data-index="${index}">Удалить</button>
                </div>
            `;
        });

        orderHTML += `
            <div class="order-total">
                <span>Итого к оплате:</span>
                <span>${total.toLocaleString()}₽</span>
            </div>
        `;

        orderContent.innerHTML = orderHTML;
        selectedToursInput.value = JSON.stringify(selectedTours);

        if (isCombo && currentCombo) {
            renderComboDetails(currentCombo);
        } else if (selectedTours.length === 1) {
            renderSingleTourDetails(selectedTours[0]);
        } else {
            renderCustomSelection();
        }

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = this.getAttribute('data-index');
                selectedTours.splice(idx, 1);
                localStorage.setItem('selectedTours', JSON.stringify(selectedTours));
                renderOrder();
                if (selectedTours.length === 0 && bookingForm) {
                    bookingForm.style.display = 'none';
                }
            });
        });
    }

    function renderComboDetails(combo) {
        const savings = combo.totalWithoutDiscount - combo.totalWithDiscount;
        
        let comboHTML = `
            <div class="combo-package">
                <div class="combo-header">
                    <div class="combo-name">${combo.name}</div>
                    <div class="combo-savings">Экономия ${savings.toLocaleString()}₽</div>
                </div>
        `;

        combo.tours.forEach(tourId => {
            const tour = allToursData[tourId];
            const selectedTour = selectedTours.find(t => t.id === tourId);
            const originalPrice = tour.price;
            const discountedPrice = selectedTour ? selectedTour.price : originalPrice;

            if (tour) {
                comboHTML += `
                    <div class="combo-tour-item">
                        <div class="combo-tour-image" style="background-image: url('${tour.image}')"></div>
                        <div class="combo-tour-info">
                            <div class="combo-tour-name">${tour.name}</div>
                            <div class="combo-tour-price">
                                <span class="current-price">${discountedPrice.toLocaleString()}₽</span>
                                <span class="original-price">${originalPrice.toLocaleString()}₽</span>
                            </div>
                        </div>
                    </div>
                `;
            }
        });

        comboHTML += `
                <div class="combo-benefits">
                    <h4>Преимущества комбо:</h4>
                    <ul class="benefits-list">
                        ${combo.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;

        comboDetails.innerHTML = comboHTML;
    }

    function renderSingleTourDetails(tour) {
        const tourData = allToursData[tour.id];
        
        if (tourData) {
            comboDetails.innerHTML = `
                <div class="single-tour-details">
                    <div class="single-tour-image" style="background-image: url('${tourData.image}')"></div>
                    <div class="single-tour-name">${tour.name}</div>
                    <div class="single-tour-price">${tour.price.toLocaleString()}₽</div>
                    <p style="color: #666; margin-bottom: 15px;">${tourData.description}</p>
                    <div style="background: #e3f2fd; padding: 15px; border-radius: 8px;">
                        <strong>Длительность:</strong> ${tourData.duration}<br>
                        <strong>Тип:</strong> ${getCategoryName(tour.category)}
                    </div>
                </div>
            `;
        }
    }

    function renderCustomSelection() {
        comboDetails.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h4 style="color: #1e3c72; margin-bottom: 15px;">Индивидуальный подбор</h4>
                <p style="color: #666; margin-bottom: 15px;">Вы создали уникальную комбинацию туров!</p>
                <div style="background: #fff3e0; padding: 15px; border-radius: 8px;">
                    <strong>Общая стоимость:</strong> ${selectedTours.reduce((sum, tour) => sum + tour.price, 0).toLocaleString()}₽<br>
                    <strong>Количество туров:</strong> ${selectedTours.length}
                </div>
            </div>
        `;
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

    document.getElementById('booking-form').addEventListener('submit', function(e) {
        if (selectedTours.length === 0) {
            e.preventDefault();
            alert('Пожалуйста, выберите хотя бы один тур');
            return false;
        }

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const dates = document.getElementById('dates').value;
        const participants = document.getElementById('participants').value;

        if (!name || !email || !phone || !dates || !participants) {
            e.preventDefault();
            alert('Пожалуйста, заполните все обязательные поля');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            e.preventDefault();
            alert('Пожалуйста, введите корректный email адрес');
            return false;
        }

        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length < 10) {
            e.preventDefault();
            alert('Пожалуйста, введите корректный номер телефона');
            return false;
        }

        const dateRegex = /^\d{2}\.\d{2}\.\d{4} - \d{2}\.\d{2}\.\d{4}$/;
        if (!dateRegex.test(dates)) {
            e.preventDefault();
            alert('Пожалуйста, введите даты в формате: дд.мм.гггг - дд.мм.гггг');
            return false;
        }

        if (participants < 1 || participants > 20) {
            e.preventDefault();
            alert('Количество участников должно быть от 1 до 20');
            return false;
        }

        e.preventDefault();
        showSuccessNotification();
    });

    function showSuccessNotification() {
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">✅</div>
                <h3>Бронирование успешно отправлено!</h3>
                <p>Мы свяжемся с вами в ближайшее время для подтверждения заказа.</p>
                <button class="notification-ok-btn">Отлично!</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        const content = notification.querySelector('.notification-content');
        const okBtn = notification.querySelector('.notification-ok-btn');
        
        okBtn.addEventListener('click', function() {
            notification.remove();
        });
    }
    renderOrder();
    initCalendar();
});