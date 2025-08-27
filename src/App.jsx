import React from 'react';
import ConversationHub from './components/ConversationHub';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">EchoMe Conversation Hub</h1>
      <ConversationHub />
    </div>
  );
}

export default App;
