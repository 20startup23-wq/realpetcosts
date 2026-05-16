var pet=null,size="medium",view="firstYear",ins=false;
var COSTS={dog:{small:{firstYear:{food:280,vet:450,grooming:220,supplies:260,training:200,spayNeuter:350,toys:100,boarding:300,misc:110},ongoing:{food:280,vet:400,grooming:220,supplies:60,training:0,spayNeuter:0,toys:100,boarding:300,misc:110}},medium:{firstYear:{food:480,vet:550,grooming:320,supplies:320,training:300,spayNeuter:420,toys:150,boarding:400,misc:150},ongoing:{food:480,vet:500,grooming:320,supplies:80,training:0,spayNeuter:0,toys:150,boarding:400,misc:150}},large:{firstYear:{food:800,vet:700,grooming:420,supplies:460,training:500,spayNeuter:520,toys:200,boarding:600,misc:200},ongoing:{food:800,vet:650,grooming:420,supplies:100,training:0,spayNeuter:0,toys:200,boarding:600,misc:200}}},cat:{standard:{firstYear:{food:320,vet:380,grooming:50,supplies:220,spayNeuter:300,toys:80,litter:300,misc:100},ongoing:{food:320,vet:350,grooming:50,supplies:50,spayNeuter:0,toys:80,litter:300,misc:100}}},rabbit:{standard:{firstYear:{food:200,vet:300,supplies:220,spayNeuter:250,toys:50,hay:200,misc:80},ongoing:{food:200,vet:250,supplies:40,spayNeuter:0,toys:50,hay:200,misc:80}}},bird:{standard:{firstYear:{food:150,vet:200,supplies:320,training:60,toys:80,misc:60},ongoing:{food:150,vet:150,supplies:60,training:0,toys:80,misc:60}}}};
var LIFE={dog:{small:15,medium:12,large:10},cat:{standard:16},rabbit:{standard:10},bird:{standard:12}};
var INS={dog:{small:500,medium:800,large:1100},cat:{standard:350},rabbit:{standard:0},bird:{standard:0}};
var CLBLS={food:"Food & treats",vet:"Veterinary care",grooming:"Grooming",supplies:"Supplies",training:"Training",spayNeuter:"Spay / neuter",toys:"Toys & enrichment",boarding:"Boarding / sitting",litter:"Litter",hay:"Hay & bedding",misc:"Miscellaneous"};
var CICONS={food:"🍖",vet:"🩺",grooming:"✂️",supplies:"📦",training:"🎓",spayNeuter:"❤️",toys:"⭐",boarding:"🏠",litter:"📦",hay:"🌿",misc:"•"};

function fmt(n){return"$"+Math.round(n).toLocaleString();}
function fmtK(n){var v=Math.round(n/100)/10;return v>=10?"$"+Math.round(v)+"k":"$"+v.toFixed(1)+"k";}

function getVerdict(monthly,income){
  if(!income||income<=0)return null;
  var pct=Math.round((monthly/income)*100);
  if(pct<=5)return{msg:"This pet fits comfortably within your budget — "+pct+"% of your monthly income.",color:"#0F6E56",bg:"#E1F5EE"};
  if(pct<=10)return{msg:"This pet is manageable but will require some budgeting — "+pct+"% of your monthly income.",color:"#854F0B",bg:"#FDF0DC"};
  if(pct<=15)return{msg:"This pet will stretch your budget. Consider a smaller breed or a cat — "+pct+"% of your monthly income.",color:"#C4700A",bg:"#FEF3E2"};
  return{msg:"This pet may strain your finances. Build a 3-month emergency fund first — "+pct+"% of your monthly income.",color:"#A32D2D",bg:"#FCEBEB"};
}

function renderPets(){
  var g=document.getElementById("pet-grid");g.innerHTML="";
  [{id:"dog",l:"Dog",e:"🐕"},{id:"cat",l:"Cat",e:"🐈"},{id:"rabbit",l:"Rabbit",e:"🐇"},{id:"bird",l:"Bird",e:"🐦"}].forEach(function(p){
    var b=document.createElement("button");
    b.className="pb"+(pet===p.id?" on":"");
    b.innerHTML='<span class="ic">'+p.e+'</span><span class="lb">'+p.l+'</span>';
    b.onclick=function(){pet=p.id;ins=false;render();};
    g.appendChild(b);
  });
}

