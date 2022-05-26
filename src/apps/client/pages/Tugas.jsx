import React from 'react'
import { ChevronLeftIcon, LockClosedIcon } from '@heroicons/react/solid'
import { useHistory } from 'react-router-dom'

export default function Tugas() {

    const history = useHistory();

    const navigate = (route) => {
        history.push(route);
    }

    return (
        <div className='bg-custom-primary min-h-screen flex flex-col items-center py-4 md:py-8 lg:px-25%'>
            <div className='w-90% flex items-center '>
                <button onClick={() => navigate('/home')}>
                    <ChevronLeftIcon className='w-10 h-10 text-white bg-custom-secondary rounded-full' />
                </button>
                {/* <div className='w-auto bg-white py-1 px-2 rounded-full flex items-center justify-center'>
                    <img className='w-5 h-5 mr-1' src="/Coin.svg" alt="coin" />
                    <p className='font-custom-font text-base font-medium'>100</p>
                </div> */}
            </div>

            <div className='w-90% bg-white mt-16 p-4 rounded-lg'>
                <div className='flex -mt-11 justify-center mb-4'>
                    <h1 className='w-fit text-2xl text-center font-medium bg-custom-secondary py-2 px-2 text-white rounded-md border-4 border-solid border-white'>Tugas Minggu 1</h1>
                </div>
                <div className='flex bg-custom-orange p-3 items-center shadow-custom-shadow-yellow rounded-md mb-4'>
                    <div className='w-1/2 flex justify-center items-center'>
                        <h2 className='text-white font-semibold text-lg md:text-3xl'>Kategori</h2>
                    </div>
                    <div className='w-1/2 flex flex-wrap justify-center'>
                        <img className='max-w-full w-27% mx-2.5%' src="/ilustrasi_buku.svg" alt="buku" />
                        <img className='max-w-full w-27% mx-2.5%' src="/ilustrasi_headphone.svg" alt="headphone" />
                        <img className='max-w-full w-27% mx-2.5%' src="/ilustrasi_menulis.svg" alt="menulis" />
                    </div>
                </div>

                <div as='card-container' className='flex items-center flex-wrap md:flex-row'>
                    <button as='card' className='flex items-center justify-center w-48% p-4 mx-1% mb-4 bg-custom-secondary rounded-md shadow-click md:w-31% md:mx-1% lg:w-23% lg:mx-1%' onClick={() => navigate('/game1')}>
                        <h2 className='text-white font-custom-font-gum text-5xl'>1</h2>
                    </button>
                    <button as='card' className='flex items-center justify-center w-48% p-4 mx-1% mb-4 bg-custom-secondary rounded-md shadow-click md:w-31% md:mx-1% lg:w-23% lg:mx-1%' onClick={() => navigate('/game2')}>
                        <h2 className='text-white font-custom-font-gum text-5xl'>2</h2>
                    </button>
                    <button as='card' className='flex items-center justify-center w-48% p-4 mx-1% mb-4 bg-custom-secondary rounded-md shadow-click md:w-31% md:mx-1% lg:w-23% lg:mx-1%' onClick={() => navigate('/game3')}>
                        <h2 className='text-white font-custom-font-gum text-5xl'>3</h2>
                    </button>
                    <button as='card' className='flex items-center justify-center w-48% p-4 mx-1% mb-4 bg-custom-secondary rounded-md shadow-click md:w-31% md:mx-1% lg:w-23% lg:mx-1%' onClick={() => navigate('/game3')}>
                        <LockClosedIcon className='w-12 h-12 text-white' />
                    </button>
                    <button as='card' className='flex items-center justify-center w-48% p-4 mx-1% mb-4 bg-custom-secondary rounded-md shadow-click md:w-31% md:mx-1% lg:w-23% lg:mx-1%' onClick={() => navigate('/game3')}>
                        <LockClosedIcon className='w-12 h-12 text-white' />
                    </button>
                </div>
            </div>

            <div className='w-90% bg-white mt-16 p-4 rounded-lg'>
                <div className='flex -mt-11 justify-center mb-4'>
                    <h1 className='w-fit text-2xl text-center font-medium bg-custom-secondary py-2 px-2 text-white rounded-md border-4 border-solid border-white'>Tugas Minggu 2</h1>
                </div>
                <div className='flex bg-custom-orange p-3 items-center shadow-custom-shadow-yellow rounded-md mb-4'>
                    <div className='w-1/2 flex justify-center items-center'>
                        <h2 className='text-white font-semibold text-lg md:text-3xl'>Kategori</h2>
                    </div>
                    <div className='w-1/2 flex flex-wrap justify-center'>
                        {/* <img className='max-w-full w-27% mx-2.5%' src="/ilustrasi_buku.svg" alt="buku" /> */}
                        {/* <img className='max-w-full w-27% mx-2.5%' src="/ilustrasi_headphone.svg" alt="headphone" /> */}
                        <img className='max-w-full w-27% mx-2.5%' src="/ilustrasi_menulis.svg" alt="menulis" />
                    </div>
                </div>

                <div as='card-container' className='flex items-center flex-wrap md:flex-row'>
                    <button as='card' className='flex items-center justify-center w-48% p-4 mx-1% mb-4 bg-custom-secondary rounded-md shadow-click md:w-31% md:mx-1% lg:w-23% lg:mx-1%' onClick={() => navigate('/game3')}>
                        <LockClosedIcon className='w-12 h-12 text-white' />
                    </button>
                    <button as='card' className='flex items-center justify-center w-48% p-4 mx-1% mb-4 bg-custom-secondary rounded-md shadow-click md:w-31% md:mx-1% lg:w-23% lg:mx-1%' onClick={() => navigate('/game3')}>
                        <LockClosedIcon className='w-12 h-12 text-white' />
                    </button>
                    <button as='card' className='flex items-center justify-center w-48% p-4 mx-1% mb-4 bg-custom-secondary rounded-md shadow-click md:w-31% md:mx-1% lg:w-23% lg:mx-1%' onClick={() => navigate('/game3')}>
                        <LockClosedIcon className='w-12 h-12 text-white' />
                    </button>
                    <button as='card' className='flex items-center justify-center w-48% p-4 mx-1% mb-4 bg-custom-secondary rounded-md shadow-click md:w-31% md:mx-1% lg:w-23% lg:mx-1%' onClick={() => navigate('/game3')}>
                        <LockClosedIcon className='w-12 h-12 text-white' />
                    </button>
                    <button as='card' className='flex items-center justify-center w-48% p-4 mx-1% mb-4 bg-custom-secondary rounded-md shadow-click md:w-31% md:mx-1% lg:w-23% lg:mx-1%' onClick={() => navigate('/game3')}>
                        <LockClosedIcon className='w-12 h-12 text-white' />
                    </button>
                </div>
            </div>
        </div>
    )
}
