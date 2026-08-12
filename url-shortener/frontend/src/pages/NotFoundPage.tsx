import { Link } from 'react-router-dom';
import { PageTransition } from '../components/animations/MotionComponents';
import { Zap } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-purple flex items-center justify-center shadow-neon mb-6">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-6xl font-bold gradient-text">404</h1>
        <p className="text-lg text-muted-foreground mt-2">Page not found</p>
        <Link to="/dashboard" className="mt-6 text-primary hover:underline">
          Back to Dashboard
        </Link>
      </div>
    </PageTransition>
  );
}
