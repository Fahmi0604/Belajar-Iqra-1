import React from 'react'
import { opacity } from 'tailwindcss/defaultTheme'

export default function Homepage() {
    return (
        <>
            <div className="flex items-center min-h-screen p-6 bg-custom-primary lg:px-25% bg-[image:url('/sky.png')] bg-cover bg-no-repeat bg-bottom">
                <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-gray-300 shadow-custom-shadow-gray rounded-lg">
                    <div className='w-full flex justify-center mt-4'>
                        <img className='w-24 h-24' src="/iqra_logo.svg" alt="foreground" />
                    </div>

                    <div className='w-full flex justify-center'>
                        <p className='text-custom-text text-xl mb-4'>Siapa yang akan Login ?</p>
                    </div>

                    <div className='flex p-4 justify-center mb-4'>
                        <button className='bg-white shadow-custom-shadow-gray border-4 border-gray-400 rounded-md p-4 mr-4'>
                            <img className='w-36 h-36' src="/login_siswa.svg" alt="gambar_user" />
                            <p className='flex justify-center text-white text-xl font-medium my-4'>Siswa</p>
                        </button>
                        <button className='bg-white shadow-custom-shadow-gray border-4 border-white rounded-md p-4 ml-4'>
                            <img className='w-36 h-36' src="/login_guru.svg" alt="gambar_user" />
                            <p className='flex justify-center text-white text-xl font-medium my-4'>Guru</p>
                        </button>
                    </div>

                </div>
            </div>
        </>
    )
}
