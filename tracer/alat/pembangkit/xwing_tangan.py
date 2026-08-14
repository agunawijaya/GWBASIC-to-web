# -*- coding: utf-8 -*-
"""Baris XWING yang ditulis tangan. Kunci = nomor baris, nilai = badan JS."""

TANGAN = {}

def t(n, badan, komentar=None):
    TANGAN[n] = (badan, komentar)

# --- 1070-1090 -------------------------------------------------------------
t(1070, "/* DEF SEG=0:POKE &H410 — menyuruh BASIC mengira kartu warna terpasang */",
   "Sama seperti ABM2A.BAS baris 1950: menulis ke kata perlengkapan BIOS.")
t(1080, "m.layar(1); m.layar(0); m.layar(1); m.warna(0, 1);",
   "`WIDTH 40:SCREEN 1:SCREEN 0:WIDTH 80:WIDTH 40:SCREEN 1` — tarian mode yang\n"
   "     sama dengan LANDER.BAS baris 3940, dan sebabnya sama: SCREEN cuma\n"
   "     membersihkan layar kalau modenya BERGANTI.")
t(1090, "m.lompat(1200);")

# --- 1100-1190: penangan panah dan sakelar jebakan --------------------------
t(1100, "m.v.V = (m.v.V || 0) - 1; if (m.v.V < -3) m.v.V = -3;")
t(1120, "m.v.W = (m.v.W || 0) - 1; if (m.v.W < -5) m.v.W = -5;")
t(1140, "m.v.W = (m.v.W || 0) + 1; if (m.v.W > 5) m.v.W = 5;")
t(1160, "m.v.V = (m.v.V || 0) + 1; if (m.v.V > 3) m.v.V = 3;")
t(1180, "[1, 2, 11, 12, 13, 14].forEach(function (k) { m.jebakan(k, true); });\n"
        "      m.kembali();",
   "1180 dan 1190 dipanggil BERPASANGAN mengapit tiap bagian yang tidak boleh\n"
   "     disela: nyalakan semua jebakan, kerjakan, tunda semua lagi. `KEY(n) STOP`\n"
   "     bukan `OFF` — tombol yang ditekan selama itu tetap DIINGAT dan dijemput\n"
   "     begitu jebakannya menyala lagi.")
t(1190, "[1, 2, 11, 12, 13, 14].forEach(function (k) { m.tundaJebakan(k); });\n"
        "      m.kembali();")

# --- 1280-1340 -------------------------------------------------------------
t(1280, "m.v['K$'] = m.inkey();\n"
        "      if (m.v['K$'] === 'Y' || m.v['K$'] === 'y') m.lompat(6930);")
t(1290, "if (m.v['K$'] !== 'N' && m.v['K$'] !== 'n') m.lompat(1270);")
t(1320, "m.pasangJebakan(1, 5350); m.pasangJebakan(2, 5750);\n"
        "      m.pasangJebakan(11, 1100); m.pasangJebakan(12, 1120);\n"
        "      m.pasangJebakan(13, 1140); m.pasangJebakan(14, 1160);",
   "F1 menembak meriam, F2 melepas torpedo, dan keempat panah menggeser kapal.\n"
   "     Enam jebakan, dan sesudah baris ini gelung utamanya tidak pernah membaca\n"
   "     tombol lagi kecuali untuk angka kecepatan.")
t(1330, "m.locate(8, 1); m.cetak('IMPERIAL FIGHTER:  ');\n"
        "      m.gambar('C2;BM145,59;M+0,0;BM+10,1;M+0,-2;M+2,2;M+0,-2;BM+10,-1;'\n"
        "             + 'M+0,4;BM+6,-4;M+0,4;M+0,-2;M-6,0');",
   "Satu DRAW menggambar TIGA ukuran pesawat sekaligus, berjajar ke kanan —\n"
   "     dan baris 1340 memungut ketiganya dengan tiga GET dari petak yang\n"
   "     berbeda. Perspektif, dibangun sebagai satu gambar.")
t(1340, "m.dim('IM()', 6); m.dim('IM1()', 6); m.dim('IM2()', 6); m.dim('IM3()', 6);\n"
        "      m.v['IM()'] = m.ambil(145, 59, 145, 59);\n"
        "      m.v['IM1()'] = m.ambil(145, 59, 145, 59);\n"
        "      m.v['IM2()'] = m.ambil(155, 58, 157, 60);\n"
        "      m.v['IM3()'] = m.ambil(167, 57, 173, 61);",
   "GET (145,59)-(145,59) memungut SATU PIKSEL: itu gambar pesawat yang masih\n"
   "     terlalu jauh untuk berbentuk apa pun.")
