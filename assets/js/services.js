// Services & Financing Page Interactive Logic

document.addEventListener('DOMContentLoaded', () => {
  initTradeInCalculator();
  initFinanceApplication();
});

// Interactive Trade-in Estimator
function initTradeInCalculator() {
  const form = document.getElementById('trade-in-form');
  const resultCard = document.getElementById('trade-in-result');
  const valueDisplay = document.getElementById('trade-in-val-range');
  const carSummary = document.getElementById('trade-in-car-summary');

  if (!form || !resultCard) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const year = parseInt(document.getElementById('trade-year').value) || 2020;
    const make = document.getElementById('trade-make').value;
    const model = document.getElementById('trade-model').value;
    const mileage = parseInt(document.getElementById('trade-mileage').value) || 30000;
    const condition = document.getElementById('trade-condition').value;

    // Realistic valuation estimation algorithm
    let baseVal = 45000;
    if (year >= 2023) baseVal = 65000;
    else if (year >= 2021) baseVal = 50000;
    else if (year >= 2018) baseVal = 38000;
    else baseVal = 26000;

    // Adjust for mileage
    const mileageDeduction = Math.min(20000, (mileage / 1000) * 150);
    baseVal = Math.max(12000, baseVal - mileageDeduction);

    // Adjust for condition
    if (condition === 'excellent') baseVal *= 1.15;
    else if (condition === 'good') baseVal *= 1.0;
    else if (condition === 'fair') baseVal *= 0.82;

    const lowEstimate = Math.round(baseVal * 0.95 / 500) * 500;
    const highEstimate = Math.round(baseVal * 1.08 / 500) * 500;

    if (valueDisplay) {
      valueDisplay.textContent = `${formatCurrency(lowEstimate)} - ${formatCurrency(highEstimate)}`;
    }
    if (carSummary) {
      carSummary.textContent = `${year} ${make} ${model} (${condition.toUpperCase()} Condition, ~${mileage.toLocaleString()} miles)`;
    }

    resultCard.classList.remove('hidden');
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    showToast(`Instant trade-in estimate generated for your ${year} ${make} ${model}!`);
  });
}

// Financing Application Form Submission
function initFinanceApplication() {
  const financeForm = document.getElementById('finance-app-form');
  if (!financeForm) return;

  financeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const applicantName = document.getElementById('fin-name')?.value || 'Applicant';
    const amount = document.getElementById('fin-amount')?.value || 'Vehicle';

    // Store application to localStorage
    const apps = JSON.parse(localStorage.getItem('velocity_finance_apps') || '[]');
    apps.push({
      name: applicantName,
      amount,
      submittedAt: new Date().toISOString()
    });
    localStorage.setItem('velocity_finance_apps', JSON.stringify(apps));

    financeForm.reset();
    showToast(`Thank you, ${applicantName}! Your pre-approval dossier has been received. Our senior finance underwriter will reach out within 2 hours.`);
  });
}
