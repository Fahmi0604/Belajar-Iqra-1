import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
// import UserService from "../../../services/user.service";
import AuthService from "../../../services/auth.service";
import AngkatanService from "../service/angkatan.service";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

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

function DataAngkatan() {
  /**
   * DISCLAIMER: This code could be badly improved, but for the sake of the example
   * and readability, all the logic for both table are here.
   * You would be better served by dividing each table in its own
   * component, like Table(?) and TableWithActions(?) hiding the
   * presentation details away from the page view.
   */
  const history = useHistory();
  const [modalCreate, setModalCreate] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [idAngkatanForDelete, setIdAngkatanForDelete] = useState("");

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    resetField,
  } = useForm();
  const {
    register: register2,
    formState: { errors: errors2 },
    handleSubmit: handleSubmit2,
    setValue: setValue2,
    resetField: resetField2,
  } = useForm();

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

  function openModalCreate() {
    setModalCreate(true);
  }

  function closeModalCreate() {
    resetField("nama_angkatan");
    setModalCreate(false);
  }

  function openModalUpdate(id) {
    setValue2("id_angkatan", id);
    setValue2(
      "edit_nama_angkatan",
      dataTable.filter((e) => e.id_angkatan === id).map((e) => e.nama_angkatan)
    );
    setModalUpdate(true);
  }

  function closeModalUpdate() {
    setModalUpdate(false);
  }

  function openModalDelete(id) {
    setIdAngkatanForDelete(id);
    setModalDelete(true);
  }

  function closeModalDelete() {
    setIdAngkatanForDelete("");
    setModalDelete(false);
  }

  // on page change, load new sliced data
  // here you would make another server request for new data

  useEffect(() => {
    AngkatanService.getAllAngkatan().then(
      (response) => {
        const data = response.data.data;

        console.log(data);

        setTotalResults(data.length);
        setDataTable(
          data.slice(
            (pageTable - 1) * resultsPerPage,
            pageTable * resultsPerPage
          )
        );
      },
      (error) => {
        toast.error(error, { position: "bottom-center" });
        console.log("Private page", error.response);
        // Invalid token
        if (error.response && error.response.status === 401) {
          AuthService.logout();
          history.push("/login");
          window.location.reload();
        }
      }
    );
  }, [history, pageTable]);

  const getAllAngkatan = () => {
    AngkatanService.getAllAngkatan().then(
      (response) => {
        const data = response.data.data;

        setTotalResults(data.length);
        setDataTable(
          data.slice(
            (pageTable - 1) * resultsPerPage,
            pageTable * resultsPerPage
          )
        );
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
  };

  const createAngkatan = (data) => {
    AngkatanService.createAngkatan({
      ...data,
    }).then(
      (res) => {
        getAllAngkatan();
        closeModalCreate();
        toast.success("Data berhasil dibuat", { position: "bottom-center" });
      },
      (error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          AuthService.logout();
          history.push("/login");
          window.location.reload();
        }
      }
    );
  };

  const updateAngkatan = (data) => {
    AngkatanService.updateAngkatan({
      nama_angkatan: data.edit_nama_angkatan,
      id_angkatan: data.id_angkatan,
    }).then(
      (res) => {
        getAllAngkatan();
        closeModalUpdate();
        toast.success("Data berhasil diedit", { position: "bottom-center" });
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const updateStatusAngkatan = (id_angkatan) => {
    console.log(id_angkatan);
    AngkatanService.updateStatusAngkatan({
      status_angkatan: 1,
      id_angkatan: id_angkatan,
    }).then(
      (res) => {
        getAllAngkatan();
        toast.success("Data berhasil diedit", { position: "bottom-center" });
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const deleteAngkatan = (id) => {
    AngkatanService.deleteAngkatan({ id_angkatan: id }).then(
      (res) => {
        // console.log(res);
        closeModalDelete();
        getAllAngkatan();
        toast.success("Data berhasil dihapus", { position: "bottom-center" });
      },
      (err) => {
        console.log(err);
      }
    );
  };

  useEffect(() => {
    // console.log(totalResults);
    // console.log(errors);
    // console.log(register);
    // console.log(dataTable);
  }, [totalResults, dataTable, errors, register]);

  return (
    <>
      <Toaster />
      <PageTitle>Data Angkatan</PageTitle>

      {/* <CTA /> */}

      {/* <SectionTitle>Data Guru</SectionTitle> */}
      <div className='mb-4'>
        <Button
          onClick={() => openModalCreate()}
          size={"regular"}
          iconRight={PlusIcon}
        >
          <span>Tambah Data</span>
        </Button>
      </div>

      <TableContainer className='mb-8 border'>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>ID Angkatan</TableCell>
              <TableCell>Nama Angkatan</TableCell>
              <TableCell>Status Angkatan</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {dataTable.map((element, i) => (
              <TableRow key={i}>
                <TableCell>
                  <span className='text-sm'>{element.id_angkatan}</span>
                </TableCell>
                <TableCell>
                  <span className='text-sm'>{element.nama_angkatan}</span>
                </TableCell>
                <TableCell>
                  <Label radio>
                    <Input
                      type='radio'
                      name='status_angkatan'
                      value={element.id_angkatan}
                      checked={element.status_angkatan}
                      onChange={(e) => updateStatusAngkatan(e.target.value)}
                    />
                    <span className='ml-2'>
                      {" "}
                      {element?.status_angkatan ? "Aktif" : "Selesai"}
                    </span>
                  </Label>
                </TableCell>
                <TableCell>
                  <div className='flex items-center space-x-4'>
                    <Button
                      onClick={() => openModalUpdate(element.id_angkatan)}
                      layout='link'
                      size='icon'
                      aria-label='Edit'
                    >
                      <EditIcon className='w-5 h-5' aria-hidden='true' />
                    </Button>
                    <Button
                      onClick={() => openModalDelete(element.id_angkatan)}
                      layout='link'
                      size='icon'
                      aria-label='Delete'
                    >
                      <TrashIcon className='w-5 h-5' aria-hidden='true' />
                    </Button>
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

      {/* create */}
      <Modal isOpen={modalCreate} onClose={closeModalCreate}>
        <form onSubmit={handleSubmit(createAngkatan)}>
          <ModalHeader>Form Tambah Data Angkatan</ModalHeader>
          <ModalBody className='mt-4'>
            <div>
              <Label>
                <span>Nama Angkatan</span>
                <Input
                  {...register("nama_angkatan", {
                    required: "Nama Angkatan is required",
                  })}
                  type='text'
                  placeholder='Masukan Nama Angkatan'
                  className='mt-2'
                />
              </Label>
              {errors.nama_angkatan?.message && (
                <HelperText valid={false}>
                  {errors.nama_angkatan?.message}
                </HelperText>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <div className='hidden sm:block'>
              <Button layout='outline' onClick={closeModalCreate}>
                Batal
              </Button>
            </div>
            <div className='hidden sm:block'>
              <Button type='submit'>Simpan</Button>
            </div>
            <div className='block w-full sm:hidden'>
              <Button
                block
                size='large'
                layout='outline'
                onClick={closeModalCreate}
              >
                Batal
              </Button>
            </div>
            <div className='block w-full sm:hidden'>
              <Button type='submit' block size='large'>
                Simpan
              </Button>
            </div>
          </ModalFooter>
        </form>
      </Modal>

      {/* Modal update */}
      <Modal isOpen={modalUpdate} onClose={closeModalUpdate}>
        <form onSubmit={handleSubmit2(updateAngkatan)}>
          <ModalHeader>Form Edit Data Angkatan</ModalHeader>
          <ModalBody className='mt-4'>
            <div>
              <Input {...register2("id_angkatan")} type='hidden' />
              <Label>
                <span>Nama Angkatan</span>
                <Input
                  {...register2("edit_nama_angkatan", {
                    required: "Nama Angkatan is required",
                  })}
                  type='text'
                  placeholder='Masukan Nama Angkatan'
                  className='mt-2'
                />
              </Label>
              {errors2.edit_nama_angkatan?.message && (
                <HelperText valid={false}>
                  {errors2.edit_nama_angkatan?.message}
                </HelperText>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <div className='hidden sm:block'>
              <Button layout='outline' onClick={closeModalUpdate}>
                Batal
              </Button>
            </div>
            <div className='hidden sm:block'>
              <Button type='submit'>Simpan</Button>
            </div>
            <div className='block w-full sm:hidden'>
              <Button
                block
                size='large'
                layout='outline'
                onClick={closeModalUpdate}
              >
                Batal
              </Button>
            </div>
            <div className='block w-full sm:hidden'>
              <Button type='submit' block size='large'>
                Simpan
              </Button>
            </div>
          </ModalFooter>
        </form>
      </Modal>

      <Modal isOpen={modalDelete} onClose={closeModalDelete}>
        <ModalHeader>Perhatian!!</ModalHeader>
        <ModalBody>Apakah anda yakin untuk menghapus ?</ModalBody>
        <ModalFooter>
          <div className='hidden sm:block'>
            <Button layout='outline' onClick={closeModalDelete}>
              Batal
            </Button>
          </div>
          <div className='hidden sm:block'>
            <Button onClick={() => deleteAngkatan(idAngkatanForDelete)}>
              Ya
            </Button>
          </div>
          <div className='block w-full sm:hidden'>
            <Button
              block
              size='large'
              layout='outline'
              onClick={closeModalDelete}
            >
              Batal
            </Button>
          </div>
          <div className='block w-full sm:hidden'>
            <Button
              onClick={() => deleteAngkatan(idAngkatanForDelete)}
              block
              size='large'
            >
              Ya
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default DataAngkatan;