t(1530, "m.locate(10, 1); m.cetak('DARTH VADER     :  ');\n"
        "      m.gambar('C2;BM145,75;M+0,0;BM+10,1;M+0,-2;M+2,2;M+0,-2;BM+11,-1;'\n"
        "             + 'M-1,1;M+0,2;M+1,1;BM+4,-4;M+1,1;M+0,2;M-1,1;BM+1,-2;M-6,0');")
t(1540, "m.dim('DV()', 6); m.dim('DV1()', 6); m.dim('DV2()', 6); m.dim('DV3()', 6);\n"
        "      m.v['DV()'] = m.ambil(145, 75, 145, 75);\n"
        "      m.v['DV1()'] = m.ambil(145, 75, 145, 75);\n"
        "      m.v['DV2()'] = m.ambil(155, 74, 157, 76);\n"
        "      m.v['DV3()'] = m.ambil(167, 73, 173, 77);")
t(1760, "m.locate(12, 1); m.cetak('DEATH STAR      :  ');\n"
        "      m.gambar('C3;BM145,91;M+0,0;BM+11,-1;M-1,1;M+2,0;M-1,1;BM+12,-3;'\n"
        "             + 'M+1,0;M+1,1;M-3,0;M+0,1;M+3,0;M-1,1;M-1,0');")
t(1770, "m.gambar('C3;BM+12,-5;M+2,0;M+1,1;M-4,0;M-1,1;M+6,0;M+0,1;M-6,0;'\n"
        "             + 'M+0,1;M+6,0;M-1,1;M-4,0;M+1,1;M+2,0');")
t(1780, "['DS()', 'DS1()', 'DS2()', 'DS3()', 'DS4()'].forEach(function (nm) { m.dim(nm, 8); });\n"
        "      m.v['DS()'] = m.ambil(145, 91, 145, 91);\n"
        "      m.v['DS1()'] = m.ambil(145, 91, 145, 91);\n"
        "      m.v['DS2()'] = m.ambil(155, 90, 157, 92);\n"
        "      m.v['DS3()'] = m.ambil(167, 89, 170, 92);\n"
        "      m.v['DS4()'] = m.ambil(178, 87, 184, 93);",
   "Bintang Kematian punya EMPAT ukuran, satu lebih banyak daripada kedua\n"
   "     pesawat — karena ia yang paling lama didekati.")

# --- 1800-1910: DATA + READ ledakan ---------------------------------------
for nomor in (1800, 1820, 1840, 1860, 1880, 1900):
    t(nomor, "/* DATA — lihat `data` di objek program */")
for nomor, nama in ((1810, 'EXPL3'), (1830, 'EXPL4'), (1850, 'EXPL5'),
                    (1870, 'EXPL6'), (1890, 'EXPL7'), (1910, 'EXPL8')):
    t(nomor, "m.dim('%s()', 18);\n"
             "      for (m.v.I = 0; m.v.I <= 18; m.v.I++) m.v['%s()'][m.v.I] = m.baca();"
             % (nama, nama))

# --- 1920-2180 -------------------------------------------------------------
t(1930, "m.v['S$'] = m.inkey();\n"
        "      if ('0123'.indexOf(m.v['S$']) < 0 || m.v['S$'] === '') m.lompat(1920);")
t(1940, "m.v.SKILL = parseInt(m.v['S$'], 10) || 0; m.cls();")
t(2050, "m.v.M = Math.floor(m.acak() * 61) + 10;\n"
        "      m.v.N = Math.floor(m.acak() * 21) + 10;\n"
        "      m.v.O = Math.floor(m.acak() * 32001) + 70000;",
   "Bintang Kematian mulai 70.000 sampai 102.000 km jauhnya; pesawat kekaisaran\n"
   "     25.000; Vader 40.000 sampai 72.000. Urutan kedatangannya sudah ditentukan\n"
   "     di sini, tiga baris, tanpa satu pun jadwal.")
t(2070, "m.v.H = Math.floor(m.acak() * 61) + 10;\n"
        "      m.v.I = Math.floor(m.acak() * 21) + 10;\n"
        "      m.v.J = Math.floor(m.acak() * 32001) + 40000;")
