// Contact Page Form & FAQ Accordion Logic

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initFaqAccordion();
  checkUrlSubjectParam();
});

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name')?.value || 'Guest';
    const email = document.getElementById('contact-email')?.value;
    const subject = document.getElementById('contact-subject')?.value || 'Inquiry';
    const message = document.getElementById('contact-message')?.value;

    // Save to localStorage
    const inquiries = JSON.parse(localStorage.getItem('velocity_inquiries') || '[]');
    inquiries.push({
      name,
      email,
      subject,
      message,
      sentAt: new Date().toISOString()
    });
    localStorage.setItem('velocity_inquiries', JSON.stringify(inquiries));

    form.reset();
    showToast(`Thank you, ${name}! Your inquiry regarding "${subject}" has been submitted. Our concierge team will reply within 30 minutes.`);
  });
}

function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isOpen = !content.classList.contains('hidden');

        // Close all others
        faqItems.forEach(other => {
          const otherContent = other.querySelector('.faq-content');
          const otherIcon = other.querySelector('.faq-icon');
          if (otherContent) otherContent.classList.add('hidden');
          if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        });

        if (!isOpen) {
          content.classList.remove('hidden');
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      });
    }
  });
}

function checkUrlSubjectParam() {
  const params = new URLSearchParams(window.location.search);
  const subjectParam = params.get('subject');
  const subjectSelect = document.getElementById('contact-subject');
  if (subjectParam && subjectSelect) {
    for (let i = 0; i < subjectSelect.options.length; i++) {
      if (subjectSelect.options[i].value.toLowerCase().includes(subjectParam.toLowerCase())) {
        subjectSelect.selectedIndex = i;
        break;
      }
    }
  }
}
