import React from 'react'
import { MessageSquare, Search } from 'lucide-react'

const connectionRequests = [
  {
    id: 1,
    name: 'Ava Thompson',
    role: 'CTO',
    company: 'GreenPulse',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    name: 'Daniel Kim',
    role: 'VP Product',
    company: 'Northstar Labs',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    name: 'Priya Shah',
    role: 'Founder',
    company: 'Helio Works',
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
  },
]

const allMatches = [
  {
    id: 1,
    name: 'Leah Martin',
    title: 'Product Designer',
    company: 'Luma Studio',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
    tags: ['Product Design', 'Web3', 'SaaS'],
  },
  {
    id: 2,
    name: 'Marcus Reed',
    title: 'Growth Lead',
    company: 'Signal Forge',
    image:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80',
    tags: ['Marketing', 'AI', 'B2B'],
  },
  {
    id: 3,
    name: 'Sofia Alvarez',
    title: 'Head of Strategy',
    company: 'BrightPeak',
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80',
    tags: ['Operations', 'Fintech', 'Partnerships'],
  },
  {
    id: 4,
    name: 'Ethan Brooks',
    title: 'Frontend Engineer',
    company: 'Motive Grid',
    image:
      'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=1200&q=80',
    tags: ['Engineering', 'Design Systems', 'SaaS'],
  },
  {
    id: 5,
    name: 'Nina Patel',
    title: 'Community Builder',
    company: 'Founders Circle',
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
    tags: ['Community', 'Brand', 'Startup'],
  },
  {
    id: 6,
    name: 'Oliver Grant',
    title: 'Data Product Manager',
    company: 'Northbridge',
    image:
      'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=1200&q=80',
    tags: ['Analytics', 'AI', 'HealthTech'],
  },
]

function Matches() {
  return (
    <div className='min-h-screen bg-slate-50 px-4 py-8 text-slate-900 md:px-8 lg:px-10'>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <p className='text-sm font-medium uppercase tracking-[0.2em] text-slate-500'>Network</p>
            <h1 className='mt-2 text-3xl font-bold text-slate-900'>Matches</h1>
          </div>

          <button
            type='button'
            className='flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900'
            aria-label='Search matches'
          >
            <Search className='h-5 w-5' />
          </button>
        </div>

        <section className='mb-10'>
          <div className='mb-6 flex items-center justify-between'>
            <h2 className='text-2xl font-bold text-slate-900'>Connection Requests</h2>
            <button
              type='button'
              className='text-sm font-semibold text-slate-700 underline-offset-4 transition hover:text-slate-900 hover:underline'
            >
              View all
            </button>
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            {connectionRequests.map((person) => (
              <div
                key={person.id}
                className='rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center shadow-sm'
              >
                <div className='mb-4 flex justify-center'>
                  <img
                    src={person.image}
                    alt={person.name}
                    className='h-24 w-24 rounded-full object-cover ring-4 ring-white'
                  />
                </div>

                <h3 className='text-xl font-bold text-slate-900'>{person.name}</h3>
                <p className='mt-1 text-sm text-slate-600'>
                  {person.role} @ {person.company}
                </p>

                <div className='mt-5 flex items-center justify-center gap-3'>
                  <button
                    type='button'
                    className='rounded-full bg-slate-900 px-5 py-1.5 text-sm font-medium text-white transition hover:bg-slate-700'
                  >
                    Accept
                  </button>
                  <button
                    type='button'
                    className='rounded-full border border-slate-300 px-5 py-1.5 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-800'
                  >
                    Ignore
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className='mb-6 flex items-center justify-between'>
            <h2 className='text-2xl font-bold text-slate-900'>All Matches</h2>
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            {allMatches.map((person) => (
              <article
                key={person.id}
                className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'
              >
                <img
                  src={person.image}
                  alt={person.name}
                  className='h-48 w-full object-cover'
                />

                <div className='space-y-4 p-5'>
                  <div>
                    <h3 className='text-xl font-bold text-slate-900'>{person.name}</h3>
                    <p className='mt-1 text-sm text-slate-600'>
                      {person.title} @ {person.company}
                    </p>
                  </div>

                  <div className='flex flex-wrap gap-2'>
                    {person.tags.map((tag) => (
                      <span
                        key={tag}
                        className='rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    type='button'
                    className='flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700'
                  >
                    <MessageSquare className='h-4 w-4' />
                    Message
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className='mt-8 text-center'>
            <button type='button' className='text-sm font-semibold text-slate-700 underline-offset-4 hover:underline'>
              Load More Matches
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Matches
