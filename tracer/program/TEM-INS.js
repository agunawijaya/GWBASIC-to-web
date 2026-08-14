/* ===========================================================================
   TEM-INS.js — porting minimalis TEM-INS.BAS sebagai tabel baris.

   PROGRAM INI TIDAK MELAKUKAN APA-APA. Dua ratus sembilan puluh baris, dan
   yang dikerjakannya cuma mencetak teks lalu memanggil program lain:

       3010 CHAIN "Temple",700

   Ia petunjuk permainan "Temple of Loth" — sebuah varian Wizard's Castle —
   yang dipisahkan jadi berkas sendiri. Alasannya bukan kerapian. BASIC lama
   memuat SELURUH program ke memori sekaligus, dan tiga ratus baris teks
   petunjuk memakan ruang yang dibutuhkan permainannya. Memisahkannya adalah
   satu-satunya cara memuat keduanya.

   Itulah OVERLAY: dua program yang tidak pernah ada di memori bersamaan,
   saling memanggil lewat CHAIN, dan berpura-pura jadi satu.

   Di koleksi ini, TEM-INS adalah SATU-SATUNYA berkas yang seluruh isinya
   dokumentasi. Ia layak ditelusuri justru karena itu: struktur menu, tabel
   pemilah, dan cacatnya sama nyatanya dengan program yang menghitung sesuatu.

   TIGA HAL YANG LAYAK DILIHAT:

   (1) HAMPIR SEMUA STRING DI BERKAS INI TIDAK DITUTUP.

           60 LOCATE 12,7:PRINT "A. Character Creation
                                                      ^ tidak ada kutip

       GW-BASIC menerimanya: string yang belum ditutup berakhir di ujung
       baris. Ratusan kali di berkas ini, dan itu bukan kelalaian — itu gaya.

   (2) DAN JUSTRU KARENA ITU, SATU BARIS RUSAK DIAM-DIAM.

           910 ...on level 8 will "DROP" you down

       Di sini kutipnya ADA, dan ia MENUTUP string yang sedang berjalan.
       `DROP` lalu dibaca sebagai nama variabel — nilainya nol — dan
       `" you down` mulai string baru. Yang tampil: "will  0  you down".

   (3) TABEL PEMILAHNYA TIDAK URUT.

           330 IF A$="l" GOTO 2470
           340 IF A$="k" GOTO 2600

       L sebelum K. Bagian "Comments and Suggestions" ditulis lebih dulu
       daripada "Scoring", dan urutan baris menyimpan urutan penulisannya.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `COLOR` bertiga argumen: yang ketiga warna BINGKAI layar di SCREEN 0.
     Konsol penelusur tidak punya bingkai, jadi argumen ketiganya diabaikan.
   - Warna 27 dan 11 dengan latar 15 memakai atribut kedip; konsol tidak
     berkedip.
   - `CHAIN "Temple",700` belum bisa dijalankan: TEMPLE.BAS ADA di koleksi
     ini (1.187 baris), tapi ia program grafik dan belum diport. Penelusur
     berhenti dengan pesan program tak ditemukan.
   - Baris 2560 sudah disunting pemilik koleksi (nomor telepon RBBS dihapus).
   =========================================================================== */

