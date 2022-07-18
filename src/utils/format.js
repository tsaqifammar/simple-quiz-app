function decodeEntity(inputStr) {
  // unsafe, but this will do for now
  var textarea = document.createElement('textarea');
  textarea.innerHTML = inputStr;
  return textarea.value;
}

export const formatQuestion = (q) => decodeEntity(q);
