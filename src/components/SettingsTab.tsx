import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SettingsTabProps {
  onLogout: () => void;
}

export const SettingsTab = ({ onLogout }: SettingsTabProps) => {
  return (
    <div className="flex flex-col h-full px-6 pt-6 pb-24 overflow-y-auto">
      <h2 className="text-2xl font-bold text-foreground mb-6">Settings</h2>
      
      <div className="space-y-4">
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-foreground mb-2">About</h3>
          <p className="text-sm text-muted-foreground">
            Robo South LA Video Review System
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Version 1.0.0
          </p>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-foreground mb-4">Account</h3>
          <Button
            onClick={onLogout}
            variant="destructive"
            className="w-full rounded-full"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </div>
    </div>
  );
};
