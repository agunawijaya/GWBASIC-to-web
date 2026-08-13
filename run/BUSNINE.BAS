10 DEF SEG:SCREEN 0,0,0:KEY(10) ON:ON KEY(10) GOSUB 530
20 FOR A=1 TO 9:KEY(A) ON:ON KEY(A) GOSUB 70:NEXT
30  GOTO 80
40  POKE 106,0
50  IF INKEY$<>"" THEN 40
60  RESP$=INKEY$:IF RESP$="" THEN 60
70  RETURN
80 CLS:GOSUB 110:GOSUB 250:GOSUB 40
90 CLS:GOSUB 110:GOSUB 200:GOSUB 330:GOSUB 40
100 RUN"BUSTEN"
110 PRINT:COLOR 0,7:PRINT" F10 ";:COLOR 7,0:PRINT" To Menu":COLOR 11,0
120 FOR I=1 TO 3 STEP 2:FOR J=20 TO 62:LOCATE I,J,0:PRINT "Ä":NEXT:NEXT
130 LOCATE 1,19,0:PRINT "Ú":LOCATE 1,63,0:PRINT "¿":LOCATE 3,63,0:PRINT "Ù":LOCATE 3,19,0:PRINT "À"
140 LOCATE 2,19,0:PRINT "³" SPC(43) "³"
150 COLOR 0,7
160 LOCATE 2,22,0:PRINT" B U S I N E S S   S I M U L A T I O N "
170 COLOR 11,0:LOCATE 4,24,0:PRINT"STEP XI. POST-CLOSING TRIAL BALANCE":COLOR 7,0
180 COLOR 11,0:LOCATE 5,24,0:PRINT"-----------------------------------":COLOR 7,0
190 RETURN
200 LOCATE 6,6,0:PRINT "É";:FOR I=7 TO 74:PRINT "Í";:NEXT
210 LOCATE 6,75:PRINT "»":FOR I=7 TO 23:LOCATE I,75:PRINT "º";:NEXT
220 LOCATE 24,75:PRINT "¼";:FOR I=74 TO 7 STEP-1:LOCATE 24,I:PRINT "Í";:NEXT
230 LOCATE 24,6:PRINT "È";:FOR I=23 TO 7 STEP-1:LOCATE I,6:PRINT "º":NEXT
240 RETURN
250 LOCATE 7,15:PRINT"      The final procedure of the accounting cycle is"
260    PRINT;TAB(15);"the Post-closing trial balance.  The purpose of this"
270    PRINT;TAB(15);"step is to assure that the ledgers are in balance at"
280    PRINT;TAB(15);"the beginning of the new accounting cycle. The items"
290    PRINT;TAB(15);"on the post-closing trial balance  should correspond"
300    PRINT;TAB(15);"exactly with those reported on the balance sheet."
310 COLOR 11,0:LOCATE 25,12:PRINT"***** Strike Any Key For Post-closing Trial Balance *****";:COLOR 7,0
320 RETURN
330 COLOR 11,0:LOCATE 7,31:PRINT"ABC Hardware Company"
340 LOCATE 8,28:PRINT"Post-closing Trial Balance"
350 LOCATE 9,34:PRINT"June 30 , 1982":COLOR 7,0
360 LOCATE 10,6:PRINT "Ç";:FOR I=7 TO 74:PRINT "Ä";:NEXT:PRINT "¶"
370 LOCATE 11,8:PRINT"Cash. . . . . . . . . . . . . . . . .     $12,490.00"
380 LOCATE 13,8:PRINT"Accounts receivable . . . . . . . . .      $1,695.00"
390 LOCATE 15,8:PRINT"Supplies. . . . . . . . . . . . . . .      $5,655.00"
400 LOCATE 17,8:PRINT"Accounts payable  . . . . . . . . . .                    $3,500.00"
410 LOCATE 19,8:PRINT"Homer Jones, capital  . . . . . . . .                   $16,340.00"
420 LOCATE 23,8:PRINT"                                          $19,840.00    $19,840.00"
430 LOCATE 10,47:PRINT "Â":LOCATE 10,61:PRINT "Â"
440 FOR I=11 TO 23:LOCATE I,47:PRINT "³":LOCATE I,61:PRINT "³":NEXT
450 LOCATE 24,47:PRINT "Ï";:LOCATE 24,61:PRINT "Ï";
460 LOCATE 21,47:PRINT "Ã"
470 FOR I=48 TO 60:LOCATE 21,I:PRINT "Ä":NEXT
480 LOCATE 21,61:PRINT "Å"
490 FOR I=62 TO 74:LOCATE 21,I:PRINT "Ä":NEXT
500 LOCATE 21,75:PRINT "¶"
510 COLOR 11,0:LOCATE 25,17:PRINT"***** Strike Any Key For Simulation Recap *****";:COLOR 7,0
520 RETURN
530 RUN"menu"
