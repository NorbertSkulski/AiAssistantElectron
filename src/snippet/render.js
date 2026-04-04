let startX, startY, selection;
  
window.onmousedown = (e) => {
  selection = document.getElementById('selection');
  startX = e.clientX;
  startY = e.clientY;
  selection.style.left = startX + 'px';
  selection.style.top = startY + 'px';
  selection.style.display = 'block';
};

window.onmousemove = (e) => {
  if (!selection) return;
  const width = e.clientX - startX;
  const height = e.clientY - startY;
  selection.style.width = Math.abs(width) + 'px';
  selection.style.height = Math.abs(height) + 'px';
  selection.style.left = (width > 0 ? startX : e.clientX) + 'px';
  selection.style.top = (height > 0 ? startY : e.clientY) + 'px';
};

window.onmouseup = async (e) => {
  const rect = selection.getBoundingClientRect();
  await window.api.sendAreaSelected({
    x: rect.left,
    y: rect.top,
    width: rect.width,
    height: rect.height
  });
  selection = null;
};