
window.ScriptUtils=(function(){
  function getBundleTexts(){
    const defaults={
      prijsuitreiking:'PRIJSUITREIKING DAIKIN NK AFSTANDEN {{onderdeel}}.',
      brons_1:'DE BRONZEN MEDAILLE, MET EEN TIJD VAN {{tijd}}.',
      brons_2:'NAMENS {{team}}',
      brons_3:'{{naam}}',
      zilver_1:'DE ZILVEREN MEDAILLE, MET EEN TIJD VAN {{tijd}}.',
      zilver_2:'NAMENS {{team}}',
      zilver_3:'{{naam}}',
      goud_1:'EN HET GOUD VOOR DE WINNAAR VAN DEZE {{onderdeel}}.',
      goud_2:'MET EEN TIJD VAN {{tijd}}.',
      goud_3:'NAMENS {{team}}',
      goud_4:'{{naam}}',
      uit_medailles:'DE MEDAILLES WORDEN UITGEREIKT DOOR {{naam_functie}}.',
      uit_bloemen:'DE BLOEMEN EN CADEAUTJES WORDEN UITGEREIKT DOOR {{naam_functie}}.',
      volkslied:'THIALF, GAAT U STAAN EN GRAAG UW AANDACHT VOOR HET NATIONALE VOLKSLIED: HET WILHELMUS.',
      applaus:'GEEF ZE NOG EEN GROOT APPLAUS, HET PODIUM VAN DEZE {{onderdeel}}.',
      podium_3:'DERDE PLAATS: {{naam}}',
      podium_2:'TWEEDE PLAATS: {{naam}}',
      podium_1:'EERSTE PLAATS: {{naam}} (NEDERLANDS KAMPIOEN)'
    };
    try{const saved=JSON.parse(localStorage.getItem('bundle_texts')||'{}'); return Object.assign({},defaults,saved);}catch(e){return defaults;}
  }
  function setBundleTexts(obj){ localStorage.setItem('bundle_texts', JSON.stringify(obj||{})); }
  function format(tpl,map){ return tpl.replace(/{{\s*([\w_]+)\s*}}/g,(_,k)=>(map[k]??'')); }
  function escapeHtml(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
  function formatRich(tpl,map){ const plain=format(tpl,map||{}); let html=escapeHtml(plain); html=html.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>'); html=html.replace(/__(.+?)__/g,'<strong>$1</strong>'); return html; }
  function keyFor(onderdeel){ return 'fields:'+onderdeel; }
  function readData(onderdeel){ try{ return JSON.parse(localStorage.getItem(keyFor(onderdeel))||'{}'); }catch(e){ return {}; } }
  function writeData(onderdeel,data){ localStorage.setItem(keyFor(onderdeel), JSON.stringify(data||{})); }
  function allOnderdeelKeys(){ return ["500 Meter Vrouwen", "1000 Meter Vrouwen", "1500 Meter Vrouwen", "3000 Meter Vrouwen", "5000 Meter Vrouwen", "Mass Start Vrouwen", "500 Meter Mannen", "1000 Meter Mannen", "1500 Meter Mannen", "5000 Meter Mannen", "10000 Meter Mannen", "Mass Start Mannen", "Team Pursuit Mannen", "Team Pursuit Vrouwen"]; }
  return {getBundleTexts,setBundleTexts,format,formatRich,keyFor,readData,writeData,allOnderdeelKeys};
})();
