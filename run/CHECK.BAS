10  KEY OFF:DEF SEG:SCREEN 0,0,0:KEY(10) ON:ON KEY(10) GOSUB 510
20 FOR A=1 TO 9:KEY(A) ON:ON KEY(A) GOSUB 70:NEXT:ON ERROR GOTO 750
30  GOTO 80
40  POKE 106,0
50  IF INKEY$<>"" THEN 40
60  RS$=INKEY$:IF RS$="" THEN 60
70  RETURN
80  GOSUB 90:GOSUB 140:GOSUB 40:GOSUB 90:GOSUB 350:RUN"menu
90 CLS:PRINT:COLOR 0,7:PRINT" F10 ";:COLOR 7,0:PRINT" To Menu":COLOR 11,0
100 FOR I=1 TO 3 STEP 2:FOR J=20 TO 62:LOCATE I,J,0:PRINT"Ä":NEXT:NEXT
110 LOCATE 1,19:PRINT"Ú":LOCATE 1,63:PRINT"¿":LOCATE 3,63:PRINT"Ù":LOCATE 3,19:PRINT"À"
120 LOCATE 2,19:PRINT"³"SPC(43)"³"
130 RETURN
140 COLOR 0,7
160 LOCATE 2,27,0:PRINT" C H E C K   R E G I S T E R ":COLOR 7,0
170 LOCATE 5,10:PRINT"The Check Register program  is designed to  assist you with one
180 LOCATE 6,10:PRINT"of the most boring and thankless tasks known to man - balancing
190 LOCATE 7,10:PRINT"and reconciling your checking account(s). It combines the speed
200 LOCATE 8,10:PRINT"and accuracy of your computer  to help you maintain and monitor
210 LOCATE 9,10:PRINT"a virtually unlimited number of checking accounts.
220 LOCATE 11,10:PRINT"The program requires  the use of  separate data diskettes:  one
230 LOCATE 12,10:PRINT"data diskette for each account, and one "CHR$(34)"MASTER"CHR$(34)" check register
240 LOCATE 13,10:PRINT"diskette for every 10 checking accounts. You should label these
250 LOCATE 14,10:PRINT"diskettes as follows:  "CHR$(34)"CHECK REGISTER MASTER DISKETTE"CHR$(34)" for the
260 LOCATE 15,10:PRINT"master and  "CHR$(34)"DATA DISKETTE #__, ACCOUNT #_______, 19__"CHR$(34)" for the
270 LOCATE 16,10:PRINT"individual account diskettes.
280 LOCATE 18,10:PRINT"The  CHECK REGISTER MASTER DISKETTE  must be formatted and must
290 LOCATE 19,10:PRINT"contain BASICA.COM. To accomplish that, refer to your Friendly-
300 LOCATE 20,10:PRINT"Ware manual, pages I and II. To format the master diskette fol-
310 LOCATE 21,10:PRINT"low instructions 2 thru 6 on page I.To copy BASICA.COM onto the
320 LOCATE 22,10:PRINT"master follow instructions 8 and 9 on page II.
330 LOCATE 25,27:PRINT"Strike Any Key To Continue";
340 RETURN
350 LOCATE 2,27:COLOR 0,7:PRINT" C H E C K   R E G I S T E R ":COLOR 7,0
360 LOCATE 7,18:PRINT"You must have a formatted  MASTER diskette with
370 LOCATE 8,21:PRINT"BASICA.COM on it  AND a blank, formatted
380 LOCATE 9,31:PRINT"diskette to continue.
390 LOCATE 11,31:PRINT"ARE YOU READY? (Y/N)
400 DEF SEG:POKE 106,0:IF INKEY$<>"" THEN 400
410 A$=INKEY$:IF A$="" THEN 410
420 IF A$="Y" OR A$="y" THEN 440
430 IF A$="N" OR A$="n" THEN RETURN ELSE 410
440 LOCATE 17,21:PRINT"You MUST follow the screen instructions
450 LOCATE 18,23:PRINT"to completion or errors will occur.
460 LOCATE 20,31:PRINT"ARE YOU READY? (Y/N)
470 DEF SEG:POKE 106,0:IF INKEY$<>"" THEN 470
480 A$=INKEY$:IF A$="" THEN 480
490 IF A$="Y" OR A$="y" THEN 520
500 IF A$="N" OR A$="n" THEN RETURN ELSE 480
510 RUN"menu
520 CLS
720 GOSUB 740:CLOSE:CHAIN"info.sys",4250
730 ERX=0:CLOSE:OPEN "I",1,"MENU.BAS":IF ERX=0 THEN ERROR 200 ELSE RETURN
740 CLOSE:OPEN "I",1,"MENU.BAS":RETURN
750 ERX=1
754 IF ERR=70 OR ERR=72 OR ERR=71 THEN MG$="         Disk Not Ready":GOTO 790
755 IF ERR=200 THEN MG$="Insert `CHECK REGISTER' Diskette":GOTO 790
760 IF ERL=730 THEN RESUME 9000
770 IF ERL=740 THEN MG$="Insert FriendlyWare Diskette #3":GOTO 790
780 GOTO 800
790 BEEP:COLOR 31,0:LOCATE 24,20:PRINT MG$;
800 LOCATE 25,20:COLOR 7,0:PRINT"Strike Any Key When Ready <ESC> To Abort";
810 GOSUB 60:IF RS$=CHR$(27) THEN RESUME 820 ELSE LOCATE 24,1:PRINT SPC(79);:LOCATE 25,1:PRINT SPC(79);:IF ERL=730 THEN RESUME 730 ELSE IF ERL=740 THEN RESUME 740 ELSE RESUME
820 GOSUB 740:RUN"menu
9000 RETURN
