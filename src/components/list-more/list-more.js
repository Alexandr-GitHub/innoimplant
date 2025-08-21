class ListMore {
    constructor({
        parent,
        items,
        btn,
        dropList,
        maxVisible = null,
        classList = {
            dropped: 'ns-list-more--dropped'
        }
    } = {}) {
        this.parent = parent;
        this.items = [...items];
        this.btn = btn;
        this.dropList = dropList;
        this.maxVisible = maxVisible
        this.classList = classList;
        this.initialized = false;
        
        this.init();
    }
    
    init() {
        this.btn.style.visibility = 'hidden';
        
        this.btn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropList();
        });
        
        document.addEventListener('click', (e) => {
            if (!this.parent.contains(e.target)) {
                this.hideDropList();
            }
        });
        
        // Добавляем небольшую задержку для первого расчета
        setTimeout(() => {
            this.calculate();
            this.observe();
            this.initialized = true;
        }, 50);
    }
    
    observe() {
        this.resizeObserver = new ResizeObserver(() => {
            if (this.initialized) {
                this.calculate();
            }
        });
        this.resizeObserver.observe(this.parent);
    }
    
    calculate() {
        // Временно скрываем элементы для точного измерения
        this.items.forEach(item => {
            item.style.display = 'inline-block';
            item.style.visibility = 'hidden';
        });
        this.btn.style.visibility = 'hidden';
        
        // Принудительный рефлоу
        this.parent.offsetHeight;
        
        // Получаем актуальные размеры
        const parentWidth = this.parent.clientWidth;
        const btnWidth = this.btn.offsetWidth;
        this.hiddenItems = [];
        
        // Восстанавливаем видимость и проверяем позиции
        this.items.forEach((item, index) => {
            item.style.visibility = 'visible';
            
            const itemRight = item.offsetLeft + item.offsetWidth;
            if (
                itemRight > parentWidth - btnWidth
                || index >= this.maxVisible
            ) {
                item.style.display = 'none';
                this.hiddenItems.push(item);
            }
        });
        
        // Обновляем кнопку и выпадающий список
        this.updateDropList();
    }
    
    updateDropList() {
        this.dropList.innerHTML = '';
        
        if (this.hiddenItems.length > 0) {
            this.btn.style.visibility = 'visible';
            
            this.hiddenItems.forEach(item => {
                const clone = item.cloneNode(true);
                clone.style.display = 'block';
                this.dropList.appendChild(clone);
            });

            this.dropList.style.left = this.btn.offsetLeft ? `${this.btn.offsetLeft}px` : '100%';
        } else {
            this.hideDropList();
        }
    }
    
    toggleDropList() {
        if (this.parent.classList.contains(this.classList.dropped)) {
            this.hideDropList();
        } else {
            this.showDropList();
        }
    }
    
    showDropList() {
        this.parent.classList.add(this.classList.dropped);
    }
    
    hideDropList() {
        this.parent.classList.remove(this.classList.dropped);
    }
    
    destroy() {
        this.resizeObserver?.disconnect();
        this.btn.removeEventListener('click', this.toggleDropList);
        document.removeEventListener('click', this.hideDropList);
    }
}

export function initListMore() {
    const listMoreContainers = document.querySelectorAll('.ns-list-more');
    
    listMoreContainers.forEach(container => {
        new ListMore({
            parent: container,
            items: container.querySelectorAll('.ns-list-more__list > li'),
            btn: container.querySelector('.ns-list-more__btn'),
            dropList: container.querySelector('.ns-list-more__droplist'),
            maxVisible: 4,
            classList: {
                dropped: 'ns-list-more--dropped'
            }
        });
    });
}