const dateInput = document.querySelector('#booking-date');
const timeInput = document.querySelector('#booking-time');
const slots = [...document.querySelectorAll('.slot')];
const form = document.querySelector('#booking-form');
const dialog = document.querySelector('#confirmation');

const today = new Date();
today.setDate(today.getDate() + 1);
dateInput.min = today.toISOString().slice(0, 10);
dateInput.value = dateInput.min;

slots.forEach((slot) => slot.addEventListener('click', () => {
  slots.forEach((item) => item.classList.remove('selected'));
  slot.classList.add('selected');
  timeInput.value = slot.dataset.time;
}));

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!timeInput.value) { alert('상담 시간을 선택해 주세요.'); return; }
  const type = document.querySelector('input[name="type"]:checked').value;
  const date = new Intl.DateTimeFormat('ko-KR', { month:'long', day:'numeric', weekday:'short' }).format(new Date(`${dateInput.value}T00:00:00`));
  document.querySelector('#summary').textContent = `${type} · ${date} ${timeInput.value}에 상담을 요청했습니다. 담당자가 연락드릴게요.`;
  dialog.showModal();
});

document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
