# -*- coding: utf-8 -*-
"""Baris TEMPLE yang ditulis tangan."""
TANGAN = {}
def t(n, badan, komentar=None): TANGAN[n] = (badan, komentar)

# --- 15-340: layar pembuka grafik ------------------------------------------
t(15, "m.v.N = 0;", "VAL(MID$(TIME$,7,2)) — detik dari jam.")
t(20, "/* RANDOMIZE N */")
t(70, "m.layar(1); m.cls();")
t(80, "m.lingkaran(20, 20, 20);")
t(90, "m.cat(30, 30, 2, 3);")
t(100, "m.lingkaran(240, 30, 15);")
t(110, "m.cat(240, 30, 1, 3);")
t(120, "m.pset(60, 125);")
t(130, "m.gambar('e100;f100;l199');")
t(140, "m.garis(360, 125, 0, 360, null, 'BF');",
   "Koordinat x=360 di layar selebar 320. GW-BASIC memotongnya; yang tergambar\n"
   "     cuma bagian yang muat. Dua baris berturut-turut melakukannya, dan yang\n"
   "     kedua (baris 160) menimpanya dengan warna lain.")
t(150, "m.cat(100, 100, 3);")
t(160, "m.garis(360, 125, 0, 360, 1, 'BF');")
t(230, "m.lingkaran(m.v.I, m.v.F, m.v.R, 3);",
   "Dua ratus bintang, masing-masing digambar sebagai lingkaran berjari-jari 1\n"
   "     lalu 0 — gelung `FOR R=1 TO 0 STEP -1` di baris 220.")
t(310, "m.lingkaran(160, 100, m.v.X, null, null, null, 1);",
   "Aspek 1 membuatnya BUKAN lingkaran: piksel SCREEN 1 tidak persegi, jadi\n"
   "     aspek 1 menghasilkan elips gepeng. Lima puluh satu di antaranya, mengecil\n"
   "     dari 200 ke 0 — terowongan yang menutup.")
t(610, "/* SOUND QWER,1 */")
t(780, "/* DEFINT A-Z */")

# --- 810-850: lima fungsi satu baris ---------------------------------------
t(810, "/* DEF FNA(Q)=1+INT(RND(1)*Q) — lihat FNA() di atas */",
   "Lima `DEF FN` berturut-turut, dan kelimanya menyimpan seluruh aritmetika\n"
   "     permainan ini. Bentuknya sama persis dengan WIZARD.BAS baris 240-280 —\n"
   "     program induknya di Recreational Computing, 1980.")
t(820, "/* DEF FNB(Q)=Q+8*((Q=9)-(Q=0)) */")
t(830, "/* DEF FNC(Q)=-Q*(Q<19)-18*(Q>18) */")
t(840, "/* DEF FND(Q)=64*(Q-1)+8*(X-1)+Y */")
t(850, "/* DEF FNE(Q)=Q+100*(Q>99) */")
t(930, "m.ulangData(0);")

t(1790, "m.v['R$()'][3] = 'Man';")
t(1930, "m.v.TC = 0; m.v['GP!'] = 60; m.v.RF = 0; m.v.OF = 0;\n"
        "      m.v.BL = 0; m.v.IQ = 8; m.v.SX = 0;")
t(1970, "m.cetak(m.chr(7));")

# --- 2100-2920: membuat tokoh ----------------------------------------------
t(2100, "if ((m.v['R$()'][m.v.Q] || '').charAt(0) === m.v['O$']) {\n"
        "        m.v.RC = m.v.Q; m.v.ST = m.v.STR * m.v.Q; m.v.DX = m.v.DEX * m.v.Q;\n"
        "      }",
   "Bangsa dipilih dari HURUF PERTAMA namanya, dan nomor bangsanya langsung\n"
   "     jadi PENGALI kekuatan: Hobbit (1) paling lemah, Elf (2), Man (3),\n"
   "     Dwarf (4) paling kuat. Satu perkalian menggantikan tabel sifat bangsa.")
t(2110, "if (m.v.ST > 18) m.v.ST = 18;")
t(2120, "if (m.v.DX > 18) m.v.DX = 18;")
t(2160, "if (m.v.RC > 0) { m.v['R$()'][3] = 'Human'; m.lompat(2190); }",
   "Kalau pemainnya memilih bangsa, `R$(3)` diganti dari 'Man' jadi 'Human' —\n"
   "     supaya kalimat 'you are a Man' terbaca wajar tapi 'Are you a Human?'\n"
   "     juga wajar. Satu kata yang berubah menurut kalimat yang memakainya.")
t(2230, "m.warna(11, 0); m.cetak('** Cute ' + m.v['R$()'][m.v.RC] +\n"
        "                            ', Real cute. Try M OR F.');\n"
        "      m.barisBaru(); m.warna(3, 0);")
t(2260, "m.cetak('OK, ' + m.v['R$()'][m.v.RC] +\n"
        "              ', you have the following attributes :'); m.barisBaru();")
for n, z in ((2320, 'Strength'), (2360, 'Intelligence'), (2400, 'Dexterity'),
             (2460, 'Armor'), (2610, 'Weapons'), (4370, 'Up'), (4390, 'Down'),
             (6130, 'X-Coordinate'), (6160, 'Y-Coordinate'), (6190, 'Z-Coordinate'),
             (7190, 'Armor'), (7440, 'Weapon'), (7660, 'Strength'),
             (7760, 'Intelligence'), (7860, 'Dexterity')):
    t(n, "m.v['Z$'] = '%s';" % z)
t(2520, "m.v.AV = -3 * (m.v['O$'] === 'P' ? -1 : 0)\n"
        "             - 2 * (m.v['O$'] === 'C' ? -1 : 0)\n"
        "             - (m.v['O$'] === 'L' ? -1 : 0);",
   "Nilai zirah dipilih tanpa satu pun IF: tiap perbandingan bernilai −1 kalau\n"
   "     benar, jadi tiga perkalian menghasilkan 3, 2, 1, atau 0 tepat sesuai\n"
   "     huruf yang diketik. Plate, Chainmail, Leather, atau tidak sama sekali.")
