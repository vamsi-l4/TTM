const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-[2rem] border border-slate-800 bg-slate-900/85 p-6 shadow-glass">
    <h3 className="mb-4 text-xl font-semibold text-white">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
)

export default Card
