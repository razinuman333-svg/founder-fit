const featuredUsers = [
  {
    name: 'Sarah Chen',
    role: 'Technical Lead',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80',
    tags: ['Product', 'B2B SaaS'],
    description: 'Building thoughtful products and looking for a mission-driven founder to shape the next chapter.',
  },
  {
    name: 'Marcus Cole',
    role: 'Growth Strategist',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80',
    tags: ['Growth', 'Fintech'],
    description: 'Turning early traction into repeatable growth with a focus on customer insight and clear execution.',
  },
  {
    name: 'Priya Nair',
    role: 'Creative Founder',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=900&q=80',
    tags: ['Design', 'Climate'],
    description: 'Designing human-centered solutions for a more sustainable future alongside a hands-on operator.',
  },
]

function FeaturedUser() {
  return (
    <section className='bg-gray-50 px-6 py-16 md:py-20'>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-10 text-left'>
          <p className='mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-400'>
            The experience
          </p>
          <h1 className='font-heading text-3xl font-bold leading-tight text-primary sm:text-4xl'>
            Intuitive Connection
          </h1>
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {featuredUsers.map((user) => (
            <article
              key={user.name}
              className='relative h-[420px] overflow-hidden rounded-3xl bg-gray-900 shadow-lg'
            >
              <img
                className='absolute inset-0 h-full w-full object-cover'
                src={user.image}
                alt={`${user.name}, ${user.role}`}
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent' />
              <div className='absolute inset-x-0 bottom-0 p-5'>
                <h2 className='text-xl font-bold text-white'>
                  {user.name}, {user.role}
                </h2>
                <div className='mt-3 flex flex-wrap gap-2'>
                  {user.tags.map((tag) => (
                    <span
                      key={tag}
                      className='rounded-full bg-slate-700/60 px-2.5 py-1 text-xs font-medium text-teal-300'
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className='mt-3 line-clamp-3 text-sm leading-relaxed text-gray-200'>
                  {user.description}
                </p>
                <button className='mt-3 w-full rounded-xl bg-blue-600 py-2.5 font-medium text-white transition-colors hover:bg-blue-700'>
                  Connect
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedUser
