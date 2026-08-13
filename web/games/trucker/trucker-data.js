/* ===========================================================================
   trucker-data.js — diambil langsung dari DATA baris 9030-9700 run/TRUCKER.BAS
   oleh skrip; jangan disunting tangan.

   Tiap titik jalan punya EMPAT angka, dan yang keempat memuat dua hal
   sekaligus: bagian bulatnya jenis kejadian (baris 3130 ON INT(ZH) GOSUB),
   bagian pecahannya PELUANG KEJADIAN ITU TIDAK JADI (baris 3360/3410/3710:
   IF RND < ZH-INT(ZH) THEN RETURN) -- kecuali untuk jenis 2, di mana
   pecahannya adalah BESAR TOLNYA dalam dolar (baris 3310: T=100*(ZH-INT(ZH))).
   =========================================================================== */
window.RETRO = window.RETRO || {};
RETRO.TRUCKER = {
  /* Urutan DATA-nya 0,1,2 tapi tombolnya n/m/s -> RT 1/0/2 (baris 1365-1375). */
  RUTE: [
    { rt: 0, nama: 'middle', mil: 2850, titik: [
      { m: 90, n: "Barstow", j: "I-15 in California", z: 7.8 },
      { m: 225, n: "Needles", j: "I-40 in California", z: 1.0 },
      { m: 440, n: "Flagstaff", j: "I-40 in California", z: 3.65 },
      { m: 620, n: "Gallup", j: "I-40 in Arizona", z: 5.5 },
      { m: 760, n: "Albuquerque", j: "I-40 in New Mexico", z: 3.35 },
      { m: 930, n: "Tucumcari", j: "I-40 in New Mexico", z: 1.0 },
      { m: 1040, n: "Amarillo", j: "I-40 in Texas", z: 7.8 },
      { m: 1155, n: "Oklahoma border", j: "I-40 in Texas", z: 5.5 },
      { m: 1305, n: "Oklahoma City", j: "I-40 in Oklahoma", z: 2.65 },
      { m: 1530, n: "Missouri border", j: "Oklahoma Turnpike", z: 2.4 },
      { m: 1815, n: "St. Louis", j: "I-44 in Missouri", z: 0.0 },
      { m: 1980, n: "Terre Haute", j: "I-70 in Illinois", z: 5.5 },
      { m: 2050, n: "Indianapolis", j: "I-70 in Indianna", z: 0.0 },
      { m: 2115, n: "Ohio border", j: "I-70 in Indianna", z: 1.0 },
      { m: 2220, n: "Columbus", j: "I-70 in Ohio", z: 5.5 },
      { m: 2350, n: "Wheeling West Virginia", j: "I-70 in Ohio", z: 4.25 },
      { m: 2410, n: "New Stanton", j: "I-70 in Pennsylvania", z: 6.75 },
      { m: 2570, n: "Harrisburg", j: "Pennsylvania Turnpike", z: 3.75 },
      { m: 2760, n: "New Jersey border", j: "Pennsylvania Turnpike", z: 2.95 },
      { m: 2840, n: "Holland Tunnel", j: "I-70 in New Jersey", z: 2.4 },
      { m: 9999, n: "New York", j: "New York streets", z: 0.0 },
    ] },
    { rt: 1, nama: 'northern', mil: 2710, titik: [
      { m: 90, n: "Barstow", j: "I-15 in California", z: 7.8 },
      { m: 245, n: "Las Vegas", j: "I-15 in California", z: 1.0 },
      { m: 365, n: "Utah border", j: "I-15 in Arizona", z: 0.0 },
      { m: 500, n: "End of Interstate", j: "I-15 in Utah", z: 3.2 },
      { m: 555, n: "Salina", j: "US-89 in Utah", z: 4.5 },
      { m: 760, n: "Grand Junction", j: "I-70 in Utah", z: 5.4 },
      { m: 1010, n: "Denver", j: "I-70 in Colorado", z: 3.75 },
      { m: 1190, n: "Nebraska border", j: "I-76 in Colorado", z: 1.0 },
      { m: 1450, n: "Omaha", j: "I-80 in Nebraska", z: 5.5 },
      { m: 1590, n: "Demoines", j: "I-80 in Iowa", z: 4.75 },
      { m: 1750, n: "Illinois border", j: "I-80 in Iowa", z: 5.6 },
      { m: 1910, n: "Gary", j: "I-80 in Illinois", z: 2.5 },
      { m: 2050, n: "Ohio border", j: "Indianna Turnpike", z: 2.45 },
      { m: 2215, n: "Cleveland", j: "Ohio Turnpike", z: 2.8 },
      { m: 2280, n: "Pennsylvania border", j: "I-80 in Ohio", z: 4.16 },
      { m: 2615, n: "East Stroudsberg", j: "I-80 in Pennsylvania", z: 3.33 },
      { m: 2675, n: "Washington Bridge", j: "I-80 in New Jersey", z: 2.2 },
      { m: 9999, n: "New York", j: "city streets", z: 0.0 },
    ] },
    { rt: 2, nama: 'southern', mil: 3120, titik: [
      { m: 75, n: "Palm Springs", j: "I-10 in California", z: 0.0 },
      { m: 225, n: "Blythe", j: "I-10 in California", z: 1.0 },
      { m: 375, n: "Phoenix", j: "I-10 in Arizona", z: 0.0 },
      { m: 495, n: "Tucson", j: "I-10 in Arizona", z: 7.9 },
      { m: 650, n: "Lordsburg", j: "I-10 in Arizona", z: 5.75 },
      { m: 795, n: "El Paso", j: "I-10 in New Mexico", z: 0.0 },
      { m: 965, n: "Pecos", j: "I-10 in Texas", z: 1.0 },
      { m: 1080, n: "Odessa", j: "I-20 in Texas", z: 0.0 },
      { m: 1250, n: "Abilene", j: "I-20 in Texas", z: 3.8 },
      { m: 1439, n: "Dallas", j: "I-20 in Texas", z: 0.0 },
      { m: 1610, n: "Louisiana border", j: "I-20 in Texas", z: 5.0 },
      { m: 1785, n: "Vicksburg", j: "I-20 in Louisiana", z: 0.0 },
      { m: 1965, n: "Alabama border", j: "I-20 in Mississippi", z: 1.0 },
      { m: 2100, n: "Birmingham", j: "I-20 in Alabama", z: 4.25 },
      { m: 2200, n: "Georgia border", j: "I-20 in Alabama", z: 0.0 },
      { m: 2255, n: "Atlanta", j: "I-20 in Georgia", z: 0.0 },
      { m: 2320, n: "Carolina border", j: "I-85 in Georgia", z: 5.75 },
      { m: 2565, n: "Greensboro", j: "I-85 in Carolina", z: 3.8 },
      { m: 2680, n: "Virginia border", j: "I-85 in North Carolina", z: 7.85 },
      { m: 2775, n: "Richmond", j: "I-85 in Virginia", z: 0.0 },
      { m: 2880, n: "Washington D.C.", j: "I-95 in Virginia", z: 0.0 },
      { m: 2920, n: "Baltimore", j: "I-95 in Maryland", z: 2.3 },
      { m: 2990, n: "New Lersey border", j: "I-95 in Delaware", z: 2.25 },
      { m: 3110, n: "Holland Tunnel", j: "New Jersey Turnpike", z: 2.4 },
      { m: 9999, n: "New York", j: "city streets", z: 0.0 },
    ] },
  ],

  /* Baris 3130: ON INT(ZH) GOSUB 3210,3310,3360,3410,3500,3710,3860 */
  KEJADIAN: ['—', 'zona waktu', 'tol', 'perbaikan jalan', 'radar',
             'jembatan timbang', 'longsor terowongan', 'unit pendingin'],

  /* Baris 200 */
  HARI: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
  /* Baris 190 */
  KE: ['first','second','third','fourth']
};
