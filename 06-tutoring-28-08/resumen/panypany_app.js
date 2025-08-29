/**
 * Tag filtering logic (no frameworks)
 */
(function(){
  const btns = Array.from(document.querySelectorAll('.filter-btn'));
  const blocks = Array.from(document.querySelectorAll('.entity-block'));
  const ALL = 'all';

  // Collect tags from entities
  const tags = [...new Set(blocks.map(b => (b.getAttribute('data-tag')||'').trim()))];

  // Initialize counts per tag
  const countByTag = tags.reduce((acc, tag) => {
    acc[tag] = blocks.filter(b => b.getAttribute('data-tag') === tag).length;
    return acc;
  }, {});
  const total = blocks.length;

  // Paint counts on buttons
  btns.forEach(btn => {
    const tag = btn.dataset.tag;
    const countSpan = btn.querySelector('.count');
    if(!countSpan) return;
    if(tag === ALL){ countSpan.textContent = `(${total})`; }
    else { countSpan.textContent = `(${countByTag[tag] || 0})`; }
  });

  // Active tags set (multi-select). If empty => show all.
  const active = new Set();

  function applyFilter(){
    if(active.size === 0 || active.has(ALL)){
      // Show all
      blocks.forEach(b => b.hidden = false);
      // Toggle active class
      btns.forEach(b => {
        const isAll = b.dataset.tag === ALL;
        b.classList.toggle('is-active', isAll);
        b.setAttribute('aria-pressed', isAll ? 'true' : 'false');
      });
      active.clear();
      return;
    }
    // Hide/show by tags
    blocks.forEach(b => {
      const tag = b.getAttribute('data-tag');
      b.hidden = !active.has(tag);
    });
    // Update button states
    btns.forEach(b => {
      const tag = b.dataset.tag;
      b.classList.toggle('is-active', active.has(tag));
      b.setAttribute('aria-pressed', active.has(tag) ? 'true' : 'false');
    });
  }

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.dataset.tag;
      if(tag === ALL){
        active.clear();
      } else {
        if(active.has(tag)) active.delete(tag);
        else active.add(tag);
        // Ensure ALL isn't selected when others are
        active.delete(ALL);
      }
      applyFilter();
    });
  });

  // Ready: show all by default
  applyFilter();
})();