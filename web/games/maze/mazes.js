/* ===========================================================================
   mazes.js — kelima labirin dari MAZE.BAS, disalin apa adanya.

   DIBANGKITKAN OTOMATIS dari pernyataan DATA di run/MAZE.BAS. Jangan disunting
   tangan.

   Aslinya tidak MEMBANGKITKAN labirin. Ia menyimpan lima labirin tetap di
   dalam DATA, lalu memilih salah satunya dengan membaca maju:

       2370 FOR C=1 TO FIX(RND*5)+1
       2380   FOR A=0 TO 7:READ B(A):NEXT
       2390   FOR A=0 TO 7:FOR B=0 TO 7:READ A(A,B):NEXT B,A
       2400 NEXT C

   Tidak ada cara melompat ke blok DATA tertentu di BASIC — penunjuk READ
   hanya bisa maju, atau dikembalikan ke awal dengan RESTORE. Jadi "memilih
   yang ke-N" berarti benar-benar membaca N blok berturut-turut dan membuang
   N-1 di antaranya.

   Tiap sel adalah bitmask dinding:  8 = utara, 4 = timur, 2 = selatan, 1 = barat
   Arah:                             1 = utara, 2 = timur, 3 = selatan, 4 = barat
   =========================================================================== */
window.RETRO = window.RETRO || {};
window.RETRO.MAZES = [
 {
  "start": [
   7,
   3
  ],
  "exit": [
   8,
   2
  ],
  "dir": 1,
  "altStart": [
   3,
   7
  ],
  "altDir": 1,
  "cells": [
   [
    11,
    12,
    9,
    10,
    8,
    12,
    11,
    12
   ],
   [
    9,
    2,
    4,
    9,
    6,
    3,
    12,
    5
   ],
   [
    5,
    11,
    4,
    1,
    14,
    9,
    6,
    5
   ],
   [
    3,
    10,
    6,
    5,
    9,
    4,
    11,
    4
   ],
   [
    9,
    8,
    10,
    6,
    5,
    3,
    14,
    5
   ],
   [
    7,
    5,
    15,
    13,
    3,
    10,
    10,
    4
   ],
   [
    11,
    0,
    12,
    1,
    10,
    12,
    13,
    5
   ],
   [
    11,
    6,
    5,
    7,
    11,
    2,
    2,
    6
   ]
  ]
 },
 {
  "start": [
   0,
   7
  ],
  "exit": [
   8,
   0
  ],
  "dir": 3,
  "altStart": [
   6,
   6
  ],
  "altDir": 1,
  "cells": [
   [
    13,
    11,
    8,
    10,
    8,
    10,
    12,
    13
   ],
   [
    3,
    10,
    0,
    14,
    3,
    10,
    4,
    5
   ],
   [
    9,
    12,
    1,
    12,
    9,
    14,
    1,
    4
   ],
   [
    5,
    5,
    7,
    5,
    5,
    9,
    6,
    7
   ],
   [
    1,
    0,
    10,
    0,
    4,
    1,
    10,
    12
   ],
   [
    7,
    7,
    13,
    5,
    5,
    3,
    12,
    7
   ],
   [
    9,
    14,
    1,
    4,
    3,
    14,
    5,
    13
   ],
   [
    1,
    10,
    6,
    3,
    10,
    14,
    3,
    6
   ]
  ]
 },
 {
  "start": [
   6,
   2
  ],
  "exit": [
   8,
   1
  ],
  "dir": 1,
  "altStart": [
   7,
   7
  ],
  "altDir": 1,
  "cells": [
   [
    9,
    10,
    10,
    12,
    9,
    10,
    8,
    14
   ],
   [
    5,
    11,
    12,
    3,
    6,
    13,
    3,
    12
   ],
   [
    3,
    10,
    2,
    12,
    13,
    3,
    10,
    4
   ],
   [
    11,
    12,
    9,
    6,
    3,
    10,
    12,
    5
   ],
   [
    9,
    2,
    6,
    9,
    14,
    9,
    6,
    5
   ],
   [
    5,
    9,
    12,
    5,
    13,
    3,
    10,
    4
   ],
   [
    5,
    7,
    5,
    3,
    0,
    10,
    12,
    5
   ],
   [
    3,
    12,
    3,
    10,
    6,
    11,
    2,
    6
   ]
  ]
 },
 {
  "start": [
   0,
   0
  ],
  "exit": [
   -1,
   1
  ],
  "dir": 3,
  "altStart": [
   7,
   3
  ],
  "altDir": 1,
  "cells": [
   [
    13,
    3,
    10,
    10,
    10,
    8,
    10,
    14
   ],
   [
    3,
    8,
    10,
    12,
    13,
    3,
    10,
    12
   ],
   [
    9,
    6,
    11,
    6,
    1,
    10,
    14,
    5
   ],
   [
    3,
    10,
    10,
    8,
    2,
    10,
    10,
    6
   ],
   [
    9,
    10,
    12,
    5,
    9,
    8,
    10,
    12
   ],
   [
    5,
    9,
    6,
    5,
    7,
    5,
    9,
    6
   ],
   [
    5,
    1,
    10,
    0,
    10,
    2,
    2,
    12
   ],
   [
    3,
    2,
    14,
    7,
    11,
    10,
    10,
    6
   ]
  ]
 },
 {
  "start": [
   0,
   3
  ],
  "exit": [
   0,
   8
  ],
  "dir": 3,
  "altStart": [
   7,
   3
  ],
  "altDir": 1,
  "cells": [
   [
    9,
    10,
    10,
    8,
    10,
    10,
    12,
    9
   ],
   [
    1,
    10,
    12,
    1,
    12,
    9,
    6,
    5
   ],
   [
    5,
    13,
    7,
    5,
    7,
    7,
    11,
    4
   ],
   [
    5,
    3,
    10,
    6,
    9,
    10,
    10,
    6
   ],
   [
    1,
    10,
    10,
    10,
    6,
    9,
    10,
    12
   ],
   [
    5,
    9,
    12,
    11,
    12,
    3,
    8,
    6
   ],
   [
    5,
    5,
    3,
    8,
    2,
    10,
    2,
    12
   ],
   [
    3,
    2,
    14,
    7,
    11,
    10,
    10,
    6
   ]
  ]
 }
];
