import React, { useState, useEffect } from "react";
import PageTitle from "../../../components/Typography/PageTitle";
import SectionTitle from "../../../components/Typography/SectionTitle";
import {
  Label,
  Select,
} from "@windmill/react-ui";
import { useHistory, useParams, useLocation } from 'react-router-dom';
import AuthService from "../../../services/auth.service";
import HurufService from "../service/huruf.service";
import SoalService from "../service/soal.service";
import toast, { Toaster } from 'react-hot-toast';
import SoalTipe1 from "./component/EditSoal/SoalTipe1";
import SoalTipe2 from "./component/EditSoal/SoalTipe2";
import SoalTipe3 from "./component/EditSoal/SoalTipe3";

function EditSoal(props) {

  // tipesoal dari parameter
  const { uid } = useParams();
  const history = useHistory();
  const { state: { data: detailSoal } } = useLocation();

  // data semua huruh
  const [huruf, setHuruf] = useState([]);

  // huruf pada soal
  const [hurufSoal, setHurufSoal] = useState([]);

  const [tipeSoal, setTipeSoal] = useState('1');

  useEffect(() => {
    HurufService.getAllHuruf().then(
      (response) => {
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

  }, [history, uid]);

  useEffect(() => {
    setTipeSoal(detailSoal.tipe);
    console.log(detailSoal);
  }, [detailSoal])

  const tambahHurufSoal = (data) => {
    data && setHurufSoal([...hurufSoal, data]);
  }

  const hapusHurufSoal = (index) => {
    const data = [...hurufSoal];
    data.splice(index, 1);
    setHurufSoal(data)
  }

  const handleSimpan = (data) => {
    console.log({ ...data, uid, tipeSoal, hurufSoal });

    if (tipeSoal !== '3' && hurufSoal.length < 1) {
      toast.error('Harap Lengkapi huruf soal!!', { position: 'bottom-center' })
      return;
    }

    if (tipeSoal === '1') {
      SoalService.updateSoal({ id_soal: detailSoal.id_soal, kalimat_soal: data.kalimatsoal, huruf_soal: JSON.stringify([...hurufSoal]), huruf_bank: JSON.stringify([...data.pilih_huruf_bank]), data_tambahan: '' })
        .then(response => {
          toast.success('Soal berhasil diedit', { position: 'bottom-center' });
          setTimeout(() => {
            history.push(`/app/detailtugas/${uid}`);
            window.location.reload();
          }, 3000);
        }, (error) => {
          console.log(error);
        });
    } else if (tipeSoal === '2') {
      const formData = new FormData();
      // audiosoal nanti menjadi data_tambahan
      formData.append('audiosoal', data.audiosoal[0]);
      formData.append('id_soal', detailSoal.id_soal);
      formData.append('kalimat_soal', data.kalimatsoal);
      formData.append('huruf_soal', JSON.stringify([...hurufSoal]));
      formData.append('huruf_bank', JSON.stringify([...data.pilih_huruf_bank]));

      SoalService.updateSoal2(formData)
        .then(response => {
          toast.success('Soal berhasil diedit', { position: 'bottom-center' });
          setTimeout(() => {
            history.push(`/app/detailtugas/${uid}`);
            window.location.reload();
          }, 3000);
        }, (error) => {
          console.log(error);
        });
    }
  }

  //const handleSimpan = (data) => {
  //   if (tipeSoal !== '3' && hurufSoal.length < 1) {
  //     toast.error('Harap Lengkapi huruf soal!!', { position: 'bottom-center' })
  //     return;
  //   }

  //   const newData_tambahan ={
  //     garis: [...lines],
  //     titik: [...dot]
  //   }

  //   if (tipeSoal === '1') {
  //     SoalService.createSoal({ id_tugas: uid, tipe: tipeSoal, huruf_soal: JSON.stringify([...hurufSoal]), huruf_bank: JSON.stringify([...data.pilih_huruf_bank]), data_tambahan: ''})
  //       .then(response => {
  //         toast.success('Soal berhasil dibuat', { position: 'bottom-center' });
  //         setTimeout(() => {
  //           history.push(`/app/detailtugas/${uid}`);
  //           window.location.reload();
  //         }, 3000);
  //       }, (error) => {
  //         console.log(error);
  //       });
  //   }else if (tipeSoal === '2') {

  //     const formData = new FormData();
  //     // audiosoal nanti menjadi data_tambahan
  //     formData.append('audiosoal', data.audiosoal[0]);
  //     formData.append('id_tugas', uid);
  //     formData.append('tipe', tipeSoal);
  //     formData.append('huruf_soal', JSON.stringify([...hurufSoal]));
  //     formData.append('huruf_bank', JSON.stringify([...data.pilih_huruf_bank]));

  //     SoalService.createSoal2(formData)
  //       .then(response => {
  //         toast.success('Soal berhasil dibuat', { position: 'bottom-center' });
  //         setTimeout(() => {
  //           history.push(`/app/detailtugas/${uid}`);
  //           window.location.reload();
  //         }, 3000);
  //       }, (error) => {
  //         console.log(error);
  //       });

  //   }
  // }

  const showSelectedOption = () => {
    switch (tipeSoal) {
      case '1':
        return <SoalTipe1 huruf={huruf} hurufSoal={hurufSoal} setHurufSoal={(e) => setHurufSoal(e)} tambahHurufSoal={(e) => tambahHurufSoal(e)} hapusHurufSoal={(e) => hapusHurufSoal(e)} handleSimpan={(e) => handleSimpan(e)} />;
      case '2':
        return <SoalTipe2 huruf={huruf} hurufSoal={hurufSoal} setHurufSoal={(e) => setHurufSoal(e)} tambahHurufSoal={(e) => tambahHurufSoal(e)} hapusHurufSoal={(e) => hapusHurufSoal(e)} handleSimpan={(e) => handleSimpan(e)} />;
      case '3':
        return <SoalTipe3  />;
      default:
        return '';
    }
  }

  return (
    <>
      <Toaster />
      <PageTitle>Edit Data Tugas</PageTitle>

      <div className='mb-8 w-1/2 md:w-1/4'>
        <Label className='mt-4'>
          <span>Jenis Soal</span>
          <Select value={tipeSoal} onChange={(e) => setTipeSoal(e.target.value)} className='mt-1' disabled>
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

export default EditSoal;
