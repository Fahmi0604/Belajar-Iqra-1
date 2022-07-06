import { lazy } from 'react'

// use lazy for better code splitting, a.k.a. load faster
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Forms = lazy(() => import('../../../pages/Forms'))
const Cards = lazy(() => import('../../../pages/Cards'))
const Charts = lazy(() => import('../../../pages/Charts'))
const Buttons = lazy(() => import('../../../pages/Buttons'))
const Modals = lazy(() => import('../../../pages/Modals'))
const DataGuru = lazy(() => import('../pages/DataGuru'))
const DataSiswa = lazy(() => import('../pages/DataSiswa'))
const Page404 = lazy(() => import('../../../pages/404'))
const Blank = lazy(() => import('../../../pages/Blank'))
const DataTugas = lazy(() => import('../pages/DataTugas'))
const DataNilai = lazy(() => import('../pages/DataNilai'))
const TambahSoal = lazy(() => import('../pages/TambahSoal'))
const EditSoal =lazy(() => import('../pages/EditSoal'))
const DetailTugas = lazy(() => import( '../pages/DetailTugas'))

/**
 * ⚠ These are internal routes!
 * They will be rendered inside the app, using the default `containers/Layout`.
 * If you want to add a route to, let's say, a landing page, you should add
 * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
 * are routed.
 *
 * If you're looking for the links rendered in the SidebarContent, go to
 * `routes/sidebar.js`
 */
const routes = [
  {
    path: '/dashboard', // the url
    component: Dashboard, // view rendered
  },
  {
    path: '/forms',
    component: Forms,
  },
  {
    path: '/cards',
    component: Cards,
  },
  {
    path: '/charts',
    component: Charts,
  },
  {
    path: '/buttons',
    component: Buttons,
  },
  {
    path: '/modals',
    component: Modals,
  },
  {
    path: '/dataguru',
    component: DataGuru,
  },
  {
    path: '/datasiswa',
    component: DataSiswa,
  },
  {
    path: '/datatugas',
    component: DataTugas,
  },
  {
    path: '/datanilai',
    component: DataNilai,
  },
  {
    path: '/detailtugas/:uid',
    component: DetailTugas,
  },
  {
    path: '/tambahsoal/:uid',
    component: TambahSoal,
  },
  {
    path: '/editsoal/:uid',
    component: EditSoal,
  },
  {
    path: '/404',
    component: Page404,
  },
  {
    path: '/blank',
    component: Blank,
  },
]

export default routes
