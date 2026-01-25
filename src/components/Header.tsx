import { Bone, Activity, Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b glass sticky top-0 z-50 animate-fade-in-up">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="relative p-2.5 rounded-xl gradient-primary shadow-soft hover-glow transition-all duration-300">
            <Bone className="h-6 w-6 text-primary-foreground" />
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-severity-normal animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground tracking-tight">OsteoVision</h1>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              AI
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground glass-subtle px-4 py-2 rounded-full">
            <Activity className="h-4 w-4 text-severity-normal animate-pulse" />
            <span className="font-medium">System Online</span>
          </div>
        </div>
      </div>
    </header>
  );
}
