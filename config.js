/* Relevant or Not?: FINAN IV Unit 6 (which cash flows count). Config for lib/coursedev/desk-engine.
   Names swept for reuse 2026-11-04 (case_reuse.py): Ironbark Sporting Goods, Wendell Achebe, both clean.
   Version 3 (2026-11-12), rebuilt to the Unit 9 pattern (process/standards/interactive-assignments.md rules 25 to 39;
   u06/TEACHING-MAP.md; design/ROLLOUT-BRIEF-2026-11-12.md):
   - The reading teaches; the desk has no walkthrough of its own (rule 32).
   - Every task states the problem first, then shows a worked example drawn as the SAME table the student fills, read-only, with
     other numbers (h.ladder, rule 29). A faded step leaves one or two lines blank; the next step leaves every line blank.
   - Cut from the desk (teach-the-minimum test: no exam question, project step or later unit needs them): working capital (two
     steps and a check) and financing costs (loan interest, a step part and a check).
   - Added: hiring and training staff as a start-up cost that counts but is not depreciated (project kit Step 1 has a pre-opening
     cost row), and the NPV and open-or-pass decision as the last step, on the annuity factor from Units 4 and 5.
   The previous version is in v2-archive/. seedVersion 3 and version 3: progress and receipts from v2 do not carry over. */
