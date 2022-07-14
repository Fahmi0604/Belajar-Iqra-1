import React, { useState, useEffect } from 'react'
import CTA from '../../../components/CTA'
import InfoCard from '../../../components/Cards/InfoCard'
import ChartCard from '../../../components/Chart/ChartCard'
import { Doughnut, Line } from 'react-chartjs-2'
import ChartLegend from '../../../components/Chart/ChartLegend'
import PageTitle from '../../../components/Typography/PageTitle'
import { ChatIcon, ModalsIcon, TablesIcon, UserIcon } from '../../../icons'
import { ClockIcon, UserGroupIcon } from '@heroicons/react/solid'
import RoundIcon from '../../../components/RoundIcon'
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
} from '@windmill/react-ui'
import UserService from '../../../services/user.service'
import AuthService from '../../../services/auth.service'
import TugasService from '../service/tugas.service'
// import {
//   doughnutOptions,
//   lineOptions,
//   doughnutLegends,
//   lineLegends,
// } from '../../../utils/demo/chartsData'
import { useHistory } from 'react-router-dom'

const doughnutLegends = [
  { title: 'A1', color: 'bg-blue-500' },
  { title: 'A2', color: 'bg-teal-500' },
];

function Dashboard() {

  const history = useHistory();
  const [dataUsers, setDataUsers] = useState([]);
  const [dataTugas, setDataTugas] = useState([]);
  const [dataSoal, setDataSoal] = useState([]);
  
  const [barLegends, setBarLegends] = useState();

  const [doughnutOptions, setDoughnutOptions] = useState({
    data: {
        datasets: [
            {
                data: [0, 0],
                /**
                 * These colors come from Tailwind CSS palette
                 * https://tailwindcss.com/docs/customizing-colors/#default-color-palette
                 */
                backgroundColor: ['#22c55e', '#f97316'],
                label: 'Dataset 1',
            },
        ],
        labels: ['Kelas A2', 'Kelas A1'],
    },
    options: {
        responsive: true,
        cutoutPercentage: 80,
    },
    legend: {
        display: false,
    },
  });
  
  const getAllUsers = () => {
    UserService.getAllUsers().then(
      (response) => {
        const data = response.data.data.filter(e => e.role === '2');
        setDataUsers(data);
        // setting donut chart
        setDoughnutOptions({
          ...doughnutOptions,
          data: {
              datasets: [
                  {
                      data: [
                          data.filter(e => e.kelas === 'A2').length,
                          data.filter(e => e.kelas === 'A1').length,
                      ],
                      backgroundColor: ['#0694a2', '#1c64f2'],
                      label: 'Dataset 1',
                  }
              ]
          }
        });
        console.log(data.filter(e => e.kelas === 'A1').length)
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
        setDataSoal(response.data.soal);
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

  useEffect(() => {
    getAllUsers();
    getAllTugas();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PageTitle>Dashboard</PageTitle>

      <CTA />

      {/* <!-- Cards --> */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="Total Guru" value="35">
          <RoundIcon
            icon={UserGroupIcon}
            iconColorClass="text-teal-500 dark:text-teal-100"
            bgColorClass="bg-teal-100 dark:bg-teal-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Total Siswa" value={dataUsers.length}>
          <RoundIcon
            icon={UserIcon}
            iconColorClass="text-orange-500 dark:text-orange-100"
            bgColorClass="bg-orange-100 dark:bg-orange-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Total Tugas" value={dataTugas.length}>
          <RoundIcon
            icon={ModalsIcon}
            iconColorClass="text-green-500 dark:text-green-100"
            bgColorClass="bg-green-100 dark:bg-green-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Total Soal" value={dataSoal.length}>
          <RoundIcon
            icon={TablesIcon}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
          />
        </InfoCard>
      </div>

      <PageTitle>Charts</PageTitle>
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <ChartCard title="Total siswa per kelas">
          <Doughnut {...doughnutOptions} />
          <ChartLegend legends={doughnutLegends} />
        </ChartCard>

        {/* <ChartCard title="Traffic">
          <Line {...lineOptions} />
          <ChartLegend legends={lineLegends} />
        </ChartCard> */}

        {/* <ChartCard title="Status Absen hari ini">
            <Bar {...barOptions} />
            <ChartLegend legends={barLegends} />
        </ChartCard> */}
      </div>
    </>
  )
}

export default Dashboard
