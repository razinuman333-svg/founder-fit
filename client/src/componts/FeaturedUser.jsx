import { useEffect, useState } from "react"
import axios from 'axios';


function FeaturedUser() {

const [featuredUsers,setFeaturedUsers] =  useState([])
const [isLoading,setIsLoading] = useState(true)


const getAllUsers = async() => {

  const values = await axios.get('/api/user')
  setFeaturedUsers(values.data.data)
  setIsLoading(false)
}

useEffect(() => {
    getAllUsers()
},[])

if(isLoading) return <p>Loading users...</p>;


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
          {featuredUsers.slice(0, 3).map((user) => (
            <article
              key={user.name}
              className='relative h-[420px] overflow-hidden rounded-3xl bg-gray-900 shadow-lg'
            >
              <img
                className='absolute inset-0 h-full w-full object-cover'
                src={user.avatar}
                alt={`${user.name}`}
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent' />
              <div className='absolute inset-x-0 bottom-0 p-5'>
                <h2 className='text-xl font-bold text-white'>
                  {user.name}
                </h2>
                <div className='mt-3 flex flex-wrap gap-2'>
                  {user.skills.map((tag) => (
                    <span
                      key={tag}
                      className='rounded-full bg-slate-700/60 px-2.5 py-1 text-xs font-medium text-teal-300'
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className='mt-3 line-clamp-3 text-sm leading-relaxed text-gray-200'>
                  {user.headline}
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
