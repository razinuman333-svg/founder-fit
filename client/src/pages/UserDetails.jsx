import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, BriefcaseBusiness, Layers, MapPin, Zap } from 'lucide-react'
import PageMessage from '../componts/PageMessage'

function UserDetails() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`/api/user/${userId}`)
        setUser(response.data.data)
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load this profile.')
      } finally {
        setIsLoading(false)
      }
    }

    getUser()
  }, [userId])

  if (isLoading) return <PageMessage message="Loading profile..." />
  if (error) return <PageMessage message={error} action="Go back" onAction={() => navigate(-1)} />
  if (!user) return <PageMessage message="This profile could not be found." action="Go back" onAction={() => navigate(-1)} />

  const skills = Array.isArray(user.skills) ? user.skills : []
  const experiences = Array.isArray(user.experience) ? user.experience : []
  const initials = user.name?.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'FF'

  return (
    <main className="min-h-screen bg-[#f7f8fa] px-4 pb-24 pt-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <button type="button" onClick={() => navigate(-1)} className="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900">
          <ArrowLeft size={18} /> Back to 
        </button>

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            {user.avatar ? <img src={user.avatar} alt={user.name} className="h-28 w-28 shrink-0 rounded-2xl object-cover" /> : <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-2xl font-bold text-teal-700">{initials}</div>}
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Founder profile</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{user.name}</h1>
              <p className="mt-2 text-base font-medium text-indigo-950">{user.headline || 'Building what comes next.'}</p>
              {user.location && <p className="mt-3 flex items-center gap-2 text-sm text-gray-500"><MapPin size={16} className="text-teal-700" />{user.location}</p>}
            </div>
          </div>
          {user.bio && <p className="mt-7 max-w-3xl text-sm leading-7 text-gray-600">{user.bio}</p>}
          {skills.length > 0 && <div className="mt-6 flex flex-wrap gap-2">{skills.map((skill) => <span key={skill} className="rounded-full bg-teal-50 px-3.5 py-2 text-sm font-medium text-teal-800">{skill}</span>)}</div>}
        </section>

        <section className="mt-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-2.5"><BriefcaseBusiness size={20} className="text-teal-700" /><h2 className="text-lg font-bold text-gray-900">Founder Experience</h2></div>
          {experiences.length === 0 ? <p className="mt-7 rounded-xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-400">No experience added yet.</p> : <div className="mt-7 divide-y divide-slate-100">{experiences.map((experience, index) => <ExperienceItem key={`${experience.company}-${experience.role}-${index}`} experience={experience} index={index} />)}</div>}
        </section>
      </div>
    </main>
  )
}

function ExperienceItem({ experience, index }) {
  const Icon = index % 2 === 0 ? Zap : Layers
  const duration = experience.duration || experience.dates

  return (
    <article className="grid gap-4 py-6 first:pt-0 last:pb-0 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-start sm:gap-5">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Icon size={22} /></div>
      <div className="min-w-0">
        <h3 className="font-semibold text-gray-900">{experience.company || 'Independent venture'}</h3>
        {experience.role && <p className="mt-1 font-medium text-indigo-950">{experience.role}</p>}
        {experience.description && <p className="mt-2 text-sm leading-6 text-gray-600">{experience.description}</p>}
      </div>
      {(duration || experience.status) && <div className="text-left text-sm text-gray-400 sm:text-right"><p>{duration}</p>{experience.status && <p className="mt-1">{experience.status}</p>}</div>}
    </article>
  )
}



export default UserDetails
