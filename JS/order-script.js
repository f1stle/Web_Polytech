// order-script.js
document.addEventListener('DOMContentLoaded', function() {
    // Очищаем старые данные при загрузке страницы
    localStorage.removeItem('oldSelectedTours');
    
    // Получаем выбранные туры из localStorage
    const selectedTours = JSON.parse(localStorage.getItem('selectedTours') || '[]');
    const orderContent = document.getElementById('order-content');
    const selectedToursInput = document.getElementById('selected-tours');
    const bookingForm = document.querySelector('.booking-form');
    
    if (selectedTours.length === 0) {
        orderContent.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h3>Вы еще не выбрали ни одного тура</h3>
                <p>Вернитесь на страницу <a href="tours.html">выбора туров</a>, чтобы добавить их в заказ.</p>
            </div>
        `;
        if (bookingForm) bookingForm.style.display = 'none';
        return;
    }
    
    // Формируем содержимое заказа
    let total = 0;
    let orderHTML = '<h3>Выбранные туры:</h3>';
    
    selectedTours.forEach(tour => {
        total += tour.price;
        orderHTML += `
            <div class="order-item">
                <span>${tour.name}</span>
                <span>${tour.price.toLocaleString()}₽</span>
            </div>
        `;
    });
    
    orderHTML += `
        <div class="order-total">
            <span>Итого:</span>
            <span>${total.toLocaleString()}₽</span>
        </div>
    `;
    
    orderContent.innerHTML = orderHTML;
    selectedToursInput.value = JSON.stringify(selectedTours);
    
    // Добавляем валидацию формы
    document.getElementById('booking-form').addEventListener('submit', function(e) {
        const selectedTours = JSON.parse(localStorage.getItem('selectedTours') || '[]');
        
        if (selectedTours.length === 0) {
            e.preventDefault();
            alert('Пожалуйста, выберите хотя бы один тур');
            return false;
        }
        
        // Дополнительная проверка основных полей
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
        
        // Проверка формата email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            e.preventDefault();
            alert('Пожалуйста, введите корректный email адрес');
            return false;
        }
        
        // Проверка формата телефона (минимум 10 цифр)
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length < 10) {
            e.preventDefault();
            alert('Пожалуйста, введите корректный номер телефона');
            return false;
        }
        
        // Проверка формата дат
        const dateRegex = /^\d{2}\.\d{2}\.\d{4} - \d{2}\.\d{2}\.\d{4}$/;
        if (!dateRegex.test(dates)) {
            e.preventDefault();
            alert('Пожалуйста, введите даты в формате: дд.мм.гггг - дд.мм.гггг');
            return false;
        }
        
        // Проверка количества участников
        if (participants < 1 || participants > 20) {
            e.preventDefault();
            alert('Количество участников должно быть от 1 до 20');
            return false;
        }
    });
});