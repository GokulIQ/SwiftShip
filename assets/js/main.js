// Shared public-site interactions: theme, RTL, validation, filters, and timers.
(() => {
  const root = document.documentElement;
  const themeKey = 'swiftship-theme';
  const directionKey = 'swiftship-direction';
  const usersKey = 'swiftship-demo-users';
  const currentUserKey = 'swiftship-current-user';
  const currentAdminKey = 'swiftship-current-admin';
  const rememberedEmailKey = 'swiftship-remembered-email';
  const rememberedRoleKey = 'swiftship-remembered-role';
  const demoUser = {
    id: 'demo-user',
    name: 'Jordan Carter',
    email: 'demo@swiftship.test',
    phone: '+44 20 5555 0188',
    address: '24 Parcel Yard, Central Delivery District',
    password: 'swiftship123',
    isDemo: true
  };
  const adminUser = {
    id: 'admin-user',
    name: 'Kiran',
    email: 'admin@swiftship.test',
    phone: '+44 20 5555 0100',
    address: 'SwiftShip Operations Control',
    password: 'admin123',
    role: 'Super Admin',
    isDemo: true
  };

  const normalizeEmail = (value) => value.trim().toLowerCase();

  const readStoredUsers = () => {
    try {
      const users = JSON.parse(localStorage.getItem(usersKey) || '[]');
      return Array.isArray(users) ? users : [];
    } catch (error) {
      return [];
    }
  };

  const saveStoredUsers = (users) => {
    localStorage.setItem(usersKey, JSON.stringify(users));
  };

  const toPublicUser = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    isDemo: Boolean(user.isDemo),
    registeredAt: user.registeredAt || null
  });

  const saveCurrentUser = (user) => {
    localStorage.setItem(currentUserKey, JSON.stringify(toPublicUser(user)));
  };

  const findDemoUser = (email) => {
    const storedUsers = readStoredUsers();
    return [demoUser, ...storedUsers].find((user) => normalizeEmail(user.email) === email);
  };

  const fieldValue = (id) => {
    const field = document.getElementById(id);
    return field ? field.value.trim() : '';
  };

  const registerLocalUser = (form) => {
    const emailField = form.querySelector('#regEmail');
    const email = normalizeEmail(fieldValue('regEmail'));
    const password = fieldValue('regPassword');

    if (email === normalizeEmail(adminUser.email) || findDemoUser(email)) {
      if (emailField) {
        emailField.setCustomValidity('This email is already registered.');
      }
      return {
        valid: false,
        message: 'This email is already registered. Please login instead.'
      };
    }

    const user = {
      id: `local-${Date.now()}`,
      name: fieldValue('regName'),
      email,
      phone: fieldValue('regPhone'),
      address: fieldValue('regAddress'),
      password,
      isDemo: false,
      registeredAt: new Date().toISOString()
    };

    const users = readStoredUsers();
    users.push(user);
    saveStoredUsers(users);
    saveCurrentUser(user);
    localStorage.setItem(rememberedEmailKey, email);
    localStorage.setItem(rememberedRoleKey, 'customer');

    return {
      valid: true,
      message: 'Account saved locally. Loading your dashboard...'
    };
  };

  const loginLocalUser = (form) => {
    const emailField = form.querySelector('#loginEmail');
    const passwordField = form.querySelector('#loginPassword');
    const rememberField = form.querySelector('#rememberLogin');
    const roleField = form.querySelector('input[name="loginRole"]:checked');
    const role = roleField ? roleField.value : 'customer';
    const email = normalizeEmail(emailField ? emailField.value : '');
    const password = passwordField ? passwordField.value : '';

    if (role === 'admin') {
      const isAdmin = email === normalizeEmail(adminUser.email) && password === adminUser.password;
      if (!isAdmin) {
        if (passwordField) {
          passwordField.setCustomValidity('Admin email or password is incorrect.');
        }
        return {
          valid: false,
          message: 'Admin email or password is incorrect.'
        };
      }

      localStorage.setItem(currentAdminKey, JSON.stringify({
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        isDemo: adminUser.isDemo
      }));
      if (rememberField && rememberField.checked) {
        localStorage.setItem(rememberedEmailKey, email);
        localStorage.setItem(rememberedRoleKey, 'admin');
      } else {
        localStorage.removeItem(rememberedEmailKey);
        localStorage.removeItem(rememberedRoleKey);
      }

      return {
        valid: true,
        message: 'Admin login successful. Loading admin panel...',
        redirect: '../admin/index.html'
      };
    }

    const user = findDemoUser(email);

    if (!user || user.password !== password) {
      if (passwordField) {
        passwordField.setCustomValidity('Email or password is incorrect.');
      }
      return {
        valid: false,
        message: 'Email or password is incorrect. Use your local account or the demo account.'
      };
    }

    saveCurrentUser(user);
    if (rememberField && rememberField.checked) {
      localStorage.setItem(rememberedEmailKey, email);
      localStorage.setItem(rememberedRoleKey, 'customer');
    } else {
      localStorage.removeItem(rememberedEmailKey);
      localStorage.removeItem(rememberedRoleKey);
    }

    return {
      valid: true,
      message: 'Login successful. Loading your dashboard...',
      redirect: 'dashboard-home.html'
    };
  };

  const setTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(themeKey, theme);
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      const icon = button.querySelector('i');
      const label = button.querySelector('span');
      if (icon) {
        icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
      }
      if (label) {
        label.textContent = theme === 'dark' ? 'Light' : 'Dark';
      }
    });
  };

  const setDirection = (direction) => {
    root.setAttribute('dir', direction);
    localStorage.setItem(directionKey, direction);
    document.querySelectorAll('[data-rtl-toggle]').forEach((button) => {
      const icon = button.querySelector('i');
      const label = button.querySelector('span');
      if (icon) {
        icon.className = direction === 'rtl' ? 'fa-solid fa-align-left' : 'fa-solid fa-align-right';
      }
      if (label) {
        label.textContent = direction === 'rtl' ? 'LTR' : 'RTL';
      }
    });
  };

  setTheme(localStorage.getItem(themeKey) || 'light');
  setDirection(localStorage.getItem(directionKey) || 'ltr');

  const blogPosts = [
    {
      slug: 'packaging-fragile-parcels',
      category: 'Shipping guide',
      title: 'Packaging Tips for Fragile Parcels',
      summary: 'A practical guide to protecting glassware, electronics, ceramics, and delicate gifts before local courier pickup.',
      meta: 'By Priya Mehta | 8 min read',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=80&fm=webp',
      imageAlt: 'Fragile parcels being prepared with protective packaging',
      introTitle: 'Protect the parcel before the route begins.',
      intro: 'Fragile deliveries succeed when the outer box, internal cushioning, and label placement work together. Choose a new double-wall box when the item is heavy, valuable, or awkwardly shaped.',
      sections: [
        ['1. Wrap each item separately', 'Glass, ceramics, and electronics should never touch each other inside the box. Wrap each piece, tape the wrap in place, and leave room for cushioning around every side.'],
        ['2. Fill empty space', 'Movement causes most damage. Fill gaps with paper, recyclable padding, or molded inserts so the contents do not shift when the courier lifts or turns the parcel.'],
        ['3. Label clearly', 'Place the delivery label on the largest flat surface. Add fragile handling notes during booking so the courier sees them in the dashboard workflow.']
      ],
      bio: 'Priya Mehta writes practical delivery operations guides for SwiftShip local courier customers.'
    },
    {
      slug: 'same-day-shipping-local-shops',
      category: 'E-commerce',
      title: 'Same-Day Shipping for Local Shops',
      summary: 'A practical guide to cut-off times, customer promises, and route planning for same-day orders.',
      meta: 'By Lewis Hart | 6 min read',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=80&fm=webp',
      imageAlt: 'Local shop preparing same-day shipments',
      introTitle: 'Set the promise before the parcel leaves.',
      intro: 'Same-day delivery works best when your team knows the final order cut-off, packing window, pickup point, and customer message before the first courier arrives.',
      sections: [
        ['1. Choose a clear cut-off time', 'Pick a time your store can meet on busy days, not only quiet days. A consistent promise is easier for customers and dispatchers to trust.'],
        ['2. Group nearby orders', 'Batch pickups by neighborhood or route area so couriers can move quickly without doubling back through traffic.'],
        ['3. Send proactive updates', 'Tell customers when the order is packed, collected, out for delivery, and completed so the same-day promise feels visible.']
      ],
      bio: 'Lewis Hart shares dispatch planning notes from SwiftShip same-day delivery workflows.'
    },
    {
      slug: 'choosing-right-courier-service',
      category: 'Shipping',
      title: 'Choosing the Right Courier Service',
      summary: 'Compare standard, express, scheduled, and business account options before you book.',
      meta: 'By Omar Patel | 7 min read',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=80&fm=webp',
      imageAlt: 'Team comparing courier service options on laptops',
      introTitle: 'Match the service to the delivery promise.',
      intro: 'The best courier option depends on speed, parcel size, route distance, delivery proof, and how often you send. Start with the promise you made to the receiver.',
      sections: [
        ['1. Use standard for flexible deliveries', 'Standard service keeps costs controlled when next-day or wider delivery windows are acceptable.'],
        ['2. Use express for urgent parcels', 'Express service is better for time-sensitive documents, replacement parts, gifts, and customer recovery deliveries.'],
        ['3. Use business accounts for repeat volume', 'Recurring pickups, saved addresses, and consolidated invoices reduce admin work for teams shipping every week.']
      ],
      bio: 'Omar Patel writes customer support guides that help senders choose the right service level.'
    },
    {
      slug: 'delivery-zones-price',
      category: 'Pricing',
      title: 'How Delivery Zones Affect Price',
      summary: 'What city, suburban, and outer-zone pricing means for your parcels.',
      meta: 'By Aisha Grant | 5 min read',
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1400&q=80&fm=webp',
      imageAlt: 'Courier pricing and delivery zone planning meeting',
      introTitle: 'Distance and density shape the final rate.',
      intro: 'Delivery zones help courier teams estimate travel time, route density, and driver availability. A short city route usually prices differently from an outer-zone drop.',
      sections: [
        ['1. City zones are denser', 'More nearby stops can lower the route cost because drivers spend less time between addresses.'],
        ['2. Suburban zones need wider windows', 'Suburban routes often need more travel time, so planned delivery windows help keep pricing predictable.'],
        ['3. Outer zones may add surcharges', 'Longer travel, fewer nearby stops, and limited courier availability can increase the total price.']
      ],
      bio: 'Aisha Grant explains courier operations and pricing in clear, sender-friendly language.'
    },
    {
      slug: 'rainy-day-parcels',
      category: 'Guides',
      title: 'Preparing Parcels for Rainy Days',
      summary: 'Water-resistant labels, outer wraps, and driver notes that reduce failed drops.',
      meta: 'By Priya Mehta | 6 min read',
      image: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=1400&q=80&fm=webp',
      imageAlt: 'Packaging supplies for rainy day deliveries',
      introTitle: 'Keep moisture away from the label and contents.',
      intro: 'Rain does not need to stop a delivery, but parcels need a little extra protection before pickup. Focus on the label, box seams, and drop-off notes.',
      sections: [
        ['1. Protect the shipping label', 'Use a label pouch or clear cover so barcode scans and address details stay readable after handling.'],
        ['2. Seal box seams fully', 'Tape every open edge and reinforce the bottom of heavier parcels before handing them to the courier.'],
        ['3. Add delivery notes', 'Mention covered porches, reception desks, or safe dry locations when booking the delivery.']
      ],
      bio: 'Priya Mehta writes practical packing advice for everyday local deliveries.'
    },
    {
      slug: 'tracking-updates-customers-expect',
      category: 'E-commerce',
      title: 'Tracking Updates Customers Expect',
      summary: 'The five delivery milestones that make local delivery feel transparent.',
      meta: 'By Lewis Hart | 5 min read',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80&fm=webp',
      imageAlt: 'Team reviewing courier tracking updates',
      introTitle: 'Good tracking turns waiting into confidence.',
      intro: 'Customers do not need constant messages, but they do need the right updates at the right time. Clear milestones reduce support questions and missed deliveries.',
      sections: [
        ['1. Confirm the booking', 'Send confirmation as soon as the shipment is created so the customer knows the order is in motion.'],
        ['2. Show pickup and route status', 'Collected and out-for-delivery updates help customers plan around the delivery window.'],
        ['3. Close with proof of delivery', 'A completed status, time stamp, and delivery note make the final handoff easy to verify.']
      ],
      bio: 'Lewis Hart documents tracking patterns from SwiftShip dispatch and customer care workflows.'
    }
  ];

  const blogPostBySlug = blogPosts.reduce((posts, post) => {
    posts[post.slug] = post;
    return posts;
  }, {});

  const renderBlogDetail = () => {
    const article = document.querySelector('[data-blog-detail]');
    if (!article) {
      return;
    }

    const requestedSlug = new URLSearchParams(window.location.search).get('post');
    const post = blogPostBySlug[requestedSlug] || blogPosts[0];
    const relatedPosts = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 2);
    const heroImage = document.querySelector('[data-blog-hero-image]');
    const category = document.querySelector('[data-blog-category]');
    const title = document.querySelector('[data-blog-title]');
    const summary = document.querySelector('[data-blog-summary]');

    document.title = `${post.title} | SwiftShip Blog`;
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute('content', post.summary);
    }
    if (heroImage) {
      heroImage.src = post.image;
      heroImage.alt = post.imageAlt;
    }
    if (category) {
      category.textContent = post.category;
    }
    if (title) {
      title.textContent = post.title;
    }
    if (summary) {
      summary.textContent = post.summary;
    }

    article.innerHTML = `
      <p class="eyebrow">${post.meta}</p>
      <h2>${post.introTitle}</h2>
      <p>${post.intro}</p>
      ${post.sections.map((section) => `<h3>${section[0]}</h3><p>${section[1]}</p>`).join('')}
      <div class="share-buttons my-4">
        <a class="btn btn-outline-primary" href="https://www.facebook.com/sharer/sharer.php?u=https://example.com/${post.slug}">Share</a>
        <a class="btn btn-outline-primary" href="https://www.linkedin.com/">LinkedIn</a>
        <a class="btn btn-outline-primary" href="mailto:?subject=SwiftShip ${encodeURIComponent(post.title)}">Email</a>
      </div>
      <article class="info-card">
        <h3>Author bio</h3>
        <p>${post.bio}</p>
      </article>
      <h2 class="mt-5">Related posts</h2>
      <div class="row g-4">
        ${relatedPosts.map((item) => `
          <div class="col-md-6">
            <article class="blog-card">
              <img src="${item.image}" alt="${item.imageAlt}">
              <div class="blog-card__body">
                <h3><a href="blog-details.html?post=${item.slug}">${item.title}</a></h3>
                <p>${item.summary}</p>
              </div>
            </article>
          </div>
        `).join('')}
      </div>
      <h2 class="mt-5">Leave a comment</h2>
      <form class="auth-card needs-validation" data-static-form data-success-message="Your demo comment has been added." novalidate>
        <div class="row g-3">
          <div class="col-md-6"><label class="form-label" for="commentName">Name</label><input class="form-control" id="commentName" type="text" required><div class="invalid-feedback">Name is required.</div></div>
          <div class="col-md-6"><label class="form-label" for="commentEmail">Email</label><input class="form-control" id="commentEmail" type="email" required><div class="invalid-feedback">Email is required.</div></div>
          <div class="col-12"><label class="form-label" for="commentText">Comment</label><textarea class="form-control" id="commentText" rows="4" required></textarea><div class="invalid-feedback">Comment is required.</div></div>
          <div class="col-12"><button class="btn btn-primary" type="submit">Post Comment</button><p class="form-message" role="status" aria-live="polite"></p></div>
        </div>
      </form>
    `;
  };

  renderBlogDetail();

  const rememberedEmail = localStorage.getItem(rememberedEmailKey);
  const loginEmailField = document.querySelector('#loginEmail');
  if (rememberedEmail && loginEmailField) {
    loginEmailField.value = rememberedEmail;
  }
  const rememberedRole = localStorage.getItem(rememberedRoleKey);
  const rememberedRoleField = rememberedRole === 'admin' || rememberedRole === 'customer'
    ? document.querySelector(`input[name="loginRole"][value="${rememberedRole}"]`)
    : null;
  if (rememberedRoleField) {
    rememberedRoleField.checked = true;
  }

  document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  });

  document.querySelectorAll('[data-rtl-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      setDirection(root.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl');
    });
  });

  document.querySelectorAll('[data-auth-form] input, [data-auth-form] textarea').forEach((field) => {
    field.addEventListener('input', () => {
      field.setCustomValidity('');
      const message = field.closest('form')?.querySelector('.form-message');
      if (message) {
        message.textContent = '';
      }
    });
  });

  document.querySelectorAll('[data-password-reset]').forEach((button) => {
    button.addEventListener('click', () => {
      const form = button.closest('form');
      const message = form?.querySelector('.form-message');
      if (message) {
        message.textContent = 'Password reset demo ready. Use demo@swiftship.test / swiftship123 or admin@swiftship.test / admin123.';
      }
    });
  });

  document.querySelectorAll('form.needs-validation').forEach((form) => {
    form.addEventListener('submit', (event) => {
      let authMessage = '';
      let redirectTarget = form.dataset.redirect || '';

      form.querySelectorAll('input, textarea, select').forEach((field) => {
        field.setCustomValidity('');
      });

      form.querySelectorAll('[data-match]').forEach((field) => {
        const target = document.getElementById(field.dataset.match);
        const matches = target && field.value === target.value;
        field.setCustomValidity(matches ? '' : (field.dataset.matchMessage || 'Values must match.'));
      });

      let isValid = form.checkValidity();
      if (isValid && form.dataset.authForm === 'register') {
        const result = registerLocalUser(form);
        isValid = result.valid;
        authMessage = result.message;
      }
      if (isValid && form.dataset.authForm === 'login') {
        const result = loginLocalUser(form);
        isValid = result.valid;
        authMessage = result.message;
        redirectTarget = result.redirect || redirectTarget;
      }

      if (!isValid || form.hasAttribute('data-static-form') || redirectTarget) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');

      const message = form.querySelector('.form-message');
      if (message && authMessage) {
        message.textContent = authMessage;
      }

      if (isValid) {
        if (message) {
          message.textContent = authMessage || form.dataset.successMessage || 'Thanks. Your demo request has been captured.';
        }
        if (redirectTarget) {
          window.setTimeout(() => {
            window.location.href = redirectTarget;
          }, 650);
        }
      }
    });
  });

  const quoteForm = document.querySelector('[data-quote-form]');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (event) => {
      event.preventDefault();
      quoteForm.classList.add('was-validated');
      if (!quoteForm.checkValidity()) {
        return;
      }
      const result = quoteForm.querySelector('.quote-result');
      if (result) {
        result.hidden = false;
        result.textContent = 'Demo quote: Standard delivery from postcode pickup to drop-off starts at INR 6.99. Express starts at INR 10.99.';
      }
    });
  }

  const postcodeForm = document.querySelector('[data-postcode-form]');
  if (postcodeForm) {
    postcodeForm.addEventListener('submit', (event) => {
      event.preventDefault();
      postcodeForm.classList.add('was-validated');
      if (!postcodeForm.checkValidity()) {
        return;
      }
      const result = postcodeForm.querySelector('.postcode-result');
      if (result) {
        result.hidden = false;
        result.textContent = 'Great news. This demo postcode is inside our local delivery coverage area.';
      }
    });
  }

  const filterButtons = document.querySelectorAll('[data-blog-filter]');
  const blogCards = document.querySelectorAll('[data-category]');
  const blogSearchInput = document.querySelector('[data-blog-search]');
  const blogEmptyState = document.querySelector('[data-blog-empty]');

  if (filterButtons.length || blogSearchInput) {
    const applyBlogFilters = () => {
      const activeButton = document.querySelector('[data-blog-filter].active');
      const filter = activeButton ? activeButton.dataset.blogFilter : 'all';
      const query = (blogSearchInput?.value || '').trim().toLowerCase();
      let visibleCount = 0;

      blogCards.forEach((card) => {
        const categoryMatch = filter === 'all' || card.dataset.category === filter;
        const searchMatch = !query || card.textContent.toLowerCase().includes(query);
        const isVisible = categoryMatch && searchMatch;
        card.hidden = !isVisible;
        if (isVisible) {
          visibleCount += 1;
        }
      });

      if (blogEmptyState) {
        blogEmptyState.hidden = visibleCount > 0;
      }
    };

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        filterButtons.forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        applyBlogFilters();
      });
    });

    if (blogSearchInput) {
      blogSearchInput.addEventListener('input', applyBlogFilters);
    }

    applyBlogFilters();
  }

  const countdown = document.querySelector('[data-countdown]');
  if (countdown) {
    const target = new Date(countdown.dataset.countdown).getTime();
    const parts = {
      days: countdown.querySelector('[data-days]'),
      hours: countdown.querySelector('[data-hours]'),
      minutes: countdown.querySelector('[data-minutes]'),
      seconds: countdown.querySelector('[data-seconds]')
    };
    const updateCountdown = () => {
      const remaining = Math.max(0, target - Date.now());
      const days = Math.floor(remaining / 86400000);
      const hours = Math.floor((remaining % 86400000) / 3600000);
      const minutes = Math.floor((remaining % 3600000) / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      if (parts.days) parts.days.textContent = String(days).padStart(2, '0');
      if (parts.hours) parts.hours.textContent = String(hours).padStart(2, '0');
      if (parts.minutes) parts.minutes.textContent = String(minutes).padStart(2, '0');
      if (parts.seconds) parts.seconds.textContent = String(seconds).padStart(2, '0');
    };
    updateCountdown();
    window.setInterval(updateCountdown, 1000);
  }
})();

