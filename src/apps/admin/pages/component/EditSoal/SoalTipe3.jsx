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
import { useLocation } from 'react-router-dom';
// import MyLine from './myLine';

export default function SoalTipe3(props) {

    const location = useLocation();
    // let lines = [];

    // const [lines, setLines] = useState([]);
    // const [dot, setDot] = useState([]);
    const [alatTulis, setAlatTulis] = useState('garis');

    // const [showSoal, setShowSoal] = useState(false);
    const { register, formState: { errors }, handleSubmit, setValue } = useForm();

    useEffect(() => {

        const data = location.state.data;
        const data_tambahan = JSON.parse(data.data_tambahan);
        setValue('kalimatsoal', data.kalimat_soal);
        props.setLines(data_tambahan.garis);
        props.setDot(data_tambahan.titik);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location])

    const setup = (p5, canvasParentRef) => {
        p5.createCanvas(550, 300).parent(canvasParentRef);
    }

    const setupView = (p5, createParentRef) => {
        p5.createCanvas(550, 300).parent(createParentRef);
    }

    const draw = (p5) => {
        p5.background(255)

        if (p5.mouseIsPressed && (alatTulis === 'titik')) {
            props.setDot([...props.dot, { x: p5.mouseX, y: p5.mouseY, px: p5.pmouseX, py: p5.pmouseY }]);
        }

        if (p5.mouseIsPressed && (alatTulis === 'garis')) {
            // lines.push(new MyLine(p5))
            props.setLines([...props.lines, { x: p5.mouseX, y: p5.mouseY, px: p5.pmouseX, py: p5.pmouseY }]);
        }

        (props.lines.length > 0) && props.lines.forEach(line => show(p5, line, 'line'));
        (props.dot.length > 0) && props.dot.forEach(dot => show(p5, dot, 'dot'));
    }

    const drawView = (p5) => {
        p5.clear();
        p5.background(255);

        (props.lines.length > 0) && props.lines.forEach((p, index) => {
            if ((index % 3) > 0) {
                plot(p5, 222, 160, p.x, p.y);
            }
        });

        (props.dot.length > 0) && props.dot.forEach((p, index) => {
            plot(p5, 160, 160, p.x, p.y);
        });
    }

    const show = (p5, line, type) => {
        if (type === 'dot') {
            p5.stroke('blue')
        } else {
            p5.stroke(50);
        }
        p5.strokeWeight(15);
        p5.line(line.px, line.py, line.x, line.y);
    }

    const windowResized = (p5) => {
        p5.resizeCanvas(550, 300)
    }

    const plot = (p5, fillColor, strokeColor, x, y) => {
        p5.fill(fillColor);
        // p5.stroke(strokeColor);
        p5.strokeWeight(3);
        p5.ellipse(x, y, 1);
    }

    const plotText = (p5, txt, x, y) => {
        p5.fill(90);
        p5.stroke(222);
        p5.textSize(20);
        p5.text(txt, x + 8, y + 10);
    }

    const alatTulisChanged = (e) => {
        setAlatTulis(e.target.value);
    }

    const clearCanvas = () => {
        props.setLines([]);
        props.setDot([]);
    }

    return (
        <>
            <form onSubmit={handleSubmit(props.handleSimpan)} encType='multipart/form-data' >
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
                        <Input type='radio' name='alat' value='garis' checked={alatTulis === 'garis'} onChange={(e) => alatTulisChanged(e)} />
                        <span className='text-white ml-2 mr-4 dark:text-gray-400'>Garis</span>

                        <Input type='radio' name='alat' value='titik' checked={alatTulis === 'titik'} onChange={(e) => alatTulisChanged(e)} />
                        <span className='text-white ml-2 mr-4 dark:text-gray-400'>Titik</span>

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
