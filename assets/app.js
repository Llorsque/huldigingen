/**
 * Simple field locker with localStorage persistence.
 * All editable fields have class 'editable' and a unique data-key.
 */
(function(){
  const editBtn = document.querySelector('[data-action="edit"]');
  const saveBtn = document.querySelector('[data-action="save"]');
  const fields = Array.from(document.querySelectorAll('.editable'));
  const pageKey = document.body.dataset.pageKey || location.pathname;

  function load(){
    const raw = localStorage.getItem('fields:'+pageKey);
    if(!raw) return;
    try{
      const data = JSON.parse(raw);
      fields.forEach(el => {
        const key = el.dataset.key;
        if(key && data[key] != null){
          el.textContent = data[key];
          el.classList.remove('placeholder');
        }
      });
    }catch(e){ console.warn('load failed', e); }
  }

  function setEditing(on){
    fields.forEach(el => {
      el.setAttribute('contenteditable', on ? 'true' : 'false');
    });
    document.body.dataset.editing = on ? '1' : '0';
    if(editBtn) editBtn.disabled = on;
    if(saveBtn) saveBtn.disabled = !on;
  }

  function save(){
    const data = {};
    fields.forEach(el => {
      const key = el.dataset.key;
      if(!key) return;
      const val = (el.textContent || '').trim();
      data[key] = val;
      if(val) el.classList.remove('placeholder'); else el.classList.add('placeholder');
    });
    localStorage.setItem('fields:'+pageKey, JSON.stringify(data));
    setEditing(false);
    flash('Opgeslagen');
  }

  function flash(msg){
    const n = document.createElement('div');
    n.textContent = msg;
    n.style.position='fixed'; n.style.right='18px'; n.style.bottom='18px';
    n.style.background='var(--blue)'; n.style.color='white'; n.style.padding='10px 14px';
    n.style.borderRadius='10px'; n.style.boxShadow='0 8px 20px rgba(17,24,39,.2)';
    n.style.zIndex='9999'; n.style.fontWeight='600';
    document.body.appendChild(n);
    setTimeout(()=>{ n.remove(); }, 1400);
  }

  if(editBtn) editBtn.addEventListener('click', ()=> setEditing(true));
  if(saveBtn) saveBtn.addEventListener('click', save);

  // Disable editing by default
  setEditing(false);
  load();
})();