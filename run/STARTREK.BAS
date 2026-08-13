500 CLS
510 PLAY "mb"
520 REM
530 REM
540 REM ****       **** STAR TREK ****       ****
550 REM ****  Simulation of a mission of the starship ENTERPRISE
560 REM ****  as seen on the Star Trek tv show.
570 REM ****  Original program in Creative Computing
580 REM ****  Basic Computer Games by Dave Ahl.
590 REM ****  Modifications by Bob Fritz and Sharon Fritz
600 REM **** for the IBM Personal Computer, October-November 1981
610 REM **** Bob Fritz, 9915 Caninito Cuadro, San Diego, Ca., 92129
620 REM ****  [nomor telepon disunting - UU PDP No. 27/2022]
630 REM ****
640 PRINT:PRINT:PRINT:PRINT:PRINT:PRINT:PRINT:PRINT:PRINT:PRINT:PRINT
650 E1$= "                                    ,------":E7$="------,"
660 E2$= "                    ,-------------   '---  ------'"
670 E3$= "                     ,-------- --'      / /"
680 E4$= "                        ,---' '-------/ /--,"
690 E5$= "                          '----------------'":PRINT
700 E6$= "                   THE USS ENTERPRISE --- NCC-1701"
710 E8$=CHR$(15)
720 PRINT E1$;:COLOR 23,0:PRINT E8$;:COLOR 7,0 :PRINT E7$
730 PRINT E2$
740 PRINT E3$
750 PRINT E4$
760 PRINT E5$
770 PRINT
780 PRINT E6$
790 PRINT:PRINT: PRINT:PRINT:PRINT:PRINT:PRINT
800 CLEAR 600
810 RANDOMIZE 120*(VAL(RIGHT$(TIME$,2)) + VAL(MID$(TIME$,4,2)) )
820 Z$="                         "
830 GOSUB 840 :GOTO 960
840 REM  ------- set function keys  for game -------
850 KEY 1,"NAV"+CHR$(13)
860 KEY 2,"SRS"+CHR$(13)
870 KEY 3,"LRS"+CHR$(13)
880 KEY 4,"PHASERS"+CHR$(13)
890 KEY 5,"TORPEDO"+CHR$(13)
900 KEY 6,"SHIELDS"+CHR$(13)
910 KEY 7,"DAMAGE REPORT"+CHR$(13)
920 KEY 8,"COMPUTER"+CHR$(13)
930 KEY 9,"RESIGN"+CHR$(13)
940 KEY 10,""
950 RETURN
960 DIM G(8,8),C(9,2),K(3,3),N(3),Z(8,8),D(8)
970 T=INT(RND(1)*20+20)*100:T0=T:T9=25+INT(RND(1)*10):D0=0:E=3000:E0=E
980 P=10:P0=P:S9=200:S=0:B9=0:K9=0:X$="":X0$=" is "
990 DEF FND(D)=SQR((K(I,1)-S1)^2+(K(I,2)-S2)^2)
1000 DEF FNR(R)=INT(RND(R)*7.98+1.01)
1010 REM initialize enterprise's position
1020 Q1=FNR(1):Q2=FNR(1):S1=FNR(1):S2=FNR(1)
1030 FOR I=1 TO 9:C(I,1)=0:C(I,2)=0:NEXT I
1040 C(3,1)=-1:C(2,1)=-1:C(4,1)=-1:C(4,2)=-1:C(5,2)=-1:C(6,2)=-1
1050 C(1,2)=1:C(2,2)=1:C(6,1)=1:C(7,1)=1:C(8,1)=1:C(8,2)=1:C(9,2)=1
1060 FOR I=1 TO 8:D(I)=0:NEXT I
1070 A1$="NAVSRSLRSPHATORSHIDAMCOMRES"
1080 REM set up what exists in galaxy
1090 REM k3=#klingons  b3=#starbases  s3=#stars
1100 FOR I=1 TO 8:FOR J=1 TO 8:K3=0:Z(I,J)=0:R1=RND(1)
1110 IF R1>0.9799999 THEN K3=3:K9=K9+3: GOTO 1140
1120 IF R1>0.95 THEN K3=2:K9=K9+2: GOTO 1140
1130 IF R1>0.8 THEN K3=1:K9=K9+1
1140 B3=0:IF RND(1)>0.96 THEN B3=1:B9=B9+1
1150 G(I,J)=K3*100+B3*10+FNR(1):NEXT J:NEXT I:IF K9>T9 THEN T9=K9+1
1160 IF B9<>0 THEN 1190
1170 IF G(Q1,Q2)<200 THEN G(Q1,Q2)=G(Q1,Q2)+100:K9=K9+1
1180 B9=1:G(Q1,Q2)=G(Q1,Q2)+10:Q1=FNR(1):Q2=FNR(1)
1190 K7=K9:IF B9<>1 THEN X$="s":X0$=" are "
1200 PRINT"      Your orders are as follows: "
1210 PRINT"      Destroy the";K9;"Klingon warships which have invaded"
1220 PRINT"    the galaxy before they can attack Federation headquarters"
1230 PRINT"    on stardate";T0+T9;"  this gives you";T9;"days.  there";X0$
1240 PRINT"  ";B9;"starbase";X$;" in the galaxy for resupplying your ship"
1250 PRINT:PRINT ' "hit any key except return when ready to accept command"
1260 I=RND(1):IF INP(1)=13 THEN 1260
1270 REM here any time new quadrant entered
1280 Z4=Q1:Z5=Q2:K3=0:B3=0:S3=0:G5=0:D4=0.5*RND(1):Z(Q1,Q2)=G(Q1,Q2)
1290 IF Q1<1 OR Q1>8 OR Q2<1 OR Q2>8 THEN 1410
1300 GOSUB 5040:PRINT:IF T0 <>T THEN 1330
1310 PRINT"Your mission begins with your starship located"
1320 PRINT"in the galactic quadrant, '";G2$;"'.":GOTO 1340
1330 PRINT"Now entering ";G2$;" quadrant. . ."
1340 PRINT:K3=INT(G(Q1,Q2)*0.01):B3=INT(G(Q1,Q2)*0.1)-10*K3
1350 S3=G(Q1,Q2)-100*K3-10*B3:IF K3=0 THEN 1400
1360 PRINT "COMBAT AREA!! Condition";
1370 COLOR 16,7 :PRINT " RED "; : COLOR 7,0:PRINT
1380 COLOR 7,0 :GOSUB 5290:IF S>200 THEN 1400
1390 COLOR 31,0:PRINT"    SHIELDS DANGEROUSLY LOW";:COLOR 7,0: PRINT SPC(53)
1400 FOR I=1 TO 3:K(I,1)=0:K(I,2)=0:NEXT I
1410 FOR I=1 TO 3:K(I,3)=0: NEXT I:Q$=Z$+Z$+Z$+Z$+Z$+Z$+Z$+LEFT$(Z$,17)
1420 REM position enterprise in quadrant, then place "k3" klingons,&
1430 REM "b3" starbases &"s3" stars elsewhere.
1440 A$=CHR$(204)+CHR$(144)+CHR$(185):Z1=S1:Z2=S2:GOSUB 4830:IF K3<1 THEN 1470
1450 FOR I=1 TO K3:GOSUB 4800:A$="+"+CHR$(2)+"+":Z1=R1:Z2=R2
1460 GOSUB 4830:K(I,1)=R1:K(I,2)=R2:K(I,3)=S9*(0.5+RND(1)):NEXT I
1470 IF B3<1 THEN 1500
1480 GOSUB 4800:A$=CHR$(174)+CHR$(127)+CHR$(175):Z1=R1:B4=R1:Z2=R2:B5=R2
1490 GOSUB 4830
1500 FOR I=1 TO S3:GOSUB 4800:A$=" "+CHR$(15)+" ":Z1=R1:Z2=R2:GOSUB 4830:NEXT I
1510 GOSUB 3720
1520 IF S+E>10 THEN IF E>10 OR D(7)=0 THEN 1580
1530 COLOR 16,7 : PRINT"*** FATAL ERROR ***";:COLOR 7,0:GOSUB 5290
1540 PRINT"You've just stranded your ship in "
1550 PRINT"space":PRINT"You have insufficient maneuvering energy,";
1560 PRINT" and shield control":PRINT"is presently incapable of cross";
1570 PRINT"-circuiting to engine room!!":GOTO 3480
1580 INPUT"command";A$
1590 FOR I=1 TO 9: IF LEFT$(A$,3)<> MID$(A1$,3*I-2,3) THEN 1610
1600 ON I GOTO 1720,1510,2440,2530,2750,3090,3180,3980,3510
1610 NEXT I:PRINT"Enter one of the following:"
1620 PRINT"  NAV   (to set course)"
1630 PRINT"  SRS   (for short range sensor scan)"
1640 PRINT"  LRS   (for long range sensor scan)"
1650 PRINT"  PHA   (to fire phasers)"
1660 PRINT"  TOR   (to fire photon torpedoes)"
1670 PRINT"  SHI   (to raise or lower shields)"
1680 PRINT"  DAM   (for damage control reports)"
1690 PRINT"  COM   (to call on library-computer)"
1700 PRINT"  RES   (to resign your command)":PRINT:GOTO 1520
1710 REM course control begins here
1720 INPUT"Course (1-9)";C1:IF C1=9 THEN C1=1
1730 IF C1>=1 AND C1<9 THEN 1750
1740 PRINT"   Lt. Sulu reports,  'Incorrect course data, sir!'":GOTO 1520
1750 X$="8":IF D(1)<0 THEN X$="0.2"
1760 PRINT"Warp factor(0-";X$;")";:INPUT W1:IF D(1)<0 AND W1>0.2 THEN 1810
1770 IF W1>0 AND W1<8 THEN 1820
1780 IF W1=0 THEN 1520
1790 PRINT"   Chief Engineer Scott reports 'The engines won't take";
1800 PRINT" warp ";W1;"!":GOTO 1520
1810 PRINT"Warp engines are damaged.  Maximum speed = warp 0.2":GOTO 1520
1820 N=INT(W1*8+0.5):IF E-N>=0 THEN 1900
1830 PRINT"Engineering reports   'Insufficient energy available"
1840 PRINT"                       for maneuvering at warp";W1;"!'"
1850 IF S<N-E OR D(7)<0 THEN 1520
1860 PRINT"Deflector control room acknowledges";S;"units of energy"
1870 PRINT"                         presently deployed to shields."
1880 GOTO 1520
1890 REM klingons move/fire on moving starship . . .
1900 FOR I=1 TO K3:IF K(I,3)=0 THEN 1930
1910 A$="   ":Z1=K(I,1):Z2=K(I,2):GOSUB 4830:GOSUB 4800
1920 K(I,1)=Z1:K(I,2)=Z2:A$="+"+CHR$(2)+"+":GOSUB 4830
1930 NEXT I:GOSUB 4810:D1=0:D6=W1:IF W1>=1 THEN D6=1
1940 FOR I=1 TO 8:IF D(I)>=0 THEN 1990
1950 D(I)=D(I)+D6:IF D(I)>-0.1  AND D(I)<0 THEN D(I)=-0.1:GOTO  1990
1960 IF D(I)<0 THEN 1990
1970 IF D1<>1 THEN D1=1:PRINT"DAMAGE CONTROL REPORT:   ";
1980 PRINT TAB(8);:R1=I:GOSUB 4890:PRINT G2$;" Repair completed."
1990 NEXT I:IF RND(1)>0.2 THEN 2070
2000 R1=FNR(1):IF RND(1)>=0.6 THEN 2040
2010 IF K3=0 THEN 2070
2020 D(R1)=D(R1)-(RND(1)*5+1):PRINT"DAMAGE CONTROL REPORT:   ";
2030 GOSUB 4890:PRINT G2$;" damaged":PRINT:GOTO 2070
2040 D(R1)=D(R1)+RND(1)*3+1:PRINT"DAMAGE CONTROL REPORT:   ";
2050 GOSUB 4890:PRINT G2$;" State of repair improved":PRINT
2060 REM begin moving starship
2070 A$="   " :Z1=INT(S1):Z2=INT(S2):GOSUB 4830
2080 X1=C(C1,1)+(C(C1+1,1)-C(C1,1))*(C1-INT(C1)):X=S1:Y=S2
2090 X2=C(C1,2)+(C(C1+1,2)-C(C1,2))*(C1-INT(C1)):Q4=Q1:Q5=Q2
2100 FOR I=1 TO N:S1=S1+X1:S2=S2+X2:IF S1<1 OR S1>=9 OR S2<1 OR S2>=9 THEN 2220
2110 S8=INT(S1)*24+INT(S2)*3-26:IF MID$(Q$,S8,2)="  " THEN 2140
2120 S1=INT(S1-X1):S2=INT(S2-X2):PRINT"Warp engines shut down at ";
2130 PRINT "sector";S1;",";S2;"due to bad navigation.":GOTO 2150
2140 NEXT I:S1=INT(S1):S2=INT(S2)
2150 A$=CHR$(204)+CHR$(144)+CHR$(185)
2160 Z1=INT(S1):Z2=INT(S2):GOSUB 4830:GOSUB 2390:T8=1
2170 IF W1<1 THEN T8=0.1*INT(10*W1)
2180 T=T+T8:IF T>T0+T9 THEN 3480
2190 REM see if docked then get command
2200 GOTO 1510
2210 REM exceeded quadrant limits
2220 X=8*Q1+X+N*X1:Y=8*Q2+Y+N*X2:Q1=INT(X/8):Q2=INT(Y/8):S1=INT(X-Q1*8)
2230 S2=INT(Y-Q2*8):IF S1=0 THEN Q1=Q1-1:S1=8
2240 IF S2=0 THEN Q2=Q2-1:S2=8
2250 X5=0:IF Q1<1 THEN X5=1:Q1=1:S1=1
2260 IF Q1>8 THEN X5=1:Q1=8:S1=8
2270 IF Q2<1 THEN X5=1:Q2=1:S2=1
2280 IF Q2>8 THEN X5=1:Q2=8:S2=8
2290 IF X5=0 THEN 2360
2300 PRINT"Lt. Uhura reports message from Starfleet Command:"
2310 PRINT"  'Permission to attempt crossing of galactic perimeter"
2320 PRINT"  is hereby *DENIED*.  Shut down your engines.'"
2330 PRINT"Chief Engineer Scott reports 'Warp engines shut down"
2340 PRINT"  at sector";S1;",";S2;"of quadrant";Q1;",";Q2".'"
2350 IF T>T0 THEN 3480
2360 IF 8*Q1+Q2=8*Q4+Q5 THEN 2150
2370 T=T+1:GOSUB 2390:GOTO 1280
2380 REM maneuver energy s/r **
2390 E=E-N-10:IF E>0 THEN RETURN
2400 PRINT"Shield control supplies energy to complete the maneuver."
2410 S=S+E:E=0:IF S<=0 THEN S=0
2420 RETURN
2430 REM long range sensor scan code
2440 IF D(3)<0 THEN PRINT"Long Range Sensors are inoperable":GOTO 1520
2450 PRINT"Long Range Scan for quadrant";Q1;",";Q2
2460 O1$="-------------------":PRINT O1$
2470 FOR I=Q1-1 TO Q1+1:N(1)=-1:N(2)=-2:N(3)=-3:FOR J=Q2-1 TO Q2+1
2480 IF I>0 AND I<9 AND J>0 AND J<9 THEN N(J-Q2+2)=G(I,J):Z(I,J)=G(I,J)
2490 NEXT J:FOR L=1 TO 3:PRINT": ";:IF N(L)<0 THEN PRINT"*** ";:GOTO 2510
2500 PRINT RIGHT$(STR$(N(L)+1000),3);" ";
2510 NEXT L:PRINT":":PRINT O1$:NEXT I:GOTO 1520
2520 REM phaser control code begins here
2530 IF D(4)<0 THEN PRINT"Phasers Inoperative":GOTO 1520
2540 IF K3>0 THEN 2570
2550 PRINT"Science Officer Spock reports  'Sensors show no enemy ships"
2560 PRINT"                                in this quadrant'":GOTO 1520
2570 IF D(8)<0 THEN PRINT"Computer failure hampers accuracy"
2580 PRINT"Phasers locked on target;  :;
2590 PRINT"Energy available = ";E;"units"
2600 INPUT"Numbers of units to fire";X:IF X<=0 THEN 1520
2610 IF E-X<0 THEN 2590
2620 E=E-X:GOSUB 5420:IF D(7)<0 THEN X=X*RND(1)
2630 H1=INT(X/K3):FOR I=1 TO 3:IF K(I,3)<=0 THEN 2730
2640 H=INT((H1/FND(0))*(RND(1)+2)):IF H>0.15*K(I,3) THEN 2660
2650 PRINT"Sensors show no damage to enemy at ";K(I,1);",";K(I,2):GOTO 2730
2660 K(I,3)=K(I,3)-H:PRINT H;"Unit hit on Klingon at sector";K(I,1);",";
2670 PRINT K(I,2):IF K(I,3)> 0 THEN GOTO 2700
2680 COLOR 16,7:PRINT "**** KLINGON DESTROYED ****";:COLOR 7,0 :PRINT SPC(53)
2690 GOTO 2710
2700 PRINT"   (Sensors show";K(I,3);"units remaining)":GOTO 2730
2710 K3=K3-1:K9=K9-1:Z1=K(I,1):Z2=K(I,2):A$="   ":GOSUB 4830
2720 K(I,3)=0:G(Q1,Q2)=G(Q1,Q2)-100:Z(Q1,Q2)=G(Q1,Q2):IF K9<=0 THEN 3680
2730 NEXT I:GOSUB 3350:GOTO 1520
2740 REM photon torpedo code begins here
2750 IF P<=0 THEN PRINT"All photon torpedoes expended":GOTO 1520
2760 IF D(5)<0 THEN PRINT"Photon tubes are not operational":GOTO 1520
2770 INPUT"Photon torpedo course (1-9)";C1:IF C1=9 THEN C1=1
2780 IF C1>=1 AND C1<9 THEN 2810
2790 PRINT"Ensign Chekov reports,  'Incorrect course data, sir!'"
2800 GOTO 1520
2810 X1=C(C1,1)+(C(C1+1,1)-C(C1,1))*(C1-INT(C1)):E=E-2:P=P-1
2820 X2=C(C1,2)+(C(C1+1,2)-C(C1,2))*(C1-INT(C1)):X=S1:Y=S2 :GOSUB 5360
2830 PRINT"Torpedo track:"
2840 X=X+X1:Y=Y+X2:X3=INT(X+0.5):Y3=INT(Y+0.5)
2850 IF X3<1 OR X3>8 OR Y3<1 OR Y3>8 THEN 3070
2860 PRINT"              ";X3;",";Y3:A$="   ":Z1=X:Z2=Y:GOSUB 4990
2870 IF Z3<>0 THEN 2840
2880 A$="+"+CHR$(2)+"+":Z1=X:Z2=Y:GOSUB 4990:IF Z3=0 THEN 2940
2890 COLOR 16,7 :PRINT"**** KLINGON DESTROYED ****";:COLOR 7,0:PRINT SPC(53)
2900 K3=K3-1:K9=K9-1:IF K9<=0 THEN 3680
2910 FOR I=1 TO 3:IF X3=K(I,1) AND Y3=K(I,2) THEN 2930
2920 NEXT I:I=3
2930 K(I,3)=0:GOTO 3050
2940 A$=" "+CHR$(15)+" ":Z1=X:Z2=Y:GOSUB 4990:IF Z3=0 THEN 2960
2950 PRINT"Star at";X3;",";Y3;"absorbed torpedo energy.":GOSUB 3350:GOTO 1520
2960 A$=CHR$(174)+CHR$(127)+CHR$(175):Z1=X:Z2=Y:GOSUB 4990:IF Z3=0 THEN 2770
2970 COLOR 16,7:PRINT"*** STARBASE DESTROYED ***";:COLOR 7,0:PRINT SPC(54)
2980 B3=B3-1 : B9=B9-1
2990 IF B9>0 OR K9>T-T0-T9 THEN 3030
3000 PRINT"THAT DOES IT, CAPTAIN!!  You are hereby relieved of command"SPC(21)
3010 PRINT"and sentenced to 99 stardates of hard labor on CYGNUS 12!!"
3020 GOTO 3510
3030 PRINT"Starfleet reviewing your record to consider"
3040 PRINT"court martial!":D0=0
3050 Z1=X:Z2=Y:A$="   ":GOSUB 4830
3060 G(Q1,Q2)=K3*100+B3*10+S3:Z(Q1,Q2)=G(Q1,Q2):GOSUB 3350:GOTO 1520
3070 PRINT"Torpedo missed":GOSUB 3350:GOTO 1520
3080 REM shield control
3090 IF D(7)<0 THEN PRINT"Shield control inoperable":GOTO 1520
3100 PRINT"Energy available = ";E+S :INPUT "Number of units to shields? ";X
3110 IF X<0 OR S=X THEN PRINT"<shields unchanged>":GOTO 1520
3120 IF X<E+S THEN 3150
3130 PRINT"Shield Control reports  'This is not the federation treasury.'"
3140 PRINT"<shields unchanged>:goto 1990
3150 E=E+S-X:S=X:PRINT"Deflector Control Room report:"
3160 PRINT"  'Shields now at";INT(S);"units per your command.'":GOTO 1520
3170 REM damage control
3180 IF D(6)>=0 THEN 3290
3190 PRINT"Damage control report not available":IF D0=0 THEN 1520
3200 D3=0:FOR I=1 TO 8:IF D(I)<0 THEN D3=D3+1
3210 NEXT I:IF D3=0 THEN 1520
3220 PRINT:D3=D3+D4:IF D3>=1 THEN D3=0.9
3230 PRINT"Technicians standing by to effect repairs to your ship;"
3240 PRINT"estimated time to repair:";0.01*INT(100*D3);"stardates"
3250 INPUT"Will you authorize the repair order (Y/N)?";A$
3260 IF A$<>"y" AND A$<> "Y" THEN 1520
3270 FOR I=1 TO 8:IF D(I)<0 THEN D(I)=0
3280 NEXT I:T=T+D3+0.1
3290 PRINT:PRINT"Device            state of repair":FOR R1=1 TO 8
3300 GOSUB 4890:PRINT G2$;:GG2$=LEFT$(Z$,25-LEN(G2$)):PRINT GG2$;
3310 GG2=INT(D(R1)*100)*0.01:PRINT GG2
3320 NEXT R1:PRINT:IF D0<>0 THEN 3200
3330 GOTO 1520
3340 REM klingons shooting
3350 IF K3<=0 THEN RETURN
3360 IF D0<>0 THEN PRINT"Starbase shields protect the ENTERPRISE":RETURN
3370 FOR I=1 TO 3:IF K(I,3)<=0 THEN 3460
3380 H=INT((K(I,3)/FND(1))*(2+RND(1))):S=S-H:K(I,3)=K(I,3)/(3+RND(0))
3390 COLOR 16,7 :PRINT "ENTERPRISE HIT!";:COLOR 7,0:PRINT SPC(65)
3400 GOSUB 5480:PRINT H;"Unit hit on ENTERPRISE from sector";K(I,1);",";K(I,2)
3410 IF S<=0 THEN 3490
3420 PRINT"      <shields down to";S;"units>":IF H<20 THEN 3460
3430 IF RND(1)>0.6 OR H/S<=0.02 THEN 3460
3440 R1=FNR(1):D(R1)=D(R1)-H/S-0.5*RND(1):GOSUB 4890
3450 PRINT"Damage control reports  '";G2$;" damaged by the hit'"
3460 NEXT I:RETURN
3470 REM end of game
3480 PRINT"It is stardate";T:GOTO 3510
3490 PRINT:PRINT"the ENTERPRISE has been destroyed.  The Federation ";
3500 PRINT"will be conquered":GOTO 3480
3510 PRINT"There were";K9;"Klingon battle cruisers left at"
3520 PRINT"the end of your mission"
3530 PRINT:PRINT:IF B9=0 THEN 3670
3540 PRINT"The Federation is in need of a new starship commander"
3550 PRINT"for a similar mission -- if there is a volunteer,"
3560 INPUT"let him or her step forward and enter 'aye'";A$:IF A$="aye" THEN 520
3570 KEY 1,"LIST "
3580 KEY 2,"RUN"+CHR$(13)
3590 KEY 3,"LOAD"+CHR$(34)
3600 KEY 4, "SAVE"+CHR$(34)
3610 KEY 5, "CONT"+CHR$(13)
3620 KEY 6,","+CHR$(34)+"LPT1:"+CHR$(34)+CHR$(13)
3630 KEY 7, "TRON"+CHR$(13)
3640 KEY 8, "TROFF"+CHR$(13)
3650 KEY 9, "KEY "
3660 KEY 10,"SCREEN 0,0,0"+CHR$(13)
3670 LOAD"MENU",R
3680 PRINT"Congratulations, Captain! the last Klingon battle cruiser"
3690 PRINT"menacing the Federation has been destroyed.":PRINT
3700 PRINT"Your efficiency rating is";1000*(K7/(T-T0))^2:GOTO 3530
3710 REM short range sensor scan & startup subroutine
3720 FOR I=S1-1 TO S1+1:FOR J=S2-1 TO S2+1
3730 IF INT(I+0.5)<1 OR INT(I+0.5)>8 OR INT(J+0.5)<1 OR INT(J+0.5)>8 THEN 3760
3740 A$=CHR$(174)+CHR$(127)+CHR$(175)
3750 Z1=I:Z2=J:GOSUB 4990:IF Z3=1 THEN 3770
3760 NEXT J:NEXT I:D0=0:GOTO 3790
3770 D0=1:CC$="docked":E=E0:P=P0
3780 PRINT"Shields dropped for docking purposes":S=0:GOTO 3810
3790 IF K3>0 THEN C$="*red*":GOTO 3810
3800 C$="GREEN":IF E<E0*0.1 THEN C$="YELLOW"
3810 IF D(2)>=0 THEN 3830
3820 PRINT:PRINT"*** Short Range Sensors are out ***":PRINT:RETURN
3830 O1$="---------------------------------":PRINT O1$:FOR I=1 TO 8
3840 FOR J=(I-1)*24+1 TO (I-1)*24+22 STEP 3
3850 QQ$=MID$(Q$,J,3):IF QQ$="   " THEN QQ$=" "+CHR$(250)+" "
3860 PRINT" "; QQ$; : NEXT J
3870 ON I GOTO 3880,3900,3910,3920,3930,3940,3950,3960
3880 PRINT"        Stardate          ";
3890 TT= T*10 : TT=INT(TT)*0.1:PRINT TT :GOTO 3970
3900 PRINT"        Condition          ";C$:GOTO 3970
3910 PRINT"        Quadrant          ";Q1;",";Q2:GOTO 3970
3920 PRINT"        Sector            ";S1;",";S2:GOTO 3970
3930 PRINT"        Photon torpedoes  ";INT(P):GOTO 3970
3940 PRINT"        Total energy      ";INT(E+S):GOTO 3970
3950 PRINT"        Shields           ";INT(S):GOTO 3970
3960 PRINT"        Klingons remaining";INT(K9)
3970 NEXT I:PRINT O1$:RETURN
3980 REM library computer code
3990 CM1$="GALSTATORBASDIRREG"
4000 IF D(8)<0 THEN PRINT"Computer Disabled":GOTO 1520
4010 KEY 1, "GAL RCD"+CHR$(13)
4020 KEY 2, "STATUS"+CHR$(13)
4030 KEY 3, "TOR DATA"+CHR$(13)
4040 KEY 4, "BASE NAV"+CHR$(13)
4050 KEY 5, "DIR/DIST"+CHR$(13)
4060 KEY 6, "REG MAP"+CHR$(13)
4070 KEY 7,CHR$(13):KEY 8,CHR$(13):KEY 9,CHR$(13):KEY 10,CHR$(13)
4080 INPUT"Computer active and awaiting command";CM$:H8=1
4090 FOR K= 1 TO 6
4100   IF LEFT$(CM$,3)<>MID$(CM1$,3*K-2,3) THEN 4120
4110   ON K GOTO 4230,4400,4490,4750,4550,4210
4120 NEXT K
4130 PRINT"Functions available from library-computer:"
4140 PRINT"   KEY 1= Cumulative galactic record"
4150 PRINT"   KEY 2 = Status report"
4160 PRINT"   KEY 3 = Photon torpedo data"
4170 PRINT"   KEY 4 = Starbase nav data"
4180 PRINT"   KEY 5 = Direction/distance calculator"
4190 PRINT"   KEY 6 = Galaxy 'region name' map":PRINT:GOTO 4080
4200 REM setup to change cum gal record to galaxy map
4210 GOSUB 840:H8=0:G5=1:PRINT"                        the galaxy":GOTO 4290
4220 REM cum galactic record
4230 'INPUT"Do you want a hardcopy? Is the TTY on (Y/N)";A$
4240 'IF A$="y" THEN POKE 1229,2:POKE 1237,3:NULL 1
4250 GOSUB 840
4260 PRINT:PRINT"            ";
4270 PRINT "Computer record of galaxy for quadrant";Q1;",";Q2
4280 PRINT
4290 PRINT"       1     2     3     4     5      6    7      8"
4300 O1$="     ----- ----- ----- ----- ----- ------ ----- -----"
4310 PRINT O1$:FOR I=1 TO 8:PRINT I;:IF H8=0 THEN 4350
4320 FOR J=1 TO 8:PRINT"   ";:IF Z(I,J)=0 THEN PRINT"***";:GOTO 4340
4330 PRINT RIGHT$(STR$(Z(I,J)+1000),3);
4340 NEXT J:GOTO 4370
4350 Z4=I:Z5=1:GOSUB 5040:J0=INT(15-0.5*LEN(G2$)):PRINT TAB(J0);G2$;
4360 Z5=5:GOSUB 5040:J0=INT(39-0.5*LEN(G2$)):PRINT TAB(J0);G2$;
4370 PRINT:PRINT O1$:NEXT I:PRINT:'POKE 1229,0:POKE 1237,1:
4380 GOTO 1520
4390 REM status report
4400 GOSUB 840:PRINT"   Status Report:"X$="":IF K9>1 THEN X$="s"
4410 PRINT"Klingon";X$;" left: ";K9
4420 PRINT"Mission must be completed in";0.1*INT((T0+T9-T)*10);"stardates"
4430 X$="s":IF B9<2 THEN X$="":IF B9<1 THEN 4460
4440 PRINT"The federation is maintaining";B9;"starbase";X$;"in the galaxy"
4450 GOTO 3180
4460 PRINT"Your stupidity has left you on your own in"
4470 PRINT"    the galaxy -- you have no starbases left!":GOTO 3180
4480 REM torpedo, base nav, d/d calculator
4490 GOSUB 840:IF K3<=0 THEN 2550
4500 X$="":IF K3>1 THEN X$="s"
4510 PRINT"From ENTERPRISE to Klingon battle cruiser";X$
4520 H8=0:FOR I=1 TO 3:IF K(I,3)<=0 THEN 4740
4530 W1=K(I,1):X=K(I,2)
4540 C1=S1:A=S2:GOTO 4590
4550 GOSUB 840:PRINT"Direction/Distance Calculator:"
4560 PRINT"You are at quadrant ";Q1;",";Q2;" sector ";S1;",";S2
4570 PRINT"Please enter":INPUT" initial coordinates (x,y)";C1,A
4580 INPUT" Final coordinates (x,y)";W1,X
4590 X=X-A: A=C1-W1:IF X<0 THEN 4670
4600 IF A<0 THEN 4690
4610 IF X>0 THEN 4630
4620 IF A=0 THEN C1=5:GOTO 4640
4630 C1=1
4640 IF ABS(A)<=ABS(X) THEN 4660
4650 PRINT"Direction =";C1+(((ABS(A)-ABS(X))+ABS(A))/ABS(A)):GOTO 4730
4660 PRINT"Direction =";C1+(ABS(A)/ABS(X)):GOTO 4730
4670 IF A>0 THEN C1=3:GOTO 4700
4680 IF X<>0 THEN C1=5:GOTO 4640
4690 C1=7
4700 IF ABS(A)>=ABS(X) THEN 4720
4710 PRINT"Direction =";C1+(((ABS(X)-ABS(A))+ABS(X))/ABS(X)):GOTO 4730
4720 PRINT"Direction =";:CC1=C1+(ABS(X)/ABS(A)):PRINT CC1
4730 PRINT"Distance =";SQR(X^2+A^2):IF H8=1 THEN 1520
4740 NEXT I:GOTO 1520
4750 GOSUB 840:IF B3<>0 THEN PRINT"From ENTERPRISE to Starbase:":W1=B4:X=B5
4760 GOTO 4540
4770 PRINT"Mr. Spock reports, 'Sensors show no starbases in this";
4780 PRINT"quadrant.'":GOTO 1520
4790 REM find empty place in quadrant (for things)
4800 R1=FNR(1):R2=FNR(1):A$="   ":Z1=R1:Z2=R2:GOSUB 4990:IF Z3=0 THEN 4800
4810 RETURN
4820 REM insert in string array for quadrant
4830 S8=INT(Z2-0.5)*3+INT(Z1-0.5)*24+1
4840 IF LEN(A$)<>3 THEN PRINT"ERROR":STOP
4850 IF S8=1 THEN Q$=A$+RIGHT$(Q$,189):RETURN
4860 IF S8=190 THEN Q$=LEFT$(Q$,189)+A$:RETURN
4870 Q$=LEFT$(Q$,S8-1)+A$+RIGHT$(Q$,190-S8):RETURN
4880 REM prints device name
4890 ON R1 GOTO 4900,4910,4920,4930,4940,4950,4960,4970
4900 G2$="Warp Engines":RETURN
4910 G2$="Short Range Sensors":RETURN
4920 G2$="Long Range Sensors":RETURN
4930 G2$="Phaser Control":RETURN
4940 G2$="Photon Tubes":RETURN
4950 G2$="Damage Control":RETURN
4960 G2$="Shield Control":RETURN
4970 G2$="Library-Computer":RETURN
4980 REM string comparison in quadrant array
4990 Z1=INT(Z1+0.5):Z2=INT(Z2+0.5):S8=(Z2-1)*3+(Z1-1)*24+1:Z3=0
5000 IF MID$(Q$,S8,3)<>A$ THEN RETURN
5010 Z3=1:RETURN
5020 REM quadrant name in g2$ from z4,z5 (=q1,q2)
5030 REM call with g5=1 to get region name only
5040 IF Z5<+4 THEN ON Z4 GOTO 5060,5070,5080,5090,5100,5110,5120,5130
5050 GOTO 5140
5060 G2$="Antares":GOTO 5230
5070 G2$="Rigel":GOTO 5230
5080 G2$="Procyon":GOTO 5230
5090 G2$="Vega":GOTO 5230
5100 G2$="Canopus":GOTO 5230
5110 G2$="Altair":GOTO 5230
5120 G2$="Sagittarius":GOTO 5230
5130 G2$="Pollux":GOTO 5230
5140 ON Z4 GOTO 5150,5160,5170,5180,5180,5200,5210,5220
5150 G2$="Sirius":GOTO 5230
5160 G2$="Deneb":GOTO 5230
5170 G2$="Capella":GOTO 5230
5180 G2$="Betelgeuse":GOTO 5230
5190 G2$="Aldebaran":GOTO 5230
5200 G2$="Regulus":GOTO 5230
5210 G2$="Arcturus":GOTO 5230
5220 G2$="Spica"
5230 IF G5<>1 THEN ON Z5 GOTO 5250,5260,5270,5280,5250,5260,5270,5280
5240 RETURN
5250 G2$=G2$+" i":RETURN
5260 G2$=G2$+" ii":RETURN
5270 G2$=G2$+" iii":RETURN
5280 G2$=G2$+" iv":RETURN
5290 '    red alert sound
5300 FOR J= 1 TO 4
5310   FOR K=1000 TO 2000 STEP 20
5320     SOUND K,0.01*18.2
5330   NEXT K
5340 NEXT J
5350 RETURN
5360 '   torpedo sound
5370 FOR J = 1500 TO 100 STEP -20
5380   SOUND J,0.01*18.2
5390   SOUND 3600-J,0.01*18.2
5400 NEXT J
5410 RETURN
5420 '    phaser sound
5430 FOR J= 1 TO 40
5440   SOUND 800,0.01*18.2
5450   SOUND 2500,0.008*18.2
5460 NEXT J
5470 RETURN
5480 '           alarm sound
5490 FOR SI = 1 TO 3
5500  FOR J=  800 TO 1500 STEP 20
5510    SOUND J,0.01 *18.2
5520  NEXT J
5530  FOR K = 1500 TO 800 STEP -20
5540    SOUND K, 0.01 *18.2
5550  NEXT K
5560 NEXT SI
5570 RETURN
