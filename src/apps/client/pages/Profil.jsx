import React from 'react';
import { ChevronLeftIcon } from '@heroicons/react/solid'
import { useHistory } from 'react-router-dom'

export default function Profil() {

    const history = useHistory();

    const navigate = (route) => {
        history.push(route);
    }

    return (
        <div className='bg-custom-primary min-h-screen flex flex-col items-center pb-4 md:py-8 lg:px-25%'>
            <div className='w-full h-auto bg-custom-secondary flex flex-col items-center py-4 rounded-b-2xl shadow-click'>
                <div className='w-90% flex items-center '>
                    <button onClick={() => navigate('/home')}>
                        <ChevronLeftIcon className='w-10 h-10 text-white bg-custom-primary rounded-full' />
                    </button>
                    {/* <div className='w-auto bg-white py-1 px-2 rounded-full flex items-center justify-center'>
                    <img className='w-5 h-5 mr-1' src="/Coin.svg" alt="coin" />
                    <p className='font-custom-font text-base font-medium'>100</p>
                </div> */}
                </div>
                <img src="/profil.svg" alt="profil" />
                <h1 className='text-white font-custom-font font-medium text-xl mt-2'>User01</h1>

                <div className='w-auto bg-white py-1 px-2 rounded-full flex items-center justify-center mt-2'>
                    <img className='w-5 h-5 mr-1' src="/Coin.svg" alt="coin" />
                    <p className='font-custom-font text-base font-medium'>100</p>
                </div>
            </div>
            <div className='w-90% flex pt-4'>
                <button className='w-full py-2 font-custom-font font-medium text-white bg-custom-orange rounded-lg shadow-custom-shadow-yellow'>
                    Tukarkan Coin
                </button>
            </div>
        </div>
    );
}