t(2550, "m.warna(11, 0);\n"
        "      m.cetak('** Are you a ' + m.v['R$()'][m.v.RC] + ' or ' +\n"
        "              m.v['C$()'][FNA(m, 12) + 12] + '?');\n"
        "      m.barisBaru(); m.warna(3, 0);",
   "Ejekan yang menyebut monster ACAK dari daftar yang sama dengan yang nanti\n"
   "     menyerang pemainnya. Data yang dipakai dua kali untuk dua keperluan.")
t(2570, "m.v.AH = m.v.AV * 7; m.v['GP!'] = m.v['GP!'] - m.v.AV * 10;")
t(2590, "m.cetak('OK, bold ' + m.v['R$()'][m.v.RC] + ', you have' +\n"
        "              bas(m.v['GP!']) + \"gp's left.\"); m.barisBaru();")
t(2660, "m.v.WV = -3 * (m.v['O$'] === 'S' ? -1 : 0)\n"
        "             - 2 * (m.v['O$'] === 'M' ? -1 : 0)\n"
        "             - (m.v['O$'] === 'D' ? -1 : 0);")
t(2690, "m.warna(11, 0);\n"
        "      m.cetak('** Is your IQ really' + bas(m.v.IQ) + '?');\n"
        "      m.barisBaru(); m.warna(3, 0);")
t(2710, "m.v['GP!'] = m.v['GP!'] - m.v.WV * 10;")
t(2760, "if (m.v['O$'] === 'Y') {\n"
        "        m.v.LF = 1; m.v['GP!'] = m.v['GP!'] - 20; m.lompat(2780);\n"
        "      }")
t(2790, "if (m.v['GP!'] < 1) { m.v.Q = 0; m.lompat(2900); }")
t(2800, "m.cetak('OK, ' + m.v['R$()'][m.v.RC] + ', you have' +\n"
        "              bas(m.v['GP!']) + 'gold pieces left.'); m.barisBaru();")
t(2830, "m.v.Q = parseInt(m.v['O$'], 10) || 0;")
t(2850, "if (m.v.Q > 0 || (m.v['O$'] || ' ').charCodeAt(0) === 48) m.lompat(2890);")
t(2890, "m.warna(11, 0);\n"
        "      if (m.v.Q > m.v['GP!']) {\n"
        "        m.cetak('** You can only afford' + bas(m.v['GP!']) + '.');\n"
        "        m.barisBaru(); m.warna(3, 0); m.barisBaru(); m.lompat(2820);\n"
        "      }")
t(2900, "m.v.FL = (m.v.FL || 0) + m.v.Q; m.v['GP!'] = m.v['GP!'] - m.v.Q;")
t(2920, "m.warna(27, 0);\n"
        "      m.cetak('OK, ' + m.v['R$()'][m.v.RC] +\n"
        "              ', You are now entering the castle!');\n"
        "      m.barisBaru(); m.warna(3, 0);")

# --- 2990-3090: kutukan ----------------------------------------------------
t(2990, "if (m.v['C()'][1][4] > m.v['T()'][1]) m.v.T = (m.v.T || 0) + 1;",
   "Tiga kutukan, dan tiap satu ditawar oleh satu harta: `C(n,4)` menyala kalau\n"
   "     pemain berada di ruang kutukannya, `T(n)` menyala kalau ia membawa\n"
   "     penawarnya. Perbandingan langsung antara keduanya — kutukan berlaku\n"
   "     hanya kalau tidak ada penawarnya.")
t(3000, "if (m.v['C()'][2][4] > m.v['T()'][3]) m.v['GP!'] = m.v['GP!'] - FNA(m, 5);")
t(3010, "if (m.v['GP!'] < 0) m.v['GP!'] = 0;")
t(3090, "m.v['C()'][m.v.Q][4] =\n"
        "        -(m.v['C()'][m.v.Q][1] === m.v.X ? -1 : 0) *\n"
        "         (m.v['C()'][m.v.Q][2] === m.v.Y ? -1 : 0) *\n"
        "         (m.v['C()'][m.v.Q][3] === m.v.Z ? -1 : 0);",
   "'Apakah pemain berada di ruang kutukan ini?' — tiga perbandingan DIKALIKAN.\n"
   "     Hasilnya 1 hanya kalau ketiganya benar, karena (−1)×(−1)×(−1) = −1 dan\n"
   "     tanda minus di depan membalikkannya. Satu baris menggantikan tiga IF\n"
   "     bersarang.")
t(3150, "if (m.v.Q > 7) m.v.Q = 4;")
t(3210, "var tj = [3220, 3280, 3360, 3390][FNA(m, 4) - 1]; if (tj) m.lompat(tj);")
for n in (3240, 3260, 3310, 3320, 3370, 3410, 3560, 3590):
    t(n, "/* SOUND / PLAY */")
t(3480, "m.cetak('hear a ' + m.v['C$()'][12 + FNA(m, 13)] + ' growling!');\n"
        "      m.barisBaru();")
t(3630, "m.cetak(m.v['C$()'][29] + ' cures your blindness!'); m.barisBaru();")
t(3670, "m.cetak(m.v['C$()'][31] + ' dissolves the book!'); m.barisBaru();")

# --- 3795-3930: perintah pemain --------------------------------------------
t(3795, "m.masukan('O$', '');")
t(3800, "if ((m.v['O$'] || '').slice(0, 2) === 'DR') m.lompat(5180);",
   "Satu-satunya perintah dua huruf: DR untuk minum. Diperiksa SEBELUM baris\n"
   "     3810 memotong masukannya jadi satu huruf.")
t(3810, "m.v['O$'] = (m.v['O$'] || '').charAt(0);")
t(3830, "var o = m.v['O$'];\n"
        "      if (o === 'S' || o === 'W' || o === 'E') m.lompat(4310);")
t(3880, "if (m.v['O$'] === 'F') {\n"
        "        var tj = [4680, 4440][(m.v.BL || 0) + 1 - 1]; if (tj) m.lompat(tj);\n"
        "      }",
   "3880-3930 `ON BL+1 GOTO` — bendera kebutaan dipakai sebagai INDEKS, bukan\n"
   "     sebagai syarat. Nol berarti tujuan pertama, satu berarti tujuan kedua\n"
   "     (pesan 'kamu tidak bisa melihat apa-apa'). Empat perintah memakai pola\n"
   "     yang sama.")
