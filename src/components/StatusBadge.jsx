import { ORDER_STATUSES } from '../data/menu';

const STYLES = {
  placed: 'bg-sky-100 text-sky-800',
  preparing: 'bg-amber-100 text-amber-800',
  ready: 'bg-violet-100 text-violet-800',
  on_the_way: 'bg-brand-100 text-brand-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-char-100 text-char-700',
};

export function statusLabel(status, fulfillment) {
  if (status === 'cancelled') return 'Cancelled';
  if (status === 'ready' && fulfillment === 'pickup') return 'Ready for pickup';
  if (status === 'delivered' && fulfillment === 'pickup') return 'Picked up';
  return ORDER_STATUSES.find((s) => s.id === status)?.label ?? status;
}

export default function StatusBadge({ status, fulfillment }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STYLES[status] ?? STYLES.placed}`}>
      {statusLabel(status, fulfillment)}
    </span>
  );
}
