import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import TokoService from "../service/toko.service";
import AuthService from "../../../services/auth.service";
import toast, { Toaster } from "react-hot-toast";
import PageTitle from "../../../components/Typography/PageTitle";
import { Input, HelperText } from "@windmill/react-ui";
import { useForm } from "react-hook-form";

export default function DataToko() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    resetField,
  } = useForm();

  const history = useHistory();
  const [dataToko, setDataToko] = useState([]);
  const [modalUpdate, setModalUpdate] = useState(false);

  useEffect(() => {
    getAllToko();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  const getAllToko = () => {
    TokoService.getAllToko().then(
      (res) => {
        setDataToko(res.data.data);
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

  useEffect(() => {
    dataToko.forEach((e, i) => {
      setValue(`harga${i + 1}`, e?.harga);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataToko]);

  const updateToko = (id, value) => {
    TokoService.updateToko({ id_toko: id, harga: value }).then(
      (res) => {
        getAllToko();
        toast.success("Data berhasil diedit", { position: "bottom-center" });
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const toPascalCase = (str) =>
    (str.match(/[a-zA-Z0-9]+/g) || [])
      .map((w) => `${w.charAt(0).toUpperCase()}${w.slice(1)}`)
      .join(" ");

  return (
    <>
      <Toaster />
      <PageTitle>Data Toko Penukaran</PageTitle>

      <div className='w-full flex flex-wrap'>
        {dataToko.map((e, i) => (
          <div
            key={i}
            className='flex w-full md:w-48% lg:w-31% bg-custom-secondary mx-1% mb-4 p-4 rounded'
          >
            <div className='w-1/2 flex justify-center items-center'>
              <img src={`/${e?.nama_barang}.svg`} alt='gambar' />
            </div>

            <div className='w-1/2 flex flex-col items-center '>
              <h2 className='text-white'>{toPascalCase(e?.nama_barang)}</h2>
              <p className='mt-2 mb-4'>Harga : </p>
              <div className='w-1/2'>
                <Input
                  {...register(`harga${i + 1}`, {
                    required: "Harga is required",
                  })}
                  onChange={(o) => updateToko(e?.id_toko, o.target.value)}
                  placeholder='Harga'
                  type='number'
                />
                {errors.harga?.message && (
                  <HelperText valid={false}>{errors.harga?.message}</HelperText>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
