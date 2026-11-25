import { RESTAURANT } from '../data/menu';

/** Thai Baht: "฿1,250" for whole amounts, "฿1,250.50" when there are satang. */
export const money = (n) => {
  const rounded = Math.round(n * 100) / 100;
  const whole = Number.isInteger(rounded);
  return `฿${rounded.toLocaleString('en-US', { minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: 2 })}`;
};

/** Price of one unit of a menu item with the chosen options applied. */
export function unitPrice(item, selections = {}) {
  let total = item.price;
  for (const group of item.options) {
    const picked = selections[group.id];
    const ids = Array.isArray(picked) ? picked : picked ? [picked] : [];
    for (const id of ids) {
      const choice = group.choices.find((c) => c.id === id);
      if (choice) total += choice.price;
    }
  }
  return total;
}

/** Human-readable summary of chosen options, e.g. "Beef · Hot · Fried egg". */
export function describeSelections(item, selections = {}) {
  const parts = [];
  for (const group of item.options) {
    const picked = selections[group.id];
    const ids = Array.isArray(picked) ? picked : picked ? [picked] : [];
    for (const id of ids) {
      const choice = group.choices.find((c) => c.id === id);
      if (choice) parts.push(choice.name);
    }
  }
  return parts.join(' · ');
}

export function cartTotals(lines, fulfillment = 'delivery', promo = null) {
  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
  const discount = promo ? Math.min(subtotal, Math.round(subtotal * promo.percent)) : 0;
  const afterDiscount = subtotal - discount;
  const deliveryFee =
    fulfillment === 'delivery' && subtotal > 0 && afterDiscount < RESTAURANT.freeDeliveryOver
      ? RESTAURANT.deliveryFee
      : 0;
  // Thai menu prices are VAT-inclusive: nothing is added, we just show the VAT portion.
  const total = Math.round((afterDiscount + deliveryFee) * 100) / 100;
  const vatIncluded = total - total / (1 + RESTAURANT.vatRate);
  return { subtotal, discount, deliveryFee, vatIncluded, total };
}

export const PROMO_CODES = {
  WELCOME10: { code: 'WELCOME10', percent: 0.1, label: '10% off' },
  SPOON20: { code: 'SPOON20', percent: 0.2, label: '20% off' },
};
