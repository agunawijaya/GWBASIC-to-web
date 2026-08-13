; 3DTTT.EXE -- annotated disassembly of the compiled BASIC program
; file 57472 bytes, header 9728, 2357 relocations
; user code 26..29069 ; string base = image 18563 (seg 0488)
; RT#n = BASCOM runtime entry point, ranked by call frequency

    26  9a00000b0b     lcall   0xb0b, 0              
    31  55             push    bp                    
    32  8bec           mov     bp, sp                
    34  81ec0000       sub     sp, 0                 
    38  9a7e225c06     lcall   0x65c, 0x227e            ; RT#69  
    43  9a49235c06     lcall   0x65c, 0x2349            ; RT#70  
    48  cc             int3                          
    49  cc             int3                          
    50  cc             int3                          
    51  cc             int3                          
    52  cc             int3                          
    53  cc             int3                          
    54  cc             int3                          
    55  cc             int3                          
    56  33db           xor     bx, bx                
    58  9ae6085c06     lcall   0x65c, 0x8e6             ; RT#71  
    63  cc             int3                          
    64  33db           xor     bx, bx                
    66  9a3b0a5c06     lcall   0x65c, 0xa3b             ; RT#30  
    71  9a3b0a5c06     lcall   0x65c, 0xa3b             ; RT#30  
    76  9a550a5c06     lcall   0x65c, 0xa55             ; RT#40  
    81  cc             int3                          
    82  bb5000         mov     bx, 0x50              
    85  9a8b0e5c06     lcall   0x65c, 0xe8b             ; RT#59  
    90  cc             int3                          
    91  9ad5125c06     lcall   0x65c, 0x12d5            ; RT#60  
    96  cc             int3                          
    97  33db           xor     bx, bx                
    99  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
   104  bb0700         mov     bx, 7                 
   107  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
   112  cc             int3                          
   113  9a85075c06     lcall   0x65c, 0x785             ; RT#31  
   118  cc             int3                          
   119  bb0c00         mov     bx, 0xc               
   122  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
   127  bb2300         mov     bx, 0x23              
   130  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
   135  cc             int3                          
   136  bb0e00         mov     bx, 0xe               
   139  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
   144  bb0400         mov     bx, 4                 
   147  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
   152  cc             int3                          
   153  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
   158  bbd060         mov     bx, 0x60d0               ; = '`Please Wait'
   161  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11    <<< bx='`Please Wait'
   166  cc             int3                          
   167  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
   172  ea00cc9afe     ljmp    0xfe9a:0xcc00         
   177  1a5c06         sbb     bl, byte ptr [si + 6] 
   180  07             pop     es                    
   181  64cc           int3                          
   183  33db           xor     bx, bx                
   185  9a3b0a5c06     lcall   0x65c, 0xa3b             ; RT#30  
   190  9a3b0a5c06     lcall   0x65c, 0xa3b             ; RT#30  
   195  9a550a5c06     lcall   0x65c, 0xa55             ; RT#40  
   200  cc             int3                          
   201  33db           xor     bx, bx                
   203  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
   208  bb0700         mov     bx, 7                 
   211  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
   216  bb0300         mov     bx, 3                 
   219  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
   224  cc             int3                          
   225  9a85075c06     lcall   0x65c, 0x785             ; RT#31  
   230  cc             int3                          
   231  e94300         jmp     0x12d                 
   234  cc             int3                          
   235  cc             int3                          
   236  bfba5e         mov     di, 0x5eba            
   239  bee060         mov     si, 0x60e0            
   242  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
   247  cc             int3                          
   248  bfbe5e         mov     di, 0x5ebe            
   251  bee460         mov     si, 0x60e4            
   254  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
   259  cc             int3                          
   260  bfc25e         mov     di, 0x5ec2            
   263  bee860         mov     si, 0x60e8            
   266  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
   271  cc             int3                          
   272  bfc65e         mov     di, 0x5ec6            
   275  bee860         mov     si, 0x60e8            
   278  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
   283  cc             int3                          
   284  bfca5e         mov     di, 0x5eca            
   287  bee860         mov     si, 0x60e8            
   290  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
   295  cc             int3                          
   296  9a271b5c06     lcall   0x65c, 0x1b27            ; RT#20  
   301  cc             int3                          
   302  beec60         mov     si, 0x60ec            
   305  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
   310  e92b00         jmp     0x164                 
   313  cc             int3                          
   314  bece5e         mov     si, 0x5ece            
   317  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
   322  9a69255c06     lcall   0x65c, 0x2569            ; RT#41  
   327  cc             int3                          
   328  bece5e         mov     si, 0x5ece            
   331  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
   336  ba0164         mov     dx, 0x6401            
   339  9a2d255c06     lcall   0x65c, 0x252d            ; RT#42  
   344  cc             int3                          
   345  bfe860         mov     di, 0x60e8            
   348  bece5e         mov     si, 0x5ece            
   351  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
   356  bfce5e         mov     di, 0x5ece            
   359  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
   364  8bf7           mov     si, di                
   366  bff060         mov     di, 0x60f0            
   369  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
   374  76c1           jbe     0x139                 
   376  cc             int3                          
   377  bb0100         mov     bx, 1                 
   380  9a69255c06     lcall   0x65c, 0x2569            ; RT#41  
   385  cc             int3                          
   386  bb0100         mov     bx, 1                 
   389  ba6365         mov     dx, 0x6563            
   392  9a2d255c06     lcall   0x65c, 0x252d            ; RT#42  
   397  cc             int3                          
   398  bb0200         mov     bx, 2                 
   401  9a69255c06     lcall   0x65c, 0x2569            ; RT#41  
   406  cc             int3                          
   407  bb0200         mov     bx, 2                 
   410  ba0457         mov     dx, 0x5704            
   413  9a2d255c06     lcall   0x65c, 0x252d            ; RT#42  
   418  cc             int3                          
   419  bb0300         mov     bx, 3                 
   422  9a69255c06     lcall   0x65c, 0x2569            ; RT#41  
   427  cc             int3                          
   428  bb0300         mov     bx, 3                 
   431  baae5a         mov     dx, 0x5aae            
   434  9a2d255c06     lcall   0x65c, 0x252d            ; RT#42  
   439  cc             int3                          
   440  bb0400         mov     bx, 4                 
   443  9a69255c06     lcall   0x65c, 0x2569            ; RT#41  
   448  cc             int3                          
   449  bb0400         mov     bx, 4                 
   452  ba3400         mov     dx, 0x34              
   455  9a2d255c06     lcall   0x65c, 0x252d            ; RT#42  
   460  cc             int3                          
   461  bb0a00         mov     bx, 0xa               
   464  9a69255c06     lcall   0x65c, 0x2569            ; RT#41  
   469  cc             int3                          
   470  bb0a00         mov     bx, 0xa               
   473  ba4a60         mov     dx, 0x604a            
   476  9a2d255c06     lcall   0x65c, 0x252d            ; RT#42  
   481  cc             int3                          
   482  e91642         jmp     0x43fb                
   485  cc             int3                          
   486  e9052f         jmp     0x30ee                
   489  cc             int3                          
   490  bb1600         mov     bx, 0x16              
   493  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
   498  bb0200         mov     bx, 2                 
   501  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
   506  cc             int3                          
   507  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
   512  bb4e00         mov     bx, 0x4e              
   515  baf460         mov     dx, 0x60f4            
   518  9a471e5c06     lcall   0x65c, 0x1e47            ; RT#16  
   523  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
   528  cc             int3                          
   529  bb1600         mov     bx, 0x16              
   532  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
   537  bb0500         mov     bx, 5                 
   540  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
   545  cc             int3                          
   546  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
   551  bbfa60         mov     bx, 0x60fa               ; = '`Please make your move:'
   554  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11    <<< bx='`Please make your move:'
   559  cc             int3                          
   560  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
   565  3349cc         xor     cx, word ptr [bx + di - 0x34]
   568  bfe860         mov     di, 0x60e8            
   571  bed25e         mov     si, 0x5ed2            
   574  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
   579  7403           je      0x248                 
   581  e91000         jmp     0x258                 
   584  cc             int3                          
   585  bfd25e         mov     di, 0x5ed2            
   588  be1461         mov     si, 0x6114            
   591  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
   596  cc             int3                          
   597  e94300         jmp     0x29b                 
   600  cc             int3                          
   601  bed65e         mov     si, 0x5ed6            
   604  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
   609  93             xchg    bx, ax                
   610  bb0500         mov     bx, 5                 
   613  f7eb           imul    bx                    
   615  8bd3           mov     dx, bx                
   617  beda5e         mov     si, 0x5eda            
   620  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
   625  03c3           add     ax, bx                
   627  8bda           mov     bx, dx                
   629  f7ea           imul    dx                    
   631  96             xchg    si, ax                
   632  8bd6           mov     dx, si                
   634  bede5e         mov     si, 0x5ede            
   637  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
   642  03da           add     bx, dx                
   644  8bf3           mov     si, bx                
   646  d1e6           shl     si, 1                 
   648  d1e6           shl     si, 1                 
   650  81c6f208       add     si, 0x8f2             
   654  bfe860         mov     di, 0x60e8            
   657  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
   662  7403           je      0x29b                 
   664  e95200         jmp     0x2ed                 
   667  cc             int3                          
   668  bb1600         mov     bx, 0x16              
   671  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
   676  bb0200         mov     bx, 2                 
   679  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
   684  cc             int3                          
   685  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
   690  bb4e00         mov     bx, 0x4e              
   693  baf460         mov     dx, 0x60f4            
   696  9a471e5c06     lcall   0x65c, 0x1e47            ; RT#16  
   701  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
   706  cc             int3                          
   707  bb1600         mov     bx, 0x16              
   710  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
   715  bb0500         mov     bx, 5                 
   718  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
   723  cc             int3                          
   724  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
   729  bb1861         mov     bx, 0x6118               ; = 'aPlease remake your move:'
   732  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11    <<< bx='aPlease remake your move:'
   737  cc             int3                          
   738  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
   743  3349cc         xor     cx, word ptr [bx + di - 0x34]
   746  e94aff         jmp     0x237                 
   749  cc             int3                          
   750  bed65e         mov     si, 0x5ed6            
   753  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
   758  93             xchg    bx, ax                
   759  bb0500         mov     bx, 5                 
   762  f7eb           imul    bx                    
   764  8bd3           mov     dx, bx                
   766  beda5e         mov     si, 0x5eda            
   769  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
   774  03c3           add     ax, bx                
   776  8bda           mov     bx, dx                
   778  f7ea           imul    dx                    
   780  97             xchg    di, ax                
   781  bede5e         mov     si, 0x5ede            
   784  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
   789  03fb           add     di, bx                
   791  d1e7           shl     di, 1                 
   793  d1e7           shl     di, 1                 
   795  81c7f208       add     di, 0x8f2             
   799  bee860         mov     si, 0x60e8            
   802  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
   807  cc             int3                          
   808  bed65e         mov     si, 0x5ed6            
   811  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
   816  93             xchg    bx, ax                
   817  bb0500         mov     bx, 5                 
   820  f7eb           imul    bx                    
   822  8bd3           mov     dx, bx                
   824  beda5e         mov     si, 0x5eda            
   827  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
   832  03c3           add     ax, bx                
   834  8bda           mov     bx, dx                
   836  f7ea           imul    dx                    
   838  97             xchg    di, ax                
   839  bede5e         mov     si, 0x5ede            
   842  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
   847  03fb           add     di, bx                
   849  d1e7           shl     di, 1                 
   851  d1e7           shl     di, 1                 
   853  81c7e60a       add     di, 0xae6             
   857  bee860         mov     si, 0x60e8            
   860  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
   865  cc             int3                          
   866  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
   871  bd10cc         mov     bp, 0xcc10            
   874  cc             int3                          
   875  cc             int3                          
   876  bfe25e         mov     di, 0x5ee2            
   879  bede5e         mov     si, 0x5ede            
   882  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
   887  cc             int3                          
   888  bfe65e         mov     di, 0x5ee6            
   891  beda5e         mov     si, 0x5eda            
   894  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
   899  cc             int3                          
   900  bfea5e         mov     di, 0x5eea            
   903  bed65e         mov     si, 0x5ed6            
   906  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
   911  cc             int3                          
   912  bfee5e         mov     di, 0x5eee            
   915  bee25e         mov     si, 0x5ee2            
   918  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
   923  cc             int3                          
   924  bff25e         mov     di, 0x5ef2            
   927  bee65e         mov     si, 0x5ee6            
   930  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
   935  cc             int3                          
   936  bff65e         mov     di, 0x5ef6            
   939  beea5e         mov     si, 0x5eea            
   942  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
   947  cc             int3                          
   948  bffa5e         mov     di, 0x5efa            
   951  bee860         mov     si, 0x60e8            
   954  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
   959  cc             int3                          
   960  bffe5e         mov     di, 0x5efe            
   963  be3461         mov     si, 0x6134            
   966  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
   971  cc             int3                          
   972  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
   977  5f             pop     di                    
   978  0dccbe         or      ax, 0xbecc            
   981  ea5e9ae51b     ljmp    0x1be5:0x9a5e         
   986  5c             pop     sp                    
   987  06             push    es                    
   988  93             xchg    bx, ax                
   989  bb0500         mov     bx, 5                 
   992  f7eb           imul    bx                    
   994  8bd3           mov     dx, bx                
   996  bee65e         mov     si, 0x5ee6            
   999  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  1004  03c3           add     ax, bx                
  1006  8bda           mov     bx, dx                
  1008  f7ea           imul    dx                    
  1010  97             xchg    di, ax                
  1011  bee25e         mov     si, 0x5ee2            
  1014  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  1019  03fb           add     di, bx                
  1021  d1e7           shl     di, 1                 
  1023  d1e7           shl     di, 1                 
  1025  81c7ce0e       add     di, 0xece             
  1029  bee860         mov     si, 0x60e8            
  1032  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1037  cc             int3                          
  1038  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  1043  59             pop     cx                    
  1044  14cc           adc     al, 0xcc              
  1046  bf025f         mov     di, 0x5f02            
  1049  be065f         mov     si, 0x5f06            
  1052  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1057  cc             int3                          
  1058  bf0a5f         mov     di, 0x5f0a            
  1061  be0e5f         mov     si, 0x5f0e            
  1064  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1069  cc             int3                          
  1070  bf125f         mov     di, 0x5f12            
  1073  be165f         mov     si, 0x5f16            
  1076  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1081  cc             int3                          
  1082  be065f         mov     si, 0x5f06            
  1085  9adb0e5c06     lcall   0x65c, 0xedb             ; RT#23  
  1090  7503           jne     0x447                 
  1092  e99700         jmp     0x4de                 
  1095  cc             int3                          
  1096  bf1a5f         mov     di, 0x5f1a            
  1099  be065f         mov     si, 0x5f06            
  1102  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1107  bee860         mov     si, 0x60e8            
  1110  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
  1115  e96c00         jmp     0x4ca                 
  1118  cc             int3                          
  1119  bece5e         mov     si, 0x5ece            
  1122  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  1127  8bfb           mov     di, bx                
  1129  d1e7           shl     di, 1                 
  1131  d1e7           shl     di, 1                 
  1133  8bdf           mov     bx, di                
  1135  81c75a55       add     di, 0x555a            
  1139  81c34e52       add     bx, 0x524e            
  1143  8bf3           mov     si, bx                
  1145  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1150  cc             int3                          
  1151  bece5e         mov     si, 0x5ece            
  1154  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  1159  8bfb           mov     di, bx                
  1161  d1e7           shl     di, 1                 
  1163  d1e7           shl     di, 1                 
  1165  8bdf           mov     bx, di                
  1167  81c75e56       add     di, 0x565e            
  1171  81c35253       add     bx, 0x5352            
  1175  8bf3           mov     si, bx                
  1177  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1182  cc             int3                          
  1183  bece5e         mov     si, 0x5ece            
  1186  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  1191  8bfb           mov     di, bx                
  1193  d1e7           shl     di, 1                 
  1195  d1e7           shl     di, 1                 
  1197  8bdf           mov     bx, di                
  1199  81c76257       add     di, 0x5762            
  1203  81c35654       add     bx, 0x5456            
  1207  8bf3           mov     si, bx                
  1209  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1214  cc             int3                          
  1215  bfe860         mov     di, 0x60e8            
  1218  bece5e         mov     si, 0x5ece            
  1221  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
  1226  bfce5e         mov     di, 0x5ece            
  1229  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
  1234  8bf7           mov     si, di                
  1236  bf1a5f         mov     di, 0x5f1a            
  1239  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  1244  7680           jbe     0x45e                 
  1246  cc             int3                          
  1247  be0e5f         mov     si, 0x5f0e            
  1250  9adb0e5c06     lcall   0x65c, 0xedb             ; RT#23  
  1255  7503           jne     0x4ec                 
  1257  e99700         jmp     0x583                 
  1260  cc             int3                          
  1261  bf1e5f         mov     di, 0x5f1e            
  1264  be0e5f         mov     si, 0x5f0e            
  1267  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1272  bee860         mov     si, 0x60e8            
  1275  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
  1280  e96c00         jmp     0x56f                 
  1283  cc             int3                          
  1284  bece5e         mov     si, 0x5ece            
  1287  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  1292  8bfb           mov     di, bx                
  1294  d1e7           shl     di, 1                 
  1296  d1e7           shl     di, 1                 
  1298  8bdf           mov     bx, di                
  1300  81c76658       add     di, 0x5866            
  1304  81c3424f       add     bx, 0x4f42            
  1308  8bf3           mov     si, bx                
  1310  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1315  cc             int3                          
  1316  bece5e         mov     si, 0x5ece            
  1319  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  1324  8bfb           mov     di, bx                
  1326  d1e7           shl     di, 1                 
  1328  d1e7           shl     di, 1                 
  1330  8bdf           mov     bx, di                
  1332  81c76a59       add     di, 0x596a            
  1336  81c34650       add     bx, 0x5046            
  1340  8bf3           mov     si, bx                
  1342  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1347  cc             int3                          
  1348  bece5e         mov     si, 0x5ece            
  1351  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  1356  8bfb           mov     di, bx                
  1358  d1e7           shl     di, 1                 
  1360  d1e7           shl     di, 1                 
  1362  8bdf           mov     bx, di                
  1364  81c76e5a       add     di, 0x5a6e            
  1368  81c34a51       add     bx, 0x514a            
  1372  8bf3           mov     si, bx                
  1374  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1379  cc             int3                          
  1380  bfe860         mov     di, 0x60e8            
  1383  bece5e         mov     si, 0x5ece            
  1386  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
  1391  bfce5e         mov     di, 0x5ece            
  1394  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
  1399  8bf7           mov     si, di                
  1401  bf1e5f         mov     di, 0x5f1e            
  1404  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  1409  7680           jbe     0x503                 
  1411  cc             int3                          
  1412  cc             int3                          
  1413  be225f         mov     si, 0x5f22            
  1416  9adb0e5c06     lcall   0x65c, 0xedb             ; RT#23  
  1421  7403           je      0x592                 
  1423  e92400         jmp     0x5b6                 
  1426  cc             int3                          
  1427  bf225f         mov     di, 0x5f22            
  1430  bede5e         mov     si, 0x5ede            
  1433  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1438  cc             int3                          
  1439  bf265f         mov     di, 0x5f26            
  1442  beda5e         mov     si, 0x5eda            
  1445  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1450  cc             int3                          
  1451  bf2a5f         mov     di, 0x5f2a            
  1454  bed65e         mov     si, 0x5ed6            
  1457  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1462  cc             int3                          
  1463  bfe25e         mov     di, 0x5ee2            
  1466  be225f         mov     si, 0x5f22            
  1469  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1474  cc             int3                          
  1475  bfe65e         mov     di, 0x5ee6            
  1478  be265f         mov     si, 0x5f26            
  1481  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1486  cc             int3                          
  1487  bfea5e         mov     di, 0x5eea            
  1490  be2a5f         mov     si, 0x5f2a            
  1493  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1498  cc             int3                          
  1499  bfee5e         mov     di, 0x5eee            
  1502  bee25e         mov     si, 0x5ee2            
  1505  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1510  cc             int3                          
  1511  bff25e         mov     di, 0x5ef2            
  1514  bee65e         mov     si, 0x5ee6            
  1517  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1522  cc             int3                          
  1523  bff65e         mov     di, 0x5ef6            
  1526  beea5e         mov     si, 0x5eea            
  1529  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1534  cc             int3                          
  1535  bffa5e         mov     di, 0x5efa            
  1538  be3461         mov     si, 0x6134            
  1541  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1546  cc             int3                          
  1547  bffe5e         mov     di, 0x5efe            
  1550  be3861         mov     si, 0x6138            
  1553  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1558  cc             int3                          
  1559  bf3461         mov     di, 0x6134            
  1562  be2e5f         mov     si, 0x5f2e            
  1565  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  1570  7403           je      0x627                 
  1572  e90c00         jmp     0x633                 
  1575  cc             int3                          
  1576  bffa5e         mov     di, 0x5efa            
  1579  be1461         mov     si, 0x6114            
  1582  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1587  cc             int3                          
  1588  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  1593  5f             pop     di                    
  1594  0dccbe         or      ax, 0xbecc            
  1597  ea5e9ae51b     ljmp    0x1be5:0x9a5e         
  1602  5c             pop     sp                    
  1603  06             push    es                    
  1604  93             xchg    bx, ax                
  1605  bb0500         mov     bx, 5                 
  1608  f7eb           imul    bx                    
  1610  8bd3           mov     dx, bx                
  1612  bee65e         mov     si, 0x5ee6            
  1615  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  1620  03c3           add     ax, bx                
  1622  8bda           mov     bx, dx                
  1624  f7ea           imul    dx                    
  1626  97             xchg    di, ax                
  1627  bee25e         mov     si, 0x5ee2            
  1630  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  1635  03fb           add     di, bx                
  1637  d1e7           shl     di, 1                 
  1639  d1e7           shl     di, 1                 
  1641  81c7ce0e       add     di, 0xece             
  1645  bee860         mov     si, 0x60e8            
  1648  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1653  cc             int3                          
  1654  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  1659  59             pop     cx                    
  1660  14cc           adc     al, 0xcc              
  1662  bf3c61         mov     di, 0x613c            
  1665  be325f         mov     si, 0x5f32            
  1668  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  1673  7403           je      0x68e                 
  1675  e91000         jmp     0x69e                 
  1678  cc             int3                          
  1679  bf325f         mov     di, 0x5f32            
  1682  be4061         mov     si, 0x6140            
  1685  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1690  cc             int3                          
  1691  e94bfb         jmp     0x1e9                 
  1694  cc             int3                          
  1695  bf3461         mov     di, 0x6134            
  1698  be2e5f         mov     si, 0x5f2e            
  1701  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  1706  7403           je      0x6af                 
  1708  e90c00         jmp     0x6bb                 
  1711  cc             int3                          
  1712  bf2e5f         mov     di, 0x5f2e            
  1715  be1461         mov     si, 0x6114            
  1718  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1723  cc             int3                          
  1724  bf365f         mov     di, 0x5f36            
  1727  be065f         mov     si, 0x5f06            
  1730  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1735  cc             int3                          
  1736  bf3a5f         mov     di, 0x5f3a            
  1739  be0e5f         mov     si, 0x5f0e            
  1742  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1747  cc             int3                          
  1748  bf3e5f         mov     di, 0x5f3e            
  1751  be425f         mov     si, 0x5f42            
  1754  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1759  cc             int3                          
  1760  bf465f         mov     di, 0x5f46            
  1763  be4a5f         mov     si, 0x5f4a            
  1766  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1771  cc             int3                          
  1772  bf4e5f         mov     di, 0x5f4e            
  1775  be525f         mov     si, 0x5f52            
  1778  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1783  cc             int3                          
  1784  be065f         mov     si, 0x5f06            
  1787  9adb0e5c06     lcall   0x65c, 0xedb             ; RT#23  
  1792  7503           jne     0x705                 
  1794  e90400         jmp     0x709                 
  1797  cc             int3                          
  1798  e91908         jmp     0xf22                 
  1801  cc             int3                          
  1802  be025f         mov     si, 0x5f02            
  1805  9adb0e5c06     lcall   0x65c, 0xedb             ; RT#23  
  1810  7503           jne     0x717                 
  1812  e92d00         jmp     0x744                 
  1815  cc             int3                          
  1816  bfe860         mov     di, 0x60e8            
  1819  be025f         mov     si, 0x5f02            
  1822  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  1827  7403           je      0x728                 
  1829  e91000         jmp     0x738                 
  1832  cc             int3                          
  1833  bf325f         mov     di, 0x5f32            
  1836  bee860         mov     si, 0x60e8            
  1839  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1844  cc             int3                          
  1845  e90800         jmp     0x740                 
  1848  cc             int3                          
  1849  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  1854  e908cc         jmp     0xffffd349            
  1857  e98907         jmp     0xecd                 
  1860  cc             int3                          
  1861  be0e5f         mov     si, 0x5f0e            
  1864  9adb0e5c06     lcall   0x65c, 0xedb             ; RT#23  
  1869  7503           jne     0x752                 
  1871  e9c500         jmp     0x817                 
  1874  cc             int3                          
  1875  bf565f         mov     di, 0x5f56            
  1878  be0e5f         mov     si, 0x5f0e            
  1881  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1886  bee860         mov     si, 0x60e8            
  1889  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
  1894  e96c00         jmp     0x7d5                 
  1897  cc             int3                          
  1898  bece5e         mov     si, 0x5ece            
  1901  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  1906  8bfb           mov     di, bx                
  1908  d1e7           shl     di, 1                 
  1910  d1e7           shl     di, 1                 
  1912  8bdf           mov     bx, di                
  1914  81c7725b       add     di, 0x5b72            
  1918  81c3424f       add     bx, 0x4f42            
  1922  8bf3           mov     si, bx                
  1924  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1929  cc             int3                          
  1930  bece5e         mov     si, 0x5ece            
  1933  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  1938  8bfb           mov     di, bx                
  1940  d1e7           shl     di, 1                 
  1942  d1e7           shl     di, 1                 
  1944  8bdf           mov     bx, di                
  1946  81c7765c       add     di, 0x5c76            
  1950  81c34650       add     bx, 0x5046            
  1954  8bf3           mov     si, bx                
  1956  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1961  cc             int3                          
  1962  bece5e         mov     si, 0x5ece            
  1965  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  1970  8bfb           mov     di, bx                
  1972  d1e7           shl     di, 1                 
  1974  d1e7           shl     di, 1                 
  1976  8bdf           mov     bx, di                
  1978  81c77a5d       add     di, 0x5d7a            
  1982  81c34a51       add     bx, 0x514a            
  1986  8bf3           mov     si, bx                
  1988  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  1993  cc             int3                          
  1994  bfe860         mov     di, 0x60e8            
  1997  bece5e         mov     si, 0x5ece            
  2000  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
  2005  bfce5e         mov     di, 0x5ece            
  2008  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
  2013  8bf7           mov     si, di                
  2015  bf565f         mov     di, 0x5f56            
  2018  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  2023  7680           jbe     0x769                 
  2025  cc             int3                          
  2026  bf5a5f         mov     di, 0x5f5a            
  2029  bee860         mov     si, 0x60e8            
  2032  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2037  cc             int3                          
  2038  bf5e5f         mov     di, 0x5f5e            
  2041  be0e5f         mov     si, 0x5f0e            
  2044  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2049  cc             int3                          
  2050  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  2055  e50a           in      ax, 0xa               
  2057  cc             int3                          
  2058  be325f         mov     si, 0x5f32            
  2061  9adb0e5c06     lcall   0x65c, 0xedb             ; RT#23  
  2066  7403           je      0x817                 
  2068  e98807         jmp     0xf9f                 
  2071  cc             int3                          
  2072  be0a5f         mov     si, 0x5f0a            
  2075  9adb0e5c06     lcall   0x65c, 0xedb             ; RT#23  
  2080  7503           jne     0x825                 
  2082  e96a00         jmp     0x88f                 
  2085  cc             int3                          
  2086  bf5a5f         mov     di, 0x5f5a            
  2089  be3461         mov     si, 0x6134            
  2092  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2097  cc             int3                          
  2098  bf5e5f         mov     di, 0x5f5e            
  2101  be0a5f         mov     si, 0x5f0a            
  2104  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2109  cc             int3                          
  2110  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  2115  e50a           in      ax, 0xa               
  2117  cc             int3                          
  2118  be325f         mov     si, 0x5f32            
  2121  9adb0e5c06     lcall   0x65c, 0xedb             ; RT#23  
  2126  7403           je      0x853                 
  2128  e9f706         jmp     0xf4a                 
  2131  cc             int3                          
  2132  bf3461         mov     di, 0x6134            
  2135  be0a5f         mov     si, 0x5f0a            
  2138  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  2143  7703           ja      0x864                 
  2145  e90f00         jmp     0x873                 
  2148  cc             int3                          
  2149  bf5a5f         mov     di, 0x5f5a            
  2152  be3861         mov     si, 0x6138            
  2155  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2160  e90400         jmp     0x877                 
  2163  cc             int3                          
  2164  e91800         jmp     0x88f                 
  2167  cc             int3                          
  2168  bf5e5f         mov     di, 0x5f5e            
  2171  be0a5f         mov     si, 0x5f0a            
  2174  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2179  cc             int3                          
  2180  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  2185  e50a           in      ax, 0xa               
  2187  cc             int3                          
  2188  e9bb06         jmp     0xf4a                 
  2191  cc             int3                          
  2192  be3a5f         mov     si, 0x5f3a            
  2195  9adb0e5c06     lcall   0x65c, 0xedb             ; RT#23  
  2200  7503           jne     0x89d                 
  2202  e92400         jmp     0x8c1                 
  2205  cc             int3                          
  2206  bf5e5f         mov     di, 0x5f5e            
  2209  be3a5f         mov     si, 0x5f3a            
  2212  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2217  cc             int3                          
  2218  bf5a5f         mov     di, 0x5f5a            
  2221  be4461         mov     si, 0x6144            
  2224  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2229  cc             int3                          
  2230  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  2235  e50a           in      ax, 0xa               
  2237  cc             int3                          
  2238  e9de06         jmp     0xf9f                 
  2241  cc             int3                          
  2242  bf225f         mov     di, 0x5f22            
  2245  be3e5f         mov     si, 0x5f3e            
  2248  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2253  cc             int3                          
  2254  bf265f         mov     di, 0x5f26            
  2257  be465f         mov     si, 0x5f46            
  2260  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2265  cc             int3                          
  2266  bf2a5f         mov     di, 0x5f2a            
  2269  be4e5f         mov     si, 0x5f4e            
  2272  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2277  cc             int3                          
  2278  e90707         jmp     0xff0                 
  2281  cc             int3                          
  2282  bf625f         mov     di, 0x5f62            
  2285  be1461         mov     si, 0x6114            
  2288  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2293  cc             int3                          
  2294  bf665f         mov     di, 0x5f66            
  2297  be1461         mov     si, 0x6114            
  2300  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2305  cc             int3                          
  2306  bf6a5f         mov     di, 0x5f6a            
  2309  be1461         mov     si, 0x6114            
  2312  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2317  cc             int3                          
  2318  bf6e5f         mov     di, 0x5f6e            
  2321  be1461         mov     si, 0x6114            
  2324  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2329  cc             int3                          
  2330  bf725f         mov     di, 0x5f72            
  2333  be025f         mov     si, 0x5f02            
  2336  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2341  bee860         mov     si, 0x60e8            
  2344  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
  2349  e96f01         jmp     0xa9f                 
  2352  cc             int3                          
  2353  be765f         mov     si, 0x5f76            
  2356  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  2361  8bf3           mov     si, bx                
  2363  d1e6           shl     si, 1                 
  2365  d1e6           shl     si, 1                 
  2367  81c65a55       add     si, 0x555a            
  2371  bfe25e         mov     di, 0x5ee2            
  2374  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2379  cc             int3                          
  2380  be765f         mov     si, 0x5f76            
  2383  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  2388  8bf3           mov     si, bx                
  2390  d1e6           shl     si, 1                 
  2392  d1e6           shl     si, 1                 
  2394  81c65e56       add     si, 0x565e            
  2398  bfe65e         mov     di, 0x5ee6            
  2401  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2406  cc             int3                          
  2407  be765f         mov     si, 0x5f76            
  2410  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  2415  8bf3           mov     si, bx                
  2417  d1e6           shl     si, 1                 
  2419  d1e6           shl     si, 1                 
  2421  81c66257       add     si, 0x5762            
  2425  bfea5e         mov     di, 0x5eea            
  2428  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2433  cc             int3                          
  2434  bfee5e         mov     di, 0x5eee            
  2437  bee25e         mov     si, 0x5ee2            
  2440  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2445  cc             int3                          
  2446  bff25e         mov     di, 0x5ef2            
  2449  bee65e         mov     si, 0x5ee6            
  2452  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2457  cc             int3                          
  2458  bff65e         mov     di, 0x5ef6            
  2461  beea5e         mov     si, 0x5eea            
  2464  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2469  cc             int3                          
  2470  bffa5e         mov     di, 0x5efa            
  2473  be1461         mov     si, 0x6114            
  2476  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2481  cc             int3                          
  2482  bffe5e         mov     di, 0x5efe            
  2485  be3861         mov     si, 0x6138            
  2488  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2493  cc             int3                          
  2494  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  2499  5f             pop     di                    
  2500  0dccbe         or      ax, 0xbecc            
  2503  ea5e9ae51b     ljmp    0x1be5:0x9a5e         
  2508  5c             pop     sp                    
  2509  06             push    es                    
  2510  93             xchg    bx, ax                
  2511  bb0500         mov     bx, 5                 
  2514  f7eb           imul    bx                    
  2516  8bd3           mov     dx, bx                
  2518  bee65e         mov     si, 0x5ee6            
  2521  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  2526  03c3           add     ax, bx                
  2528  8bda           mov     bx, dx                
  2530  f7ea           imul    dx                    
  2532  97             xchg    di, ax                
  2533  bee25e         mov     si, 0x5ee2            
  2536  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  2541  03fb           add     di, bx                
  2543  d1e7           shl     di, 1                 
  2545  d1e7           shl     di, 1                 
  2547  81c7ce0e       add     di, 0xece             
  2551  bee860         mov     si, 0x60e8            
  2554  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2559  cc             int3                          
  2560  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  2565  59             pop     cx                    
  2566  14cc           adc     al, 0xcc              
  2568  bef65e         mov     si, 0x5ef6            
  2571  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  2576  93             xchg    bx, ax                
  2577  bb0500         mov     bx, 5                 
  2580  f7eb           imul    bx                    
  2582  8bd3           mov     dx, bx                
  2584  bef25e         mov     si, 0x5ef2            
  2587  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  2592  03c3           add     ax, bx                
  2594  8bda           mov     bx, dx                
  2596  f7ea           imul    dx                    
  2598  97             xchg    di, ax                
  2599  beee5e         mov     si, 0x5eee            
  2602  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  2607  03fb           add     di, bx                
  2609  d1e7           shl     di, 1                 
  2611  d1e7           shl     di, 1                 
  2613  81c7ce0e       add     di, 0xece             
  2617  be1461         mov     si, 0x6114            
  2620  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2625  cc             int3                          
  2626  bf625f         mov     di, 0x5f62            
  2629  be065f         mov     si, 0x5f06            
  2632  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  2637  7703           ja      0xa52                 
  2639  e91800         jmp     0xa6a                 
  2642  cc             int3                          
  2643  bf625f         mov     di, 0x5f62            
  2646  be065f         mov     si, 0x5f06            
  2649  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2654  cc             int3                          
  2655  bf665f         mov     di, 0x5f66            
  2658  be765f         mov     si, 0x5f76            
  2661  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2666  cc             int3                          
  2667  bf6e5f         mov     di, 0x5f6e            
  2670  be165f         mov     si, 0x5f16            
  2673  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  2678  7703           ja      0xa7b                 
  2680  e91800         jmp     0xa93                 
  2683  cc             int3                          
  2684  bf6e5f         mov     di, 0x5f6e            
  2687  be165f         mov     si, 0x5f16            
  2690  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2695  cc             int3                          
  2696  bf6a5f         mov     di, 0x5f6a            
  2699  be765f         mov     si, 0x5f76            
  2702  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2707  cc             int3                          
  2708  bfe860         mov     di, 0x60e8            
  2711  be765f         mov     si, 0x5f76            
  2714  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
  2719  bf765f         mov     di, 0x5f76            
  2722  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
  2727  8bf7           mov     si, di                
  2729  bf725f         mov     di, 0x5f72            
  2732  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  2737  7703           ja      0xab6                 
  2739  e97afe         jmp     0x930                 
  2742  cc             int3                          
  2743  be625f         mov     si, 0x5f62            
  2746  9adb0e5c06     lcall   0x65c, 0xedb             ; RT#23  
  2751  7703           ja      0xac4                 
  2753  e90f00         jmp     0xad3                 
  2756  cc             int3                          
  2757  bf325f         mov     di, 0x5f32            
  2760  be665f         mov     si, 0x5f66            
  2763  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2768  e90c00         jmp     0xadf                 
  2771  cc             int3                          
  2772  bf325f         mov     di, 0x5f32            
  2775  be6a5f         mov     si, 0x5f6a            
  2778  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2783  cc             int3                          
  2784  9a271b5c06     lcall   0x65c, 0x1b27            ; RT#20  
  2789  cc             int3                          
  2790  bf6e5f         mov     di, 0x5f6e            
  2793  be1461         mov     si, 0x6114            
  2796  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2801  cc             int3                          
  2802  bf7a5f         mov     di, 0x5f7a            
  2805  be1461         mov     si, 0x6114            
  2808  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2813  cc             int3                          
  2814  bf7e5f         mov     di, 0x5f7e            
  2817  be5e5f         mov     si, 0x5f5e            
  2820  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2825  bee860         mov     si, 0x60e8            
  2828  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
  2833  e91102         jmp     0xd25                 
  2836  cc             int3                          
  2837  bfe860         mov     di, 0x60e8            
  2840  be5a5f         mov     si, 0x5f5a            
  2843  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  2848  bb0000         mov     bx, 0                 
  2851  7501           jne     0xb26                 
  2853  4b             dec     bx                    
  2854  bf4461         mov     di, 0x6144            
  2857  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  2862  ba0000         mov     dx, 0                 
  2865  7501           jne     0xb34                 
  2867  4a             dec     dx                    
  2868  0bd3           or      dx, bx                
  2870  23d2           and     dx, dx                
  2872  7403           je      0xb3d                 
  2874  e98100         jmp     0xbbe                 
  2877  cc             int3                          
  2878  be765f         mov     si, 0x5f76            
  2881  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  2886  8bf3           mov     si, bx                
  2888  d1e6           shl     si, 1                 
  2890  d1e6           shl     si, 1                 
  2892  81c66658       add     si, 0x5866            
  2896  bfe25e         mov     di, 0x5ee2            
  2899  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2904  cc             int3                          
  2905  be765f         mov     si, 0x5f76            
  2908  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  2913  8bf3           mov     si, bx                
  2915  d1e6           shl     si, 1                 
  2917  d1e6           shl     si, 1                 
  2919  81c66a59       add     si, 0x596a            
  2923  bfe65e         mov     di, 0x5ee6            
  2926  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2931  cc             int3                          
  2932  be765f         mov     si, 0x5f76            
  2935  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  2940  8bf3           mov     si, bx                
  2942  d1e6           shl     si, 1                 
  2944  d1e6           shl     si, 1                 
  2946  81c66e5a       add     si, 0x5a6e            
  2950  bfea5e         mov     di, 0x5eea            
  2953  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2958  cc             int3                          
  2959  bf3861         mov     di, 0x6138            
  2962  be5a5f         mov     si, 0x5f5a            
  2965  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  2970  7403           je      0xb9f                 
  2972  e90f00         jmp     0xbae                 
  2975  cc             int3                          
  2976  bffe5e         mov     di, 0x5efe            
  2979  be3861         mov     si, 0x6138            
  2982  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  2987  e90c00         jmp     0xbba                 
  2990  cc             int3                          
  2991  bffe5e         mov     di, 0x5efe            
  2994  be3461         mov     si, 0x6134            
  2997  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  3002  cc             int3                          
  3003  e95d00         jmp     0xc1b                 
  3006  cc             int3                          
  3007  be765f         mov     si, 0x5f76            
  3010  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  3015  8bf3           mov     si, bx                
  3017  d1e6           shl     si, 1                 
  3019  d1e6           shl     si, 1                 
  3021  81c6725b       add     si, 0x5b72            
  3025  bfe25e         mov     di, 0x5ee2            
  3028  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  3033  cc             int3                          
  3034  be765f         mov     si, 0x5f76            
  3037  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  3042  8bf3           mov     si, bx                
  3044  d1e6           shl     si, 1                 
  3046  d1e6           shl     si, 1                 
  3048  81c6765c       add     si, 0x5c76            
  3052  bfe65e         mov     di, 0x5ee6            
  3055  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  3060  cc             int3                          
  3061  be765f         mov     si, 0x5f76            
  3064  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  3069  8bf3           mov     si, bx                
  3071  d1e6           shl     si, 1                 
  3073  d1e6           shl     si, 1                 
  3075  81c67a5d       add     si, 0x5d7a            
  3079  bfea5e         mov     di, 0x5eea            
  3082  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  3087  cc             int3                          
  3088  bffe5e         mov     di, 0x5efe            
  3091  be3861         mov     si, 0x6138            
  3094  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  3099  cc             int3                          
  3100  bfee5e         mov     di, 0x5eee            
  3103  bee25e         mov     si, 0x5ee2            
  3106  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  3111  cc             int3                          
  3112  bff25e         mov     di, 0x5ef2            
  3115  bee65e         mov     si, 0x5ee6            
  3118  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  3123  cc             int3                          
  3124  bff65e         mov     di, 0x5ef6            
  3127  beea5e         mov     si, 0x5eea            
  3130  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  3135  cc             int3                          
  3136  bffa5e         mov     di, 0x5efa            
  3139  be4861         mov     si, 0x6148            
  3142  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  3147  cc             int3                          
  3148  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  3153  5f             pop     di                    
  3154  0dccbe         or      ax, 0xbecc            
  3157  ea5e9ae51b     ljmp    0x1be5:0x9a5e         
  3162  5c             pop     sp                    
  3163  06             push    es                    
  3164  93             xchg    bx, ax                
  3165  bb0500         mov     bx, 5                 
  3168  f7eb           imul    bx                    
  3170  8bd3           mov     dx, bx                
  3172  bee65e         mov     si, 0x5ee6            
  3175  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  3180  03c3           add     ax, bx                
  3182  8bda           mov     bx, dx                
  3184  f7ea           imul    dx                    
  3186  97             xchg    di, ax                
  3187  bee25e         mov     si, 0x5ee2            
  3190  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  3195  03fb           add     di, bx                
  3197  d1e7           shl     di, 1                 
  3199  d1e7           shl     di, 1                 
  3201  81c7ce0e       add     di, 0xece             
  3205  bee860         mov     si, 0x60e8            
  3208  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  3213  cc             int3                          
  3214  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  3219  59             pop     cx                    
  3220  14cc           adc     al, 0xcc              
  3222  bef65e         mov     si, 0x5ef6            
  3225  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  3230  93             xchg    bx, ax                
  3231  bb0500         mov     bx, 5                 
  3234  f7eb           imul    bx                    
  3236  8bd3           mov     dx, bx                
  3238  bef25e         mov     si, 0x5ef2            
  3241  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  3246  03c3           add     ax, bx                
  3248  8bda           mov     bx, dx                
  3250  f7ea           imul    dx                    
  3252  97             xchg    di, ax                
  3253  beee5e         mov     si, 0x5eee            
  3256  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  3261  03fb           add     di, bx                
  3263  d1e7           shl     di, 1                 
  3265  d1e7           shl     di, 1                 
  3267  81c7ce0e       add     di, 0xece             
  3271  be1461         mov     si, 0x6114            
  3274  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  3279  cc             int3                          
  3280  bfe860         mov     di, 0x60e8            
  3283  be065f         mov     si, 0x5f06            
  3286  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  3291  7703           ja      0xce0                 
  3293  e91000         jmp     0xcf0                 
  3296  cc             int3                          
  3297  bf325f         mov     di, 0x5f32            
  3300  be765f         mov     si, 0x5f76            
  3303  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  3308  cc             int3                          
  3309  e96900         jmp     0xd59                 
  3312  cc             int3                          
  3313  bf6e5f         mov     di, 0x5f6e            
  3316  be165f         mov     si, 0x5f16            
  3319  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  3324  7703           ja      0xd01                 
  3326  e91800         jmp     0xd19                 
  3329  cc             int3                          
  3330  bf6e5f         mov     di, 0x5f6e            
  3333  be165f         mov     si, 0x5f16            
  3336  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  3341  cc             int3                          
  3342  bf7a5f         mov     di, 0x5f7a            
  3345  be765f         mov     si, 0x5f76            
  3348  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  3353  cc             int3                          
  3354  bfe860         mov     di, 0x60e8            
  3357  be765f         mov     si, 0x5f76            
  3360  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
  3365  bf765f         mov     di, 0x5f76            
  3368  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
  3373  8bf7           mov     si, di                
  3375  bf7e5f         mov     di, 0x5f7e            
  3378  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  3383  7703           ja      0xd3c                 
  3385  e9d8fd         jmp     0xb14                 
  3388  cc             int3                          
  3389  bf3461         mov     di, 0x6134            
  3392  be5a5f         mov     si, 0x5f5a            
  3395  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  3400  7703           ja      0xd4d                 
  3402  e90c00         jmp     0xd59                 
  3405  cc             int3                          
  3406  bf325f         mov     di, 0x5f32            
  3409  be7a5f         mov     si, 0x5f7a            
  3412  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  3417  cc             int3                          
  3418  9a271b5c06     lcall   0x65c, 0x1b27            ; RT#20  
  3423  cc             int3                          
  3424  cc             int3                          
  3425  bee860         mov     si, 0x60e8            
  3428  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
  3433  e94401         jmp     0xeb0                 
  3436  cc             int3                          
  3437  bee860         mov     si, 0x60e8            
  3440  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
  3445  e91501         jmp     0xe8d                 
  3448  cc             int3                          
  3449  bee860         mov     si, 0x60e8            
  3452  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
  3457  e9e600         jmp     0xe6a                 
  3460  cc             int3                          
  3461  befe5e         mov     si, 0x5efe            
  3464  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  3469  9a551b5c06     lcall   0x65c, 0x1b55            ; RT#34  
  3474  03990ddc       add     bx, word ptr [bx + di - 0x23f3]
  3478  0d1f0e         or      ax, 0xe1f             
  3481  cc             int3                          
  3482  be825f         mov     si, 0x5f82            
  3485  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  3490  93             xchg    bx, ax                
  3491  bb0500         mov     bx, 5                 
  3494  f7eb           imul    bx                    
  3496  8bd3           mov     dx, bx                
  3498  be865f         mov     si, 0x5f86            
  3501  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  3506  03c3           add     ax, bx                
  3508  8bda           mov     bx, dx                
  3510  f7ea           imul    dx                    
  3512  97             xchg    di, ax                
  3513  bece5e         mov     si, 0x5ece            
  3516  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  3521  03fb           add     di, bx                
  3523  d1e7           shl     di, 1                 
  3525  d1e7           shl     di, 1                 
  3527  8bdf           mov     bx, di                
  3529  81c7ce0e       add     di, 0xece             
  3533  81c3f208       add     bx, 0x8f2             
  3537  8bf3           mov     si, bx                
  3539  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  3544  cc             int3                          
  3545  e98200         jmp     0xe5e                 
  3548  cc             int3                          
  3549  be825f         mov     si, 0x5f82            
  3552  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  3557  93             xchg    bx, ax                
  3558  bb0500         mov     bx, 5                 
  3561  f7eb           imul    bx                    
  3563  8bd3           mov     dx, bx                
  3565  be865f         mov     si, 0x5f86            
  3568  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  3573  03c3           add     ax, bx                
  3575  8bda           mov     bx, dx                
  3577  f7ea           imul    dx                    
  3579  97             xchg    di, ax                
  3580  bece5e         mov     si, 0x5ece            
  3583  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  3588  03fb           add     di, bx                
  3590  d1e7           shl     di, 1                 
  3592  d1e7           shl     di, 1                 
  3594  8bdf           mov     bx, di                
  3596  81c7ce0e       add     di, 0xece             
  3600  81c3e60a       add     bx, 0xae6             
  3604  8bf3           mov     si, bx                
  3606  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  3611  cc             int3                          
  3612  e93f00         jmp     0xe5e                 
  3615  cc             int3                          
  3616  be825f         mov     si, 0x5f82            
  3619  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  3624  93             xchg    bx, ax                
  3625  bb0500         mov     bx, 5                 
  3628  f7eb           imul    bx                    
  3630  8bd3           mov     dx, bx                
  3632  be865f         mov     si, 0x5f86            
  3635  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  3640  03c3           add     ax, bx                
  3642  8bda           mov     bx, dx                
  3644  f7ea           imul    dx                    
  3646  97             xchg    di, ax                
  3647  bece5e         mov     si, 0x5ece            
  3650  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  3655  03fb           add     di, bx                
  3657  d1e7           shl     di, 1                 
  3659  d1e7           shl     di, 1                 
  3661  8bdf           mov     bx, di                
  3663  81c7ce0e       add     di, 0xece             
  3667  81c3da0c       add     bx, 0xcda             
  3671  8bf3           mov     si, bx                
  3673  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  3678  cc             int3                          
  3679  bfe860         mov     di, 0x60e8            
  3682  be825f         mov     si, 0x5f82            
  3685  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
  3690  bf825f         mov     di, 0x5f82            
  3693  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
  3698  8bf7           mov     si, di                
  3700  bf4461         mov     di, 0x6144            
  3703  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  3708  7703           ja      0xe81                 
  3710  e903ff         jmp     0xd84                 
  3713  cc             int3                          
  3714  bfe860         mov     di, 0x60e8            
  3717  be865f         mov     si, 0x5f86            
  3720  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
  3725  bf865f         mov     di, 0x5f86            
  3728  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
  3733  8bf7           mov     si, di                
  3735  bf4461         mov     di, 0x6144            
  3738  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  3743  7703           ja      0xea4                 
  3745  e9d4fe         jmp     0xd78                 
  3748  cc             int3                          
  3749  bfe860         mov     di, 0x60e8            
  3752  bece5e         mov     si, 0x5ece            
  3755  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
  3760  bfce5e         mov     di, 0x5ece            
  3763  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
  3768  8bf7           mov     si, di                
  3770  bf4461         mov     di, 0x6144            
  3773  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  3778  7703           ja      0xec7                 
  3780  e9a5fe         jmp     0xd6c                 
  3783  cc             int3                          
  3784  9a271b5c06     lcall   0x65c, 0x1b27            ; RT#20  
  3789  cc             int3                          
  3790  be325f         mov     si, 0x5f32            
  3793  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  3798  8bf3           mov     si, bx                
  3800  d1e6           shl     si, 1                 
  3802  d1e6           shl     si, 1                 
  3804  81c65a55       add     si, 0x555a            
  3808  bf225f         mov     di, 0x5f22            
  3811  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  3816  cc             int3                          
  3817  be325f         mov     si, 0x5f32            
  3820  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  3825  8bf3           mov     si, bx                
  3827  d1e6           shl     si, 1                 
  3829  d1e6           shl     si, 1                 
  3831  81c65e56       add     si, 0x565e            
  3835  bf265f         mov     di, 0x5f26            
  3838  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  3843  cc             int3                          
  3844  be325f         mov     si, 0x5f32            
  3847  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  3852  8bf3           mov     si, bx                
  3854  d1e6           shl     si, 1                 
  3856  d1e6           shl     si, 1                 
  3858  81c66257       add     si, 0x5762            
  3862  bf2a5f         mov     di, 0x5f2a            
  3865  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  3870  cc             int3                          
  3871  e9ce00         jmp     0xff0                 
  3874  cc             int3                          
  3875  bf225f         mov     di, 0x5f22            
  3878  be5252         mov     si, 0x5252            
  3881  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  3886  cc             int3                          
  3887  bf265f         mov     di, 0x5f26            
  3890  be5653         mov     si, 0x5356            
  3893  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  3898  cc             int3                          
  3899  bf2a5f         mov     di, 0x5f2a            
  3902  be5a54         mov     si, 0x545a            
  3905  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  3910  cc             int3                          
  3911  e9a600         jmp     0xff0                 
  3914  cc             int3                          
  3915  be325f         mov     si, 0x5f32            
  3918  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  3923  8bf3           mov     si, bx                
  3925  d1e6           shl     si, 1                 
  3927  d1e6           shl     si, 1                 
  3929  81c66658       add     si, 0x5866            
  3933  bf225f         mov     di, 0x5f22            
  3936  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  3941  cc             int3                          
  3942  be325f         mov     si, 0x5f32            
  3945  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  3950  8bf3           mov     si, bx                
  3952  d1e6           shl     si, 1                 
  3954  d1e6           shl     si, 1                 
  3956  81c66a59       add     si, 0x596a            
  3960  bf265f         mov     di, 0x5f26            
  3963  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  3968  cc             int3                          
  3969  be325f         mov     si, 0x5f32            
  3972  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  3977  8bf3           mov     si, bx                
  3979  d1e6           shl     si, 1                 
  3981  d1e6           shl     si, 1                 
  3983  81c66e5a       add     si, 0x5a6e            
  3987  bf2a5f         mov     di, 0x5f2a            
  3990  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  3995  cc             int3                          
  3996  e95100         jmp     0xff0                 
  3999  cc             int3                          
  4000  be325f         mov     si, 0x5f32            
  4003  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  4008  8bf3           mov     si, bx                
  4010  d1e6           shl     si, 1                 
  4012  d1e6           shl     si, 1                 
  4014  81c6725b       add     si, 0x5b72            
  4018  bf225f         mov     di, 0x5f22            
  4021  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  4026  cc             int3                          
  4027  be325f         mov     si, 0x5f32            
  4030  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  4035  8bf3           mov     si, bx                
  4037  d1e6           shl     si, 1                 
  4039  d1e6           shl     si, 1                 
  4041  81c6765c       add     si, 0x5c76            
  4045  bf265f         mov     di, 0x5f26            
  4048  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  4053  cc             int3                          
  4054  be325f         mov     si, 0x5f32            
  4057  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  4062  8bf3           mov     si, bx                
  4064  d1e6           shl     si, 1                 
  4066  d1e6           shl     si, 1                 
  4068  81c67a5d       add     si, 0x5d7a            
  4072  bf2a5f         mov     di, 0x5f2a            
  4075  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  4080  cc             int3                          
  4081  be2a5f         mov     si, 0x5f2a            
  4084  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  4089  93             xchg    bx, ax                
  4090  bb0500         mov     bx, 5                 
  4093  f7eb           imul    bx                    
  4095  8bd3           mov     dx, bx                
  4097  be265f         mov     si, 0x5f26            
  4100  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  4105  03c3           add     ax, bx                
  4107  8bda           mov     bx, dx                
  4109  f7ea           imul    dx                    
  4111  97             xchg    di, ax                
  4112  be225f         mov     si, 0x5f22            
  4115  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  4120  03fb           add     di, bx                
  4122  d1e7           shl     di, 1                 
  4124  d1e7           shl     di, 1                 
  4126  81c7f208       add     di, 0x8f2             
  4130  bee860         mov     si, 0x60e8            
  4133  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  4138  cc             int3                          
  4139  be2a5f         mov     si, 0x5f2a            
  4142  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  4147  93             xchg    bx, ax                
  4148  bb0500         mov     bx, 5                 
  4151  f7eb           imul    bx                    
  4153  8bd3           mov     dx, bx                
  4155  be265f         mov     si, 0x5f26            
  4158  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  4163  03c3           add     ax, bx                
  4165  8bda           mov     bx, dx                
  4167  f7ea           imul    dx                    
  4169  97             xchg    di, ax                
  4170  be225f         mov     si, 0x5f22            
  4173  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  4178  03fb           add     di, bx                
  4180  d1e7           shl     di, 1                 
  4182  d1e7           shl     di, 1                 
  4184  81c7da0c       add     di, 0xcda             
  4188  bee860         mov     si, 0x60e8            
  4191  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  4196  cc             int3                          
  4197  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  4202  8810           mov     byte ptr [bx + si], dl
  4204  cc             int3                          
  4205  bf165f         mov     di, 0x5f16            
  4208  be1461         mov     si, 0x6114            
  4211  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  4216  cc             int3                          
  4217  bf325f         mov     di, 0x5f32            
  4220  be3c61         mov     si, 0x613c            
  4223  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  4228  cc             int3                          
  4229  e9fbf4         jmp     0x583                 
  4232  cc             int3                          
  4233  cc             int3                          
  4234  bfe25e         mov     di, 0x5ee2            
  4237  be225f         mov     si, 0x5f22            
  4240  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  4245  cc             int3                          
  4246  bfe65e         mov     di, 0x5ee6            
  4249  be265f         mov     si, 0x5f26            
  4252  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  4257  cc             int3                          
  4258  bfea5e         mov     di, 0x5eea            
  4261  be2a5f         mov     si, 0x5f2a            
  4264  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  4269  cc             int3                          
  4270  bf8a5f         mov     di, 0x5f8a            
  4273  bee860         mov     si, 0x60e8            
  4276  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  4281  cc             int3                          
  4282  e93000         jmp     0x10ed                
  4285  cc             int3                          
  4286  bfe25e         mov     di, 0x5ee2            
  4289  bede5e         mov     si, 0x5ede            
  4292  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  4297  cc             int3                          
  4298  bfe65e         mov     di, 0x5ee6            
  4301  beda5e         mov     si, 0x5eda            
  4304  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  4309  cc             int3                          
  4310  bfea5e         mov     di, 0x5eea            
  4313  bed65e         mov     si, 0x5ed6            
  4316  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  4321  cc             int3                          
  4322  bf8a5f         mov     di, 0x5f8a            
  4325  be1461         mov     si, 0x6114            
  4328  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  4333  cc             int3                          
  4334  bee25e         mov     si, 0x5ee2            
  4337  9a240f5c06     lcall   0x65c, 0xf24             ; RT#26  
  4342  04be           add     al, 0xbe              
  4344  ea5e9a370d     ljmp    0xd37:0x9a5e          
  4349  5c             pop     sp                    
  4350  06             push    es                    
  4351  819a240f5c06   sbb     word ptr [bp + si + 0xf24], 0x65c
  4357  019ad015       add     word ptr [bp + si + 0x15d0], bx
  4361  5c             pop     sp                    
  4362  06             push    es                    
  4363  81bf4c619acb   cmp     word ptr [bx + 0x614c], 0xcb9a
  4369  155c06         adc     ax, 0x65c             
  4372  bf8e5f         mov     di, 0x5f8e            
  4375  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
  4380  cc             int3                          
  4381  bb0f00         mov     bx, 0xf               
  4384  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
  4389  33db           xor     bx, bx                
  4391  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
  4396  cc             int3                          
  4397  bfe860         mov     di, 0x60e8            
  4400  be925f         mov     si, 0x5f92            
  4403  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  4408  7503           jne     0x113d                
  4410  e98e00         jmp     0x11cb                
  4413  cc             int3                          
  4414  beea5e         mov     si, 0x5eea            
  4417  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  4422  93             xchg    bx, ax                
  4423  bb0500         mov     bx, 5                 
  4426  f7eb           imul    bx                    
  4428  8bd3           mov     dx, bx                
  4430  bee65e         mov     si, 0x5ee6            
  4433  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  4438  03c3           add     ax, bx                
  4440  8bda           mov     bx, dx                
  4442  f7ea           imul    dx                    
  4444  96             xchg    si, ax                
  4445  8bd6           mov     dx, si                
  4447  bee25e         mov     si, 0x5ee2            
  4450  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  4455  03da           add     bx, dx                
  4457  8bf3           mov     si, bx                
  4459  d1e6           shl     si, 1                 
  4461  d1e6           shl     si, 1                 
  4463  81c6da0c       add     si, 0xcda             
  4467  bfe860         mov     di, 0x60e8            
  4470  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  4475  7403           je      0x1180                
  4477  e90400         jmp     0x1184                
  4480  cc             int3                          
  4481  e98e00         jmp     0x1212                
  4484  cc             int3                          
  4485  beea5e         mov     si, 0x5eea            
  4488  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  4493  93             xchg    bx, ax                
  4494  bb0500         mov     bx, 5                 
  4497  f7eb           imul    bx                    
  4499  8bd3           mov     dx, bx                
  4501  bee65e         mov     si, 0x5ee6            
  4504  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  4509  03c3           add     ax, bx                
  4511  8bda           mov     bx, dx                
  4513  f7ea           imul    dx                    
  4515  96             xchg    si, ax                
  4516  8bd6           mov     dx, si                
  4518  bee25e         mov     si, 0x5ee2            
  4521  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  4526  03da           add     bx, dx                
  4528  8bf3           mov     si, bx                
  4530  d1e6           shl     si, 1                 
  4532  d1e6           shl     si, 1                 
  4534  81c6e60a       add     si, 0xae6             
  4538  bfe860         mov     di, 0x60e8            
  4541  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  4546  7403           je      0x11c7                
  4548  e90400         jmp     0x11cb                
  4551  cc             int3                          
  4552  e99300         jmp     0x125e                
  4555  cc             int3                          
  4556  beea5e         mov     si, 0x5eea            
  4559  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  4564  93             xchg    bx, ax                
  4565  bb0500         mov     bx, 5                 
  4568  f7eb           imul    bx                    
  4570  8bd3           mov     dx, bx                
  4572  bee65e         mov     si, 0x5ee6            
  4575  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  4580  03c3           add     ax, bx                
  4582  8bda           mov     bx, dx                
  4584  f7ea           imul    dx                    
  4586  96             xchg    si, ax                
  4587  8bd6           mov     dx, si                
  4589  bee25e         mov     si, 0x5ee2            
  4592  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  4597  03da           add     bx, dx                
  4599  8bf3           mov     si, bx                
  4601  d1e6           shl     si, 1                 
  4603  d1e6           shl     si, 1                 
  4605  81c6da0c       add     si, 0xcda             
  4609  bfe860         mov     di, 0x60e8            
  4612  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  4617  7403           je      0x120e                
  4619  e90400         jmp     0x1212                
  4622  cc             int3                          
  4623  e94c00         jmp     0x125e                
  4626  cc             int3                          
  4627  bee65e         mov     si, 0x5ee6            
  4630  9a240f5c06     lcall   0x65c, 0xf24             ; RT#26  
  4635  01bf4461       add     word ptr [bx + 0x6144], di
  4639  9acb155c06     lcall   0x65c, 0x15cb            ; RT#27  
  4644  9a301c5c06     lcall   0x65c, 0x1c30            ; RT#21  
  4649  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
  4654  be8e5f         mov     si, 0x5f8e            
  4657  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  4662  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
  4667  cc             int3                          
  4668  bb0f00         mov     bx, 0xf               
  4671  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
  4676  bb0100         mov     bx, 1                 
  4679  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
  4684  cc             int3                          
  4685  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
  4690  bb5061         mov     bx, 0x6150            
  4693  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
  4698  cc             int3                          
  4699  e94800         jmp     0x12a6                
  4702  cc             int3                          
  4703  bee65e         mov     si, 0x5ee6            
  4706  9a240f5c06     lcall   0x65c, 0xf24             ; RT#26  
  4711  01bf4461       add     word ptr [bx + 0x6144], di
  4715  9acb155c06     lcall   0x65c, 0x15cb            ; RT#27  
  4720  9a301c5c06     lcall   0x65c, 0x1c30            ; RT#21  
  4725  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
  4730  be8e5f         mov     si, 0x5f8e            
  4733  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  4738  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
  4743  cc             int3                          
  4744  bb0f00         mov     bx, 0xf               
  4747  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
  4752  bb0100         mov     bx, 1                 
  4755  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
  4760  cc             int3                          
  4761  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
  4766  bb5661         mov     bx, 0x6156            
  4769  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
  4774  cc             int3                          
  4775  bb0d00         mov     bx, 0xd               
  4778  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
  4783  bb0500         mov     bx, 5                 
  4786  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
  4791  cc             int3                          
  4792  beea5e         mov     si, 0x5eea            
  4795  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  4800  93             xchg    bx, ax                
  4801  bb0500         mov     bx, 5                 
  4804  f7eb           imul    bx                    
  4806  8bd3           mov     dx, bx                
  4808  bee65e         mov     si, 0x5ee6            
  4811  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  4816  03c3           add     ax, bx                
  4818  8bda           mov     bx, dx                
  4820  f7ea           imul    dx                    
  4822  96             xchg    si, ax                
  4823  8bd6           mov     dx, si                
  4825  bee25e         mov     si, 0x5ee2            
  4828  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  4833  03da           add     bx, dx                
  4835  8bf3           mov     si, bx                
  4837  d1e6           shl     si, 1                 
  4839  d1e6           shl     si, 1                 
  4841  81c6e60a       add     si, 0xae6             
  4845  bfe860         mov     di, 0x60e8            
  4848  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  4853  7403           je      0x12fa                
  4855  e93600         jmp     0x1330                
  4858  cc             int3                          
  4859  bb1500         mov     bx, 0x15              
  4862  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
  4867  bb3200         mov     bx, 0x32              
  4870  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
  4875  cc             int3                          
  4876  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
  4881  bb9a5f         mov     bx, 0x5f9a            
  4884  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
  4889  9aec1c5c06     lcall   0x65c, 0x1cec            ; RT#25  
  4894  83eb1c         sub     bx, 0x1c              
  4897  f7db           neg     bx                    
  4899  baf460         mov     dx, 0x60f4            
  4902  9a471e5c06     lcall   0x65c, 0x1e47            ; RT#16  
  4907  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
  4912  cc             int3                          
  4913  bfe860         mov     di, 0x60e8            
  4916  bec25f         mov     si, 0x5fc2            
  4919  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  4924  7503           jne     0x1341                
  4926  e93c00         jmp     0x137d                
  4929  cc             int3                          
  4930  bb1600         mov     bx, 0x16              
  4933  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
  4938  bb0200         mov     bx, 2                 
  4941  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
  4946  cc             int3                          
  4947  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
  4952  bb1e00         mov     bx, 0x1e              
  4955  baf460         mov     dx, 0x60f4            
  4958  9a471e5c06     lcall   0x65c, 0x1e47            ; RT#16  
  4963  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
  4968  bb5c61         mov     bx, 0x615c               ; = "aCOMPUTER'S  TURN"
  4971  9a93285c06     lcall   0x65c, 0x2893            ; RT#5     <<< bx="aCOMPUTER'S  TURN"
  4976  bb2000         mov     bx, 0x20              
  4979  9a471e5c06     lcall   0x65c, 0x1e47            ; RT#16  
  4984  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
  4989  cc             int3                          
  4990  beea5e         mov     si, 0x5eea            
  4993  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  4998  93             xchg    bx, ax                
  4999  bb0500         mov     bx, 5                 
  5002  f7eb           imul    bx                    
  5004  8bd3           mov     dx, bx                
  5006  bee65e         mov     si, 0x5ee6            
  5009  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  5014  03c3           add     ax, bx                
  5016  8bda           mov     bx, dx                
  5018  f7ea           imul    dx                    
  5020  96             xchg    si, ax                
  5021  8bd6           mov     dx, si                
  5023  bee25e         mov     si, 0x5ee2            
  5026  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  5031  03da           add     bx, dx                
  5033  8bf3           mov     si, bx                
  5035  d1e6           shl     si, 1                 
  5037  d1e6           shl     si, 1                 
  5039  81c6da0c       add     si, 0xcda             
  5043  bfe860         mov     di, 0x60e8            
  5046  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  5051  7403           je      0x13c0                
  5053  e93600         jmp     0x13f6                
  5056  cc             int3                          
  5057  bb1500         mov     bx, 0x15              
  5060  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
  5065  bb3200         mov     bx, 0x32              
  5068  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
  5073  cc             int3                          
  5074  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
  5079  bb9e5f         mov     bx, 0x5f9e            
  5082  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
  5087  9aec1c5c06     lcall   0x65c, 0x1cec            ; RT#25  
  5092  83eb1e         sub     bx, 0x1e              
  5095  f7db           neg     bx                    
  5097  baf460         mov     dx, 0x60f4            
  5100  9a471e5c06     lcall   0x65c, 0x1e47            ; RT#16  
  5105  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
  5110  cc             int3                          
  5111  bb1500         mov     bx, 0x15              
  5114  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
  5119  bb0f00         mov     bx, 0xf               
  5122  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
  5127  cc             int3                          
  5128  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
  5133  bbe25e         mov     bx, 0x5ee2            
  5136  9a84285c06     lcall   0x65c, 0x2884            ; RT#50  
  5141  bb7061         mov     bx, 0x6170            
  5144  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
  5149  8bd3           mov     dx, bx                
  5151  bbe65e         mov     bx, 0x5ee6            
  5154  9a84285c06     lcall   0x65c, 0x2884            ; RT#50  
  5159  8bda           mov     bx, dx                
  5161  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
  5166  bbea5e         mov     bx, 0x5eea            
  5169  9a98285c06     lcall   0x65c, 0x2898            ; RT#35  
  5174  cc             int3                          
  5175  bf3461         mov     di, 0x6134            
  5178  bec65f         mov     si, 0x5fc6            
  5181  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  5186  7403           je      0x1447                
  5188  e90c00         jmp     0x1453                
  5191  cc             int3                          
  5192  bfc65f         mov     di, 0x5fc6            
  5195  bee860         mov     si, 0x60e8            
  5198  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  5203  cc             int3                          
  5204  9a271b5c06     lcall   0x65c, 0x1b27            ; RT#20  
  5209  cc             int3                          
  5210  cc             int3                          
  5211  bf0e5f         mov     di, 0x5f0e            
  5214  be1461         mov     si, 0x6114            
  5217  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  5222  cc             int3                          
  5223  bf8e5f         mov     di, 0x5f8e            
  5226  be1461         mov     si, 0x6114            
  5229  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  5234  cc             int3                          
  5235  bf065f         mov     di, 0x5f06            
  5238  be1461         mov     si, 0x6114            
  5241  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  5246  cc             int3                          
  5247  bfca5f         mov     di, 0x5fca            
  5250  be1461         mov     si, 0x6114            
  5253  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  5258  cc             int3                          
  5259  bf165f         mov     di, 0x5f16            
  5262  be1461         mov     si, 0x6114            
  5265  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  5270  cc             int3                          
  5271  bee65e         mov     si, 0x5ee6            
  5274  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  5279  93             xchg    bx, ax                
  5280  be0500         mov     si, 5                 
  5283  f7ee           imul    si                    
  5285  96             xchg    si, ax                
  5286  8bd6           mov     dx, si                
  5288  bee25e         mov     si, 0x5ee2            
  5291  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  5296  03da           add     bx, dx                
  5298  8bf3           mov     si, bx                
  5300  d1e6           shl     si, 1                 
  5302  d1e6           shl     si, 1                 
  5304  d1e6           shl     si, 1                 
  5306  d1e6           shl     si, 1                 
  5308  d1e6           shl     si, 1                 
  5310  81c6e613       add     si, 0x13e6            
  5314  bfe860         mov     di, 0x60e8            
  5317  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  5322  7503           jne     0x14cf                
  5324  e97601         jmp     0x1645                
  5327  cc             int3                          
  5328  bfce5f         mov     di, 0x5fce            
  5331  bee860         mov     si, 0x60e8            
  5334  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  5339  cc             int3                          
  5340  bfd25f         mov     di, 0x5fd2            
  5343  bee25e         mov     si, 0x5ee2            
  5346  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  5351  cc             int3                          
  5352  bfc65f         mov     di, 0x5fc6            
  5355  bee65e         mov     si, 0x5ee6            
  5358  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  5363  cc             int3                          
  5364  bfd65f         mov     di, 0x5fd6            
  5367  bee860         mov     si, 0x60e8            
  5370  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  5375  cc             int3                          
  5376  bee860         mov     si, 0x60e8            
  5379  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
  5384  e91b01         jmp     0x1626                
  5387  cc             int3                          
  5388  bece5e         mov     si, 0x5ece            
  5391  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  5396  93             xchg    bx, ax                
  5397  bb0500         mov     bx, 5                 
  5400  f7eb           imul    bx                    
  5402  8bd3           mov     dx, bx                
  5404  bee65e         mov     si, 0x5ee6            
  5407  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  5412  03c3           add     ax, bx                
  5414  8bda           mov     bx, dx                
  5416  f7ea           imul    dx                    
  5418  96             xchg    si, ax                
  5419  8bd6           mov     dx, si                
  5421  bee25e         mov     si, 0x5ee2            
  5424  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  5429  03da           add     bx, dx                
  5431  8bf3           mov     si, bx                
  5433  d1e6           shl     si, 1                 
  5435  d1e6           shl     si, 1                 
  5437  81c6ce0e       add     si, 0xece             
  5441  bfe860         mov     di, 0x60e8            
  5444  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  5449  7403           je      0x154e                
  5451  e96800         jmp     0x15b6                
  5454  cc             int3                          
  5455  bfe860         mov     di, 0x60e8            
  5458  beda5f         mov     si, 0x5fda            
  5461  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
  5466  8bfe           mov     di, si                
  5468  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
  5473  cc             int3                          
  5474  beda5f         mov     si, 0x5fda            
  5477  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  5482  8bfb           mov     di, bx                
  5484  d1e7           shl     di, 1                 
  5486  d1e7           shl     di, 1                 
  5488  81c77e5e       add     di, 0x5e7e            
  5492  bee25e         mov     si, 0x5ee2            
  5495  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  5500  cc             int3                          
  5501  beda5f         mov     si, 0x5fda            
  5504  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  5509  8bfb           mov     di, bx                
  5511  d1e7           shl     di, 1                 
  5513  d1e7           shl     di, 1                 
  5515  81c7925e       add     di, 0x5e92            
  5519  bee65e         mov     si, 0x5ee6            
  5522  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  5527  cc             int3                          
  5528  beda5f         mov     si, 0x5fda            
  5531  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  5536  8bfb           mov     di, bx                
  5538  d1e7           shl     di, 1                 
  5540  d1e7           shl     di, 1                 
  5542  81c7a65e       add     di, 0x5ea6            
  5546  bece5e         mov     si, 0x5ece            
  5549  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  5554  cc             int3                          
  5555  e96400         jmp     0x161a                
  5558  cc             int3                          
  5559  bfe860         mov     di, 0x60e8            
  5562  be0e5f         mov     si, 0x5f0e            
  5565  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
  5570  8bfe           mov     di, si                
  5572  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
  5577  cc             int3                          
  5578  be0e5f         mov     si, 0x5f0e            
  5581  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  5586  8bfb           mov     di, bx                
  5588  d1e7           shl     di, 1                 
  5590  d1e7           shl     di, 1                 
  5592  81c7424f       add     di, 0x4f42            
  5596  bee25e         mov     si, 0x5ee2            
  5599  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  5604  cc             int3                          
  5605  be0e5f         mov     si, 0x5f0e            
  5608  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  5613  8bfb           mov     di, bx                
  5615  d1e7           shl     di, 1                 
  5617  d1e7           shl     di, 1                 
  5619  81c74650       add     di, 0x5046            
  5623  bee65e         mov     si, 0x5ee6            
  5626  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  5631  cc             int3                          
  5632  be0e5f         mov     si, 0x5f0e            
  5635  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  5640  8bfb           mov     di, bx                
  5642  d1e7           shl     di, 1                 
  5644  d1e7           shl     di, 1                 
  5646  81c74a51       add     di, 0x514a            
  5650  bece5e         mov     si, 0x5ece            
  5653  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  5658  cc             int3                          
  5659  bfe860         mov     di, 0x60e8            
  5662  bece5e         mov     si, 0x5ece            
  5665  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
  5670  bfce5e         mov     di, 0x5ece            
  5673  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
  5678  8bf7           mov     si, di                
  5680  bf4461         mov     di, 0x6144            
  5683  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  5688  7703           ja      0x163d                
  5690  e9cefe         jmp     0x150b                
  5693  cc             int3                          
  5694  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  5699  1d2ecc         sbb     ax, 0xcc2e            
  5702  beea5e         mov     si, 0x5eea            
  5705  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  5710  93             xchg    bx, ax                
  5711  be1900         mov     si, 0x19              
  5714  f7ee           imul    si                    
  5716  96             xchg    si, ax                
  5717  8bd6           mov     dx, si                
  5719  bee25e         mov     si, 0x5ee2            
  5722  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  5727  03da           add     bx, dx                
  5729  8bf3           mov     si, bx                
  5731  d1e6           shl     si, 1                 
  5733  d1e6           shl     si, 1                 
  5735  d1e6           shl     si, 1                 
  5737  d1e6           shl     si, 1                 
  5739  d1e6           shl     si, 1                 
  5741  81c66a11       add     si, 0x116a            
  5745  bfe860         mov     di, 0x60e8            
  5748  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  5753  7503           jne     0x167e                
  5755  e97601         jmp     0x17f4                
  5758  cc             int3                          
  5759  bfce5f         mov     di, 0x5fce            
  5762  be3461         mov     si, 0x6134            
  5765  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  5770  cc             int3                          
  5771  bfd25f         mov     di, 0x5fd2            
  5774  bee25e         mov     si, 0x5ee2            
  5777  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  5782  cc             int3                          
  5783  bfc65f         mov     di, 0x5fc6            
  5786  bee860         mov     si, 0x60e8            
  5789  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  5794  cc             int3                          
  5795  bfd65f         mov     di, 0x5fd6            
  5798  beea5e         mov     si, 0x5eea            
  5801  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  5806  cc             int3                          
  5807  bee860         mov     si, 0x60e8            
  5810  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
  5815  e91b01         jmp     0x17d5                
  5818  cc             int3                          
  5819  beea5e         mov     si, 0x5eea            
  5822  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  5827  93             xchg    bx, ax                
  5828  bb0500         mov     bx, 5                 
  5831  f7eb           imul    bx                    
  5833  8bd3           mov     dx, bx                
  5835  bece5e         mov     si, 0x5ece            
  5838  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  5843  03c3           add     ax, bx                
  5845  8bda           mov     bx, dx                
  5847  f7ea           imul    dx                    
  5849  96             xchg    si, ax                
  5850  8bd6           mov     dx, si                
  5852  bee25e         mov     si, 0x5ee2            
  5855  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  5860  03da           add     bx, dx                
  5862  8bf3           mov     si, bx                
  5864  d1e6           shl     si, 1                 
  5866  d1e6           shl     si, 1                 
  5868  81c6ce0e       add     si, 0xece             
  5872  bfe860         mov     di, 0x60e8            
  5875  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  5880  7403           je      0x16fd                
  5882  e96800         jmp     0x1765                
  5885  cc             int3                          
  5886  bfe860         mov     di, 0x60e8            
  5889  beda5f         mov     si, 0x5fda            
  5892  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
  5897  8bfe           mov     di, si                
  5899  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
  5904  cc             int3                          
  5905  beda5f         mov     si, 0x5fda            
  5908  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  5913  8bfb           mov     di, bx                
  5915  d1e7           shl     di, 1                 
  5917  d1e7           shl     di, 1                 
  5919  81c77e5e       add     di, 0x5e7e            
  5923  bee25e         mov     si, 0x5ee2            
  5926  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  5931  cc             int3                          
  5932  beda5f         mov     si, 0x5fda            
  5935  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  5940  8bfb           mov     di, bx                
  5942  d1e7           shl     di, 1                 
  5944  d1e7           shl     di, 1                 
  5946  81c7925e       add     di, 0x5e92            
  5950  bece5e         mov     si, 0x5ece            
  5953  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  5958  cc             int3                          
  5959  beda5f         mov     si, 0x5fda            
  5962  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  5967  8bfb           mov     di, bx                
  5969  d1e7           shl     di, 1                 
  5971  d1e7           shl     di, 1                 
  5973  81c7a65e       add     di, 0x5ea6            
  5977  beea5e         mov     si, 0x5eea            
  5980  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  5985  cc             int3                          
  5986  e96400         jmp     0x17c9                
  5989  cc             int3                          
  5990  bfe860         mov     di, 0x60e8            
  5993  be0e5f         mov     si, 0x5f0e            
  5996  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
  6001  8bfe           mov     di, si                
  6003  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
  6008  cc             int3                          
  6009  be0e5f         mov     si, 0x5f0e            
  6012  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  6017  8bfb           mov     di, bx                
  6019  d1e7           shl     di, 1                 
  6021  d1e7           shl     di, 1                 
  6023  81c7424f       add     di, 0x4f42            
  6027  bee25e         mov     si, 0x5ee2            
  6030  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  6035  cc             int3                          
  6036  be0e5f         mov     si, 0x5f0e            
  6039  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  6044  8bfb           mov     di, bx                
  6046  d1e7           shl     di, 1                 
  6048  d1e7           shl     di, 1                 
  6050  81c74650       add     di, 0x5046            
  6054  bece5e         mov     si, 0x5ece            
  6057  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  6062  cc             int3                          
  6063  be0e5f         mov     si, 0x5f0e            
  6066  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  6071  8bfb           mov     di, bx                
  6073  d1e7           shl     di, 1                 
  6075  d1e7           shl     di, 1                 
  6077  81c74a51       add     di, 0x514a            
  6081  beea5e         mov     si, 0x5eea            
  6084  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  6089  cc             int3                          
  6090  bfe860         mov     di, 0x60e8            
  6093  bece5e         mov     si, 0x5ece            
  6096  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
  6101  bfce5e         mov     di, 0x5ece            
  6104  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
  6109  8bf7           mov     si, di                
  6111  bf4461         mov     di, 0x6144            
  6114  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  6119  7703           ja      0x17ec                
  6121  e9cefe         jmp     0x16ba                
  6124  cc             int3                          
  6125  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  6130  1d2ecc         sbb     ax, 0xcc2e            
  6133  beea5e         mov     si, 0x5eea            
  6136  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  6141  93             xchg    bx, ax                
  6142  bb0500         mov     bx, 5                 
  6145  f7eb           imul    bx                    
  6147  bee65e         mov     si, 0x5ee6            
  6150  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  6155  03c3           add     ax, bx                
  6157  bea000         mov     si, 0xa0              
  6160  f7ee           imul    si                    
  6162  96             xchg    si, ax                
  6163  81c6ee10       add     si, 0x10ee            
  6167  bfe860         mov     di, 0x60e8            
  6170  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  6175  7503           jne     0x1824                
  6177  e97601         jmp     0x199a                
  6180  cc             int3                          
  6181  bfce5f         mov     di, 0x5fce            
  6184  be3861         mov     si, 0x6138            
  6187  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  6192  cc             int3                          
  6193  bfd25f         mov     di, 0x5fd2            
  6196  bee860         mov     si, 0x60e8            
  6199  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  6204  cc             int3                          
  6205  bfc65f         mov     di, 0x5fc6            
  6208  bee65e         mov     si, 0x5ee6            
  6211  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  6216  cc             int3                          
  6217  bfd65f         mov     di, 0x5fd6            
  6220  beea5e         mov     si, 0x5eea            
  6223  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  6228  cc             int3                          
  6229  bee860         mov     si, 0x60e8            
  6232  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
  6237  e91b01         jmp     0x197b                
  6240  cc             int3                          
  6241  beea5e         mov     si, 0x5eea            
  6244  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  6249  93             xchg    bx, ax                
  6250  bb0500         mov     bx, 5                 
  6253  f7eb           imul    bx                    
  6255  8bd3           mov     dx, bx                
  6257  bee65e         mov     si, 0x5ee6            
  6260  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  6265  03c3           add     ax, bx                
  6267  8bda           mov     bx, dx                
  6269  f7ea           imul    dx                    
  6271  96             xchg    si, ax                
  6272  8bd6           mov     dx, si                
  6274  bece5e         mov     si, 0x5ece            
  6277  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  6282  03da           add     bx, dx                
  6284  8bf3           mov     si, bx                
  6286  d1e6           shl     si, 1                 
  6288  d1e6           shl     si, 1                 
  6290  81c6ce0e       add     si, 0xece             
  6294  bfe860         mov     di, 0x60e8            
  6297  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  6302  7403           je      0x18a3                
  6304  e96800         jmp     0x190b                
  6307  cc             int3                          
  6308  bfe860         mov     di, 0x60e8            
  6311  beda5f         mov     si, 0x5fda            
  6314  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
  6319  8bfe           mov     di, si                
  6321  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
  6326  cc             int3                          
  6327  beda5f         mov     si, 0x5fda            
  6330  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  6335  8bfb           mov     di, bx                
  6337  d1e7           shl     di, 1                 
  6339  d1e7           shl     di, 1                 
  6341  81c77e5e       add     di, 0x5e7e            
  6345  bece5e         mov     si, 0x5ece            
  6348  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  6353  cc             int3                          
  6354  beda5f         mov     si, 0x5fda            
  6357  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  6362  8bfb           mov     di, bx                
  6364  d1e7           shl     di, 1                 
  6366  d1e7           shl     di, 1                 
  6368  81c7925e       add     di, 0x5e92            
  6372  bee65e         mov     si, 0x5ee6            
  6375  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  6380  cc             int3                          
  6381  beda5f         mov     si, 0x5fda            
  6384  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  6389  8bfb           mov     di, bx                
  6391  d1e7           shl     di, 1                 
  6393  d1e7           shl     di, 1                 
  6395  81c7a65e       add     di, 0x5ea6            
  6399  beea5e         mov     si, 0x5eea            
  6402  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  6407  cc             int3                          
  6408  e96400         jmp     0x196f                
  6411  cc             int3                          
  6412  bfe860         mov     di, 0x60e8            
  6415  be0e5f         mov     si, 0x5f0e            
  6418  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
  6423  8bfe           mov     di, si                
  6425  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
  6430  cc             int3                          
  6431  be0e5f         mov     si, 0x5f0e            
  6434  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  6439  8bfb           mov     di, bx                
  6441  d1e7           shl     di, 1                 
  6443  d1e7           shl     di, 1                 
  6445  81c7424f       add     di, 0x4f42            
  6449  bece5e         mov     si, 0x5ece            
  6452  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  6457  cc             int3                          
  6458  be0e5f         mov     si, 0x5f0e            
  6461  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  6466  8bfb           mov     di, bx                
  6468  d1e7           shl     di, 1                 
  6470  d1e7           shl     di, 1                 
  6472  81c74650       add     di, 0x5046            
  6476  bee65e         mov     si, 0x5ee6            
  6479  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  6484  cc             int3                          
  6485  be0e5f         mov     si, 0x5f0e            
  6488  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  6493  8bfb           mov     di, bx                
  6495  d1e7           shl     di, 1                 
  6497  d1e7           shl     di, 1                 
  6499  81c74a51       add     di, 0x514a            
  6503  beea5e         mov     si, 0x5eea            
  6506  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  6511  cc             int3                          
  6512  bfe860         mov     di, 0x60e8            
  6515  bece5e         mov     si, 0x5ece            
  6518  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
  6523  bfce5e         mov     di, 0x5ece            
  6526  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
  6531  8bf7           mov     si, di                
  6533  bf4461         mov     di, 0x6144            
  6536  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  6541  7703           ja      0x1992                
  6543  e9cefe         jmp     0x1860                
  6546  cc             int3                          
  6547  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  6552  1d2ecc         sbb     ax, 0xcc2e            
  6555  bf3461         mov     di, 0x6134            
  6558  bee65e         mov     si, 0x5ee6            
  6561  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  6566  bb0000         mov     bx, 0                 
  6569  7501           jne     0x19ac                
  6571  4b             dec     bx                    
  6572  8bd6           mov     dx, si                
  6574  beea5e         mov     si, 0x5eea            
  6577  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  6582  b90000         mov     cx, 0                 
  6585  7501           jne     0x19bc                
  6587  49             dec     cx                    
  6588  23cb           and     cx, bx                
  6590  8bde           mov     bx, si                
  6592  8bf2           mov     si, dx                
  6594  bf3861         mov     di, 0x6138            
  6597  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  6602  b80000         mov     ax, 0                 
  6605  7501           jne     0x19d0                
  6607  48             dec     ax                    
  6608  8bf3           mov     si, bx                
  6610  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  6615  ba0000         mov     dx, 0                 
  6618  7501           jne     0x19dd                
  6620  4a             dec     dx                    
  6621  23d0           and     dx, ax                
  6623  0bd1           or      dx, cx                
  6625  23d2           and     dx, dx                
  6627  7503           jne     0x19e8                
  6629  e91c00         jmp     0x1a04                
  6632  cc             int3                          
  6633  bfde5f         mov     di, 0x5fde            
  6636  bee860         mov     si, 0x60e8            
  6639  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  6644  cc             int3                          
  6645  bfe25f         mov     di, 0x5fe2            
  6648  bee860         mov     si, 0x60e8            
  6651  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  6656  cc             int3                          
  6657  e94a01         jmp     0x1b4e                
  6660  cc             int3                          
  6661  bf3461         mov     di, 0x6134            
  6664  bee65e         mov     si, 0x5ee6            
  6667  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  6672  bb0000         mov     bx, 0                 
  6675  7501           jne     0x1a16                
  6677  4b             dec     bx                    
  6678  8bd7           mov     dx, di                
  6680  bf3861         mov     di, 0x6138            
  6683  8bce           mov     cx, si                
  6685  beea5e         mov     si, 0x5eea            
  6688  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  6693  b80000         mov     ax, 0                 
  6696  7501           jne     0x1a2b                
  6698  48             dec     ax                    
  6699  23c3           and     ax, bx                
  6701  8bde           mov     bx, si                
  6703  8bf1           mov     si, cx                
  6705  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  6710  b90000         mov     cx, 0                 
  6713  7501           jne     0x1a3c                
  6715  49             dec     cx                    
  6716  8bfa           mov     di, dx                
  6718  8bf3           mov     si, bx                
  6720  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  6725  bb0000         mov     bx, 0                 
  6728  7501           jne     0x1a4b                
  6730  4b             dec     bx                    
  6731  23d9           and     bx, cx                
  6733  0bd8           or      bx, ax                
  6735  23db           and     bx, bx                
  6737  7503           jne     0x1a56                
  6739  e91c00         jmp     0x1a72                
  6742  cc             int3                          
  6743  bfde5f         mov     di, 0x5fde            
  6746  bee860         mov     si, 0x60e8            
  6749  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  6754  cc             int3                          
  6755  bfe25f         mov     di, 0x5fe2            
  6758  be4461         mov     si, 0x6144            
  6761  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  6766  cc             int3                          
  6767  e9dc00         jmp     0x1b4e                
  6770  cc             int3                          
  6771  bfe860         mov     di, 0x60e8            
  6774  bee65e         mov     si, 0x5ee6            
  6777  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  6782  bb0000         mov     bx, 0                 
  6785  7501           jne     0x1a84                
  6787  4b             dec     bx                    
  6788  8bd6           mov     dx, si                
  6790  beea5e         mov     si, 0x5eea            
  6793  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  6798  b90000         mov     cx, 0                 
  6801  7501           jne     0x1a94                
  6803  49             dec     cx                    
  6804  23cb           and     cx, bx                
  6806  8bde           mov     bx, si                
  6808  8bf2           mov     si, dx                
  6810  bf4461         mov     di, 0x6144            
  6813  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  6818  b80000         mov     ax, 0                 
  6821  7501           jne     0x1aa8                
  6823  48             dec     ax                    
  6824  8bf3           mov     si, bx                
  6826  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  6831  ba0000         mov     dx, 0                 
  6834  7501           jne     0x1ab5                
  6836  4a             dec     dx                    
  6837  23d0           and     dx, ax                
  6839  0bd1           or      dx, cx                
  6841  23d2           and     dx, dx                
  6843  7503           jne     0x1ac0                
  6845  e91c00         jmp     0x1adc                
  6848  cc             int3                          
  6849  bfde5f         mov     di, 0x5fde            
  6852  bee860         mov     si, 0x60e8            
  6855  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  6860  cc             int3                          
  6861  bfe25f         mov     di, 0x5fe2            
  6864  bee860         mov     si, 0x60e8            
  6867  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  6872  cc             int3                          
  6873  e97200         jmp     0x1b4e                
  6876  cc             int3                          
  6877  bfe860         mov     di, 0x60e8            
  6880  bee65e         mov     si, 0x5ee6            
  6883  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  6888  bb0000         mov     bx, 0                 
  6891  7501           jne     0x1aee                
  6893  4b             dec     bx                    
  6894  8bd7           mov     dx, di                
  6896  bf4461         mov     di, 0x6144            
  6899  8bce           mov     cx, si                
  6901  beea5e         mov     si, 0x5eea            
  6904  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  6909  b80000         mov     ax, 0                 
  6912  7501           jne     0x1b03                
  6914  48             dec     ax                    
  6915  23c3           and     ax, bx                
  6917  8bde           mov     bx, si                
  6919  8bf1           mov     si, cx                
  6921  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  6926  b90000         mov     cx, 0                 
  6929  7501           jne     0x1b14                
  6931  49             dec     cx                    
  6932  8bfa           mov     di, dx                
  6934  8bf3           mov     si, bx                
  6936  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  6941  bb0000         mov     bx, 0                 
  6944  7501           jne     0x1b23                
  6946  4b             dec     bx                    
  6947  23d9           and     bx, cx                
  6949  0bd8           or      bx, ax                
  6951  23db           and     bx, bx                
  6953  7503           jne     0x1b2e                
  6955  e91c00         jmp     0x1b4a                
  6958  cc             int3                          
  6959  bfde5f         mov     di, 0x5fde            
  6962  bee860         mov     si, 0x60e8            
  6965  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  6970  cc             int3                          
  6971  bfe25f         mov     di, 0x5fe2            
  6974  be4461         mov     si, 0x6144            
  6977  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  6982  cc             int3                          
  6983  e90400         jmp     0x1b4e                
  6986  cc             int3                          
  6987  e9f301         jmp     0x1d41                
  6990  cc             int3                          
  6991  bee25f         mov     si, 0x5fe2            
  6994  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  6999  93             xchg    bx, ax                
  7000  bb0500         mov     bx, 5                 
  7003  f7eb           imul    bx                    
  7005  8bd3           mov     dx, bx                
  7007  bede5f         mov     si, 0x5fde            
  7010  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  7015  03c3           add     ax, bx                
  7017  8bda           mov     bx, dx                
  7019  f7ea           imul    dx                    
  7021  96             xchg    si, ax                
  7022  8bd6           mov     dx, si                
  7024  bee25e         mov     si, 0x5ee2            
  7027  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  7032  03da           add     bx, dx                
  7034  8bf3           mov     si, bx                
  7036  d1e6           shl     si, 1                 
  7038  d1e6           shl     si, 1                 
  7040  d1e6           shl     si, 1                 
  7042  d1e6           shl     si, 1                 
  7044  d1e6           shl     si, 1                 
  7046  81c6d210       add     si, 0x10d2            
  7050  bfe860         mov     di, 0x60e8            
  7053  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  7058  7503           jne     0x1b97                
  7060  e9aa01         jmp     0x1d41                
  7063  cc             int3                          
  7064  bfce5f         mov     di, 0x5fce            
  7067  be4461         mov     si, 0x6144            
  7070  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  7075  cc             int3                          
  7076  bfd25f         mov     di, 0x5fd2            
  7079  bee25e         mov     si, 0x5ee2            
  7082  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  7087  cc             int3                          
  7088  bfc65f         mov     di, 0x5fc6            
  7091  bede5f         mov     si, 0x5fde            
  7094  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  7099  cc             int3                          
  7100  bfd65f         mov     di, 0x5fd6            
  7103  bee25f         mov     si, 0x5fe2            
  7106  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  7111  cc             int3                          
  7112  bee860         mov     si, 0x60e8            
  7115  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
  7120  e94f01         jmp     0x1d22                
  7123  cc             int3                          
  7124  bfe860         mov     di, 0x60e8            
  7127  bee25f         mov     si, 0x5fe2            
  7130  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  7135  7403           je      0x1be4                
  7137  e90f00         jmp     0x1bf3                
  7140  cc             int3                          
  7141  bfe65f         mov     di, 0x5fe6            
  7144  bece5e         mov     si, 0x5ece            
  7147  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  7152  e91400         jmp     0x1c07                
  7155  cc             int3                          
  7156  bfce5e         mov     di, 0x5ece            
  7159  beec60         mov     si, 0x60ec            
  7162  9ac1155c06     lcall   0x65c, 0x15c1            ; RT#24  
  7167  bfe65f         mov     di, 0x5fe6            
  7170  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
  7175  cc             int3                          
  7176  bee65f         mov     si, 0x5fe6            
  7179  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  7184  93             xchg    bx, ax                
  7185  bb0500         mov     bx, 5                 
  7188  f7eb           imul    bx                    
  7190  8bd3           mov     dx, bx                
  7192  bece5e         mov     si, 0x5ece            
  7195  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  7200  03c3           add     ax, bx                
  7202  8bda           mov     bx, dx                
  7204  f7ea           imul    dx                    
  7206  96             xchg    si, ax                
  7207  8bd6           mov     dx, si                
  7209  bee25e         mov     si, 0x5ee2            
  7212  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  7217  03da           add     bx, dx                
  7219  8bf3           mov     si, bx                
  7221  d1e6           shl     si, 1                 
  7223  d1e6           shl     si, 1                 
  7225  81c6ce0e       add     si, 0xece             
  7229  bfe860         mov     di, 0x60e8            
  7232  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  7237  7403           je      0x1c4a                
  7239  e96800         jmp     0x1cb2                
  7242  cc             int3                          
  7243  bfe860         mov     di, 0x60e8            
  7246  beda5f         mov     si, 0x5fda            
  7249  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
  7254  8bfe           mov     di, si                
  7256  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
  7261  cc             int3                          
  7262  beda5f         mov     si, 0x5fda            
  7265  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  7270  8bfb           mov     di, bx                
  7272  d1e7           shl     di, 1                 
  7274  d1e7           shl     di, 1                 
  7276  81c77e5e       add     di, 0x5e7e            
  7280  bee25e         mov     si, 0x5ee2            
  7283  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  7288  cc             int3                          
  7289  beda5f         mov     si, 0x5fda            
  7292  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  7297  8bfb           mov     di, bx                
  7299  d1e7           shl     di, 1                 
  7301  d1e7           shl     di, 1                 
  7303  81c7925e       add     di, 0x5e92            
  7307  bece5e         mov     si, 0x5ece            
  7310  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  7315  cc             int3                          
  7316  beda5f         mov     si, 0x5fda            
  7319  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  7324  8bfb           mov     di, bx                
  7326  d1e7           shl     di, 1                 
  7328  d1e7           shl     di, 1                 
  7330  81c7a65e       add     di, 0x5ea6            
  7334  bee65f         mov     si, 0x5fe6            
  7337  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  7342  cc             int3                          
  7343  e96400         jmp     0x1d16                
  7346  cc             int3                          
  7347  bfe860         mov     di, 0x60e8            
  7350  be0e5f         mov     si, 0x5f0e            
  7353  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
  7358  8bfe           mov     di, si                
  7360  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
  7365  cc             int3                          
  7366  be0e5f         mov     si, 0x5f0e            
  7369  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  7374  8bfb           mov     di, bx                
  7376  d1e7           shl     di, 1                 
  7378  d1e7           shl     di, 1                 
  7380  81c7424f       add     di, 0x4f42            
  7384  bee25e         mov     si, 0x5ee2            
  7387  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  7392  cc             int3                          
  7393  be0e5f         mov     si, 0x5f0e            
  7396  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  7401  8bfb           mov     di, bx                
  7403  d1e7           shl     di, 1                 
  7405  d1e7           shl     di, 1                 
  7407  81c74650       add     di, 0x5046            
  7411  bece5e         mov     si, 0x5ece            
  7414  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  7419  cc             int3                          
  7420  be0e5f         mov     si, 0x5f0e            
  7423  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  7428  8bfb           mov     di, bx                
  7430  d1e7           shl     di, 1                 
  7432  d1e7           shl     di, 1                 
  7434  81c74a51       add     di, 0x514a            
  7438  bee65f         mov     si, 0x5fe6            
  7441  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  7446  cc             int3                          
  7447  bfe860         mov     di, 0x60e8            
  7450  bece5e         mov     si, 0x5ece            
  7453  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
  7458  bfce5e         mov     di, 0x5ece            
  7461  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
  7466  8bf7           mov     si, di                
  7468  bf4461         mov     di, 0x6144            
  7471  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  7476  7703           ja      0x1d39                
  7478  e99afe         jmp     0x1bd3                
  7481  cc             int3                          
  7482  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  7487  1d2ecc         sbb     ax, 0xcc2e            
  7490  bfde5f         mov     di, 0x5fde            
  7493  be1461         mov     si, 0x6114            
  7496  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  7501  cc             int3                          
  7502  bfe25f         mov     di, 0x5fe2            
  7505  be1461         mov     si, 0x6114            
  7508  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  7513  cc             int3                          
  7514  bee25e         mov     si, 0x5ee2            
  7517  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
  7522  9a551b5c06     lcall   0x65c, 0x1b55            ; RT#34  
  7527  0470           add     al, 0x70              
  7529  1db81e         sbb     ax, 0x1eb8            
  7532  b81e70         mov     ax, 0x701e            
  7535  1dccbf         sbb     ax, 0xbfcc            
  7538  e860be         call    0xffffdbd5            
  7541  e65e           out     0x5e, al              
  7543  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  7548  bb0000         mov     bx, 0                 
  7551  7501           jne     0x1d82                
  7553  4b             dec     bx                    
  7554  beea5e         mov     si, 0x5eea            
  7557  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  7562  ba0000         mov     dx, 0                 
  7565  7501           jne     0x1d90                
  7567  4a             dec     dx                    
  7568  23d3           and     dx, bx                
  7570  bf4461         mov     di, 0x6144            
  7573  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  7578  b90000         mov     cx, 0                 
  7581  7501           jne     0x1da0                
  7583  49             dec     cx                    
  7584  23cb           and     cx, bx                
  7586  0bca           or      cx, dx                
  7588  23c9           and     cx, cx                
  7590  7403           je      0x1dab                
  7592  e95f07         jmp     0x250a                
  7595  cc             int3                          
  7596  bf4461         mov     di, 0x6144            
  7599  bee65e         mov     si, 0x5ee6            
  7602  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  7607  bb0000         mov     bx, 0                 
  7610  7501           jne     0x1dbd                
  7612  4b             dec     bx                    
  7613  8bd7           mov     dx, di                
  7615  bfe860         mov     di, 0x60e8            
  7618  beea5e         mov     si, 0x5eea            
  7621  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  7626  b90000         mov     cx, 0                 
  7629  7501           jne     0x1dd0                
  7631  49             dec     cx                    
  7632  23cb           and     cx, bx                
  7634  8bfa           mov     di, dx                
  7636  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  7641  b80000         mov     ax, 0                 
  7644  7501           jne     0x1ddf                
  7646  48             dec     ax                    
  7647  23c3           and     ax, bx                
  7649  0bc1           or      ax, cx                
  7651  23c0           and     ax, ax                
  7653  7403           je      0x1dea                
  7655  e92007         jmp     0x250a                
  7658  cc             int3                          
  7659  bfe860         mov     di, 0x60e8            
  7662  bee65e         mov     si, 0x5ee6            
  7665  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  7670  7403           je      0x1dfb                
  7672  e91000         jmp     0x1e0b                
  7675  cc             int3                          
  7676  bfea5f         mov     di, 0x5fea            
  7679  bee860         mov     si, 0x60e8            
  7682  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  7687  cc             int3                          
  7688  e94609         jmp     0x2751                
  7691  cc             int3                          
  7692  bf4461         mov     di, 0x6144            
  7695  bee65e         mov     si, 0x5ee6            
  7698  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  7703  7503           jne     0x1e1c                
  7705  e93509         jmp     0x2751                
  7708  cc             int3                          
  7709  bf3461         mov     di, 0x6134            
  7712  bee65e         mov     si, 0x5ee6            
  7715  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  7720  bb0000         mov     bx, 0                 
  7723  7501           jne     0x1e2e                
  7725  4b             dec     bx                    
  7726  bfe860         mov     di, 0x60e8            
  7729  8bd6           mov     dx, si                
  7731  beea5e         mov     si, 0x5eea            
  7734  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  7739  b90000         mov     cx, 0                 
  7742  7501           jne     0x1e41                
  7744  49             dec     cx                    
  7745  8bc1           mov     ax, cx                
  7747  23cb           and     cx, bx                
  7749  8bf2           mov     si, dx                
  7751  bf3861         mov     di, 0x6138            
  7754  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  7759  bb0000         mov     bx, 0                 
  7762  7501           jne     0x1e55                
  7764  4b             dec     bx                    
  7765  23d8           and     bx, ax                
  7767  0bd9           or      bx, cx                
  7769  23db           and     bx, bx                
  7771  7503           jne     0x1e60                
  7773  e91000         jmp     0x1e70                
  7776  cc             int3                          
  7777  bfea5f         mov     di, 0x5fea            
  7780  bee860         mov     si, 0x60e8            
  7783  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  7788  cc             int3                          
  7789  e93e0b         jmp     0x29ae                
  7792  cc             int3                          
  7793  bf3461         mov     di, 0x6134            
  7796  bee65e         mov     si, 0x5ee6            
  7799  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  7804  bb0000         mov     bx, 0                 
  7807  7501           jne     0x1e82                
  7809  4b             dec     bx                    
  7810  bf4461         mov     di, 0x6144            
  7813  8bd6           mov     dx, si                
  7815  beea5e         mov     si, 0x5eea            
  7818  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  7823  b90000         mov     cx, 0                 
  7826  7501           jne     0x1e95                
  7828  49             dec     cx                    
  7829  8bc1           mov     ax, cx                
  7831  23cb           and     cx, bx                
  7833  8bf2           mov     si, dx                
  7835  bf3861         mov     di, 0x6138            
  7838  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  7843  bb0000         mov     bx, 0                 
  7846  7501           jne     0x1ea9                
  7848  4b             dec     bx                    
  7849  23d8           and     bx, ax                
  7851  0bd9           or      bx, cx                
  7853  23db           and     bx, bx                
  7855  7403           je      0x1eb4                
  7857  e9fa0a         jmp     0x29ae                
  7860  cc             int3                          
  7861  e93012         jmp     0x30e8                
  7864  cc             int3                          
  7865  bfe860         mov     di, 0x60e8            
  7868  bee65e         mov     si, 0x5ee6            
  7871  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  7876  bb0000         mov     bx, 0                 
  7879  7501           jne     0x1eca                
  7881  4b             dec     bx                    
  7882  beea5e         mov     si, 0x5eea            
  7885  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  7890  ba0000         mov     dx, 0                 
  7893  7501           jne     0x1ed8                
  7895  4a             dec     dx                    
  7896  23d3           and     dx, bx                
  7898  bf4461         mov     di, 0x6144            
  7901  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  7906  b90000         mov     cx, 0                 
  7909  7501           jne     0x1ee8                
  7911  49             dec     cx                    
  7912  23cb           and     cx, bx                
  7914  0bca           or      cx, dx                
  7916  23c9           and     cx, cx                
  7918  7403           je      0x1ef3                
  7920  e9f511         jmp     0x30e8                
  7923  cc             int3                          
  7924  bf4461         mov     di, 0x6144            
  7927  bee65e         mov     si, 0x5ee6            
  7930  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  7935  bb0000         mov     bx, 0                 
  7938  7501           jne     0x1f05                
  7940  4b             dec     bx                    
  7941  8bd7           mov     dx, di                
  7943  bfe860         mov     di, 0x60e8            
  7946  beea5e         mov     si, 0x5eea            
  7949  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  7954  b90000         mov     cx, 0                 
  7957  7501           jne     0x1f18                
  7959  49             dec     cx                    
  7960  23cb           and     cx, bx                
  7962  8bfa           mov     di, dx                
  7964  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  7969  b80000         mov     ax, 0                 
  7972  7501           jne     0x1f27                
  7974  48             dec     ax                    
  7975  23c3           and     ax, bx                
  7977  0bc1           or      ax, cx                
  7979  23c0           and     ax, ax                
  7981  7403           je      0x1f32                
  7983  e9b611         jmp     0x30e8                
  7986  cc             int3                          
  7987  bfde5f         mov     di, 0x5fde            
  7990  bee860         mov     si, 0x60e8            
  7993  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  7998  cc             int3                          
  7999  bf3861         mov     di, 0x6138            
  8002  bee25e         mov     si, 0x5ee2            
  8005  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  8010  7503           jne     0x1f4f                
  8012  e95c01         jmp     0x20ab                
  8015  cc             int3                          
  8016  bfe860         mov     di, 0x60e8            
  8019  bee65e         mov     si, 0x5ee6            
  8022  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  8027  bb0000         mov     bx, 0                 
  8030  7501           jne     0x1f61                
  8032  4b             dec     bx                    
  8033  bf3461         mov     di, 0x6134            
  8036  8bd6           mov     dx, si                
  8038  beea5e         mov     si, 0x5eea            
  8041  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  8046  b90000         mov     cx, 0                 
  8049  7501           jne     0x1f74                
  8051  49             dec     cx                    
  8052  8bc1           mov     ax, cx                
  8054  23cb           and     cx, bx                
  8056  8bf2           mov     si, dx                
  8058  bf4461         mov     di, 0x6144            
  8061  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  8066  bb0000         mov     bx, 0                 
  8069  7501           jne     0x1f88                
  8071  4b             dec     bx                    
  8072  23d8           and     bx, ax                
  8074  0bd9           or      bx, cx                
  8076  23db           and     bx, bx                
  8078  7503           jne     0x1f93                
  8080  e91c00         jmp     0x1faf                
  8083  cc             int3                          
  8084  bfea5f         mov     di, 0x5fea            
  8087  bee860         mov     si, 0x60e8            
  8090  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  8095  cc             int3                          
  8096  bfea5e         mov     di, 0x5eea            
  8099  bee860         mov     si, 0x60e8            
  8102  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  8107  cc             int3                          
  8108  e9ff09         jmp     0x29ae                
  8111  cc             int3                          
  8112  bfe860         mov     di, 0x60e8            
  8115  bee65e         mov     si, 0x5ee6            
  8118  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  8123  bb0000         mov     bx, 0                 
  8126  7501           jne     0x1fc1                
  8128  4b             dec     bx                    
  8129  bf3861         mov     di, 0x6138            
  8132  8bd6           mov     dx, si                
  8134  beea5e         mov     si, 0x5eea            
  8137  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  8142  b90000         mov     cx, 0                 
  8145  7501           jne     0x1fd4                
  8147  49             dec     cx                    
  8148  8bc1           mov     ax, cx                
  8150  23cb           and     cx, bx                
  8152  8bf2           mov     si, dx                
  8154  bf4461         mov     di, 0x6144            
  8157  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  8162  bb0000         mov     bx, 0                 
  8165  7501           jne     0x1fe8                
  8167  4b             dec     bx                    
  8168  23d8           and     bx, ax                
  8170  0bd9           or      bx, cx                
  8172  23db           and     bx, bx                
  8174  7503           jne     0x1ff3                
  8176  e91000         jmp     0x2003                
  8179  cc             int3                          
  8180  bfea5e         mov     di, 0x5eea            
  8183  be4461         mov     si, 0x6144            
  8186  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  8191  cc             int3                          
  8192  e9ab09         jmp     0x29ae                
  8195  cc             int3                          
  8196  bf3461         mov     di, 0x6134            
  8199  bee65e         mov     si, 0x5ee6            
  8202  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  8207  bb0000         mov     bx, 0                 
  8210  7501           jne     0x2015                
  8212  4b             dec     bx                    
  8213  bfe860         mov     di, 0x60e8            
  8216  beea5e         mov     si, 0x5eea            
  8219  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  8224  ba0000         mov     dx, 0                 
  8227  7501           jne     0x2026                
  8229  4a             dec     dx                    
  8230  23d3           and     dx, bx                
  8232  bf4461         mov     di, 0x6144            
  8235  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  8240  b90000         mov     cx, 0                 
  8243  7501           jne     0x2036                
  8245  49             dec     cx                    
  8246  23cb           and     cx, bx                
  8248  0bca           or      cx, dx                
  8250  23c9           and     cx, cx                
  8252  7503           jne     0x2041                
  8254  e91c00         jmp     0x205d                
  8257  cc             int3                          
  8258  bfea5f         mov     di, 0x5fea            
  8261  bee860         mov     si, 0x60e8            
  8264  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  8269  cc             int3                          
  8270  bfe65e         mov     di, 0x5ee6            
  8273  bee860         mov     si, 0x60e8            
  8276  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  8281  cc             int3                          
  8282  e9f406         jmp     0x2751                
  8285  cc             int3                          
  8286  bf3861         mov     di, 0x6138            
  8289  bee65e         mov     si, 0x5ee6            
  8292  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  8297  bb0000         mov     bx, 0                 
  8300  7501           jne     0x206f                
  8302  4b             dec     bx                    
  8303  bfe860         mov     di, 0x60e8            
  8306  beea5e         mov     si, 0x5eea            
  8309  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  8314  ba0000         mov     dx, 0                 
  8317  7501           jne     0x2080                
  8319  4a             dec     dx                    
  8320  23d3           and     dx, bx                
  8322  bf4461         mov     di, 0x6144            
  8325  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  8330  b90000         mov     cx, 0                 
  8333  7501           jne     0x2090                
  8335  49             dec     cx                    
  8336  23cb           and     cx, bx                
  8338  0bca           or      cx, dx                
  8340  23c9           and     cx, cx                
  8342  7503           jne     0x209b                
  8344  e91000         jmp     0x20ab                
  8347  cc             int3                          
  8348  bfe65e         mov     di, 0x5ee6            
  8351  be4461         mov     si, 0x6144            
  8354  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  8359  cc             int3                          
  8360  e9a606         jmp     0x2751                
  8363  cc             int3                          
  8364  bfe860         mov     di, 0x60e8            
  8367  bee65e         mov     si, 0x5ee6            
  8370  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  8375  bb0000         mov     bx, 0                 
  8378  7501           jne     0x20bd                
  8380  4b             dec     bx                    
  8381  bf3861         mov     di, 0x6138            
  8384  8bd6           mov     dx, si                
  8386  beea5e         mov     si, 0x5eea            
  8389  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  8394  b90000         mov     cx, 0                 
  8397  7501           jne     0x20d0                
  8399  49             dec     cx                    
  8400  8bc1           mov     ax, cx                
  8402  23cb           and     cx, bx                
  8404  8bf2           mov     si, dx                
  8406  bf4461         mov     di, 0x6144            
  8409  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  8414  bb0000         mov     bx, 0                 
  8417  7501           jne     0x20e4                
  8419  4b             dec     bx                    
  8420  23d8           and     bx, ax                
  8422  0bd9           or      bx, cx                
  8424  23db           and     bx, bx                
  8426  7503           jne     0x20ef                
  8428  e91c00         jmp     0x210b                
  8431  cc             int3                          
  8432  bfea5f         mov     di, 0x5fea            
  8435  bee860         mov     si, 0x60e8            
  8438  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  8443  cc             int3                          
  8444  bfea5e         mov     di, 0x5eea            
  8447  bee860         mov     si, 0x60e8            
  8450  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  8455  cc             int3                          
  8456  e9a308         jmp     0x29ae                
  8459  cc             int3                          
  8460  bfe860         mov     di, 0x60e8            
  8463  bee65e         mov     si, 0x5ee6            
  8466  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  8471  bb0000         mov     bx, 0                 
  8474  7501           jne     0x211d                
  8476  4b             dec     bx                    
  8477  bf3461         mov     di, 0x6134            
  8480  8bd6           mov     dx, si                
  8482  beea5e         mov     si, 0x5eea            
  8485  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  8490  b90000         mov     cx, 0                 
  8493  7501           jne     0x2130                
  8495  49             dec     cx                    
  8496  8bc1           mov     ax, cx                
  8498  23cb           and     cx, bx                
  8500  8bf2           mov     si, dx                
  8502  bf4461         mov     di, 0x6144            
  8505  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  8510  bb0000         mov     bx, 0                 
  8513  7501           jne     0x2144                
  8515  4b             dec     bx                    
  8516  23d8           and     bx, ax                
  8518  0bd9           or      bx, cx                
  8520  23db           and     bx, bx                
  8522  7503           jne     0x214f                
  8524  e91000         jmp     0x215f                
  8527  cc             int3                          
  8528  bfea5e         mov     di, 0x5eea            
  8531  be4461         mov     si, 0x6144            
  8534  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  8539  cc             int3                          
  8540  e94f08         jmp     0x29ae                
  8543  cc             int3                          
  8544  bf3861         mov     di, 0x6138            
  8547  bee65e         mov     si, 0x5ee6            
  8550  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  8555  bb0000         mov     bx, 0                 
  8558  7501           jne     0x2171                
  8560  4b             dec     bx                    
  8561  bfe860         mov     di, 0x60e8            
  8564  beea5e         mov     si, 0x5eea            
  8567  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  8572  ba0000         mov     dx, 0                 
  8575  7501           jne     0x2182                
  8577  4a             dec     dx                    
  8578  23d3           and     dx, bx                
  8580  bf4461         mov     di, 0x6144            
  8583  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  8588  b90000         mov     cx, 0                 
  8591  7501           jne     0x2192                
  8593  49             dec     cx                    
  8594  23cb           and     cx, bx                
  8596  0bca           or      cx, dx                
  8598  23c9           and     cx, cx                
  8600  7503           jne     0x219d                
  8602  e91c00         jmp     0x21b9                
  8605  cc             int3                          
  8606  bfea5f         mov     di, 0x5fea            
  8609  bee860         mov     si, 0x60e8            
  8612  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  8617  cc             int3                          
  8618  bfe65e         mov     di, 0x5ee6            
  8621  bee860         mov     si, 0x60e8            
  8624  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  8629  cc             int3                          
  8630  e99805         jmp     0x2751                
  8633  cc             int3                          
  8634  bf3461         mov     di, 0x6134            
  8637  bee65e         mov     si, 0x5ee6            
  8640  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  8645  bb0000         mov     bx, 0                 
  8648  7501           jne     0x21cb                
  8650  4b             dec     bx                    
  8651  bfe860         mov     di, 0x60e8            
  8654  beea5e         mov     si, 0x5eea            
  8657  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  8662  ba0000         mov     dx, 0                 
  8665  7501           jne     0x21dc                
  8667  4a             dec     dx                    
  8668  23d3           and     dx, bx                
  8670  bf4461         mov     di, 0x6144            
  8673  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  8678  b90000         mov     cx, 0                 
  8681  7501           jne     0x21ec                
  8683  49             dec     cx                    
  8684  23cb           and     cx, bx                
  8686  0bca           or      cx, dx                
  8688  23c9           and     cx, cx                
  8690  7503           jne     0x21f7                
  8692  e91000         jmp     0x2207                
  8695  cc             int3                          
  8696  bfe65e         mov     di, 0x5ee6            
  8699  be4461         mov     si, 0x6144            
  8702  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  8707  cc             int3                          
  8708  e94a05         jmp     0x2751                
  8711  cc             int3                          
  8712  bfde5f         mov     di, 0x5fde            
  8715  bee860         mov     si, 0x60e8            
  8718  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  8723  cc             int3                          
  8724  bf3861         mov     di, 0x6138            
  8727  bee25e         mov     si, 0x5ee2            
  8730  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  8735  7503           jne     0x2224                
  8737  e97301         jmp     0x2397                
  8740  cc             int3                          
  8741  bf3861         mov     di, 0x6138            
  8744  bee65e         mov     si, 0x5ee6            
  8747  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  8752  7503           jne     0x2235                
  8754  e9bd00         jmp     0x22f2                
  8757  cc             int3                          
  8758  bf3861         mov     di, 0x6138            
  8761  beea5e         mov     si, 0x5eea            
  8764  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  8769  7503           jne     0x2246                
  8771  e95c00         jmp     0x22a2                
  8774  cc             int3                          
  8775  bfea5f         mov     di, 0x5fea            
  8778  bee860         mov     si, 0x60e8            
  8781  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  8786  cc             int3                          
  8787  bfe65e         mov     di, 0x5ee6            
  8790  bee860         mov     si, 0x60e8            
  8793  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  8798  cc             int3                          
  8799  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  8804  51             push    cx                    
  8805  27             daa                           
  8806  cc             int3                          
  8807  bfea5f         mov     di, 0x5fea            
  8810  bee860         mov     si, 0x60e8            
  8813  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  8818  cc             int3                          
  8819  bfea5e         mov     di, 0x5eea            
  8822  bee860         mov     si, 0x60e8            
  8825  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  8830  cc             int3                          
  8831  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  8836  ae             scasb   al, byte ptr es:[di]  
  8837  29cc           sub     sp, cx                
  8839  bfe65e         mov     di, 0x5ee6            
  8842  bee860         mov     si, 0x60e8            
  8845  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  8850  cc             int3                          
  8851  bfea5e         mov     di, 0x5eea            
  8854  bee860         mov     si, 0x60e8            
  8857  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  8862  cc             int3                          
  8863  e96909         jmp     0x2c0b                
  8866  cc             int3                          
  8867  bfea5f         mov     di, 0x5fea            
  8870  bee860         mov     si, 0x60e8            
  8873  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  8878  cc             int3                          
  8879  bfe65e         mov     di, 0x5ee6            
  8882  bee860         mov     si, 0x60e8            
  8885  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  8890  cc             int3                          
  8891  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  8896  51             push    cx                    
  8897  27             daa                           
  8898  cc             int3                          
  8899  bfea5e         mov     di, 0x5eea            
  8902  bee860         mov     si, 0x60e8            
  8905  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  8910  cc             int3                          
  8911  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  8916  ae             scasb   al, byte ptr es:[di]  
  8917  29cc           sub     sp, cx                
  8919  bfe65e         mov     di, 0x5ee6            
  8922  bee860         mov     si, 0x60e8            
  8925  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  8930  cc             int3                          
  8931  bfea5e         mov     di, 0x5eea            
  8934  be4461         mov     si, 0x6144            
  8937  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  8942  cc             int3                          
  8943  e91909         jmp     0x2c0b                
  8946  cc             int3                          
  8947  bf3861         mov     di, 0x6138            
  8950  beea5e         mov     si, 0x5eea            
  8953  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  8958  7503           jne     0x2303                
  8960  e95000         jmp     0x2353                
  8963  cc             int3                          
  8964  bfea5f         mov     di, 0x5fea            
  8967  bee860         mov     si, 0x60e8            
  8970  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  8975  cc             int3                          
  8976  bfea5e         mov     di, 0x5eea            
  8979  bee860         mov     si, 0x60e8            
  8982  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  8987  cc             int3                          
  8988  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  8993  ae             scasb   al, byte ptr es:[di]  
  8994  29cc           sub     sp, cx                
  8996  bfe65e         mov     di, 0x5ee6            
  8999  be4461         mov     si, 0x6144            
  9002  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9007  cc             int3                          
  9008  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  9013  51             push    cx                    
  9014  27             daa                           
  9015  cc             int3                          
  9016  bfe65e         mov     di, 0x5ee6            
  9019  be4461         mov     si, 0x6144            
  9022  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9027  cc             int3                          
  9028  bfea5e         mov     di, 0x5eea            
  9031  bee860         mov     si, 0x60e8            
  9034  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9039  cc             int3                          
  9040  e9b808         jmp     0x2c0b                
  9043  cc             int3                          
  9044  bfea5e         mov     di, 0x5eea            
  9047  be4461         mov     si, 0x6144            
  9050  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9055  cc             int3                          
  9056  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  9061  ae             scasb   al, byte ptr es:[di]  
  9062  29cc           sub     sp, cx                
  9064  bfe65e         mov     di, 0x5ee6            
  9067  be4461         mov     si, 0x6144            
  9070  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9075  cc             int3                          
  9076  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  9081  51             push    cx                    
  9082  27             daa                           
  9083  cc             int3                          
  9084  bfe65e         mov     di, 0x5ee6            
  9087  be4461         mov     si, 0x6144            
  9090  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9095  cc             int3                          
  9096  bfea5e         mov     di, 0x5eea            
  9099  be4461         mov     si, 0x6144            
  9102  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9107  cc             int3                          
  9108  e97408         jmp     0x2c0b                
  9111  cc             int3                          
  9112  bf3861         mov     di, 0x6138            
  9115  bee65e         mov     si, 0x5ee6            
  9118  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  9123  7503           jne     0x23a8                
  9125  e9a500         jmp     0x244d                
  9128  cc             int3                          
  9129  bf3861         mov     di, 0x6138            
  9132  beea5e         mov     si, 0x5eea            
  9135  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  9140  7503           jne     0x23b9                
  9142  e94400         jmp     0x23fd                
  9145  cc             int3                          
  9146  bfea5e         mov     di, 0x5eea            
  9149  be4461         mov     si, 0x6144            
  9152  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9157  cc             int3                          
  9158  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  9163  ae             scasb   al, byte ptr es:[di]  
  9164  29cc           sub     sp, cx                
  9166  bfe65e         mov     di, 0x5ee6            
  9169  be4461         mov     si, 0x6144            
  9172  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9177  cc             int3                          
  9178  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  9183  51             push    cx                    
  9184  27             daa                           
  9185  cc             int3                          
  9186  bfe65e         mov     di, 0x5ee6            
  9189  be4461         mov     si, 0x6144            
  9192  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9197  cc             int3                          
  9198  bfea5e         mov     di, 0x5eea            
  9201  be4461         mov     si, 0x6144            
  9204  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9209  cc             int3                          
  9210  e90e08         jmp     0x2c0b                
  9213  cc             int3                          
  9214  bfea5f         mov     di, 0x5fea            
  9217  bee860         mov     si, 0x60e8            
  9220  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9225  cc             int3                          
  9226  bfea5e         mov     di, 0x5eea            
  9229  bee860         mov     si, 0x60e8            
  9232  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9237  cc             int3                          
  9238  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  9243  ae             scasb   al, byte ptr es:[di]  
  9244  29cc           sub     sp, cx                
  9246  bfe65e         mov     di, 0x5ee6            
  9249  be4461         mov     si, 0x6144            
  9252  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9257  cc             int3                          
  9258  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  9263  51             push    cx                    
  9264  27             daa                           
  9265  cc             int3                          
  9266  bfe65e         mov     di, 0x5ee6            
  9269  be4461         mov     si, 0x6144            
  9272  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9277  cc             int3                          
  9278  bfea5e         mov     di, 0x5eea            
  9281  bee860         mov     si, 0x60e8            
  9284  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9289  cc             int3                          
  9290  e9be07         jmp     0x2c0b                
  9293  cc             int3                          
  9294  bf3861         mov     di, 0x6138            
  9297  beea5e         mov     si, 0x5eea            
  9300  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  9305  7503           jne     0x245e                
  9307  e95000         jmp     0x24ae                
  9310  cc             int3                          
  9311  bfea5f         mov     di, 0x5fea            
  9314  bee860         mov     si, 0x60e8            
  9317  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9322  cc             int3                          
  9323  bfe65e         mov     di, 0x5ee6            
  9326  bee860         mov     si, 0x60e8            
  9329  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9334  cc             int3                          
  9335  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  9340  51             push    cx                    
  9341  27             daa                           
  9342  cc             int3                          
  9343  bfea5e         mov     di, 0x5eea            
  9346  be4461         mov     si, 0x6144            
  9349  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9354  cc             int3                          
  9355  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  9360  ae             scasb   al, byte ptr es:[di]  
  9361  29cc           sub     sp, cx                
  9363  bfe65e         mov     di, 0x5ee6            
  9366  bee860         mov     si, 0x60e8            
  9369  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9374  cc             int3                          
  9375  bfea5e         mov     di, 0x5eea            
  9378  be4461         mov     si, 0x6144            
  9381  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9386  cc             int3                          
  9387  e95d07         jmp     0x2c0b                
  9390  cc             int3                          
  9391  bfea5f         mov     di, 0x5fea            
  9394  bee860         mov     si, 0x60e8            
  9397  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9402  cc             int3                          
  9403  bfe65e         mov     di, 0x5ee6            
  9406  bee860         mov     si, 0x60e8            
  9409  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9414  cc             int3                          
  9415  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  9420  51             push    cx                    
  9421  27             daa                           
  9422  cc             int3                          
  9423  bfea5f         mov     di, 0x5fea            
  9426  bee860         mov     si, 0x60e8            
  9429  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9434  cc             int3                          
  9435  bfea5e         mov     di, 0x5eea            
  9438  bee860         mov     si, 0x60e8            
  9441  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9446  cc             int3                          
  9447  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  9452  ae             scasb   al, byte ptr es:[di]  
  9453  29cc           sub     sp, cx                
  9455  bfe65e         mov     di, 0x5ee6            
  9458  bee860         mov     si, 0x60e8            
  9461  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9466  cc             int3                          
  9467  bfea5e         mov     di, 0x5eea            
  9470  bee860         mov     si, 0x60e8            
  9473  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9478  cc             int3                          
  9479  e90107         jmp     0x2c0b                
  9482  cc             int3                          
  9483  bfde5f         mov     di, 0x5fde            
  9486  bee860         mov     si, 0x60e8            
  9489  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9494  cc             int3                          
  9495  bfe860         mov     di, 0x60e8            
  9498  bee25e         mov     si, 0x5ee2            
  9501  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  9506  7503           jne     0x2527                
  9508  e97700         jmp     0x259e                
  9511  cc             int3                          
  9512  bfe25e         mov     di, 0x5ee2            
  9515  bee860         mov     si, 0x60e8            
  9518  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9523  cc             int3                          
  9524  bfe860         mov     di, 0x60e8            
  9527  bee65e         mov     si, 0x5ee6            
  9530  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  9535  7403           je      0x2544                
  9537  e91000         jmp     0x2554                
  9540  cc             int3                          
  9541  bfe65e         mov     di, 0x5ee6            
  9544  be4461         mov     si, 0x6144            
  9547  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9552  cc             int3                          
  9553  e91d00         jmp     0x2571                
  9556  cc             int3                          
  9557  bf4461         mov     di, 0x6144            
  9560  bee65e         mov     si, 0x5ee6            
  9563  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  9568  7403           je      0x2565                
  9570  e90c00         jmp     0x2571                
  9573  cc             int3                          
  9574  bfe65e         mov     di, 0x5ee6            
  9577  bee860         mov     si, 0x60e8            
  9580  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9585  cc             int3                          
  9586  bfe860         mov     di, 0x60e8            
  9589  beea5e         mov     si, 0x5eea            
  9592  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  9597  7403           je      0x2582                
  9599  e91000         jmp     0x2592                
  9602  cc             int3                          
  9603  bfea5e         mov     di, 0x5eea            
  9606  be4461         mov     si, 0x6144            
  9609  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9614  cc             int3                          
  9615  e90c00         jmp     0x259e                
  9618  cc             int3                          
  9619  bfea5e         mov     di, 0x5eea            
  9622  bee860         mov     si, 0x60e8            
  9625  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9630  cc             int3                          
  9631  bff25e         mov     di, 0x5ef2            
  9634  bee65e         mov     si, 0x5ee6            
  9637  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9642  cc             int3                          
  9643  bff65e         mov     di, 0x5ef6            
  9646  beea5e         mov     si, 0x5eea            
  9649  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9654  cc             int3                          
  9655  bf4461         mov     di, 0x6144            
  9658  bee65e         mov     si, 0x5ee6            
  9661  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  9666  7503           jne     0x25c7                
  9668  e9d100         jmp     0x2698                
  9671  cc             int3                          
  9672  bf4461         mov     di, 0x6144            
  9675  beea5e         mov     si, 0x5eea            
  9678  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  9683  7503           jne     0x25d8                
  9685  e96600         jmp     0x263e                
  9688  cc             int3                          
  9689  bfea5f         mov     di, 0x5fea            
  9692  bee860         mov     si, 0x60e8            
  9695  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9700  cc             int3                          
  9701  bf4461         mov     di, 0x6144            
  9704  beee5e         mov     si, 0x5eee            
  9707  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  9712  7403           je      0x25f5                
  9714  e90c00         jmp     0x2601                
  9717  cc             int3                          
  9718  bfea5e         mov     di, 0x5eea            
  9721  be4461         mov     si, 0x6144            
  9724  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9729  cc             int3                          
  9730  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  9735  51             push    cx                    
  9736  27             daa                           
  9737  cc             int3                          
  9738  bfea5f         mov     di, 0x5fea            
  9741  bee860         mov     si, 0x60e8            
  9744  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9749  cc             int3                          
  9750  bf4461         mov     di, 0x6144            
  9753  beee5e         mov     si, 0x5eee            
  9756  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  9761  7403           je      0x2626                
  9763  e90c00         jmp     0x2632                
  9766  cc             int3                          
  9767  bfe65e         mov     di, 0x5ee6            
  9770  be4461         mov     si, 0x6144            
  9773  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9778  cc             int3                          
  9779  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  9784  ae             scasb   al, byte ptr es:[di]  
  9785  29cc           sub     sp, cx                
  9787  e9cd05         jmp     0x2c0b                
  9790  cc             int3                          
  9791  bfea5f         mov     di, 0x5fea            
  9794  bee860         mov     si, 0x60e8            
  9797  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9802  cc             int3                          
  9803  bf4461         mov     di, 0x6144            
  9806  beee5e         mov     si, 0x5eee            
  9809  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  9814  7403           je      0x265b                
  9816  e90c00         jmp     0x2667                
  9819  cc             int3                          
  9820  bfea5e         mov     di, 0x5eea            
  9823  bee860         mov     si, 0x60e8            
  9826  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9831  cc             int3                          
  9832  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  9837  51             push    cx                    
  9838  27             daa                           
  9839  cc             int3                          
  9840  bf4461         mov     di, 0x6144            
  9843  beee5e         mov     si, 0x5eee            
  9846  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  9851  7403           je      0x2680                
  9853  e90c00         jmp     0x268c                
  9856  cc             int3                          
  9857  bfe65e         mov     di, 0x5ee6            
  9860  be4461         mov     si, 0x6144            
  9863  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9868  cc             int3                          
  9869  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  9874  ae             scasb   al, byte ptr es:[di]  
  9875  29cc           sub     sp, cx                
  9877  e97305         jmp     0x2c0b                
  9880  cc             int3                          
  9881  bf4461         mov     di, 0x6144            
  9884  beea5e         mov     si, 0x5eea            
  9887  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  9892  7503           jne     0x26a9                
  9894  e95a00         jmp     0x2703                
  9897  cc             int3                          
  9898  bf4461         mov     di, 0x6144            
  9901  beee5e         mov     si, 0x5eee            
  9904  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  9909  7403           je      0x26ba                
  9911  e90c00         jmp     0x26c6                
  9914  cc             int3                          
  9915  bfea5e         mov     di, 0x5eea            
  9918  be4461         mov     si, 0x6144            
  9921  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9926  cc             int3                          
  9927  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  9932  51             push    cx                    
  9933  27             daa                           
  9934  cc             int3                          
  9935  bfea5f         mov     di, 0x5fea            
  9938  bee860         mov     si, 0x60e8            
  9941  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9946  cc             int3                          
  9947  bf4461         mov     di, 0x6144            
  9950  beee5e         mov     si, 0x5eee            
  9953  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  9958  7403           je      0x26eb                
  9960  e90c00         jmp     0x26f7                
  9963  cc             int3                          
  9964  bfe65e         mov     di, 0x5ee6            
  9967  bee860         mov     si, 0x60e8            
  9970  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
  9975  cc             int3                          
  9976  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
  9981  ae             scasb   al, byte ptr es:[di]  
  9982  29cc           sub     sp, cx                
  9984  e90805         jmp     0x2c0b                
  9987  cc             int3                          
  9988  bf4461         mov     di, 0x6144            
  9991  beee5e         mov     si, 0x5eee            
  9994  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
  9999  7403           je      0x2714                
 10001  e90c00         jmp     0x2720                
 10004  cc             int3                          
 10005  bfea5e         mov     di, 0x5eea            
 10008  bee860         mov     si, 0x60e8            
 10011  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 10016  cc             int3                          
 10017  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 10022  51             push    cx                    
 10023  27             daa                           
 10024  cc             int3                          
 10025  bf4461         mov     di, 0x6144            
 10028  beee5e         mov     si, 0x5eee            
 10031  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 10036  7403           je      0x2739                
 10038  e90c00         jmp     0x2745                
 10041  cc             int3                          
 10042  bfe65e         mov     di, 0x5ee6            
 10045  bee860         mov     si, 0x60e8            
 10048  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 10053  cc             int3                          
 10054  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 10059  ae             scasb   al, byte ptr es:[di]  
 10060  29cc           sub     sp, cx                
 10062  e9ba04         jmp     0x2c0b                
 10065  cc             int3                          
 10066  bf4461         mov     di, 0x6144            
 10069  bee25e         mov     si, 0x5ee2            
 10072  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 10077  7403           je      0x2762                
 10079  e91100         jmp     0x2773                
 10082  cc             int3                          
 10083  bfe65e         mov     di, 0x5ee6            
 10086  beec60         mov     si, 0x60ec            
 10089  9ac1155c06     lcall   0x65c, 0x15c1            ; RT#24  
 10094  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 10099  cc             int3                          
 10100  beea5e         mov     si, 0x5eea            
 10103  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 10108  93             xchg    bx, ax                
 10109  bb0500         mov     bx, 5                 
 10112  f7eb           imul    bx                    
 10114  bee65e         mov     si, 0x5ee6            
 10117  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 10122  03c3           add     ax, bx                
 10124  bea000         mov     si, 0xa0              
 10127  f7ee           imul    si                    
 10129  96             xchg    si, ax                
 10130  81c6f610       add     si, 0x10f6            
 10134  bfe860         mov     di, 0x60e8            
 10137  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 10142  7503           jne     0x27a3                
 10144  e9cc01         jmp     0x296f                
 10147  cc             int3                          
 10148  bfce5f         mov     di, 0x5fce            
 10151  beec60         mov     si, 0x60ec            
 10154  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 10159  cc             int3                          
 10160  bfd25f         mov     di, 0x5fd2            
 10163  bee860         mov     si, 0x60e8            
 10166  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 10171  cc             int3                          
 10172  bfc65f         mov     di, 0x5fc6            
 10175  bee65e         mov     si, 0x5ee6            
 10178  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 10183  cc             int3                          
 10184  bfd65f         mov     di, 0x5fd6            
 10187  beea5e         mov     si, 0x5eea            
 10190  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 10195  cc             int3                          
 10196  bee860         mov     si, 0x60e8            
 10199  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
 10204  e97101         jmp     0x2950                
 10207  cc             int3                          
 10208  bfe860         mov     di, 0x60e8            
 10211  beea5f         mov     si, 0x5fea            
 10214  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 10219  7403           je      0x27f0                
 10221  e90f00         jmp     0x27ff                
 10224  cc             int3                          
 10225  bfe65f         mov     di, 0x5fe6            
 10228  bece5e         mov     si, 0x5ece            
 10231  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 10236  e91400         jmp     0x2813                
 10239  cc             int3                          
 10240  bfce5e         mov     di, 0x5ece            
 10243  beec60         mov     si, 0x60ec            
 10246  9ac1155c06     lcall   0x65c, 0x15c1            ; RT#24  
 10251  bfe65f         mov     di, 0x5fe6            
 10254  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 10259  cc             int3                          
 10260  bf4461         mov     di, 0x6144            
 10263  bee25e         mov     si, 0x5ee2            
 10266  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 10271  7403           je      0x2824                
 10273  e91100         jmp     0x2835                
 10276  cc             int3                          
 10277  bfe65f         mov     di, 0x5fe6            
 10280  beec60         mov     si, 0x60ec            
 10283  9ac1155c06     lcall   0x65c, 0x15c1            ; RT#24  
 10288  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 10293  cc             int3                          
 10294  beea5e         mov     si, 0x5eea            
 10297  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 10302  93             xchg    bx, ax                
 10303  bb0500         mov     bx, 5                 
 10306  f7eb           imul    bx                    
 10308  8bd3           mov     dx, bx                
 10310  bee65f         mov     si, 0x5fe6            
 10313  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 10318  03c3           add     ax, bx                
 10320  8bda           mov     bx, dx                
 10322  f7ea           imul    dx                    
 10324  96             xchg    si, ax                
 10325  8bd6           mov     dx, si                
 10327  bece5e         mov     si, 0x5ece            
 10330  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 10335  03da           add     bx, dx                
 10337  8bf3           mov     si, bx                
 10339  d1e6           shl     si, 1                 
 10341  d1e6           shl     si, 1                 
 10343  81c6ce0e       add     si, 0xece             
 10347  bfe860         mov     di, 0x60e8            
 10350  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 10355  7403           je      0x2878                
 10357  e96800         jmp     0x28e0                
 10360  cc             int3                          
 10361  bfe860         mov     di, 0x60e8            
 10364  beda5f         mov     si, 0x5fda            
 10367  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 10372  8bfe           mov     di, si                
 10374  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 10379  cc             int3                          
 10380  beda5f         mov     si, 0x5fda            
 10383  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 10388  8bfb           mov     di, bx                
 10390  d1e7           shl     di, 1                 
 10392  d1e7           shl     di, 1                 
 10394  81c77e5e       add     di, 0x5e7e            
 10398  bece5e         mov     si, 0x5ece            
 10401  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 10406  cc             int3                          
 10407  beda5f         mov     si, 0x5fda            
 10410  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 10415  8bfb           mov     di, bx                
 10417  d1e7           shl     di, 1                 
 10419  d1e7           shl     di, 1                 
 10421  81c7925e       add     di, 0x5e92            
 10425  bee65f         mov     si, 0x5fe6            
 10428  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 10433  cc             int3                          
 10434  beda5f         mov     si, 0x5fda            
 10437  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 10442  8bfb           mov     di, bx                
 10444  d1e7           shl     di, 1                 
 10446  d1e7           shl     di, 1                 
 10448  81c7a65e       add     di, 0x5ea6            
 10452  beea5e         mov     si, 0x5eea            
 10455  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 10460  cc             int3                          
 10461  e96400         jmp     0x2944                
 10464  cc             int3                          
 10465  bfe860         mov     di, 0x60e8            
 10468  be0e5f         mov     si, 0x5f0e            
 10471  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 10476  8bfe           mov     di, si                
 10478  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 10483  cc             int3                          
 10484  be0e5f         mov     si, 0x5f0e            
 10487  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 10492  8bfb           mov     di, bx                
 10494  d1e7           shl     di, 1                 
 10496  d1e7           shl     di, 1                 
 10498  81c7424f       add     di, 0x4f42            
 10502  bece5e         mov     si, 0x5ece            
 10505  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 10510  cc             int3                          
 10511  be0e5f         mov     si, 0x5f0e            
 10514  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 10519  8bfb           mov     di, bx                
 10521  d1e7           shl     di, 1                 
 10523  d1e7           shl     di, 1                 
 10525  81c74650       add     di, 0x5046            
 10529  bee65f         mov     si, 0x5fe6            
 10532  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 10537  cc             int3                          
 10538  be0e5f         mov     si, 0x5f0e            
 10541  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 10546  8bfb           mov     di, bx                
 10548  d1e7           shl     di, 1                 
 10550  d1e7           shl     di, 1                 
 10552  81c74a51       add     di, 0x514a            
 10556  beea5e         mov     si, 0x5eea            
 10559  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 10564  cc             int3                          
 10565  bfe860         mov     di, 0x60e8            
 10568  bece5e         mov     si, 0x5ece            
 10571  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 10576  bfce5e         mov     di, 0x5ece            
 10579  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 10584  8bf7           mov     si, di                
 10586  bf4461         mov     di, 0x6144            
 10589  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 10594  7703           ja      0x2967                
 10596  e978fe         jmp     0x27df                
 10599  cc             int3                          
 10600  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 10605  1d2ecc         sbb     ax, 0xcc2e            
 10608  bfea5f         mov     di, 0x5fea            
 10611  be1461         mov     si, 0x6114            
 10614  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 10619  cc             int3                          
 10620  bfe65e         mov     di, 0x5ee6            
 10623  bef25e         mov     si, 0x5ef2            
 10626  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 10631  cc             int3                          
 10632  bfea5e         mov     di, 0x5eea            
 10635  bef65e         mov     si, 0x5ef6            
 10638  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 10643  cc             int3                          
 10644  bfe860         mov     di, 0x60e8            
 10647  bede5f         mov     si, 0x5fde            
 10650  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 10655  7403           je      0x29a4                
 10657  e90600         jmp     0x29aa                
 10660  cc             int3                          
 10661  9a271b5c06     lcall   0x65c, 0x1b27            ; RT#20  
 10666  cc             int3                          
 10667  e93a07         jmp     0x30e8                
 10670  cc             int3                          
 10671  bf4461         mov     di, 0x6144            
 10674  bee25e         mov     si, 0x5ee2            
 10677  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 10682  7403           je      0x29bf                
 10684  e91100         jmp     0x29d0                
 10687  cc             int3                          
 10688  bfea5e         mov     di, 0x5eea            
 10691  beec60         mov     si, 0x60ec            
 10694  9ac1155c06     lcall   0x65c, 0x15c1            ; RT#24  
 10699  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 10704  cc             int3                          
 10705  beea5e         mov     si, 0x5eea            
 10708  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 10713  93             xchg    bx, ax                
 10714  bb0500         mov     bx, 5                 
 10717  f7eb           imul    bx                    
 10719  bee65e         mov     si, 0x5ee6            
 10722  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 10727  03c3           add     ax, bx                
 10729  bea000         mov     si, 0xa0              
 10732  f7ee           imul    si                    
 10734  96             xchg    si, ax                
 10735  81c6fa10       add     si, 0x10fa            
 10739  bfe860         mov     di, 0x60e8            
 10742  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 10747  7503           jne     0x2a00                
 10749  e9cc01         jmp     0x2bcc                
 10752  cc             int3                          
 10753  bfce5f         mov     di, 0x5fce            
 10756  bee460         mov     si, 0x60e4            
 10759  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 10764  cc             int3                          
 10765  bfd25f         mov     di, 0x5fd2            
 10768  bee860         mov     si, 0x60e8            
 10771  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 10776  cc             int3                          
 10777  bfc65f         mov     di, 0x5fc6            
 10780  bee65e         mov     si, 0x5ee6            
 10783  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 10788  cc             int3                          
 10789  bfd65f         mov     di, 0x5fd6            
 10792  beea5e         mov     si, 0x5eea            
 10795  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 10800  cc             int3                          
 10801  bee860         mov     si, 0x60e8            
 10804  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
 10809  e97101         jmp     0x2bad                
 10812  cc             int3                          
 10813  bfe860         mov     di, 0x60e8            
 10816  beea5f         mov     si, 0x5fea            
 10819  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 10824  7403           je      0x2a4d                
 10826  e90f00         jmp     0x2a5c                
 10829  cc             int3                          
 10830  bfe65f         mov     di, 0x5fe6            
 10833  bece5e         mov     si, 0x5ece            
 10836  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 10841  e91400         jmp     0x2a70                
 10844  cc             int3                          
 10845  bfce5e         mov     di, 0x5ece            
 10848  beec60         mov     si, 0x60ec            
 10851  9ac1155c06     lcall   0x65c, 0x15c1            ; RT#24  
 10856  bfe65f         mov     di, 0x5fe6            
 10859  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 10864  cc             int3                          
 10865  bf4461         mov     di, 0x6144            
 10868  bee25e         mov     si, 0x5ee2            
 10871  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 10876  7403           je      0x2a81                
 10878  e91100         jmp     0x2a92                
 10881  cc             int3                          
 10882  bfe65f         mov     di, 0x5fe6            
 10885  beec60         mov     si, 0x60ec            
 10888  9ac1155c06     lcall   0x65c, 0x15c1            ; RT#24  
 10893  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 10898  cc             int3                          
 10899  bee65f         mov     si, 0x5fe6            
 10902  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 10907  93             xchg    bx, ax                
 10908  bb0500         mov     bx, 5                 
 10911  f7eb           imul    bx                    
 10913  8bd3           mov     dx, bx                
 10915  bee65e         mov     si, 0x5ee6            
 10918  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 10923  03c3           add     ax, bx                
 10925  8bda           mov     bx, dx                
 10927  f7ea           imul    dx                    
 10929  96             xchg    si, ax                
 10930  8bd6           mov     dx, si                
 10932  bece5e         mov     si, 0x5ece            
 10935  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 10940  03da           add     bx, dx                
 10942  8bf3           mov     si, bx                
 10944  d1e6           shl     si, 1                 
 10946  d1e6           shl     si, 1                 
 10948  81c6ce0e       add     si, 0xece             
 10952  bfe860         mov     di, 0x60e8            
 10955  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 10960  7403           je      0x2ad5                
 10962  e96800         jmp     0x2b3d                
 10965  cc             int3                          
 10966  bfe860         mov     di, 0x60e8            
 10969  beda5f         mov     si, 0x5fda            
 10972  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 10977  8bfe           mov     di, si                
 10979  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 10984  cc             int3                          
 10985  beda5f         mov     si, 0x5fda            
 10988  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 10993  8bfb           mov     di, bx                
 10995  d1e7           shl     di, 1                 
 10997  d1e7           shl     di, 1                 
 10999  81c77e5e       add     di, 0x5e7e            
 11003  bece5e         mov     si, 0x5ece            
 11006  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 11011  cc             int3                          
 11012  beda5f         mov     si, 0x5fda            
 11015  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 11020  8bfb           mov     di, bx                
 11022  d1e7           shl     di, 1                 
 11024  d1e7           shl     di, 1                 
 11026  81c7925e       add     di, 0x5e92            
 11030  bee65e         mov     si, 0x5ee6            
 11033  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 11038  cc             int3                          
 11039  beda5f         mov     si, 0x5fda            
 11042  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 11047  8bfb           mov     di, bx                
 11049  d1e7           shl     di, 1                 
 11051  d1e7           shl     di, 1                 
 11053  81c7a65e       add     di, 0x5ea6            
 11057  bee65f         mov     si, 0x5fe6            
 11060  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 11065  cc             int3                          
 11066  e96400         jmp     0x2ba1                
 11069  cc             int3                          
 11070  bfe860         mov     di, 0x60e8            
 11073  be0e5f         mov     si, 0x5f0e            
 11076  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 11081  8bfe           mov     di, si                
 11083  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 11088  cc             int3                          
 11089  be0e5f         mov     si, 0x5f0e            
 11092  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 11097  8bfb           mov     di, bx                
 11099  d1e7           shl     di, 1                 
 11101  d1e7           shl     di, 1                 
 11103  81c7424f       add     di, 0x4f42            
 11107  bece5e         mov     si, 0x5ece            
 11110  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 11115  cc             int3                          
 11116  be0e5f         mov     si, 0x5f0e            
 11119  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 11124  8bfb           mov     di, bx                
 11126  d1e7           shl     di, 1                 
 11128  d1e7           shl     di, 1                 
 11130  81c74650       add     di, 0x5046            
 11134  bee65e         mov     si, 0x5ee6            
 11137  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 11142  cc             int3                          
 11143  be0e5f         mov     si, 0x5f0e            
 11146  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 11151  8bfb           mov     di, bx                
 11153  d1e7           shl     di, 1                 
 11155  d1e7           shl     di, 1                 
 11157  81c74a51       add     di, 0x514a            
 11161  bee65f         mov     si, 0x5fe6            
 11164  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 11169  cc             int3                          
 11170  bfe860         mov     di, 0x60e8            
 11173  bece5e         mov     si, 0x5ece            
 11176  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 11181  bfce5e         mov     di, 0x5ece            
 11184  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 11189  8bf7           mov     si, di                
 11191  bf4461         mov     di, 0x6144            
 11194  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 11199  7703           ja      0x2bc4                
 11201  e978fe         jmp     0x2a3c                
 11204  cc             int3                          
 11205  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 11210  1d2ecc         sbb     ax, 0xcc2e            
 11213  bfea5f         mov     di, 0x5fea            
 11216  be1461         mov     si, 0x6114            
 11219  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 11224  cc             int3                          
 11225  bfe65e         mov     di, 0x5ee6            
 11228  bef25e         mov     si, 0x5ef2            
 11231  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 11236  cc             int3                          
 11237  bfea5e         mov     di, 0x5eea            
 11240  bef65e         mov     si, 0x5ef6            
 11243  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 11248  cc             int3                          
 11249  bfe860         mov     di, 0x60e8            
 11252  bede5f         mov     si, 0x5fde            
 11255  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 11260  7403           je      0x2c01                
 11262  e90600         jmp     0x2c07                
 11265  cc             int3                          
 11266  9a271b5c06     lcall   0x65c, 0x1b27            ; RT#20  
 11271  cc             int3                          
 11272  e9dd04         jmp     0x30e8                
 11275  cc             int3                          
 11276  beea5e         mov     si, 0x5eea            
 11279  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 11284  93             xchg    bx, ax                
 11285  bb0500         mov     bx, 5                 
 11288  f7eb           imul    bx                    
 11290  bee65e         mov     si, 0x5ee6            
 11293  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 11298  03c3           add     ax, bx                
 11300  bea000         mov     si, 0xa0              
 11303  f7ee           imul    si                    
 11305  96             xchg    si, ax                
 11306  81c6fe10       add     si, 0x10fe            
 11310  bfe860         mov     di, 0x60e8            
 11313  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 11318  7503           jne     0x2c3b                
 11320  e9ad04         jmp     0x30e8                
 11323  cc             int3                          
 11324  bfce5f         mov     di, 0x5fce            
 11327  be7661         mov     si, 0x6176            
 11330  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 11335  cc             int3                          
 11336  bfd25f         mov     di, 0x5fd2            
 11339  bee860         mov     si, 0x60e8            
 11342  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 11347  cc             int3                          
 11348  bfc65f         mov     di, 0x5fc6            
 11351  bee65e         mov     si, 0x5ee6            
 11354  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 11359  cc             int3                          
 11360  bfd65f         mov     di, 0x5fd6            
 11363  beea5e         mov     si, 0x5eea            
 11366  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 11371  cc             int3                          
 11372  bee860         mov     si, 0x60e8            
 11375  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
 11380  e98301         jmp     0x2dfa                
 11383  cc             int3                          
 11384  bf3461         mov     di, 0x6134            
 11387  bee65e         mov     si, 0x5ee6            
 11390  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 11395  7703           ja      0x2c88                
 11397  e91700         jmp     0x2c9f                
 11400  cc             int3                          
 11401  bfce5e         mov     di, 0x5ece            
 11404  beec60         mov     si, 0x60ec            
 11407  9ac1155c06     lcall   0x65c, 0x15c1            ; RT#24  
 11412  bfe65f         mov     di, 0x5fe6            
 11415  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 11420  e90c00         jmp     0x2cab                
 11423  cc             int3                          
 11424  bfe65f         mov     di, 0x5fe6            
 11427  bece5e         mov     si, 0x5ece            
 11430  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 11435  cc             int3                          
 11436  bf3461         mov     di, 0x6134            
 11439  beea5e         mov     si, 0x5eea            
 11442  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 11447  7703           ja      0x2cbc                
 11449  e91700         jmp     0x2cd3                
 11452  cc             int3                          
 11453  bfce5e         mov     di, 0x5ece            
 11456  beec60         mov     si, 0x60ec            
 11459  9ac1155c06     lcall   0x65c, 0x15c1            ; RT#24  
 11464  bfe25f         mov     di, 0x5fe2            
 11467  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 11472  e90c00         jmp     0x2cdf                
 11475  cc             int3                          
 11476  bfe25f         mov     di, 0x5fe2            
 11479  bece5e         mov     si, 0x5ece            
 11482  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 11487  cc             int3                          
 11488  bee25f         mov     si, 0x5fe2            
 11491  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 11496  93             xchg    bx, ax                
 11497  bb0500         mov     bx, 5                 
 11500  f7eb           imul    bx                    
 11502  8bd3           mov     dx, bx                
 11504  bee65f         mov     si, 0x5fe6            
 11507  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 11512  03c3           add     ax, bx                
 11514  8bda           mov     bx, dx                
 11516  f7ea           imul    dx                    
 11518  96             xchg    si, ax                
 11519  8bd6           mov     dx, si                
 11521  bece5e         mov     si, 0x5ece            
 11524  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 11529  03da           add     bx, dx                
 11531  8bf3           mov     si, bx                
 11533  d1e6           shl     si, 1                 
 11535  d1e6           shl     si, 1                 
 11537  81c6ce0e       add     si, 0xece             
 11541  bfe860         mov     di, 0x60e8            
 11544  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 11549  7403           je      0x2d22                
 11551  e96800         jmp     0x2d8a                
 11554  cc             int3                          
 11555  bfe860         mov     di, 0x60e8            
 11558  beda5f         mov     si, 0x5fda            
 11561  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 11566  8bfe           mov     di, si                
 11568  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 11573  cc             int3                          
 11574  beda5f         mov     si, 0x5fda            
 11577  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 11582  8bfb           mov     di, bx                
 11584  d1e7           shl     di, 1                 
 11586  d1e7           shl     di, 1                 
 11588  81c77e5e       add     di, 0x5e7e            
 11592  bece5e         mov     si, 0x5ece            
 11595  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 11600  cc             int3                          
 11601  beda5f         mov     si, 0x5fda            
 11604  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 11609  8bfb           mov     di, bx                
 11611  d1e7           shl     di, 1                 
 11613  d1e7           shl     di, 1                 
 11615  81c7925e       add     di, 0x5e92            
 11619  bee65f         mov     si, 0x5fe6            
 11622  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 11627  cc             int3                          
 11628  beda5f         mov     si, 0x5fda            
 11631  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 11636  8bfb           mov     di, bx                
 11638  d1e7           shl     di, 1                 
 11640  d1e7           shl     di, 1                 
 11642  81c7a65e       add     di, 0x5ea6            
 11646  bee25f         mov     si, 0x5fe2            
 11649  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 11654  cc             int3                          
 11655  e96400         jmp     0x2dee                
 11658  cc             int3                          
 11659  bfe860         mov     di, 0x60e8            
 11662  be0e5f         mov     si, 0x5f0e            
 11665  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 11670  8bfe           mov     di, si                
 11672  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 11677  cc             int3                          
 11678  be0e5f         mov     si, 0x5f0e            
 11681  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 11686  8bfb           mov     di, bx                
 11688  d1e7           shl     di, 1                 
 11690  d1e7           shl     di, 1                 
 11692  81c7424f       add     di, 0x4f42            
 11696  bece5e         mov     si, 0x5ece            
 11699  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 11704  cc             int3                          
 11705  be0e5f         mov     si, 0x5f0e            
 11708  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 11713  8bfb           mov     di, bx                
 11715  d1e7           shl     di, 1                 
 11717  d1e7           shl     di, 1                 
 11719  81c74650       add     di, 0x5046            
 11723  bee65f         mov     si, 0x5fe6            
 11726  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 11731  cc             int3                          
 11732  be0e5f         mov     si, 0x5f0e            
 11735  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 11740  8bfb           mov     di, bx                
 11742  d1e7           shl     di, 1                 
 11744  d1e7           shl     di, 1                 
 11746  81c74a51       add     di, 0x514a            
 11750  bee25f         mov     si, 0x5fe2            
 11753  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 11758  cc             int3                          
 11759  bfe860         mov     di, 0x60e8            
 11762  bece5e         mov     si, 0x5ece            
 11765  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 11770  bfce5e         mov     di, 0x5ece            
 11773  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 11778  8bf7           mov     si, di                
 11780  bf4461         mov     di, 0x6144            
 11783  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 11788  7703           ja      0x2e11                
 11790  e966fe         jmp     0x2c77                
 11793  cc             int3                          
 11794  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 11799  1d2ecc         sbb     ax, 0xcc2e            
 11802  e9cb02         jmp     0x30e8                
 11805  cc             int3                          
 11806  bfe860         mov     di, 0x60e8            
 11809  be165f         mov     si, 0x5f16            
 11812  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 11817  8bfe           mov     di, si                
 11819  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 11824  cc             int3                          
 11825  bf8e5f         mov     di, 0x5f8e            
 11828  be0e5f         mov     si, 0x5f0e            
 11831  9ac1155c06     lcall   0x65c, 0x15c1            ; RT#24  
 11836  bf3861         mov     di, 0x6138            
 11839  9ac11a5c06     lcall   0x65c, 0x1ac1            ; RT#55  
 11844  7403           je      0x2e49                
 11846  e93400         jmp     0x2e7d                
 11849  cc             int3                          
 11850  bf425f         mov     di, 0x5f42            
 11853  be4a4f         mov     si, 0x4f4a            
 11856  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 11861  cc             int3                          
 11862  bf4a5f         mov     di, 0x5f4a            
 11865  be4e50         mov     si, 0x504e            
 11868  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 11873  cc             int3                          
 11874  bf525f         mov     di, 0x5f52            
 11877  be5251         mov     si, 0x5152            
 11880  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 11885  cc             int3                          
 11886  bf0e5f         mov     di, 0x5f0e            
 11889  be8e5f         mov     si, 0x5f8e            
 11892  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 11897  cc             int3                          
 11898  e9f500         jmp     0x2f72                
 11901  cc             int3                          
 11902  bf8e5f         mov     di, 0x5f8e            
 11905  be0e5f         mov     si, 0x5f0e            
 11908  9ac1155c06     lcall   0x65c, 0x15c1            ; RT#24  
 11913  9aed0e5c06     lcall   0x65c, 0xeed             ; RT#72  
 11918  7503           jne     0x2e93                
 11920  e96f11         jmp     0x4002                
 11923  cc             int3                          
 11924  bf8e5f         mov     di, 0x5f8e            
 11927  be0e5f         mov     si, 0x5f0e            
 11930  9ac1155c06     lcall   0x65c, 0x15c1            ; RT#24  
 11935  bfe860         mov     di, 0x60e8            
 11938  9ac11a5c06     lcall   0x65c, 0x1ac1            ; RT#55  
 11943  7403           je      0x2eac                
 11945  e9a100         jmp     0x2f4d                
 11948  cc             int3                          
 11949  bfe860         mov     di, 0x60e8            
 11952  be065f         mov     si, 0x5f06            
 11955  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 11960  8bfe           mov     di, si                
 11962  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 11967  cc             int3                          
 11968  be065f         mov     si, 0x5f06            
 11971  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 11976  8bfb           mov     di, bx                
 11978  d1e7           shl     di, 1                 
 11980  d1e7           shl     di, 1                 
 11982  81c74e52       add     di, 0x524e            
 11986  be0e5f         mov     si, 0x5f0e            
 11989  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 11994  8bf3           mov     si, bx                
 11996  d1e6           shl     si, 1                 
 11998  d1e6           shl     si, 1                 
 12000  81c6424f       add     si, 0x4f42            
 12004  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 12009  cc             int3                          
 12010  be065f         mov     si, 0x5f06            
 12013  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 12018  8bfb           mov     di, bx                
 12020  d1e7           shl     di, 1                 
 12022  d1e7           shl     di, 1                 
 12024  81c75253       add     di, 0x5352            
 12028  be0e5f         mov     si, 0x5f0e            
 12031  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 12036  8bf3           mov     si, bx                
 12038  d1e6           shl     si, 1                 
 12040  d1e6           shl     si, 1                 
 12042  81c64650       add     si, 0x5046            
 12046  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 12051  cc             int3                          
 12052  be065f         mov     si, 0x5f06            
 12055  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 12060  8bfb           mov     di, bx                
 12062  d1e7           shl     di, 1                 
 12064  d1e7           shl     di, 1                 
 12066  81c75654       add     di, 0x5456            
 12070  be0e5f         mov     si, 0x5f0e            
 12073  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 12078  8bf3           mov     si, bx                
 12080  d1e6           shl     si, 1                 
 12082  d1e6           shl     si, 1                 
 12084  81c64a51       add     si, 0x514a            
 12088  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 12093  cc             int3                          
 12094  bf0e5f         mov     di, 0x5f0e            
 12097  be8e5f         mov     si, 0x5f8e            
 12100  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 12105  cc             int3                          
 12106  e92500         jmp     0x2f72                
 12109  cc             int3                          
 12110  bf8e5f         mov     di, 0x5f8e            
 12113  be0e5f         mov     si, 0x5f0e            
 12116  9ac1155c06     lcall   0x65c, 0x15c1            ; RT#24  
 12121  bf3461         mov     di, 0x6134            
 12124  9ac11a5c06     lcall   0x65c, 0x1ac1            ; RT#55  
 12129  7403           je      0x2f66                
 12131  e90c00         jmp     0x2f72                
 12134  cc             int3                          
 12135  bf8e5f         mov     di, 0x5f8e            
 12138  be0e5f         mov     si, 0x5f0e            
 12141  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 12146  cc             int3                          
 12147  befa5e         mov     si, 0x5efa            
 12150  9adb0e5c06     lcall   0x65c, 0xedb             ; RT#23  
 12155  7503           jne     0x2f80                
 12157  e95f00         jmp     0x2fdf                
 12160  cc             int3                          
 12161  bed65f         mov     si, 0x5fd6            
 12164  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 12169  93             xchg    bx, ax                
 12170  bb0500         mov     bx, 5                 
 12173  f7eb           imul    bx                    
 12175  8bd3           mov     dx, bx                
 12177  bec65f         mov     si, 0x5fc6            
 12180  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 12185  03c3           add     ax, bx                
 12187  8bda           mov     bx, dx                
 12189  f7ea           imul    dx                    
 12191  bed25f         mov     si, 0x5fd2            
 12194  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 12199  03d8           add     bx, ax                
 12201  d1e3           shl     bx, 1                 
 12203  d1e3           shl     bx, 1                 
 12205  d1e3           shl     bx, 1                 
 12207  8bd3           mov     dx, bx                
 12209  bece5f         mov     si, 0x5fce            
 12212  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 12217  03da           add     bx, dx                
 12219  93             xchg    bx, ax                
 12220  bf0300         mov     di, 3                 
 12223  f7ef           imul    di                    
 12225  97             xchg    di, ax                
 12226  befa5e         mov     si, 0x5efa            
 12229  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 12234  03fb           add     di, bx                
 12236  d1e7           shl     di, 1                 
 12238  d1e7           shl     di, 1                 
 12240  81c76220       add     di, 0x2062            
 12244  bee860         mov     si, 0x60e8            
 12247  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 12252  e90400         jmp     0x2fe3                
 12255  cc             int3                          
 12256  e9f300         jmp     0x30d6                
 12259  cc             int3                          
 12260  bed65f         mov     si, 0x5fd6            
 12263  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 12268  93             xchg    bx, ax                
 12269  bb0500         mov     bx, 5                 
 12272  f7eb           imul    bx                    
 12274  8bd3           mov     dx, bx                
 12276  bec65f         mov     si, 0x5fc6            
 12279  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 12284  03c3           add     ax, bx                
 12286  8bda           mov     bx, dx                
 12288  f7ea           imul    dx                    
 12290  bed25f         mov     si, 0x5fd2            
 12293  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 12298  03d8           add     bx, ax                
 12300  d1e3           shl     bx, 1                 
 12302  d1e3           shl     bx, 1                 
 12304  d1e3           shl     bx, 1                 
 12306  8bd3           mov     dx, bx                
 12308  bece5f         mov     si, 0x5fce            
 12311  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 12316  03da           add     bx, dx                
 12318  93             xchg    bx, ax                
 12319  be0300         mov     si, 3                 
 12322  f7ee           imul    si                    
 12324  96             xchg    si, ax                
 12325  8bd6           mov     dx, si                
 12327  befa5e         mov     si, 0x5efa            
 12330  8bce           mov     cx, si                
 12332  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 12337  03da           add     bx, dx                
 12339  8bf3           mov     si, bx                
 12341  d1e6           shl     si, 1                 
 12343  d1e6           shl     si, 1                 
 12345  81c66220       add     si, 0x2062            
 12349  8bf9           mov     di, cx                
 12351  8bde           mov     bx, si                
 12353  be3861         mov     si, 0x6138            
 12356  9ac1155c06     lcall   0x65c, 0x15c1            ; RT#24  
 12361  8bcb           mov     cx, bx                
 12363  9a301c5c06     lcall   0x65c, 0x1c30            ; RT#21  
 12368  03da           add     bx, dx                
 12370  8bfb           mov     di, bx                
 12372  d1e7           shl     di, 1                 
 12374  d1e7           shl     di, 1                 
 12376  81c76220       add     di, 0x2062            
 12380  8bf1           mov     si, cx                
 12382  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 12387  7403           je      0x3068                
 12389  e95d00         jmp     0x30c5                
 12392  cc             int3                          
 12393  bed65f         mov     si, 0x5fd6            
 12396  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 12401  93             xchg    bx, ax                
 12402  bb0500         mov     bx, 5                 
 12405  f7eb           imul    bx                    
 12407  8bd3           mov     dx, bx                
 12409  bec65f         mov     si, 0x5fc6            
 12412  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 12417  03c3           add     ax, bx                
 12419  8bda           mov     bx, dx                
 12421  f7ea           imul    dx                    
 12423  97             xchg    di, ax                
 12424  bed25f         mov     si, 0x5fd2            
 12427  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 12432  03fb           add     di, bx                
 12434  d1e7           shl     di, 1                 
 12436  d1e7           shl     di, 1                 
 12438  d1e7           shl     di, 1                 
 12440  bece5f         mov     si, 0x5fce            
 12443  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 12448  03fb           add     di, bx                
 12450  d1e7           shl     di, 1                 
 12452  d1e7           shl     di, 1                 
 12454  81c7c210       add     di, 0x10c2            
 12458  bee860         mov     si, 0x60e8            
 12461  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 12466  cc             int3                          
 12467  bfe860         mov     di, 0x60e8            
 12470  beee5f         mov     si, 0x5fee            
 12473  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 12478  8bfe           mov     di, si                
 12480  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 12485  cc             int3                          
 12486  bf7a61         mov     di, 0x617a            
 12489  beee5f         mov     si, 0x5fee            
 12492  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 12497  7503           jne     0x30d6                
 12499  e99910         jmp     0x416f                
 12502  cc             int3                          
 12503  bfda5f         mov     di, 0x5fda            
 12506  be7e61         mov     si, 0x617e            
 12509  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 12514  cc             int3                          
 12515  9a271b5c06     lcall   0x65c, 0x1b27            ; RT#20  
 12520  cc             int3                          
 12521  9a271b5c06     lcall   0x65c, 0x1b27            ; RT#20  
 12526  cc             int3                          
 12527  9a85075c06     lcall   0x65c, 0x785             ; RT#31  
 12532  cc             int3                          
 12533  bb8261         mov     bx, 0x6182               ; = 'aCOMPUTER'
 12536  ba9e5f         mov     dx, 0x5f9e            
 12539  9ac80b5c06     lcall   0x65c, 0xbc8             ; RT#19    <<< bx='aCOMPUTER'
 12544  cc             int3                          
 12545  bb0c00         mov     bx, 0xc               
 12548  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 12553  bb0100         mov     bx, 1                 
 12556  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 12561  cc             int3                          
 12562  bb8e61         mov     bx, 0x618e               ; = 'aPlease enter your name? '
 12565  9a46265c06     lcall   0x65c, 0x2646            ; RT#37    <<< bx='aPlease enter your name? '
 12570  029a5727       add     bl, byte ptr [bp + si + 0x2757]
 12574  5c             pop     sp                    
 12575  06             push    es                    
 12576  0107           add     word ptr [bx], ax     
 12578  bbf25f         mov     bx, 0x5ff2            
 12581  9a1e285c06     lcall   0x65c, 0x281e            ; RT#17  
 12586  cc             int3                          
 12587  bbf25f         mov     bx, 0x5ff2            
 12590  9aec1c5c06     lcall   0x65c, 0x1cec            ; RT#25  
 12595  0bdb           or      bx, bx                
 12597  7503           jne     0x313a                
 12599  e90301         jmp     0x323d                
 12602  cc             int3                          
 12603  bbf25f         mov     bx, 0x5ff2            
 12606  9aec1c5c06     lcall   0x65c, 0x1cec            ; RT#25  
 12611  83fb1c         cmp     bx, 0x1c              
 12614  7f03           jg      0x314b                
 12616  e91500         jmp     0x3160                
 12619  cc             int3                          
 12620  bbf25f         mov     bx, 0x5ff2            
 12623  ba1c00         mov     dx, 0x1c              
 12626  8bcb           mov     cx, bx                
 12628  9ad51d5c06     lcall   0x65c, 0x1dd5            ; RT#46  
 12633  8bd1           mov     dx, cx                
 12635  9ac80b5c06     lcall   0x65c, 0xbc8             ; RT#19  
 12640  cc             int3                          
 12641  bbf25f         mov     bx, 0x5ff2            
 12644  9aec1c5c06     lcall   0x65c, 0x1cec            ; RT#25  
 12649  9a9d1b5c06     lcall   0x65c, 0x1b9d            ; RT#32  
 12654  bff65f         mov     di, 0x5ff6            
 12657  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 12662  bee860         mov     si, 0x60e8            
 12665  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
 12670  e9a100         jmp     0x3222                
 12673  cc             int3                          
 12674  bece5e         mov     si, 0x5ece            
 12677  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 12682  8bd3           mov     dx, bx                
 12684  bbf25f         mov     bx, 0x5ff2            
 12687  b90100         mov     cx, 1                 
 12690  9aec1d5c06     lcall   0x65c, 0x1dec            ; RT#56  
 12695  9af31c5c06     lcall   0x65c, 0x1cf3            ; RT#36  
 12700  9a9d1b5c06     lcall   0x65c, 0x1b9d            ; RT#32  
 12705  bffa5f         mov     di, 0x5ffa            
 12708  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 12713  cc             int3                          
 12714  bfaa61         mov     di, 0x61aa            
 12717  befa5f         mov     si, 0x5ffa            
 12720  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 12725  bb0000         mov     bx, 0                 
 12728  7301           jae     0x31bb                
 12730  4b             dec     bx                    
 12731  bfae61         mov     di, 0x61ae            
 12734  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 12739  ba0000         mov     dx, 0                 
 12742  7601           jbe     0x31c9                
 12744  4a             dec     dx                    
 12745  0bd3           or      dx, bx                
 12747  23d2           and     dx, dx                
 12749  7403           je      0x31d2                
 12751  e92800         jmp     0x31fa                
 12754  cc             int3                          
 12755  bfb261         mov     di, 0x61b2            
 12758  befa5f         mov     si, 0x5ffa            
 12761  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 12766  9a301c5c06     lcall   0x65c, 0x1c30            ; RT#21  
 12771  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 12776  b8fe5f         mov     ax, 0x5ffe            
 12779  9afe0b5c06     lcall   0x65c, 0xbfe             ; RT#29  
 12784  92             xchg    dx, ax                
 12785  9ac80b5c06     lcall   0x65c, 0xbc8             ; RT#19  
 12790  cc             int3                          
 12791  e91c00         jmp     0x3216                
 12794  cc             int3                          
 12795  befa5f         mov     si, 0x5ffa            
 12798  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 12803  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 12808  b8fe5f         mov     ax, 0x5ffe            
 12811  9afe0b5c06     lcall   0x65c, 0xbfe             ; RT#29  
 12816  92             xchg    dx, ax                
 12817  9ac80b5c06     lcall   0x65c, 0xbc8             ; RT#19  
 12822  cc             int3                          
 12823  bfe860         mov     di, 0x60e8            
 12826  bece5e         mov     si, 0x5ece            
 12829  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 12834  bfce5e         mov     di, 0x5ece            
 12837  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 12842  8bf7           mov     si, di                
 12844  bff65f         mov     di, 0x5ff6            
 12847  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 12852  7703           ja      0x3239                
 12854  e948ff         jmp     0x3181                
 12857  cc             int3                          
 12858  e90c00         jmp     0x3249                
 12861  cc             int3                          
 12862  bbf25f         mov     bx, 0x5ff2            
 12865  bafe5f         mov     dx, 0x5ffe            
 12868  9ac80b5c06     lcall   0x65c, 0xbc8             ; RT#19  
 12873  cc             int3                          
 12874  9a85075c06     lcall   0x65c, 0x785             ; RT#31  
 12879  cc             int3                          
 12880  bbfe5f         mov     bx, 0x5ffe            
 12883  ba9a5f         mov     dx, 0x5f9a            
 12886  9ac80b5c06     lcall   0x65c, 0xbc8             ; RT#19  
 12891  cc             int3                          
 12892  bb0800         mov     bx, 8                 
 12895  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 12900  bb0100         mov     bx, 1                 
 12903  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 12908  cc             int3                          
 12909  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 12914  bb9a5f         mov     bx, 0x5f9a            
 12917  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 12922  bbb661         mov     bx, 0x61b6               ; = 'a would you like to move first? (Y/N)'
 12925  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11    <<< bx='a would you like to move first? (Y/N)'
 12930  cc             int3                          
 12931  9a071d5c06     lcall   0x65c, 0x1d07            ; RT#33  
 12936  ba0260         mov     dx, 0x6002            
 12939  9ac80b5c06     lcall   0x65c, 0xbc8             ; RT#19  
 12944  cc             int3                          
 12945  bbde61         mov     bx, 0x61de            
 12948  b80260         mov     ax, 0x6002            
 12951  9a380c5c06     lcall   0x65c, 0xc38             ; RT#18  
 12956  ba0000         mov     dx, 0                 
 12959  7501           jne     0x32a2                
 12961  4a             dec     dx                    
 12962  bbe461         mov     bx, 0x61e4            
 12965  9a380c5c06     lcall   0x65c, 0xc38             ; RT#18  
 12970  b90000         mov     cx, 0                 
 12973  7501           jne     0x32b0                
 12975  49             dec     cx                    
 12976  0bca           or      cx, dx                
 12978  23c9           and     cx, cx                
 12980  7503           jne     0x32b9                
 12982  e91000         jmp     0x32c9                
 12985  cc             int3                          
 12986  bf2e5f         mov     di, 0x5f2e            
 12989  be3461         mov     si, 0x6134            
 12992  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 12997  cc             int3                          
 12998  e93d00         jmp     0x3306                
 13001  cc             int3                          
 13002  bbea61         mov     bx, 0x61ea            
 13005  b80260         mov     ax, 0x6002            
 13008  9a380c5c06     lcall   0x65c, 0xc38             ; RT#18  
 13013  ba0000         mov     dx, 0                 
 13016  7501           jne     0x32db                
 13018  4a             dec     dx                    
 13019  bbf061         mov     bx, 0x61f0            
 13022  9a380c5c06     lcall   0x65c, 0xc38             ; RT#18  
 13027  b90000         mov     cx, 0                 
 13030  7501           jne     0x32e9                
 13032  49             dec     cx                    
 13033  0bca           or      cx, dx                
 13035  23c9           and     cx, cx                
 13037  7503           jne     0x32f2                
 13039  e91000         jmp     0x3302                
 13042  cc             int3                          
 13043  bfc65f         mov     di, 0x5fc6            
 13046  bee860         mov     si, 0x60e8            
 13049  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 13054  cc             int3                          
 13055  e90400         jmp     0x3306                
 13058  cc             int3                          
 13059  e97cff         jmp     0x3282                
 13062  cc             int3                          
 13063  bb0a00         mov     bx, 0xa               
 13066  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 13071  bb0100         mov     bx, 1                 
 13074  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 13079  cc             int3                          
 13080  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 13085  bb9a5f         mov     bx, 0x5f9a            
 13088  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 13093  bbf661         mov     bx, 0x61f6               ; = "a would you like to use 'X' or 'O'? (X/O)"
 13096  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11    <<< bx="a would you like to use 'X' or 'O'? (X/O)"
 13101  cc             int3                          
 13102  9a071d5c06     lcall   0x65c, 0x1d07            ; RT#33  
 13107  ba0260         mov     dx, 0x6002            
 13110  9ac80b5c06     lcall   0x65c, 0xbc8             ; RT#19  
 13115  cc             int3                          
 13116  bb2262         mov     bx, 0x6222            
 13119  b80260         mov     ax, 0x6002            
 13122  9a380c5c06     lcall   0x65c, 0xc38             ; RT#18  
 13127  ba0000         mov     dx, 0                 
 13130  7501           jne     0x334d                
 13132  4a             dec     dx                    
 13133  bb5061         mov     bx, 0x6150            
 13136  9a380c5c06     lcall   0x65c, 0xc38             ; RT#18  
 13141  b90000         mov     cx, 0                 
 13144  7501           jne     0x335b                
 13146  49             dec     cx                    
 13147  0bca           or      cx, dx                
 13149  23c9           and     cx, cx                
 13151  7503           jne     0x3364                
 13153  e91000         jmp     0x3374                
 13156  cc             int3                          
 13157  bf925f         mov     di, 0x5f92            
 13160  bee860         mov     si, 0x60e8            
 13163  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 13168  cc             int3                          
 13169  e93d00         jmp     0x33b1                
 13172  cc             int3                          
 13173  bb2862         mov     bx, 0x6228            
 13176  b80260         mov     ax, 0x6002            
 13179  9a380c5c06     lcall   0x65c, 0xc38             ; RT#18  
 13184  ba0000         mov     dx, 0                 
 13187  7501           jne     0x3386                
 13189  4a             dec     dx                    
 13190  bb5661         mov     bx, 0x6156            
 13193  9a380c5c06     lcall   0x65c, 0xc38             ; RT#18  
 13198  b90000         mov     cx, 0                 
 13201  7501           jne     0x3394                
 13203  49             dec     cx                    
 13204  0bca           or      cx, dx                
 13206  23c9           and     cx, cx                
 13208  7503           jne     0x339d                
 13210  e91000         jmp     0x33ad                
 13213  cc             int3                          
 13214  bf925f         mov     di, 0x5f92            
 13217  be3461         mov     si, 0x6134            
 13220  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 13225  cc             int3                          
 13226  e90400         jmp     0x33b1                
 13229  cc             int3                          
 13230  e97cff         jmp     0x332d                
 13233  cc             int3                          
 13234  bb0c00         mov     bx, 0xc               
 13237  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 13242  bb0100         mov     bx, 1                 
 13245  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 13250  cc             int3                          
 13251  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 13256  bb2e62         mov     bx, 0x622e               ; = 'bWould you like to use cursor? (Y/N)'
 13259  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11    <<< bx='bWould you like to use cursor? (Y/N)'
 13264  cc             int3                          
 13265  9a071d5c06     lcall   0x65c, 0x1d07            ; RT#33  
 13270  ba0260         mov     dx, 0x6002            
 13273  9ac80b5c06     lcall   0x65c, 0xbc8             ; RT#19  
 13278  cc             int3                          
 13279  bbde61         mov     bx, 0x61de            
 13282  b80260         mov     ax, 0x6002            
 13285  9a380c5c06     lcall   0x65c, 0xc38             ; RT#18  
 13290  ba0000         mov     dx, 0                 
 13293  7501           jne     0x33f0                
 13295  4a             dec     dx                    
 13296  bbe461         mov     bx, 0x61e4            
 13299  9a380c5c06     lcall   0x65c, 0xc38             ; RT#18  
 13304  b90000         mov     cx, 0                 
 13307  7501           jne     0x33fe                
 13309  49             dec     cx                    
 13310  0bca           or      cx, dx                
 13312  23c9           and     cx, cx                
 13314  7503           jne     0x3407                
 13316  e91000         jmp     0x3417                
 13319  cc             int3                          
 13320  bf0660         mov     di, 0x6006            
 13323  bee860         mov     si, 0x60e8            
 13326  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 13331  cc             int3                          
 13332  e93d00         jmp     0x3454                
 13335  cc             int3                          
 13336  bbea61         mov     bx, 0x61ea            
 13339  b80260         mov     ax, 0x6002            
 13342  9a380c5c06     lcall   0x65c, 0xc38             ; RT#18  
 13347  ba0000         mov     dx, 0                 
 13350  7501           jne     0x3429                
 13352  4a             dec     dx                    
 13353  bbf061         mov     bx, 0x61f0            
 13356  9a380c5c06     lcall   0x65c, 0xc38             ; RT#18  
 13361  b90000         mov     cx, 0                 
 13364  7501           jne     0x3437                
 13366  49             dec     cx                    
 13367  0bca           or      cx, dx                
 13369  23c9           and     cx, cx                
 13371  7503           jne     0x3440                
 13373  e91000         jmp     0x3450                
 13376  cc             int3                          
 13377  bf0660         mov     di, 0x6006            
 13380  be3461         mov     si, 0x6134            
 13383  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 13388  cc             int3                          
 13389  e90400         jmp     0x3454                
 13392  cc             int3                          
 13393  e97cff         jmp     0x33d0                
 13396  cc             int3                          
 13397  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 13402  99             cdq                           
 13403  34cc           xor     al, 0xcc              
 13405  bfe860         mov     di, 0x60e8            
 13408  bec65f         mov     si, 0x5fc6            
 13411  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 13416  7403           je      0x346d                
 13418  e92800         jmp     0x3495                
 13421  cc             int3                          
 13422  bf225f         mov     di, 0x5f22            
 13425  be3461         mov     si, 0x6134            
 13428  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 13433  cc             int3                          
 13434  bf265f         mov     di, 0x5f26            
 13437  be3461         mov     si, 0x6134            
 13440  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 13445  cc             int3                          
 13446  bf2a5f         mov     di, 0x5f2a            
 13449  be3461         mov     si, 0x6134            
 13452  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 13457  cc             int3                          
 13458  e95bdb         jmp     0xff0                 
 13461  cc             int3                          
 13462  e950cd         jmp     0x1e9                 
 13465  cc             int3                          
 13466  cc             int3                          
 13467  33db           xor     bx, bx                
 13469  9a3b0a5c06     lcall   0x65c, 0xa3b             ; RT#30  
 13474  9a3b0a5c06     lcall   0x65c, 0xa3b             ; RT#30  
 13479  9a550a5c06     lcall   0x65c, 0xa55             ; RT#40  
 13484  cc             int3                          
 13485  33db           xor     bx, bx                
 13487  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 13492  bb0100         mov     bx, 1                 
 13495  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 13500  bb0700         mov     bx, 7                 
 13503  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 13508  cc             int3                          
 13509  bb5000         mov     bx, 0x50              
 13512  9a8b0e5c06     lcall   0x65c, 0xe8b             ; RT#59  
 13517  cc             int3                          
 13518  9a85075c06     lcall   0x65c, 0x785             ; RT#31  
 13523  cc             int3                          
 13524  bb1900         mov     bx, 0x19              
 13527  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 13532  bb0100         mov     bx, 1                 
 13535  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 13540  cc             int3                          
 13541  bb0300         mov     bx, 3                 
 13544  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 13549  33db           xor     bx, bx                
 13551  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 13556  cc             int3                          
 13557  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 13562  bb5662         mov     bx, 0x6256               ; = 'b 1'
 13565  9a93285c06     lcall   0x65c, 0x2893            ; RT#5     <<< bx='b 1'
 13570  cc             int3                          
 13571  bb0b00         mov     bx, 0xb               
 13574  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 13579  bb0600         mov     bx, 6                 
 13582  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 13587  cc             int3                          
 13588  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 13593  bb5c62         mov     bx, 0x625c               ; = 'bHELP '
 13596  9a93285c06     lcall   0x65c, 0x2893            ; RT#5     <<< bx='bHELP '
 13601  cc             int3                          
 13602  bb0300         mov     bx, 3                 
 13605  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 13610  33db           xor     bx, bx                
 13612  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 13617  cc             int3                          
 13618  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 13623  bb6662         mov     bx, 0x6266               ; = 'b 2'
 13626  9a93285c06     lcall   0x65c, 0x2893            ; RT#5     <<< bx='b 2'
 13631  cc             int3                          
 13632  bb0b00         mov     bx, 0xb               
 13635  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 13640  bb0600         mov     bx, 6                 
 13643  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 13648  cc             int3                          
 13649  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 13654  bb6c62         mov     bx, 0x626c               ; = 'bSAVE '
 13657  9a93285c06     lcall   0x65c, 0x2893            ; RT#5     <<< bx='bSAVE '
 13662  cc             int3                          
 13663  bb0300         mov     bx, 3                 
 13666  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 13671  33db           xor     bx, bx                
 13673  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 13678  cc             int3                          
 13679  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 13684  bb7662         mov     bx, 0x6276               ; = 'b 3'
 13687  9a93285c06     lcall   0x65c, 0x2893            ; RT#5     <<< bx='b 3'
 13692  cc             int3                          
 13693  bb0b00         mov     bx, 0xb               
 13696  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 13701  bb0600         mov     bx, 6                 
 13704  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 13709  cc             int3                          
 13710  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 13715  bb7c62         mov     bx, 0x627c               ; = 'bLOAD '
 13718  9a93285c06     lcall   0x65c, 0x2893            ; RT#5     <<< bx='bLOAD '
 13723  cc             int3                          
 13724  bb0300         mov     bx, 3                 
 13727  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 13732  33db           xor     bx, bx                
 13734  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 13739  cc             int3                          
 13740  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 13745  bb8662         mov     bx, 0x6286               ; = 'b  4'
 13748  9a93285c06     lcall   0x65c, 0x2893            ; RT#5     <<< bx='b  4'
 13753  cc             int3                          
 13754  bb0b00         mov     bx, 0xb               
 13757  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 13762  bb0600         mov     bx, 6                 
 13765  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 13770  cc             int3                          
 13771  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 13776  bb8e62         mov     bx, 0x628e               ; = 'bNEW GAME '
 13779  9a93285c06     lcall   0x65c, 0x2893            ; RT#5     <<< bx='bNEW GAME '
 13784  cc             int3                          
 13785  bb0300         mov     bx, 3                 
 13788  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 13793  33db           xor     bx, bx                
 13795  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 13800  cc             int3                          
 13801  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 13806  bbf460         mov     bx, 0x60f4            
 13809  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 13814  bb1800         mov     bx, 0x18              
 13817  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 13822  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 13827  cc             int3                          
 13828  bb0b00         mov     bx, 0xb               
 13831  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 13836  bb0600         mov     bx, 6                 
 13839  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 13844  cc             int3                          
 13845  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 13850  bb9c62         mov     bx, 0x629c               ; = 'bUP '
 13853  9a93285c06     lcall   0x65c, 0x2893            ; RT#5     <<< bx='bUP '
 13858  cc             int3                          
 13859  bb0300         mov     bx, 3                 
 13862  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 13867  33db           xor     bx, bx                
 13869  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 13874  cc             int3                          
 13875  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 13880  bbf460         mov     bx, 0x60f4            
 13883  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 13888  bb1900         mov     bx, 0x19              
 13891  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 13896  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 13901  cc             int3                          
 13902  bb0b00         mov     bx, 0xb               
 13905  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 13910  bb0600         mov     bx, 6                 
 13913  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 13918  cc             int3                          
 13919  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 13924  bba462         mov     bx, 0x62a4               ; = 'bDOWN '
 13927  9a93285c06     lcall   0x65c, 0x2893            ; RT#5     <<< bx='bDOWN '
 13932  cc             int3                          
 13933  bb0300         mov     bx, 3                 
 13936  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 13941  33db           xor     bx, bx                
 13943  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 13948  cc             int3                          
 13949  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 13954  bbf460         mov     bx, 0x60f4            
 13957  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 13962  bb1b00         mov     bx, 0x1b              
 13965  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 13970  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 13975  cc             int3                          
 13976  bb0b00         mov     bx, 0xb               
 13979  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 13984  bb0600         mov     bx, 6                 
 13987  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 13992  cc             int3                          
 13993  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 13998  bbae62         mov     bx, 0x62ae               ; = 'bLEFT '
 14001  9a93285c06     lcall   0x65c, 0x2893            ; RT#5     <<< bx='bLEFT '
 14006  cc             int3                          
 14007  bb0300         mov     bx, 3                 
 14010  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 14015  33db           xor     bx, bx                
 14017  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 14022  cc             int3                          
 14023  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 14028  bbf460         mov     bx, 0x60f4            
 14031  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 14036  bb1a00         mov     bx, 0x1a              
 14039  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 14044  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 14049  cc             int3                          
 14050  bb0b00         mov     bx, 0xb               
 14053  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 14058  bb0600         mov     bx, 6                 
 14061  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 14066  cc             int3                          
 14067  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 14072  bbb862         mov     bx, 0x62b8               ; = 'bRIGHT '
 14075  9a93285c06     lcall   0x65c, 0x2893            ; RT#5     <<< bx='bRIGHT '
 14080  cc             int3                          
 14081  bb0300         mov     bx, 3                 
 14084  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 14089  33db           xor     bx, bx                
 14091  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 14096  cc             int3                          
 14097  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 14102  bbc262         mov     bx, 0x62c2            
 14105  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 14110  bb1100         mov     bx, 0x11              
 14113  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 14118  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 14123  bbd900         mov     bx, 0xd9              
 14126  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 14131  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 14136  cc             int3                          
 14137  bb0b00         mov     bx, 0xb               
 14140  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 14145  bb0600         mov     bx, 6                 
 14148  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 14153  cc             int3                          
 14154  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 14159  bbc862         mov     bx, 0x62c8               ; = 'bENTER '
 14162  9a93285c06     lcall   0x65c, 0x2893            ; RT#5     <<< bx='bENTER '
 14167  cc             int3                          
 14168  bb0300         mov     bx, 3                 
 14171  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 14176  33db           xor     bx, bx                
 14178  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 14183  cc             int3                          
 14184  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 14189  bbd262         mov     bx, 0x62d2               ; = 'b  10'
 14192  9a93285c06     lcall   0x65c, 0x2893            ; RT#5     <<< bx='b  10'
 14197  cc             int3                          
 14198  bb0b00         mov     bx, 0xb               
 14201  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 14206  bb0600         mov     bx, 6                 
 14209  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 14214  cc             int3                          
 14215  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 14220  bbda62         mov     bx, 0x62da               ; = 'bEND '
 14223  9a93285c06     lcall   0x65c, 0x2893            ; RT#5     <<< bx='bEND '
 14228  cc             int3                          
 14229  bb0700         mov     bx, 7                 
 14232  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 14237  33db           xor     bx, bx                
 14239  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 14244  cc             int3                          
 14245  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 14250  bbf460         mov     bx, 0x60f4            
 14253  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 14258  cc             int3                          
 14259  bb00b8         mov     bx, 0xb800            
 14262  9ac3125c06     lcall   0x65c, 0x12c3            ; RT#61  
 14267  cc             int3                          
 14268  bb9e0f         mov     bx, 0xf9e             
 14271  b82000         mov     ax, 0x20              
 14274  8e1e9a00       mov     ds, word ptr [0x9a]   
 14278  8807           mov     byte ptr [bx], al     
 14280  06             push    es                    
 14281  1f             pop     ds                    
 14282  cc             int3                          
 14283  bb9f0f         mov     bx, 0xf9f             
 14286  b80700         mov     ax, 7                 
 14289  8e1e9a00       mov     ds, word ptr [0x9a]   
 14293  8807           mov     byte ptr [bx], al     
 14295  06             push    es                    
 14296  1f             pop     ds                    
 14297  cc             int3                          
 14298  bb0f00         mov     bx, 0xf               
 14301  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 14306  bb0400         mov     bx, 4                 
 14309  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 14314  cc             int3                          
 14315  bb0100         mov     bx, 1                 
 14318  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 14323  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 14328  cc             int3                          
 14329  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 14334  bb2000         mov     bx, 0x20              
 14337  baf460         mov     dx, 0x60f4            
 14340  8bcb           mov     cx, bx                
 14342  9a471e5c06     lcall   0x65c, 0x1e47            ; RT#16  
 14347  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 14352  bbe262         mov     bx, 0x62e2               ; = "bLU's   3D   Game"
 14355  9a93285c06     lcall   0x65c, 0x2893            ; RT#5     <<< bx="bLU's   3D   Game"
 14360  8bd9           mov     bx, cx                
 14362  9a471e5c06     lcall   0x65c, 0x1e47            ; RT#16  
 14367  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 14372  cc             int3                          
 14373  bb0e00         mov     bx, 0xe               
 14376  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 14381  bb0300         mov     bx, 3                 
 14384  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 14389  cc             int3                          
 14390  bb0200         mov     bx, 2                 
 14393  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 14398  bb0100         mov     bx, 1                 
 14401  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 14406  cc             int3                          
 14407  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 14412  bb5000         mov     bx, 0x50              
 14415  bacd00         mov     dx, 0xcd              
 14418  9a401e5c06     lcall   0x65c, 0x1e40            ; RT#47  
 14423  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 14428  cc             int3                          
 14429  bb0300         mov     bx, 3                 
 14432  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 14437  bb0100         mov     bx, 1                 
 14440  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 14445  cc             int3                          
 14446  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 14451  bb1000         mov     bx, 0x10              
 14454  baf460         mov     dx, 0x60f4            
 14457  9a471e5c06     lcall   0x65c, 0x1e47            ; RT#16  
 14462  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 14467  bbf662         mov     bx, 0x62f6            
 14470  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 14475  bb0f00         mov     bx, 0xf               
 14478  8bcb           mov     cx, bx                
 14480  9a471e5c06     lcall   0x65c, 0x1e47            ; RT#16  
 14485  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 14490  bbfc62         mov     bx, 0x62fc            
 14493  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 14498  8bd9           mov     bx, cx                
 14500  9a471e5c06     lcall   0x65c, 0x1e47            ; RT#16  
 14505  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 14510  bb0263         mov     bx, 0x6302            
 14513  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 14518  8bd9           mov     bx, cx                
 14520  9a471e5c06     lcall   0x65c, 0x1e47            ; RT#16  
 14525  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 14530  bb0863         mov     bx, 0x6308            
 14533  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 14538  8bd9           mov     bx, cx                
 14540  9a471e5c06     lcall   0x65c, 0x1e47            ; RT#16  
 14545  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 14550  cc             int3                          
 14551  bb0400         mov     bx, 4                 
 14554  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 14559  bb0100         mov     bx, 1                 
 14562  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 14567  cc             int3                          
 14568  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 14573  bb5000         mov     bx, 0x50              
 14576  bac400         mov     dx, 0xc4              
 14579  9a401e5c06     lcall   0x65c, 0x1e40            ; RT#47  
 14584  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 14589  cc             int3                          
 14590  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 14595  b63b           mov     dh, 0x3b              
 14597  cc             int3                          
 14598  bb0e00         mov     bx, 0xe               
 14601  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 14606  bb0100         mov     bx, 1                 
 14609  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 14614  cc             int3                          
 14615  bee860         mov     si, 0x60e8            
 14618  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
 14623  e95a00         jmp     0x397c                
 14626  cc             int3                          
 14627  bf0e5f         mov     di, 0x5f0e            
 14630  be0e63         mov     si, 0x630e            
 14633  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 14638  cc             int3                          
 14639  bf0a60         mov     di, 0x600a            
 14642  be1263         mov     si, 0x6312            
 14645  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 14650  cc             int3                          
 14651  be865f         mov     si, 0x5f86            
 14654  9a240f5c06     lcall   0x65c, 0xf24             ; RT#26  
 14659  04bf           add     al, 0xbf              
 14661  16             push    ss                    
 14662  639acb15       arpl    word ptr [bp + si + 0x15cb], bx
 14666  5c             pop     sp                    
 14667  06             push    es                    
 14668  bf8e5f         mov     di, 0x5f8e            
 14671  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 14676  cc             int3                          
 14677  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 14682  94             xchg    sp, ax                
 14683  39cc           cmp     sp, cx                
 14685  bf0e5f         mov     di, 0x5f0e            
 14688  be1a63         mov     si, 0x631a            
 14691  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 14696  cc             int3                          
 14697  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 14702  e33a           jcxz    0x39aa                
 14704  cc             int3                          
 14705  bfe860         mov     di, 0x60e8            
 14708  be865f         mov     si, 0x5f86            
 14711  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 14716  bf865f         mov     di, 0x5f86            
 14719  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 14724  8bf7           mov     si, di                
 14726  bf4461         mov     di, 0x6144            
 14729  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 14734  7692           jbe     0x3922                
 14736  cc             int3                          
 14737  e9cf04         jmp     0x3e63                
 14740  cc             int3                          
 14741  bee860         mov     si, 0x60e8            
 14744  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
 14749  e92601         jmp     0x3ac6                
 14752  cc             int3                          
 14753  bfec60         mov     di, 0x60ec            
 14756  bece5e         mov     si, 0x5ece            
 14759  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 14764  9a301c5c06     lcall   0x65c, 0x1c30            ; RT#21  
 14769  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 14774  be8e5f         mov     si, 0x5f8e            
 14777  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 14782  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 14787  cc             int3                          
 14788  bb0700         mov     bx, 7                 
 14791  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 14796  bb0100         mov     bx, 1                 
 14799  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 14804  cc             int3                          
 14805  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 14810  bbf662         mov     bx, 0x62f6            
 14813  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 14818  cc             int3                          
 14819  bb0e00         mov     bx, 0xe               
 14822  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 14827  bb0100         mov     bx, 1                 
 14830  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 14835  cc             int3                          
 14836  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 14841  be0e5f         mov     si, 0x5f0e            
 14844  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 14849  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 14854  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 14859  cc             int3                          
 14860  bb0700         mov     bx, 7                 
 14863  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 14868  bb0100         mov     bx, 1                 
 14871  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 14876  cc             int3                          
 14877  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 14882  bbfc62         mov     bx, 0x62fc            
 14885  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 14890  cc             int3                          
 14891  bb0e00         mov     bx, 0xe               
 14894  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 14899  bb0100         mov     bx, 1                 
 14902  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 14907  cc             int3                          
 14908  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 14913  be0e5f         mov     si, 0x5f0e            
 14916  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 14921  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 14926  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 14931  cc             int3                          
 14932  bb0700         mov     bx, 7                 
 14935  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 14940  bb0100         mov     bx, 1                 
 14943  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 14948  cc             int3                          
 14949  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 14954  bb0263         mov     bx, 0x6302            
 14957  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 14962  cc             int3                          
 14963  bb0e00         mov     bx, 0xe               
 14966  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 14971  bb0100         mov     bx, 1                 
 14974  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 14979  cc             int3                          
 14980  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 14985  be0e5f         mov     si, 0x5f0e            
 14988  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 14993  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 14998  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 15003  cc             int3                          
 15004  bb0700         mov     bx, 7                 
 15007  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 15012  bb0100         mov     bx, 1                 
 15015  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 15020  cc             int3                          
 15021  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 15026  bb0863         mov     bx, 0x6308            
 15029  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 15034  cc             int3                          
 15035  bf3461         mov     di, 0x6134            
 15038  bece5e         mov     si, 0x5ece            
 15041  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 15046  bfce5e         mov     di, 0x5ece            
 15049  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 15054  8bf7           mov     si, di                
 15056  bf1e63         mov     di, 0x631e            
 15059  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 15064  7703           ja      0x3add                
 15066  e9c3fe         jmp     0x39a0                
 15069  cc             int3                          
 15070  9a271b5c06     lcall   0x65c, 0x1b27            ; RT#20  
 15075  cc             int3                          
 15076  bb0e00         mov     bx, 0xe               
 15079  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 15084  bb0100         mov     bx, 1                 
 15087  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 15092  cc             int3                          
 15093  bee860         mov     si, 0x60e8            
 15096  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
 15101  e99900         jmp     0x3b99                
 15104  cc             int3                          
 15105  bfe460         mov     di, 0x60e4            
 15108  bece5e         mov     si, 0x5ece            
 15111  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 15116  9a301c5c06     lcall   0x65c, 0x1c30            ; RT#21  
 15121  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 15126  be8e5f         mov     si, 0x5f8e            
 15129  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 15134  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 15139  cc             int3                          
 15140  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 15145  be0e5f         mov     si, 0x5f0e            
 15148  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 15153  8bd3           mov     dx, bx                
 15155  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 15160  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 15165  be0a60         mov     si, 0x600a            
 15168  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 15173  8bcb           mov     cx, bx                
 15175  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 15180  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 15185  8bda           mov     bx, dx                
 15187  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 15192  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 15197  8bd9           mov     bx, cx                
 15199  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 15204  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 15209  8bda           mov     bx, dx                
 15211  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 15216  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 15221  8bd9           mov     bx, cx                
 15223  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 15228  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 15233  8bda           mov     bx, dx                
 15235  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 15240  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 15245  cc             int3                          
 15246  bf3461         mov     di, 0x6134            
 15249  bece5e         mov     si, 0x5ece            
 15252  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 15257  bfce5e         mov     di, 0x5ece            
 15260  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 15265  8bf7           mov     si, di                
 15267  bfe460         mov     di, 0x60e4            
 15270  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 15275  7703           ja      0x3bb0                
 15277  e950ff         jmp     0x3b00                
 15280  cc             int3                          
 15281  9a271b5c06     lcall   0x65c, 0x1b27            ; RT#20  
 15286  cc             int3                          
 15287  bb0200         mov     bx, 2                 
 15290  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 15295  bb0100         mov     bx, 1                 
 15298  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 15303  cc             int3                          
 15304  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 15309  bbd500         mov     bx, 0xd5              
 15312  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 15317  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 15322  cc             int3                          
 15323  bb0300         mov     bx, 3                 
 15326  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 15331  bb0100         mov     bx, 1                 
 15334  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 15339  cc             int3                          
 15340  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 15345  bbb300         mov     bx, 0xb3              
 15348  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 15353  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 15358  cc             int3                          
 15359  bb0200         mov     bx, 2                 
 15362  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 15367  bb5000         mov     bx, 0x50              
 15370  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 15375  cc             int3                          
 15376  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 15381  bbb800         mov     bx, 0xb8              
 15384  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 15389  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 15394  cc             int3                          
 15395  bb0300         mov     bx, 3                 
 15398  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 15403  bb5000         mov     bx, 0x50              
 15406  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 15411  cc             int3                          
 15412  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 15417  bbb300         mov     bx, 0xb3              
 15420  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 15425  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 15430  cc             int3                          
 15431  bb0400         mov     bx, 4                 
 15434  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 15439  bb5000         mov     bx, 0x50              
 15442  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 15447  cc             int3                          
 15448  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 15453  bbd900         mov     bx, 0xd9              
 15456  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 15461  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 15466  cc             int3                          
 15467  bb0400         mov     bx, 4                 
 15470  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 15475  bb0100         mov     bx, 1                 
 15478  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 15483  cc             int3                          
 15484  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 15489  bbb300         mov     bx, 0xb3              
 15492  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 15497  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 15502  bb2263         mov     bx, 0x6322               ; = 'c   o'
 15505  9a93285c06     lcall   0x65c, 0x2893            ; RT#5     <<< bx='c   o'
 15510  bbda00         mov     bx, 0xda              
 15513  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 15518  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 15523  cc             int3                          
 15524  beec60         mov     si, 0x60ec            
 15527  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
 15532  e94b00         jmp     0x3cfa                
 15535  cc             int3                          
 15536  bece5e         mov     si, 0x5ece            
 15539  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 15544  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 15549  bb0100         mov     bx, 1                 
 15552  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 15557  cc             int3                          
 15558  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 15563  bbb300         mov     bx, 0xb3              
 15566  8bd3           mov     dx, bx                
 15568  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 15573  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 15578  bb2263         mov     bx, 0x6322               ; = 'c   o'
 15581  9a93285c06     lcall   0x65c, 0x2893            ; RT#5     <<< bx='c   o'
 15586  8bda           mov     bx, dx                
 15588  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 15593  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 15598  cc             int3                          
 15599  bfe860         mov     di, 0x60e8            
 15602  bece5e         mov     si, 0x5ece            
 15605  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 15610  bfce5e         mov     di, 0x5ece            
 15613  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 15618  8bf7           mov     si, di                
 15620  bf2a63         mov     di, 0x632a            
 15623  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 15628  76a1           jbe     0x3caf                
 15630  cc             int3                          
 15631  bb0d00         mov     bx, 0xd               
 15634  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 15639  bb0100         mov     bx, 1                 
 15642  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 15647  cc             int3                          
 15648  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 15653  bbc000         mov     bx, 0xc0              
 15656  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 15661  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 15666  bb0300         mov     bx, 3                 
 15669  bac400         mov     dx, 0xc4              
 15672  9a401e5c06     lcall   0x65c, 0x1e40            ; RT#47  
 15677  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 15682  bbd900         mov     bx, 0xd9              
 15685  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 15690  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 15695  cc             int3                          
 15696  bee860         mov     si, 0x60e8            
 15699  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
 15704  e93e00         jmp     0x3d99                
 15707  cc             int3                          
 15708  bece5e         mov     si, 0x5ece            
 15711  9a240f5c06     lcall   0x65c, 0xf24             ; RT#26  
 15716  01bf4461       add     word ptr [bx + 0x6144], di
 15720  9acb155c06     lcall   0x65c, 0x15cb            ; RT#27  
 15725  9a301c5c06     lcall   0x65c, 0x1c30            ; RT#21  
 15730  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 15735  bb0200         mov     bx, 2                 
 15738  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 15743  cc             int3                          
 15744  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 15749  bbce5e         mov     bx, 0x5ece            
 15752  9a98285c06     lcall   0x65c, 0x2898            ; RT#35  
 15757  cc             int3                          
 15758  bfe860         mov     di, 0x60e8            
 15761  bece5e         mov     si, 0x5ece            
 15764  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 15769  bfce5e         mov     di, 0x5ece            
 15772  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 15777  8bf7           mov     si, di                
 15779  bf4461         mov     di, 0x6144            
 15782  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 15787  76ae           jbe     0x3d5b                
 15789  cc             int3                          
 15790  9a271b5c06     lcall   0x65c, 0x1b27            ; RT#20  
 15795  cc             int3                          
 15796  bee860         mov     si, 0x60e8            
 15799  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
 15804  e98d00         jmp     0x3e4c                
 15807  cc             int3                          
 15808  bee860         mov     si, 0x60e8            
 15811  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
 15816  e96100         jmp     0x3e2c                
 15819  cc             int3                          
 15820  bece5e         mov     si, 0x5ece            
 15823  9a240f5c06     lcall   0x65c, 0xf24             ; RT#26  
 15828  02be865f       add     bh, byte ptr [bp + 0x5f86]
 15832  9a370d5c06     lcall   0x65c, 0xd37             ; RT#53  
 15837  819a240f5c06   sbb     word ptr [bp + si + 0xf24], 0x65c
 15843  018bde9a       add     word ptr [bp + di - 0x6522], cx
 15847  d015           rcl     byte ptr [di]         
 15849  5c             pop     sp                    
 15850  06             push    es                    
 15851  818bd39a301c   or      word ptr [bp + di - 0x652d], 0x1c30
 15857  5c             pop     sp                    
 15858  06             push    es                    
 15859  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 15864  8bf2           mov     si, dx                
 15866  9a240f5c06     lcall   0x65c, 0xf24             ; RT#26  
 15871  04bf           add     al, 0xbf              
 15873  2e639acb15     arpl    word ptr cs:[bp + si + 0x15cb], bx
 15878  5c             pop     sp                    
 15879  06             push    es                    
 15880  9a301c5c06     lcall   0x65c, 0x1c30            ; RT#21  
 15885  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 15890  cc             int3                          
 15891  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 15896  bb865f         mov     bx, 0x5f86            
 15899  9a98285c06     lcall   0x65c, 0x2898            ; RT#35  
 15904  cc             int3                          
 15905  bfe860         mov     di, 0x60e8            
 15908  be865f         mov     si, 0x5f86            
 15911  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 15916  bf865f         mov     di, 0x5f86            
 15919  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 15924  8bf7           mov     si, di                
 15926  bf4461         mov     di, 0x6144            
 15929  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 15934  768b           jbe     0x3dcb                
 15936  cc             int3                          
 15937  bfe860         mov     di, 0x60e8            
 15940  bece5e         mov     si, 0x5ece            
 15943  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 15948  bfce5e         mov     di, 0x5ece            
 15951  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 15956  8bf7           mov     si, di                
 15958  bf4461         mov     di, 0x6144            
 15961  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 15966  7703           ja      0x3e63                
 15968  e95cff         jmp     0x3dbf                
 15971  cc             int3                          
 15972  bb0f00         mov     bx, 0xf               
 15975  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 15980  bb0500         mov     bx, 5                 
 15983  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 15988  cc             int3                          
 15989  bb1400         mov     bx, 0x14              
 15992  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 15997  bb0100         mov     bx, 1                 
 16000  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 16005  cc             int3                          
 16006  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 16011  bbc900         mov     bx, 0xc9              
 16014  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 16019  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 16024  bb4e00         mov     bx, 0x4e              
 16027  bacd00         mov     dx, 0xcd              
 16030  9a401e5c06     lcall   0x65c, 0x1e40            ; RT#47  
 16035  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 16040  bbbb00         mov     bx, 0xbb              
 16043  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 16048  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 16053  cc             int3                          
 16054  bee860         mov     si, 0x60e8            
 16057  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
 16062  e95d00         jmp     0x3f1e                
 16065  cc             int3                          
 16066  bf3263         mov     di, 0x6332            
 16069  bece5e         mov     si, 0x5ece            
 16072  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 16077  9a301c5c06     lcall   0x65c, 0x1c30            ; RT#21  
 16082  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 16087  bb0100         mov     bx, 1                 
 16090  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 16095  cc             int3                          
 16096  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 16101  bbba00         mov     bx, 0xba              
 16104  8bd3           mov     dx, bx                
 16106  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 16111  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 16116  bb4e00         mov     bx, 0x4e              
 16119  8bca           mov     cx, dx                
 16121  baf460         mov     dx, 0x60f4            
 16124  9a471e5c06     lcall   0x65c, 0x1e47            ; RT#16  
 16129  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 16134  8bd9           mov     bx, cx                
 16136  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 16141  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 16146  cc             int3                          
 16147  bfe860         mov     di, 0x60e8            
 16150  bece5e         mov     si, 0x5ece            
 16153  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 16158  bfce5e         mov     di, 0x5ece            
 16161  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 16166  8bf7           mov     si, di                
 16168  bf3461         mov     di, 0x6134            
 16171  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 16176  768f           jbe     0x3ec1                
 16178  cc             int3                          
 16179  bb1700         mov     bx, 0x17              
 16182  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 16187  bb0100         mov     bx, 1                 
 16190  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 16195  cc             int3                          
 16196  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 16201  bbc800         mov     bx, 0xc8              
 16204  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 16209  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 16214  bb4e00         mov     bx, 0x4e              
 16217  bacd00         mov     dx, 0xcd              
 16220  9a401e5c06     lcall   0x65c, 0x1e40            ; RT#47  
 16225  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 16230  cc             int3                          
 16231  bb00b8         mov     bx, 0xb800            
 16234  9ac3125c06     lcall   0x65c, 0x12c3            ; RT#61  
 16239  cc             int3                          
 16240  bb5e0e         mov     bx, 0xe5e             
 16243  b8bc00         mov     ax, 0xbc              
 16246  8e1e9a00       mov     ds, word ptr [0x9a]   
 16250  8807           mov     byte ptr [bx], al     
 16252  06             push    es                    
 16253  1f             pop     ds                    
 16254  cc             int3                          
 16255  bb5f0e         mov     bx, 0xe5f             
 16258  b85f00         mov     ax, 0x5f              
 16261  8e1e9a00       mov     ds, word ptr [0x9a]   
 16265  8807           mov     byte ptr [bx], al     
 16267  06             push    es                    
 16268  1f             pop     ds                    
 16269  cc             int3                          
 16270  bb0d00         mov     bx, 0xd               
 16273  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 16278  bb0500         mov     bx, 5                 
 16281  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 16286  cc             int3                          
 16287  bb1500         mov     bx, 0x15              
 16290  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 16295  bb0200         mov     bx, 2                 
 16298  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 16303  cc             int3                          
 16304  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 16309  bb3663         mov     bx, 0x6336               ; = 'c LAST MOVE:'
 16312  9a93285c06     lcall   0x65c, 0x2893            ; RT#5     <<< bx='c LAST MOVE:'
 16317  bb1c00         mov     bx, 0x1c              
 16320  baf460         mov     dx, 0x60f4            
 16323  9a471e5c06     lcall   0x65c, 0x1e47            ; RT#16  
 16328  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 16333  cc             int3                          
 16334  bb1500         mov     bx, 0x15              
 16337  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 16342  bb2800         mov     bx, 0x28              
 16345  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 16350  cc             int3                          
 16351  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 16356  bb4663         mov     bx, 0x6346               ; = 'cMADE BY:'
 16359  9a93285c06     lcall   0x65c, 0x2893            ; RT#5     <<< bx='cMADE BY:'
 16364  bb1f00         mov     bx, 0x1f              
 16367  baf460         mov     dx, 0x60f4            
 16370  9a471e5c06     lcall   0x65c, 0x1e47            ; RT#16  
 16375  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 16380  cc             int3                          
 16381  9a271b5c06     lcall   0x65c, 0x1b27            ; RT#20  
 16386  cc             int3                          
 16387  bfe860         mov     di, 0x60e8            
 16390  befa5e         mov     si, 0x5efa            
 16393  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 16398  7503           jne     0x4013                
 16400  e9ae00         jmp     0x40c1                
 16403  cc             int3                          
 16404  bb9e5f         mov     bx, 0x5f9e            
 16407  9aec1c5c06     lcall   0x65c, 0x1cec            ; RT#25  
 16412  ba5000         mov     dx, 0x50              
 16415  2bd3           sub     dx, bx                
 16417  83c2ed         add     dx, -0x13             
 16420  8bda           mov     bx, dx                
 16422  9a9d1b5c06     lcall   0x65c, 0x1b9d            ; RT#32  
 16427  bf5263         mov     di, 0x6352            
 16430  9a03175c06     lcall   0x65c, 0x1703            ; RT#57  
 16435  bf5663         mov     di, 0x6356            
 16438  9acb155c06     lcall   0x65c, 0x15cb            ; RT#27  
 16443  bf0e60         mov     di, 0x600e            
 16446  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 16451  cc             int3                          
 16452  bb1f00         mov     bx, 0x1f              
 16455  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 16460  bb0400         mov     bx, 4                 
 16463  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 16468  cc             int3                          
 16469  bb1500         mov     bx, 0x15              
 16472  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 16477  bb0200         mov     bx, 2                 
 16480  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 16485  cc             int3                          
 16486  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 16491  be0e60         mov     si, 0x600e            
 16494  8bd6           mov     dx, si                
 16496  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 16501  8bca           mov     cx, dx                
 16503  baf460         mov     dx, 0x60f4            
 16506  9a471e5c06     lcall   0x65c, 0x1e47            ; RT#16  
 16511  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 16516  bb5a63         mov     bx, 0x635a               ; = 'c!!!   '
 16519  9a93285c06     lcall   0x65c, 0x2893            ; RT#5     <<< bx='c!!!   '
 16524  bb9e5f         mov     bx, 0x5f9e            
 16527  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 16532  bb6463         mov     bx, 0x6364               ; = 'c  WIN   !!!'
 16535  9a93285c06     lcall   0x65c, 0x2893            ; RT#5     <<< bx='c  WIN   !!!'
 16540  8bf1           mov     si, cx                
 16542  bfe860         mov     di, 0x60e8            
 16545  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 16550  9a301c5c06     lcall   0x65c, 0x1c30            ; RT#21  
 16555  9a471e5c06     lcall   0x65c, 0x1e47            ; RT#16  
 16560  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 16565  cc             int3                          
 16566  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 16571  6f             outsw   dx, word ptr [si]     
 16572  42             inc     dx                    
 16573  cc             int3                          
 16574  e9fc00         jmp     0x41bd                
 16577  cc             int3                          
 16578  bb9a5f         mov     bx, 0x5f9a            
 16581  9aec1c5c06     lcall   0x65c, 0x1cec            ; RT#25  
 16586  ba5000         mov     dx, 0x50              
 16589  2bd3           sub     dx, bx                
 16591  83c2ed         add     dx, -0x13             
 16594  8bda           mov     bx, dx                
 16596  9a9d1b5c06     lcall   0x65c, 0x1b9d            ; RT#32  
 16601  bf5263         mov     di, 0x6352            
 16604  9a03175c06     lcall   0x65c, 0x1703            ; RT#57  
 16609  bf5663         mov     di, 0x6356            
 16612  9acb155c06     lcall   0x65c, 0x15cb            ; RT#27  
 16617  bf0e60         mov     di, 0x600e            
 16620  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 16625  cc             int3                          
 16626  bb1f00         mov     bx, 0x1f              
 16629  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 16634  bb0400         mov     bx, 4                 
 16637  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 16642  cc             int3                          
 16643  bb1500         mov     bx, 0x15              
 16646  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 16651  bb0200         mov     bx, 2                 
 16654  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 16659  cc             int3                          
 16660  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 16665  be0e60         mov     si, 0x600e            
 16668  8bd6           mov     dx, si                
 16670  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 16675  8bca           mov     cx, dx                
 16677  baf460         mov     dx, 0x60f4            
 16680  9a471e5c06     lcall   0x65c, 0x1e47            ; RT#16  
 16685  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 16690  bb5a63         mov     bx, 0x635a               ; = 'c!!!   '
 16693  9a93285c06     lcall   0x65c, 0x2893            ; RT#5     <<< bx='c!!!   '
 16698  bb9a5f         mov     bx, 0x5f9a            
 16701  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 16706  bb6463         mov     bx, 0x6364               ; = 'c  WIN   !!!'
 16709  9a93285c06     lcall   0x65c, 0x2893            ; RT#5     <<< bx='c  WIN   !!!'
 16714  8bf1           mov     si, cx                
 16716  bfe860         mov     di, 0x60e8            
 16719  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 16724  9a301c5c06     lcall   0x65c, 0x1c30            ; RT#21  
 16729  9a471e5c06     lcall   0x65c, 0x1e47            ; RT#16  
 16734  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 16739  cc             int3                          
 16740  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 16745  6f             outsw   dx, word ptr [si]     
 16746  42             inc     dx                    
 16747  cc             int3                          
 16748  e94e00         jmp     0x41bd                
 16751  cc             int3                          
 16752  bb1f00         mov     bx, 0x1f              
 16755  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 16760  bb0400         mov     bx, 4                 
 16763  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 16768  cc             int3                          
 16769  bb1500         mov     bx, 0x15              
 16772  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 16777  bb0200         mov     bx, 2                 
 16780  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 16785  cc             int3                          
 16786  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 16791  bb1f00         mov     bx, 0x1f              
 16794  baf460         mov     dx, 0x60f4            
 16797  8bcb           mov     cx, bx                
 16799  9a471e5c06     lcall   0x65c, 0x1e47            ; RT#16  
 16804  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 16809  bb7463         mov     bx, 0x6374               ; = 'c!!!   DRAW   !!!#'
 16812  9a93285c06     lcall   0x65c, 0x2893            ; RT#5     <<< bx='c!!!   DRAW   !!!#'
 16817  8bd9           mov     bx, cx                
 16819  9a471e5c06     lcall   0x65c, 0x1e47            ; RT#16  
 16824  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 16829  cc             int3                          
 16830  bb0d00         mov     bx, 0xd               
 16833  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 16838  bb0500         mov     bx, 5                 
 16841  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 16846  cc             int3                          
 16847  bb1600         mov     bx, 0x16              
 16850  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 16855  bb0200         mov     bx, 2                 
 16858  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 16863  cc             int3                          
 16864  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 16869  bb0a00         mov     bx, 0xa               
 16872  baf460         mov     dx, 0x60f4            
 16875  8bcb           mov     cx, bx                
 16877  9a471e5c06     lcall   0x65c, 0x1e47            ; RT#16  
 16882  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 16887  bb8863         mov     bx, 0x6388               ; = 'cWould you like to play again? (Y/N)'
 16890  9a93285c06     lcall   0x65c, 0x2893            ; RT#5     <<< bx='cWould you like to play again? (Y/N)'
 16895  8bd9           mov     bx, cx                
 16897  9a471e5c06     lcall   0x65c, 0x1e47            ; RT#16  
 16902  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 16907  cc             int3                          
 16908  9a071d5c06     lcall   0x65c, 0x1d07            ; RT#33  
 16913  ba0260         mov     dx, 0x6002            
 16916  9ac80b5c06     lcall   0x65c, 0xbc8             ; RT#19  
 16921  cc             int3                          
 16922  bbde61         mov     bx, 0x61de            
 16925  b80260         mov     ax, 0x6002            
 16928  9a380c5c06     lcall   0x65c, 0xc38             ; RT#18  
 16933  ba0000         mov     dx, 0                 
 16936  7501           jne     0x422b                
 16938  4a             dec     dx                    
 16939  bbe461         mov     bx, 0x61e4            
 16942  9a380c5c06     lcall   0x65c, 0xc38             ; RT#18  
 16947  b90000         mov     cx, 0                 
 16950  7501           jne     0x4239                
 16952  49             dec     cx                    
 16953  0bca           or      cx, dx                
 16955  23c9           and     cx, cx                
 16957  7403           je      0x4242                
 16959  e9f2bd         jmp     0x34                  
 16962  cc             int3                          
 16963  bbea61         mov     bx, 0x61ea            
 16966  b80260         mov     ax, 0x6002            
 16969  9a380c5c06     lcall   0x65c, 0xc38             ; RT#18  
 16974  ba0000         mov     dx, 0                 
 16977  7501           jne     0x4254                
 16979  4a             dec     dx                    
 16980  bbf061         mov     bx, 0x61f0            
 16983  9a380c5c06     lcall   0x65c, 0xc38             ; RT#18  
 16988  b90000         mov     cx, 0                 
 16991  7501           jne     0x4262                
 16993  49             dec     cx                    
 16994  0bca           or      cx, dx                
 16996  23c9           and     cx, cx                
 16998  7403           je      0x426b                
 17000  e9df1d         jmp     0x604a                
 17003  cc             int3                          
 17004  e99cff         jmp     0x420b                
 17007  cc             int3                          
 17008  bb1f00         mov     bx, 0x1f              
 17011  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 17016  bb0400         mov     bx, 4                 
 17019  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 17024  cc             int3                          
 17025  bee860         mov     si, 0x60e8            
 17028  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
 17033  e94201         jmp     0x43ce                
 17036  cc             int3                          
 17037  bece5e         mov     si, 0x5ece            
 17040  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 17045  8bf3           mov     si, bx                
 17047  d1e6           shl     si, 1                 
 17049  d1e6           shl     si, 1                 
 17051  81c67e5e       add     si, 0x5e7e            
 17055  bfe25e         mov     di, 0x5ee2            
 17058  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 17063  cc             int3                          
 17064  bece5e         mov     si, 0x5ece            
 17067  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 17072  8bf3           mov     si, bx                
 17074  d1e6           shl     si, 1                 
 17076  d1e6           shl     si, 1                 
 17078  81c6925e       add     si, 0x5e92            
 17082  bfe65e         mov     di, 0x5ee6            
 17085  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 17090  cc             int3                          
 17091  bece5e         mov     si, 0x5ece            
 17094  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 17099  8bf3           mov     si, bx                
 17101  d1e6           shl     si, 1                 
 17103  d1e6           shl     si, 1                 
 17105  81c6a65e       add     si, 0x5ea6            
 17109  bfea5e         mov     di, 0x5eea            
 17112  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 17117  cc             int3                          
 17118  bee25e         mov     si, 0x5ee2            
 17121  9a240f5c06     lcall   0x65c, 0xf24             ; RT#26  
 17126  04be           add     al, 0xbe              
 17128  ea5e9a370d     ljmp    0xd37:0x9a5e          
 17133  5c             pop     sp                    
 17134  06             push    es                    
 17135  819a240f5c06   sbb     word ptr [bp + si + 0xf24], 0x65c
 17141  019ad015       add     word ptr [bp + si + 0x15d0], bx
 17145  5c             pop     sp                    
 17146  06             push    es                    
 17147  81bf4c619acb   cmp     word ptr [bx + 0x614c], 0xcb9a
 17153  155c06         adc     ax, 0x65c             
 17156  bf8e5f         mov     di, 0x5f8e            
 17159  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 17164  cc             int3                          
 17165  bfe860         mov     di, 0x60e8            
 17168  be925f         mov     si, 0x5f92            
 17171  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 17176  7503           jne     0x431d                
 17178  e92200         jmp     0x433f                
 17181  cc             int3                          
 17182  bf3461         mov     di, 0x6134            
 17185  befa5e         mov     si, 0x5efa            
 17188  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 17193  7503           jne     0x432e                
 17195  e92200         jmp     0x4350                
 17198  cc             int3                          
 17199  bfe860         mov     di, 0x60e8            
 17202  befa5e         mov     si, 0x5efa            
 17205  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 17210  7503           jne     0x433f                
 17212  e94c00         jmp     0x438b                
 17215  cc             int3                          
 17216  bf3461         mov     di, 0x6134            
 17219  befa5e         mov     si, 0x5efa            
 17222  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 17227  7503           jne     0x4350                
 17229  e93b00         jmp     0x438b                
 17232  cc             int3                          
 17233  bee65e         mov     si, 0x5ee6            
 17236  9a240f5c06     lcall   0x65c, 0xf24             ; RT#26  
 17241  01bf4461       add     word ptr [bx + 0x6144], di
 17245  9acb155c06     lcall   0x65c, 0x15cb            ; RT#27  
 17250  9a301c5c06     lcall   0x65c, 0x1c30            ; RT#21  
 17255  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 17260  be8e5f         mov     si, 0x5f8e            
 17263  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 17268  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 17273  cc             int3                          
 17274  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 17279  bb5061         mov     bx, 0x6150            
 17282  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 17287  cc             int3                          
 17288  e93700         jmp     0x43c2                
 17291  cc             int3                          
 17292  bee65e         mov     si, 0x5ee6            
 17295  9a240f5c06     lcall   0x65c, 0xf24             ; RT#26  
 17300  01bf4461       add     word ptr [bx + 0x6144], di
 17304  9acb155c06     lcall   0x65c, 0x15cb            ; RT#27  
 17309  9a301c5c06     lcall   0x65c, 0x1c30            ; RT#21  
 17314  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 17319  be8e5f         mov     si, 0x5f8e            
 17322  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 17327  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 17332  cc             int3                          
 17333  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 17338  bb5661         mov     bx, 0x6156            
 17341  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 17346  cc             int3                          
 17347  bfe860         mov     di, 0x60e8            
 17350  bece5e         mov     si, 0x5ece            
 17353  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 17358  bfce5e         mov     di, 0x5ece            
 17361  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 17366  8bf7           mov     si, di                
 17368  bf4461         mov     di, 0x6144            
 17371  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 17376  7703           ja      0x43e5                
 17378  e9a7fe         jmp     0x428c                
 17381  cc             int3                          
 17382  bb0700         mov     bx, 7                 
 17385  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 17390  33db           xor     bx, bx                
 17392  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 17397  cc             int3                          
 17398  9a271b5c06     lcall   0x65c, 0x1b27            ; RT#20  
 17403  cc             int3                          
 17404  9a85075c06     lcall   0x65c, 0x785             ; RT#31  
 17409  cc             int3                          
 17410  bb0c00         mov     bx, 0xc               
 17413  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 17418  bb0100         mov     bx, 1                 
 17421  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 17426  cc             int3                          
 17427  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 17432  bbb063         mov     bx, 0x63b0               ; = 'cPlease enter how many players? (0-2)'
 17435  9a93285c06     lcall   0x65c, 0x2893            ; RT#5     <<< bx='cPlease enter how many players? (0-2)'
 17440  cc             int3                          
 17441  9a071d5c06     lcall   0x65c, 0x1d07            ; RT#33  
 17446  ba0260         mov     dx, 0x6002            
 17449  9ac80b5c06     lcall   0x65c, 0xbc8             ; RT#19  
 17454  cc             int3                          
 17455  bbd863         mov     bx, 0x63d8            
 17458  b80260         mov     ax, 0x6002            
 17461  9afe0b5c06     lcall   0x65c, 0xbfe             ; RT#29  
 17466  92             xchg    dx, ax                
 17467  9ac80b5c06     lcall   0x65c, 0xbc8             ; RT#19  
 17472  cc             int3                          
 17473  bb0260         mov     bx, 0x6002            
 17476  8bd3           mov     dx, bx                
 17478  9af31c5c06     lcall   0x65c, 0x1cf3            ; RT#36  
 17483  83fb33         cmp     bx, 0x33              
 17486  b90000         mov     cx, 0                 
 17489  7d01           jge     0x4454                
 17491  49             dec     cx                    
 17492  8bda           mov     bx, dx                
 17494  9af31c5c06     lcall   0x65c, 0x1cf3            ; RT#36  
 17499  83fb2f         cmp     bx, 0x2f              
 17502  ba0000         mov     dx, 0                 
 17505  7e01           jle     0x4464                
 17507  4a             dec     dx                    
 17508  23d1           and     dx, cx                
 17510  23d2           and     dx, dx                
 17512  7403           je      0x446d                
 17514  e90400         jmp     0x4471                
 17517  cc             int3                          
 17518  e9afff         jmp     0x4420                
 17521  cc             int3                          
 17522  bb0260         mov     bx, 0x6002            
 17525  ba0100         mov     dx, 1                 
 17528  9ad51d5c06     lcall   0x65c, 0x1dd5            ; RT#46  
 17533  9a0e185c06     lcall   0x65c, 0x180e            ; RT#51  
 17538  9abf1b5c06     lcall   0x65c, 0x1bbf            ; RT#48  
 17543  bf1260         mov     di, 0x6012            
 17546  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 17551  cc             int3                          
 17552  bfe860         mov     di, 0x60e8            
 17555  be1260         mov     si, 0x6012            
 17558  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 17563  9a301c5c06     lcall   0x65c, 0x1c30            ; RT#21  
 17568  9a551b5c06     lcall   0x65c, 0x1b55            ; RT#34  
 17573  03b64be5       add     si, word ptr [bp - 0x1ab5]
 17577  01ac44cc       add     word ptr [si - 0x33bc], bp
 17581  9a85075c06     lcall   0x65c, 0x785             ; RT#31  
 17586  cc             int3                          
 17587  bfc25f         mov     di, 0x5fc2            
 17590  bee860         mov     si, 0x60e8            
 17593  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 17598  cc             int3                          
 17599  bb0a00         mov     bx, 0xa               
 17602  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 17607  bb0100         mov     bx, 1                 
 17610  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 17615  cc             int3                          
 17616  bbde63         mov     bx, 0x63de               ; = 'cPlease enter name of first player? '
 17619  9a46265c06     lcall   0x65c, 0x2646            ; RT#37    <<< bx='cPlease enter name of first player? '
 17624  029a5727       add     bl, byte ptr [bp + si + 0x2757]
 17628  5c             pop     sp                    
 17629  06             push    es                    
 17630  0107           add     word ptr [bx], ax     
 17632  bb1a60         mov     bx, 0x601a            
 17635  9a1e285c06     lcall   0x65c, 0x281e            ; RT#17  
 17640  cc             int3                          
 17641  bb0c00         mov     bx, 0xc               
 17644  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 17649  bb0100         mov     bx, 1                 
 17652  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 17657  cc             int3                          
 17658  bb0664         mov     bx, 0x6406               ; = 'dPlease enter name of second player? *'
 17661  9a46265c06     lcall   0x65c, 0x2646            ; RT#37    <<< bx='dPlease enter name of second player? *'
 17666  029a5727       add     bl, byte ptr [bp + si + 0x2757]
 17670  5c             pop     sp                    
 17671  06             push    es                    
 17672  0107           add     word ptr [bx], ax     
 17674  bb1e60         mov     bx, 0x601e            
 17677  9a1e285c06     lcall   0x65c, 0x281e            ; RT#17  
 17682  cc             int3                          
 17683  bee860         mov     si, 0x60e8            
 17686  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
 17691  e99e01         jmp     0x46bc                
 17694  cc             int3                          
 17695  bece5e         mov     si, 0x5ece            
 17698  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 17703  d1e3           shl     bx, 1                 
 17705  d1e3           shl     bx, 1                 
 17707  81c31660       add     bx, 0x6016            
 17711  9aec1c5c06     lcall   0x65c, 0x1cec            ; RT#25  
 17716  0bdb           or      bx, bx                
 17718  7503           jne     0x453b                
 17720  e95701         jmp     0x4692                
 17723  cc             int3                          
 17724  bece5e         mov     si, 0x5ece            
 17727  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 17732  d1e3           shl     bx, 1                 
 17734  d1e3           shl     bx, 1                 
 17736  81c31660       add     bx, 0x6016            
 17740  9aec1c5c06     lcall   0x65c, 0x1cec            ; RT#25  
 17745  83fb1c         cmp     bx, 0x1c              
 17748  7f03           jg      0x4559                
 17750  e92200         jmp     0x457b                
 17753  cc             int3                          
 17754  bece5e         mov     si, 0x5ece            
 17757  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 17762  d1e3           shl     bx, 1                 
 17764  d1e3           shl     bx, 1                 
 17766  81c31660       add     bx, 0x6016            
 17770  ba1c00         mov     dx, 0x1c              
 17773  8bcb           mov     cx, bx                
 17775  9ad51d5c06     lcall   0x65c, 0x1dd5            ; RT#46  
 17780  8bd1           mov     dx, cx                
 17782  9ac80b5c06     lcall   0x65c, 0xbc8             ; RT#19  
 17787  cc             int3                          
 17788  bece5e         mov     si, 0x5ece            
 17791  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 17796  d1e3           shl     bx, 1                 
 17798  d1e3           shl     bx, 1                 
 17800  81c31660       add     bx, 0x6016            
 17804  9aec1c5c06     lcall   0x65c, 0x1cec            ; RT#25  
 17809  9a9d1b5c06     lcall   0x65c, 0x1b9d            ; RT#32  
 17814  bf4260         mov     di, 0x6042            
 17817  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 17822  bee860         mov     si, 0x60e8            
 17825  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
 17830  e9ce00         jmp     0x4677                
 17833  cc             int3                          
 17834  be865f         mov     si, 0x5f86            
 17837  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 17842  8bd3           mov     dx, bx                
 17844  bece5e         mov     si, 0x5ece            
 17847  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 17852  d1e3           shl     bx, 1                 
 17854  d1e3           shl     bx, 1                 
 17856  81c31660       add     bx, 0x6016            
 17860  b90100         mov     cx, 1                 
 17863  9aec1d5c06     lcall   0x65c, 0x1dec            ; RT#56  
 17868  9af31c5c06     lcall   0x65c, 0x1cf3            ; RT#36  
 17873  9a9d1b5c06     lcall   0x65c, 0x1b9d            ; RT#32  
 17878  bffa5f         mov     di, 0x5ffa            
 17881  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 17886  cc             int3                          
 17887  bfaa61         mov     di, 0x61aa            
 17890  befa5f         mov     si, 0x5ffa            
 17893  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 17898  bb0000         mov     bx, 0                 
 17901  7301           jae     0x45f0                
 17903  4b             dec     bx                    
 17904  bfae61         mov     di, 0x61ae            
 17907  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 17912  ba0000         mov     dx, 0                 
 17915  7601           jbe     0x45fe                
 17917  4a             dec     dx                    
 17918  0bd3           or      dx, bx                
 17920  23d2           and     dx, dx                
 17922  7403           je      0x4607                
 17924  e93800         jmp     0x463f                
 17927  cc             int3                          
 17928  bece5e         mov     si, 0x5ece            
 17931  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 17936  d1e3           shl     bx, 1                 
 17938  d1e3           shl     bx, 1                 
 17940  81c3965f       add     bx, 0x5f96            
 17944  bfb261         mov     di, 0x61b2            
 17947  befa5f         mov     si, 0x5ffa            
 17950  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 17955  8bd3           mov     dx, bx                
 17957  9a301c5c06     lcall   0x65c, 0x1c30            ; RT#21  
 17962  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 17967  92             xchg    dx, ax                
 17968  9afe0b5c06     lcall   0x65c, 0xbfe             ; RT#29  
 17973  92             xchg    dx, ax                
 17974  9ac80b5c06     lcall   0x65c, 0xbc8             ; RT#19  
 17979  cc             int3                          
 17980  e92c00         jmp     0x466b                
 17983  cc             int3                          
 17984  bece5e         mov     si, 0x5ece            
 17987  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 17992  d1e3           shl     bx, 1                 
 17994  d1e3           shl     bx, 1                 
 17996  81c3965f       add     bx, 0x5f96            
 18000  8bd3           mov     dx, bx                
 18002  befa5f         mov     si, 0x5ffa            
 18005  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 18010  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 18015  92             xchg    dx, ax                
 18016  9afe0b5c06     lcall   0x65c, 0xbfe             ; RT#29  
 18021  92             xchg    dx, ax                
 18022  9ac80b5c06     lcall   0x65c, 0xbc8             ; RT#19  
 18027  cc             int3                          
 18028  bfe860         mov     di, 0x60e8            
 18031  be865f         mov     si, 0x5f86            
 18034  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 18039  bf865f         mov     di, 0x5f86            
 18042  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 18047  8bf7           mov     si, di                
 18049  bf4260         mov     di, 0x6042            
 18052  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 18057  7703           ja      0x468e                
 18059  e91bff         jmp     0x45a9                
 18062  cc             int3                          
 18063  e91e00         jmp     0x46b0                
 18066  cc             int3                          
 18067  bece5e         mov     si, 0x5ece            
 18070  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 18075  d1e3           shl     bx, 1                 
 18077  d1e3           shl     bx, 1                 
 18079  8bd3           mov     dx, bx                
 18081  81c3965f       add     bx, 0x5f96            
 18085  81c21660       add     dx, 0x6016            
 18089  87d3           xchg    bx, dx                
 18091  9ac80b5c06     lcall   0x65c, 0xbc8             ; RT#19  
 18096  cc             int3                          
 18097  bfe860         mov     di, 0x60e8            
 18100  bece5e         mov     si, 0x5ece            
 18103  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 18108  bfce5e         mov     di, 0x5ece            
 18111  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 18116  8bf7           mov     si, di                
 18118  bf3461         mov     di, 0x6134            
 18121  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 18126  7703           ja      0x46d3                
 18128  e94bfe         jmp     0x451e                
 18131  cc             int3                          
 18132  9a85075c06     lcall   0x65c, 0x785             ; RT#31  
 18137  cc             int3                          
 18138  bb0a00         mov     bx, 0xa               
 18141  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 18146  bb0100         mov     bx, 1                 
 18149  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 18154  cc             int3                          
 18155  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 18160  bb9a5f         mov     bx, 0x5f9a            
 18163  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 18168  bbf661         mov     bx, 0x61f6               ; = "a would you like to use 'X' or 'O'? (X/O)"
 18171  9a93285c06     lcall   0x65c, 0x2893            ; RT#5     <<< bx="a would you like to use 'X' or 'O'? (X/O)"
 18176  cc             int3                          
 18177  9a071d5c06     lcall   0x65c, 0x1d07            ; RT#33  
 18182  ba0260         mov     dx, 0x6002            
 18185  9ac80b5c06     lcall   0x65c, 0xbc8             ; RT#19  
 18190  cc             int3                          
 18191  bb2262         mov     bx, 0x6222            
 18194  b80260         mov     ax, 0x6002            
 18197  9a380c5c06     lcall   0x65c, 0xc38             ; RT#18  
 18202  ba0000         mov     dx, 0                 
 18205  7501           jne     0x4720                
 18207  4a             dec     dx                    
 18208  bb5061         mov     bx, 0x6150            
 18211  9a380c5c06     lcall   0x65c, 0xc38             ; RT#18  
 18216  b90000         mov     cx, 0                 
 18219  7501           jne     0x472e                
 18221  49             dec     cx                    
 18222  0bca           or      cx, dx                
 18224  23c9           and     cx, cx                
 18226  7503           jne     0x4737                
 18228  e91000         jmp     0x4747                
 18231  cc             int3                          
 18232  bf925f         mov     di, 0x5f92            
 18235  bee860         mov     si, 0x60e8            
 18238  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 18243  cc             int3                          
 18244  e93d00         jmp     0x4784                
 18247  cc             int3                          
 18248  bb2862         mov     bx, 0x6228            
 18251  b80260         mov     ax, 0x6002            
 18254  9a380c5c06     lcall   0x65c, 0xc38             ; RT#18  
 18259  ba0000         mov     dx, 0                 
 18262  7501           jne     0x4759                
 18264  4a             dec     dx                    
 18265  bb5661         mov     bx, 0x6156            
 18268  9a380c5c06     lcall   0x65c, 0xc38             ; RT#18  
 18273  b90000         mov     cx, 0                 
 18276  7501           jne     0x4767                
 18278  49             dec     cx                    
 18279  0bca           or      cx, dx                
 18281  23c9           and     cx, cx                
 18283  7503           jne     0x4770                
 18285  e91000         jmp     0x4780                
 18288  cc             int3                          
 18289  bf925f         mov     di, 0x5f92            
 18292  be3461         mov     si, 0x6134            
 18295  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 18300  cc             int3                          
 18301  e90400         jmp     0x4784                
 18304  cc             int3                          
 18305  e97cff         jmp     0x4700                
 18308  cc             int3                          
 18309  bb0c00         mov     bx, 0xc               
 18312  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 18317  bb0100         mov     bx, 1                 
 18320  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 18325  cc             int3                          
 18326  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 18331  bb2e64         mov     bx, 0x642e               ; = 'dWould you like to use cursors input? (Y/N)'
 18334  9a93285c06     lcall   0x65c, 0x2893            ; RT#5     <<< bx='dWould you like to use cursors input? (Y/N)'
 18339  cc             int3                          
 18340  9a071d5c06     lcall   0x65c, 0x1d07            ; RT#33  
 18345  ba0260         mov     dx, 0x6002            
 18348  9ac80b5c06     lcall   0x65c, 0xbc8             ; RT#19  
 18353  cc             int3                          
 18354  bbde61         mov     bx, 0x61de            
 18357  b80260         mov     ax, 0x6002            
 18360  9a380c5c06     lcall   0x65c, 0xc38             ; RT#18  
 18365  ba0000         mov     dx, 0                 
 18368  7501           jne     0x47c3                
 18370  4a             dec     dx                    
 18371  bbe461         mov     bx, 0x61e4            
 18374  9a380c5c06     lcall   0x65c, 0xc38             ; RT#18  
 18379  b90000         mov     cx, 0                 
 18382  7501           jne     0x47d1                
 18384  49             dec     cx                    
 18385  0bca           or      cx, dx                
 18387  23c9           and     cx, cx                
 18389  7503           jne     0x47da                
 18391  e91000         jmp     0x47ea                
 18394  cc             int3                          
 18395  bf0660         mov     di, 0x6006            
 18398  bee860         mov     si, 0x60e8            
 18401  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 18406  cc             int3                          
 18407  e93d00         jmp     0x4827                
 18410  cc             int3                          
 18411  bbea61         mov     bx, 0x61ea            
 18414  b80260         mov     ax, 0x6002            
 18417  9a380c5c06     lcall   0x65c, 0xc38             ; RT#18  
 18422  ba0000         mov     dx, 0                 
 18425  7501           jne     0x47fc                
 18427  4a             dec     dx                    
 18428  bbf061         mov     bx, 0x61f0            
 18431  9a380c5c06     lcall   0x65c, 0xc38             ; RT#18  
 18436  b90000         mov     cx, 0                 
 18439  7501           jne     0x480a                
 18441  49             dec     cx                    
 18442  0bca           or      cx, dx                
 18444  23c9           and     cx, cx                
 18446  7503           jne     0x4813                
 18448  e91000         jmp     0x4823                
 18451  cc             int3                          
 18452  bf0660         mov     di, 0x6006            
 18455  be1461         mov     si, 0x6114            
 18458  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 18463  cc             int3                          
 18464  e90400         jmp     0x4827                
 18467  cc             int3                          
 18468  e97cff         jmp     0x47a3                
 18471  cc             int3                          
 18472  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 18477  99             cdq                           
 18478  34cc           xor     al, 0xcc              
 18480  bb1600         mov     bx, 0x16              
 18483  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 18488  bb0200         mov     bx, 2                 
 18491  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 18496  cc             int3                          
 18497  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 18502  bb4e00         mov     bx, 0x4e              
 18505  baf460         mov     dx, 0x60f4            
 18508  9a471e5c06     lcall   0x65c, 0x1e47            ; RT#16  
 18513  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 18518  cc             int3                          
 18519  bb1600         mov     bx, 0x16              
 18522  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 18527  bb0500         mov     bx, 5                 
 18530  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 18535  cc             int3                          
 18536  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 18541  bbfa60         mov     bx, 0x60fa               ; = '`Please make your move:'
 18544  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11    <<< bx='`Please make your move:'
 18549  cc             int3                          
 18550  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 18555  3349cc         xor     cx, word ptr [bx + di - 0x34]
 18558  bfe860         mov     di, 0x60e8            
 18561  bed25e         mov     si, 0x5ed2            
 18564  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 18569  7403           je      0x488e                
 18571  e91000         jmp     0x489e                
 18574  cc             int3                          
 18575  bfd25e         mov     di, 0x5ed2            
 18578  be1461         mov     si, 0x6114            
 18581  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 18586  cc             int3                          
 18587  e94300         jmp     0x48e1                
 18590  cc             int3                          
 18591  bed65e         mov     si, 0x5ed6            
 18594  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 18599  93             xchg    bx, ax                
 18600  bb0500         mov     bx, 5                 
 18603  f7eb           imul    bx                    
 18605  8bd3           mov     dx, bx                
 18607  beda5e         mov     si, 0x5eda            
 18610  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 18615  03c3           add     ax, bx                
 18617  8bda           mov     bx, dx                
 18619  f7ea           imul    dx                    
 18621  96             xchg    si, ax                
 18622  8bd6           mov     dx, si                
 18624  bede5e         mov     si, 0x5ede            
 18627  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 18632  03da           add     bx, dx                
 18634  8bf3           mov     si, bx                
 18636  d1e6           shl     si, 1                 
 18638  d1e6           shl     si, 1                 
 18640  81c6f208       add     si, 0x8f2             
 18644  bfe860         mov     di, 0x60e8            
 18647  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 18652  7403           je      0x48e1                
 18654  e91b01         jmp     0x49fc                
 18657  cc             int3                          
 18658  bb1600         mov     bx, 0x16              
 18661  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 18666  bb0200         mov     bx, 2                 
 18669  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 18674  cc             int3                          
 18675  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 18680  bb4e00         mov     bx, 0x4e              
 18683  baf460         mov     dx, 0x60f4            
 18686  9a471e5c06     lcall   0x65c, 0x1e47            ; RT#16  
 18691  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 18696  cc             int3                          
 18697  bb1600         mov     bx, 0x16              
 18700  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 18705  bb0500         mov     bx, 5                 
 18708  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 18713  cc             int3                          
 18714  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 18719  bb1861         mov     bx, 0x6118               ; = 'aPlease remake your move:'
 18722  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11    <<< bx='aPlease remake your move:'
 18727  cc             int3                          
 18728  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 18733  3349cc         xor     cx, word ptr [bx + di - 0x34]
 18736  e94aff         jmp     0x487d                
 18739  cc             int3                          
 18740  bfe860         mov     di, 0x60e8            
 18743  be0660         mov     si, 0x6006            
 18746  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 18751  7403           je      0x4944                
 18753  e90b00         jmp     0x494f                
 18756  cc             int3                          
 18757  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 18762  394fe9         cmp     word ptr [bx - 0x17], cx
 18765  0800           or      byte ptr [bx + si], al
 18767  cc             int3                          
 18768  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 18773  56             push    si                    
 18774  60             pushaw                        
 18775  cc             int3                          
 18776  bfde5e         mov     di, 0x5ede            
 18779  bec25e         mov     si, 0x5ec2            
 18782  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 18787  cc             int3                          
 18788  bfda5e         mov     di, 0x5eda            
 18791  bec65e         mov     si, 0x5ec6            
 18794  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 18799  cc             int3                          
 18800  bfd65e         mov     di, 0x5ed6            
 18803  beca5e         mov     si, 0x5eca            
 18806  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 18811  cc             int3                          
 18812  bf5263         mov     di, 0x6352            
 18815  bede5e         mov     si, 0x5ede            
 18818  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 18823  bb0000         mov     bx, 0                 
 18826  7301           jae     0x498d                
 18828  4b             dec     bx                    
 18829  8bd7           mov     dx, di                
 18831  bf5c64         mov     di, 0x645c            
 18834  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 18839  b90000         mov     cx, 0                 
 18842  7601           jbe     0x499d                
 18844  49             dec     cx                    
 18845  0bcb           or      cx, bx                
 18847  8bdf           mov     bx, di                
 18849  8bfa           mov     di, dx                
 18851  beda5e         mov     si, 0x5eda            
 18854  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 18859  b80000         mov     ax, 0                 
 18862  7301           jae     0x49b1                
 18864  48             dec     ax                    
 18865  0bc1           or      ax, cx                
 18867  8bfb           mov     di, bx                
 18869  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 18874  b90000         mov     cx, 0                 
 18877  7601           jbe     0x49c0                
 18879  49             dec     cx                    
 18880  0bc8           or      cx, ax                
 18882  8bfa           mov     di, dx                
 18884  bed65e         mov     si, 0x5ed6            
 18887  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 18892  b80000         mov     ax, 0                 
 18895  7301           jae     0x49d2                
 18897  48             dec     ax                    
 18898  0bc1           or      ax, cx                
 18900  8bfb           mov     di, bx                
 18902  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 18907  ba0000         mov     dx, 0                 
 18910  7601           jbe     0x49e1                
 18912  4a             dec     dx                    
 18913  0bd0           or      dx, ax                
 18915  23d2           and     dx, dx                
 18917  7503           jne     0x49ea                
 18919  e90c00         jmp     0x49f6                
 18922  cc             int3                          
 18923  bfd25e         mov     di, 0x5ed2            
 18926  bee860         mov     si, 0x60e8            
 18929  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 18934  cc             int3                          
 18935  9a271b5c06     lcall   0x65c, 0x1b27            ; RT#20  
 18940  cc             int3                          
 18941  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 18946  054dcc         add     ax, 0xcc4d            
 18949  bb1600         mov     bx, 0x16              
 18952  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 18957  bb0500         mov     bx, 5                 
 18960  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 18965  cc             int3                          
 18966  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 18971  bbfa60         mov     bx, 0x60fa               ; = '`Please make your move:'
 18974  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11    <<< bx='`Please make your move:'
 18979  cc             int3                          
 18980  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 18985  e14a           loope   0x4a75                
 18987  cc             int3                          
 18988  bfe860         mov     di, 0x60e8            
 18991  bed25e         mov     si, 0x5ed2            
 18994  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 18999  7403           je      0x4a3c                
 19001  e91000         jmp     0x4a4c                
 19004  cc             int3                          
 19005  bfd25e         mov     di, 0x5ed2            
 19008  be1461         mov     si, 0x6114            
 19011  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 19016  cc             int3                          
 19017  e94300         jmp     0x4a8f                
 19020  cc             int3                          
 19021  be2a5f         mov     si, 0x5f2a            
 19024  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 19029  93             xchg    bx, ax                
 19030  bb0500         mov     bx, 5                 
 19033  f7eb           imul    bx                    
 19035  8bd3           mov     dx, bx                
 19037  be265f         mov     si, 0x5f26            
 19040  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 19045  03c3           add     ax, bx                
 19047  8bda           mov     bx, dx                
 19049  f7ea           imul    dx                    
 19051  96             xchg    si, ax                
 19052  8bd6           mov     dx, si                
 19054  be225f         mov     si, 0x5f22            
 19057  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 19062  03da           add     bx, dx                
 19064  8bf3           mov     si, bx                
 19066  d1e6           shl     si, 1                 
 19068  d1e6           shl     si, 1                 
 19070  81c6f208       add     si, 0x8f2             
 19074  bfe860         mov     di, 0x60e8            
 19077  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 19082  7403           je      0x4a8f                
 19084  e91b01         jmp     0x4baa                
 19087  cc             int3                          
 19088  bb1600         mov     bx, 0x16              
 19091  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 19096  bb0200         mov     bx, 2                 
 19099  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 19104  cc             int3                          
 19105  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 19110  bb4e00         mov     bx, 0x4e              
 19113  baf460         mov     dx, 0x60f4            
 19116  9a471e5c06     lcall   0x65c, 0x1e47            ; RT#16  
 19121  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 19126  cc             int3                          
 19127  bb1600         mov     bx, 0x16              
 19130  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 19135  bb0500         mov     bx, 5                 
 19138  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 19143  cc             int3                          
 19144  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 19149  bb1861         mov     bx, 0x6118               ; = 'aPlease remake your move:'
 19152  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11    <<< bx='aPlease remake your move:'
 19157  cc             int3                          
 19158  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 19163  e14a           loope   0x4b27                
 19165  cc             int3                          
 19166  e94aff         jmp     0x4a2b                
 19169  cc             int3                          
 19170  bfe860         mov     di, 0x60e8            
 19173  be0660         mov     si, 0x6006            
 19176  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 19181  7403           je      0x4af2                
 19183  e90b00         jmp     0x4afd                
 19186  cc             int3                          
 19187  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 19192  394fe9         cmp     word ptr [bx - 0x17], cx
 19195  0800           or      byte ptr [bx + si], al
 19197  cc             int3                          
 19198  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 19203  56             push    si                    
 19204  60             pushaw                        
 19205  cc             int3                          
 19206  bf225f         mov     di, 0x5f22            
 19209  bec25e         mov     si, 0x5ec2            
 19212  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 19217  cc             int3                          
 19218  bf265f         mov     di, 0x5f26            
 19221  bec65e         mov     si, 0x5ec6            
 19224  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 19229  cc             int3                          
 19230  bf2a5f         mov     di, 0x5f2a            
 19233  beca5e         mov     si, 0x5eca            
 19236  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 19241  cc             int3                          
 19242  bfe860         mov     di, 0x60e8            
 19245  be225f         mov     si, 0x5f22            
 19248  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 19253  bb0000         mov     bx, 0                 
 19256  7301           jae     0x4b3b                
 19258  4b             dec     bx                    
 19259  8bd7           mov     dx, di                
 19261  bf4461         mov     di, 0x6144            
 19264  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 19269  b90000         mov     cx, 0                 
 19272  7601           jbe     0x4b4b                
 19274  49             dec     cx                    
 19275  0bcb           or      cx, bx                
 19277  8bdf           mov     bx, di                
 19279  8bfa           mov     di, dx                
 19281  be265f         mov     si, 0x5f26            
 19284  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 19289  b80000         mov     ax, 0                 
 19292  7301           jae     0x4b5f                
 19294  48             dec     ax                    
 19295  0bc1           or      ax, cx                
 19297  8bfb           mov     di, bx                
 19299  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 19304  b90000         mov     cx, 0                 
 19307  7601           jbe     0x4b6e                
 19309  49             dec     cx                    
 19310  0bc8           or      cx, ax                
 19312  8bfa           mov     di, dx                
 19314  be2a5f         mov     si, 0x5f2a            
 19317  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 19322  b80000         mov     ax, 0                 
 19325  7301           jae     0x4b80                
 19327  48             dec     ax                    
 19328  0bc1           or      ax, cx                
 19330  8bfb           mov     di, bx                
 19332  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 19337  ba0000         mov     dx, 0                 
 19340  7601           jbe     0x4b8f                
 19342  4a             dec     dx                    
 19343  0bd0           or      dx, ax                
 19345  23d2           and     dx, dx                
 19347  7503           jne     0x4b98                
 19349  e90c00         jmp     0x4ba4                
 19352  cc             int3                          
 19353  bfd25e         mov     di, 0x5ed2            
 19356  bee860         mov     si, 0x60e8            
 19359  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 19364  cc             int3                          
 19365  9a271b5c06     lcall   0x65c, 0x1b27            ; RT#20  
 19370  cc             int3                          
 19371  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 19376  1e             push    ds                    
 19377  4e             dec     si                    
 19378  cc             int3                          
 19379  e979fc         jmp     0x482f                
 19382  cc             int3                          
 19383  bb6064         mov     bx, 0x6460               ; = 'dPLAYER'
 19386  ba9a5f         mov     dx, 0x5f9a            
 19389  9ac80b5c06     lcall   0x65c, 0xbc8             ; RT#19    <<< bx='dPLAYER'
 19394  cc             int3                          
 19395  bb8261         mov     bx, 0x6182               ; = 'aCOMPUTER'
 19398  ba9e5f         mov     dx, 0x5f9e            
 19401  9ac80b5c06     lcall   0x65c, 0xbc8             ; RT#19    <<< bx='aCOMPUTER'
 19406  cc             int3                          
 19407  bf925f         mov     di, 0x5f92            
 19410  bee860         mov     si, 0x60e8            
 19413  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 19418  cc             int3                          
 19419  bfc25f         mov     di, 0x5fc2            
 19422  be3461         mov     si, 0x6134            
 19425  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 19430  cc             int3                          
 19431  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 19436  99             cdq                           
 19437  34cc           xor     al, 0xcc              
 19439  bbde5e         mov     bx, 0x5ede            
 19442  9ad3225c06     lcall   0x65c, 0x22d3            ; RT#43  
 19447  bbda5e         mov     bx, 0x5eda            
 19450  9ad3225c06     lcall   0x65c, 0x22d3            ; RT#43  
 19455  bbd65e         mov     bx, 0x5ed6            
 19458  9ad3225c06     lcall   0x65c, 0x22d3            ; RT#43  
 19463  cc             int3                          
 19464  bb1600         mov     bx, 0x16              
 19467  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 19472  bb0500         mov     bx, 5                 
 19475  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 19480  cc             int3                          
 19481  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 19486  bbfa60         mov     bx, 0x60fa               ; = '`Please make your move:'
 19489  9a93285c06     lcall   0x65c, 0x2893            ; RT#5     <<< bx='`Please make your move:'
 19494  cc             int3                          
 19495  bee860         mov     si, 0x60e8            
 19498  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
 19503  e98f00         jmp     0x4cc1                
 19506  cc             int3                          
 19507  bee860         mov     si, 0x60e8            
 19510  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
 19515  e90c00         jmp     0x4c4a                
 19518  cc             int3                          
 19519  bfe860         mov     di, 0x60e8            
 19522  be865f         mov     si, 0x5f86            
 19525  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 19530  bf865f         mov     di, 0x5f86            
 19533  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 19538  8bf7           mov     si, di                
 19540  bf6a64         mov     di, 0x646a            
 19543  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 19548  76e0           jbe     0x4c3e                
 19550  cc             int3                          
 19551  bece5e         mov     si, 0x5ece            
 19554  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 19559  9a551b5c06     lcall   0x65c, 0x1b55            ; RT#34  
 19564  03734c         add     si, word ptr [bp + di + 0x4c]
 19567  854c9f         test    word ptr [si - 0x61], cx
 19570  4c             dec     sp                    
 19571  cc             int3                          
 19572  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 19577  bbde5e         mov     bx, 0x5ede            
 19580  9a84285c06     lcall   0x65c, 0x2884            ; RT#50  
 19585  cc             int3                          
 19586  e93000         jmp     0x4cb5                
 19589  cc             int3                          
 19590  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 19595  bb7061         mov     bx, 0x6170            
 19598  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 19603  bbda5e         mov     bx, 0x5eda            
 19606  9a84285c06     lcall   0x65c, 0x2884            ; RT#50  
 19611  cc             int3                          
 19612  e91600         jmp     0x4cb5                
 19615  cc             int3                          
 19616  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 19621  bb7061         mov     bx, 0x6170            
 19624  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 19629  bbd65e         mov     bx, 0x5ed6            
 19632  9a98285c06     lcall   0x65c, 0x2898            ; RT#35  
 19637  cc             int3                          
 19638  bfe860         mov     di, 0x60e8            
 19641  bece5e         mov     si, 0x5ece            
 19644  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 19649  bfce5e         mov     di, 0x5ece            
 19652  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 19657  8bf7           mov     si, di                
 19659  bf3861         mov     di, 0x6138            
 19662  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 19667  7703           ja      0x4cd8                
 19669  e95aff         jmp     0x4c32                
 19672  cc             int3                          
 19673  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 19678  054dcc         add     ax, 0xcc4d            
 19681  bb225f         mov     bx, 0x5f22            
 19684  9ad3225c06     lcall   0x65c, 0x22d3            ; RT#43  
 19689  bb265f         mov     bx, 0x5f26            
 19692  9ad3225c06     lcall   0x65c, 0x22d3            ; RT#43  
 19697  bb2a5f         mov     bx, 0x5f2a            
 19700  9ad3225c06     lcall   0x65c, 0x22d3            ; RT#43  
 19705  cc             int3                          
 19706  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 19711  1e             push    ds                    
 19712  4e             dec     si                    
 19713  cc             int3                          
 19714  e9e9fe         jmp     0x4bee                
 19717  cc             int3                          
 19718  bed65e         mov     si, 0x5ed6            
 19721  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 19726  93             xchg    bx, ax                
 19727  bb0500         mov     bx, 5                 
 19730  f7eb           imul    bx                    
 19732  8bd3           mov     dx, bx                
 19734  beda5e         mov     si, 0x5eda            
 19737  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 19742  03c3           add     ax, bx                
 19744  8bda           mov     bx, dx                
 19746  f7ea           imul    dx                    
 19748  97             xchg    di, ax                
 19749  bede5e         mov     si, 0x5ede            
 19752  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 19757  03fb           add     di, bx                
 19759  d1e7           shl     di, 1                 
 19761  d1e7           shl     di, 1                 
 19763  81c7f208       add     di, 0x8f2             
 19767  bee860         mov     si, 0x60e8            
 19770  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 19775  cc             int3                          
 19776  bed65e         mov     si, 0x5ed6            
 19779  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 19784  93             xchg    bx, ax                
 19785  bb0500         mov     bx, 5                 
 19788  f7eb           imul    bx                    
 19790  8bd3           mov     dx, bx                
 19792  beda5e         mov     si, 0x5eda            
 19795  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 19800  03c3           add     ax, bx                
 19802  8bda           mov     bx, dx                
 19804  f7ea           imul    dx                    
 19806  97             xchg    di, ax                
 19807  bede5e         mov     si, 0x5ede            
 19810  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 19815  03fb           add     di, bx                
 19817  d1e7           shl     di, 1                 
 19819  d1e7           shl     di, 1                 
 19821  81c7e60a       add     di, 0xae6             
 19825  bee860         mov     si, 0x60e8            
 19828  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 19833  cc             int3                          
 19834  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 19839  bd10cc         mov     bp, 0xcc10            
 19842  bfe25e         mov     di, 0x5ee2            
 19845  bede5e         mov     si, 0x5ede            
 19848  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 19853  cc             int3                          
 19854  bfe65e         mov     di, 0x5ee6            
 19857  beda5e         mov     si, 0x5eda            
 19860  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 19865  cc             int3                          
 19866  bfea5e         mov     di, 0x5eea            
 19869  bed65e         mov     si, 0x5ed6            
 19872  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 19877  cc             int3                          
 19878  bfee5e         mov     di, 0x5eee            
 19881  bee25e         mov     si, 0x5ee2            
 19884  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 19889  cc             int3                          
 19890  bff25e         mov     di, 0x5ef2            
 19893  bee65e         mov     si, 0x5ee6            
 19896  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 19901  cc             int3                          
 19902  bff65e         mov     di, 0x5ef6            
 19905  beea5e         mov     si, 0x5eea            
 19908  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 19913  cc             int3                          
 19914  bffa5e         mov     di, 0x5efa            
 19917  bee860         mov     si, 0x60e8            
 19920  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 19925  cc             int3                          
 19926  bffe5e         mov     di, 0x5efe            
 19929  be3461         mov     si, 0x6134            
 19932  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 19937  cc             int3                          
 19938  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 19943  5f             pop     di                    
 19944  0dccbb         or      ax, 0xbbcc            
 19947  16             push    ss                    
 19948  009a630c       add     byte ptr [bp + si + 0xc63], bl
 19952  5c             pop     sp                    
 19953  06             push    es                    
 19954  bb0200         mov     bx, 2                 
 19957  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 19962  cc             int3                          
 19963  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 19968  bb4d00         mov     bx, 0x4d              
 19971  baf460         mov     dx, 0x60f4            
 19974  9a471e5c06     lcall   0x65c, 0x1e47            ; RT#16  
 19979  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 19984  cc             int3                          
 19985  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 19990  59             pop     cx                    
 19991  14cc           adc     al, 0xcc              
 19993  9a271b5c06     lcall   0x65c, 0x1b27            ; RT#20  
 19998  cc             int3                          
 19999  be2a5f         mov     si, 0x5f2a            
 20002  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 20007  93             xchg    bx, ax                
 20008  bb0500         mov     bx, 5                 
 20011  f7eb           imul    bx                    
 20013  8bd3           mov     dx, bx                
 20015  be265f         mov     si, 0x5f26            
 20018  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 20023  03c3           add     ax, bx                
 20025  8bda           mov     bx, dx                
 20027  f7ea           imul    dx                    
 20029  97             xchg    di, ax                
 20030  be225f         mov     si, 0x5f22            
 20033  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 20038  03fb           add     di, bx                
 20040  d1e7           shl     di, 1                 
 20042  d1e7           shl     di, 1                 
 20044  81c7f208       add     di, 0x8f2             
 20048  bee860         mov     si, 0x60e8            
 20051  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 20056  cc             int3                          
 20057  be2a5f         mov     si, 0x5f2a            
 20060  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 20065  93             xchg    bx, ax                
 20066  bb0500         mov     bx, 5                 
 20069  f7eb           imul    bx                    
 20071  8bd3           mov     dx, bx                
 20073  be265f         mov     si, 0x5f26            
 20076  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 20081  03c3           add     ax, bx                
 20083  8bda           mov     bx, dx                
 20085  f7ea           imul    dx                    
 20087  97             xchg    di, ax                
 20088  be225f         mov     si, 0x5f22            
 20091  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 20096  03fb           add     di, bx                
 20098  d1e7           shl     di, 1                 
 20100  d1e7           shl     di, 1                 
 20102  81c7da0c       add     di, 0xcda             
 20106  bee860         mov     si, 0x60e8            
 20109  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 20114  cc             int3                          
 20115  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 20120  8810           mov     byte ptr [bx + si], dl
 20122  cc             int3                          
 20123  bfe25e         mov     di, 0x5ee2            
 20126  be225f         mov     si, 0x5f22            
 20129  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 20134  cc             int3                          
 20135  bfe65e         mov     di, 0x5ee6            
 20138  be265f         mov     si, 0x5f26            
 20141  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 20146  cc             int3                          
 20147  bfea5e         mov     di, 0x5eea            
 20150  be2a5f         mov     si, 0x5f2a            
 20153  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 20158  cc             int3                          
 20159  bfee5e         mov     di, 0x5eee            
 20162  bee25e         mov     si, 0x5ee2            
 20165  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 20170  cc             int3                          
 20171  bff25e         mov     di, 0x5ef2            
 20174  bee65e         mov     si, 0x5ee6            
 20177  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 20182  cc             int3                          
 20183  bff65e         mov     di, 0x5ef6            
 20186  beea5e         mov     si, 0x5eea            
 20189  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 20194  cc             int3                          
 20195  bffa5e         mov     di, 0x5efa            
 20198  be3461         mov     si, 0x6134            
 20201  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 20206  cc             int3                          
 20207  bffe5e         mov     di, 0x5efe            
 20210  be3861         mov     si, 0x6138            
 20213  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 20218  cc             int3                          
 20219  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 20224  5f             pop     di                    
 20225  0dccbb         or      ax, 0xbbcc            
 20228  16             push    ss                    
 20229  009a630c       add     byte ptr [bp + si + 0xc63], bl
 20233  5c             pop     sp                    
 20234  06             push    es                    
 20235  bb0200         mov     bx, 2                 
 20238  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 20243  cc             int3                          
 20244  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 20249  bb4d00         mov     bx, 0x4d              
 20252  baf460         mov     dx, 0x60f4            
 20255  9a471e5c06     lcall   0x65c, 0x1e47            ; RT#16  
 20260  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 20265  cc             int3                          
 20266  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 20271  59             pop     cx                    
 20272  14cc           adc     al, 0xcc              
 20274  9a271b5c06     lcall   0x65c, 0x1b27            ; RT#20  
 20279  cc             int3                          
 20280  90             nop                           
 20281  cc             int3                          
 20282  bb0d00         mov     bx, 0xd               
 20285  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 20290  bb0400         mov     bx, 4                 
 20293  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 20298  cc             int3                          
 20299  bf4660         mov     di, 0x6046            
 20302  beba5e         mov     si, 0x5eba            
 20305  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 20310  cc             int3                          
 20311  bf4a60         mov     di, 0x604a            
 20314  bebe5e         mov     si, 0x5ebe            
 20317  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 20322  cc             int3                          
 20323  bf4e60         mov     di, 0x604e            
 20326  bec25e         mov     si, 0x5ec2            
 20329  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 20334  cc             int3                          
 20335  bf5260         mov     di, 0x6052            
 20338  bec65e         mov     si, 0x5ec6            
 20341  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 20346  cc             int3                          
 20347  bf5660         mov     di, 0x6056            
 20350  beca5e         mov     si, 0x5eca            
 20353  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 20358  cc             int3                          
 20359  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 20364  1253cc         adc     dl, byte ptr [bp + di - 0x34]
 20367  bf5a60         mov     di, 0x605a            
 20370  be5e60         mov     si, 0x605e            
 20373  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 20378  cc             int3                          
 20379  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 20385  55             push    bp                    
 20386  cc             int3                          
 20387  bf6260         mov     di, 0x6062            
 20390  bec25e         mov     si, 0x5ec2            
 20393  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 20398  cc             int3                          
 20399  bf6660         mov     di, 0x6066            
 20402  bec65e         mov     si, 0x5ec6            
 20405  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 20410  cc             int3                          
 20411  bf6a60         mov     di, 0x606a            
 20414  beca5e         mov     si, 0x5eca            
 20417  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 20422  cc             int3                          
 20423  bf6e60         mov     di, 0x606e            
 20426  beba5e         mov     si, 0x5eba            
 20429  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 20434  cc             int3                          
 20435  bf7260         mov     di, 0x6072            
 20438  bebe5e         mov     si, 0x5ebe            
 20441  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 20446  cc             int3                          
 20447  bf7660         mov     di, 0x6076            
 20450  be5e60         mov     si, 0x605e            
 20453  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 20458  cc             int3                          
 20459  9a071d5c06     lcall   0x65c, 0x1d07            ; RT#33  
 20464  ba0260         mov     dx, 0x6002            
 20467  9ac80b5c06     lcall   0x65c, 0xbc8             ; RT#19  
 20472  cc             int3                          
 20473  bbd863         mov     bx, 0x63d8            
 20476  b80260         mov     ax, 0x6002            
 20479  9afe0b5c06     lcall   0x65c, 0xbfe             ; RT#29  
 20484  9af31c5c06     lcall   0x65c, 0x1cf3            ; RT#36  
 20489  83fb0d         cmp     bx, 0xd               
 20492  7503           jne     0x5011                
 20494  e9a805         jmp     0x55b9                
 20497  cc             int3                          
 20498  bb0260         mov     bx, 0x6002            
 20501  9aec1c5c06     lcall   0x65c, 0x1cec            ; RT#25  
 20506  83fb02         cmp     bx, 2                 
 20509  7403           je      0x5022                
 20511  e97e00         jmp     0x50a0                
 20514  cc             int3                          
 20515  bb0260         mov     bx, 0x6002            
 20518  ba0100         mov     dx, 1                 
 20521  9ade1d5c06     lcall   0x65c, 0x1dde            ; RT#44  
 20526  93             xchg    bx, ax                
 20527  bb6e64         mov     bx, 0x646e            
 20530  9a380c5c06     lcall   0x65c, 0xc38             ; RT#18  
 20535  7403           je      0x503c                
 20537  e90c00         jmp     0x5048                
 20540  cc             int3                          
 20541  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 20546  f5             cmc                           
 20547  50             push    ax                    
 20548  cc             int3                          
 20549  e95aff         jmp     0x4fa2                
 20552  cc             int3                          
 20553  bb0260         mov     bx, 0x6002            
 20556  ba0100         mov     dx, 1                 
 20559  9ade1d5c06     lcall   0x65c, 0x1dde            ; RT#44  
 20564  93             xchg    bx, ax                
 20565  bb7464         mov     bx, 0x6474            
 20568  9a380c5c06     lcall   0x65c, 0xc38             ; RT#18  
 20573  7403           je      0x5062                
 20575  e90c00         jmp     0x506e                
 20578  cc             int3                          
 20579  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 20584  bb50cc         mov     bx, 0xcc50            
 20587  e934ff         jmp     0x4fa2                
 20590  cc             int3                          
 20591  bb0260         mov     bx, 0x6002            
 20594  ba0100         mov     dx, 1                 
 20597  9ade1d5c06     lcall   0x65c, 0x1dde            ; RT#44  
 20602  93             xchg    bx, ax                
 20603  bb7a64         mov     bx, 0x647a            
 20606  9a380c5c06     lcall   0x65c, 0xc38             ; RT#18  
 20611  7403           je      0x5088                
 20613  e90c00         jmp     0x5094                
 20616  cc             int3                          
 20617  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 20622  a4             movsb   byte ptr es:[di], byte ptr [si]
 20623  50             push    ax                    
 20624  cc             int3                          
 20625  e90eff         jmp     0x4fa2                
 20628  cc             int3                          
 20629  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 20634  d250cc         rcl     byte ptr [bx + si - 0x34], cl
 20637  e902ff         jmp     0x4fa2                
 20640  cc             int3                          
 20641  e946ff         jmp     0x4fea                
 20644  cc             int3                          
 20645  bf3461         mov     di, 0x6134            
 20648  beba5e         mov     si, 0x5eba            
 20651  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 20656  8bfe           mov     di, si                
 20658  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 20663  cc             int3                          
 20664  e99a00         jmp     0x5155                
 20667  cc             int3                          
 20668  bf1663         mov     di, 0x6316            
 20671  beba5e         mov     si, 0x5eba            
 20674  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 20679  8bfe           mov     di, si                
 20681  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 20686  cc             int3                          
 20687  e98300         jmp     0x5155                
 20690  cc             int3                          
 20691  bf7260         mov     di, 0x6072            
 20694  bebe5e         mov     si, 0x5ebe            
 20697  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 20702  cc             int3                          
 20703  bf3461         mov     di, 0x6134            
 20706  bebe5e         mov     si, 0x5ebe            
 20709  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 20714  8bfe           mov     di, si                
 20716  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 20721  cc             int3                          
 20722  e91f00         jmp     0x5114                
 20725  cc             int3                          
 20726  bf7260         mov     di, 0x6072            
 20729  bebe5e         mov     si, 0x5ebe            
 20732  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 20737  cc             int3                          
 20738  bf1663         mov     di, 0x6316            
 20741  bebe5e         mov     si, 0x5ebe            
 20744  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 20749  8bfe           mov     di, si                
 20751  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 20756  cc             int3                          
 20757  bfe460         mov     di, 0x60e4            
 20760  bebe5e         mov     si, 0x5ebe            
 20763  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 20768  bb0000         mov     bx, 0                 
 20771  7301           jae     0x5126                
 20773  4b             dec     bx                    
 20774  bf2a63         mov     di, 0x632a            
 20777  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 20782  ba0000         mov     dx, 0                 
 20785  7601           jbe     0x5134                
 20787  4a             dec     dx                    
 20788  0bd3           or      dx, bx                
 20790  23d2           and     dx, dx                
 20792  7503           jne     0x513d                
 20794  e91800         jmp     0x5155                
 20797  cc             int3                          
 20798  bf7260         mov     di, 0x6072            
 20801  be8064         mov     si, 0x6480            
 20804  9ac1155c06     lcall   0x65c, 0x15c1            ; RT#24  
 20809  bfbe5e         mov     di, 0x5ebe            
 20812  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 20817  cc             int3                          
 20818  e9dd00         jmp     0x5232                
 20821  cc             int3                          
 20822  bfe060         mov     di, 0x60e0            
 20825  beba5e         mov     si, 0x5eba            
 20828  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 20833  bb0000         mov     bx, 0                 
 20836  7301           jae     0x5167                
 20838  4b             dec     bx                    
 20839  bf8464         mov     di, 0x6484            
 20842  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 20847  ba0000         mov     dx, 0                 
 20850  7601           jbe     0x5175                
 20852  4a             dec     dx                    
 20853  0bd3           or      dx, bx                
 20855  23d2           and     dx, dx                
 20857  7503           jne     0x517e                
 20859  e91800         jmp     0x5196                
 20862  cc             int3                          
 20863  bf6e60         mov     di, 0x606e            
 20866  be8864         mov     si, 0x6488            
 20869  9ac1155c06     lcall   0x65c, 0x15c1            ; RT#24  
 20874  bfba5e         mov     di, 0x5eba            
 20877  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 20882  cc             int3                          
 20883  e99c00         jmp     0x5232                
 20886  cc             int3                          
 20887  bf8c64         mov     di, 0x648c            
 20890  beba5e         mov     si, 0x5eba            
 20893  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 20898  bb0000         mov     bx, 0                 
 20901  7501           jne     0x51a8                
 20903  4b             dec     bx                    
 20904  bf9064         mov     di, 0x6490            
 20907  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 20912  ba0000         mov     dx, 0                 
 20915  7501           jne     0x51b6                
 20917  4a             dec     dx                    
 20918  0bd3           or      dx, bx                
 20920  bf9464         mov     di, 0x6494            
 20923  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 20928  bb0000         mov     bx, 0                 
 20931  7501           jne     0x51c6                
 20933  4b             dec     bx                    
 20934  0bda           or      bx, dx                
 20936  23db           and     bx, bx                
 20938  7503           jne     0x51cf                
 20940  e91700         jmp     0x51e6                
 20943  cc             int3                          
 20944  bf1e63         mov     di, 0x631e            
 20947  beba5e         mov     si, 0x5eba            
 20950  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 20955  8bfe           mov     di, si                
 20957  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 20962  cc             int3                          
 20963  e94c00         jmp     0x5232                
 20966  cc             int3                          
 20967  bf9864         mov     di, 0x6498            
 20970  beba5e         mov     si, 0x5eba            
 20973  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 20978  bb0000         mov     bx, 0                 
 20981  7501           jne     0x51f8                
 20983  4b             dec     bx                    
 20984  bf9c64         mov     di, 0x649c            
 20987  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 20992  ba0000         mov     dx, 0                 
 20995  7501           jne     0x5206                
 20997  4a             dec     dx                    
 20998  0bd3           or      dx, bx                
 21000  bfa064         mov     di, 0x64a0            
 21003  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 21008  bb0000         mov     bx, 0                 
 21011  7501           jne     0x5216                
 21013  4b             dec     bx                    
 21014  0bda           or      bx, dx                
 21016  23db           and     bx, bx                
 21018  7503           jne     0x521f                
 21020  e91300         jmp     0x5232                
 21023  cc             int3                          
 21024  bfa464         mov     di, 0x64a4            
 21027  beba5e         mov     si, 0x5eba            
 21030  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 21035  8bfe           mov     di, si                
 21037  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 21042  cc             int3                          
 21043  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 21048  8d54cc         lea     dx, [si - 0x34]       
 21051  bb0700         mov     bx, 7                 
 21054  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 21059  bb0100         mov     bx, 1                 
 21062  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 21067  cc             int3                          
 21068  bf5a60         mov     di, 0x605a            
 21071  be7660         mov     si, 0x6076            
 21074  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 21079  cc             int3                          
 21080  bf4660         mov     di, 0x6046            
 21083  be6e60         mov     si, 0x606e            
 21086  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 21091  cc             int3                          
 21092  bf4a60         mov     di, 0x604a            
 21095  be7260         mov     si, 0x6072            
 21098  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 21103  cc             int3                          
 21104  bf4e60         mov     di, 0x604e            
 21107  be6260         mov     si, 0x6062            
 21110  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 21115  cc             int3                          
 21116  bf5260         mov     di, 0x6052            
 21119  be6660         mov     si, 0x6066            
 21122  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 21127  cc             int3                          
 21128  bf5660         mov     di, 0x6056            
 21131  be6a60         mov     si, 0x606a            
 21134  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 21139  cc             int3                          
 21140  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 21145  1253cc         adc     dl, byte ptr [bp + di - 0x34]
 21148  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 21154  55             push    bp                    
 21155  cc             int3                          
 21156  bb0d00         mov     bx, 0xd               
 21159  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 21164  bb0400         mov     bx, 4                 
 21167  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 21172  cc             int3                          
 21173  bf4660         mov     di, 0x6046            
 21176  beba5e         mov     si, 0x5eba            
 21179  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 21184  cc             int3                          
 21185  bf4a60         mov     di, 0x604a            
 21188  bebe5e         mov     si, 0x5ebe            
 21191  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 21196  cc             int3                          
 21197  bf4e60         mov     di, 0x604e            
 21200  bec25e         mov     si, 0x5ec2            
 21203  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 21208  cc             int3                          
 21209  bf5260         mov     di, 0x6052            
 21212  bec65e         mov     si, 0x5ec6            
 21215  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 21220  cc             int3                          
 21221  bf5660         mov     di, 0x6056            
 21224  beca5e         mov     si, 0x5eca            
 21227  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 21232  cc             int3                          
 21233  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 21238  1253cc         adc     dl, byte ptr [bp + di - 0x34]
 21241  bf5a60         mov     di, 0x605a            
 21244  be5e60         mov     si, 0x605e            
 21247  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 21252  cc             int3                          
 21253  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 21259  55             push    bp                    
 21260  cc             int3                          
 21261  9a271b5c06     lcall   0x65c, 0x1b27            ; RT#20  
 21266  cc             int3                          
 21267  bfe860         mov     di, 0x60e8            
 21270  be925f         mov     si, 0x5f92            
 21273  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 21278  7503           jne     0x5323                
 21280  e9aa00         jmp     0x53cd                
 21283  cc             int3                          
 21284  be5660         mov     si, 0x6056            
 21287  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 21292  93             xchg    bx, ax                
 21293  bb0500         mov     bx, 5                 
 21296  f7eb           imul    bx                    
 21298  8bd3           mov     dx, bx                
 21300  be5260         mov     si, 0x6052            
 21303  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 21308  03c3           add     ax, bx                
 21310  8bda           mov     bx, dx                
 21312  f7ea           imul    dx                    
 21314  96             xchg    si, ax                
 21315  8bd6           mov     dx, si                
 21317  be4e60         mov     si, 0x604e            
 21320  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 21325  03da           add     bx, dx                
 21327  8bf3           mov     si, bx                
 21329  d1e6           shl     si, 1                 
 21331  d1e6           shl     si, 1                 
 21333  81c6da0c       add     si, 0xcda             
 21337  bfe860         mov     di, 0x60e8            
 21340  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 21345  7403           je      0x5366                
 21347  e91000         jmp     0x5376                
 21350  cc             int3                          
 21351  bf5e60         mov     di, 0x605e            
 21354  bee860         mov     si, 0x60e8            
 21357  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 21362  cc             int3                          
 21363  e91101         jmp     0x5487                
 21366  cc             int3                          
 21367  be5660         mov     si, 0x6056            
 21370  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 21375  93             xchg    bx, ax                
 21376  bb0500         mov     bx, 5                 
 21379  f7eb           imul    bx                    
 21381  8bd3           mov     dx, bx                
 21383  be5260         mov     si, 0x6052            
 21386  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 21391  03c3           add     ax, bx                
 21393  8bda           mov     bx, dx                
 21395  f7ea           imul    dx                    
 21397  96             xchg    si, ax                
 21398  8bd6           mov     dx, si                
 21400  be4e60         mov     si, 0x604e            
 21403  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 21408  03da           add     bx, dx                
 21410  8bf3           mov     si, bx                
 21412  d1e6           shl     si, 1                 
 21414  d1e6           shl     si, 1                 
 21416  81c6e60a       add     si, 0xae6             
 21420  bfe860         mov     di, 0x60e8            
 21423  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 21428  7403           je      0x53b9                
 21430  e91000         jmp     0x53c9                
 21433  cc             int3                          
 21434  bf5e60         mov     di, 0x605e            
 21437  be3461         mov     si, 0x6134            
 21440  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 21445  cc             int3                          
 21446  e9be00         jmp     0x5487                
 21449  cc             int3                          
 21450  e9a600         jmp     0x5473                
 21453  cc             int3                          
 21454  be5660         mov     si, 0x6056            
 21457  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 21462  93             xchg    bx, ax                
 21463  bb0500         mov     bx, 5                 
 21466  f7eb           imul    bx                    
 21468  8bd3           mov     dx, bx                
 21470  be5260         mov     si, 0x6052            
 21473  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 21478  03c3           add     ax, bx                
 21480  8bda           mov     bx, dx                
 21482  f7ea           imul    dx                    
 21484  96             xchg    si, ax                
 21485  8bd6           mov     dx, si                
 21487  be4e60         mov     si, 0x604e            
 21490  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 21495  03da           add     bx, dx                
 21497  8bf3           mov     si, bx                
 21499  d1e6           shl     si, 1                 
 21501  d1e6           shl     si, 1                 
 21503  81c6da0c       add     si, 0xcda             
 21507  bfe860         mov     di, 0x60e8            
 21510  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 21515  7403           je      0x5410                
 21517  e91000         jmp     0x5420                
 21520  cc             int3                          
 21521  bf5e60         mov     di, 0x605e            
 21524  be3461         mov     si, 0x6134            
 21527  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 21532  cc             int3                          
 21533  e96700         jmp     0x5487                
 21536  cc             int3                          
 21537  be5660         mov     si, 0x6056            
 21540  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 21545  93             xchg    bx, ax                
 21546  bb0500         mov     bx, 5                 
 21549  f7eb           imul    bx                    
 21551  8bd3           mov     dx, bx                
 21553  be5260         mov     si, 0x6052            
 21556  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 21561  03c3           add     ax, bx                
 21563  8bda           mov     bx, dx                
 21565  f7ea           imul    dx                    
 21567  96             xchg    si, ax                
 21568  8bd6           mov     dx, si                
 21570  be4e60         mov     si, 0x604e            
 21573  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 21578  03da           add     bx, dx                
 21580  8bf3           mov     si, bx                
 21582  d1e6           shl     si, 1                 
 21584  d1e6           shl     si, 1                 
 21586  81c6e60a       add     si, 0xae6             
 21590  bfe860         mov     di, 0x60e8            
 21593  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 21598  7403           je      0x5463                
 21600  e91000         jmp     0x5473                
 21603  cc             int3                          
 21604  bf5e60         mov     di, 0x605e            
 21607  bee860         mov     si, 0x60e8            
 21610  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 21615  cc             int3                          
 21616  e91400         jmp     0x5487                
 21619  cc             int3                          
 21620  bf3461         mov     di, 0x6134            
 21623  beca5e         mov     si, 0x5eca            
 21626  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 21631  bf5e60         mov     di, 0x605e            
 21634  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 21639  cc             int3                          
 21640  9a271b5c06     lcall   0x65c, 0x1b27            ; RT#20  
 21645  cc             int3                          
 21646  bfa864         mov     di, 0x64a8            
 21649  beba5e         mov     si, 0x5eba            
 21652  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 21657  bb0000         mov     bx, 0                 
 21660  7601           jbe     0x549f                
 21662  4b             dec     bx                    
 21663  bfac64         mov     di, 0x64ac            
 21666  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 21671  ba0000         mov     dx, 0                 
 21674  7301           jae     0x54ad                
 21676  4a             dec     dx                    
 21677  23d3           and     dx, bx                
 21679  23d2           and     dx, dx                
 21681  7503           jne     0x54b6                
 21683  e91000         jmp     0x54c6                
 21686  cc             int3                          
 21687  bfc25e         mov     di, 0x5ec2            
 21690  bee860         mov     si, 0x60e8            
 21693  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 21698  cc             int3                          
 21699  e9a700         jmp     0x556d                
 21702  cc             int3                          
 21703  bf9864         mov     di, 0x6498            
 21706  beba5e         mov     si, 0x5eba            
 21709  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 21714  bb0000         mov     bx, 0                 
 21717  7601           jbe     0x54d8                
 21719  4b             dec     bx                    
 21720  bfb064         mov     di, 0x64b0            
 21723  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 21728  ba0000         mov     dx, 0                 
 21731  7301           jae     0x54e6                
 21733  4a             dec     dx                    
 21734  23d3           and     dx, bx                
 21736  23d2           and     dx, dx                
 21738  7503           jne     0x54ef                
 21740  e91000         jmp     0x54ff                
 21743  cc             int3                          
 21744  bfc25e         mov     di, 0x5ec2            
 21747  be3461         mov     si, 0x6134            
 21750  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 21755  cc             int3                          
 21756  e96e00         jmp     0x556d                
 21759  cc             int3                          
 21760  bf9c64         mov     di, 0x649c            
 21763  beba5e         mov     si, 0x5eba            
 21766  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 21771  bb0000         mov     bx, 0                 
 21774  7601           jbe     0x5511                
 21776  4b             dec     bx                    
 21777  bfb464         mov     di, 0x64b4            
 21780  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 21785  ba0000         mov     dx, 0                 
 21788  7301           jae     0x551f                
 21790  4a             dec     dx                    
 21791  23d3           and     dx, bx                
 21793  23d2           and     dx, dx                
 21795  7503           jne     0x5528                
 21797  e91000         jmp     0x5538                
 21800  cc             int3                          
 21801  bfc25e         mov     di, 0x5ec2            
 21804  be3861         mov     si, 0x6138            
 21807  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 21812  cc             int3                          
 21813  e93500         jmp     0x556d                
 21816  cc             int3                          
 21817  bfa064         mov     di, 0x64a0            
 21820  beba5e         mov     si, 0x5eba            
 21823  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 21828  bb0000         mov     bx, 0                 
 21831  7601           jbe     0x554a                
 21833  4b             dec     bx                    
 21834  bfb864         mov     di, 0x64b8            
 21837  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 21842  ba0000         mov     dx, 0                 
 21845  7301           jae     0x5558                
 21847  4a             dec     dx                    
 21848  23d3           and     dx, bx                
 21850  23d2           and     dx, dx                
 21852  7503           jne     0x5561                
 21854  e90c00         jmp     0x556d                
 21857  cc             int3                          
 21858  bfc25e         mov     di, 0x5ec2            
 21861  be4461         mov     si, 0x6144            
 21864  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 21869  cc             int3                          
 21870  bf5263         mov     di, 0x6352            
 21873  bebe5e         mov     si, 0x5ebe            
 21876  9a0e175c06     lcall   0x65c, 0x170e            ; RT#73  
 21881  bf1663         mov     di, 0x6316            
 21884  9acb155c06     lcall   0x65c, 0x15cb            ; RT#27  
 21889  bfc65e         mov     di, 0x5ec6            
 21892  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 21897  cc             int3                          
 21898  bec25e         mov     si, 0x5ec2            
 21901  9a240f5c06     lcall   0x65c, 0xf24             ; RT#26  
 21906  04be           add     al, 0xbe              
 21908  ba5e9a         mov     dx, 0x9a5e            
 21911  be155c         mov     si, 0x5c15            
 21914  06             push    es                    
 21915  bf5263         mov     di, 0x6352            
 21918  9a03175c06     lcall   0x65c, 0x1703            ; RT#57  
 21923  bf3461         mov     di, 0x6134            
 21926  9acb155c06     lcall   0x65c, 0x15cb            ; RT#27  
 21931  bfca5e         mov     di, 0x5eca            
 21934  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 21939  cc             int3                          
 21940  9a271b5c06     lcall   0x65c, 0x1b27            ; RT#20  
 21945  cc             int3                          
 21946  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 21951  8d54cc         lea     dx, [si - 0x34]       
 21954  9a271b5c06     lcall   0x65c, 0x1b27            ; RT#20  
 21959  cc             int3                          
 21960  be5a60         mov     si, 0x605a            
 21963  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 21968  9a551b5c06     lcall   0x65c, 0x1b55            ; RT#34  
 21973  06             push    es                    
 21974  e255           loop    0x562d                
 21976  18564e         sbb     byte ptr [bp + 0x4e], dl
 21979  56             push    si                    
 21980  7b56           jnp     0x5634                
 21982  a856           test    al, 0x56              
 21984  d556           aad     0x56                  
 21986  cc             int3                          
 21987  bb0f00         mov     bx, 0xf               
 21990  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 21995  cc             int3                          
 21996  be4a60         mov     si, 0x604a            
 21999  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 22004  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 22009  be4660         mov     si, 0x6046            
 22012  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 22017  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 22022  cc             int3                          
 22023  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 22028  bb5061         mov     bx, 0x6150            
 22031  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 22036  cc             int3                          
 22037  e9e600         jmp     0x56fe                
 22040  cc             int3                          
 22041  bb0f00         mov     bx, 0xf               
 22044  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 22049  cc             int3                          
 22050  be4a60         mov     si, 0x604a            
 22053  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 22058  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 22063  be4660         mov     si, 0x6046            
 22066  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 22071  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 22076  cc             int3                          
 22077  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 22082  bb5661         mov     bx, 0x6156            
 22085  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 22090  cc             int3                          
 22091  e9b000         jmp     0x56fe                
 22094  cc             int3                          
 22095  be4a60         mov     si, 0x604a            
 22098  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 22103  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 22108  be4660         mov     si, 0x6046            
 22111  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 22116  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 22121  cc             int3                          
 22122  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 22127  bbf662         mov     bx, 0x62f6            
 22130  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 22135  cc             int3                          
 22136  e98300         jmp     0x56fe                
 22139  cc             int3                          
 22140  be4a60         mov     si, 0x604a            
 22143  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 22148  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 22153  be4660         mov     si, 0x6046            
 22156  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 22161  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 22166  cc             int3                          
 22167  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 22172  bbfc62         mov     bx, 0x62fc            
 22175  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 22180  cc             int3                          
 22181  e95600         jmp     0x56fe                
 22184  cc             int3                          
 22185  be4a60         mov     si, 0x604a            
 22188  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 22193  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 22198  be4660         mov     si, 0x6046            
 22201  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 22206  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 22211  cc             int3                          
 22212  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 22217  bb0263         mov     bx, 0x6302            
 22220  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 22225  cc             int3                          
 22226  e92900         jmp     0x56fe                
 22229  cc             int3                          
 22230  be4a60         mov     si, 0x604a            
 22233  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 22238  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 22243  be4660         mov     si, 0x6046            
 22246  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 22251  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 22256  cc             int3                          
 22257  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 22262  bb0863         mov     bx, 0x6308            
 22265  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 22270  cc             int3                          
 22271  9a271b5c06     lcall   0x65c, 0x1b27            ; RT#20  
 22276  cc             int3                          
 22277  be1260         mov     si, 0x6012            
 22280  9adb0e5c06     lcall   0x65c, 0xedb             ; RT#23  
 22285  7403           je      0x5712                
 22287  e90000         jmp     0x5712                
 22290  cc             int3                          
 22291  bb1600         mov     bx, 0x16              
 22294  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 22299  bb0200         mov     bx, 2                 
 22302  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 22307  cc             int3                          
 22308  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 22313  bb4d00         mov     bx, 0x4d              
 22316  baf460         mov     dx, 0x60f4            
 22319  9a471e5c06     lcall   0x65c, 0x1e47            ; RT#16  
 22324  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 22329  cc             int3                          
 22330  bb1600         mov     bx, 0x16              
 22333  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 22338  bb0500         mov     bx, 5                 
 22341  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 22346  cc             int3                          
 22347  bbbc64         mov     bx, 0x64bc               ; = 'dPlease enter file name:'
 22350  9a46265c06     lcall   0x65c, 0x2646            ; RT#37    <<< bx='dPlease enter file name:'
 22355  029a5727       add     bl, byte ptr [bp + si + 0x2757]
 22359  5c             pop     sp                    
 22360  06             push    es                    
 22361  0107           add     word ptr [bx], ax     
 22363  bb7a60         mov     bx, 0x607a            
 22366  9a1e285c06     lcall   0x65c, 0x281e            ; RT#17  
 22371  cc             int3                          
 22372  bb1600         mov     bx, 0x16              
 22375  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 22380  bb0500         mov     bx, 5                 
 22383  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 22388  cc             int3                          
 22389  bbd864         mov     bx, 0x64d8               ; = 'dTarget disk drive: (A,B,C,D)'
 22392  9a46265c06     lcall   0x65c, 0x2646            ; RT#37    <<< bx='dTarget disk drive: (A,B,C,D)'
 22397  029a5727       add     bl, byte ptr [bp + si + 0x2757]
 22401  5c             pop     sp                    
 22402  06             push    es                    
 22403  0107           add     word ptr [bx], ax     
 22405  bb7e60         mov     bx, 0x607e            
 22408  9a1e285c06     lcall   0x65c, 0x281e            ; RT#17  
 22413  cc             int3                          
 22414  bbf864         mov     bx, 0x64f8            
 22417  b87e60         mov     ax, 0x607e            
 22420  9afe0b5c06     lcall   0x65c, 0xbfe             ; RT#29  
 22425  93             xchg    bx, ax                
 22426  bb7a60         mov     bx, 0x607a            
 22429  8bd3           mov     dx, bx                
 22431  9afe0b5c06     lcall   0x65c, 0xbfe             ; RT#29  
 22436  9ac80b5c06     lcall   0x65c, 0xbc8             ; RT#19  
 22441  cc             int3                          
 22442  bb5661         mov     bx, 0x6156            
 22445  9aba1f5c06     lcall   0x65c, 0x1fba            ; RT#62  
 22450  bb0100         mov     bx, 1                 
 22453  ba7a60         mov     dx, 0x607a            
 22456  33c9           xor     cx, cx                
 22458  9a04205c06     lcall   0x65c, 0x2004            ; RT#63  
 22463  cc             int3                          
 22464  bb0100         mov     bx, 1                 
 22467  9abd295c06     lcall   0x65c, 0x29bd            ; RT#38  
 22472  bb1260         mov     bx, 0x6012            
 22475  9a70285c06     lcall   0x65c, 0x2870            ; RT#22  
 22480  bb2e5f         mov     bx, 0x5f2e            
 22483  9a70285c06     lcall   0x65c, 0x2870            ; RT#22  
 22488  bb925f         mov     bx, 0x5f92            
 22491  9a70285c06     lcall   0x65c, 0x2870            ; RT#22  
 22496  bb8a5f         mov     bx, 0x5f8a            
 22499  9a70285c06     lcall   0x65c, 0x2870            ; RT#22  
 22504  bbde5e         mov     bx, 0x5ede            
 22507  9a70285c06     lcall   0x65c, 0x2870            ; RT#22  
 22512  bbda5e         mov     bx, 0x5eda            
 22515  9a70285c06     lcall   0x65c, 0x2870            ; RT#22  
 22520  bbd65e         mov     bx, 0x5ed6            
 22523  9a70285c06     lcall   0x65c, 0x2870            ; RT#22  
 22528  bb225f         mov     bx, 0x5f22            
 22531  9a70285c06     lcall   0x65c, 0x2870            ; RT#22  
 22536  bb265f         mov     bx, 0x5f26            
 22539  9a70285c06     lcall   0x65c, 0x2870            ; RT#22  
 22544  bb2a5f         mov     bx, 0x5f2a            
 22547  9a98285c06     lcall   0x65c, 0x2898            ; RT#35  
 22552  cc             int3                          
 22553  bb0100         mov     bx, 1                 
 22556  9abd295c06     lcall   0x65c, 0x29bd            ; RT#38  
 22561  bb9a5f         mov     bx, 0x5f9a            
 22564  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 22569  cc             int3                          
 22570  bb0100         mov     bx, 1                 
 22573  9abd295c06     lcall   0x65c, 0x29bd            ; RT#38  
 22578  bb9e5f         mov     bx, 0x5f9e            
 22581  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 22586  cc             int3                          
 22587  bee860         mov     si, 0x60e8            
 22590  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
 22595  e93602         jmp     0x5a7c                
 22598  cc             int3                          
 22599  bee860         mov     si, 0x60e8            
 22602  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
 22607  e90702         jmp     0x5a59                
 22610  cc             int3                          
 22611  bee860         mov     si, 0x60e8            
 22614  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
 22619  e9d801         jmp     0x5a36                
 22622  cc             int3                          
 22623  bee860         mov     si, 0x60e8            
 22626  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
 22631  e9a901         jmp     0x5a13                
 22634  cc             int3                          
 22635  bee860         mov     si, 0x60e8            
 22638  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
 22643  e97a01         jmp     0x59f0                
 22646  cc             int3                          
 22647  be825f         mov     si, 0x5f82            
 22650  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 22655  93             xchg    bx, ax                
 22656  bb0500         mov     bx, 5                 
 22659  f7eb           imul    bx                    
 22661  8bd3           mov     dx, bx                
 22663  be865f         mov     si, 0x5f86            
 22666  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 22671  03c3           add     ax, bx                
 22673  8bda           mov     bx, dx                
 22675  f7ea           imul    dx                    
 22677  96             xchg    si, ax                
 22678  8bd6           mov     dx, si                
 22680  bece5e         mov     si, 0x5ece            
 22683  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 22688  03da           add     bx, dx                
 22690  8bf3           mov     si, bx                
 22692  d1e6           shl     si, 1                 
 22694  d1e6           shl     si, 1                 
 22696  81c6e60a       add     si, 0xae6             
 22700  bfe860         mov     di, 0x60e8            
 22703  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 22708  7403           je      0x58b9                
 22710  e92900         jmp     0x58e2                
 22713  cc             int3                          
 22714  bb0100         mov     bx, 1                 
 22717  9abd295c06     lcall   0x65c, 0x29bd            ; RT#38  
 22722  bb0a00         mov     bx, 0xa               
 22725  9a7a285c06     lcall   0x65c, 0x287a            ; RT#64  
 22730  bbce5e         mov     bx, 0x5ece            
 22733  9a70285c06     lcall   0x65c, 0x2870            ; RT#22  
 22738  bb865f         mov     bx, 0x5f86            
 22741  9a70285c06     lcall   0x65c, 0x2870            ; RT#22  
 22746  bb825f         mov     bx, 0x5f82            
 22749  9a98285c06     lcall   0x65c, 0x2898            ; RT#35  
 22754  cc             int3                          
 22755  be825f         mov     si, 0x5f82            
 22758  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 22763  93             xchg    bx, ax                
 22764  bb0500         mov     bx, 5                 
 22767  f7eb           imul    bx                    
 22769  8bd3           mov     dx, bx                
 22771  be865f         mov     si, 0x5f86            
 22774  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 22779  03c3           add     ax, bx                
 22781  8bda           mov     bx, dx                
 22783  f7ea           imul    dx                    
 22785  96             xchg    si, ax                
 22786  8bd6           mov     dx, si                
 22788  bece5e         mov     si, 0x5ece            
 22791  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 22796  03da           add     bx, dx                
 22798  8bf3           mov     si, bx                
 22800  d1e6           shl     si, 1                 
 22802  d1e6           shl     si, 1                 
 22804  81c6da0c       add     si, 0xcda             
 22808  bfe860         mov     di, 0x60e8            
 22811  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 22816  7403           je      0x5925                
 22818  e92900         jmp     0x594e                
 22821  cc             int3                          
 22822  bb0100         mov     bx, 1                 
 22825  9abd295c06     lcall   0x65c, 0x29bd            ; RT#38  
 22830  bb0b00         mov     bx, 0xb               
 22833  9a7a285c06     lcall   0x65c, 0x287a            ; RT#64  
 22838  bbce5e         mov     bx, 0x5ece            
 22841  9a70285c06     lcall   0x65c, 0x2870            ; RT#22  
 22846  bb865f         mov     bx, 0x5f86            
 22849  9a70285c06     lcall   0x65c, 0x2870            ; RT#22  
 22854  bb825f         mov     bx, 0x5f82            
 22857  9a98285c06     lcall   0x65c, 0x2898            ; RT#35  
 22862  cc             int3                          
 22863  be825f         mov     si, 0x5f82            
 22866  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 22871  93             xchg    bx, ax                
 22872  bb0500         mov     bx, 5                 
 22875  f7eb           imul    bx                    
 22877  8bd3           mov     dx, bx                
 22879  be865f         mov     si, 0x5f86            
 22882  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 22887  03c3           add     ax, bx                
 22889  8bda           mov     bx, dx                
 22891  f7ea           imul    dx                    
 22893  bece5e         mov     si, 0x5ece            
 22896  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 22901  03d8           add     bx, ax                
 22903  d1e3           shl     bx, 1                 
 22905  d1e3           shl     bx, 1                 
 22907  d1e3           shl     bx, 1                 
 22909  8bd3           mov     dx, bx                
 22911  be8260         mov     si, 0x6082            
 22914  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 22919  03da           add     bx, dx                
 22921  93             xchg    bx, ax                
 22922  be0300         mov     si, 3                 
 22925  f7ee           imul    si                    
 22927  96             xchg    si, ax                
 22928  8bd6           mov     dx, si                
 22930  be8660         mov     si, 0x6086            
 22933  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 22938  03da           add     bx, dx                
 22940  8bf3           mov     si, bx                
 22942  d1e6           shl     si, 1                 
 22944  d1e6           shl     si, 1                 
 22946  81c66220       add     si, 0x2062            
 22950  bfe860         mov     di, 0x60e8            
 22953  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 22958  7403           je      0x59b3                
 22960  e93100         jmp     0x59e4                
 22963  cc             int3                          
 22964  bb0100         mov     bx, 1                 
 22967  9abd295c06     lcall   0x65c, 0x29bd            ; RT#38  
 22972  bb8660         mov     bx, 0x6086            
 22975  9a70285c06     lcall   0x65c, 0x2870            ; RT#22  
 22980  bb8260         mov     bx, 0x6082            
 22983  9a70285c06     lcall   0x65c, 0x2870            ; RT#22  
 22988  bbce5e         mov     bx, 0x5ece            
 22991  9a70285c06     lcall   0x65c, 0x2870            ; RT#22  
 22996  bb865f         mov     bx, 0x5f86            
 22999  9a70285c06     lcall   0x65c, 0x2870            ; RT#22  
 23004  bb825f         mov     bx, 0x5f82            
 23007  9a98285c06     lcall   0x65c, 0x2898            ; RT#35  
 23012  cc             int3                          
 23013  bfe860         mov     di, 0x60e8            
 23016  be825f         mov     si, 0x5f82            
 23019  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 23024  bf825f         mov     di, 0x5f82            
 23027  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 23032  8bf7           mov     si, di                
 23034  bf4461         mov     di, 0x6144            
 23037  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 23042  7703           ja      0x5a07                
 23044  e96ffe         jmp     0x5876                
 23047  cc             int3                          
 23048  bfe860         mov     di, 0x60e8            
 23051  be865f         mov     si, 0x5f86            
 23054  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 23059  bf865f         mov     di, 0x5f86            
 23062  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 23067  8bf7           mov     si, di                
 23069  bf4461         mov     di, 0x6144            
 23072  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 23077  7703           ja      0x5a2a                
 23079  e940fe         jmp     0x586a                
 23082  cc             int3                          
 23083  bfe860         mov     di, 0x60e8            
 23086  bece5e         mov     si, 0x5ece            
 23089  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 23094  bfce5e         mov     di, 0x5ece            
 23097  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 23102  8bf7           mov     si, di                
 23104  bf4461         mov     di, 0x6144            
 23107  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 23112  7703           ja      0x5a4d                
 23114  e911fe         jmp     0x585e                
 23117  cc             int3                          
 23118  bfe860         mov     di, 0x60e8            
 23121  be8260         mov     si, 0x6082            
 23124  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 23129  bf8260         mov     di, 0x6082            
 23132  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 23137  8bf7           mov     si, di                
 23139  bf7661         mov     di, 0x6176            
 23142  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 23147  7703           ja      0x5a70                
 23149  e9e2fd         jmp     0x5852                
 23152  cc             int3                          
 23153  bfe860         mov     di, 0x60e8            
 23156  be8660         mov     si, 0x6086            
 23159  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 23164  bf8660         mov     di, 0x6086            
 23167  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 23172  8bf7           mov     si, di                
 23174  bf3461         mov     di, 0x6134            
 23177  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 23182  7703           ja      0x5a93                
 23184  e9b3fd         jmp     0x5846                
 23187  cc             int3                          
 23188  bb0100         mov     bx, 1                 
 23191  9abd295c06     lcall   0x65c, 0x29bd            ; RT#38  
 23196  bb6400         mov     bx, 0x64              
 23199  9aa2285c06     lcall   0x65c, 0x28a2            ; RT#75  
 23204  cc             int3                          
 23205  9a7f1f5c06     lcall   0x65c, 0x1f7f            ; RT#65  
 23210  cc             int3                          
 23211  e95805         jmp     0x6006                
 23214  cc             int3                          
 23215  9ad5125c06     lcall   0x65c, 0x12d5            ; RT#60  
 23220  cc             int3                          
 23221  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 23226  ea00cc9a85     ljmp    0x859a:0xcc00         
 23231  07             pop     es                    
 23232  5c             pop     sp                    
 23233  06             push    es                    
 23234  cc             int3                          
 23235  bb0800         mov     bx, 8                 
 23238  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 23243  bb0100         mov     bx, 1                 
 23246  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 23251  cc             int3                          
 23252  bbbc64         mov     bx, 0x64bc               ; = 'dPlease enter file name:'
 23255  9a46265c06     lcall   0x65c, 0x2646            ; RT#37    <<< bx='dPlease enter file name:'
 23260  029a5727       add     bl, byte ptr [bp + si + 0x2757]
 23264  5c             pop     sp                    
 23265  06             push    es                    
 23266  0107           add     word ptr [bx], ax     
 23268  bb7a60         mov     bx, 0x607a            
 23271  9a1e285c06     lcall   0x65c, 0x281e            ; RT#17  
 23276  cc             int3                          
 23277  bb0a00         mov     bx, 0xa               
 23280  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 23285  bb0100         mov     bx, 1                 
 23288  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 23293  cc             int3                          
 23294  bbfe64         mov     bx, 0x64fe               ; = 'eTarget disk drive: (a,b,c,d)'
 23297  9a46265c06     lcall   0x65c, 0x2646            ; RT#37    <<< bx='eTarget disk drive: (a,b,c,d)'
 23302  029a5727       add     bl, byte ptr [bp + si + 0x2757]
 23306  5c             pop     sp                    
 23307  06             push    es                    
 23308  0107           add     word ptr [bx], ax     
 23310  bb7e60         mov     bx, 0x607e            
 23313  9a1e285c06     lcall   0x65c, 0x281e            ; RT#17  
 23318  cc             int3                          
 23319  bbf864         mov     bx, 0x64f8            
 23322  b87e60         mov     ax, 0x607e            
 23325  9afe0b5c06     lcall   0x65c, 0xbfe             ; RT#29  
 23330  93             xchg    bx, ax                
 23331  bb7a60         mov     bx, 0x607a            
 23334  8bd3           mov     dx, bx                
 23336  9afe0b5c06     lcall   0x65c, 0xbfe             ; RT#29  
 23341  9ac80b5c06     lcall   0x65c, 0xbc8             ; RT#19  
 23346  cc             int3                          
 23347  bb1e65         mov     bx, 0x651e            
 23350  9aba1f5c06     lcall   0x65c, 0x1fba            ; RT#62  
 23355  bb0100         mov     bx, 1                 
 23358  ba7a60         mov     dx, 0x607a            
 23361  33c9           xor     cx, cx                
 23363  9a04205c06     lcall   0x65c, 0x2004            ; RT#63  
 23368  cc             int3                          
 23369  bb0100         mov     bx, 1                 
 23372  9a92265c06     lcall   0x65c, 0x2692            ; RT#39  
 23377  9a57275c06     lcall   0x65c, 0x2757            ; RT#28  
 23382  0a05           or      al, byte ptr [di]     
 23384  050505         add     ax, 0x505             
 23387  050505         add     ax, 0x505             
 23390  050505         add     ax, 0x505             
 23393  bb1260         mov     bx, 0x6012            
 23396  9a1e285c06     lcall   0x65c, 0x281e            ; RT#17  
 23401  bb2e5f         mov     bx, 0x5f2e            
 23404  9a1e285c06     lcall   0x65c, 0x281e            ; RT#17  
 23409  bb925f         mov     bx, 0x5f92            
 23412  9a1e285c06     lcall   0x65c, 0x281e            ; RT#17  
 23417  bb8a60         mov     bx, 0x608a            
 23420  9a1e285c06     lcall   0x65c, 0x281e            ; RT#17  
 23425  bb8e60         mov     bx, 0x608e            
 23428  9a1e285c06     lcall   0x65c, 0x281e            ; RT#17  
 23433  bb9260         mov     bx, 0x6092            
 23436  9a1e285c06     lcall   0x65c, 0x281e            ; RT#17  
 23441  bb9660         mov     bx, 0x6096            
 23444  9a1e285c06     lcall   0x65c, 0x281e            ; RT#17  
 23449  bb9a60         mov     bx, 0x609a            
 23452  9a1e285c06     lcall   0x65c, 0x281e            ; RT#17  
 23457  bb9e60         mov     bx, 0x609e            
 23460  9a1e285c06     lcall   0x65c, 0x281e            ; RT#17  
 23465  bba260         mov     bx, 0x60a2            
 23468  9a1e285c06     lcall   0x65c, 0x281e            ; RT#17  
 23473  cc             int3                          
 23474  bb0100         mov     bx, 1                 
 23477  9a92265c06     lcall   0x65c, 0x2692            ; RT#39  
 23482  9a57275c06     lcall   0x65c, 0x2757            ; RT#28  
 23487  0107           add     word ptr [bx], ax     
 23489  bb9a5f         mov     bx, 0x5f9a            
 23492  9a1e285c06     lcall   0x65c, 0x281e            ; RT#17  
 23497  cc             int3                          
 23498  bb0100         mov     bx, 1                 
 23501  9a92265c06     lcall   0x65c, 0x2692            ; RT#39  
 23506  9a57275c06     lcall   0x65c, 0x2757            ; RT#28  
 23511  0107           add     word ptr [bx], ax     
 23513  bb9e5f         mov     bx, 0x5f9e            
 23516  9a1e285c06     lcall   0x65c, 0x281e            ; RT#17  
 23521  cc             int3                          
 23522  bb0100         mov     bx, 1                 
 23525  9a92265c06     lcall   0x65c, 0x2692            ; RT#39  
 23530  9a57275c06     lcall   0x65c, 0x2757            ; RT#28  
 23535  0105           add     word ptr [di], ax     
 23537  bb0e5f         mov     bx, 0x5f0e            
 23540  9a1e285c06     lcall   0x65c, 0x281e            ; RT#17  
 23545  cc             int3                          
 23546  bf3c61         mov     di, 0x613c            
 23549  be0e5f         mov     si, 0x5f0e            
 23552  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 23557  7503           jne     0x5c0a                
 23559  e98501         jmp     0x5d8f                
 23562  cc             int3                          
 23563  bf2465         mov     di, 0x6524            
 23566  be0e5f         mov     si, 0x5f0e            
 23569  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 23574  7403           je      0x5c1b                
 23576  e96800         jmp     0x5c83                
 23579  cc             int3                          
 23580  bb0100         mov     bx, 1                 
 23583  9a92265c06     lcall   0x65c, 0x2692            ; RT#39  
 23588  9a57275c06     lcall   0x65c, 0x2757            ; RT#28  
 23593  0305           add     ax, word ptr [di]     
 23595  0505bb         add     ax, 0xbb05            
 23598  ce             into                          
 23599  5e             pop     si                    
 23600  9a1e285c06     lcall   0x65c, 0x281e            ; RT#17  
 23605  bb865f         mov     bx, 0x5f86            
 23608  9a1e285c06     lcall   0x65c, 0x281e            ; RT#17  
 23613  bb825f         mov     bx, 0x5f82            
 23616  9a1e285c06     lcall   0x65c, 0x281e            ; RT#17  
 23621  cc             int3                          
 23622  be825f         mov     si, 0x5f82            
 23625  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 23630  93             xchg    bx, ax                
 23631  bb0500         mov     bx, 5                 
 23634  f7eb           imul    bx                    
 23636  8bd3           mov     dx, bx                
 23638  be865f         mov     si, 0x5f86            
 23641  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 23646  03c3           add     ax, bx                
 23648  8bda           mov     bx, dx                
 23650  f7ea           imul    dx                    
 23652  97             xchg    di, ax                
 23653  bece5e         mov     si, 0x5ece            
 23656  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 23661  03fb           add     di, bx                
 23663  d1e7           shl     di, 1                 
 23665  d1e7           shl     di, 1                 
 23667  81c7e60a       add     di, 0xae6             
 23671  bee860         mov     si, 0x60e8            
 23674  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 23679  cc             int3                          
 23680  e90801         jmp     0x5d8b                
 23683  cc             int3                          
 23684  bf2865         mov     di, 0x6528            
 23687  be0e5f         mov     si, 0x5f0e            
 23690  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 23695  7403           je      0x5c94                
 23697  e96800         jmp     0x5cfc                
 23700  cc             int3                          
 23701  bb0100         mov     bx, 1                 
 23704  9a92265c06     lcall   0x65c, 0x2692            ; RT#39  
 23709  9a57275c06     lcall   0x65c, 0x2757            ; RT#28  
 23714  0305           add     ax, word ptr [di]     
 23716  0505bb         add     ax, 0xbb05            
 23719  ce             into                          
 23720  5e             pop     si                    
 23721  9a1e285c06     lcall   0x65c, 0x281e            ; RT#17  
 23726  bb865f         mov     bx, 0x5f86            
 23729  9a1e285c06     lcall   0x65c, 0x281e            ; RT#17  
 23734  bb825f         mov     bx, 0x5f82            
 23737  9a1e285c06     lcall   0x65c, 0x281e            ; RT#17  
 23742  cc             int3                          
 23743  be825f         mov     si, 0x5f82            
 23746  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 23751  93             xchg    bx, ax                
 23752  bb0500         mov     bx, 5                 
 23755  f7eb           imul    bx                    
 23757  8bd3           mov     dx, bx                
 23759  be865f         mov     si, 0x5f86            
 23762  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 23767  03c3           add     ax, bx                
 23769  8bda           mov     bx, dx                
 23771  f7ea           imul    dx                    
 23773  97             xchg    di, ax                
 23774  bece5e         mov     si, 0x5ece            
 23777  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 23782  03fb           add     di, bx                
 23784  d1e7           shl     di, 1                 
 23786  d1e7           shl     di, 1                 
 23788  81c7da0c       add     di, 0xcda             
 23792  bee860         mov     si, 0x60e8            
 23795  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 23800  cc             int3                          
 23801  e98f00         jmp     0x5d8b                
 23804  cc             int3                          
 23805  bb0100         mov     bx, 1                 
 23808  9a92265c06     lcall   0x65c, 0x2692            ; RT#39  
 23813  9a57275c06     lcall   0x65c, 0x2757            ; RT#28  
 23818  0405           add     al, 5                 
 23820  050505         add     ax, 0x505             
 23823  bb8260         mov     bx, 0x6082            
 23826  9a1e285c06     lcall   0x65c, 0x281e            ; RT#17  
 23831  bbce5e         mov     bx, 0x5ece            
 23834  9a1e285c06     lcall   0x65c, 0x281e            ; RT#17  
 23839  bb865f         mov     bx, 0x5f86            
 23842  9a1e285c06     lcall   0x65c, 0x281e            ; RT#17  
 23847  bb825f         mov     bx, 0x5f82            
 23850  9a1e285c06     lcall   0x65c, 0x281e            ; RT#17  
 23855  cc             int3                          
 23856  be825f         mov     si, 0x5f82            
 23859  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 23864  93             xchg    bx, ax                
 23865  bb0500         mov     bx, 5                 
 23868  f7eb           imul    bx                    
 23870  8bd3           mov     dx, bx                
 23872  be865f         mov     si, 0x5f86            
 23875  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 23880  03c3           add     ax, bx                
 23882  8bda           mov     bx, dx                
 23884  f7ea           imul    dx                    
 23886  bece5e         mov     si, 0x5ece            
 23889  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 23894  03d8           add     bx, ax                
 23896  d1e3           shl     bx, 1                 
 23898  d1e3           shl     bx, 1                 
 23900  d1e3           shl     bx, 1                 
 23902  8bd3           mov     dx, bx                
 23904  be8260         mov     si, 0x6082            
 23907  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 23912  03da           add     bx, dx                
 23914  93             xchg    bx, ax                
 23915  bf0300         mov     di, 3                 
 23918  f7ef           imul    di                    
 23920  97             xchg    di, ax                
 23921  be0e5f         mov     si, 0x5f0e            
 23924  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 23929  03fb           add     di, bx                
 23931  d1e7           shl     di, 1                 
 23933  d1e7           shl     di, 1                 
 23935  81c76220       add     di, 0x2062            
 23939  bee860         mov     si, 0x60e8            
 23942  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 23947  cc             int3                          
 23948  e952fe         jmp     0x5be1                
 23951  cc             int3                          
 23952  9a7f1f5c06     lcall   0x65c, 0x1f7f            ; RT#65  
 23957  cc             int3                          
 23958  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 23963  99             cdq                           
 23964  34cc           xor     al, 0xcc              
 23966  bee860         mov     si, 0x60e8            
 23969  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
 23974  e9aa01         jmp     0x5f53                
 23977  cc             int3                          
 23978  bee860         mov     si, 0x60e8            
 23981  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
 23986  e97b01         jmp     0x5f30                
 23989  cc             int3                          
 23990  bee860         mov     si, 0x60e8            
 23993  9a230d5c06     lcall   0x65c, 0xd23             ; RT#15  
 23998  e94c01         jmp     0x5f0d                
 24001  cc             int3                          
 24002  be825f         mov     si, 0x5f82            
 24005  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 24010  93             xchg    bx, ax                
 24011  bb0500         mov     bx, 5                 
 24014  f7eb           imul    bx                    
 24016  8bd3           mov     dx, bx                
 24018  be865f         mov     si, 0x5f86            
 24021  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 24026  03c3           add     ax, bx                
 24028  8bda           mov     bx, dx                
 24030  f7ea           imul    dx                    
 24032  96             xchg    si, ax                
 24033  8bd6           mov     dx, si                
 24035  bece5e         mov     si, 0x5ece            
 24038  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 24043  03da           add     bx, dx                
 24045  8bf3           mov     si, bx                
 24047  d1e6           shl     si, 1                 
 24049  d1e6           shl     si, 1                 
 24051  8bde           mov     bx, si                
 24053  81c6e60a       add     si, 0xae6             
 24057  bfe860         mov     di, 0x60e8            
 24060  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 24065  ba0000         mov     dx, 0                 
 24068  7501           jne     0x5e07                
 24070  4a             dec     dx                    
 24071  81c3da0c       add     bx, 0xcda             
 24075  8bf3           mov     si, bx                
 24077  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 24082  b90000         mov     cx, 0                 
 24085  7501           jne     0x5e18                
 24087  49             dec     cx                    
 24088  0bca           or      cx, dx                
 24090  23c9           and     cx, cx                
 24092  7503           jne     0x5e21                
 24094  e93d00         jmp     0x5e5e                
 24097  cc             int3                          
 24098  be825f         mov     si, 0x5f82            
 24101  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 24106  93             xchg    bx, ax                
 24107  bb0500         mov     bx, 5                 
 24110  f7eb           imul    bx                    
 24112  8bd3           mov     dx, bx                
 24114  be865f         mov     si, 0x5f86            
 24117  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 24122  03c3           add     ax, bx                
 24124  8bda           mov     bx, dx                
 24126  f7ea           imul    dx                    
 24128  97             xchg    di, ax                
 24129  bece5e         mov     si, 0x5ece            
 24132  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 24137  03fb           add     di, bx                
 24139  d1e7           shl     di, 1                 
 24141  d1e7           shl     di, 1                 
 24143  81c7f208       add     di, 0x8f2             
 24147  bee860         mov     si, 0x60e8            
 24150  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 24155  e90400         jmp     0x5e62                
 24158  cc             int3                          
 24159  e99f00         jmp     0x5f01                
 24162  cc             int3                          
 24163  be825f         mov     si, 0x5f82            
 24166  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 24171  93             xchg    bx, ax                
 24172  bb0500         mov     bx, 5                 
 24175  f7eb           imul    bx                    
 24177  8bd3           mov     dx, bx                
 24179  be865f         mov     si, 0x5f86            
 24182  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 24187  03c3           add     ax, bx                
 24189  8bda           mov     bx, dx                
 24191  f7ea           imul    dx                    
 24193  96             xchg    si, ax                
 24194  8bd6           mov     dx, si                
 24196  bece5e         mov     si, 0x5ece            
 24199  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 24204  03da           add     bx, dx                
 24206  8bf3           mov     si, bx                
 24208  d1e6           shl     si, 1                 
 24210  d1e6           shl     si, 1                 
 24212  81c6e60a       add     si, 0xae6             
 24216  bfe860         mov     di, 0x60e8            
 24219  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 24224  7503           jne     0x5ea5                
 24226  e93000         jmp     0x5ed5                
 24229  cc             int3                          
 24230  bf225f         mov     di, 0x5f22            
 24233  bece5e         mov     si, 0x5ece            
 24236  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 24241  cc             int3                          
 24242  bf265f         mov     di, 0x5f26            
 24245  be865f         mov     si, 0x5f86            
 24248  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 24253  cc             int3                          
 24254  bf2a5f         mov     di, 0x5f2a            
 24257  be825f         mov     si, 0x5f82            
 24260  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 24265  cc             int3                          
 24266  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 24271  8810           mov     byte ptr [bx + si], dl
 24273  cc             int3                          
 24274  e92c00         jmp     0x5f01                
 24277  cc             int3                          
 24278  bfde5e         mov     di, 0x5ede            
 24281  bece5e         mov     si, 0x5ece            
 24284  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 24289  cc             int3                          
 24290  bfda5e         mov     di, 0x5eda            
 24293  be865f         mov     si, 0x5f86            
 24296  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 24301  cc             int3                          
 24302  bfd65e         mov     di, 0x5ed6            
 24305  be825f         mov     si, 0x5f82            
 24308  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 24313  cc             int3                          
 24314  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 24319  bd10cc         mov     bp, 0xcc10            
 24322  bfe860         mov     di, 0x60e8            
 24325  be825f         mov     si, 0x5f82            
 24328  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 24333  bf825f         mov     di, 0x5f82            
 24336  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 24341  8bf7           mov     si, di                
 24343  bf4461         mov     di, 0x6144            
 24346  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 24351  7703           ja      0x5f24                
 24353  e99dfe         jmp     0x5dc1                
 24356  cc             int3                          
 24357  bfe860         mov     di, 0x60e8            
 24360  be865f         mov     si, 0x5f86            
 24363  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 24368  bf865f         mov     di, 0x5f86            
 24371  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 24376  8bf7           mov     si, di                
 24378  bf4461         mov     di, 0x6144            
 24381  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 24386  7703           ja      0x5f47                
 24388  e96efe         jmp     0x5db5                
 24391  cc             int3                          
 24392  bfe860         mov     di, 0x60e8            
 24395  bece5e         mov     si, 0x5ece            
 24398  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 24403  bfce5e         mov     di, 0x5ece            
 24406  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 24411  8bf7           mov     si, di                
 24413  bf4461         mov     di, 0x6144            
 24416  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 24421  7703           ja      0x5f6a                
 24423  e93ffe         jmp     0x5da9                
 24426  cc             int3                          
 24427  be8a60         mov     si, 0x608a            
 24430  9adb0e5c06     lcall   0x65c, 0xedb             ; RT#23  
 24435  7503           jne     0x5f78                
 24437  e93f00         jmp     0x5fb7                
 24440  cc             int3                          
 24441  bf225f         mov     di, 0x5f22            
 24444  be9a60         mov     si, 0x609a            
 24447  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 24452  cc             int3                          
 24453  bf265f         mov     di, 0x5f26            
 24456  be9e60         mov     si, 0x609e            
 24459  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 24464  cc             int3                          
 24465  bf2a5f         mov     di, 0x5f2a            
 24468  bea260         mov     si, 0x60a2            
 24471  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 24476  cc             int3                          
 24477  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 24482  8810           mov     byte ptr [bx + si], dl
 24484  cc             int3                          
 24485  be1260         mov     si, 0x6012            
 24488  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 24493  9a551b5c06     lcall   0x65c, 0x1b55            ; RT#34  
 24498  02f6           add     dh, dh                
 24500  5f             pop     di                    
 24501  aa             stosb   byte ptr es:[di], al  
 24502  4b             dec     bx                    
 24503  cc             int3                          
 24504  bfde5e         mov     di, 0x5ede            
 24507  be8e60         mov     si, 0x608e            
 24510  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 24515  cc             int3                          
 24516  bfda5e         mov     di, 0x5eda            
 24519  be9260         mov     si, 0x6092            
 24522  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 24527  cc             int3                          
 24528  bfd65e         mov     di, 0x5ed6            
 24531  be9660         mov     si, 0x6096            
 24534  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 24539  cc             int3                          
 24540  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 24545  bd10cc         mov     bp, 0xcc10            
 24548  be1260         mov     si, 0x6012            
 24551  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 24556  9a551b5c06     lcall   0x65c, 0x1b55            ; RT#34  
 24561  026903         add     ch, byte ptr [bx + di + 3]
 24564  fc             cld                           
 24565  49             dec     cx                    
 24566  cc             int3                          
 24567  bf325f         mov     di, 0x5f32            
 24570  be3c61         mov     si, 0x613c            
 24573  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 24578  cc             int3                          
 24579  e97da5         jmp     0x583                 
 24582  cc             int3                          
 24583  be8a5f         mov     si, 0x5f8a            
 24586  9adb0e5c06     lcall   0x65c, 0xedb             ; RT#23  
 24591  7503           jne     0x6014                
 24593  e91300         jmp     0x6027                
 24596  cc             int3                          
 24597  be1260         mov     si, 0x6012            
 24600  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 24605  9a551b5c06     lcall   0x65c, 0x1b55            ; RT#34  
 24610  02f6           add     dh, dh                
 24612  5f             pop     di                    
 24613  aa             stosb   byte ptr es:[di], al  
 24614  4b             dec     bx                    
 24615  cc             int3                          
 24616  be1260         mov     si, 0x6012            
 24619  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 24624  9a551b5c06     lcall   0x65c, 0x1b55            ; RT#34  
 24629  026903         add     ch, byte ptr [bx + di + 3]
 24632  fc             cld                           
 24633  49             dec     cx                    
 24634  cc             int3                          
 24635  bf325f         mov     di, 0x5f32            
 24638  be3c61         mov     si, 0x613c            
 24641  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 24646  cc             int3                          
 24647  e939a5         jmp     0x583                 
 24650  cc             int3                          
 24651  9a85075c06     lcall   0x65c, 0x785             ; RT#31  
 24656  cc             int3                          
 24657  9ae1145c06     lcall   0x65c, 0x14e1            ; RT#76  
 24662  cc             int3                          
 24663  bb2c65         mov     bx, 0x652c            
 24666  baa660         mov     dx, 0x60a6            
 24669  9ac80b5c06     lcall   0x65c, 0xbc8             ; RT#19  
 24674  cc             int3                          
 24675  bb1600         mov     bx, 0x16              
 24678  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 24683  bb1e00         mov     bx, 0x1e              
 24686  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 24691  cc             int3                          
 24692  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 24697  bb5f00         mov     bx, 0x5f              
 24700  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 24705  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 24710  cc             int3                          
 24711  33db           xor     bx, bx                
 24713  9a8f0e5c06     lcall   0x65c, 0xe8f             ; RT#45  
 24718  4b             dec     bx                    
 24719  9a9d1b5c06     lcall   0x65c, 0x1b9d            ; RT#32  
 24724  bfaa60         mov     di, 0x60aa            
 24727  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 24732  cc             int3                          
 24733  9a071d5c06     lcall   0x65c, 0x1d07            ; RT#33  
 24738  ba0260         mov     dx, 0x6002            
 24741  9ac80b5c06     lcall   0x65c, 0xbc8             ; RT#19  
 24746  cc             int3                          
 24747  bb2c65         mov     bx, 0x652c            
 24750  b80260         mov     ax, 0x6002            
 24753  9a380c5c06     lcall   0x65c, 0xc38             ; RT#18  
 24758  7503           jne     0x60bb                
 24760  e96601         jmp     0x6221                
 24763  cc             int3                          
 24764  bb0260         mov     bx, 0x6002            
 24767  9aec1c5c06     lcall   0x65c, 0x1cec            ; RT#25  
 24772  83fb02         cmp     bx, 2                 
 24775  7d03           jge     0x60cc                
 24777  e95000         jmp     0x611c                
 24780  cc             int3                          
 24781  bb0260         mov     bx, 0x6002            
 24784  ba0100         mov     dx, 1                 
 24787  9ade1d5c06     lcall   0x65c, 0x1dde            ; RT#44  
 24792  93             xchg    bx, ax                
 24793  bb7464         mov     bx, 0x6474            
 24796  9a380c5c06     lcall   0x65c, 0xc38             ; RT#18  
 24801  7403           je      0x60e6                
 24803  e90c00         jmp     0x60f2                
 24806  cc             int3                          
 24807  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 24812  2562cc         and     ax, 0xcc62            
 24815  e92f01         jmp     0x6221                
 24818  cc             int3                          
 24819  bb0260         mov     bx, 0x6002            
 24822  ba0100         mov     dx, 1                 
 24825  9ade1d5c06     lcall   0x65c, 0x1dde            ; RT#44  
 24830  93             xchg    bx, ax                
 24831  bb7a64         mov     bx, 0x647a            
 24834  9a380c5c06     lcall   0x65c, 0xc38             ; RT#18  
 24839  7403           je      0x610c                
 24841  e90c00         jmp     0x6118                
 24844  cc             int3                          
 24845  9afe1a5c06     lcall   0x65c, 0x1afe            ; RT#6   
 24850  3562cc         xor     ax, 0xcc62            
 24853  e90901         jmp     0x6221                
 24856  cc             int3                          
 24857  e90501         jmp     0x6221                
 24860  cc             int3                          
 24861  bbd863         mov     bx, 0x63d8            
 24864  b80260         mov     ax, 0x6002            
 24867  9afe0b5c06     lcall   0x65c, 0xbfe             ; RT#29  
 24872  9af31c5c06     lcall   0x65c, 0x1cf3            ; RT#36  
 24877  83fb0d         cmp     bx, 0xd               
 24880  7503           jne     0x6135                
 24882  e92802         jmp     0x635d                
 24885  cc             int3                          
 24886  33db           xor     bx, bx                
 24888  8bd3           mov     dx, bx                
 24890  9a8f0e5c06     lcall   0x65c, 0xe8f             ; RT#45  
 24895  83fb1d         cmp     bx, 0x1d              
 24898  b90000         mov     cx, 0                 
 24901  7d01           jge     0x6148                
 24903  49             dec     cx                    
 24904  8bda           mov     bx, dx                
 24906  9a8f0e5c06     lcall   0x65c, 0xe8f             ; RT#45  
 24911  83fb23         cmp     bx, 0x23              
 24914  ba0000         mov     dx, 0                 
 24917  7e01           jle     0x6158                
 24919  4a             dec     dx                    
 24920  0bd1           or      dx, cx                
 24922  23d2           and     dx, dx                
 24924  7403           je      0x6161                
 24926  e9c000         jmp     0x6221                
 24929  cc             int3                          
 24930  bb3065         mov     bx, 0x6530            
 24933  b80260         mov     ax, 0x6002            
 24936  9afe0b5c06     lcall   0x65c, 0xbfe             ; RT#29  
 24941  9af31c5c06     lcall   0x65c, 0x1cf3            ; RT#36  
 24946  83fb20         cmp     bx, 0x20              
 24949  7403           je      0x617a                
 24951  e91700         jmp     0x6191                
 24954  cc             int3                          
 24955  bfe860         mov     di, 0x60e8            
 24958  beaa60         mov     si, 0x60aa            
 24961  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 24966  8bfe           mov     di, si                
 24968  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 24973  cc             int3                          
 24974  e93800         jmp     0x61c9                
 24977  cc             int3                          
 24978  bba660         mov     bx, 0x60a6            
 24981  9aec1c5c06     lcall   0x65c, 0x1cec            ; RT#25  
 24986  83fb05         cmp     bx, 5                 
 24989  7503           jne     0x61a2                
 24991  e97f00         jmp     0x6221                
 24994  cc             int3                          
 24995  33db           xor     bx, bx                
 24997  9a8f0e5c06     lcall   0x65c, 0xe8f             ; RT#45  
 25002  9a9d1b5c06     lcall   0x65c, 0x1b9d            ; RT#32  
 25007  bfaa60         mov     di, 0x60aa            
 25010  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 25015  cc             int3                          
 25016  bb0260         mov     bx, 0x6002            
 25019  b8a660         mov     ax, 0x60a6            
 25022  9afe0b5c06     lcall   0x65c, 0xbfe             ; RT#29  
 25027  92             xchg    dx, ax                
 25028  9ac80b5c06     lcall   0x65c, 0xbc8             ; RT#19  
 25033  cc             int3                          
 25034  9a300b5c06     lcall   0x65c, 0xb30             ; RT#49  
 25039  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 25044  bf5663         mov     di, 0x6356            
 25047  beaa60         mov     si, 0x60aa            
 25050  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 25055  9a301c5c06     lcall   0x65c, 0x1c30            ; RT#21  
 25060  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 25065  cc             int3                          
 25066  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 25071  bb0260         mov     bx, 0x6002            
 25074  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 25079  cc             int3                          
 25080  9a300b5c06     lcall   0x65c, 0xb30             ; RT#49  
 25085  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 25090  33db           xor     bx, bx                
 25092  9a8f0e5c06     lcall   0x65c, 0xe8f             ; RT#45  
 25097  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 25102  cc             int3                          
 25103  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 25108  bb5f00         mov     bx, 0x5f              
 25111  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 25116  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 25121  cc             int3                          
 25122  e977fe         jmp     0x609c                
 25125  cc             int3                          
 25126  bfae60         mov     di, 0x60ae            
 25129  be1663         mov     si, 0x6316            
 25132  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 25137  cc             int3                          
 25138  e90c00         jmp     0x6241                
 25141  cc             int3                          
 25142  bfae60         mov     di, 0x60ae            
 25145  be3665         mov     si, 0x6536            
 25148  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 25153  cc             int3                          
 25154  33db           xor     bx, bx                
 25156  9a8f0e5c06     lcall   0x65c, 0xe8f             ; RT#45  
 25161  9a9d1b5c06     lcall   0x65c, 0x1b9d            ; RT#32  
 25166  bfba5e         mov     di, 0x5eba            
 25169  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 25174  cc             int3                          
 25175  bfae60         mov     di, 0x60ae            
 25178  beba5e         mov     si, 0x5eba            
 25181  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 25186  bfaa60         mov     di, 0x60aa            
 25189  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 25194  cc             int3                          
 25195  bf3a65         mov     di, 0x653a            
 25198  beaa60         mov     si, 0x60aa            
 25201  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 25206  bb0000         mov     bx, 0                 
 25209  7301           jae     0x627c                
 25211  4b             dec     bx                    
 25212  bf3e65         mov     di, 0x653e            
 25215  9acc1a5c06     lcall   0x65c, 0x1acc            ; RT#3   
 25220  ba0000         mov     dx, 0                 
 25223  7601           jbe     0x628a                
 25225  4a             dec     dx                    
 25226  0bd3           or      dx, bx                
 25228  23d2           and     dx, dx                
 25230  7503           jne     0x6293                
 25232  e91800         jmp     0x62ab                
 25235  cc             int3                          
 25236  bf5663         mov     di, 0x6356            
 25239  beba5e         mov     si, 0x5eba            
 25242  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 25247  bfaa60         mov     di, 0x60aa            
 25250  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 25255  cc             int3                          
 25256  e94100         jmp     0x62ec                
 25259  cc             int3                          
 25260  bba660         mov     bx, 0x60a6            
 25263  9aec1c5c06     lcall   0x65c, 0x1cec            ; RT#25  
 25268  4b             dec     bx                    
 25269  9a9d1b5c06     lcall   0x65c, 0x1b9d            ; RT#32  
 25274  bfb260         mov     di, 0x60b2            
 25277  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 25282  cc             int3                          
 25283  beb260         mov     si, 0x60b2            
 25286  9adb0e5c06     lcall   0x65c, 0xedb             ; RT#23  
 25291  7303           jae     0x62d0                
 25293  e91c00         jmp     0x62ec                
 25296  cc             int3                          
 25297  beb260         mov     si, 0x60b2            
 25300  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 25305  8bd3           mov     dx, bx                
 25307  bba660         mov     bx, 0x60a6            
 25310  8bcb           mov     cx, bx                
 25312  9ad51d5c06     lcall   0x65c, 0x1dd5            ; RT#46  
 25317  8bd1           mov     dx, cx                
 25319  9ac80b5c06     lcall   0x65c, 0xbc8             ; RT#19  
 25324  cc             int3                          
 25325  9a300b5c06     lcall   0x65c, 0xb30             ; RT#49  
 25330  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 25335  bf5663         mov     di, 0x6356            
 25338  beba5e         mov     si, 0x5eba            
 25341  9ad6155c06     lcall   0x65c, 0x15d6            ; RT#10  
 25346  9a301c5c06     lcall   0x65c, 0x1c30            ; RT#21  
 25351  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 25356  cc             int3                          
 25357  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 25362  bbf460         mov     bx, 0x60f4            
 25365  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 25370  cc             int3                          
 25371  9a300b5c06     lcall   0x65c, 0xb30             ; RT#49  
 25376  9a9d1b5c06     lcall   0x65c, 0x1b9d            ; RT#32  
 25381  bfb660         mov     di, 0x60b6            
 25384  9acb155c06     lcall   0x65c, 0x15cb            ; RT#27  
 25389  9a301c5c06     lcall   0x65c, 0x1c30            ; RT#21  
 25394  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 25399  beaa60         mov     si, 0x60aa            
 25402  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 25407  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 25412  cc             int3                          
 25413  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 25418  bb5f00         mov     bx, 0x5f              
 25421  9a241d5c06     lcall   0x65c, 0x1d24            ; RT#14  
 25426  9a93285c06     lcall   0x65c, 0x2893            ; RT#5   
 25431  cc             int3                          
 25432  9a271b5c06     lcall   0x65c, 0x1b27            ; RT#20  
 25437  cc             int3                          
 25438  9a300b5c06     lcall   0x65c, 0xb30             ; RT#49  
 25443  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 25448  beaa60         mov     si, 0x60aa            
 25451  9ae51b5c06     lcall   0x65c, 0x1be5            ; RT#2   
 25456  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 25461  cc             int3                          
 25462  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 25467  bbf460         mov     bx, 0x60f4            
 25470  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 25475  cc             int3                          
 25476  bba660         mov     bx, 0x60a6            
 25479  9aec1c5c06     lcall   0x65c, 0x1cec            ; RT#25  
 25484  83fb05         cmp     bx, 5                 
 25487  7c03           jl      0x6394                
 25489  e91000         jmp     0x63a4                
 25492  cc             int3                          
 25493  bfd25e         mov     di, 0x5ed2            
 25496  bee860         mov     si, 0x60e8            
 25499  9a0c0d5c06     lcall   0x65c, 0xd0c             ; RT#1   
 25504  cc             int3                          
 25505  e95d00         jmp     0x6401                
 25508  cc             int3                          
 25509  bba660         mov     bx, 0x60a6            
 25512  ba0100         mov     dx, 1                 
 25515  9ad51d5c06     lcall   0x65c, 0x1dd5            ; RT#46  
 25520  9a0e185c06     lcall   0x65c, 0x180e            ; RT#51  
 25525  9abf1b5c06     lcall   0x65c, 0x1bbf            ; RT#48  
 25530  bfc25e         mov     di, 0x5ec2            
 25533  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 25538  cc             int3                          
 25539  bba660         mov     bx, 0x60a6            
 25542  ba0300         mov     dx, 3                 
 25545  b90100         mov     cx, 1                 
 25548  9aec1d5c06     lcall   0x65c, 0x1dec            ; RT#56  
 25553  9a0e185c06     lcall   0x65c, 0x180e            ; RT#51  
 25558  9abf1b5c06     lcall   0x65c, 0x1bbf            ; RT#48  
 25563  bfc65e         mov     di, 0x5ec6            
 25566  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 25571  cc             int3                          
 25572  bba660         mov     bx, 0x60a6            
 25575  ba0100         mov     dx, 1                 
 25578  9ade1d5c06     lcall   0x65c, 0x1dde            ; RT#44  
 25583  9a0e185c06     lcall   0x65c, 0x180e            ; RT#51  
 25588  9abf1b5c06     lcall   0x65c, 0x1bbf            ; RT#48  
 25593  bfca5e         mov     di, 0x5eca            
 25596  9a090d5c06     lcall   0x65c, 0xd09             ; RT#7   
 25601  cc             int3                          
 25602  9a271b5c06     lcall   0x65c, 0x1b27            ; RT#20  
 25607  cc             int3                          
 25608  33db           xor     bx, bx                
 25610  9a3b0a5c06     lcall   0x65c, 0xa3b             ; RT#30  
 25615  9a3b0a5c06     lcall   0x65c, 0xa3b             ; RT#30  
 25620  8bd3           mov     dx, bx                
 25622  bb0100         mov     bx, 1                 
 25625  9a3b0a5c06     lcall   0x65c, 0xa3b             ; RT#30  
 25630  8bda           mov     bx, dx                
 25632  9a550a5c06     lcall   0x65c, 0xa55             ; RT#40  
 25637  cc             int3                          
 25638  bb0b00         mov     bx, 0xb               
 25641  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 25646  bb0100         mov     bx, 1                 
 25649  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 25654  bb0700         mov     bx, 7                 
 25657  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 25662  cc             int3                          
 25663  9a85075c06     lcall   0x65c, 0x785             ; RT#31  
 25668  cc             int3                          
 25669  bb1900         mov     bx, 0x19              
 25672  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 25677  bb1e00         mov     bx, 0x1e              
 25680  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 25685  cc             int3                          
 25686  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 25691  bb4265         mov     bx, 0x6542               ; = 'eEsc-'
 25694  9a93285c06     lcall   0x65c, 0x2893            ; RT#5     <<< bx='eEsc-'
 25699  cc             int3                          
 25700  bb0200         mov     bx, 2                 
 25703  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 25708  bb0700         mov     bx, 7                 
 25711  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 25716  cc             int3                          
 25717  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 25722  bb4a65         mov     bx, 0x654a               ; = 'eRETURN TO THE GAME '
 25725  9a93285c06     lcall   0x65c, 0x2893            ; RT#5     <<< bx='eRETURN TO THE GAME '
 25730  cc             int3                          
 25731  bb0100         mov     bx, 1                 
 25734  9a630c5c06     lcall   0x65c, 0xc63             ; RT#8   
 25739  bb2300         mov     bx, 0x23              
 25742  9a7d0c5c06     lcall   0x65c, 0xc7d             ; RT#9   
 25747  cc             int3                          
 25748  bb0f00         mov     bx, 0xf               
 25751  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 25756  bb0100         mov     bx, 1                 
 25759  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 25764  cc             int3                          
 25765  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 25770  bb6265         mov     bx, 0x6562               ; = 'eINSTRUCTIONSO'
 25773  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11    <<< bx='eINSTRUCTIONSO'
 25778  cc             int3                          
 25779  bb0e00         mov     bx, 0xe               
 25782  9a02085c06     lcall   0x65c, 0x802             ; RT#12  
 25787  bb0600         mov     bx, 6                 
 25790  9a1c085c06     lcall   0x65c, 0x81c             ; RT#13  
 25795  cc             int3                          
 25796  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 25801  bb2c65         mov     bx, 0x652c            
 25804  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 25809  cc             int3                          
 25810  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 25815  bb2c65         mov     bx, 0x652c            
 25818  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 25823  cc             int3                          
 25824  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 25829  bb7265         mov     bx, 0x6572               ; = 'eThe basic idea of this game is similar to Tic-Tac-Toe.   The only'
 25832  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11    <<< bx='eThe basic idea of this game is similar to Tic-Tac-Toe. '
 25837  cc             int3                          
 25838  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 25843  bbc665         mov     bx, 0x65c6               ; = 'ethat this one is a 3D-game (4X4).  And it is much fun to play wit'
 25846  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11    <<< bx='ethat this one is a 3D-game (4X4).  And it is much fun t'
 25851  cc             int3                          
 25852  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 25857  bb1a66         mov     bx, 0x661a               ; = "fhave to lie 4 'X' or 'O' on a vertical, hoirzontal,  or diagonal "
 25860  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11    <<< bx="fhave to lie 4 'X' or 'O' on a vertical, hoirzontal,  or"
 25865  cc             int3                          
 25866  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 25871  bb6e66         mov     bx, 0x666e               ; = 'fcan play this game.   But to win over your computer you need to t'
 25874  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11    <<< bx='fcan play this game.   But to win over your computer you'
 25879  cc             int3                          
 25880  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 25885  bbc266         mov     bx, 0x66c2               ; = 'fRemember that if you try, you can win.O'
 25888  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11    <<< bx='fRemember that if you try, you can win.O'
 25893  cc             int3                          
 25894  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 25899  bb2c65         mov     bx, 0x652c            
 25902  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11  
 25907  cc             int3                          
 25908  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 25913  bbec66         mov     bx, 0x66ec               ; = 'fIn mid of a game,  you can save it for later use,  by using funct'
 25916  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11    <<< bx='fIn mid of a game,  you can save it for later use,  by u'
 25921  cc             int3                          
 25922  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 25927  bb4067         mov     bx, 0x6740               ; = 'gFunction key (F3) is for loading a saved game. Other functions ar'
 25930  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11    <<< bx='gFunction key (F3) is for loading a saved game. Other fu'
 25935  cc             int3                          
 25936  9aa5295c06     lcall   0x65c, 0x29a5            ; RT#4   
 25941  bb9467         mov     bx, 0x6794               ; = 'ginstructions,  (F4) is for start a new game, and (F10) is to end '
 25944  9aa7285c06     lcall   0x65c, 0x28a7            ; RT#11    <<< bx='ginstructions,  (F4) is for start a new game, and (F10) '
 25949  cc             int3                          
 25950  9a271b5c06     lcall   0x65c, 0x1b27            ; RT#20  
 25955  cc             int3                          
 25956  33db           xor     bx, bx                
 25958  9a3b0a5c06     lcall   0x65c, 0xa3b             ; RT#30  
 25963  9a3b0a5c06     lcall   0x65c, 0xa3b             ; RT#30  
 25968  bb0100         mov     bx, 1                 
 25971  9a550a5c06     lcall   0x65c, 0xa55             ; RT#40  
 25976  cc             int3                          
 25977  9a071d5c06     lcall   0x65c, 0x1d07            ; RT#33  
 25982  ba0260         mov     dx, 0x6002            
 25985  9ac80b5c06     lcall   0x65c, 0xbc8             ; RT#19  
 25990  cc             int3                          
 25991  bb3065         mov     bx, 0x6530            
 25994  b80260         mov     ax, 0x6002            
 25997  9afe0b5c06     lcall   0x65c, 0xbfe             ; RT#29  
 26002  9af31c5c06     lcall   0x65c, 0x1cf3            ; RT#36  
 26007  83fb1b         cmp     bx, 0x1b              
 26010  7403           je      0x659f                
 26012  e91800         jmp     0x65b7                
 26015  cc             int3                          
 26016  33db           xor     bx, bx                
 26018  9a3b0a5c06     lcall   0x65c, 0xa3b             ; RT#30  
 26023  9a3b0a5c06     lcall   0x65c, 0xa3b             ; RT#30  
 26028  9a550a5c06     lcall   0x65c, 0xa55             ; RT#40  
 26033  cc             int3                          
 26034  9a271b5c06     lcall   0x65c, 0x1b27            ; RT#20  
 26039  cc             int3                          
 26040  e9a8ff         jmp     0x6563                
 26043  9ad8145c06     lcall   0x65c, 0x14d8            ; RT#77  
 26048  4c             dec     sp                    
 26049  6963656e73     imul    sp, word ptr [bp + di + 0x65], 0x736e
 26054  6564204d61     and     byte ptr fs:[di + 0x61], cl
 26059  7465           je      0x6632                
 26061  7269           jb      0x6638                
 26063  61             popaw                         
 26064  6c             insb    byte ptr es:[di], dx  
 26065  202d           and     byte ptr [di], ch     
 26067  205072         and     byte ptr [bx + si + 0x72], dl
 26070  6f             outsw   dx, word ptr [si]     
 26071  677261         jb      0x663b                
 26074  6d             insw    word ptr es:[di], dx  
 26075  205072         and     byte ptr [bx + si + 0x72], dl
 26078  6f             outsw   dx, word ptr [si]     
 26079  7065           jo      0x6646                
 26081  7274           jb      0x6657                
 26083  7920           jns     0x6605                
 26085  6f             outsw   dx, word ptr [si]     
 26086  66204942       and     byte ptr [bx + di + 0x42], cl
 26090  4d             dec     bp                    
 26091  55             push    bp                    
 26092  56             push    si                    
 26093  57             push    di                    
 26094  cd10           int     0x10                  
 26096  5f             pop     di                    
 26097  5e             pop     si                    
 26098  5d             pop     bp                    
 26099  c3             ret                           
 26100  c3             ret                           
 26101  cb             retf                          
 26102  891e0e00       mov     word ptr [0xe], bx    
 26106  e94512         jmp     0x7842                
 26109  9ad6025c06     lcall   0x65c, 0x2d6             ; RT#52  
 26114  ff1e0600       lcall   [6]                   
 26118  e88807         call    0x6d91                
 26121  32c0           xor     al, al                
 26123  a20a00         mov     byte ptr [0xa], al    
 26126  a20b00         mov     byte ptr [0xb], al    
 26129  a24000         mov     byte ptr [0x40], al   
 26132  a28800         mov     byte ptr [0x88], al   
 26135  a28900         mov     byte ptr [0x89], al   
 26138  a28a00         mov     byte ptr [0x8a], al   
 26141  a28e00         mov     byte ptr [0x8e], al   
 26144  b003           mov     al, 3                 
 26146  a28f00         mov     byte ptr [0x8f], al   
 26149  e89638         call    0x9ebe                
 26152  b004           mov     al, 4                 
 26154  a28d00         mov     byte ptr [0x8d], al   
 26157  a28b00         mov     byte ptr [0x8b], al   
 26160  c6068c0078     mov     byte ptr [0x8c], 0x78 
 26165  c3             ret                           
 26166  b40f           mov     ah, 0xf               
 26168  e8b0ff         call    0x65eb                
 26171  bb4700         mov     bx, 0x47              
 26174  d7             xlatb                         
 26175  50             push    ax                    
 26176  b400           mov     ah, 0                 
 26178  e8a6ff         call    0x65eb                
 26181  58             pop     ax                    
 26182  a25000         mov     byte ptr [0x50], al   
 26185  a24f00         mov     byte ptr [0x4f], al   
 26188  b428           mov     ah, 0x28              
 26190  3c02           cmp     al, 2                 
 26192  720d           jb      0x665f                
 26194  b450           mov     ah, 0x50              
 26196  3c07           cmp     al, 7                 
 26198  7507           jne     0x665f                
 26200  b90b0c         mov     cx, 0xc0b             
 26203  890e5600       mov     word ptr [0x56], cx   
 26207  8826e405       mov     byte ptr [0x5e4], ah  
 26211  e86e03         call    0x69d4                
 26214  fa             cli                           
 26215  8cd8           mov     ax, ds                
 26217  1e             push    ds                    
 26218  33d2           xor     dx, dx                
 26220  8eda           mov     ds, dx                
 26222  a31005         mov     word ptr [0x510], ax  
 26225  a10000         mov     ax, word ptr [0]      
 26228  26a3c405       mov     word ptr es:[0x5c4], ax
 26232  a10200         mov     ax, word ptr [2]      
 26235  26a3c605       mov     word ptr es:[0x5c6], ax
 26239  a11000         mov     ax, word ptr [0x10]   
 26242  26a3c805       mov     word ptr es:[0x5c8], ax
 26246  a11200         mov     ax, word ptr [0x12]   
 26249  26a3ca05       mov     word ptr es:[0x5ca], ax
 26253  c70600009913   mov     word ptr [0], 0x1399  
 26259  8c0e0200       mov     word ptr [2], cs      
 26263  c7061000a113   mov     word ptr [0x10], 0x13a1
 26269  8c0e1200       mov     word ptr [0x12], cs   
 26273  a11004         mov     ax, word ptr [0x410]  
 26276  a31e05         mov     word ptr [0x51e], ax  
 26279  a11204         mov     ax, word ptr [0x412]  
 26282  a32005         mov     word ptr [0x520], ax  
 26285  a19000         mov     ax, word ptr [0x90]   
 26288  a31a05         mov     word ptr [0x51a], ax  
 26291  a19200         mov     ax, word ptr [0x92]   
 26294  a31c05         mov     word ptr [0x51c], ax  
 26297  a16c00         mov     ax, word ptr [0x6c]   
 26300  a31605         mov     word ptr [0x516], ax  
 26303  a16e00         mov     ax, word ptr [0x6e]   
 26306  a31805         mov     word ptr [0x518], ax  
 26309  a17000         mov     ax, word ptr [0x70]   
 26312  a31205         mov     word ptr [0x512], ax  
 26315  a17200         mov     ax, word ptr [0x72]   
 26318  a31405         mov     word ptr [0x514], ax  
 26321  a12400         mov     ax, word ptr [0x24]   
 26324  a3bc03         mov     word ptr [0x3bc], ax  
 26327  a12600         mov     ax, word ptr [0x26]   
 26330  a3be03         mov     word ptr [0x3be], ax  
 26333  c70690005003   mov     word ptr [0x90], 0x350
 26339  8c0e9200       mov     word ptr [0x92], cs   
 26343  c7066c004702   mov     word ptr [0x6c], 0x247
 26349  8c0e6e00       mov     word ptr [0x6e], cs   
 26353  c70670002903   mov     word ptr [0x70], 0x329
 26359  8c0e7200       mov     word ptr [0x72], cs   
 26363  a12000         mov     ax, word ptr [0x20]   
 26366  a3c003         mov     word ptr [0x3c0], ax  
 26369  a12200         mov     ax, word ptr [0x22]   
 26372  a3c203         mov     word ptr [0x3c2], ax  
 26375  1f             pop     ds                    
 26376  fb             sti                           
 26377  bbcc05         mov     bx, 0x5cc             
 26380  891e4500       mov     word ptr [0x45], bx   
 26384  c747040400     mov     word ptr [bx + 4], 4  
 26389  b9d805         mov     cx, 0x5d8             
 26392  894f02         mov     word ptr [bx + 2], cx 
 26395  e81b06         call    0x6d39                
 26398  83c104         add     cx, 4                 
 26401  890f           mov     word ptr [bx], cx     
 26403  9a85075c06     lcall   0x65c, 0x785             ; RT#31  
 26408  c3             ret                           
 26409  81fb0001       cmp     bx, 0x100             
 26413  7d03           jge     0x6732                
 26415  bb0001         mov     bx, 0x100             
 26418  891e3e00       mov     word ptr [0x3e], bx   
 26422  cb             retf                          
 26423  b304           mov     bl, 4                 
 26425  f9             stc                           
 26426  eb02           jmp     0x673e                
 26428  b303           mov     bl, 3                 
 26430  e80500         call    0x6746                
 26433  ff2e0c00       ljmp    [0xc]                 
 26437  f8             clc                           
 26438  7202           jb      0x674a                
 26440  b300           mov     bl, 0                 
 26442  53             push    bx                    
 26443  9c             pushf                         
 26444  1e             push    ds                    
 26445  33c0           xor     ax, ax                
 26447  8ed8           mov     ds, ax                
 26449  a11e05         mov     ax, word ptr [0x51e]  
 26452  3b061004       cmp     ax, word ptr [0x410]  
 26456  a31004         mov     word ptr [0x410], ax  
 26459  1f             pop     ds                    
 26460  9c             pushf                         
 26461  9af1085c06     lcall   0x65c, 0x8f1             ; RT#78  
 26466  9d             popf                          
 26467  a14f00         mov     ax, word ptr [0x4f]   
 26470  a25000         mov     byte ptr [0x50], al   
 26473  7508           jne     0x6773                
 26475  9d             popf                          
 26476  720e           jb      0x677c                
 26478  3ae0           cmp     ah, al                
 26480  740a           je      0x677c                
 26482  9c             pushf                         
 26483  9d             popf                          
 26484  b400           mov     ah, 0                 
 26486  e872fe         call    0x65eb                
 26489  e8b401         call    0x6930                
 26492  5b             pop     bx                    
 26493  1e             push    ds                    
 26494  33c0           xor     ax, ax                
 26496  8ed8           mov     ds, ax                
 26498  881e0105       mov     byte ptr [0x501], bl  
 26502  1f             pop     ds                    
 26503  9ad6025c06     lcall   0x65c, 0x2d6             ; RT#52  
 26508  b90607         mov     cx, 0x706             
 26511  803e500007     cmp     byte ptr [0x50], 7    
 26516  7503           jne     0x6799                
 26518  b90b0c         mov     cx, 0xc0b             
 26521  890e5600       mov     word ptr [0x56], cx   
 26525  e82f02         call    0x69cf                
 26528  fa             cli                           
 26529  e421           in      al, 0x21              
 26531  0c18           or      al, 0x18              
 26533  e621           out     0x21, al              
 26535  1e             push    ds                    
 26536  33c0           xor     ax, ax                
 26538  8ed8           mov     ds, ax                
 26540  a11e05         mov     ax, word ptr [0x51e]  
 26543  a31004         mov     word ptr [0x410], ax  
 26546  a12005         mov     ax, word ptr [0x520]  
 26549  a31204         mov     word ptr [0x412], ax  
 26552  a11a05         mov     ax, word ptr [0x51a]  
 26555  a39000         mov     word ptr [0x90], ax   
 26558  a11c05         mov     ax, word ptr [0x51c]  
 26561  a39200         mov     word ptr [0x92], ax   
 26564  a11605         mov     ax, word ptr [0x516]  
 26567  a36c00         mov     word ptr [0x6c], ax   
 26570  a11805         mov     ax, word ptr [0x518]  
 26573  a36e00         mov     word ptr [0x6e], ax   
 26576  a11205         mov     ax, word ptr [0x512]  
 26579  a37000         mov     word ptr [0x70], ax   
 26582  a11405         mov     ax, word ptr [0x514]  
 26585  a37200         mov     word ptr [0x72], ax   
 26588  a1bc03         mov     ax, word ptr [0x3bc]  
 26591  a32400         mov     word ptr [0x24], ax   
 26594  a1be03         mov     ax, word ptr [0x3be]  
 26597  a32600         mov     word ptr [0x26], ax   
 26600  26a1c405       mov     ax, word ptr es:[0x5c4]
 26604  a30000         mov     word ptr [0], ax      
 26607  26a1c605       mov     ax, word ptr es:[0x5c6]
 26611  a30200         mov     word ptr [2], ax      
 26614  26a1c805       mov     ax, word ptr es:[0x5c8]
 26618  a31000         mov     word ptr [0x10], ax   
 26621  26a1ca05       mov     ax, word ptr es:[0x5ca]
 26625  a31200         mov     word ptr [0x12], ax   
 26628  1f             pop     ds                    
 26629  fb             sti                           
 26630  c3             ret                           
 26631  fb             sti                           
 26632  50             push    ax                    
 26633  1e             push    ds                    
 26634  52             push    dx                    
 26635  33d2           xor     dx, dx                
 26637  8eda           mov     ds, dx                
 26639  8e1e1005       mov     ds, word ptr [0x510]  
 26643  9ad6025c06     lcall   0x65c, 0x2d6             ; RT#52  
 26648  33c0           xor     ax, ax                
 26650  a31200         mov     word ptr [0x12], ax   
 26653  fec8           dec     al                    
 26655  a21000         mov     byte ptr [0x10], al   
 26658  5a             pop     dx                    
 26659  1f             pop     ds                    
 26660  58             pop     ax                    
 26661  cf             iret                          
 26662  b000           mov     al, 0                 
 26664  86061000       xchg    byte ptr [0x10], al   
 26668  0ac0           or      al, al                
 26670  c3             ret                           
 26671  e8ab3a         call    0xa2dd                
 26674  0d2a42         or      ax, 0x422a            
 26677  7265           jb      0x689c                
 26679  61             popaw                         
 26680  6baae95812     imul    bp, word ptr [bp + si + 0x58e9], 0x12
 26685  50             push    ax                    
 26686  52             push    dx                    
 26687  1e             push    ds                    
 26688  33d2           xor     dx, dx                
 26690  8eda           mov     ds, dx                
 26692  8e1e1005       mov     ds, word ptr [0x510]  
 26696  833e430000     cmp     word ptr [0x43], 0    
 26701  740b           je      0x685a                
 26703  ff0e4300       dec     word ptr [0x43]       
 26707  7505           jne     0x685a                
 26709  9ab3025c06     lcall   0x65c, 0x2b3             ; RT#79  
 26714  fe0e4200       dec     byte ptr [0x42]       
 26718  802642001f     and     byte ptr [0x42], 0x1f 
 26723  7506           jne     0x686b                
 26725  1f             pop     ds                    
 26726  5a             pop     dx                    
 26727  58             pop     ax                    
 26728  cdf0           int     0xf0                  
 26730  cf             iret                          
 26731  b020           mov     al, 0x20              
 26733  e620           out     0x20, al              
 26735  1f             pop     ds                    
 26736  5a             pop     dx                    
 26737  58             pop     ax                    
 26738  cf             iret                          
 26739  56             push    si                    
 26740  53             push    bx                    
 26741  51             push    cx                    
 26742  8b1e4500       mov     bx, word ptr [0x45]   
 26746  837f0600       cmp     word ptr [bx + 6], 0  
 26750  741e           je      0x689e                
 26752  e87f04         call    0x6d02                
 26755  e642           out     0x42, al              
 26757  8ac4           mov     al, ah                
 26759  e642           out     0x42, al              
 26761  890e4300       mov     word ptr [0x43], cx   
 26765  c606410000     mov     byte ptr [0x41], 0    
 26770  59             pop     cx                    
 26771  5b             pop     bx                    
 26772  5e             pop     si                    
 26773  cb             retf                          
 26774  56             push    si                    
 26775  53             push    bx                    
 26776  51             push    cx                    
 26777  c606410000     mov     byte ptr [0x41], 0    
 26782  803e410000     cmp     byte ptr [0x41], 0    
 26787  7540           jne     0x68e5                
 26789  fa             cli                           
 26790  8b364500       mov     si, word ptr [0x45]   
 26794  bbcc05         mov     bx, 0x5cc             
 26797  3bde           cmp     bx, si                
 26799  7407           je      0x68b8                
 26801  e8dc34         call    0x9d90                
 26804  891e4500       mov     word ptr [0x45], bx   
 26808  8b4f02         mov     cx, word ptr [bx + 2] 
 26811  e87b04         call    0x6d39                
 26814  50             push    ax                    
 26815  e461           in      al, 0x61              
 26817  24fc           and     al, 0xfc              
 26819  e661           out     0x61, al              
 26821  1e             push    ds                    
 26822  33c0           xor     ax, ax                
 26824  8ed8           mov     ds, ax                
 26826  a1c003         mov     ax, word ptr [0x3c0]  
 26829  a32000         mov     word ptr [0x20], ax   
 26832  a1c203         mov     ax, word ptr [0x3c2]  
 26835  a32200         mov     word ptr [0x22], ax   
 26838  1f             pop     ds                    
 26839  32c0           xor     al, al                
 26841  e640           out     0x40, al              
 26843  e640           out     0x40, al              
 26845  58             pop     ax                    
 26846  c70643000000   mov     word ptr [0x43], 0    
 26852  fb             sti                           
 26853  59             pop     cx                    
 26854  5b             pop     bx                    
 26855  5e             pop     si                    
 26856  cb             retf                          
 26857  55             push    bp                    
 26858  57             push    di                    
 26859  56             push    si                    
 26860  1e             push    ds                    
 26861  33d2           xor     dx, dx                
 26863  8eda           mov     ds, dx                
 26865  8e1e1005       mov     ds, word ptr [0x510]  
 26869  803e0a0000     cmp     byte ptr [0xa], 0     
 26874  7404           je      0x6900                
 26876  ff160200       call    word ptr [2]          
 26880  803e0b0000     cmp     byte ptr [0xb], 0     
 26885  7404           je      0x690b                
 26887  ff160400       call    word ptr [4]          
 26891  1f             pop     ds                    
 26892  5e             pop     si                    
 26893  5f             pop     di                    
 26894  5d             pop     bp                    
 26895  cf             iret                          
 26896  fb             sti                           
 26897  8bc7           mov     ax, di                
 26899  83c414         add     sp, 0x14              
 26902  1f             pop     ds                    
 26903  07             pop     es                    
 26904  0ac0           or      al, al                
 26906  7503           jne     0x691f                
 26908  e9a110         jmp     0x79c0                
 26911  3c02           cmp     al, 2                 
 26913  7503           jne     0x6926                
 26915  e99d10         jmp     0x79c3                
 26918  e99d10         jmp     0x79c6                
 26921  8a265400       mov     ah, byte ptr [0x54]   
 26925  fecc           dec     ah                    
 26927  c3             ret                           
 26928  ba0101         mov     dx, 0x101             
 26931  eb04           jmp     0x6939                
 26933  8b165300       mov     dx, word ptr [0x53]   
 26937  89165300       mov     word ptr [0x53], dx   
 26941  e80100         call    0x6941                
 26944  c3             ret                           
 26945  50             push    ax                    
 26946  8a3e5100       mov     bh, byte ptr [0x51]   
 26950  e80200         call    0x694b                
 26953  58             pop     ax                    
 26954  c3             ret                           
 26955  86f2           xchg    dl, dh                
 26957  fece           dec     dh                    
 26959  feca           dec     dl                    
 26961  b402           mov     ah, 2                 
 26963  e895fc         call    0x65eb                
 26966  86f2           xchg    dl, dh                
 26968  c3             ret                           
 26969  51             push    cx                    
 26970  52             push    dx                    
 26971  e81700         call    0x6975                
 26974  b406           mov     ah, 6                 
 26976  e888fc         call    0x65eb                
 26979  eb0a           jmp     0x696f                
 26981  51             push    cx                    
 26982  52             push    dx                    
 26983  e80b00         call    0x6975                
 26986  b407           mov     ah, 7                 
 26988  e87cfc         call    0x65eb                
 26991  e82200         call    0x6994                
 26994  5a             pop     dx                    
 26995  59             pop     cx                    
 26996  c3             ret                           
 26997  e81700         call    0x698f                
 27000  8aef           mov     ch, bh                
 27002  fecd           dec     ch                    
 27004  b100           mov     cl, 0                 
 27006  8af3           mov     dh, bl                
 27008  fece           dec     dh                    
 27010  8a16e405       mov     dl, byte ptr [0x5e4]  
 27014  feca           dec     dl                    
 27016  b001           mov     al, 1                 
 27018  8a3e8200       mov     bh, byte ptr [0x82]   
 27022  c3             ret                           
 27023  a05100         mov     al, byte ptr [0x51]   
 27026  eb03           jmp     0x6997                
 27028  a05200         mov     al, byte ptr [0x52]   
 27031  e82300         call    0x69bd                
 27034  7520           jne     0x69bc                
 27036  8a265000       mov     ah, byte ptr [0x50]   
 27040  80fc07         cmp     ah, 7                 
 27043  7417           je      0x69bc                
 27045  52             push    dx                    
 27046  ba0008         mov     dx, 0x800             
 27049  80fc02         cmp     ah, 2                 
 27052  7202           jb      0x69b0                
 27054  d0e6           shl     dh, 1                 
 27056  32e4           xor     ah, ah                
 27058  f7e2           mul     dx                    
 27060  1e             push    ds                    
 27061  8eda           mov     ds, dx                
 27063  a34e04         mov     word ptr [0x44e], ax  
 27066  1f             pop     ds                    
 27067  5a             pop     dx                    
 27068  c3             ret                           
 27069  50             push    ax                    
 27070  a05000         mov     al, byte ptr [0x50]   
 27073  3c07           cmp     al, 7                 
 27075  7404           je      0x69c9                
 27077  3c04           cmp     al, 4                 
 27079  7302           jae     0x69cb                
 27081  32c0           xor     al, al                
 27083  0ac0           or      al, al                
 27085  58             pop     ax                    
 27086  c3             ret                           
 27087  50             push    ax                    
 27088  b000           mov     al, 0                 
 27090  eb03           jmp     0x69d7                
 27092  50             push    ax                    
 27093  b020           mov     al, 0x20              
 27095  51             push    cx                    
 27096  53             push    bx                    
 27097  50             push    ax                    
 27098  e858ff         call    0x6935                
 27101  58             pop     ax                    
 27102  5b             pop     bx                    
 27103  8b0e5600       mov     cx, word ptr [0x56]   
 27107  86e9           xchg    cl, ch                
 27109  803ec40000     cmp     byte ptr [0xc4], 0    
 27114  7402           je      0x69ee                
 27116  b504           mov     ch, 4                 
 27118  0ae8           or      ch, al                
 27120  b401           mov     ah, 1                 
 27122  e8f6fb         call    0x65eb                
 27125  59             pop     cx                    
 27126  58             pop     ax                    
 27127  c3             ret                           
 27128  e8c2ff         call    0x69bd                
 27131  7452           je      0x6a4f                
 27133  50             push    ax                    
 27134  53             push    bx                    
 27135  51             push    cx                    
 27136  52             push    dx                    
 27137  56             push    si                    
 27138  57             push    di                    
 27139  8cc6           mov     si, es                
 27141  bf0000         mov     di, 0                 
 27144  8ec7           mov     es, di                
 27146  26ff367c00     push    word ptr es:[0x7c]    
 27151  26ff367e00     push    word ptr es:[0x7e]    
 27156  26c7067c005800 mov     word ptr es:[0x7c], 0x58
 27163  268c1e7e00     mov     word ptr es:[0x7e], ds
 27168  8ec6           mov     es, si                
 27170  b081           mov     al, 0x81              
 27172  0206c400       add     al, byte ptr [0xc4]   
 27176  b383           mov     bl, 0x83              
 27178  8a3e5100       mov     bh, byte ptr [0x51]   
 27182  b90100         mov     cx, 1                 
 27185  b409           mov     ah, 9                 
 27187  e8b5fb         call    0x65eb                
 27190  8cc6           mov     si, es                
 27192  bf0000         mov     di, 0                 
 27195  8ec7           mov     es, di                
 27197  268f067e00     pop     word ptr es:[0x7e]    
 27202  268f067c00     pop     word ptr es:[0x7c]    
 27207  8ec6           mov     es, si                
 27209  5f             pop     di                    
 27210  5e             pop     si                    
 27211  5a             pop     dx                    
 27212  59             pop     cx                    
 27213  5b             pop     bx                    
 27214  58             pop     ax                    
 27215  c3             ret                           
 27216  3add           cmp     bl, ch                
 27218  7328           jae     0x6a7c                
 27220  8809           mov     byte ptr [bx + di], cl
 27222  43             inc     bx                    
 27223  3aeb           cmp     ch, bl                
 27225  7404           je      0x6a5f                
 27227  8a08           mov     cl, byte ptr [bx + si]
 27229  ebf5           jmp     0x6a54                
 27231  87fe           xchg    si, di                
 27233  bb0000         mov     bx, 0                 
 27236  891e6800       mov     word ptr [0x68], bx   
 27240  c3             ret                           
 27241  8a08           mov     cl, byte ptr [bx + si]
 27243  8809           mov     byte ptr [bx + di], cl
 27245  3add           cmp     bl, ch                
 27247  730b           jae     0x6a7c                
 27249  ff066800       inc     word ptr [0x68]       
 27253  5f             pop     di                    
 27254  5e             pop     si                    
 27255  5a             pop     dx                    
 27256  59             pop     cx                    
 27257  5b             pop     bx                    
 27258  58             pop     ax                    
 27259  cb             retf                          
 27260  c70668000000   mov     word ptr [0x68], 0    
 27266  e9e40e         jmp     0x7969                
 27269  803e100000     cmp     byte ptr [0x10], 0    
 27274  7511           jne     0x6a9d                
 27276  833e120000     cmp     word ptr [0x12], 0    
 27281  750a           jne     0x6a9d                
 27283  55             push    bp                    
 27284  56             push    si                    
 27285  57             push    di                    
 27286  b401           mov     ah, 1                 
 27288  cd16           int     0x16                  
 27290  5f             pop     di                    
 27291  5e             pop     si                    
 27292  5d             pop     bp                    
 27293  c3             ret                           
 27294  e8e4ff         call    0x6a85                
 27297  74fb           je      0x6a9e                
 27299  803e100000     cmp     byte ptr [0x10], 0    
 27304  7408           je      0x6ab2                
 27306  c606100000     mov     byte ptr [0x10], 0    
 27311  b003           mov     al, 3                 
 27313  c3             ret                           
 27314  833e120000     cmp     word ptr [0x12], 0    
 27319  753d           jne     0x6af6                
 27321  55             push    bp                    
 27322  56             push    si                    
 27323  57             push    di                    
 27324  b400           mov     ah, 0                 
 27326  cd16           int     0x16                  
 27328  5f             pop     di                    
 27329  5e             pop     si                    
 27330  5d             pop     bp                    
 27331  0ac0           or      al, al                
 27333  750a           jne     0x6ad1                
 27335  80fc3b         cmp     ah, 0x3b              
 27338  7205           jb      0x6ad1                
 27340  80fc45         cmp     ah, 0x45              
 27343  7203           jb      0x6ad4                
 27345  0ac0           or      al, al                
 27347  c3             ret                           
 27348  56             push    si                    
 27349  50             push    ax                    
 27350  be1600         mov     si, 0x16              
 27353  86c4           xchg    ah, al                
 27355  2c3b           sub     al, 0x3b              
 27357  d0e0           shl     al, 1                 
 27359  d0e0           shl     al, 1                 
 27361  03f0           add     si, ax                
 27363  8b04           mov     ax, word ptr [si]     
 27365  a31200         mov     word ptr [0x12], ax   
 27368  0bc0           or      ax, ax                
 27370  58             pop     ax                    
 27371  7418           je      0x6b05                
 27373  8b7402         mov     si, word ptr [si + 2] 
 27376  89361400       mov     word ptr [0x14], si   
 27380  eb01           jmp     0x6af7                
 27382  56             push    si                    
 27383  8b361400       mov     si, word ptr [0x14]   
 27387  8a04           mov     al, byte ptr [si]     
 27389  ff061400       inc     word ptr [0x14]       
 27393  ff0e1200       dec     word ptr [0x12]       
 27397  5e             pop     si                    
 27398  ebc9           jmp     0x6ad1                
 27400  52             push    dx                    
 27401  53             push    bx                    
 27402  51             push    cx                    
 27403  50             push    ax                    
 27404  8b165300       mov     dx, word ptr [0x53]   
 27408  58             pop     ax                    
 27409  50             push    ax                    
 27410  3c07           cmp     al, 7                 
 27412  744b           je      0x6b61                
 27414  3c1d           cmp     al, 0x1d              
 27416  744e           je      0x6b68                
 27418  3c1c           cmp     al, 0x1c              
 27420  740f           je      0x6b2d                
 27422  3c0d           cmp     al, 0xd               
 27424  7415           je      0x6b37                
 27426  3c0a           cmp     al, 0xa               
 27428  7411           je      0x6b37                
 27430  3c0c           cmp     al, 0xc               
 27432  7457           je      0x6b81                
 27434  e85b00         call    0x6b88                
 27437  fec6           inc     dh                    
 27439  3a36e405       cmp     dh, byte ptr [0x5e4]  
 27443  7702           ja      0x6b37                
 27445  eb22           jmp     0x6b59                
 27447  b601           mov     dh, 1                 
 27449  80fa18         cmp     dl, 0x18              
 27452  7219           jb      0x6b57                
 27454  bb1801         mov     bx, 0x118             
 27457  e815fe         call    0x6959                
 27460  b218           mov     dl, 0x18              
 27462  803e300802     cmp     byte ptr [0x830], 2   
 27467  720c           jb      0x6b59                
 27469  fe0e3008       dec     byte ptr [0x830]      
 27473  fe0e3208       dec     byte ptr [0x832]      
 27477  eb02           jmp     0x6b59                
 27479  fec2           inc     dl                    
 27481  e8ddfd         call    0x6939                
 27484  58             pop     ax                    
 27485  59             pop     cx                    
 27486  5b             pop     bx                    
 27487  5a             pop     dx                    
 27488  c3             ret                           
 27489  9a23065c06     lcall   0x65c, 0x623             ; RT#80  
 27494  ebf4           jmp     0x6b5c                
 27496  80fe01         cmp     dh, 1                 
 27499  770d           ja      0x6b7a                
 27501  80fa01         cmp     dl, 1                 
 27504  74e7           je      0x6b59                
 27506  feca           dec     dl                    
 27508  8a36e405       mov     dh, byte ptr [0x5e4]  
 27512  fec6           inc     dh                    
 27514  fece           dec     dh                    
 27516  e8bafd         call    0x6939                
 27519  ebdb           jmp     0x6b5c                
 27521  9a85075c06     lcall   0x65c, 0x785             ; RT#31  
 27526  ebd4           jmp     0x6b5c                
 27528  52             push    dx                    
 27529  e8a9fd         call    0x6935                
 27532  5a             pop     dx                    
 27533  8a1e8100       mov     bl, byte ptr [0x81]   
 27537  b90100         mov     cx, 1                 
 27540  b409           mov     ah, 9                 
 27542  e852fa         call    0x65eb                
 27545  c3             ret                           
 27546  50             push    ax                    
 27547  52             push    dx                    
 27548  8bd7           mov     dx, di                
 27550  d1fa           sar     dx, 1                 
 27552  83c2fa         add     dx, -6                
 27555  55             push    bp                    
 27556  56             push    si                    
 27557  57             push    di                    
 27558  b400           mov     ah, 0                 
 27560  cd17           int     0x17                  
 27562  5f             pop     di                    
 27563  5e             pop     si                    
 27564  5d             pop     bp                    
 27565  8af4           mov     dh, ah                
 27567  80e428         and     ah, 0x28              
 27570  80fc28         cmp     ah, 0x28              
 27573  740d           je      0x6bc4                
 27575  f6c408         test    ah, 8                 
 27578  750b           jne     0x6bc7                
 27580  f6c601         test    dh, 1                 
 27583  7409           je      0x6bca                
 27585  e9c90d         jmp     0x798d                
 27588  e9cc0d         jmp     0x7993                
 27591  e9c60d         jmp     0x7990                
 27594  5a             pop     dx                    
 27595  58             pop     ax                    
 27596  50             push    ax                    
 27597  3c0d           cmp     al, 0xd               
 27599  7510           jne     0x6be1                
 27601  807c2fff       cmp     byte ptr [si + 0x2f], 0xff
 27605  7505           jne     0x6bdc                
 27607  803c04         cmp     byte ptr [si], 4      
 27610  7405           je      0x6be1                
 27612  b00a           mov     al, 0xa               
 27614  e8b9ff         call    0x6b9a                
 27617  58             pop     ax                    
 27618  c3             ret                           
 27619  e86507         call    0x734b                
 27622  b92003         mov     cx, 0x320             
 27625  ba8000         mov     dx, 0x80              
 27628  eb2d           jmp     0x6c1b                
 27630  e9810d         jmp     0x7972                
 27633  e85707         call    0x734b                
 27636  83fb25         cmp     bx, 0x25              
 27639  72f5           jb      0x6bee                
 27641  8bcb           mov     cx, bx                
 27643  8bf2           mov     si, dx                
 27645  bfd008         mov     di, 0x8d0             
 27648  a5             movsw   word ptr es:[di], word ptr [si]
 27649  a4             movsb   byte ptr es:[di], byte ptr [si]
 27650  ac             lodsb   al, byte ptr [si]     
 27651  3c91           cmp     al, 0x91              
 27653  73e7           jae     0x6bee                
 27655  0405           add     al, 5                 
 27657  3c91           cmp     al, 0x91              
 27659  baffff         mov     dx, 0xffff            
 27662  730b           jae     0x6c1b                
 27664  aa             stosb   byte ptr es:[di], al  
 27665  bed008         mov     si, 0x8d0             
 27668  9a9d1c5c06     lcall   0x65c, 0x1c9d            ; RT#81  
 27673  8bd3           mov     dx, bx                
 27675  0bd2           or      dx, dx                
 27677  7506           jne     0x6c25                
 27679  9ad6025c06     lcall   0x65c, 0x2d6             ; RT#52  
 27684  c3             ret                           
 27685  e89000         call    0x6cb8                
 27688  86f2           xchg    dl, dh                
 27690  52             push    dx                    
 27691  0bc9           or      cx, cx                
 27693  7504           jne     0x6c33                
 27695  b502           mov     ch, 2                 
 27697  eb0c           jmp     0x6c3f                
 27699  ba1200         mov     dx, 0x12              
 27702  b8dc34         mov     ax, 0x34dc            
 27705  f7f1           div     cx                    
 27707  8bc8           mov     cx, ax                
 27709  86e9           xchg    cl, ch                
 27711  51             push    cx                    
 27712  8b1e4500       mov     bx, word ptr [0x45]   
 27716  8b4f04         mov     cx, word ptr [bx + 4] 
 27719  e8dcfb         call    0x6826                
 27722  7403           je      0x6c4f                
 27724  e9e0fb         jmp     0x682f                
 27727  3b4f06         cmp     cx, word ptr [bx + 6] 
 27730  74f3           je      0x6c47                
 27732  59             pop     cx                    
 27733  58             pop     ax                    
 27734  fa             cli                           
 27735  e8cb00         call    0x6d25                
 27738  8ac4           mov     al, ah                
 27740  e8c600         call    0x6d25                
 27743  8bc1           mov     ax, cx                
 27745  e8c100         call    0x6d25                
 27748  8ac4           mov     al, ah                
 27750  e8bc00         call    0x6d25                
 27753  803e400000     cmp     byte ptr [0x40], 0    
 27758  7407           je      0x6c77                
 27760  833e430000     cmp     word ptr [0x43], 0    
 27765  753f           jne     0x6cb6                
 27767  06             push    es                    
 27768  33c0           xor     ax, ax                
 27770  8ec0           mov     es, ax                
 27772  ba7d02         mov     dx, 0x27d             
 27775  2689162000     mov     word ptr es:[0x20], dx
 27780  268c0e2200     mov     word ptr es:[0x22], cs
 27785  07             pop     es                    
 27786  b80008         mov     ax, 0x800             
 27789  e640           out     0x40, al              
 27791  8ac4           mov     al, ah                
 27793  e640           out     0x40, al              
 27795  803e410000     cmp     byte ptr [0x41], 0    
 27800  750a           jne     0x6ca4                
 27802  b0b6           mov     al, 0xb6              
 27804  e643           out     0x43, al              
 27806  e461           in      al, 0x61              
 27808  0c03           or      al, 3                 
 27810  e661           out     0x61, al              
 27812  e85b00         call    0x6d02                
 27815  e642           out     0x42, al              
 27817  8ac4           mov     al, ah                
 27819  e642           out     0x42, al              
 27821  890e4300       mov     word ptr [0x43], cx   
 27825  c606410000     mov     byte ptr [0x41], 0    
 27830  fb             sti                           
 27831  c3             ret                           
 27832  8b1e4500       mov     bx, word ptr [0x45]   
 27836  803e400000     cmp     byte ptr [0x40], 0    
 27841  7514           jne     0x6cd7                
 27843  837f0600       cmp     word ptr [bx + 6], 0  
 27847  75fa           jne     0x6cc3                
 27849  833e430000     cmp     word ptr [0x43], 0    
 27854  7431           je      0x6d01                
 27856  c6064100ff     mov     byte ptr [0x41], 0xff 
 27861  ebf2           jmp     0x6cc9                
 27863  81fbcc05       cmp     bx, 0x5cc             
 27867  7524           jne     0x6d01                
 27869  51             push    cx                    
 27870  bb0c04         mov     bx, 0x40c             
 27873  e86c30         call    0x9d50                
 27876  8bde           mov     bx, si                
 27878  891e4500       mov     word ptr [0x45], bx   
 27882  c747040004     mov     word ptr [bx + 4], 0x400
 27887  b90c00         mov     cx, 0xc               
 27890  03ce           add     cx, si                
 27892  894f02         mov     word ptr [bx + 2], cx 
 27895  e83f00         call    0x6d39                
 27898  81c10004       add     cx, 0x400             
 27902  890f           mov     word ptr [bx], cx     
 27904  59             pop     cx                    
 27905  c3             ret                           
 27906  e80c00         call    0x6d11                
 27909  8ae8           mov     ch, al                
 27911  e80700         call    0x6d11                
 27914  8ac8           mov     cl, al                
 27916  e80200         call    0x6d11                
 27919  8ae0           mov     ah, al                
 27921  8b7708         mov     si, word ptr [bx + 8] 
 27924  8a04           mov     al, byte ptr [si]     
 27926  46             inc     si                    
 27927  3b37           cmp     si, word ptr [bx]     
 27929  7503           jne     0x6d1e                
 27931  8b7702         mov     si, word ptr [bx + 2] 
 27934  897708         mov     word ptr [bx + 8], si 
 27937  ff4f06         dec     word ptr [bx + 6]     
 27940  c3             ret                           
 27941  8b770a         mov     si, word ptr [bx + 0xa]
 27944  8804           mov     byte ptr [si], al     
 27946  46             inc     si                    
 27947  3b37           cmp     si, word ptr [bx]     
 27949  7503           jne     0x6d32                
 27951  8b7702         mov     si, word ptr [bx + 2] 
 27954  89770a         mov     word ptr [bx + 0xa], si
 27957  ff4706         inc     word ptr [bx + 6]     
 27960  c3             ret                           
 27961  894f08         mov     word ptr [bx + 8], cx 
 27964  894f0a         mov     word ptr [bx + 0xa], cx
 27967  c747060000     mov     word ptr [bx + 6], 0  
 27972  c3             ret                           
 27973  89260406       mov     word ptr [0x604], sp  
 27977  50             push    ax                    
 27978  53             push    bx                    
 27979  51             push    cx                    
 27980  52             push    dx                    
 27981  e83ffc         call    0x698f                
 27984  b227           mov     dl, 0x27              
 27986  803ee40528     cmp     byte ptr [0x5e4], 0x28
 27991  7402           je      0x6d5b                
 27993  b24f           mov     dl, 0x4f              
 27995  b618           mov     dh, 0x18              
 27997  8a3e8200       mov     bh, byte ptr [0x82]   
 28001  b90000         mov     cx, 0                 
 28004  8ac1           mov     al, cl                
 28006  b406           mov     ah, 6                 
 28008  e880f8         call    0x65eb                
 28011  eb13           jmp     0x6d80                
 28013  50             push    ax                    
 28014  53             push    bx                    
 28015  51             push    cx                    
 28016  52             push    dx                    
 28017  b90000         mov     cx, 0                 
 28020  890e5100       mov     word ptr [0x51], cx   
 28024  a05000         mov     al, byte ptr [0x50]   
 28027  b400           mov     ah, 0                 
 28029  e86bf8         call    0x65eb                
 28032  e80e00         call    0x6d91                
 28035  e8c001         call    0x6f46                
 28038  e8a7fb         call    0x6930                
 28041  e808fc         call    0x6994                
 28044  5a             pop     dx                    
 28045  59             pop     cx                    
 28046  5b             pop     bx                    
 28047  58             pop     ax                    
 28048  cb             retf                          
 28049  a05000         mov     al, byte ptr [0x50]   
 28052  c706de056400   mov     word ptr [0x5de], 0x64
 28058  3c06           cmp     al, 6                 
 28060  7412           je      0x6db0                
 28062  731c           jae     0x6dbc                
 28064  3c04           cmp     al, 4                 
 28066  7218           jb      0x6dbc                
 28068  c606870002     mov     byte ptr [0x87], 2    
 28073  c706dc05a000   mov     word ptr [0x5dc], 0xa0
 28079  c3             ret                           
 28080  c606870001     mov     byte ptr [0x87], 1    
 28085  c706dc054001   mov     word ptr [0x5dc], 0x140
 28091  c3             ret                           
 28092  c606870000     mov     byte ptr [0x87], 0    
 28097  c3             ret                           
 28098  50             push    ax                    
 28099  53             push    bx                    
 28100  51             push    cx                    
 28101  52             push    dx                    
 28102  56             push    si                    
 28103  57             push    di                    
 28104  8acb           mov     cl, bl                
 28106  e8be00         call    0x6e8b                
 28109  e99bfc         jmp     0x6a6b                
 28112  50             push    ax                    
 28113  53             push    bx                    
 28114  51             push    cx                    
 28115  52             push    dx                    
 28116  56             push    si                    
 28117  57             push    di                    
 28118  e8b600         call    0x6e8f                
 28121  e98dfc         jmp     0x6a69                
 28124  89260406       mov     word ptr [0x604], sp  
 28128  50             push    ax                    
 28129  53             push    bx                    
 28130  51             push    cx                    
 28131  52             push    dx                    
 28132  56             push    si                    
 28133  57             push    di                    
 28134  8acb           mov     cl, bl                
 28136  e8a000         call    0x6e8b                
 28139  7446           je      0x6e33                
 28141  803e500006     cmp     byte ptr [0x50], 6    
 28146  7436           je      0x6e2a                
 28148  8809           mov     byte ptr [bx + di], cl
 28150  43             inc     bx                    
 28151  8aeb           mov     ch, bl                
 28153  e863fc         call    0x6a5f                
 28156  8a08           mov     cl, byte ptr [bx + si]
 28158  8809           mov     byte ptr [bx + di], cl
 28160  0adb           or      bl, bl                
 28162  7508           jne     0x6e0c                
 28164  80f908         cmp     cl, 8                 
 28167  7203           jb      0x6e0c                
 28169  80c910         or      cl, 0x10              
 28172  53             push    bx                    
 28173  51             push    cx                    
 28174  57             push    di                    
 28175  56             push    si                    
 28176  8afb           mov     bh, bl                
 28178  8ad9           mov     bl, cl                
 28180  b40b           mov     ah, 0xb               
 28182  e8d2f7         call    0x65eb                
 28185  5e             pop     si                    
 28186  5f             pop     di                    
 28187  59             pop     cx                    
 28188  5b             pop     bx                    
 28189  43             inc     bx                    
 28190  3add           cmp     bl, ch                
 28192  72da           jb      0x6dfc                
 28194  c606820000     mov     byte ptr [0x82], 0    
 28199  e94bfc         jmp     0x6a75                
 28202  c70668000000   mov     word ptr [0x68], 0    
 28208  e93f0b         jmp     0x7972                
 28211  e81afc         call    0x6a50                
 28214  803820         cmp     byte ptr [bx + si], 0x20
 28217  73ef           jae     0x6e2a                
 28219  43             inc     bx                    
 28220  3add           cmp     bl, ch                
 28222  7305           jae     0x6e45                
 28224  803810         cmp     byte ptr [bx + si], 0x10
 28227  ebf4           jmp     0x6e39                
 28229  33db           xor     bx, bx                
 28231  8a08           mov     cl, byte ptr [bx + si]
 28233  8809           mov     byte ptr [bx + di], cl
 28235  43             inc     bx                    
 28236  8a28           mov     ch, byte ptr [bx + si]
 28238  8829           mov     byte ptr [bx + di], ch
 28240  43             inc     bx                    
 28241  8a10           mov     dl, byte ptr [bx + si]
 28243  8811           mov     byte ptr [bx + di], dl
 28245  8af1           mov     dh, cl                
 28247  80e60f         and     dh, 0xf               
 28250  8ac5           mov     al, ch                
 28252  d0e0           shl     al, 1                 
 28254  2410           and     al, 0x10              
 28256  0ac2           or      al, dl                
 28258  80e507         and     ch, 7                 
 28261  d0e5           shl     ch, 1                 
 28263  d0e5           shl     ch, 1                 
 28265  d0e5           shl     ch, 1                 
 28267  d0e5           shl     ch, 1                 
 28269  f6c110         test    cl, 0x10              
 28272  7403           je      0x6e75                
 28274  80cd80         or      ch, 0x80              
 28277  0aee           or      ch, dh                
 28279  8ad8           mov     bl, al                
 28281  b700           mov     bh, 0                 
 28283  882e8100       mov     byte ptr [0x81], ch   
 28287  882e8200       mov     byte ptr [0x82], ch   
 28291  b40b           mov     ah, 0xb               
 28293  e863f7         call    0x65eb                
 28296  e9eafb         jmp     0x6a75                
 28299  0aff           or      bh, bh                
 28301  759b           jne     0x6e2a                
 28303  bf6a00         mov     di, 0x6a              
 28306  be7e00         mov     si, 0x7e              
 28309  b503           mov     ch, 3                 
 28311  8b1e6800       mov     bx, word ptr [0x68]   
 28315  e81ffb         call    0x69bd                
 28318  7405           je      0x6ea5                
 28320  be8300         mov     si, 0x83              
 28323  b504           mov     ch, 4                 
 28325  c3             ret                           
 28326  80fb02         cmp     bl, 2                 
 28329  7416           je      0x6ec1                
 28331  eb06           jmp     0x6eb3                
 28333  b301           mov     bl, 1                 
 28335  eb02           jmp     0x6eb3                
 28337  b300           mov     bl, 0                 
 28339  3a1e1100       cmp     bl, byte ptr [0x11]   
 28343  881e1100       mov     byte ptr [0x11], bl   
 28347  7403           je      0x6ec0                
 28349  e88600         call    0x6f46                
 28352  cb             retf                          
 28353  e88704         call    0x734b                
 28356  bb1600         mov     bx, 0x16              
 28359  b90a00         mov     cx, 0xa               
 28362  fec5           inc     ch                    
 28364  b046           mov     al, 0x46              
 28366  e8d533         call    0xa2a6                
 28369  e82900         call    0x6efd                
 28372  b020           mov     al, 0x20              
 28374  e8cd33         call    0xa2a6                
 28377  53             push    bx                    
 28378  51             push    cx                    
 28379  8b0f           mov     cx, word ptr [bx]     
 28381  e30f           jcxz    0x6eee                
 28383  8b7702         mov     si, word ptr [bx + 2] 
 28386  ac             lodsb   al, byte ptr [si]     
 28387  3c0d           cmp     al, 0xd               
 28389  7502           jne     0x6ee9                
 28391  b01b           mov     al, 0x1b              
 28393  e8ba33         call    0xa2a6                
 28396  e2f4           loop    0x6ee2                
 28398  b00d           mov     al, 0xd               
 28400  e8b333         call    0xa2a6                
 28403  59             pop     cx                    
 28404  5b             pop     bx                    
 28405  83c304         add     bx, 4                 
 28408  fec9           dec     cl                    
 28410  75ce           jne     0x6eca                
 28412  c3             ret                           
 28413  8ac5           mov     al, ch                
 28415  d40a           aam     0xa                   
 28417  0d3030         or      ax, 0x3030            
 28420  80fc30         cmp     ah, 0x30              
 28423  7504           jne     0x6f0d                
 28425  86e0           xchg    al, ah                
 28427  b020           mov     al, 0x20              
 28429  50             push    ax                    
 28430  8ac4           mov     al, ah                
 28432  e89333         call    0xa2a6                
 28435  58             pop     ax                    
 28436  e98f33         jmp     0xa2a6                
 28439  e83104         call    0x734b                
 28442  52             push    dx                    
 28443  0adb           or      bl, bl                
 28445  7424           je      0x6f43                
 28447  4b             dec     bx                    
 28448  83fb0a         cmp     bx, 0xa               
 28451  731e           jae     0x6f43                
 28453  b004           mov     al, 4                 
 28455  f6e3           mul     bl                    
 28457  051600         add     ax, 0x16              
 28460  5b             pop     bx                    
 28461  50             push    ax                    
 28462  ba0100         mov     dx, 1                 
 28465  b90f00         mov     cx, 0xf               
 28468  9af01d5c06     lcall   0x65c, 0x1df0            ; RT#82  
 28473  5a             pop     dx                    
 28474  9acc0b5c06     lcall   0x65c, 0xbcc             ; RT#58  
 28479  e80400         call    0x6f46                
 28482  c3             ret                           
 28483  e92c0a         jmp     0x7972                
 28486  50             push    ax                    
 28487  53             push    bx                    
 28488  51             push    cx                    
 28489  52             push    dx                    
 28490  56             push    si                    
 28491  57             push    di                    
 28492  b618           mov     dh, 0x18              
 28494  b200           mov     dl, 0                 
 28496  8a3e5100       mov     bh, byte ptr [0x51]   
 28500  b402           mov     ah, 2                 
 28502  e892f6         call    0x65eb                
 28505  a01100         mov     al, byte ptr [0x11]   
 28508  0ac0           or      al, al                
 28510  7519           jne     0x6f79                
 28512  8a1e8200       mov     bl, byte ptr [0x82]   
 28516  8a0ee405       mov     cl, byte ptr [0x5e4]  
 28520  b500           mov     ch, 0                 
 28522  b409           mov     ah, 9                 
 28524  e87cf6         call    0x65eb                
 28527  e8c3f9         call    0x6935                
 28530  5f             pop     di                    
 28531  5e             pop     si                    
 28532  5a             pop     dx                    
 28533  59             pop     cx                    
 28534  5b             pop     bx                    
 28535  58             pop     ax                    
 28536  c3             ret                           
 28537  b307           mov     bl, 7                 
 28539  e83ffa         call    0x69bd                
 28542  7509           jne     0x6f89                
 28544  803e7f0000     cmp     byte ptr [0x7f], 0    
 28549  7502           jne     0x6f89                
 28551  b370           mov     bl, 0x70              
 28553  bf1600         mov     di, 0x16              
 28556  b031           mov     al, 0x31              
 28558  b405           mov     ah, 5                 
 28560  803ee40528     cmp     byte ptr [0x5e4], 0x28
 28565  7402           je      0x6f99                
 28567  b40a           mov     ah, 0xa               
 28569  50             push    ax                    
 28570  53             push    bx                    
 28571  8a1e8100       mov     bl, byte ptr [0x81]   
 28575  e84300         call    0x6fe5                
 28578  8bdf           mov     bx, di                
 28580  8b0f           mov     cx, word ptr [bx]     
 28582  8b7702         mov     si, word ptr [bx + 2] 
 28585  83f906         cmp     cx, 6                 
 28588  7203           jb      0x6fb1                
 28590  b90600         mov     cx, 6                 
 28593  5b             pop     bx                    
 28594  53             push    bx                    
 28595  51             push    cx                    
 28596  e306           jcxz    0x6fbc                
 28598  ac             lodsb   al, byte ptr [si]     
 28599  e82500         call    0x6fdf                
 28602  e2fa           loop    0x6fb6                
 28604  5b             pop     bx                    
 28605  b107           mov     cl, 7                 
 28607  2acb           sub     cl, bl                
 28609  8a1e8200       mov     bl, byte ptr [0x82]   
 28613  b020           mov     al, 0x20              
 28615  e81b00         call    0x6fe5                
 28618  e2f9           loop    0x6fc5                
 28620  83c704         add     di, 4                 
 28623  5b             pop     bx                    
 28624  58             pop     ax                    
 28625  fec0           inc     al                    
 28627  3c3a           cmp     al, 0x3a              
 28629  7202           jb      0x6fd9                
 28631  b030           mov     al, 0x30              
 28633  fecc           dec     ah                    
 28635  75bc           jne     0x6f99                
 28637  eb90           jmp     0x6f6f                
 28639  3c0d           cmp     al, 0xd               
 28641  7502           jne     0x6fe5                
 28643  b01b           mov     al, 0x1b              
 28645  51             push    cx                    
 28646  57             push    di                    
 28647  56             push    si                    
 28648  b90100         mov     cx, 1                 
 28651  b409           mov     ah, 9                 
 28653  e8fbf5         call    0x65eb                
 28656  fec2           inc     dl                    
 28658  b402           mov     ah, 2                 
 28660  e8f4f5         call    0x65eb                
 28663  5e             pop     si                    
 28664  5f             pop     di                    
 28665  59             pop     cx                    
 28666  c3             ret                           
 28667  50             push    ax                    
 28668  53             push    bx                    
 28669  51             push    cx                    
 28670  52             push    dx                    
 28671  56             push    si                    
 28672  57             push    di                    
 28673  8acb           mov     cl, bl                
 28675  e8d900         call    0x70df                
 28678  e962fa         jmp     0x6a6b                
 28681  50             push    ax                    
 28682  53             push    bx                    
 28683  51             push    cx                    
 28684  52             push    dx                    
 28685  56             push    si                    
 28686  57             push    di                    
 28687  e8d100         call    0x70e3                
 28690  e954fa         jmp     0x6a69                
 28693  89260406       mov     word ptr [0x604], sp  
 28697  50             push    ax                    
 28698  53             push    bx                    
 28699  51             push    cx                    
 28700  52             push    dx                    
 28701  56             push    si                    
 28702  57             push    di                    
 28703  8acb           mov     cl, bl                
 28705  e8bb00         call    0x70df                
 28708  8ae3           mov     ah, bl                
 28710  e827fa         call    0x6a50                
 28713  8b0c           mov     cx, word ptr [si]     
 28715  8b5402         mov     dx, word ptr [si + 2] 
 28718  80fc03         cmp     ah, 3                 
 28721  7302           jae     0x7035                
 28723  8af2           mov     dh, dl                
 28725  8a26e405       mov     ah, byte ptr [0x5e4]  
 28729  0ac9           or      cl, cl                
 28731  753b           jne     0x7078                
 28733  80fe08         cmp     dh, 8                 
 28736  732d           jae     0x706f                
 28738  80fa08         cmp     dl, 8                 
 28741  7328           jae     0x706f                
 28743  80fc50         cmp     ah, 0x50              
 28746  750a           jne     0x7056                
 28748  80fe04         cmp     dh, 4                 
 28751  731e           jae     0x706f                
 28753  80fa04         cmp     dl, 4                 
 28756  7319           jae     0x706f                
 28758  b002           mov     al, 2                 
 28760  80fc28         cmp     ah, 0x28              
 28763  7408           je      0x7065                
 28765  0aed           or      ch, ch                
 28767  743a           je      0x709b                
 28769  fec0           inc     al                    
 28771  eb36           jmp     0x709b                
 28773  fec8           dec     al                    
 28775  0aed           or      ch, ch                
 28777  7530           jne     0x709b                
 28779  fec8           dec     al                    
 28781  eb2c           jmp     0x709b                
 28783  c70668000000   mov     word ptr [0x68], 0    
 28789  e9fa08         jmp     0x7972                
 28792  83fa00         cmp     dx, 0                 
 28795  75f2           jne     0x706f                
 28797  803e500007     cmp     byte ptr [0x50], 7    
 28802  744b           je      0x70cf                
 28804  b006           mov     al, 6                 
 28806  80f902         cmp     cl, 2                 
 28809  b450           mov     ah, 0x50              
 28811  740e           je      0x709b                
 28813  b428           mov     ah, 0x28              
 28815  fec8           dec     al                    
 28817  fec9           dec     cl                    
 28819  75da           jne     0x706f                
 28821  0aed           or      ch, ch                
 28823  7502           jne     0x709b                
 28825  fec8           dec     al                    
 28827  8b0c           mov     cx, word ptr [si]     
 28829  890d           mov     word ptr [di], cx     
 28831  8b4c02         mov     cx, word ptr [si + 2] 
 28834  894d02         mov     word ptr [di + 2], cx 
 28837  8826e405       mov     byte ptr [0x5e4], ah  
 28841  8b0e5000       mov     cx, word ptr [0x50]   
 28845  a25000         mov     byte ptr [0x50], al   
 28848  89165100       mov     word ptr [0x51], dx   
 28852  3ac1           cmp     al, cl                
 28854  741c           je      0x70d4                
 28856  b80700         mov     ax, 7                 
 28859  a37e00         mov     word ptr [0x7e], ax   
 28862  86c4           xchg    ah, al                
 28864  a38000         mov     word ptr [0x80], ax   
 28867  88268200       mov     byte ptr [0x82], ah   
 28871  e8f3f8         call    0x69bd                
 28874  7403           je      0x70cf                
 28876  a28200         mov     byte ptr [0x82], al   
 28879  9aad075c06     lcall   0x65c, 0x7ad             ; RT#66  
 28884  a05200         mov     al, byte ptr [0x52]   
 28887  b405           mov     ah, 5                 
 28889  e80ff5         call    0x65eb                
 28892  e996f9         jmp     0x6a75                
 28895  0aff           or      bh, bh                
 28897  758c           jne     0x706f                
 28899  bf6a00         mov     di, 0x6a              
 28902  be7a00         mov     si, 0x7a              
 28905  8b1e6800       mov     bx, word ptr [0x68]   
 28909  b504           mov     ch, 4                 
 28911  c3             ret                           
 28912  32ff           xor     bh, bh                
 28914  8a1e5300       mov     bl, byte ptr [0x53]   
 28918  cb             retf                          
 28919  89260406       mov     word ptr [0x604], sp  
 28923  50             push    ax                    
 28924  51             push    cx                    
 28925  52             push    dx                    
 28926  56             push    si                    
 28927  57             push    di                    
 28928  0afe           or      bh, dh                
 28930  7546           jne     0x714a                
 28932  0afa           or      bh, dl                
 28934  0af9           or      bh, cl                
 28936  7440           je      0x714a                
 28938  3816e405       cmp     byte ptr [0x5e4], dl  
 28942  723a           jb      0x714a                
 28944  80fb1a         cmp     bl, 0x1a              
 28947  7335           jae     0x714a                
 28949  803e110000     cmp     byte ptr [0x11], 0    
 28954  7405           je      0x7121                
 28956  80fb19         cmp     bl, 0x19              
 28959  7329           jae     0x714a                
 28961  8af3           mov     dh, bl                
 28963  fece           dec     dh                    
 28965  feca           dec     dl                    
 28967  8a3e5100       mov     bh, byte ptr [0x51]   
 28971  51             push    cx                    
 28972  b402           mov     ah, 2                 
 28974  e8baf4         call    0x65eb                
 28977  b408           mov     ah, 8                 
 28979  e8b5f4         call    0x65eb                
 28982  e8fcf7         call    0x6935                
 28985  59             pop     cx                    
 28986  fec1           inc     cl                    
 28988  7402           je      0x7140                
 28990  8ac4           mov     al, ah                
 28992  32ff           xor     bh, bh                
 28994  8ad8           mov     bl, al                
 28996  5f             pop     di                    
 28997  5e             pop     si                    
 28998  5a             pop     dx                    
 28999  59             pop     cx                    
 29000  58             pop     ax                    
 29001  cb             retf                          
 29002  e92508         jmp     0x7972                
 29005  53             push    bx                    
 29006  50             push    ax                    
 29007  0aff           or      bh, bh                
 29009  7532           jne     0x7185                
 29011  3a1ee405       cmp     bl, byte ptr [0x5e4]  
 29015  7429           je      0x7182                
 29017  8a265000       mov     ah, byte ptr [0x50]   
 29021  80fb50         cmp     bl, 0x50              
 29024  7405           je      0x7167                
 29026  80fb28         cmp     bl, 0x28              
 29029  751e           jne     0x7185                
 29031  80fc07         cmp     ah, 7                 
 29034  7416           je      0x7182                
 29036  80f402         xor     ah, 2                 
 29039  881ee405       mov     byte ptr [0x5e4], bl  
 29043  88265000       mov     byte ptr [0x50], ah   
 29047  c70651000000   mov     word ptr [0x51], 0    
 29053  9aad075c06     lcall   0x65c, 0x7ad             ; RT#66  
 29058  58             pop     ax                    
 29059  5b             pop     bx                    
 29060  c3             ret                           
 29061  e9ea07         jmp     0x7972                
 29064  89260406       mov     word ptr [0x604], sp  
 29068  53             push    bx                    