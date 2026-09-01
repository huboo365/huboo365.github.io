// ===== 岩速鉴 RockID · 应用逻辑 =====

// 预处理：把每块岩石的标签拉平成一个数组，便于筛选匹配
ROCKS.forEach(r => {
  r._all = [].concat(r.tags.c || [], r.tags.t || [], r.tags.s || [], r.tags.m || [], r.tags.sp || []);
});

const CAT_COLOR = {'岩浆岩':'ig','沉积岩':'se','变质岩':'me'};
const CAT_ICON = {'岩浆岩':'▲','沉积岩':'▤','变质岩':'◈'};

// ---- 筛选组配置：快速定名功能 ----
const FILTER_GROUPS = [
  {title:'颜色', options:[
    {label:'浅色(白/浅灰)', tags:['浅色']},
    {label:'中色(灰)', tags:['中色/灰']},
    {label:'深色(黑绿/暗绿)', tags:['深色/黑绿']},
    {label:'黑色', tags:['黑色']},
    {label:'肉红/红褐色', tags:['肉红']},
    {label:'黄褐色系', tags:['黄色/褐黄']},
    {label:'绿色系', tags:['绿色']},
    {label:'杂色/斑驳', tags:['杂色']},
  ]},
  {title:'结构(颗粒特征)', options:[
    {label:'显晶质·粗粒', tags:['显晶质','粗粒']},
    {label:'显晶质·中/等粒', tags:['显晶质','中粒','等粒']},
    {label:'隐晶质/玻璃质', tags:['隐晶质','玻璃质']},
    {label:'斑状结构', tags:['斑状','斑状变晶']},
    {label:'碎屑结构(砾/砂)', tags:['碎屑结构']},
    {label:'泥质结构', tags:['泥质结构']},
    {label:'结晶变晶结构', tags:['结晶粒状(变晶)']},
    {label:'鳞片变晶(片状可见)', tags:['鳞片变晶']},
    {label:'糜棱/碎裂结构', tags:['糜棱结构','碎裂结构']},
    {label:'变余结构(原岩痕迹)', tags:['变余结构']},
  ]},
  {title:'构造', options:[
    {label:'块状构造', tags:['块状']},
    {label:'气孔状/杏仁状', tags:['气孔状/杏仁状']},
    {label:'流纹状构造', tags:['流纹状']},
    {label:'层理构造', tags:['层理构造']},
    {label:'板状/千枚状(劈理)', tags:['板状/千枚状']},
    {label:'片状构造(片理)', tags:['片状构造(片理)']},
    {label:'片麻状构造', tags:['片麻状构造']},
    {label:'条带状构造', tags:['条带状']},
    {label:'角砾状构造', tags:['角砾状构造']},
    {label:'蜂窝状/多孔状', tags:['蜂窝状/多孔状']},
  ]},
  {title:'主要矿物', options:[
    {label:'石英', tags:['石英']}, {label:'钾长石', tags:['钾长石']},
    {label:'斜长石', tags:['斜长石']}, {label:'黑云母', tags:['黑云母']},
    {label:'白云母', tags:['白云母']}, {label:'角闪石', tags:['角闪石']},
    {label:'辉石', tags:['辉石']}, {label:'橄榄石', tags:['橄榄石']},
    {label:'方解石', tags:['方解石']}, {label:'白云石', tags:['白云石']},
    {label:'石榴子石', tags:['石榴子石']}, {label:'绿泥石', tags:['绿泥石']},
    {label:'蛇纹石', tags:['蛇纹石']}, {label:'滑石', tags:['滑石']},
    {label:'石膏', tags:['石膏']}, {label:'石盐', tags:['石盐']},
    {label:'黏土矿物', tags:['黏土矿物']}, {label:'有机质/碳质', tags:['有机质/碳质']},
    {label:'磷灰石', tags:['磷灰石']}, {label:'硅质(玉髓)', tags:['硅质(玉髓/隐晶石英)']},
    {label:'红柱石', tags:['红柱石']},
  ]},
  {title:'特殊鉴定特征', options:[
    {label:'遇稀盐酸剧烈起泡', tags:['遇稀盐酸剧烈起泡']},
    {label:'粉末遇酸微弱起泡', tags:['粉末遇盐酸微弱起泡']},
    {label:'硬度低·指甲可刻划', tags:['硬度低指甲可刻划','硬度极低指甲可刻划','硬度低']},
    {label:'贝壳状断口', tags:['贝壳状断口']},
    {label:'可燃', tags:['可燃']},
    {label:'具丝绢/蜡状光泽', tags:['丝绢光泽','蜡状/油脂光泽']},
    {label:'可沿层面剥成薄片', tags:['可沿层面剥成薄片']},
    {label:'质轻可浮水', tags:['密度极低可浮水']},
  ]},
];

