import React, { useState, useEffect } from 'react'
import {
    Input,
    HelperText,
    Label,
    Select,
    Textarea,
    Button,
    Card,
    CardBody,
    Icon,
} from "@windmill/react-ui";
import { useForm } from "react-hook-form";
import SectionTitle from "../../../../../components/Typography/SectionTitle";
import Sketch from 'react-p5'
import SoalService from '../../../service/soal.service';
import { useHistory, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
// import MyLine from './myLine';

export default function SoalTipe3() {

    let garis = [];
    let titik = []
    let alatTulis = 'garis';

    const { uid } = useParams();
    const history = useHistory();

    // const [showSoal, setShowSoal] = useState(false);
    const { register, formState: { errors }, handleSubmit, setValue } = useForm();

    const setup = (p5, canvasParentRef) => {
        const canvas = p5.createCanvas(550, 300).parent(canvasParentRef);

        canvas.doubleClicked((event) => {
            saveDot(event);
        });

        // cnv.mouseClicked((event) => {
        //     saveLine(event);
        // });
    }

    const setupView = (p5, createParentRef) => {
        p5.createCanvas(550, 300).parent(createParentRef);
    }

    const draw = (p5) => {
        p5.background(255);


        (garis.length > 0) && garis.forEach(line => show(p5, line, 'line'));
        (titik.length > 0) && titik.forEach(dot => show(p5, dot, 'titik'));
    }

    function saveDot(event) {
        if (alatTulis === 'titik') {
            titik.push({ x: event.offsetX, y: event.offsetY, px: event.offsetX, py: event.offsetY })
        }

        if (alatTulis === 'garis') {
            garis.push({ x: event.offsetX, y: event.offsetY, px: event.offsetX, py: event.offsetY })
            console.log(garis);
        }
    }

    const drawView = (p5) => {
        p5.clear();
        p5.background(255);

        // (garis.length > 0) && garis.forEach((p, index) => {
        //     // if ((index % 3) > 0) {
        //     plot(p5, 222, 160, p.x, p.y);
        //     // }
        // });

        // (titik.length > 0) && titik.forEach((p, index) => {
        //     plot(p5, 160, 160, p.x, p.y);
        // });

        // p5.background(255);
        p5.stroke(90);
        p5.strokeWeight(10);
        p5.noFill();
        p5.beginShape();
        for (let i = 0; i < garis.length; i++) {
            p5.curveVertex(garis[i].x, garis[i].y)
        }
        p5.endShape();

        p5.beginShape();
        for (let i = 0; i < titik.length; i++) {
            p5.fill(90)
            p5.noStroke()
            p5.circle(titik[i].x, titik[i].y, 10);
        }
        p5.endShape();
    }

    const show = (p5, line, type) => {
        if (type === 'titik') {
            p5.stroke('blue')
        } else {
            p5.stroke(50);
        }
        p5.strokeWeight(5);
        p5.line(line.px, line.py, line.x, line.y);
    }

    const windowResized = (p5) => {
        p5.resizeCanvas(550, 300)
    }

    const plot = (p5, fillColor, strokeColor, x, y) => {
        p5.fill(fillColor);
        // p5.stroke(strokeColor);
        p5.strokeWeight(5);
        p5.ellipse(x, y, 1);
    }

    const plotText = (p5, txt, x, y) => {
        p5.fill(90);
        p5.stroke(222);
        p5.textSize(20);
        p5.text(txt, x + 8, y + 10);
    }

    const clearCanvas = () => {
        garis = [];
        titik = [];
    }

    const handleSimpan = (data) => {
        const newData_tambahan = {
            garis: [...garis],
            titik: [...titik]
        }

        console.log({ id_tugas: uid, tipe: '3', kalimat_soal: data.kalimatsoal, huruf_soal: '', huruf_bank: '', data_tambahan: JSON.stringify(newData_tambahan) });
        SoalService.createSoal({ id_tugas: uid, tipe: '3', kalimat_soal: data.kalimatsoal, huruf_soal: '', huruf_bank: '', data_tambahan: JSON.stringify(newData_tambahan) })
            .then(response => {
                toast.success('Soal berhasil dibuat', { position: 'bottom-center' });
                setTimeout(() => {
                    history.push(`/app/detailtugas/${uid}`);
                    window.location.reload();
                }, 3000);
            }, (error) => {
                console.log(error);
            });
    }

    const changeAlatTulis = (value) => {
        if (value === 'garis') {
            let btn = document.getElementById('btn-garis');
            btn.disabled = true;
            let btn2 = document.getElementById('btn-titik');
            btn2.disabled = false;
            alatTulis = value;
        } else if (value === 'titik') {
            let btn = document.getElementById('btn-garis');
            btn.disabled = false;
            let btn2 = document.getElementById('btn-titik');
            btn2.disabled = true;
            alatTulis = value;
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(handleSimpan)} >
                <div className='px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800'>

                    <Label className='mb-3'>
                        <span>Kalimat Soal </span>
                        <Textarea
                            {...register('kalimatsoal', { required: 'Kalimat soal is required' })}
                            className='mt-1'
                            rows='4'
                            placeholder='Tuliskan kalimat untuk soal...'
                        />
                    </Label>
                    <div className="mb-3">
                        {errors.kalimatsoal?.message && (
                            <HelperText valid={false}>{errors.kalimatsoal?.message}</HelperText>
                        )}
                    </div>
                </div>

                <SectionTitle>Data Huruf Soal </SectionTitle>
                <div className='px-4 py-3 mb-8 bg-blue-400 rounded-lg shadow-md dark:bg-gray-800'>
                    <Label className='mb-4'>
                        <button className='font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-blue-600 border border-transparent active:bg-blue-600 disabled:bg-blue-200 focus:ring focus:ring-blue-300 mr-4'
                            id='btn-garis' onClick={() => changeAlatTulis('garis', 'btn-garis')} >
                            Garis
                        </button>

                        <button className='font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-blue-600 border border-transparent active:bg-blue-600 disabled:bg-blue-200 focus:ring focus:ring-blue-300'
                            id='btn-titik' onClick={() => changeAlatTulis('titik', 'btn-titik')} >
                            Titik
                        </button>

                        {/* <span className='text-white ml-2 mr-4 dark:text-gray-400'>Untuk membuat GARIS klik 1 kali, untuk membuat TITIK klik 2 kali (doubel click) </span> */}
                    </Label>
                    <Sketch setup={setup} draw={draw} windowResized={windowResized} />
                    {/* <Button onClick={() => setShowSoal(true)}>Lihat Tampilan soal</Button> */}
                    <Button className='mt-4' onClick={() => clearCanvas()}>Reset</Button>
                </div>

                <SectionTitle>Tampilan soal</SectionTitle>
                <div className='px-4 py-3 mb-8 bg-blue-400 rounded-lg shadow-md dark:bg-gray-800'>
                    {/* {showSoal && <Sketch setup={setupView} draw={drawView} />} */}
                    <Sketch setup={setupView} draw={drawView} />
                </div>

                <Button type='submit'>Simpan</Button>
            </form>
        </>
    )
}
