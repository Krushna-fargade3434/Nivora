import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

const OfflinePage = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8 max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/20 p-6">
            <WifiOff className="h-16 w-16 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">No Internet Connection</h1>
          <p className="text-muted-foreground">
            It looks like you're offline. Some features may not be available until you're back online.
          </p>
        </div>

        <div className="space-y-4">
          <Button onClick={handleRefresh} className="w-full">
            Try Again
          </Button>
          
          <div className="text-sm text-muted-foreground">
            <p>While offline, you can still:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>View previously loaded content</li>
              <li>Browse cached pages</li>
              <li>Access saved notes (if previously loaded)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflinePage;