t(3890, "if (m.v['O$'] === 'L') {\n"
        "        var tj = [4940, 4440][(m.v.BL || 0) + 1 - 1]; if (tj) m.lompat(tj);\n"
        "      }")
t(3920, "if (m.v['O$'] === 'G') {\n"
        "        var tj = [5830, 4440][(m.v.BL || 0) + 1 - 1]; if (tj) m.lompat(tj);\n"
        "      }")
t(3930, "if (m.v['O$'] === 'T') {\n"
        "        m.barisBaru();\n"
        "        var tj = [6090, 6130][(m.v.RF || 0) + 1 - 1]; if (tj) m.lompat(tj);\n"
        "      }",
   "Teleportasi hanya bekerja kalau pemain membawa Runestaff — dan yang\n"
   "     memutuskannya indeks yang sama, bukan sebuah IF.")
t(4250, "m.masukan('O$', '');")
t(4280, "m.warna(11, 0);\n"
        "      m.cetak('** Bold ' + m.v['R$()'][m.v.RC] +\n"
        "              \", that wasn't a valid command!\");\n"
        "      m.barisBaru(); m.warna(3, 0);")

# --- 4310-4460: gerak ------------------------------------------------------
t(4310, "m.v.X = m.v.X + (m.v['O$'] === 'N' ? -1 : 0) - (m.v['O$'] === 'S' ? -1 : 0);",
   "Arah gerak dari perbandingan, bukan dari IF. `(O$=\"N\")` bernilai −1, jadi\n"
   "     X berkurang satu ke utara dan bertambah satu ke selatan — dan kedua arah\n"
   "     muat di satu baris tanpa percabangan.")
t(4320, "m.v.Y = m.v.Y + (m.v['O$'] === 'W' ? -1 : 0) - (m.v['O$'] === 'E' ? -1 : 0);")
t(4360, "if (m.v['L()'][FND(m, m.v.Z)] === 3) { m.v.Z = m.v.Z - 1; m.lompat(6370); }")
t(4400, "if (m.v['L()'][FND(m, m.v.Z)] === 4) { m.v.Z = m.v.Z + 1; m.lompat(6370); }")
t(4420, "m.warna(11, 0);\n"
        "      m.cetak('** There are no stairs going ' + m.v['Z$'] + ' from here!');\n"
        "      m.barisBaru(); m.warna(3, 0);")
t(4460, "m.warna(11, 0);\n"
        "      m.cetak(\"** You can't see anything \" + m.v['R$()'][m.v.RC] + '!');\n"
        "      m.barisBaru(); m.warna(3, 0);")

# --- 4570-4660: peta -------------------------------------------------------
t(4570, "if (m.v.Q > 99) { m.v.Q = m.v.Q - 100; m.v.Q = 34; }",
   "DUA penugasan ke Q, berurutan, di baris yang sama — dan yang pertama\n"
   "     LANGSUNG DIBUANG oleh yang kedua. `Q=Q-100` melepas penanda 'belum\n"
   "     dilihat', lalu `LET Q=34` menimpanya dengan nomor ruang kosong.\n"
   "     Komentarnya sendiri, `REM TO HIDE ROOMS`, menjelaskan maksudnya: ruang\n"
   "     yang belum dilihat digambar sebagai ruang tak dikenal. Tapi pengurangan\n"
   "     100-nya tidak berguna sama sekali, dan ia tetap di sana.")
t(4580, "m.warna(6, 0);\n"
        "      if (m.v.X === m.v.A && m.v.Y === m.v.B) {\n"
        "        m.cetak('<' + m.v['I$()'][m.v.Q] + '>  '); m.lompat(4600);\n"
        "      }",
   "Tanda kurung siku menandai tempat pemain berdiri di peta. Dan `COLOR 3,0,1`\n"
   "     di ujung baris ini TIDAK PERNAH dijalankan — ia berada sesudah GOTO.")
t(4590, "m.warna(6, 0); m.cetak(' ' + m.v['I$()'][m.v.Q] + '   '); m.warna(3, 0);")
t(4660, "m.warna(12, 0); m.cetak(') level' + bas(m.v.Z));\n"
        "      m.barisBaru(); m.warna(3, 0);")
t(4830, "m.warna(12, 0); m.cetak(' ' + m.v['I$()'][m.v.Q] + '   '); m.warna(3, 0);")
t(4960, "m.warna(11, 0);\n"
        "      m.cetak(\"** You don't have a lamp, \" + m.v['R$()'][m.v.RC] + '!');\n"
        "      m.barisBaru(); m.warna(3, 0);")
t(5020, "m.v.X = FNB(m, m.v.X + (m.v['O$'] === 'N' ? -1 : 0) - (m.v['O$'] === 'S' ? -1 : 0));",
   "Lampu menyorot ke ruang sebelah, dan `FNB` MEMBUNGKUS koordinatnya: keluar\n"
   "     di sisi satu berarti masuk di sisi seberangnya. Kastilnya berbentuk\n"
   "     donat, dan seluruh bentuk itu ada di satu fungsi satu baris.")
t(5030, "m.v.Y = FNB(m, m.v.Y + (m.v['O$'] === 'W' ? -1 : 0) - (m.v['O$'] === 'E' ? -1 : 0));")
t(5060, "m.warna(11, 0);\n"
        "      m.cetak(\"** That's not a direction \" + m.v['R$()'][m.v.RC] + '!');\n"
        "      m.barisBaru(); m.warna(3, 0);")
t(5120, "m.cetak('There you will find ' +\n"
        "              m.v['C$()'][m.v['L()'][FND(m, m.v.Z)]] + '.'); m.barisBaru();")

# --- 5250-5360: kolam ajaib ------------------------------------------------
t(5250, "if (m.v.Q < 7) m.cetak('feel ');")
t(5280, "m.v.ST = m.v.ST - FNA(m, 3); m.warna(15, 0);\n"
        "      m.cetak('weaker.'); m.barisBaru(); m.warna(7, 0);\n"
        "      var tj = [2880, 9120][(1 - (m.v.ST < 1 ? -1 : 0)) - 1]; if (tj) m.lompat(tj);",
   "`ON (1-(ST<1)) GOTO 2880,9120` — perbandingan sebagai INDEKS lagi. Kalau\n"
   "     kekuatannya masih positif, syaratnya 0 dan indeksnya 1; kalau habis,\n"
   "     syaratnya −1 dan indeksnya 2, yang menuju layar kematian.")