t(2110, "if (m.v.SKILL === 0) { m.v.A1 = 5; m.v.A2 = 0; m.v.BYPASS = 3; }",
   "2110-2140 tingkat kesulitan mengatur DUA hal sekaligus: A1/A2 batas waktunya,\n"
   "     dan BYPASS seberapa jarang musuh mengelak. Tingkat 3 tidak menyetel\n"
   "     BYPASS sama sekali — nilainya tetap nol, dan nol berarti mengelak SETIAP\n"
   "     putaran.")
t(2120, "if (m.v.SKILL === 1) { m.v.A1 = 3; m.v.A2 = 0; m.v.BYPASS = 2; }")
t(2130, "if (m.v.SKILL === 2) { m.v.A1 = 2; m.v.A2 = 45; m.v.BYPASS = 1; }")
t(2140, "if (m.v.SKILL === 3) { m.v.A1 = 2; m.v.A2 = 30; }")
t(2160, "m.garis(1, 1, 76, 42, 3, 'B');")
t(2170, "m.gambar('C3;BM2,21;' + ulang('M+0,0;BM+6,0;', 5)\n"
        "             + 'M+0,0;BM+12,0;' + ulang('M+0,0;BM+6,0;', 5) + 'M+0,0');",
   "2170-2180 garis bidik: dua deret titik berjarak enam piksel, dengan LUBANG\n"
   "     selebar dua belas di tengahnya. Lubang itu yang jadi sasarannya.")
t(2180, "m.gambar('C3;BM38,3;' + ulang('M+0,0;BM+0,3;', 5)\n"
        "             + 'M+0,0;BM+0,6;' + ulang('M+0,0;BM+0,3;', 5) + 'M+0,0');")
t(2290, "m.v.SEC1 = 0;", "VAL(RIGHT$(TIME$,2)) — detik dari jam.")

# --- 2320-2820: gelung utama, Bintang Kematian -----------------------------
t(2370, "m.v.GS = m.v.G - (m.v.S || 0); if (m.v.GS < 0) m.v.GS = 0;")
t(2390, "m.v.JS = m.v.J - (m.v.S || 0); if (m.v.JS < 0) m.v.JS = 0;")
t(2410, "m.v.OS = m.v.O - (m.v.S || 0); if (m.v.OS < 0) m.v.OS = 0;")
t(2430, "m.locate(22, 16);\n"
        "      m.cetak(bas((m.v.A1 || 0)) + ':' + bas((m.v.A2NEW || 0)));")
t(2480, "if (m.v.O - (m.v.S || 0) >= 30000) m.lompat(2840);",
   "`IF O-S=30000 OR O-S>30000` — dua perbandingan untuk satu `>=`. Bentuk yang\n"
   "     dipakai orang yang belum yakin penafsirnya punya `>=`.")
t(2490, "if (m.v.O - (m.v.S || 0) < 20000 && !m.v.DSTAR2) {\n"
        "        m.v.DSTAR2 = 1; m.v.DSFLAG = 1; m.v['DS()'] = salin(m.v['DS2()']);\n"
        "      }",
   "2490-2510 tiga ambang jarak, tiga ukuran gambar. Tiap satu punya benderanya\n"
   "     sendiri supaya penggantiannya cuma sekali — dan DSFLAG mengingat gambar\n"
   "     MANA yang harus dipakai untuk menghapus jejak lamanya.")
t(2500, "if (m.v.O - (m.v.S || 0) < 10000 && !m.v.DSTAR3) {\n"
        "        m.v.DSTAR3 = 1; m.v.DSFLAG = 2; m.v['DS()'] = salin(m.v['DS3()']);\n"
        "      }")
t(2510, "if (m.v.O - (m.v.S || 0) < 5000 && !m.v.DSTAR4) {\n"
        "        m.v.DSTAR4 = 1; m.v.DSFLAG = 3; m.v['DS()'] = salin(m.v['DS4()']);\n"
        "      }")
t(2520, "if ((m.v.FLAG1 || 0) !== m.v.BYPASS) { m.v.FLAG1 = ((m.v.FLAG1 || 0) || 0) + 1; m.lompat(2550); }")
t(2560, "if (m.v.M < 2) m.v.M = 2 + Math.floor(m.acak() * 3);")
t(2570, "if (m.v.M > 69) m.v.M = 69 - Math.floor(m.acak() * 3);")
t(2580, "if (m.v.N < 2) m.v.N = 2 + Math.floor(m.acak() * 3);")
t(2590, "if (m.v.N > 35) m.v.N = 35 - Math.floor(m.acak() * 3);")
t(2620, "if (!m.v.DSNEW) { m.v.DSNEW = 1; m.lompat(2680); }")
t(2640, "if (m.v.DSFLAG === 1) {\n"
        "        m.v.DSFLAG = 0; m.taruh(m.v.MP, m.v.NP, m.v['DS1()'], 'XOR'); m.lompat(2680);\n"
        "      }")
