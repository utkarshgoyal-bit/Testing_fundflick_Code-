import { Button } from '@/components/ui/button';

function Actions() {
  return (
    <div className="mt-6 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          variant="default"
          className="group relative overflow-hidden rounded-lg border-2 border-primary/20 bg-primary px-4 py-3 transition-all hover:border-primary hover:shadow-lg"
          onClick={() => console.log('Company Notice')}
        >
          <span className="relative z-10 flex items-center justify-center text-sm font-medium">
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Request Company Notice
          </span>
        </Button>

        <Button
          variant="outline"
          className="group relative overflow-hidden rounded-lg border-2 border-primary/20 bg-background px-4 py-3 transition-all hover:border-primary hover:shadow-lg"
          onClick={() => console.log('Legal Notice')}
        >
          <span className="relative z-10 flex items-center justify-center text-sm font-medium">
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
              />
            </svg>
            Request Legal Notice
          </span>
        </Button>

        <Button
          variant="default"
          className="group relative overflow-hidden rounded-lg border-2 border-primary/20 bg-primary px-4 py-3 transition-all hover:border-primary hover:shadow-lg"
          onClick={() => console.log('Foreclose')}
        >
          <span className="relative z-10 flex items-center justify-center text-sm font-medium">
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
              />
            </svg>
            Request Foreclose
          </span>
        </Button>
      </div>
    </div>
  );
}

export default Actions;
