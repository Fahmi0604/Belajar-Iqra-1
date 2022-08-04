import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import AuthService from '../services/auth.service'

// import ImageLight from '../assets/img/login-office.jpeg'
// import ImageDark from '../assets/img/login-office-dark.jpeg'
import { GithubIcon, TwitterIcon } from '../icons'
import { Label, Input, Button } from '@windmill/react-ui'
import UserService from '../services/user.service'
import toast, { Toaster } from 'react-hot-toast';
import { ChevronLeftIcon } from '@heroicons/react/solid'

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const history = useHistory();

  const handleLogin = async () => {
    try {
      await AuthService.login(username, password).then(
        (res) => {
          console.log(res);
          toast.success('Berhasil Login', { position: 'bottom-center' });

          UserService.getUserById(res.uid).then(response => {
            if (response.data.data.role === '1' || response.data.data.role === '0') {
              history.push("/app/dashboard");
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            } else {
              setTimeout(() => {
                history.push("/home");
                window.location.reload();
              }, 1000);
            }
          });

          // return res
        },
        (error) => {
          console.log(error);
          if (error.response && error.response.status === 401) {
            toast.error(error.response?.data.data, { position: 'bottom-center' });
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const navigate = (route) => {
    history.push(route);
  }

  return (
    <>
      <Toaster />
      <div className="flex items-center min-h-screen p-6 bg-custom-primary lg:px-25% bg-[image:url('/sky.png')] bg-cover bg-no-repeat bg-bottom">

        <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl">
          <div className="flex flex-col overflow-y-auto md:flex-row">
            <div className="h-32 bg-custom-primary md:h-auto md:w-1/2">
              <img
                aria-hidden="true"
                className="object-cover w-full h-full"
                src='/ilustrasi.svg'
                alt="Office"
              />
              {/* <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={ImageDark}
              alt="Office"
            /> */}
            </div>
            <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
              <div className="w-full">
                <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">Login</h1>
                <Label>
                  <span>Username</span>
                  <Input className="mt-1" type="text" placeholder="john@gmail.com" value={username} onChange={(e) => setUsername(e.target.value)} />
                </Label>

                <Label className="mt-4">
                  <span>Password</span>
                  <Input className="mt-1" type="password" placeholder="***************" value={password} onChange={(e) => setPassword(e.target.value)} />
                </Label>

                <Button className="mt-4" onClick={() => handleLogin()} block>
                  Log in
                </Button>

                {/* <hr className="my-8" /> */}

                {/* <p className="mt-1">
                <Link
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  to="/create-account"
                >
                  Create account
                </Link>
              </p> */}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
