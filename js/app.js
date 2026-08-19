/* =========================================================================
   PATCHES ZONE — Global App Script
   Header, mobile drawer, dark mode, back-to-top, loader, custom cursor
   ========================================================================= */
(function(){
  "use strict";

  /* ---------- Preloader ---------- */
  window.addEventListener('load', function(){
    var loader = document.getElementById('loader');
    if(loader){
      setTimeout(function(){ loader.classList.add('hide'); }, 350);
    }
  });

  /* ---------- Sticky header shadow ---------- */
  var header = document.querySelector('header');
  function onScrollHeader(){
    if(!header) return;
    if(window.scrollY > 12){ header.classList.add('scrolled'); }
    else{ header.classList.remove('scrolled'); }
  }
  document.addEventListener('scroll', onScrollHeader, {passive:true});
  onScrollHeader();

  /* ---------- Mobile drawer ---------- */
  var burger = document.querySelector('.burger');
  var drawer = document.querySelector('.drawer');
  var overlay = document.querySelector('.drawer-overlay');
  var drawerClose = document.querySelector('.drawer-close');
  function openDrawer(){ drawer.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow='hidden'; }
  function closeDrawer(){ drawer.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow=''; }
  if(burger){ burger.addEventListener('click', openDrawer); }
  if(drawerClose){ drawerClose.addEventListener('click', closeDrawer); }
  if(overlay){ overlay.addEventListener('click', closeDrawer); }

  /* ---------- Dark mode toggle ---------- */
  var darkToggle = document.querySelectorAll('.dark-toggle');
  var root = document.documentElement;
  function applyDarkPref(){
    var pref = localStorage.getItem('pz-theme');
    if(pref === 'dark'){ root.classList.add('dark'); }
    else{ root.classList.remove('dark'); }
    darkToggle.forEach(function(btn){
      var icon = btn.querySelector('i');
      if(icon){ icon.className = pref === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon'; }
    });
  }
  applyDarkPref();
  darkToggle.forEach(function(btn){
    btn.addEventListener('click', function(){
      var isDark = root.classList.toggle('dark');
      localStorage.setItem('pz-theme', isDark ? 'dark' : 'light');
      applyDarkPref();
    });
  });

  /* ---------- Back to top ---------- */
  var toTop = document.querySelector('.float-top');
  if(toTop){
    document.addEventListener('scroll', function(){
      if(window.scrollY > 500){ toTop.classList.add('show'); }
      else{ toTop.classList.remove('show'); }
    }, {passive:true});
    toTop.addEventListener('click', function(){
      window.scrollTo({top:0, behavior:'smooth'});
    });
  }

  /* ---------- Custom cursor ---------- */
  var dot = document.querySelector('.cursor-dot');
  var ring = document.querySelector('.cursor-ring');
  if(dot && ring && window.matchMedia('(hover: hover)').matches){
    var rx = 0, ry = 0, mx = 0, my = 0;
    document.addEventListener('mousemove', function(e){
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    });
    (function loop(){
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button, .type-card, .cat-card, .g-card, .pill, .swatch').forEach(function(el){
      el.addEventListener('mouseenter', function(){ ring.classList.add('big'); });
      el.addEventListener('mouseleave', function(){ ring.classList.remove('big'); });
    });
  }

  /* ---------- Button ripple effect ---------- */
  document.querySelectorAll('.btn').forEach(function(btn){
    btn.addEventListener('click', function(e){
      var rect = btn.getBoundingClientRect();
      var ripple = document.createElement('span');
      ripple.className = 'ripple';
      var size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
      btn.appendChild(ripple);
      setTimeout(function(){ ripple.remove(); }, 650);
    });
  });

  /* ---------- Lazy image "loaded" state (for shimmer removal) ---------- */
  document.querySelectorAll('img[loading="lazy"]').forEach(function(img){
    if(img.complete){ img.classList.add('loaded'); }
    else{ img.addEventListener('load', function(){ img.classList.add('loaded'); }); }
  });

  /* ---------- Current year in footer ---------- */
  document.querySelectorAll('.cur-year').forEach(function(el){ el.textContent = new Date().getFullYear(); });

})();

/* =========================================================================
   Shared interactive widgets: FAQ accordion, Gallery filter + Lightbox, Tabs
   ========================================================================= */
(function(){
  "use strict";

  /* FAQ accordion (works on home + faq.html) */
  document.querySelectorAll('.faq-item').forEach(function(item){
    var q = item.querySelector('.faq-q');
    if(!q) return;
    q.addEventListener('click', function(){
      var isOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(function(i){ i.classList.remove('open'); });
      if(!isOpen){ item.classList.add('open'); }
    });
  });

  /* Gallery filter (home preview + gallery.html) */
  document.querySelectorAll('.gal-tabs').forEach(function(tabGroup){
    var tabs = tabGroup.querySelectorAll('.gal-tab');
    var gridId = tabGroup.dataset.target;
    var grid = gridId ? document.getElementById(gridId) : tabGroup.nextElementSibling;
    tabs.forEach(function(tab){
      tab.addEventListener('click', function(){
        tabs.forEach(function(t){ t.classList.remove('active'); });
        tab.classList.add('active');
        var cat = tab.dataset.cat;
        grid.querySelectorAll('.g-card').forEach(function(card){
          card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
        });
      });
    });
  });

  /* Lightbox */
  var lightbox = document.getElementById('lightbox');
  if(lightbox){
    var lbInner = document.getElementById('lightboxInner');
    var lbCap = document.getElementById('lightboxCap');
    var lbClose = document.getElementById('lightboxClose');
    document.querySelectorAll('.g-card').forEach(function(card){
      card.addEventListener('click', function(){
        var inner = card.querySelector('.g-inner');
        lbInner.className = 'lightbox-inner ' + (inner ? inner.className.replace('g-inner','') : '');
        lbInner.style.background = getComputedStyle(inner).background;
        lbInner.innerHTML = inner.innerHTML;
        var cap = card.querySelector('h4');
        lbCap.textContent = cap ? cap.textContent : '';
        lightbox.classList.add('open');
      });
    });
    function closeLb(){ lightbox.classList.remove('open'); }
    if(lbClose){ lbClose.addEventListener('click', closeLb); }
    lightbox.addEventListener('click', function(e){ if(e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeLb(); });
  }

  /* Generic tabs (used on product/spec panels) */
  document.querySelectorAll('.tabs').forEach(function(tabGroup){
    var btns = tabGroup.querySelectorAll('.tab-btn');
    var panelWrap = tabGroup.nextElementSibling;
    btns.forEach(function(btn){
      btn.addEventListener('click', function(){
        btns.forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        panelWrap.querySelectorAll('.tab-panel').forEach(function(p){ p.classList.remove('active'); });
        var target = panelWrap.querySelector('[data-panel="' + btn.dataset.tab + '"]');
        if(target) target.classList.add('active');
      });
    });
  });

})();
