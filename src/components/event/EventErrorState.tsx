export const EventErrorState = () => {
  return (
    <div className="min-h-screen bg-golf-background flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-golf-secondary mb-2">Event Not Found</h2>
        <p className="text-golf-text">The event you're looking for doesn't exist or has been removed.</p>
      </div>
    </div>
  );
};