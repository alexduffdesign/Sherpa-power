class Carousel {
  constructor(element) {
    this.element = element;
    this.track = element.querySelector('.carousel__track');
    this.leftButton = element.querySelector('.carousel__button--left');
    this.rightButton = element.querySelector('.carousel__button--right');
    this.items = [];
    this.currentIndex = 0;

    this.leftButton.addEventListener('click', () => this.move('left'));
    this.rightButton.addEventListener('click', () => this.move('right'));
  }

  addItem(content) {
    const item = document.createElement('div');
    item.className = 'carousel__item';
    item.innerHTML = content;
    this.track.appendChild(item);
    this.items.push(item);
    this.updateVisibility();
  }

  move(direction) {
    if (direction === 'left') {
      this.currentIndex = Math.max(0, this.currentIndex - 1);
    } else {
      this.currentIndex = Math.min(this.items.length - 1, this.currentIndex + 1);
    }
    this.updateVisibility();
  }

  updateVisibility() {
    this.items.forEach((item, index) => {
      item.style.display = index === this.currentIndex ? 'block' : 'none';
    });
    this.leftButton.disabled = this.currentIndex === 0;
    this.rightButton.disabled = this.currentIndex === this.items.length - 1;
  }
}

export default Carousel;