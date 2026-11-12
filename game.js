/* ================================================================
   WordShaker 98 — word game on a 4×4 board (uk / en)
   Sections: CONFIG · I18N · STORAGE · DICT · LETTERS · SOUND ·
             BOARD · INPUT · GAME · UI · INIT
   ================================================================ */
'use strict';

/* ---------------- CONFIG ---------------- */
const CONFIG = {
  ROUND_SEC: 180,
  MIN_LEN: 3,
  MAX_LEN: 7,
  POINTS: { 3: 1, 4: 2, 5: 3, 6: 4, 7: 5 },
  MIN_WORDS: { uk: 35, en: 45 },     // board quality threshold
  GEN_TRIES: 40,
  DICT_FILE: { uk: 'dict-uk.txt', en: 'dict-en.txt' },
  GITHUB: 'https://github.com/whyuxavier/wordshaker',
  STORAGE_KEY: 'wordshaker98'
};
// Debug: ?time=20 shortens the round (for testing only)
const _q = new URLSearchParams(location.search);
if (_q.get('time')) CONFIG.ROUND_SEC = Math.max(3, parseInt(_q.get('time'), 10) || 180);

/* ---------------- I18N ---------------- */
const T = {
  uk: {
    app_name: 'WordShaker 98',
    tagline: 'Знайди якомога більше слів на дошці 4×4 за три хвилини.',
    lang: 'Мова гри', play: 'Грати', how: 'Як грати', stats: 'Статистика', sound: 'Звук',
    about: 'Про гру', ok: 'OK', mb_game: 'Гра', mb_help: 'Довідка',
    st_ready: 'Готово', st_loading: 'Завантаження словника…', st_loaded: 'Словник: {n} слів',
    st_error: 'Не вдалося завантажити словник',
    tab_rules: 'Правила', tab_score: 'Бали',
    rules: [
      'На дошці 16 випадкових літер. Складай слова, з’єднуючи сусідні літери.',
      'Сусідні — по горизонталі, вертикалі та діагоналі.',
      'Кожну плитку можна використати лише раз в одному слові.',
      'Слово має містити від 3 до 7 літер і бути у словнику.',
      'Те саме слово двічі не зараховується. Власні назви, скорочення й слова через дефіс не приймаються.',
      'Раунд триває 3 хвилини. Чим довше слово — тим більше балів.'
    ],
    len: 'Довжина слова', pts: 'Бали', letters_n: '{n} літер', letters_3: '3 літери', letters_4: '4 літери',
    score_hint: 'Чим довше слово, тим більше балів.',
    score: 'Бали', words: 'Слова', found: 'Знайдені слова', clear: 'Очистити', submit: 'Готово',
    pause: 'Пауза', resume: 'Продовжити', restart: 'Заново', to_menu: 'У меню',
    generating: 'Генерую літери…', st_play: 'Тягни по сусідніх літерах, відпусти — слово зараховано',
    msg_ok: '«{w}» +{n}', msg_short: 'Замало літер — мінімум 3', msg_long: 'Забагато літер — максимум 7',
    msg_nodict: '«{w}» — немає у словнику', msg_dup: '«{w}» вже знайдено',
    times_up: 'Час вийшов!', longest: 'Найдовше', best: 'Рекорд', new_best: 'Новий рекорд!', again: 'Ще раз',
    no_words: 'Жодного слова', loading: 'Завантаження словника…',
    s_lang: 'Мова', s_games: 'Ігор зіграно', s_best: 'Рекорд', s_words: 'Слів знайдено', s_longest: 'Найдовше слово',
    controls: 'Керування',
    about_desc: 'Гра у слова в стилі старих настільних програм. На дошці 4×4 — випадкові літери; за 3 хвилини склади якнайбільше слів, з’єднуючи сусідні плитки. Українська та англійська — окремі режими зі своїми словниками.',
    about_controls: [
      'Миша: затисни на літері й тягни по сусідніх плитках, відпусти — слово перевіряється.',
      'Сенсор: так само пальцем; або торкайся плиток по одній, а потім «Готово» чи ще раз остання плитка.',
      'Клавіатура: Backspace — прибрати останню літеру, Enter — здати слово, Esc — пауза.'
    ],
    about_dict: 'Словники: ВЕСУМ (brown-uk/dict_uk, CC BY-NC-SA 4.0) та ENABLE (public domain). Працює офлайн.'
  },
  en: {
    app_name: 'WordShaker 98',
    tagline: 'Find as many words as you can on a 4×4 board in three minutes.',
    lang: 'Game language', play: 'Play', how: 'How to play', stats: 'Statistics', sound: 'Sound',
    about: 'About', ok: 'OK', mb_game: 'Game', mb_help: 'Help',
    st_ready: 'Ready', st_loading: 'Loading dictionary…', st_loaded: 'Dictionary: {n} words',
    st_error: 'Could not load the dictionary',
    tab_rules: 'Rules', tab_score: 'Scoring',
    rules: [
      'The board has 16 random letters. Build words by connecting adjacent tiles.',
      'Adjacent means horizontally, vertically or diagonally.',
      'Each tile can be used only once in a word.',
      'Words must be 3 to 7 letters long and present in the dictionary.',
      'The same word does not count twice. Proper names, abbreviations and hyphenated words are not accepted.',
      'A round lasts 3 minutes. Longer words earn more points.'
    ],
    len: 'Word length', pts: 'Points', letters_n: '{n} letters', letters_3: '3 letters', letters_4: '4 letters',
    score_hint: 'The longer the word, the more points.',
    score: 'Score', words: 'Words', found: 'Found words', clear: 'Clear', submit: 'Submit',
    pause: 'Pause', resume: 'Resume', restart: 'Restart', to_menu: 'Menu',
    generating: 'Shaking letters…', st_play: 'Drag across adjacent letters, release to submit',
    msg_ok: '“{w}” +{n}', msg_short: 'Too short — at least 3 letters', msg_long: 'Too long — at most 7 letters',
    msg_nodict: '“{w}” is not in the dictionary', msg_dup: '“{w}” already found',
    times_up: "Time's up!", longest: 'Longest', best: 'Best', new_best: 'New personal best!', again: 'Play again',
    no_words: 'No words', loading: 'Loading dictionary…',
    s_lang: 'Language', s_games: 'Games played', s_best: 'Best score', s_words: 'Words found', s_longest: 'Longest word',
    controls: 'Controls',
    about_desc: 'A word game styled like a late-90s desktop app. The 4×4 board shows random letters; you have 3 minutes to build as many words as possible by connecting adjacent tiles. Ukrainian and English are separate modes with their own dictionaries.',
    about_controls: [
      'Mouse: press on a letter and drag across adjacent tiles, release to submit.',
      'Touch: the same with a finger; or tap tiles one by one, then “Submit” or tap the last tile again.',
      'Keyboard: Backspace removes the last letter, Enter submits, Esc pauses.'
    ],
    about_dict: 'Dictionaries: VESUM (brown-uk/dict_uk, CC BY-NC-SA 4.0) and ENABLE (public domain). Works offline.'
  }
};
const LANG_NAME = { uk: 'Українська', en: 'English' };
const LANG_SHORT = { uk: 'UA', en: 'EN' };
let UI_LANG = 'uk';
function t(key, vars) {
  let s = (T[UI_LANG] && T[UI_LANG][key]) ?? T.uk[key] ?? key;
  if (typeof s === 'string' && vars) for (const k in vars) s = s.replace('{' + k + '}', vars[k]);
  return s;
}

