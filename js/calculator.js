/* =========================================================================
   PATCHES ZONE — Price Calculator Logic
   IMPORTANT: The pricing formulas below (qtyFactor + calculate) are ported
   EXACTLY, unchanged, from the client-supplied calculator. Only the UI
   markup/CSS around them has been redesigned. Do not alter the math here.
   ========================================================================= */
(function(){
  "use strict";

  // Declared early (before the first calculate() call below) so that
  // updateSummaryPanel() never reads this before it's initialized.
  var selectedColors = [];

  var typeCards = document.querySelectorAll('.type-card');
  var selType = document.getElementById('selType');
  var lblType = document.getElementById('lblType');
  if(!selType) return; // calculator not on this page

  // Convenience: allow other pages to deep-link into a preselected patch
  // type via ?type=embroidered — purely a UI convenience, does not touch
  // any pricing math.
  (function preselectFromQuery(){
    var params = new URLSearchParams(window.location.search);
    var wanted = params.get('type');
    if(!wanted) return;
    var match = selType.querySelector('option[value="' + wanted + '"]');
    if(!match) return;
    selType.value = wanted;
    lblType.textContent = match.textContent;
    typeCards.forEach(function(c){ c.classList.toggle('active', c.dataset.type === wanted); });
  })();

  typeCards.forEach(function(card){
    card.addEventListener('click', function(){
      typeCards.forEach(function(c){ c.classList.remove('active'); });
      card.classList.add('active');
      selType.value = card.dataset.type;
      lblType.textContent = card.querySelector('h5').textContent;
      calculate();
    });
  });

  selType.addEventListener('change', function(){
    var opt = selType.options[selType.selectedIndex];
    lblType.textContent = opt.textContent;
    typeCards.forEach(function(c){ c.classList.toggle('active', c.dataset.type === selType.value); });
    calculate();
  });

  var pills = document.querySelectorAll('#backingPills .pill');
  pills.forEach(function(p){
    p.addEventListener('click', function(){
      pills.forEach(function(x){ x.classList.remove('active'); });
      p.classList.add('active');
      calculate();
    });
  });

  var rngSize = document.getElementById('rngSize');
  var rngQty = document.getElementById('rngQty');
  var lblSize = document.getElementById('lblSize');
  var lblQty = document.getElementById('lblQty');

  rngSize.addEventListener('input', function(){ lblSize.textContent = parseFloat(rngSize.value).toFixed(1) + '"'; calculate(); });
  rngQty.addEventListener('input', function(){ lblQty.textContent = rngQty.value + ' pcs'; calculate(); });

  /* ---- ORIGINAL PRICING LOGIC (unchanged) ---- */
  function qtyFactor(qty){
    if (qty >= 1000) return 1.00;
    if (qty >= 500) return 1.12;
    if (qty >= 250) return 1.70;
    if (qty >= 100) return 2.43;
    if (qty >= 50) return 3.73;
    if (qty >= 25) return 5.10;
    if (qty >= 10) return 7.50;
    return 10.00;
  }

  function calculate(){
    var opt = selType.options[selType.selectedIndex];
    var base = parseFloat(opt.dataset.price);
    var size = parseFloat(rngSize.value);
    var qty = parseInt(rngQty.value);
    var activePill = document.querySelector('#backingPills .pill.active');
    var backingMult = parseFloat(activePill.dataset.mult);

    var sizeFactor = Math.max(0.7, Math.min(2.4, size / 3));
    var qf = qtyFactor(qty);

    var unitPrice = base * sizeFactor * qf * backingMult;
    var subtotal = unitPrice * qty;
    var shipping = qty >= 200 ? 0 : 50;
    var total = subtotal + shipping;

    document.getElementById('outTotal').textContent = '$' + total.toFixed(2);
    document.getElementById('outUnit').textContent = '≈ $' + unitPrice.toFixed(2) + ' / patch';
    document.getElementById('bdBase').textContent = '$' + base.toFixed(2);
    document.getElementById('bdSize').textContent = '×' + sizeFactor.toFixed(2);
    document.getElementById('bdQty').textContent = '×' + qf.toFixed(2);
    document.getElementById('bdBacking').textContent = '×' + backingMult.toFixed(2);
    document.getElementById('bdShip').textContent = shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2);
    var shipHint = document.getElementById('shipHint');
    if (shipping === 0) {
      shipHint.innerHTML = '✓ Free worldwide shipping unlocked (200+ pcs)';
      shipHint.classList.add('unlocked');
    } else {
      var pcsGap = 200 - qty;
      shipHint.innerHTML = 'Add <span id="shipGap">' + pcsGap + '</span> more pcs to unlock free worldwide shipping';
      shipHint.classList.remove('unlocked');
    }

    // keep last computed values available for the quote summary (non-pricing feature)
    window._pzQuote = window._pzQuote || {};
    window._pzQuote.type = lblType.textContent;
    window._pzQuote.size = parseFloat(rngSize.value).toFixed(1);
    window._pzQuote.qty = qty;
    window._pzQuote.backing = activePill.textContent;
    window._pzQuote.unit = unitPrice.toFixed(2);
    window._pzQuote.total = total.toFixed(2);
    updateSummaryPanel();
  }

  /* =========================================================================
     Additional quote-request fields (Border Type, Colors, Special Instructions,
     File Upload). These are informational only and DO NOT affect price math
     above — the calculation stays identical to the source calculator.
     ========================================================================= */
  var borderPills = document.querySelectorAll('#borderPills .pill');
  borderPills.forEach(function(p){
    p.addEventListener('click', function(){
      borderPills.forEach(function(x){ x.classList.remove('active'); });
      p.classList.add('active');
      updateSummaryPanel();
    });
  });

  var swatches = document.querySelectorAll('.swatch');
  swatches.forEach(function(s){
    s.addEventListener('click', function(){
      s.classList.toggle('active');
      var c = s.dataset.color;
      if(s.classList.contains('active')){ selectedColors.push(c); }
      else{ selectedColors = selectedColors.filter(function(x){ return x !== c; }); }
      updateSummaryPanel();
    });
  });

  var instructions = document.getElementById('specialInstructions');
  if(instructions){ instructions.addEventListener('input', updateSummaryPanel); }

  var fileInput = document.getElementById('calcFile');
  var uploadBox = document.getElementById('uploadBox');
  var fnameLabel = document.getElementById('calcFileName');
  if(fileInput && uploadBox){
    uploadBox.addEventListener('click', function(){ fileInput.click(); });
    ['dragenter','dragover'].forEach(function(evt){
      uploadBox.addEventListener(evt, function(e){ e.preventDefault(); uploadBox.classList.add('drag'); });
    });
    ['dragleave','drop'].forEach(function(evt){
      uploadBox.addEventListener(evt, function(e){ e.preventDefault(); uploadBox.classList.remove('drag'); });
    });
    uploadBox.addEventListener('drop', function(e){
      if(e.dataTransfer.files.length){ fileInput.files = e.dataTransfer.files; showFileName(); }
    });
    fileInput.addEventListener('change', showFileName);
    function showFileName(){
      if(fileInput.files && fileInput.files[0]){
        fnameLabel.textContent = 'Attached: ' + fileInput.files[0].name;
      } else {
        fnameLabel.textContent = '';
      }
      updateSummaryPanel();
    }
  }

  function activeText(sel){
    var el = document.querySelector(sel);
    return el ? el.textContent.trim() : '—';
  }

  function updateSummaryPanel(){
    var q = window._pzQuote || {};
    var borderEl = document.getElementById('quoteBorder');
    var colorsEl = document.getElementById('quoteColors');
    var fileEl = document.getElementById('quoteFile');
    if(borderEl) borderEl.textContent = activeText('#borderPills .pill.active');
    if(colorsEl) colorsEl.textContent = selectedColors.length ? selectedColors.join(', ') : 'Standard / as shown';
    if(fileEl) fileEl.textContent = (fileInput && fileInput.files && fileInput.files[0]) ? fileInput.files[0].name : 'No file attached';
  }

  /* Request Quote -> populate summary modal */
  var reqBtn = document.getElementById('requestQuoteBtn');
  var modal = document.getElementById('quoteModal');
  if(reqBtn && modal){
    reqBtn.addEventListener('click', function(){
      var q = window._pzQuote || {};
      var borderText = activeText('#borderPills .pill.active');
      var colorsText = (selectedColors && selectedColors.length) ? selectedColors.join(', ') : 'Standard';
      var instructionsText = (instructions && instructions.value.trim()) ? instructions.value.trim() : 'None provided';
      var fileText = (fileInput && fileInput.files && fileInput.files[0]) ? fileInput.files[0].name : 'None attached';

      document.getElementById('modalType').textContent = q.type || '—';
      document.getElementById('modalSize').textContent = (q.size || '—') + '"';
      document.getElementById('modalQty').textContent = (q.qty || '—') + ' pcs';
      document.getElementById('modalBacking').textContent = q.backing || '—';
      document.getElementById('modalBorder').textContent = borderText;
      document.getElementById('modalColors').textContent = colorsText;
      document.getElementById('modalInstructions').textContent = instructionsText;
      document.getElementById('modalFile').textContent = fileText;
      document.getElementById('modalTotal').textContent = '$' + (q.total || '0.00');

      var patchTypeField = document.getElementById('quotePatchType');
      if(patchTypeField) patchTypeField.value = q.type || '';
      var sizeField = document.getElementById('quoteSizeField');
      if(sizeField) sizeField.value = q.size ? (q.size + '"') : '';
      var qtyField = document.getElementById('quoteQtyField');
      if(qtyField) qtyField.value = q.qty || '';
      var backingField = document.getElementById('quoteBackingField');
      if(backingField) backingField.value = q.backing || '';
      var borderField = document.getElementById('quoteBorderField');
      if(borderField) borderField.value = borderText;
      var colorsField = document.getElementById('quoteColorsField');
      if(colorsField) colorsField.value = colorsText;
      var instructionsField = document.getElementById('quoteInstructionsField');
      if(instructionsField) instructionsField.value = instructionsText;
      var totalField = document.getElementById('quoteTotalField');
      if(totalField) totalField.value = '$' + (q.total || '0.00');

      modal.classList.add('open');
    });
    var modalClose = document.getElementById('quoteModalClose');
    if(modalClose){ modalClose.addEventListener('click', function(){ modal.classList.remove('open'); }); }
    modal.addEventListener('click', function(e){ if(e.target === modal){ modal.classList.remove('open'); } });
  }

  // Run the initial calculation last, once every control on the page
  // (backing pills, border pills, swatches, file upload, request-quote
  // button) has already been wired up above. This guarantees a problem
  // inside calculate()/updateSummaryPanel() can never prevent the rest
  // of the page's buttons from being set up.
  calculate();

})();
