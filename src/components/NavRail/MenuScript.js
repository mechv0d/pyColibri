const anchorEl = document.body.querySelector("#nav-rail-menu-anchor");
const menuEl = document.body.querySelector("#nav-rail-menu-drop");

export function toggleMenu() {
    anchorEl.addEventListener("click", () => {
        menuEl.show();
    });
    return menuEl;
}

