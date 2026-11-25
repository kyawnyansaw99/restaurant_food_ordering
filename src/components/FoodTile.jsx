import { useState } from 'react';

const GRADIENTS = [
  'from-brand-100 to-brand-200',
  'from-amber-100 to-orange-200',
  'from-rose-100 to-orange-100',
  'from-lime-100 to-emerald-100',
  'from-yellow-100 to-amber-200',
];

/** Dish photo, falling back to an emoji on a warm gradient if there's no image or it fails to load. */
export default function FoodTile({ image, emoji, alt = '', seed = '', className = '', size = 'text-5xl' }) {
  const [failed, setFailed] = useState(false);
  const idx = [...seed].reduce((n, c) => n + c.charCodeAt(0), 0) % GRADIENTS.length;

  if (image && !failed) {
    return (
      <div className={`overflow-hidden bg-char-100 ${className}`}>
        <img
          src={image}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div className={`grid place-items-center bg-gradient-to-br ${GRADIENTS[idx]} ${className}`}>
      <span className={`${size} drop-shadow-sm`} aria-hidden>{emoji}</span>
    </div>
  );
}
