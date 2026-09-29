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

  const formTotalBooks = document.getElementById('form-total-books');
  const formSubtotal = document.getElementById('form-subtotal');
  const formShipping = document.getElementById('form-shipping');
  const formTotal = document.getElementById('form-total');

  function updateOrder() {
    let books = 0;

    quantityInputs.forEach(input => {
      books += Math.max(0, parseInt(input.value) || 0);
    });

    const subtotalAmount = books * 12;
    const totalAmount = subtotalAmount;

    totalBooks.textContent = books;
    subtotal.textContent = `${subtotalAmount} €`;

    if (books === 0) {
      shipping.textContent = '—';
    } else {
      shipping.textContent = 'Gratuït';
    }

    total.textContent = `${totalAmount} €`;

    formTotalBooks.value = books;
    formSubtotal.value = `${subtotalAmount} €`;
    formShipping.value = books === 0 ? '—' : 'Gratuït';
    formTotal.value = `${totalAmount} €`;

    if (books < 20) {
      message.textContent = `La comanda mínima és de 20 exemplars. En falten ${20 - books}.`;
    } else {
      message.textContent = 'Comanda mínima assolida · Enviament gratuït.';
    }

    const fieldsCompleted = Array.from(requiredFields).every(field =>
      field.value.trim() !== ''
    );

    submitButton.disabled = books < 20 || !fieldsCompleted;
  }

  quantityInputs.forEach(input => {
    input.addEventListener('input', updateOrder);
  });

  requiredFields.forEach(field => {
    field.addEventListener('input', updateOrder);
  });

  orderForm.addEventListener('submit', async event => {
    event.preventDefault();

    const formData = new FormData(orderForm);

    quantityInputs.forEach(input => {
      if ((parseInt(input.value) || 0) === 0) {
        formData.delete(input.name);
      }
    });

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        submitButton.disabled = true;
        submitButton.textContent = 'Comanda enviada ✓';

        const successMessage = document.getElementById('order-success');
        successMessage.hidden = false;
        successMessage.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      } else {
        alert('No s’ha pogut enviar la comanda. Torneu-ho a provar.');
      }
    } catch (error) {
      alert('No s’ha pogut enviar la comanda. Torneu-ho a provar.');
    }
  });

  updateOrder();
}
