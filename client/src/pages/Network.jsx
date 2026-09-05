import React from 'react'
import { UserPlus } from 'lucide-react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import PageMessage from '../componts/PageMessage'

function Network() {

  const [people, setPeople] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()




  const getAllUsers = async () => {

    try {
      const { data } = await axios.get('/api/user')
      setPeople(data.data)

    } catch (error) {
      console.log(error.message)
    } finally {
      setIsLoading(false)
    }
  }



  useEffect(() => {
    getAllUsers()
  }, [])

  if (isLoading) return <PageMessage message="Loading..." />


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
        {people.map((person) => {
          const { _id, id, name, headline, location, avatar } = person
          const userId = _id || id

          return (
            <div
              key={userId || name}
              onClick={() => { userId && navigate(`/user/${userId}`); scrollTo(0, 0); }}
              onKeyDown={(event) => event.key === 'Enter' && userId && navigate(`/user/${userId}`)}
              role={userId ? 'button' : undefined}
              tabIndex={userId ? 0 : undefined}
              className="bg-slate-50/80 border border-gray-200 rounded-xl p-4 flex flex-col items-center text-center"
            >
              <img
                src={avatar}
                alt={name}
                className="w-16 h-16 rounded-full object-cover mb-3"
              />

              <h3 className="text-base font-bold text-gray-900">{name}</h3>

              <p className="text-sm font-medium text-gray-600 mt-0.5">
                {headline}
              </p>

              <p className="text-xs text-gray-500 mt-1">Based in {location}</p>

              <button
                type="button"
                onClick={(event) => event.stopPropagation()}
                className="mt-4 flex items-center justify-center gap-2 px-4 py-1.5 text-sm font-semibold text-gray-800 bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition-colors shadow-sm"
              >
                <UserPlus size={16} />
                Connect
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Network