/* ---------------- STORAGE ---------------- */
const STORAGE = {
  data: null,
  defaults() {
    return { sound: false, lang: 'uk',
      stats: { uk: { games: 0, best: 0, words: 0, longest: '' }, en: { games: 0, best: 0, words: 0, longest: '' } } };
  },
  load() {
    const d = this.defaults();
    try {
      const raw = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY) || '{}');
      if (typeof raw.sound === 'boolean') d.sound = raw.sound;
      if (raw.lang === 'uk' || raw.lang === 'en') d.lang = raw.lang;
      for (const l of ['uk', 'en']) {
        const s = raw.stats && raw.stats[l];
        if (s) {
          d.stats[l].games = Math.max(0, s.games | 0);
          d.stats[l].best = Math.max(0, s.best | 0);
          d.stats[l].words = Math.max(0, s.words | 0);
          d.stats[l].longest = typeof s.longest === 'string' ? s.longest : '';
        }
      }
    } catch (e) { /* ignore */ }
    this.data = d;
    return d;
  },
  persist() { try { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(this.data)); } catch (e) { /* ignore */ } }
};

/* ---------------- DICT ----------------
   Sorted word array per language + binary search for exact and prefix lookups. */
const DICT = {
  words: { uk: null, en: null },
  loading: {},
  normalize(w, lang) {
    w = String(w).toLowerCase().trim();
    if (lang === 'uk') w = w.replace(/[’'`]/g, '');
    return w;
  },
  async load(lang) {
    if (this.words[lang]) return this.words[lang];
    if (this.loading[lang]) return this.loading[lang];
    this.loading[lang] = (async () => {
      const res = await fetch(CONFIG.DICT_FILE[lang], { cache: 'force-cache' });
      if (!res.ok) throw new Error('dict ' + lang);
      const txt = await res.text();
      const arr = txt.split('\n').map(s => s.trim()).filter(Boolean);
      // ensure sorted by UTF-16 code units (JS default comparison)
      let sorted = true;
      for (let i = 1; i < arr.length; i++) if (arr[i - 1] > arr[i]) { sorted = false; break; }
      if (!sorted) arr.sort();
      this.words[lang] = arr;
      return arr;
    })();
    return this.loading[lang];
  },
  lowerBound(arr, s) {
    let lo = 0, hi = arr.length;
    while (lo < hi) { const mid = (lo + hi) >>> 1; if (arr[mid] < s) lo = mid + 1; else hi = mid; }
    return lo;
  },
  has(lang, w) {
    const arr = this.words[lang]; if (!arr) return false;
    const i = this.lowerBound(arr, w);
    return i < arr.length && arr[i] === w;
  },
  hasPrefix(lang, p) {
    const arr = this.words[lang]; if (!arr) return false;
    const i = this.lowerBound(arr, p);
    return i < arr.length && arr[i].startsWith(p);
  }
};

/* ---------------- LETTERS ----------------
   Frequency weights derived from the bundled dictionaries (per mille). */
const LETTERS = {
  uk: { alphabet: 'абвгґдеєжзиіїйклмнопрстуфхцчшщьюя', vowels: 'аеєиіїоуюя',
    weights: { 'а': 88, 'б': 20, 'в': 45, 'г': 17, 'ґ': 1, 'д': 26, 'е': 45, 'є': 8, 'ж': 9, 'з': 22, 'и': 65, 'і': 54, 'ї': 4, 'й': 12, 'к': 43, 'л': 43, 'м': 40, 'н': 56, 'о': 77, 'п': 30, 'р': 49, 'с': 36, 'т': 45, 'у': 55, 'ф': 5, 'х': 16, 'ц': 8, 'ч': 16, 'ш': 15, 'щ': 4, 'ь': 10, 'ю': 18, 'я': 18 } },
  en: { alphabet: 'abcdefghijklmnopqrstuvwxyz', vowels: 'aeiouy',
    weights: { a: 82, b: 24, c: 35, d: 42, e: 117, f: 16, g: 30, h: 25, i: 70, j: 3, k: 16, l: 55, m: 29, n: 55, o: 61, p: 30, q: 2, r: 71, s: 93, t: 55, u: 38, v: 10, w: 13, x: 4, y: 20, z: 5 } },
  _table: {},
  table(lang) {
    if (this._table[lang]) return this._table[lang];
    const w = this[lang].weights, keys = Object.keys(w), cum = [];
    let total = 0;
    for (const k of keys) { total += Math.pow(w[k], 0.85); cum.push(total); }
    return (this._table[lang] = { keys, cum, total });
  },
  random(lang) {
    const tb = this.table(lang), r = Math.random() * tb.total;
    for (let i = 0; i < tb.cum.length; i++) if (r < tb.cum[i]) return tb.keys[i];
    return tb.keys[tb.keys.length - 1];
  },
  setWeights(lang, weights) { this[lang].weights = weights; delete this._table[lang]; }
};

/* ---------------- SOUND ---------------- */
const Sound = {
  ctx: null, on: false,
  unlock() {
    if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; } }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  },
  tone(f, dur, type = 'square', vol = .12, f2, delay = 0) {
    if (!this.on || !this.ctx) return;
    try {
      const o = this.ctx.createOscillator(), g = this.ctx.createGain(), t0 = this.ctx.currentTime + delay;
      o.type = type; o.frequency.setValueAtTime(f, t0);
      if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + dur);
      g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
      o.connect(g).connect(this.ctx.destination); o.start(t0); o.stop(t0 + dur + .02);
    } catch (e) { /* ignore */ }
  },
  tileStop() { this.tone(900 + Math.random() * 300, .06, 'square', .06, 500); },
  select(n) { this.tone(440 + n * 60, .07, 'square', .08); },
  valid(n) { this.tone(660, .09, 'square', .1); this.tone(880, .12, 'square', .1, 1100, .09); if (n >= 5) this.tone(1320, .14, 'square', .1, 1760, .2); },
  invalid() { this.tone(180, .18, 'sawtooth', .09, 120); },
  tick() { this.tone(1000, .04, 'square', .05); },
  end() { this.tone(523, .15, 'square', .1); this.tone(392, .15, 'square', .1, null, .15); this.tone(262, .35, 'square', .1, null, .3); },
  click() { this.tone(600, .03, 'square', .05); }
};

