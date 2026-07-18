(() => {

  let addToCartButton = document.querySelector('#add-to-cart');

  addToCartButton.variantId = addToCartButton.dataset.variantId;

  addToCartButton.addEventListener('click', () => {
    console.log('addToCartButton = ', addToCartButton.variantId);

    if (!addToCartButton.variantId) return;

    let formData = {
      'items': [{
        'id': addToCartButton.variantId,
        'quantity': 1
      }]
    };

    fetch(window.Shopify.routes.root + 'cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
        .then(response => {
          return response.json();
        })
        .catch((error) => {
          console.error('Error:', error);
        });

  });

  function setImage(image, src, srcset, alt) {
    if (!image) return;

    if (!src) {
      image.hidden = true;
      image.removeAttribute('src');
      image.removeAttribute('srcset');
      return;
    }

    image.hidden = false;
    image.src = src;

    if (srcset) {
      image.srcset = srcset;
    } else {
      image.removeAttribute('srcset');
    }

    if (alt) {
      image.alt = alt;
    }
  }

  function toggleHidden(element, shouldHide) {
    if (!element) return;
    element.hidden = shouldHide;
  }

  function getCssVariable(element, name, fallback) {
    const value = window.getComputedStyle(element).getPropertyValue(name).trim();
    return value || fallback;
  }

  function updateSwatchState(swatches, activeSwatch, activeColor) {
    swatches.forEach((swatch) => {
      const isActive = swatch === activeSwatch;
      const swatchRing = swatch.querySelector('[data-domaine-swatch-ring]');

      swatch.setAttribute('aria-pressed', isActive ? 'true' : 'false');

      if (swatchRing) {
        swatchRing.style.borderColor = isActive ? activeColor : 'transparent';
      }
    });
  }

  function updateVariantOptionState(variantOptions, activeVariantId, activeColorValue) {
    variantOptions.forEach((option) => {
      const isActive = activeVariantId
          ? option.dataset.variantId === activeVariantId
          : !!activeColorValue && option.dataset.colorValue === activeColorValue;

      option.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function initDomaineProductCard(card) {
    const primaryImage = card.querySelector('[data-domaine-primary-image]');
    const secondaryImage = card.querySelector('[data-domaine-secondary-image]');
    const mediaToggle = card.querySelector('[data-domaine-media-toggle]');
    const saleBadge = card.querySelector('[data-domaine-sale-badge]');
    const price = card.querySelector('[data-domaine-price]');
    const comparePrice = card.querySelector('[data-domaine-compare-price]');
    const variantIdInput = card.querySelector('[data-domaine-variant-id-input]');
    const addToCartButton = card.querySelector('[data-domaine-add-to-cart]');
    const addToCartLabel = card.querySelector('[data-domaine-add-to-cart-label]');
    const buyNowButton = card.querySelector('[data-domaine-buy-now]');
    const swatches = [...card.querySelectorAll('[data-domaine-swatch]')];
    const productContext = card.parentElement || card;
    const variantOptions = [...productContext.querySelectorAll('[data-domaine-variant-option]')];

    function setImageView(view) {
      const hasSecondary = card.dataset.hasSecondary === 'true';
      const nextView = hasSecondary && view === 'secondary' ? 'secondary' : 'primary';

      card.dataset.imageView = nextView;

      if (mediaToggle) {
        mediaToggle.disabled = !hasSecondary;
        mediaToggle.setAttribute('aria-pressed', nextView === 'secondary' ? 'true' : 'false');
        mediaToggle.setAttribute(
            'aria-label',
            nextView === 'secondary' ? 'Show primary product image' : 'Show alternate product image'
        );
      }
    }

    if (mediaToggle) {
      mediaToggle.addEventListener('click', () => {
        if (mediaToggle.disabled) return;

        setImageView(card.dataset.imageView === 'secondary' ? 'primary' : 'secondary');
      });
    }

    setImageView('primary');

    function selectSwatch(swatch, activeVariantIdOverride, activeAvailabilityOverride) {
      if (!swatch) return;

      const primarySrc = swatch.dataset.primarySrc || '';
      const primarySrcset = swatch.dataset.primarySrcset || '';
      const secondarySrc = swatch.dataset.secondarySrc || '';
      const secondarySrcset = swatch.dataset.secondarySrcset || '';
      const isOnSale = swatch.dataset.onSale === 'true';
      const nextPrice = swatch.dataset.price || '';
      const nextComparePrice = swatch.dataset.comparePrice || '';
      const nextVariantId = activeVariantIdOverride || swatch.dataset.variantId || '';
      const nextColorValue = swatch.dataset.colorValue || '';
      const isAvailable =
          typeof activeAvailabilityOverride === 'boolean'
              ? activeAvailabilityOverride
              : swatch.dataset.available === 'true';


      addToCartButton.variantId = nextVariantId;

      // console.log(addToCartButton.variantId);

      setImage(
          primaryImage,
          primarySrc,
          primarySrcset,
          swatch.dataset.primaryAlt || swatch.dataset.imageAlt || ''
      );

      setImage(
          secondaryImage,
          secondarySrc,
          secondarySrcset,
          swatch.dataset.secondaryAlt || swatch.dataset.imageAlt || ''
      );

      card.dataset.hasSecondary = secondarySrc ? 'true' : 'false';
      setImageView('primary');

      if (price && nextPrice) {
        price.textContent = nextPrice;
        price.classList.toggle('text-[#ff0000]', isOnSale);
        price.classList.toggle('text-[#111111]', !isOnSale);
      }

      if (comparePrice) {
        comparePrice.textContent = nextComparePrice;
        toggleHidden(comparePrice, !isOnSale || !nextComparePrice);
      }

      toggleHidden(saleBadge, !isOnSale);

      if (variantIdInput && nextVariantId) {
        variantIdInput.value = nextVariantId;
      }

      [addToCartButton, buyNowButton].forEach((button) => {
        if (!button) return;
        button.disabled = !nextVariantId || !isAvailable;
      });

      if (addToCartLabel) {
        addToCartLabel.textContent = isAvailable ? 'Add to cart' : 'Sold out';
      }

      updateSwatchState(swatches, swatch, getCssVariable(card, '--domaine-card-active-color', '#0a4874'));
      updateVariantOptionState(variantOptions, nextVariantId, nextColorValue);
    }

    swatches.forEach((swatch) => {
      swatch.addEventListener('click', () => {
        selectSwatch(swatch);
      });
    });

    variantOptions.forEach((option) => {
      option.addEventListener('click', () => {
        const matchingSwatch =
            swatches.find((swatch) => swatch.dataset.variantId === option.dataset.variantId) ||
            swatches.find((swatch) => swatch.dataset.colorValue === option.dataset.colorValue);

        selectSwatch(matchingSwatch, option.dataset.variantId || '', option.dataset.available === 'true');
      });
    });
  }

  function initAllCards() {
    document
        .querySelectorAll('[data-domaine-product-card]')
        .forEach(initDomaineProductCard);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllCards);
  } else {
    initAllCards();
  }
})();
