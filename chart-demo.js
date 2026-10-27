/* Self-contained, illustrative chart UI. No user data is read or transmitted. */
(() => {
  const values = [48, 74, 57, 92, 65, 81, 70];
  const points = values.map((value, index) => `${12 + index * 36},${142 - value * 1.16}`).join(' ');
  const copy = {
    zh: { greeting: '十月 · 消费概览', title: '每一笔，<span>都有形状。</span>', month: '本月支出', chart: '近 7 天', sample: '示例数据', bar: '柱状', line: '折线', days: ['一','二','三','四','五','六','日'], note: '选择样式和颜色，看看图表如何变化', home: '概览', stats: '统计', bills: '账单', colors: ['翡翠绿','海洋蓝','暮光紫'] },
    en: { greeting: 'October · Overview', title: 'Every spend, <span>in perspective.</span>', month: 'This month', chart: 'Last 7 days', sample: 'Sample data', bar: 'Bars', line: 'Line', days: ['M','T','W','T','F','S','S'], note: 'Choose a style and color to see the chart change', home: 'Overview', stats: 'Insights', bills: 'Expenses', colors: ['Emerald','Ocean','Dusk'] }
  };
  const themes = [['emerald','#18ad70'], ['ocean','#397bdc'], ['dusk','#9a70d6']];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function render(element) {
    const language = document.documentElement.dataset.lang === 'en' ? 'en' : 'zh';
    const t = copy[language];
    const previousMode = element.dataset.mode || 'bar';
    const previousTheme = element.dataset.theme || 'emerald';
    element.dataset.mode = previousMode;
    element.dataset.theme = previousTheme;
    element.setAttribute('aria-label', language === 'en' ? 'Interactive sample spending chart' : '可交互的示例支出图表');
    element.innerHTML = `<div class="chart-phone"><div class="chart-screen">
      <div class="chart-status"><span>9:41</span><span>●●● ▰</span></div>
      <div class="chart-greeting">${t.greeting}</div><h3>${t.title}</h3>
      <div class="chart-summary"><small>${t.month}</small><strong>¥ 3,284.50</strong><em>↘ 12.6%</em></div>
      <div class="chart-panel"><div class="chart-panel-title"><span>${t.chart}</span><small>${t.sample}</small></div>
        <div class="chart-plot"><div class="chart-bars">${values.map((v,i) => `<i class="chart-bar" style="--height:${v}%;--delay:${i*65}ms"></i>`).join('')}</div>
          <svg class="chart-line" viewBox="0 0 240 150" preserveAspectRatio="none" aria-hidden="true"><polyline points="${points}" />${values.map((v,i) => `<circle cx="${12+i*36}" cy="${142-v*1.16}" r="3.5" style="--delay:${i*150+200}ms"/>`).join('')}</svg></div>
        <div class="chart-days">${t.days.map(day=>`<span>${day}</span>`).join('')}</div>
        <div class="chart-controls"><div class="chart-modes" role="group" aria-label="Chart style">
          <button type="button" data-chart-mode="bar" aria-pressed="${previousMode==='bar'}">${t.bar}</button>
          <button type="button" data-chart-mode="line" aria-pressed="${previousMode==='line'}">${t.line}</button></div>
          <div class="chart-colors" role="group" aria-label="Chart color">${themes.map(([name,color],i)=>`<button type="button" data-chart-theme="${name}" style="--swatch:${color}" aria-label="${t.colors[i]}" aria-pressed="${previousTheme===name}"></button>`).join('')}</div></div>
        <p class="chart-foot">${t.note}</p></div>
      <div class="chart-tabbar"><strong>◉ ${t.home}</strong><span>▤ ${t.bills}</span><span>▥ ${t.stats}</span></div>
    </div></div>`;
    element.querySelectorAll('[data-chart-mode]').forEach(button => button.addEventListener('click', () => {
      element.dataset.mode = button.dataset.chartMode;
      element.querySelectorAll('[data-chart-mode]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      play(element);
    }));
    element.querySelectorAll('[data-chart-theme]').forEach(button => button.addEventListener('click', () => {
      element.dataset.theme = button.dataset.chartTheme;
      element.querySelectorAll('[data-chart-theme]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      play(element);
    }));
    if (element.dataset.visible === 'true') play(element);
  }
  function play(element) {
    element.classList.remove('playing');
    if (!reduced.matches) requestAnimationFrame(() => requestAnimationFrame(() => element.classList.add('playing')));
  }
  const demos = [...document.querySelectorAll('.chart-demo')];
  demos.forEach(render);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.dataset.visible = 'true'; play(entry.target); observer.unobserve(entry.target); }
    }), { threshold: .3 });
    demos.forEach(demo => observer.observe(demo));
  } else demos.forEach(demo => { demo.dataset.visible = 'true'; play(demo); });
  document.addEventListener('pennytrace:language', () => demos.forEach(render));
})();