/* ---------------- BOARD ---------------- */
const Board = {
  letters: [], lang: 'uk', ready: false, count: 0,
  neighbors(i) {
    const r = (i / 4) | 0, c = i % 4, out = [];
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      const rr = r + dr, cc = c + dc;
      if (rr >= 0 && rr < 4 && cc >= 0 && cc < 4) out.push(rr * 4 + cc);
    }
    return out;
  },
  adjacent(a, b) {
    const ra = (a / 4) | 0, ca = a % 4, rb = (b / 4) | 0, cb = b % 4;
    return a !== b && Math.abs(ra - rb) <= 1 && Math.abs(ca - cb) <= 1;
  },
  randomLetters(lang) {
    const L = LETTERS[lang];
    for (let tries = 0; tries < 50; tries++) {
      const arr = Array.from({ length: 16 }, () => LETTERS.random(lang));
      const v = arr.filter(ch => L.vowels.includes(ch)).length;
      const counts = {}; let maxRep = 0;
      for (const ch of arr) { counts[ch] = (counts[ch] || 0) + 1; maxRep = Math.max(maxRep, counts[ch]); }
      if (v >= 5 && v <= 9 && maxRep <= 3) return arr;
    }
    return Array.from({ length: 16 }, () => LETTERS.random(lang));
  },
  // count distinct dictionary words on a board (capped for speed)
  countWords(letters, lang, cap = 400) {
    const found = new Set(), used = new Array(16).fill(false);
    const dfs = (i, prefix) => {
      if (found.size >= cap) return;
      const p = prefix + letters[i];
      if (!DICT.hasPrefix(lang, p)) return;
      if (p.length >= CONFIG.MIN_LEN && DICT.has(lang, p)) found.add(p);
      if (p.length >= CONFIG.MAX_LEN) return;
      used[i] = true;
      for (const n of this.neighbors(i)) if (!used[n]) dfs(n, p);
      used[i] = false;
    };
    for (let i = 0; i < 16; i++) dfs(i, '');
    return found.size;
  },
  generate(lang) {
    let best = null;
    for (let tr = 0; tr < CONFIG.GEN_TRIES; tr++) {
      const letters = this.randomLetters(lang);
      const n = this.countWords(letters, lang);
      if (!best || n > best.count) best = { letters, count: n };
      if (n >= CONFIG.MIN_WORDS[lang]) break;
    }
    this.letters = best.letters; this.lang = lang; this.count = best.count; this.ready = false;
    return best;
  }
};

