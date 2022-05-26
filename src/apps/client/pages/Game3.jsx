import React, { useState, useCallback, Fragment } from 'react';
import Sketch from 'react-p5'
import MyLine from '../component/game3/myLine';
import { Link } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import lockScroll from 'react-lock-scroll'
import { isMobile } from 'react-device-detect';
import DeviceOrientation, { Orientation } from 'react-screen-orientation'
import Lottie from 'react-lottie';
import animationData from '../assets/orientation.json'
import { FullScreen, useFullScreenHandle } from "react-full-screen";
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

const guidePoints = {
    garis: [
        { id: 1, x: 150, y: 125 },
        { id: 2, x: 200, y: 160 },
        { id: 3, x: 250, y: 175 },
        { id: 4, x: 300, y: 160 },
        { id: 5, x: 350, y: 125 }
    ],
    titik: [
        { id: 1, x: 250, y: 200 }
    ]
}

function Game3() {

    let lines = []
    let Score = []

    const [toggle, setToggle] = useState(false)
    const [modal, setModal] = useState(false)
    const [answerDone, setAnswerDone] = useState(false)
    lockScroll(toggle)

    const screen1 = useFullScreenHandle();

    const setup = (p5, canvasParentRef) => {
        // use parent to render the canvas in this ref
        // (without that p5 will render the canvas outside of your component)
        // const width = (p5.windowWidth / 10)
        // const height = (p5.windowHeight / 5)
        p5.createCanvas(550, 300).parent(canvasParentRef);
        // console.log(p5.windowWidth);
        // p5.createCanvas((p5.windowWidth / 2), (p5.windowHeight / 2)).parent(canvasParentRef);
    };

    const draw = (p5) => {
        p5.background(255)

        guidePoints.garis.forEach((p, index) => {
            plot(p5, 222, 160, p.x, p.y);
            plotText(p5, index + 1, p.x, p.y)
        })

        guidePoints.titik.forEach((p, index) => {
            plot(p5, 222, 160, p.x, p.y);
            plotText(p5, (guidePoints.garis.length + (index + 1)), p.x, p.y)
        })

        if (p5.mouseIsPressed) {
            lines.push(new MyLine(p5))
        }

        lines.forEach(line => line.show())

        plotChecker()

        if (Score.length === (guidePoints.garis.length + guidePoints.titik.length)) {
            p5.background(255)
            p5.stroke(90)
            p5.strokeWeight(10)
            p5.noFill()
            p5.beginShape()
            for (let i = 0; i < guidePoints.garis.length; i++) {
                p5.vertex(guidePoints.garis[i].x, guidePoints.garis[i].y)
            }
            p5.endShape();

            for (let i = 0; i < guidePoints.titik.length; i++) {
                p5.fill(90)
                p5.noStroke()
                p5.circle(guidePoints.titik[i].x, guidePoints.titik[i].y, 20);
            }

            p5.noLoop()
            setAnswerDone(true)
        }
    };

    const mousePressed = (p5) => {
        console.log(p5.mouseX);
        // document.body.style.overflow = 'hidden';
    }

    const windowResized = (p5) => {
        p5.resizeCanvas(550, 300)
    }

    const plot = (p5, fillColor, strokeColor, x, y) => {
        p5.fill(fillColor);
        p5.stroke(strokeColor);
        p5.strokeWeight(3);
        p5.ellipse(x, y, 12);
    }

    const plotText = (p5, txt, x, y) => {
        p5.fill(90);
        p5.stroke(222);
        p5.textSize(20);
        p5.text(txt, x + 8, y + 10);
    }

    // const fillVertex = (p5) => {
    //     p5.stroke(90);
    //     p5.fill(249, 206, 13);
    //     p5.beginShape();
    //     for (let i = 0; i < lines.length; i++) {
    //         p5.vertex(lines[i].x, lines[i].y);
    //     }
    //     p5.endShape('CLOSE');
    // }

    const plotChecker = () => {
        guidePoints.garis.forEach(point => {
            lines.forEach((line, index) => {
                if ((line.x > (point.x - 15) && line.x < (point.x + 15)) && (line.y > (point.y - 15) && line.y < (point.y + 15))) {
                    if (Score.includes(point) === false) {
                        Score.push(point);
                        console.log(Score);
                    }
                }
            })
        })
        guidePoints.titik.forEach(point => {
            lines.forEach((line, index) => {
                if ((line.x > (point.x - 15) && line.x < (point.x + 15)) && (line.y > (point.y - 15) && line.y < (point.y + 15))) {
                    if (Score.includes(point) === false) {
                        Score.push(point);
                        console.log(Score);
                    }
                }
            })
        })
    }

    const reportChange = useCallback((state, handle) => {
        if (handle === screen1) {
            setToggle(state);
            if (answerDone && !state) setModal(true)
            console.log('Screen 1 went to', state, handle);
        }
    }, [screen1, answerDone]);

    return isMobile ? (
        <FullScreen handle={screen1} onChange={reportChange}>
            <DeviceOrientation lockOrientation={'landscape'}>
                <Orientation orientation='landscape' alwaysRender={false}>
                    <div className='bg-custom-primary min-h-screen py-4 px-4 md:px-8 pt-4'>
                        {toggle ?
                            '' : (<div className='w-90% flex items-center mb-4'>
                                <Link to={'/tugas'}>
                                    <button>
                                        <ChevronLeftIcon className='w-10 h-10 text-white bg-custom-secondary rounded-full' />
                                    </button>
                                </Link>
                            </div>)}
                        <h1 className='text-white'>3. Sambunglah titi-titik dibawah ini </h1>
                        <div className='flex flex-col justify-center items-center mt-4 '>
                            <div className='w-full flex justify-end mb-4'>
                                {toggle ? <button className='px-4 py-1 bg-custom-green-primary shadow-custom-shadow-green text-white rounded' onClick={screen1.exit}>Exit</button>
                                    : <button className='px-4 py-1 bg-custom-green-primary shadow-custom-shadow-green text-white rounded' onClick={screen1.enter}>Full Screen</button>}
                            </div>
                            <Sketch setup={setup} draw={draw} mousePressed={mousePressed} windowResized={windowResized} />
                        </div>

                        <Transition appear show={modal} as={Fragment}>
                            <Dialog
                                as="div"
                                className="fixed inset-0 z-10 overflow-y-auto"
                                onClose={() => setModal(false)}
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
                                                <h2 className='text-white text-4xl p-4 bg-custom-dark rounded-full'>Berhasil</h2>
                                                <img src="/ilustrasi_modal2.svg" alt="icon" />
                                            </div>
                                        </div>
                                    </Transition.Child>
                                </div>
                            </Dialog>
                        </Transition>
                    </div>
                </Orientation>
                <Orientation orientation='portrait' alwaysRender={false}>
                    <div className='bg-custom-primary min-h-screen px-4 md:px-8 xl:px-28 pt-4 flex flex-col justify-center items-center'>
                        <Lottie options={defaultOptions} />
                        <h1 className='text-white font-semibold text-lg'>Tolong Putar Device anda</h1>
                    </div>
                </Orientation>
            </DeviceOrientation>
        </FullScreen >
    ) : (
        <div className='bg-custom-primary min-h-screen px-4 md:px-8 lg:px-25% pt-4'>
            <div className='w-90% flex items-center mb-4'>
                <Link to={'/tugas'}>
                    <button>
                        <ChevronLeftIcon className='w-10 h-10 text-white bg-custom-secondary rounded-full' />
                    </button>
                </Link>
            </div>
            <h1 className='text-white text-lg'>3. Sambunglah titi-titik dibawah ini </h1>
            <div className='flex flex-col justify-center items-center mt-4 '>
                <Sketch setup={setup} draw={draw} mousePressed={mousePressed} windowResized={windowResized} />
            </div>

            <Transition appear show={answerDone} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={() => setAnswerDone(false)}
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
                                    <h2 className='text-white text-4xl p-4 bg-custom-dark rounded-full'>Berhasil</h2>
                                    <img src="/ilustrasi_modal2.svg" alt="icon" />
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );

}

export default Game3;