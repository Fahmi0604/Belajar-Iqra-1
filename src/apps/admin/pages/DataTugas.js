import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import AuthService from "../../../services/auth.service";
import TugasService from "../service/tugas.service";

import PageTitle from "../../../components/Typography/PageTitle";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Label, HelperText } from "@windmill/react-ui";
import { EditIcon, TrashIcon, PlusIcon } from "../../../icons";
import toast, { Toaster } from "react-hot-toast";

function DataTugas() {
  const [dataTugas, setDataTugas] = useState([]);
  const [dataSoal, setdataSoal] = useState([]);

  const [modalCreate, setModalCreate] = useState(false)
  const [modalUpdate, setModalUpdate] = useState(false)

  const history = useHistory();
  const { register, formState: { errors }, handleSubmit,resetField } = useForm();
  const { register: register2, formState: { errors: errors2 }, handleSubmit: handleSubmit2, setValue: setValue2 } = useForm();

  useEffect(() => {
    TugasService.getAllTugas().then(
      (response) => {
        setDataTugas(response.data.tugas);
        setdataSoal(response.data.soal);
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

  function openModalCreate() {
    setModalCreate(true);
  }

  function closeModalCreate() {
    resetField('nama_tugas');
    setModalCreate(false);
  }

  function openModalUpdate(id) {
    id && setValue2('id_tugas', id);
    id && setValue2('nama_tugas', dataTugas.filter(e => e.id_tugas === id).map(e => e.nama_tugas));
    setModalUpdate(true);
  }

  function closeModalUpdate() {
    setModalUpdate(false);
  }

  const getAllTugas = () => {
    TugasService.getAllTugas().then(
      (response) => {
        setDataTugas(response.data.tugas);
        setdataSoal(response.data.soal);
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
  }

  const createTugas = (data) => {
    TugasService.createTugas(data).then(res => {
      getAllTugas();
      closeModalCreate();
      toast.success('Data berhasil dibuat', { position: 'bottom-center'});
    }, (err) => {
      console.log(err);
    })
  }

  const updateTugas = (data) => {
    TugasService.updateTugas(data).then(res => {
      getAllTugas();
      closeModalUpdate();
      toast.success('Data berhasil diedit', { position: 'bottom-center'});
    }, (err) => {
      console.log(err);
    })
  }

  const deleteTugas = (id) => {
    console.log(id);
    TugasService.deleteTugas({id_tugas: id}).then(res => {
      getAllTugas();
      toast.success('Data berhasil dihapus', { position: 'bottom-center'});
    }, (err) => {
      console.log(err);
    })
  }

  return (
    <>
      <Toaster />
      <PageTitle>Data Tugas</PageTitle>

      <div className='mb-4'>
        <Button
          onClick={openModalCreate}
          size={"regular"}
          iconRight={PlusIcon}
        >
          <span>Tambah Data</span>
        </Button>
      </div>

      <div className='flex flex-wrap py-3 mb-8'>

        {/* Card */}

        {dataTugas.map((el, index) => (
          <div key={index} className='w-full md:w-1/4 md:mr-4 mb-4 text-left bg-blue-600 shadow-md rounded-lg dark:bg-gray-800'>
            <div className='flex justify-end'>
              <Button onClick={() => openModalUpdate(el.id_tugas)} size='small' icon={EditIcon} />
              <Button onClick={() => deleteTugas(el.id_tugas)} size='small' icon={TrashIcon} />
            </div>

            <Link to={`/app/detailtugas/${el.id_tugas}`}>
            <div className="px-6 pb-4">
              <h2 className='text-xl font-medium text-white dark:text-gray-300'>
                {el.nama_tugas}
              </h2>
              <p className='text-gray-100 dark:text-gray-400 my-2'>
                Kategori Game :{" "}
              </p>
              <div className='flex'>
                {dataSoal.filter((e) => e.id_tugas === el.id_tugas).some((e) => e.tipe === '1') ?
                  <img
                    className='w-10 mr-2'
                    src='/ilustrasi_1.svg'
                    alt='ilustrasibuku'
                  /> : ''
                }

                {dataSoal.filter((e) => e.id_tugas === el.id_tugas).some((e) => e.tipe === '2') ?
                  <img
                    className='w-10 mr-2'
                    src='/ilustrasi_2.svg'
                    alt='ilustrasiheadphone'
                  /> : ''
                }

                {dataSoal.filter((e) => e.id_tugas === el.id_tugas).some((e) => e.tipe === '3') ?
                  <img
                    className='w-10 mr-2'
                    src='/ilustrasi_3.svg'
                    alt='ilustrasimenulis'
                  /> : ''
                }
              </div>
            </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Modal Create */}
      <Modal isOpen={modalCreate} onClose={closeModalCreate}>
        <form onSubmit={handleSubmit(createTugas)}>
        <ModalHeader>Form Tambah Tugas Baru</ModalHeader>
        <ModalBody className="mt-4">
          <div>
            <Label>
              <span>Nama Tugas</span>
              <Input {...register('nama_tugas', { required: 'Nama Tugas is required' })} type="text" placeholder="Masukan Nama Tugas" className="mt-2" />
            </Label>
            {errors.nama_tugas?.message && (
              <HelperText valid={false}>{errors.nama_tugas?.message}</HelperText>
            )}

          </div>
        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeModalCreate}>
              Batal
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button type="submit">Buat</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeModalCreate}>
              Batal
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button type="submit" block size="large">
              Buat
            </Button>
          </div>
        </ModalFooter>
        </form>
      </Modal>

      {/* Modal Update */}
      <Modal isOpen={modalUpdate} onClose={closeModalUpdate}>
        <form onSubmit={handleSubmit2(updateTugas)}>
        <ModalHeader>Form Edit Tugas</ModalHeader>
        <ModalBody className="mt-4">
          <div>
            <Input {...register2('id_tugas')} type="hidden" />
            <Label>
              <span>Nama Tugas</span>
              <Input {...register2('nama_tugas', { required: 'Nama Tugas is required' })} type="text" placeholder="Masukan Nama Tugas" className="mt-2" />
            </Label>
            {errors2.nama_tugas?.message && (
              <HelperText valid={false}>{errors2.nama_tugas?.message}</HelperText>
            )}

          </div>
        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeModalUpdate}>
              Batal
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button type="submit">Simpan</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeModalUpdate}>
              Batal
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button type="submit" block size="large">
              Simpan
            </Button>
          </div>
        </ModalFooter>
        </form>
      </Modal>
    </>
  );
}

export default DataTugas;
