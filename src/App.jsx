import { useState } from 'react';
import ConversationHub from './components/ConversationHub';
import EmotionalSync from './components/EmotionalSync';

function App() {
  const [pro, setPro] = useState(false);
  const [exportsUsed, setExportsUsed] = useState(0);

  const handlePro = () => {
    window.open('https://buy.stripe.com/00weVd16be835Cr57Q8Zq00', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 p-4 md:p-8 overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full blur-3xl" />
      </div>

      <div className="container relative mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 mb-6">
            <span className="w-3 h-3 rounded-full bg-cyan-300 animate-pulse" />
            <span className="text-cyan-200 text-sm tracking-widest uppercase">
              emotionalSync active
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent mb-4">
            EchoMe Resonance
          </h1>

          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Emotionally synchronized resonance architecture integrating QRFT-inspired coherence,
            contextual memory weighting, and adaptive interaction dynamics.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          <div className="xl:col-span-2">
            {exportsUsed < 3 || pro ? (
              <ConversationHub />
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[400px] bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/20">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8 text-3xl">
                    🔒
                  </div>

                  <h2 className="text-3xl font-bold text-white mb-6">
                    Go Pro for Unlimited
                  </h2>

                  <p className="text-xl text-white/80 mb-8 max-w-md">
                    Continue creating resonance magic with unlimited exports
                  </p>

                  <button
                    onClick={handlePro}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    🚀 Unlock Pro $9.99/mo
                  </button>

                  <p className="text-white/60 mt-4 text-sm">Cancel anytime</p>
                </div>
              </div>
            )}
          </div>

          <div>
            <EmotionalSync />
          </div>
        </div>

        <div className="text-center mt-16 pt-12 border-t border-white/10">
          <p className="text-white/50 tracking-wide">
            © 2026 Rod's AI Consulting LLC • EchoMe • QRFT • emotionalSync
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
