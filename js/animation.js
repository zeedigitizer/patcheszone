/* =========================================================================
   PATCHES ZONE — Animation Engine
   Scroll reveal, count-up counters, gentle parallax
   ========================================================================= */
(function(){
  "use strict";

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('[data-anim], .reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.14});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in','visible'); });
  }

  /* ---------- Count-up stats ---------- */
  var countEls = document.querySelectorAll('[data-count]');
  if(countEls.length){
    var countIo = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.dataset.count, 10);
        var suffix = el.dataset.suffix || '';
        var cur = 0;
        var step = Math.max(1, Math.round(target / 50));
        (function tick(){
          cur += step;
          if(cur >= target){ el.textContent = target + suffix; }
          else { el.textContent = cur + suffix; requestAnimationFrame(tick); }
        })();
        countIo.unobserve(el);
      });
    }, {threshold:0.5});
    countEls.forEach(function(el){ countIo.observe(el); });
  }

  /* ---------- Gentle parallax on hero orbs ---------- */
  var parallaxEls = document.querySelectorAll('.parallax');
  if(parallaxEls.length){
    document.addEventListener('mousemove', function(e){
      var cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      var dx = (e.clientX - cx) / cx, dy = (e.clientY - cy) / cy;
      parallaxEls.forEach(function(el){
        var depth = parseFloat(el.dataset.depth || 14);
        el.style.transform = 'translate(' + (dx * depth) + 'px,' + (dy * depth) + 'px)';
      });
    });
    document.addEventListener('scroll', function(){
      var y = window.scrollY;
      parallaxEls.forEach(function(el){
        var depth = parseFloat(el.dataset.scrollDepth || 0.06);
        el.style.transform = (el.style.transform || '') + ' translateY(' + (y * depth) + 'px)';
      });
    }, {passive:true});
  }

})();
