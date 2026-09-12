const year = document.getElementById('year');
if (year) {
  year.textContent = new Date().getFullYear();
}

const b = document.querySelector('.menu-button');
const m = document.querySelector('.menu');

if (b && m) {
  b.addEventListener('click', () => {
    const o = m.classList.toggle('open');
    b.setAttribute('aria-expanded', o);
  });

  document.querySelectorAll('.menu a').forEach(l =>
    l.addEventListener('click', () => {
      m.classList.remove('open');
      b.setAttribute('aria-expanded', 'false');
    })
  );
}

const ob = new IntersectionObserver(es =>
  es.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  }),
  { threshold: .12 }
);

document.querySelectorAll('.reveal').forEach(e => ob.observe(e));

document.querySelectorAll('.copy-email').forEach(button => {
  button.addEventListener('click', async () => {
    const email = button.dataset.email;

    await navigator.clipboard.writeText(email);

    const originalText = button.textContent;
    button.textContent = 'Correu copiat ✓';

    setTimeout(() => {
      button.textContent = originalText;
    }, 2000);
  });
});
