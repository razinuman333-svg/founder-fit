import React from 'react'
import { UserPlus } from 'lucide-react'

const people = [
  {
    id: 1,
    name: 'Aisha Rahman',
    role: 'Product Lead',
    company: 'Northstar Labs',
    location: 'San Francisco, CA',
    avatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 2,
    name: 'Daniel Kim',
    role: 'Growth Strategist',
    company: 'Signal Foundry',
    location: 'New York, NY',
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 3,
    name: 'Sofia Martinez',
    role: 'Engineering Manager',
    company: 'Pilot Works',
    location: 'Austin, TX',
    avatarUrl:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 4,
    name: 'Marcus Lee',
    role: 'Founder',
    company: 'Arc Studio',
    location: 'Seattle, WA',
    avatarUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
  },
]

function Network() {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-900">People You May Know</h2>
        <button
          type="button"
          className="text-sm font-semibold text-gray-600 hover:text-gray-900 cursor-pointer"
        >
          See More
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {people.map(({ id, name, role, company, location, avatarUrl }) => (
          <div
            key={id}
            className="bg-slate-50/80 border border-gray-200 rounded-xl p-4 flex flex-col items-center text-center"
          >
            <img
              src={avatarUrl}
              alt={name}
              className="w-16 h-16 rounded-full object-cover mb-3"
            />

            <h3 className="text-base font-bold text-gray-900">{name}</h3>

            <p className="text-sm font-medium text-gray-600 mt-0.5">
              {role} at {company}
            </p>

            <p className="text-xs text-gray-500 mt-1">Based in {location}</p>

            <button
              type="button"
              className="mt-4 flex items-center justify-center gap-2 px-4 py-1.5 text-sm font-semibold text-gray-800 bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition-colors shadow-sm"
            >
              <UserPlus size={16} />
              Connect
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Network
