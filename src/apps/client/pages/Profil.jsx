import React, { useEffect, useState } from 'react';
import { ChevronLeftIcon, LogoutIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid'
import { useHistory } from 'react-router-dom'
import AuthService from '../../../services/auth.service';
import UserService from '../../../services/user.service';
import JawabanService from '../service/jawaban.service';
import TugasService from '../service/tugas.service';

export default function Profil() {

    const history = useHistory();
    const [currentUser, setCurrentUser] = useState()
    const [dataJawaban, setDataJawaban] = useState([]);
    const [dataSoal, setDataSoal] = useState([]);

    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            UserService.getUserById(user.uid).then(res => {
                console.log(res.data.data);
                setCurrentUser(res.data.data);
            }, (error => {
                console.log("Private page", error.response);
                // Invalid token
                if (error.response && error.response.status === 401) {
                    AuthService.logout();
                    navigate("/login");
                    window.location.reload();
                }
            }));

            // get semua jawaban
            JawabanService.getAllJawaban()
                .then(res => {
                    if (res.data.success === 1) {
                        const jawaban = res.data.data;
                        console.log(jawaban);
                        setDataJawaban(jawaban.slice((jawaban.length - 5), jawaban.length));
                    }
                }, (error) => {
                    console.log("Private page", error.response);
                    // Invalid token
                    if (error.response && error.response.status === 401) {
                        AuthService.logout();
                        navigate("/login");
                        window.location.reload();
                    }
                });

            getAllSoal();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAllSoal = () => {
        TugasService.getAllTugas()
            .then(res => {
                console.log(res.data.soal);
                setDataSoal(res.data.soal);
            }, (error) => {
                console.log("Private page", error.response);
                // Invalid token
                if (error.response && error.response.status === 401) {
                    AuthService.logout();
                    navigate("/login");
                    window.location.reload();
                }
            });
    }

    const navigate = (route) => {
        history.push(route);
    }

    const logOut = () => {
        AuthService.logout();
        history.push('/login');
    }

    return (
        <div className='bg-custom-primary min-h-screen flex flex-col items-center pb-4 md:py-8 lg:px-25%'>
            <div className='w-full h-auto bg-custom-secondary flex flex-col items-center py-4 rounded-b-2xl shadow-click'>
                <div className='w-90% flex items-center justify-between'>
                    <button onClick={() => navigate('/home')}>
                        <ChevronLeftIcon className='w-10 h-10 text-white bg-custom-primary rounded-full' />
                    </button>
                    <button className='p-2 bg-custom-primary rounded-full' onClick={() => logOut()}>
                        <LogoutIcon className='w-6 h-6 text-white' />
                    </button>
                    {/* <div className='w-auto bg-white py-1 px-2 rounded-full flex items-center justify-center'>
                    <img className='w-5 h-5 mr-1' src="/Coin.svg" alt="coin" />
                    <p className='font-custom-font text-base font-medium'>100</p>
                </div> */}
                </div>
                <img src={(currentUser && currentUser.jenis_kelamin === 'Laki-Laki') ? '/profil_laki.svg' : '/profil_perempuan.svg'} alt="profil" />
                <h1 className='text-white font-custom-font font-medium text-xl mt-2'>{currentUser && currentUser.nama}</h1>

                <div className='w-auto bg-white py-1 px-2 rounded-full flex items-center justify-center mt-2'>
                    <img className='w-5 h-5 mr-1' src="/Coin.svg" alt="coin" />
                    <p className='font-custom-font text-base font-medium'>{currentUser && currentUser.coin}</p>
                </div>
            </div>
            {/* <div className='w-90% flex py-4'>
                <button className='w-full py-2 font-custom-font font-medium text-white bg-custom-orange rounded-lg shadow-custom-shadow-yellow'>
                    Tukarkan Coin
                </button>
            </div> */}

            <div className='w-90% flex justify-center py-4'>
                <h1 className='bg-custom-orange text-white text-xl md:text-2xl font-custom-font font-medium p-2 rounded'>Riwayat Pengerjaan</h1>
            </div>

            <div className='w-90% flex flex-wrap pb-4'>
                {dataJawaban.map((e, i) => (
                    <div key={i} className='w-full py-4 px-8 mb-4 flex justify-between bg-white shadow-custom-shadow-gray rounded-md'>
                        <div className='w-3/4 flex items-center' >
                            <h1 className='p-1 text-xl bg-custom-secondary text-white flex w-fit rounded'>{e.nama_tugas}</h1>
                            <p className='p-1 ml-2 bg-custom-orange text-white rounded'>
                                soal {dataSoal.filter(f => f.id_tugas === e.id_tugas).findIndex(fi => fi.id_soal === e.id_soal) + 1}
                            </p>
                        </div>
                        <div className='w-1/4 flex items-center justify-end'>
                            {e.nilai ? <CheckCircleIcon className='w-24 h-24 sm:w-10 sm:h-10 text-custom-green-primary' />
                                : <XCircleIcon className='w-24 h-24 sm:w-10 sm:h-10 text-red-500' />
                            }
                        </div>
                    </div>
                )).reverse()}
            </div>

        </div>
    );
}
