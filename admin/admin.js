// Admin-only interactions for the static SwiftShip operations panel.
(() => {
  const currentPage = document.body.dataset.adminPage || 'overview';

  const pageTitles = {
    overview: 'Overview',
    bookings: 'Bookings',
    shipments: 'Shipments',
    customers: 'Customers',
    drivers: 'Drivers',
    invoices: 'Invoices',
    support: 'Support',
    services: 'Services',
    coverage: 'Coverage',
    content: 'Content',
    reports: 'Reports',
    settings: 'Settings'
  };

  document.querySelectorAll('#overview, .dashboard-metrics, .admin-overview-grid').forEach((element) => {
    element.hidden = currentPage !== 'overview';
  });

  document.querySelectorAll('.admin-section').forEach((section) => {
    section.hidden = section.id !== currentPage;
  });

  document.querySelectorAll('.admin-sidebar nav a[data-admin-page-link]').forEach((link) => {
    link.classList.toggle('active', link.dataset.adminPageLink === currentPage);
  });

  document.querySelectorAll('[data-admin-page-title]').forEach((element) => {
    element.textContent = pageTitles[currentPage] || 'Overview';
  });

  const showStatus = (message, scope = document) => {
    const target = scope.querySelector('.form-message') || document.querySelector('[data-admin-status-message]');
    if (target) {
      target.textContent = message;
    }
  };

  document.querySelectorAll('[data-admin-filter]').forEach((form) => {
    const target = document.getElementById(form.dataset.adminFilter) || document.querySelector(form.dataset.adminFilter);
    if (!target) {
      return;
    }

    const rows = Array.from(target.querySelectorAll('[data-admin-row]'));
    const searchInput = form.querySelector('[data-admin-search]');
    const statusInput = form.querySelector('[data-admin-status]');
    const serviceInput = form.querySelector('[data-admin-service]');
    const typeInput = form.querySelector('[data-admin-type]');
    const emptyState = target.querySelector('[data-admin-empty]');

    const applyFilters = () => {
      const search = (searchInput?.value || '').trim().toLowerCase();
      const status = statusInput?.value || 'all';
      const service = serviceInput?.value || 'all';
      const type = typeInput?.value || 'all';
      let visibleCount = 0;

      rows.forEach((row) => {
        const rowSearch = (row.dataset.search || row.textContent || '').toLowerCase();
        const searchMatch = !search || rowSearch.includes(search);
        const statusMatch = status === 'all' || row.dataset.status === status;
        const serviceMatch = service === 'all' || row.dataset.service === service;
        const typeMatch = type === 'all' || row.dataset.type === type;
        const isVisible = searchMatch && statusMatch && serviceMatch && typeMatch;
        row.hidden = !isVisible;
        if (isVisible) {
          visibleCount += 1;
        }
      });

      if (emptyState) {
        emptyState.hidden = visibleCount > 0;
      }
    };

    form.addEventListener('input', applyFilters);
    applyFilters();
  });

  const detailModal = document.querySelector('#adminDetailModal');
  const detailTitle = detailModal?.querySelector('#adminDetailLabel');
  const detailBody = detailModal?.querySelector('[data-admin-detail-body]');
  document.querySelectorAll('[data-admin-detail]').forEach((button) => {
    button.addEventListener('click', () => {
      if (detailTitle) {
        detailTitle.textContent = button.dataset.title || 'Admin detail';
      }
      if (detailBody) {
        detailBody.textContent = button.dataset.detail || 'Demo admin record opened.';
      }
      if (detailModal && window.bootstrap) {
        window.bootstrap.Modal.getOrCreateInstance(detailModal).show();
      }
    });
  });

  document.querySelectorAll('[data-admin-modal-save]').forEach((button) => {
    button.addEventListener('click', () => {
      if (detailBody) {
        detailBody.textContent = 'Demo change saved locally for this static admin preview.';
      }
    });
  });

  document.querySelectorAll(
    '[data-admin-dispatch], [data-admin-message], [data-admin-service-pricing], [data-admin-create-booking], [data-admin-add-customer]'
  ).forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      event.stopPropagation();
      form.classList.add('was-validated');
      if (!form.checkValidity()) {
        return;
      }
      const modal = form.closest('.modal');
      showStatus('Demo action completed. Connect this form to your backend API for production.', form);
      if (modal && window.bootstrap) {
        window.setTimeout(() => window.bootstrap.Modal.getOrCreateInstance(modal).hide(), 750);
      }
      form.reset();
      form.classList.remove('was-validated');
    });
  });

  const zoneForm = document.querySelector('[data-admin-zone-form]');
  if (zoneForm) {
    zoneForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = zoneForm.querySelector('input');
      const value = input ? input.value.trim().toUpperCase() : '';
      showStatus(value ? `${value} is inside the demo SwiftShip coverage area.` : 'Enter a postcode to check coverage.', zoneForm);
    });
  }

  document.querySelectorAll('[data-admin-zone-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.admin-zone-map .zone').forEach((zone) => zone.classList.toggle('active'));
    });
  });

  const statusMessage = document.querySelector('[data-admin-status-message]');
  const setGlobalMessage = (message) => {
    if (statusMessage) {
      statusMessage.textContent = message;
    }
  };

  document.querySelectorAll('[data-admin-save-settings]').forEach((button) => {
    button.addEventListener('click', () => setGlobalMessage('Admin settings saved for this static demo session.'));
  });

  document.querySelectorAll('[data-admin-save-content]').forEach((button) => {
    button.addEventListener('click', () => setGlobalMessage('Content draft saved in the demo admin panel.'));
  });

  document.querySelectorAll('[data-admin-export]').forEach((button) => {
    button.addEventListener('click', () => setGlobalMessage('Demo export prepared. Backend CSV generation can be connected here.'));
  });

  document.querySelectorAll('[data-admin-bulk-update]').forEach((button) => {
    button.addEventListener('click', () => setGlobalMessage('Visible shipments queued for a demo bulk status update.'));
  });

  document.querySelectorAll('[data-admin-payment-run]').forEach((button) => {
    button.addEventListener('click', () => setGlobalMessage('Payment run placeholder started for open invoices.'));
  });

  document.querySelectorAll('[data-admin-ticket]').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('article');
      if (card) {
        card.classList.toggle('active');
      }
      setGlobalMessage('Support ticket opened in the demo response queue.');
    });
  });

  const activeLink = document.querySelector(`.admin-sidebar nav a[data-admin-page-link="${currentPage}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }
})();
