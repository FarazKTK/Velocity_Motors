// Single Car Details Page Logic

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  let carId = urlParams.get('id');

  // Fallback to first car if no ID provided
  if (!carId && carsData.length > 0) {
    carId = carsData[0].id;
  }

  const car = getCarById(carId) || carsData[0];
  renderCarDetails(car);
  initEmiCalculator(car.price);
  renderRelatedCars(car);
});

function renderCarDetails(car) {
  // Page Title & Breadcrumb
  document.title = `${car.name} (${car.year}) | Velocity Motors`;
  const breadcrumbName = document.getElementById('car-breadcrumb-name');
  if (breadcrumbName) breadcrumbName.textContent = car.name;

  // Main Header details
  const nameEl = document.getElementById('car-title');
  const priceEl = document.getElementById('car-price');
  const yearEl = document.getElementById('car-year');
  const statusEl = document.getElementById('car-status');
  const descEl = document.getElementById('car-description');
  const ratingEl = document.getElementById('car-rating');

  if (nameEl) nameEl.textContent = car.name;
  if (priceEl) priceEl.textContent = formatCurrency(car.price);
  if (yearEl) yearEl.textContent = car.year;
  if (statusEl) {
    statusEl.textContent = car.status;
    statusEl.className = `px-3 py-1 rounded-full text-xs font-bold ${
      car.status === 'Featured' ? 'bg-amber-500 text-gray-950' : 
      car.status === 'Hot Deal' ? 'bg-red-500 text-white' : 
      'bg-emerald-600 text-white'
    } uppercase tracking-wide`;
  }
  if (descEl) descEl.textContent = car.description;
  if (ratingEl) ratingEl.innerHTML = `<i class="fa-solid fa-star text-amber-400 mr-1"></i>${car.rating} (Verified Concierge Inspected)`;

  // Gallery
  const mainImg = document.getElementById('car-main-img');
  const thumbsContainer = document.getElementById('car-thumbs');

  if (mainImg && car.images.length > 0) {
    mainImg.src = car.images[0];
    mainImg.alt = car.name;
  }

  if (thumbsContainer && car.images.length > 0) {
    thumbsContainer.innerHTML = car.images.map((imgUrl, index) => `
      <button onclick="changeMainImage('${imgUrl}', this)" class="thumb-btn flex-1 h-20 rounded-xl overflow-hidden border-2 ${index === 0 ? 'border-amber-500' : 'border-gray-800'} transition focus:outline-none">
        <img src="${imgUrl}" alt="Thumbnail ${index + 1}" class="w-full h-full object-cover">
      </button>
    `).join('');
  }

  // Specifications Grid
  const specs = [
    { label: "Horsepower", value: car.horsepower, icon: "fa-gauge-simple-high" },
    { label: "0-60 mph", value: car.acceleration, icon: "fa-stopwatch" },
    { label: "Top Speed", value: car.topSpeed, icon: "fa-tachograph-digital" },
    { label: "Engine", value: car.engine, icon: "fa-car-burst" },
    { label: "Transmission", value: car.transmission, icon: "fa-gear" },
    { label: "Drivetrain", value: car.drivetrain, icon: "fa-arrows-split-up-and-left" },
    { label: "Fuel Type", value: car.fuelType, icon: "fa-gas-pump" },
    { label: "Mileage", value: car.mileage, icon: "fa-road" },
    { label: "Exterior Color", value: car.exteriorColor, icon: "fa-palette" },
    { label: "Interior Trim", value: car.interiorColor, icon: "fa-couch" },
    { label: "Body Style", value: car.bodyType, icon: "fa-car-side" },
    { label: "VIN Identifier", value: car.vin, icon: "fa-fingerprint" }
  ];

  const specsContainer = document.getElementById('car-specs-grid');
  if (specsContainer) {
    specsContainer.innerHTML = specs.map(item => `
      <div class="glass-card p-4 rounded-xl border border-gray-800/80 flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-gray-900 border border-gray-800 text-amber-500 flex items-center justify-center shrink-0">
          <i class="fa-solid ${item.icon}"></i>
        </div>
        <div>
          <div class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">${item.label}</div>
          <div class="text-sm font-bold text-white mt-0.5">${item.value}</div>
        </div>
      </div>
    `).join('');
  }

  // Features Checklist
  const featuresContainer = document.getElementById('car-features-list');
  if (featuresContainer && car.features) {
    featuresContainer.innerHTML = car.features.map(f => `
      <div class="flex items-start gap-3 p-3 rounded-xl bg-gray-900/50 border border-gray-800/60">
        <div class="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs shrink-0 mt-0.5">
          <i class="fa-solid fa-check"></i>
        </div>
        <span class="text-sm text-gray-200 font-medium">${f}</span>
      </div>
    `).join('');
  }

  // Pre-fill Test Drive button
  const testDriveBtn = document.getElementById('car-test-drive-btn');
  if (testDriveBtn) {
    testDriveBtn.addEventListener('click', () => {
      openTestDriveModal(car.name);
    });
  }
}

