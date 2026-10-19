'use strict';
const form = document.querySelector('#booking');
const result = document.querySelector('#result');
const reset = document.querySelector('#reset');
const chosen = document.querySelector('#chosen');
form.addEventListener('change', () => {
  const selected = form.querySelector('input[name="slot"]:checked');
  chosen.textContent = selected ? selected.value : 'Wybierz godzinę';
  result.textContent = ''; reset.hidden = true;
});
form.addEventListener('submit', event => {
  event.preventDefault();
  const selected = form.querySelector('input[name="slot"]:checked');
  if (!selected || !form.reportValidity()) return;
  const busy = selected.value === '16:30';
  result.className = busy ? 'error' : '';
  result.textContent = busy
    ? 'Ten termin jest już zajęty — symulacja błędu. Wybierz inną godzinę.'
    : `Wybrano ${selected.value}. Potwierdzenie jest symulowane — rezerwacja nie została zapisana.`;
  reset.hidden = false;
  result.focus();
});
reset.addEventListener('click', () => {
  form.reset(); chosen.textContent = 'Wybierz godzinę';
  result.textContent = ''; result.className = ''; reset.hidden = true;
  form.querySelector('input[name="slot"]').focus();
});
