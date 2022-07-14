import React, { useEffect, useState } from 'react'
import { ChevronLeftIcon, LockClosedIcon } from '@heroicons/react/solid'
import { useHistory } from 'react-router-dom'
import DataSoal1 from '../data/DataSoal1'
import TugasService from '../service/tugas.service'
import { v4 } from "uuid";
import AuthService from '../../../services/auth.service'
import JawabanService from '../service/jawaban.service'

export default function Tugas() {

    const history = useHistory();
    const [dataTugas, setDataTugas] = useState([]);
    // data all soal dari api
    const [dataSoalOri, setDataSoalOri] = useState([]);
    // data soal yang dimodif untuk ke detailsoal
    const [dataSoal, setDataSoal] = useState([]);
    // data jawaban
    const [dataJawaban, setDataJawaban] = useState([]);

    useEffect(() => {
        TugasService.getAllTugas()
            .then(res => {
                if (res.data.success === 1) {
                    setDataTugas(res.data.tugas);

                    console.log(res.data.soal);
                    const soal = res.data.soal
                    const array = [];
                    soal.forEach(e => {
                        if (e.tipe === '1' || e.tipe === '2') {
                            array.push({
                                id_tugas: e.id_tugas,
                                id_soal: e.id_soal,
                                tipe: e.tipe,
                                kalimat_soal: e.kalimat_soal,
                                huruf_soal: JSON.parse(e.huruf_soal),
                                huruf_bank: JSON.parse(e.huruf_bank),
                                data_tambahan: e.data_tambahan
                            });
                        } else {
                            array.push({
                                id_tugas: e.id_tugas,
                                id_soal: e.id_soal,
                                tipe: e.tipe,
                                kalimat_soal: e.kalimat_soal,
                                huruf_soal: e.huruf_soal,
                                huruf_bank: e.huruf_bank,
                                data_tambahan: JSON.parse(e.data_tambahan)
                            });
                        }
                    });
                    setDataSoalOri(array);
                }
            }, (error) => {
                console.log("Private page", error.response);
                // Invalid token
                if (error.response && error.response.status === 401) {
                    AuthService.logout();
                    navigate("/splash");
                    window.location.reload();
                }
            });

        // get semua jawaban
        JawabanService.getAllJawaban()
            .then(res => {
                if (res.data.success === 1) {
                    setDataJawaban(res.data.data);
                }
            }, (error) => {
                console.log("Private page", error.response);
                // Invalid token
                if (error.response && error.response.status === 401) {
                    AuthService.logout();
                    navigate("/splash");
                    window.location.reload();
                }
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // useEffect ini digunakan untuk modifikasi soalOri untuk disimpan ke dataSoal
    useEffect(() => {
        let array = [];
        dataSoalOri.forEach((e, i) => {
            if (e.tipe === '1' || e.tipe === '2') {
                array.push({
                    id_tugas: e.id_tugas,
                    id_soal: e.id_soal,
                    tipe: e.tipe,
                    kalimat_soal: e.kalimat_soal,
                    data_soal: modifDataSoal(e.huruf_soal),
                    data_bank: modifDataBank(e.huruf_bank),
                    data_tambahan: e.data_tambahan
                });
            } else {
                array.push({
                    id_tugas: e.id_tugas,
                    id_soal: e.id_soal,
                    tipe: e.tipe,
                    kalimat_soal: e.kalimat_soal,
                    data_soal: e.huruf_soal,
                    data_bank: e.huruf_bank,
                    data_tambahan: e.data_tambahan
                });
            }
        });

        setDataSoal(array);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataSoalOri]);

    // digunakan untuk midifikasi struktur array data bank 
    const modifDataBank = (data) => {
        let arraySementara = [];
        data.forEach(e => {
            arraySementara.push({
                id: v4(),
                huruf: e,
                content: `/assets/${e}.svg`,
            });
        });

        return arraySementara;
    }

    // digunakan untuk midifikasi struktur array data soal
    const modifDataSoal = (data) => {
        let objectSementara = {};
        data.forEach((e, index) => {
            objectSementara = {
                ...objectSementara,
                [e + (index + 1)]: [],
            }
        });

        return objectSementara;
    }

    // digunakan untuk meng genarate warna card soal apakah sudah selesai dikerjakan atau belum
    const generateColorSoal = (id_tugas, id_soal) => {
        const user = AuthService.getCurrentUser();

        if (user) {
            const checkJawaban = dataJawaban.filter(fil => fil.id_tugas === id_tugas && fil.id_soal === id_soal && fil.id_user === user.uid);

            if (checkJawaban.length) {
                return 'bg-gray-300 shadow-custom-shadow-gray'
            } else {
                return 'bg-custom-secondary shadow-click'
            }
        }
    }

    const generateStampNilai = (id_tugas) => {
        const user = AuthService.getCurrentUser();

        // total soal per tugas
        const soalByTugas = dataSoalOri.filter(e => e.id_tugas === id_tugas);
        // total jawaban berdasarkan id tugas
        const jawabanByTugas = dataJawaban.filter(e => e.id_tugas === id_tugas && e.id_user === user.uid);

        const soalByType = dataSoalOri.filter(e => e.id_tugas === id_tugas && (e.tipe === "1" || e.tipe === "2"));
        // jumlah nilai yang benar dari soal tipe 1 dan 2
        const score = jawabanByTugas.filter(e => e.nilai === 1 && (e.tipe === "1" || e.tipe === "2"));

        // untuk mengecek jumlah soal sudah terjawab semua 
        if (jawabanByTugas.length === soalByTugas.length) {
            return (
                <div className='w-full flex justify-end'>
                    {/* <div className='rubber absolute -mt-11'>100</div> */}
                    <div className='absolute -mt-20 -mr-5'>
                        <div className='COGfirst w-16 h-16 md:w-100px md:h-100px'>
                            <div className='firstPart w-16 h-16 md:w-100px md:h-100px'></div>
                            <div className='firstPart w-16 h-16 md:w-100px md:h-100px'></div>
                            <div className='firstPart w-16 h-16 md:w-100px md:h-100px'></div>
                            <div className='firstPart w-16 h-16 md:w-100px md:h-100px'></div>
                            <div className='firstHole w-16 h-16 md:w-100px md:h-100px flex justify-center items-center font-medium md:text-3xl'>
                                {/* rumus : (100 / jumlahsoal) * jawabanbenar */}
                                {(~~(100 / soalByType.length) * score.length)}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    const navigate = (route, data) => {
        history.push({ pathname: route, state: { data } });
    }

    return (
        <div className='bg-custom-primary min-h-screen flex flex-col items-center py-4 md:py-8 lg:px-25%'>
            <div className='w-90% flex items-center mb-16'>
                <button onClick={() => navigate('/home')}>
                    <ChevronLeftIcon className='w-10 h-10 text-white bg-custom-secondary rounded-full' />
                </button>
                {/* <div className='w-auto bg-white py-1 px-2 rounded-full flex items-center justify-center'>
                    <img className='w-5 h-5 mr-1' src="/Coin.svg" alt="coin" />
                    <p className='font-custom-font text-base font-medium'>100</p>
                </div> */}
            </div>

            {dataTugas.map((tugas, index) => ((dataSoalOri.some(e => e.id_tugas === tugas.id_tugas)) &&
                <div key={index} className='w-90% bg-white mb-24 p-4 rounded-lg'>

                    {/* Stempel Nilai */}
                    {generateStampNilai(tugas.id_tugas)}

                    <div className='flex -mt-11 justify-center mb-4'>
                        <h1 className='w-fit text-2xl text-center font-medium bg-custom-secondary py-2 px-2 text-white rounded-md border-4 border-solid border-white'>{tugas.nama_tugas}</h1>
                    </div>
                    <div className='flex bg-custom-orange p-3 items-center shadow-custom-shadow-yellow rounded-md mb-4'>
                        <div className='w-1/2 flex justify-center items-center'>
                            <h2 className='text-white font-semibold text-lg md:text-3xl'>Kategori</h2>
                        </div>
                        <div className='w-1/2 flex flex-wrap justify-center'>
                            {dataSoalOri.filter((e) => e.id_tugas === tugas.id_tugas).some((e) => e.tipe === '1') ?
                                (<img className='max-w-full w-27% mx-2.5%' src="/ilustrasi_buku.svg" alt="buku" />) : ''
                            }

                            {dataSoalOri.filter((e) => e.id_tugas === tugas.id_tugas).some((e) => e.tipe === '2') ?
                                (<img className='max-w-full w-27% mx-2.5%' src="/ilustrasi_headphone.svg" alt="headphone" />) : ''
                            }

                            {dataSoalOri.filter((e) => e.id_tugas === tugas.id_tugas).some((e) => e.tipe === '3') ?
                                (<img className='max-w-full w-27% mx-2.5%' src="/ilustrasi_menulis.svg" alt="menulis" />) : ''
                            }
                        </div>
                    </div>

                    <div as='card-container' className='flex items-center flex-wrap md:flex-row'>
                        {dataSoal.filter(filter => filter.id_tugas === tugas.id_tugas).map((t, i) => (
                            <button key={i} as='card' className={`flex items-center justify-center w-48% p-4 mx-1% mb-4 rounded-md ${generateColorSoal(t.id_tugas, t.id_soal)} md:w-31% md:mx-1% lg:w-23% lg:mx-1%`} onClick={() => navigate(`/game${t.tipe}`, t)}>
                                <h2 className='text-white font-custom-font-gum text-5xl'>{i + 1}</h2>
                            </button>
                        ))}
                    </div>

                    {/* <button onClick={() => console.log(dataSoal)}>check</button> */}
                </div>
            ))}
        </div>
    )
}
