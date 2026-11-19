// Cars Inventory Filtering and Sorting Logic

document.addEventListener('DOMContentLoaded', () => {
  const carsContainer = document.getElementById('inventory-grid');
  const countDisplay = document.getElementById('inventory-count');
  const searchInput = document.getElementById('filter-search');
  const brandSelect = document.getElementById('filter-brand');
  const bodySelect = document.getElementById('filter-body');
  const fuelSelect = document.getElementById('filter-fuel');
  const transmissionSelect = document.getElementById('filter-transmission');
  const priceSlider = document.getElementById('filter-price');
  const priceDisplay = document.getElementById('price-value-display');
  const sortSelect = document.getElementById('filter-sort');
  const resetBtn = document.getElementById('filter-reset');

  // Parse URL parameters for pre-filtering
  const urlParams = new URLSearchParams(window.location.search);
  const paramBrand = urlParams.get('brand');
  const paramBody = urlParams.get('body');
  const paramFuel = urlParams.get('fuel');
  const paramMaxPrice = urlParams.get('maxPrice');
  const paramSearch = urlParams.get('search');

  if (paramBrand && brandSelect) brandSelect.value = paramBrand;
  if (paramBody && bodySelect) bodySelect.value = paramBody;
  if (paramFuel && fuelSelect) fuelSelect.value = paramFuel;
  if (paramMaxPrice && priceSlider) {
    priceSlider.value = paramMaxPrice;
    if (priceDisplay) priceDisplay.textContent = formatCurrency(paramMaxPrice);
  }
  if (paramSearch && searchInput) searchInput.value = paramSearch;

  // Filter application function
  function applyFilters() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedBrand = brandSelect ? brandSelect.value : '';
    const selectedBody = bodySelect ? bodySelect.value : '';
    const selectedFuel = fuelSelect ? fuelSelect.value : '';
    const selectedTransmission = transmissionSelect ? transmissionSelect.value : '';
    const maxPrice = priceSlider ? parseInt(priceSlider.value, 10) : 300000;
    const sortBy = sortSelect ? sortSelect.value : 'default';

    let filtered = carsData.filter(car => {
      // Search matching (name, model, brand)
      if (query && !car.name.toLowerCase().includes(query) && !car.brand.toLowerCase().includes(query) && !car.model.toLowerCase().includes(query)) {
        return false;
      }
      // Brand matching
      if (selectedBrand && car.brand !== selectedBrand) {
        return false;
      }
      // Body style matching
      if (selectedBody && car.bodyType !== selectedBody) {
        return false;
      }
      // Fuel type matching
      if (selectedFuel && car.fuelType !== selectedFuel) {
        return false;
      }
      // Transmission matching
      if (selectedTransmission && car.transmission !== selectedTransmission) {
        return false;
      }
      // Price ceiling
      if (car.price > maxPrice) {
        return false;
      }

      return true;
    });

    // Sorting
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'year-new') {
      filtered.sort((a, b) => b.year - a.year);
    } else if (sortBy === 'power-high') {
      filtered.sort((a, b) => parseInt(b.horsepower) - parseInt(a.horsepower));
    } else if (sortBy === 'rating-high') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    renderCars(filtered);
  }

  function renderCars(cars) {
    if (!carsContainer) return;

    if (countDisplay) {
      countDisplay.textContent = `Showing ${cars.length} of ${carsData.length} vehicles`;
    }

    if (cars.length === 0) {
      carsContainer.innerHTML = `
        <div class="col-span-full py-16 text-center">
          <div class="w-20 h-20 rounded-full bg-gray-800/80 text-gray-500 mx-auto flex items-center justify-center text-3xl mb-4">
            <i class="fa-solid fa-car-burst"></i>
          </div>
          <h3 class="font-heading text-2xl font-bold text-white mb-2">No Vehicles Match Your Criteria</h3>
          <p class="text-sm text-gray-400 max-w-md mx-auto mb-6">Try adjusting your filters or price slider to discover other exceptional models in our collection.</p>
          <button id="no-match-reset" class="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold text-sm transition">
            Reset All Filters
          </button>
        </div>
      `;

      const noMatchReset = document.getElementById('no-match-reset');
      if (noMatchReset) {
        noMatchReset.addEventListener('click', resetAllFilters);
      }
      return;
    }

    carsContainer.innerHTML = cars.map(car => `
      <div class="car-card glass-card rounded-2xl overflow-hidden flex flex-col transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10">
        <div class="car-card-img-wrapper h-60 w-full relative">
          <img src="${car.images[0]}" alt="${car.name}" class="w-full h-full object-cover">
          <div class="absolute top-3 left-3 flex gap-2">
            <span class="px-2.5 py-1 rounded-full text-xs font-bold ${
              car.status === 'Featured' ? 'bg-amber-500 text-gray-950' : 
              car.status === 'Hot Deal' ? 'bg-red-500 text-white' : 
              'bg-emerald-600 text-white'
            } uppercase tracking-wide">
              ${car.status}
            </span>
            <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-900/80 backdrop-blur-md text-gray-200 border border-gray-700">
              ${car.year}
            </span>
            <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-900/80 backdrop-blur-md text-amber-300 border border-gray-700">
              ${car.bodyType}
            </span>
          </div>
          <div class="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-gray-950/80 backdrop-blur-md text-amber-400 font-extrabold text-lg">
            ${formatCurrency(car.price)}
          </div>
        </div>

        <div class="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-center text-xs text-gray-400 mb-1">
              <span class="font-medium text-amber-400">${car.brand}</span>
              <span><i class="fa-solid fa-star text-amber-400 mr-1"></i>${car.rating} (Verified)</span>
            </div>
            <h3 class="font-heading font-bold text-xl text-white hover:text-amber-400 transition">
              <a href="car-details.html?id=${car.id}">${car.name}</a>
            </h3>

            <!-- Specs Grid -->
            <div class="grid grid-cols-2 gap-2 py-4 my-2 border-y border-gray-800 text-xs text-gray-300">
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-gauge-simple-high text-amber-500 w-4 text-center"></i>
                <span>${car.horsepower}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-stopwatch text-amber-500 w-4 text-center"></i>
                <span>${car.acceleration}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-gas-pump text-amber-500 w-4 text-center"></i>
                <span>${car.fuelType}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-gear text-amber-500 w-4 text-center"></i>
                <span>${car.transmission}</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3 pt-2">
            <a href="car-details.html?id=${car.id}" class="flex-1 text-center py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold text-xs transition border border-gray-700">
              View Full Specs
            </a>
            <button onclick="openTestDriveModal('${car.name}')" class="p-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-gray-950 transition text-sm font-semibold" title="Book Test Drive">
              <i class="fa-solid fa-calendar-check"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function resetAllFilters() {
    if (searchInput) searchInput.value = '';
    if (brandSelect) brandSelect.value = '';
    if (bodySelect) bodySelect.value = '';
    if (fuelSelect) fuelSelect.value = '';
    if (transmissionSelect) transmissionSelect.value = '';
    if (priceSlider) {
      priceSlider.value = 300000;
      if (priceDisplay) priceDisplay.textContent = '$300,000';
    }
    if (sortSelect) sortSelect.value = 'default';
    
    // Clear URL query parameters cleanly
    window.history.replaceState({}, document.title, window.location.pathname);
    applyFilters();
  }

  // Event Listeners
  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (brandSelect) brandSelect.addEventListener('change', applyFilters);
  if (bodySelect) bodySelect.addEventListener('change', applyFilters);
  if (fuelSelect) fuelSelect.addEventListener('change', applyFilters);
  if (transmissionSelect) transmissionSelect.addEventListener('change', applyFilters);
  if (sortSelect) sortSelect.addEventListener('change', applyFilters);
  if (resetBtn) resetBtn.addEventListener('click', resetAllFilters);

  if (priceSlider) {
    priceSlider.addEventListener('input', () => {
      if (priceDisplay) {
        priceDisplay.textContent = formatCurrency(priceSlider.value);
      }
      applyFilters();
    });
  }

  // Initial load
  applyFilters();
});
