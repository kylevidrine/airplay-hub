import { Home, PlayCircle, Settings } from 'lucide-react';

interface BottomTabBarProps {
  activeTab: 'home' | 'review' | 'settings';
  onTabChange: (tab: 'home' | 'review' | 'settings') => void;
}

export const BottomTabBar = ({ activeTab, onTabChange }: BottomTabBarProps) => {
  const tabs = [
    { id: 'home' as const, icon: Home, label: 'Home' },
    { id: 'review' as const, icon: PlayCircle, label: 'Review' },
    { id: 'settings' as const, icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border/50 safe-bottom z-50">
      <div className="flex items-center justify-around h-20 px-2">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center justify-center gap-1 px-6 py-2 rounded-xl transition-all ${
              activeTab === id
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className={`w-6 h-6 transition-transform ${activeTab === id ? 'scale-110' : ''}`} />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
