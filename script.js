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

const orderForm = document.getElementById('school-order-form');

if (orderForm) {
  const quantityInputs = document.querySelectorAll('.book-quantity');
  const totalBooks = document.getElementById('order-total-books');
  const subtotal = document.getElementById('order-subtotal');
  const shipping = document.getElementById('order-shipping');
  const total = document.getElementById('order-total');
  const message = document.getElementById('order-message');
  const submitButton = orderForm.querySelector('.school-order-submit');
  const requiredFields = orderForm.querySelectorAll('[required]');
  
  function updateOrder() {
    let books = 0;

    quantityInputs.forEach(input => {
      books += Math.max(0, parseInt(input.value) || 0);
    });

    const subtotalAmount = books * 12;

    let shippingAmount = 0;

    if (books >= 25 && books < 50) {
      shippingAmount = 20;
    }

    const totalAmount = subtotalAmount + shippingAmount;

    totalBooks.textContent = books;
    subtotal.textContent = `${subtotalAmount} €`;

    if (books === 0) {
      shipping.textContent = '—';
    } else if (books < 25) {
      shipping.textContent = '—';
    } else if (books < 50) {
      shipping.textContent = '20 €';
    } else {
      shipping.textContent = 'Gratuït';
    }

    total.textContent = `${totalAmount} €`;

    if (books < 25) {
      message.textContent = `La comanda mínima és de 25 exemplars. En falten ${25 - books}.`;
      submitButton.disabled = true;
    } else if (books < 50) {
      message.textContent = 'Comanda mínima assolida.';
      submitButton.disabled = false;
    } else {
      message.textContent = 'Enviament gratuït.';
      submitButton.disabled = false;
    }
  }

  quantityInputs.forEach(input => {
    input.addEventListener('input', updateOrder);
  });

  updateOrder();
}