// Switch Active Image in gallery
function changeMainImage(url, clickedBtn) {
  const mainImg = document.getElementById('car-main-img');
  if (mainImg) {
    mainImg.style.opacity = '0.4';
    mainImg.src = url;
    setTimeout(() => {
      mainImg.style.opacity = '1';
    }, 150);
  }

  const thumbBtns = document.querySelectorAll('.thumb-btn');
  thumbBtns.forEach(btn => {
    btn.classList.remove('border-amber-500');
    btn.classList.add('border-gray-800');
  });

  if (clickedBtn) {
    clickedBtn.classList.add('border-amber-500');
    clickedBtn.classList.remove('border-gray-800');
  }
}

// EMI / Loan Payment Calculator
function initEmiCalculator(vehiclePrice) {
  const downPaymentInput = document.getElementById('emi-down-payment');
  const downPaymentDisplay = document.getElementById('emi-down-display');
  const interestInput = document.getElementById('emi-interest');
  const interestDisplay = document.getElementById('emi-interest-display');
  const termSelect = document.getElementById('emi-term');
  const monthlyPaymentDisplay = document.getElementById('emi-monthly-result');
  const totalLoanDisplay = document.getElementById('emi-total-loan');

  if (!downPaymentInput || !monthlyPaymentDisplay) return;

  // Initialize defaults: 20% down payment
  const defaultDown = Math.round(vehiclePrice * 0.2);
  downPaymentInput.max = vehiclePrice * 0.8;
  downPaymentInput.value = defaultDown;
  if (downPaymentDisplay) downPaymentDisplay.textContent = formatCurrency(defaultDown);

  function calculate() {
    const down = parseFloat(downPaymentInput.value) || 0;
    const rateAnnual = parseFloat(interestInput.value) || 5.9;
    const months = parseInt(termSelect.value) || 60;

    const principal = vehiclePrice - down;
    if (principal <= 0) {
      monthlyPaymentDisplay.textContent = '$0/mo';
      return;
    }

    const r = (rateAnnual / 100) / 12;
    const emi = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);

    monthlyPaymentDisplay.textContent = `${formatCurrency(Math.round(emi))}/mo`;
    if (totalLoanDisplay) {
      totalLoanDisplay.textContent = `Principal Financed: ${formatCurrency(principal)}`;
    }
  }

  downPaymentInput.addEventListener('input', () => {
    if (downPaymentDisplay) downPaymentDisplay.textContent = formatCurrency(downPaymentInput.value);
    calculate();
  });

  interestInput.addEventListener('input', () => {
    if (interestDisplay) interestDisplay.textContent = `${interestInput.value}%`;
    calculate();
  });

  termSelect.addEventListener('change', calculate);

  // Initial run
  calculate();
}

// Similar / Related Cars
function renderRelatedCars(currentCar) {
  const relatedContainer = document.getElementById('related-cars-grid');
  if (!relatedContainer) return;

  const related = carsData
    .filter(c => c.id !== currentCar.id && (c.bodyType === currentCar.bodyType || c.brand === currentCar.brand))
    .slice(0, 3);

  const fallback = related.length > 0 ? related : carsData.filter(c => c.id !== currentCar.id).slice(0, 3);

  relatedContainer.innerHTML = fallback.map(car => `
    <div class="car-card glass-card rounded-2xl overflow-hidden flex flex-col transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10">
      <div class="car-card-img-wrapper h-48 w-full relative">
        <img src="${car.images[0]}" alt="${car.name}" class="w-full h-full object-cover">
        <div class="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-gray-950/80 backdrop-blur-md text-amber-400 font-extrabold text-sm">
          ${formatCurrency(car.price)}
        </div>
      </div>
      <div class="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div class="text-xs text-gray-400 mb-1">${car.brand} • ${car.year}</div>
          <h4 class="font-heading font-bold text-base text-white hover:text-amber-400 transition">
            <a href="car-details.html?id=${car.id}">${car.name}</a>
          </h4>
        </div>
        <div class="pt-4 flex items-center justify-between border-t border-gray-800 mt-4 text-xs">
          <span class="text-gray-400"><i class="fa-solid fa-gauge-simple-high text-amber-500 mr-1"></i>${car.horsepower}</span>
          <a href="car-details.html?id=${car.id}" class="text-amber-400 hover:text-amber-300 font-semibold">View Vehicle →</a>
        </div>
      </div>
    </div>
  `).join('');
}