(function (root) {
  'use strict';
  const QUIZ = [
    { title: 'Quick check: a new manager',
      q: 'If the plaza store opens, Ironbark will hire one more district manager at $90,000 a year, and head office will pay her salary. Does the salary belong in the store’s cash flows?',
      options: ['Yes. Ironbark’s cash changes because the store opens', 'No. Head-office costs are overhead, so they stay out', 'No. Head office pays it, not the store', 'Only in years when the store makes a profit'],
      answer: 0,
      why: ['Right. Ask the one question: does Ironbark’s cash change because the store opens? The salary is paid only if it opens, so it counts.',
        'Overhead stays out only when head office costs the same either way. This salary is new, and it exists only because the store opens.',
        'Who writes the check does not matter. Ironbark pays $90,000 a year more because the store opens, so it counts.',
        'The salary is paid every year the store is open, profit or not. It counts every year.'] },
    { title: 'Exam-style question',
      q: 'A competitor spends $240,000 on fixtures for a new store and depreciates them evenly over 6 years. Its tax rate is 21%. How much does depreciation save it in taxes each year?',
      options: ['$8,400', '$50,400', '$40,000', '$31,600'],
      answer: 0,
      why: ['Right. Depreciation each year = $240,000 ÷ 6 = $40,000, and the tax saving = $40,000 × 21% = $8,400. Questions on the exams look like this one.',
        '$50,400 is 21% of the whole $240,000. Spread the cost over 6 years first: $40,000 a year, then × 21%.',
        '$40,000 is the depreciation itself. The tax saving is depreciation × tax rate: $40,000 × 21%.',
        '$31,600 multiplies the depreciation by 79%. Multiply by the tax rate, 21%, instead.'] },
  ];

  const STEPS = [
    { id: 'open', label: 'Start-up cash', kind: 'task' },
    { id: 'yearly', label: 'Each year', kind: 'task' },
    { id: 'q1', label: 'Quick check', kind: 'check', quiz: 0 },
    { id: 'tax1', label: 'Outlet taxes', kind: 'task' },
    { id: 'tax2', label: 'Plaza taxes', kind: 'task' },
    { id: 'cf1', label: 'Outlet NPV', kind: 'task' },
    { id: 'cf2', label: 'Open or pass?', kind: 'task' },
    { id: 'q2', label: 'Exam-style question', kind: 'check', quiz: 1 },
    { id: 'note', label: 'Your note', kind: 'note' },
  ];
  const LIFE = 5;
  // The reading's worked-example answers (coffee shop). No seeded answer may equal one of them.
  const READING = [220000, 64000, 16000, 40000, 10000, 54000, 204703, -220000, -15297];

  const H = () => root.DeskEngine.h;
  // Same output as the engine's money() for whole dollars, without toLocaleString (too slow for the 4,000-email test).
  const m = (x) => { const v = Math.round(x); return (v < 0 ? '−$' : '$') + String(Math.abs(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ','); };
  const pc = (x) => Math.round(x * 100) + '%';
  const af4 = (r) => Math.round(H().annuityFactor(r, LIFE) * 10000) / 10000;
  const f4 = (x) => x.toFixed(4);

  /* Lines for each task. mode: 'ex' (a worked example: every result shown, and each sorting line names its trap),
     'faded' (most lines given) or 'own' (every line blank). The worked example uses the same function on other numbers,
     so the two tables always have the same lines. Values that count against cash are typed as positive amounts. */
  const LINES = {
    open: (o, mode) => [
      { key: 'build', label: 'Build-out and fixtures', calc: 'spent only if the store opens', value: o.B },
      { key: 'train', label: 'Hiring and training staff', calc: 'spent only if the store opens', value: o.Tr },
      { key: 'survey', label: 'Market survey', calc: mode === 'ex' ? `${m(o.S)}, already paid: a sunk cost` : `${m(o.S)}, paid last spring`, value: 0, input: true },
      { key: 'start', label: 'Start-up cash', calc: mode === 'ex' ? `${m(o.B)} + ${m(o.Tr)} + $0` : `${m(o.B)} + ${m(o.Tr)} + the survey’s amount`, value: o.B + o.Tr, input: true }],
    yearly: (o, mode) => [
      { key: 'P', label: 'Sales minus the store’s own costs', calc: 'products, staff, power', value: o.P },
      { key: 'E', label: 'Profit lost at a nearby store', calc: mode === 'ex' ? 'erosion: caused by the new store' : `${o.near} loses ${m(o.E)} a year to it`, value: o.E, input: true },
      { key: 'A', label: 'Head-office share', calc: mode === 'ex' ? `overhead: ${m(o.A)} charged, but head office costs the same either way` : `${m(o.A)} a year; head office costs the same either way`, value: 0, input: true },
      { key: 'R', label: 'Rent a tenant would pay', calc: mode === 'ex' ? 'opportunity cost: given up if the store opens' : `${o.tenant} would pay ${m(o.R)} a year`, value: o.R, input: true },
      { key: 'O', label: 'Yearly cash before tax', calc: mode === 'ex' ? `${m(o.P)} − ${m(o.E)} − $0 − ${m(o.R)}` : 'sales minus own costs − the amounts that count', value: o.P - o.E - o.R, input: true }],
    tax: (o, mode) => [
      { key: 'T', label: 'Taxes on the yearly cash', calc: mode === 'own' ? 'yearly cash before tax × tax rate' : `${m(o.O)} × ${pc(o.t)}`, value: o.O * o.t, input: mode === 'own' },
      { key: 'D', label: 'Depreciation each year', calc: mode === 'own' ? `build-out and fixtures ÷ ${LIFE} years` : `${m(o.BF)} ÷ ${LIFE} years`, value: o.BF / LIFE, input: mode === 'own' },
      { key: 'Sv', label: 'Tax saving from depreciation', calc: mode === 'own' ? 'depreciation × tax rate' : `${m(o.BF / LIFE)} × ${pc(o.t)}`, value: o.BF / LIFE * o.t, input: true }],
    cf: (o, mode) => {
      const T = o.O * o.t, D = o.BF / LIFE, Sv = D * o.t, CF = o.O - T + Sv - o.M, f = af4(o.r), PV = CF * f, npv = -o.start + PV;
      const nums = mode !== 'own';
      return [
        { key: 'O', label: 'Yearly cash before tax', calc: 'given', value: o.O },
        { key: 'T', label: 'Taxes on the yearly cash', calc: 'cash before tax × tax rate', value: T },
        { key: 'D', label: 'Depreciation each year', calc: `build-out ÷ ${LIFE} years`, value: D },
        { key: 'Sv', label: 'Tax saving from depreciation', calc: 'depreciation × tax rate', value: Sv },
        { key: 'M', label: 'Maintenance capex', calc: 'racks and repairs', value: o.M },
        { key: 'CF', label: `Cash flow, each of years 1 to ${LIFE}`, calc: nums ? `${m(o.O)} − ${m(T)} + ${m(Sv)} − ${m(o.M)}` : 'cash before tax − taxes + tax saving − maintenance capex', value: CF, input: true },
        { key: 'PV', label: `Value today of years 1 to ${LIFE}`, calc: nums ? `${m(CF)} × ${f4(f)}` : `cash flow each year × ${f4(f)}`, value: PV, input: mode === 'own' },
        { key: 'Y0', label: 'Year 0 cash flow', calc: nums ? 'start-up cash, going out' : `start-up cash, ${m(o.start)}, going out`, value: -o.start, input: mode === 'own' },
        { key: 'NPV', label: 'NPV', calc: nums ? `${m(-o.start)} + ${m(PV)}` : 'year 0 cash flow + value today', value: npv, input: true }];
    },
  };

  // Worked examples: other stores, other numbers. Built on first use, because money() is not available when config.js loads.
  let EX = null;
  const EXAMPLES = () => EX || (EX = {
    open: { cap: 'A mall kiosk: $40,000 of build-out and fixtures, $5,000 to hire and train staff, and a $3,000 market survey paid last year', lines: LINES.open({ B: 40000, Tr: 5000, S: 3000 }, 'ex') },
    yearly: { cap: 'A smaller store leaves $90,000 a year. A sister store would lose $8,000 a year, head office would charge $20,000, and a tenant pays $15,000 a year for the space.', lines: LINES.yearly({ P: 90000, E: 8000, A: 20000, R: 15000 }, 'ex') },
    tax1: { cap: 'A store adds $120,000 a year before tax at a 20% tax rate. Its build-out and fixtures cost $250,000.', lines: LINES.tax({ O: 120000, t: 0.20, BF: 250000 }, 'ex') },
    tax2: { cap: 'A store adds $150,000 a year before tax at a 25% tax rate. Its build-out and fixtures cost $400,000.', lines: LINES.tax({ O: 150000, t: 0.25, BF: 400000 }, 'ex') },
    cf1: { cap: 'A bike shop: start-up cash $300,000, of which $280,000 is build-out and fixtures. 20% tax rate, $6,000 a year of maintenance capex, 8% required return.', lines: LINES.cf({ O: 100000, t: 0.20, BF: 280000, M: 6000, r: 0.08, start: 300000 }, 'ex'),
      after: 'The NPV is above zero, so the bike shop is worth opening.' },
    cf2: { cap: 'A store: start-up cash $420,000, of which $400,000 is build-out and fixtures. 25% tax rate, $10,000 a year of maintenance capex, 9% required return.', lines: LINES.cf({ O: 150000, t: 0.25, BF: 400000, M: 10000, r: 0.09, start: 420000 }, 'ex'),
      after: 'The NPV is above zero, so this store is worth opening.' },
  });

  const PLAZA = (s) => ({ B: s.B, Tr: s.Tr, S: s.S, P: s.P, E: s.E, A: s.A, R: s.R, near: 'Ironbark’s store four miles away', tenant: 'a gym',
    O: s.O, t: s.t, BF: s.B, M: s.M, r: s.r, start: s.B + s.Tr });
  const OUTLET = (s) => ({ O: s.O2, t: s.t, BF: s.B2, Tr: s.Tr2, M: s.M2, r: s.r, start: s.B2 + s.Tr2 });
  function linesFor(t, mode) {
    const o = t.id === 'tax1' || t.id === 'cf1' ? OUTLET(t) : PLAZA(t);
    const kind = t.id === 'open' ? 'open' : t.id === 'yearly' ? 'yearly' : /^tax/.test(t.id) ? 'tax' : 'cf';
    return LINES[kind](o, mode || (t.id === 'yearly' || t.id === 'tax2' || t.id === 'cf2' ? 'own' : 'faded'));
  }

  // Common slips for one line, phrased with the student's own numbers: [[wrong value, code, message], ...].
  function diagFor(t, key) {
    const o = t.id === 'tax1' || t.id === 'cf1' ? OUTLET(t) : PLAZA(t);
    const T = o.O * o.t, D = o.BF / LIFE, Sv = D * o.t, CF = o.O - T + Sv - o.M, f = af4(o.r), PV = CF * f;
    const d = {
      survey: [[t.S, 'sunk', `The survey was paid last spring. That ${m(t.S)} is gone whether or not the store opens, so type 0.`]],
      start: [[t.B + t.Tr + t.S, 'sunk', `Leave the ${m(t.S)} survey out. It was already paid.`], [t.B, 'notrain', `Hiring and training staff happens only if the store opens, so add the ${m(t.Tr)}.`],
        [t.B + t.S, 'swap', `Count the ${m(t.Tr)} of training, which happens only if the store opens, and leave out the ${m(t.S)} survey, which is already paid.`]],
      E: [[0, 'noerosion', `The nearby store loses ${m(t.E)} a year only because the new store opens, so it counts. Type ${m(t.E)}.`]],
      A: [[t.A, 'overhead', `Head office costs the same whether or not the store opens, so its ${m(t.A)} share does not change Ironbark’s cash. Type 0.`]],
      R: [[0, 'noopp', `If the store opens, the gym cannot rent the building, so Ironbark gives up ${m(t.R)} a year. Cash given up counts like cash spent.`]],
      O: [[t.P, 'none', `Subtract the amounts that count: ${m(t.P)} − ${m(t.E)} − ${m(t.R)}.`], [t.P - t.E - t.R - t.A, 'overhead', `Leave the ${m(t.A)} head-office share out. Head office costs the same either way.`],
        [t.P - t.E, 'norent', `Subtract the gym’s ${m(t.R)} of rent too. Ironbark gives it up if the store opens.`], [t.P - t.R, 'noerosion', `Subtract the nearby store’s ${m(t.E)} of lost profit too.`],
        [t.P - t.E - t.A, 'swap', `The gym’s ${m(t.R)} counts and the ${m(t.A)} head-office share does not. ${m(t.P)} − ${m(t.E)} − ${m(t.R)}.`], [t.P + t.E + t.R, 'added', 'Both items lower Ironbark’s cash, so subtract them.']],
      T: [[o.O * (1 - o.t), 'after', `That is the cash left after tax. Type the tax itself: ${m(o.O)} × ${pc(o.t)}.`], [(o.O - D) * o.t, 'net', `That takes depreciation off first. The tax saving has its own line, so tax the whole ${m(o.O)}.`]],
      D: [[o.BF, 'nodiv', `Spread the cost evenly over ${LIFE} years: ${m(o.BF)} ÷ ${LIFE}.`], [(o.BF + o.Tr) / LIFE, 'train', `Depreciate only the build-out and fixtures. The ${m(o.Tr)} of training is spent at once.`],
        [(o.BF + o.Tr + t.S) / LIFE, 'all', `Depreciate only the build-out and fixtures, ${m(o.BF)}.`], [o.BF / (LIFE - 1), 'years', `Divide by the store’s full ${LIFE}-year life: ${m(o.BF)} ÷ ${LIFE}.`]],
      Sv: [[D, 'dep', `That is the depreciation itself. The saving is depreciation × tax rate: ${m(D)} × ${pc(o.t)}.`], [D * (1 - o.t), 'oneminus', `Multiply by the tax rate, ${pc(o.t)}, not by ${pc(1 - o.t)}.`],
        [o.BF * o.t, 'whole', `That is the tax rate times the whole ${m(o.BF)}. Use one year’s depreciation, ${m(D)}.`]],
      CF: [[o.O - T - o.M, 'noshield', `Add the ${m(Sv)} tax saving from depreciation.`], [o.O - T + Sv, 'nomaint', `Subtract the ${m(o.M)} of maintenance capex too.`],
        [CF - D, 'dep', `Depreciation is not cash leaving, so do not subtract the ${m(D)}. It enters only through the tax saving.`], [o.O - T - D - o.M, 'depnotsaving', `Use the ${m(Sv)} tax saving, added, in place of the ${m(D)} of depreciation.`],
        [o.O - T - Sv - o.M, 'shieldsign', `The tax saving lowers the tax bill, so add the ${m(Sv)}.`], [o.O - T + D - o.M, 'depadded', `Add the tax saving, ${m(Sv)}, not the depreciation itself.`], [o.O - o.M + Sv, 'notax', `Subtract the ${m(T)} of taxes too.`]],
      PV: [[CF * LIFE, 'nodisc', `That adds ${LIFE} years without discounting. Multiply the cash flow by the annuity factor, ${f4(f)}.`], [CF / f, 'div', `Multiply by the annuity factor, ${f4(f)}; don’t divide.`]],
      Y0: [[-(o.start + t.S), 'sunk', `Leave the ${m(t.S)} survey out of year 0. It was already paid.`], [-o.BF, 'notrain', `Year 0 includes the ${m(o.Tr)} of training as well: −${m(o.start)}.`]],
      NPV: [[PV + o.start, 'y0sign', `Year 0 is cash going out: ${m(-o.start)} + ${m(PV)}.`], [CF * LIFE - o.start, 'nodisc', `Discount the yearly cash flows first: ${m(CF)} × ${f4(f)}, then add year 0.`], [PV, 'noy0', `Add the year 0 cash flow, ${m(-o.start)}.`]],
    };
    return d[key] || [];
  }
  const judgeOpts = (key, v) => (key === 'PV' || key === 'NPV' ? { tol: Math.max(10, 0.0005 * Math.abs(v.scale)), scale: Math.abs(v.scale), closeMsg: 'Close. Use the annuity factor to four places and round only at the end.' }
    : { closeMsg: 'Close, but not exact. Redo the arithmetic in Desmos.' });
  // Lines where a student may type a cost as a negative number: judge the size only.
  const ABS = new Set(['survey', 'E', 'A', 'R', 'T', 'D', 'Sv', 'M']), SORT = new Set(['survey', 'E', 'A', 'R']);

  function judgeLines(t, rows, h) {
    const lines = linesFor(t), ex = linesFor(t, 'ex'), rr = [], CFline = lines.find((l) => l.key === 'PV');
    lines.forEach((l, i) => {
      if (!l.input) return;
      let v = h.parseMoney(rows[i]); if (ABS.has(l.key) && isFinite(v)) v = Math.abs(v);
      const opts = Object.assign({}, judgeOpts(l.key, { scale: CFline ? CFline.value : l.value }));
      if (l.key === 'Y0') opts.signMsg = 'The size is right, but year 0 is cash going out, so type it as a negative number.';
      if (l.key === 'NPV') opts.signMsg = 'The size is right but the sign is flipped. Add the negative year 0 cash flow to the value today.';
      if (l.value === 0) opts.tol = 1;
      rr[i] = h.judgeNumber(v, l.value, diagFor(t, l.key), opts);
      if (rr[i].code === 'other') rr[i].msg = SORT.has(l.key) ? 'Type the amount that changes Ironbark’s cash because the store opens, or 0 if nothing changes.' : `${ex[i].calc}.`;
    });
    return rr;
  }

  function separated(t, h) {
    // Every value a line is compared with stays clear of the others, so no diagnosis can mask the answer or another diagnosis.
    for (const l of linesFor(t)) {
      if (!l.input) continue;
      const CFline = linesFor(t).find((x) => x.key === 'PV');
      const tol = judgeOpts(l.key, { scale: CFline ? CFline.value : l.value }).tol || Math.max(2, 0.001 * Math.abs(l.value));
      const vals = [l.value, -l.value].concat(diagFor(t, l.key).map((d) => d[0]));
      for (let i = 0; i < vals.length; i++) for (let j = i + 1; j < vals.length; j++) {
        if (i === 0 && j === 1 && l.value === 0) continue;
        if (Math.abs(vals[i] - vals[j]) < 2.5 * tol) return false;
      }
      if (l.value !== 0 && READING.some((x) => Math.abs(x - l.value) < 1)) return false;
      if (l.value !== 0 && EXAMPLES()[t.id].lines.some((x) => Math.abs(x.value - l.value) < 1)) return false;
    }
    return true;
  }

  function buildTasks(rng, h) {
    let s = null;
    for (let tries = 0; tries < 400; tries++) {
      const r = h.pick(rng, [0.08, 0.09, 0.10]), t = h.pick(rng, [0.20, 0.25]);
      const B = h.between(rng, 600000, 900000, 50000), Tr = h.between(rng, 20000, 60000, 10000), S = h.between(rng, 15000, 40000, 5000);
      const P = h.between(rng, 300000, 450000, 25000), E = h.between(rng, 30000, 70000, 10000), A = h.between(rng, 40000, 90000, 10000), R = h.between(rng, 40000, 80000, 10000);
      const M = h.between(rng, 10000, 30000, 5000);
      const O2 = h.between(rng, 90000, 160000, 10000), B2 = h.between(rng, 300000, 450000, 50000), Tr2 = h.between(rng, 10000, 30000, 10000), M2 = h.between(rng, 5000, 15000, 5000);
      if (E === R || E === A || R === A) continue;
      const O = P - E - R, cand = { r, t, B, Tr, S, P, E, A, R, M, O, O2, B2, Tr2, M2 };
      const T = O * t, Sv = B / LIFE * t, CF = O - T + Sv - M;
      cand.npv = -(B + Tr) + CF * af4(r);
      const CF2 = O2 - O2 * t + B2 / LIFE * t - M2;
      if (Math.abs(cand.npv) < 25000 || Math.abs(-(B2 + Tr2) + CF2 * af4(r)) < 10000) continue;
      const ids = ['open', 'yearly', 'tax1', 'tax2', 'cf1', 'cf2'];
      if (!ids.every((id) => separated(Object.assign({ id }, cand), h))) continue;
      s = cand; break;
    }
    return ['open', 'yearly', 'tax1', 'tax2', 'cf1', 'cf2'].map((id) => {
      const x = Object.assign({ id }, s);
      if (id === 'cf2') x.decision = s.npv > 0 ? 'open' : 'pass';
      return x;
    });
  }

  const PROBLEM = {
    open: (t) => ({ title: 'What does it cost to open?', place: 'Ironbark owns an empty building in a shopping plaza and wants to open its next store there.',
      body: '<p>Wendell needs the store’s start-up cash for year 0. In the Result column, type the amount that counts, or 0 for an item that stays out. Two lines are done for you.</p>' }),
    yearly: (t) => ({ title: 'What does the store add each year?', place: 'Every new store changes the stores and buildings around it.',
      body: '<p>Wendell has three more items. Type the amount each one takes from the store’s yearly cash, or 0 if it stays out. Then find the yearly cash before tax.</p>' }),
    tax1: (t) => ({ title: 'Taxes on the outlet store', place: 'Ironbark is also weighing a smaller outlet store by the highway.',
      body: `<p>The outlet would add <b>${m(t.O2)}</b> a year before tax. Ironbark pays <b>${pc(t.t)}</b> tax, and the outlet’s build-out and fixtures, <b>${m(t.B2)}</b>, are depreciated over ${LIFE} years. What is the tax saving? Two lines are done for you.</p>` }),
    tax2: (t) => ({ title: 'Taxes on the plaza store', place: 'Back to the plaza store.',
      body: `<p>The plaza store adds <b>${m(t.O)}</b> a year before tax. Its build-out and fixtures, <b>${m(t.B)}</b>, are depreciated over ${LIFE} years, and the tax rate is <b>${pc(t.t)}</b>. Fill in all three lines.</p>` }),
    cf1: (t) => ({ title: 'The outlet’s NPV', place: 'Wendell wants one number for the outlet: its NPV.',
      body: `<p>The outlet’s start-up cash is <b>${m(t.B2 + t.Tr2)}</b> and its maintenance capex <b>${m(t.M2)}</b> a year. At Ironbark’s required <b>${pc(t.r)}</b>, the annuity factor for ${LIFE} years is <b>${f4(af4(t.r))}</b>. Find the cash flow each year and the NPV.</p>` }),
    cf2: (t) => ({ title: 'Open or pass?', place: 'Now the plaza store, with your numbers from steps 1, 2 and 5.',
      body: `<p>The store would spend <b>${m(t.M)}</b> a year on maintenance capex. At Ironbark’s required <b>${pc(t.r)}</b>, the annuity factor for ${LIFE} years is <b>${f4(af4(t.r))}</b>. Find the NPV, then decide.</p>`,
      choice: { legend: 'Should Ironbark open the plaza store?', options: [['open', 'Open it: the NPV is above zero'], ['pass', 'Pass: the NPV is below zero']] } }),
  };

  function taskView(t, L, h) {
    const P = PROBLEM[t.id](t), E = EXAMPLES()[t.id];
    const example = h.ladder(E.lines, { filled: true, caption: E.cap }) + (E.after ? `<p>${E.after}</p>` : '');
    const table = h.ladder(linesFor(t), { rows: L.rows, caption: 'Your turn' });
    const parts = [{ html: '', field: 'table' }];
    if (P.choice) parts.push({ html: '', field: 'choice' });
    return { title: P.title, place: P.place, body: P.body, example, table, parts, choice: P.choice,
      helpLabels: ['Show me the first blank', 'Show me every line'] };
  }

  function judgeTask(t, e, h) {
    const lines = linesFor(t), rr = judgeLines(t, e.rows || [], h);
    const bad = rr.findIndex((x) => x && !x.ok);
    if (bad >= 0) return { ok: false, rowRes: rr, msg: `${lines[bad].label}: ${rr[bad].msg}` };
    if (t.decision && e.choice !== t.decision) {
      if (!e.choice) return { ok: false, rowRes: rr, msg: 'Now answer the question under the table.' };
      return { ok: false, rowRes: rr, msg: `The NPV is ${m(t.npv)}. Open the store when the NPV is above zero, and pass when it is below.` };
    }
    return { ok: true, rowRes: rr };
  }

  function helpText(t, lvl) {
    const lines = linesFor(t, 'ex').map((l, i) => Object.assign({}, l, { input: linesFor(t)[i].input }));
    const say = (l) => `${l.label}: ${l.calc} = ${m(l.value)}`;
    const blanks = lines.filter((l) => l.input);
    return lvl === 1 ? say(blanks[0]) : blanks.map(say).join('<br>');
  }
  function praise(t) {
    const p = PLAZA(t), o = OUTLET(t);
    if (t.id === 'open') return `Year 0 starts at ${m(t.B + t.Tr)}. The ${m(t.S)} survey is a <b>sunk cost</b>: already spent, so it cannot change the decision.`;
    if (t.id === 'yearly') return `The nearby store’s lost profit is <b>erosion</b> and the gym’s rent is an <b>opportunity cost</b>: both count. The head-office share is <b>allocated overhead</b> and stays out. The store adds ${m(t.O)} a year before tax.`;
    if (t.id === 'tax1') return `Depreciation cuts the outlet’s tax bill by ${m(o.BF / LIFE * o.t)} a year, though no cash leaves when it is recorded.`;
    if (t.id === 'tax2') return `Over ${LIFE} years the tax saving adds up to ${m(p.BF * p.t)}, so the government effectively pays ${pc(p.t)} of the ${m(p.BF)} build-out and fixtures.`;
    if (t.id === 'cf1') { const n = linesFor(t).find((l) => l.key === 'NPV').value; return `The outlet’s NPV is ${m(n)}, so on these numbers it ${n > 0 ? 'is worth opening' : 'is not worth opening'}.`; }
    if (t.id === 'cf2') return `The plaza store’s NPV is ${m(t.npv)}, so ${t.decision === 'open' ? 'it adds value: open it' : 'it would lose value: pass'}.`;
  }
  function selfAnswer(t) {
    const rows = []; linesFor(t).forEach((l, i) => { if (l.input) rows[i] = String(Math.round(l.value)); });
    return { rows, choice: t.decision || null };
  }
  function selfWrong(t) {
    const rows = []; linesFor(t).forEach((l, i) => { if (l.input) rows[i] = String(Math.round(l.value * 1.3)); });
    return { rows, choice: t.decision || null };
  }

  root.DESK = {
    app: 'finan4-u6-cash-flow-desk', version: 3, seedVersion: 3, salt: 'rize-finan4-u6-cashflow:7b19e4', points: 20,
    storageKey: 'rize-finan4-u6-cashflow-v3', filePrefix: 'RelevantOrNot',
    verifyUrl: 'https://rizecomputerscience.github.io/finan4-cash-flow-desk/verify.html',
    calcPlaceholder: '600000*0.25/5',
    story: { title: 'Relevant or Not?', kicker: 'Corporate Finance, Unit 6', company: 'Ironbark Sporting Goods', team: 'Finance',
      from: 'Wendell Achebe', fromTitle: 'finance director, Ironbark Sporting Goods',
      dek: 'Ironbark Sporting Goods owns an empty building in a shopping plaza and must decide whether to open its next store there. Wendell Achebe, the finance director, has a list of costs from around the company, and not all of them belong. You sort them, work out the taxes and build the store’s yearly cash flow, so Wendell can tell the real-estate committee whether to open or pass.',
      whatBox: '',
      stepsLine: 'Nine short steps. Each shows a worked example in the same table you fill in, then you do the same calculation with your own numbers.' },
    steps: STEPS, quiz: QUIZ, walk: null, buildTasks, taskView, judgeTask, helpText, praise, selfAnswer, selfWrong,
    note: { title: 'A note for the real-estate committee', label: 'Your note to Wendell', minWords: 30, receiptHeading: 'Note to the finance director',
      prompt: 'The real-estate committee meets tomorrow. Should Ironbark open the plaza store? In one paragraph, give your answer and the NPV, then pick one item someone wanted counted that you left out and say why.' },
  };
})(typeof window !== 'undefined' ? window : globalThis);
