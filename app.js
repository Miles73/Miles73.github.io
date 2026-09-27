const canvas = document.querySelector('#rain');
const ctx = canvas.getContext('2d');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let width, height, columns, lastFrame = 0;
function resize() {
  width = innerWidth; height = innerHeight;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = width * dpr; canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  columns = Array.from({length: Math.ceil(width / 23)}, () => ({y: Math.random() * height, speed: 0.45 + Math.random() * 0.8, length: 7 + Math.floor(Math.random() * 24)}));
  paint(false);
}
function paint(move) {
  ctx.fillStyle = '#020704'; ctx.fillRect(0, 0, width, height);
  ctx.font = '14px monospace';
  columns.forEach((column, i) => {
    for (let j = 0; j < column.length; j++) {
      const y = column.y - j * 20;
      if(y < 0 || y > height) continue;
      const opacity = (1 - j / column.length) * .52;
      ctx.fillStyle = j === 0 ? 'rgba(165,222,175,.7)' : `rgba(41,133,66,${opacity})`;
      const index = (i * 17 + j * 7 + Math.floor(column.y / 80)) % chars.length;
      ctx.fillText(chars[index], i * 23 + 3, y);
    }
    if(move) { column.y += column.speed * 3; if(column.y - column.length * 20 > height) column.y = -20; }
  });
}
function frame(time) {
  if(!document.hidden && !reducedMotion.matches && time - lastFrame > 48) {paint(true); lastFrame = time;}
  requestAnimationFrame(frame);
}
addEventListener('resize', resize); resize(); requestAnimationFrame(frame);
const content = document.querySelector('#content');
const home = `<p class="section-label">01 / HOME</p><h2>欢迎来到我的数字角落。</h2><p class="intro">在这里，留下一些思考，整理一些笔记，<br>也把脑海中的想法，慢慢变成现实。</p><p class="intro">这是我的个人空间。很高兴你选择了红色药丸。</p><hr class="divider"><div class="section-head"><h3>最近的记录</h3><span>RECENT ENTRIES</span></div><a class="note-link" href="#notes"><span class="meta">001 · 随想</span><span class="note-title">给思考留一点空白</span><span class="note-sub">关于记录、注意力，以及慢一点的生活。</span></a><a class="note-link" href="#projects"><span class="meta">002 · 构建</span><span class="note-title">从一个小小的网站开始</span><span class="note-sub">在互联网里，建造属于自己的房间。</span></a><p class="sample-label">首版示例内容 · 待写入你的故事</p>`;
const pages = {
  home,
  notes: `<p class="section-label">02 / NOTES</p><h2>把想法，留在这里。</h2><p class="intro">一些尚未完成的思考，一些不想遗忘的瞬间。</p><details class="note-details"><summary><span class="meta">001 · 随想 / THOUGHTS</span><span class="note-title">给思考留一点空白</span><span class="note-sub">关于记录、注意力，以及慢一点的生活。</span></summary><div class="article-body"><p>不必每一次记录都有答案。有时写下一个问题，就已经让模糊的想法变得清晰了一点。</p><p>把注意力从不断更新的信息里收回来。读几页书，写几行字，允许一天里有一些什么也不做的时刻。</p><p>留一点空白，让新的想法有地方生长。</p></div></details><details class="note-details"><summary><span class="meta">002 · 记录 / JOURNAL</span><span class="note-title">为什么还需要一个个人网站</span><span class="note-sub">一个可以按照自己的节奏生长的地方。</span></summary><div class="article-body"><p>在互联网里拥有一个小小的房间，可以不追逐热点，也不用迎合推荐。只是把在意的事，按喜欢的方式摆放好。</p><p>笔记不需要完整，项目不需要宏大。这个空间的意义，是让那些细小的积累有迹可循。</p></div></details><p class="sample-label">以上为首版示例笔记。</p>`,
  projects: `<p class="section-label">03 / PROJECTS</p><h2>让想法，有迹可循。</h2><p class="intro">从小处开始，在构建中寻找答案。</p><article class="project-entry"><p class="meta">PROJECT 001 / WEB</p><h3>这个个人网站</h3><p>一个安静的数字空间，用来收藏笔记、整理想法、记录正在做的事。从一次选择开始，慢慢填入自己的故事。</p><span class="project-status">持续构建中 · IN PROGRESS</span></article>`,
  contact: `<p class="section-label">04 / CONTACT</p><h2>对话，从这里开始。</h2><p class="intro">关于共同的兴趣，关于一个新想法，<br>或者，只是打个招呼。</p><div class="empty-contact"><p class="contact-caption">KEEP IN TOUCH</p><p>联系方式尚未公开。</p><p class="note-sub">等准备好了，就在这里见。</p></div>`
};
let audio, master, musicTimer;
// Original, quiet ambient score: soft drones and a slowly changing pentatonic motif.
function startMusic() {
  if(!audio) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if(!AudioContext) return;
    audio = new AudioContext(); master = audio.createGain(); master.gain.value = 0;
    const compressor = audio.createDynamicsCompressor(); master.connect(compressor); compressor.connect(audio.destination);
    [55, 82.4069, 110.12, 164.8138].forEach((frequency,i)=> {
      const oscillator = audio.createOscillator(); const gain = audio.createGain();
      oscillator.type = 'sine'; oscillator.frequency.value = frequency;
      gain.gain.value = i === 0 ? .23 : .07;
      oscillator.connect(gain); gain.connect(master); oscillator.start();
    });
  }
  audio.resume().then(()=> {
    if(location.hash !== '#blue') return;
    master.gain.cancelScheduledValues(audio.currentTime);
    master.gain.setTargetAtTime(.24,audio.currentTime,1.2);
    if(musicTimer) return;
    let step = 0;
    const melody = [220,329.63,293.66,164.81,196,261.63,246.94,164.81];
    const playTone = ()=> {
      const t = audio.currentTime; const osc = audio.createOscillator(); const envelope = audio.createGain();
      osc.type='sine'; osc.frequency.value=melody[step++ % melody.length];
      envelope.gain.setValueAtTime(0,t); envelope.gain.linearRampToValueAtTime(.16,t+.5); envelope.gain.exponentialRampToValueAtTime(.001,t+4.5);
      osc.connect(envelope); envelope.connect(master); osc.start(t); osc.stop(t+5);
      osc.onended=()=>{osc.disconnect();envelope.disconnect();};
    };
    playTone(); musicTimer=setInterval(playTone,2800);
  }).catch(()=>{});
}
function stopMusic(){
  if(musicTimer) {clearInterval(musicTimer);musicTimer=null;}
  if(audio){master.gain.cancelScheduledValues(audio.currentTime);master.gain.setTargetAtTime(0,audio.currentTime,.15);}
}
document.querySelector('.blue-option').addEventListener('click', startMusic);
// A direct visit or refresh can resume audio on the next gesture, without visible UI.
document.addEventListener('pointerdown',()=>{if(location.hash==='#blue')startMusic();});
document.addEventListener('keydown',()=>{if(location.hash==='#blue')startMusic();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopMusic();else if(location.hash==='#blue')startMusic();});
function render() {
  const route = location.hash.slice(1) || 'choice';
  const isChoice = !['home', 'notes', 'projects', 'contact', 'blue'].includes(route);
  const isBlue = route === 'blue';
  document.querySelector('#choice').hidden = !isChoice;
  document.querySelector('#journal').hidden = isChoice || isBlue;
  document.body.className = isBlue ? 'blue-view' : isChoice ? '' : 'reading';
  document.querySelectorAll('nav a').forEach(a => { if(a.dataset.page === route) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  if(!isChoice && !isBlue) {content.innerHTML = pages[route]; content.focus({preventScroll:true});}
  if(!isBlue) stopMusic(); else if(audio) startMusic();
  document.title = isBlue ? '梦境 · The Matrix' : isChoice ? '选择由你 · The choice is yours' : `${{home:'首页',notes:'笔记',projects:'项目',contact:'联系'}[route]} · Personal Archive`;
}
addEventListener('hashchange', render); render();
