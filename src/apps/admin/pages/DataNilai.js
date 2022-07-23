import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import UserService from "../../../services/user.service";
import JawabanService from "../service/jawaban.service";
import TugasService from "../service/tugas.service";
import AuthService from "../../../services/auth.service";
import { useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';

import PageTitle from "../../../components/Typography/PageTitle";
// import SectionTitle from "../components/Typography/SectionTitle";
// import CTA from "../components/CTA";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Avatar,
  Button,
  Pagination,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Select,
  Input,
  HelperText,
} from "@windmill/react-ui";
import { EditIcon, TrashIcon, PlusIcon } from "../../../icons";
import jawabanService from "../service/jawaban.service";

// import response from "../utils/demo/tableData";
// make a copy of the data, for the second table
// const response2 = response.concat([]);

function Tables() {
  /**
   * DISCLAIMER: This code could be badly improved, but for the sake of the example
   * and readability, all the logic for both table are here.
   * You would be better served by dividing each table in its own
   * component, like Table(?) and TableWithActions(?) hiding the
   * presentation details away from the page view.
   */
  const history = useHistory();
  const [modalDelete, setModalDelete] = useState(false);
  const [idUserForDelete, setIdUserForDelete] = useState('');
  const [idTugasForDelete, setIdTugasForDelete] = useState('');

  const [dataUsers, setDataUsers] = useState([]);
  const [dataJawaban, setDataJawaban] = useState([]);
  const [dataTugas, setDataTugas] = useState([]);
  const [pilihanFilter, setPilihanFilter] = useState('');
  // data tabel yang sudah di tambahkan data user (data fix)
  const [dataJawabanModif, setDataJawabanModif] = useState([]);

  // setup pages control for every table
  const [pageTable, setPageTable] = useState(1);

  // setup data for every table
  const [dataTable, setDataTable] = useState([]);
  const [totalResults, setTotalResults] = useState(0);

  // pagination setup
  const resultsPerPage = 10;
  // const totalResults = dataTable.length;

  // pagination change control
  function onPageChangeTable(p) {
    setPageTable(p);
  }

  function openModalDelete(idUser, idTugas) {
    setIdUserForDelete(idUser);
    setIdTugasForDelete(idTugas);
    setModalDelete(true);
  }

  function closeModalDelete() {
    setIdUserForDelete('');
    setIdTugasForDelete('');
    setModalDelete(false);
  }

  // on page change, load new sliced data
  // here you would make another server request for new data

  useEffect(() => {
    getAllUsers();
    getAllNilai();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, pageTable]);

  useEffect(() => {
    getAllTugas();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  

  const getAllUsers = () => {
    UserService.getAllUsers().then(
      (response) => {
        const data = response.data.data.filter(e => e.role === '2');
        setDataUsers(data);
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

  const getAllNilai = () => {
    JawabanService.getAllJawaban().then(
      (response) => {

        const data = response.data.data || []
        let arrayTemp = [];

        // nilai dijumlah berdasarkan id_tugas dan id_user yang sama dan menjadi totalNilai
        data.forEach((e, i) => {
          if(e.tipe === '1' || e.tipe === '2')
          if (arrayTemp.some(s => s.id_tugas === e.id_tugas && s.id_user === e.id_user)) {
            let index = arrayTemp.findIndex(fi => fi.id_tugas === e.id_tugas && fi.id_user === e.id_user)
            arrayTemp[index].totalNilai = arrayTemp[index].totalNilai + e.nilai;
          } else {
            arrayTemp.push({
              ...e,
              totalNilai: e.nilai
            });
          }
        });

        console.log(arrayTemp);
        setDataJawaban(arrayTemp);
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

  const getAllTugas = () => {
    TugasService.getAllTugas().then(
      (response) => {
        setDataTugas(response.data.tugas);
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

  // digunakan untuk modifikasi data jawaban + data user
  const modifDataJawaban = () => {

    if (pilihanFilter !== '') {
      let arrayTemp = [...dataUsers];

      arrayTemp.forEach((e, i) => {
        if (dataJawaban.some(s => s.id_user === e.id_user && s.id_tugas === parseInt(pilihanFilter))) {
          let index = dataJawaban.findIndex(fi => fi.id_user === e.id_user && fi.id_tugas === parseInt(pilihanFilter));
          arrayTemp[i] = {
            ...dataUsers[i],
            id_tugas: dataJawaban[index].id_tugas,
            nama_tugas: dataJawaban[index].nama_tugas,
            totalNilai: dataJawaban[index].totalNilai
          }
        }
      });

      console.log(arrayTemp);
      setDataJawabanModif(arrayTemp);
      setTotalResults(arrayTemp.length);
      setDataTable(
        arrayTemp.slice(
          (pageTable - 1) * resultsPerPage,
          pageTable * resultsPerPage
        )
      );  
    }
    
  }

  // digunakan untuk modifikasi datajawaban: menambahkan nama dan kelas siswa berdasarkan id_user
  useEffect(() => {
    modifDataJawaban();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataUsers, dataJawaban]);


  const deleteNilai = (idUser, idTugas) => {
    jawabanService.deleteJawabanById({ id_user: idUser, id_tugas: idTugas }).then(res => {
      console.log(res);
      getAllNilai();
      closeModalDelete();
      toast.success('Data berhasil dihapus', { position: 'bottom-center' });
    }, (err) => {
      console.log(err);
    })
  }

  // set data tabel by pilihan filter
  const filterDataTable = (id_tugas) => {
    // const dataFilter = dataJawabanModif.filter(e => e.id_tugas === parseInt(id_tugas));

    let arrayTemp = [...dataUsers];

    arrayTemp.forEach((e, i) => {
      if (dataJawaban.some(s => s.id_user === e.id_user && s.id_tugas === parseInt(id_tugas))) {
        let index = dataJawaban.findIndex(fi => fi.id_user === e.id_user && fi.id_tugas === parseInt(id_tugas));
        arrayTemp[i] = {
          ...dataUsers[i],
          id_tugas: dataJawaban[index].id_tugas,
          nama_tugas: dataJawaban[index].nama_tugas,
          totalNilai: dataJawaban[index].totalNilai
        }
      }
    });

    console.log(arrayTemp);
    setTotalResults(arrayTemp.length);
    setDataTable(
        arrayTemp.slice(
            (pageTable - 1) * resultsPerPage,
            pageTable * resultsPerPage
        )
    );
  }

  useEffect(() => {
      filterDataTable(pilihanFilter);
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pilihanFilter]);

  // digunakan untuk menggenerate data tabel berdasarkan filter
  const generateDataTable = () => {
    if (pilihanFilter !== '') {
      return (
        dataTable.map((user, i) => (
          <TableRow key={i}>
            <TableCell>
              <span className='text-sm font-medium'>{user.nama}</span>
            </TableCell>
            <TableCell>
              <span className='text-sm'>{user.kelas}</span>
            </TableCell>
            <TableCell>
              <span className='text-sm'>{user.nama_tugas ? user.nama_tugas : (<Badge type="warning">belum mengerjakan</Badge>)}</span>
            </TableCell>
            <TableCell>
              <span className='text-sm'>
                {user.totalNilai ? user.totalNilai : (<Badge type="warning">belum mengerjakan</Badge>)}
              </span>
            </TableCell>
            <TableCell>
              <div className='flex items-center'>
                {user.totalNilai ? <Button onClick={() => openModalDelete(user.id_user, user.id_tugas)} layout='link' size='icon' aria-label='Delete'>
                  <TrashIcon className='w-5 h-5' aria-hidden='true' />
                </Button> : ''}
              </div>
            </TableCell>
          </TableRow>
        ))
      )
    } else {
      return null;
    }
  }

  return (
    <>
      <Toaster />
      <PageTitle>Data Nilai</PageTitle>

      <div className="flex flex-col sm:flex-row sm:justify-end mb-4">
        <Label className="my-4">
          <Select className='mt-1' onChange={(e) => setPilihanFilter(e.target.value)}>
            <option value={''}>Pilih kelas</option>
            {dataTugas.map((tugas, index) => (
              <option key={index} value={tugas.id_tugas}>{tugas.nama_tugas}</option>
            ))}
          </Select>
        </Label>
      </div>

      <TableContainer className='mb-8 border'>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Nama</TableCell>
              <TableCell>Kelas</TableCell>
              <TableCell>Nama Tugas</TableCell>
              <TableCell>Nilai</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {generateDataTable()}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            onChange={onPageChangeTable}
            label='Table navigation'
          />
        </TableFooter>
      </TableContainer>

      <Modal isOpen={modalDelete} onClose={closeModalDelete}>
        <ModalHeader>Perhatian!!</ModalHeader>
        <ModalBody>
          Apakah anda yakin untuk menghapus ?
        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeModalDelete}>
              Batal
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button onClick={() => deleteNilai(idUserForDelete, idTugasForDelete)} >Ya</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeModalDelete}>
              Batal
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button onClick={() => deleteNilai(idUserForDelete, idTugasForDelete)} block size="large">
              Ya
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Tables;
