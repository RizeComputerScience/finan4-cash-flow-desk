/* Relevant or Not?: FINAN IV Unit 6 (which cash flows count). Config for lib/coursedev/desk-engine.
   Names swept for reuse 2026-11-04 (case_reuse.py): Ironbark Sporting Goods, Wendell Achebe, both clean. */
(function (root) {
  'use strict';
  const QUIZ = [
    { title: 'Quick win: the one question',
      q: 'Wendell asks the same question about every item someone wants to put in a new store’s cash flows. Which question is it?',
      options: ['If Ironbark opens this store, does the company’s cash change because of this item?', 'Does this item appear on the income statement?', 'Is this item bigger than $10,000?', 'Did someone at head office approve this item?'],
      answer: 0,
      why: ['Right. An item belongs in the store’s cash flows only if opening the store changes the company’s cash because of it. Everything else stays out, however official it looks.',
        'Plenty of income statement lines, like depreciation, are not cash, and some cash, like a lost rent check, never shows up on the store’s income statement. Ask whether the company’s cash changes because the store opens.',
        'Size does not decide it. A small item that the store causes counts, and a large one that would happen anyway does not.',
        'An approval does not make an item relevant. Ask whether the company’s cash changes because the store opens.'] },
    { title: 'Quick win: leave the loan out',
      q: 'A bank will lend Ironbark part of the money for the new store. Why does the loan’s interest stay out of the store’s cash flows?',
      options: ['The discount rate already charges the store for using money, so subtracting interest as well would count that cost twice', 'Interest is not a real cost', 'The bank pays the interest, not Ironbark', 'Interest is paid only in the first year'],
      answer: 0,
      why: ['Right. Discounting at the required rate already charges the store for the money tied up in it. How Ironbark pays for the store is a separate decision, so interest stays out.',
        'Interest is a real cost to Ironbark. It stays out of the store’s cash flows because the discount rate already charges the store for using money.',
        'Ironbark pays the bank. The interest stays out because the discount rate already charges the store for using money.',
        'Interest is paid every year the loan is outstanding. It stays out because the discount rate already charges the store for using money.'] },
    { title: 'Quick win: working capital comes back',
      q: 'The new store ties up cash in products on its shelves. Why does that cash show up again as a cash inflow in the store’s last year?',
      options: ['When the store closes, it sells its remaining products and pays off its suppliers, which frees the cash that was tied up', 'The government refunds it', 'It has been depreciated to zero by then', 'It does not come back; working capital is a yearly cost like rent'],
      answer: 0,
      why: ['Right. The products on the shelves are cash in another form. At the end the store sells them and settles its supplier bills, so the cash returns.',
        'No refund is involved. The cash comes back because the store sells its last products and pays off its suppliers.',
        'Inventory is not depreciated. The store sells its last products when it closes, and that returns the cash.',
        'Working capital is paid once, at the start, and returned at the end. Rent is paid every year and never comes back.'] },
    { title: 'Exam-style question',
      q: 'A competitor spends $200,000 on fixtures for a new store and depreciates them evenly over 5 years. Its tax rate is 25%. How much does depreciation save it in taxes each year?',
      options: ['$10,000', '$50,000', '$40,000', '$30,000'],
      answer: 0,
      why: ['Right. Depreciation each year = $200,000 ÷ 5 = $40,000, and the tax saving = $40,000 × 25% = $10,000 a year. Questions on the exams look like this one.',
        '$50,000 is 25% of the full $200,000. The cost is spread over 5 years, so each year’s depreciation is $40,000, and the saving is 25% of that.',
        '$40,000 is the depreciation itself. The tax saving is the tax rate times the depreciation: $40,000 × 25%.',
        '$30,000 multiplies the depreciation by 75%. Multiply by the tax rate, 25%, instead.'] },
  ];

  const STEPS = [
    { id: 'walk', label: 'Worked example', kind: 'walk' },
    { id: 'q1', label: 'Check 1', kind: 'check', quiz: 0 },
    { id: 't1', label: 'Start-up cash', kind: 'task' },
    { id: 't2', label: 'The nearby store', kind: 'task' },
    { id: 't3', label: 'The building', kind: 'task' },
    { id: 'q2', label: 'Check 2', kind: 'check', quiz: 1 },
    { id: 't4', label: 'Taxes', kind: 'task' },
    { id: 't5', label: 'Working capital', kind: 'task' },
    { id: 'q3', label: 'Check 3', kind: 'check', quiz: 2 },
    { id: 't6', label: 'The cash flows', kind: 'task' },
    { id: 'q4', label: 'Exam-style question', kind: 'check', quiz: 3 },
    { id: 'note', label: 'Your note', kind: 'note' },
  ];
  const LIFE = 5;

  function buildTasks(rng, h) {
    let s = null;
    for (let tries = 0; tries < 60; tries++) {
      const r = h.pick(rng, [0.08, 0.09, 0.10]), tax = h.pick(rng, [0.20, 0.25]);
      const B = h.between(rng, 600000, 900000, 10000), F = h.between(rng, 150000, 250000, 10000), S = h.between(rng, 20000, 45000, 1000);
      const P = h.between(rng, 370000, 600000, 10000), E = h.between(rng, 30000, 70000, 5000), A = h.between(rng, 40000, 90000, 5000);
      const R = h.between(rng, 36000, 84000, 6000), Lo = h.between(rng, 400000, 800000, 50000), I = Lo * 0.07;
      const Inv = h.between(rng, 380000, 600000, 10000), Pay = h.round(Inv * h.pick(rng, [0.3, 0.35, 0.4]), 5000), M = h.between(rng, 15000, 30000, 1000);
      if (A === E || Math.abs(R - I) < 3000 || Math.abs(A - R) < 3000) continue;
      const O = P - E - R, dep = (B + F) / LIFE, tax1 = O * tax, shield = dep * tax, after = O - tax1 + shield, yearly = after - M;
      const NWC = Inv - Pay, y0 = -(B + F) - NWC, y5 = yearly + NWC;
      const npv = y0 + yearly * h.annuityFactor(r, LIFE - 1) + y5 * h.df(r, LIFE);
      s = { r, tax, B, F, S, P, E, A, R, Lo, I, Inv, Pay, M, O, dep, tax1, shield, after, yearly, NWC, y0, y5, npv };
      if (Math.abs(npv) > 40000) break;
    }
    const T = [];
    T.push(Object.assign({ id: 't1', answer: s.B + s.F }, s));
    T.push(Object.assign({ id: 't2', answer: s.P - s.E }, s));
    T.push(Object.assign({ id: 't3', answer: s.O }, s));
    T.push(Object.assign({ id: 't4' }, s));
    T.push(Object.assign({ id: 't5' }, s));
    T.push(Object.assign({ id: 't6', decision: s.npv > 0 ? 'build' : 'pass' }, s));
    return T;
  }

  const m = (x, dp) => root.DeskEngine.h.money(x, dp);
  const sgn = (x) => (x >= 0 ? '+' : '−') + m(Math.abs(x));
  const pc = (x) => Math.round(x * 100) + '%';
  const esc = (s) => String(s == null ? '' : s).replace(/"/g, '');
  const cell = (L, y, label, narrow) => { const rows = L.rows || []; return `<label class="sr-only" for="r${y}">${label}</label><input id="r${y}" class="rowin" data-row="${y}"${narrow ? ' style="width:min(7.2rem,21vw)"' : ''} inputmode="decimal" autocomplete="off" value="${rows[y] ? esc(rows[y]) : ''}"><span class="mark" id="mk${y}"></span>`; };
  const list = (items) => `<div class="tw"><table class="cf"><caption>What Wendell was handed</caption><thead><tr><th scope="col" style="text-align:left">Item</th><th scope="col">Amount</th></tr></thead><tbody>${items.map((x) => `<tr><td class="lbl">${x[0]}</td><td>${x[1]}</td></tr>`).join('')}</tbody></table></div>`;

  function taskView(t, L, h) {
    if (t.id === 't1') return { title: 'What does it cost to open?', place: 'Ironbark owns an empty building in a shopping plaza and wants to turn it into its next store.',
      body: `<p>Wendell has a list of what the store has cost or will cost before the doors open. Ask the one question about each item.</p>${list([
        ['Building out the store: walls, floors, lighting, fitting rooms', m(t.B)], ['Fixtures and checkout counters', m(t.F)], ['Survey of the local market, paid last spring', m(t.S)]])}
        <p>How much start-up cash belongs in the store’s year 0? Leave out the working capital for now; it comes in a later step.</p>`,
      value: { label: 'Start-up cash, year 0', help: 'Type the amount spent. Round to the nearest dollar. Answers within about 0.1% count as correct.' } };
    if (t.id === 't2') return { title: 'The store four miles away', place: 'Every new store changes the stores around it.',
      body: `<p>Once it is open, the store’s sales minus its own costs (products, staff, utilities) should leave <b>${m(t.P)}</b> a year before tax. Two more items are on Wendell’s list.</p>${list([
        ['Profit an existing Ironbark store four miles away expects to lose each year, as some of its customers switch to the new store', m(t.E)],
        ['Head-office costs (salaries, the website, the headquarters) that the accountants will charge the new store each year as its share. Head office costs the same whether or not the store opens.', m(t.A)]])}
        <p>How much yearly cash before tax should the store’s cash flows show so far?</p>`,
      value: { label: 'Yearly cash before tax, so far' } };
    if (t.id === 't3') return { title: 'The building and the loan', place: 'The building is empty today, but it does not have to stay that way.',
      body: `<p>From the last step, the store adds <b>${m(t.P - t.E)}</b> a year before tax. Two more items are on the list.</p>${list([
        ['Rent a gym has offered to pay each year for the empty building. If Ironbark opens its store there, the gym cannot rent it.', m(t.R)],
        [`Interest on a bank loan of ${m(t.Lo)} at 7% that would pay for part of the build-out`, m(t.I)]])}
        <p>What yearly cash before tax belongs in the store’s cash flows now?</p>`,
      value: { label: 'Yearly cash before tax' } };
    if (t.id === 't4') return { title: 'The tax saving from depreciation', place: 'The store’s cash is taxed, but its equipment lowers the tax bill.',
      body: `<p>Ironbark pays <b>${pc(t.tax)}</b> of its profit in taxes. The build-out and fixtures cost <b>${m(t.B + t.F)}</b>, and Ironbark depreciates them evenly over the store’s <b>${LIFE}-year</b> life. Depreciation is not cash leaving, but it lowers taxable profit, so it lowers the tax bill. Fill in the three rows.</p>`,
      table: `<div class="tw"><table class="cf"><caption>One year’s taxes</caption><thead><tr><th scope="col" style="text-align:left">Row</th><th scope="col" style="text-align:left">How to work it out</th><th scope="col">Amount</th></tr></thead><tbody>
        <tr><td class="lbl">Taxes on the yearly cash</td><td class="lbl">yearly cash before tax × tax rate = ${m(t.O)} × ${pc(t.tax)}</td><td>${cell(L, 1, 'Taxes on the yearly cash')}</td></tr>
        <tr><td class="lbl">Depreciation each year</td><td class="lbl">build-out and fixtures ÷ years = ${m(t.B + t.F)} ÷ ${LIFE}</td><td>${cell(L, 2, 'Depreciation each year')}</td></tr>
        <tr><td class="lbl">Tax saving from depreciation</td><td class="lbl">depreciation × tax rate</td><td>${cell(L, 3, 'Tax saving from depreciation')}</td></tr></tbody>
        <tfoot><tr class="total hl"><td class="lbl" colspan="2"><b>Cash after taxes</b>: ${m(t.O)} − taxes + tax saving</td><td id="rowTotal"><b>$0</b></td></tr></tfoot></table></div>`,
      onRows: (rs, $) => { const a = h.parseMoney(rs[1]), c = h.parseMoney(rs[3]); $('#rowTotal').innerHTML = '<b>' + m(t.O - (isFinite(a) ? a : 0) + (isFinite(c) ? c : 0)) + '</b>'; },
      helpLabels: ['Show me the first row', 'Show me every row'] };
    if (t.id === 't5') return { title: 'Stocking the shelves', place: 'A sporting-goods store needs bikes, balls and shoes on the shelves the day it opens.',
      body: `<p>The new store will stock <b>${m(t.Inv)}</b> of products. Suppliers let Ironbark pay for <b>${m(t.Pay)}</b> of that after it arrives, so suppliers fund that part. The cash Ironbark itself ties up is the <b>working capital</b>. It goes out when the store opens and comes back when the store closes in year ${LIFE}.</p>`,
      table: `<div class="tw"><table class="cf"><caption>Working capital going in and coming back</caption><thead><tr><th scope="col" style="text-align:left">Row</th><th scope="col" style="text-align:left">How to work it out</th><th scope="col">Amount</th></tr></thead><tbody>
        <tr><td class="lbl">Year 0: working capital going in</td><td class="lbl">−(products on the shelves − what suppliers fund) = −(${m(t.Inv)} − ${m(t.Pay)})</td><td>${cell(L, 1, 'Year 0 working capital')}</td></tr>
        <tr><td class="lbl">Year ${LIFE}: working capital coming back</td><td class="lbl">the same amount, now coming in</td><td>${cell(L, 2, 'Final-year working capital')}</td></tr></tbody></table></div>
        <p class="small">Type cash going out as a negative number, like −250,000.</p>`,
      helpLabels: ['Show me year 0', 'Show me both rows'] };
    if (t.id === 't6') {
      const r = t.r;
      const row = (lab, a, b, c) => `<tr><td class="lbl">${lab}</td><td>${a}</td><td>${b}</td><td>${c}</td></tr>`;
      return { title: 'Put the rows together', place: 'Wendell needs one line he can discount: the store’s cash flow in each year.',
        body: `<p>One last row: every year the store spends <b>${m(t.M)}</b> on <b>maintenance capital spending</b> (maintenance capex), such as replacing worn display racks and repairing the lighting, just to keep running as it is. Everything else comes from your last five steps. Add each column down to get the cash flow, then decide.</p>`,
        table: `<div class="tw"><table class="cf"><caption>The store’s cash flows</caption><thead><tr><th scope="col" style="text-align:left;min-width:min(10rem,26vw)">Row</th><th scope="col">Year 0</th><th scope="col">Years 1 to ${LIFE - 1} (each)</th><th scope="col">Year ${LIFE}</th></tr></thead><tbody>
          ${row('Start-up cash: build-out and fixtures', m(-(t.B + t.F)), '', '')}
          ${row('Working capital', m(-t.NWC), '', sgn(t.NWC))}
          ${row('Yearly cash before tax', '', m(t.O), m(t.O))}
          ${row('Taxes on the yearly cash', '', m(-t.tax1), m(-t.tax1))}
          ${row('Tax saving from depreciation', '', sgn(t.shield), sgn(t.shield))}
          ${row('Maintenance capex', '', m(-t.M), m(-t.M))}
          </tbody><tfoot><tr class="total hl"><td class="lbl"><b>Cash flow</b></td><td>${cell(L, 1, 'Year 0 cash flow', 1)}</td><td>${cell(L, 2, 'Cash flow in each of years 1 to ' + (LIFE - 1), 1)}</td><td>${cell(L, 3, 'Year ' + LIFE + ' cash flow', 1)}</td></tr>
          <tr><td class="lbl" colspan="3"><b>NPV at ${pc(r)}</b>, from your cash flow row</td><td id="rowTotal"><b>$0</b></td></tr></tfoot></table></div>`,
        onRows: (rs, $) => { const v = [1, 2, 3].map((y) => h.parseMoney(rs[y])); if (v.some((x) => !isFinite(x))) { $('#rowTotal').innerHTML = '<b>Fill in all three</b>'; return; }
          $('#rowTotal').innerHTML = '<b>' + m(v[0] + v[1] * h.annuityFactor(r, LIFE - 1) + v[2] * h.df(r, LIFE)) + '</b>'; },
        choice: { legend: 'Should Ironbark open the store?', options: [['build', 'Open it'], ['pass', 'Pass']] },
        helpLabels: ['Show me year 0', 'Show me every column'] };
    }
  }

  function judgeTask(t, e, h) {
    const v = h.parseMoney(e.value);
    if (t.id === 't1') return h.judgeNumber(Math.abs(v), t.answer, [
      [t.B + t.F + t.S, 'sunk', 'The market survey was paid last spring. That money is gone whether or not the store opens, so leave it out.'],
      [t.B, 'nofix', 'The fixtures and checkout counters are spent only if the store opens, so count them too.'],
      [t.F, 'nobuild', 'The build-out is spent only if the store opens, so count it too.']],
      { otherMsg: `Count each item that is spent only if the store opens. Leave out anything already paid.` });
    if (t.id === 't2') return h.judgeNumber(v, t.answer, [
      [t.P, 'erosion', `The nearby store’s lost profit happens only because the new store opens, so subtract it: ${m(t.P)} − ${m(t.E)}.`],
      [t.P - t.E - t.A, 'overhead', 'Head office costs the same whether or not this store opens. Charging the store a share moves the cost around but does not change Ironbark’s cash, so leave it out.'],
      [t.P - t.A, 'both', 'Two items are swapped. The nearby store’s lost profit counts, because the new store causes it. The head-office share does not, because head office costs the same either way.'],
      [t.P + t.E, 'added', 'The nearby store loses that profit, so it lowers Ironbark’s cash. Subtract it.']],
      { otherMsg: `Start from ${m(t.P)} and subtract only the items that change because the store opens.` });
    if (t.id === 't3') { const X = t.P - t.E; return h.judgeNumber(v, t.answer, [
      [X, 'opp', `If the store opens, Ironbark gives up the gym’s rent. Money given up counts like money spent: ${m(X)} − ${m(t.R)}.`],
      [X - t.R - t.I, 'interest', 'Leave the interest out. The discount rate already charges the store for the money it uses, so subtracting interest as well counts that cost twice.'],
      [X - t.I, 'both', 'Two items are swapped. The gym’s rent counts, because Ironbark gives it up. The interest does not, because the discount rate already charges for the money.'],
      [X + t.R, 'added', 'Ironbark loses the gym’s rent if the store opens, so subtract it.']],
      { otherMsg: `Start from ${m(X)} and subtract only the items that change because the store opens.` }); }
    if (t.id === 't4') {
      const rows = e.rows || []; const rr = [];
      rr[1] = h.judgeNumber(h.parseMoney(rows[1]), t.tax1, [[t.O * (1 - t.tax), 'after', `That is the cash left after tax. Type the tax itself: ${m(t.O)} × ${pc(t.tax)}.`], [(t.O - t.dep) * t.tax, 'net', 'In this table the depreciation saving gets its own row. Figure the tax on the full yearly cash here.']],
        { otherMsg: `${m(t.O)} × ${pc(t.tax)}.` });
      rr[2] = h.judgeNumber(h.parseMoney(rows[2]), t.dep, [[t.B + t.F, 'nodiv', `Spread the cost evenly over ${LIFE} years: divide by ${LIFE}.`], [(t.B + t.F + t.S) / LIFE, 'sunk', 'Leave the market survey out. It was already paid and it is not equipment.'], [(t.B + t.F) / (LIFE - 1), 'years', `Divide by the store’s full ${LIFE}-year life.`]],
        { otherMsg: `${m(t.B + t.F)} ÷ ${LIFE}.` });
      rr[3] = h.judgeNumber(h.parseMoney(rows[3]), t.shield, [[t.dep, 'dep', 'That is the depreciation itself. The saving is the tax rate times the depreciation.'], [t.dep * (1 - t.tax), 'oneminus', `Multiply by the tax rate, ${pc(t.tax)}, not by ${pc(1 - t.tax)}.`], [(t.B + t.F) * t.tax, 'whole', 'That is the tax rate times the whole cost. Use one year’s depreciation.']],
        { otherMsg: `depreciation × ${pc(t.tax)}.` });
      const names = ['', 'Taxes on the yearly cash', 'Depreciation each year', 'Tax saving'];
      const bad = [1, 2, 3].find((y) => !rr[y].ok);
      if (bad) return { ok: false, rowRes: rr, msg: `${names[bad]}: ${rr[bad].msg}` };
      return { ok: true, rowRes: rr };
    }
    if (t.id === 't5') {
      const rows = e.rows || []; const rr = [];
      rr[1] = h.judgeNumber(h.parseMoney(rows[1]), -t.NWC, [[-t.Inv, 'nopay', `Suppliers fund ${m(t.Pay)} of the products, so Ironbark ties up only the rest: ${m(t.Inv)} − ${m(t.Pay)}.`], [-(t.Inv + t.Pay), 'addpay', 'Subtract what suppliers fund. It lowers the cash Ironbark ties up.']],
        { signMsg: 'The size is right, but cash goes out in year 0, so type it as a negative number.', otherMsg: `−(${m(t.Inv)} − ${m(t.Pay)}).` });
      rr[2] = h.judgeNumber(h.parseMoney(rows[2]), t.NWC, [[t.Inv, 'nopay', 'The same amount that went in comes back: products on the shelves minus what suppliers fund.'], [0, 'zero', 'The cash comes back when the store closes and sells its last products. Type the amount that went in, as a positive number.']],
        { minTol: 2, signMsg: 'The size is right, but this cash comes back in, so type it as a positive number.', otherMsg: `The same amount as year 0, now positive: ${m(t.Inv)} − ${m(t.Pay)}.` });
      const bad = [1, 2].find((y) => !rr[y].ok);
      if (bad) return { ok: false, rowRes: rr, msg: `${bad === 1 ? 'Year 0' : 'Year ' + LIFE}: ${rr[bad].msg}` };
      return { ok: true, rowRes: rr };
    }
    if (t.id === 't6') {
      const rows = e.rows || []; const rr = [];
      rr[1] = h.judgeNumber(h.parseMoney(rows[1]), t.y0, [[-(t.B + t.F), 'nowc', 'Add the working capital going in to the start-up cash.'], [-(t.B + t.F) - t.Inv, 'inv', 'Use the working capital from your table, after what suppliers fund.']],
        { signMsg: 'The size is right, but year 0 is cash going out, so type it as a negative number.', otherMsg: `${m(-(t.B + t.F))} − ${m(t.NWC)}.` });
      rr[2] = h.judgeNumber(h.parseMoney(rows[2]), t.yearly, [[t.after, 'nomaint', `Subtract the maintenance capex too: ${m(t.after)} − ${m(t.M)}.`], [t.O - t.tax1 - t.M, 'noshield', 'Add the tax saving from depreciation.'], [t.O - t.tax1, 'neither', 'Add the tax saving and subtract the maintenance capex.'], [t.yearly - t.dep, 'dep', 'Depreciation is not cash leaving. It enters only through the tax saving.']],
        { otherMsg: `${m(t.O)} − ${m(t.tax1)} + ${m(t.shield)} − ${m(t.M)}.` });
      rr[3] = h.judgeNumber(h.parseMoney(rows[3]), t.y5, [[t.yearly, 'nowcback', 'In the last year the working capital comes back. Add it.'], [t.yearly - t.NWC, 'wcsign', 'The working capital comes back in, so add it rather than subtract it.']],
        { otherMsg: `The yearly cash flow plus the working capital coming back: ${m(t.yearly)} + ${m(t.NWC)}.` });
      const names = ['', 'Year 0', `Years 1 to ${LIFE - 1}`, `Year ${LIFE}`];
      const bad = [1, 2, 3].find((y) => !rr[y].ok);
      if (bad) return { ok: false, rowRes: rr, msg: `${names[bad]}: ${rr[bad].msg}` };
      if (e.choice !== t.decision) return { ok: false, rowRes: rr, msg: !e.choice ? 'Decide whether Ironbark should open the store as well.' : 'Look at the NPV under the table. Open the store when it is above zero, and pass when it is below.' };
      return { ok: true, rowRes: rr };
    }
  }

  function helpText(t, lvl) {
    if (t.id === 't1') return lvl === 1 ? `Ask of each item: is it spent only if the store opens? The build-out and the fixtures are. The survey was paid last spring.` : `${m(t.B)} + ${m(t.F)} = ${m(t.B + t.F)}. The ${m(t.S)} survey stays out because it is already spent.`;
    if (t.id === 't2') return lvl === 1 ? `The nearby store loses ${m(t.E)} only because the new store opens. Head office costs the same either way.` : `${m(t.P)} − ${m(t.E)} = ${m(t.P - t.E)}. The ${m(t.A)} head-office share stays out.`;
    if (t.id === 't3') return lvl === 1 ? `Opening the store means saying no to the gym’s ${m(t.R)} a year. The interest is how the store is paid for, not what it earns.` : `${m(t.P - t.E)} − ${m(t.R)} = ${m(t.O)}. The ${m(t.I)} of interest stays out.`;
    if (t.id === 't4') return lvl === 1 ? `Taxes on the yearly cash: ${m(t.O)} × ${pc(t.tax)} = ${m(t.tax1)}.` : `Taxes: ${m(t.tax1)}. Depreciation: ${m(t.B + t.F)} ÷ ${LIFE} = ${m(t.dep)}. Tax saving: ${m(t.dep)} × ${pc(t.tax)} = ${m(t.shield)}.`;
    if (t.id === 't5') return lvl === 1 ? `Year 0: −(${m(t.Inv)} − ${m(t.Pay)}) = ${m(-t.NWC)}.` : `Year 0: ${m(-t.NWC)}. Year ${LIFE}: ${sgn(t.NWC)}, the same cash coming back.`;
    if (t.id === 't6') { if (lvl === 1) return `Year 0: ${m(-(t.B + t.F))} − ${m(t.NWC)} = ${m(t.y0)}.`;
      return `Year 0: ${m(t.y0)}.<br>Years 1 to ${LIFE - 1}: ${m(t.O)} − ${m(t.tax1)} + ${m(t.shield)} − ${m(t.M)} = ${m(t.yearly)}.<br>Year ${LIFE}: ${m(t.yearly)} + ${m(t.NWC)} = ${m(t.y5)}.<br>The NPV at ${pc(t.r)} is ${m(t.npv)}, so ${t.decision === 'build' ? 'open the store' : 'pass'}.`; }
  }
  function praise(t) {
    if (t.id === 't1') return `Year 0 starts at ${m(t.B + t.F)}. The ${m(t.S)} survey is a <b>sunk cost</b>: already spent, so it cannot change the decision.`;
    if (t.id === 't2') return `The nearby store’s lost profit is <b>erosion</b>, and it counts. The head-office share is <b>allocated overhead</b>, and it stays out.`;
    if (t.id === 't3') return `The gym’s rent is an <b>opportunity cost</b>: money Ironbark gives up, so it counts. The interest is a <b>financing cost</b>, and it stays out. The store adds ${m(t.O)} a year before tax.`;
    if (t.id === 't4') return `Depreciation cuts the tax bill by ${m(t.shield)} a year, so the government effectively pays ${m(t.shield * LIFE)} of the ${m(t.B + t.F)} build-out over ${LIFE} years.`;
    if (t.id === 't5') return `${m(t.NWC)} leaves in year 0 and returns in year ${LIFE}. It costs Ironbark only the waiting.`;
    if (t.id === 't6') return `The store’s NPV is ${m(t.npv)}, so ${t.decision === 'build' ? 'it adds value: open it' : 'it would lose value: pass'}.`;
  }
  function selfAnswer(t) {
    if (t.id === 't4') return { rows: [null, String(Math.round(t.tax1)), String(Math.round(t.dep)), String(Math.round(t.shield))] };
    if (t.id === 't5') return { rows: [null, String(-t.NWC), String(t.NWC)] };
    if (t.id === 't6') return { rows: [null, String(Math.round(t.y0)), String(Math.round(t.yearly)), String(Math.round(t.y5))], choice: t.decision };
    return { value: String(Math.round(t.answer)) };
  }
  function selfWrong(t) {
    if (t.id === 't1') return { value: String(t.B + t.F + t.S) };
    if (t.id === 't2') return { value: String(t.P - t.E - t.A) };
    if (t.id === 't3') return { value: String(t.O - t.I) };
    if (t.id === 't4') return { rows: [null, String(Math.round((t.O - t.dep) * t.tax)), String(Math.round(t.dep)), String(Math.round(t.dep * (1 - t.tax)))] };
    if (t.id === 't5') return { rows: [null, String(-t.Inv), String(t.Inv)] };
    return { rows: [null, String(Math.round(t.y0)), String(Math.round(t.after)), String(Math.round(t.after + t.NWC))], choice: t.decision };
  }

  const WALK = {
    title: 'How Wendell builds one small shop',
    intro: '<p>Before the big store, here is a small one worked from start to finish: an Ironbark outlet shop at a ski area, open for <b>5 years</b>. Its fixtures cost <b>$60,000</b>, and a market survey last year cost <b>$5,000</b>. Once open, its sales minus its own costs leave <b>$30,000</b> a year before tax. Ironbark’s tax rate is <b>25%</b>.</p>',
    render(stage) {
      const R = [
        ['Start-up cash: fixtures', '−$60,000', '', '', 0], ['Market survey, already paid: left out', '', '', '', 0],
        ['Working capital: products minus what suppliers fund', '−$10,000', '', '+$10,000', 4],
        ['Yearly cash before tax', '', '$30,000', '$30,000', 1], ['Taxes on the yearly cash: $30,000 × 25%', '', '−$7,500', '−$7,500', 1],
        ['Tax saving from depreciation: ($60,000 ÷ 5) × 25%', '', '+$3,000', '+$3,000', 2],
        ['Maintenance capex', '', '−$2,000', '−$2,000', 3],
        ['Cash flow', '−$70,000', '$23,500', '$33,500', 5]];
      return `<div class="tw"><table class="cf"><caption>The ski-area shop’s cash flows</caption><thead><tr><th scope="col" style="text-align:left;min-width:min(13rem,30vw)">Row</th><th scope="col">Year 0</th><th scope="col">Years 1 to 4 (each)</th><th scope="col">Year 5</th></tr></thead><tbody>${R.filter((r) => r[4] <= stage).map((r) => `<tr class="${r[4] === stage ? 'reveal' : ''}${r[4] === 5 ? ' hl' : ''}"><td class="lbl">${r[4] === 5 ? '<b>' + r[0] + '</b>' : r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}</tbody></table></div>`;
    },
    stages: [
      { t: 'Ask the one question', p: 'Does Ironbark’s cash change because the shop opens? The $60,000 of fixtures is spent only if it opens, so it goes in year 0. The $5,000 survey was paid last year whatever happens, so it stays out. That is a <b>sunk cost</b>.' },
      { t: 'Taxes on the yearly cash', p: 'The shop’s $30,000 a year is taxed at 25%, so taxes take $7,500 a year.' },
      { t: 'The tax saving from depreciation', p: 'Ironbark depreciates the fixtures evenly: $60,000 ÷ 5 = $12,000 a year. Depreciation is not cash leaving, but it lowers taxable profit, so taxes fall by $12,000 × 25% = $3,000 a year. Over 5 years the government effectively pays $15,000 of the $60,000 fixtures.' },
      { t: 'Maintenance capex', p: 'Keeping the shop running means about $2,000 a year of <b>maintenance capex</b>: new racks, repairs, a replacement register. It is spent every year.' },
      { t: 'Working capital in and out', p: 'The shop stocks $15,000 of skis and jackets, and suppliers let Ironbark pay for $5,000 of that later. So $10,000 of Ironbark’s cash is tied up on the shelves. It goes out in year 0 and comes back in year 5, when the shop sells its last products.' },
      { t: 'Add each column', p: 'Year 0: −$60,000 − $10,000 = −$70,000. Each of years 1 to 4: $30,000 − $7,500 + $3,000 − $2,000 = $23,500. Year 5 adds the $10,000 coming back: $33,500. That row is what Wendell discounts to find the NPV, as in Unit 5.' },
    ],
  };

  root.DESK = {
    app: 'finan4-u6-cash-flow-desk', version: 1, seedVersion: 1, salt: 'rize-finan4-u6-cashflow:7b19e4', points: 20,
    storageKey: 'rize-finan4-u6-cashflow-v1', filePrefix: 'RelevantOrNot',
    verifyUrl: 'https://rizecomputerscience.github.io/finan4-cash-flow-desk/verify.html',
    calcPlaceholder: '(450000-45000)*0.25',
    calcHint: 'Type or tap. Use * to multiply and parentheses to group, so (900000+200000)/5*0.25 is one year’s tax saving on $1.1 million of equipment.',
    story: { title: 'Relevant or Not?', kicker: 'Corporate Finance, Unit 6', company: 'Ironbark Sporting Goods', team: 'Finance',
      from: 'Wendell Achebe', fromTitle: 'finance director, Ironbark Sporting Goods',
      dek: 'You have joined the finance team at Ironbark Sporting Goods, a chain of sporting-goods stores. Wendell Achebe, the finance director, is deciding whether to open a new store. Everyone has an item they want counted. Your job is to decide which items belong in the store’s cash flows, then build the rows he will discount.',
      whatBox: '<b>One question decides every item:</b> if Ironbark opens this store, does the company’s cash change because of it? If yes, it goes in the store’s cash flows. If no, it stays out, however official it looks.',
      stepsLine: 'There are twelve steps: a worked example, six problems with three one-question checks between them, one exam-style question, and a short note to Wendell.' },
    steps: STEPS, quiz: QUIZ, walk: WALK, buildTasks, taskView, judgeTask, helpText, praise, selfAnswer, selfWrong,
    note: { title: 'A note for the real-estate committee', label: 'Your note to Wendell', minWords: 30, receiptHeading: 'Note to the finance director',
      prompt: 'The real-estate committee meets tomorrow. Should Ironbark open the store? In one paragraph, give your answer and pick one item someone wanted counted that you left out (or one they forgot that you added). Say why.' },
  };
})(typeof window !== 'undefined' ? window : globalThis);