t(2650, "if (m.v.DSFLAG === 2) {\n"
        "        m.v.DSFLAG = 0; m.taruh(m.v.MP, m.v.NP, m.v['DS2()'], 'XOR'); m.lompat(2680);\n"
        "      }")
t(2660, "if (m.v.DSFLAG === 3) {\n"
        "        m.v.DSFLAG = 0; m.taruh(m.v.MP, m.v.NP, m.v['DS3()'], 'XOR'); m.lompat(2680);\n"
        "      }")
t(2700, "if (m.v.O - (m.v.S || 0) > 10000 || m.v.FLAG === 1) m.lompat(2840);")

# --- 2840-3900: pesawat kekaisaran -----------------------------------------
t(2850, "if (m.v.G - (m.v.S || 0) > 26000) { m.gosub(1180); return; }",
   "Bagian pertama baris ini `GOSUB 1180`, bagian kedua `GOTO 3910` — dan\n"
   "     keduanya di baris yang sama. Di penelusur GOSUB-nya jadi bagian sendiri\n"
   "     supaya lompatannya terjadi SESUDAH subrutin itu pulang.")
t(2851, None)   # penanda; dihapus di bawah
del TANGAN[2851]
t(2860, "if (m.v.G - (m.v.S || 0) < 20000 && !m.v.IMPFIGH2) {\n"
        "        m.v.IMPFIGH2 = 1; m.v.IMFLAG = 1; m.v['IM()'] = salin(m.v['IM2()']);\n"
        "        m.v.IMX = 37; m.v.IMY = 20; m.v.IMR1 = 2; m.v.IMR2 = 2;\n"
        "      }",
   "IMX,IMY titik bidik dan IMR1,IMR2 JANGKAUAN TEMBAKNYA — dan ketiganya ikut\n"
   "     membesar bersama gambarnya. Pesawat yang lebih dekat lebih mudah kena,\n"
   "     tanpa satu pun perhitungan tersendiri.")
t(2870, "if (m.v.G - (m.v.S || 0) < 10000 && !m.v.IMPFIGH3) {\n"
        "        m.v.IMPFIGH3 = 1; m.v.IMFLAG = 2; m.v['IM()'] = salin(m.v['IM3()']);\n"
        "        m.v.IMX = 35; m.v.IMY = 19; m.v.IMR1 = 4; m.v.IMR2 = 3;\n"
        "      }")
t(2880, "if ((m.v.FLAG2 || 0) !== m.v.BYPASS) { m.v.FLAG2 = ((m.v.FLAG2 || 0) || 0) + 1; m.lompat(2910); }")
t(2970, "if (!m.v.IMNEW) { m.v.IMNEW = 1; m.lompat(3020); }")
t(2990, "if (m.v.IMFLAG === 1) {\n"
        "        m.v.IMFLAG = 0; m.taruh(m.v.EP, m.v.FP, m.v['IM1()'], 'XOR'); m.lompat(3020);\n"
        "      }")
t(3000, "if (m.v.IMFLAG === 2) {\n"
        "        m.v.IMFLAG = 0; m.taruh(m.v.EP, m.v.FP, m.v['IM2()'], 'XOR'); m.lompat(3020);\n"
        "      }")
t(3040, "if (m.v.G - (m.v.S || 0) > 5000 || m.v.FLAG3 === 1) m.lompat(3170);")
t(3190, "m.v.FLAG3 = 0; m.v.IMNEW = 0; m.v.IMNEW1 = 0;\n"
        "      m.v.IMPFIGH2 = 0; m.v.IMPFIGH3 = 0;\n"
        "      m.taruh(m.v.E, m.v.F, m.v['IM()'], 'XOR');")
t(3220, "if (m.v.DELTAX > 0) m.v.E = m.v.E + 1;")
t(3230, "if (m.v.DELTAX < 0) m.v.E = m.v.E - 1;")
t(3240, "if (m.v.DELTAY > 0) m.v.F = m.v.F + 1;")
t(3250, "if (m.v.DELTAY < 0) m.v.F = m.v.F - 1;")
t(3260, "if (m.v.DELTAX === 0 && m.v.DELTAY === 0) m.lompat(3320);")
t(3270, "m.taruh(m.v.E, m.v.F, m.v['IM()'], 'XOR');\n"
        "      if (!m.v.IMNEW1) { m.v.IMNEW1 = 1; m.lompat(3290); }")
