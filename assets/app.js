(function(){
  const editBtn = document.querySelector('[data-action="edit"]');
  const saveBtn = document.querySelector('[data-action="save"]');
  const form = document.querySelector('form[data-form="invulblok"]');
  const refs = Array.from(document.querySelectorAll('[data-ref]'));
  const pageKey = document.body.dataset.pageKey || location.pathname;
  const inputs = Array.from(form ? form.querySelectorAll('input[data-key]') : []);

  function load(){
    const raw = localStorage.getItem('fields:'+pageKey);
    if(!raw) return;
    try{
      const data = JSON.parse(raw);
      inputs.forEach(inp => {
        const key = inp.dataset.key;
        if(data[key] != null){ inp.value = data[key]; }
      });
      render();
    }catch(e){ console.warn('load failed', e); }
  }

  function currentData(){
    const d = {};
    inputs.forEach(inp => d[inp.dataset.key] = inp.value.trim());
    return d;
  }

  function render(){
    const d = currentData();
    refs.forEach(el => {
      const key = el.dataset.ref;
      const val = d[key] || el.dataset.placeholder || '…';
      el.textContent = val;
    });
  }

  function setEditing(on){
    document.body.classList.toggle('locked', !on);
    inputs.forEach(inp => { inp.disabled = !on; });
    if(editBtn) editBtn.disabled = on;
    if(saveBtn) saveBtn.disabled = !on;
  }

  function save(){
    const data = currentData();
    localStorage.setItem('fields:'+pageKey, JSON.stringify(data));
    render();
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

  if(form){
    form.addEventListener('input', render);
  }
  if(editBtn) editBtn.addEventListener('click', ()=> setEditing(true));
  if(saveBtn) saveBtn.addEventListener('click', save));

  // init
  setEditing(false);
  load();
  render();
})();