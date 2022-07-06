/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
const routes = [
  {
    path: '/app/dashboard', // the url
    icon: 'HomeIcon', // the component being exported from icons/index.js
    name: 'Dashboard', // name that appear in Sidebar
  },
  {
    path: '/app/dataguru',
    icon: 'UserIcon',
    name: 'Data Guru',
  },
  {
    path: '/app/datasiswa',
    icon: 'UserIcon',
    name: 'Data Siswa',
  },
  {
    path: '/app/datatugas',
    icon: 'FormsIcon',
    name: 'Data Tugas',
  },
  {
    path: '/app/datanilai',
    icon: 'FormsIcon',
    name: 'Data Nilai',
  }
]

export default routes
