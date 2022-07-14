import React, { useState, useEffect, Fragment } from 'react';
import { v4 } from 'uuid';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Dialog, Transition } from '@headlessui/react'
import { ChevronLeftIcon, PlayIcon, PauseIcon } from '@heroicons/react/solid'
import { isMobile } from 'react-device-detect';
import DeviceOrientation, { Orientation } from 'react-screen-orientation'
import Lottie from 'react-lottie';
import orien from '../assets/orientation.json'
import toast, { Toaster } from 'react-hot-toast';
// import ITEMS from '../data/DataHuruf';
import confetti from '../assets/confetti.json'
import AuthService from '../../../services/auth.service';
import JawabanService from '../service/jawaban.service';
import UserService from '../../../services/user.service';

// lottie option
const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: orien,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    },
};

const copy = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const item = sourceClone[droppableSource.index];

    destClone.splice(0, 1, { ...item, id: v4() });

    return destClone;
};

const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(0, 1, removed)

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    console.log(result);

    return result;
};

const Game2 = () => {

    const history = useHistory();
    const location = useLocation();
    const [state, setState] = useState({
        data: {
            'Ba1': [],
            'Ta2': [],
            'Ta3': []
        },
    });
    const [modalBank, setModalBank] = useState(false);
    const [dataBank, setDataBank] = useState([]);
    // variabel untuk mengeset apakah soal sudah terjawab sebelumnya
    const [answered, setAnswered] = useState(false);
    const [audio, setAudio] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        // digunakan untuk setData awal soal dan bank
        if (location.state) {
            console.log(location.state);
            setState(prev => ({
                ...prev,
                data: location.state.data.data_soal,
            }));
            setDataBank(location.state.data.data_bank);
            setAudio(new Audio(location.state.data.data_tambahan));
        }

    }, [location]);

    useEffect(() => {
        getAllAnswer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    const getAllAnswer = () => {
        const user = AuthService.getCurrentUser();

        if (user) {
            JawabanService.getJawabanById({ id_user: user.uid, id_soal: location.state.data.id_soal })
                .then(res => {
                    if (res.data.success) {
                        const answer = JSON.parse(res.data.data.jawab);
                        setAnswered(true);
                        setState(prev => ({
                            ...prev,
                            data: {
                                ...answer
                            }
                        }));
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
        }
    }

    const onDragEnd = (result) => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        switch (source.droppableId) {
            case destination.droppableId:
                break;
            case 'ITEMS':
                console.log('copy');
                setState(prev => ({
                    ...prev,
                    data: {
                        ...prev.data,
                        [destination.droppableId]: copy(
                            dataBank,
                            state.data[destination.droppableId],
                            source,
                            destination
                        )
                    }
                }));
                break;
            default:
                console.log('move');
                setState(prev => ({
                    ...prev,
                    data: {
                        ...prev.data,
                        ...move(
                            state.data[source.droppableId],
                            state.data[destination.droppableId],
                            source,
                            destination
                        )
                    }
                })
                );
                break;
        }
    };

    // hapus digit di soal
    const digitsBeGone = (str) => {
        return str.match(/\D/g).join('')
    }


    function openBank() {
        setModalBank(true);
    }

    function closeBank() {
        setModalBank(false);
    }

    async function checkAnswer(data) {
        const user = AuthService.getCurrentUser();

        // untuk mengecek apakah jawaban sudah diisi semua
        const checkAllAnswer = Object.keys(data).every(e => data[e].length > 0);
        console.log(Object.keys(data)[0]);

        if (checkAllAnswer) {
            // untuk mengecek apakah semua jawaban sudah benar semua sesuai soal
            let arr = await Object.keys(data).every((item, i) => data[item][0].huruf === digitsBeGone(item))

            JawabanService.createJawaban({ id_user: user.uid, id_soal: location.state.data.id_soal, jawab: JSON.stringify(data), nilai: arr })
                .then(res => {
                    console.log(res);
                    toast.success('data berhasil disimpan', { position: 'bottom-center' });
                    getAllAnswer();
                }, (error) => {
                    console.log("Private page", error.response);
                    // Invalid token
                    if (error.response && error.response.status === 401) {
                        AuthService.logout();
                        navigate("/splash");
                        window.location.reload();
                    }
                });

            if (arr) {
                UserService.updateCoin({ coin: 10, id_user: user.uid, tipe: 'tambah' })
                    .then(res => {
                        console.log(res);
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
            toast.error('Harap isi jawaban', { position: 'bottom-center' })
        }
    }

    // digunakan untuk meng genarate warna border berdasarkan jawaban (benas/salah)
    const generateColorBorder = (key) => {
        // cek apakah sudah di jawab apa tidak
        if (state.data[key].length && answered) {
            // cek apakah jawaban user sesuai dengan soal (benar/salah)
            if (state.data[key][0].huruf === digitsBeGone(key)) {
                return 'border-custom-green-primary'
            } else {
                return 'border-red-600'
            }
        } else {
            return 'border-black'
        }
    }

    const playAudio = () => {
        if (audio !== '') {
            audio.play();
            setIsPlaying(true);
        }
    }

    const pauseAudio = () => {
        if (audio !== '') {
            audio.pause();
            setIsPlaying(false);
        }
    }

    const navigate = (route) => {
        history.push(route);
    }

    return isMobile ? (
        <>
            <Toaster />
            <DeviceOrientation lockOrientation={'landscape'}>
                <Orientation orientation='landscape' alwaysRender={false}>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className='bg-custom-primary min-h-screen py-4 px-4 md:px-8 pt-4'>
                            <div className='w-90% flex items-center mb-4'>
                                <Link to={'/tugas'}>
                                    <button>
                                        <ChevronLeftIcon className='w-10 h-10 text-white bg-custom-secondary rounded-full' />
                                    </button>
                                </Link>
                            </div>
                            <h1 className='text-white'>{location.state.data.kalimat_soal}</h1>
                            {isPlaying ? (<button onClick={pauseAudio}><PauseIcon className='w-10 h-10 text-white' /></button>) : (<button onClick={playAudio}><PlayIcon className='w-10 h-10 text-white' /></button>)
                            }

                            <div className='w-full flex justify-end'>
                                {modalBank ? '' : (<button className='bg-custom-green-primary text-white px-2 py-1 mt-4 rounded shadow-custom-shadow-green' onClick={() => openBank()}>Bank Data</button>)}
                            </div>
                            {modalBank ? (
                                <Droppable droppableId="ITEMS" isDropDisabled={true}>
                                    {(provided, snapshot) => (
                                        <div className='w-full bg-custom-secondary p-2 mt-4 rounded shadow-custom-shadow-gray'>
                                            <div className='flex justify-end'>
                                                <button className='w-fit bg-custom-secondary text-xs text-white py-1 px-2 font-bold border-2 border-white rounded' onClick={() => closeBank()}>
                                                    X
                                                </button>
                                            </div>
                                            <div as='bank' className={`w-full flex justify-around mt-2`} ref={provided.innerRef}>
                                                {dataBank.map((item, index) => (
                                                    <Draggable
                                                        key={item.id}
                                                        isDragDisabled={answered}
                                                        draggableId={item.id}
                                                        index={index}>
                                                        {(provided, snapshot) => (
                                                            <Fragment>
                                                                <img ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    src={item.content}
                                                                    alt={item.huruf}
                                                                    className='w-24 h-24 bg-white select-none p-2 mb-2 rounded'
                                                                />
                                                                {snapshot.isDragging && (
                                                                    <img src={item.content} alt={item.huruf} className='clone !transform-none' />
                                                                )}
                                                            </Fragment>
                                                        )}
                                                    </Draggable>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </Droppable>
                            ) : ""}

                            <div as='Content' className='flex justify-center mt-4'>
                                {Object.keys(state.data).map((list, i) => (
                                    <Droppable key={list} droppableId={list}>
                                        {(provided, snapshot) => (
                                            <div as='Container' className={`w-31% min-h-custom-min-height m-2 bg-white p-2 rounded flex justify-center border-2 border-dashed ${generateColorBorder(list)}`}
                                                ref={provided.innerRef}>
                                                {state.data[list].length
                                                    ? state.data[list].map(
                                                        (item, index) => (
                                                            <Draggable
                                                                key={item.id}
                                                                isDragDisabled={answered}
                                                                draggableId={item.id}
                                                                index={index}>
                                                                {(provided, snapshot) => (
                                                                    <img ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        src={item.content}
                                                                        alt={item.huruf}
                                                                        className='w-24 h-24 select-none p-2 mb-2 rounded'
                                                                    />
                                                                )}
                                                            </Draggable>
                                                        )) : !provided.placeholder && (
                                                            ''
                                                        )}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                ))}
                            </div>
                            <div className='w-full flex mt-4'>
                                <button className='bg-custom-secondary text-white px-3 py-1 rounded-md shadow-click' onClick={() => checkAnswer(state.data)} disabled={answered}>
                                    Check
                                </button>
                            </div>
                        </div>
                    </DragDropContext >
                </Orientation>
                <Orientation orientation='portrait' alwaysRender={false}>
                    <div className='bg-custom-primary min-h-screen px-4 md:px-8 xl:px-28 pt-4 flex flex-col justify-center items-center'>
                        <Lottie options={defaultOptions} />
                        <h1 className='text-white font-semibold text-lg'>Tolong Putar Device anda</h1>
                    </div>
                </Orientation>
            </DeviceOrientation>
        </>

    ) : (

        <>
            <Toaster />
            <DragDropContext onDragEnd={onDragEnd}>
                <div className='bg-custom-primary min-h-screen px-4 md:px-8 lg:px-25% pt-4'>
                    <div className='w-90% flex items-center mb-4'>
                        <Link to={'/tugas'}>
                            <button>
                                <ChevronLeftIcon className='w-10 h-10 text-white bg-custom-secondary rounded-full' />
                            </button>
                        </Link>
                    </div>
                    <h1 className='text-white text-lg'> {location.state.data.kalimat_soal}</h1>
                    {isPlaying ? (<button onClick={pauseAudio}><PauseIcon className='w-10 h-10 text-white' /></button>) : (<button onClick={playAudio}><PlayIcon className='w-10 h-10 text-white' /></button>)
                    }

                    <div className='w-full flex justify-end'>
                        {modalBank ? '' : (<button className='bg-custom-green-primary text-white px-2 py-1 mt-4 rounded shadow-custom-shadow-green' onClick={() => openBank()}>Bank Data</button>)}
                    </div>
                    {modalBank ? (
                        <Droppable droppableId="ITEMS" isDropDisabled={true}>
                            {(provided, snapshot) => (
                                <div className='w-full bg-custom-secondary p-2 mt-4 rounded shadow-custom-shadow-gray'>
                                    <div className='flex justify-end'>
                                        <button className='w-fit bg-custom-secondary text-xs text-white py-1 px-2 font-bold border-2 border-white rounded' onClick={() => closeBank()}>
                                            X
                                        </button>
                                    </div>
                                    <div as='bank' className={`w-full flex justify-around mt-2`} ref={provided.innerRef}>
                                        {dataBank.map((item, index) => (
                                            <Draggable
                                                key={item.id}
                                                isDragDisabled={answered}
                                                draggableId={item.id}
                                                index={index}>
                                                {(provided, snapshot) => (
                                                    <Fragment>
                                                        <img ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            src={item.content}
                                                            alt={item.huruf}
                                                            className='w-24 h-24 bg-white select-none p-2 mb-2 rounded'
                                                        />
                                                        {snapshot.isDragging && (
                                                            <img src={item.content} alt={item.huruf} className='clone !transform-none' />
                                                        )}
                                                    </Fragment>
                                                )}
                                            </Draggable>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    ) : ""}

                    <div as='Content' className='flex justify-center mt-4'>
                        {Object.keys(state.data).map((list, i) => (
                            <Droppable key={list} droppableId={list}>
                                {(provided, snapshot) => (
                                    <div as='Container' className={`w-31% min-h-custom-min-height m-2 bg-white p-2 rounded flex justify-center border-2 border-dashed ${generateColorBorder(list)} `}
                                        ref={provided.innerRef}>
                                        {state.data[list].length
                                            ? state.data[list].map(
                                                (item, index) => (
                                                    <Draggable
                                                        key={item.id}
                                                        isDragDisabled={answered}
                                                        draggableId={item.id}
                                                        index={index}>
                                                        {(provided, snapshot) => (
                                                            <img ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                src={item.content}
                                                                alt={item.huruf}
                                                                className='w-24 h-24 select-none p-2 mb-2 rounded'
                                                            />
                                                        )}
                                                    </Draggable>
                                                )) : !provided.placeholder && (
                                                    ''
                                                )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                    <div className='w-full flex mt-4'>
                        <button className='bg-custom-secondary text-white px-3 py-1 rounded-md shadow-click' onClick={() => checkAnswer(state.data)} disabled={answered}>
                            Check
                        </button>
                    </div>
                </div>
            </DragDropContext >
        </>
    );
}

export default Game2;