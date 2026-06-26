let currentPage = 1;

export function handlePage(event) {
    const card = event.target.closest('.js-page-number-btn');

    if (!card) return;

    updatePage(Number(card.dataset.pageId));
}

export function updatePage(pageId) {
    currentPage = pageId;
}

export function getCurrentPage() {
    return currentPage;
}

export function resetPage() {
    currentPage = 1;
}

export function generatePageNumbers(data) {
    if (!data || data.length === 0) return '';

    const pageNumbers = Math.ceil(data.length / 5);
    let pageNumberHTML = '';

    for (let i = 1; i <= pageNumbers; i++) {
        pageNumberHTML += `<button class="js-page-number-btn page-number-btn ${i === currentPage ? 'active-page-number' : ''}" data-page-id="${i}">${i}</button>`;
    }

    return pageNumberHTML;
}
