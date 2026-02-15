import { createContext, useContext, useState } from 'react';
import clsx from 'clsx';

const TabsContext = createContext();

export function Tabs({ children, value, onValueChange, defaultValue, className }) {
  const [activeTab, setActiveTab] = useState(value || defaultValue);

  const handleChange = (newValue) => {
    setActiveTab(newValue);
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ activeTab: value ?? activeTab, setActiveTab: handleChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }) {
  return (
    <div
      className={clsx(
        'inline-flex items-center gap-1 rounded-lg bg-gray-800/50 p-1',
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ children, value, className }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      className={clsx(
        'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
        isActive
          ? 'bg-purple-600 text-white shadow-sm'
          : 'text-gray-400 hover:text-white hover:bg-white/10',
        className
      )}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ children, value, className }) {
  const { activeTab } = useContext(TabsContext);

  if (activeTab !== value) return null;

  return <div className={className}>{children}</div>;
}