t(5300, "m.v.IQ = m.v.IQ - FNA(m, 3); m.warna(11, 0);\n"
        "      m.cetak('dumber.'); m.barisBaru(); m.warna(3, 0);\n"
        "      var tj = [2970, 9590][(1 - (m.v.IQ < 1 ? -1 : 0)) - 1]; if (tj) m.lompat(tj);")
t(5320, "m.v.DX = m.v.DX - FNA(m, 3); m.warna(11, 0);\n"
        "      m.cetak('clumsier.'); m.barisBaru(); m.warna(3, 0);\n"
        "      var tj = [2970, 9590][(1 - (m.v.DX < 1 ? -1 : 0)) - 1]; if (tj) m.lompat(tj);")
t(5330, "m.v.Q = FNA(m, 4); if (m.v.Q === m.v.RC) m.lompat(5330);")
t(5340, "m.v.RC = m.v.Q;\n"
        "      m.cetak('become a ' + m.v['R$()'][m.v.RC] + '.'); m.barisBaru();\n"
        "      m.lompat(2970);")
t(5350, "m.v.SX = 1 - m.v.SX; m.cetak('turn into a ');\n"
        "      if (m.v.SX === 0) m.cetak('fe');",
   "Kelamin disimpan sebagai 0 atau 1, dan dibalik dengan `SX=1-SX`. Lalu\n"
   "     kata 'female' dibangun dengan mencetak 'fe' lebih dulu kalau perlu —\n"
   "     dua huruf, bukan dua kalimat.")
t(5360, "m.cetak('male ' + m.v['R$()'][m.v.RC] + '!'); m.barisBaru();\n"
        "      m.lompat(2970);")

# --- 5480-5810: buku dan peti ----------------------------------------------
t(5480, "var tj = [5490, 5520, 5540, 5560, 5590, 5620][FNA(m, 6) - 1];\n"
        "      if (tj) m.lompat(tj);")
t(5490, "m.warna(0, 15); m.cls();\n"
        "      m.cetak('Flash! Oh no! you are now a blind ' +\n"
        "              m.v['R$()'][m.v.RC] + '!'); m.barisBaru();")
t(5540, "m.cetak(\"It's an old copy of Play\" + m.v['R$()'][FNA(m, 4)] + '!');\n"
        "      m.barisBaru();",
   "Lelucon yang cuma bekerja karena nama bangsanya dipakai sebagai kata benda:\n"
   "     Playhobbit, Playelf, Playhuman, Playdwarf.")
t(5670, "var tj = [5680, 5730, 5770, 5730][FNA(m, 4) - 1]; if (tj) m.lompat(tj);",
   "Empat kemungkinan, tapi tujuan kedua dan keempat SAMA — jadi peluangnya\n"
   "     bukan seperempat merata melainkan 1:2:1. Pembobotan yang ditulis sebagai\n"
   "     pengulangan alamat.")
t(5720, "var tj = [5650, 9590][(1 - (m.v.ST < 1 ? -1 : 0)) - 1]; if (tj) m.lompat(tj);")
t(5750, "m.v['GP!'] = m.v['GP!'] + m.v.Q;")
t(5810, "m.v['O$'] = 'NSEW'.charAt(FNA(m, 4) - 1);",
   "Arah acak diambil sebagai satu aksara dari string 'NSEW'. Tabel arah yang\n"
   "     panjangnya empat aksara.")

# --- 5890-6070: bola kristal -----------------------------------------------
t(5890, "var tj = [5900, 5920, 5940, 5960, 6030, 6070][FNA(m, 6) - 1];\n"
        "      if (tj) m.lompat(tj);")
t(5910, "m.v.ST = m.v.ST - FNA(m, 2);\n"
        "      var tj = [2970, 9590][(1 - (m.v.ST < 1 ? -1 : 0)) - 1]; if (tj) m.lompat(tj);")
t(5920, "m.cetak('Yourself drinking from a pool and becoming ' +\n"
        "              m.v['C$()'][12 + FNA(m, 13)] + '!'); m.barisBaru();")
t(5940, "m.cetak(m.v['C$()'][12 + FNA(m, 13)] + ' gazing back at you!');\n"
        "      m.barisBaru();")
t(6040, "if (FNA(m, 8) < 4) {\n"
        "        m.v.A = m.v['O()'][1]; m.v.B = m.v['O()'][2]; m.v.C = m.v['O()'][3];\n"
        "      }",
   "BOLA KRISTALNYA BERBOHONG. Peluang tiga dari delapan ia menunjukkan letak\n"
   "     Jimat Chaos yang SEBENARNYA; lima dari delapan yang tercetak angka acak\n"
   "     yang sudah disiapkan baris sebelumnya. Dan tidak ada apa pun di layar\n"
   "     yang membedakan keduanya.")
t(6050, "m.warna(12, 0);\n"
        "      m.cetak('The Amulet of Chaos at (' + bas(m.v.A) + ',' +\n"
        "              bas(m.v.B) + ') level' + bas(m.v.C) + '!');\n"
        "      m.barisBaru(); m.warna(3, 0);")
t(6220, "m.v['O$'] = 'T';")
t(6380, "if (m.v.BL === 0) { m.gosub(11020); }")
t(6381, None); del TANGAN[6381]

# --- 6410-6660: papan keadaan ----------------------------------------------
t(6410, "m.cetak('Treasures =' + bas(m.v.TC) + ' Flares =' + bas(m.v.FL) +\n"
        "              ' Gold Pieces =' + bas(m.v['GP!'])); m.barisBaru();")
t(6420, "m.cetak('Turns =' + bas(m.v.T) + '  Weapon = ' + m.v['W$()'][m.v.WV + 1] +\n"
        "              '  Armor = ' + m.v['W$()'][m.v.AV + 5]);",
   "Satu larik `W$` menyimpan EMPAT senjata dan EMPAT zirah berurutan, dan yang\n"
   "     memisahkannya cuma pergeseran indeks: `WV+1` untuk senjata, `AV+5` untuk\n"
   "     zirah. Delapan nama di satu larik, dua kelompok, nol tabel.")
