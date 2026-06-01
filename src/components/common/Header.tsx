import { type ReactNode } from 'react';

interface HeaderProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
}

export default function Header({ title, description, actions }: HeaderProps = {}) {
  return (
    <header className="w-full border-b bg-background">
      {title && (
        <div className="container mx-auto px-4 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{title}</h1>
              {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
            </div>
            {actions && <div>{actions}</div>}
          </div>
        </div>
      )}
    </header>
  );
}