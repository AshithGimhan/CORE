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

export function generatePageNumbers(data, itemsPerPage = 5) {
    if (!data || data.length === 0) return '';

    const currentPage = getCurrentPage();

    const totalPageNumbers = Math.ceil(data.length / itemsPerPage);

    const maxVisiblePages = 3;

    let startPage = currentPage - 1;
    let endPage = currentPage + 1;

    let pageNumberHTML = '';

    if (startPage < 1) {
        startPage = 1
        endPage = Math.min(maxVisiblePages, totalPageNumbers)

    }
    if (endPage > totalPageNumbers) {
        startPage = Math.max(1, totalPageNumbers - maxVisiblePages + 1)
        endPage = totalPageNumbers
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumberHTML += `<button class="js-page-number-btn page-number-btn ${i === currentPage ? 'active-page-number' : ''}" data-page-id="${i}">${i}</button>`;
    }

    return pageNumberHTML;
}
