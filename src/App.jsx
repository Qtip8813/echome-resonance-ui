import { useState } from 'react';
import ConversationHub from './components/ConversationHub';
import EchoFeed from './components/EchoFeed';
import LegacyQuotes from './components/LegacyQuotes';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/Tabs';
import { Sparkles, MessageSquare, Radio } from 'lucide-react';

function App() {
  const [pro, setPro] = useState(false);
  const [exportsUsed, setExportsUsed] = useState(0);
  const [activeView, setActiveView] = useState('hub');

  const handlePro = () => {
    window.open('https://buy.stripe.com/00weVd16be835Cr57Q8Zq00', '_blank');
  };

  const handleExport = () => {
    setExportsUsed((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
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

        {/* Legacy Quotes */}
        <div className="mb-8">
          <LegacyQuotes />
        </div>

        {/* Main Navigation */}
        <Tabs value={activeView} onValueChange={setActiveView} className="mb-8">
          <TabsList className="w-full justify-center">
            <TabsTrigger value="hub">
              <MessageSquare className="w-4 h-4" />
              Conversation Hub
            </TabsTrigger>
            <TabsTrigger value="feed">
              <Radio className="w-4 h-4" />
              Echo Feed
            </TabsTrigger>
            <TabsTrigger value="fliptok">
              <Sparkles className="w-4 h-4" />
              FlipTok
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hub" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {exportsUsed < 3 || pro ? (
                <ConversationHub onExport={handleExport} />
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
          </TabsContent>

          <TabsContent value="feed" className="mt-6">
            <div className="max-w-2xl mx-auto">
              <EchoFeed variant="classic" />
            </div>
          </TabsContent>

          <TabsContent value="fliptok" className="mt-6">
            <div className="max-w-2xl mx-auto">
              <EchoFeed variant="fliptok" />
            </div>
          </TabsContent>
        </Tabs>

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
