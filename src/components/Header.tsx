import { Bone, Activity } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl gradient-primary shadow-soft">
            <Bone className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground">OsteoVision</h1>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">AI</span>
          </div>
          <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="h-4 w-4 text-severity-normal" />
            <span>System Online</span>
          </div>
        </div>
      </div>
    </header>
  );
}