let selectedTags = new Set();
let favorites = new Set(JSON.parse(localStorage.getItem('rockid_favs') || '[]'));

function saveFavs(){ localStorage.setItem('rockid_favs', JSON.stringify([...favorites])); }
function toggleFav(name){
  if(favorites.has(name)) favorites.delete(name); else favorites.add(name);
  saveFavs();
}

// ---------- 标签页切换 ----------
const tabs = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('.panel');
tabs.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    tabs.forEach(b=>b.classList.remove('active'));
    panels.forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.target).classList.add('active');
  });
});

// ---------- Tab1: 快速定名 ----------
function renderFilters(){
  const wrap = document.getElementById('filterGroups');
  wrap.innerHTML = FILTER_GROUPS.map((g,gi)=>`
    <div class="fgroup">
      <div class="fgroup-title">${g.title}</div>
      <div class="fchips">
        ${g.options.map((o,oi)=>`<button class="chip" data-key="${gi}-${oi}">${o.label}</button>`).join('')}
      </div>
    </div>`).join('');
  wrap.querySelectorAll('.chip').forEach(chip=>{
    chip.addEventListener('click', ()=>{
      chip.classList.toggle('on');
      const key = chip.dataset.key;
      if(chip.classList.contains('on')) selectedTags.add(key); else selectedTags.delete(key);
      runIdentify();
    });
  });
}

function flatSelectedTagLists(){
  return [...selectedTags].map(key=>{
    const [gi,oi] = key.split('-').map(Number);
    return FILTER_GROUPS[gi].options[oi].tags;
  });
}

function runIdentify(){
  const resultBox = document.getElementById('identifyResults');
  const countEl = document.getElementById('selectedCount');
  countEl.textContent = selectedTags.size;
  if(selectedTags.size === 0){
    resultBox.innerHTML = `<div class="empty-hint">在上方勾选观察到的颜色、结构、构造、矿物或特殊特征（可多选），匹配结果会实时显示在这里。选择的特征越具体，定名越精准。</div>`;
    return;
  }
  const criteria = flatSelectedTagLists();
  const scored = ROCKS.map(r=>{
    let hit = 0;
    criteria.forEach(tagset=>{ if(tagset.some(t=>r._all.includes(t))) hit++; });
    return {r, hit};
  }).filter(x=>x.hit>0).sort((a,b)=> b.hit-a.hit || a.r.n.localeCompare(b.r.n));

  if(scored.length===0){
    resultBox.innerHTML = `<div class="empty-hint">未找到匹配的岩石，试着减少一些筛选条件，或检查特征组合是否合理。</div>`;
    return;
  }
  const total = criteria.length;
  resultBox.innerHTML = scored.slice(0,20).map(({r,hit})=>{
    const pct = Math.round(hit/total*100);
    return `<div class="match-card ${CAT_COLOR[r.cat]}" data-name="${r.n}">
      <div class="match-top">
        <span class="cat-tag ${CAT_COLOR[r.cat]}">${CAT_ICON[r.cat]} ${r.cat}</span>
        <span class="match-pct">符合度 ${pct}%<span class="match-bar"><i style="width:${pct}%"></i></span></span>
      </div>
      <div class="match-name">${r.n} <span class="en">${r.en}</span></div>
      <div class="match-sub">${r.sub}</div>
    </div>`;
  }).join('');
  resultBox.querySelectorAll('.match-card').forEach(card=>{
    card.addEventListener('click', ()=>openDetail(card.dataset.name, true));
  });
}

