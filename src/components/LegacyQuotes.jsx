import { useState, useEffect } from 'react';

const quotes = [
  {
    author: 'R.L.A. Sr.',
    text: "Life's nothing but a game son and it's all how you play to get the life you want.",
  },
  {
    author: 'R.L.A. Jr.',
    text: 'Your perception of your perspective is an illusion of your reality.',
  },
];

export default function LegacyQuotes() {
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % quotes.length);
        setIsTransitioning(false);
      }, 500);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`
        p-6 text-center rounded-xl
        bg-gradient-to-r from-gray-900/80 via-purple-900/30 to-gray-900/80
        border border-white/10 backdrop-blur-sm
        shadow-lg shadow-purple-500/10
        transition-opacity duration-500
        ${isTransitioning ? 'opacity-0' : 'opacity-100'}
      `}
    >
      <p className="text-gray-300 italic text-lg leading-relaxed">
        "{quotes[index].text}"
      </p>
      <p className="text-purple-400 font-semibold mt-4">
        — {quotes[index].author}
      </p>
    </div>
  );
}
