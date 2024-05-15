import { Middleware, JSX } from '@txtdot/sdk';

const HabrNav = new Middleware('Habr Nav', 'Adds navigation in habr pages', [
  'habr.com',
]);

HabrNav.use(async (input, ro, out) => {
  let nav = [...input.document.querySelectorAll('.tm-main-menu__item')];

  return {
    ...out,
    content: (
      <>
        <ul>
          {nav.map((item) => (
            <li>
              <a href={item.getAttribute('href')}>{item.textContent}</a>
            </li>
          ))}
        </ul>
        {out.content}
      </>
    ),
  };
});

export { HabrNav };