function clearFilters(){
  selectedTags.clear();
  document.querySelectorAll('#filterGroups .chip.on').forEach(c=>c.classList.remove('on'));
  runIdentify();
}
document.getElementById('clearFiltersBtn').addEventListener('click', clearFilters);

// ---------- Tab2: 岩石百科 ----------
let dictCatFilter = '全部';
function renderDictList(){
  const q = document.getElementById('dictSearch').value.trim();
  const list = document.getElementById('dictList');
  const filtered = ROCKS.filter(r=>{
    const catOk = dictCatFilter==='全部' || r.cat===dictCatFilter;
    const qOk = !q || r.n.includes(q) || r.en.toLowerCase().includes(q.toLowerCase());
    return catOk && qOk;
  });
  if(filtered.length===0){
    list.innerHTML = `<div class="empty-hint">没有找到匹配"${q}"的岩石</div>`;
    return;
  }
  list.innerHTML = filtered.map(r=>`
    <button class="dict-item ${CAT_COLOR[r.cat]}" data-name="${r.n}">
      <span class="dict-item-name">${r.n}</span>
      <span class="dict-item-sub">${r.sub}</span>
    </button>`).join('');
  list.querySelectorAll('.dict-item').forEach(btn=>{
    btn.addEventListener('click', ()=>openDetail(btn.dataset.name, false));
  });
}
document.getElementById('dictSearch').addEventListener('input', renderDictList);
document.querySelectorAll('.cat-filter-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.cat-filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    dictCatFilter = btn.dataset.cat;
    renderDictList();
  });
});

function mineralRows(r){
  return r.min.map(([m,pct])=>`<tr><td>${m}</td><td>${pct}</td></tr>`).join('');
}

function detailCardHTML(r){
  const isFav = favorites.has(r.n);
  return `
  <div class="detail-card ${CAT_COLOR[r.cat]}">
    <div class="detail-head">
      <div>
        <span class="cat-tag ${CAT_COLOR[r.cat]}">${CAT_ICON[r.cat]} ${r.cat} · ${r.sub}</span>
        <h2>${r.n} <span class="en">${r.en}</span></h2>
      </div>
      <button class="fav-btn ${isFav?'on':''}" data-name="${r.n}" title="收藏">${isFav?'★':'☆'}</button>
    </div>
    <div class="detail-grid">
      <div class="detail-item">
        <div class="detail-label">颜色</div>
        <div class="detail-val">${r.color}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">结构</div>
        <div class="detail-val">${r.tex}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">构造</div>
        <div class="detail-val">${r.struct}</div>
      </div>
      <div class="detail-item wide">
        <div class="detail-label">矿物成分及含量</div>
        <table class="min-table"><tbody>${mineralRows(r)}</tbody></table>
      </div>
      <div class="detail-item wide sig">
        <div class="detail-label">地质环境 / 构造意义</div>
        <div class="detail-val">${r.sig}</div>
      </div>
    </div>
  </div>`;
}

function openDetail(name){
  const r = ROCKS.find(x=>x.n===name);
  if(!r) return;
  document.getElementById('detailModal').innerHTML =
    '<button class="close-btn" id="detailClose">&times;</button>' + detailCardHTML(r);
  document.getElementById('detailOverlay').classList.add('show');
}
// 事件委托：收藏按钮、关闭按钮、遮罩点击均在此统一处理（模态内容会被整体替换）
document.getElementById('detailOverlay').addEventListener('click', (e)=>{
  if(e.target.id==='detailOverlay' || e.target.id==='detailClose'){
    document.getElementById('detailOverlay').classList.remove('show');
    return;
  }
  const favBtn = e.target.closest('.fav-btn');
  if(favBtn){
    const name = favBtn.dataset.name;
    toggleFav(name);
    favBtn.classList.toggle('on');
    favBtn.textContent = favorites.has(name) ? '★' : '☆';
    renderFavorites();
  }
});

