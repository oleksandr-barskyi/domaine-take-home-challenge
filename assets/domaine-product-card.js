(() => {
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

  function updateSwatchState(swatches, activeSwatch) {
    swatches.forEach((swatch) => {
      const isActive = swatch === activeSwatch;

      swatch.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      swatch.style.border = `1px solid ${isActive ? '#0a4874' : 'transparent'}`;
    });
  }

  function initDomaineProductCard(card) {
    const primaryImage = card.querySelector('[data-domaine-primary-image]');
    const secondaryImage = card.querySelector('[data-domaine-secondary-image]');
    const saleBadge = card.querySelector('[data-domaine-sale-badge]');
    const price = card.querySelector('[data-domaine-price]');
    const comparePrice = card.querySelector('[data-domaine-compare-price]');
    const swatches = [...card.querySelectorAll('[data-domaine-swatch]')];

    swatches.forEach((swatch) => {
      swatch.addEventListener('click', () => {
        const primarySrc = swatch.dataset.primarySrc || '';
        const primarySrcset = swatch.dataset.primarySrcset || '';
        const secondarySrc = swatch.dataset.secondarySrc || '';
        const secondarySrcset = swatch.dataset.secondarySrcset || '';
        const isOnSale = swatch.dataset.onSale === 'true';
        const nextPrice = swatch.dataset.price || '';
        const nextComparePrice = swatch.dataset.comparePrice || '';

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
        updateSwatchState(swatches, swatch);
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
