import { v4 } from "uuid";

const SOAL = [
    {
        id_tugas: 1,
        data_soal: {
            'Ta1': [],
            'Ta2': [],
            'Ta3': []
        },
        data_bank: [
            {
                id: v4(),
                content: 'https://boesta.files.wordpress.com/2015/10/1-alif.jpg',
                huruf: 'Alif'
            },
            {
                id: v4(),
                content: 'https://boesta.files.wordpress.com/2015/10/2-ba.jpg',
                huruf: 'Ba'
            },
            {
                id: v4(),
                content: 'https://boesta.files.wordpress.com/2015/10/3-ta.jpg',
                huruf: 'Ta'
            },
            {
                id: v4(),
                content: 'https://boesta.files.wordpress.com/2015/10/4-tsa.jpg',
                huruf: 'Tsa'
            },
            {
                id: v4(),
                content: 'https://boesta.files.wordpress.com/2015/10/5-jim.jpg',
                huruf: 'Jim'
            }
        ]
    },
];

export default SOAL

// username : tgl hari ini
// pass : kombinasi huruf besar/kecil dan symbol