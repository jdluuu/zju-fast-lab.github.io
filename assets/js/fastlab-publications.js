document.querySelectorAll('[data-publications]').forEach((container) => {
  const form = container.querySelector('.fastlab-publication-filters');
  const search = form.querySelector('input[type="search"]');
  const faculty = form.querySelector('#publication-faculty');
  const type = form.querySelector('#publication-type');
  const year = form.querySelector('#publication-year');
  const status = container.querySelector('[data-publication-status]');
  const empty = container.querySelector('[data-publication-empty]');
  const normalize = (text) => text.normalize('NFKC').toLocaleLowerCase().replace(/\s+/g, ' ').trim();
  const papers = Array.from(container.querySelectorAll('.fastlab-paper')).map((element) => ({
    element,
    search: normalize(element.dataset.search),
    // Match full author names, ignoring contribution/correspondence markers.
    authors: element.dataset.authors.split('|').map((author) => normalize(author).replace(/[\s*†‡]+$/u, '')),
    types: element.dataset.types.split(' '),
    year: element.dataset.year,
  }));

  const filter = () => {
    const terms = normalize(search.value).split(' ').filter(Boolean);
    let count = 0;
    papers.forEach((paper) => {
      const visible = terms.every((term) => paper.search.includes(term))
        && (!faculty.value || paper.authors.includes(faculty.value))
        && (!type.value || paper.types.includes(type.value))
        && (!year.value || paper.year === year.value);
      paper.element.hidden = !visible;
      if (visible) count += 1;
    });
    empty.hidden = count > 0;
    status.textContent = `${count} ${count === 1 ? 'publication' : 'publications'} found`;
  };

  // Keep existing links such as /publication/#paper-conference working.
  const readTypeHash = () => {
    const value = window.location.hash.slice(1);
    if (Array.from(type.options).some((option) => option.value === value)) type.value = value;
    filter();
  };

  form.addEventListener('submit', (event) => event.preventDefault());
  search.addEventListener('input', filter);
  faculty.addEventListener('change', filter);
  type.addEventListener('change', filter);
  year.addEventListener('change', filter);
  window.addEventListener('hashchange', readTypeHash);
  container.querySelector('[data-publication-reset]').addEventListener('click', () => {
    form.reset();
    filter();
    search.focus();
  });
  form.hidden = false;
  readTypeHash();
});