t(6430, "if (m.v.LF === 1) { m.cetak('  and a lamp'); m.barisBaru(); }")
t(6440, "if (m.v.LF === 0) { m.cetak('   '); m.barisBaru(); }")
t(6450, "m.v['JOHN!'] = m.v.IQ * 100 + m.v.ST * 100 + m.v.DX * 100 +\n"
        "                    (m.v['KM!'] || 0) + (m.v.FTRS || 0) + (m.v.REQ || 0) +\n"
        "                    m.v['GP!'] - m.v.T * 5;",
   "SKORNYA BERNAMA JOHN. Variabel `JOHN!` — nama penulisnya sendiri, John\n"
   "     Belew — dan baris 12100 nanti menyebut angka 142.498 sebagai skor\n"
   "     miliknya yang harus diganti kalau ada yang mengalahkannya.")
t(6480, "m.cetak('Score =' + bas(m.v['JOHN!']));")
t(6510, "if (m.v.BL === 1) { m.cetak('-Blinded'); m.barisBaru(); m.v.EQUZ = 1; }")
t(6520, "if (m.v.BF === 1) {\n"
        "        m.cetak('-Unable to draw weapon'); m.barisBaru(); m.v.EQUZ = 1;\n"
        "      }")
t(6530, "if ((m.v.EQUZ || 0) === 0) { m.cetak('-Normal'); m.barisBaru(); }")
t(6560, "if (m.v.OF === 1) {\n"
        "        m.warna(12, 0); m.cetak('The Amulet of Chaos'); m.barisBaru();\n"
        "        m.warna(3, 0); m.v.MAGICAL = 1;\n"
        "      }")
t(6570, "if (m.v.RF === 1) { m.cetak('The Runestaff'); m.barisBaru(); m.v.MAGICAL = 1; }")
t(6580, "if ((m.v.MAGICAL || 0) === 0) {\n"
        "        m.cetak('no magical items at the moment'); m.barisBaru();\n"
        "      }")
t(6620, "if (m.v['T()'][m.v.Q] === 1) {\n"
        "        m.cetak(m.v['C$()'][m.v.Q + 25]); m.barisBaru(); m.v.QXYZ = 1;\n"
        "      }")
t(6640, "if ((m.v.QXYZ || 0) === 0) { m.cetak('nothing'); m.barisBaru(); }")
t(6650, "if (m.v.COME === 1) m.lompat(6670);")
t(6660, "if (m.v.T > 500) m.lompat(11380);",
   "Lima ratus giliran, dan sesudah itu Drow kembali. Batas waktu satu-satunya\n"
   "     di seluruh permainan, disebut sekali di baris 2040 dan diperiksa di sini.")
t(6700, "m.v['Z$'] = 'You now have ';")
t(6730, "if (m.v.Q < 7 || m.v.Q === 11 || m.v.Q === 12) m.lompat(2970);")
t(6740, "if (m.v.Q === 7) {\n"
        "        m.v['GP!'] = m.v['GP!'] + FNA(m, 10);\n"
        "        m.cetak(m.v['Z$'] + bas(m.v['GP!']) + '.'); m.barisBaru();\n"
        "        m.lompat(5650);\n"
        "      }")
t(6750, "if (m.v.Q === 8) {\n"
        "        m.v.FL = m.v.FL + FNA(m, 5);\n"
        "        m.cetak(m.v['Z$'] + bas(m.v.FL) + '.'); m.barisBaru();\n"
        "        m.lompat(5650);\n"
        "      }")
t(6770, "if (m.v['O()'][1] === m.v.X && m.v['O()'][2] === m.v.Y &&\n"
        "          m.v['O()'][3] === m.v.Z) {\n"
        "        var tj = [4310, 10190][(1 - (m.v['O$'] === 'T' ? -1 : 0)) - 1];\n"
        "        if (tj) m.lompat(tj);\n"
        "      }",
   "Jimat Chaos MENYAMAR JADI WARP. Ruangnya bernomor sama dengan warp biasa,\n"
   "     dan yang membedakan cuma pemeriksaan koordinat di baris ini — dan hanya\n"
   "     kalau pemain datang lewat teleportasi. Persis trik yang sama dengan\n"
   "     WIZARD.BAS.")
t(6790, "if (m.v.Q === 10) { m.v.Z = FNB(m, m.v.Z + 1); m.lompat(6370); }")
t(6800, "if (m.v.Q <= 25 || m.v.Q >= 34) m.lompat(6860);")
t(6880, "if (m.v.A < 13 || m.v.VF === 1) m.lompat(8070);")
t(7000, "m.warna(11, 0);\n"
        "      m.cetak('** Nice shot ' + m.v['R$()'][m.v.RC] + '!');\n"
        "      m.barisBaru(); m.warna(3, 0);")
t(7060, "m.cetak('Do you want to sell ' + m.v['C$()'][m.v.Q + 25] + ' for ' +\n"
        "              bas(m.v.A) + \"gp's\");")
t(7080, "if (m.v['O$'] === 'Y') {\n"
        "        m.v.TC = m.v.TC - 1; m.v['T()'][m.v.Q] = 0;\n"
        "        m.v['GP!'] = m.v['GP!'] + m.v.A; m.lompat(7100);\n"
        "      }")
t(7170, "m.cetak('OK ' + m.v['R$()'][m.v.RC] + ', you have ' + bas(m.v['GP!']) +\n"
        "              \"gp's and \" + m.v['W$()'][m.v.AV + 5] + ' armor.');\n"
        "      m.barisBaru();")
t(7220, "if (m.v['GP!'] > 1499) m.cetak(\"Chainmail:1500:gp's \");")
t(7230, "if (m.v['GP!'] > 1999) m.cetak(\"Plate Mail:2000gp's \");")
t(7280, "if (m.v['O$'] === 'L') {\n"
        "        m.v['GP!'] = m.v['GP!'] - 1250; m.v.AV = 1; m.v.AH = 7; m.lompat(7400);\n"
        "      }")
