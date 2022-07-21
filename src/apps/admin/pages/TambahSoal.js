import React, { useState, useEffect } from "react";
import PageTitle from "../../../components/Typography/PageTitle";
import SectionTitle from "../../../components/Typography/SectionTitle";
import {
  Label,
  Select,
} from "@windmill/react-ui";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from 'react-router-dom';
import AuthService from "../../../services/auth.service";
import HurufService from "../service/huruf.service";
import SoalService from "../service/soal.service";
import toast, { Toaster } from 'react-hot-toast';
import SoalTipe1 from "./component/TambahSoal/SoalTipe1";
import SoalTipe2 from "./component/TambahSoal/SoalTipe2";
import SoalTipe3 from "./component/TambahSoal/SoalTipe3";

function TambahSoal() {

  const { uid } = useParams();
  const history = useHistory();

  const [huruf, setHuruf] = useState([]);

  const [hurufSoal, setHurufSoal] = useState([]);

  // dibuat untuk array garis dan titik soal tipe 3
  const [lines, setLines] = useState([]);
  const [dot, setDot] = useState([]);

  const [tipeSoal, setTipeSoal] = useState('1');

  useEffect(() => {
    HurufService.getAllHuruf().then((response) => {
      setHuruf(response.data.data);
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
  }, [history]);

  useEffect(() => {
    // console.log(hurufSoal);
  }, [hurufSoal])

  const createSoal = (data) => {
    console.log(data);
    // SoalService.createSoal(data).then(res => {

    // }, (err) => {
    //   console.log(err);
    // })
  }

  const tambahHurufSoal = (data) => {
    data && setHurufSoal([...hurufSoal, data]);
  }

  const hapusHurufSoal = (index) => {
    const data = [...hurufSoal];
    data.splice(index, 1);
    setHurufSoal(data)
  }

  const handleSimpan = (data) => {
    if (tipeSoal !== '3' && hurufSoal.length < 1) {
      toast.error('Harap Lengkapi huruf soal!!', { position: 'bottom-center' })
      return;
    }

    const newData_tambahan = {
      garis: [...lines],
      titik: [...dot]
    }

    if (tipeSoal === '1') {
      SoalService.createSoal({ id_tugas: uid, tipe: tipeSoal, kalimat_soal: data.kalimatsoal, huruf_soal: JSON.stringify([...hurufSoal]), huruf_bank: JSON.stringify([...data.pilih_huruf_bank]), data_tambahan: '' })
        .then(response => {
          toast.success('Soal berhasil dibuat', { position: 'bottom-center' });
          setTimeout(() => {
            history.push(`/app/detailtugas/${uid}`);
            window.location.reload();
          }, 3000);
        }, (error) => {
          console.log(error);
        });
    } else if (tipeSoal === '2') {

      let extensionFile = data.audiosoal[0].name.split('.').pop();

      if (extensionFile === 'mp3') {
        const formData = new FormData();
        formData.append('audiosoal', data.audiosoal[0]);
        formData.append('id_tugas', uid);
        formData.append('tipe', tipeSoal);
        formData.append('kalimat_soal', data.kalimatsoal);
        formData.append('huruf_soal', JSON.stringify([...hurufSoal]));
        formData.append('huruf_bank', JSON.stringify([...data.pilih_huruf_bank]));

        SoalService.createSoal2(formData)
          .then(response => {
            toast.success('Soal berhasil dibuat', { position: 'bottom-center' });
            setTimeout(() => {
              history.push(`/app/detailtugas/${uid}`);
              window.location.reload();
            }, 3000);
          }, (error) => {
            console.log(error);
          });
      } else {
        toast.error('Ekstensi file harus mp3', { position: 'bottom-center' })
      }

    }
    // else {
    //   SoalService.createSoal({ id_tugas: uid, tipe: tipeSoal, kalimat_soal: data.kalimatsoal, huruf_soal: '', huruf_bank: '', data_tambahan: JSON.stringify(newData_tambahan) })
    //     .then(response => {
    //       toast.success('Soal berhasil dibuat', { position: 'bottom-center' });
    //       setTimeout(() => {
    //         history.push(`/app/detailtugas/${uid}`);
    //         window.location.reload();
    //       }, 3000);
    //     }, (error) => {
    //       console.log(error);
    //     });
    // }
  }

  const showSelectedOption = () => {
    switch (tipeSoal) {
      case '1':
        return <SoalTipe1 huruf={huruf} hurufSoal={hurufSoal} tambahHurufSoal={(e) => tambahHurufSoal(e)} hapusHurufSoal={(e) => hapusHurufSoal(e)} handleSimpan={(e) => handleSimpan(e)} />;
      case '2':
        return <SoalTipe2 huruf={huruf} hurufSoal={hurufSoal} tambahHurufSoal={(e) => tambahHurufSoal(e)} hapusHurufSoal={(e) => hapusHurufSoal(e)} handleSimpan={(e) => handleSimpan(e)} />;
      case '3':
        return <SoalTipe3 />;
      // return <SoalTipe3 lines={lines} setLines={(e) => setLines(e)} dot={dot} setDot={(e) => setDot(e)} handleSimpan={(e) => handleSimpan(e)} />;
      default:
        return '';
    }
  }

  return (
    <>
      <Toaster />
      <PageTitle>Tambah Data Tugas</PageTitle>

      <div className='mb-8 w-1/2 md:w-1/4'>
        <Label className='mt-4'>
          <span>Jenis Soal</span>
          <Select onChange={(e) => setTipeSoal(e.target.value)} className='mt-1'>
            <option value='1'>Membaca</option>
            <option value='2'>Mendengar</option>
            <option value='3'>Menulis</option>
          </Select>
        </Label>
      </div>

      <SectionTitle>Data Soal</SectionTitle>
      {showSelectedOption()}
    </>
  );
}

export default TambahSoal;
