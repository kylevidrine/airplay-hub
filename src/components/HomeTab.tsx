interface HomeTabProps {
  videosRemaining: number;
  onStartReview: () => void;
}

export const HomeTab = ({ videosRemaining, onStartReview }: HomeTabProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 pb-24">
      <div className="glass rounded-3xl p-8 max-w-md w-full text-center space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Robo South LA</h1>
        <p className="text-muted-foreground">Video Review System</p>
        
        <div className="py-8">
          <div className="text-6xl font-bold text-primary mb-2">{videosRemaining}</div>
          <div className="text-sm text-muted-foreground">Videos to Review</div>
        </div>

        <button
          onClick={onStartReview}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-4 font-semibold text-lg transition-all active:scale-95"
        >
          Start Reviewing
        </button>
      </div>
    </div>
  );
};
