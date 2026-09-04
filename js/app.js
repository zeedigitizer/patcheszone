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

  /* ---------- Live chat widget (bottom-left) ---------- */
  var chatWidget = document.getElementById('chatWidget');
  if(chatWidget){
    var waNumber = chatWidget.dataset.whatsapp;
    var PHONE_DISPLAY = chatWidget.dataset.phone || '';
    var EMAIL_DISPLAY = chatWidget.dataset.email || '';
    var chatGreet = document.getElementById('chatGreet');
    var chatGreetClose = document.getElementById('chatGreetClose');
    var chatFab = document.getElementById('chatFab');
    var chatPanel = document.getElementById('chatPanel');
    var chatPanelClose = document.getElementById('chatPanelClose');
    var chatPanelBody = document.getElementById('chatPanelBody');
    var chatForm = document.getElementById('chatPanelForm');
    var chatInput = document.getElementById('chatMsgInput');

    function showGreet(){
      if(chatPanel.classList.contains('open')) return;
      if(sessionStorage.getItem('pz-chat-dismissed') === '1') return;
      chatGreet.classList.add('show');
    }
    function hideGreet(){ chatGreet.classList.remove('show'); }

    setTimeout(showGreet, 2600);

    if(chatGreetClose){
      chatGreetClose.addEventListener('click', function(e){
        e.stopPropagation();
        hideGreet();
        sessionStorage.setItem('pz-chat-dismissed', '1');
      });
    }
    /* clicking the greet bubble itself opens the chat */
    chatGreet.addEventListener('click', function(){ openPanel(); });

    function openPanel(){
      hideGreet();
      chatPanel.classList.add('open');
      chatInput && chatInput.focus();
    }
    function closePanel(){ chatPanel.classList.remove('open'); }

    chatFab.addEventListener('click', function(){
      if(chatPanel.classList.contains('open')){ closePanel(); } else { openPanel(); }
    });
    if(chatPanelClose){ chatPanelClose.addEventListener('click', closePanel); }

    /* Simple keyword-matched auto-responses using our real FAQ facts.
       Nothing here auto-opens WhatsApp -- a wa.me link is only offered
       as a clickable suggestion when the bot can't fully answer, or
       when the visitor explicitly asks to talk to a person. */
    var waLink = waNumber ? ('https://wa.me/' + waNumber) : '#';
    var RULES = [
      { test: /\b(hi|hello|hey|salam|assalam|asalam)\b/i,
        reply: "Hi! 👋 I can help with pricing, patch types, turnaround time, backing options or shipping. What would you like to know?" },
      { test: /\b(price|prices|pricing|cost|rate|quote|quotation)\b/i,
        reply: "Pricing depends on patch type, size, quantity and backing. Get an exact, instant number from our <a href=\"calculator.html\" target=\"_blank\" rel=\"noopener\">Price Calculator</a> &mdash; as a starting point, embroidered patches begin around $1.05/patch and the per-patch cost drops a lot at higher quantities." },
      { test: /\b(minimum|moq|min order|smallest order)\b/i,
        reply: "There's no minimum order &mdash; you can order as few as a single patch. The price per patch just gets better as quantity goes up." },
      { test: /\b(time|turnaround|production|how long|fast|ready|delivery time)\b/i,
        reply: "Standard production is 7&ndash;10 business days after you approve the artwork proof, plus shipping time to your country." },
      { test: /\b(ship|shipping|deliver|delivery|international|country|worldwide)\b/i,
        reply: "We ship tracked parcels to 80+ countries. Orders of 200+ pcs get free worldwide shipping automatically." },
      { test: /\b(digitiz|artwork|logo|design file|file|proof)\b/i,
        reply: "Every order includes free digitizing &mdash; send us your logo or design and we'll prepare a proof for your approval before production starts." },
      { test: /\b(backing|velcro|iron.?on|sew.?on|pin|adhesive)\b/i,
        reply: "We offer iron-on, sew-on, velcro (hook &amp; loop), safety pin and self-adhesive backing &mdash; pick any of these live in the price calculator." },
      { test: /\b(type|types|embroidered|pvc|chenille|leather|woven|sublimat|hat patch|material)\b/i,
        reply: "We manufacture Embroidered, PVC, Chenille, Leather, Woven, Sublimated, Velcro-backed and Hat patches. See real examples of each in our <a href=\"gallery.html\" target=\"_blank\" rel=\"noopener\">Gallery</a>." },
      { test: /\b(human|agent|person|talk to|representative|call|phone|whatsapp|email)\b/i,
        reply: "Of course &mdash; you can reach our team directly on <a href=\"" + waLink + "\" target=\"_blank\" rel=\"noopener\">WhatsApp</a>, by phone at " + PHONE_DISPLAY + ", or email " + EMAIL_DISPLAY + ". We reply fastest on WhatsApp." },
      { test: /\b(thanks|thank you|ok|okay|great|good|cool|nice)\b/i,
        reply: "You're welcome! Let me know if there's anything else I can help with. 😊" }
    ];
    var FALLBACK = "Thanks for your message! I can answer questions here about pricing, patch types, turnaround, backing or shipping. For anything specific to your own design or order, our team replies fastest on <a href=\"" + waLink + "\" target=\"_blank\" rel=\"noopener\">WhatsApp</a>.";

    function botReply(msg){
      for(var i = 0; i < RULES.length; i++){
        if(RULES[i].test.test(msg)) return RULES[i].reply;
      }
      return FALLBACK;
    }

    if(chatForm){
      chatForm.addEventListener('submit', function(e){
        e.preventDefault();
        var msg = (chatInput.value || '').trim();
        if(!msg) return;

        var bubble = document.createElement('div');
        bubble.className = 'chat-bubble chat-bubble-out';
        bubble.textContent = msg;
        chatPanelBody.appendChild(bubble);
        chatPanelBody.scrollTop = chatPanelBody.scrollHeight;
        chatInput.value = '';

        setTimeout(function(){
          var reply = document.createElement('div');
          reply.className = 'chat-bubble chat-bubble-in';
          reply.innerHTML = botReply(msg);
          chatPanelBody.appendChild(reply);
          chatPanelBody.scrollTop = chatPanelBody.scrollHeight;
        }, 450);
      });
    }
  }

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

  /* Lightbox — with Prev/Next navigation cycling through visible (filtered) cards */
  var lightbox = document.getElementById('lightbox');
  if(lightbox){
    var lbInner = document.getElementById('lightboxInner');
    var lbCap = document.getElementById('lightboxCap');
    var lbClose = document.getElementById('lightboxClose');
    var lbPrev = document.getElementById('lightboxPrev');
    var lbNext = document.getElementById('lightboxNext');
    var lbCounter = document.getElementById('lightboxCounter');
    var currentIndex = 0;

    function visibleCards(){
      return Array.prototype.filter.call(document.querySelectorAll('.g-card'), function(c){
        return c.offsetParent !== null; // skip display:none (filtered out) cards
      });
    }

    function renderCard(card){
      var inner = card.querySelector('.g-inner');
      lbInner.className = 'lightbox-inner ' + (inner ? inner.className.replace('g-inner','') : '');
      lbInner.style.background = inner ? getComputedStyle(inner).background : '';
      lbInner.innerHTML = inner ? inner.innerHTML : '';
      var cap = card.querySelector('h4');
      lbCap.textContent = cap ? cap.textContent : '';
      if(lbCounter){
        var cards = visibleCards();
        var idx = cards.indexOf(card);
        if(idx > -1){ lbCounter.textContent = (idx+1) + ' / ' + cards.length; }
      }
    }

    function openAt(card){
      var cards = visibleCards();
      currentIndex = cards.indexOf(card);
      renderCard(card);
      lightbox.classList.add('open');
    }

    function step(dir){
      var cards = visibleCards();
      if(!cards.length) return;
      currentIndex = (currentIndex + dir + cards.length) % cards.length;
      renderCard(cards[currentIndex]);
    }

    document.querySelectorAll('.g-card').forEach(function(card){
      card.addEventListener('click', function(){ openAt(card); });
    });
    function closeLb(){ lightbox.classList.remove('open'); }
    if(lbClose){ lbClose.addEventListener('click', closeLb); }
    if(lbPrev){ lbPrev.addEventListener('click', function(e){ e.stopPropagation(); step(-1); }); }
    if(lbNext){ lbNext.addEventListener('click', function(e){ e.stopPropagation(); step(1); }); }
    lightbox.addEventListener('click', function(e){ if(e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function(e){
      if(!lightbox.classList.contains('open')) return;
      if(e.key === 'Escape') closeLb();
      if(e.key === 'ArrowLeft') step(-1);
      if(e.key === 'ArrowRight') step(1);
    });
  }

  /* Quick View modal (products.html) */
  var qvModal = document.getElementById('quickviewModal');
  if(qvModal){
    var qvImg = document.getElementById('qvImg');
    var qvName = document.getElementById('qvName');
    var qvDesc = document.getElementById('qvDesc');
    var qvPrice = document.getElementById('qvPrice');
    var qvOrderBtn = document.getElementById('qvOrderBtn');
    var qvClose = document.getElementById('qvClose');

    document.querySelectorAll('.qv-btn').forEach(function(btn){
      btn.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        var card = btn.closest('[data-qv-name]');
        if(!card) return;
        qvImg.src = card.dataset.qvImg || '';
        qvImg.alt = card.dataset.qvName || '';
        qvName.textContent = card.dataset.qvName || '';
        qvDesc.textContent = card.dataset.qvDesc || '';
        qvPrice.textContent = card.dataset.qvPrice || '';
        qvOrderBtn.href = card.dataset.qvLink || 'calculator.html';
        qvModal.classList.add('open');
      });
    });
    function closeQv(){ qvModal.classList.remove('open'); }
    if(qvClose){ qvClose.addEventListener('click', closeQv); }
    qvModal.addEventListener('click', function(e){ if(e.target === qvModal) closeQv(); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeQv(); });
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
