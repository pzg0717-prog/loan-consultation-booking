const dateInput = document.querySelector('#booking-date');
const timeInput = document.querySelector('#booking-time');
const slots = [...document.querySelectorAll('.slot')];
const form = document.querySelector('#booking-form');
const dialog = document.querySelector('#confirmation');
const submitButton = document.querySelector('.submit');

const supabaseUrl = 'https://kpgnltxjrjgcxsohznha.supabase.co';
const supabasePublishableKey = 'sb_publishable_euJyvKyGH3SoyWauqKOizQ_UOH-AdvL';

const today = new Date();
today.setDate(today.getDate() + 1);
dateInput.min = today.toISOString().slice(0, 10);
dateInput.value = dateInput.min;

slots.forEach((slot) => slot.addEventListener('click', () => {
  slots.forEach((item) => item.classList.remove('selected'));
  slot.classList.add('selected');
  timeInput.value = slot.dataset.time;
}));

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!timeInput.value) { alert('상담 시간을 선택해 주세요.'); return; }

  const type = document.querySelector('input[name="type"]:checked').value;
  const booking = {
    consultation_type: type,
    booking_date: dateInput.value,
    booking_time: timeInput.value,
    name: document.querySelector('#name').value.trim(),
    phone: document.querySelector('#phone').value.trim(),
    note: document.querySelector('#note').value.trim() || null,
  };

  submitButton.disabled = true;
  submitButton.textContent = '예약 저장 중…';

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/bookings`, {
      method: 'POST',
      headers: {
        apikey: supabasePublishableKey,
        Authorization: `Bearer ${supabasePublishableKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(booking),
    });

    if (!response.ok) throw new Error('저장 실패');

    document.querySelector('#summary').textContent = '예약 완료되었습니다.';
    dialog.showModal();
    form.reset();
    dateInput.value = dateInput.min;
    timeInput.value = '';
    slots.forEach((item) => item.classList.remove('selected'));
  } catch (error) {
    alert('예약 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = '상담 예약하기';
  }
});

document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
