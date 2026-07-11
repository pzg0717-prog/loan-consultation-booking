const dateInput = document.querySelector('#booking-date');
const timeInput = document.querySelector('#booking-time');
const slots = [...document.querySelectorAll('.slot')];
const form = document.querySelector('#booking-form');
const dialog = document.querySelector('#confirmation');
const bookingEndpoint = 'https://docs.google.com/forms/d/e/1FAIpQLSe4y1dAJPZsEPno9gFnOcYpep_Q5RLltOkigkAVZaipKdG46Q/formResponse';
const storageFrame = document.createElement('iframe');

storageFrame.name = 'booking-storage-frame';
storageFrame.hidden = true;
document.body.append(storageFrame);

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
  const booking = new URLSearchParams({
    'entry.1254580268': [
      `상담 종류: ${type}`,
      `희망 날짜: ${dateInput.value}`,
      `희망 시간: ${timeInput.value}`,
      `이름: ${document.querySelector('#name').value.trim()}`,
      `휴대폰 번호: ${document.querySelector('#phone').value.trim()}`,
      `남길 말씀: ${document.querySelector('#note').value.trim() || '-'}`,
    ].join('\n'),
  });

  const sender = document.createElement('form');
  sender.action = bookingEndpoint;
  sender.method = 'POST';
  sender.target = storageFrame.name;
  sender.hidden = true;
  [...booking.entries()].forEach(([name, value]) => {
    const field = document.createElement('input');
    field.name = name;
    field.value = value;
    sender.append(field);
  });
  document.body.append(sender);
  sender.submit();
  sender.remove();

  const date = new Intl.DateTimeFormat('ko-KR', { month:'long', day:'numeric', weekday:'short' }).format(new Date(`${dateInput.value}T00:00:00`));
  document.querySelector('#summary').textContent = `${type} · ${date} ${timeInput.value}에 상담을 요청했습니다. 담당자가 연락드릴게요.`;
  dialog.showModal();
});

document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
