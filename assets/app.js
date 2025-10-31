(function(){
  const editBtn = document.querySelector('[data-action="edit"]');
  const saveBtn = document.querySelector('[data-action="save"]');
  const form = document.querySelector('form[data-form="invulblok"]');
  const wrap = document.querySelector('.bundles');
  const pageKey = document.body.dataset.pageKey || location.pathname;
  const inputs = Array.from(form ? form.querySelectorAll('input[data-key]') : []);

  let isEditing = true;
  let activeIdx = 0;

  function load(){
    const raw = localStorage.getItem('fields:'+pageKey);
    if(!raw) return;
    try{
      const data = JSON.parse(raw);
      inputs.forEach(inp => {
        const key = inp.dataset.key;
        if(data[key] != null){ inp.value = data[key]; }
      });
    }catch(e){ console.warn('load failed', e); }
  }

  function data(){
    const d = {};
    inputs.forEach(inp => d[inp.dataset.key] = inp.value.trim());
    return d;
  }

  function addP(el, txt){
    const p = document.createElement('p');
    p.style.margin = '0 0 6px';
    p.textContent = txt;
    el.appendChild(p);
  }

  function render(){
    const d = data();
    wrap.innerHTML = '';

    function bundle(title, linesArr, note=''){
      const b = document.createElement('div');
      b.className = 'bundle';
      const h = document.createElement('h3');
      h.textContent = title;
      b.appendChild(h);
      linesArr.forEach(t => addP(b, t));
      if(note){
        const n = document.createElement('div');
        n.className = 'note';
        n.textContent = note;
        b.appendChild(n);
      }
      wrap.appendChild(b);
      return b;
    }

    const onderdeel = d.onderdeel || '(onderdeel)';

    bundle('PRIJSUITREIKING', [
      `PRIJSUITREIKING DAIKIN NK AFSTANDEN ${onderdeel}.`
    ]);

    bundle('BRONS', [
      `DE BRONZEN MEDAILLE, MET EEN TIJD VAN ${d.derde_tijd || '…'}.`,
      `NAMENS ${d.derde_team || '(team)'}`,
      `${d.derde_naam || '(naam)'}`
    ], d.derde_bijz || '');

    const uitM = [d.uitreiker_medailles_naam, d.uitreiker_medailles_functie].filter(Boolean).join(', ');
    const uitB = [d.uitreiker_bloemen_naam, d.uitreiker_bloemen_functie].filter(Boolean).join(', ');
    const uitBundle = bundle('UITREIKERS', [
      `DE MEDAILLES WORDEN UITGEREIKT DOOR ${uitM || '(naam, functie)'}.`,
      `DE BLOEMEN EN CADEAUTJES WORDEN UITGEREIKT DOOR ${uitB || '(naam, functie)'}.`
    ]);
    const extra = d.uitreikers_extra || '';
    const extraEl = document.createElement('div');
    if(extra){
      extraEl.className = 'note';
      extraEl.textContent = extra;
    }else{
      extraEl.className = 'filler';
      extraEl.innerHTML = '&nbsp;';
    }
    uitBundle.appendChild(extraEl);

    bundle('ZILVER', [
      `DE ZILVEREN MEDAILLE, MET EEN TIJD VAN ${d.tweede_tijd || '…'}.`,
      `NAMENS ${d.tweede_team || '(team)'}`,
      `${d.tweede_naam || '(naam)'}`
    ], d.tweede_bijz || '');

    bundle('GOUD', [
      `EN HET GOUD VOOR DE WINNAAR VAN DEZE ${onderdeel}.`,
      `MET EEN TIJD VAN ${d.eerste_tijd || '…'}.`,
      `NAMENS ${d.eerste_team || '(team)'}`,
      `${d.eerste_naam || '(naam)'}`
    ], d.eerste_bijz || '');

    bundle('VOLKSLIED', [
      'THIALF, GAAT U STAAN EN GRAAG UW AANDACHT VOOR HET NATIONALE VOLKSLIED: HET WILHELMUS.'
    ]);

    bundle('APPLAUS & PODIUM', [
      `GEEF ZE NOG EEN GROOT APPLAUS, HET PODIUM VAN DEZE ${onderdeel}.`,
      `DERDE PLAATS: ${d.derde_naam || '(naam)'}`,
      `TWEEDE PLAATS: ${d.tweede_naam || '(naam)'}`,
      `EERSTE PLAATS: ${d.eerste_naam || '(naam)'} (NEDERLANDS KAMPIOEN)`
    ]);

    setActive(activeIdx, {scroll:false});
  }

  function setEditing(on){
    isEditing = on;
    document.body.classList.toggle('locked', !on);
    inputs.forEach(inp => { inp.disabled = !on; });
    if(editBtn) editBtn.disabled = on;
    if(saveBtn) saveBtn.disabled = !on;
  }

  function save(){
    localStorage.setItem('fields:'+pageKey, JSON.stringify(data()));
    render();
    setEditing(false);
    setActive(activeIdx, {scroll:true});
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

  function setActive(idx, {scroll=true} = {}){
    const items = Array.from(document.querySelectorAll('.bundle'));
    if(!items.length) return;
    if(idx<0) idx = 0;
    if(idx>=items.length) idx = items.length-1;
    activeIdx = idx;
    items.forEach((el,i)=> el.classList.toggle('active', i===activeIdx));
    if(scroll && !isEditing){
      items[activeIdx].scrollIntoView({behavior:'smooth', block:'center'});
    }
  }

  document.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowDown'){ e.preventDefault(); setActive(activeIdx+1, {scroll:true}); }
    else if(e.key === 'ArrowUp'){ e.preventDefault(); setActive(activeIdx-1, {scroll:true}); }
  });

  if(form){ form.addEventListener('input', render); }
  if(editBtn) editBtn.addEventListener('click', ()=> setEditing(true));
  if(saveBtn) saveBtn.addEventListener('click', save);

  setEditing(true);
  load();
  render();
  setActive(0, {scroll:false});
})();