t(3510, "/* FOR A=1 TO 50:NEXT A — jeda */")
t(3590, "[1, 2, 11, 12, 13, 14].forEach(function (k) { m.jebakan(k, false); });")
t(3600, "m.cls();")
t(3880, "m.v['IM()'] = salin(m.v['IM1()']);")

# --- 3910-5130: Vader ------------------------------------------------------
t(3920, "if (m.v.J - (m.v.S || 0) > 26000) { m.gosub(1180); return; }")
t(3930, "if (m.v.J - (m.v.S || 0) < 20000 && !m.v.DVADER2) {\n"
        "        m.v.DVADER2 = 1; m.v.DVFLAG = 1; m.v['DV()'] = salin(m.v['DV2()']);\n"
        "        m.v.DVX = 37; m.v.DVY = 20; m.v.DVR1 = 2; m.v.DVR2 = 2;\n"
        "      }")
t(3940, "if (m.v.J - (m.v.S || 0) < 10000 && !m.v.DVADER3) {\n"
        "        m.v.DVADER3 = 1; m.v.DVFLAG = 2; m.v['DV()'] = salin(m.v['DV3()']);\n"
        "        m.v.DVX = 35; m.v.DVY = 19; m.v.DVR1 = 4; m.v.DVR2 = 3;\n"
        "      }")
t(3950, "if ((m.v.FLAG2 || 0) !== m.v.BYPASS) { m.v.FLAG2 = ((m.v.FLAG2 || 0) || 0) + 1; m.lompat(3980); }")
t(4040, "if (!m.v.DVNEW) { m.v.DVNEW = 1; m.lompat(4090); }")
t(4060, "if (m.v.DVFLAG === 1) {\n"
        "        m.v.DVFLAG = 0; m.taruh(m.v.HP, m.v.IP, m.v['DV1()'], 'XOR'); m.lompat(4090);\n"
        "      }")
t(4070, "if (m.v.DVFLAG === 2) {\n"
        "        m.v.DVFLAG = 0; m.taruh(m.v.HP, m.v.IP, m.v['DV2()'], 'XOR'); m.lompat(4090);\n"
        "      }")
t(4110, "if (m.v.J - (m.v.S || 0) > 5000 || m.v.FLAG4 === 1) m.lompat(4350);")
t(4350, "if (m.v.J > (m.v.S || 0)) m.lompat(5140);")
t(4370, "m.v.FLAG4 = 0; m.v.DVNEW = 0; m.v.DVNEW1 = 0;\n"
        "      m.v.DVADER2 = 0; m.v.DVADER3 = 0;\n"
        "      m.taruh(m.v.H, m.v.I, m.v['DV()'], 'XOR');")
t(4400, "if (m.v.DELTAX > 0) m.v.H = m.v.H + 1;")
t(4410, "if (m.v.DELTAX < 0) m.v.H = m.v.H - 1;")
t(4420, "if (m.v.DELTAY > 0) m.v.I = m.v.I + 1;")
t(4430, "if (m.v.DELTAY < 0) m.v.I = m.v.I - 1;")
t(4440, "if (m.v.DELTAX === 0 && m.v.DELTAY === 0) m.lompat(4500);")
t(4450, "m.taruh(m.v.H, m.v.I, m.v['DV()'], 'XOR');\n"
        "      if (!m.v.DVNEW1) { m.v.DVNEW1 = 1; m.lompat(4470); }")

# 4500-4650: tembakan Vader — DVGONE memilih larik mana yang dipakai
_LEDAK = [(4500, 'HP', 'IP-1', 4), (4530, 'HP+3', 'IP-2', 5), (4540, 'HP', 'IP-1', 4),
          (4560, 'HP+2', 'IP-6', 6), (4570, 'HP+3', 'IP-2', 5), (4590, 'HP+1', 'IP-6', 7),
          (4600, 'HP+2', 'IP-6', 6), (4620, 'HP+2', 'IP-6', 8), (4630, 'HP+1', 'IP-6', 7),
          (4650, 'HP+2', 'IP-6', 8)]
def _ekspr(e):
    if '+' in e:
        a, b = e.split('+'); return "m.v.%s + %s" % (a, b)
    if '-' in e:
        a, b = e.split('-'); return "m.v.%s - %s" % (a, b)
    return "m.v.%s" % e