(function (global) {
  'use strict';

  function KOTAK(kode) { return String.fromCharCode(kode); }
  function basic(n) { return (n < 0 ? '-' : ' ') + Math.abs(n) + ' '; }

  /* Baris yang cuma mencetak satu string lalu pindah baris. */
  function cet(n, isi) {
    return { baris: n, jalan: function (m) { m.cetak(isi); m.barisBaru(); } };
  }
  function kosong(n) {
    return { baris: n, jalan: function (m) { m.barisBaru(); } };
  }
  function rem(n) { return { baris: n, jalan: function () { } }; }
  function ke(n, tujuan) {
    return { baris: n, jalan: function (m) { m.lompat(tujuan); } };
  }
  function pet(n, baris, kolom, isi) {
    return { baris: n, jalan: function (m) {
      m.locate(baris, kolom); m.cetak(isi); m.barisBaru();
    } };
  }
  function taruh(n, baris, kolom) {
    return { baris: n, jalan: function (m) { m.locate(baris, kolom); } };
  }
  function hapus(n, baris, kolom, lebar) {
    return { baris: n, jalan: function (m) {
      m.locate(baris, kolom); m.cetak(m.ulang(lebar, 32)); m.barisBaru();
    } };
  }
  /* Tiap bagian berakhir dengan INPUT di baris 25 — satu-satunya jeda di
     seluruh berkas ini. */
  function tunggu(n, tanya) {
    return { baris: n, bagian: [
      function (m) { m.locate(25, 1); },
      function (m) { m.masukan('B$', tanya + '? '); }
    ] };
  }
  function warnaLalu(n, d, l, b) {
    return { baris: n, jalan: function (m) { m.warna(d, l, b); m.barisBaru(); } };
  }
  function laluWarna(n, d, l, b) {
    return { baris: n, jalan: function (m) { m.barisBaru(); m.warna(d, l, b); } };
  }
  function bersih(n, d, l, b) {
    return { baris: n, jalan: function (m) { m.cls(); m.warna(d, l, b); } };
  }
  function warnaTaruh(n, d, l, b, baris, kolom) {
    return { baris: n, jalan: function (m) {
      m.warna(d, l, b); m.locate(baris, kolom);
    } };
  }
  /* Tiga belas baris pemilah menu — dan dua di antaranya tertukar. */
  function menu(n, huruf, tujuan) {
    return { baris: n, jalan: function (m) {
      if (m.v['A$'] === huruf) m.lompat(tujuan);
    } };
  }

  var tabel = [

    { baris: 10, jalan: function (m) { m.cls(); m.warna(3, 0, 1); } },
    { baris: 20, jalan: function (m) {
        m.locate(1, 28); m.warna(27, 0, 1);
        m.cetak('Temple of Loth instructions'); m.barisBaru();
      } },
    warnaTaruh(30, 3, 0, 1, 4, 3),
    cet(40, "     Temple of Loth is a computerized simulation of one of the most common and       popular fantasy motifs, the lone adventurer's quest with an immense under       ground labyrinth. Each game is separate from all others, so the game is a"),
    cet(50, "     challenge even after you have won. Each game will result in a win or loss       depending on the player's  skill and luck.  The instruction  which follow       will explain the rules and options of the game."),
    { baris: 60, jalan: function (m) {
        m.warna(3, 0, 1); m.locate(12, 7);
        m.cetak('A. Character Creation'); m.barisBaru();
      } },
    rem(70)  /* 'LOCATE 4,45:PRINT "A. Sex */,
    rem(80)  /* 'LOCATE 5,7:PRINT "C. Points */,
    pet(90, 12, 45, "B. Equipments"),
    rem(100)  /* 'LOCATE 5,7:PRINT "C. Lamps and Flares */,
    pet(110, 13, 7, "C. The Temple"),
    pet(120, 13, 45, "D. Player Commands"),
    pet(130, 14, 7, "E. Magic Spells"),
    pet(140, 14, 45, "F. Treasures, Curses and Such"),
    pet(150, 15, 7, "G. Drow Merchants"),
    pet(160, 15, 45, "H. Monsters and The Runestaff"),
    { baris: 170, jalan: function (m) {
        m.locate(16, 7); m.cetak('I. Warps and ');
        m.warna(11, 0, 1); m.cetak('The Amulet of Chaos '); m.barisBaru();
        m.warna(3, 0, 1);
      } },
    pet(180, 16, 45, "J. Error Messages"),
    pet(190, 17, 7, "K. Scoring"),
    pet(200, 17, 45, "L. Comments and Suggestions"),
    pet(205, 18, 7, "M. Return to game"),
    taruh(210, 20, 6),
    { baris: 220, bagian: [
        function (m) { m.warna(11, 0, 1); },
        function (m) {
          m.masukan('A$',
            'Type in the number of the section desired then press return? ');
        }
      ] },
    /* 225 huruf besar jadi kecil dengan MENYALAKAN bit kelima. Kalau
       pemakai cuma menekan Enter, `A$` kosong dan `ASC("")` menghentikan
       program dengan galat 5 — Illegal function call. */
    { baris: 225, jalan: function (m) {
        if (m.v['A$'] === '') { m.galat(5, 'Illegal function call'); return; }
        m.v['A$'] = m.chr(m.v['A$'].charCodeAt(0) | 0x20);
      } },
    menu(230, 'a', 380),
    menu(240, 'b', 610),
    menu(250, 'c', 870),
    menu(260, 'd', 1190),
    menu(270, 'e', 1650),
    menu(280, 'f', 1770),
    menu(290, 'g', 2060),
    menu(300, 'h', 2160),
    menu(310, 'i', 2290),
    menu(320, 'j', 2390),
    menu(330, 'l', 2470),
    menu(340, 'k', 2600),
    menu(345, 'm', 3000),
    kosong(350),
    { baris: 360, jalan: function (m) {
        m.warna(11, 0, 15); m.cetak('Invalid input, try again'); m.barisBaru();
        m.warna(3, 0, 1);
      } },
    ke(370, 210),
    { baris: 380, jalan: function (m) { m.cls(); } },
    { baris: 390, jalan: function (m) { m.warna(11, 0, 1); } },
    cet(400, "                                  CHARACTER CREATION"),
    laluWarna(410, 3, 0, 1),
    cet(420, "     At the start of each game you will be asked a number of questions about"),
    cet(430, "what type of character you will have. You must make the choices as follows:"),
    kosong(440),
    cet(450, "RACE     You may be an Elf, Dwarf, Man, or Hobbit. Each score is randomly "),
    cet(460, "         generated, but bonus and deductions are different for each race."),
    kosong(470),
    cet(480, "SEX      You may be a female or male. Both are equal in number of points."),
    cet(490, "         Be creative in your response."),
    kosong(500),
    cet(510, "POINTS   Each character starts with a number of points for the attributes"),
    cet(520, "         of strength (ST), intelligence (IQ), and dexterity (DX).  In addition,"),
    cet(530, "         there are some other points you may distribute between these three"),
    cet(540, "         attributes as you wish."),
    kosong(550),
    cet(560, "         Your ST, IQ, and DX may be any number from 1 to 18. If any of the "),
    cet(570, "         three drop below 1, you have died. For all three attributes, the "),
    cet(580, "         larger the numerical value, the better. "),
    tunggu(590, "Press enter to return to main menu"),
    ke(600, 10),
    bersih(610, 11, 0, 1),
    cet(620, "                                   EQUIPMENT"),
    laluWarna(630, 3, 0, 1),
    cet(640, "    Every character is given 60 gold pieces (gp's), at the beginning of each"),
    cet(650, "to purchase some of the following items."),
    kosong(660),
    cet(670, "ARMOR    You may buy platemail armor for 30 gp's, chainmail for 20 gp's or"),
    cet(680, "         leather for 10 gp's. You can only wear one suit of armor at a time."),
    cet(690, "         The more expensive the armor, the more damage it will absorb."),
    kosong(700),
    cet(710, "WEAPONS  You may buy a sword for 30 gp's, a mace for 20 gp's, or a dagger for "),
    cet(720, "         10 gp's. You can only carry a single weapon at a time.  The more ex-"),
    cet(730, "         pensive the weapon, the more damage it does to the various monsters."),
    kosong(740),
    cet(750, "LAMP     If after selecting armor and weapons, you have 20 gp's left , you may"),
    cet(760, "         buy a lamp for 20 gp's. Having the lamp will allow you to look into"),
    cet(770, "         an adjacent room without having to enter it."),
    kosong(780),
    cet(790, "FLARES   If, after all purchases , you have money left, you may buy flares for"),
    cet(800, "         1 gp each. Lighting a flare reveals the contents of all the rooms "),
    cet(810, "         surrounding your current location."),
    kosong(820),
    cet(830, "         Once you have equipped your character, you are ready to enter the"),
    cet(840, "         Temple and begin your quest."),
    tunggu(850, "Press enter to return to main menu."),
    ke(860, 10),
    bersih(870, 11, 0, 1),
    cet(880, "                                   THE TEMPLE"),
    warnaLalu(890, 3, 0, 1),
    cet(900, "     The temple is arranged in a 8x8x8 three dimensional matrix.  This means     that there are 8 levels with 64 rooms on each level. The temple levels are      are numbered from 1 (the top level) to 8 (the bottom level. Each temple level"),
    /* 910 TIGA STRING, BUKAN SATU. Tanda kutip di sekitar "DROP" MENUTUP
       string yang sedang berjalan; `DROP` lalu dibaca sebagai nama variabel
       (nilainya nol, belum pernah diisi), dan `" you down` mulai string baru.
       Yang tampil di layar: "...on level 8 will  0  you down". */
    { baris: 910, jalan: function (m) {
        m.cetak(' is constructed in a doughnut like fashion, in that the ' +
          'north edge is connect    to the south edge and the east edge is ' +
          'connected to the west edge.  In a sim-   ular fashion, the ' +
          'sinkholes, explain later, on level 8 will ');
        m.cetak(basic(m.v.DROP || 0));
        m.cetak(' you down'); m.barisBaru();
      } },
    cet(920, " to level 1. The only room that does not work in this fashion is always locat-   ed at location (1,4) level 1. Going north from this room will take you out of   the temple and end the game."),
    kosong(930),
    cet(940, " Each room of the temple will have contents as one of the following."),
    kosong(950),
    cet(960, "   " + KOTAK(239) + " = The entrance / exit room"),
    cet(970, "   " + KOTAK(206) + " = An empty room containing nothing"),
    cet(980, "   U = Stairs going up a level"),
    cet(990, "   D = Stairs going down a level"),
    cet(1000, "   P = Magic Pool from which you may drink"),
    cet(1010, "   C = A chest you may open."),
    cet(1020, "   B = A book you may open"),
    cet(1030, "   G = From 1 to 10 gold pieces"),
    cet(1040, "   " + KOTAK(159) + " = From 1 to 3 flares"),
    cet(1050, "   " + KOTAK(219) + " = A warp to another random location"),
    tunggu(1060, "Press return to continue"),
    hapus(1070, 25, 1, 30),
    taruh(1080, 22, 1),
    cet(1090, "   " + KOTAK(157) + " = A monster (1 of 9 different types)"),
    cet(1100, "   * = A Drow fighter"),
    cet(1110, "   " + KOTAK(232) + " = A crystal orb"),
    cet(1120, "   T = A treasure (1 of 8 in the castle)"),
    cet(1130, "   " + KOTAK(178) + " = A Green Slime"),
    cet(1140, "   4 = A Red Dragon"),
    kosong(1150),
    cet(1160, "     The letters are the abbreviations for the room contents which are display-  ed whenever you look at a map or light a flare. When you look at a map, the     room you are currently located in is bracketed by < >"),
    tunggu(1170, "Press enter to return to main menu"),
    ke(1180, 10),
    bersih(1190, 11, 0, 1),
    cet(1200, "                             PLAYER COMMANDS"),
    warnaLalu(1210, 3, 0, 1),
    cet(1220, "     Whenever the program asks for a command, you must decide what action you    wish to preform. If your choice is not valid, the program will inform you and   allow you to try agian.  The following is a list of commands which the pro-"),
    cet(1230, " gram understands, with a description of their effects and restrictions:"),
    kosong(1240),
    cet(1250, " NORTH   Moves you to the room north from your present position. When go north           from the entrance / exit room, the game terminates. In all cases,              the north edge wraps around from the south."),
    kosong(1260),
    cet(1270, " SOUTH   Moves you to the room south of your present position. In all cases,             the south edge wraps around to the north edge."),
    kosong(1280),
    cet(1290, " EAST    Moves you to the room east of your present position. In all cases, the          east edge wraps around to the west."),
    kosong(1300),
    cet(1310, " WEST    Moves you to the room west of your present position. In all cases, the          west edge wraps around to the east."),
    kosong(1320),
    cet(1330, " UP/DOWN Causes you to ascend/descend stairs. You must be in a room containing           stairs to use this command."),
    kosong(1340),
    tunggu(1350, "Press return to continue"),
    hapus(1360, 25, 1, 27),
    taruh(1370, 22, 1),
    cet(1380, " DRINK   Causes you to take a drink from a magic pool. You may repeat this               command as often as you wish, but you must be in a room with a pool             to use this command."),
    kosong(1390),
    cet(1400, " MAP     Causes a map of the level you are currently on to be printed. All               unexplored  rooms are displayed as `?'.  All other rooms are dis-               played as their one character symbols. You may look at your map at"),
    kosong(1410),
    cet(1420, " FLARE   Cause one of your flares to be lit, revealing the contents of all the           rooms surrounding your current location. Because each edge is joined            to the opposite edge, you will always see nine rooms with your loca-"),
    cet(1430, "         as long as you have some and you are not blind or fighting a monster."),
    kosong(1440),
    cet(1450, " LAMP    Allows you to shine your lamp into any one of the rooms north, south,           east, and west of your current position, revealing the room contents.           Unlike flares, the lamp may be used repeatedly. You may use your lamp"),
    cet(1460, "         at any time as long as you have one, are not blind, and not attacking           a monster."),
    kosong(1470),
    cet(1480, " OPEN    Causes you to open a book or a chest which is in the room with you."),
    kosong(1490),
    tunggu(1500, "Press return to continue"),
    hapus(1510, 25, 1, 26),
    taruh(1520, 22, 1),
    { baris: 1530, jalan: function (m) {
        m.cetak(' GAZE    Causes you to gaze into a crystal orb. When you ' +
          'see yourself in a               bloody mess, you lose 1 or 2 ' +
          'points of strength.  When you see the              location of the ');
        m.warna(11, 0, 1); m.cetak('Amulet of Chaos'); m.warna(3, 0, 1);
      } },
    cet(1540, ", there is only a 50% chance that it "),
    cet(1550, "         is correct. You cannot gaze when you are blind or when you are not in           a room containing a crystal orb."),
    kosong(1560),
    { baris: 1570, jalan: function (m) {
        m.cetak(' TELE-   Allows you to teleport directly into a specific ' +
          'room any where in the   PORT    temple. This is the only way you ' +
          'can can enter the room containing              the');
        m.warna(11, 0, 1); m.cetak(' Amulet of Chaos.'); m.warna(3, 0, 1);
      } },
    cet(1580, " You must have the Runestaff to teleport!"),
    kosong(1590),
    cet(1600, " QUIT    Allows you to end the game while you are still in the temple. You will          be asked if you are, in case you change your mind. If you quit, you             will lose the game."),
    kosong(1610),
    cet(1620, " HELP    Causes a summary of available commands, abbreviations used in des-               cribing the contents of rooms, and the benefits of possessing each of            the treasures to be displayed at any time."),
    tunggu(1630, "Press enter to return to main menu"),
    ke(1640, 10),
    bersih(1650, 11, 0, 2),
    cet(1660, "                      MAGIC SPELLS"),
    warnaLalu(1670, 3, 0, 1),
    cet(1680, "     When ever your intelligence (IQ) becomes 15 or higher, you gain the option  of casting a magic spell on a monster if you have the very first combat         option. The three spells and there effects are as follows:"),
    kosong(1690),
    cet(1700, " WEB     Traps the monster in a sticky web so that it can't fight back as you            attack it. This spell lasts from 2 to 9 turns and costs you one                 strength (ST) point."),
    kosong(1710),
    cet(1720, " FIRE-   Hits the monster with a ball of flame that causes between 2 and 14      BALL    points worth of damage instantly. It costs one strength points and one          point of intelligence."),
    kosong(1730),
    cet(1740, " DEATH   is a contest of will between the monster and yourself, whoever has              the lower intelligence dies at once. It costs nothing to use, but it             is very risky. Even with an IQ of 18 (the highest possible), you"),
    tunggu(1750, "Press enter to return to main menu"),
    ke(1760, 10),
    bersih(1770, 11, 0, 1),
    cet(1780, "                       TREASURE, CURSES, AND SUCH"),
    warnaLalu(1790, 3, 0, 1),
    cet(1800, "     In the temple there are eight randomly placed treasures:"),
    kosong(1810),
    cet(1820, " The Ruby Red - Wards off the curse of lethargy."),
    cet(1830, " The Pale Pearl - Wards off the curse of the leech."),
    cet(1840, " The Opal Eye - Cures blindness."),
    cet(1850, " The Green Gem - Wards off the curse of forgetfulness."),
    cet(1860, " The Blue Flame - Dissolves books stuck to your hands."),
    cet(1870, " The Norn Stone - Has no special power."),
    cet(1880, " The Palantir - Has no special power."),
    cet(1890, " The Silmaril - Has no special power."),
    { baris: 1900, jalan: function (m) { m.barisBaru(); } },
    cet(1910, "     THERE ARE THREE CURSES:"),
    kosong(1920),
    cet(1930, " LETHARGY - This gives the monster the first attack which prevents you from                 bribing him or casting a spell on them."),
    kosong(1940),
    cet(1950, " LEECH - This takes from 1 to 5 gp's from you each turn until you have no gold           left at all!"),
    kosong(1960),
    tunggu(1970, "Press return to continue"),
    hapus(1980, 25, 1, 28),
    taruh(1990, 20, 1),
    cet(2000, " FORGETFULNESS - This causes you to forget what you know about each level of the          temple.  Your map will slowly turn back to all question marks, How-             ever, the contents of the rooms stay the same."),
    kosong(2010),
    cet(2020, "     In addition to nullifying the effects of the curses, the treasures can          also provide protection from two undesirable things which can happen            when you open a book.  These are going blind and which prevent you from"),
    cet(2030, "     seeing your maps, lighting flares, using your lamp, gazing into orbs, and       being informed or your current location, and secondly, having a book            stuck to your hands, which prevents you to draw your weapon to fight"),
    tunggu(2040, "Press enter to return to main menu"),
    ke(2050, 10),
    bersih(2060, 11, 0, 1),
    cet(2070, "                             DROW MERCHANTS"),
    warnaLalu(2080, 3, 0, 1),
    cet(2090, "      On every level there are Drow Merchants who sell necessary items at in-     flated prices. Normally, the merchants will make you an offer for every         treasure you have, and then, depending on the amount of gold you have, will"),
    cet(2100, " sell you new armor, a new weapon, a potion of strength, intelligence, and       dexterity (no matter how many potions you buy, the maximum amount for these"),
    cet(2110, " attributes is 18), and a lamp, if you don't already have one. If you chose to   attack the merchant, you will antagonize every one in the temple, and they      will all react as monsters. You will also lose the ability to trade with"),
    cet(2120, " them. Killing a merchant, however, will give you new platemail, a sword, one    of each kind of potion, and a lamp (if you don't already have one, in add-      ition to his hoard of between 1 and 1000 gold pieces. To end hostilities"),
    cet(2130, " and reestablish trading privileges, you must bribe any Merchant Drow in the     castle with the treasure of his choice."),
    tunggu(2140, "Press enter to return to main menu"),
    ke(2150, 10),
    bersih(2160, 11, 0, 1),
    cet(2170, "                         MONSTERS AND THE RUNESTAFF"),
    warnaLalu(2180, 3, 0, 1),
    cet(2190, "     There are 12 types of monsters in the temple:"),
    kosong(2200),
    cet(2210, " Green Slime, Orcs, Evil Dwarfs, Goblins, Mind Flayers, Trolls, Giant Spiders    Minotaurs, Driders, Balor Demon, Reds Dragons, and Drow Warriors."),
    kosong(2220),
    cet(2230, "     Please note that each time you strike a Drow Warrior or a Red Dragon,       there is a chance that your weapon will be shattered."),
    kosong(2240),
    cet(2250, "     Each monster possesses a hoard of from 1 to 1000 gp's which you obtain      when you kill a monster. In addition, one of the monsters is also carring The   Runestaff, (you won't know which until one until you kill it). You must have"),
    cet(2260, " The Runestaff to teleport, and when you teleport into the room with The         Amulet of Chaos, The Runestaff will disappear. (You must find your way out of   the temple without it)."),
    tunggu(2270, "Press enter to return to main menu"),
    ke(2280, 10),
    bersih(2290, 11, 0, 1),
    { baris: 2300, jalan: function (m) {
        m.cetak('                         WARPS AND ');
        m.warna(27, 0, 1); m.cetak('THE AMULET OF CHAOS'); m.barisBaru();
      } },
    warnaLalu(2310, 3, 0, 1),
    cet(2320, "      All but one of the rooms donated as `" + KOTAK(219) + "' are truly warps. Walking, fall-    ing, or teleporting into one of these warps will cause you to be instantly      transported to anywhere in the temple at random. The one exception to this"),
    { baris: 2330, jalan: function (m) {
        m.cetak(' rule is the room containing ');
        m.warna(11, 0, 1); m.cetak('The Amulet of Chaos'); m.warna(3, 0, 1);
        m.cetak('. This room is disguised as a'); m.barisBaru();
      } },
    cet(2340, " warp. Walking into this room causes you to move one room further in the same    direction. To actually enter this room, you must teleport in using The Rune-"),
    { baris: 2350, jalan: function (m) {
        m.cetak(' staff. At this point, you will acquire ');
        m.warna(11, 0, 1); m.cetak('The Amulet of Chaos'); m.warna(3, 0, 1);
        m.cetak('. The Runestaff will'); m.barisBaru();
      } },
    cet(2360, " disappear at this point. Remember, to win the game, you must leave the temple   with the amulet in your possession."),
    tunggu(2370, "Press enter to return to the main menu"),
    ke(2380, 10),
    bersih(2390, 11, 0, 1),
    cet(2400, "                             ERROR MESSAGES"),
    warnaLalu(2410, 3, 0, 1),
    cet(2420, "     Anytime you receive a highlighted message with a `**', it means that the     last thing you typed was unacceptable to the program at the time. For in- "),
    { baris: 2430, jalan: function (m) {
        m.cetak(' stance '); m.warna(11, 0, 1);
        m.cetak("** It's hard to gaze without an orb."); m.warna(3, 0, 1);
        m.cetak(', this means that you tried to'); m.barisBaru();
      } },
    cet(2440, " gaze from a room which did not contain a crystal orb. You are always required   to redo your last response when you receive an `**' message."),
    tunggu(2450, "Press enter to return to main menu"),
    ke(2460, 10),
    bersih(2470, 11, 0, 1),
    cet(2480, "                               COMMENTS AND SUGGESTION"),
    warnaLalu(2490, 3, 0, 1),
    cet(2500, "      I hope that all enjoy this program. If you have any comments or suggest-   ions, please send them to:"),
    kosong(2510),
    cet(2520, "                            John Belew"),
    cet(2530, "                            4329 Lenoso Common"),
    cet(2540, "                            Fremont CA, 94536"),
    kosong(2550),
    cet(2560, "     if you have any ideas to improve this program yourself please do. Upload    your improved version on Wes Meier's RBBS at area code [disunting - UU PDP No. 27/2022]."),
    cet(2570, ""),
    tunggu(2580, "Press enter to return to main menu"),
    ke(2590, 10),
    bersih(2600, 11, 0, 1),
    cet(2610, "                                      SCORING "),
    warnaLalu(2620, 3, 0, 1),
    cet(2630, "   Each game that you play you will be given a score. The scoring formula goes   as follows:"),
    kosong(2640),
    cet(2650, "     1 point for each gold piece  +  100 times your combined attribute scores"),
    kosong(2655),
    cet(2660, "       + 1000 points for each monster killed  - 5 times the turns played"),
    kosong(2670),
    cet(2680, " Bonus points are scored as follows:"),
    cet(2690, ""),
    cet(2700, "                  5000 for each treasure"),
    cet(2710, "                 10000 for finding the Runestaff"),
    cet(2720, "                 20000 for finding the Amulet of Chaos"),
    cet(2730, ""),
    cet(2740, " You will then be ranked into one of the following classes:"),
    kosong(2750),
    cet(2760, "             0 - 20000  Whimp                  20000 - 35000  Peasent"),
    cet(2770, "         35000 - 50000  Ameteur                50000 - 75000  Scout"),
    cet(2780, "         90000 -110000 Adventurer            110000 -125000  Hero"),
    cet(2790, "        125000 -140000  Wizard                140000+  Lord"),
    cet(2800, ""),
    cet(2810, "  The highest score to date is that of Lord Nur" + KOTAK(163) + "cc: 142,498"),
    taruh(2820, 25, 1),
    { baris: 2830, jalan: function (m) {
        m.masukan('B$', 'Press enter to return to Main Menu? ');
      } },
    ke(2840, 10),
    { baris: 3000, jalan: function (m) { m.cls(); } },
    /* 3010 PULANG KE PERMAINANNYA, di baris 700. Berkas ini memang tidak
       punya permainan sama sekali — ia cuma teksnya. */
    { baris: 3010, jalan: function (m) { m.rantai('Temple', 700); } }
  ];

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['TEM-INS'] = {
    nama: 'TEM-INS',
    judul: 'Temple of Loth — petunjuk (program yang isinya cuma teks)',
    sumber: 'TEM-INS',
    berkas: 'run/TEM-INS.BAS',
    tabel: tabel,
    benih: 71,

    arsitektur: {
      judul: 'Alur TEM-INS.BAS',
      simpul: [
        { id: 'menu', baris: '10-210', jenis: 'mulai',
          teks: ['Tiga belas judul bagian,', 'A sampai M'] },
        { id: 'pilih', baris: '220-345', jenis: 'putusan',
          teks: ['Huruf dikecilkan lalu', 'dicocokkan satu per satu'] },
        { id: 'salah', baris: '350-370', jenis: 'galat',
          teks: ['"Invalid input, try again"'] },
        { id: 'bagian', baris: '380-2840',
          teks: ['Dua belas dinding teks;', 'tiap satu diakhiri INPUT'] },
        { id: 'pulang', baris: '3000-3010', jenis: 'keluar',
          teks: ['CHAIN "Temple",700', '— kembali ke permainannya'] }
      ],
      panah: [
        { dari: 'menu', ke: 'pilih' },
        { dari: 'pilih', ke: 'bagian', label: 'A-L' },
        { dari: 'pilih', ke: 'salah', label: 'huruf lain', jenis: 'galat' },
        { dari: 'salah', ke: 'pilih' },
        { dari: 'bagian', ke: 'menu', label: 'Enter' },
        { dari: 'pilih', ke: 'pulang', label: 'M' }
      ]
    },

    pseudokode: [
      { baris: 225, tingkat: 0, teks: '<code>CHR$(ASC(A$) OR &amp;H20)</code> &mdash; huruf besar jadi kecil dengan <b>menyalakan satu bit</b>' },
      { baris: 225, tingkat: 1, teks: 'Enter kosong &rarr; <code>ASC("")</code> &rarr; <b>galat 5, program berhenti</b>' },
      { baris: 330, tingkat: 0, teks: '<code>"l"</code> diperiksa <b>sebelum</b> <code>"k"</code> &mdash; urutan penulisan, bukan urutan abjad' },
      { baris: 910, tingkat: 0, teks: 'kutip di sekitar <code>"DROP"</code> <b>menutup</b> string dan memecah barisnya jadi tiga' },
      { baris: 1050, tingkat: 0, teks: 'legenda ruangan memakai aksara kotak CP437 langsung di dalam string' },
      { baris: 2560, tingkat: 0, teks: 'ajakan mengunggah versi perbaikan ke RBBS &mdash; <b>sumber terbuka, 1980-an</b>' },
      { baris: 3010, tingkat: 0, teks: '<code>CHAIN "Temple",700</code> &mdash; petunjuk dan permainan <b>tidak pernah ada di memori bersamaan</b>' }
    ],

    perintahAsli: 'run\\TEM-INS.bat',
    catatanAsli: 'Ketik satu huruf A sampai M lalu Enter. M kembali ke ' +
      'permainan. TEMPLE.BAS ada di koleksi ini &mdash; 1.187 baris ' +
      '&mdash; tapi belum diport, jadi di penelusur alurnya berhenti di sana.',

    penyimpangan: [
      '<b>Argumen ketiga <code>COLOR</code> diabaikan.</b> Di ' +
      '<code>SCREEN 0</code>, <code>COLOR depan, latar, bingkai</code> &mdash; ' +
      'yang ketiga mewarnai <b>pinggiran layar</b> di luar area teks. Konsol ' +
      'penelusur tidak punya pinggiran.',

      '<b>Warna 27 (baris 20 dan 2300) dan latar 15 (baris 360) memakai ' +
      'atribut kedip</b>; konsol tidak berkedip.',

      '<b><code>CHAIN "Temple",700</code> belum bisa dijalankan.</b> ' +
      'TEMPLE.BAS <b>ada</b> di koleksi ini &mdash; 1.187 baris, dan baris ' +
      '11570-nya memanggil balik <code>CHAIN"TEM-INS.BAS",10</code> &mdash; ' +
      'tapi ia program grafik dan belum diport. Penelusur berhenti dengan ' +
      'pesan program tidak ditemukan.',

      '<b>Baris 2560 sudah disunting pemilik koleksi ini</b> &mdash; nomor ' +
      'telepon papan buletin RBBS digantikan penanda.',

      '<b>Baris 225 dibuat gagal secara eksplisit saat masukan kosong.</b> ' +
      '<code>ASC("")</code> di GW-BASIC menghentikan program dengan galat 5; ' +
      'penelusur menirukan galat itu, bukan mengabaikannya.'
    ],

    pelajaran: {
      ringkas: 'Satu-satunya berkas di koleksi ini yang seluruh isinya ' +
        'dokumentasi &mdash; dipisahkan bukan demi kerapian, tapi karena ' +
        'memorinya tidak cukup untuk keduanya sekaligus.',
      pelajari: [
        ['Dokumentasi sebagai overlay',
         'BASIC lama memuat <b>seluruh</b> program ke memori sekaligus. Tiga ' +
         'ratus baris teks petunjuk memakan ruang yang dibutuhkan ' +
         'permainannya. Memisahkannya jadi berkas sendiri, lalu ' +
         '<code>CHAIN</code> bolak-balik, adalah satu-satunya cara memuat ' +
         'keduanya.',
         'Jadi keputusan yang hari ini terlihat seperti "memisahkan ' +
         'dokumentasi dari kode" sebenarnya <b>manajemen memori</b>. ' +
         'Batasannya yang menghasilkan strukturnya, bukan seleranya.'],
        ['String yang tidak perlu ditutup',
         'Hampir setiap <code>PRINT</code> di berkas ini mengakhiri stringnya ' +
         'tanpa kutip penutup. GW-BASIC menerimanya &mdash; string yang belum ' +
         'ditutup berakhir di ujung baris. Ratusan kali, konsisten.',
         'Untungnya nyata: satu bita lebih pendek per baris di berkas ' +
         'tertokenisasi, dan tiga ratus baris berarti tiga ratus bita. Di ' +
         'mesin dengan 64K ruang kerja, itu bukan angka yang bisa diabaikan.'],
        ['Huruf besar jadi kecil dengan satu bit',
         '<code>A$=CHR$(ASC(A$) OR &amp;H20)</code>. Di ASCII, huruf besar dan ' +
         'kecil berbeda tepat satu bit &mdash; bit kelima. Menyalakannya ' +
         'mengubah "A" jadi "a" tanpa perbandingan apa pun, dan huruf yang ' +
         'sudah kecil tidak berubah.'],
        ['Ajakan yang mendahului zamannya',
         'Baris 2560: <i>"if you have any ideas to improve this program ' +
         'yourself please do. Upload your improved version on Wes Meier\'s ' +
         'RBBS"</i>. Nama, alamat rumah, dan nomor papan buletin, tercetak di ' +
         'dalam programnya sendiri. Distribusi, kontribusi, dan tempat ' +
         'mengirimkannya &mdash; semuanya di satu layar teks, sepuluh tahun ' +
         'sebelum ada kata untuk itu.']
      ],
      hindari: [
        ['Kutip yang menutup string yang tidak diniatkan berhenti',
         'Baris 910 menulis <code>will "DROP" you down</code> di tengah ' +
         'sebuah <code>PRINT</code>. Kutip pertama <b>menutup</b> string yang ' +
         'sedang berjalan; <code>DROP</code> lalu dibaca sebagai nama ' +
         'variabel &mdash; kosong, jadi nol &mdash; dan <code>" you down</code> ' +
         'mulai string baru.',
         'Yang tampil di layar: <i>"on level 8 will&nbsp; 0 &nbsp;you ' +
         'down"</i>. Dan tidak ada galat, tidak ada peringatan. Justru karena ' +
         'string yang tak ditutup <b>sah</b> di sini, yang salah pun sah.'],
        ['Tabel pemilah yang tidak urut',
         'Baris 330 memeriksa <code>"l"</code>, baris 340 memeriksa ' +
         '<code>"k"</code>. Menu di layar menampilkan K sebelum L. Urutan ' +
         'barisnya menyimpan <b>urutan penulisan</b>, bukan urutan yang ' +
         'dilihat pemakai &mdash; bagian "Comments" ditulis sebelum "Scoring" ' +
         'selesai.'],
        ['Menu yang menyuruh mengetik hal yang salah',
         'Baris 220: <i>"Type in the <b>number</b> of the section desired"</i>. ' +
         'Bagian-bagiannya bernomor <b>huruf</b>, A sampai M, dan baris 225 ' +
         'hanya bisa memproses huruf. Mengetik angka selalu berujung ke ' +
         '"Invalid input".'],
        ['Masukan kosong yang menghentikan program',
         'Baris 225 memanggil <code>ASC(A$)</code> tanpa memeriksa apakah ' +
         '<code>A$</code> kosong. Menekan Enter saja di menu utama ' +
         'menghentikan program dengan <b>Illegal function call</b> &mdash; dan ' +
         'karena ini overlay, pemain kehilangan permainannya sekalian.'],
        ['Dua hitungan yang tidak cocok',
         'Baris 1090 menyebut monster sebagai <i>"1 of <b>9</b> different ' +
         'types"</i>. Baris 2190 menyebut <i>"There are <b>12</b> types of ' +
         'monsters"</i>, lalu baris 2210 menyebutkan dua belas namanya. ' +
         'Legendanya tidak ikut diperbarui waktu monsternya ditambah.'],
        ['Lubang di tabel peringkat',
         'Baris 2770-2780: <code>50000 - 75000 Scout</code>, lalu ' +
         '<code>90000 -110000 Adventurer</code>. Selang <b>75.000 sampai ' +
         '90.000 tidak punya peringkat sama sekali</b>. Delapan gelar untuk ' +
         'sebuah garis bilangan yang bolong di tengahnya.'],
        ['Baris menu yang dikomentari dan ditinggalkan',
         'Baris 70, 80, dan 100 adalah entri menu lama yang dimatikan dengan ' +
         'petik tunggal. Dua di antaranya &mdash; 80 dan 100 &mdash; sama-sama ' +
         'diberi label "C." dan sama-sama di <code>LOCATE 5,7</code>, dengan ' +
         'judul yang berbeda. Itu <b>dua rancangan menu yang berbeda</b>, ' +
         'keduanya tertinggal di berkas yang sama.'],
        ['Salah eja yang bertahan sampai ke tabel peringkat',
         '<code>Whimp</code>, <code>Peasent</code>, <code>Ameteur</code>, ' +
         '<code>agian</code>, <code>simular</code>, <code>donated as</code> ' +
         '(untuk "denoted as"), <code>carring</code>, dan ' +
         '<code>SUGGESTION</code> tanpa S di judul bagian L.']
      ]
    },

    penjelasan: [
      { judul: 'Berkas yang tidak menghitung apa pun',
        isi: [
          'Dua ratus sembilan puluh baris, dan tidak satu pun di antaranya ' +
          'menghitung sesuatu. Tidak ada gelung yang menghasilkan angka, tidak ' +
          'ada larik, tidak ada <code>RND</code>. Yang ada cuma ' +
          '<code>PRINT</code>, <code>LOCATE</code>, <code>COLOR</code>, dan ' +
          'tiga belas <code>IF</code> yang memilih blok mana yang dicetak.',
          'Dan justru itu yang membuatnya layak ditelusuri.',
          'Berkas ini ada karena sebuah batasan yang sudah lama hilang: BASIC ' +
          'memuat <b>seluruh</b> program ke memori sekaligus. Ruang kerjanya ' +
          '64K, dibagi antara kode, variabel, dan larik. Permainan seukuran ' +
          'Temple of Loth &mdash; dengan matriks 8&times;8&times;8, dua belas ' +
          'jenis monster, dan delapan harta &mdash; sudah memakan sebagian ' +
          'besarnya.',
          'Tiga ratus baris teks petunjuk tidak muat.',
          'Jadi petunjuknya dipindahkan ke berkas sendiri, dan keduanya ' +
          'saling memanggil dengan <code>CHAIN</code>. Waktu pemain minta ' +
          'petunjuk, permainannya <b>dibuang dari memori</b>, petunjuknya ' +
          'dimuat, dibaca, lalu dibuang lagi dan permainannya dimuat kembali ' +
          '&mdash; melanjutkan di baris 700, seolah tidak pernah pergi.',
          'Hari ini kita menyebutnya <i>lazy loading</i> atau pemisahan ' +
          'berkas, dan alasannya kerapian. Di sini alasannya bertahan hidup.',
          'Dan pasangannya memang selamat. TEMPLE.BAS ada di koleksi ini, ' +
          '1.187 baris, dan baris 11570-nya memanggil balik berkas ini: ' +
          '<code>CHAIN"TEM-INS.BAS",10</code>. Keduanya saling menunjuk, ' +
          'persis seperti yang dirancang.',
          'Bahkan skor tertinggi yang disebut baris 2810 halaman ini &mdash; ' +
          '142.498 milik Lord Nur&uacute;cc &mdash; muncul lagi di baris ' +
          '12100 TEMPLE.BAS, sebagai ambang yang memicu pesan yang menyuruh ' +
          'pemainnya <i>mengganti skor itu di Tem-Ins.Bas</i>. Angka sama, ' +
          'di dua berkas, saling menunggu diperbarui.'
        ] },
      { judul: 'Kutip yang menutup terlalu cepat',
        isi: [
          'Gaya berkas ini konsisten: string tidak ditutup.',
          '<code>60 LOCATE 12,7:PRINT "A. Character Creation</code>',
          'GW-BASIC menerimanya. Sebuah string yang belum ditutup berakhir di ' +
          'ujung barisnya, dan itu berlaku di ratusan tempat di sini.',
          'Lalu baris 910:',
          '<code>910 PRINT " ...on level 8 will "DROP" you down</code>',
          'Penulisnya ingin kata DROP tampil di dalam tanda kutip. Tapi ' +
          'penafsir tidak punya cara tahu itu &mdash; kutip pembuka kedua ' +
          '<b>menutup</b> string yang sedang berjalan.',
          'Yang sebenarnya dijalankan ada tiga bagian: string sampai ' +
          '<code>will </code>, lalu variabel bernama <code>DROP</code> yang ' +
          'belum pernah diisi apa-apa (nilainya nol), lalu string ' +
          '<code>" you down</code> yang juga tidak ditutup.',
          'Hasil di layar: <i>on level 8 will&nbsp; 0 &nbsp;you down</i>.',
          'Tidak ada galat. Tidak ada peringatan. Program berjalan sempurna.',
          'Dan di sinilah letak pelajarannya: <b>gaya yang membolehkan string ' +
          'tak ditutup juga membolehkan string yang salah tutup</b>. Kalau ' +
          'berkas ini konsisten menutup setiap stringnya, baris 910 akan ' +
          'menjadi galat sintaks yang langsung ketahuan. Kelonggaran yang ' +
          'menghemat tiga ratus bita membeli kembali satu cacat yang tidak ' +
          'pernah ditemukan siapa pun.'
        ] }
    ]
  };
})(window);
