; HOPPER.EXE -- annotated disassembly of the compiled BASIC program
; file 37760 bytes, header 3584, 786 relocations
; user code 26..7863 ; string base = image 26916 (seg 0692)
; RT#n = BASCOM runtime entry point, ranked by call frequency

    26  9a0000bf07     lcall   0x7bf, 0              
    31  55             push    bp                    
    32  8bec           mov     bp, sp                
    34  81ec0200       sub     sp, 2                 
    38  9ae9284702     lcall   0x247, 0x28e9            ; RT#75  
    43  bb0080         mov     bx, 0x8000            
    46  33d2           xor     dx, dx                
    48  9a82144702     lcall   0x247, 0x1482            ; RT#76  
    53  33db           xor     bx, bx                
    55  9a480b4702     lcall   0x247, 0xb48             ; RT#49  
    60  be700a         mov     si, 0xa70             
    63  9adf0e4702     lcall   0x247, 0xedf             ; RT#7   FAC.LOAD.SGL
    68  e91b00         jmp     0x62                  
    71  bea208         mov     si, 0x8a2             
    74  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
    79  ba740a         mov     dx, 0xa74             
    82  9ab90b4702     lcall   0x247, 0xbb9             ; RT#77  
    87  bf700a         mov     di, 0xa70             
    90  bea208         mov     si, 0x8a2             
    93  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
    98  bfa208         mov     di, 0x8a2             
   101  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
   106  bf780a         mov     di, 0xa78             
   109  bea208         mov     si, 0x8a2             
   112  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
   117  76d0           jbe     0x47                  
   119  e92d00         jmp     0xa7                  
   122  bba608         mov     bx, 0x8a6             
   125  8bd3           mov     dx, bx                
   127  9ae3234702     lcall   0x247, 0x23e3            ; RT#33  
   132  83fb5f         cmp     bx, 0x5f              
   135  b90000         mov     cx, 0                 
   138  7e01           jle     0x8d                  
   140  49             dec     cx                    
   141  d1e1           shl     cx, 1                 
   143  d1e1           shl     cx, 1                 
   145  d1e1           shl     cx, 1                 
   147  d1e1           shl     cx, 1                 
   149  d1e1           shl     cx, 1                 
   151  8bda           mov     bx, dx                
   153  9ae3234702     lcall   0x247, 0x23e3            ; RT#33  
   158  03d9           add     bx, cx                
   160  9a14244702     lcall   0x247, 0x2414            ; RT#78  
   165  93             xchg    bx, ax                
   166  c3             ret                           
   167  bb4000         mov     bx, 0x40              
   170  9a6c144702     lcall   0x247, 0x146c            ; RT#27  
   175  bb1000         mov     bx, 0x10              
   178  8e1e9800       mov     ds, word ptr [0x98]   
   182  8a1f           mov     bl, byte ptr [bx]     
   184  30ff           xor     bh, bh                
   186  06             push    es                    
   187  1f             pop     ds                    
   188  83e330         and     bx, 0x30              
   191  9a892f4702     lcall   0x247, 0x2f89            ; RT#9   BH.FLAGS
   196  bf7c0a         mov     di, 0xa7c             
   199  9a57014702     lcall   0x247, 0x157             ; RT#21  FAC.LOAD.ALT2
   204  bf6609         mov     di, 0x966             
   207  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
   212  bf800a         mov     di, 0xa80             
   215  be6609         mov     si, 0x966             
   218  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
   223  7503           jne     0xe4                  
   225  e90800         jmp     0xec                  
   228  9a67144702     lcall   0x247, 0x1467            ; RT#34  
   233  e90d01         jmp     0x1f9                 
   236  9ae7094702     lcall   0x247, 0x9e7             ; RT#17  
   241  bb0e00         mov     bx, 0xe               
   244  9a620f4702     lcall   0x247, 0xf62             ; RT#15  
   249  bb0500         mov     bx, 5                 
   252  9a7c0f4702     lcall   0x247, 0xf7c             ; RT#14  
   257  9a60364702     lcall   0x247, 0x3660            ; RT#6   STMT.RESET
   262  bb840a         mov     bx, 0xa84                ; = 'Compiled HOPPER'
   265  9a2c354702     lcall   0x247, 0x352c            ; RT#8   PRINT  <<< bx='Compiled HOPPER'
   270  badb03         mov     dx, 0x3db             
   273  33c0           xor     ax, ax                
   275  ee             out     dx, al                
   276  bada03         mov     dx, 0x3da             
   279  ec             in      al, dx                
   280  30e4           xor     ah, ah                
   282  93             xchg    bx, ax                
   283  9a892f4702     lcall   0x247, 0x2f89            ; RT#9   BH.FLAGS
   288  bf6a09         mov     di, 0x96a             
   291  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
   296  bf980a         mov     di, 0xa98             
   299  be6a09         mov     si, 0x96a             
   302  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
   307  7403           je      0x138                 
   309  e95700         jmp     0x18f                 
   312  bb0f00         mov     bx, 0xf               
   315  9a620f4702     lcall   0x247, 0xf62             ; RT#15  
   320  bb0500         mov     bx, 5                 
   323  9a7c0f4702     lcall   0x247, 0xf7c             ; RT#14  
   328  9a60364702     lcall   0x247, 0x3660            ; RT#6   STMT.RESET
   333  bb9c0a         mov     bx, 0xa9c                ; = 'Color/graphics adaptor not available'
   336  9a2c354702     lcall   0x247, 0x352c            ; RT#8   PRINT  <<< bx='Color/graphics adaptor not available'
   341  bb1000         mov     bx, 0x10              
   344  9a620f4702     lcall   0x247, 0xf62             ; RT#15  
   349  bb0500         mov     bx, 5                 
   352  9a7c0f4702     lcall   0x247, 0xf7c             ; RT#14  
   357  9a60364702     lcall   0x247, 0x3660            ; RT#6   STMT.RESET
   362  bbc40a         mov     bx, 0xac4                ; = "Press any key to return to DOS'"
   365  9a2c354702     lcall   0x247, 0x352c            ; RT#8   PRINT  <<< bx="Press any key to return to DOS'"
   370  9a67144702     lcall   0x247, 0x1467            ; RT#34  
   375  bb0100         mov     bx, 1                 
   378  baff7f         mov     dx, 0x7fff            
   381  9aa1114702     lcall   0x247, 0x11a1            ; RT#41  KEY.INPUT
   386  ba6e09         mov     dx, 0x96e             
   389  9a2a0e4702     lcall   0x247, 0xe2a             ; RT#10  DRAW
   394  9a8a164702     lcall   0x247, 0x168a            ; RT#50  
   399  bb0f00         mov     bx, 0xf               
   402  9a620f4702     lcall   0x247, 0xf62             ; RT#15  
   407  bb0500         mov     bx, 5                 
   410  9a620f4702     lcall   0x247, 0xf62             ; RT#15  
   415  33db           xor     bx, bx                
   417  9a7c0f4702     lcall   0x247, 0xf7c             ; RT#14  
   422  9a60364702     lcall   0x247, 0x3660            ; RT#6   STMT.RESET
   427  bbe60a         mov     bx, 0xae6                ; = 'Switching to Color/Graphics Adaptor ...'
   430  9a2c354702     lcall   0x247, 0x352c            ; RT#8   PRINT  <<< bx='Switching to Color/Graphics Adaptor ...'
   435  bb1000         mov     bx, 0x10              
   438  8bd3           mov     dx, bx                
   440  8e1e9800       mov     ds, word ptr [0x98]   
   444  8a1f           mov     bl, byte ptr [bx]     
   446  30ff           xor     bh, bh                
   448  06             push    es                    
   449  1f             pop     ds                    
   450  81e3cf00       and     bx, 0xcf              
   454  0bda           or      bx, dx                
   456  8bcb           mov     cx, bx                
   458  8bda           mov     bx, dx                
   460  91             xchg    cx, ax                
   461  8e1e9800       mov     ds, word ptr [0x98]   
   465  8807           mov     byte ptr [bx], al     
   467  06             push    es                    
   468  1f             pop     ds                    
   469  9a67144702     lcall   0x247, 0x1467            ; RT#34  
   474  9a700f4702     lcall   0x247, 0xf70             ; RT#42  
   479  9a700f4702     lcall   0x247, 0xf70             ; RT#42  
   484  9a700f4702     lcall   0x247, 0xf70             ; RT#42  
   489  bb0700         mov     bx, 7                 
   492  9a620f4702     lcall   0x247, 0xf62             ; RT#15  
   497  bb0700         mov     bx, 7                 
   500  9a7c0f4702     lcall   0x247, 0xf7c             ; RT#14  
   505  bb120b         mov     bx, 0xb12                ; = 'C1RFL3BL3L0BL2R0BR11R0BR2DL2BL2L5BL2L2FBR3R5BR3GL0BL2L5BL2FR7GL5R5'
   508  ba7209         mov     dx, 0x972             
   511  9a2a0e4702     lcall   0x247, 0xe2a             ; RT#10  DRAW  <<< bx='C1RFL3BL3L0BL2R0BR11R0BR2DL2BL2L5BL2L2FBR3R5BR3GL0BL2L5B'
   516  bb7c0b         mov     bx, 0xb7c                ; = 'C3F3DFD2GDGL2H2UE2G3HBD2D0GBU2LHU2E4RE&'
   519  ba7609         mov     dx, 0x976             
   522  9a2a0e4702     lcall   0x247, 0xe2a             ; RT#10  DRAW  <<< bx='C3F3DFD2GDGL2H2UE2G3HBD2D0GBU2LHU2E4RE&'
   527  bba60b         mov     bx, 0xba6                ; = 'C2L45G2DGD2FDF2R46E2UEU2HUH2G2DGD2FDF28'
   530  ba7a09         mov     dx, 0x97a             
   533  9a2a0e4702     lcall   0x247, 0xe2a             ; RT#10  DRAW  <<< bx='C2L45G2DGD2FDF2R46E2UEU2HUH2G2DGD2FDF28'
   538  bbd00b         mov     bx, 0xbd0                ; = 'C0BU3L3BD3L1BH2L2BG1BL4L3BH3L5BD3BG2R3BG3R5BR4R3BE2BR3R2W'
   541  ba7e09         mov     dx, 0x97e             
   544  9a2a0e4702     lcall   0x247, 0xe2a             ; RT#10  DRAW  <<< bx='C0BU3L3BD3L1BH2L2BG1BL4L3BH3L5BD3BG2R3BG3R5BR4R3BE2BR3R2'
   549  bb0c0c         mov     bx, 0xc0c                ; = 'R5FL8GRBR5R0BR4DBL4L0BL5LGR2BR5R0BR5R2FRL17GR19FL21DR21BDBLL4BL10L'
   552  baaa08         mov     dx, 0x8aa             
   555  9a2a0e4702     lcall   0x247, 0xe2a             ; RT#10  DRAW  <<< bx='R5FL8GRBR5R0BR4DBL4L0BL5LGR2BR5R0BR5R2FRL17GR19FL21DR21B'
   560  bb680c         mov     bx, 0xc68                ; = 'L5GR8FLBL5L0BL4DBR4R0BR5RFL2BL5L0BL5L2GLR17FL19GR21DL21BDBRR4BR10R'
   563  baae08         mov     dx, 0x8ae             
   566  9a2a0e4702     lcall   0x247, 0xe2a             ; RT#10  DRAW  <<< bx='L5GR8FLBL5L0BL4DBR4R0BR5RFL2BL5L0BL5L2GLR17FL19GR21DL21B'
   571  9a67144702     lcall   0x247, 0x1467            ; RT#34  
   576  bb0a03         mov     bx, 0x30a             
   579  8e1e9800       mov     ds, word ptr [0x98]   
   583  8a1f           mov     bl, byte ptr [bx]     
   585  30ff           xor     bh, bh                
   587  06             push    es                    
   588  1f             pop     ds                    
   589  8bd3           mov     dx, bx                
   591  bb0b03         mov     bx, 0x30b             
   594  8e1e9800       mov     ds, word ptr [0x98]   
   598  8a1f           mov     bl, byte ptr [bx]     
   600  30ff           xor     bh, bh                
   602  06             push    es                    
   603  1f             pop     ds                    
   604  d1e3           shl     bx, 1                 
   606  d1e3           shl     bx, 1                 
   608  d1e3           shl     bx, 1                 
   610  d1e3           shl     bx, 1                 
   612  d1e3           shl     bx, 1                 
   614  d1e3           shl     bx, 1                 
   616  d1e3           shl     bx, 1                 
   618  d1e3           shl     bx, 1                 
   620  03da           add     bx, dx                
   622  81c30202       add     bx, 0x202             
   626  9a892f4702     lcall   0x247, 0x2f89            ; RT#9   BH.FLAGS
   631  bf7c0a         mov     di, 0xa7c             
   634  9a57014702     lcall   0x247, 0x157             ; RT#21  FAC.LOAD.ALT2
   639  bbb200         mov     bx, 0xb2              
   642  9ad6104702     lcall   0x247, 0x10d6            ; RT#22  FAC.NUM.FMT
   647  bf8209         mov     di, 0x982             
   650  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
   655  33db           xor     bx, bx                
   657  9a6c144702     lcall   0x247, 0x146c            ; RT#27  
   662  bb1005         mov     bx, 0x510             
   665  8e1e9800       mov     ds, word ptr [0x98]   
   669  8a1f           mov     bl, byte ptr [bx]     
   671  30ff           xor     bh, bh                
   673  06             push    es                    
   674  1f             pop     ds                    
   675  9a892f4702     lcall   0x247, 0x2f89            ; RT#9   BH.FLAGS
   680  bb1105         mov     bx, 0x511             
   683  8e1e9800       mov     ds, word ptr [0x98]   
   687  8a1f           mov     bl, byte ptr [bx]     
   689  30ff           xor     bh, bh                
   691  06             push    es                    
   692  1f             pop     ds                    
   693  d1e3           shl     bx, 1                 
   695  d1e3           shl     bx, 1                 
   697  d1e3           shl     bx, 1                 
   699  d1e3           shl     bx, 1                 
   701  d1e3           shl     bx, 1                 
   703  d1e3           shl     bx, 1                 
   705  d1e3           shl     bx, 1                 
   707  d1e3           shl     bx, 1                 
   709  9af30e4702     lcall   0x247, 0xef3             ; RT#51  
   714  819a892f4702   sbb     word ptr [bp + si + 0x2f89], 0x247
   720  9a24004702     lcall   0x247, 0x24              ; RT#79  
   725  81bf82099a1f   cmp     word ptr [bx + 0x982], 0x1f9a
   731  004702         add     byte ptr [bx + 2], al 
   734  8bdf           mov     bx, di                
   736  bf700a         mov     di, 0xa70             
   739  9a1f004702     lcall   0x247, 0x1f              ; RT#11  FAC.LOAD.ALT
   744  8bfb           mov     di, bx                
   746  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
   751  be8209         mov     si, 0x982             
   754  9a85304702     lcall   0x247, 0x3085            ; RT#43  
   759  9a6c144702     lcall   0x247, 0x146c            ; RT#27  
   764  bec40c         mov     si, 0xcc4             
   767  9adf0e4702     lcall   0x247, 0xedf             ; RT#7   FAC.LOAD.SGL
   772  e92e00         jmp     0x335                 
   775  bb8609         mov     bx, 0x986             
   778  9a61294702     lcall   0x247, 0x2961            ; RT#80  
   783  be8609         mov     si, 0x986             
   786  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
   791  8bd3           mov     dx, bx                
   793  be6a09         mov     si, 0x96a             
   796  9a85304702     lcall   0x247, 0x3085            ; RT#43  
   801  92             xchg    dx, ax                
   802  8e1e9800       mov     ds, word ptr [0x98]   
   806  8807           mov     byte ptr [bx], al     
   808  06             push    es                    
   809  1f             pop     ds                    
   810  bf700a         mov     di, 0xa70             
   813  be6a09         mov     si, 0x96a             
   816  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
   821  bf6a09         mov     di, 0x96a             
   824  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
   829  bfc80c         mov     di, 0xcc8             
   832  be6a09         mov     si, 0x96a             
   835  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
   840  76bd           jbe     0x307                 
   842  c7068a090000   mov     word ptr [0x98a], 0   
   848  9a64264702     lcall   0x247, 0x2664            ; RT#52  
   853  ba0200         mov     dx, 2                 
   856  9ace244702     lcall   0x247, 0x24ce            ; RT#81  
   861  9a64204702     lcall   0x247, 0x2064            ; RT#53  
   866  9a64264702     lcall   0x247, 0x2664            ; RT#52  
   871  8bca           mov     cx, dx                
   873  ba0400         mov     dx, 4                 
   876  9adc244702     lcall   0x247, 0x24dc            ; RT#44  
   881  9a0c0f4702     lcall   0x247, 0xf0c             ; RT#82  
   886  819a64204702   sbb     word ptr [bp + si + 0x2064], 0x247
   892  bfcc0c         mov     di, 0xccc             
   895  9aa6194702     lcall   0x247, 0x19a6            ; RT#83  
   900  9a12184702     lcall   0x247, 0x1812            ; RT#84  
   905  819ae92f4702   sbb     word ptr [bp + si + 0x2fe9], 0x247
   911  9ae6174702     lcall   0x247, 0x17e6            ; RT#86  
   916  33db           xor     bx, bx                
   918  9ab70c4702     lcall   0x247, 0xcb7             ; RT#54  
   923  bb0100         mov     bx, 1                 
   926  9a9d0c4702     lcall   0x247, 0xc9d             ; RT#87  
   931  33db           xor     bx, bx                
   933  9ab70c4702     lcall   0x247, 0xcb7             ; RT#54  
   938  33db           xor     bx, bx                
   940  9a640a4702     lcall   0x247, 0xa64             ; RT#88  
   945  33db           xor     bx, bx                
   947  9a7e0a4702     lcall   0x247, 0xa7e             ; RT#89  
   952  33db           xor     bx, bx                
   954  9a480b4702     lcall   0x247, 0xb48             ; RT#49  
   959  9ae7094702     lcall   0x247, 0x9e7             ; RT#17  
   964  bb0b00         mov     bx, 0xb               
   967  9a7c0f4702     lcall   0x247, 0xf7c             ; RT#14  
   972  9a60364702     lcall   0x247, 0x3660            ; RT#6   STMT.RESET
   977  bbd40c         mov     bx, 0xcd4                ; = 'JOYSTICK OR KEYBOARD (J/K)'
   980  9a18354702     lcall   0x247, 0x3518            ; RT#28  PRINT.AT  <<< bx='JOYSTICK OR KEYBOARD (J/K)'
   985  bf8c09         mov     di, 0x98c             
   988  bef20c         mov     si, 0xcf2             
   991  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
   996  bb0100         mov     bx, 1                 
   999  baff7f         mov     dx, 0x7fff            
  1002  9aa1114702     lcall   0x247, 0x11a1            ; RT#41  KEY.INPUT
  1007  baa608         mov     dx, 0x8a6             
  1010  9a2a0e4702     lcall   0x247, 0xe2a             ; RT#10  DRAW
  1015  e880fc         call    0x7a                  
  1018  93             xchg    bx, ax                
  1019  ba6e09         mov     dx, 0x96e             
  1022  9a2a0e4702     lcall   0x247, 0xe2a             ; RT#10  DRAW
  1027  bbf60c         mov     bx, 0xcf6             
  1030  b86e09         mov     ax, 0x96e             
  1033  9a9a0e4702     lcall   0x247, 0xe9a             ; RT#13  
  1038  ba0000         mov     dx, 0                 
  1041  7401           je      0x414                 
  1043  4a             dec     dx                    
  1044  bbfc0c         mov     bx, 0xcfc             
  1047  9a9a0e4702     lcall   0x247, 0xe9a             ; RT#13  
  1052  b90000         mov     cx, 0                 
  1055  7401           je      0x422                 
  1057  49             dec     cx                    
  1058  23ca           and     cx, dx                
  1060  bb020d         mov     bx, 0xd02             
  1063  9a9a0e4702     lcall   0x247, 0xe9a             ; RT#13  
  1068  ba0000         mov     dx, 0                 
  1071  7401           je      0x432                 
  1073  4a             dec     dx                    
  1074  23d1           and     dx, cx                
  1076  bb080d         mov     bx, 0xd08             
  1079  9a9a0e4702     lcall   0x247, 0xe9a             ; RT#13  
  1084  b90000         mov     cx, 0                 
  1087  7401           je      0x442                 
  1089  49             dec     cx                    
  1090  23ca           and     cx, dx                
  1092  23c9           and     cx, cx                
  1094  759c           jne     0x3e4                 
  1096  bbf60c         mov     bx, 0xcf6             
  1099  b86e09         mov     ax, 0x96e             
  1102  9a9a0e4702     lcall   0x247, 0xe9a             ; RT#13  
  1107  ba0000         mov     dx, 0                 
  1110  7501           jne     0x459                 
  1112  4a             dec     dx                    
  1113  bb020d         mov     bx, 0xd02             
  1116  9a9a0e4702     lcall   0x247, 0xe9a             ; RT#13  
  1121  b90000         mov     cx, 0                 
  1124  7501           jne     0x467                 
  1126  49             dec     cx                    
  1127  0bca           or      cx, dx                
  1129  23c9           and     cx, cx                
  1131  7503           jne     0x470                 
  1133  e90b00         jmp     0x47b                 
  1136  bf8c09         mov     di, 0x98c             
  1139  be0e0d         mov     si, 0xd0e             
  1142  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  1147  9ae7094702     lcall   0x247, 0x9e7             ; RT#17  
  1152  9a60364702     lcall   0x247, 0x3660            ; RT#6   STMT.RESET
  1157  bb120d         mov     bx, 0xd12                ; = 'INITIALIZING...'
  1160  9a2c354702     lcall   0x247, 0x352c            ; RT#8   PRINT  <<< bx='INITIALIZING...'
  1165  bb260d         mov     bx, 0xd26                ; = 'HMPKD'
  1168  ba9009         mov     dx, 0x990             
  1171  9a2a0e4702     lcall   0x247, 0xe2a             ; RT#10  DRAW  <<< bx='HMPKD'
  1176  bb300d         mov     bx, 0xd30                ; = '86241'
  1179  ba9409         mov     dx, 0x994             
  1182  9a2a0e4702     lcall   0x247, 0xe2a             ; RT#10  DRAW  <<< bx='86241'
  1187  bb0800         mov     bx, 8                 
  1190  9a620f4702     lcall   0x247, 0xf62             ; RT#15  
  1195  bb0100         mov     bx, 1                 
  1198  9a7c0f4702     lcall   0x247, 0xf7c             ; RT#14  
  1203  9a60364702     lcall   0x247, 0x3660            ; RT#6   STMT.RESET
  1208  bb3a0d         mov     bx, 0xd3a                ; = 'INSTRUCTIONS:'
  1211  9a2c354702     lcall   0x247, 0x352c            ; RT#8   PRINT  <<< bx='INSTRUCTIONS:'
  1216  9a60364702     lcall   0x247, 0x3660            ; RT#6   STMT.RESET
  1221  bb4c0d         mov     bx, 0xd4c                ; = 'Use the cursor keys on the numeric'
  1224  9a2c354702     lcall   0x247, 0x352c            ; RT#8   PRINT  <<< bx='Use the cursor keys on the numeric'
  1229  9a60364702     lcall   0x247, 0x3660            ; RT#6   STMT.RESET
  1234  bb720d         mov     bx, 0xd72                ; = 'keypad to move your frog.'
  1237  9a2c354702     lcall   0x247, 0x352c            ; RT#8   PRINT  <<< bx='keypad to move your frog.'
  1242  9a60364702     lcall   0x247, 0x3660            ; RT#6   STMT.RESET
  1247  bb900d         mov     bx, 0xd90                ; = 'Press Esc to pause, <F10> to abort'
  1250  9a2c354702     lcall   0x247, 0x352c            ; RT#8   PRINT  <<< bx='Press Esc to pause, <F10> to abort'
  1255  bfb608         mov     di, 0x8b6             
  1258  beb60d         mov     si, 0xdb6             
  1261  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  1266  bfba08         mov     di, 0x8ba             
  1269  beba0d         mov     si, 0xdba             
  1272  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  1277  bfbe08         mov     di, 0x8be             
  1280  bebe0d         mov     si, 0xdbe             
  1283  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  1288  bfc208         mov     di, 0x8c2             
  1291  beba0d         mov     si, 0xdba             
  1294  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  1299  bfc608         mov     di, 0x8c6             
  1302  bebe0d         mov     si, 0xdbe             
  1305  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  1310  bfca08         mov     di, 0x8ca             
  1313  bec40c         mov     si, 0xcc4             
  1316  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  1321  bfce08         mov     di, 0x8ce             
  1324  beb60d         mov     si, 0xdb6             
  1327  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  1332  bfd608         mov     di, 0x8d6             
  1335  beba0d         mov     si, 0xdba             
  1338  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  1343  bfda08         mov     di, 0x8da             
  1346  bebe0d         mov     si, 0xdbe             
  1349  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  1354  bfde08         mov     di, 0x8de             
  1357  bec20d         mov     si, 0xdc2             
  1360  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  1365  bfe208         mov     di, 0x8e2             
  1368  beba0d         mov     si, 0xdba             
  1371  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  1376  bb0200         mov     bx, 2                 
  1379  9a171e4702     lcall   0x247, 0x1e17            ; RT#45  
  1384  bb0100         mov     bx, 1                 
  1387  bac60d         mov     dx, 0xdc6                ; = 'hopper.SCO'
  1390  33c9           xor     cx, cx                
  1392  9a261e4702     lcall   0x247, 0x1e26            ; RT#46    <<< dx='hopper.SCO'
  1397  9aa11d4702     lcall   0x247, 0x1da1            ; RT#47  
  1402  33db           xor     bx, bx                
  1404  9a171e4702     lcall   0x247, 0x1e17            ; RT#45  
  1409  bb0100         mov     bx, 1                 
  1412  bac60d         mov     dx, 0xdc6                ; = 'hopper.SCO'
  1415  33c9           xor     cx, cx                
  1417  9a261e4702     lcall   0x247, 0x1e26            ; RT#46    <<< dx='hopper.SCO'
  1422  bf6a09         mov     di, 0x96a             
  1425  bed40d         mov     si, 0xdd4             
  1428  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  1433  bb0100         mov     bx, 1                 
  1436  9a761d4702     lcall   0x247, 0x1d76            ; RT#90  
  1441  f7d3           not     bx                    
  1443  23db           and     bx, bx                
  1445  7503           jne     0x5aa                 
  1447  e95600         jmp     0x600                 
  1450  bb0100         mov     bx, 1                 
  1453  9af32c4702     lcall   0x247, 0x2cf3            ; RT#55  
  1458  9ad8304702     lcall   0x247, 0x30d8            ; RT#35  
  1463  0105           add     word ptr [di], ax     
  1465  be6a09         mov     si, 0x96a             
  1468  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  1473  d1e3           shl     bx, 1                 
  1475  d1e3           shl     bx, 1                 
  1477  81c3e608       add     bx, 0x8e6             
  1481  9a9f314702     lcall   0x247, 0x319f            ; RT#36  INPUT.PROMPT
  1486  bb0100         mov     bx, 1                 
  1489  9af32c4702     lcall   0x247, 0x2cf3            ; RT#55  
  1494  be6a09         mov     si, 0x96a             
  1497  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  1502  d1e3           shl     bx, 1                 
  1504  d1e3           shl     bx, 1                 
  1506  81c30e09       add     bx, 0x90e             
  1510  9a03294702     lcall   0x247, 0x2903            ; RT#56  
  1515  bf700a         mov     di, 0xa70             
  1518  be6a09         mov     si, 0x96a             
  1521  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  1526  8bfe           mov     di, si                
  1528  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  1533  e999ff         jmp     0x599                 
  1536  9aa11d4702     lcall   0x247, 0x1da1            ; RT#47  
  1541  bf9809         mov     di, 0x998             
  1544  bec40c         mov     si, 0xcc4             
  1547  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  1552  bf9c09         mov     di, 0x99c             
  1555  bed80d         mov     si, 0xdd8             
  1558  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  1563  9a60364702     lcall   0x247, 0x3660            ; RT#6   STMT.RESET
  1568  bb740a         mov     bx, 0xa74             
  1571  9a2c354702     lcall   0x247, 0x352c            ; RT#8   PRINT
  1576  9a60364702     lcall   0x247, 0x3660            ; RT#6   STMT.RESET
  1581  bb740a         mov     bx, 0xa74             
  1584  9a2c354702     lcall   0x247, 0x352c            ; RT#8   PRINT
  1589  bbdc0d         mov     bx, 0xddc                ; = 'Enter Skill Level (1-4) [#]: '
  1592  9a2a364702     lcall   0x247, 0x362a            ; RT#48    <<< bx='Enter Skill Level (1-4) [#]: '
  1597  bf700a         mov     di, 0xa70             
  1600  be9809         mov     si, 0x998             
  1603  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  1608  bbb200         mov     bx, 0xb2              
  1611  9a09354702     lcall   0x247, 0x3509            ; RT#29  
  1616  bb740a         mov     bx, 0xa74             
  1619  9aa72c4702     lcall   0x247, 0x2ca7            ; RT#37  INLINE.PARAM
  1624  029ad830       add     bl, byte ptr [bp + si + 0x30d8]
  1628  47             inc     di                    
  1629  0201           add     al, byte ptr [bx + di]
  1631  05bba0         add     ax, 0xa0bb            
  1634  099a9f31       or      word ptr [bp + si + 0x319f], bx
  1638  47             inc     di                    
  1639  029a6036       add     bl, byte ptr [bp + si + 0x3660]
  1643  47             inc     di                    
  1644  02bb740a       add     bh, byte ptr [bp + di + 0xa74]
  1648  9a2c354702     lcall   0x247, 0x352c            ; RT#8   PRINT
  1653  bbfe0d         mov     bx, 0xdfe                ; = 'Enter Speed (1-500)  [####]: '
  1656  9a2a364702     lcall   0x247, 0x362a            ; RT#48    <<< bx='Enter Speed (1-500)  [####]: '
  1661  bb9c09         mov     bx, 0x99c             
  1664  9a09354702     lcall   0x247, 0x3509            ; RT#29  
  1669  bb740a         mov     bx, 0xa74             
  1672  9aa72c4702     lcall   0x247, 0x2ca7            ; RT#37  INLINE.PARAM
  1677  029ad830       add     bl, byte ptr [bp + si + 0x30d8]
  1681  47             inc     di                    
  1682  0201           add     al, byte ptr [bx + di]
  1684  05bba4         add     ax, 0xa4bb            
  1687  099a9f31       or      word ptr [bp + si + 0x319f], bx
  1691  47             inc     di                    
  1692  02bea409       add     bh, byte ptr [bp + 0x9a4]
  1696  9a42104702     lcall   0x247, 0x1042            ; RT#16  
  1701  bb0000         mov     bx, 0                 
  1704  7301           jae     0x6ab                 
  1706  4b             dec     bx                    
  1707  bf200e         mov     di, 0xe20             
  1710  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  1715  ba0000         mov     dx, 0                 
  1718  7601           jbe     0x6b9                 
  1720  4a             dec     dx                    
  1721  0bd3           or      dx, bx                
  1723  23d2           and     dx, dx                
  1725  7503           jne     0x6c2                 
  1727  e90e00         jmp     0x6d0                 
  1730  bfa409         mov     di, 0x9a4             
  1733  be240e         mov     si, 0xe24             
  1736  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  1741  e91800         jmp     0x6e8                 
  1744  bea409         mov     si, 0x9a4             
  1747  9a42104702     lcall   0x247, 0x1042            ; RT#16  
  1752  7403           je      0x6dd                 
  1754  e90b00         jmp     0x6e8                 
  1757  bfa409         mov     di, 0x9a4             
  1760  be9c09         mov     si, 0x99c             
  1763  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  1768  bf700a         mov     di, 0xa70             
  1771  bea009         mov     si, 0x9a0             
  1774  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  1779  bb0000         mov     bx, 0                 
  1782  7301           jae     0x6f9                 
  1784  4b             dec     bx                    
  1785  bf280e         mov     di, 0xe28             
  1788  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  1793  ba0000         mov     dx, 0                 
  1796  7601           jbe     0x707                 
  1798  4a             dec     dx                    
  1799  0bd3           or      dx, bx                
  1801  23d2           and     dx, dx                
  1803  7503           jne     0x710                 
  1805  e90e00         jmp     0x71e                 
  1808  bfa009         mov     di, 0x9a0             
  1811  be9809         mov     si, 0x998             
  1814  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  1819  e91200         jmp     0x730                 
  1822  bf0e0d         mov     di, 0xd0e             
  1825  bea009         mov     si, 0x9a0             
  1828  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  1833  8bfe           mov     di, si                
  1835  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  1840  bf9c09         mov     di, 0x99c             
  1843  bea409         mov     si, 0x9a4             
  1846  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  1851  bf9809         mov     di, 0x998             
  1854  bea009         mov     si, 0x9a0             
  1857  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  1862  9ae7094702     lcall   0x247, 0x9e7             ; RT#17  
  1867  33db           xor     bx, bx                
  1869  8bd3           mov     dx, bx                
  1871  9a4b2a4702     lcall   0x247, 0x2a4b            ; RT#18  
  1876  bbff00         mov     bx, 0xff              
  1879  ba2100         mov     dx, 0x21              
  1882  b90100         mov     cx, 1                 
  1885  9a932a4702     lcall   0x247, 0x2a93            ; RT#23  GFX.LINE
  1890  9a54234702     lcall   0x247, 0x2354            ; RT#19  
  1895  1a1ebb0a       sbb     bl, byte ptr [0xabb]  
  1899  0133           add     word ptr [bp + di], si
  1901  d29a4b2a       rcr     byte ptr [bp + si + 0x2a4b], cl
  1905  47             inc     di                    
  1906  02bb3f01       add     bh, byte ptr [bp + di + 0x13f]
  1910  bab100         mov     dx, 0xb1              
  1913  b90100         mov     cx, 1                 
  1916  9a5a2a4702     lcall   0x247, 0x2a5a            ; RT#57  
  1921  bb0b01         mov     bx, 0x10b             
  1924  ba0100         mov     dx, 1                 
  1927  9a4b2a4702     lcall   0x247, 0x2a4b            ; RT#18  
  1932  bb3e01         mov     bx, 0x13e             
  1935  bab000         mov     dx, 0xb0              
  1938  b90100         mov     cx, 1                 
  1941  9a5a2a4702     lcall   0x247, 0x2a5a            ; RT#57  
  1946  33db           xor     bx, bx                
  1948  ba5f00         mov     dx, 0x5f              
  1951  9a4b2a4702     lcall   0x247, 0x2a4b            ; RT#18  
  1956  bbff00         mov     bx, 0xff              
  1959  ba6900         mov     dx, 0x69              
  1962  b9ffff         mov     cx, 0xffff            
  1965  9a932a4702     lcall   0x247, 0x2a93            ; RT#23  GFX.LINE
  1970  33db           xor     bx, bx                
  1972  baa700         mov     dx, 0xa7              
  1975  9a4b2a4702     lcall   0x247, 0x2a4b            ; RT#18  
  1980  bbff00         mov     bx, 0xff              
  1983  bab100         mov     dx, 0xb1              
  1986  b9ffff         mov     cx, 0xffff            
  1989  9a932a4702     lcall   0x247, 0x2a93            ; RT#23  GFX.LINE
  1994  bfa809         mov     di, 0x9a8             
  1997  bed40d         mov     si, 0xdd4             
  2000  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  2005  bfac09         mov     di, 0x9ac             
  2008  be2c0e         mov     si, 0xe2c             
  2011  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  2016  bfb009         mov     di, 0x9b0             
  2019  be2c0e         mov     si, 0xe2c             
  2022  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  2027  bfb409         mov     di, 0x9b4             
  2030  be700a         mov     si, 0xa70             
  2033  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  2038  bb1800         mov     bx, 0x18              
  2041  9a7c0f4702     lcall   0x247, 0xf7c             ; RT#14  
  2046  9a60364702     lcall   0x247, 0x3660            ; RT#6   STMT.RESET
  2051  bb0500         mov     bx, 5                 
  2054  9ad7294702     lcall   0x247, 0x29d7            ; RT#58  
  2059  bb300e         mov     bx, 0xe30                ; = 'SCORE: 0'
  2062  9a18354702     lcall   0x247, 0x3518            ; RT#28  PRINT.AT  <<< bx='SCORE: 0'
  2067  bb0900         mov     bx, 9                 
  2070  9ad7294702     lcall   0x247, 0x29d7            ; RT#58  
  2075  bb3c0e         mov     bx, 0xe3c                ; = 'TIME:'
  2078  9a18354702     lcall   0x247, 0x3518            ; RT#28  PRINT.AT  <<< bx='TIME:'
  2083  bec40c         mov     si, 0xcc4             
  2086  9adf0e4702     lcall   0x247, 0xedf             ; RT#7   FAC.LOAD.SGL
  2091  e93800         jmp     0x866                 
  2094  bf460e         mov     di, 0xe46             
  2097  beb809         mov     si, 0x9b8             
  2100  9a62014702     lcall   0x247, 0x162             ; RT#24  
  2105  bf4a0e         mov     di, 0xe4a             
  2108  9a1f004702     lcall   0x247, 0x1f              ; RT#11  FAC.LOAD.ALT
  2113  9a1c304702     lcall   0x247, 0x301c            ; RT#12  
  2118  8bd3           mov     dx, bx                
  2120  bb2301         mov     bx, 0x123             
  2123  b9ffff         mov     cx, 0xffff            
  2126  9ad92a4702     lcall   0x247, 0x2ad9            ; RT#25  GFX.ATTR
  2131  bb7209         mov     bx, 0x972             
  2134  9a7a334702     lcall   0x247, 0x337a            ; RT#20  OPEN
  2139  bf700a         mov     di, 0xa70             
  2142  beb809         mov     si, 0x9b8             
  2145  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  2150  bfb809         mov     di, 0x9b8             
  2153  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  2158  bf800a         mov     di, 0xa80             
  2161  beb809         mov     si, 0x9b8             
  2164  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  2169  76b3           jbe     0x82e                 
  2171  bf4e0e         mov     di, 0xe4e             
  2174  bea009         mov     si, 0x9a0             
  2177  9a62014702     lcall   0x247, 0x162             ; RT#24  
  2182  bfa809         mov     di, 0x9a8             
  2185  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  2190  bfbc09         mov     di, 0x9bc             
  2193  bea009         mov     si, 0x9a0             
  2196  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  2201  be700a         mov     si, 0xa70             
  2204  9adf0e4702     lcall   0x247, 0xedf             ; RT#7   FAC.LOAD.SGL
  2209  e9a100         jmp     0x945                 
  2212  be700a         mov     si, 0xa70             
  2215  9adf0e4702     lcall   0x247, 0xedf             ; RT#7   FAC.LOAD.SGL
  2220  e92f00         jmp     0x8de                 
  2223  bfc009         mov     di, 0x9c0             
  2226  be520e         mov     si, 0xe52             
  2229  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  2234  9a54234702     lcall   0x247, 0x2354            ; RT#19  
  2239  e61d           out     0x1d, al              
  2241  bf700a         mov     di, 0xa70             
  2244  bec409         mov     si, 0x9c4             
  2247  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  2252  8bfe           mov     di, si                
  2254  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  2259  bf700a         mov     di, 0xa70             
  2262  bec809         mov     si, 0x9c8             
  2265  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  2270  bfc809         mov     di, 0x9c8             
  2273  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  2278  bf2c0e         mov     di, 0xe2c             
  2281  bec809         mov     si, 0x9c8             
  2284  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  2289  76bc           jbe     0x8af                 
  2291  bfc009         mov     di, 0x9c0             
  2294  be560e         mov     si, 0xe56             
  2297  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  2302  9a54234702     lcall   0x247, 0x2354            ; RT#19  
  2307  e61d           out     0x1d, al              
  2309  bf280e         mov     di, 0xe28             
  2312  beb409         mov     si, 0x9b4             
  2315  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  2320  bb0000         mov     bx, 0                 
  2323  7501           jne     0x916                 
  2325  4b             dec     bx                    
  2326  9a892f4702     lcall   0x247, 0x2f89            ; RT#9   BH.FLAGS
  2331  8bfe           mov     di, si                
  2333  9a1f004702     lcall   0x247, 0x1f              ; RT#11  FAC.LOAD.ALT
  2338  8bdf           mov     bx, di                
  2340  bf700a         mov     di, 0xa70             
  2343  9a1f004702     lcall   0x247, 0x1f              ; RT#11  FAC.LOAD.ALT
  2348  8bfb           mov     di, bx                
  2350  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  2355  9a54234702     lcall   0x247, 0x2354            ; RT#19  
  2360  1a1ebf70       sbb     bl, byte ptr [0x70bf] 
  2364  0abecc09       or      bh, byte ptr [bp + 0x9cc]
  2368  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  2373  bfcc09         mov     di, 0x9cc             
  2376  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  2381  bfbc09         mov     di, 0x9bc             
  2384  becc09         mov     si, 0x9cc             
  2387  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  2392  7703           ja      0x95d                 
  2394  e947ff         jmp     0x8a4                 
  2397  bfc409         mov     di, 0x9c4             
  2400  bec40c         mov     si, 0xcc4             
  2403  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  2408  bf700a         mov     di, 0xa70             
  2411  beb409         mov     si, 0x9b4             
  2414  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  2419  bb0000         mov     bx, 0                 
  2422  7601           jbe     0x979                 
  2424  4b             dec     bx                    
  2425  bf280e         mov     di, 0xe28             
  2428  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  2433  ba0000         mov     dx, 0                 
  2436  7501           jne     0x987                 
  2438  4a             dec     dx                    
  2439  03d3           add     dx, bx                
  2441  42             inc     dx                    
  2442  42             inc     dx                    
  2443  42             inc     dx                    
  2444  42             inc     dx                    
  2445  8bda           mov     bx, dx                
  2447  9a892f4702     lcall   0x247, 0x2f89            ; RT#9   BH.FLAGS
  2452  bfd009         mov     di, 0x9d0             
  2455  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  2460  bf280e         mov     di, 0xe28             
  2463  beb409         mov     si, 0x9b4             
  2466  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  2471  bb0000         mov     bx, 0                 
  2474  7501           jne     0x9ad                 
  2476  4b             dec     bx                    
  2477  9a892f4702     lcall   0x247, 0x2f89            ; RT#9   BH.FLAGS
  2482  8bde           mov     bx, si                
  2484  8bf7           mov     si, di                
  2486  9a12004702     lcall   0x247, 0x12              ; RT#30  
  2491  8bfb           mov     di, bx                
  2493  9a0a004702     lcall   0x247, 0xa               ; RT#91  
  2498  bfd409         mov     di, 0x9d4             
  2501  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  2506  be5a0e         mov     si, 0xe5a             
  2509  9adf0e4702     lcall   0x247, 0xedf             ; RT#7   FAC.LOAD.SGL
  2514  e9eb02         jmp     0xcc0                 
  2517  bf5a0e         mov     di, 0xe5a             
  2520  beb809         mov     si, 0x9b8             
  2523  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  2528  bb0000         mov     bx, 0                 
  2531  7501           jne     0x9e6                 
  2533  4b             dec     bx                    
  2534  bf5e0e         mov     di, 0xe5e             
  2537  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  2542  ba0000         mov     dx, 0                 
  2545  7501           jne     0x9f4                 
  2547  4a             dec     dx                    
  2548  0bd3           or      dx, bx                
  2550  bf620e         mov     di, 0xe62             
  2553  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  2558  bb0000         mov     bx, 0                 
  2561  7501           jne     0xa04                 
  2563  4b             dec     bx                    
  2564  0bda           or      bx, dx                
  2566  23db           and     bx, bx                
  2568  7503           jne     0xa0d                 
  2570  e93501         jmp     0xb42                 
  2573  bfd009         mov     di, 0x9d0             
  2576  be660e         mov     si, 0xe66             
  2579  9ae2014702     lcall   0x247, 0x1e2             ; RT#59  
  2584  bbb200         mov     bx, 0xb2              
  2587  9ad6104702     lcall   0x247, 0x10d6            ; RT#22  FAC.NUM.FMT
  2592  bf6a0e         mov     di, 0xe6a             
  2595  9a57014702     lcall   0x247, 0x157             ; RT#21  FAC.LOAD.ALT2
  2600  bf6e0e         mov     di, 0xe6e             
  2603  9a1f004702     lcall   0x247, 0x1f              ; RT#11  FAC.LOAD.ALT
  2608  bbb200         mov     bx, 0xb2              
  2611  9ad6104702     lcall   0x247, 0x10d6            ; RT#22  FAC.NUM.FMT
  2616  9a8e104702     lcall   0x247, 0x108e            ; RT#60  
  2621  03bfd809       add     di, word ptr [bx + 0x9d8]
  2625  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  2630  bf720e         mov     di, 0xe72             
  2633  bed009         mov     si, 0x9d0             
  2636  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  2641  b80000         mov     ax, 0                 
  2644  7501           jne     0xa57                 
  2646  48             dec     ax                    
  2647  bb3900         mov     bx, 0x39              
  2650  f7eb           imul    bx                    
  2652  053200         add     ax, 0x32              
  2655  93             xchg    bx, ax                
  2656  9a892f4702     lcall   0x247, 0x2f89            ; RT#9   BH.FLAGS
  2661  bfdc09         mov     di, 0x9dc             
  2664  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  2669  bf0e0d         mov     di, 0xd0e             
  2672  bed009         mov     si, 0x9d0             
  2675  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  2680  bfd809         mov     di, 0x9d8             
  2683  9a57014702     lcall   0x247, 0x157             ; RT#21  FAC.LOAD.ALT2
  2688  bfdc09         mov     di, 0x9dc             
  2691  9a1f004702     lcall   0x247, 0x1f              ; RT#11  FAC.LOAD.ALT
  2696  bfe009         mov     di, 0x9e0             
  2699  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  2704  bfe409         mov     di, 0x9e4             
  2707  bed809         mov     si, 0x9d8             
  2710  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  2715  bedc09         mov     si, 0x9dc             
  2718  9adf0e4702     lcall   0x247, 0xedf             ; RT#7   FAC.LOAD.SGL
  2723  e96100         jmp     0xb07                 
  2726  beb809         mov     si, 0x9b8             
  2729  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  2734  8bd3           mov     dx, bx                
  2736  be6a09         mov     si, 0x96a             
  2739  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  2744  b9ffff         mov     cx, 0xffff            
  2747  9ad92a4702     lcall   0x247, 0x2ad9            ; RT#25  GFX.ATTR
  2752  bb7a09         mov     bx, 0x97a             
  2755  9a7a334702     lcall   0x247, 0x337a            ; RT#20  OPEN
  2760  bf2c0e         mov     di, 0xe2c             
  2763  beb809         mov     si, 0x9b8             
  2766  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  2771  9a1c304702     lcall   0x247, 0x301c            ; RT#12  
  2776  bf760e         mov     di, 0xe76             
  2779  be6a09         mov     si, 0x96a             
  2782  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  2787  8bd3           mov     dx, bx                
  2789  9a1c304702     lcall   0x247, 0x301c            ; RT#12  
  2794  b90200         mov     cx, 2                 
  2797  8bc1           mov     ax, cx                
  2799  9af2314702     lcall   0x247, 0x31f2            ; RT#61  
  2804  bb7e09         mov     bx, 0x97e             
  2807  9a7a334702     lcall   0x247, 0x337a            ; RT#20  OPEN
  2812  bfe409         mov     di, 0x9e4             
  2815  be6a09         mov     si, 0x96a             
  2818  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  2823  bf6a09         mov     di, 0x96a             
  2826  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  2831  bee409         mov     si, 0x9e4             
  2834  9a42104702     lcall   0x247, 0x1042            ; RT#16  
  2839  7203           jb      0xb1c                 
  2841  e91300         jmp     0xb2f                 
  2844  bfe009         mov     di, 0x9e0             
  2847  be6a09         mov     si, 0x96a             
  2850  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  2855  7203           jb      0xb2c                 
  2857  e97aff         jmp     0xaa6                 
  2860  e91000         jmp     0xb3f                 
  2863  bfe009         mov     di, 0x9e0             
  2866  be6a09         mov     si, 0x96a             
  2869  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  2874  7703           ja      0xb3f                 
  2876  e967ff         jmp     0xaa6                 
  2879  e97301         jmp     0xcb5                 
  2882  bfd409         mov     di, 0x9d4             
  2885  be7a0e         mov     si, 0xe7a             
  2888  9ae2014702     lcall   0x247, 0x1e2             ; RT#59  
  2893  bbb200         mov     bx, 0xb2              
  2896  9ad6104702     lcall   0x247, 0x10d6            ; RT#22  FAC.NUM.FMT
  2901  bf6a0e         mov     di, 0xe6a             
  2904  9a57014702     lcall   0x247, 0x157             ; RT#21  FAC.LOAD.ALT2
  2909  bf6e0e         mov     di, 0xe6e             
  2912  9a1f004702     lcall   0x247, 0x1f              ; RT#11  FAC.LOAD.ALT
  2917  bbb200         mov     bx, 0xb2              
  2920  9ad6104702     lcall   0x247, 0x10d6            ; RT#22  FAC.NUM.FMT
  2925  9a8e104702     lcall   0x247, 0x108e            ; RT#60  
  2930  03bfd809       add     di, word ptr [bx + 0x9d8]
  2934  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  2939  bf700a         mov     di, 0xa70             
  2942  bed409         mov     si, 0x9d4             
  2945  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  2950  b80000         mov     ax, 0                 
  2953  7501           jne     0xb8c                 
  2955  48             dec     ax                    
  2956  bb7000         mov     bx, 0x70              
  2959  f7eb           imul    bx                    
  2961  bf720e         mov     di, 0xe72             
  2964  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  2969  bb0000         mov     bx, 0                 
  2972  7501           jne     0xb9f                 
  2974  4b             dec     bx                    
  2975  93             xchg    bx, ax                
  2976  bac8ff         mov     dx, 0xffc8            
  2979  f7ea           imul    dx                    
  2981  2bc3           sub     ax, bx                
  2983  050800         add     ax, 8                 
  2986  93             xchg    bx, ax                
  2987  9a892f4702     lcall   0x247, 0x2f89            ; RT#9   BH.FLAGS
  2992  bfdc09         mov     di, 0x9dc             
  2995  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  3000  bf0e0d         mov     di, 0xd0e             
  3003  bed409         mov     si, 0x9d4             
  3006  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  3011  bfd809         mov     di, 0x9d8             
  3014  9a57014702     lcall   0x247, 0x157             ; RT#21  FAC.LOAD.ALT2
  3019  bfdc09         mov     di, 0x9dc             
  3022  9a1f004702     lcall   0x247, 0x1f              ; RT#11  FAC.LOAD.ALT
  3027  bfe809         mov     di, 0x9e8             
  3030  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  3035  bfec09         mov     di, 0x9ec             
  3038  bed809         mov     si, 0x9d8             
  3041  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  3046  bedc09         mov     si, 0x9dc             
  3049  9adf0e4702     lcall   0x247, 0xedf             ; RT#7   FAC.LOAD.SGL
  3054  e98c00         jmp     0xc7d                 
  3057  be7e0e         mov     si, 0xe7e             
  3060  9adf0e4702     lcall   0x247, 0xedf             ; RT#7   FAC.LOAD.SGL
  3065  e96100         jmp     0xc5d                 
  3068  beb809         mov     si, 0x9b8             
  3071  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  3076  bff009         mov     di, 0x9f0             
  3079  be6a09         mov     si, 0x96a             
  3082  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  3087  8bd3           mov     dx, bx                
  3089  9a1c304702     lcall   0x247, 0x301c            ; RT#12  
  3094  b9ffff         mov     cx, 0xffff            
  3097  9ad92a4702     lcall   0x247, 0x2ad9            ; RT#25  GFX.ATTR
  3102  bb7609         mov     bx, 0x976             
  3105  9a7a334702     lcall   0x247, 0x337a            ; RT#20  OPEN
  3110  bf800a         mov     di, 0xa80             
  3113  beb809         mov     si, 0x9b8             
  3116  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  3121  9a1c304702     lcall   0x247, 0x301c            ; RT#12  
  3126  bff009         mov     di, 0x9f0             
  3129  be6a09         mov     si, 0x96a             
  3132  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  3137  8bd3           mov     dx, bx                
  3139  9a1c304702     lcall   0x247, 0x301c            ; RT#12  
  3144  b90300         mov     cx, 3                 
  3147  8bc1           mov     ax, cx                
  3149  9af2314702     lcall   0x247, 0x31f2            ; RT#61  
  3154  bfbe0d         mov     di, 0xdbe             
  3157  bef009         mov     si, 0x9f0             
  3160  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  3165  bff009         mov     di, 0x9f0             
  3168  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  3173  bf820e         mov     di, 0xe82             
  3176  bef009         mov     si, 0x9f0             
  3179  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  3184  768a           jbe     0xbfc                 
  3186  bfec09         mov     di, 0x9ec             
  3189  be6a09         mov     si, 0x96a             
  3192  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  3197  bf6a09         mov     di, 0x96a             
  3200  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  3205  beec09         mov     si, 0x9ec             
  3208  9a42104702     lcall   0x247, 0x1042            ; RT#16  
  3213  7203           jb      0xc92                 
  3215  e91300         jmp     0xca5                 
  3218  bfe809         mov     di, 0x9e8             
  3221  be6a09         mov     si, 0x96a             
  3224  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  3229  7203           jb      0xca2                 
  3231  e94fff         jmp     0xbf1                 
  3234  e91000         jmp     0xcb5                 
  3237  bfe809         mov     di, 0x9e8             
  3240  be6a09         mov     si, 0x96a             
  3243  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  3248  7703           ja      0xcb5                 
  3250  e93cff         jmp     0xbf1                 
  3253  bf860e         mov     di, 0xe86             
  3256  beb809         mov     si, 0x9b8             
  3259  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  3264  bfb809         mov     di, 0x9b8             
  3267  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  3272  bf8a0e         mov     di, 0xe8a             
  3275  beb809         mov     si, 0x9b8             
  3278  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  3283  7703           ja      0xcd8                 
  3285  e9fdfc         jmp     0x9d5                 
  3288  beb60d         mov     si, 0xdb6             
  3291  9adf0e4702     lcall   0x247, 0xedf             ; RT#7   FAC.LOAD.SGL
  3296  e92901         jmp     0xe0c                 
  3299  bb700a         mov     bx, 0xa70             
  3302  9a64174702     lcall   0x247, 0x1764            ; RT#62  
  3307  bf8e0e         mov     di, 0xe8e             
  3310  beb409         mov     si, 0x9b4             
  3313  9af30e4702     lcall   0x247, 0xef3             ; RT#51  
  3318  819a62014702   sbb     word ptr [bp + si + 0x162], 0x247
  3324  be920e         mov     si, 0xe92             
  3327  9a12004702     lcall   0x247, 0x12              ; RT#30  
  3332  9a5c014702     lcall   0x247, 0x15c             ; RT#92  
  3337  81bbb2009ad6   cmp     word ptr [bp + di + 0xb2], 0xd69a
  3343  104702         adc     byte ptr [bx + 2], al 
  3346  bf4a0e         mov     di, 0xe4a             
  3349  9a1f004702     lcall   0x247, 0x1f              ; RT#11  FAC.LOAD.ALT
  3354  bff409         mov     di, 0x9f4             
  3357  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  3362  bf860e         mov     di, 0xe86             
  3365  beb809         mov     si, 0x9b8             
  3368  9a62014702     lcall   0x247, 0x162             ; RT#24  
  3373  bf960e         mov     di, 0xe96             
  3376  9a1f004702     lcall   0x247, 0x1f              ; RT#11  FAC.LOAD.ALT
  3381  9a1c304702     lcall   0x247, 0x301c            ; RT#12  
  3386  8bd3           mov     dx, bx                
  3388  bef409         mov     si, 0x9f4             
  3391  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  3396  b9ffff         mov     cx, 0xffff            
  3399  9ad92a4702     lcall   0x247, 0x2ad9            ; RT#25  GFX.ATTR
  3404  beb809         mov     si, 0x9b8             
  3407  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  3412  8bf3           mov     si, bx                
  3414  d1e6           shl     si, 1                 
  3416  d1e6           shl     si, 1                 
  3418  81c6b208       add     si, 0x8b2             
  3422  9a1a104702     lcall   0x247, 0x101a            ; RT#93  
  3427  9a54104702     lcall   0x247, 0x1054            ; RT#63  
  3432  bb0000         mov     bx, 0                 
  3435  7301           jae     0xd6e                 
  3437  4b             dec     bx                    
  3438  f7db           neg     bx                    
  3440  9a892f4702     lcall   0x247, 0x2f89            ; RT#9   BH.FLAGS
  3445  bff809         mov     di, 0x9f8             
  3448  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  3453  bffc09         mov     di, 0x9fc             
  3456  beb409         mov     si, 0x9b4             
  3459  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  3464  bec40c         mov     si, 0xcc4             
  3467  9adf0e4702     lcall   0x247, 0xedf             ; RT#7   FAC.LOAD.SGL
  3472  e95900         jmp     0xdec                 
  3475  bb700a         mov     bx, 0xa70             
  3478  9a64174702     lcall   0x247, 0x1764            ; RT#62  
  3483  bf800a         mov     di, 0xa80             
  3486  9a57014702     lcall   0x247, 0x157             ; RT#21  FAC.LOAD.ALT2
  3491  8bd3           mov     dx, bx                
  3493  bbb200         mov     bx, 0xb2              
  3496  9ad6104702     lcall   0x247, 0x10d6            ; RT#22  FAC.NUM.FMT
  3501  8bfa           mov     di, dx                
  3503  9a1f004702     lcall   0x247, 0x1f              ; RT#11  FAC.LOAD.ALT
  3508  bbb200         mov     bx, 0xb2              
  3511  9ad12b4702     lcall   0x247, 0x2bd1            ; RT#94  
  3516  b89a0e         mov     ax, 0xe9a             
  3519  9a600e4702     lcall   0x247, 0xe60             ; RT#64  
  3524  8bd3           mov     dx, bx                
  3526  bef809         mov     si, 0x9f8             
  3529  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  3534  d1e3           shl     bx, 1                 
  3536  d1e3           shl     bx, 1                 
  3538  81c3aa08       add     bx, 0x8aa             
  3542  92             xchg    dx, ax                
  3543  9a600e4702     lcall   0x247, 0xe60             ; RT#64  
  3548  9a7a334702     lcall   0x247, 0x337a            ; RT#20  OPEN
  3553  bf700a         mov     di, 0xa70             
  3556  be6a09         mov     si, 0x96a             
  3559  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  3564  bf6a09         mov     di, 0x96a             
  3567  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  3572  bffc09         mov     di, 0x9fc             
  3575  be6a09         mov     si, 0x96a             
  3578  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  3583  7692           jbe     0xd93                 
  3585  bf700a         mov     di, 0xa70             
  3588  beb809         mov     si, 0x9b8             
  3591  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  3596  bfb809         mov     di, 0x9b8             
  3599  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  3604  bf860e         mov     di, 0xe86             
  3607  beb809         mov     si, 0x9b8             
  3610  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  3615  7703           ja      0xe24                 
  3617  e9bffe         jmp     0xce3                 
  3620  33db           xor     bx, bx                
  3622  9a6c144702     lcall   0x247, 0x146c            ; RT#27  
  3627  bb1c04         mov     bx, 0x41c             
  3630  8e1e9800       mov     ds, word ptr [0x98]   
  3634  8a1f           mov     bl, byte ptr [bx]     
  3636  30ff           xor     bh, bh                
  3638  06             push    es                    
  3639  1f             pop     ds                    
  3640  93             xchg    bx, ax                
  3641  bb1a04         mov     bx, 0x41a             
  3644  8e1e9800       mov     ds, word ptr [0x98]   
  3648  8807           mov     byte ptr [bx], al     
  3650  06             push    es                    
  3651  1f             pop     ds                    
  3652  be700a         mov     si, 0xa70             
  3655  9adf0e4702     lcall   0x247, 0xedf             ; RT#7   FAC.LOAD.SGL
  3660  e90b00         jmp     0xe5a                 
  3663  bf700a         mov     di, 0xa70             
  3666  bef009         mov     si, 0x9f0             
  3669  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  3674  bff009         mov     di, 0x9f0             
  3677  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  3682  bfd80d         mov     di, 0xdd8             
  3685  bef009         mov     si, 0x9f0             
  3688  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  3693  76e0           jbe     0xe4f                 
  3695  bb1800         mov     bx, 0x18              
  3698  9a620f4702     lcall   0x247, 0xf62             ; RT#15  
  3703  bb1d00         mov     bx, 0x1d              
  3706  9a7c0f4702     lcall   0x247, 0xf7c             ; RT#14  
  3711  9a60364702     lcall   0x247, 0x3660            ; RT#6   STMT.RESET
  3716  bba00e         mov     bx, 0xea0             
  3719  9a18354702     lcall   0x247, 0x3518            ; RT#28  PRINT.AT
  3724  bf000a         mov     di, 0xa00             
  3727  bea60e         mov     si, 0xea6             
  3730  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  3735  bf040a         mov     di, 0xa04             
  3738  be860e         mov     si, 0xe86             
  3741  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  3746  bf080a         mov     di, 0xa08             
  3749  beaa0e         mov     si, 0xeaa             
  3752  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  3757  bf860e         mov     di, 0xe86             
  3760  be040a         mov     si, 0xa04             
  3763  9a62014702     lcall   0x247, 0x162             ; RT#24  
  3768  bfae0e         mov     di, 0xeae             
  3771  9a1f004702     lcall   0x247, 0x1f              ; RT#11  FAC.LOAD.ALT
  3776  bf0c0a         mov     di, 0xa0c             
  3779  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  3784  be0c0a         mov     si, 0xa0c             
  3787  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  3792  8bd3           mov     dx, bx                
  3794  be000a         mov     si, 0xa00             
  3797  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  3802  9a182b4702     lcall   0x247, 0x2b18            ; RT#65  
  3807  bf780a         mov     di, 0xa78             
  3810  be0c0a         mov     si, 0xa0c             
  3813  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  3818  9a1c304702     lcall   0x247, 0x301c            ; RT#12  
  3823  bfb20e         mov     di, 0xeb2             
  3826  be000a         mov     si, 0xa00             
  3829  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  3834  8bd3           mov     dx, bx                
  3836  9a1c304702     lcall   0x247, 0x301c            ; RT#12  
  3841  9a1e2b4702     lcall   0x247, 0x2b1e            ; RT#66  
  3846  bb3609         mov     bx, 0x936             
  3849  ba3000         mov     dx, 0x30              
  3852  9a242b4702     lcall   0x247, 0x2b24            ; RT#67  
  3857  be0c0a         mov     si, 0xa0c             
  3860  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  3865  bf7e0e         mov     di, 0xe7e             
  3868  be000a         mov     si, 0xa00             
  3871  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  3876  8bd3           mov     dx, bx                
  3878  9a1c304702     lcall   0x247, 0x301c            ; RT#12  
  3883  b9ffff         mov     cx, 0xffff            
  3886  9ad92a4702     lcall   0x247, 0x2ad9            ; RT#25  GFX.ATTR
  3891  bb7209         mov     bx, 0x972             
  3894  9a7a334702     lcall   0x247, 0x337a            ; RT#20  OPEN
  3899  bf7e0e         mov     di, 0xe7e             
  3902  be040a         mov     si, 0xa04             
  3905  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  3910  bb0000         mov     bx, 0                 
  3913  7601           jbe     0xf4c                 
  3915  4b             dec     bx                    
  3916  bf860e         mov     di, 0xe86             
  3919  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  3924  ba0000         mov     dx, 0                 
  3927  7301           jae     0xf5a                 
  3929  4a             dec     dx                    
  3930  23d3           and     dx, bx                
  3932  23d2           and     dx, dx                
  3934  7503           jne     0xf63                 
  3936  e94200         jmp     0xfa5                 
  3939  be720e         mov     si, 0xe72             
  3942  9adf0e4702     lcall   0x247, 0xedf             ; RT#7   FAC.LOAD.SGL
  3947  e92200         jmp     0xf90                 
  3950  be6a09         mov     si, 0x96a             
  3953  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  3958  8bfb           mov     di, bx                
  3960  d1e7           shl     di, 1                 
  3962  8b9d3609       mov     bx, word ptr [di + 0x936]
  3966  23db           and     bx, bx                
  3968  7403           je      0xf85                 
  3970  e9d907         jmp     0x175e                
  3973  bf700a         mov     di, 0xa70             
  3976  be6a09         mov     si, 0x96a             
  3979  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  3984  bf6a09         mov     di, 0x96a             
  3987  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  3992  bfae0e         mov     di, 0xeae             
  3995  be6a09         mov     si, 0x96a             
  3998  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  4003  76c9           jbe     0xf6e                 
  4005  bf7e0e         mov     di, 0xe7e             
  4008  be040a         mov     si, 0xa04             
  4011  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  4016  7203           jb      0xfb5                 
  4018  e9ea00         jmp     0x109f                
  4021  bf100a         mov     di, 0xa10             
  4024  beb60e         mov     si, 0xeb6             
  4027  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  4032  be720e         mov     si, 0xe72             
  4035  9adf0e4702     lcall   0x247, 0xedf             ; RT#7   FAC.LOAD.SGL
  4040  e93600         jmp     0x1001                
  4043  be6a09         mov     si, 0x96a             
  4046  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  4051  8bfb           mov     di, bx                
  4053  d1e7           shl     di, 1                 
  4055  83bd360900     cmp     word ptr [di + 0x936], 0
  4060  bb0000         mov     bx, 0                 
  4063  7401           je      0xfe2                 
  4065  4b             dec     bx                    
  4066  9a892f4702     lcall   0x247, 0x2f89            ; RT#9   BH.FLAGS
  4071  be100a         mov     si, 0xa10             
  4074  9a12004702     lcall   0x247, 0x12              ; RT#30  
  4079  8bfe           mov     di, si                
  4081  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  4086  bf720e         mov     di, 0xe72             
  4089  be6a09         mov     si, 0x96a             
  4092  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  4097  bf6a09         mov     di, 0x96a             
  4100  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  4105  bfba0e         mov     di, 0xeba             
  4108  be6a09         mov     si, 0x96a             
  4111  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  4116  76b5           jbe     0xfcb                 
  4118  bf140a         mov     di, 0xa14             
  4121  bec40c         mov     si, 0xcc4             
  4124  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  4129  be800a         mov     si, 0xa80             
  4132  9adf0e4702     lcall   0x247, 0xedf             ; RT#7   FAC.LOAD.SGL
  4137  e93600         jmp     0x1062                
  4140  be6a09         mov     si, 0x96a             
  4143  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  4148  8bfb           mov     di, bx                
  4150  d1e7           shl     di, 1                 
  4152  83bd360900     cmp     word ptr [di + 0x936], 0
  4157  bb0000         mov     bx, 0                 
  4160  7401           je      0x1043                
  4162  4b             dec     bx                    
  4163  9a892f4702     lcall   0x247, 0x2f89            ; RT#9   BH.FLAGS
  4168  be140a         mov     si, 0xa14             
  4171  9a12004702     lcall   0x247, 0x12              ; RT#30  
  4176  8bfe           mov     di, si                
  4178  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  4183  bf720e         mov     di, 0xe72             
  4186  be6a09         mov     si, 0x96a             
  4189  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  4194  bf6a09         mov     di, 0x96a             
  4197  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  4202  bfae0e         mov     di, 0xeae             
  4205  be6a09         mov     si, 0x96a             
  4208  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  4213  76b5           jbe     0x102c                
  4215  bf280e         mov     di, 0xe28             
  4218  be100a         mov     si, 0xa10             
  4221  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  4226  bb0000         mov     bx, 0                 
  4229  7301           jae     0x1088                
  4231  4b             dec     bx                    
  4232  be140a         mov     si, 0xa14             
  4235  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  4240  ba0000         mov     dx, 0                 
  4243  7301           jae     0x1096                
  4245  4a             dec     dx                    
  4246  0bd3           or      dx, bx                
  4248  23d2           and     dx, dx                
  4250  7403           je      0x109f                
  4252  e9bf06         jmp     0x175e                
  4255  bf7e0e         mov     di, 0xe7e             
  4258  be040a         mov     si, 0xa04             
  4261  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  4266  bb0000         mov     bx, 0                 
  4269  7501           jne     0x10b0                
  4271  4b             dec     bx                    
  4272  bf860e         mov     di, 0xe86             
  4275  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  4280  ba0000         mov     dx, 0                 
  4283  7501           jne     0x10be                
  4285  4a             dec     dx                    
  4286  0bd3           or      dx, bx                
  4288  23d2           and     dx, dx                
  4290  7503           jne     0x10c7                
  4292  e93e00         jmp     0x1105                
  4295  bfbe0e         mov     di, 0xebe             
  4298  bea409         mov     si, 0x9a4             
  4301  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  4306  bf180a         mov     di, 0xa18             
  4309  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  4314  be700a         mov     si, 0xa70             
  4317  9adf0e4702     lcall   0x247, 0xedf             ; RT#7   FAC.LOAD.SGL
  4322  e90b00         jmp     0x10f0                
  4325  bf700a         mov     di, 0xa70             
  4328  be6a09         mov     si, 0x96a             
  4331  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  4336  bf6a09         mov     di, 0x96a             
  4339  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  4344  bf180a         mov     di, 0xa18             
  4347  be6a09         mov     si, 0x96a             
  4350  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  4355  76e0           jbe     0x10e5                
  4357  bb1800         mov     bx, 0x18              
  4360  9a620f4702     lcall   0x247, 0xf62             ; RT#15  
  4365  bb1c00         mov     bx, 0x1c              
  4368  9a7c0f4702     lcall   0x247, 0xf7c             ; RT#14  
  4373  9a60364702     lcall   0x247, 0x3660            ; RT#6   STMT.RESET
  4378  bb080a         mov     bx, 0xa08             
  4381  9a09354702     lcall   0x247, 0x3509            ; RT#29  
  4386  bb2c01         mov     bx, 0x12c             
  4389  bac20e         mov     dx, 0xec2             
  4392  9a93084702     lcall   0x247, 0x893             ; RT#26  SPKR.STRHELPER
  4397  9af7234702     lcall   0x247, 0x23f7            ; RT#68  
  4402  ba1c0a         mov     dx, 0xa1c             
  4405  9a2a0e4702     lcall   0x247, 0xe2a             ; RT#10  DRAW
  4410  bb740a         mov     bx, 0xa74             
  4413  b81c0a         mov     ax, 0xa1c             
  4416  9a9a0e4702     lcall   0x247, 0xe9a             ; RT#13  
  4421  7403           je      0x114a                
  4423  e90e00         jmp     0x1158                
  4426  bf200a         mov     di, 0xa20             
  4429  bec60e         mov     si, 0xec6             
  4432  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  4437  e97f00         jmp     0x11d7                
  4440  bb1c0a         mov     bx, 0xa1c             
  4443  9ae3234702     lcall   0x247, 0x23e3            ; RT#33  
  4448  9a892f4702     lcall   0x247, 0x2f89            ; RT#9   BH.FLAGS
  4453  bf200a         mov     di, 0xa20             
  4456  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  4461  be200a         mov     si, 0xa20             
  4464  9a42104702     lcall   0x247, 0x1042            ; RT#16  
  4469  7403           je      0x117a                
  4471  e95d00         jmp     0x11d7                
  4474  bb1c0a         mov     bx, 0xa1c             
  4477  ba0200         mov     dx, 2                 
  4480  b9ff7f         mov     cx, 0x7fff            
  4483  9adc244702     lcall   0x247, 0x24dc            ; RT#44  
  4488  8bd3           mov     dx, bx                
  4490  bb9009         mov     bx, 0x990             
  4493  9ab4244702     lcall   0x247, 0x24b4            ; RT#95  
  4498  9a892f4702     lcall   0x247, 0x2f89            ; RT#9   BH.FLAGS
  4503  bf200a         mov     di, 0xa20             
  4506  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  4511  be200a         mov     si, 0xa20             
  4514  9a5a104702     lcall   0x247, 0x105a            ; RT#31  
  4519  23db           and     bx, bx                
  4521  7503           jne     0x11ae                
  4523  e92900         jmp     0x11d7                
  4526  be200a         mov     si, 0xa20             
  4529  8bd6           mov     dx, si                
  4531  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  4536  8bc2           mov     ax, dx                
  4538  8bd3           mov     dx, bx                
  4540  bb9409         mov     bx, 0x994             
  4543  b9ff7f         mov     cx, 0x7fff            
  4546  9adc244702     lcall   0x247, 0x24dc            ; RT#44  
  4551  9ae3234702     lcall   0x247, 0x23e3            ; RT#33  
  4556  9a892f4702     lcall   0x247, 0x2f89            ; RT#9   BH.FLAGS
  4561  97             xchg    di, ax                
  4562  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  4567  bfca0e         mov     di, 0xeca             
  4570  be200a         mov     si, 0xa20             
  4573  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  4578  7403           je      0x11e7                
  4580  e91600         jmp     0x11fd                
  4583  bb0100         mov     bx, 1                 
  4586  baff7f         mov     dx, 0x7fff            
  4589  9aa1114702     lcall   0x247, 0x11a1            ; RT#41  KEY.INPUT
  4594  ba6e09         mov     dx, 0x96e             
  4597  9a2a0e4702     lcall   0x247, 0xe2a             ; RT#10  DRAW
  4602  e908ff         jmp     0x1105                
  4605  bfce0e         mov     di, 0xece             
  4608  be200a         mov     si, 0xa20             
  4611  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  4616  7403           je      0x120d                
  4618  e90800         jmp     0x1215                
  4621  9ae7094702     lcall   0x247, 0x9e7             ; RT#17  
  4626  e99e09         jmp     0x1bb3                
  4629  be8c09         mov     si, 0x98c             
  4632  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  4637  f7d3           not     bx                    
  4639  23db           and     bx, bx                
  4641  7403           je      0x1226                
  4643  e91a01         jmp     0x1340                
  4646  bf200a         mov     di, 0xa20             
  4649  bed20e         mov     si, 0xed2             
  4652  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  4657  bb0100         mov     bx, 1                 
  4660  9aa4274702     lcall   0x247, 0x27a4            ; RT#69  
  4665  9a892f4702     lcall   0x247, 0x2f89            ; RT#9   BH.FLAGS
  4670  bf240a         mov     di, 0xa24             
  4673  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  4678  bb0100         mov     bx, 1                 
  4681  9aa4274702     lcall   0x247, 0x27a4            ; RT#69  
  4686  9a892f4702     lcall   0x247, 0x2f89            ; RT#9   BH.FLAGS
  4691  bf280a         mov     di, 0xa28             
  4694  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  4699  bfd60e         mov     di, 0xed6             
  4702  be240a         mov     si, 0xa24             
  4705  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  4710  bb0000         mov     bx, 0                 
  4713  7601           jbe     0x126c                
  4715  4b             dec     bx                    
  4716  bfda0e         mov     di, 0xeda             
  4719  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  4724  ba0000         mov     dx, 0                 
  4727  7301           jae     0x127a                
  4729  4a             dec     dx                    
  4730  23da           and     bx, dx                
  4732  9a892f4702     lcall   0x247, 0x2f89            ; RT#9   BH.FLAGS
  4737  bf2c0a         mov     di, 0xa2c             
  4740  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  4745  bfd60e         mov     di, 0xed6             
  4748  be280a         mov     si, 0xa28             
  4751  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  4756  bb0000         mov     bx, 0                 
  4759  7601           jbe     0x129a                
  4761  4b             dec     bx                    
  4762  bfda0e         mov     di, 0xeda             
  4765  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  4770  ba0000         mov     dx, 0                 
  4773  7301           jae     0x12a8                
  4775  4a             dec     dx                    
  4776  23da           and     bx, dx                
  4778  9a892f4702     lcall   0x247, 0x2f89            ; RT#9   BH.FLAGS
  4783  bf300a         mov     di, 0xa30             
  4786  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  4791  be300a         mov     si, 0xa30             
  4794  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  4799  8bd3           mov     dx, bx                
  4801  be2c0a         mov     si, 0xa2c             
  4804  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  4809  f7d3           not     bx                    
  4811  23da           and     bx, dx                
  4813  23db           and     bx, bx                
  4815  7503           jne     0x12d4                
  4817  e92800         jmp     0x12fc                
  4820  bfde0e         mov     di, 0xede             
  4823  be240a         mov     si, 0xa24             
  4826  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  4831  bb0000         mov     bx, 0                 
  4834  7601           jbe     0x12e5                
  4836  4b             dec     bx                    
  4837  d1e3           shl     bx, 1                 
  4839  83eb34         sub     bx, 0x34              
  4842  f7db           neg     bx                    
  4844  9a892f4702     lcall   0x247, 0x2f89            ; RT#9   BH.FLAGS
  4849  bf200a         mov     di, 0xa20             
  4852  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  4857  e94400         jmp     0x1340                
  4860  be340a         mov     si, 0xa34             
  4863  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  4868  8bd3           mov     dx, bx                
  4870  be300a         mov     si, 0xa30             
  4873  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  4878  f7d3           not     bx                    
  4880  23da           and     bx, dx                
  4882  23db           and     bx, bx                
  4884  7503           jne     0x1319                
  4886  e92700         jmp     0x1340                
  4889  bfde0e         mov     di, 0xede             
  4892  be280a         mov     si, 0xa28             
  4895  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  4900  b80000         mov     ax, 0                 
  4903  7601           jbe     0x132a                
  4905  48             dec     ax                    
  4906  bb0600         mov     bx, 6                 
  4909  f7eb           imul    bx                    
  4911  053800         add     ax, 0x38              
  4914  93             xchg    bx, ax                
  4915  9a892f4702     lcall   0x247, 0x2f89            ; RT#9   BH.FLAGS
  4920  bf200a         mov     di, 0xa20             
  4923  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  4928  bf240e         mov     di, 0xe24             
  4931  be200a         mov     si, 0xa20             
  4934  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  4939  bb0000         mov     bx, 0                 
  4942  7501           jne     0x1351                
  4944  4b             dec     bx                    
  4945  bfe20e         mov     di, 0xee2             
  4948  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  4953  ba0000         mov     dx, 0                 
  4956  7501           jne     0x135f                
  4958  4a             dec     dx                    
  4959  0bd3           or      dx, bx                
  4961  bf820e         mov     di, 0xe82             
  4964  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  4969  bb0000         mov     bx, 0                 
  4972  7501           jne     0x136f                
  4974  4b             dec     bx                    
  4975  0bda           or      bx, dx                
  4977  bfe60e         mov     di, 0xee6             
  4980  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  4985  ba0000         mov     dx, 0                 
  4988  7501           jne     0x137f                
  4990  4a             dec     dx                    
  4991  0bd3           or      dx, bx                
  4993  23d2           and     dx, dx                
  4995  7503           jne     0x1388                
  4997  e97b00         jmp     0x1403                
  5000  bb9001         mov     bx, 0x190             
  5003  ba6e0e         mov     dx, 0xe6e             
  5006  9a93084702     lcall   0x247, 0x893             ; RT#26  SPKR.STRHELPER
  5011  bb5802         mov     bx, 0x258             
  5014  ba700a         mov     dx, 0xa70             
  5017  9a93084702     lcall   0x247, 0x893             ; RT#26  SPKR.STRHELPER
  5022  bfe60e         mov     di, 0xee6             
  5025  be200a         mov     si, 0xa20             
  5028  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  5033  7403           je      0x13ae                
  5035  e91500         jmp     0x13c3                
  5038  bfc009         mov     di, 0x9c0             
  5041  be4a0e         mov     si, 0xe4a             
  5044  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  5049  9a54234702     lcall   0x247, 0x2354            ; RT#19  
  5054  e61d           out     0x1d, al              
  5056  e97600         jmp     0x1439                
  5059  bf240e         mov     di, 0xe24             
  5062  be200a         mov     si, 0xa20             
  5065  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  5070  bb0000         mov     bx, 0                 
  5073  7501           jne     0x13d4                
  5075  4b             dec     bx                    
  5076  bf860e         mov     di, 0xe86             
  5079  be040a         mov     si, 0xa04             
  5082  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  5087  ba0000         mov     dx, 0                 
  5090  7401           je      0x13e5                
  5092  4a             dec     dx                    
  5093  23d3           and     dx, bx                
  5095  23d2           and     dx, dx                
  5097  7503           jne     0x13ee                
  5099  e91500         jmp     0x1403                
  5102  bfc009         mov     di, 0x9c0             
  5105  beea0e         mov     si, 0xeea             
  5108  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  5113  9a54234702     lcall   0x247, 0x2354            ; RT#19  
  5118  e61d           out     0x1d, al              
  5120  e93600         jmp     0x1439                
  5123  bf380a         mov     di, 0xa38             
  5126  bea409         mov     si, 0x9a4             
  5129  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  5134  be700a         mov     si, 0xa70             
  5137  9adf0e4702     lcall   0x247, 0xedf             ; RT#7   FAC.LOAD.SGL
  5142  e90b00         jmp     0x1424                
  5145  bf700a         mov     di, 0xa70             
  5148  bef009         mov     si, 0x9f0             
  5151  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  5156  bff009         mov     di, 0x9f0             
  5159  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  5164  bf380a         mov     di, 0xa38             
  5167  bef009         mov     si, 0x9f0             
  5170  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  5175  76e0           jbe     0x1419                
  5177  bf3c0a         mov     di, 0xa3c             
  5180  be000a         mov     si, 0xa00             
  5183  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  5188  bf400a         mov     di, 0xa40             
  5191  be040a         mov     si, 0xa04             
  5194  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  5199  bfe60e         mov     di, 0xee6             
  5202  be200a         mov     si, 0xa20             
  5205  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  5210  7403           je      0x145f                
  5212  e91300         jmp     0x1472                
  5215  bf0e0d         mov     di, 0xd0e             
  5218  be040a         mov     si, 0xa04             
  5221  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  5226  bf400a         mov     di, 0xa40             
  5229  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  5234  bfe20e         mov     di, 0xee2             
  5237  be200a         mov     si, 0xa20             
  5240  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  5245  bb0000         mov     bx, 0                 
  5248  7501           jne     0x1483                
  5250  4b             dec     bx                    
  5251  bfc20d         mov     di, 0xdc2             
  5254  be000a         mov     si, 0xa00             
  5257  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  5262  9a54104702     lcall   0x247, 0x1054            ; RT#63  
  5267  ba0000         mov     dx, 0                 
  5270  7201           jb      0x1499                
  5272  4a             dec     dx                    
  5273  23d3           and     dx, bx                
  5275  23d2           and     dx, dx                
  5277  7503           jne     0x14a2                
  5279  e91300         jmp     0x14b5                
  5282  bfc20d         mov     di, 0xdc2             
  5285  be000a         mov     si, 0xa00             
  5288  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  5293  bf3c0a         mov     di, 0xa3c             
  5296  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  5301  bf820e         mov     di, 0xe82             
  5304  be200a         mov     si, 0xa20             
  5307  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  5312  bb0000         mov     bx, 0                 
  5315  7501           jne     0x14c6                
  5317  4b             dec     bx                    
  5318  bfbe0d         mov     di, 0xdbe             
  5321  be000a         mov     si, 0xa00             
  5324  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  5329  bfee0e         mov     di, 0xeee             
  5332  9a17234702     lcall   0x247, 0x2317            ; RT#96  
  5337  ba0000         mov     dx, 0                 
  5340  7301           jae     0x14df                
  5342  4a             dec     dx                    
  5343  23d3           and     dx, bx                
  5345  23d2           and     dx, dx                
  5347  7503           jne     0x14e8                
  5349  e91300         jmp     0x14fb                
  5352  bfbe0d         mov     di, 0xdbe             
  5355  be000a         mov     si, 0xa00             
  5358  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  5363  bf3c0a         mov     di, 0xa3c             
  5366  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  5371  bf240e         mov     di, 0xe24             
  5374  be200a         mov     si, 0xa20             
  5377  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  5382  bb0000         mov     bx, 0                 
  5385  7501           jne     0x150c                
  5387  4b             dec     bx                    
  5388  bf860e         mov     di, 0xe86             
  5391  be040a         mov     si, 0xa04             
  5394  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  5399  ba0000         mov     dx, 0                 
  5402  7401           je      0x151d                
  5404  4a             dec     dx                    
  5405  23d3           and     dx, bx                
  5407  23d2           and     dx, dx                
  5409  7503           jne     0x1526                
  5411  e91300         jmp     0x1539                
  5414  bf700a         mov     di, 0xa70             
  5417  be040a         mov     si, 0xa04             
  5420  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  5425  bf400a         mov     di, 0xa40             
  5428  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  5433  be400a         mov     si, 0xa40             
  5436  9a5a104702     lcall   0x247, 0x105a            ; RT#31  
  5441  23db           and     bx, bx                
  5443  7403           je      0x1548                
  5445  e9c200         jmp     0x160a                
  5448  be000a         mov     si, 0xa00             
  5451  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  5456  ba2300         mov     dx, 0x23              
  5459  9a822b4702     lcall   0x247, 0x2b82            ; RT#38  
  5464  bb3609         mov     bx, 0x936             
  5467  33d2           xor     dx, dx                
  5469  9a8b2b4702     lcall   0x247, 0x2b8b            ; RT#39  GFX.STEP
  5474  be000a         mov     si, 0xa00             
  5477  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  5482  ba1700         mov     dx, 0x17              
  5485  9a182b4702     lcall   0x247, 0x2b18            ; RT#65  
  5490  bfb20e         mov     di, 0xeb2             
  5493  be000a         mov     si, 0xa00             
  5496  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  5501  9a1c304702     lcall   0x247, 0x301c            ; RT#12  
  5506  ba2100         mov     dx, 0x21              
  5509  9a1e2b4702     lcall   0x247, 0x2b1e            ; RT#66  
  5514  bb3609         mov     bx, 0x936             
  5517  ba3000         mov     dx, 0x30              
  5520  9a242b4702     lcall   0x247, 0x2b24            ; RT#67  
  5525  bf7e0e         mov     di, 0xe7e             
  5528  be440a         mov     si, 0xa44             
  5531  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  5536  9a1c304702     lcall   0x247, 0x301c            ; RT#12  
  5541  ba1700         mov     dx, 0x17              
  5544  b9ffff         mov     cx, 0xffff            
  5547  9ad92a4702     lcall   0x247, 0x2ad9            ; RT#25  GFX.ATTR
  5552  bb7209         mov     bx, 0x972             
  5555  9a7a334702     lcall   0x247, 0x337a            ; RT#20  OPEN
  5560  be720e         mov     si, 0xe72             
  5563  9adf0e4702     lcall   0x247, 0xedf             ; RT#7   FAC.LOAD.SGL
  5568  e92f00         jmp     0x15f2                
  5571  be6a09         mov     si, 0x96a             
  5574  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  5579  8bfb           mov     di, bx                
  5581  d1e7           shl     di, 1                 
  5583  83bd360900     cmp     word ptr [di + 0x936], 0
  5588  7503           jne     0x15d9                
  5590  e90e00         jmp     0x15e7                
  5593  bf0c0a         mov     di, 0xa0c             
  5596  beae0e         mov     si, 0xeae             
  5599  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  5604  e97701         jmp     0x175e                
  5607  bf700a         mov     di, 0xa70             
  5610  be6a09         mov     si, 0x96a             
  5613  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  5618  bf6a09         mov     di, 0x96a             
  5621  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  5626  bfae0e         mov     di, 0xeae             
  5629  be6a09         mov     si, 0x96a             
  5632  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  5637  76bc           jbe     0x15c3                
  5639  e91b07         jmp     0x1d25                
  5642  bf7e0e         mov     di, 0xe7e             
  5645  be040a         mov     si, 0xa04             
  5648  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  5653  7703           ja      0x161a                
  5655  e92400         jmp     0x163e                
  5658  be0c0a         mov     si, 0xa0c             
  5661  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  5666  8bd3           mov     dx, bx                
  5668  be000a         mov     si, 0xa00             
  5671  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  5676  9a822b4702     lcall   0x247, 0x2b82            ; RT#38  
  5681  bb3609         mov     bx, 0x936             
  5684  33d2           xor     dx, dx                
  5686  9a8b2b4702     lcall   0x247, 0x2b8b            ; RT#39  GFX.STEP
  5691  e9a900         jmp     0x16e7                
  5694  be040a         mov     si, 0xa04             
  5697  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  5702  8bf3           mov     si, bx                
  5704  d1e6           shl     si, 1                 
  5706  d1e6           shl     si, 1                 
  5708  81c6b208       add     si, 0x8b2             
  5712  bfe60e         mov     di, 0xee6             
  5715  8bde           mov     bx, si                
  5717  be200a         mov     si, 0xa20             
  5720  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  5725  ba0000         mov     dx, 0                 
  5728  7401           je      0x1663                
  5730  4a             dec     dx                    
  5731  bf240e         mov     di, 0xe24             
  5734  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  5739  b90000         mov     cx, 0                 
  5742  7401           je      0x1671                
  5744  49             dec     cx                    
  5745  23ca           and     cx, dx                
  5747  8bd3           mov     dx, bx                
  5749  8bd9           mov     bx, cx                
  5751  9a892f4702     lcall   0x247, 0x2f89            ; RT#9   BH.FLAGS
  5756  8bf2           mov     si, dx                
  5758  9a5f014702     lcall   0x247, 0x15f             ; RT#97  
  5763  be3c0a         mov     si, 0xa3c             
  5766  9a12004702     lcall   0x247, 0x12              ; RT#30  
  5771  8bfe           mov     di, si                
  5773  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  5778  be3c0a         mov     si, 0xa3c             
  5781  9a42104702     lcall   0x247, 0x1042            ; RT#16  
  5786  bb0000         mov     bx, 0                 
  5789  7301           jae     0x16a0                
  5791  4b             dec     bx                    
  5792  bff20e         mov     di, 0xef2             
  5795  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  5800  ba0000         mov     dx, 0                 
  5803  7601           jbe     0x16ae                
  5805  4a             dec     dx                    
  5806  0bd3           or      dx, bx                
  5808  23d2           and     dx, dx                
  5810  7403           je      0x16b7                
  5812  e9a700         jmp     0x175e                
  5815  be200a         mov     si, 0xa20             
  5818  9a5a104702     lcall   0x247, 0x105a            ; RT#31  
  5823  23db           and     bx, bx                
  5825  7503           jne     0x16c6                
  5827  e92100         jmp     0x16e7                
  5830  be0c0a         mov     si, 0xa0c             
  5833  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  5838  8bd3           mov     dx, bx                
  5840  be000a         mov     si, 0xa00             
  5843  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  5848  9a822b4702     lcall   0x247, 0x2b82            ; RT#38  
  5853  bb3609         mov     bx, 0x936             
  5856  33d2           xor     dx, dx                
  5858  9a8b2b4702     lcall   0x247, 0x2b8b            ; RT#39  GFX.STEP
  5863  be8209         mov     si, 0x982             
  5866  9a85304702     lcall   0x247, 0x3085            ; RT#43  
  5871  9a6c144702     lcall   0x247, 0x146c            ; RT#27  
  5876  b88a09         mov     ax, 0x98a             
  5879  50             push    ax                    
  5880  9af7284702     lcall   0x247, 0x28f7            ; RT#98  
  5885  1e             push    ds                    
  5886  07             pop     es                    
  5887  fc             cld                           
  5888  bf000a         mov     di, 0xa00             
  5891  be3c0a         mov     si, 0xa3c             
  5894  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  5899  bf040a         mov     di, 0xa04             
  5902  be400a         mov     si, 0xa40             
  5905  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  5910  bf0e0d         mov     di, 0xd0e             
  5913  be080a         mov     si, 0xa08             
  5916  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  5921  8bfe           mov     di, si                
  5923  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  5928  be080a         mov     si, 0xa08             
  5931  9a5a104702     lcall   0x247, 0x105a            ; RT#31  
  5936  23db           and     bx, bx                
  5938  7503           jne     0x1737                
  5940  e92700         jmp     0x175e                
  5943  bf7e0e         mov     di, 0xe7e             
  5946  be040a         mov     si, 0xa04             
  5949  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  5954  bb0000         mov     bx, 0                 
  5957  7601           jbe     0x1748                
  5959  4b             dec     bx                    
  5960  8bd3           mov     dx, bx                
  5962  be200a         mov     si, 0xa20             
  5965  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  5970  0bda           or      bx, dx                
  5972  23db           and     bx, bx                
  5974  7403           je      0x175b                
  5976  e952f7         jmp     0xead                 
  5979  e9ddf7         jmp     0xf3b                 
  5982  bf480a         mov     di, 0xa48             
  5985  beea0e         mov     si, 0xeea             
  5988  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  5993  bef60e         mov     si, 0xef6             
  5996  9adf0e4702     lcall   0x247, 0xedf             ; RT#7   FAC.LOAD.SGL
  6001  e96600         jmp     0x17da                
  6004  be0c0a         mov     si, 0xa0c             
  6007  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  6012  bf7e0e         mov     di, 0xe7e             
  6015  be000a         mov     si, 0xa00             
  6018  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  6023  8bd3           mov     dx, bx                
  6025  9a1c304702     lcall   0x247, 0x301c            ; RT#12  
  6030  b9ffff         mov     cx, 0xffff            
  6033  9ad92a4702     lcall   0x247, 0x2ad9            ; RT#25  GFX.ATTR
  6038  bb7209         mov     bx, 0x972             
  6041  9a7a334702     lcall   0x247, 0x337a            ; RT#20  OPEN
  6046  be0c0a         mov     si, 0xa0c             
  6049  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  6054  8bd3           mov     dx, bx                
  6056  be000a         mov     si, 0xa00             
  6059  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  6064  9a822b4702     lcall   0x247, 0x2b82            ; RT#38  
  6069  bb3609         mov     bx, 0x936             
  6072  33d2           xor     dx, dx                
  6074  9a8b2b4702     lcall   0x247, 0x2b8b            ; RT#39  GFX.STEP
  6079  be6a09         mov     si, 0x96a             
  6082  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  6087  ba700a         mov     dx, 0xa70             
  6090  9a93084702     lcall   0x247, 0x893             ; RT#26  SPKR.STRHELPER
  6095  bf480a         mov     di, 0xa48             
  6098  be6a09         mov     si, 0x96a             
  6101  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  6106  bf6a09         mov     di, 0x96a             
  6109  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  6114  be480a         mov     si, 0xa48             
  6117  9a42104702     lcall   0x247, 0x1042            ; RT#16  
  6122  7203           jb      0x17ef                
  6124  e91300         jmp     0x1802                
  6127  bfbe0e         mov     di, 0xebe             
  6130  be6a09         mov     si, 0x96a             
  6133  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  6138  7203           jb      0x17ff                
  6140  e975ff         jmp     0x1774                
  6143  e91000         jmp     0x1812                
  6146  bfbe0e         mov     di, 0xebe             
  6149  be6a09         mov     si, 0x96a             
  6152  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  6157  7703           ja      0x1812                
  6159  e962ff         jmp     0x1774                
  6162  bf0e0d         mov     di, 0xd0e             
  6165  beac09         mov     si, 0x9ac             
  6168  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  6173  8bfe           mov     di, si                
  6175  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  6180  beac09         mov     si, 0x9ac             
  6183  9a5a104702     lcall   0x247, 0x105a            ; RT#31  
  6188  23db           and     bx, bx                
  6190  7503           jne     0x1833                
  6192  e94900         jmp     0x187c                
  6195  bf460e         mov     di, 0xe46             
  6198  beac09         mov     si, 0x9ac             
  6201  9a62014702     lcall   0x247, 0x162             ; RT#24  
  6206  bfea0e         mov     di, 0xeea             
  6209  9a1f004702     lcall   0x247, 0x1f              ; RT#11  FAC.LOAD.ALT
  6214  9a1c304702     lcall   0x247, 0x301c            ; RT#12  
  6219  8bd3           mov     dx, bx                
  6221  bb1d01         mov     bx, 0x11d             
  6224  9a4b2a4702     lcall   0x247, 0x2a4b            ; RT#18  
  6229  bf460e         mov     di, 0xe46             
  6232  beac09         mov     si, 0x9ac             
  6235  9a62014702     lcall   0x247, 0x162             ; RT#24  
  6240  bffa0e         mov     di, 0xefa             
  6243  9a1f004702     lcall   0x247, 0x1f              ; RT#11  FAC.LOAD.ALT
  6248  9a1c304702     lcall   0x247, 0x301c            ; RT#12  
  6253  8bd3           mov     dx, bx                
  6255  bb2a01         mov     bx, 0x12a             
  6258  33c9           xor     cx, cx                
  6260  9a932a4702     lcall   0x247, 0x2a93            ; RT#23  GFX.LINE
  6265  e9a8f5         jmp     0xe24                 
  6268  be700a         mov     si, 0xa70             
  6271  9adf0e4702     lcall   0x247, 0xedf             ; RT#7   FAC.LOAD.SGL
  6276  e90b00         jmp     0x1892                
  6279  bf700a         mov     di, 0xa70             
  6282  be6a09         mov     si, 0x96a             
  6285  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  6290  bf6a09         mov     di, 0x96a             
  6293  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  6298  bf200e         mov     di, 0xe20             
  6301  be6a09         mov     si, 0x96a             
  6304  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  6309  76e0           jbe     0x1887                
  6311  9ae7094702     lcall   0x247, 0x9e7             ; RT#17  
  6316  be700a         mov     si, 0xa70             
  6319  9adf0e4702     lcall   0x247, 0xedf             ; RT#7   FAC.LOAD.SGL
  6324  e92100         jmp     0x18d8                
  6327  bb6400         mov     bx, 0x64              
  6330  ba800a         mov     dx, 0xa80             
  6333  9a93084702     lcall   0x247, 0x893             ; RT#26  SPKR.STRHELPER
  6338  bb2c01         mov     bx, 0x12c             
  6341  ba800a         mov     dx, 0xa80             
  6344  9a93084702     lcall   0x247, 0x893             ; RT#26  SPKR.STRHELPER
  6349  bf700a         mov     di, 0xa70             
  6352  be6a09         mov     si, 0x96a             
  6355  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  6360  bf6a09         mov     di, 0x96a             
  6363  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  6368  bf280e         mov     di, 0xe28             
  6371  be6a09         mov     si, 0x96a             
  6374  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  6379  76ca           jbe     0x18b7                
  6381  9a60364702     lcall   0x247, 0x3660            ; RT#6   STMT.RESET
  6386  bb740a         mov     bx, 0xa74             
  6389  9a2c354702     lcall   0x247, 0x352c            ; RT#8   PRINT
  6394  9a60364702     lcall   0x247, 0x3660            ; RT#6   STMT.RESET
  6399  bb740a         mov     bx, 0xa74             
  6402  9a2c354702     lcall   0x247, 0x352c            ; RT#8   PRINT
  6407  9a60364702     lcall   0x247, 0x3660            ; RT#6   STMT.RESET
  6412  bb0c00         mov     bx, 0xc               
  6415  9af9294702     lcall   0x247, 0x29f9            ; RT#99  
  6420  bbfe0e         mov     bx, 0xefe                ; = ' G A M E   O V E R'
  6423  9a2c354702     lcall   0x247, 0x352c            ; RT#8   PRINT  <<< bx=' G A M E   O V E R'
  6428  9a60364702     lcall   0x247, 0x3660            ; RT#6   STMT.RESET
  6433  bb740a         mov     bx, 0xa74             
  6436  9a2c354702     lcall   0x247, 0x352c            ; RT#8   PRINT
  6441  9a60364702     lcall   0x247, 0x3660            ; RT#6   STMT.RESET
  6446  bb740a         mov     bx, 0xa74             
  6449  9a2c354702     lcall   0x247, 0x352c            ; RT#8   PRINT
  6454  bee608         mov     si, 0x8e6             
  6457  9a42104702     lcall   0x247, 0x1042            ; RT#16  
  6462  bb0000         mov     bx, 0                 
  6465  7501           jne     0x1944                
  6467  4b             dec     bx                    
  6468  bea809         mov     si, 0x9a8             
  6471  9a42104702     lcall   0x247, 0x1042            ; RT#16  
  6476  ba0000         mov     dx, 0                 
  6479  7501           jne     0x1952                
  6481  4a             dec     dx                    
  6482  23d3           and     dx, bx                
  6484  23d2           and     dx, dx                
  6486  7403           je      0x195b                
  6488  e95802         jmp     0x1bb3                
  6491  bfa809         mov     di, 0x9a8             
  6494  be0a09         mov     si, 0x90a             
  6497  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  6502  7203           jb      0x196b                
  6504  e9ca01         jmp     0x1b35                
  6507  9a60364702     lcall   0x247, 0x3660            ; RT#6   STMT.RESET
  6512  bb140f         mov     bx, 0xf14                ; = 'YOUR SCORE IS IN THE TOP TEN'
  6515  9a2c354702     lcall   0x247, 0x352c            ; RT#8   PRINT  <<< bx='YOUR SCORE IS IN THE TOP TEN'
  6520  9a60364702     lcall   0x247, 0x3660            ; RT#6   STMT.RESET
  6525  bb740a         mov     bx, 0xa74             
  6528  9a2c354702     lcall   0x247, 0x352c            ; RT#8   PRINT
  6533  33db           xor     bx, bx                
  6535  9a6c144702     lcall   0x247, 0x146c            ; RT#27  
  6540  bb1c04         mov     bx, 0x41c             
  6543  8e1e9800       mov     ds, word ptr [0x98]   
  6547  8a1f           mov     bl, byte ptr [bx]     
  6549  30ff           xor     bh, bh                
  6551  06             push    es                    
  6552  1f             pop     ds                    
  6553  93             xchg    bx, ax                
  6554  bb1a04         mov     bx, 0x41a             
  6557  8e1e9800       mov     ds, word ptr [0x98]   
  6561  8807           mov     byte ptr [bx], al     
  6563  06             push    es                    
  6564  1f             pop     ds                    
  6565  bb340f         mov     bx, 0xf34                ; = 'ENTER YOUR NAME PLEASE: '
  6568  9aa72c4702     lcall   0x247, 0x2ca7            ; RT#37  INLINE.PARAM  <<< bx='ENTER YOUR NAME PLEASE: '
  6573  02bb3209       add     bh, byte ptr [bp + di + 0x932]
  6577  9a03294702     lcall   0x247, 0x2903            ; RT#56  
  6582  bf0a09         mov     di, 0x90a             
  6585  bea809         mov     si, 0x9a8             
  6588  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  6593  bec40c         mov     si, 0xcc4             
  6596  9adf0e4702     lcall   0x247, 0xedf             ; RT#7   FAC.LOAD.SGL
  6601  e93701         jmp     0x1b03                
  6604  bf4c0a         mov     di, 0xa4c             
  6607  be6a09         mov     si, 0x96a             
  6610  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  6615  bf700a         mov     di, 0xa70             
  6618  be6a09         mov     si, 0x96a             
  6621  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  6626  e94800         jmp     0x1a2d                
  6629  beb809         mov     si, 0x9b8             
  6632  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  6637  8bf3           mov     si, bx                
  6639  d1e6           shl     si, 1                 
  6641  d1e6           shl     si, 1                 
  6643  81c6e608       add     si, 0x8e6             
  6647  8bd6           mov     dx, si                
  6649  be4c0a         mov     si, 0xa4c             
  6652  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  6657  8bfb           mov     di, bx                
  6659  d1e7           shl     di, 1                 
  6661  d1e7           shl     di, 1                 
  6663  81c7e608       add     di, 0x8e6             
  6667  8bf2           mov     si, dx                
  6669  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  6674  7703           ja      0x1a17                
  6676  e90b00         jmp     0x1a22                
  6679  bf4c0a         mov     di, 0xa4c             
  6682  beb809         mov     si, 0x9b8             
  6685  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  6690  bf700a         mov     di, 0xa70             
  6693  beb809         mov     si, 0x9b8             
  6696  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  6701  bfb809         mov     di, 0x9b8             
  6704  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  6709  bf500f         mov     di, 0xf50             
  6712  beb809         mov     si, 0x9b8             
  6715  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  6720  76a3           jbe     0x19e5                
  6722  be6a09         mov     si, 0x96a             
  6725  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  6730  8bf3           mov     si, bx                
  6732  d1e6           shl     si, 1                 
  6734  d1e6           shl     si, 1                 
  6736  81c6e608       add     si, 0x8e6             
  6740  bf500a         mov     di, 0xa50             
  6743  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  6748  be6a09         mov     si, 0x96a             
  6751  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  6756  d1e3           shl     bx, 1                 
  6758  d1e3           shl     bx, 1                 
  6760  81c30e09       add     bx, 0x90e             
  6764  ba540a         mov     dx, 0xa54             
  6767  9a2a0e4702     lcall   0x247, 0xe2a             ; RT#10  DRAW
  6772  be6a09         mov     si, 0x96a             
  6775  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  6780  8bfb           mov     di, bx                
  6782  d1e7           shl     di, 1                 
  6784  d1e7           shl     di, 1                 
  6786  81c7e608       add     di, 0x8e6             
  6790  be4c0a         mov     si, 0xa4c             
  6793  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  6798  8bf3           mov     si, bx                
  6800  d1e6           shl     si, 1                 
  6802  d1e6           shl     si, 1                 
  6804  81c6e608       add     si, 0x8e6             
  6808  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  6813  be6a09         mov     si, 0x96a             
  6816  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  6821  d1e3           shl     bx, 1                 
  6823  d1e3           shl     bx, 1                 
  6825  81c30e09       add     bx, 0x90e             
  6829  8bd3           mov     dx, bx                
  6831  be4c0a         mov     si, 0xa4c             
  6834  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  6839  d1e3           shl     bx, 1                 
  6841  d1e3           shl     bx, 1                 
  6843  81c30e09       add     bx, 0x90e             
  6847  9a2a0e4702     lcall   0x247, 0xe2a             ; RT#10  DRAW
  6852  be4c0a         mov     si, 0xa4c             
  6855  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  6860  8bfb           mov     di, bx                
  6862  d1e7           shl     di, 1                 
  6864  d1e7           shl     di, 1                 
  6866  81c7e608       add     di, 0x8e6             
  6870  be500a         mov     si, 0xa50             
  6873  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  6878  be4c0a         mov     si, 0xa4c             
  6881  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  6886  d1e3           shl     bx, 1                 
  6888  d1e3           shl     bx, 1                 
  6890  81c30e09       add     bx, 0x90e             
  6894  8bd3           mov     dx, bx                
  6896  bb540a         mov     bx, 0xa54             
  6899  9a2a0e4702     lcall   0x247, 0xe2a             ; RT#10  DRAW
  6904  bf700a         mov     di, 0xa70             
  6907  be6a09         mov     si, 0x96a             
  6910  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  6915  bf6a09         mov     di, 0x96a             
  6918  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  6923  bfb60d         mov     di, 0xdb6             
  6926  be6a09         mov     si, 0x96a             
  6929  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  6934  7703           ja      0x1b1b                
  6936  e9b1fe         jmp     0x19cc                
  6939  9a60364702     lcall   0x247, 0x3660            ; RT#6   STMT.RESET
  6944  bb740a         mov     bx, 0xa74             
  6947  9a2c354702     lcall   0x247, 0x352c            ; RT#8   PRINT
  6952  9a60364702     lcall   0x247, 0x3660            ; RT#6   STMT.RESET
  6957  bb740a         mov     bx, 0xa74             
  6960  9a2c354702     lcall   0x247, 0x352c            ; RT#8   PRINT
  6965  bec40c         mov     si, 0xcc4             
  6968  9adf0e4702     lcall   0x247, 0xedf             ; RT#7   FAC.LOAD.SGL
  6973  e95e00         jmp     0x1b9e                
  6976  be6a09         mov     si, 0x96a             
  6979  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  6984  8bf3           mov     si, bx                
  6986  d1e6           shl     si, 1                 
  6988  d1e6           shl     si, 1                 
  6990  81c6e608       add     si, 0x8e6             
  6994  9a42104702     lcall   0x247, 0x1042            ; RT#16  
  6999  7503           jne     0x1b5c                
  7001  e95700         jmp     0x1bb3                
  7004  bb540f         mov     bx, 0xf54                ; = '######   '
  7007  9a2a364702     lcall   0x247, 0x362a            ; RT#48    <<< bx='######   '
  7012  be6a09         mov     si, 0x96a             
  7015  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  7020  d1e3           shl     bx, 1                 
  7022  d1e3           shl     bx, 1                 
  7024  81c3e608       add     bx, 0x8e6             
  7028  9a09354702     lcall   0x247, 0x3509            ; RT#29  
  7033  9a60364702     lcall   0x247, 0x3660            ; RT#6   STMT.RESET
  7038  be6a09         mov     si, 0x96a             
  7041  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  7046  d1e3           shl     bx, 1                 
  7048  d1e3           shl     bx, 1                 
  7050  81c30e09       add     bx, 0x90e             
  7054  9a2c354702     lcall   0x247, 0x352c            ; RT#8   PRINT
  7059  bf700a         mov     di, 0xa70             
  7062  be6a09         mov     si, 0x96a             
  7065  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  7070  bf6a09         mov     di, 0x96a             
  7073  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  7078  bf500f         mov     di, 0xf50             
  7081  be6a09         mov     si, 0x96a             
  7084  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  7089  768d           jbe     0x1b40                
  7091  9a60364702     lcall   0x247, 0x3660            ; RT#6   STMT.RESET
  7096  bb740a         mov     bx, 0xa74             
  7099  9a2c354702     lcall   0x247, 0x352c            ; RT#8   PRINT
  7104  9a60364702     lcall   0x247, 0x3660            ; RT#6   STMT.RESET
  7109  bb740a         mov     bx, 0xa74             
  7112  9a2c354702     lcall   0x247, 0x352c            ; RT#8   PRINT
  7117  9a60364702     lcall   0x247, 0x3660            ; RT#6   STMT.RESET
  7122  bb620f         mov     bx, 0xf62                ; = 'WOULD YOU LIKE TO PLAY AGAIN (y/n)? '
  7125  9a18354702     lcall   0x247, 0x3518            ; RT#28  PRINT.AT  <<< bx='WOULD YOU LIKE TO PLAY AGAIN (y/n)? '
  7130  bf580a         mov     di, 0xa58             
  7133  bec40c         mov     si, 0xcc4             
  7136  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  7141  9af7234702     lcall   0x247, 0x23f7            ; RT#68  
  7146  ba6e09         mov     dx, 0x96e             
  7149  9a2a0e4702     lcall   0x247, 0xe2a             ; RT#10  DRAW
  7154  bb740a         mov     bx, 0xa74             
  7157  b86e09         mov     ax, 0x96e             
  7160  9a9a0e4702     lcall   0x247, 0xe9a             ; RT#13  
  7165  7403           je      0x1c02                
  7167  e90300         jmp     0x1c05                
  7170  e9e0ff         jmp     0x1be5                
  7173  bb6e09         mov     bx, 0x96e             
  7176  baa608         mov     dx, 0x8a6             
  7179  9a2a0e4702     lcall   0x247, 0xe2a             ; RT#10  DRAW
  7184  895efe         mov     word ptr [bp - 2], bx 
  7187  e864e4         call    0x7a                  
  7190  93             xchg    bx, ax                
  7191  8b56fe         mov     dx, word ptr [bp - 2] 
  7194  9a2a0e4702     lcall   0x247, 0xe2a             ; RT#10  DRAW
  7199  bb8a0f         mov     bx, 0xf8a             
  7202  b86e09         mov     ax, 0x96e             
  7205  9a9a0e4702     lcall   0x247, 0xe9a             ; RT#13  
  7210  ba0000         mov     dx, 0                 
  7213  7401           je      0x1c30                
  7215  4a             dec     dx                    
  7216  bb900f         mov     bx, 0xf90             
  7219  9a9a0e4702     lcall   0x247, 0xe9a             ; RT#13  
  7224  b90000         mov     cx, 0                 
  7227  7401           je      0x1c3e                
  7229  49             dec     cx                    
  7230  23ca           and     cx, dx                
  7232  bb960f         mov     bx, 0xf96             
  7235  9a9a0e4702     lcall   0x247, 0xe9a             ; RT#13  
  7240  ba0000         mov     dx, 0                 
  7243  7401           je      0x1c4e                
  7245  4a             dec     dx                    
  7246  23d1           and     dx, cx                
  7248  bb9c0f         mov     bx, 0xf9c             
  7251  9a9a0e4702     lcall   0x247, 0xe9a             ; RT#13  
  7256  b90000         mov     cx, 0                 
  7259  7401           je      0x1c5e                
  7261  49             dec     cx                    
  7262  23ca           and     cx, dx                
  7264  23c9           and     cx, cx                
  7266  7581           jne     0x1be5                
  7268  bb8a0f         mov     bx, 0xf8a             
  7271  b86e09         mov     ax, 0x96e             
  7274  9a9a0e4702     lcall   0x247, 0xe9a             ; RT#13  
  7279  ba0000         mov     dx, 0                 
  7282  7501           jne     0x1c75                
  7284  4a             dec     dx                    
  7285  bb900f         mov     bx, 0xf90             
  7288  9a9a0e4702     lcall   0x247, 0xe9a             ; RT#13  
  7293  b90000         mov     cx, 0                 
  7296  7501           jne     0x1c83                
  7298  49             dec     cx                    
  7299  0bca           or      cx, dx                
  7301  23c9           and     cx, cx                
  7303  7503           jne     0x1c8c                
  7305  e90300         jmp     0x1c8f                
  7308  e98ce9         jmp     0x61b                 
  7311  bb111d         mov     bx, 0x1d11            
  7314  9a391c4702     lcall   0x247, 0x1c39            ; RT#100 
  7319  bb0100         mov     bx, 1                 
  7322  9a171e4702     lcall   0x247, 0x1e17            ; RT#45  
  7327  bb0100         mov     bx, 1                 
  7330  bac60d         mov     dx, 0xdc6                ; = 'hopper.SCO'
  7333  33c9           xor     cx, cx                
  7335  9a261e4702     lcall   0x247, 0x1e26            ; RT#46    <<< dx='hopper.SCO'
  7340  bec40c         mov     si, 0xcc4             
  7343  9adf0e4702     lcall   0x247, 0xedf             ; RT#7   FAC.LOAD.SGL
  7348  e94500         jmp     0x1cfc                
  7351  bb0100         mov     bx, 1                 
  7354  9a78364702     lcall   0x247, 0x3678            ; RT#70  
  7359  be6a09         mov     si, 0x96a             
  7362  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  7367  d1e3           shl     bx, 1                 
  7369  d1e3           shl     bx, 1                 
  7371  81c3e608       add     bx, 0x8e6             
  7375  9a1d354702     lcall   0x247, 0x351d            ; RT#101 
  7380  bb0100         mov     bx, 1                 
  7383  9a78364702     lcall   0x247, 0x3678            ; RT#70  
  7388  be6a09         mov     si, 0x96a             
  7391  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  7396  d1e3           shl     bx, 1                 
  7398  d1e3           shl     bx, 1                 
  7400  81c30e09       add     bx, 0x90e             
  7404  9a2c354702     lcall   0x247, 0x352c            ; RT#8   PRINT
  7409  bf700a         mov     di, 0xa70             
  7412  be6a09         mov     si, 0x96a             
  7415  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  7420  bf6a09         mov     di, 0x96a             
  7423  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  7428  bf500f         mov     di, 0xf50             
  7431  be6a09         mov     si, 0x96a             
  7434  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  7439  76a6           jbe     0x1cb7                
  7441  9a3e1c4702     lcall   0x247, 0x1c3e            ; RT#102 
  7446  9aa11d4702     lcall   0x247, 0x1da1            ; RT#47  
  7451  9ae7094702     lcall   0x247, 0x9e7             ; RT#17  
  7456  9a8a164702     lcall   0x247, 0x168a            ; RT#50  
  7461  bfc009         mov     di, 0x9c0             
  7464  be520e         mov     si, 0xe52             
  7467  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  7472  9a54234702     lcall   0x247, 0x2354            ; RT#19  
  7477  e61d           out     0x1d, al              
  7479  bf700a         mov     di, 0xa70             
  7482  bec409         mov     si, 0x9c4             
  7485  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  7490  8bfe           mov     di, si                
  7492  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  7497  be520e         mov     si, 0xe52             
  7500  9adf0e4702     lcall   0x247, 0xedf             ; RT#7   FAC.LOAD.SGL
  7505  e91b00         jmp     0x1d6f                
  7508  be6a09         mov     si, 0x96a             
  7511  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  7516  ba700a         mov     dx, 0xa70             
  7519  9a93084702     lcall   0x247, 0x893             ; RT#26  SPKR.STRHELPER
  7524  bf780a         mov     di, 0xa78             
  7527  be6a09         mov     si, 0x96a             
  7530  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  7535  bf6a09         mov     di, 0x96a             
  7538  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  7543  bfa20f         mov     di, 0xfa2             
  7546  be6a09         mov     si, 0x96a             
  7549  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  7554  76d0           jbe     0x1d54                
  7556  bf2c0e         mov     di, 0xe2c             
  7559  bec409         mov     si, 0x9c4             
  7562  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  7567  7403           je      0x1d94                
  7569  e990f0         jmp     0xe24                 
  7572  bfc009         mov     di, 0x9c0             
  7575  be560e         mov     si, 0xe56             
  7578  9ac80e4702     lcall   0x247, 0xec8             ; RT#4   SGL.COPY
  7583  9a54234702     lcall   0x247, 0x2354            ; RT#19  
  7588  e61d           out     0x1d, al              
  7590  bba60f         mov     bx, 0xfa6                ; = 'P2L8C.CL16CL8D.GL16FL8EL4C'
  7593  9ab82d4702     lcall   0x247, 0x2db8            ; RT#103   <<< bx='P2L8C.CL16CL8D.GL16FL8EL4C'
  7598  bf280e         mov     di, 0xe28             
  7601  beb409         mov     si, 0x9b4             
  7604  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  7609  bb0000         mov     bx, 0                 
  7612  7501           jne     0x1dbf                
  7614  4b             dec     bx                    
  7615  9a892f4702     lcall   0x247, 0x2f89            ; RT#9   BH.FLAGS
  7620  8bfe           mov     di, si                
  7622  9a1f004702     lcall   0x247, 0x1f              ; RT#11  FAC.LOAD.ALT
  7627  8bdf           mov     bx, di                
  7629  bf700a         mov     di, 0xa70             
  7632  9a1f004702     lcall   0x247, 0x1f              ; RT#11  FAC.LOAD.ALT
  7637  8bfb           mov     di, bx                
  7639  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  7644  9a54234702     lcall   0x247, 0x2354            ; RT#19  
  7649  1a1ee977       sbb     bl, byte ptr [0x77e9] 
  7653  ebbf           jmp     0x1da6                
  7655  c009be         ror     byte ptr [bx + di], 0xbe
  7658  a809           test    al, 9                 
  7660  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  7665  8bfe           mov     di, si                
  7667  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  7672  bb1800         mov     bx, 0x18              
  7675  9a620f4702     lcall   0x247, 0xf62             ; RT#15  
  7680  bb0c00         mov     bx, 0xc               
  7683  9a7c0f4702     lcall   0x247, 0xf7c             ; RT#14  
  7688  9a60364702     lcall   0x247, 0x3660            ; RT#6   STMT.RESET
  7693  bba809         mov     bx, 0x9a8             
  7696  9a09354702     lcall   0x247, 0x3509            ; RT#29  
  7701  9a7d234702     lcall   0x247, 0x237d            ; RT#71  
  7706  beae0e         mov     si, 0xeae             
  7709  9adf0e4702     lcall   0x247, 0xedf             ; RT#7   FAC.LOAD.SGL
  7714  e93500         jmp     0x1e5a                
  7717  be6a09         mov     si, 0x96a             
  7720  9ad12f4702     lcall   0x247, 0x2fd1            ; RT#5   ERRFRAME+LOAD4
  7725  ba0c00         mov     dx, 0xc               
  7728  9a4b2a4702     lcall   0x247, 0x2a4b            ; RT#18  
  7733  bf8e0e         mov     di, 0xe8e             
  7736  be6a09         mov     si, 0x96a             
  7739  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  7744  9a1c304702     lcall   0x247, 0x301c            ; RT#12  
  7749  ba2100         mov     dx, 0x21              
  7752  33c9           xor     cx, cx                
  7754  9a932a4702     lcall   0x247, 0x2a93            ; RT#23  GFX.LINE
  7759  bfc40f         mov     di, 0xfc4             
  7762  be6a09         mov     si, 0x96a             
  7765  9a2a004702     lcall   0x247, 0x2a              ; RT#3   MBF.UNPACK
  7770  bf6a09         mov     di, 0x96a             
  7773  9ac50e4702     lcall   0x247, 0xec5             ; RT#2   FAC.STORE.SGL
  7778  bfc80f         mov     di, 0xfc8             
  7781  be6a09         mov     si, 0x96a             
  7784  9a22234702     lcall   0x247, 0x2322            ; RT#1   SGL.ARITH.2OP
  7789  76b6           jbe     0x1e25                
  7791  33db           xor     bx, bx                
  7793  ba2300         mov     dx, 0x23              
  7796  9a4b2a4702     lcall   0x247, 0x2a4b            ; RT#18  
  7801  bbff00         mov     bx, 0xff              
  7804  ba5e00         mov     dx, 0x5e              
  7807  33c9           xor     cx, cx                
  7809  9a932a4702     lcall   0x247, 0x2a93            ; RT#23  GFX.LINE
  7814  33db           xor     bx, bx                
  7816  ba6a00         mov     dx, 0x6a              
  7819  9a4b2a4702     lcall   0x247, 0x2a4b            ; RT#18  
  7824  bbff00         mov     bx, 0xff              
  7827  baa600         mov     dx, 0xa6              
  7830  33c9           xor     cx, cx                
  7832  9a932a4702     lcall   0x247, 0x2a93            ; RT#23  GFX.LINE
  7837  9a7d234702     lcall   0x247, 0x237d            ; RT#71  
  7842  90             nop                           
  7843  90             nop                           
  7844  90             nop                           
  7845  90             nop                           
  7846  90             nop                           
  7847  9a81164702     lcall   0x247, 0x1681            ; RT#104 
  7852  2b00           sub     ax, word ptr [bx + si]
  7854  0a00           or      al, byte ptr [bx + si]
  7856  35000a         xor     ax, 0xa00             
  7859  003c           add     byte ptr [si], bh     
  7861  000a           add     byte ptr [bp + si], cl