import { Bone, Search, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/30">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-full gradient-primary shadow-soft">
            <Bone className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl text-foreground tracking-tight">
            OsteoVision
          </span>
        </div>
        
        {/* Search Bar - Pinterest style */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search scans, conditions..."
              className="w-full h-11 pl-11 pr-4 rounded-full bg-secondary/50 border-none text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary">
            <Bell className="h-5 w-5 text-foreground" />
          </Button>
          <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-sm shadow-soft">
            U
          </div>
        </div>
      </div>
    </header>
  );
}
