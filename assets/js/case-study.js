(function () {
  var pills = document.querySelectorAll('.pill');
  var portfolioItems = document.querySelectorAll('.portfolio-item');

  pills.forEach(function (btn) {
    btn.addEventListener('click', function () {
      pills.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      var filterValue = btn.getAttribute('data-filter') || '*';
      var isoContainer = document.querySelector('.isotope-container');

      if (window.Isotope && isoContainer) {
        var isoInstance = window.Isotope.data(isoContainer);
        if (isoInstance) {
          isoInstance.arrange({ filter: filterValue === 'all' ? '*' : filterValue });
          return;
        }
      }

      portfolioItems.forEach(function (item) {
        if (filterValue === '*' || filterValue === 'all' || item.classList.contains(filterValue.replace('.', ''))) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
})();