for nomor, ex, ey, idx in _LEDAK:
    t(nomor, "m.taruh(%s, %s, m.v[(m.v.DVGONE || 0) ? 'IM%d()' : 'DV%d()'], 'XOR');"
             % (_ekspr(ex), _ekspr(ey), idx, idx))
TANGAN[4500] = (TANGAN[4500][0],
   "4500-4650 tembakan Vader digambar dengan larik DV4..DV8 — kecuali kalau\n"
   "     `DVGONE` sudah menyala, yang berarti Vader sendiri sudah ditembak jatuh\n"
   "     dan yang menyerang tinggal pesawat biasa. Maka gambar IM4..IM8 yang\n"
   "     dipakai, dan seluruh pesannya ikut berganti. Satu bendera, dua musuh.")

t(4690, "/* FOR A=1 TO 50:NEXT A — jeda */")
t(4770, "[1, 2, 11, 12, 13, 14].forEach(function (k) { m.jebakan(k, false); });")
t(4780, "m.cls(); m.cetak('****  B O O M !  ****'); m.barisBaru();")
t(4840, "if ((m.v.DVGONE || 0) === 1) {\n"
        "        m.cetak('TOO BAD.  YOU HAVE BEEN SHOT DOWN.'); m.barisBaru();\n"
        "        m.lompat(4880);\n"
        "      }")
t(5010, "m.v['DV()'] = salin(m.v['DV1()']);")
t(5120, "m.v['DV()'] = salin(m.v['DV1()']);")

# --- 5140-5340: kapal pemain, waktu ----------------------------------------
t(5200, "m.v.SEC2 = 0;")
t(5230, "if ((m.v.SECNEW || 0) < (m.v.SECOLD || 0)) m.v.N8 = ((m.v.N8 || 0) || 0) + 1;",
   "Jam BASIC hanya memberi detik 00-59. Baris ini menghitung berapa kali angka\n"
   "     itu MELOMPAT MUNDUR, dan baris 5250 memakai `60*N8` untuk menyusun\n"
   "     kembali waktu yang sebenarnya. Menit dihitung dari kejutan.")
t(5260, "if ((m.v.A2NEW || 0) < 0) {\n"
        "        m.v.A2NEW = (m.v.A2NEW || 0) + 60; m.v.A1 = (m.v.A1 || 0) - 1; m.v.A2 = (m.v.A2 || 0) + 60;\n"
        "      }")
t(5300, "m.v.A = 3;",
   "5290-5300 TIDAK PERNAH DIJALANKAN: baris 5280 selalu `GOTO 2320`, dan\n"
   "     tidak ada satu pun lompatan ke 5290 atau 5300 di seluruh berkas. Sisa\n"
   "     dari 'DISPLAY SKY FIGHTER' yang tidak jadi dibangun.")

# --- 5350-5740: meriam -----------------------------------------------------
t(5360, "[2, 11, 12, 13, 14].forEach(function (k) { m.tundaJebakan(k); });",
   "Yang ditunda LIMA, bukan enam: jebakan F1 tidak menunda dirinya sendiri —\n"
   "     mesin sudah melakukannya selama penangannya berjalan.")
t(5420, "if (m.v.G - (m.v.S || 0) < 26000 && Math.abs(m.v.IMX - m.v.E) < m.v.IMR1\n"
        "          && Math.abs(m.v.IMY - m.v.F) < m.v.IMR2) m.lompat(5450);",
   "Uji kena: jarak dari titik bidik lebih kecil daripada JANGKAUAN yang ikut\n"
   "     membesar bersama gambarnya. Tidak ada geometri sama sekali.")
t(5430, "if (m.v.J - (m.v.S || 0) < 26000 && Math.abs(m.v.DVX - m.v.H) < m.v.DVR1\n"
        "          && Math.abs(m.v.DVY - m.v.I) < m.v.DVR2) m.lompat(5580);")
def _ledakan(nomor, larik, x, y):
    t(nomor, "m.untuk('I9', 1, 2, 1);\n"
             "      m.taruh(%s, %s, m.v['%s()'], 'XOR');\n"
             "      m.taruh(%s, %s, m.v['%s()'], 'XOR');\n"
             "      m.lanjutkan('I9');" % (x, y, larik, x, y, larik))
for nomor, lk in ((5450, 'EXPL3'), (5460, 'EXPL4'), (5490, 'EXPL5'),
                  (5500, 'EXPL6'), (5520, 'EXPL7'), (5530, 'EXPL8')):
    _ledakan(nomor, lk, 'm.v.E - 2', 'm.v.F - 3')
