import React, { Component, Fragment } from 'react';
import { v4 } from 'uuid';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Dialog, Transition } from '@headlessui/react'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import ITEMS from '../data/DataHuruf';
import soal1 from '../assets/Soal1.mp3'
import { PlayIcon } from '@heroicons/react/solid'
import { isMobile } from 'react-device-detect';
import DeviceOrientation, { Orientation } from 'react-screen-orientation'
import Lottie from 'react-lottie';
import animationData from '../assets/orientation.json'
import confetti from '../assets/confetti.json'

// lottie option
const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};

const defaultOptions2 = {
    loop: true,
    autoplay: true,
    animationData: confetti,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
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

class Game2 extends Component {

    state = {
        data: {
            'Alif1': [],
            'Ba2': [],
            'Ta3': []
        },
        modal: false,
        score: 0,
        modalBank: false,
    };

    componentDidMount() {
        console.log(this.state);
    }

    componentDidUpdate() {
        console.log(this.state);
    }

    onDragEnd = (result) => {
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
                this.setState(prev => ({
                    ...prev,
                    data: {
                        ...prev.data,
                        [destination.droppableId]: copy(
                            ITEMS,
                            this.state.data[destination.droppableId],
                            source,
                            destination
                        )
                    }
                }));
                break;
            default:
                console.log('move');
                this.setState(prev => ({
                    ...prev,
                    data: {
                        ...prev.data,
                        ...move(
                            this.state.data[source.droppableId],
                            this.state.data[destination.droppableId],
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
    digitsBeGone(str) {
        return str.match(/\D/g).join('')
    }

    playAudio() {
        new Audio(soal1).play()
    }

    openModal(score) {
        this.setState(prev => ({
            ...prev,
            modal: true,
            score
        }))
    }

    closeModal() {
        this.setState(prev => ({
            ...prev,
            modal: false,
            score: 0
        }))
    }

    openBank() {
        this.setState(prev => ({
            ...prev,
            modalBank: true
        }))
    }

    closeBank() {
        this.setState(prev => ({
            ...prev,
            modalBank: false
        }))
    }

    async checkAnswer(state) {
        // let arr = await Object.keys(state).map((item, i) => state[item][0].huruf === this.digitsBeGone(item))
        // if (arr.every(e => e === true)) {
        //     // alert('Benar semua')
        //     this.openModal()
        // } else {
        //     alert('yahh masih ada yang salah')
        // }
        let arr = await Object.keys(state).filter((item, i) => state[item][0].huruf === this.digitsBeGone(item))

        if (arr > 0) {
            this.openModal(arr.length)
        } else {
            this.openModal(arr.length)
        }
    }

    render() {
        return isMobile ? (
            <DeviceOrientation lockOrientation={'landscape'}>
                <Orientation orientation='landscape' alwaysRender={false}>
                    <DragDropContext onDragEnd={this.onDragEnd}>
                        <div className='bg-custom-primary min-h-screen py-4 px-4 md:px-8 pt-4'>
                            <div className='w-90% flex items-center mb-4'>
                                <Link to={'/tugas'}>
                                    <button>
                                        <ChevronLeftIcon className='w-10 h-10 text-white bg-custom-secondary rounded-full' />
                                    </button>
                                </Link>
                            </div>
                            <h1 className='text-white'>2. Dengarkan audio berikut lalu cocokan jawabanya</h1>
                            <button onClick={this.playAudio}><PlayIcon className='w-10 h-10 text-white' /></button>

                            <div className='w-full flex justify-end'>
                                {this.state.modalBank ? '' : (<button className='bg-custom-green-primary text-white px-2 py-1 mt-4 rounded shadow-custom-shadow-green' onClick={() => this.openBank()}>Bank Data</button>)}
                            </div>
                            {this.state.modalBank ? (
                                <Droppable droppableId="ITEMS" isDropDisabled={true}>
                                    {(provided, snapshot) => (
                                        <div className='w-full bg-custom-secondary p-2 mt-4 rounded shadow-custom-shadow-gray'>
                                            <div className='flex justify-end'>
                                                <button className='w-fit bg-custom-secondary text-xs text-white py-1 px-2 font-bold border-2 border-white rounded' onClick={() => this.closeBank()}>
                                                    X
                                                </button>
                                            </div>
                                            <div as='bank' className={`w-full flex justify-around mt-2`} ref={provided.innerRef}>
                                                {ITEMS.map((item, index) => (
                                                    <Draggable
                                                        key={item.id}
                                                        draggableId={item.id}
                                                        index={index}>
                                                        {(provided, snapshot) => (
                                                            <Fragment>
                                                                <img ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    src={item.content}
                                                                    alt={item.huruf}
                                                                    className='w-15% h-auto select-none p-2 mb-2 rounded'
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
                                {Object.keys(this.state.data).map((list, i) => (
                                    <Droppable key={list} droppableId={list}>
                                        {(provided, snapshot) => (
                                            <div as='Container' className={`w-31% min-h-custom-min-height m-2 bg-white p-2 rounded flex justify-center border-2 border-dashed border-black`}
                                                ref={provided.innerRef}>
                                                {this.state.data[list].length
                                                    ? this.state.data[list].map(
                                                        (item, index) => (
                                                            <Draggable
                                                                key={item.id}
                                                                draggableId={item.id}
                                                                index={index}>
                                                                {(provided, snapshot) => (
                                                                    // <div as='Item' className={`flex h-12 select-none p-2 mb-2 items-start content-start leading-normal rounded bg-white ${snapshot.isDragging ? 'border border-dashed border-black' : 'border border-solid border-gray-300'}`}
                                                                    //     ref={provided.innerRef}
                                                                    //     {...provided.draggableProps}
                                                                    //     {...provided.dragHandleProps}
                                                                    // >
                                                                    //     {item.content}
                                                                    // </div>
                                                                    <img ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        src={item.content}
                                                                        alt={item.huruf}
                                                                        className='w-1/2 h-auto select-none p-2 mb-2 rounded'
                                                                    />
                                                                )}
                                                            </Draggable>
                                                        )) : !provided.placeholder && (
                                                            ''
                                                            // <div as='notice' className='flex items-center content-center justify-center p-2 mx-2 mb-2 border border-solid border-transparent leading-normal text-black'>Drop items here</div>
                                                        )}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                ))}
                            </div>
                            <div className='w-full flex mt-4'>
                                <button className='bg-custom-secondary text-white px-3 py-1 rounded-md shadow-click' onClick={() => this.checkAnswer(this.state.data)}>
                                    Check
                                </button>
                            </div>

                            <Transition appear show={this.state.modal} as={Fragment}>
                                <Dialog
                                    as="div"
                                    className="fixed inset-0 z-10 overflow-y-auto"
                                    onClose={() => this.closeModal()}
                                >
                                    <div className="min-h-screen px-4 text-center">
                                        <Transition.Child
                                            as={Fragment}
                                            enter="ease-out duration-300"
                                            enterFrom="opacity-0"
                                            enterTo="opacity-100"
                                            leave="ease-in duration-200"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
                                        </Transition.Child>

                                        {/* This element is to trick the browser into centering the modal contents. */}
                                        <span
                                            className="inline-block h-screen align-middle"
                                            aria-hidden="true"
                                        >
                                            &#8203;
                                        </span>
                                        <Transition.Child
                                            as={Fragment}
                                            enter="ease-out duration-300"
                                            enterFrom="opacity-0 scale-95"
                                            enterTo="opacity-100 scale-100"
                                            leave="ease-in duration-200"
                                            leaveFrom="opacity-100 scale-100"
                                            leaveTo="opacity-0 scale-95"
                                        >
                                            <div className="inline-block w-full max-w-sm my-8 overflow-hidden text-left align-middle transition-all transform bg-custom-secondary shadow-xl rounded-2xl py-10">
                                                <div className='!absolute '>
                                                    <Lottie width={375} height={200} options={defaultOptions2} />
                                                </div>
                                                <Dialog.Title as="h3" className="text-lg font-custom-font font-medium leading-6 text-white text-center">
                                                    Score Game
                                                </Dialog.Title>
                                                <div className="mt-4 flex justify-between items-center">
                                                    <img src="/ilustrasi_modal1.svg" alt="icon" />
                                                    <h2 className='text-white text-6xl p-4 bg-custom-dark rounded-full'>{(~~(100 / Object.keys(this.state.data).length) * this.state.score)}</h2>
                                                    <img src="/ilustrasi_modal2.svg" alt="icon" />
                                                </div>
                                            </div>
                                        </Transition.Child>
                                    </div>
                                </Dialog>
                            </Transition>
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

        ) : (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <div className='bg-custom-primary min-h-screen px-4 md:px-8 lg:px-25% pt-4'>
                    <div className='w-90% flex items-center mb-4'>
                        <Link to={'/tugas'}>
                            <button>
                                <ChevronLeftIcon className='w-10 h-10 text-white bg-custom-secondary rounded-full' />
                            </button>
                        </Link>
                    </div>
                    <h1 className='text-white text-lg'>2. Dengarkan audio berikut lalu cocokan jawabanya</h1>
                    <button onClick={this.playAudio}><PlayIcon className='w-10 h-10 text-white' /></button>

                    <div className='w-full flex justify-end'>
                        {this.state.modalBank ? '' : (<button className='bg-custom-green-primary text-white px-2 py-1 mt-4 rounded shadow-custom-shadow-green' onClick={() => this.openBank()}>Bank Data</button>)}
                    </div>
                    {this.state.modalBank ? (
                        <Droppable droppableId="ITEMS" isDropDisabled={true}>
                            {(provided, snapshot) => (
                                <div className='w-full bg-custom-secondary p-2 mt-4 rounded shadow-custom-shadow-gray'>
                                    <div className='flex justify-end'>
                                        <button className='w-fit bg-custom-secondary text-xs text-white py-1 px-2 font-bold border-2 border-white rounded' onClick={() => this.closeBank()}>
                                            X
                                        </button>
                                    </div>
                                    <div as='bank' className={`w-full flex justify-around mt-2`} ref={provided.innerRef}>
                                        {ITEMS.map((item, index) => (
                                            <Draggable
                                                key={item.id}
                                                draggableId={item.id}
                                                index={index}>
                                                {(provided, snapshot) => (
                                                    <Fragment>
                                                        <img ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            src={item.content}
                                                            alt={item.huruf}
                                                            className='w-15% h-auto select-none p-2 mb-2 rounded'
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
                        {Object.keys(this.state.data).map((list, i) => (
                            <Droppable key={list} droppableId={list}>
                                {(provided, snapshot) => (
                                    <div as='Container' className={`w-31% min-h-custom-min-height m-2 bg-white p-2 rounded flex justify-center border-2 border-dashed border-black`}
                                        ref={provided.innerRef}>
                                        {this.state.data[list].length
                                            ? this.state.data[list].map(
                                                (item, index) => (
                                                    <Draggable
                                                        key={item.id}
                                                        draggableId={item.id}
                                                        index={index}>
                                                        {(provided, snapshot) => (
                                                            // <div as='Item' className={`flex h-12 select-none p-2 mb-2 items-start content-start leading-normal rounded bg-white ${snapshot.isDragging ? 'border border-dashed border-black' : 'border border-solid border-gray-300'}`}
                                                            //     ref={provided.innerRef}
                                                            //     {...provided.draggableProps}
                                                            //     {...provided.dragHandleProps}
                                                            // >
                                                            //     {item.content}
                                                            // </div>
                                                            <img ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                src={item.content}
                                                                alt={item.huruf}
                                                                className='w-1/2 h-auto select-none p-2 mb-2 rounded'
                                                            />
                                                        )}
                                                    </Draggable>
                                                )) : !provided.placeholder && (
                                                    ''
                                                    // <div as='notice' className='flex items-center content-center justify-center p-2 mx-2 mb-2 border border-solid border-transparent leading-normal text-black'>Drop items here</div>
                                                )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                    <div className='w-full flex mt-4'>
                        <button className='bg-custom-secondary text-white px-3 py-1 rounded-md shadow-click' onClick={() => this.checkAnswer(this.state.data)}>
                            Check
                        </button>
                    </div>

                    <Transition appear show={this.state.modal} as={Fragment}>
                        <Dialog
                            as="div"
                            className="fixed inset-0 z-10 overflow-y-auto"
                            onClose={() => this.closeModal()}
                        >
                            <div className="min-h-screen px-4 text-center">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
                                </Transition.Child>

                                {/* This element is to trick the browser into centering the modal contents. */}
                                <span
                                    className="inline-block h-screen align-middle"
                                    aria-hidden="true"
                                >
                                    &#8203;
                                </span>
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <div className="inline-block w-full max-w-sm my-8 overflow-hidden text-left align-middle transition-all transform bg-custom-secondary shadow-xl rounded-2xl py-10">
                                        <div className='!absolute '>
                                            <Lottie width={375} height={200} options={defaultOptions2} />
                                        </div>
                                        <Dialog.Title as="h3" className="text-lg font-custom-font font-medium leading-6 text-white text-center">
                                            Score Game
                                        </Dialog.Title>
                                        <div className="mt-4 flex justify-between items-center">
                                            <img src="/ilustrasi_modal1.svg" alt="icon" />
                                            <h2 className='text-white text-6xl p-4 bg-custom-dark rounded-full'>{(~~(100 / Object.keys(this.state.data).length) * this.state.score)}</h2>
                                            <img src="/ilustrasi_modal2.svg" alt="icon" />
                                        </div>
                                    </div>
                                </Transition.Child>
                            </div>
                        </Dialog>
                    </Transition>
                </div>
            </DragDropContext >
        );
    }
}

export default Game2;