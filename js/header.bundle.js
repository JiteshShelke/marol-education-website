/* =============================
   Load header.html into #header-container
============================= */
(function(){
  function loadHeader() {
    var host = document.getElementById('header-container');
    if (!host) return;
    fetch('header.html')
      .then(function(r){ return r.text(); })
      .then(function(html){
        host.innerHTML = html;
        // After injecting, initialize behaviors
        initHeaderBehaviors();
      })
      .catch(function(err){ console.error('Error loading header:', err); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadHeader);
  } else {
    loadHeader();
  }
})();

/* =============================
   Initialize all header behaviors
============================= */
function initHeaderBehaviors(){
  var header = document.querySelector('.site-header');
  if (!header) return;

  initClock(header);
  initMobileToggle(header);
  initAutoScrollActive(header);
  initDropdowns(header);
}

/* =============================
   Live clock
   Expects elements: #me-date, #me-hh, #me-mm, #me-ss, #me-ampm
============================= */
function initClock(scope){
  function pad(n){ return n<10 ? '0'+n : ''+n; }
  function update(){
    var now = new Date();
    var hh = now.getHours();
    var ampm = hh >= 12 ? 'p.m.' : 'a.m.';
    hh = hh % 12; if (hh === 0) hh = 12;

    var d = scope.querySelector('#me-date');
    if (d) d.textContent = now.toLocaleDateString(undefined, { weekday:'short', day:'2-digit', month:'short', year:'numeric' });

    var H = scope.querySelector('#me-hh');
    var M = scope.querySelector('#me-mm');
    var S = scope.querySelector('#me-ss');
    var A = scope.querySelector('#me-ampm');
    if (H) H.textContent = pad(hh);
    if (M) M.textContent = pad(now.getMinutes());
    if (S) S.textContent = pad(now.getSeconds());
    if (A) A.textContent = ampm;
  }
  update();
  setInterval(update, 1000);
}

/* =============================
   Mobile menu toggle
   Toggles .is-open on #primaryMenu and updates aria-expanded
============================= */
function initMobileToggle(scope){
  var toggle = scope.querySelector('.nav-toggle');
  var menu = scope.querySelector('#primaryMenu');
  if (!toggle || !menu) return;

  function openMenu(setOpen){
    var open = typeof setOpen === 'boolean' ? setOpen : !menu.classList.contains('is-open');
    if (open) {
      menu.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
    } else {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  }

  toggle.addEventListener('click', function(e){
    e.stopPropagation();
    openMenu();
  });

  // Click outside closes menu (only when open)
  document.addEventListener('click', function(e){
    if (!menu.classList.contains('is-open')) return;
    if (!scope.contains(e.target)) openMenu(false);
  });

  // Escape closes menu
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      openMenu(false);
      toggle.focus();
    }
  });

  // Close after clicking any link inside menu (optional)
  menu.addEventListener('click', function(e){
    var link = e.target.closest('a');
    if (link) openMenu(false);
  });
}

/* =============================
   Auto-scroll active menu item into view
============================= */
function initAutoScrollActive(scope){
  var track = scope.querySelector('.menu-track');
  var active = scope.querySelector('.menu-item.active');
  if (!track || !active) return;

  // Defer to allow layout to settle after fonts load
  setTimeout(function(){
    var t = track.getBoundingClientRect();
    var a = active.getBoundingClientRect();
    track.scrollLeft += (a.left - t.left) - (t.width/2 - a.width/2);
  }, 50);
}

/* =============================
   Dropdowns (mobile/touch friendly)
   Structure: .menu-item.has-dropdown > .menu-link + .dd-toggle + .dropdown
============================= */
function initDropdowns(scope){
  // Open/close with caret on all sizes
  scope.addEventListener('click', function(e){
    var caret = e.target.closest('.dd-toggle');
    if (caret) {
      e.preventDefault();
      e.stopPropagation();
      var parent = caret.closest('.has-dropdown');
      var open = parent.classList.toggle('open');
      caret.setAttribute('aria-expanded', open ? 'true' : 'false');
      return;
    }
  });

  // On mobile (<992px), allow tapping the label to toggle as well
  scope.addEventListener('click', function(e){
    var label = e.target.closest('.menu-item.has-dropdown > .menu-link');
    if (!label) return;
    if (window.matchMedia('(max-width: 991.98px)').matches) {
      e.preventDefault();
      var p = label.parentElement;
      var tgl = p.querySelector('.dd-toggle');
      var state = p.classList.toggle('open');
      if (tgl) tgl.setAttribute('aria-expanded', state ? 'true' : 'false');
    }
  });

  // Close open dropdowns on outside click (mobile)
  document.addEventListener('click', function(e){
    if (!window.matchMedia('(max-width: 991.98px)').matches) return;
    var openItems = scope.querySelectorAll('.menu-item.has-dropdown.open');
    openItems.forEach(function(item){
      if (!item.contains(e.target)) {
        item.classList.remove('open');
        var t = item.querySelector('.dd-toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close open dropdowns with Escape (mobile)
  document.addEventListener('keydown', function(e){
    if (e.key !== 'Escape') return;
    if (!window.matchMedia('(max-width: 991.98px)').matches) return;
    var openItems = scope.querySelectorAll('.menu-item.has-dropdown.open');
    openItems.forEach(function(item){
      item.classList.remove('open');
      var t = item.querySelector('.dd-toggle');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  });
}