/* ---------------- GAME STATE ---------------- */
const Game = {
  lang: 'uk', running: false, paused: false, endAt: 0, remaining: 0, timer: null,
  score: 0, words: [], wordSet: new Set(), sel: [], lastTick: -1,
  reset(lang) {
    this.lang = lang; this.score = 0; this.words = []; this.wordSet = new Set(); this.sel = [];
    this.running = false; this.paused = false; this.remaining = CONFIG.ROUND_SEC * 1000; this.lastTick = -1;
  },
  currentWord() { return this.sel.map(i => Board.letters[i]).join(''); },
  points(w) { return CONFIG.POINTS[w.length] || 0; },
  validate(w) {
    if (w.length < CONFIG.MIN_LEN) return { ok: false, msg: 'msg_short' };
    if (w.length > CONFIG.MAX_LEN) return { ok: false, msg: 'msg_long' };
    if (this.wordSet.has(w)) return { ok: false, msg: 'msg_dup' };
    if (!DICT.has(this.lang, w)) return { ok: false, msg: 'msg_nodict' };
    return { ok: true };
  },
  accept(w) {
    const pts = this.points(w);
    this.score += pts; this.words.push(w); this.wordSet.add(w);
    return pts;
  },
  longest() { return this.words.reduce((a, b) => b.length > a.length ? b : a, ''); }
};

