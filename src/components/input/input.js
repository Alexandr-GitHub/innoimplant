export function initInputs() {
    let resizeObserver = null;

    // Функция для обработки изменений размеров .ns-input__action
    const handleResize = (entries) => {
        for (const entry of entries) {
            const actionElement = entry.target;
            const width = actionElement.offsetWidth;
            const input = actionElement.closest('.ns-input');
            if (input) {
                if (width > 0) {
                    input.style.setProperty('--ns-input-actions-button-size', `${width}px`);
                } else {
                    input.style.removeProperty('--ns-input-actions-button-size');
                }
            }
        }
    };

    // Создаем ResizeObserver
    resizeObserver = new ResizeObserver(handleResize);

    // Функция для проверки и наблюдения за .ns-input__action внутри .ns-input
    const observeActionElements = (nsInput) => {
        const actionElement = nsInput.querySelector('.ns-input__actions');
        if (actionElement) {
            resizeObserver.observe(actionElement);
        }
    };

    // MutationObserver для отслеживания появления .ns-input
    const mutationObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.matches('.ns-input')) observeActionElements(node);
                    
                    const inputs = node.querySelectorAll ? node.querySelectorAll('.ns-input') : [];
                    for (const input of inputs) observeActionElements(input);
                }
            }
        }
    });

    // Начинаем наблюдение за документом
    mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Также проверяем уже существующие элементы при загрузке страницы
    const inputs = document.querySelectorAll('.ns-input');

    if (inputs.length > 0) inputs.forEach(observeActionElements);

    // Делегированная обработка кликов для кнопок действий
    document.addEventListener('click', (event) => {
        const parentInput = event.target.closest('.ns-input').querySelector('input');
        
        const actionButton = event.target.closest('.ns-input__actions--clear');
        if (actionButton) {
            event.preventDefault();

            parentInput.value = '';
        }

        const decrementButton = event.target.closest('.ns-input__number-button--dec');
        const incrementButton = event.target.closest('.ns-input__number-button--inc');
        if (decrementButton || incrementButton && parentInput.type === 'number') {
            const step = parentInput.step ? parseFloat(parentInput.step) : 1;
            const min = parentInput.min ? parseFloat(parentInput.min) : -Infinity;
            const max = parentInput.max ? parseFloat(parentInput.max) : Infinity;
            const value = parseFloat(parentInput.value) + (incrementButton ? step : -step);

            if (value >= min && value <= max) {
                try {
                    event.preventDefault();
                    parentInput.value = value;
                } catch (e) {
                    console.error('Ошибка при изменении значения input:', e);
                }
            }
        }
    });
}