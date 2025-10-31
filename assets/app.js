(function(){
  const editBtn = document.querySelector('[data-action="edit"]');
  const saveBtn = document.querySelector('[data-action="save"]');
  const form = document.querySelector('form[data-form="invulblok"]');
  const linesWrap = document.querySelector('.lines');
  const pageKey = document.body.dataset.pageKey || location.pathname;
  const inputs = Array.from(form ? form.querySelectorAll('input[data-key]') : []);

  const rawLines = JSON.parse(document.getElementById('page2-lines-json').textContent);

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

  function currentData(){
    const d = {};
    inputs.forEach(inp => d[inp.dataset.key] = inp.value.trim());
    return d;
  }

  function injectIntoExactLines(d){
    // Work on a copy; keep exact characters except replacing the intended placeholders
    return rawLines.map((ln, idx) => {
      let out = ln;

      // Onderdeel -> replace occurrences of (AFSTAND) (VROUWEN / MANNEN) or just (AFSTAND)
      if(d.onderdeel){
        out = out.replace(/\(AFSTAND\)\s+\(VROUWEN\s*\/\s*MANNEN\)/g, '('+d.onderdeel+')');
        out = out.replace(/\(AFSTAND\)/g, '('+d.onderdeel+')');
      }

      // Times: replace long ellipsis after "TIJD VAN "
      if(idx===1 && d.derde_tijd){ // bronze time line index 1
        out = out.replace(/…+/, d.derde_tijd);
      }
      if(idx===6 && d.tweede_tijd){ // silver time
        out = out.replace(/…+/, d.tweede_tijd);
      }
      if(idx===9 && d.eerste_tijd){ // gold time
        out = out.replace(/…+/, d.eerste_tijd);
      }

      // Team + Naam: replace (TEAM...) and (NAAM) occurrences on respective lines
      if(idx===2){ // bronze team+name
        if(d.derde_team){ out = out.replace(/\(TEA[^)]*\)/g, '('+d.derde_team+')'); out = out.replace(/\(TEAM[^)]*\)/g, '('+d.derde_team+')'); }
        if(d.derde_naam){ out = out.replace(/\(NAAM\)/g, '('+d.derde_naam+')'); }
      }
      if(idx===7){ // silver team+name
        if(d.tweede_team){ out = out.replace(/\(TEA[^)]*\)/g, '('+d.tweede_team+')'); out = out.replace(/\(TEAM[^)]*\)/g, '('+d.tweede_team+')'); }
        if(d.tweede_naam){ out = out.replace(/\(NAAM\)/g, '('+d.tweede_naam+')'); }
      }
      if(idx===10){ // gold team+name
        if(d.eerste_team){ out = out.replace(/\(TEA[^)]*\)/g, '('+d.eerste_team+')'); out = out.replace(/\(TEAM[^)]*\)/g, '('+d.eerste_team+')'); }
        if(d.eerste_naam){ out = out.replace(/\(NAAM\)/g, '('+d.eerste_naam+')'); }
      }

      // Medailles uitreiker (line 3): replace everything after "DOOR" with " naam, functie"
      if(idx===3 && (d.uitreiker_medailles_naam || d.uitreiker_medailles_functie)){
        const who = [d.uitreiker_medailles_naam, d.uitreiker_medailles_functie].filter(Boolean).join(', ');
        if(who){ out = out.replace(/(DOOR)(.*)$/,'$1  '+who); }
      }
      // Bloemen uitreiker (line 4 and line 5 of page block)
      if(idx===4 && (d.uitreiker_bloemen_naam || d.uitreiker_bloemen_functie)){
        const who = [d.uitreiker_bloemen_naam, d.uitreiker_bloemen_functie].filter(Boolean).join(', ');
        if(who){ out = out.replace(/(DOOR)(.*)$/,'$1  '+who); }
      }
      if(idx===5 && (d.uitreiker_bloemen_naam || d.uitreiker_bloemen_functie)){
        // Replace pure ellipsis line with nothing or keep as is – we'll keep as is so the exact layout remains.
      }

      // Line 13: "DERDE PLAATS:  ..…… TWEEDE PLAATS:  ……"
      if(idx===13){
        if(d.derde_naam){
          out = out.replace(/(DERDE PLAATS:\s*)([.\u2026]+[^T]*)/,'$1'+d.derde_naam+'   ');
        }
        if(d.tweede_naam){
          out = out.replace(/(TWEEDE PLAATS:\s*)(.*)$/,'$1'+d.tweede_naam);
        }
      }

      // Line 14: kampioen naam
      if(idx===14 && d.eerste_naam){
        out = out.replace(/…+/, d.eerste_naam);
      }

      return out;
    });
  }

  function render(){
    const d = currentData();
    const lines = injectIntoExactLines(d);
    linesWrap.innerHTML = '';
    lines.forEach((txt, i) => {
      const div = document.createElement('div');
      div.className = 'line';
      div.tabIndex = 0;
      div.dataset.idx = i;
      div.textContent = txt;
      linesWrap.appendChild(div);
    });
    // Keep first active if none
    setActiveLine(activeIdx);
  }

  // Editing on/off
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

  // Arrow key navigation
  let activeIdx = 0;
  function setActiveLine(idx){
    const children = Array.from(linesWrap.children);
    if(children.length===0) return;
    if(idx<0) idx = 0;
    if(idx>=children.length) idx = children.length-1;
    activeIdx = idx;
    children.forEach((el,i)=>{
      el.classList.toggle('active', i===activeIdx);
    });
    children[activeIdx].scrollIntoView({behavior:'smooth', block:'center'});
  }

  document.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowDown'){
      e.preventDefault();
      setActiveLine(activeIdx+1);
    } else if(e.key === 'ArrowUp'){
      e.preventDefault();
      setActiveLine(activeIdx-1);
    }
  });

  if(form){
    form.addEventListener('input', render);
  }
  if(editBtn) editBtn.addEventListener('click', ()=> setEditing(true));
  if(saveBtn) saveBtn.addEventListener('click', save);

  // init
  setEditing(true); // start in edit so je kunt gelijk invullen
  load();
  render();
  setActiveLine(0);
})();