/* ---------------- UI ---------------- */
const $ = id => document.getElementById(id);
const UI = {
  screens: {}, cur: 'menu', prev: 'menu',
  init() {
    document.querySelectorAll('.screen').forEach(s => this.screens[s.dataset.screen] = s);
  },
  show(name) {
    for (const k in this.screens) this.screens[k].hidden = (k !== name);
    $('overlay').hidden = true;
    this.cur = name;
    $('task-cur').textContent = t(name === 'game' ? 'play' : name === 'results' ? 'times_up' : 'app_name');
  },
  dialog(name, open) {
    const s = this.screens[name];
    s.hidden = !open;
    $('overlay').hidden = !open;
    if (open) { const f = s.querySelector('.btn.primary, .btn, button'); f && f.focus({ preventScroll: true }); }
  },
  anyDialogOpen() { return !$('overlay').hidden; },
  applyLang() {
    document.documentElement.lang = UI_LANG;
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); });
    document.title = t('app_name');
    $('menu-lang').textContent = LANG_SHORT[UI_LANG];
    $('hud-lang').textContent = LANG_SHORT[UI_LANG];
    $('game-lang-title').textContent = LANG_NAME[UI_LANG];
    // rules
    const ol = $('rules-list'); ol.innerHTML = '';
    for (const r of t('rules')) { const li = document.createElement('li'); li.textContent = r; ol.appendChild(li); }
    // scoring table
    const st = $('score-table');
    let h = `<tr><th>${t('len')}</th><th>${t('pts')}</th></tr>`;
    for (let n = CONFIG.MIN_LEN; n <= CONFIG.MAX_LEN; n++) h += `<tr><td>${this.lettersLabel(n)}</td><td class="num">${CONFIG.POINTS[n]}</td></tr>`;
    st.innerHTML = h;
    // about
    $('about-desc').textContent = t('about_desc');
    const ul = $('about-controls'); ul.innerHTML = '';
    for (const c of t('about_controls')) { const li = document.createElement('li'); li.textContent = c; ul.appendChild(li); }
    $('about-dict').textContent = t('about_dict');
    $('hero-best').textContent = STORAGE.data.stats[UI_LANG].best;
    this.renderHero();
    this.renderStats();
  },
  lettersLabel(n) {
    if (UI_LANG === 'uk') return n === 3 ? t('letters_3') : n === 4 ? t('letters_4') : t('letters_n', { n });
    return t('letters_n', { n });
  },
  renderHero() {
    const preset = UI_LANG === 'uk'
      ? { letters: 'слонавокерідимзу', path: [0, 1, 2, 5, 6], word: 'СЛОВО' }
      : { letters: 'wordkesanltirsmp', path: [0, 1, 2, 3, 6], word: 'WORDS' };
    const g = $('hero-grid'); g.innerHTML = '';
    const x0 = 44, y0 = 92, sz = 52, gap = 8;
    const pts = [];
    preset.letters.split('').forEach((ch, i) => {
      const r = (i / 4) | 0, c = i % 4, x = x0 + c * (sz + gap), y = y0 + r * (sz + gap);
      const on = preset.path.includes(i);
      const grp = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      grp.setAttribute('class', 'h-cell'); grp.style.setProperty('--i', i);
      grp.innerHTML = `<rect class="h-tile${on ? ' on' : ''}" x="${x}" y="${y}" width="${sz}" height="${sz}" rx="2"/>` +
        `<text class="h-let" x="${x + sz / 2}" y="${y + sz / 2 + 1}">${ch.toUpperCase()}</text>`;
      g.appendChild(grp);
    });
    for (const i of preset.path) { const r = (i / 4) | 0, c = i % 4; pts.push((x0 + c * (sz + gap) + sz / 2) + ',' + (y0 + r * (sz + gap) + sz / 2)); }
    $('hero-path').setAttribute('points', pts.join(' '));
    $('hero-word').textContent = preset.word;
    $('hero-title').textContent = t('app_name');
    const hero = $('hero');
    hero.classList.remove('done');
    // after the one-shot animation, freeze final state
    clearTimeout(this._heroT);
    this._heroT = setTimeout(() => hero.classList.add('done'), 2300);
  },
  renderStats() {
    const s = STORAGE.data.stats;
    const rows = [['s_games', 'games'], ['s_best', 'best'], ['s_words', 'words'], ['s_longest', 'longest']];
    let h = `<tr><th>${t('s_lang')}</th><th>${LANG_NAME.uk}</th><th>${LANG_NAME.en}</th></tr>`;
    for (const [k, f] of rows) {
      const v = l => (f === 'longest' ? (s[l].longest ? s[l].longest.toUpperCase() : '—') : s[l][f]);
      h += `<tr><td>${t(k)}</td><td>${v('uk')}</td><td>${v('en')}</td></tr>`;
    }
    $('stats-table').innerHTML = h;
  },
  setSound(on) {
    Sound.on = on; STORAGE.data.sound = on; STORAGE.persist();
    $('chk-sound').checked = on;
    document.body.classList.toggle('snd-off', !on);
    $('tray-snd').classList.toggle('off', !on);
  },
  status(msg, cls) {
    const el = $('game-status'); el.textContent = msg; el.className = 'sb-cell' + (cls ? ' toast ' + cls : '');
  },
  fmtTime(ms) {
    const s = Math.max(0, Math.ceil(ms / 1000));
    return ((s / 60) | 0) + ':' + String(s % 60).padStart(2, '0');
  },
  /* ---- grid ---- */
  tiles: [],
  buildGrid() {
    const g = $('grid'); g.innerHTML = ''; this.tiles = [];
    for (let i = 0; i < 16; i++) {
      const d = document.createElement('div');
      d.className = 'tile'; d.dataset.i = i; d.textContent = '';
      g.appendChild(d); this.tiles.push(d);
    }
  },
  drawPath() {
    const wrap = $('grid-wrap'), svg = $('path-svg');
    const W = wrap.clientWidth, H = wrap.clientHeight;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const wr = wrap.getBoundingClientRect();
    const pts = Game.sel.map(i => {
      const r = this.tiles[i].getBoundingClientRect();
      return (r.left - wr.left + r.width / 2) + ',' + (r.top - wr.top + r.height / 2);
    });
    $('path-line').setAttribute('points', pts.join(' '));
  },
  refreshSel() {
    this.tiles.forEach((el, i) => el.classList.toggle('on', Game.sel.includes(i)));
    $('cur-word').textContent = Game.currentWord();
    this.drawPath();
  },
  flash(cls) {
    const wf = $('word-field'); wf.classList.remove('ok', 'bad'); void wf.offsetWidth; wf.classList.add(cls);
    const sel = Game.sel.slice();
    sel.forEach(i => this.tiles[i].classList.add('flash-' + cls));
    setTimeout(() => { wf.classList.remove(cls); sel.forEach(i => this.tiles[i].classList.remove('flash-' + cls)); }, cls === 'ok' ? 350 : 420);
  },
  updateHud() {
    $('hud-score').textContent = Game.score;
    $('hud-words').textContent = Game.words.length;
  },
  addFoundWord(w, pts) {
    const ul = $('found-list');
    const li = document.createElement('li');
    li.innerHTML = `<span>${w}</span><span class="pts">+${pts}</span>`;
    li.classList.add('new');
    ul.prepend(li);
    setTimeout(() => li.classList.remove('new'), 600);
    ul.scrollTop = 0;
  },
  /* ---- letter generation animation ---- */
  async animateBoard() {
    const L = LETTERS[Board.lang].alphabet;
    const tiles = this.tiles;
    Board.ready = false;
    tiles.forEach(el => { el.className = 'tile spin'; el.textContent = ''; });
    const order = [...Array(16).keys()].sort(() => Math.random() - .5);
    const stopAt = new Array(16);
    const base = 650, step = 55;
    order.forEach((idx, k) => { stopAt[idx] = base + k * step + Math.random() * 180; });
    const total = Math.max(...stopAt);
    const t0 = performance.now();
    const stopped = new Array(16).fill(false);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    await new Promise(resolve => {
      let lastFrame = 0;
      const frame = now => {
        const el = now - t0;
        if (now - lastFrame > 45) {
          lastFrame = now;
          for (let i = 0; i < 16; i++) {
            if (stopped[i]) continue;
            if (el >= stopAt[i] || reduced) {
              stopped[i] = true;
              tiles[i].textContent = Board.letters[i];
              tiles[i].className = 'tile stop';
              Sound.tileStop();
            } else {
              tiles[i].textContent = L[(Math.random() * L.length) | 0];
            }
          }
        }
        if (stopped.every(Boolean) || el > total + 100) {
          for (let i = 0; i < 16; i++) if (!stopped[i]) { tiles[i].textContent = Board.letters[i]; tiles[i].className = 'tile'; }
          resolve();
        } else requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    });
    setTimeout(() => tiles.forEach(el => el.classList.remove('stop')), 250);
    Board.ready = true;
  },
  /* ---- results ---- */
  renderResults(newBest) {
    $('res-score').textContent = Game.score;
    $('res-words').textContent = Game.words.length;
    const lw = Game.longest();
    $('res-longest').textContent = lw || '—';
    $('res-best').textContent = STORAGE.data.stats[Game.lang].best;
    $('res-new').hidden = !newBest;
    const box = $('res-groups'); box.innerHTML = '';
    if (!Game.words.length) { box.innerHTML = `<div class="empty" style="text-align:center;padding:20px;color:#666">${t('no_words')}</div>`; return; }
    const groups = {};
    for (const w of Game.words) (groups[w.length] = groups[w.length] || []).push(w);
    const lens = Object.keys(groups).map(Number).sort((a, b) => b - a);
    for (const n of lens) {
      const g = document.createElement('li'); g.className = 'group';
      g.textContent = `${this.lettersLabel(n)} — ${groups[n].length} × ${CONFIG.POINTS[n]}`;
      const ws = document.createElement('div'); ws.className = 'words';
      ws.textContent = groups[n].sort().join('  ·  ');
      box.appendChild(g); box.appendChild(ws);
    }
  }
};

