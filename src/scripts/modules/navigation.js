export const burgerMenu = (array = []) => {
  if (!array.length || !Array.isArray(array)) return;

  const burger = document.querySelector('.burger-js');
  const burgerContentPart = document.querySelector('.burger-content-js');
  const burgerToggler = [...document.querySelectorAll('.burger-toggle-js')];

  if (!burgerContentPart || !burgerToggler.length || !burger) return;
  const menuItems = [...new Set(array)];

  const toggleBurger = () => {
    document.querySelector('html').toggleAttribute('no-scroll');
    burger.classList.toggle('opened');
  };

  menuItems.forEach((selector, index) => {
    const menu = document.querySelector(`${selector}`);
    if (!menu) return;

    const menuClone = menu.cloneNode(true);
    menuClone.removeAttribute('class');
    menuClone.classList = `burger__menu burger-menu-${index + 1}`;
    burgerContentPart.appendChild(menuClone);
  });

  burgerToggler.forEach((button) => {
    button.addEventListener('click', toggleBurger);
  });

  document.addEventListener('keydown', (e) => {
    if (!burger.classList.contains('opened')) return;
    if (e.keyCode === 27) {
      toggleBurger();
    }
  });
};
