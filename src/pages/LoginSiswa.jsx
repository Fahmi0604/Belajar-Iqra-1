import React from 'react'

export default function LoginSiswa() {
    return (
        <>
            <div className="flex flex-col items-center min-h-screen p-6 bg-custom-primary lg:px-25% bg-[image:url('/sky.png')] bg-cover bg-no-repeat bg-bottom">
                <div className="flex-1 h-full max-w-4xl mx-auto mb-4 overflow-hidden bg-custom-primary shadow-click rounded-lg">
                    <div className='w-full flex justify-center'>
                        <p className='text-white text-3xl font-custom-font-gum font-medium mt-4'>TK A1</p>
                    </div>

                    <div className='flex flex-wrap p-4'>
                        {[...Array(19)].map((e, i) =>
                            <div key={i} className='flex w-47% p-2 bg-custom-secondary border-2 border-white rounded-md shadow-custom-shadow-gray text-custom-text text mb-3 mx-1.5% sm:w-31% sm:mx-1% sm:mb-4'>
                                <div className='w-1/4 flex justify-center items-center'>
                                    <img src={'/profil_laki.svg'} alt="profil" className='w-10 h-10 ' />
                                </div>
                                <div className='flex justify-center items-center w-3/4 text-white text-xl font-custom-font'>
                                    Nadiyah
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-custom-primary shadow-click rounded-lg">
                    <div className='w-full flex justify-center'>
                        <p className='text-white text-3xl font-custom-font-gum font-medium mt-4'>TK A2</p>
                    </div>

                    <div className='flex flex-wrap p-4'>
                        {[...Array(16)].map((e, i) =>
                            <div key={i} className='flex w-47% p-2 bg-custom-secondary border-2 border-white rounded-md shadow-custom-shadow-gray text-custom-text text mb-3 mx-1.5% sm:w-31% sm:mx-1% sm:mb-4'>
                                <div className='w-1/4 flex justify-center items-center'>
                                    <img src={'/profil_laki.svg'} alt="profil" className='w-10 h-10 ' />
                                </div>
                                <div className='flex justify-center items-center w-3/4 text-white text-xl font-custom-font'>
                                    Arsenio
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
