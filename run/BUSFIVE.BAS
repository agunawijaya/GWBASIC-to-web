10 DEF SEG:SCREEN 0,0,0:KEY(10) ON:ON KEY(10) GOSUB 1100
20 FOR A=1 TO 9:KEY(A) ON:ON KEY(A) GOSUB 70:NEXT:DEFSTR A-E,J,L
30 A="º":B="Í":C="³":D="Ë":E="É":GOTO 80
40 POKE 106,0
50 IF INKEY$<>"" THEN 40
60 RESP$=INKEY$:IF RESP$="" THEN 60
70 RETURN
80 CLS:GOSUB 910:GOSUB 750:GOSUB 100:GOSUB 40
90 CLS:NO=1:GOSUB 910:GOSUB 1000:GOSUB 40:RUN"BUSSIX"
100 JA=E+B+B
110 JA=JA+"Ë":FOR I=1 TO 18:JA=JA+"Í":NEXT
120 JA=JA+"Ë":FOR I=1 TO 13:JA=JA+"Í":NEXT
130 JA=JA+"Ë":FOR I=1 TO 13:JA=JA+"Í":NEXT
140 JA=JA+"Ë":FOR I=1 TO 13:JA=JA+"Í":NEXT
150 JA=JA+"Ë":FOR I=1 TO 13:JA=JA+"Í":NEXT
160 JA=JA+"»"
170 JB="ºNOº  ACCOUNT NAME    ºTRIAL BALANCEº ADJUSTMENTS º  INCOME ST  ºBALANCE SHEETº"
180 JC="º  º                  º DEB     CRD º DEB     CRD º DEB     CRD º DEB     CRD º"
190 JD="Ì"+B+B
200 JD=JD+"Î":FOR I=1 TO 18:JD=JD+"Í":NEXT
210 JD=JD+"Î":FOR I=1 TO 6:JD=JD+"Í":NEXT
220 JD=JD+"Ñ":FOR I=1 TO 6:JD=JD+"Í":NEXT
230 JD=JD+"Î":FOR I=1 TO 6:JD=JD+"Í":NEXT
240 JD=JD+"Ñ":FOR I=1 TO 6:JD=JD+"Í":NEXT
250 JD=JD+"Î":FOR I=1 TO 6:JD=JD+"Í":NEXT
260 JD=JD+"Ñ":FOR I=1 TO 6:JD=JD+"Í":NEXT
270 JD=JD+"Î":FOR I=1 TO 6:JD=JD+"Í":NEXT
280 JD=JD+"Ñ":FOR I=1 TO 6:JD=JD+"Í":NEXT
290 JD=JD+"¹"
300 JE="º11º CASH             º14,240³      º      ³ 1,750º      ³      º12,490³      º"
310 JF="º12º ACCOUNTS REC.    º 1,695³      º      ³      º      ³      º 1,695³      º"
320 JG="º14º SUPPLIES         º 5,655³      º      ³      º      ³      º 5,655³      º"
330 JH="º21º ACCOUNTS PAYABLE º      ³ 3,500º      ³      º      ³      º      ³ 3,500º"
340 JI="º31º OWNER CAPITAL    º      ³14,700º      ³      º      ³      º      ³14,700º"
350 JJ="º32º OWNER WITHDRAWAL º   860³      º      ³      º      ³      º   860³      º"
360 JK="º41º SALES            º      ³12,045º      ³      º      ³12,045º      ³      º"
370 JL="º51º SALARY EXPENSE   º 1,750³      º 1,750³      º 3,500³      º      ³      º"
380 JM="º52º SUPPLIES EXPENSE º 6,045³      º      ³      º 6,045³      º      ³      º"
390 JN="º  º                  "+"Ç":FOR I=1 TO 6:JN=JN+"Ä":NEXT:JN=JN+"Å"
400 FOR I=1 TO 6:JN=JN+"Ä":NEXT:JN=JN+"¶"
410 JN=JN+"      ³      º      ³      º      ³      º"
420 JO="º  º                  º30,245³30,245"+"Ç"
430 FOR I=1 TO 6:JO=JO+"Ä":NEXT:JO=JO+"Å"
440 FOR I=1 TO 6:JO=JO+"Ä":NEXT:JO=JO+"×"
450 FOR I=1 TO 6:JO=JO+"Ä":NEXT:JO=JO+"Å"
460 FOR I=1 TO 6:JO=JO+"Ä":NEXT:JO=JO+"×"
470 FOR I=1 TO 6:JO=JO+"Ä":NEXT:JO=JO+"Å"
480 FOR I=1 TO 6:JO=JO+"Ä":NEXT:JO=JO+"¶"
490 JP="º  º                  Ì"
500 FOR I=1 TO 6:JP=JP+"Í":NEXT:JP=JP+"Ø"
510 FOR I=1 TO 6:JP=JP+"Í":NEXT:JP=JP+"¹"
520 JP=JP+" 1,750³ 1,750º 9,545³12,045º20,700³18,200º"
530 JQ="º  º NET INCOME       º      ³      Ì"
540 FOR I=1 TO 6:JQ=JQ+"Í":NEXT:JQ=JQ+"Ø"
550 FOR I=1 TO 6:JQ=JQ+"Í":NEXT:JQ=JQ+"¹"
560 JQ=JQ+" 2,500³      º      ³ 2,500º"
570 JR="º  º                  º      ³      º      ³      "+"Ç"
580 FOR I=1 TO 6:JR=JR+"Ä":NEXT:JR=JR+"Å"
590 FOR I=1 TO 6:JR=JR+"Ä":NEXT:JR=JR+"×"
600 FOR I=1 TO 6:JR=JR+"Ä":NEXT:JR=JR+"Å"
610 FOR I=1 TO 6:JR=JR+"Ä":NEXT:JR=JR+"¶"
620 JS="º  º                  º      ³      º      ³      º12,045³12,045º20,700³20,700º"
630 JZ="È"+B+B
640 JZ=JZ+"Ê":FOR I=1 TO 18:JZ=JZ+"Í":NEXT
650 JZ=JZ+"Ê":FOR I=1 TO 6:JZ=JZ+"Í":NEXT
660 JZ=JZ+"Ï":FOR I=1 TO 6:JZ=JZ+"Í":NEXT
670 JZ=JZ+"Ê":FOR I=1 TO 6:JZ=JZ+"Í":NEXT
680 JZ=JZ+"Ï":FOR I=1 TO 6:JZ=JZ+"Í":NEXT
690 JZ=JZ+"Ê":FOR I=1 TO 6:JZ=JZ+"Í":NEXT
700 JZ=JZ+"Ï":FOR I=1 TO 6:JZ=JZ+"Í":NEXT
710 JZ=JZ+"Ê":FOR I=1 TO 6:JZ=JZ+"Í":NEXT
720 JZ=JZ+"Ï":FOR I=1 TO 6:JZ=JZ+"Í":NEXT
730 JZ=JZ+"¼"
740 RETURN
750 LOCATE 7,20:PRINT"The WORKSHEET is a particular type of working"
760 PRINT;TAB(16);"paper employed by accountants as a preliminary to"
770 PRINT;TAB(16);"the preparation of financial statements.  Its use"
780 PRINT;TAB(16);"reduces the possibility of overlooking a need for"
790 PRINT;TAB(16);"an adjustment, will provide a convenient means of"
800 PRINT;TAB(16);"verifying arithmetical accuracy, and provides for"
810 PRINT;TAB(16);"the arrangement of data in a logical form."
820 PRINT;TAB(20);"A standard WORKSHEET has a column for account"
830 PRINT;TAB(16);"titles and eight money columns,  arranged in four"
840 PRINT;TAB(16);"pairs of debit and credit columns.  The principal"
850 PRINT;TAB(16);"headings of the four sets of columns are;":COLOR 11,0
860 PRINT
870 PRINT;TAB(18);"1) Trial balance          3) Income Statement"
880 PRINT;TAB(18);"2) Adjustments            4) Balance Sheet"
890 LOCATE 25,18:PRINT"***** Strike Any Key For The Worksheet *****";:COLOR 7,0
900 RETURN
910 PRINT:COLOR 0,7:PRINT" F10 ";:COLOR 7,0:PRINT" To Menu":COLOR 11,0
920 FOR I=1 TO 3 STEP 2:FOR H=20 TO 62:LOCATE I,H,0:PRINT "Ä":NEXT:NEXT
930 LOCATE 1,19:PRINT "Ú":LOCATE 1,63:PRINT "¿":LOCATE 3,63:PRINT "Ù":LOCATE 3,19:PRINT "À"
940 LOCATE 2,19:PRINT "³" SPC(43) "³"
950 COLOR 0,7
960 LOCATE 2,22:PRINT" B U S I N E S S   S I M U L A T I O N "
970 COLOR 11,0:LOCATE 4,27:PRINT"STEP VII. WORKSHEET PREPARED ":COLOR 7,0
980 IF NO=0 THEN COLOR 11,0:LOCATE 5,27:PRINT"----------------------------":COLOR 7,0
990 RETURN
1000 LOCATE 5,1:PRINT JA:PRINT JB:PRINT JC
1010 PRINT JD:PRINT JE:PRINT JF
1020 PRINT JG:PRINT JH:PRINT JI
1030 PRINT JJ:PRINT JK:PRINT JL
1040 PRINT JM:PRINT JN:PRINT JO
1050 PRINT JP:PRINT JQ:PRINT JR
1060 LOCATE 23,1:PRINT JS;
1070 LOCATE 24,1:PRINT JZ;
1080 COLOR 11,0:LOCATE 25,15:PRINT"***** Strike Any Key For Financial Statements *****";:COLOR 7,0
1090 RETURN
1100 RUN"menu"
