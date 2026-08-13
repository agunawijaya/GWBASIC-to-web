; ======================================================================
; HOPPER.EXE -- blok DATA yang di-POKE lalu dipanggil CALL ABSOLUTE
;
; Empat baris DATA di sumber BASIC aslinya, 228 byte total.
; Disassembly 8086 16-bit. Alamat relatif terhadap awal tiap blok --
; alamat muat sebenarnya ditentukan VARPTR saat runtime, jadi target
; lompatan absolut TIDAK bisa dipetakan tanpa mengetahui alamat itu.
; ======================================================================

; ---- blok 1 @image 30963, 57 byte ----
     0  eb12           jmp     0x14
     2  90             nop     
     3  0000           add     byte ptr [bx + si], al
     5  01ff           add     di, di
     7  02ff           add     bh, bh
     9  0200           add     al, byte ptr [bx + si]
    11  01ff           add     di, di
    13  02fe           add     bh, dh
    15  ff00           inc     word ptr [bx + si]
    17  0000           add     byte ptr [bx + si], al
    19  001e06b8       add     byte ptr [0xb806], bl
    23  55             push    bp
    24  b88ed8         mov     ax, 0xd88e
    27  8ec0           mov     es, ax
    29  2ec70603000a00 mov     word ptr cs:[3], 0xa
    36  2e8b360300     mov     si, word ptr cs:[3]
    41  2e8a840500     mov     al, byte ptr cs:[si + 5]
    46  3c00           cmp     al, 0
    48  7503           jne     0x35
    50  e99f00         jmp     0xd4
    53  2ea21100       mov     byte ptr cs:[0x11], al

; ---- blok 2 @image 31133, 57 byte ----
     0  2ea21200       mov     byte ptr cs:[0x12], al
     4  8bc6           mov     ax, si
     6  bbe001         mov     bx, 0x1e0
     9  f7e3           mul     bx
    11  8bd8           mov     bx, ax
    13  2ec606100002   mov     byte ptr cs:[0x10], 2
    19  2ef606110080   test    byte ptr cs:[0x11], 0x80
    25  7542           jne     0x5d
    27  fd             std     
    28  83c33e         add     bx, 0x3e
    31  8bfb           mov     di, bx
    33  2ec606130006   mov     byte ptr cs:[0x13], 6
    39  8bf7           mov     si, di
    41  83ee02         sub     si, 2
    44  8b05           mov     ax, word ptr [di]
    46  b91f00         mov     cx, 0x1f
    49  f3a5           rep movsw word ptr es:[di], word ptr [si]
    51  894402         mov     word ptr [si + 2], ax
    54  81             db 0x81
    55  c7             db 0xc7
    56  8e             db 0x8e

; ---- blok 3 @image 31324, 57 byte ----
     0  002efe0e       add     byte ptr [0xefe], ch
     4  1300           adc     ax, word ptr [bx + si]
     6  75e6           jne     0xffffffee
     8  2efe0e1100     dec     byte ptr cs:[0x11]
    13  75d7           jne     0xffffffe6
    15  2efe0e1000     dec     byte ptr cs:[0x10]
    20  744c           je      0x62
    22  2ea01200       mov     al, byte ptr cs:[0x12]
    26  2ea21100       mov     byte ptr cs:[0x11], al
    30  81c30020       add     bx, 0x2000
    34  ebc2           jmp     0xffffffe6
    36  fc             cld     
    37  8bfb           mov     di, bx
    39  2ec606130006   mov     byte ptr cs:[0x13], 6
    45  8bf7           mov     si, di
    47  83c602         add     si, 2
    50  8b05           mov     ax, word ptr [di]
    52  b91f00         mov     cx, 0x1f
    55  f3a5           rep movsw word ptr es:[di], word ptr [si]

; ---- blok 4 @image 31511, 57 byte ----
     0  8944fe         mov     word ptr [si - 2], ax
     3  83c712         add     di, 0x12
     6  2efe0e1300     dec     byte ptr cs:[0x13]
    11  75e7           jne     0xfffffff4
    13  2efe061100     inc     byte ptr cs:[0x11]
    18  75d8           jne     0xffffffec
    20  2efe0e1000     dec     byte ptr cs:[0x10]
    25  740e           je      0x29
    27  2ea01200       mov     al, byte ptr cs:[0x12]
    31  2ea21100       mov     byte ptr cs:[0x11], al
    35  81c30020       add     bx, 0x2000
    39  ebc3           jmp     0xffffffec
    41  2eff0e0300     dec     word ptr cs:[3]
    46  2e813e0300ffff cmp     word ptr cs:[3], 0xffff
    53  7403           je      0x3a
    55  e9             db 0xe9
    56  3f             aas     

