import React from 'react'

function PageMessage({ message, action, onAction }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8fa] px-4 pb-24 text-center text-slate-900">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"><p className="text-sm text-gray-600">{message}</p>{action && <button type="button" onClick={onAction} className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">{action}</button>}</div>
    </main>
  )
}

export default PageMessage
