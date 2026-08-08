import React from 'react'
import hero from '../assets/hero.jpg'

function Hero() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center max-w-6xl mx-auto px-6 py-12 md:py-16'>

      {/* div for title, description and button */}
      <div className='flex flex-col justify-center items-center md:items-start text-center md:text-left w-full order-2 md:order-1'>
        <h1 className='text-primary text-4xl sm:text-5xl lg:text-6xl font-bold font-heading leading-tight mb-4'>
          Find your perfect co-founder counterpart.
        </h1>
        <p className='text-gray-600 text-lg sm:text-xl lg:text-2xl leading-relaxed mb-6 max-w-xl'>
          The difference between a failed experiment and a billion-dollar exit often boils down to partnership alignment.
          We use deep psychometrics and vision mapping to connect you with the talent you've been missing.
        </p>
        <button className='bg-primary text-white px-4 py-1 sm:px-7 sm:py-2 rounded-full text-xl shadow-lg shadow-primary/30 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/40 hover:brightness-110 active:scale-95'>
          Start Matching
        </button>
      </div>

      {/* div for hero image */}
      <div className='flex justify-center md:justify-end items-center w-full order-1 md:order-2'>
        <img
          className='w-full max-w-[280px] sm:max-w-[340px] md:max-w-md lg:max-w-lg aspect-[4/5] object-cover rounded-2xl shadow-xl'
          src={hero}
          alt='Co-founder matching'
        />
      </div>

    </div>
  )
}

export default Hero
