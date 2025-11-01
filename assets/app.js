
window.ScriptUtils=(function(){
  function keyFor(onderdeel){ return 'fields:'+onderdeel; }
  function readData(onderdeel){ try{ return JSON.parse(localStorage.getItem(keyFor(onderdeel))||'{}'); }catch(e){ return {}; } }
  function allOnderdeelKeys(){ return ["500 Meter Vrouwen", "1000 Meter Vrouwen", "1500 Meter Vrouwen", "3000 Meter Vrouwen", "5000 Meter Vrouwen", "Mass Start Vrouwen", "500 Meter Mannen", "1000 Meter Mannen", "1500 Meter Mannen", "5000 Meter Mannen", "10000 Meter Mannen", "Mass Start Mannen"]; }
  return {keyFor,readData,allOnderdeelKeys};
})();