function renderSizes(){
  var sec=document.getElementById("size-section");
  sec.style.display=pet==="dog"?"block":"none";
  if(pet!=="dog")return;
  var g=document.getElementById("size-grid");g.innerHTML="";
  [{id:"small",l:"Small",s:"Under 25 lbs"},{id:"medium",l:"Medium",s:"25-60 lbs"},{id:"large",l:"Large",s:"Over 60 lbs"}].forEach(function(s){
    var b=document.createElement("button");
    b.className="sb"+(size===s.id?" on":"");
    b.innerHTML='<div class="sm">'+s.l+'</div><div class="ss">'+s.s+'</div>';
    b.onclick=function(){size=s.id;render();};
    g.appendChild(b);
  });
}

function renderIns(){
  var v=pet==="dog"?size:"standard";
  var amt=pet?INS[pet][v]||0:0;
  var row=document.getElementById("ins-row");
  if(!pet||amt===0){row.style.display="none";return;}
  row.style.display="flex";
  document.getElementById("ins-label").textContent="Est. "+fmt(amt)+"/yr — accidents, illness, preventive care";
  var sw=document.getElementById("ins-toggle");
  sw.className="tsw"+(ins?" on":"");
  sw.querySelector(".tk").style.left=ins?"23px":"3px";
}

function toggleIns(){ins=!ins;render();}

function setView(v){
  view=v;
  document.getElementById("tab-first").className="vt"+(v==="firstYear"?" on":"");
  document.getElementById("tab-ongoing").className="vt"+(v==="ongoing"?" on":"");
  renderResults();
}

function renderResults(){
  if(!pet){document.getElementById("results").style.display="none";return;}
  document.getElementById("results").style.display="block";
  var v=pet==="dog"?size:"standard";
  var data=COSTS[pet][v];if(!data)return;
  var insAmt=ins?(INS[pet][v]||0):0;
  var lifespan=LIFE[pet][v];
  var cats=data[view];
  var base=Object.values(cats).reduce(function(a,b){return a+b;},0);
  var total=base+insAmt;
  var fy=Object.values(data.firstYear).reduce(function(a,b){return a+b;},0)+(ins?INS[pet][v]:0);
  var ong=Object.values(data.ongoing).reduce(function(a,b){return a+b;},0)+(ins?INS[pet][v]:0);
  var lifetime=fy+(ong*(lifespan-1));
  document.getElementById("c1l").textContent=view==="firstYear"?"First year total":"Annual cost";
  document.getElementById("c1v").textContent=fmt(total);
  document.getElementById("c2l").textContent="Lifetime ("+lifespan+" yrs)";
  document.getElementById("c2v").textContent=fmtK(lifetime);
  document.getElementById("monthly").textContent=fmt(total/12)+"/mo";
  var income=parseFloat(document.getElementById("income-input").value)||0;
  var verdict=getVerdict(total/12,income);
  var vbox=document.getElementById("verdict");
  if(verdict){vbox.style.display="block";vbox.style.background=verdict.bg;vbox.style.color=verdict.color;vbox.style.border="1px solid "+verdict.color+"44";vbox.textContent=verdict.msg;}
  else{vbox.style.display="none";}
  var entries=Object.entries(cats).filter(function(e){return e[1]>0;}).sort(function(a,b){return b[1]-a[1];});
  var maxV=Math.max.apply(null,entries.map(function(e){return e[1];}).concat([insAmt]));
  var bd=document.getElementById("breakdown");bd.innerHTML="";
  entries.forEach(function(entry,i){
    var key=entry[0];var val=entry[1];
    var row=document.createElement("div");
    row.className="bkrow";
    row.style.borderBottom=i<entries.length-1?"1px solid rgba(26,23,20,0.08)":"none";
    var pct=Math.round((val/maxV)*100);
    row.innerHTML='<div class="bkr-top"><span class="bic">'+(CICONS[key]||"•")+'</span><span class="bnm">'+(CLBLS[key]||key)+'</span><span class="bvl">'+fmt(val)+'</span></div><div class="bbg"><div class="bb" style="width:'+pct+'%"></div></div>';
    bd.appendChild(row);
  });
  if(ins&&insAmt>0){
    var row=document.createElement("div");row.className="bkrow ins";
    var pct=Math.round((insAmt/maxV)*100);
    row.innerHTML='<div class="bkr-top"><span class="bic">🛡️</span><span class="bnm">Pet insurance</span><span class="bvl">'+fmt(insAmt)+'</span></div><div class="bbg"><div class="bb" style="width:'+pct+'%"></div></div>';
    bd.appendChild(row);
  }
}

function render(){renderPets();renderSizes();renderIns();renderResults();}

document.addEventListener("DOMContentLoaded",function(){
  document.getElementById("income-input").addEventListener("input",renderResults);
  render();
});