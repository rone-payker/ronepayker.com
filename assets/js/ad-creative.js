(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll('.item'));
  var box = document.getElementById('lightbox');
  var stage = document.getElementById('lbStage');
  var count = document.getElementById('lbCount');
  var current = 0, lastFocus = null;
 
  function render(i) {
    current = (i + items.length) % items.length;
    var item = items[current];
    var img = item.querySelector('img');
    stage.innerHTML = '';
    var el;
    if (img) {
      el = document.createElement('img');
      el.src = img.currentSrc || img.src;
      el.alt = img.alt;
    } else {
      el = document.createElement('div');
      el.className = 'lb-ph';
      el.style.aspectRatio = getComputedStyle(item).getPropertyValue('--r').trim();
      el.textContent = item.querySelector('.ph').textContent;
    }
    stage.appendChild(el);
    count.textContent = (current + 1) + ' / ' + items.length;
  }
 
  function open(i) {
    lastFocus = document.activeElement;
    render(i);
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () { box.classList.add('open'); });
    document.getElementById('lbClose').focus();
  }
 
  function close() {
    box.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function () { box.hidden = true; }, 250);
    if (lastFocus) lastFocus.focus();
  }
 
  items.forEach(function (item, i) {
    item.addEventListener('click', function () { open(i); });
  });
 
  document.getElementById('lbClose').addEventListener('click', close);
  document.getElementById('lbPrev').addEventListener('click', function () { render(current - 1); });
  document.getElementById('lbNext').addEventListener('click', function () { render(current + 1); });
 
  // Click on the dark backdrop closes it
  box.addEventListener('click', function (e) {
    if (e.target === box || e.target === stage) close();
  });
 
  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') render(current - 1);
    if (e.key === 'ArrowRight') render(current + 1);
  });
})();