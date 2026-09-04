/* =========================================================================
   PATCHES ZONE — Form Validation
   Generic, dependency-free validation for Contact, Newsletter and Quote forms
   ========================================================================= */
(function(){
  "use strict";

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var PHONE_RE = /^[+]?[0-9()\-\s]{7,20}$/;

  function setError(field, msg){
    field.classList.add('invalid');
    var err = field.querySelector('.field-error');
    if(err){ err.textContent = msg; }
  }
  function clearError(field){
    field.classList.remove('invalid');
  }

  function validateField(field){
    var input = field.querySelector('input, textarea, select');
    if(!input) return true;
    var val = input.value.trim();
    var rule = input.dataset.rule || '';
    var ok = true, msg = 'This field is required.';

    if(input.hasAttribute('required') && !val){ ok = false; }
    else if(val && rule === 'email' && !EMAIL_RE.test(val)){ ok = false; msg = 'Enter a valid email address.'; }
    else if(val && rule === 'phone' && !PHONE_RE.test(val)){ ok = false; msg = 'Enter a valid phone number.'; }
    else if(val && rule === 'min3' && val.length < 3){ ok = false; msg = 'Please enter at least 3 characters.'; }
    else if(val && input.type === 'checkbox' && !input.checked){ ok = false; }

    if(input.type === 'checkbox'){ ok = input.checked || !input.hasAttribute('required'); }

    if(!ok){ setError(field, msg); } else { clearError(field); }
    return ok;
  }

  function bindLiveValidation(form){
    form.querySelectorAll('.field').forEach(function(field){
      var input = field.querySelector('input, textarea, select');
      if(!input) return;
      input.addEventListener('blur', function(){ validateField(field); });
      input.addEventListener('input', function(){ if(field.classList.contains('invalid')) validateField(field); });
    });
  }

  function showMsg(form, type, text){
    var msg = form.querySelector('.form-msg');
    if(!msg) return;
    msg.textContent = text;
    msg.className = 'form-msg show ' + type;
  }

  var WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

  function setSubmitting(form, submitting){
    var btn = form.querySelector('button[type="submit"]');
    if(!btn) return;
    if(submitting){
      btn.dataset.originalText = btn.dataset.originalText || btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;
    } else {
      btn.textContent = btn.dataset.originalText || btn.textContent;
      btn.disabled = false;
    }
  }

  document.querySelectorAll('form[data-validate]').forEach(function(form){
    bindLiveValidation(form);
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var fields = form.querySelectorAll('.field');
      var allValid = true;
      fields.forEach(function(field){ if(!validateField(field)) allValid = false; });

      if(!allValid){
        showMsg(form, 'error', 'Please correct the highlighted fields and try again.');
        var firstInvalid = form.querySelector('.field.invalid');
        if(firstInvalid){ firstInvalid.scrollIntoView({behavior:'smooth', block:'center'}); }
        return;
      }

      var successText = form.dataset.success || 'Thank you! Your message has been received — our team will reply within one business day.';
      setSubmitting(form, true);
      fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      }).then(function(r){ return r.json(); }).then(function(data){
        setSubmitting(form, false);
        if(data && data.success){
          showMsg(form, 'success', successText);
          form.reset();
          form.querySelectorAll('.field').forEach(clearError);
        } else {
          showMsg(form, 'error', 'Something went wrong sending your message. Please try WhatsApp or email us directly.');
        }
      }).catch(function(){
        setSubmitting(form, false);
        showMsg(form, 'error', 'Something went wrong sending your message. Please try WhatsApp or email us directly.');
      });
    });
  });

  /* Newsletter mini-forms */
  document.querySelectorAll('.newsletter-form').forEach(function(nf){
    nf.addEventListener('submit', function(e){
      e.preventDefault();
      var input = nf.querySelector('input[type="email"]');
      var note = nf.parentElement.querySelector('.nl-note');
      if(!(input && EMAIL_RE.test(input.value.trim()))){
        if(note){ note.textContent = 'Please enter a valid email address.'; note.style.color = '#FFD3D3'; }
        return;
      }
      fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(nf)))
      }).then(function(r){ return r.json(); }).then(function(data){
        if(note){
          if(data && data.success){
            note.textContent = '✓ Subscribed! Watch your inbox for offers.'; note.style.color = '#fff';
            input.value = '';
          } else {
            note.textContent = 'Something went wrong. Please try again.'; note.style.color = '#FFD3D3';
          }
        }
      }).catch(function(){
        if(note){ note.textContent = 'Something went wrong. Please try again.'; note.style.color = '#FFD3D3'; }
      });
    });
  });

})();