for nomor, lk in ((5580, 'EXPL3'), (5590, 'EXPL4'), (5620, 'EXPL5'),
                  (5630, 'EXPL6'), (5650, 'EXPL7'), (5660, 'EXPL8')):
    _ledakan(nomor, lk, 'm.v.H - 2', 'm.v.I - 3')
TANGAN[5450] = (TANGAN[5450][0],
   "Tiap bingkai ledakan digambar DUA KALI berturut-turut di tempat yang sama —\n"
   "     PUT XOR yang meniadakan dirinya sendiri. Yang tersisa cuma kedipannya,\n"
   "     dan latar di bawahnya utuh.")
t(5560, "m.v['IM()'] = salin(m.v['IM1()']);")
t(5670, "m.v.J = m.v.J + 25000;\n"
        "      m.v.H = Math.floor(m.acak() * 61) + 10;\n"
        "      m.v.I = Math.floor(m.acak() * 21) + 10;\n"
        "      m.v.FLAG4 = 0;\n"
        "      m.locate(19, 8); m.cetak('KM TO IMPERIAL FIGHTER');",
   "Vader ditembak jatuh — dan barisnya sendiri di panel diganti namanya jadi\n"
   "     'KM TO IMPERIAL FIGHTER'. Sesudah ini tidak ada lagi Darth Vader di\n"
   "     permainan ini, cuma pesawat biasa yang datang dari jarak yang sama.")
t(5700, "if (!(m.v.DVGONE || 0)) m.v['DV3()'] = salin(m.v['IM3()']);",
   "Dan gambar besarnya pun diganti gambar pesawat biasa.")
t(5710, "m.v['DV()'] = salin(m.v['DV1()']);")
t(5730, "[2, 11, 12, 13, 14].forEach(function (k) { m.jebakan(k, true); });")
t(5760, "[1, 11, 12, 13, 14].forEach(function (k) { m.tundaJebakan(k); });")
t(6080, "[1, 11, 12, 13, 14].forEach(function (k) { m.jebakan(k, true); });")

# --- 6100-6390: menang -----------------------------------------------------
t(6110, "[1, 2, 11, 12, 13, 14].forEach(function (k) { m.jebakan(k, false); });")
t(6130, "m.gambar('C3;S=SCALE;BM38,21;NM+6,0;NM-6,0;NM+0,-3;NM+0,3;NM-6,3;'\n"
        "             + 'NM+6,-3;NM-6,-3;NM+6,3;NM+3,-3;NM-3,3;NM+3,3;NM-3,-3;'\n"
        "             + 'NM+6,2;NM-6,-2;NM-6,1;NM+6,-1;NM+1,3;NM-1,-3');",
   "`S=SCALE;` membaca variabel SCALE dari dalam string DRAW, dan gelung di\n"
   "     baris 6120 menaikkannya dari 1 ke 24. X-wing yang membesar sampai memenuhi\n"
   "     layar. Awalan `N` di tiap perintah berarti 'gambar lalu KEMBALI ke titik\n"
   "     semula' — jadi seluruh bentuknya dipancarkan dari satu titik.")
t(6150, "m.cls();")
t(6180, "m.layar(0);")
t(6190, "/* FOR A=1 TO 10:NEXT A — jeda */")
t(6200, "m.layar(1);",
   "6160-6210 berkedip lima kali dengan cara BERGANTI MODE LAYAR. Kartunya butuh\n"
   "     waktu untuk menyetel ulang tiap kali, dan waktu itulah kedipannya.")
t(6220, "/* WIDTH 40 */")
t(6230, "m.cls(); m.barisBaru(); m.barisBaru(); m.barisBaru();")

# --- 6400-6740: tabrakan ---------------------------------------------------
t(6430, "if (m.v.DELTAX > 0) m.v.M = m.v.M + 1;")
t(6440, "if (m.v.DELTAX < 0) m.v.M = m.v.M - 1;")
t(6450, "if (m.v.DELTAY > 0) m.v.N = m.v.N + 1;")
t(6460, "if (m.v.DELTAY < 0) m.v.N = m.v.N - 1;")
t(6470, "if (m.v.DELTAX === 0 && m.v.DELTAY === 0) m.lompat(6530);")
t(6540, "m.lingkaran(38, 21, m.v.RAD, 3);")
t(6570, "m.cls(); m.cetak('CRASH'); m.barisBaru();")
t(6760, "[1, 2, 11, 12, 13, 14].forEach(function (k) { m.jebakan(k, false); });")
t(6770, "m.cls(); m.cetak('TOO LATE!'); m.barisBaru();")

