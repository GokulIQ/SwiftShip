// Dashboard-only interactions: skeleton loaders, pickup wizard, tracking, and invoices.
(() => {
  const finishLoading = () => document.body.classList.add('dashboard-loaded');
  window.setTimeout(finishLoading, 450);
  const currentUserKey = 'swiftship-current-user';
  const currentAdminKey = 'swiftship-current-admin';
  const defaultUser = {
    name: 'Jordan Carter',
    email: 'demo@swiftship.test',
    phone: '+44 20 5555 0188',
    address: '24 Parcel Yard, Central Delivery District',
    isDemo: true
  };
  const defaultAdmin = {
    name: 'Kiran',
    email: 'admin@swiftship.test',
    role: 'Super Admin',
    isDemo: true
  };

  const readCurrentUser = () => {
    try {
      const user = JSON.parse(localStorage.getItem(currentUserKey) || 'null');
      return user && user.email ? { ...defaultUser, ...user } : defaultUser;
    } catch (error) {
      return defaultUser;
    }
  };

  const currentUser = readCurrentUser();
  const readCurrentAdmin = () => {
    try {
      const admin = JSON.parse(localStorage.getItem(currentAdminKey) || 'null');
      if (!admin || !admin.email) {
        return defaultAdmin;
      }
      return {
        ...defaultAdmin,
        ...admin,
        name: admin.name && admin.name !== 'SwiftShip Admin' ? admin.name : defaultAdmin.name,
        role: admin.role && admin.role !== 'admin' ? admin.role : defaultAdmin.role
      };
    } catch (error) {
      return defaultAdmin;
    }
  };

  const isAdminPage = document.body.classList.contains('admin-page');
  const currentAdmin = readCurrentAdmin();
  const currentProfile = isAdminPage ? currentAdmin : currentUser;
  const profileRole = isAdminPage ? currentProfile.role : 'Customer';
  const profileInitials = (name) => name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  const setText = (selector, text) => {
    const element = document.querySelector(selector);
    if (element) {
      element.textContent = text;
    }
  };

  setText('[data-customer-name]', `Hello, ${currentUser.name}`);
  setText(
    '[data-customer-summary]',
    currentUser.isDemo
      ? 'Signed in with the built-in demo account for this static dashboard.'
      : 'Using your locally saved browser account. Registration data stays on this device.'
  );
  setText(
    '[data-profile-summary]',
    `${currentUser.name} | ${currentUser.email} | ${currentUser.phone}. Default pickup: ${currentUser.address}.`
  );
  setText('[data-profile-name]', currentUser.name);
  setText('[data-profile-email]', currentUser.email);
  setText('[data-profile-phone]', currentUser.phone);
  setText('[data-saved-address-summary]', `Default pickup: ${currentUser.address}.`);
  document.querySelectorAll('[data-profile-menu-name]').forEach((element) => {
    element.textContent = currentProfile.name;
  });
  document.querySelectorAll('[data-profile-menu-role]').forEach((element) => {
    element.textContent = profileRole;
  });
  document.querySelectorAll('[data-profile-avatar]').forEach((element) => {
    element.textContent = profileInitials(currentProfile.name) || 'SS';
  });

  const pickupAddress = document.querySelector('#pickupAddress');
  if (pickupAddress && currentUser.address) {
    pickupAddress.value = currentUser.address;
  }

  const clearDashboardSession = () => {
    localStorage.removeItem(isAdminPage ? currentAdminKey : currentUserKey);
  };

  document.querySelectorAll('.dashboard-sidebar a[href="login.html"], .dashboard-sidebar a[href="../pages/login.html"], .dashboard-card a[href="login.html"], .quick-actions-card a[href="login.html"], [data-profile-logout]').forEach((link) => {
    link.addEventListener('click', () => {
      clearDashboardSession();
    });
  });

  document.querySelectorAll('[data-profile-menu]').forEach((menu) => {
    const toggle = menu.querySelector('[data-profile-toggle]');
    if (!toggle) {
      return;
    }

    toggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.querySelectorAll('[data-profile-menu]').forEach((otherMenu) => {
        if (otherMenu !== menu) {
          otherMenu.classList.remove('open');
          otherMenu.querySelector('[data-profile-toggle]')?.setAttribute('aria-expanded', 'false');
        }
      });
    });
  });

  document.querySelectorAll('[data-notification-menu]').forEach((menu) => {
    const toggle = menu.querySelector('[data-notification-toggle]');
    if (!toggle) {
      return;
    }

    toggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.querySelectorAll('[data-notification-menu]').forEach((otherMenu) => {
        if (otherMenu !== menu) {
          otherMenu.classList.remove('open');
          otherMenu.querySelector('[data-notification-toggle]')?.setAttribute('aria-expanded', 'false');
        }
      });
      document.querySelectorAll('[data-profile-menu]').forEach((profileMenu) => {
        profileMenu.classList.remove('open');
        profileMenu.querySelector('[data-profile-toggle]')?.setAttribute('aria-expanded', 'false');
      });
    });
  });

  document.addEventListener('click', (event) => {
    document.querySelectorAll('[data-profile-menu]').forEach((menu) => {
      if (!menu.contains(event.target)) {
        menu.classList.remove('open');
        menu.querySelector('[data-profile-toggle]')?.setAttribute('aria-expanded', 'false');
      }
    });
    document.querySelectorAll('[data-notification-menu]').forEach((menu) => {
      if (!menu.contains(event.target)) {
        menu.classList.remove('open');
        menu.querySelector('[data-notification-toggle]')?.setAttribute('aria-expanded', 'false');
      }
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') {
      return;
    }
    document.querySelectorAll('[data-profile-menu]').forEach((menu) => {
      menu.classList.remove('open');
      menu.querySelector('[data-profile-toggle]')?.setAttribute('aria-expanded', 'false');
    });
    document.querySelectorAll('[data-notification-menu]').forEach((menu) => {
      menu.classList.remove('open');
      menu.querySelector('[data-notification-toggle]')?.setAttribute('aria-expanded', 'false');
    });
  });

  const menuButtons = document.querySelectorAll('[data-dashboard-menu]');
  const sidebar = document.querySelector('#dashboardSidebar');
  const shell = document.querySelector('.dashboard-shell');
  const mobileSidebar = window.matchMedia('(max-width: 1024px)');
  if (menuButtons.length && sidebar && shell) {
    const syncSidebarButtons = () => {
      const isMobile = mobileSidebar.matches;
      const isExpanded = isMobile ? sidebar.classList.contains('open') : !shell.classList.contains('sidebar-collapsed');
      menuButtons.forEach((button) => {
        const icon = button.querySelector('i');
        button.setAttribute('aria-expanded', String(isExpanded));
        button.setAttribute('aria-label', isExpanded ? 'Collapse sidebar' : 'Expand sidebar');
        if (!icon) {
          return;
        }
        if (button.classList.contains('sidebar-close-button')) {
          icon.className = isMobile || isExpanded ? 'fa-solid fa-xmark' : 'fa-solid fa-angle-right';
        } else {
          icon.className = isMobile && isExpanded ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
        }
      });
    };

    menuButtons.forEach((button) => {
      button.addEventListener('click', () => {
        if (mobileSidebar.matches) {
          sidebar.classList.toggle('open');
        } else {
          shell.classList.toggle('sidebar-collapsed');
        }
        syncSidebarButtons();
      });
    });

    sidebar.querySelectorAll('nav a').forEach((link) => {
      link.addEventListener('click', () => {
        if (mobileSidebar.matches) {
          sidebar.classList.remove('open');
          syncSidebarButtons();
        }
      });
    });

    mobileSidebar.addEventListener('change', () => {
      sidebar.classList.remove('open');
      syncSidebarButtons();
    });

    syncSidebarButtons();
  }

  const wizard = document.querySelector('[data-booking-wizard]');
  if (wizard) {
    const form = wizard.querySelector('form');
    const panels = Array.from(wizard.querySelectorAll('.wizard-panel'));
    const steps = Array.from(wizard.querySelectorAll('.wizard-steps button'));
    let currentStep = 0;

    const showStep = (index) => {
      currentStep = Math.max(0, Math.min(index, panels.length - 1));
      panels.forEach((panel, panelIndex) => panel.classList.toggle('active', panelIndex === currentStep));
      steps.forEach((step, stepIndex) => step.classList.toggle('active', stepIndex === currentStep));
    };

    const validateCurrentPanel = () => {
      const fields = panels[currentStep].querySelectorAll('input, select, textarea');
      return Array.from(fields).every((field) => field.checkValidity());
    };

    wizard.querySelectorAll('[data-wizard-next]').forEach((button) => {
      button.addEventListener('click', () => {
        form.classList.add('was-validated');
        if (validateCurrentPanel()) {
          showStep(currentStep + 1);
        }
      });
    });

    wizard.querySelectorAll('[data-wizard-prev]').forEach((button) => {
      button.addEventListener('click', () => showStep(currentStep - 1));
    });

    steps.forEach((button, index) => {
      button.addEventListener('click', () => showStep(index));
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      form.classList.add('was-validated');
      if (!form.checkValidity()) {
        return;
      }
      const modalElement = document.querySelector('#bookingSuccessModal');
      if (modalElement && window.bootstrap) {
        window.bootstrap.Modal.getOrCreateInstance(modalElement).show();
      }
    });
  }

  const trackCards = document.querySelectorAll('[data-track-parcel]');
  const trackingDetails = document.querySelectorAll('[data-tracking-detail]');
  const selectTrackedParcel = (parcel) => {
    let selectedCard = null;
    trackCards.forEach((card) => {
      const isSelected = card.dataset.trackParcel === parcel;
      card.classList.toggle('active', isSelected);
      if (isSelected) {
        selectedCard = card;
      }
    });
    trackingDetails.forEach((detail) => {
      detail.classList.toggle('active', detail.dataset.trackingDetail === parcel);
    });
    return selectedCard;
  };

  trackCards.forEach((card) => {
    card.addEventListener('click', () => {
      selectTrackedParcel(card.dataset.trackParcel);
    });
  });

  document.querySelectorAll('[data-tracking-search]').forEach((form) => {
    const input = form.querySelector('#trackingSearch');
    const message = form.querySelector('.form-message');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      form.classList.add('was-validated');
      if (!form.checkValidity() || !input) {
        return;
      }
      const query = input.value.trim().toLowerCase();
      const match = Array.from(trackCards).find((card) => {
        const parcel = (card.dataset.trackParcel || '').toLowerCase();
        const searchText = `${parcel} ${card.textContent}`.toLowerCase();
        return parcel === query || searchText.includes(query);
      });
      if (!match) {
        if (message) {
          message.textContent = 'No demo parcel found. Try PKG-4421 or PKG-4412.';
        }
        return;
      }
      selectTrackedParcel(match.dataset.trackParcel);
      match.focus();
      if (message) {
        message.textContent = `Tracking details loaded for ${match.dataset.trackParcel}.`;
      }
    });
  });

  const historyForm = document.querySelector('[data-history-filter]');
  if (historyForm) {
    const rows = document.querySelectorAll('[data-history-row]');
    historyForm.addEventListener('input', () => {
      const status = historyForm.querySelector('[name="status"]').value;
      const from = historyForm.querySelector('[name="from"]').value;
      const to = historyForm.querySelector('[name="to"]').value;
      rows.forEach((row) => {
        const rowStatus = row.dataset.status;
        const rowDate = row.dataset.date;
        const statusMatch = status === 'all' || rowStatus === status;
        const fromMatch = !from || rowDate >= from;
        const toMatch = !to || rowDate <= to;
        row.hidden = !(statusMatch && fromMatch && toMatch);
      });
    });
  }

  document.querySelectorAll('[data-invoice]').forEach((button) => {
    button.addEventListener('click', () => {
      const modal = document.querySelector('#invoiceModal');
      if (!modal) {
        return;
      }
      modal.querySelector('[data-invoice-id]').textContent = button.dataset.invoiceId;
      modal.querySelector('[data-invoice-service]').textContent = button.dataset.invoiceService;
      modal.querySelector('[data-invoice-weight]').textContent = button.dataset.invoiceWeight;
      modal.querySelector('[data-invoice-distance]').textContent = button.dataset.invoiceDistance;
      modal.querySelector('[data-invoice-price]').textContent = button.dataset.invoicePrice;
      modal.querySelector('[data-invoice-date]').textContent = button.dataset.invoiceDate;
      modal.querySelector('[data-invoice-status]').textContent = button.dataset.invoiceStatus;
      if (window.bootstrap) {
        window.bootstrap.Modal.getOrCreateInstance(modal).show();
      }
    });
  });
})();
