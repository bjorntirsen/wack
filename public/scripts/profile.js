const input = document.getElementById('profile_pic');
const label = input.nextElementSibling;
const labelVal = label.innerHTML;

input.addEventListener('change', function (e) {
  var fileName = '';
  fileName = e.target.value;

  if (fileName) label.innerHTML = fileName;
  else label.innerHTML = labelVal;
});
