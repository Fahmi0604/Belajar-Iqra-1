import React, {useState} from 'react'
import { Link, useHistory } from 'react-router-dom'
import AuthService from '../services/auth.service'

// import ImageLight from '../assets/img/login-office.jpeg'
// import ImageDark from '../assets/img/login-office-dark.jpeg'
import { GithubIcon, TwitterIcon } from '../icons'
import { Label, Input, Button } from '@windmill/react-ui'
import UserService from '../services/user.service'
import toast, { Toaster } from 'react-hot-toast';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const history = useHistory();

  const handleLogin = async () => {
    try {
      await AuthService.login(email, password).then(
        (res) => {
          toast.success('Berhasil Login', { position: 'bottom-center' });

          UserService.getUserById(res.uid).then(response => {
            if (response.data.data.role === '2') {
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

          return res
        },
        (error) => {
          console.log(error);
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
    <Toaster />
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 bg-custom-primary md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
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
                <span>Email</span>
                <Input className="mt-1" type="email" placeholder="john@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
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