/* ---------------- INPUT ---------------- */
const Input = {
  down: false, dragged: false, startTile: -1, startWasLast: false, lastHover: -1,
  init() {
    const wrap = $('grid-wrap');
    wrap.addEventListener('pointerdown', e => this.onDown(e));
    wrap.addEventListener('pointermove', e => this.onMove(e));
    wrap.addEventListener('pointerup', e => this.onUp(e));
    wrap.addEventListener('pointercancel', () => { this.down = false; });
    wrap.addEventListener('contextmenu', e => e.preventDefault());
    wrap.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
    document.addEventListener('selectstart', e => { if (UI.cur === 'game') e.preventDefault(); });
    document.addEventListener('keydown', e => this.onKey(e));
  },
  tileAt(x, y) {
    const el = document.elementFromPoint(x, y);
    const tile = el && el.closest ? el.closest('.tile') : null;
    if (!tile) return -1;
    // ignore the outer 12% of a tile so diagonal drags do not pick up corners
    const r = tile.getBoundingClientRect(), m = r.width * 0.12;
    if (x < r.left + m || x > r.right - m || y < r.top + m || y > r.bottom - m) return -1;
    return +tile.dataset.i;
  },
  canPlay() { return Game.running && !Game.paused && Board.ready; },
  add(i) {
    const s = Game.sel;
    if (s.includes(i)) return false;
    if (s.length && !Board.adjacent(s[s.length - 1], i)) return false;
    if (s.length >= CONFIG.MAX_LEN) return false;
    s.push(i); Sound.select(s.length); UI.refreshSel(); return true;
  },
  onDown(e) {
    if (!this.canPlay()) return;
    Sound.unlock();
    const i = this.tileAt(e.clientX, e.clientY);
    if (i < 0) return;
    e.preventDefault();
    try { $('grid-wrap').setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    this.down = true; this.dragged = false; this.startTile = i; this.lastHover = i;
    const s = Game.sel, last = s[s.length - 1];
    this.startWasLast = (last === i);
    if (s.includes(i)) {
      if (i === s[s.length - 2]) { s.pop(); UI.refreshSel(); this.startWasLast = false; }   // backtrack
      else if (i !== last) { Game.sel = [i]; UI.refreshSel(); this.startWasLast = false; }
    } else if (!this.add(i)) { Game.sel = [i]; Sound.select(1); UI.refreshSel(); }
  },
  onMove(e) {
    if (!this.down || !this.canPlay()) return;
    const i = this.tileAt(e.clientX, e.clientY);
    if (i < 0 || i === this.lastHover) return;
    this.lastHover = i;
    const s = Game.sel;
    if (s.includes(i)) {
      if (i === s[s.length - 2]) { s.pop(); UI.refreshSel(); this.dragged = true; }
      return;
    }
    if (this.add(i)) this.dragged = true;
  },
  onUp(e) {
    if (!this.down) return;
    this.down = false;
    if (!this.canPlay()) return;
    if (this.dragged) { Round.submit(); return; }
    // tap: tapping the last selected tile again submits
    if (this.startWasLast && Game.sel.length >= 2) Round.submit();
  },
  onKey(e) {
    if (e.key === 'Escape') {
      if (UI.cur === 'game' && Game.running) { if (Game.paused) Round.resume(); else Round.pause(); e.preventDefault(); }
      else if (UI.anyDialogOpen() && !['pause', 'results', 'loading'].some(n => !UI.screens[n].hidden)) { closeDialogs(); }
      return;
    }
    if (UI.cur !== 'game' || !this.canPlay()) return;
    if (e.key === 'Enter') { Round.submit(); e.preventDefault(); }
    else if (e.key === 'Backspace') { Game.sel.pop(); UI.refreshSel(); e.preventDefault(); }
  }
};

/* ---------------- ROUND FLOW ---------------- */
const Round = {
  async start(lang) {
    UI_LANG = lang; UI.applyLang();
    Game.reset(lang);
    UI.show('game');
    UI.buildGrid();
    $('found-list').innerHTML = '';
    UI.updateHud(); UI.refreshSel();
    $('hud-time').textContent = UI.fmtTime(Game.remaining); $('hud-time').classList.remove('warn');
    UI.status(t('generating'));
    Board.generate(lang);
    await UI.animateBoard();
    UI.status(t('st_play'));
    Game.running = true; Game.paused = false;
    Game.endAt = performance.now() + Game.remaining;
    this.startTimer();
  },
  startTimer() {
    clearInterval(Game.timer);
    Game.timer = setInterval(() => this.tick(), 200);
    this.tick();
  },
  tick() {
    if (!Game.running || Game.paused) return;
    Game.remaining = Game.endAt - performance.now();
    const el = $('hud-time');
    el.textContent = UI.fmtTime(Game.remaining);
    const s = Math.ceil(Game.remaining / 1000);
    el.classList.toggle('warn', s <= 10);
    if (s <= 10 && s !== Game.lastTick && s > 0) { Game.lastTick = s; Sound.tick(); }
    if (Game.remaining <= 0) this.end();
  },
  submit() {
    if (!Game.running || Game.paused || !Board.ready) return;
    const w = DICT.normalize(Game.currentWord(), Game.lang);
    if (!w) return;
    const v = Game.validate(w);
    if (v.ok) {
      const pts = Game.accept(w);
      UI.flash('ok'); UI.updateHud(); UI.addFoundWord(w, pts); UI.status(t('msg_ok', { w: w.toUpperCase(), n: pts }), 'good');
      Sound.valid(w.length);
    } else {
      UI.flash('bad'); UI.status(t(v.msg, { w: w.toUpperCase() }), 'bad'); Sound.invalid();
    }
    setTimeout(() => { Game.sel = []; UI.refreshSel(); }, v.ok ? 120 : 200);
  },
  pause() {
    if (!Game.running || Game.paused) return;
    Game.paused = true; Game.remaining = Game.endAt - performance.now();
    UI.dialog('pause', true);
  },
  resume() {
    if (!Game.running || !Game.paused) return;
    Game.paused = false; Game.endAt = performance.now() + Game.remaining;
    UI.dialog('pause', false);
    this.tick();
  },
  end() {
    clearInterval(Game.timer); Game.running = false; Game.paused = false;
    Game.sel = []; UI.refreshSel();
    $('hud-time').textContent = '0:00';
    Sound.end();
    const st = STORAGE.data.stats[Game.lang];
    st.games += 1; st.words += Game.words.length;
    const lw = Game.longest();
    if (lw.length > (st.longest || '').length) st.longest = lw;
    const newBest = Game.score > st.best;
    if (newBest) st.best = Game.score;
    STORAGE.persist();
    UI.renderResults(newBest);
    UI.dialog('results', true);
    UI.cur = 'results';
    $('task-cur').textContent = t('times_up');
  },
  stop() {
    clearInterval(Game.timer); Game.running = false; Game.paused = false;
  }
};

/* ---------------- NAVIGATION / INIT ---------------- */
function closeDialogs() {
  for (const n of ['how', 'stats', 'about', 'pause', 'results', 'loading']) UI.screens[n].hidden = true;
  $('overlay').hidden = true;
}
function toMenu() {
  Round.stop(); closeDialogs();
  UI.show('menu'); UI.applyLang();
}
async function ensureDict(lang) {
  if (DICT.words[lang]) return true;
  UI.dialog('loading', true);
  try {
    await DICT.load(lang);
    UI.dialog('loading', false);
    return true;
  } catch (e) {
    UI.dialog('loading', false);
    $('menu-status').textContent = t('st_error');
    return false;
  }
}
async function play() {
  Sound.unlock();
  const lang = STORAGE.data.lang;
  if (!(await ensureDict(lang))) return;
  Round.start(lang);
}

function init() {
  STORAGE.load();
  UI.init();
  Input.init();
  UI_LANG = STORAGE.data.lang;
  UI.setSound(STORAGE.data.sound);
  document.querySelector(`input[name=lang][value=${UI_LANG}]`).checked = true;
  UI.applyLang();
  UI.show('menu');

  // language selector
  document.querySelectorAll('input[name=lang]').forEach(r => r.addEventListener('change', e => {
    STORAGE.data.lang = e.target.value; STORAGE.persist();
    UI_LANG = e.target.value; UI.applyLang(); Sound.click();
    DICT.load(UI_LANG).then(arr => { if (UI.cur === 'menu') $('menu-status').textContent = t('st_loaded', { n: arr.length }); }).catch(() => {});
  }));
  $('chk-sound').addEventListener('change', e => { Sound.unlock(); UI.setSound(e.target.checked); Sound.click(); });
  $('btn-sound').addEventListener('click', () => { Sound.unlock(); UI.setSound(!Sound.on); Sound.click(); });
  $('btn-play').addEventListener('click', play);
  $('btn-how').addEventListener('click', () => { Sound.click(); UI.dialog('how', true); });
  $('btn-stats').addEventListener('click', () => { Sound.click(); UI.renderStats(); UI.dialog('stats', true); });
  $('btn-about').addEventListener('click', () => { Sound.click(); UI.dialog('about', true); });
  $('btn-about2').addEventListener('click', () => { if (Game.running && !Game.paused) Round.pause(); UI.screens.pause.hidden = true; UI.dialog('about', true); });
  document.querySelectorAll('.close-dialog').forEach(b => b.addEventListener('click', () => {
    Sound.click(); closeDialogs();
    if (UI.cur === 'game' && Game.running && Game.paused) UI.dialog('pause', true);
  }));
  document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(x => x.classList.toggle('active', x === tab));
    $('tab-rules').hidden = tab.dataset.tab !== 'rules'; $('tab-score').hidden = tab.dataset.tab !== 'score';
  }));
  $('btn-clear').addEventListener('click', () => { Game.sel = []; UI.refreshSel(); Sound.click(); });
  $('btn-submit').addEventListener('click', () => Round.submit());
  $('btn-pause').addEventListener('click', () => { Sound.click(); Round.pause(); });
  $('btn-resume').addEventListener('click', () => { Sound.click(); Round.resume(); });
  $('btn-restart').addEventListener('click', () => { Sound.click(); Round.stop(); closeDialogs(); Round.start(Game.lang); });
  $('btn-pause-menu').addEventListener('click', toMenu);
  $('btn-game-close').addEventListener('click', () => { if (Game.running) Round.pause(); else toMenu(); });
  $('btn-again').addEventListener('click', () => { Sound.click(); closeDialogs(); Round.start(Game.lang); });
  $('btn-res-menu').addEventListener('click', toMenu);
  $('btn-start').addEventListener('click', () => { Sound.click(); if (UI.cur === 'game' && Game.running) Round.pause(); else if (UI.cur !== 'game') UI.dialog('about', true); });
  $('hero').addEventListener('animationend', () => { /* last badge ends ~1.8s+ */ }, { once: true });

  document.addEventListener('visibilitychange', () => { if (document.hidden) Round.pause(); });
  window.addEventListener('blur', () => Round.pause());
  window.addEventListener('resize', () => { if (UI.cur === 'game') UI.drawPath(); });
  document.addEventListener('pointerdown', () => Sound.unlock(), { once: true, capture: true });

  // clock in the taskbar
  const clock = () => { const d = new Date(); $('clock').textContent = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
  clock(); setInterval(clock, 15000);

  // preload current dictionary
  $('menu-status').textContent = t('st_loading');
  DICT.load(UI_LANG).then(arr => { if (UI.cur === 'menu') $('menu-status').textContent = t('st_loaded', { n: arr.length }); })
    .catch(() => { $('menu-status').textContent = t('st_error'); });

  // PWA
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}
document.addEventListener('DOMContentLoaded', init);

// exposed for tests
window.WS = { CONFIG, DICT, Board, Game, Round, UI, Input, LETTERS };
