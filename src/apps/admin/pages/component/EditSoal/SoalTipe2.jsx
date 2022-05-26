import React, { useState } from 'react'
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
import { TrashIcon } from "../../../../../icons";

export default function SoalTipe2(props) {

    const { register, formState: { errors }, handleSubmit } = useForm();
    const [pilihHurufSoal, setPilihHurufSoal] = useState();

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

                    <Label className='mb-3'>
                        <span>Audio Soal </span>
                        <Input
                            {...register('audiosoal', { required: 'Audio soal is required' })}
                            className='mt-1'
                            type='file'
                        />
                    </Label>
                    <div className="mb-3">
                        {errors.audiosoal?.message && (
                            <HelperText valid={false}>{errors.audiosoal?.message}</HelperText>
                        )}
                    </div>
                </div>

                <SectionTitle>Data Huruf Soal </SectionTitle>
                <div className='px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800'>
                    <div className='flex flex-wrap mb-4'>
                        {props.hurufSoal.map((el, index) => (
                            <div key={index} className='w-full flex justify-between items-center p-4 mb-2 rounded bg-blue-100 md:w-1/5 md:mr-6 md:mb-2'>
                                <img src={`/assets/${el}.svg`} alt='huruf' className='ml-4 h-10' />
                                <div>
                                    <Button onClick={() => props.hapusHurufSoal(index)} size='small' icon={TrashIcon} className='' />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className='bg-blue-600 py-4 px-2 rounded'>
                        <Label className='mr-4'>
                            <span className='text-white'>Huruf Hijaiyah</span>
                            <Select onChange={(e) => setPilihHurufSoal(e.target.value)} className='mt-1'>
                                <option value=''>pilih huruf</option>
                                {props.huruf.map((e, index) => (
                                    <option key={index} value={e.nama_huruf}>
                                        {e.nama_huruf}
                                    </option>
                                ))}
                            </Select>
                        </Label>

                        <Button onClick={() => props.tambahHurufSoal(pilihHurufSoal)} layout='link' className='mt-4 bg-cool-gray-100'>
                            Tambah
                        </Button>
                        <Label className='mt-2'>
                            {(props.hurufSoal.length < 1) && (
                                <HelperText className='text-white'>
                                    *Tambahkan huruf hijaiyah yang akan dijadikan sebagai soal
                                </HelperText>
                            )}
                        </Label>
                    </div>
                </div>

                <SectionTitle>Bank Data soal</SectionTitle>
                <div className='px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800'>
                    <div className='h-64 flex flex-wrap overflow-y-auto mb-4 md:h-auto'>
                        {props.huruf.map((el, index) => (
                            <div key={index} className={`w-full p-4 mb-2 rounded md:w-1/5 md:mx-6 md:mb-2`}>
                                <Label check>
                                    <Input
                                        className='p-2'
                                        {...register('pilih_huruf_bank', { required: 'error' })}
                                        type='checkbox'
                                        value={el.nama_huruf}
                                    />
                                    {/* <span className='ml-2'>Go to Label to read more</span> */}
                                    <img
                                        className='ml-4 h-10'
                                        src={`/assets/${el.nama_huruf}.svg`}
                                        alt='huruf'
                                    />
                                </Label>
                            </div>
                        ))}
                    </div>


                    <Label className='mb-2'>
                        {errors.pilih_huruf_bank?.message && (
                            <HelperText valid={false}>
                                *Harus Memilih salah satu huruf
                            </HelperText>
                        )}
                    </Label>

                </div>

                <Button type='submit'>Simpan</Button>
            </form>
        </>
    )
}
