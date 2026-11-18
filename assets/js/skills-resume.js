(function(){
  var skillsBox = document.getElementById('skills');
  if (!skillsBox) return;
  var skills = [].slice.call(skillsBox.querySelectorAll('.skill'));
  var items = [].slice.call(document.querySelectorAll('#tl .item'));
  var tabs = [].slice.call(document.querySelectorAll('.tab'));

  function clear(){
    skillsBox.classList.remove('focus');
    skills.forEach(function(s){ s.classList.remove('on'); });
    items.forEach(function(i){ i.classList.remove('active'); });
  }
  function select(item){
    var was = item.classList.contains('active');
    clear();
    var keys = (item.getAttribute('data-skills') || '').split(' ').filter(Boolean);
    if (was || !keys.length) return;
    item.classList.add('active');
    skillsBox.classList.add('focus');
    skills.forEach(function(s){
      if (keys.indexOf(s.getAttribute('data-key')) > -1) s.classList.add('on');
    });
  }
  items.forEach(function(i){
    i.addEventListener('click', function(){ select(i); });
    i.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        select(i);
      }
    });
  });
  tabs.forEach(function(t){
    t.addEventListener('click', function(){
      var f = t.getAttribute('data-f');
      tabs.forEach(function(x){ x.setAttribute('aria-pressed', x === t ? 'true' : 'false'); });
      clear();
      items.forEach(function(i){ i.hidden = !(f === 'all' || i.getAttribute('data-type') === f); });
    });
  });
  if (tabs.length) tabs[0].click();
})();
