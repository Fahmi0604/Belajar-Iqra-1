import React, { useEffect, useState } from 'react'
import AuthService from '../services/auth.service';
import UserService from '../services/user.service';
import { useHistory } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginSiswa() {

    const history = useHistory();
    const [users, setUsers] = useState([])

    useEffect(() => {
        const user = AuthService.getCurrentUser();

        UserService.getAllUsers().then(res => {
            console.log(res.data);
            // console.log(res.data.data.filter(f => f.role === '2'));
            setUsers(res.data.data.filter(f => f.role === '2'));
        }, (error => {
            console.log("Private page", error.response);
            // Invalid token
            if (error.response && error.response.status === 401) {
                AuthService.logout();
                navigate("/login");
                window.location.reload();
            }
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLogin = async (username, password) => {
        try {
            await AuthService.login(username, password).then(
                (res) => {
                    console.log(res);
                    toast.success('Berhasil Login', { position: 'bottom-center' });

                    UserService.getUserById(res.uid).then(response => {
                        if (response.data.data.role === '1') {
                            history.push("/app/dashboard");
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);
                        } else {
                            setTimeout(() => {
                                history.push("/home");
                                window.location.reload();
                            }, 1000);
                        }
                    });

                    // return res
                },
                (error) => {
                    console.log(error);
                }
            );
        } catch (err) {
            console.log(err);
        }
    };

    const navigate = (route) => {
        history.push(route);
    }

    return (
        <>
            <div className="flex flex-col items-center min-h-screen p-6 bg-custom-primary lg:px-25% bg-[image:url('/sky.png')] bg-cover bg-no-repeat bg-bottom">

                <div className="w-full flex-1 mx-auto mb-4 overflow-hidden bg-custom-primary shadow-click rounded-lg">
                    <div className='w-full flex justify-center'>
                        <p className='text-white text-3xl font-custom-font-gum font-medium mt-4'>TK A1</p>
                    </div>

                    <div className='flex flex-wrap p-4'>
                        {users.filter(f => f.kelas === 'A1').map((e, i) =>
                            <button onClick={() => handleLogin(e.username, e.username)} key={i} className='flex w-47% p-2 bg-custom-secondary border-2 border-white rounded-md shadow-custom-shadow-gray text-custom-text text mb-3 mx-1.5% sm:w-31% sm:mx-1% sm:mb-4'>
                                <div className='w-1/4 flex justify-center items-center'>
                                    <img src={(e.jenis_kelamin === 'Laki-Laki') ? '/profil_laki.svg' : '/profil_perempuan.svg'} alt="profil" className='w-10 h-10' />
                                </div>
                                <div className='flex justify-center items-center w-3/4 h-full text-white text-xl font-custom-font'>
                                    {e.nama}
                                </div>
                            </button>
                        )}
                    </div>
                </div>

                <div className="w-full flex-1 mx-auto overflow-hidden bg-custom-primary shadow-click rounded-lg">
                    <div className='w-full flex justify-center'>
                        <p className='text-white text-3xl font-custom-font-gum font-medium mt-4'>TK A2</p>
                    </div>

                    <div className='flex flex-wrap p-4'>
                        {users.filter(f => f.kelas === 'A2').map((e, i) =>
                            <button onClick={() => handleLogin(e.username, e.username)} key={i} className='flex w-47% p-2 bg-custom-secondary border-2 border-white rounded-md shadow-custom-shadow-gray text-custom-text text mb-3 mx-1.5% sm:w-31% sm:mx-1% sm:mb-4'>
                                <div className='w-1/4 flex justify-center items-center'>
                                    <img src={(e.jenis_kelamin === 'Laki-Laki') ? '/profil_laki.svg' : '/profil_perempuan.svg'} alt="profil" className='w-10 h-10' />
                                </div>
                                <div className='flex justify-center items-center w-3/4 text-white text-xl font-custom-font'>
                                    {e.nama}
                                </div>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
