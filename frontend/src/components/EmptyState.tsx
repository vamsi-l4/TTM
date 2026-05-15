const EmptyState = ({ message }: { message: string }) => (
  <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/80 p-10 text-center text-slate-400 shadow-glass">
    <p className="text-lg font-semibold text-slate-200">Nothing here yet</p>
    <p className="mt-2">{message}</p>
  </div>
)

export default EmptyState
