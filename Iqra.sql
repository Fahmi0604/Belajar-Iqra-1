CREATE TABLE `users` (
  `id_user` int PRIMARY KEY AUTO_INCREMENT,
  `nama` varchar(255),
  `role` ENUM ('1', '2'),
  `image` varchar(255),
  `coin` int
);

CREATE TABLE `tugas` (
  `id_tugas` int PRIMARY KEY AUTO_INCREMENT,
  `nama_tugas` varchar(255)
);

CREATE TABLE `huruf` (
  `id_huruf` int PRIMARY KEY AUTO_INCREMENT,
  `nama_huruf` varchar(255),
  `image` varchar(255)
);

CREATE TABLE `soal` (
  `id_soal` int PRIMARY KEY AUTO_INCREMENT,
  `id_tugas` int,
  `tipe` ENUM ('1', '2', '3'),
  `huruf_soal` text,
  `data_tambahan` varchar(255)
);

CREATE TABLE `jawaban` (
  `id_jawab` int PRIMARY KEY AUTO_INCREMENT,
  `id_user` int,
  `id_soal` int,
  `jawab` varchar(255),
  `nilai` float
);

CREATE TABLE `barang` (
  `id_barang` int PRIMARY KEY AUTO_INCREMENT,
  `nama_barang` int,
  `harga` int,
  `image` varchar(255)
);

ALTER TABLE `soal` ADD FOREIGN KEY (`id_tugas`) REFERENCES `tugas` (`id_tugas`);

ALTER TABLE `jawaban` ADD FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`);

ALTER TABLE `soal` ADD FOREIGN KEY (`id_soal`) REFERENCES `jawaban` (`id_soal`);
