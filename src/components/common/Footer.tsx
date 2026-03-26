import { Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">商务英语沉浸式学习方案</span>
          </div>
          <div className="text-sm text-muted-foreground text-center">
            <p>2026 商务英语沉浸式学习方案</p>
          </div>
        </div>
      </div>
    </footer>
  );
}