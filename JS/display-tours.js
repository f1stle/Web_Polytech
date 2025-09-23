// display-tours.js
document.addEventListener('DOMContentLoaded', function() {
    // Сортируем туры по алфавиту
    const sortedTours = tours.sort((a, b) => a.name.localeCompare(b.name));
    
    // Создаем контейнеры для каждой категории
    const categories = ['nature', 'cultural', 'adventure', 'relax'];
    
    categories.forEach(category => {
        const section = document.getElementById(`${category}-tours`);
        if (section) {
            const container = document.createElement('div');
            container.className = 'tours-container';
            container.setAttribute('data-category', category);
            section.appendChild(container);
        }
    });
    
    // Отображаем туры по категориям
    sortedTours.forEach(tour => {
        const container = document.querySelector(`.tours-container[data-category="${tour.category}"]`);
        if (container) {
            const tourElement = createTourCard(tour);
            container.appendChild(tourElement);
        }
    });
});

function createTourCard(tour) {
    const card = document.createElement('div');
    card.className = 'tour-card';
    card.setAttribute('data-tour', tour.keyword); // data-атрибут с названием на латинице
    
    card.innerHTML = `
        <div class="tour-image-container">
            <img src="../images/${tour.image}.jpg" alt="${tour.name}" class="tour-image" 
                 onerror="this.src='../images/default-tour.jpg'">
        </div>
        <div class="tour-info">
            <h3 class="tour-title">${tour.name}</h3>
            <p class="tour-description">${tour.description}</p>
            <div class="tour-details">
                <span class="tour-duration">⏱ ${tour.duration}</span>
                <span class="tour-price">${tour.price.toLocaleString()}₽</span>
            </div>
            <button class="select-tour-btn">Выбрать тур</button>
        </div>
    `;
    
    return card;
}