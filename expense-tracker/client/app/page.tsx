export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">Step 1</p>
        <h1 className="mt-3 text-4xl font-bold text-white">Expense Tracker</h1>
        <p className="mt-4 text-lg text-slate-300">
          The project structure is now in place. The next step is to install the required dependencies and configure the app shell.
        </p>
      </div>
    </main>
  );
}
