// Main JavaScript file for Velocity Motors

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  highlightActiveNav();
  initGlobalModals();
  initNewsletter();
});

// Mobile Menu Navigation
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const closeBtn = document.getElementById('mobile-menu-close');
  const menu = document.getElementById('mobile-menu');

  if (toggleBtn && menu) {
    toggleBtn.addEventListener('click', () => {
      menu.classList.remove('hidden');
      menu.classList.add('flex');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeBtn && menu) {
    closeBtn.addEventListener('click', () => {
      menu.classList.add('hidden');
      menu.classList.remove('flex');
      document.body.style.overflow = 'auto';
    });
  }
}

// Highlight Active Nav Link
function highlightActiveNav() {
  const currentPath = window.location.pathname;
  const page = currentPath.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('text-amber-500', 'font-semibold');
      link.classList.remove('text-gray-300');
    }
  });
}

// Toast Notifications System
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-gray-900 border-amber-500' : 'bg-gray-900 border-red-500';
  const icon = isSuccess ? 'fa-circle-check text-amber-500' : 'fa-circle-exclamation text-red-500';

  toast.className = `toast flex items-center gap-3 px-5 py-4 rounded-xl border shadow-2xl text-white ${bgColor}`;
  toast.innerHTML = `
    <i class="fa-solid ${icon} text-xl"></i>
    <div>
      <h4 class="font-bold text-sm text-gray-200">${isSuccess ? 'Success' : 'Notice'}</h4>
      <p class="text-xs text-gray-400 mt-0.5">${message}</p>
    </div>
    <button class="ml-4 text-gray-400 hover:text-white" onclick="this.parentElement.remove()">
      <i class="fa-solid fa-xmark text-sm"></i>
    </button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

// Global Modals (e.g. Test Drive Modal)
function initGlobalModals() {
  const modal = document.getElementById('test-drive-modal');
  const closeBtn = document.getElementById('close-test-drive-modal');
  const form = document.getElementById('test-drive-form');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const carName = document.getElementById('modal-car-name')?.value || 'the selected vehicle';
      const name = document.getElementById('modal-user-name')?.value;
      const date = document.getElementById('modal-date')?.value;
      const phone = document.getElementById('modal-phone')?.value;

      // Save to localStorage
      const bookings = JSON.parse(localStorage.getItem('velocity_test_drives') || '[]');
      bookings.push({ car: carName, name, date, phone, bookedAt: new Date().toISOString() });
      localStorage.setItem('velocity_test_drives', JSON.stringify(bookings));

      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }
      form.reset();

      showToast(`Thank you, ${name}! Your test drive for ${carName} is confirmed for ${date}. Our concierge will contact you shortly.`);
    });
  }
}

// Open Test Drive Modal helper
function openTestDriveModal(carName = '') {
  const modal = document.getElementById('test-drive-modal');
  const carInput = document.getElementById('modal-car-name');
  if (carInput && carName) {
    carInput.value = carName;
  }
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

// Newsletter Subscription
function initNewsletter() {
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input[type="email"]').value;
      showToast(`Subscribed successfully with ${email}! Welcome to the VIP Circle.`);
      newsletterForm.reset();
    });
  }
}
