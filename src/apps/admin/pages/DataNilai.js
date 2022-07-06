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
  Input,
  HelperText,
} from "@windmill/react-ui";
import { EditIcon, TrashIcon, PlusIcon } from "../../../icons";

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
  const [dataUsers, setDataUsers] = useState([]);
  const [dataJawaban, setDataJawaban] = useState([]);
  
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

  // on page change, load new sliced data
  // here you would make another server request for new data

  useEffect(() => {
    getAllUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, pageTable]);

  const getAllUsers = () => {
    UserService.getAllUsers().then(
      (response) => {
        const data = response.data.data.filter(e => e.role === '2');
        setDataUsers(data);
        getAllNilai();
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
        data.forEach((e,i) => {
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

  const modifDataJawaban = () => {

    let arrayTemp = [...dataUsers];
    // arrayTemp.forEach((e,i) => {
    //   if (dataUsers.some(s => s.id_user === e.id_user)) {
    //     let index = dataUsers.findIndex(fi => fi.id_user === e.id_user);
    //     arrayTemp[i] = {
    //       ...data[i],
    //       nama: dataUsers[index].nama,
    //       kelas: dataUsers[index].kelas
    //     }
    //   }
    // })

    arrayTemp.forEach((e,i) => {
      if (dataJawaban.some(s => s.id_user === e.id_user)) {
            let index = dataJawaban.findIndex(fi => fi.id_user === e.id_user);
            arrayTemp[i] = {
              ...dataUsers[i],
              id_tugas: dataJawaban[index].id_tugas,
              nama_tugas: dataJawaban[index].nama_tugas,
              totalNilai: dataJawaban[index].totalNilai
            }
          }
    });

    setTotalResults(arrayTemp.length);
    setDataTable(
      arrayTemp.slice(
        (pageTable - 1) * resultsPerPage,
        pageTable * resultsPerPage
      )
    );
  }

  // digunakan untuk modifikasi datajawaban: menambahkan nama dan kelas siswa berdasarkan id_user
  useEffect(() => {
    modifDataJawaban();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataUsers, dataJawaban])
  

  const deleteNilai = (id) => {
    UserService.deleteUser({ id_user: id }).then(res => {
      console.log(res);
      getAllNilai();
      toast.success('Data berhasil dihapus', { position: 'bottom-center' });
    }, (err) => {
      console.log(err);
    })
  }

  return (
    <>
      <Toaster />
      <PageTitle>Data Nilai</PageTitle>

      {/* <CTA /> */}

      {/* <SectionTitle>Data Guru</SectionTitle> */}

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
            {dataTable.map((user, i) => (
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
                    {user.totalNilai ? <Button onClick={() => deleteNilai(user.id_tugas, user.id_user)} layout='link' size='icon' aria-label='Delete'>
                      <TrashIcon className='w-5 h-5' aria-hidden='true' />
                    </Button> : ''}
                  </div>
                </TableCell>
              </TableRow>
            ))}
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
    </>
  );
}

export default Tables;