t(7290, "if (m.v['O$'] !== 'C' || m.v['GP!'] >= 1500) m.lompat(7320);")
t(7320, "if (m.v['O$'] === 'C') {\n"
        "        m.v['GP!'] = m.v['GP!'] - 1500; m.v.AV = 2; m.v.AH = 14; m.lompat(7400);\n"
        "      }")
t(7330, "if (m.v['O$'] !== 'P' || m.v['GP!'] >= 2000) m.lompat(7360);")
t(7360, "if (m.v['O$'] === 'P') {\n"
        "        m.v['GP!'] = m.v['GP!'] - 2000; m.v.AV = 3; m.v.AH = 21; m.lompat(7400);\n"
        "      }")
t(7420, "m.cetak('You have' + bas(m.v['GP!']) + \"gp's left with \" +\n"
        "              m.v['W$()'][m.v.WV + 1] + ' in hand.'); m.barisBaru();")
t(7470, "if (m.v['GP!'] > 1499) m.cetak(\"Mace:1500gp's\");")
t(7480, "if (m.v['GP!'] > 1999) m.cetak(\"Sword:2000gp's\");")
t(7530, "if (m.v['O$'] === 'D') {\n"
        "        m.v['GP!'] = m.v['GP!'] - 1250; m.v.WV = 1; m.lompat(7650);\n"
        "      }")
t(7540, "if (m.v['O$'] !== 'M' || m.v['GP!'] >= 1500) m.lompat(7570);")
t(7570, "if (m.v['O$'] === 'M') {\n"
        "        m.v['GP!'] = m.v['GP!'] - 1500; m.v.WV = 2; m.lompat(7650);\n"
        "      }")
t(7580, "if (m.v['O$'] !== 'S' || m.v['GP!'] >= 2000) m.lompat(7620);")
t(7620, "if (m.v['O$'] === 'S') {\n"
        "        m.v['GP!'] = m.v['GP!'] - 2000; m.v.WV = 3; m.lompat(7650);\n"
        "      }")
for n in (7690, 7790, 7890, 8000):
    t(n, "m.v['GP!'] = m.v['GP!'] - 1000;")
t(7950, "if (m.v['GP!'] < 1000 || m.v.LF === 1) m.lompat(2970);")

# --- 8080-8490: pertarungan ------------------------------------------------
t(8080, "if (m.v['C()'][1][4] > m.v['T()'][1] || m.v.BL === 1 ||\n"
        "          m.v.DX < FNA(m, 9) + FNA(m, 9)) m.lompat(9100);",
   "Siapa yang menyerang lebih dulu ditentukan oleh kegesitan pemain melawan\n"
   "     DUA lemparan dadu sembilan sisi — jadi rata-rata yang harus dikalahkan\n"
   "     sepuluh, dan kegesitan maksimum delapan belas hampir selalu menang.")
t(8100, "m.warna(3, 0);\n"
        "      m.cetak(\"You're confronting \" + m.v['C$()'][m.v.A + 12] + '!');\n"
        "      m.barisBaru();")
t(8130, "if (m.v.Q3 === 1) {\n"
        "        m.cetak('You can also attempt to bribe the creature.'); m.barisBaru();\n"
        "      }")
t(8140, "if (m.v.IQ > 14) {\n"
        "        m.cetak('You can also cast a spell.'); m.barisBaru();\n"
        "      }")
t(8210, "m.warna(11, 0);\n"
        "      m.cetak('** Pounding on ' + m.v['C$()'][m.v.A + 12] +\n"
        "              \" won't hurt it!\"); m.barisBaru(); m.warna(3, 0);")
t(8290, "m.cetak('You barely missed the ' + m.v['C$()'][m.v.A + 12] + '!');\n"
        "      m.barisBaru();")
t(8310, "var s = m.v['C$()'][m.v.A + 12] || '';\n"
        "      m.v['Z$'] = s.slice(2);",
   "8310-8320 nama monster disimpan lengkap dengan kata sandangnya — 'a Kobold',\n"
   "     'an Orc'. Dua baris ini membuangnya: potong dua aksara pertama, lalu\n"
   "     kalau yang tersisa masih diawali spasi (karena sandangnya 'an'), potong\n"
   "     satu lagi. Kalimat yang butuh namanya telanjang mendapatkannya.")
t(8320, "if ((m.v['Z$'] || '').charAt(0) === ' ') m.v['Z$'] = m.v['Z$'].slice(1);")
t(8360, "if (m.v.A !== 9 && m.v.A !== 12) m.lompat(8410);")
t(8390, "m.warna(11, 0);\n"
        "      m.cetak('OH NO! Your ' + m.v['W$()'][m.v.WV + 1] + ' broke!');\n"
        "      m.barisBaru(); m.warna(3, 0);",
   "Hanya dua monster yang bisa mematahkan senjata: nomor 9 dan 12. Keduanya\n"
   "     diperiksa dengan satu baris, dan tidak ada apa pun yang menyebut nama\n"
   "     mereka.")
t(8440, "m.cetak('You kill ' + m.v['C$()'][m.v.A + 12] + '.'); m.barisBaru();")
t(8445, "m.v['KM!'] = (m.v['KM!'] || 0) + 1000;")
t(8470, "m.cetak('You spend an hour eating ' + m.v['C$()'][m.v.A + 12] +\n"
        "              m.v['E$()'][FNA(m, 8)] + '.'); m.barisBaru();",
   "Nama monster disambung dengan salah satu dari delapan cara memasaknya, dan\n"
   "     hasilnya kalimat yang berbeda tiap kali. Delapan string, tiga belas\n"
   "     monster, seratus empat kemungkinan.")
t(8490, "if (m.v.X !== m.v['R()'][1] || m.v.Y !== m.v['R()'][2] ||\n"
        "          m.v.Z !== m.v['R()'][3]) {\n"
        "        var tj = [8540, 10490][(1 - (m.v.A === 13 ? -1 : 0)) - 1];\n"
        "        if (tj) m.lompat(tj);\n"
        "      }")
t(8510, "m.warna(11, 0);\n"
        "      m.cetak(\"You've found the Runestaff!\" + m.chr(7)); m.barisBaru();\n"
        "      m.warna(3, 0);")
