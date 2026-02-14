import { useState } from 'react';
import ConversationHub from './components/ConversationHub';

function App() {
  const [pro, setPro] = useState(false);
  const [exportsUsed, setExportsUsed] = useState(0);

  const handlePro = () => {
    window.open('https://buy.stripe.com/00weVd16be835Cr57Q8Zq00', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-4">
            🎵 EchoMe Resonance
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            QRFT-powered audio-to-visual AI for creators
          </p>
          {!pro && exportsUsed >= 3 && (
            <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-xl">
              <p className="text-yellow-100">Free trial complete. Unlock Pro!</p>
            </div>
          )}
        </div>

        {/* Main App */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {exportsUsed < 3 || pro ? (
            <ConversationHub />
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/20">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8 text-3xl">
                  🔒
                </div>
                <h2 className="text-3xl font-bold text-white mb-6">Go Pro for Unlimited</h2>
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

        {/* Footer */}
        <div className="text-center mt-16 pt-12 border-t border-white/20">
          <p className="text-white/60">
            © 2026 Rod's AI Consulting LLC | Built with QRFT
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
