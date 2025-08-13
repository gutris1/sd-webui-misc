document.addEventListener('DOMContentLoaded', () => {
  const F = /firefox/i.test(navigator.userAgent),
  bar = document.createElement('style'),

  sb = 'var(--primary-400)',
  sbh = 'var(--primary-600)',
  sbg = 'var(--input-background-fill)',

  fox = `
    :root, .dark {
      scrollbar-color: ${sb} transparent;
    }
  `,

  webkit = `
    ::-webkit-scrollbar {
      width: .5rem;
    }
    ::-webkit-scrollbar-thumb {
      background: ${sb} !important;
      border-radius: 30px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: ${sbh} !important;
    }
    ::-webkit-scrollbar-track {
      background: ${sbg};
      border-radius: 0px;
    }
  `;

  bar.innerHTML = F ? fox : webkit;
  document.head.appendChild(bar);
});

onUiLoaded(() => setTimeout(() => {
  const containers = [
    'txt2img_script_container',
    'img2img_script_container'
  ];

  containers.forEach(containerId => {
    const con = document.getElementById(containerId),
    groups = con?.querySelectorAll('.gr-group.gradio-group:not(.hide):not(.hidden)');
    if (!groups?.length) return;

    groups.forEach(group => {
      const accordions = group.querySelectorAll('div.block.gradio-accordion:not(.hide):not(.hidden)');
      accordions.forEach(accordion => {
        if (accordion.classList.contains('input-accordion') || accordion.classList.contains('input-accordion-m')) {
          const visibleCheckbox = accordion.querySelector('.input-accordion-checkbox');
          if (visibleCheckbox) {
            if (accordion.onVisibleCheckboxChange) {
              const originalHandler = accordion.onVisibleCheckboxChange;
              accordion.onVisibleCheckboxChange = function() {
                originalHandler.call(this);
                accordion.classList.toggle('T', visibleCheckbox.checked);
              };
            } else {
              visibleCheckbox.addEventListener('input', function() {
                accordion.classList.toggle('T', this.checked);
              });
            }
          }
        } else {
          const wrappers = accordion.querySelectorAll('.gradio-checkbox');
          wrappers.forEach(wrapper => {
            const input = wrapper.querySelector('input[type="checkbox"]'), span  = wrapper.querySelector('span');
            if (input && span && /enable/i.test(span.textContent)) {
              input.onchange = () => {
                const any = [...accordion.querySelectorAll('.gradio-checkbox input[type="checkbox"]')]
                  .some(cb => /enable/i.test(cb.closest('.gradio-checkbox')?.querySelector('span')?.textContent || '') && cb.checked);
                accordion.classList.toggle('T', any);
              };
            }
          });
        }
      });
    });
  });
}, 2000));