// ---------- Tab3: 对比工具 ----------
function fillCompareSelects(){
  const opts = ROCKS.map(r=>`<option value="${r.n}">${r.n}</option>`).join('');
  document.getElementById('compareA').innerHTML = '<option value="">选择岩石 A</option>'+opts;
  document.getElementById('compareB').innerHTML = '<option value="">选择岩石 B</option>'+opts;
}
function renderCompare(){
  const a = ROCKS.find(r=>r.n===document.getElementById('compareA').value);
  const b = ROCKS.find(r=>r.n===document.getElementById('compareB').value);
  const box = document.getElementById('compareResult');
  if(!a || !b){ box.innerHTML = '<div class="empty-hint">选择两种岩石，逐项对比其鉴定特征，帮助区分易混淆的岩石类型。</div>'; return; }
  const rows = [
    ['分类', a.cat+' · '+a.sub, b.cat+' · '+b.sub],
    ['颜色', a.color, b.color],
    ['矿物成分', a.min.map(m=>m[0]+' '+m[1]).join('；'), b.min.map(m=>m[0]+' '+m[1]).join('；')],
    ['结构', a.tex, b.tex],
    ['构造', a.struct, b.struct],
    ['地质意义', a.sig, b.sig],
  ];
  box.innerHTML = `<table class="compare-table">
    <thead><tr><th></th><th>${a.n}</th><th>${b.n}</th></tr></thead>
    <tbody>${rows.map(([label,va,vb])=>`<tr><td class="rowlabel">${label}</td><td>${va}</td><td>${vb}</td></tr>`).join('')}</tbody>
  </table>`;
}
document.getElementById('compareA').addEventListener('change', renderCompare);
document.getElementById('compareB').addEventListener('change', renderCompare);

// ---------- Tab4: 矿物速查 ----------
function renderMinerals(){
  const q = document.getElementById('mineralSearch').value.trim().toLowerCase();
  const list = MINERALS.filter(m=> !q || m.n.includes(q) || m.en.toLowerCase().includes(q));
  document.getElementById('mineralList').innerHTML = list.map(m=>`
    <div class="mineral-card">
      <div class="mineral-name">${m.n} <span class="en">${m.en}</span></div>
      <div class="mineral-grid">
        <div><span class="mlabel">颜色</span>${m.color}</div>
        <div><span class="mlabel">光泽</span>${m.luster}</div>
        <div><span class="mlabel">硬度</span>${m.hardness}</div>
        <div><span class="mlabel">解理</span>${m.cleavage}</div>
      </div>
      <div class="mineral-feature">${m.feature}</div>
    </div>`).join('');
}
document.getElementById('mineralSearch').addEventListener('input', renderMinerals);

// ---------- Tab5: 收藏夹 ----------
function renderFavorites(){
  const box = document.getElementById('favList');
  if(favorites.size===0){
    box.innerHTML = `<div class="empty-hint">还没有收藏的岩石。在岩石详情卡片右上角点击 ☆ 即可收藏，方便野外快速复查。</div>`;
    return;
  }
  const items = ROCKS.filter(r=>favorites.has(r.n));
  box.innerHTML = items.map(r=>`
    <button class="dict-item ${CAT_COLOR[r.cat]}" data-name="${r.n}">
      <span class="dict-item-name">${r.n}</span>
      <span class="dict-item-sub">${r.sub}</span>
    </button>`).join('');
  box.querySelectorAll('.dict-item').forEach(btn=>{
    btn.addEventListener('click', ()=>openDetail(btn.dataset.name, false));
  });
}

// ---------- 主题切换 ----------
const themeBtn = document.getElementById('themeToggle');
function applyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('rockid_theme', t);
  themeBtn.textContent = t==='dark' ? '☀' : '☾';
}
themeBtn.addEventListener('click', ()=>{
  const cur = document.documentElement.getAttribute('data-theme');
  applyTheme(cur==='dark' ? 'light' : 'dark');
});

// ---------- 初始化 ----------
function init(){
  applyTheme(localStorage.getItem('rockid_theme') || 'dark');
  renderFilters();
  runIdentify();
  renderDictList();
  fillCompareSelects();
  renderCompare();
  renderMinerals();
  renderFavorites();
  document.getElementById('rockCount').textContent = ROCKS.length;
}
init();

// ---------- PWA: Service Worker 注册（离线可用 / 可安装） ----------
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('./sw.js').catch(()=>{});
  });
}