# --- 6930-7960: petunjuk ---------------------------------------------------
for nomor in (6930, 7150, 7320, 7520, 7740, 7960):
    t(nomor, "m.cls();")
t(7290, "m.barisBaru(); m.barisBaru(); m.barisBaru(); m.barisBaru();")
for nomor, tanya in ((7140, '     (PRESS ENTER  TO  CONTINUE)'),
                     (7310, '      FAMILIARIZATION'),
                     (7510, '     (PRESS ENTER  TO  CONTINUE)'),
                     (7730, '    (PRESS ENTER  TO  CONTINUE)'),
                     (7950, 'PRESS ENTER FOR  TAKE-OFF')):
    t(nomor, "m.masukan('B$', %r);" % tanya)

# --- sisa yang belum tertangani -------------------------------------------
t(10, "m.cls();")
t(20, "m.layar(0);")
t(30, "/* WIDTH 40 */")
t(260, "m.v['A$'] = m.inkey(); if (m.v['A$'] === '') m.lompat(260);")
t(270, "/* WIDTH 80 */")
t(280, "m.cls();")
t(1300, "m.cls(); m.kosongkanVariabel();",
   "`CLEAR` mengosongkan SELURUH variabel — dan baris 5340 melompat ke sini\n"
   "     untuk memulai permainan baru. Jadi tiga belas gambar di baris 1340-2030\n"
   "     dibangun ulang dari nol tiap kali, termasuk ratusan penugasan lariknya.")
t(1310, "/* RANDOMIZE(VAL(RIGHT$(TIME$,2))) */")
t(2150, "m.v['K$'] = '5';")
t(2350, "m.locate(13, 1);\n"
        "      m.cetak(bas(m.v.W || 0) + '     ' + bas(-(m.v.V || 0)));",
   "`-V` dicetak dengan tanda dibalik: panah atas menambah V, tapi yang\n"
   "     ditampilkan kebalikannya, karena yang bergerak kapal pemain dan yang\n"
   "     terlihat bergerak justru sasarannya.")
t(2920, "if (m.v.E < 2) m.v.E = 2 + Math.floor(m.acak() * 3);")
t(2930, "if (m.v.E > 69) m.v.E = 69 - Math.floor(m.acak() * 3);")
t(2940, "if (m.v.F < 2) m.v.F = 2 + Math.floor(m.acak() * 3);")
t(2950, "if (m.v.F > 37) m.v.F = 37 - Math.floor(m.acak() * 3);")
t(3170, "if (m.v.G > (m.v.S || 0)) m.lompat(3910);")
t(3990, "if (m.v.H < 2) m.v.H = 2 + Math.floor(m.acak() * 3);")
t(4000, "if (m.v.H > 69) m.v.H = 69 - Math.floor(m.acak() * 3);")
t(4010, "if (m.v.I < 2) m.v.I = 2 + Math.floor(m.acak() * 3);")
t(4020, "if (m.v.I > 37) m.v.I = 37 - Math.floor(m.acak() * 3);")
t(5150, "m.v['Z$'] = m.inkey();")
t(5160, "var q = parseInt(m.v['Z$'], 10);\n"
        "      if (q > 0 && q < 10) m.v.Q = q;",
   "Satu-satunya tombol yang dibaca gelung utamanya: angka kecepatan. Semua\n"
   "     yang lain datang lewat jebakan.")
t(5340, "m.v['B$'] = m.inkey();\n"
        "      if (m.v['B$'] === m.chr(13)) m.lompat(1300);\n"
        "      else if (m.v['B$'] === m.chr(27)) { m.cls(); m.layar(0); m.henti('END di baris 5340.'); }\n"
        "      else m.lompat(5340);")
t(6410, "[1, 2, 11, 12, 13, 14].forEach(function (k) { m.jebakan(k, false); });")

# --- baris yang harus ditulis tangan karena penerjemahnya menolak ----------
t(5840, "if (m.titik(38, 21) !== 3) m.lompat(5880);",
   "INILAH BARISNYA. `POINT(38,21)` membaca WARNA satu piksel di pusat garis\n"
   "     bidik, dan warna 3 adalah Bintang Kematian. Pertanyaannya bukan 'di mana\n"
   "     sasarannya' melainkan 'apakah ada BAGIANNYA tepat di bidikan saya' — dan\n"
   "     yang menjawabnya bidang piksel itu sendiri.")
