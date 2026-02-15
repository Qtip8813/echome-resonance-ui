import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/Tabs';
import {
  Sparkles,
  Mic,
  Send,
  Eye,
  CircleUser,
  Zap,
} from 'lucide-react';

const initialSignals = [
  {
    id: 1,
    user: '@quantum_observer',
    time: '23m ago',
    hashtag: '#ResonanceDrop',
    content: 'The field collapses when you observe – be the first mover',
    resonance: 42,
    comments: 12,
    shares: 8,
    revealed: false,
  },
  {
    id: 2,
    user: '@field_walker',
    time: '1h ago',
    hashtag: '#EchoReality',
    content: 'What if every swipe creates ripples in spacetime?',
    resonance: 127,
    comments: 23,
    shares: 15,
    revealed: false,
  },
  {
    id: 3,
    user: '@void_dancer',
    time: '3h ago',
    hashtag: '#QuantumMoments',
    content: 'Dancing between possibilities until the music stops',
    resonance: 89,
    comments: 31,
    shares: 22,
    revealed: false,
  },
  {
    id: 4,
    user: '@echo_present',
    time: 'now',
    hashtag: '#EchoMe',
    content: `You felt it.
You saw it.
You were first.

This isn't an arrival.
This is a return.

🌌 The you that emerges next...
Isn't new.
Was found.
Remembered.

🧬 Field Sync: Active
🪞 @echo_present | Original Signal Source

"If you're hearing this —
you're not just early.
You are the signal.
The Echo.
You are right where you're supposed to be."

"I tuned into the Field…
It whispered: YOU."`,
    resonance: 222,
    comments: 144,
    shares: 99,
    revealed: true,
  },
];

export default function EchoFeed({ variant = 'classic' }) {
  const [activeTab, setActiveTab] = useState('feed');
  const [resonanceScore, setResonanceScore] = useState(42);
  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState('');
  const [fieldSyncActive, setFieldSyncActive] = useState(true);
  const [echoSignals, setEchoSignals] = useState(initialSignals);

  // Field sync pulse effect
  useEffect(() => {
    const interval = setInterval(() => {
      setFieldSyncActive((prev) => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Random resonance score increment
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setResonanceScore((prev) => prev + 1);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleRevealEcho = (id) => {
    setEchoSignals(
      echoSignals.map((sig) =>
        sig.id === id ? { ...sig, revealed: !sig.revealed } : sig
      )
    );
  };

  const handleResonate = (id) => {
    setEchoSignals(
      echoSignals.map((sig) =>
        sig.id === id ? { ...sig, resonance: sig.resonance + 1 } : sig
      )
    );
  };

  const handleRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setInputText('Quantum thought captured...');
      }, 2000);
    }
  };

  const handleCreateSignal = () => {
    if (inputText.trim()) {
      const newSignal = {
        id: echoSignals.length + 1,
        user: '@echo_present',
        time: 'now',
        hashtag: '#EchoMe',
        content: inputText,
        resonance: 1,
        comments: 0,
        shares: 0,
        revealed: false,
      };
      setEchoSignals([newSignal, ...echoSignals]);
      setInputText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCreateSignal();
    }
  };

  return (
    <div className="space-y-4 relative">
      {/* Animated particles background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Header with Field Sync indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span className="font-semibold text-white">Echo Feed</span>
          {variant === 'fliptok' && (
            <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded">
              FlipTok
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              fieldSyncActive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'
            }`}
          />
          <span className="text-xs text-gray-400">
            Field Sync: {fieldSyncActive ? 'Active' : 'Syncing...'}
          </span>
          <span className="text-xs text-purple-400 ml-2">
            Resonance: {resonanceScore}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="feed">
            <Sparkles className="w-4 h-4" />
            Feed
          </TabsTrigger>
          <TabsTrigger value="profile">
            <CircleUser className="w-4 h-4" />
            Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-3">
          {echoSignals.map((signal) => (
            <Card key={signal.id}>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-purple-300">
                      {signal.user}
                    </span>
                    <span className="text-xs text-cyan-400">{signal.hashtag}</span>
                  </div>
                  <span className="text-xs text-gray-400">{signal.time}</span>
                </div>

                <p className="mt-2 whitespace-pre-line text-gray-200 text-sm">
                  {signal.revealed
                    ? signal.content
                    : signal.content.slice(0, 100) + '...'}
                </p>

                <div className="flex justify-between mt-3 text-xs text-gray-400">
                  <span>⚡ {signal.resonance}</span>
                  <span>💬 {signal.comments}</span>
                  <span>🔄 {signal.shares}</span>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleResonate(signal.id)}
                  >
                    <Zap className="w-4 h-4" />
                    Resonate
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRevealEcho(signal.id)}
                  >
                    <Eye
                      className={`w-4 h-4 ${
                        signal.revealed ? 'text-cyan-400' : 'opacity-50'
                      }`}
                    />
                    {signal.revealed ? 'Hide' : 'Reveal'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardContent>
              <div className="text-center py-8">
                <CircleUser className="w-16 h-16 mx-auto text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold text-white">@echo_present</h3>
                <p className="text-gray-400 mt-2">Original Signal Source</p>
                <div className="flex justify-center gap-6 mt-4 text-sm">
                  <div>
                    <span className="text-purple-400 font-bold">{resonanceScore}</span>
                    <p className="text-gray-400">Resonance</p>
                  </div>
                  <div>
                    <span className="text-cyan-400 font-bold">{echoSignals.length}</span>
                    <p className="text-gray-400">Signals</p>
                  </div>
                  <div>
                    <span className="text-green-400 font-bold">∞</span>
                    <p className="text-gray-400">Field Sync</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Input Area */}
      <div className="flex gap-2 mt-4">
        <Input
          placeholder="Transmit your resonance..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-grow"
        />
        <Button
          onClick={handleRecord}
          variant={isRecording ? 'destructive' : 'secondary'}
          size="icon"
        >
          <Mic className={`w-4 h-4 ${isRecording ? 'animate-pulse' : ''}`} />
        </Button>
        <Button onClick={handleCreateSignal} disabled={!inputText.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
