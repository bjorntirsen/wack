const btn = document.getElementById('submit');
let by = document.getElementById('by');
let content = document.getElementById('content');
const form2 = document.getElementById('form2');
form2.addEventListener('keyup', (e) => {
  by.value === '' || content.value === ''
    ? (btn.disabled = true)
    : (btn.disabled = false);
});