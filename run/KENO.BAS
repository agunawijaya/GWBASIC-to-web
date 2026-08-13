10 'PC KENO by Steve Schlich 9/84
20 GAME=1
30 DEFINT A-Z
40 CLEAR
50 CLS:KEY OFF
55 CLS: PRINT "Do you want instructions (Y/N)?";
56 B$=INKEY$: IF B$="" THEN 56
57 IF B$="Y" OR B$="y" THEN 9000
60 CLS:DIM ROW(100)
70 DIM COL(100)
80 DIM CHOSEN(100)
90 DIM PICKED(100)
100 DIM PICK(100)
105 GAME=1
110 COLOR 6,0
120 FOR C1=1 TO 71 STEP 10: ROW(C1)=16: NEXT C1
130 FOR C1=2 TO 72 STEP 10: ROW(C1)=21: NEXT C1
140 FOR C1=3 TO 73 STEP 10: ROW(C1)=26: NEXT C1
150 FOR C1=4 TO 74 STEP 10: ROW(C1)=31: NEXT C1
160 FOR C1=5 TO 75 STEP 10: ROW(C1)=36: NEXT C1
170 FOR C1=6 TO 76 STEP 10: ROW(C1)=41: NEXT C1
180 FOR C1=7 TO 77 STEP 10: ROW(C1)=46: NEXT C1
190 FOR C1=8 TO 78 STEP 10: ROW(C1)=51: NEXT C1
200 FOR C1=9 TO 79 STEP 10: ROW(C1)=56: NEXT C1
210 FOR C1=10 TO 80 STEP 10: ROW(C1)=61: NEXT C1
220 FOR C1=1 TO 10: COL(C1)=2 : NEXT C1
230 FOR C1=11 TO 20: COL(C1)=4 : NEXT C1
240 FOR C1=21 TO 30: COL(C1)=6 : NEXT C1
250 FOR C1=31 TO 40: COL(C1)=8 : NEXT C1
260 FOR C1=41 TO 50: COL(C1)=12: NEXT C1
270 FOR C1=51 TO 60: COL(C1)=14: NEXT C1
280 FOR C1=61 TO 70: COL(C1)=16: NEXT C1
290 FOR C1=71 TO 80: COL(C1)=18: NEXT C1
300 PRINT TAB(15)"ษออออหออออหออออหออออหออออหออออหออออหออออหออออหออออป"
310 PRINT TAB(15)"บ 1  บ 2  บ 3  บ 4  บ 5  บ 6  บ 7  บ 8  บ 9  บ 10 บ      GAME"
320 PRINT TAB(15)"ฬออออฮออออฮออออฮออออฮออออฮออออฮออออฮออออฮออออฮออออน       1"
330 PRINT TAB(15)"บ 11 บ 12 บ 13 บ 14 บ 15 บ 16 บ 17 บ 18 บ 19 บ 20 บ"
340 PRINT TAB(15)"ฬออออฮออออฮออออฮออออฮออออฮออออฮออออฮออออฮออออฮออออน"
350 PRINT TAB(15)"บ 21 บ 22 บ 23 บ 24 บ 25 บ 26 บ 27 บ 28 บ 29 บ 30 บ"
360 PRINT TAB(15)"ฬออออฮออออฮออออฮออออฮออออฮออออฮออออฮออออฮออออฮออออน"
370 PRINT TAB(15)"บ 31 บ 32 บ 33 บ 34 บ 35 บ 36 บ 37 บ 38 บ 39 บ 40 บ"
380 PRINT TAB(15)"ศออออสออออสออออสออออสออออสออออสออออสออออสออออสออออผ"
390 COLOR 4,0
400 PRINT TAB(15)"         * * *   P C   *   K E N O   * * *         "
410 COLOR 6,0
420 PRINT TAB(15)"ษออออหออออหออออหออออหออออหออออหออออหออออหออออหออออป"
430 PRINT TAB(15)"บ 41 บ 42 บ 43 บ 44 บ 45 บ 46 บ 47 บ 48 บ 49 บ 50 บ"
440 PRINT TAB(15)"ฬออออฮออออฮออออฮออออฮออออฮออออฮออออฮออออฮออออฮออออน"
450 PRINT TAB(15)"บ 51 บ 52 บ 53 บ 54 บ 55 บ 56 บ 57 บ 58 บ 59 บ 60 บ"
460 PRINT TAB(15)"ฬออออฮออออฮออออฮออออฮออออฮออออฮออออฮออออฮออออฮออออน"
470 PRINT TAB(15)"บ 61 บ 62 บ 63 บ 64 บ 65 บ 66 บ 67 บ 68 บ 69 บ 70 บ"
480 PRINT TAB(15)"ฬออออฮออออฮออออฮออออฮออออฮออออฮออออฮออออฮออออฮออออน"
490 PRINT TAB(15)"บ 71 บ 72 บ 73 บ 74 บ 75 บ 76 บ 77 บ 78 บ 79 บ 80 บ"
500 PRINT TAB(15)"ศออออสออออสออออสออออสออออสออออสออออสออออสออออสออออผ"
510 LOCATE 25,22: COLOR 0,3: PRINT " your spot ";: LOCATE 25,35: COLOR 0,7: PRINT " drawn spot ";: LOCATE 25,49: COLOR 16,5: PRINT " a match ";: COLOR 6,0
520 N=0: 'input the player's numbers
525 LOCATE 21,5:PRINT"                           ":LOCATE 21,5
530 INPUT "How many spots (1-11)";SPOTS
535 IF SPOTS<1 OR SPOTS>11 THEN 520
540 FOR D2=1 TO SPOTS
550 LOCATE 21,5: PRINT "                   Spot #";D2;
555 INPUT SPOT
560 LOCATE 21,30:PRINT"        "
565 IF SPOT<1 OR SPOT>80 THEN 550
570 C1=SPOT
580 PICK(C1)=1
590 PICKED(C1)=1
600 GOSUB 760
610 NEXT D2
620 'chose 20 numbers
630 T$=RIGHT$(TIME$,2)
640 T=VAL(T$)
650 RANDOMIZE T
660 FOR D1=1 TO 20
670 CHOICE=INT(RND*80)+1
680 IF CHOSEN(CHOICE)<>1 THEN 700
690 D1=D1-1: GOTO 740
700 CHOSEN(CHOICE)=1
710 C1=CHOICE
720 GOSUB 760
730 FOR J=1 TO 400: NEXT J
740 NEXT D1
750 GOTO 880
760 'subroutine to put number up on screen
765 LOCATE 21,16: PRINT "Drawing numbers...";
770 IF PICKED(C1)=1 THEN COLOR 0,3: 'player picked this spot
780 IF CHOSEN(C1)<>1 THEN 840: 'spot is one of the 20
790 IF PICK(C1)<>1 THEN 830: 'this spot is a winner
800 MATCHES=MATCHES+1: 'up the score
810 COLOR 16,5
820 GOTO 840
830 COLOR 0,7
840 LOCATE COL(C1),ROW(C1)
850 PRINT C1;
860 COLOR 6,0
870 RETURN
880 LOCATE 21,1: COLOR 4,0
890 PRINT "               Spots matched:";MATCHES;"       P=Play same";SPOTS;"spots again."
900 PRINT "               N=play New spots.       Q=Quit."
910 A$=INKEY$: IF A$="" THEN 910
920 IF A$="N" OR A$="n" THEN 930 ELSE 940
930 N=1: FOR C1=1 TO 80: PICK(C1)=0: PICKED(C1)=0: NEXT C1: GOTO 970
940 IF A$="P" OR A$="p" THEN 970
950 IF A$="Q" OR A$="q" THEN LOAD"MENU",R
960 GOTO 910
970 ' clear board but retain player picks
980 MATCHES=0
990 LOCATE 21,16: PRINT"                                                   "
1000 LOCATE 22,16: PRINT"                                                   "
1010 FOR C2=1 TO 80
1020 CHOSEN(C2)=0
1030 IF PICK(C2)=1 THEN 1050
1040 COLOR 6,0: GOTO 1060
1050 COLOR 0,3
1060 LOCATE COL(C2),ROW(C2)
1070 PRINT C2
1075 COLOR 6,0
1080 NEXT C2
1082 GAME=GAME+1: LOCATE 3,72: PRINT GAME
1087 IF N=1 THEN 520
1090 GOTO 630
1100 LOAD"MENU",R
9000 CLS: COLOR 6,0: 'instructions
9010 PRINT"KENO has the worst odds of any casino game.  The `house' (in this case,"
9020 PRINT"your computer) draws 20 random numbers from 1 to 80 for each game."
9030 PRINT"You try to guess ahead of time which numbers (spots) will come up."
9040 PRINT:PRINT"You pick from 1 to 11 spots, and bet that at least some of your picks"
9050 PRINT"will come up.  Your payoff (if there is one) depends on the ratio between"
9060 PRINT"how many spots you picked and how many came up during the game."
9070 PRINT:PRINT"At the end of each game, you have three options:"
9080 PRINT"P=Play the same spots again; N=play New spots; Q=Quit the game."
9090 PRINT"Press P or N or Q to answer."
9100 PRINT:PRINT"When picking your spots, type the number of each spot and press Return."
9110 PRINT"The `house' will begin drawing numbers as soon as your last spot is picked."
9120 PRINT:PRINT"GOOD LUCK!  Press any key to begin play...";
9130 B$=INKEY$: IF B$="" THEN 9130
9140 GOTO 60
