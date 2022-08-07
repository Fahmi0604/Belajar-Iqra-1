import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon } from '@heroicons/react/solid';
import { useHistory } from 'react-router-dom'
import AuthService from '../../../services/auth.service';
import UserService from '../../../services/user.service';
import TokoService from '../../admin/service/toko.service';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@windmill/react-ui";
import toast, { Toaster } from 'react-hot-toast';


export default function Toko() {

    const history = useHistory();
    const [currentUser, setCurrentUser] = useState();
    const [listFotoProfil, setListFotoProfil] = useState([]);
    const [dataToko, setDataToko] = useState([]);
    const [modal, setModal] = useState(false);

    // data temporary untuk pilihan yang mau dibeli
    const [price, setPrice] = useState(0);
    const [namaProfil, setNamaProfil] = useState('')

    function openModal(nama, price) {
        setPrice(price);
        setNamaProfil(nama);
        setModal(true);
    }

    function closeModal() {
        setPrice(0);
        setNamaProfil('');
        setModal(false);
    }

    useEffect(() => {
        getCurrentUser();
        getAllToko();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
                    navigate("/splash");
                    window.location.reload();
                }
            }));
        }
    }

    const getAllToko = () => {
        TokoService.getAllToko().then(
            (res) => {
                setDataToko(res.data.data);
            },
            (error) => {
                console.log("Private page", error.response);
                // Invalid token
                if (error.response && error.response.status === 401) {
                    AuthService.logout();
                    history.push("/login");
                    window.location.reload();
                }
            }
        );
    };

    const updateCoin = () => {
        if (currentUser.coin > price) {
            const user = AuthService.getCurrentUser();
            if (user) {
                UserService.updateCoin({ coin: price, id_user: user.uid, tipe: 'kurang' })
                    .then(res => {
                        editProfil();
                    }, (error) => {
                        console.log("Private page", error.response);
                        // Invalid token
                        if (error.response && error.response.status === 401) {
                            AuthService.logout();
                            navigate("/splash");
                            window.location.reload();
                        }
                    });
            }
        } else {
            toast.error('Coin tidak cukup !!', { position: 'bottom-center' })
        }
    }

    const editProfil = () => {
        let arrayTemp = [...listFotoProfil];

        arrayTemp.forEach((e, i) => {
            if (e.nama === namaProfil) {
                e.unlock = true;
            }
        });

        const user = AuthService.getCurrentUser();

        if (user) {
            UserService.updateFotoProfil({ image: JSON.stringify(arrayTemp), id_user: user.uid })
                .then(res => {
                    getCurrentUser();
                    toast.success('Berhasil membeli !!', { position: 'bottom-center' })
                    closeModal();
                }, (error) => {
                    console.log("Private page", error.response);
                    // Invalid token
                    if (error.response && error.response.status === 401) {
                        AuthService.logout();
                        navigate("/splash");
                        window.location.reload();
                    }
                });
        }

    }

    const generateFotoProfil = () => {
        if (currentUser) {
            const data = currentUser.image && JSON.parse(currentUser.image);
            setListFotoProfil(data);
        }
    }

    const navigate = (route) => {
        history.push(route);
    }

    useEffect(() => {
        generateFotoProfil();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser])

    return (
        <>
            <Toaster />
            <div className='bg-custom-primary min-h-screen flex flex-col items-center py-4 md:py-8 lg:px-25%'>
                <div className='w-90% flex items-center mb-10'>
                    <button onClick={() => navigate('/home')}>
                        <ChevronLeftIcon className='w-10 h-10 text-white bg-custom-secondary rounded-full' />
                    </button>
                    {/* <div className='w-auto bg-white py-1 px-2 rounded-full flex items-center justify-center'>
                    <img className='w-5 h-5 mr-1' src="/Coin.svg" alt="coin" />
                    <p className='font-custom-font text-base font-medium'>100</p>
                </div> */}
                </div>

                <div className='w-full flex justify-center mb-4'>
                    <h1 className='text-white font-custom-font font-medium text-xl'>Toko Penukaran</h1>
                </div>

                <div className='w-90% flex bg-custom-yellow shadow-custom-shadow-yellow mb-8 p-4 rounded-lg'>
                    <div className='w-3/4 flex flex-col justify-evenly'>
                        <h2 className='font-custom-font font-medium text-xl'>Selamat Datang</h2>
                        <div className='w-3/4 bg-white p-1 rounded-full pl-4'>
                            <p>Coin ku : <strong>{currentUser && currentUser.coin}</strong></p>
                        </div>
                    </div>
                    <div className='w-1/4 flex justify-center'>
                        <img src="/ilustrasi_store.svg" alt="ilustrasi_store" />
                    </div>
                </div>

                <div className='w-90% flex flex-wrap'>
                    {dataToko.map((e, i) => (<button
                        key={i}
                        className='w-47% mx-1.5% mb-8 flex flex-col justify-between items-center bg-custom-yellow shadow-custom-shadow-yellow rounded-md'
                        onClick={() => openModal(e?.nama_barang, e?.harga)}
                        disabled={listFotoProfil.some(f => f.nama === e?.nama_barang && f.unlock === true)}
                    >
                        <div className='bg-custom-text text-white p-1 rounded-b-md'>{e?.nama_barang}</div>
                        <img className='my-4' src={`/${e?.nama_barang}.svg`} alt="profil" />
                        <div className='bg-custom-text text-sm text-white py-1 px-2 -mb-2 shadow-custom-shadow-gray rounded-full'>
                            {listFotoProfil.some(f => f.nama === 'profil_kucing' && f.unlock === true) ? 'Sudah dimiliki' : `${e?.harga} coin`}
                        </div>
                    </button>))}

                    {/* <button
                        className='w-47% mx-1.5% mb-8 flex flex-col justify-between items-center bg-custom-yellow shadow-custom-shadow-yellow rounded-md'
                        onClick={() => openModal('profil_anjing', 300)}
                        disabled={listFotoProfil.some(f => f.nama === 'profil_anjing' && f.unlock === true)}
                    >
                        <div className='bg-custom-text text-white p-1 rounded-b-md'>Profil Anjing</div>
                        <img className='my-4' src="/profil_anjing.svg" alt="profil" />
                        <div className='bg-custom-text text-sm text-white py-1 px-2 -mb-2 shadow-custom-shadow-gray rounded-full'>
                            {listFotoProfil.some(f => f.nama === 'profil_anjing' && f.unlock === true) ? 'Sudah dimiliki' : '300 poin'}
                        </div>
                    </button>
                    <button
                        className='w-47% mx-1.5% mb-8 flex flex-col justify-between items-center bg-custom-yellow shadow-custom-shadow-yellow rounded-md'
                        onClick={() => openModal('profil_pinguin', 300)}
                        disabled={listFotoProfil.some(f => f.nama === 'profil_pinguin' && f.unlock === true)}
                    >
                        <div className='bg-custom-text text-white p-1 rounded-b-md'>Profil Pinguin</div>
                        <img className='my-4' src="/profil_pinguin.svg" alt="profil" />
                        <div className='bg-custom-text text-sm text-white py-1 px-2 -mb-2 shadow-custom-shadow-gray rounded-full'>
                            {listFotoProfil.some(f => f.nama === 'profil_pinguin' && f.unlock === true) ? 'Sudah dimiliki' : '300 poin'}
                        </div>
                    </button>
                    <button
                        className='w-47% mx-1.5% mb-8 flex flex-col justify-between items-center bg-custom-yellow shadow-custom-shadow-yellow rounded-md'
                        onClick={() => openModal('profil_kelinci', 300)}
                        disabled={listFotoProfil.some(f => f.nama === 'profil_kelinci' && f.unlock === true)}
                    >
                        <div className='bg-custom-text text-white p-1 rounded-b-md'>Profil Kelinci</div>
                        <img className='my-4' src="/profil_kelinci.svg" alt="profil" />
                        <div className='bg-custom-text text-sm text-white py-1 px-2 -mb-2 shadow-custom-shadow-gray rounded-full'>
                            {listFotoProfil.some(f => f.nama === 'profil_kelinci' && f.unlock === true) ? 'Sudah dimiliki' : '300 poin'}
                        </div>
                    </button>
                    <button
                        className='w-47% mx-1.5% mb-8 flex flex-col justify-between items-center bg-custom-yellow shadow-custom-shadow-yellow rounded-md'
                        onClick={() => openModal('profil_rare_anjing', 1000)}
                        disabled={listFotoProfil.some(f => f.nama === 'profil_rare_anjing' && f.unlock === true)}
                    >
                        <div className='bg-custom-text text-white p-1 rounded-b-md'>Profil Special Anjing</div>
                        <img className='my-4' src="/profil_rare_anjing.svg" alt="profil" />
                        <div className='bg-custom-text text-sm text-white py-1 px-2 -mb-2 shadow-custom-shadow-gray rounded-full'>
                            {listFotoProfil.some(f => f.nama === 'profil_rare_anjing' && f.unlock === true) ? 'Sudah dimiliki' : '1000 poin'}
                        </div>
                    </button>
                    <button
                        className='w-47% mx-1.5% mb-8 flex flex-col justify-between items-center bg-custom-yellow shadow-custom-shadow-yellow rounded-md'
                        onClick={() => openModal('profil_rare_poni', 1000)}
                        disabled={listFotoProfil.some(f => f.nama === 'profil_rare_poni' && f.unlock === true)}
                    >
                        <div className='bg-custom-text text-white p-1 rounded-b-md'>Profil Special Poni</div>
                        <img className='my-4' src="/profil_rare_poni.svg" alt="profil" />
                        <div className='bg-custom-text text-sm text-white py-1 px-2 -mb-2 shadow-custom-shadow-gray rounded-full'>
                            {listFotoProfil.some(f => f.nama === 'profil_rare_poni' && f.unlock === true) ? 'Sudah dimiliki' : '1000 poin'}
                        </div>
                    </button> */}
                </div>
            </div>

            {/* Modal beli */}
            <Modal isOpen={modal} onClose={closeModal}>
                <ModalHeader>Perhatian!!</ModalHeader>
                <ModalBody>
                    Apakah anda yakin untuk membeli profil ini ?
                </ModalBody>
                <ModalFooter>
                    <div className="hidden sm:block">
                        <Button layout="outline" onClick={closeModal}>
                            Batal
                        </Button>
                    </div>
                    <div className="hidden sm:block">
                        <Button onClick={() => updateCoin()} >Ya</Button>
                    </div>
                    <div className="block w-full sm:hidden">
                        <Button block size="large" layout="outline" onClick={closeModal}>
                            Batal
                        </Button>
                    </div>
                    <div className="block w-full sm:hidden">
                        <Button onClick={() => updateCoin()} block size="large">
                            Ya
                        </Button>
                    </div>
                </ModalFooter>
            </Modal>
        </>
    )
}
