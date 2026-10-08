// Shared spinner used as streaming fallback for async segments
export default function Loading() {
  return (
    <div className="flex justify-center items-center h-[50vh]">
      <div className="w-8 h-8 border-2 border-stone-200 border-t-amber-500 rounded-full animate-spin" />
    </div>
  );
}