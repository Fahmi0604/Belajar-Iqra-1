import React, { useEffect, useState } from 'react';
import { ChevronLeftIcon, LogoutIcon, CheckCircleIcon, XCircleIcon, PencilIcon } from '@heroicons/react/solid'
import { useHistory } from 'react-router-dom'
import AuthService from '../../../services/auth.service';
import UserService from '../../../services/user.service';
import JawabanService from '../service/jawaban.service';
import TugasService from '../service/tugas.service';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@windmill/react-ui";
import toast, { Toaster } from 'react-hot-toast';

export default function Profil() {

    const history = useHistory();
    const [currentUser, setCurrentUser] = useState()
    const [dataJawaban, setDataJawaban] = useState([]);
    const [dataSoal, setDataSoal] = useState([]);
    const [fotoProfil, setFotoProfil] = useState([]);
    const [modalEditProfil, setModalEditProfil] = useState(false);

    function openModalEditProfil() {
        setModalEditProfil(true);
    }

    function closeModalEditProfil() {
        setModalEditProfil(false);
    }

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
                        const jawabanByid = jawaban.filter(f => f.id_user === user.uid);
                        setDataJawaban(jawabanByid.slice((jawabanByid.length - 5), jawabanByid.length));
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
                // console.log(res.data.soal);
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

    const getCurrentUser = () => {
        const user = AuthService.getCurrentUser();

        if (user) {
            UserService.getUserById(user.uid).then(res => {
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
        }
    }

    const generateFotoProfil = () => {
        if (currentUser) {
            const data = currentUser.image && JSON.parse(currentUser.image);
            setFotoProfil(data);
        }
    }

    const editProfil = (changed) => {
        let arrayTemp = [...fotoProfil];

        arrayTemp.forEach((e, i) => {
            if (e.nama === changed) {
                e.use = true;
            } else {
                e.use = false;
            }
        });

        const user = AuthService.getCurrentUser();

        if (user) {
            UserService.updateFotoProfil({ image: JSON.stringify(arrayTemp), id_user: user.uid })
                .then(res => {
                    getCurrentUser();
                    toast.success('Berhasil mengganti foto profil');
                    closeModalEditProfil();
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

    }

    const generateListImage = () => {
        let arrayTemp = []

        fotoProfil.forEach((e, i) => {
            if (e.unlock === true && e.use === true) {
                arrayTemp.push(
                    <button
                        key={i}
                        className='w-47% mx-1.5% mb-8 flex flex-col justify-between items-center bg-custom-secondary shadow-click rounded-md'
                        onClick={() => toast.success('Foto sudah terpasang sebelumnya !!!')}
                    >
                        <img className='my-4' src={`/${e.nama}.svg`} alt="profil" />
                    </button>)
            } else if (e.unlock === true && e.use === false) {
                arrayTemp.push(
                    <button
                        key={i}
                        className='w-47% mx-1.5% mb-8 flex flex-col justify-between items-center bg-custom-yellow shadow-custom-shadow-yellow rounded-md'
                        onClick={() => editProfil(e.nama)}
                    >
                        <img className='my-4' src={`/${e.nama}.svg`} alt="profil" />
                    </button>)
            } else if (e.unlock === false) {
                arrayTemp.push(
                    <button
                        key={i}
                        className='w-47% mx-1.5% mb-8 flex flex-col justify-between items-center bg-gray-300 shadow-custom-shadow-gray rounded-md'
                        onClick={() => toast.error('Anda belum membuka profil ini !!!')}
                    >
                        <img className='my-4' src={`/${e.nama}.svg`} alt="profil" />
                    </button>)
            }
        });

        return arrayTemp;
    }

    useEffect(() => {
        generateFotoProfil()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser])

    const navigate = (route) => {
        history.push(route);
    }

    const logOut = () => {
        AuthService.logout();
        history.push('/splash');
    }

    return (
        <>
            <Toaster />
            <div className='bg-custom-primary min-h-screen flex flex-col items-center pb-4 md:py-8 lg:px-25%'>
                <div className='w-full h-auto bg-custom-secondary flex flex-col items-center py-4 rounded-b-2xl shadow-click'>
                    <div className='w-90% flex items-center justify-between'>
                        <button onClick={() => navigate('/home')}>
                            <ChevronLeftIcon className='w-10 h-10 text-white bg-custom-primary rounded-full' />
                        </button>
                        <div>
                            <button className='p-2 bg-custom-primary rounded-full mr-2' onClick={() => openModalEditProfil()}>
                                <PencilIcon className='w-6 h-6 text-white' />
                            </button>
                            <button className='p-2 bg-custom-primary rounded-full' onClick={() => logOut()}>
                                <LogoutIcon className='w-6 h-6 text-white' />
                            </button>
                        </div>

                        {/* <div className='w-auto bg-white py-1 px-2 rounded-full flex items-center justify-center'>
                    <img className='w-5 h-5 mr-1' src="/Coin.svg" alt="coin" />
                    <p className='font-custom-font text-base font-medium'>100</p>
                </div> */}
                    </div>

                    {/* <img src={(currentUser && currentUser.jenis_kelamin === 'Laki-Laki') ? '/profil_laki.svg' : '/profil_perempuan.svg'} alt="profil" /> */}
                    <img src={fotoProfil.filter(f => f.unlock === true && f.use === true).map(e => ('/' + e.nama + '.svg'))} alt="profil" />
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

            {/* Modal Delete */}
            <Modal isOpen={modalEditProfil} onClose={closeModalEditProfil}>
                <ModalHeader className='text-center'>Ganti Foto Profil</ModalHeader>
                <ModalBody>
                    <div className='w-full h-50vh flex flex-wrap overflow-y-auto'>
                        {generateListImage()}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <div className="hidden sm:block">
                        <Button layout="outline" onClick={closeModalEditProfil}>
                            Batal
                        </Button>
                    </div>
                    <div className="block w-full sm:hidden">
                        <Button block size="large" layout="outline" onClick={closeModalEditProfil}>
                            Batal
                        </Button>
                    </div>
                </ModalFooter>
            </Modal>
        </>
    );
}