; ---- keempat blok disambung (228 byte) ----
     0  eb12           jmp     0x14
     2  90             nop     
     3  0000           add     byte ptr [bx + si], al
     5  01ff           add     di, di
     7  02ff           add     bh, bh
     9  0200           add     al, byte ptr [bx + si]
    11  01ff           add     di, di
    13  02fe           add     bh, dh
    15  ff00           inc     word ptr [bx + si]
    17  0000           add     byte ptr [bx + si], al
    19  001e06b8       add     byte ptr [0xb806], bl
    23  55             push    bp
    24  b88ed8         mov     ax, 0xd88e
    27  8ec0           mov     es, ax
    29  2ec70603000a00 mov     word ptr cs:[3], 0xa
    36  2e8b360300     mov     si, word ptr cs:[3]
    41  2e8a840500     mov     al, byte ptr cs:[si + 5]
    46  3c00           cmp     al, 0
    48  7503           jne     0x35
    50  e99f00         jmp     0xd4
    53  2ea21100       mov     byte ptr cs:[0x11], al
    57  2ea21200       mov     byte ptr cs:[0x12], al
    61  8bc6           mov     ax, si
    63  bbe001         mov     bx, 0x1e0
    66  f7e3           mul     bx
    68  8bd8           mov     bx, ax
    70  2ec606100002   mov     byte ptr cs:[0x10], 2
    76  2ef606110080   test    byte ptr cs:[0x11], 0x80
    82  7542           jne     0x96
    84  fd             std     
    85  83c33e         add     bx, 0x3e
    88  8bfb           mov     di, bx
    90  2ec606130006   mov     byte ptr cs:[0x13], 6
    96  8bf7           mov     si, di
    98  83ee02         sub     si, 2
   101  8b05           mov     ax, word ptr [di]
   103  b91f00         mov     cx, 0x1f
   106  f3a5           rep movsw word ptr es:[di], word ptr [si]
   108  894402         mov     word ptr [si + 2], ax
   111  81c78e00       add     di, 0x8e
   115  2efe0e1300     dec     byte ptr cs:[0x13]
   120  75e6           jne     0x60
   122  2efe0e1100     dec     byte ptr cs:[0x11]
   127  75d7           jne     0x58
   129  2efe0e1000     dec     byte ptr cs:[0x10]
   134  744c           je      0xd4
   136  2ea01200       mov     al, byte ptr cs:[0x12]
   140  2ea21100       mov     byte ptr cs:[0x11], al
   144  81c30020       add     bx, 0x2000
   148  ebc2           jmp     0x58
   150  fc             cld     
   151  8bfb           mov     di, bx
   153  2ec606130006   mov     byte ptr cs:[0x13], 6
   159  8bf7           mov     si, di
   161  83c602         add     si, 2
   164  8b05           mov     ax, word ptr [di]
   166  b91f00         mov     cx, 0x1f
   169  f3a5           rep movsw word ptr es:[di], word ptr [si]
   171  8944fe         mov     word ptr [si - 2], ax
   174  83c712         add     di, 0x12
   177  2efe0e1300     dec     byte ptr cs:[0x13]
   182  75e7           jne     0x9f
   184  2efe061100     inc     byte ptr cs:[0x11]
   189  75d8           jne     0x97
   191  2efe0e1000     dec     byte ptr cs:[0x10]
   196  740e           je      0xd4
   198  2ea01200       mov     al, byte ptr cs:[0x12]
   202  2ea21100       mov     byte ptr cs:[0x11], al
   206  81c30020       add     bx, 0x2000
   210  ebc3           jmp     0x97
   212  2eff0e0300     dec     word ptr cs:[3]
   217  2e813e0300ffff cmp     word ptr cs:[3], 0xffff
   224  7403           je      0xe5
   226  db 0xe9
   227  3f             aas     