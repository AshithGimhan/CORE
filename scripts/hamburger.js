const hamburgerBtn = document.querySelector('.js-hamburger-btn');
const hamburgerDisplay = document.querySelector('.js-hamburger-display');
const hamburgerCloseBtn = document.querySelector('.js-ham-close-btn');

let hamburgerToggled = false;

hamburgerBtn.addEventListener('click', () => {
    hamburgerDisplay.classList.add('hamburger-menu-visible');

    hamburgerToggled = true;
})

hamburgerCloseBtn.addEventListener('click', () => {
    hamburgerDisplay.classList.remove('hamburger-menu-visible');

    hamburgerToggled = false;
})


document.addEventListener('click', e => {
    if (!hamburgerToggled) {
        return
    }

    const clickedMenu = hamburgerDisplay.contains(e.target)
    const clickedBtn = hamburgerBtn.contains(e.target)

    if (!clickedMenu && !clickedBtn) {
        hamburgerDisplay.classList.remove('hamburger-menu-visible');
        hamburgerToggled = false
    }
})


export function activeNavLinks() {
    const navLinks = document.querySelectorAll('.js-nav-links');
    const currentPage = window.location.pathname.split("/").pop();

    navLinks.forEach(link => {
        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {
            link.classList.add('nav-active')
        } else {
            link.classList.remove('nav-active')
        }
    });

}
