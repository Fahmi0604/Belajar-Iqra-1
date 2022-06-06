import React, { useEffect, useState } from 'react'
import { UserIcon } from '@heroicons/react/solid'
import { useHistory } from 'react-router-dom'
import UserService from '../../../services/user.service';
import AuthService from '../../../services/auth.service';

export default function Home() {

    const history = useHistory();
    const [currentUser, setCurrentUser] = useState()

    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            UserService.getUserById(user.uid).then(res => {
                console.log(res.data.data);
                setCurrentUser(res.data.data);
            }, (error => {
                console.log(error);
            }))
        }
    }, [])


    const navigate = (route) => {
        history.push(route);
    }

    return (
        <div className='bg-custom-primary min-h-screen flex flex-col items-center py-4 lg:px-25%'>
            <div className='w-full flex items-center justify-between px-2'>
                {/* <img src="/iqra_logo.svg" alt="logo" /> */}
                <button className='w-aut flex items-center justify-center' onClick={() => navigate('/profil')}>
                    <UserIcon className='w-8 h-8 bg-white p-1 text-gray-400 rounded border-2 border-solid border-gray-600' />
                    <p className='font-custom-font text-sm font-semibold bg-white px-2 rounded-r text-gray-600'>{currentUser && currentUser.nama}</p>
                </button>

                <div className='w-auto bg-white py-1 px-2 rounded-full flex items-center justify-center'>
                    <img className='w-5 h-5 mr-1' src="/Coin.svg" alt="coin" />
                    <p className='font-custom-font text-base font-medium'>{currentUser && currentUser.coin}</p>
                </div>

            </div>

            <img className='md:w-3/4 md:-mt-16' src="/ilustrasi.svg" alt="ilustrasi" />
            <h1 className='px-4 font-custom-font font-medium text-2xl text-center text-white -mt-11 md:-mt-14 lg:-mt-14'>Belajar Huruf Hijaiyah Sambil Bermain</h1>
            <p className='px-16 font-custom-font text-xs text-center text-white mt-1'>Belajar mengenal huruf hijaiyah dengan bermain game lebih menyenangkan </p>
            <button className='flex items-center justify-center mt-4 bg-white py-2 px-4 rounded-lg shadow-notclick hover:bg-custom-secondary hover:text-white hover:shadow-click' onClick={() => navigate('/tugas')}>
                {/* <PlayIcon className='h-6 w-6 mr-1' /> */}
                <p className='font-custom-font-gum font-medium text-lg'>Mulai</p>
            </button>
        </div>
    )
}