t(8570, "m.v['GP!'] = m.v['GP!'] + m.v.Q;")
t(8610, "if (m.v.IQ >= 15 || m.v.Q3 <= 1) m.lompat(8650);")
t(8720, "var tj = [9100, 9590][(1 - (m.v.ST < 1 ? -1 : 0)) - 1]; if (tj) m.lompat(tj);")
t(8770, "if (m.v.IQ < 1 || m.v.ST < 1) m.lompat(9590);")
t(8870, "if (m.v.IQ < FNA(m, 4) + 15) {\n"
        "        m.cetak('yours!'); m.barisBaru(); m.v.IQ = 0; m.lompat(9590);\n"
        "      }",
   "Mantra terkuat menuntut kecerdasan di atas 15 ditambah satu lemparan dadu\n"
   "     empat sisi — jadi bahkan kecerdasan 18 pun bisa gagal, dan gagalnya\n"
   "     berarti kecerdasan nol dan kematian.")
t(8890, "if (m.v['O$'] === 'B' && m.v.Q3 <= 1) m.lompat(8930);")
t(9000, "m.cetak('I want ' + m.v['C$()'][m.v.Q + 25] +\n"
        "              '. Will you give it to me?');")
t(9130, "if (m.v.WC === 0) { m.barisBaru(); m.cetak('The web just broke!'); m.barisBaru(); }")
t(9140, "var s = m.v['C$()'][m.v.A + 12] || '';\n"
        "      m.v['Z$'] = s.slice(2);")
t(9150, "if ((m.v['Z$'] || '').charAt(0) === ' ') m.v['Z$'] = m.v['Z$'].slice(1);")
t(9340, "m.warna(12, 0);\n"
        "      m.cetak('Thud! The ' + m.v['Z$'] + ' hit you!'); m.barisBaru();\n"
        "      m.warna(3, 0);")
t(9460, "m.warna(11, 0);\n"
        "      m.cetak(\"** Don't press your luck, \" + m.v['R$()'][m.v.RC] + '!');\n"
        "      m.barisBaru(); m.warna(3, 0);")
t(9520, "if (m.v.Q < 0) { m.v.AH = m.v.AH - m.v.Q; m.v.Q = 0; }",
   "Zirah menyerap kelebihan pukulan: yang tersisa dikurangkan dari ketahanan\n"
   "     zirahnya, bukan dari pemainnya. Dan karena Q negatif, `AH-Q` justru\n"
   "     MENAMBAH — tanda minus yang dua kali berbalik.")
t(9590, "m.cetak(m.chr(7)); m.barisBaru();")
t(9610, "m.warna(3, 0);\n"
        "      m.cetak('A noble effort, oh formerly living ' +\n"
        "              m.v['R$()'][m.v.RC] + '!'); m.barisBaru();")
t(9640, "if (m.v.ST < 1) { m.cetak('Strength.'); m.barisBaru(); }")
t(9650, "if (m.v.IQ < 1) { m.cetak('Intelligence.'); m.barisBaru(); }")
t(9660, "if (m.v.DX < 1) { m.cetak('Dexterity.'); m.barisBaru(); }")
t(9740, "if (m.v.OF === 0) m.cetak('out');")
t(9910, "if (m.v.Q3 === 0) { m.cetak('Your miserable life!'); m.barisBaru(); }")
t(9930, "if (m.v['T()'][m.v.Q] === 1) {\n"
        "        m.cetak(m.v['C$()'][m.v.Q + 25]); m.barisBaru();\n"
        "      }")
t(9950, "m.cetak(m.v['W$()'][m.v.WV + 1] + ' and ' + m.v['W$()'][m.v.AV + 5]);")
t(9960, "if (m.v.LF === 1) m.cetak(' and a lamp');")
t(9980, "m.cetak('You also had' + bas(m.v.FL) + 'flares and' +\n"
        "              bas(m.v['GP!']) + 'gold pieces'); m.barisBaru();")
t(9990, "if (m.v.RF === 1) { m.cetak('and the Runestaff'); m.barisBaru(); }")
t(10000, "m.cetak('Your score was ' + bas(m.v['JOHN!'])); m.barisBaru();")

# --- 10020-10027: tangga pangkat -------------------------------------------
t(10020, "if (m.v['JOHN!'] < 20000) m.v['RANK$'] = 'a Wimp';",
   "10020-10027 delapan pangkat, dan ADA LUBANG DI ANTARA DUA YANG PERTAMA:\n"
   "     yang pertama menguji `< 20000`, yang kedua `> 35000`. Skor di antara\n"
   "     20.000 dan 35.000 tidak memenuhi satu pun, jadi `RANK$` tetap kosong\n"
   "     dan kalimat pangkatnya tercetak tanpa pangkat.")
t(10021, "if (m.v['JOHN!'] > 35000) m.v['RANK$'] = 'a Peasant';")
t(10022, "if (m.v['JOHN!'] > 50000) m.v['RANK$'] = 'an Amateur';")
t(10023, "if (m.v['JOHN!'] > 75000) m.v['RANK$'] = 'a Scout';")
t(10024, "if (m.v['JOHN!'] > 90000) m.v['RANK$'] = 'an Adventurer';")
t(10025, "if (m.v['JOHN!'] > 110000) m.v['RANK$'] = 'a Hero';")
t(10026, "if (m.v['JOHN!'] > 125000) m.v['RANK$'] = 'a Wizard';")
t(10027, "if (m.v['JOHN!'] > 140000) m.lompat(11999);")
t(10610, "if (m.v.LF === 0) { m.cetak('A lamp'); m.barisBaru(); m.v.LF = 1; }")
t(10720, "m.v['O$'] = (m.v['O$'] || '').charAt(0);")
t(10770, "m.v.Q = parseInt(m.v['O$'], 10) || 0;")
t(10780, "if (m.v.Q === 0 && (m.v['O$'] || ' ').charCodeAt(0) !== 48) m.v.Q = -1;",
   "Membedakan 'nol' dari 'bukan angka': `VAL` mengembalikan nol untuk keduanya,\n"
   "     jadi kode aksaranya diperiksa langsung — 48 adalah angka nol.")
t(10790, "if (m.v.Q < 0 || m.v.Q > m.v.OT || m.v.Q !== Math.floor(m.v.Q)) {\n"
        "        m.cetak('** '); m.lompat(10740);\n"
        "      }")
