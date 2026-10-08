// Paste your Formspree endpoint here (looks like https://formspree.io/f/abcdwxyz)
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mkjorvky';

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Input Event (Client Name)
  // ==========================================
  const searchInput = document.getElementById('search');
  const inputMsg = document.querySelector('.inputMsg');

  if (searchInput && inputMsg) {
    searchInput.addEventListener('input', (e) => {
      const name = e.target.value.trim();
      inputMsg.textContent = name ? name : '...';
    });
  }

  // ==========================================
  // 2. Project Selection & Custom Request Toggle
  // ==========================================
  const countrySelect = document.getElementById('countrySelect');
  const changeMsg = document.querySelector('.changeMsg');
  const customRequestBtn = document.getElementById('customRequestBtn');
  const customRequestDiv = document.getElementById('customRequestDiv');
  const customRequestInput = document.getElementById('customRequestInput');

  function closeCustomRequest() {
    if (!customRequestDiv || !customRequestBtn) return;
    customRequestDiv.classList.add('hidden');
    customRequestDiv.style.display = 'none';
    customRequestBtn.innerHTML = '<i class="fa-solid fa-plus mr-1"></i> Custom Request';
    customRequestBtn.classList.remove('bg-sky-400/20', 'text-sky-400', 'border-sky-400');
    if (customRequestInput) customRequestInput.value = '';
  }

  if (countrySelect && changeMsg) {
    countrySelect.addEventListener('change', (e) => {
      const selectedProject = e.target.value;
      // Picking a dropdown option cancels any open custom request
      closeCustomRequest();
      if (selectedProject !== 'None') {
        changeMsg.textContent = selectedProject;
      } else {
        changeMsg.textContent = 'your project';
      }
    });
  }

  // Custom Request Button Handler
  if (customRequestBtn && customRequestDiv) {
    customRequestBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const isHidden = customRequestDiv.classList.contains('hidden') || customRequestDiv.style.display === 'none';

      if (isHidden) {
        customRequestDiv.classList.remove('hidden');
        customRequestDiv.style.display = 'block';
        customRequestBtn.innerHTML = '<i class="fa-solid fa-xmark mr-1"></i> Cancel Custom';
        customRequestBtn.classList.add('bg-sky-400/20', 'text-sky-400', 'border-sky-400');
        if (countrySelect) countrySelect.value = 'None';
        if (changeMsg) changeMsg.textContent = 'your custom project';
        if (customRequestInput) customRequestInput.focus();
      } else {
        closeCustomRequest();
        if (changeMsg) changeMsg.textContent = 'your project';
      }
    });
  }

  // ==========================================
  // 3. Feature Wishlist (Enter, Click Add, & Keyup)
  // ==========================================
  const keyInput = document.getElementById('keyInput');
  const addFeatureBtn = document.getElementById('addFeatureBtn');
  const keyMsg = document.querySelector('.keyMsg');
  const wishlist = document.querySelector('.wishlist');

  function addFeatureFromInput() {
    if (!keyInput || !wishlist) return;
    const val = keyInput.value.trim();
    if (!val) return;

    const newItem = document.createElement('li');
    newItem.textContent = val;
    newItem.className =
      'bg-slate-800 py-2 px-4 rounded border border-slate-700 text-sm cursor-pointer hover:bg-red-500/20 hover:border-red-500 hover:text-red-400 transition-colors shadow-sm';
    newItem.title = 'Click to remove';

    newItem.addEventListener('click', () => {
      newItem.remove();
    });

    wishlist.appendChild(newItem);
    keyInput.value = '';
    if (keyMsg) {
      keyMsg.textContent = 'Feature added! Click a tag to remove it.';
      setTimeout(() => {
        if (keyInput && keyInput.value === '') keyMsg.textContent = '';
      }, 2500);
    }
  }

  if (keyInput && wishlist) {
    keyInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addFeatureFromInput();
      }
    });

    keyInput.addEventListener('input', (e) => {
      if (keyMsg) {
        keyMsg.textContent = e.target.value !== '' ? `Typing: ${e.target.value}` : '';
      }
    });
  }

  if (addFeatureBtn) {
    addFeatureBtn.addEventListener('click', (e) => {
      e.preventDefault();
      addFeatureFromInput();
    });
  }

  // ==========================================
  // 4. Check Availability
  // ==========================================
  const clickEventBtn = document.getElementById('clickEvent');
  const clickMsg = document.querySelector('.clickMsg');

  const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const COLOR_CLASSES = [
    'text-sky-400', 'border-sky-400',
    'text-emerald-400', 'border-emerald-400',
    'text-amber-400', 'border-amber-400',
    'text-red-400', 'border-red-400',
  ];

  const toMinutes = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  };

  const formatTime = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${String(m).padStart(2, '0')} ${suffix}`;
  };

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  // Current weekday + minutes-since-midnight in the schedule's timezone
  const getNowInZone = (timeZone) => {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(new Date());
    const get = (type) => parts.find((p) => p.type === type).value;
    return {
      dayIndex: DAYS.indexOf(get('weekday').toLowerCase()),
      minutes: (Number(get('hour')) % 24) * 60 + Number(get('minute')),
    };
  };

  const setStatus = (btnText, color, messageHtml) => {
    clickEventBtn.textContent = btnText;
    clickEventBtn.disabled = false;
    clickEventBtn.classList.remove('opacity-50', 'cursor-not-allowed', ...COLOR_CLASSES);
    clickEventBtn.classList.add(`text-${color}-400`, `border-${color}-400`);
    clickMsg.className = `clickMsg text-sm text-${color}-400 font-medium`;
    clickMsg.innerHTML = messageHtml;
  };

  if (clickEventBtn && clickMsg) {
    clickEventBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      clickEventBtn.textContent = 'Checking...';
      clickEventBtn.disabled = true;
      clickEventBtn.classList.add('opacity-50', 'cursor-not-allowed');
      clickMsg.textContent = '';

      try {
        const response = await fetch('availability.json', { cache: 'no-store' });
        if (!response.ok) throw new Error('Could not load availability.json');
        const { timezone, schedule } = await response.json();

        const now = getNowInZone(timezone);
        const today = schedule[DAYS[now.dayIndex]];

        // Currently inside a working window?
        if (today && now.minutes >= toMinutes(today.start) && now.minutes < toMinutes(today.end)) {
          setStatus(
            'Status: Available',
            'emerald',
            `<i class="fa-solid fa-circle-check mr-1"></i> I'm available right now (until ${formatTime(today.end)} Cairo time).`
          );
          return;
        }

        // Otherwise find the next upcoming window
        let nextText = '';
        for (let offset = 0; offset <= 7; offset++) {
          const dayName = DAYS[(now.dayIndex + offset) % 7];
          const slot = schedule[dayName];
          if (!slot) continue;
          const startsLater = offset > 0 || now.minutes < toMinutes(slot.start);
          if (startsLater) {
            const when = offset === 0 ? 'today' : offset === 1 ? 'tomorrow' : capitalize(dayName);
            nextText = `Next available: ${when} ${formatTime(slot.start)} - ${formatTime(slot.end)} (Cairo time).`;
            break;
          }
        }

        setStatus(
          'Status: Unavailable',
          'amber',
          `<i class="fa-solid fa-clock mr-1"></i> I'm offline right now. ${nextText}`
        );
      } catch (err) {
        setStatus(
          'Check Availability',
          'red',
          '<i class="fa-solid fa-triangle-exclamation mr-1"></i> Could not load availability. Run the site through a local server (not file://).'
        );
      }
    });
  }

  // ==========================================
  // 5. Submit Event
  // ==========================================
  const loginForm = document.getElementById('loginForm');
  const loginMsg = document.querySelector('.loginMsg');

  if (loginForm && loginMsg) {
    const submitBtn = loginForm.querySelector('button[type="submit"]');

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = searchInput ? searchInput.value.trim() : '';
      const emailInput = document.getElementById('emailInput');
      const emailValue = emailInput ? emailInput.value.trim() : '';
      let project = countrySelect ? countrySelect.value : '';

      // If user typed in the wishlist input but forgot to hit Enter or click Add, capture it now
      if (keyInput && keyInput.value.trim()) {
        addFeatureFromInput();
      }
      const features = wishlist ? Array.from(wishlist.children).map((li) => li.textContent.trim()) : [];

      const isCustomVisible =
        customRequestDiv &&
        !customRequestDiv.classList.contains('hidden') &&
        customRequestDiv.style.display !== 'none';
      const customValue = customRequestInput ? customRequestInput.value.trim() : '';

      if (isCustomVisible && customValue !== '') {
        project = `Custom Request: "${customValue}"`;
      }

      if (!name || (project === 'None' && (!isCustomVisible || customValue === ''))) {
        loginMsg.textContent = 'Please provide your name and select a project type or enter a custom request.';
        loginMsg.className = 'loginMsg text-center mt-4 font-medium text-red-400 h-6';
        return;
      }

      if (FORMSPREE_ENDPOINT.includes('YOUR_FORM_ID')) {
        loginMsg.textContent = 'Form is not configured yet: set FORMSPREE_ENDPOINT in main.js.';
        loginMsg.className = 'loginMsg text-center mt-4 font-medium text-red-400 h-6';
        return;
      }

      loginMsg.textContent = 'Sending...';
      loginMsg.className = 'loginMsg text-center mt-4 font-medium text-sky-400 h-6';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
      }

      const featuresText = features.length ? features.join(', ') : 'None specified';
      const emailBodyMessage = `Project Type:\n${project}\n\nFeature Wishlist:\n${
        features.length ? features.map((f, i) => `${i + 1}. ${f}`).join('\n') : 'No specific features requested.'
      }`;

      const formData = new FormData();
      formData.append('_subject', `New project request from ${name}`);
      formData.append('name', name);
      if (emailValue) formData.append('email', emailValue);
      formData.append('project', project);
      formData.append('features', featuresText);
      formData.append('message', emailBodyMessage);

      try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: formData,
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          const errMsg = data.errors ? data.errors.map((e) => e.message).join(', ') : (data.error || 'Request failed');
          throw new Error(errMsg);
        }

        loginMsg.className = 'loginMsg text-center mt-4 font-medium text-emerald-400 h-6';
        loginMsg.textContent = `Thanks ${name}! Your request was sent. I'll get back to you soon.`;

        // Reset the form and all live-updated UI
        loginForm.reset();
        closeCustomRequest();
        if (inputMsg) inputMsg.textContent = '...';
        if (changeMsg) changeMsg.textContent = 'your project';
        if (wishlist) wishlist.innerHTML = '';
        if (keyMsg) keyMsg.textContent = '';
      } catch (err) {
        console.error('Form submission error:', err);
        loginMsg.className = 'loginMsg text-center mt-4 font-medium text-red-400 h-6';
        loginMsg.textContent = err.message || 'Something went wrong sending your request. Please try again.';
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
      }
    });
  }

  // ==========================================
  // 6. Cross-Platform Gmail Link Router
  // ==========================================
  const gmailLink = document.getElementById('gmailLink');

  if (gmailLink) {
    gmailLink.addEventListener('click', (e) => {
      e.preventDefault();

      const email = 'sraftori15@gmail.com';
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;

      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        window.location.href = `googlegmail:///co?to=${email}`;
        setTimeout(() => {
          window.location.href = `mailto:${email}`;
        }, 500);
      } else if (/android/i.test(userAgent)) {
        window.location.href = `intent://compose?to=${email}#Intent;package=com.google.android.gm;scheme=mailto;end;`;
      } else {
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, '_blank');
      }
    });
  }
});