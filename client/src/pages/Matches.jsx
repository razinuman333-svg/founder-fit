import React from 'react'
import { MessageSquare, Search } from 'lucide-react'
import { useState } from 'react'
import axios from 'axios'
import { useAuth, useUser } from "@clerk/clerk-react";
import PageMessage from '../componts/PageMessage'
import { useEffect } from 'react';
import { toast } from 'react-toastify'


function Matches() {



  const [isLoading, setIsLoading] = useState(true)
  const [requestedUsers, setRequestedUsers] = useState([])
  const { getToken } = useAuth()
  const [connectedUsers, setConnectedUsers] = useState([])



  const getConnectionRequests = async () => {
    try {
      const { data } = await axios.get('/api/connection/get', { headers: { Authorization: `Bearer ${await getToken()}` } })
      if (data.success) {
        setRequestedUsers(data.connectionReq)
      }

    } catch (error) {
      console.log(error.message)
    }
    finally {
      setIsLoading(false)
    }
  }




  const getConnectedUsers = async () => {
    try {
      const { data } = await axios.get('/api/connection/getConnectedUsers', { headers: { Authorization: `Bearer ${await getToken()}` } })
      if (data.success) {
        setConnectedUsers(data.connectedUsers)
      }
    } catch (error) {
      console.log(error.message)
    }
    finally {
      setIsLoading(false)
      
    }
  }





  const handleaccept = async (id) => {

    try {

      await axios.put(`/api/connection/updatetoaccept/${id}`, {}, { headers: { Authorization: `Bearer ${await getToken()}` } })
      setRequestedUsers(prev => prev.filter(req => req.senderID._id !== id));
      toast.success("Request accepted!");

    }
    catch (error) {

      toast.error(error.message)

    }
  }


  useEffect(() => {
    getConnectionRequests()
    getConnectedUsers()
  }, [])


  if (isLoading) return <PageMessage message="Loading..." />



  return (
    <div className='min-h-screen bg-slate-50 px-4 py-8 text-slate-900 md:px-8 lg:px-10'>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <p className='text-sm font-medium uppercase tracking-[0.2em] text-slate-500'>Network</p>
            <h1 className='mt-2 text-3xl font-bold text-slate-900'>Matches</h1>
          </div>


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
            {requestedUsers.map((person) => (
              <div
                key={person.senderID._id}
                className='rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center shadow-sm'
              >
                <div className='mb-4 flex justify-center'>
                  <img
                    src={person.senderID.avatar}
                    alt={person.name}
                    className='h-24 w-24 rounded-full object-cover ring-4 ring-white'
                  />
                </div>

                <h3 className='text-xl font-bold text-slate-900'>{person.senderID.name}</h3>
                <p className='mt-1 text-sm text-slate-600'>
                  {person.senderID.headline}
                </p>

                <div className='mt-5 flex items-center justify-center gap-3'>
                  <button
                    onClick={() => handleaccept(person.senderID._id)}
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
            {connectedUsers.map((person) => (
              <article
                key={person._id}
                className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'
              >
                <img
                  src={person.avatar}
                  alt={person.name}
                  className='h-48 w-full object-cover'
                />

                <div className='space-y-4 p-5'>
                  <div>
                    <h3 className='text-xl font-bold text-slate-900'>{person.name}</h3>
                    <p className='mt-1 text-sm text-slate-600'>
                      {person.headline}
                    </p>
                  </div>

                  <div className='flex flex-wrap gap-2'>
                    {person.skills.map((tag) => (
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
