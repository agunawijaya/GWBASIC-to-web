; PAC-GAL.EXE -- annotated disassembly of the compiled BASIC program
; file 39296 bytes, header 5632, 1361 relocations
; user code 26..11988 ; string base = image 28084 (seg 06DB)
; RT#n = BASCOM runtime entry point, ranked by call frequency

    26  9a00009c07     lcall   0x79c, 0              
    31  55             push    bp                    
    32  8bec           mov     bp, sp                
    34  81ec1800       sub     sp, 0x18              
    38  9a7215ec02     lcall   0x2ec, 0x1572            ; RT#42  
    43  9a8c15ec02     lcall   0x2ec, 0x158c            ; RT#43  
    48  cc             int3                          
    49  9a0e20ec02     lcall   0x2ec, 0x200e            ; RT#13  
    54  cc             int3                          
    55  cc             int3                          
    56  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
    61  bb300a         mov     bx, 0xa30                ; = 'How fast (0-30000)'
    64  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1     <<< bx='How fast (0-30000)'
    69  cc             int3                          
    70  bb460a         mov     bx, 0xa46             
    73  9a5124ec02     lcall   0x2ec, 0x2451            ; RT#29  
    78  009abe27       add     byte ptr [bp + si + 0x27be], bl
    82  ec             in      al, dx                
    83  0201           add     al, byte ptr [bx + di]
    85  04bb           add     al, 0xbb              
    87  3209           xor     cl, byte ptr [bx + di]
    89  9a8528ec02     lcall   0x2ec, 0x2885            ; RT#31  
    94  cc             int3                          
    95  9a0e20ec02     lcall   0x2ec, 0x200e            ; RT#13  
   100  cc             int3                          
   101  bb4a0a         mov     bx, 0xa4a                ; = 't255mbl64o1afgao4d'
   104  ba3409         mov     dx, 0x934             
   107  9a6202ec02     lcall   0x2ec, 0x262             ; RT#8     <<< bx='t255mbl64o1afgao4d'
   112  cc             int3                          
   113  bb600a         mov     bx, 0xa60                ; = 'mbl64abceabceebceabceagaa'
   116  ba3809         mov     dx, 0x938             
   119  9a6202ec02     lcall   0x2ec, 0x262             ; RT#8     <<< bx='mbl64abceabceebceabceagaa'
   124  cc             int3                          
   125  bb7e0a         mov     bx, 0xa7e                ; = 'mbt190o2l8bbbl16cecl8bbp8bbbl16cl8edcc'
   128  ba3c09         mov     dx, 0x93c             
   131  9a6202ec02     lcall   0x2ec, 0x262             ; RT#8     <<< bx='mbt190o2l8bbbl16cecl8bbp8bbbl16cl8edcc'
   136  cc             int3                          
   137  cc             int3                          
   138  cc             int3                          
   139  cc             int3                          
   140  9a0e20ec02     lcall   0x2ec, 0x200e            ; RT#13  
   145  cc             int3                          
   146  bb3c09         mov     bx, 0x93c             
   149  9a9d24ec02     lcall   0x2ec, 0x249d            ; RT#14  
   154  cc             int3                          
   155  b83c00         mov     ax, 0x3c              
   158  e94800         jmp     0xe9                  
   161  cc             int3                          
   162  bb0e00         mov     bx, 0xe               
   165  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
   170  8b1ec409       mov     bx, word ptr [0x9c4]  
   174  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
   179  cc             int3                          
   180  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
   185  bb0200         mov     bx, 2                 
   188  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
   193  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
   198  bba80a         mov     bx, 0xaa8             
   201  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
   206  cc             int3                          
   207  b80100         mov     ax, 1                 
   210  e90500         jmp     0xda                  
   213  cc             int3                          
   214  a1c609         mov     ax, word ptr [0x9c6]  
   217  40             inc     ax                    
   218  a3c609         mov     word ptr [0x9c6], ax  
   221  833ec60919     cmp     word ptr [0x9c6], 0x19
   226  7ef1           jle     0xd5                  
   228  cc             int3                          
   229  a1c409         mov     ax, word ptr [0x9c4]  
   232  48             dec     ax                    
   233  a3c409         mov     word ptr [0x9c4], ax  
   236  833ec40901     cmp     word ptr [0x9c4], 1   
   241  7dae           jge     0xa1                  
   243  cc             int3                          
   244  bb3c09         mov     bx, 0x93c             
   247  9a9d24ec02     lcall   0x2ec, 0x249d            ; RT#14  
   252  cc             int3                          
   253  b80100         mov     ax, 1                 
   256  e98c00         jmp     0x18f                 
   259  cc             int3                          
   260  bb0e00         mov     bx, 0xe               
   263  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
   268  8b1ec409       mov     bx, word ptr [0x9c4]  
   272  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
   277  cc             int3                          
   278  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
   283  bba80a         mov     bx, 0xaa8             
   286  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
   291  bb0300         mov     bx, 3                 
   294  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
   299  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
   304  bbae0a         mov     bx, 0xaae             
   307  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
   312  bb0400         mov     bx, 4                 
   315  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
   320  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
   325  bb0500         mov     bx, 5                 
   328  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
   333  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
   338  bb0600         mov     bx, 6                 
   341  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
   346  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
   351  bbb60a         mov     bx, 0xab6                ; = '       '
   354  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1     <<< bx='       '
   359  bb0200         mov     bx, 2                 
   362  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
   367  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
   372  cc             int3                          
   373  b80100         mov     ax, 1                 
   376  e90500         jmp     0x180                 
   379  cc             int3                          
   380  a1c609         mov     ax, word ptr [0x9c6]  
   383  40             inc     ax                    
   384  a3c609         mov     word ptr [0x9c6], ax  
   387  833ec60919     cmp     word ptr [0x9c6], 0x19
   392  7ef1           jle     0x17b                 
   394  cc             int3                          
   395  a1c409         mov     ax, word ptr [0x9c4]  
   398  40             inc     ax                    
   399  a3c409         mov     word ptr [0x9c4], ax  
   402  833ec4093c     cmp     word ptr [0x9c4], 0x3c
   407  7f03           jg      0x19c                 
   409  e967ff         jmp     0x103                 
   412  cc             int3                          
   413  c706c8090000   mov     word ptr [0x9c8], 0   
   419  cc             int3                          
   420  c706c4090000   mov     word ptr [0x9c4], 0   
   426  cc             int3                          
   427  c706c6090000   mov     word ptr [0x9c6], 0   
   433  cc             int3                          
   434  c706ca090000   mov     word ptr [0x9ca], 0   
   440  cc             int3                          
   441  c706cc090000   mov     word ptr [0x9cc], 0   
   447  cc             int3                          
   448  c706ce090000   mov     word ptr [0x9ce], 0   
   454  cc             int3                          
   455  c706d0090000   mov     word ptr [0x9d0], 0   
   461  cc             int3                          
   462  c706d2090000   mov     word ptr [0x9d2], 0   
   468  cc             int3                          
   469  c706d4090000   mov     word ptr [0x9d4], 0   
   475  cc             int3                          
   476  e96600         jmp     0x245                 
   479  9a9514ec02     lcall   0x2ec, 0x1495            ; RT#23  
   484  ba0200         mov     dx, 2                 
   487  9af612ec02     lcall   0x2ec, 0x12f6            ; RT#44  
   492  9aeb0eec02     lcall   0x2ec, 0xeeb             ; RT#24  
   497  bfc20a         mov     di, 0xac2             
   500  9a020cec02     lcall   0x2ec, 0xc02             ; RT#32  
   505  9a9514ec02     lcall   0x2ec, 0x1495            ; RT#23  
   510  8bca           mov     cx, dx                
   512  ba0400         mov     dx, 4                 
   515  9a0d13ec02     lcall   0x2ec, 0x130d            ; RT#45  
   520  9a4403ec02     lcall   0x2ec, 0x344             ; RT#33  
   525  819aeb0eec02   sbb     word ptr [bp + si + 0xeeb], 0x2ec
   531  bfca0a         mov     di, 0xaca             
   534  9a020cec02     lcall   0x2ec, 0xc02             ; RT#32  
   539  9a6e0aec02     lcall   0x2ec, 0xa6e             ; RT#34  
   544  819a9514ec02   sbb     word ptr [bp + si + 0x1495], 0x2ec
   550  8bd1           mov     dx, cx                
   552  9aff12ec02     lcall   0x2ec, 0x12ff            ; RT#46  
   557  9a4403ec02     lcall   0x2ec, 0x344             ; RT#33  
   562  829aeb0eec     sbb     byte ptr [bp + si + 0xeeb], 0xec
   567  029a6e0a       add     bl, byte ptr [bp + si + 0xa6e]
   571  ec             in      al, dx                
   572  02829acf       add     al, byte ptr [bp + si - 0x3066]
   576  26ec           in      al, dx                
   578  0293c3cc       add     dl, byte ptr [bp + di - 0x333d]
   582  9a0e20ec02     lcall   0x2ec, 0x200e            ; RT#13  
   587  cc             int3                          
   588  bba80a         mov     bx, 0xaa8             
   591  bad809         mov     dx, 0x9d8             
   594  9a6202ec02     lcall   0x2ec, 0x262             ; RT#8   
   599  cc             int3                          
   600  bbdb00         mov     bx, 0xdb              
   603  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
   608  badc09         mov     dx, 0x9dc             
   611  9a6202ec02     lcall   0x2ec, 0x262             ; RT#8   
   616  cc             int3                          
   617  bbba00         mov     bx, 0xba              
   620  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
   625  b8d809         mov     ax, 0x9d8             
   628  9a9802ec02     lcall   0x2ec, 0x298             ; RT#12  
   633  bae009         mov     dx, 0x9e0             
   636  9a6202ec02     lcall   0x2ec, 0x262             ; RT#8   
   641  cc             int3                          
   642  bbc400         mov     bx, 0xc4              
   645  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
   650  bae409         mov     dx, 0x9e4             
   653  9a6202ec02     lcall   0x2ec, 0x262             ; RT#8   
   658  cc             int3                          
   659  bbd20a         mov     bx, 0xad2                ; = 'ba#ag#gf#fed#dc#c'
   662  bae809         mov     dx, 0x9e8             
   665  9a6202ec02     lcall   0x2ec, 0x262             ; RT#8     <<< bx='ba#ag#gf#fed#dc#c'
   670  cc             int3                          
   671  bbe80a         mov     bx, 0xae8                ; = 'cc#dd#eff#gg#aa#b'
   674  baec09         mov     dx, 0x9ec             
   677  9a6202ec02     lcall   0x2ec, 0x262             ; RT#8     <<< bx='cc#dd#eff#gg#aa#b'
   682  cc             int3                          
   683  bbf900         mov     bx, 0xf9              
   686  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
   691  b8d809         mov     ax, 0x9d8             
   694  9a9802ec02     lcall   0x2ec, 0x298             ; RT#12  
   699  baf009         mov     dx, 0x9f0             
   702  9a6202ec02     lcall   0x2ec, 0x262             ; RT#8   
   707  cc             int3                          
   708  bbdb00         mov     bx, 0xdb              
   711  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
   716  b8d809         mov     ax, 0x9d8             
   719  9a9802ec02     lcall   0x2ec, 0x298             ; RT#12  
   724  baf409         mov     dx, 0x9f4             
   727  9a6202ec02     lcall   0x2ec, 0x262             ; RT#8   
   732  cc             int3                          
   733  bb0200         mov     bx, 2                 
   736  bacd00         mov     dx, 0xcd              
   739  9a6113ec02     lcall   0x2ec, 0x1361            ; RT#10  
   744  baf809         mov     dx, 0x9f8             
   747  9a6202ec02     lcall   0x2ec, 0x262             ; RT#8   
   752  cc             int3                          
   753  bbcd00         mov     bx, 0xcd              
   756  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
   761  bafc09         mov     dx, 0x9fc             
   764  9a6202ec02     lcall   0x2ec, 0x262             ; RT#8   
   769  cc             int3                          
   770  bb0f00         mov     bx, 0xf               
   773  9a8b20ec02     lcall   0x2ec, 0x208b            ; RT#6   
   778  33db           xor     bx, bx                
   780  9aa520ec02     lcall   0x2ec, 0x20a5            ; RT#7   
   785  cc             int3                          
   786  33db           xor     bx, bx                
   788  9a6f21ec02     lcall   0x2ec, 0x216f            ; RT#35  
   793  cc             int3                          
   794  bb1900         mov     bx, 0x19              
   797  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
   802  bb1c00         mov     bx, 0x1c              
   805  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
   810  cc             int3                          
   811  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
   816  bbfe0a         mov     bx, 0xafe                ; = '    P A C - G A L '
   819  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1     <<< bx='    P A C - G A L '
   824  cc             int3                          
   825  bb0700         mov     bx, 7                 
   828  9a8b20ec02     lcall   0x2ec, 0x208b            ; RT#6   
   833  33db           xor     bx, bx                
   835  9aa520ec02     lcall   0x2ec, 0x20a5            ; RT#7   
   840  cc             int3                          
   841  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
   846  bb140b         mov     bx, 0xb14                ; = '        Al J. JimM'
   849  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1     <<< bx='        Al J. JimM'
   854  bb8200         mov     bx, 0x82              
   857  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
   862  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
   867  bb2a0b         mov     bx, 0xb2a                ; = 'nez, May 1982'
   870  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1     <<< bx='nez, May 1982'
   875  cc             int3                          
   876  bb1800         mov     bx, 0x18              
   879  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
   884  bb0100         mov     bx, 1                 
   887  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
   892  cc             int3                          
   893  bb3c0b         mov     bx, 0xb3c             
   896  9a0c2aec02     lcall   0x2ec, 0x2a0c            ; RT#48  
   901  bb4f00         mov     bx, 0x4f              
   904  badf00         mov     dx, 0xdf              
   907  9a6113ec02     lcall   0x2ec, 0x1361            ; RT#10  
   912  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
   917  cc             int3                          
   918  bb0100         mov     bx, 1                 
   921  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
   926  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
   931  cc             int3                          
   932  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
   937  bb4f00         mov     bx, 0x4f              
   940  badc00         mov     dx, 0xdc              
   943  9a6113ec02     lcall   0x2ec, 0x1361            ; RT#10  
   948  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
   953  cc             int3                          
   954  bb0200         mov     bx, 2                 
   957  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
   962  bb0100         mov     bx, 1                 
   965  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
   970  cc             int3                          
   971  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
   976  bbdc09         mov     bx, 0x9dc             
   979  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
   984  bbf009         mov     bx, 0x9f0             
   987  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
   992  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
   997  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1002  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1007  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1012  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1017  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1022  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1027  8bd3           mov     dx, bx                
  1029  bbe009         mov     bx, 0x9e0             
  1032  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1037  8bcb           mov     cx, bx                
  1039  8bda           mov     bx, dx                
  1041  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1046  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1051  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1056  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1061  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1066  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1071  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1076  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1081  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1086  8bd9           mov     bx, cx                
  1088  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1093  8bda           mov     bx, dx                
  1095  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1100  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1105  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1110  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1115  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1120  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1125  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1130  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1135  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1140  8bd9           mov     bx, cx                
  1142  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1147  8bda           mov     bx, dx                
  1149  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1154  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1159  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1164  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1169  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1174  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1179  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1184  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1189  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1194  bbf409         mov     bx, 0x9f4             
  1197  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1202  cc             int3                          
  1203  bb0300         mov     bx, 3                 
  1206  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  1211  bb0100         mov     bx, 1                 
  1214  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  1219  cc             int3                          
  1220  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  1225  bbdc09         mov     bx, 0x9dc             
  1228  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1233  bbf009         mov     bx, 0x9f0             
  1236  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1241  8bd3           mov     dx, bx                
  1243  bbe009         mov     bx, 0x9e0             
  1246  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1251  8bcb           mov     cx, bx                
  1253  8bda           mov     bx, dx                
  1255  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1260  bbd809         mov     bx, 0x9d8             
  1263  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1268  8bc3           mov     ax, bx                
  1270  bbc900         mov     bx, 0xc9              
  1273  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  1278  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1283  bbf809         mov     bx, 0x9f8             
  1286  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1291  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1296  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1301  895efe         mov     word ptr [bp - 2], bx 
  1304  8bda           mov     bx, dx                
  1306  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1311  8bd9           mov     bx, cx                
  1313  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1318  8bda           mov     bx, dx                
  1320  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1325  93             xchg    bx, ax                
  1326  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1331  895efc         mov     word ptr [bp - 4], bx 
  1334  8b5efe         mov     bx, word ptr [bp - 2] 
  1337  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1342  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1347  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1352  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1357  895efa         mov     word ptr [bp - 6], bx 
  1360  bbcb00         mov     bx, 0xcb              
  1363  895ef8         mov     word ptr [bp - 8], bx 
  1366  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  1371  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1376  8b5efa         mov     bx, word ptr [bp - 6] 
  1379  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1384  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1389  93             xchg    bx, ax                
  1390  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1395  8bd9           mov     bx, cx                
  1397  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1402  8bda           mov     bx, dx                
  1404  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1409  8b5efc         mov     bx, word ptr [bp - 4] 
  1412  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1417  93             xchg    bx, ax                
  1418  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1423  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1428  895ef6         mov     word ptr [bp - 0xa], bx
  1431  8b5ef8         mov     bx, word ptr [bp - 8] 
  1434  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  1439  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1444  8b5ef6         mov     bx, word ptr [bp - 0xa]
  1447  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1452  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1457  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1462  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1467  895ef4         mov     word ptr [bp - 0xc], bx
  1470  8bda           mov     bx, dx                
  1472  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1477  8bd9           mov     bx, cx                
  1479  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1484  8bda           mov     bx, dx                
  1486  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1491  93             xchg    bx, ax                
  1492  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1497  8b5ef4         mov     bx, word ptr [bp - 0xc]
  1500  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1505  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1510  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1515  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1520  bbbb00         mov     bx, 0xbb              
  1523  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  1528  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1533  93             xchg    bx, ax                
  1534  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1539  8bd9           mov     bx, cx                
  1541  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1546  8bda           mov     bx, dx                
  1548  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1553  bbf409         mov     bx, 0x9f4             
  1556  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1561  cc             int3                          
  1562  bb0400         mov     bx, 4                 
  1565  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  1570  bb0100         mov     bx, 1                 
  1573  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  1578  cc             int3                          
  1579  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  1584  bbdc09         mov     bx, 0x9dc             
  1587  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1592  bbf009         mov     bx, 0x9f0             
  1595  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1600  8bd3           mov     dx, bx                
  1602  bbe009         mov     bx, 0x9e0             
  1605  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1610  8bcb           mov     cx, bx                
  1612  8bda           mov     bx, dx                
  1614  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1619  8bd9           mov     bx, cx                
  1621  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1626  8bda           mov     bx, dx                
  1628  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1633  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1638  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1643  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1648  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1653  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1658  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1663  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1668  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1673  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1678  8bd9           mov     bx, cx                
  1680  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1685  8bda           mov     bx, dx                
  1687  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1692  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1697  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1702  8bd9           mov     bx, cx                
  1704  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1709  8bda           mov     bx, dx                
  1711  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1716  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1721  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1726  8bd9           mov     bx, cx                
  1728  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1733  8bda           mov     bx, dx                
  1735  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1740  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1745  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1750  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1755  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1760  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1765  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1770  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1775  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1780  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1785  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1790  8bd9           mov     bx, cx                
  1792  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1797  8bda           mov     bx, dx                
  1799  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1804  8bd9           mov     bx, cx                
  1806  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1811  8bda           mov     bx, dx                
  1813  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1818  bbf409         mov     bx, 0x9f4             
  1821  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1826  cc             int3                          
  1827  bb0500         mov     bx, 5                 
  1830  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  1835  bb0100         mov     bx, 1                 
  1838  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  1843  cc             int3                          
  1844  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  1849  bbdc09         mov     bx, 0x9dc             
  1852  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1857  bbf009         mov     bx, 0x9f0             
  1860  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1865  8bd3           mov     dx, bx                
  1867  bbe009         mov     bx, 0x9e0             
  1870  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1875  8bcb           mov     cx, bx                
  1877  8bda           mov     bx, dx                
  1879  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1884  8bd9           mov     bx, cx                
  1886  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1891  8bda           mov     bx, dx                
  1893  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1898  bbd809         mov     bx, 0x9d8             
  1901  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1906  8bc3           mov     ax, bx                
  1908  bbf809         mov     bx, 0x9f8             
  1911  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1916  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1921  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1926  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1931  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1936  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1941  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1946  895efe         mov     word ptr [bp - 2], bx 
  1949  bbfc09         mov     bx, 0x9fc             
  1952  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1957  895efc         mov     word ptr [bp - 4], bx 
  1960  8bda           mov     bx, dx                
  1962  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1967  8bd9           mov     bx, cx                
  1969  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1974  8bda           mov     bx, dx                
  1976  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1981  93             xchg    bx, ax                
  1982  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1987  895efa         mov     word ptr [bp - 6], bx 
  1990  8b5efe         mov     bx, word ptr [bp - 2] 
  1993  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  1998  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2003  895ef8         mov     word ptr [bp - 8], bx 
  2006  bbca00         mov     bx, 0xca              
  2009  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  2014  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2019  8b5ef8         mov     bx, word ptr [bp - 8] 
  2022  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2027  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2032  93             xchg    bx, ax                
  2033  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2038  8bd9           mov     bx, cx                
  2040  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2045  8bda           mov     bx, dx                
  2047  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2052  8b5efa         mov     bx, word ptr [bp - 6] 
  2055  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2060  93             xchg    bx, ax                
  2061  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2066  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2071  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2076  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2081  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2086  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2091  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2096  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2101  8b5efc         mov     bx, word ptr [bp - 4] 
  2104  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2109  8bda           mov     bx, dx                
  2111  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2116  8bd9           mov     bx, cx                
  2118  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2123  8bda           mov     bx, dx                
  2125  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2130  8bd9           mov     bx, cx                
  2132  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2137  8bda           mov     bx, dx                
  2139  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2144  bbf409         mov     bx, 0x9f4             
  2147  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2152  cc             int3                          
  2153  bb0600         mov     bx, 6                 
  2156  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  2161  bb0100         mov     bx, 1                 
  2164  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  2169  cc             int3                          
  2170  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  2175  bbdc09         mov     bx, 0x9dc             
  2178  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2183  bbf009         mov     bx, 0x9f0             
  2186  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2191  8bd3           mov     dx, bx                
  2193  bbe009         mov     bx, 0x9e0             
  2196  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2201  8bcb           mov     cx, bx                
  2203  8bda           mov     bx, dx                
  2205  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2210  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2215  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2220  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2225  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2230  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2235  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2240  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2245  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2250  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2255  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2260  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2265  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2270  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2275  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2280  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2285  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2290  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2295  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2300  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2305  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2310  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2315  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2320  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2325  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2330  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2335  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2340  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2345  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2350  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2355  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2360  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2365  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2370  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2375  8bd9           mov     bx, cx                
  2377  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2382  8bda           mov     bx, dx                
  2384  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2389  bbf409         mov     bx, 0x9f4             
  2392  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2397  cc             int3                          
  2398  bb0700         mov     bx, 7                 
  2401  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  2406  bb0100         mov     bx, 1                 
  2409  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  2414  cc             int3                          
  2415  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  2420  bbdc09         mov     bx, 0x9dc             
  2423  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2428  bbf009         mov     bx, 0x9f0             
  2431  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2436  8bd3           mov     dx, bx                
  2438  bbe009         mov     bx, 0x9e0             
  2441  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2446  8bcb           mov     cx, bx                
  2448  8bda           mov     bx, dx                
  2450  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2455  bbd809         mov     bx, 0x9d8             
  2458  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2463  8bc3           mov     ax, bx                
  2465  bbf809         mov     bx, 0x9f8             
  2468  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2473  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2478  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2483  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2488  895efe         mov     word ptr [bp - 2], bx 
  2491  bbfc09         mov     bx, 0x9fc             
  2494  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2499  895efc         mov     word ptr [bp - 4], bx 
  2502  8bda           mov     bx, dx                
  2504  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2509  93             xchg    bx, ax                
  2510  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2515  895efa         mov     word ptr [bp - 6], bx 
  2518  8b5efe         mov     bx, word ptr [bp - 2] 
  2521  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2526  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2531  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2536  895ef8         mov     word ptr [bp - 8], bx 
  2539  bbbb00         mov     bx, 0xbb              
  2542  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  2547  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2552  93             xchg    bx, ax                
  2553  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2558  8b5efa         mov     bx, word ptr [bp - 6] 
  2561  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2566  8bc3           mov     ax, bx                
  2568  bbc900         mov     bx, 0xc9              
  2571  895ef6         mov     word ptr [bp - 0xa], bx
  2574  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  2579  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2584  8b5ef8         mov     bx, word ptr [bp - 8] 
  2587  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2592  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2597  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2602  895ef4         mov     word ptr [bp - 0xc], bx
  2605  8b5efc         mov     bx, word ptr [bp - 4] 
  2608  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2613  895ef2         mov     word ptr [bp - 0xe], bx
  2616  bbcb00         mov     bx, 0xcb              
  2619  895ef0         mov     word ptr [bp - 0x10], bx
  2622  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  2627  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2632  8b5ef4         mov     bx, word ptr [bp - 0xc]
  2635  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2640  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2645  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2650  895eee         mov     word ptr [bp - 0x12], bx
  2653  8b5ef2         mov     bx, word ptr [bp - 0xe]
  2656  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2661  895eec         mov     word ptr [bp - 0x14], bx
  2664  8b5ef0         mov     bx, word ptr [bp - 0x10]
  2667  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  2672  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2677  8b5eee         mov     bx, word ptr [bp - 0x12]
  2680  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2685  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2690  895eea         mov     word ptr [bp - 0x16], bx
  2693  8bda           mov     bx, dx                
  2695  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2700  93             xchg    bx, ax                
  2701  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2706  895ee8         mov     word ptr [bp - 0x18], bx
  2709  8b5ef6         mov     bx, word ptr [bp - 0xa]
  2712  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  2717  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2722  8b5eea         mov     bx, word ptr [bp - 0x16]
  2725  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2730  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2735  93             xchg    bx, ax                
  2736  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2741  8b5ee8         mov     bx, word ptr [bp - 0x18]
  2744  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2749  8b5eec         mov     bx, word ptr [bp - 0x14]
  2752  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2757  93             xchg    bx, ax                
  2758  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2763  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2768  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2773  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2778  8bda           mov     bx, dx                
  2780  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2785  8bd9           mov     bx, cx                
  2787  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2792  8bda           mov     bx, dx                
  2794  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2799  bbf409         mov     bx, 0x9f4             
  2802  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2807  cc             int3                          
  2808  bb0800         mov     bx, 8                 
  2811  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  2816  bb0100         mov     bx, 1                 
  2819  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  2824  cc             int3                          
  2825  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  2830  bbdc09         mov     bx, 0x9dc             
  2833  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2838  bbf009         mov     bx, 0x9f0             
  2841  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2846  8bd3           mov     dx, bx                
  2848  bbe009         mov     bx, 0x9e0             
  2851  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2856  8bcb           mov     cx, bx                
  2858  8bda           mov     bx, dx                
  2860  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2865  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2870  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2875  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2880  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2885  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2890  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2895  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2900  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2905  bbd809         mov     bx, 0x9d8             
  2908  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2913  bbc900         mov     bx, 0xc9              
  2916  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  2921  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2926  bbfc09         mov     bx, 0x9fc             
  2929  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2934  bbbc00         mov     bx, 0xbc              
  2937  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  2942  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2947  8bda           mov     bx, dx                
  2949  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2954  8bd9           mov     bx, cx                
  2956  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2961  8bda           mov     bx, dx                
  2963  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2968  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2973  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2978  8bd9           mov     bx, cx                
  2980  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2985  8bda           mov     bx, dx                
  2987  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2992  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  2997  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3002  8bd9           mov     bx, cx                
  3004  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3009  8bda           mov     bx, dx                
  3011  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3016  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3021  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3026  8bd9           mov     bx, cx                
  3028  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3033  8bda           mov     bx, dx                
  3035  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3040  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3045  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3050  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3055  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3060  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3065  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3070  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3075  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3080  8bd9           mov     bx, cx                
  3082  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3087  8bda           mov     bx, dx                
  3089  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3094  bbf409         mov     bx, 0x9f4             
  3097  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3102  cc             int3                          
  3103  bb0900         mov     bx, 9                 
  3106  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  3111  bb0100         mov     bx, 1                 
  3114  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  3119  cc             int3                          
  3120  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  3125  bbdc09         mov     bx, 0x9dc             
  3128  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3133  bbf009         mov     bx, 0x9f0             
  3136  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3141  8bd3           mov     dx, bx                
  3143  bbe009         mov     bx, 0x9e0             
  3146  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3151  8bcb           mov     cx, bx                
  3153  8bda           mov     bx, dx                
  3155  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3160  8bd9           mov     bx, cx                
  3162  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3167  8bda           mov     bx, dx                
  3169  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3174  bbd809         mov     bx, 0x9d8             
  3177  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3182  8bc3           mov     ax, bx                
  3184  bbfc09         mov     bx, 0x9fc             
  3187  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3192  895efe         mov     word ptr [bp - 2], bx 
  3195  bbf809         mov     bx, 0x9f8             
  3198  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3203  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3208  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3213  895efc         mov     word ptr [bp - 4], bx 
  3216  8b5efe         mov     bx, word ptr [bp - 2] 
  3219  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3224  bbbb00         mov     bx, 0xbb              
  3227  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  3232  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3237  8bda           mov     bx, dx                
  3239  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3244  8bd9           mov     bx, cx                
  3246  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3251  8bda           mov     bx, dx                
  3253  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3258  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3263  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3268  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3273  8bd9           mov     bx, cx                
  3275  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3280  8bda           mov     bx, dx                
  3282  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3287  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3292  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3297  8bd9           mov     bx, cx                
  3299  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3304  8bda           mov     bx, dx                
  3306  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3311  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3316  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3321  8bd9           mov     bx, cx                
  3323  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3328  8bda           mov     bx, dx                
  3330  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3335  8bd9           mov     bx, cx                
  3337  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3342  8bda           mov     bx, dx                
  3344  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3349  93             xchg    bx, ax                
  3350  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3355  bbc900         mov     bx, 0xc9              
  3358  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  3363  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3368  8b5efc         mov     bx, word ptr [bp - 4] 
  3371  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3376  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3381  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3386  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3391  93             xchg    bx, ax                
  3392  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3397  8bd9           mov     bx, cx                
  3399  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3404  8bda           mov     bx, dx                
  3406  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3411  8bd9           mov     bx, cx                
  3413  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3418  8bda           mov     bx, dx                
  3420  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3425  bbf409         mov     bx, 0x9f4             
  3428  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3433  cc             int3                          
  3434  bb0a00         mov     bx, 0xa               
  3437  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  3442  bb0100         mov     bx, 1                 
  3445  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  3450  cc             int3                          
  3451  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  3456  bbdc09         mov     bx, 0x9dc             
  3459  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3464  bbf009         mov     bx, 0x9f0             
  3467  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3472  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3477  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3482  8bd3           mov     dx, bx                
  3484  bbe009         mov     bx, 0x9e0             
  3487  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3492  8bcb           mov     cx, bx                
  3494  8bda           mov     bx, dx                
  3496  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3501  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3506  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3511  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3516  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3521  8bd9           mov     bx, cx                
  3523  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3528  8bda           mov     bx, dx                
  3530  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3535  8bd9           mov     bx, cx                
  3537  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3542  8bda           mov     bx, dx                
  3544  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3549  8bd9           mov     bx, cx                
  3551  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3556  8bda           mov     bx, dx                
  3558  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3563  bbd809         mov     bx, 0x9d8             
  3566  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3571  bbf809         mov     bx, 0x9f8             
  3574  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3579  8bc3           mov     ax, bx                
  3581  bbca00         mov     bx, 0xca              
  3584  895efe         mov     word ptr [bp - 2], bx 
  3587  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  3592  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3597  93             xchg    bx, ax                
  3598  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3603  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3608  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3613  8bc3           mov     ax, bx                
  3615  bbfc09         mov     bx, 0x9fc             
  3618  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3623  8b5efe         mov     bx, word ptr [bp - 2] 
  3626  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  3631  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3636  93             xchg    bx, ax                
  3637  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3642  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3647  8bda           mov     bx, dx                
  3649  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3654  8bd9           mov     bx, cx                
  3656  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3661  8bda           mov     bx, dx                
  3663  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3668  8bd9           mov     bx, cx                
  3670  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3675  8bda           mov     bx, dx                
  3677  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3682  8bd9           mov     bx, cx                
  3684  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3689  8bda           mov     bx, dx                
  3691  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3696  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3701  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3706  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3711  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3716  8bd9           mov     bx, cx                
  3718  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3723  8bda           mov     bx, dx                
  3725  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3730  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3735  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3740  bbf409         mov     bx, 0x9f4             
  3743  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3748  cc             int3                          
  3749  bb0b00         mov     bx, 0xb               
  3752  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  3757  bb0100         mov     bx, 1                 
  3760  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  3765  cc             int3                          
  3766  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  3771  bb0900         mov     bx, 9                 
  3774  badf00         mov     dx, 0xdf              
  3777  8bcb           mov     cx, bx                
  3779  9a6113ec02     lcall   0x2ec, 0x1361            ; RT#10  
  3784  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3789  bbf009         mov     bx, 0x9f0             
  3792  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3797  8bc3           mov     ax, bx                
  3799  bbe009         mov     bx, 0x9e0             
  3802  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3807  93             xchg    bx, ax                
  3808  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3813  93             xchg    bx, ax                
  3814  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3819  93             xchg    bx, ax                
  3820  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3825  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3830  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3835  93             xchg    bx, ax                
  3836  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3841  93             xchg    bx, ax                
  3842  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3847  93             xchg    bx, ax                
  3848  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3853  93             xchg    bx, ax                
  3854  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3859  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3864  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3869  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3874  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3879  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3884  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3889  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3894  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3899  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3904  93             xchg    bx, ax                
  3905  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3910  93             xchg    bx, ax                
  3911  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3916  93             xchg    bx, ax                
  3917  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3922  93             xchg    bx, ax                
  3923  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3928  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3933  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3938  93             xchg    bx, ax                
  3939  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3944  93             xchg    bx, ax                
  3945  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3950  93             xchg    bx, ax                
  3951  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3956  93             xchg    bx, ax                
  3957  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3962  bbd809         mov     bx, 0x9d8             
  3965  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3970  8bd9           mov     bx, cx                
  3972  9a6113ec02     lcall   0x2ec, 0x1361            ; RT#10  
  3977  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  3982  cc             int3                          
  3983  bb0c00         mov     bx, 0xc               
  3986  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  3991  bb0100         mov     bx, 1                 
  3994  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  3999  cc             int3                          
  4000  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  4005  bbe409         mov     bx, 0x9e4             
  4008  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4013  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4018  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4023  8bd3           mov     dx, bx                
  4025  bbf009         mov     bx, 0x9f0             
  4028  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4033  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4038  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4043  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4048  8bcb           mov     cx, bx                
  4050  bbe009         mov     bx, 0x9e0             
  4053  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4058  8bc3           mov     ax, bx                
  4060  8bd9           mov     bx, cx                
  4062  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4067  93             xchg    bx, ax                
  4068  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4073  93             xchg    bx, ax                
  4074  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4079  93             xchg    bx, ax                
  4080  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4085  93             xchg    bx, ax                
  4086  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4091  93             xchg    bx, ax                
  4092  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4097  93             xchg    bx, ax                
  4098  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4103  93             xchg    bx, ax                
  4104  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4109  93             xchg    bx, ax                
  4110  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4115  bbd809         mov     bx, 0x9d8             
  4118  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4123  895efe         mov     word ptr [bp - 2], bx 
  4126  bbc900         mov     bx, 0xc9              
  4129  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  4134  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4139  bbf809         mov     bx, 0x9f8             
  4142  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4147  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4152  895efc         mov     word ptr [bp - 4], bx 
  4155  8b5efe         mov     bx, word ptr [bp - 2] 
  4158  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4163  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4168  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4173  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4178  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4183  895efa         mov     word ptr [bp - 6], bx 
  4186  8b5efc         mov     bx, word ptr [bp - 4] 
  4189  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4194  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4199  bbbb00         mov     bx, 0xbb              
  4202  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  4207  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4212  8bd9           mov     bx, cx                
  4214  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4219  93             xchg    bx, ax                
  4220  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4225  93             xchg    bx, ax                
  4226  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4231  93             xchg    bx, ax                
  4232  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4237  93             xchg    bx, ax                
  4238  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4243  93             xchg    bx, ax                
  4244  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4249  93             xchg    bx, ax                
  4250  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4255  93             xchg    bx, ax                
  4256  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4261  93             xchg    bx, ax                
  4262  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4267  93             xchg    bx, ax                
  4268  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4273  93             xchg    bx, ax                
  4274  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4279  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4284  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4289  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4294  8b5efa         mov     bx, word ptr [bp - 6] 
  4297  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4302  8bda           mov     bx, dx                
  4304  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4309  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4314  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4319  cc             int3                          
  4320  bb0d00         mov     bx, 0xd               
  4323  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  4328  bb0100         mov     bx, 1                 
  4331  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  4336  cc             int3                          
  4337  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  4342  bb0900         mov     bx, 9                 
  4345  badc00         mov     dx, 0xdc              
  4348  8bcb           mov     cx, bx                
  4350  9a6113ec02     lcall   0x2ec, 0x1361            ; RT#10  
  4355  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4360  bbf009         mov     bx, 0x9f0             
  4363  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4368  8bc3           mov     ax, bx                
  4370  bbe009         mov     bx, 0x9e0             
  4373  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4378  93             xchg    bx, ax                
  4379  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4384  93             xchg    bx, ax                
  4385  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4390  93             xchg    bx, ax                
  4391  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4396  93             xchg    bx, ax                
  4397  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4402  93             xchg    bx, ax                
  4403  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4408  93             xchg    bx, ax                
  4409  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4414  93             xchg    bx, ax                
  4415  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4420  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4425  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4430  93             xchg    bx, ax                
  4431  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4436  895efe         mov     word ptr [bp - 2], bx 
  4439  bb0c00         mov     bx, 0xc               
  4442  8956fc         mov     word ptr [bp - 4], dx 
  4445  bad809         mov     dx, 0x9d8             
  4448  9a6813ec02     lcall   0x2ec, 0x1368            ; RT#17  
  4453  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4458  8b5efe         mov     bx, word ptr [bp - 2] 
  4461  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4466  93             xchg    bx, ax                
  4467  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4472  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4477  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4482  93             xchg    bx, ax                
  4483  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4488  93             xchg    bx, ax                
  4489  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4494  93             xchg    bx, ax                
  4495  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4500  93             xchg    bx, ax                
  4501  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4506  93             xchg    bx, ax                
  4507  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4512  93             xchg    bx, ax                
  4513  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4518  93             xchg    bx, ax                
  4519  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4524  93             xchg    bx, ax                
  4525  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4530  8bda           mov     bx, dx                
  4532  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4537  8bd9           mov     bx, cx                
  4539  8b56fc         mov     dx, word ptr [bp - 4] 
  4542  9a6113ec02     lcall   0x2ec, 0x1361            ; RT#10  
  4547  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4552  cc             int3                          
  4553  bb0e00         mov     bx, 0xe               
  4556  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  4561  bb0100         mov     bx, 1                 
  4564  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  4569  cc             int3                          
  4570  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  4575  bbdc09         mov     bx, 0x9dc             
  4578  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4583  bbf009         mov     bx, 0x9f0             
  4586  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4591  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4596  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4601  8bd3           mov     dx, bx                
  4603  bbe009         mov     bx, 0x9e0             
  4606  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4611  8bcb           mov     cx, bx                
  4613  8bda           mov     bx, dx                
  4615  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4620  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4625  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4630  8bd9           mov     bx, cx                
  4632  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4637  8bda           mov     bx, dx                
  4639  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4644  8bd9           mov     bx, cx                
  4646  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4651  8bda           mov     bx, dx                
  4653  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4658  8bd9           mov     bx, cx                
  4660  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4665  8bda           mov     bx, dx                
  4667  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4672  8bd9           mov     bx, cx                
  4674  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4679  8bda           mov     bx, dx                
  4681  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4686  8bd9           mov     bx, cx                
  4688  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4693  bb0c00         mov     bx, 0xc               
  4696  8bc2           mov     ax, dx                
  4698  bad809         mov     dx, 0x9d8             
  4701  9a6813ec02     lcall   0x2ec, 0x1368            ; RT#17  
  4706  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4711  8bd9           mov     bx, cx                
  4713  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4718  93             xchg    bx, ax                
  4719  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4724  93             xchg    bx, ax                
  4725  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4730  93             xchg    bx, ax                
  4731  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4736  93             xchg    bx, ax                
  4737  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4742  93             xchg    bx, ax                
  4743  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4748  93             xchg    bx, ax                
  4749  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4754  93             xchg    bx, ax                
  4755  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4760  93             xchg    bx, ax                
  4761  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4766  93             xchg    bx, ax                
  4767  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4772  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4777  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4782  93             xchg    bx, ax                
  4783  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4788  93             xchg    bx, ax                
  4789  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4794  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4799  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4804  bbf409         mov     bx, 0x9f4             
  4807  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4812  cc             int3                          
  4813  bb0f00         mov     bx, 0xf               
  4816  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  4821  bb0100         mov     bx, 1                 
  4824  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  4829  cc             int3                          
  4830  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  4835  bbdc09         mov     bx, 0x9dc             
  4838  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4843  bbf009         mov     bx, 0x9f0             
  4846  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4851  8bd3           mov     dx, bx                
  4853  bbe009         mov     bx, 0x9e0             
  4856  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4861  8bcb           mov     cx, bx                
  4863  8bda           mov     bx, dx                
  4865  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4870  8bd9           mov     bx, cx                
  4872  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4877  8bda           mov     bx, dx                
  4879  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4884  8bd9           mov     bx, cx                
  4886  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4891  8bda           mov     bx, dx                
  4893  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4898  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4903  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4908  8bd9           mov     bx, cx                
  4910  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4915  8bda           mov     bx, dx                
  4917  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4922  8bd9           mov     bx, cx                
  4924  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4929  8bda           mov     bx, dx                
  4931  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4936  8bd9           mov     bx, cx                
  4938  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4943  8bda           mov     bx, dx                
  4945  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4950  8bd9           mov     bx, cx                
  4952  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4957  bb0c00         mov     bx, 0xc               
  4960  8bc2           mov     ax, dx                
  4962  bad809         mov     dx, 0x9d8             
  4965  9a6813ec02     lcall   0x2ec, 0x1368            ; RT#17  
  4970  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4975  8bd9           mov     bx, cx                
  4977  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4982  93             xchg    bx, ax                
  4983  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4988  93             xchg    bx, ax                
  4989  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  4994  93             xchg    bx, ax                
  4995  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5000  93             xchg    bx, ax                
  5001  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5006  93             xchg    bx, ax                
  5007  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5012  93             xchg    bx, ax                
  5013  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5018  93             xchg    bx, ax                
  5019  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5024  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5029  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5034  93             xchg    bx, ax                
  5035  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5040  93             xchg    bx, ax                
  5041  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5046  93             xchg    bx, ax                
  5047  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5052  93             xchg    bx, ax                
  5053  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5058  93             xchg    bx, ax                
  5059  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5064  93             xchg    bx, ax                
  5065  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5070  bbf409         mov     bx, 0x9f4             
  5073  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5078  cc             int3                          
  5079  bb1000         mov     bx, 0x10              
  5082  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  5087  bb0100         mov     bx, 1                 
  5090  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  5095  cc             int3                          
  5096  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  5101  bbdc09         mov     bx, 0x9dc             
  5104  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5109  bbf009         mov     bx, 0x9f0             
  5112  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5117  8bd3           mov     dx, bx                
  5119  bbe009         mov     bx, 0x9e0             
  5122  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5127  8bcb           mov     cx, bx                
  5129  8bda           mov     bx, dx                
  5131  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5136  8bd9           mov     bx, cx                
  5138  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5143  8bda           mov     bx, dx                
  5145  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5150  bbd809         mov     bx, 0x9d8             
  5153  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5158  8bc3           mov     ax, bx                
  5160  bbc800         mov     bx, 0xc8              
  5163  895efe         mov     word ptr [bp - 2], bx 
  5166  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  5171  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5176  bbf809         mov     bx, 0x9f8             
  5179  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5184  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5189  895efc         mov     word ptr [bp - 4], bx 
  5192  8bda           mov     bx, dx                
  5194  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5199  8bd9           mov     bx, cx                
  5201  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5206  8bda           mov     bx, dx                
  5208  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5213  8bd9           mov     bx, cx                
  5215  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5220  8bda           mov     bx, dx                
  5222  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5227  8bd9           mov     bx, cx                
  5229  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5234  8bda           mov     bx, dx                
  5236  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5241  93             xchg    bx, ax                
  5242  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5247  895efa         mov     word ptr [bp - 6], bx 
  5250  8b5efe         mov     bx, word ptr [bp - 2] 
  5253  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  5258  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5263  bb0d00         mov     bx, 0xd               
  5266  bafc09         mov     dx, 0x9fc             
  5269  9a6813ec02     lcall   0x2ec, 0x1368            ; RT#17  
  5274  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5279  bbbc00         mov     bx, 0xbc              
  5282  8bd3           mov     dx, bx                
  5284  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  5289  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5294  93             xchg    bx, ax                
  5295  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5300  8bc3           mov     ax, bx                
  5302  8bd9           mov     bx, cx                
  5304  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5309  93             xchg    bx, ax                
  5310  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5315  93             xchg    bx, ax                
  5316  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5321  93             xchg    bx, ax                
  5322  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5327  93             xchg    bx, ax                
  5328  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5333  93             xchg    bx, ax                
  5334  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5339  895ef8         mov     word ptr [bp - 8], bx 
  5342  8b5efa         mov     bx, word ptr [bp - 6] 
  5345  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5350  8b5efc         mov     bx, word ptr [bp - 4] 
  5353  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5358  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5363  8bda           mov     bx, dx                
  5365  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  5370  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5375  8b5ef8         mov     bx, word ptr [bp - 8] 
  5378  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5383  93             xchg    bx, ax                
  5384  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5389  93             xchg    bx, ax                
  5390  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5395  93             xchg    bx, ax                
  5396  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5401  93             xchg    bx, ax                
  5402  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5407  bbf409         mov     bx, 0x9f4             
  5410  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5415  cc             int3                          
  5416  bb1100         mov     bx, 0x11              
  5419  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  5424  bb0100         mov     bx, 1                 
  5427  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  5432  cc             int3                          
  5433  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  5438  bbdc09         mov     bx, 0x9dc             
  5441  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5446  bbf009         mov     bx, 0x9f0             
  5449  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5454  8bd3           mov     dx, bx                
  5456  bbe009         mov     bx, 0x9e0             
  5459  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5464  8bcb           mov     cx, bx                
  5466  8bda           mov     bx, dx                
  5468  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5473  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5478  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5483  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5488  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5493  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5498  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5503  8bd9           mov     bx, cx                
  5505  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5510  8bda           mov     bx, dx                
  5512  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5517  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5522  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5527  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5532  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5537  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5542  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5547  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5552  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5557  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5562  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5567  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5572  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5577  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5582  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5587  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5592  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5597  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5602  8bd9           mov     bx, cx                
  5604  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5609  8bda           mov     bx, dx                
  5611  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5616  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5621  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5626  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5631  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5636  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5641  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5646  8bd9           mov     bx, cx                
  5648  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5653  8bda           mov     bx, dx                
  5655  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5660  bbf409         mov     bx, 0x9f4             
  5663  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5668  cc             int3                          
  5669  bb1200         mov     bx, 0x12              
  5672  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  5677  bb0100         mov     bx, 1                 
  5680  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  5685  cc             int3                          
  5686  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  5691  bbdc09         mov     bx, 0x9dc             
  5694  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5699  bbf009         mov     bx, 0x9f0             
  5702  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5707  8bd3           mov     dx, bx                
  5709  bbe009         mov     bx, 0x9e0             
  5712  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5717  8bcb           mov     cx, bx                
  5719  8bda           mov     bx, dx                
  5721  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5726  bbd809         mov     bx, 0x9d8             
  5729  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5734  8bc3           mov     ax, bx                
  5736  bbf809         mov     bx, 0x9f8             
  5739  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5744  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5749  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5754  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5759  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5764  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5769  895efe         mov     word ptr [bp - 2], bx 
  5772  bbbc00         mov     bx, 0xbc              
  5775  895efc         mov     word ptr [bp - 4], bx 
  5778  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  5783  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5788  8bda           mov     bx, dx                
  5790  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5795  93             xchg    bx, ax                
  5796  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5801  895efa         mov     word ptr [bp - 6], bx 
  5804  bbc800         mov     bx, 0xc8              
  5807  895ef8         mov     word ptr [bp - 8], bx 
  5810  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  5815  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5820  bb1d00         mov     bx, 0x1d              
  5823  bafc09         mov     dx, 0x9fc             
  5826  9a6813ec02     lcall   0x2ec, 0x1368            ; RT#17  
  5831  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5836  8b5efc         mov     bx, word ptr [bp - 4] 
  5839  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  5844  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5849  93             xchg    bx, ax                
  5850  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5855  8bd3           mov     dx, bx                
  5857  8b5efa         mov     bx, word ptr [bp - 6] 
  5860  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5865  8b5ef8         mov     bx, word ptr [bp - 8] 
  5868  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  5873  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5878  8b5efe         mov     bx, word ptr [bp - 2] 
  5881  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5886  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5891  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5896  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5901  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5906  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5911  8bda           mov     bx, dx                
  5913  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5918  8bd9           mov     bx, cx                
  5920  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5925  8bda           mov     bx, dx                
  5927  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5932  bbf409         mov     bx, 0x9f4             
  5935  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5940  cc             int3                          
  5941  bb1300         mov     bx, 0x13              
  5944  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  5949  bb0100         mov     bx, 1                 
  5952  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  5957  cc             int3                          
  5958  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  5963  bbdc09         mov     bx, 0x9dc             
  5966  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5971  bbf009         mov     bx, 0x9f0             
  5974  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5979  8bd3           mov     dx, bx                
  5981  bbe009         mov     bx, 0x9e0             
  5984  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5989  8bcb           mov     cx, bx                
  5991  8bda           mov     bx, dx                
  5993  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  5998  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6003  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6008  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6013  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6018  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6023  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6028  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6033  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6038  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6043  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6048  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6053  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6058  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6063  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6068  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6073  bbd809         mov     bx, 0x9d8             
  6076  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6081  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6086  8bda           mov     bx, dx                
  6088  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6093  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6098  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6103  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6108  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6113  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6118  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6123  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6128  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6133  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6138  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6143  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6148  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6153  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6158  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6163  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6168  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6173  8bd9           mov     bx, cx                
  6175  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6180  8bda           mov     bx, dx                
  6182  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6187  bbf409         mov     bx, 0x9f4             
  6190  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6195  cc             int3                          
  6196  bb1400         mov     bx, 0x14              
  6199  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  6204  bb0100         mov     bx, 1                 
  6207  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  6212  cc             int3                          
  6213  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  6218  bbdc09         mov     bx, 0x9dc             
  6221  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6226  bbf009         mov     bx, 0x9f0             
  6229  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6234  8bd3           mov     dx, bx                
  6236  bbe009         mov     bx, 0x9e0             
  6239  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6244  8bcb           mov     cx, bx                
  6246  8bda           mov     bx, dx                
  6248  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6253  8bd9           mov     bx, cx                
  6255  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6260  8bda           mov     bx, dx                
  6262  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6267  bbd809         mov     bx, 0x9d8             
  6270  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6275  8bc3           mov     ax, bx                
  6277  bbf809         mov     bx, 0x9f8             
  6280  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6285  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6290  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6295  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6300  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6305  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6310  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6315  895efe         mov     word ptr [bp - 2], bx 
  6318  bbfc09         mov     bx, 0x9fc             
  6321  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6326  895efc         mov     word ptr [bp - 4], bx 
  6329  8bda           mov     bx, dx                
  6331  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6336  8bd9           mov     bx, cx                
  6338  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6343  8bda           mov     bx, dx                
  6345  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6350  93             xchg    bx, ax                
  6351  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6356  895efa         mov     word ptr [bp - 6], bx 
  6359  8b5efe         mov     bx, word ptr [bp - 2] 
  6362  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6367  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6372  895ef8         mov     word ptr [bp - 8], bx 
  6375  bbcb00         mov     bx, 0xcb              
  6378  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  6383  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6388  8b5ef8         mov     bx, word ptr [bp - 8] 
  6391  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6396  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6401  93             xchg    bx, ax                
  6402  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6407  8bd9           mov     bx, cx                
  6409  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6414  8bda           mov     bx, dx                
  6416  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6421  8b5efa         mov     bx, word ptr [bp - 6] 
  6424  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6429  93             xchg    bx, ax                
  6430  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6435  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6440  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6445  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6450  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6455  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6460  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6465  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6470  8b5efc         mov     bx, word ptr [bp - 4] 
  6473  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6478  8bda           mov     bx, dx                
  6480  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6485  8bd9           mov     bx, cx                
  6487  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6492  8bda           mov     bx, dx                
  6494  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6499  8bd9           mov     bx, cx                
  6501  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6506  8bda           mov     bx, dx                
  6508  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6513  bbf409         mov     bx, 0x9f4             
  6516  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6521  cc             int3                          
  6522  bb1500         mov     bx, 0x15              
  6525  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  6530  bb0100         mov     bx, 1                 
  6533  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  6538  cc             int3                          
  6539  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  6544  bbdc09         mov     bx, 0x9dc             
  6547  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6552  bbf009         mov     bx, 0x9f0             
  6555  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6560  8bd3           mov     dx, bx                
  6562  bbe009         mov     bx, 0x9e0             
  6565  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6570  8bcb           mov     cx, bx                
  6572  8bda           mov     bx, dx                
  6574  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6579  8bd9           mov     bx, cx                
  6581  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6586  8bda           mov     bx, dx                
  6588  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6593  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6598  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6603  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6608  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6613  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6618  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6623  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6628  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6633  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6638  8bd9           mov     bx, cx                
  6640  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6645  8bda           mov     bx, dx                
  6647  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6652  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6657  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6662  8bd9           mov     bx, cx                
  6664  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6669  8bda           mov     bx, dx                
  6671  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6676  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6681  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6686  8bd9           mov     bx, cx                
  6688  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6693  8bda           mov     bx, dx                
  6695  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6700  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6705  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6710  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6715  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6720  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6725  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6730  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6735  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6740  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6745  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6750  8bd9           mov     bx, cx                
  6752  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6757  8bda           mov     bx, dx                
  6759  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6764  8bd9           mov     bx, cx                
  6766  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6771  8bda           mov     bx, dx                
  6773  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6778  bbf409         mov     bx, 0x9f4             
  6781  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6786  cc             int3                          
  6787  bb1600         mov     bx, 0x16              
  6790  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  6795  bb0100         mov     bx, 1                 
  6798  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  6803  cc             int3                          
  6804  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  6809  bbdc09         mov     bx, 0x9dc             
  6812  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6817  bbf009         mov     bx, 0x9f0             
  6820  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6825  8bd3           mov     dx, bx                
  6827  bbe009         mov     bx, 0x9e0             
  6830  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6835  8bcb           mov     cx, bx                
  6837  8bda           mov     bx, dx                
  6839  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6844  bbd809         mov     bx, 0x9d8             
  6847  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6852  8bc3           mov     ax, bx                
  6854  bbc800         mov     bx, 0xc8              
  6857  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  6862  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6867  bbf809         mov     bx, 0x9f8             
  6870  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6875  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6880  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6885  895efe         mov     word ptr [bp - 2], bx 
  6888  8bda           mov     bx, dx                
  6890  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6895  8bd9           mov     bx, cx                
  6897  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6902  8bda           mov     bx, dx                
  6904  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6909  93             xchg    bx, ax                
  6910  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6915  895efc         mov     word ptr [bp - 4], bx 
  6918  8b5efe         mov     bx, word ptr [bp - 2] 
  6921  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6926  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6931  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6936  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6941  895efa         mov     word ptr [bp - 6], bx 
  6944  bbca00         mov     bx, 0xca              
  6947  895ef8         mov     word ptr [bp - 8], bx 
  6950  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  6955  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6960  8b5efa         mov     bx, word ptr [bp - 6] 
  6963  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6968  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6973  93             xchg    bx, ax                
  6974  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6979  8bd9           mov     bx, cx                
  6981  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6986  8bda           mov     bx, dx                
  6988  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  6993  8b5efc         mov     bx, word ptr [bp - 4] 
  6996  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7001  93             xchg    bx, ax                
  7002  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7007  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7012  895ef6         mov     word ptr [bp - 0xa], bx
  7015  8b5ef8         mov     bx, word ptr [bp - 8] 
  7018  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  7023  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7028  8b5ef6         mov     bx, word ptr [bp - 0xa]
  7031  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7036  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7041  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7046  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7051  895ef4         mov     word ptr [bp - 0xc], bx
  7054  8bda           mov     bx, dx                
  7056  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7061  8bd9           mov     bx, cx                
  7063  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7068  8bda           mov     bx, dx                
  7070  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7075  93             xchg    bx, ax                
  7076  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7081  8b5ef4         mov     bx, word ptr [bp - 0xc]
  7084  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7089  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7094  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7099  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7104  bbbc00         mov     bx, 0xbc              
  7107  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  7112  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7117  93             xchg    bx, ax                
  7118  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7123  8bd9           mov     bx, cx                
  7125  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7130  8bda           mov     bx, dx                
  7132  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7137  bbf409         mov     bx, 0x9f4             
  7140  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7145  cc             int3                          
  7146  bb1700         mov     bx, 0x17              
  7149  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  7154  bb0100         mov     bx, 1                 
  7157  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  7162  cc             int3                          
  7163  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  7168  bbdc09         mov     bx, 0x9dc             
  7171  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7176  bbf009         mov     bx, 0x9f0             
  7179  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7184  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7189  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7194  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7199  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7204  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7209  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7214  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7219  8bd3           mov     dx, bx                
  7221  bbe009         mov     bx, 0x9e0             
  7224  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7229  8bcb           mov     cx, bx                
  7231  8bda           mov     bx, dx                
  7233  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7238  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7243  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7248  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7253  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7258  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7263  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7268  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7273  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7278  8bd9           mov     bx, cx                
  7280  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7285  8bda           mov     bx, dx                
  7287  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7292  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7297  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7302  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7307  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7312  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7317  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7322  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7327  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7332  8bd9           mov     bx, cx                
  7334  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7339  8bda           mov     bx, dx                
  7341  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7346  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7351  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7356  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7361  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7366  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7371  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7376  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7381  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7386  bbf409         mov     bx, 0x9f4             
  7389  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7394  cc             int3                          
  7395  bb1a00         mov     bx, 0x1a              
  7398  9a8b20ec02     lcall   0x2ec, 0x208b            ; RT#6   
  7403  33db           xor     bx, bx                
  7405  9aa520ec02     lcall   0x2ec, 0x20a5            ; RT#7   
  7410  cc             int3                          
  7411  bb0600         mov     bx, 6                 
  7414  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  7419  bb0200         mov     bx, 2                 
  7422  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  7427  cc             int3                          
  7428  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  7433  bbf009         mov     bx, 0x9f0             
  7436  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7441  cc             int3                          
  7442  bb0600         mov     bx, 6                 
  7445  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  7450  bb4c00         mov     bx, 0x4c              
  7453  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  7458  cc             int3                          
  7459  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  7464  bbf009         mov     bx, 0x9f0             
  7467  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7472  cc             int3                          
  7473  bb1300         mov     bx, 0x13              
  7476  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  7481  bb0200         mov     bx, 2                 
  7484  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  7489  cc             int3                          
  7490  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  7495  bbf009         mov     bx, 0x9f0             
  7498  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7503  cc             int3                          
  7504  bb0200         mov     bx, 2                 
  7507  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  7512  bb1e00         mov     bx, 0x1e              
  7515  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  7520  cc             int3                          
  7521  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  7526  bbf009         mov     bx, 0x9f0             
  7529  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7534  cc             int3                          
  7535  bb0200         mov     bx, 2                 
  7538  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  7543  bb3200         mov     bx, 0x32              
  7546  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  7551  cc             int3                          
  7552  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  7557  bbf009         mov     bx, 0x9f0             
  7560  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7565  cc             int3                          
  7566  bb1700         mov     bx, 0x17              
  7569  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  7574  bb1e00         mov     bx, 0x1e              
  7577  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  7582  cc             int3                          
  7583  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  7588  bbf009         mov     bx, 0x9f0             
  7591  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7596  cc             int3                          
  7597  bb1700         mov     bx, 0x17              
  7600  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  7605  bb3200         mov     bx, 0x32              
  7608  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  7613  cc             int3                          
  7614  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  7619  bbf009         mov     bx, 0x9f0             
  7622  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7627  cc             int3                          
  7628  bb1300         mov     bx, 0x13              
  7631  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  7636  bb4c00         mov     bx, 0x4c              
  7639  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  7644  cc             int3                          
  7645  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  7650  bbf009         mov     bx, 0x9f0             
  7653  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7658  cc             int3                          
  7659  bb0c00         mov     bx, 0xc               
  7662  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  7667  bb1200         mov     bx, 0x12              
  7670  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  7675  cc             int3                          
  7676  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  7681  bbf009         mov     bx, 0x9f0             
  7684  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7689  cc             int3                          
  7690  bb0c00         mov     bx, 0xc               
  7693  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  7698  bb3c00         mov     bx, 0x3c              
  7701  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  7706  cc             int3                          
  7707  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  7712  bbf009         mov     bx, 0x9f0             
  7715  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7720  cc             int3                          
  7721  bb0700         mov     bx, 7                 
  7724  9a8b20ec02     lcall   0x2ec, 0x208b            ; RT#6   
  7729  33db           xor     bx, bx                
  7731  9aa520ec02     lcall   0x2ec, 0x20a5            ; RT#7   
  7736  cc             int3                          
  7737  cc             int3                          
  7738  cc             int3                          
  7739  cc             int3                          
  7740  c706000a0300   mov     word ptr [0xa00], 3   
  7746  cc             int3                          
  7747  c706020ad401   mov     word ptr [0xa02], 0x1d4
  7753  cc             int3                          
  7754  c706040a0000   mov     word ptr [0xa04], 0   
  7760  cc             int3                          
  7761  c706d6090200   mov     word ptr [0x9d6], 2   
  7767  e885e3         call    0x1df                 
  7770  a3060a         mov     word ptr [0xa06], ax  
  7773  cc             int3                          
  7774  8b1e060a       mov     bx, word ptr [0xa06]  
  7778  9a430aec02     lcall   0x2ec, 0xa43             ; RT#49  
  7783  cc             int3                          
  7784  bb1900         mov     bx, 0x19              
  7787  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  7792  bb0100         mov     bx, 1                 
  7795  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  7800  cc             int3                          
  7801  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  7806  bb420b         mov     bx, 0xb42                ; = 'dots'
  7809  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1     <<< bx='dots'
  7814  8b1e020a       mov     bx, word ptr [0xa02]  
  7818  9af528ec02     lcall   0x2ec, 0x28f5            ; RT#25  
  7823  cc             int3                          
  7824  bb1900         mov     bx, 0x19              
  7827  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  7832  bb0f00         mov     bx, 0xf               
  7835  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  7840  cc             int3                          
  7841  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  7846  bb0300         mov     bx, 3                 
  7849  ba0100         mov     dx, 1                 
  7852  9a6113ec02     lcall   0x2ec, 0x1361            ; RT#10  
  7857  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  7862  cc             int3                          
  7863  c7064e090100   mov     word ptr [0x94e], 1   
  7869  cc             int3                          
  7870  c7065a090700   mov     word ptr [0x95a], 7   
  7876  cc             int3                          
  7877  c70666091300   mov     word ptr [0x966], 0x13
  7883  cc             int3                          
  7884  c70672091300   mov     word ptr [0x972], 0x13
  7890  cc             int3                          
  7891  c7067e092000   mov     word ptr [0x97e], 0x20
  7897  cc             int3                          
  7898  c7068a090000   mov     word ptr [0x98a], 0   
  7904  cc             int3                          
  7905  c70696090000   mov     word ptr [0x996], 0   
  7911  cc             int3                          
  7912  c706a2090000   mov     word ptr [0x9a2], 0   
  7918  cc             int3                          
  7919  c706ae090000   mov     word ptr [0x9ae], 0   
  7925  cc             int3                          
  7926  c706ba090000   mov     word ptr [0x9ba], 0   
  7932  cc             int3                          
  7933  b80200         mov     ax, 2                 
  7936  e9da00         jmp     0x1fdd                
  7939  cc             int3                          
  7940  8b1ece09       mov     bx, word ptr [0x9ce]  
  7944  8bd3           mov     dx, bx                
  7946  43             inc     bx                    
  7947  8bfa           mov     di, dx                
  7949  d1e7           shl     di, 1                 
  7951  899d4c09       mov     word ptr [di + 0x94c], bx
  7955  cc             int3                          
  7956  8b3ece09       mov     di, word ptr [0x9ce]  
  7960  d1e7           shl     di, 1                 
  7962  c78558090700   mov     word ptr [di + 0x958], 7
  7968  cc             int3                          
  7969  8b3ece09       mov     di, word ptr [0x9ce]  
  7973  d1e7           shl     di, 1                 
  7975  c78564090e00   mov     word ptr [di + 0x964], 0xe
  7981  cc             int3                          
  7982  8b1ece09       mov     bx, word ptr [0x9ce]  
  7986  8bd3           mov     dx, bx                
  7988  83c310         add     bx, 0x10              
  7991  8bfa           mov     di, dx                
  7993  d1e7           shl     di, 1                 
  7995  899d7009       mov     word ptr [di + 0x970], bx
  7999  cc             int3                          
  8000  8b3ece09       mov     di, word ptr [0x9ce]  
  8004  d1e7           shl     di, 1                 
  8006  c7857c092000   mov     word ptr [di + 0x97c], 0x20
  8012  cc             int3                          
  8013  bb4a0b         mov     bx, 0xb4a             
  8016  9ac109ec02     lcall   0x2ec, 0x9c1             ; RT#18  
  8021  9a0227ec02     lcall   0x2ec, 0x2702            ; RT#15  
  8026  93             xchg    bx, ax                
  8027  a3d209         mov     word ptr [0x9d2], ax  
  8030  cc             int3                          
  8031  833ed20900     cmp     word ptr [0x9d2], 0   
  8036  7403           je      0x1f69                
  8038  e90700         jmp     0x1f70                
  8041  cc             int3                          
  8042  c706d209ffff   mov     word ptr [0x9d2], 0xffff
  8048  cc             int3                          
  8049  8b3ece09       mov     di, word ptr [0x9ce]  
  8053  d1e7           shl     di, 1                 
  8055  c78588090000   mov     word ptr [di + 0x988], 0
  8061  cc             int3                          
  8062  bb4a0b         mov     bx, 0xb4a             
  8065  9ac109ec02     lcall   0x2ec, 0x9c1             ; RT#18  
  8070  9a0227ec02     lcall   0x2ec, 0x2702            ; RT#15  
  8075  8b3ece09       mov     di, word ptr [0x9ce]  
  8079  d1e7           shl     di, 1                 
  8081  899d9409       mov     word ptr [di + 0x994], bx
  8085  cc             int3                          
  8086  8b3ece09       mov     di, word ptr [0x9ce]  
  8090  d1e7           shl     di, 1                 
  8092  b80100         mov     ax, 1                 
  8095  2b859409       sub     ax, word ptr [di + 0x994]
  8099  f72ed209       imul    word ptr [0x9d2]      
  8103  8985a009       mov     word ptr [di + 0x9a0], ax
  8107  cc             int3                          
  8108  8b3ece09       mov     di, word ptr [0x9ce]  
  8112  d1e7           shl     di, 1                 
  8114  8b859409       mov     ax, word ptr [di + 0x994]
  8118  f72ed209       imul    word ptr [0x9d2]      
  8122  89859409       mov     word ptr [di + 0x994], ax
  8126  cc             int3                          
  8127  8b3ece09       mov     di, word ptr [0x9ce]  
  8131  d1e7           shl     di, 1                 
  8133  c785ac090000   mov     word ptr [di + 0x9ac], 0
  8139  cc             int3                          
  8140  8b3ece09       mov     di, word ptr [0x9ce]  
  8144  d1e7           shl     di, 1                 
  8146  c785b8090000   mov     word ptr [di + 0x9b8], 0
  8152  cc             int3                          
  8153  a1ce09         mov     ax, word ptr [0x9ce]  
  8156  40             inc     ax                    
  8157  a3ce09         mov     word ptr [0x9ce], ax  
  8160  833ece0905     cmp     word ptr [0x9ce], 5   
  8165  7f03           jg      0x1fea                
  8167  e919ff         jmp     0x1f03                
  8170  cc             int3                          
  8171  cc             int3                          
  8172  cc             int3                          
  8173  bb0b00         mov     bx, 0xb               
  8176  9aac17ec02     lcall   0x2ec, 0x17ac            ; RT#19  
  8181  cc             int3                          
  8182  bb0c00         mov     bx, 0xc               
  8185  9aac17ec02     lcall   0x2ec, 0x17ac            ; RT#19  
  8190  cc             int3                          
  8191  bb0d00         mov     bx, 0xd               
  8194  9aac17ec02     lcall   0x2ec, 0x17ac            ; RT#19  
  8199  cc             int3                          
  8200  bb0e00         mov     bx, 0xe               
  8203  9aac17ec02     lcall   0x2ec, 0x17ac            ; RT#19  
  8208  cc             int3                          
  8209  bb0b00         mov     bx, 0xb               
  8212  ba4420         mov     dx, 0x2044            
  8215  9a7017ec02     lcall   0x2ec, 0x1770            ; RT#20  
  8220  cc             int3                          
  8221  bb0c00         mov     bx, 0xc               
  8224  ba5820         mov     dx, 0x2058            
  8227  9a7017ec02     lcall   0x2ec, 0x1770            ; RT#20  
  8232  cc             int3                          
  8233  bb0d00         mov     bx, 0xd               
  8236  ba6c20         mov     dx, 0x206c            
  8239  9a7017ec02     lcall   0x2ec, 0x1770            ; RT#20  
  8244  cc             int3                          
  8245  bb0e00         mov     bx, 0xe               
  8248  ba8020         mov     dx, 0x2080            
  8251  9a7017ec02     lcall   0x2ec, 0x1770            ; RT#20  
  8256  cc             int3                          
  8257  e95300         jmp     0x2097                
  8260  cc             int3                          
  8261  c706ae09ffff   mov     word ptr [0x9ae], 0xffff
  8267  cc             int3                          
  8268  c706ba090000   mov     word ptr [0x9ba], 0   
  8274  cc             int3                          
  8275  9aae11ec02     lcall   0x2ec, 0x11ae            ; RT#11  
  8280  cc             int3                          
  8281  c706ae090000   mov     word ptr [0x9ae], 0   
  8287  cc             int3                          
  8288  c706ba09ffff   mov     word ptr [0x9ba], 0xffff
  8294  cc             int3                          
  8295  9aae11ec02     lcall   0x2ec, 0x11ae            ; RT#11  
  8300  cc             int3                          
  8301  c706ae090000   mov     word ptr [0x9ae], 0   
  8307  cc             int3                          
  8308  c706ba090100   mov     word ptr [0x9ba], 1   
  8314  cc             int3                          
  8315  9aae11ec02     lcall   0x2ec, 0x11ae            ; RT#11  
  8320  cc             int3                          
  8321  c706ae090100   mov     word ptr [0x9ae], 1   
  8327  cc             int3                          
  8328  c706ba090000   mov     word ptr [0x9ba], 0   
  8334  cc             int3                          
  8335  9aae11ec02     lcall   0x2ec, 0x11ae            ; RT#11  
  8340  cc             int3                          
  8341  cc             int3                          
  8342  cc             int3                          
  8343  cc             int3                          
  8344  9a8511ec02     lcall   0x2ec, 0x1185            ; RT#26  
  8349  91             xchg    cx, ax                
  8350  2ecc           int3                          
  8352  9a8511ec02     lcall   0x2ec, 0x1185            ; RT#26  
  8358  20cc           and     ah, cl                
  8360  c706d6090200   mov     word ptr [0x9d6], 2   
  8366  e82ee1         call    0x1df                 
  8369  2b06060a       sub     ax, word ptr [0xa06]  
  8373  a3080a         mov     word ptr [0xa08], ax  
  8376  cc             int3                          
  8377  833e080a01     cmp     word ptr [0xa08], 1   
  8382  7e03           jle     0x20c3                
  8384  e90700         jmp     0x20ca                
  8387  cc             int3                          
  8388  c706080a0100   mov     word ptr [0xa08], 1   
  8394  cc             int3                          
  8395  a1080a         mov     ax, word ptr [0xa08]  
  8398  a30a0a         mov     word ptr [0xa0a], ax  
  8401  b80100         mov     ax, 1                 
  8404  e90f00         jmp     0x20e6                
  8407  cc             int3                          
  8408  9a8511ec02     lcall   0x2ec, 0x1185            ; RT#26  
  8413  92             xchg    dx, ax                
  8414  28cc           sub     ah, cl                
  8416  a1d409         mov     ax, word ptr [0x9d4]  
  8419  05b400         add     ax, 0xb4              
  8422  a3d409         mov     word ptr [0x9d4], ax  
  8425  a10a0a         mov     ax, word ptr [0xa0a]  
  8428  3b06d409       cmp     ax, word ptr [0x9d4]  
  8432  7de5           jge     0x20d7                
  8434  cc             int3                          
  8435  e9a1ff         jmp     0x2097                
  8438  cc             int3                          
  8439  cc             int3                          
  8440  cc             int3                          
  8441  cc             int3                          
  8442  cc             int3                          
  8443  cc             int3                          
  8444  cc             int3                          
  8445  cc             int3                          
  8446  cc             int3                          
  8447  a1ae09         mov     ax, word ptr [0x9ae]  
  8450  03066609       add     ax, word ptr [0x966]  
  8454  a3ca09         mov     word ptr [0x9ca], ax  
  8457  cc             int3                          
  8458  a1ba09         mov     ax, word ptr [0x9ba]  
  8461  03067209       add     ax, word ptr [0x972]  
  8465  a3cc09         mov     word ptr [0x9cc], ax  
  8468  cc             int3                          
  8469  a1cc09         mov     ax, word ptr [0x9cc]  
  8472  03c0           add     ax, ax                
  8474  40             inc     ax                    
  8475  92             xchg    dx, ax                
  8476  8b1eca09       mov     bx, word ptr [0x9ca]  
  8480  b9ff7f         mov     cx, 0x7fff            
  8483  9ac023ec02     lcall   0x2ec, 0x23c0            ; RT#9   
  8488  93             xchg    bx, ax                
  8489  a3c809         mov     word ptr [0x9c8], ax  
  8492  cc             int3                          
  8493  833ec80920     cmp     word ptr [0x9c8], 0x20
  8498  7503           jne     0x2137                
  8500  e93f01         jmp     0x2276                
  8503  cc             int3                          
  8504  813ec809f900   cmp     word ptr [0x9c8], 0xf9
  8510  7503           jne     0x2143                
  8512  e93301         jmp     0x2276                
  8515  cc             int3                          
  8516  833ec80902     cmp     word ptr [0x9c8], 2   
  8521  7f03           jg      0x214e                
  8523  e90b00         jmp     0x2159                
  8526  cc             int3                          
  8527  833ec80907     cmp     word ptr [0x9c8], 7   
  8532  7d03           jge     0x2159                
  8534  e9dc02         jmp     0x2435                
  8537  cc             int3                          
  8538  833eca090c     cmp     word ptr [0x9ca], 0xc 
  8543  7403           je      0x2164                
  8545  e94600         jmp     0x21aa                
  8548  cc             int3                          
  8549  813ec809c400   cmp     word ptr [0x9c8], 0xc4
  8555  7403           je      0x2170                
  8557  e93a00         jmp     0x21aa                
  8560  cc             int3                          
  8561  b82700         mov     ax, 0x27              
  8564  2b067209       sub     ax, word ptr [0x972]  
  8568  a3cc09         mov     word ptr [0x9cc], ax  
  8571  cc             int3                          
  8572  a1cc09         mov     ax, word ptr [0x9cc]  
  8575  03c0           add     ax, ax                
  8577  40             inc     ax                    
  8578  92             xchg    dx, ax                
  8579  8b1eca09       mov     bx, word ptr [0x9ca]  
  8583  b9ff7f         mov     cx, 0x7fff            
  8586  9ac023ec02     lcall   0x2ec, 0x23c0            ; RT#9   
  8591  93             xchg    bx, ax                
  8592  a3c809         mov     word ptr [0x9c8], ax  
  8595  cc             int3                          
  8596  833ec80920     cmp     word ptr [0x9c8], 0x20
  8601  7503           jne     0x219e                
  8603  e9d800         jmp     0x2276                
  8606  cc             int3                          
  8607  813ec809f900   cmp     word ptr [0x9c8], 0xf9
  8613  7503           jne     0x21aa                
  8615  e9cc00         jmp     0x2276                
  8618  cc             int3                          
  8619  a19609         mov     ax, word ptr [0x996]  
  8622  03066609       add     ax, word ptr [0x966]  
  8626  a3ca09         mov     word ptr [0x9ca], ax  
  8629  cc             int3                          
  8630  a1a209         mov     ax, word ptr [0x9a2]  
  8633  03067209       add     ax, word ptr [0x972]  
  8637  a3cc09         mov     word ptr [0x9cc], ax  
  8640  cc             int3                          
  8641  a1cc09         mov     ax, word ptr [0x9cc]  
  8644  03c0           add     ax, ax                
  8646  40             inc     ax                    
  8647  92             xchg    dx, ax                
  8648  8b1eca09       mov     bx, word ptr [0x9ca]  
  8652  b9ff7f         mov     cx, 0x7fff            
  8655  9ac023ec02     lcall   0x2ec, 0x23c0            ; RT#9   
  8660  93             xchg    bx, ax                
  8661  a3c809         mov     word ptr [0x9c8], ax  
  8664  cc             int3                          
  8665  833ec80920     cmp     word ptr [0x9c8], 0x20
  8670  7503           jne     0x21e3                
  8672  e9a100         jmp     0x2284                
  8675  cc             int3                          
  8676  813ec809f900   cmp     word ptr [0x9c8], 0xf9
  8682  7503           jne     0x21ef                
  8684  e99500         jmp     0x2284                
  8687  cc             int3                          
  8688  833ec80902     cmp     word ptr [0x9c8], 2   
  8693  7f03           jg      0x21fa                
  8695  e90b00         jmp     0x2205                
  8698  cc             int3                          
  8699  833ec80907     cmp     word ptr [0x9c8], 7   
  8704  7d03           jge     0x2205                
  8706  e93002         jmp     0x2435                
  8709  cc             int3                          
  8710  833eca090c     cmp     word ptr [0x9ca], 0xc 
  8715  7403           je      0x2210                
  8717  e94600         jmp     0x2256                
  8720  cc             int3                          
  8721  813ec809c400   cmp     word ptr [0x9c8], 0xc4
  8727  7403           je      0x221c                
  8729  e93a00         jmp     0x2256                
  8732  cc             int3                          
  8733  b82700         mov     ax, 0x27              
  8736  2b067209       sub     ax, word ptr [0x972]  
  8740  a3cc09         mov     word ptr [0x9cc], ax  
  8743  cc             int3                          
  8744  a1cc09         mov     ax, word ptr [0x9cc]  
  8747  03c0           add     ax, ax                
  8749  40             inc     ax                    
  8750  92             xchg    dx, ax                
  8751  8b1eca09       mov     bx, word ptr [0x9ca]  
  8755  b9ff7f         mov     cx, 0x7fff            
  8758  9ac023ec02     lcall   0x2ec, 0x23c0            ; RT#9   
  8763  93             xchg    bx, ax                
  8764  a3c809         mov     word ptr [0x9c8], ax  
  8767  cc             int3                          
  8768  833ec80920     cmp     word ptr [0x9c8], 0x20
  8773  7503           jne     0x224a                
  8775  e93a00         jmp     0x2284                
  8778  cc             int3                          
  8779  813ec809f900   cmp     word ptr [0x9c8], 0xf9
  8785  7503           jne     0x2256                
  8787  e92e00         jmp     0x2284                
  8790  cc             int3                          
  8791  c70696090000   mov     word ptr [0x996], 0   
  8797  cc             int3                          
  8798  c706a2090000   mov     word ptr [0x9a2], 0   
  8804  cc             int3                          
  8805  bba00f         mov     bx, 0xfa0             
  8808  ba4e0b         mov     dx, 0xb4e             
  8811  9aba1eec02     lcall   0x2ec, 0x1eba            ; RT#36  
  8816  cc             int3                          
  8817  9aae11ec02     lcall   0x2ec, 0x11ae            ; RT#11  
  8822  cc             int3                          
  8823  a1ae09         mov     ax, word ptr [0x9ae]  
  8826  a39609         mov     word ptr [0x996], ax  
  8829  cc             int3                          
  8830  a1ba09         mov     ax, word ptr [0x9ba]  
  8833  a3a209         mov     word ptr [0x9a2], ax  
  8836  cc             int3                          
  8837  a1cc09         mov     ax, word ptr [0x9cc]  
  8840  03c0           add     ax, ax                
  8842  40             inc     ax                    
  8843  92             xchg    dx, ax                
  8844  8b1eca09       mov     bx, word ptr [0x9ca]  
  8848  b90100         mov     cx, 1                 
  8851  9ac023ec02     lcall   0x2ec, 0x23c0            ; RT#9   
  8856  83fb07         cmp     bx, 7                 
  8859  7f03           jg      0x22a0                
  8861  e97500         jmp     0x2315                
  8864  cc             int3                          
  8865  bb3809         mov     bx, 0x938             
  8868  9a9d24ec02     lcall   0x2ec, 0x249d            ; RT#14  
  8873  cc             int3                          
  8874  8b1e020a       mov     bx, word ptr [0xa02]  
  8878  9a6f26ec02     lcall   0x2ec, 0x266f            ; RT#16  
  8883  bf520b         mov     di, 0xb52             
  8886  9ad701ec02     lcall   0x2ec, 0x1d7             ; RT#50  
  8891  bf560b         mov     di, 0xb56             
  8894  9a1f00ec02     lcall   0x2ec, 0x1f              ; RT#51  
  8899  a1000a         mov     ax, word ptr [0xa00]  
  8902  f7e8           imul    ax                    
  8904  93             xchg    bx, ax                
  8905  9a2b03ec02     lcall   0x2ec, 0x32b             ; RT#37  
  8910  839a6f26ec     sbb     word ptr [bp + si + 0x266f], -0x14
  8915  029adc01       add     bl, byte ptr [bp + si + 0x1dc]
  8919  ec             in      al, dx                
  8920  02839a02       add     al, byte ptr [bp + di + 0x29a]
  8924  27             daa                           
  8925  ec             in      al, dx                
  8926  0293a3c4       add     dl, byte ptr [bp + di - 0x3b5d]
  8930  09cc           or      sp, cx                
  8932  b80200         mov     ax, 2                 
  8935  e92100         jmp     0x230b                
  8938  cc             int3                          
  8939  8b3ece09       mov     di, word ptr [0x9ce]  
  8943  d1e7           shl     di, 1                 
  8945  c78558091a00   mov     word ptr [di + 0x958], 0x1a
  8951  cc             int3                          
  8952  8b3ece09       mov     di, word ptr [0x9ce]  
  8956  d1e7           shl     di, 1                 
  8958  8b1ec409       mov     bx, word ptr [0x9c4]  
  8962  899d8809       mov     word ptr [di + 0x988], bx
  8966  cc             int3                          
  8967  a1ce09         mov     ax, word ptr [0x9ce]  
  8970  40             inc     ax                    
  8971  a3ce09         mov     word ptr [0x9ce], ax  
  8974  833ece0905     cmp     word ptr [0x9ce], 5   
  8979  7ed5           jle     0x22ea                
  8981  cc             int3                          
  8982  8b1e6609       mov     bx, word ptr [0x966]  
  8986  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  8991  8b1e7209       mov     bx, word ptr [0x972]  
  8995  d1e3           shl     bx, 1                 
  8997  43             inc     bx                    
  8998  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  9003  cc             int3                          
  9004  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  9009  8b1e7e09       mov     bx, word ptr [0x97e]  
  9013  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  9018  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  9023  cc             int3                          
  9024  8b1eca09       mov     bx, word ptr [0x9ca]  
  9028  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  9033  a1cc09         mov     ax, word ptr [0x9cc]  
  9036  03c0           add     ax, ax                
  9038  40             inc     ax                    
  9039  93             xchg    bx, ax                
  9040  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  9045  cc             int3                          
  9046  8b1e5a09       mov     bx, word ptr [0x95a]  
  9050  9a8b20ec02     lcall   0x2ec, 0x208b            ; RT#6   
  9055  33db           xor     bx, bx                
  9057  9aa520ec02     lcall   0x2ec, 0x20a5            ; RT#7   
  9062  cc             int3                          
  9063  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  9068  8b1e4e09       mov     bx, word ptr [0x94e]  
  9072  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  9077  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  9082  cc             int3                          
  9083  bb0700         mov     bx, 7                 
  9086  9a8b20ec02     lcall   0x2ec, 0x208b            ; RT#6   
  9091  33db           xor     bx, bx                
  9093  9aa520ec02     lcall   0x2ec, 0x20a5            ; RT#7   
  9098  cc             int3                          
  9099  c7067e092000   mov     word ptr [0x97e], 0x20
  9105  cc             int3                          
  9106  a1ca09         mov     ax, word ptr [0x9ca]  
  9109  a36609         mov     word ptr [0x966], ax  
  9112  cc             int3                          
  9113  a1cc09         mov     ax, word ptr [0x9cc]  
  9116  a37209         mov     word ptr [0x972], ax  
  9119  cc             int3                          
  9120  813ec809f900   cmp     word ptr [0x9c8], 0xf9
  9126  7403           je      0x23ab                
  9128  e94000         jmp     0x23eb                
  9131  cc             int3                          
  9132  833e020a00     cmp     word ptr [0xa02], 0   
  9137  7f03           jg      0x23b6                
  9139  e93500         jmp     0x23eb                
  9142  cc             int3                          
  9143  a1020a         mov     ax, word ptr [0xa02]  
  9146  48             dec     ax                    
  9147  a3020a         mov     word ptr [0xa02], ax  
  9150  cc             int3                          
  9151  bb1900         mov     bx, 0x19              
  9154  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  9159  bb0500         mov     bx, 5                 
  9162  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  9167  cc             int3                          
  9168  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  9173  8b1e020a       mov     bx, word ptr [0xa02]  
  9177  9af528ec02     lcall   0x2ec, 0x28f5            ; RT#25  
  9182  cc             int3                          
  9183  bb3409         mov     bx, 0x934             
  9186  9a9d24ec02     lcall   0x2ec, 0x249d            ; RT#14  
  9191  cc             int3                          
  9192  e90c00         jmp     0x23f7                
  9195  cc             int3                          
  9196  bb9600         mov     bx, 0x96              
  9199  ba5a0b         mov     dx, 0xb5a             
  9202  9aba1eec02     lcall   0x2ec, 0x1eba            ; RT#36  
  9207  cc             int3                          
  9208  833e020a01     cmp     word ptr [0xa02], 1   
  9213  7c03           jl      0x2402                
  9215  e90400         jmp     0x2406                
  9218  cc             int3                          
  9219  e94d09         jmp     0x2d53                
  9222  cc             int3                          
  9223  833e020a32     cmp     word ptr [0xa02], 0x32
  9228  7c03           jl      0x2411                
  9230  e91b00         jmp     0x242c                
  9233  cc             int3                          
  9234  8b1e040a       mov     bx, word ptr [0xa04]  
  9238  9a6f26ec02     lcall   0x2ec, 0x266f            ; RT#16  
  9243  bf5e0b         mov     di, 0xb5e             
  9246  9a5701ec02     lcall   0x2ec, 0x157             ; RT#38  
  9251  9a0227ec02     lcall   0x2ec, 0x2702            ; RT#15  
  9256  93             xchg    bx, ax                
  9257  a3040a         mov     word ptr [0xa04], ax  
  9260  cc             int3                          
  9261  9aae11ec02     lcall   0x2ec, 0x11ae            ; RT#11  
  9266  cc             int3                          
  9267  cc             int3                          
  9268  cc             int3                          
  9269  cc             int3                          
  9270  a1cc09         mov     ax, word ptr [0x9cc]  
  9273  03c0           add     ax, ax                
  9275  40             inc     ax                    
  9276  92             xchg    dx, ax                
  9277  8b1eca09       mov     bx, word ptr [0x9ca]  
  9281  b90100         mov     cx, 1                 
  9284  9ac023ec02     lcall   0x2ec, 0x23c0            ; RT#9   
  9289  83fb07         cmp     bx, 7                 
  9292  7e03           jle     0x2451                
  9294  e91502         jmp     0x2666                
  9297  cc             int3                          
  9298  bb620b         mov     bx, 0xb62                ; = 'mbl8t255o4fego3abcdefgo0l1g-g'
  9301  9a9d24ec02     lcall   0x2ec, 0x249d            ; RT#14    <<< bx='mbl8t255o4fego3abcdefgo0l1g-g'
  9306  cc             int3                          
  9307  8b1e6609       mov     bx, word ptr [0x966]  
  9311  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  9316  8b1e7209       mov     bx, word ptr [0x972]  
  9320  d1e3           shl     bx, 1                 
  9322  43             inc     bx                    
  9323  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  9328  cc             int3                          
  9329  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  9334  8b1e7e09       mov     bx, word ptr [0x97e]  
  9338  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  9343  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  9348  cc             int3                          
  9349  bb1a00         mov     bx, 0x1a              
  9352  9a8b20ec02     lcall   0x2ec, 0x208b            ; RT#6   
  9357  33db           xor     bx, bx                
  9359  9aa520ec02     lcall   0x2ec, 0x20a5            ; RT#7   
  9364  cc             int3                          
  9365  b80100         mov     ax, 1                 
  9368  e92e00         jmp     0x24c9                
  9371  cc             int3                          
  9372  8b1eca09       mov     bx, word ptr [0x9ca]  
  9376  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  9381  a1cc09         mov     ax, word ptr [0x9cc]  
  9384  03c0           add     ax, ax                
  9386  40             inc     ax                    
  9387  93             xchg    bx, ax                
  9388  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  9393  cc             int3                          
  9394  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  9399  bba800         mov     bx, 0xa8              
  9402  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  9407  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  9412  cc             int3                          
  9413  a1ce09         mov     ax, word ptr [0x9ce]  
  9416  40             inc     ax                    
  9417  a3ce09         mov     word ptr [0x9ce], ax  
  9420  813ece09c800   cmp     word ptr [0x9ce], 0xc8
  9426  7ec7           jle     0x249b                
  9428  cc             int3                          
  9429  813e020a2c01   cmp     word ptr [0xa02], 0x12c
  9435  7f03           jg      0x24e0                
  9437  e92000         jmp     0x2500                
  9440  cc             int3                          
  9441  8b1e040a       mov     bx, word ptr [0xa04]  
  9445  9a6f26ec02     lcall   0x2ec, 0x266f            ; RT#16  
  9450  bf5a0b         mov     di, 0xb5a             
  9453  9aae0eec02     lcall   0x2ec, 0xeae             ; RT#53  
  9458  7203           jb      0x24f7                
  9460  e90900         jmp     0x2500                
  9463  cc             int3                          
  9464  a1040a         mov     ax, word ptr [0xa04]  
  9467  03c0           add     ax, ax                
  9469  a3040a         mov     word ptr [0xa04], ax  
  9472  cc             int3                          
  9473  bb0700         mov     bx, 7                 
  9476  9a8b20ec02     lcall   0x2ec, 0x208b            ; RT#6   
  9481  33db           xor     bx, bx                
  9483  9aa520ec02     lcall   0x2ec, 0x20a5            ; RT#7   
  9488  cc             int3                          
  9489  833e000a01     cmp     word ptr [0xa00], 1   
  9494  7f03           jg      0x251b                
  9496  e95200         jmp     0x256d                
  9499  cc             int3                          
  9500  a1000a         mov     ax, word ptr [0xa00]  
  9503  48             dec     ax                    
  9504  a3000a         mov     word ptr [0xa00], ax  
  9507  cc             int3                          
  9508  bb1900         mov     bx, 0x19              
  9511  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  9516  bb0f00         mov     bx, 0xf               
  9519  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  9524  cc             int3                          
  9525  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  9530  8b1e000a       mov     bx, word ptr [0xa00]  
  9534  ba0100         mov     dx, 1                 
  9537  9a6113ec02     lcall   0x2ec, 0x1361            ; RT#10  
  9542  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  9547  bbd809         mov     bx, 0x9d8             
  9550  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  9555  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  9560  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  9565  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  9570  bb460a         mov     bx, 0xa46             
  9573  9ae628ec02     lcall   0x2ec, 0x28e6            ; RT#54  
  9578  e90300         jmp     0x2570                
  9581  e94c08         jmp     0x2dbc                
  9584  cc             int3                          
  9585  b80100         mov     ax, 1                 
  9588  e9c000         jmp     0x2637                
  9591  cc             int3                          
  9592  8b3ece09       mov     di, word ptr [0x9ce]  
  9596  d1e7           shl     di, 1                 
  9598  8b9d6409       mov     bx, word ptr [di + 0x964]
  9602  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  9607  8b9d7009       mov     bx, word ptr [di + 0x970]
  9611  d1e3           shl     bx, 1                 
  9613  43             inc     bx                    
  9614  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  9619  cc             int3                          
  9620  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  9625  8b3ece09       mov     di, word ptr [0x9ce]  
  9629  d1e7           shl     di, 1                 
  9631  8b9d7c09       mov     bx, word ptr [di + 0x97c]
  9635  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  9640  9a0e29ec02     lcall   0x2ec, 0x290e            ; RT#39  
  9645  cc             int3                          
  9646  8b3ece09       mov     di, word ptr [0x9ce]  
  9650  d1e7           shl     di, 1                 
  9652  c7857c092000   mov     word ptr [di + 0x97c], 0x20
  9658  cc             int3                          
  9659  8b3ece09       mov     di, word ptr [0x9ce]  
  9663  d1e7           shl     di, 1                 
  9665  c78558090700   mov     word ptr [di + 0x958], 7
  9671  cc             int3                          
  9672  8b3ece09       mov     di, word ptr [0x9ce]  
  9676  d1e7           shl     di, 1                 
  9678  c78564090e00   mov     word ptr [di + 0x964], 0xe
  9684  cc             int3                          
  9685  8b1ece09       mov     bx, word ptr [0x9ce]  
  9689  8bd3           mov     dx, bx                
  9691  83c311         add     bx, 0x11              
  9694  8bfa           mov     di, dx                
  9696  d1e7           shl     di, 1                 
  9698  899d7009       mov     word ptr [di + 0x970], bx
  9702  cc             int3                          
  9703  8b3ece09       mov     di, word ptr [0x9ce]  
  9707  d1e7           shl     di, 1                 
  9709  c78588090000   mov     word ptr [di + 0x988], 0
  9715  cc             int3                          
  9716  833ece0901     cmp     word ptr [0x9ce], 1   
  9721  7403           je      0x25fe                
  9723  e91a00         jmp     0x2618                
  9726  cc             int3                          
  9727  8b3ece09       mov     di, word ptr [0x9ce]  
  9731  d1e7           shl     di, 1                 
  9733  c78594090000   mov     word ptr [di + 0x994], 0
  9739  cc             int3                          
  9740  8b3ece09       mov     di, word ptr [0x9ce]  
  9744  d1e7           shl     di, 1                 
  9746  c785a0090000   mov     word ptr [di + 0x9a0], 0
  9752  cc             int3                          
  9753  8b3ece09       mov     di, word ptr [0x9ce]  
  9757  d1e7           shl     di, 1                 
  9759  c785ac090000   mov     word ptr [di + 0x9ac], 0
  9765  cc             int3                          
  9766  8b3ece09       mov     di, word ptr [0x9ce]  
  9770  d1e7           shl     di, 1                 
  9772  c785b8090000   mov     word ptr [di + 0x9b8], 0
  9778  cc             int3                          
  9779  a1ce09         mov     ax, word ptr [0x9ce]  
  9782  40             inc     ax                    
  9783  a3ce09         mov     word ptr [0x9ce], ax  
  9786  833ece0905     cmp     word ptr [0x9ce], 5   
  9791  7f03           jg      0x2644                
  9793  e933ff         jmp     0x2577                
  9796  cc             int3                          
  9797  c70666091300   mov     word ptr [0x966], 0x13
  9803  cc             int3                          
  9804  c70672091300   mov     word ptr [0x972], 0x13
  9810  cc             int3                          
  9811  c706d6090200   mov     word ptr [0x9d6], 2   
  9817  e883db         call    0x1df                 
  9820  a3060a         mov     word ptr [0xa06], ax  
  9823  cc             int3                          
  9824  9aae11ec02     lcall   0x2ec, 0x11ae            ; RT#11  
  9829  cc             int3                          
  9830  cc             int3                          
  9831  bbec09         mov     bx, 0x9ec             
  9834  8bd3           mov     dx, bx                
  9836  8bca           mov     cx, dx                
  9838  9a9913ec02     lcall   0x2ec, 0x1399            ; RT#27  
  9843  b8840b         mov     ax, 0xb84                ; = 'mbl24o2x'
  9846  9a9802ec02     lcall   0x2ec, 0x298             ; RT#12    <<< ax='mbl24o2x'
  9851  93             xchg    bx, ax                
  9852  bb900b         mov     bx, 0xb90                ; = 'l32o3x'
  9855  9a9802ec02     lcall   0x2ec, 0x298             ; RT#12    <<< bx='l32o3x'
  9860  8bd3           mov     dx, bx                
  9862  8bd9           mov     bx, cx                
  9864  8bc2           mov     ax, dx                
  9866  9a9913ec02     lcall   0x2ec, 0x1399            ; RT#27  
  9871  9a9802ec02     lcall   0x2ec, 0x298             ; RT#12  
  9876  93             xchg    bx, ax                
  9877  bb9a0b         mov     bx, 0xb9a                ; = 'l64o4x'
  9880  9a9802ec02     lcall   0x2ec, 0x298             ; RT#12    <<< bx='l64o4x'
  9885  8bd3           mov     dx, bx                
  9887  8bd9           mov     bx, cx                
  9889  8bc2           mov     ax, dx                
  9891  9a9913ec02     lcall   0x2ec, 0x1399            ; RT#27  
  9896  9a9802ec02     lcall   0x2ec, 0x298             ; RT#12  
  9901  9a9d24ec02     lcall   0x2ec, 0x249d            ; RT#14  
  9906  cc             int3                          
  9907  8b1e6609       mov     bx, word ptr [0x966]  
  9911  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  9916  8b1e7209       mov     bx, word ptr [0x972]  
  9920  d1e3           shl     bx, 1                 
  9922  43             inc     bx                    
  9923  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  9928  cc             int3                          
  9929  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  9934  8b1e7e09       mov     bx, word ptr [0x97e]  
  9938  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
  9943  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
  9948  cc             int3                          
  9949  bb1a00         mov     bx, 0x1a              
  9952  9a8b20ec02     lcall   0x2ec, 0x208b            ; RT#6   
  9957  33db           xor     bx, bx                
  9959  9aa520ec02     lcall   0x2ec, 0x20a5            ; RT#7   
  9964  cc             int3                          
  9965  b80100         mov     ax, 1                 
  9968  e92e00         jmp     0x2721                
  9971  cc             int3                          
  9972  8b1eca09       mov     bx, word ptr [0x9ca]  
  9976  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
  9981  a1cc09         mov     ax, word ptr [0x9cc]  
  9984  03c0           add     ax, ax                
  9986  40             inc     ax                    
  9987  93             xchg    bx, ax                
  9988  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
  9993  cc             int3                          
  9994  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
  9999  bb0200         mov     bx, 2                 
 10002  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
 10007  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
 10012  cc             int3                          
 10013  a1ce09         mov     ax, word ptr [0x9ce]  
 10016  40             inc     ax                    
 10017  a3ce09         mov     word ptr [0x9ce], ax  
 10020  833ece0964     cmp     word ptr [0x9ce], 0x64
 10025  7ec8           jle     0x26f3                
 10027  cc             int3                          
 10028  c706d6090200   mov     word ptr [0x9d6], 2   
 10034  e8aada         call    0x1df                 
 10037  a3060a         mov     word ptr [0xa06], ax  
 10040  cc             int3                          
 10041  8b1e040a       mov     bx, word ptr [0xa04]  
 10045  9a6f26ec02     lcall   0x2ec, 0x266f            ; RT#16  
 10050  bf5e0b         mov     di, 0xb5e             
 10053  9a5701ec02     lcall   0x2ec, 0x157             ; RT#38  
 10058  9a0227ec02     lcall   0x2ec, 0x2702            ; RT#15  
 10063  93             xchg    bx, ax                
 10064  a3040a         mov     word ptr [0xa04], ax  
 10067  cc             int3                          
 10068  bb0700         mov     bx, 7                 
 10071  9a8b20ec02     lcall   0x2ec, 0x208b            ; RT#6   
 10076  33db           xor     bx, bx                
 10078  9aa520ec02     lcall   0x2ec, 0x20a5            ; RT#7   
 10083  cc             int3                          
 10084  833e000a03     cmp     word ptr [0xa00], 3   
 10089  7c03           jl      0x276e                
 10091  e94700         jmp     0x27b5                
 10094  cc             int3                          
 10095  a1000a         mov     ax, word ptr [0xa00]  
 10098  40             inc     ax                    
 10099  a3000a         mov     word ptr [0xa00], ax  
 10102  cc             int3                          
 10103  bb1900         mov     bx, 0x19              
 10106  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
 10111  bb0f00         mov     bx, 0xf               
 10114  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
 10119  cc             int3                          
 10120  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
 10125  8b1e000a       mov     bx, word ptr [0xa00]  
 10129  ba0100         mov     dx, 1                 
 10132  9a6113ec02     lcall   0x2ec, 0x1361            ; RT#10  
 10137  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
 10142  bbd809         mov     bx, 0x9d8             
 10145  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
 10150  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
 10155  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
 10160  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
 10165  cc             int3                          
 10166  b80200         mov     ax, 2                 
 10169  e9c400         jmp     0x2880                
 10172  cc             int3                          
 10173  8b3ece09       mov     di, word ptr [0x9ce]  
 10177  d1e7           shl     di, 1                 
 10179  8b9d8809       mov     bx, word ptr [di + 0x988]
 10183  4b             dec     bx                    
 10184  899d8809       mov     word ptr [di + 0x988], bx
 10188  cc             int3                          
 10189  8b3ece09       mov     di, word ptr [0x9ce]  
 10193  d1e7           shl     di, 1                 
 10195  8b9d6409       mov     bx, word ptr [di + 0x964]
 10199  3b1eca09       cmp     bx, word ptr [0x9ca]  
 10203  ba0000         mov     dx, 0                 
 10206  7501           jne     0x27e1                
 10208  4a             dec     dx                    
 10209  8b9d7009       mov     bx, word ptr [di + 0x970]
 10213  3b1ecc09       cmp     bx, word ptr [0x9cc]  
 10217  b90000         mov     cx, 0                 
 10220  7501           jne     0x27ef                
 10222  49             dec     cx                    
 10223  23ca           and     cx, dx                
 10225  23c9           and     cx, cx                
 10227  7503           jne     0x27f8                
 10229  e98300         jmp     0x287b                
 10232  cc             int3                          
 10233  8b3ece09       mov     di, word ptr [0x9ce]  
 10237  d1e7           shl     di, 1                 
 10239  c78558090700   mov     word ptr [di + 0x958], 7
 10245  cc             int3                          
 10246  8b3ece09       mov     di, word ptr [0x9ce]  
 10250  d1e7           shl     di, 1                 
 10252  c78564090e00   mov     word ptr [di + 0x964], 0xe
 10258  cc             int3                          
 10259  8b1ece09       mov     bx, word ptr [0x9ce]  
 10263  8bd3           mov     dx, bx                
 10265  83c310         add     bx, 0x10              
 10268  8bfa           mov     di, dx                
 10270  d1e7           shl     di, 1                 
 10272  899d7009       mov     word ptr [di + 0x970], bx
 10276  cc             int3                          
 10277  8b3ece09       mov     di, word ptr [0x9ce]  
 10281  d1e7           shl     di, 1                 
 10283  81bd7c09f900   cmp     word ptr [di + 0x97c], 0xf9
 10289  7403           je      0x2836                
 10291  e93800         jmp     0x286e                
 10294  cc             int3                          
 10295  a1020a         mov     ax, word ptr [0xa02]  
 10298  48             dec     ax                    
 10299  a3020a         mov     word ptr [0xa02], ax  
 10302  cc             int3                          
 10303  bb1900         mov     bx, 0x19              
 10306  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
 10311  bb0500         mov     bx, 5                 
 10314  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
 10319  cc             int3                          
 10320  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
 10325  8b1e020a       mov     bx, word ptr [0xa02]  
 10329  9af528ec02     lcall   0x2ec, 0x28f5            ; RT#25  
 10334  cc             int3                          
 10335  8b3ece09       mov     di, word ptr [0x9ce]  
 10339  d1e7           shl     di, 1                 
 10341  c7857c092000   mov     word ptr [di + 0x97c], 0x20
 10347  e90d00         jmp     0x287b                
 10350  cc             int3                          
 10351  8b3ece09       mov     di, word ptr [0x9ce]  
 10355  d1e7           shl     di, 1                 
 10357  c7857c092000   mov     word ptr [di + 0x97c], 0x20
 10363  cc             int3                          
 10364  a1ce09         mov     ax, word ptr [0x9ce]  
 10367  40             inc     ax                    
 10368  a3ce09         mov     word ptr [0x9ce], ax  
 10371  833ece0905     cmp     word ptr [0x9ce], 5   
 10376  7f03           jg      0x288d                
 10378  e92fff         jmp     0x27bc                
 10381  cc             int3                          
 10382  e984fa         jmp     0x2315                
 10385  cc             int3                          
 10386  cc             int3                          
 10387  b80200         mov     ax, 2                 
 10390  e97e04         jmp     0x2d17                
 10393  cc             int3                          
 10394  8b3ece09       mov     di, word ptr [0x9ce]  
 10398  d1e7           shl     di, 1                 
 10400  8b9d8809       mov     bx, word ptr [di + 0x988]
 10404  4b             dec     bx                    
 10405  899d8809       mov     word ptr [di + 0x988], bx
 10409  cc             int3                          
 10410  8b3ece09       mov     di, word ptr [0x9ce]  
 10414  d1e7           shl     di, 1                 
 10416  8b856409       mov     ax, word ptr [di + 0x964]
 10420  a3ca09         mov     word ptr [0x9ca], ax  
 10423  cc             int3                          
 10424  8b3ece09       mov     di, word ptr [0x9ce]  
 10428  d1e7           shl     di, 1                 
 10430  8b857009       mov     ax, word ptr [di + 0x970]
 10434  a3cc09         mov     word ptr [0x9cc], ax  
 10437  cc             int3                          
 10438  833ecc0912     cmp     word ptr [0x9cc], 0x12
 10443  7d03           jge     0x28d0                
 10445  e93700         jmp     0x2907                
 10448  cc             int3                          
 10449  833ecc0917     cmp     word ptr [0x9cc], 0x17
 10454  7e03           jle     0x28db                
 10456  e92c00         jmp     0x2907                
 10459  cc             int3                          
 10460  833eca090b     cmp     word ptr [0x9ca], 0xb 
 10465  7503           jne     0x28e6                
 10467  e94801         jmp     0x2a2e                
 10470  cc             int3                          
 10471  833eca090c     cmp     word ptr [0x9ca], 0xc 
 10476  7503           jne     0x28f1                
 10478  e93d01         jmp     0x2a2e                
 10481  cc             int3                          
 10482  833eca090c     cmp     word ptr [0x9ca], 0xc 
 10487  7f03           jg      0x28fc                
 10489  e90b00         jmp     0x2907                
 10492  cc             int3                          
 10493  833eca0910     cmp     word ptr [0x9ca], 0x10
 10498  7d03           jge     0x2907                
 10500  e98701         jmp     0x2a8e                
 10503  cc             int3                          
 10504  bb4a0b         mov     bx, 0xb4a             
 10507  9ac109ec02     lcall   0x2ec, 0x9c1             ; RT#18  
 10512  8b1e040a       mov     bx, word ptr [0xa04]  
 10516  9a2b03ec02     lcall   0x2ec, 0x32b             ; RT#37  
 10521  839a6f26ec     sbb     word ptr [bp + si + 0x266f], -0x14
 10526  029ab30e       add     bl, byte ptr [bp + si + 0xeb3]
 10530  ec             in      al, dx                
 10531  02837303       add     al, byte ptr [bp + di + 0x373]
 10535  e90401         jmp     0x2a2e                
 10538  cc             int3                          
 10539  8b3ece09       mov     di, word ptr [0x9ce]  
 10543  d1e7           shl     di, 1                 
 10545  83bd940900     cmp     word ptr [di + 0x994], 0
 10550  7403           je      0x293b                
 10552  e96a00         jmp     0x29a5                
 10555  cc             int3                          
 10556  8b3ece09       mov     di, word ptr [0x9ce]  
 10560  d1e7           shl     di, 1                 
 10562  8b9d6409       mov     bx, word ptr [di + 0x964]
 10566  3b1e6609       cmp     bx, word ptr [0x966]  
 10570  7503           jne     0x294f                
 10572  e95600         jmp     0x29a5                
 10575  cc             int3                          
 10576  8b1e6609       mov     bx, word ptr [0x966]  
 10580  2b1eca09       sub     bx, word ptr [0x9ca]  
 10584  23db           and     bx, bx                
 10586  7407           je      0x2963                
 10588  bb0100         mov     bx, 1                 
 10591  7d02           jge     0x2963                
 10593  f7db           neg     bx                    
 10595  031eca09       add     bx, word ptr [0x9ca]  
 10599  93             xchg    bx, ax                
 10600  a3ca09         mov     word ptr [0x9ca], ax  
 10603  cc             int3                          
 10604  a1cc09         mov     ax, word ptr [0x9cc]  
 10607  03c0           add     ax, ax                
 10609  40             inc     ax                    
 10610  92             xchg    dx, ax                
 10611  8b1eca09       mov     bx, word ptr [0x9ca]  
 10615  b9ff7f         mov     cx, 0x7fff            
 10618  9ac023ec02     lcall   0x2ec, 0x23c0            ; RT#9   
 10623  93             xchg    bx, ax                
 10624  a3c809         mov     word ptr [0x9c8], ax  
 10627  cc             int3                          
 10628  833ec80920     cmp     word ptr [0x9c8], 0x20
 10633  7503           jne     0x298e                
 10635  e98602         jmp     0x2c14                
 10638  cc             int3                          
 10639  813ec809f900   cmp     word ptr [0x9c8], 0xf9
 10645  7503           jne     0x299a                
 10647  e97a02         jmp     0x2c14                
 10650  cc             int3                          
 10651  833ec80901     cmp     word ptr [0x9c8], 1   
 10656  7503           jne     0x29a5                
 10658  e98503         jmp     0x2d2a                
 10661  cc             int3                          
 10662  8b3ece09       mov     di, word ptr [0x9ce]  
 10666  d1e7           shl     di, 1                 
 10668  83bda00900     cmp     word ptr [di + 0x9a0], 0
 10673  7403           je      0x29b6                
 10675  e97800         jmp     0x2a2e                
 10678  cc             int3                          
 10679  8b3ece09       mov     di, word ptr [0x9ce]  
 10683  d1e7           shl     di, 1                 
 10685  8b9d7009       mov     bx, word ptr [di + 0x970]
 10689  3b1e7209       cmp     bx, word ptr [0x972]  
 10693  7503           jne     0x29ca                
 10695  e96400         jmp     0x2a2e                
 10698  cc             int3                          
 10699  8b3ece09       mov     di, word ptr [0x9ce]  
 10703  d1e7           shl     di, 1                 
 10705  8b856409       mov     ax, word ptr [di + 0x964]
 10709  a3ca09         mov     word ptr [0x9ca], ax  
 10712  cc             int3                          
 10713  8b1e7209       mov     bx, word ptr [0x972]  
 10717  2b1ecc09       sub     bx, word ptr [0x9cc]  
 10721  23db           and     bx, bx                
 10723  7407           je      0x29ec                
 10725  bb0100         mov     bx, 1                 
 10728  7d02           jge     0x29ec                
 10730  f7db           neg     bx                    
 10732  031ecc09       add     bx, word ptr [0x9cc]  
 10736  93             xchg    bx, ax                
 10737  a3cc09         mov     word ptr [0x9cc], ax  
 10740  cc             int3                          
 10741  a1cc09         mov     ax, word ptr [0x9cc]  
 10744  03c0           add     ax, ax                
 10746  40             inc     ax                    
 10747  92             xchg    dx, ax                
 10748  8b1eca09       mov     bx, word ptr [0x9ca]  
 10752  b9ff7f         mov     cx, 0x7fff            
 10755  9ac023ec02     lcall   0x2ec, 0x23c0            ; RT#9   
 10760  93             xchg    bx, ax                
 10761  a3c809         mov     word ptr [0x9c8], ax  
 10764  cc             int3                          
 10765  833ec80920     cmp     word ptr [0x9c8], 0x20
 10770  7503           jne     0x2a17                
 10772  e9fd01         jmp     0x2c14                
 10775  cc             int3                          
 10776  813ec809f900   cmp     word ptr [0x9c8], 0xf9
 10782  7503           jne     0x2a23                
 10784  e9f101         jmp     0x2c14                
 10787  cc             int3                          
 10788  833ec80901     cmp     word ptr [0x9c8], 1   
 10793  7503           jne     0x2a2e                
 10795  e9fc02         jmp     0x2d2a                
 10798  cc             int3                          
 10799  8b3ece09       mov     di, word ptr [0x9ce]  
 10803  d1e7           shl     di, 1                 
 10805  8b856409       mov     ax, word ptr [di + 0x964]
 10809  03859409       add     ax, word ptr [di + 0x994]
 10813  a3ca09         mov     word ptr [0x9ca], ax  
 10816  cc             int3                          
 10817  8b3ece09       mov     di, word ptr [0x9ce]  
 10821  d1e7           shl     di, 1                 
 10823  8b857009       mov     ax, word ptr [di + 0x970]
 10827  0385a009       add     ax, word ptr [di + 0x9a0]
 10831  a3cc09         mov     word ptr [0x9cc], ax  
 10834  cc             int3                          
 10835  a1cc09         mov     ax, word ptr [0x9cc]  
 10838  03c0           add     ax, ax                
 10840  40             inc     ax                    
 10841  92             xchg    dx, ax                
 10842  8b1eca09       mov     bx, word ptr [0x9ca]  
 10846  b9ff7f         mov     cx, 0x7fff            
 10849  9ac023ec02     lcall   0x2ec, 0x23c0            ; RT#9   
 10854  93             xchg    bx, ax                
 10855  a3c809         mov     word ptr [0x9c8], ax  
 10858  cc             int3                          
 10859  833ec80920     cmp     word ptr [0x9c8], 0x20
 10864  7503           jne     0x2a75                
 10866  e99f01         jmp     0x2c14                
 10869  cc             int3                          
 10870  813ec809f900   cmp     word ptr [0x9c8], 0xf9
 10876  7503           jne     0x2a81                
 10878  e99301         jmp     0x2c14                
 10881  cc             int3                          
 10882  a14e09         mov     ax, word ptr [0x94e]  
 10885  3b06c809       cmp     ax, word ptr [0x9c8]  
 10889  7503           jne     0x2a8e                
 10891  e99c02         jmp     0x2d2a                
 10894  cc             int3                          
 10895  bb4a0b         mov     bx, 0xb4a             
 10898  9ac109ec02     lcall   0x2ec, 0x9c1             ; RT#18  
 10903  9a0227ec02     lcall   0x2ec, 0x2702            ; RT#15  
 10908  93             xchg    bx, ax                
 10909  a3d209         mov     word ptr [0x9d2], ax  
 10912  cc             int3                          
 10913  833ed20900     cmp     word ptr [0x9d2], 0   
 10918  7403           je      0x2aab                
 10920  e90700         jmp     0x2ab2                
 10923  cc             int3                          
 10924  c706d209ffff   mov     word ptr [0x9d2], 0xffff
 10930  cc             int3                          
 10931  8b3ece09       mov     di, word ptr [0x9ce]  
 10935  d1e7           shl     di, 1                 
 10937  8b85a009       mov     ax, word ptr [di + 0x9a0]
 10941  f72ed209       imul    word ptr [0x9d2]      
 10945  03856409       add     ax, word ptr [di + 0x964]
 10949  a3ca09         mov     word ptr [0x9ca], ax  
 10952  cc             int3                          
 10953  8b3ece09       mov     di, word ptr [0x9ce]  
 10957  d1e7           shl     di, 1                 
 10959  8b859409       mov     ax, word ptr [di + 0x994]
 10963  f72ed209       imul    word ptr [0x9d2]      
 10967  03857009       add     ax, word ptr [di + 0x970]
 10971  a3cc09         mov     word ptr [0x9cc], ax  
 10974  cc             int3                          
 10975  a1cc09         mov     ax, word ptr [0x9cc]  
 10978  03c0           add     ax, ax                
 10980  40             inc     ax                    
 10981  92             xchg    dx, ax                
 10982  8b1eca09       mov     bx, word ptr [0x9ca]  
 10986  b9ff7f         mov     cx, 0x7fff            
 10989  9ac023ec02     lcall   0x2ec, 0x23c0            ; RT#9   
 10994  93             xchg    bx, ax                
 10995  a3c809         mov     word ptr [0x9c8], ax  
 10998  cc             int3                          
 10999  833ec80920     cmp     word ptr [0x9c8], 0x20
 11004  7503           jne     0x2b01                
 11006  e91301         jmp     0x2c14                
 11009  cc             int3                          
 11010  813ec809f900   cmp     word ptr [0x9c8], 0xf9
 11016  7503           jne     0x2b0d                
 11018  e90701         jmp     0x2c14                
 11021  cc             int3                          
 11022  a14e09         mov     ax, word ptr [0x94e]  
 11025  3b06c809       cmp     ax, word ptr [0x9c8]  
 11029  7503           jne     0x2b1a                
 11031  e91002         jmp     0x2d2a                
 11034  cc             int3                          
 11035  8b3ece09       mov     di, word ptr [0x9ce]  
 11039  d1e7           shl     di, 1                 
 11041  8b85a009       mov     ax, word ptr [di + 0x9a0]
 11045  f72ed209       imul    word ptr [0x9d2]      
 11049  2b856409       sub     ax, word ptr [di + 0x964]
 11053  f7d8           neg     ax                    
 11055  a3ca09         mov     word ptr [0x9ca], ax  
 11058  cc             int3                          
 11059  8b3ece09       mov     di, word ptr [0x9ce]  
 11063  d1e7           shl     di, 1                 
 11065  8b859409       mov     ax, word ptr [di + 0x994]
 11069  f72ed209       imul    word ptr [0x9d2]      
 11073  2b857009       sub     ax, word ptr [di + 0x970]
 11077  f7d8           neg     ax                    
 11079  a3cc09         mov     word ptr [0x9cc], ax  
 11082  cc             int3                          
 11083  a1cc09         mov     ax, word ptr [0x9cc]  
 11086  03c0           add     ax, ax                
 11088  40             inc     ax                    
 11089  92             xchg    dx, ax                
 11090  8b1eca09       mov     bx, word ptr [0x9ca]  
 11094  b9ff7f         mov     cx, 0x7fff            
 11097  9ac023ec02     lcall   0x2ec, 0x23c0            ; RT#9   
 11102  93             xchg    bx, ax                
 11103  a3c809         mov     word ptr [0x9c8], ax  
 11106  cc             int3                          
 11107  833ec80920     cmp     word ptr [0x9c8], 0x20
 11112  7503           jne     0x2b6d                
 11114  e9a700         jmp     0x2c14                
 11117  cc             int3                          
 11118  813ec809f900   cmp     word ptr [0x9c8], 0xf9
 11124  7503           jne     0x2b79                
 11126  e99b00         jmp     0x2c14                
 11129  cc             int3                          
 11130  a14e09         mov     ax, word ptr [0x94e]  
 11133  3b06c809       cmp     ax, word ptr [0x9c8]  
 11137  7503           jne     0x2b86                
 11139  e9a401         jmp     0x2d2a                
 11142  cc             int3                          
 11143  8b3ece09       mov     di, word ptr [0x9ce]  
 11147  d1e7           shl     di, 1                 
 11149  8b856409       mov     ax, word ptr [di + 0x964]
 11153  2b859409       sub     ax, word ptr [di + 0x994]
 11157  a3ca09         mov     word ptr [0x9ca], ax  
 11160  cc             int3                          
 11161  8b3ece09       mov     di, word ptr [0x9ce]  
 11165  d1e7           shl     di, 1                 
 11167  8b857009       mov     ax, word ptr [di + 0x970]
 11171  2b85a009       sub     ax, word ptr [di + 0x9a0]
 11175  a3cc09         mov     word ptr [0x9cc], ax  
 11178  cc             int3                          
 11179  a1cc09         mov     ax, word ptr [0x9cc]  
 11182  03c0           add     ax, ax                
 11184  40             inc     ax                    
 11185  92             xchg    dx, ax                
 11186  8b1eca09       mov     bx, word ptr [0x9ca]  
 11190  b9ff7f         mov     cx, 0x7fff            
 11193  9ac023ec02     lcall   0x2ec, 0x23c0            ; RT#9   
 11198  93             xchg    bx, ax                
 11199  a3c809         mov     word ptr [0x9c8], ax  
 11202  cc             int3                          
 11203  833ec80920     cmp     word ptr [0x9c8], 0x20
 11208  7503           jne     0x2bcd                
 11210  e94700         jmp     0x2c14                
 11213  cc             int3                          
 11214  813ec809f900   cmp     word ptr [0x9c8], 0xf9
 11220  7503           jne     0x2bd9                
 11222  e93b00         jmp     0x2c14                
 11225  cc             int3                          
 11226  a14e09         mov     ax, word ptr [0x94e]  
 11229  3b06c809       cmp     ax, word ptr [0x9c8]  
 11233  7503           jne     0x2be6                
 11235  e94401         jmp     0x2d2a                
 11238  cc             int3                          
 11239  8b3ece09       mov     di, word ptr [0x9ce]  
 11243  d1e7           shl     di, 1                 
 11245  8b856409       mov     ax, word ptr [di + 0x964]
 11249  a3ca09         mov     word ptr [0x9ca], ax  
 11252  cc             int3                          
 11253  8b3ece09       mov     di, word ptr [0x9ce]  
 11257  d1e7           shl     di, 1                 
 11259  8b857009       mov     ax, word ptr [di + 0x970]
 11263  a3cc09         mov     word ptr [0x9cc], ax  
 11266  cc             int3                          
 11267  8b3ece09       mov     di, word ptr [0x9ce]  
 11271  d1e7           shl     di, 1                 
 11273  8b857c09       mov     ax, word ptr [di + 0x97c]
 11277  a3c809         mov     word ptr [0x9c8], ax  
 11280  cc             int3                          
 11281  e92600         jmp     0x2c3a                
 11284  cc             int3                          
 11285  8b3ece09       mov     di, word ptr [0x9ce]  
 11289  d1e7           shl     di, 1                 
 11291  8b1eca09       mov     bx, word ptr [0x9ca]  
 11295  2b9d6409       sub     bx, word ptr [di + 0x964]
 11299  899d9409       mov     word ptr [di + 0x994], bx
 11303  cc             int3                          
 11304  8b3ece09       mov     di, word ptr [0x9ce]  
 11308  d1e7           shl     di, 1                 
 11310  8b1ecc09       mov     bx, word ptr [0x9cc]  
 11314  2b9d7009       sub     bx, word ptr [di + 0x970]
 11318  899da009       mov     word ptr [di + 0x9a0], bx
 11322  cc             int3                          
 11323  8b3ece09       mov     di, word ptr [0x9ce]  
 11327  d1e7           shl     di, 1                 
 11329  8b9d6409       mov     bx, word ptr [di + 0x964]
 11333  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
 11338  8b9d7009       mov     bx, word ptr [di + 0x970]
 11342  d1e3           shl     bx, 1                 
 11344  43             inc     bx                    
 11345  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
 11350  cc             int3                          
 11351  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
 11356  8b3ece09       mov     di, word ptr [0x9ce]  
 11360  d1e7           shl     di, 1                 
 11362  8b9d7c09       mov     bx, word ptr [di + 0x97c]
 11366  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
 11371  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
 11376  cc             int3                          
 11377  8b3ece09       mov     di, word ptr [0x9ce]  
 11381  d1e7           shl     di, 1                 
 11383  83bd880900     cmp     word ptr [di + 0x988], 0
 11388  7e03           jle     0x2c81                
 11390  e90d00         jmp     0x2c8e                
 11393  cc             int3                          
 11394  8b3ece09       mov     di, word ptr [0x9ce]  
 11398  d1e7           shl     di, 1                 
 11400  c78558090700   mov     word ptr [di + 0x958], 7
 11406  cc             int3                          
 11407  8b3ece09       mov     di, word ptr [0x9ce]  
 11411  d1e7           shl     di, 1                 
 11413  8b9d5809       mov     bx, word ptr [di + 0x958]
 11417  9a8b20ec02     lcall   0x2ec, 0x208b            ; RT#6   
 11422  33db           xor     bx, bx                
 11424  9aa520ec02     lcall   0x2ec, 0x20a5            ; RT#7   
 11429  cc             int3                          
 11430  8b1eca09       mov     bx, word ptr [0x9ca]  
 11434  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
 11439  a1cc09         mov     ax, word ptr [0x9cc]  
 11442  03c0           add     ax, ax                
 11444  40             inc     ax                    
 11445  93             xchg    bx, ax                
 11446  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
 11451  cc             int3                          
 11452  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
 11457  8b3ece09       mov     di, word ptr [0x9ce]  
 11461  d1e7           shl     di, 1                 
 11463  8b9d4c09       mov     bx, word ptr [di + 0x94c]
 11467  9a4512ec02     lcall   0x2ec, 0x1245            ; RT#5   
 11472  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1   
 11477  cc             int3                          
 11478  bb0700         mov     bx, 7                 
 11481  9a8b20ec02     lcall   0x2ec, 0x208b            ; RT#6   
 11486  33db           xor     bx, bx                
 11488  9aa520ec02     lcall   0x2ec, 0x20a5            ; RT#7   
 11493  cc             int3                          
 11494  8b3ece09       mov     di, word ptr [0x9ce]  
 11498  d1e7           shl     di, 1                 
 11500  8b1ec809       mov     bx, word ptr [0x9c8]  
 11504  899d7c09       mov     word ptr [di + 0x97c], bx
 11508  cc             int3                          
 11509  8b3ece09       mov     di, word ptr [0x9ce]  
 11513  d1e7           shl     di, 1                 
 11515  8b1eca09       mov     bx, word ptr [0x9ca]  
 11519  899d6409       mov     word ptr [di + 0x964], bx
 11523  cc             int3                          
 11524  8b3ece09       mov     di, word ptr [0x9ce]  
 11528  d1e7           shl     di, 1                 
 11530  8b1ecc09       mov     bx, word ptr [0x9cc]  
 11534  899d7009       mov     word ptr [di + 0x970], bx
 11538  cc             int3                          
 11539  a1ce09         mov     ax, word ptr [0x9ce]  
 11542  40             inc     ax                    
 11543  a3ce09         mov     word ptr [0x9ce], ax  
 11546  833ece0905     cmp     word ptr [0x9ce], 5   
 11551  7f03           jg      0x2d24                
 11553  e975fb         jmp     0x2899                
 11556  cc             int3                          
 11557  9aae11ec02     lcall   0x2ec, 0x11ae            ; RT#11  
 11562  cc             int3                          
 11563  8b3ece09       mov     di, word ptr [0x9ce]  
 11567  d1e7           shl     di, 1                 
 11569  8b856409       mov     ax, word ptr [di + 0x964]
 11573  a3ca09         mov     word ptr [0x9ca], ax  
 11576  cc             int3                          
 11577  8b3ece09       mov     di, word ptr [0x9ce]  
 11581  d1e7           shl     di, 1                 
 11583  8b857009       mov     ax, word ptr [di + 0x970]
 11587  a3cc09         mov     word ptr [0x9cc], ax  
 11590  cc             int3                          
 11591  a1ce09         mov     ax, word ptr [0x9ce]  
 11594  40             inc     ax                    
 11595  a3c809         mov     word ptr [0x9c8], ax  
 11598  cc             int3                          
 11599  e9e3f6         jmp     0x2435                
 11602  cc             int3                          
 11603  cc             int3                          
 11604  bb1900         mov     bx, 0x19              
 11607  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
 11612  bb0a00         mov     bx, 0xa               
 11615  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
 11620  cc             int3                          
 11621  bb1a00         mov     bx, 0x1a              
 11624  9a8b20ec02     lcall   0x2ec, 0x208b            ; RT#6   
 11629  33db           xor     bx, bx                
 11631  9aa520ec02     lcall   0x2ec, 0x20a5            ; RT#7   
 11636  cc             int3                          
 11637  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
 11642  bba40b         mov     bx, 0xba4                ; = 'You did it!!!'
 11645  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1     <<< bx='You did it!!!'
 11650  cc             int3                          
 11651  bb0700         mov     bx, 7                 
 11654  9a8b20ec02     lcall   0x2ec, 0x208b            ; RT#6   
 11659  33db           xor     bx, bx                
 11661  9aa520ec02     lcall   0x2ec, 0x20a5            ; RT#7   
 11666  cc             int3                          
 11667  c706d6090200   mov     word ptr [0x9d6], 2   
 11673  e843d4         call    0x1df                 
 11676  a3060a         mov     word ptr [0xa06], ax  
 11679  cc             int3                          
 11680  c706d6090200   mov     word ptr [0x9d6], 2   
 11686  e836d4         call    0x1df                 
 11689  2b06060a       sub     ax, word ptr [0xa06]  
 11693  3d0f00         cmp     ax, 0xf               
 11696  7c03           jl      0x2db5                
 11698  e90400         jmp     0x2db9                
 11701  cc             int3                          
 11702  e9e6ff         jmp     0x2d9f                
 11705  cc             int3                          
 11706  cc             int3                          
 11707  cc             int3                          
 11708  cc             int3                          
 11709  bb1900         mov     bx, 0x19              
 11712  9a9a03ec02     lcall   0x2ec, 0x39a             ; RT#3   
 11717  bb0a00         mov     bx, 0xa               
 11720  9ab403ec02     lcall   0x2ec, 0x3b4             ; RT#4   
 11725  cc             int3                          
 11726  bb1a00         mov     bx, 0x1a              
 11729  9a8b20ec02     lcall   0x2ec, 0x208b            ; RT#6   
 11734  33db           xor     bx, bx                
 11736  9aa520ec02     lcall   0x2ec, 0x20a5            ; RT#7   
 11741  cc             int3                          
 11742  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
 11747  bbb60b         mov     bx, 0xbb6                ; = 'Play again???'
 11750  9afa28ec02     lcall   0x2ec, 0x28fa            ; RT#1     <<< bx='Play again???'
 11755  cc             int3                          
 11756  bb0700         mov     bx, 7                 
 11759  9a8b20ec02     lcall   0x2ec, 0x208b            ; RT#6   
 11764  33db           xor     bx, bx                
 11766  9aa520ec02     lcall   0x2ec, 0x20a5            ; RT#7   
 11771  cc             int3                          
 11772  bb6a00         mov     bx, 0x6a              
 11775  33c0           xor     ax, ax                
 11777  8e1e0000       mov     ds, word ptr [0]      
 11781  8807           mov     byte ptr [bx], al     
 11783  06             push    es                    
 11784  1f             pop     ds                    
 11785  cc             int3                          
 11786  9a2812ec02     lcall   0x2ec, 0x1228            ; RT#56  
 11791  ba0c0a         mov     dx, 0xa0c             
 11794  9a6202ec02     lcall   0x2ec, 0x262             ; RT#8   
 11799  cc             int3                          
 11800  bb460a         mov     bx, 0xa46             
 11803  b80c0a         mov     ax, 0xa0c             
 11806  9ad202ec02     lcall   0x2ec, 0x2d2             ; RT#21  
 11811  7403           je      0x2e28                
 11813  e90400         jmp     0x2e2c                
 11816  cc             int3                          
 11817  e9ddff         jmp     0x2e09                
 11820  cc             int3                          
 11821  bbc80b         mov     bx, 0xbc8             
 11824  b80c0a         mov     ax, 0xa0c             
 11827  9ad202ec02     lcall   0x2ec, 0x2d2             ; RT#21  
 11832  ba0000         mov     dx, 0                 
 11835  7501           jne     0x2e3e                
 11837  4a             dec     dx                    
 11838  bbce0b         mov     bx, 0xbce             
 11841  9ad202ec02     lcall   0x2ec, 0x2d2             ; RT#21  
 11846  b90000         mov     cx, 0                 
 11849  7501           jne     0x2e4c                
 11851  49             dec     cx                    
 11852  0bca           or      cx, dx                
 11854  23c9           and     cx, cx                
 11856  7503           jne     0x2e55                
 11858  e90400         jmp     0x2e59                
 11861  cc             int3                          
 11862  e932d2         jmp     0x8b                  
 11865  cc             int3                          
 11866  bbd40b         mov     bx, 0xbd4             
 11869  b80c0a         mov     ax, 0xa0c             
 11872  9ad202ec02     lcall   0x2ec, 0x2d2             ; RT#21  
 11877  7503           jne     0x2e6a                
 11879  e90400         jmp     0x2e6e                
 11882  cc             int3                          
 11883  e99bff         jmp     0x2e09                
 11886  cc             int3                          
 11887  9a0e20ec02     lcall   0x2ec, 0x200e            ; RT#13  
 11892  cc             int3                          
 11893  bb0100         mov     bx, 1                 
 11896  9a6f21ec02     lcall   0x2ec, 0x216f            ; RT#35  
 11901  cc             int3                          
 11902  9a422aec02     lcall   0x2ec, 0x2a42            ; RT#2   
 11907  bbda0b         mov     bx, 0xbda                ; = '...Hope you had a good time'
 11910  9a0e29ec02     lcall   0x2ec, 0x290e            ; RT#39    <<< bx='...Hope you had a good time'
 11915  cc             int3                          
 11916  9ae708ec02     lcall   0x2ec, 0x8e7             ; RT#57  
 11921  cc             int3                          
 11922  c706100a0000   mov     word ptr [0xa10], 0   
 11928  cc             int3                          
 11929  a13209         mov     ax, word ptr [0x932]  
 11932  a3120a         mov     word ptr [0xa12], ax  
 11935  b80100         mov     ax, 1                 
 11938  e90d00         jmp     0x2eb2                
 11941  cc             int3                          
 11942  a1100a         mov     ax, word ptr [0xa10]  
 11945  40             inc     ax                    
 11946  a3100a         mov     word ptr [0xa10], ax  
 11949  cc             int3                          
 11950  a1140a         mov     ax, word ptr [0xa14]  
 11953  40             inc     ax                    
 11954  a3140a         mov     word ptr [0xa14], ax  
 11957  a1120a         mov     ax, word ptr [0xa12]  
 11960  3b06140a       cmp     ax, word ptr [0xa14]  
 11964  7de7           jge     0x2ea5                
 11966  cc             int3                          
 11967  9aae11ec02     lcall   0x2ec, 0x11ae            ; RT#11  
 11972  9ade08ec02     lcall   0x2ec, 0x8de             ; RT#58  
 11977  00be1a00       add     byte ptr [bp + 0x1a], bh
 11981  eb06           jmp     0x2ed5                
 11983  e84d03         call    0x321f                
 11986  bf1a00         mov     di, 0x1a              