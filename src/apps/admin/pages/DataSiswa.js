import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import UserService from "../../../services/user.service";
import AuthService from "../../../services/auth.service";
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
  Select,
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
  const [modalCreate, setModalCreate] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [idUserForDelete, setIdUserForDelete] = useState("");

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
    resetField("nama");
    resetField("username");
    resetField("password");
    setModalCreate(false);
  }

  function openModalUpdate(id) {
    setValue2("id_user", id);
    setValue2(
      "edit_nama",
      dataTable.filter((e) => e.id_user === id).map((e) => e.nama)
    );
    setValue2(
      "edit_jenis_kelamin",
      dataTable.filter((e) => e.id_user === id).map((e) => e.jenis_kelamin)
    );
    setValue2(
      "edit_kelas",
      dataTable.filter((e) => e.id_user === id).map((e) => e.kelas)
    );
    setModalUpdate(true);
  }

  function closeModalUpdate() {
    setModalUpdate(false);
  }

  function openModalDelete(id) {
    setIdUserForDelete(id);
    setModalDelete(true);
  }

  function closeModalDelete() {
    setIdUserForDelete("");
    setModalDelete(false);
  }

  // on page change, load new sliced data
  // here you would make another server request for new data

  useEffect(() => {
    UserService.getAllUsers().then(
      (response) => {
        const data = response.data.data.filter((e) => e.role === "2");

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

  const getAllUsers = () => {
    UserService.getAllUsers().then(
      (response) => {
        const data = response.data.data.filter((e) => e.role === "2");

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

  const generateProfil = (jenis_kelamin) => {
    let dataImageProfil;

    if (jenis_kelamin === "Laki-Laki") {
      dataImageProfil = [
        {
          nama: "profil_laki",
          unlock: true,
          use: true,
        },
        {
          nama: "profil_perempuan",
          unlock: true,
          use: false,
        },
        {
          nama: "profil_kucing",
          unlock: false,
          use: false,
        },
        {
          nama: "profil_anjing",
          unlock: false,
          use: false,
        },
        {
          nama: "profil_pinguin",
          unlock: false,
          use: false,
        },
        {
          nama: "profil_kelinci",
          unlock: false,
          use: false,
        },
        {
          nama: "profil_rare_anjing",
          unlock: false,
          use: false,
        },
        {
          nama: "profil_rare_poni",
          unlock: false,
          use: false,
        },
      ];
    } else if (jenis_kelamin === "Perempuan") {
      dataImageProfil = [
        {
          nama: "profil_laki",
          unlock: true,
          use: false,
        },
        {
          nama: "profil_perempuan",
          unlock: true,
          use: true,
        },
        {
          nama: "profil_kucing",
          unlock: false,
          use: false,
        },
        {
          nama: "profil_anjing",
          unlock: false,
          use: false,
        },
        {
          nama: "profil_pinguin",
          unlock: false,
          use: false,
        },
        {
          nama: "profil_kelinci",
          unlock: false,
          use: false,
        },
        {
          nama: "profil_rare_anjing",
          unlock: false,
          use: false,
        },
        {
          nama: "profil_rare_poni",
          unlock: false,
          use: false,
        },
      ];
    }

    return JSON.stringify(dataImageProfil);
  };

  const createUser = (data) => {
    console.log({
      ...data,
      username: data.username,
      password: data.username,
      role: "2",
      coin: 0,
      image: generateProfil(data.jenis_kelamin),
    });
    UserService.createUser({
      ...data,
      username: data.username,
      password: data.username,
      role: "2",
      coin: 0,
      image: generateProfil(data.jenis_kelamin),
    }).then(
      (res) => {
        getAllUsers();
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
        if (error.response && error.response.status === 409) {
          toast.error("Username sudah terdaftar !!!", {
            position: "bottom-center",
          });
        }
      }
    );
  };

  const updateUser = (data) => {
    const sendData = {
      id_user: data.id_user,
      nama: data.edit_nama,
      jenis_kelamin: data.edit_jenis_kelamin,
      kelas: data.edit_kelas,
    };

    console.log(sendData);
    UserService.updateSiswa(sendData).then(
      (res) => {
        getAllUsers();
        closeModalUpdate();
        toast.success("Data berhasil diedit", { position: "bottom-center" });
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const deleteUser = (id) => {
    UserService.deleteUser({ id_user: id }).then(
      (res) => {
        // console.log(res);
        closeModalDelete();
        getAllUsers();
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
      <PageTitle>Data Siswa</PageTitle>

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
              <TableCell>Nama</TableCell>
              <TableCell>Jenis Kelamin</TableCell>
              <TableCell>Kelas</TableCell>
              <TableCell>Koin</TableCell>
              <TableCell>Terakhir Login</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {dataTable.map((user, i) => (
              <TableRow key={i}>
                <TableCell>
                  <span className='text-sm'>{user.nama}</span>
                </TableCell>
                <TableCell>
                  <span className='text-sm'>{user.jenis_kelamin}</span>
                </TableCell>
                <TableCell>
                  <span className='text-sm'>{user.kelas}</span>
                </TableCell>
                <TableCell>
                  <span className='text-sm'>{user.coin}</span>
                </TableCell>
                <TableCell>
                  <span className='text-sm'>
                    {new Date(user.terakhir_login).toLocaleString()}
                  </span>
                </TableCell>
                <TableCell>
                  <div className='flex items-center space-x-4'>
                    <Button
                      onClick={() => openModalUpdate(user.id_user)}
                      layout='link'
                      size='icon'
                      aria-label='Edit'
                    >
                      <EditIcon className='w-5 h-5' aria-hidden='true' />
                    </Button>
                    <Button
                      onClick={() => openModalDelete(user.id_user)}
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

      <Modal isOpen={modalCreate} onClose={closeModalCreate}>
        <form onSubmit={handleSubmit(createUser)}>
          <ModalHeader>Form Tambah Data Siswa</ModalHeader>
          <ModalBody className='mt-4'>
            <div>
              <Label>
                <span>Username</span>
                <Input
                  {...register("username", {
                    required: "Username is required",
                  })}
                  type='text'
                  placeholder='Masukan Username'
                  className='mt-2'
                />
              </Label>
              {!errors.username?.message && (
                <HelperText valid={true}>
                  *Username berisi nama digabungkan dengan no absen
                </HelperText>
              )}
              {errors.username?.message && (
                <HelperText valid={false}>
                  {errors.username?.message}
                </HelperText>
              )}

              <Label className='mt-4'>
                <span>Nama</span>
                <Input
                  {...register("nama", { required: "Nama is required" })}
                  type='text'
                  placeholder='Masukan Nama'
                  className='mt-2'
                />
              </Label>
              {errors.nama?.message && (
                <HelperText valid={false}>{errors.nama?.message}</HelperText>
              )}

              <Label className='mt-2'>
                <span>Jenis Kelamin</span>
                <Select
                  {...register("jenis_kelamin", {
                    required: "Jenis Kelamin is required",
                  })}
                  className='mt-2'
                >
                  <option value=''>-</option>
                  <option value='Laki-Laki'>Laki-Laki</option>
                  <option value='Perempuan'>Perempuan</option>
                </Select>
              </Label>
              {errors.jenis_kelamin?.message && (
                <HelperText valid={false}>
                  {errors.jenis_kelamin?.message}
                </HelperText>
              )}

              <Label className='mt-2'>
                <span>Kelas</span>
                <Select
                  {...register("kelas", { required: "Kelas is required" })}
                  className='mt-2'
                >
                  <option value=''>-</option>
                  <option value='A1'>A1</option>
                  <option value='A2'>A2</option>
                </Select>
              </Label>
              {errors.kelas?.message && (
                <HelperText valid={false}>{errors.kelas?.message}</HelperText>
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
        <form onSubmit={handleSubmit2(updateUser)}>
          <ModalHeader>Form Edit Data Siswa</ModalHeader>
          <ModalBody className='mt-4'>
            <div>
              <Input {...register2("id_user")} type='hidden' />
              <Label>
                <span>Nama</span>
                <Input
                  {...register2("edit_nama", { required: "Nama is required" })}
                  type='text'
                  placeholder='Masukan Nama'
                  className='mt-2'
                />
              </Label>
              {errors2.edit_nama?.message && (
                <HelperText valid={false}>
                  {errors2.edit_nama?.message}
                </HelperText>
              )}

              <Label className='mt-2'>
                <span>Jenis Kelamin</span>
                <Select
                  {...register2("edit_jenis_kelamin", {
                    required: "Jenis Kelamin is required",
                  })}
                  className='mt-2'
                >
                  <option value=''>-</option>
                  <option value='Laki-Laki'>Laki-Laki</option>
                  <option value='Perempuan'>Perempuan</option>
                </Select>
              </Label>
              {errors2.edit_jenis_kelamin?.message && (
                <HelperText valid={false}>
                  {errors2.edit_jenis_kelamin?.message}
                </HelperText>
              )}

              <Label className='mt-2'>
                <span>Kelas</span>
                <Select
                  {...register2("edit_kelas", {
                    required: "Kelas is required",
                  })}
                  className='mt-2'
                >
                  <option value=''>-</option>
                  <option value='A1'>A1</option>
                  <option value='A2'>A2</option>
                </Select>
              </Label>
              {errors2.edit_kelas?.message && (
                <HelperText valid={false}>
                  {errors2.edit_kelas?.message}
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

      {/* Modal Delete */}
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
            <Button onClick={() => deleteUser(idUserForDelete)}>Ya</Button>
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
              onClick={() => deleteUser(idUserForDelete)}
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

export default Tables;