t(10830, "m.v.Q = Math.trunc(parseFloat(m.v['O$']) || 0);")
t(10880, "m.v.Q = Math.trunc(parseFloat(m.v['O$']) || 0);")
t(10890, "if (m.v.Q > 0 && m.v.Q < 9) m.kembali();")
t(11000, "m.cetak('These are the types of ' + m.v['Z$'] + ' you can buy :');\n"
        "      m.barisBaru();")
t(11020, "m.warna(2, 0);\n"
        "      m.cetak('You are at (' + bas(m.v.X) + ',' + bas(m.v.Y) +\n"
        "              ') level' + bas(m.v.Z) + '.'); m.barisBaru(); m.warna(3, 0);")
t(11040, "m.henti('SYSTEM di baris 11040.');")
t(11050, "m.v['JOHN!'] = m.v.ST + m.v.IQ + m.v.DX + m.v['GP!'] - m.v.T;",
   "Skor sementara dihitung dengan rumus yang BERBEDA dari baris 6450 — tanpa\n"
   "     pengali seratus, tanpa nilai monster, tanpa denda giliran lima kali.\n"
   "     Dua rumus untuk satu nama variabel, dan yang mana yang berlaku\n"
   "     bergantung baris mana yang terakhir dijalankan.")
t(11070, "m.cetak('Your score at this time is ' + bas(m.v['JOHN!'])); m.barisBaru();")

# --- 11100-11330: ringkasan ke pencetak ------------------------------------
_LP = [
 (11100, "*** TEMPLE OF LOTH'S COMMAND AND INFORMATION SUMMARY ***"),
 (11110, ''), (11120, 'The following commands available are:'), (11130, ''),
 (11140, 'H=Help   N=North    S=South   E=East    W=West    U=Up'),
 (11150, 'D=Down   DR=Drink   M=Map     F=Flare   L=Lamp    O=Open'),
 (11160, 'G=Gaze   T=Teleport Q=Quit    #=Score'), (11170, ''),
 (11180, 'The contents of the rooms are as follows:'), (11190, ''),
 (11200, '\\u256c = empty room      B = book            C = chest'),
 (11210, 'D = stairs down     \\u2229 = entrance/exit   \\u0192 = flares'),
 (11220, 'G = gold pieces     \\u00a5 = monster         \\u03a6 = crystal orb'),
 (11230, 'P = magic pool      S = sinkhole        T = treasure'),
 (11240, 'U = stairs up       * = Drow            \\u2588 = warp/amulet'),
 (11250, ''), (11260, ''), (11270, 'The benefits of having treasures are:'),
 (11280, ''),
 (11290, 'RUBY RED - avoid lethargy    PALE PEARL - avoid leech'),
 (11300, 'GREEN GEM - avoid forgetting  OPAL EYE - cure blindness'),
 (11310, 'BLUE FLAME - dissolves books  NORN STONE - no benefit'),
 (11320, 'PALANTIR - no benefit         SILMARIL - no benefit'),
 (11330, '')]
for n, teks in _LP:
    t(n, "m.cetakPrinter(%s); m.cetakPrinter('');" % ('"' + teks + '"' if teks else "''"))
TANGAN[11100] = (TANGAN[11100][0],
   "11100-11330 ringkasan perintah dan lambang ruang, dikirim ke PENCETAK\n"
   "     lewat `LPRINT`. Baris 500 di layar pembuka memang menyarankannya:\n"
   "     'Suggested for use with printer and graphics board'. Peta lambangnya\n"
   "     memakai aksara kotak CP437, dan itu satu-satunya tempat di seluruh\n"
   "     program yang menjelaskan artinya.")
t(11350, "m.henti('END di baris 11350.');")
for n in (11410, 11430, 11450):
    t(n, "/* SOUND 32767,28 */")
t(11570, "m.rantai('TEM-INS.BAS', 10);",
   "SATU-SATUNYA jalan ke petunjuknya: `CHAIN\"TEM-INS.BAS\",10`. Berkas itu ada\n"
   "     di disket yang sama, 290 baris, dan baris 3010-nya memanggil balik\n"
   "     `CHAIN \"Temple\",700`. Dua berkas yang saling melempar, karena keduanya\n"
   "     tidak muat di memori bersama-sama.")
t(11999, "m.locate(25, 1); m.masukan('QWERTYU$', 'Press return to continue.');")
t(12080, "m.cetak(' You have been ranked as a Lord with a score of ' +\n"
        "              bas(m.v['JOHN!'])); m.barisBaru();")
t(12100, "if (m.v['JOHN!'] > 142498) {\n"
        "        m.cetak(\" Don't forget to replace my score on Tem-Ins.Bas\");\n"
        "        m.barisBaru();\n"
        "      }",
   "DAN INILAH BARIS TERAKHIRNYA. 142.498 adalah skor John Belew sendiri, dan\n"
   "     TEM-INS.BAS menyebut angka yang sama persis di daftar skor tertingginya.\n"
   "     Siapa pun yang mengalahkannya diminta menyunting berkas yang lain —\n"
   "     dengan tangan, di penyunting BASIC.")

# --- perbandingan yang dipakai sebagai BILANGAN ----------------------------
t(2150, "m.v.OT = (m.v.OT || 0) + 4 * (m.v.RC === 1 ? -1 : 0);",
   "`OT=OT+4*(RC=1)` — dan hasilnya MENGURANGI, bukan menambah, karena\n"
   "     perbandingan yang benar bernilai −1 di BASIC. Hobbit (bangsa 1) dapat\n"
   "     empat pilihan LEBIH SEDIKIT di daftar barang. Satu tanda kurung yang\n"
   "     membalik arah seluruh baris.")
t(9080, "m.v.VF = (m.v.VF || 0) +\n"
        "        (m.v['L()'][FND(m, m.v.Z)] === 25 ? -1 : 0);",
   "Bendera 'sudah melihat Drow' dinaikkan dengan perbandingan — dan sekali\n"
   "     lagi nilainya −1, jadi VF sebenarnya MENURUN. Yang memeriksanya di baris\n"
   "     6880 menguji `VF=1`, yang karena itu tidak pernah benar.")
