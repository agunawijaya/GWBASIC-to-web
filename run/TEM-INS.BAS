10 CLS:KEY OFF:COLOR 3,0,1
20 LOCATE 1,28:COLOR 27,0,1:PRINT "Temple of Loth instructions"
30 COLOR 3,0,1:LOCATE 4,3
40 PRINT "     Temple of Loth is a computerized simulation of one of the most common and       popular fantasy motifs, the lone adventurer's quest with an immense under       ground labyrinth. Each game is separate from all others, so the game is a"
50 PRINT "     challenge even after you have won. Each game will result in a win or loss       depending on the player's  skill and luck.  The instruction  which follow       will explain the rules and options of the game.
60 COLOR 3,0,1:LOCATE 12,7:PRINT "A. Character Creation
70 'LOCATE 4,45:PRINT "A. Sex
80 'LOCATE 5,7:PRINT "C. Points
90 LOCATE 12,45:PRINT "B. Equipments
100 'LOCATE 5,7:PRINT "C. Lamps and Flares
110 LOCATE 13,7:PRINT "C. The Temple
120 LOCATE 13,45:PRINT "D. Player Commands
130 LOCATE 14,7:PRINT "E. Magic Spells
140 LOCATE 14,45:PRINT "F. Treasures, Curses and Such
150 LOCATE 15,7:PRINT "G. Drow Merchants
160 LOCATE 15,45:PRINT "H. Monsters and The Runestaff
170 LOCATE 16,7:PRINT "I. Warps and ";:COLOR 11,0,1:PRINT "The Amulet of Chaos ":COLOR 3,0,1
180 LOCATE 16,45:PRINT "J. Error Messages
190 LOCATE 17,7:PRINT "K. Scoring
200 LOCATE 17,45:PRINT "L. Comments and Suggestions
205 LOCATE 18,7:PRINT "M. Return to game
210 LOCATE 20,6
220 COLOR 11,0,1:INPUT "Type in the number of the section desired then press return";A$
225 A$=CHR$(ASC(A$) OR &H20)
230 IF A$="a" GOTO 380
240 IF A$="b" GOTO 610
250 IF A$="c" GOTO 870
260 IF A$="d" GOTO 1190
270 IF A$="e" GOTO 1650
280 IF A$="f" GOTO 1770
290 IF A$="g" GOTO 2060
300 IF A$="h" GOTO 2160
310 IF A$="i" GOTO 2290
320 IF A$="j" GOTO 2390
330 IF A$="l" GOTO 2470
340 IF A$="k" GOTO 2600
345 IF A$="m" GOTO 3000
350 PRINT
360 COLOR 11,0,15:PRINT "Invalid input, try again":COLOR 3,0,1
370 GOTO 210
380 CLS
390 COLOR 11,0,1
400 PRINT "                                  CHARACTER CREATION
410 PRINT:COLOR 3,0,1
420 PRINT "     At the start of each game you will be asked a number of questions about"
430 PRINT "what type of character you will have. You must make the choices as follows:
440 PRINT
450 PRINT "RACE     You may be an Elf, Dwarf, Man, or Hobbit. Each score is randomly "
460 PRINT "         generated, but bonus and deductions are different for each race."
470 PRINT
480 PRINT "SEX      You may be a female or male. Both are equal in number of points."
490 PRINT "         Be creative in your response.
500 PRINT
510 PRINT "POINTS   Each character starts with a number of points for the attributes"
520 PRINT "         of strength (ST), intelligence (IQ), and dexterity (DX).  In addition,"
530 PRINT "         there are some other points you may distribute between these three"
540 PRINT "         attributes as you wish.
550 PRINT
560 PRINT "         Your ST, IQ, and DX may be any number from 1 to 18. If any of the "
570 PRINT "         three drop below 1, you have died. For all three attributes, the "
580 PRINT "         larger the numerical value, the better. "
590 LOCATE 25,1:INPUT "Press enter to return to main menu";B$
600 GOTO 10
610 CLS:COLOR 11,0,1
620 PRINT "                                   EQUIPMENT
630 PRINT:COLOR 3,0,1
640 PRINT "    Every character is given 60 gold pieces (gp's), at the beginning of each"
650 PRINT "to purchase some of the following items.
660 PRINT
670 PRINT "ARMOR    You may buy platemail armor for 30 gp's, chainmail for 20 gp's or"
680 PRINT "         leather for 10 gp's. You can only wear one suit of armor at a time."
690 PRINT "         The more expensive the armor, the more damage it will absorb."
700 PRINT
710 PRINT "WEAPONS  You may buy a sword for 30 gp's, a mace for 20 gp's, or a dagger for "
720 PRINT "         10 gp's. You can only carry a single weapon at a time.  The more ex-"
730 PRINT "         pensive the weapon, the more damage it does to the various monsters."
740 PRINT
750 PRINT "LAMP     If after selecting armor and weapons, you have 20 gp's left , you may"
760 PRINT "         buy a lamp for 20 gp's. Having the lamp will allow you to look into"
770 PRINT "         an adjacent room without having to enter it.
780 PRINT
790 PRINT "FLARES   If, after all purchases , you have money left, you may buy flares for"
800 PRINT "         1 gp each. Lighting a flare reveals the contents of all the rooms "
810 PRINT "         surrounding your current location.
820 PRINT
830 PRINT "         Once you have equipped your character, you are ready to enter the"
840 PRINT "         Temple and begin your quest.
850 LOCATE 25,1:INPUT "Press enter to return to main menu.";B$
860 GOTO 10
870 CLS:COLOR 11,0,1
880 PRINT "                                   THE TEMPLE
890 COLOR 3,0,1:PRINT
900 PRINT "     The temple is arranged in a 8x8x8 three dimensional matrix.  This means     that there are 8 levels with 64 rooms on each level. The temple levels are      are numbered from 1 (the top level) to 8 (the bottom level. Each temple level
910 PRINT " is constructed in a doughnut like fashion, in that the north edge is connect    to the south edge and the east edge is connected to the west edge.  In a sim-   ular fashion, the sinkholes, explain later, on level 8 will "DROP" you down
920 PRINT " to level 1. The only room that does not work in this fashion is always locat-   ed at location (1,4) level 1. Going north from this room will take you out of   the temple and end the game.
930 PRINT
940 PRINT " Each room of the temple will have contents as one of the following.
950 PRINT
960 PRINT "   Ô = The entrance / exit room
970 PRINT "   Œ = An empty room containing nothing
980 PRINT "   U = Stairs going up a level
990 PRINT "   D = Stairs going down a level
1000 PRINT "   P = Magic Pool from which you may drink
1010 PRINT "   C = A chest you may open.
1020 PRINT "   B = A book you may open
1030 PRINT "   G = From 1 to 10 gold pieces
1040 PRINT "   ü = From 1 to 3 flares
1050 PRINT "   € = A warp to another random location
1060 LOCATE 25,1:INPUT "Press return to continue";B$
1070 LOCATE 25,1:PRINT "                              "
1080 LOCATE 22,1
1090 PRINT "   ù = A monster (1 of 9 different types)
1100 PRINT "   * = A Drow fighter
1110 PRINT "   Ë = A crystal orb
1120 PRINT "   T = A treasure (1 of 8 in the castle)
1130 PRINT "   ≤ = A Green Slime
1140 PRINT "   4 = A Red Dragon
1150 PRINT
1160 PRINT "     The letters are the abbreviations for the room contents which are display-  ed whenever you look at a map or light a flare. When you look at a map, the     room you are currently located in is bracketed by < >
1170 LOCATE 25,1:INPUT "Press enter to return to main menu";B$
1180 GOTO 10
1190 CLS:COLOR 11,0,1
1200 PRINT "                             PLAYER COMMANDS
1210 COLOR 3,0,1:PRINT
1220 PRINT "     Whenever the program asks for a command, you must decide what action you    wish to preform. If your choice is not valid, the program will inform you and   allow you to try agian.  The following is a list of commands which the pro-
1230 PRINT " gram understands, with a description of their effects and restrictions:"
1240 PRINT
1250 PRINT " NORTH   Moves you to the room north from your present position. When go north           from the entrance / exit room, the game terminates. In all cases,              the north edge wraps around from the south.
1260 PRINT
1270 PRINT " SOUTH   Moves you to the room south of your present position. In all cases,             the south edge wraps around to the north edge.
1280 PRINT
1290 PRINT " EAST    Moves you to the room east of your present position. In all cases, the          east edge wraps around to the west.
1300 PRINT
1310 PRINT " WEST    Moves you to the room west of your present position. In all cases, the          west edge wraps around to the east.
1320 PRINT
1330 PRINT " UP/DOWN Causes you to ascend/descend stairs. You must be in a room containing           stairs to use this command.
1340 PRINT
1350 LOCATE 25,1:INPUT "Press return to continue";B$
1360 LOCATE 25,1:PRINT "                           "
1370 LOCATE 22,1
1380 PRINT " DRINK   Causes you to take a drink from a magic pool. You may repeat this               command as often as you wish, but you must be in a room with a pool             to use this command.
1390 PRINT
1400 PRINT " MAP     Causes a map of the level you are currently on to be printed. All               unexplored  rooms are displayed as `?'.  All other rooms are dis-               played as their one character symbols. You may look at your map at
1410 PRINT
1420 PRINT " FLARE   Cause one of your flares to be lit, revealing the contents of all the           rooms surrounding your current location. Because each edge is joined            to the opposite edge, you will always see nine rooms with your loca-
1430 PRINT "         as long as you have some and you are not blind or fighting a monster.
1440 PRINT
1450 PRINT " LAMP    Allows you to shine your lamp into any one of the rooms north, south,           east, and west of your current position, revealing the room contents.           Unlike flares, the lamp may be used repeatedly. You may use your lamp
1460 PRINT "         at any time as long as you have one, are not blind, and not attacking           a monster.
1470 PRINT
1480 PRINT " OPEN    Causes you to open a book or a chest which is in the room with you."
1490 PRINT
1500 LOCATE 25,1:INPUT "Press return to continue";B$
1510 LOCATE 25,1:PRINT "                          "
1520 LOCATE 22,1
1530 PRINT " GAZE    Causes you to gaze into a crystal orb. When you see yourself in a               bloody mess, you lose 1 or 2 points of strength.  When you see the              location of the ";:COLOR 11,0,1:PRINT "Amulet of Chaos";:COLOR 3,0,1
1540 PRINT ", there is only a 50% chance that it "
1550 PRINT "         is correct. You cannot gaze when you are blind or when you are not in           a room containing a crystal orb."
1560 PRINT
1570 PRINT " TELE-   Allows you to teleport directly into a specific room any where in the   PORT    temple. This is the only way you can can enter the room containing              the";:COLOR 11,0,1:PRINT " Amulet of Chaos.";:COLOR 3,0,1
1580 PRINT " You must have the Runestaff to teleport!
1590 PRINT
1600 PRINT " QUIT    Allows you to end the game while you are still in the temple. You will          be asked if you are, in case you change your mind. If you quit, you             will lose the game.
1610 PRINT
1620 PRINT " HELP    Causes a summary of available commands, abbreviations used in des-               cribing the contents of rooms, and the benefits of possessing each of            the treasures to be displayed at any time.
1630 LOCATE 25,1:INPUT "Press enter to return to main menu";B$
1640 GOTO 10
1650 CLS:COLOR 11,0,2
1660 PRINT "                      MAGIC SPELLS"
1670 COLOR 3,0,1:PRINT
1680 PRINT "     When ever your intelligence (IQ) becomes 15 or higher, you gain the option  of casting a magic spell on a monster if you have the very first combat         option. The three spells and there effects are as follows:
1690 PRINT
1700 PRINT " WEB     Traps the monster in a sticky web so that it can't fight back as you            attack it. This spell lasts from 2 to 9 turns and costs you one                 strength (ST) point.
1710 PRINT
1720 PRINT " FIRE-   Hits the monster with a ball of flame that causes between 2 and 14      BALL    points worth of damage instantly. It costs one strength points and one          point of intelligence.
1730 PRINT
1740 PRINT " DEATH   is a contest of will between the monster and yourself, whoever has              the lower intelligence dies at once. It costs nothing to use, but it             is very risky. Even with an IQ of 18 (the highest possible), you
1750 LOCATE 25,1:INPUT "Press enter to return to main menu";B$
1760 GOTO 10
1770 CLS:COLOR 11,0,1
1780 PRINT "                       TREASURE, CURSES, AND SUCH
1790 COLOR 3,0,1:PRINT
1800 PRINT "     In the temple there are eight randomly placed treasures:
1810 PRINT
1820 PRINT " The Ruby Red - Wards off the curse of lethargy.
1830 PRINT " The Pale Pearl - Wards off the curse of the leech.
1840 PRINT " The Opal Eye - Cures blindness.
1850 PRINT " The Green Gem - Wards off the curse of forgetfulness.
1860 PRINT " The Blue Flame - Dissolves books stuck to your hands.
1870 PRINT " The Norn Stone - Has no special power.
1880 PRINT " The Palantir - Has no special power.
1890 PRINT " The Silmaril - Has no special power.
1900  PRINT
1910 PRINT "     THERE ARE THREE CURSES:"
1920 PRINT
1930 PRINT " LETHARGY - This gives the monster the first attack which prevents you from                 bribing him or casting a spell on them.
1940 PRINT
1950 PRINT " LEECH - This takes from 1 to 5 gp's from you each turn until you have no gold           left at all!
1960 PRINT
1970 LOCATE 25,1:INPUT "Press return to continue";B$
1980 LOCATE 25,1:PRINT "                            "
1990 LOCATE 20,1
2000 PRINT " FORGETFULNESS - This causes you to forget what you know about each level of the          temple.  Your map will slowly turn back to all question marks, How-             ever, the contents of the rooms stay the same.
2010 PRINT
2020 PRINT "     In addition to nullifying the effects of the curses, the treasures can          also provide protection from two undesirable things which can happen            when you open a book.  These are going blind and which prevent you from"
2030 PRINT "     seeing your maps, lighting flares, using your lamp, gazing into orbs, and       being informed or your current location, and secondly, having a book            stuck to your hands, which prevents you to draw your weapon to fight
2040 LOCATE 25,1:INPUT "Press enter to return to main menu";B$
2050 GOTO 10
2060 CLS:COLOR 11,0,1
2070 PRINT "                             DROW MERCHANTS
2080 COLOR 3,0,1:PRINT
2090 PRINT "      On every level there are Drow Merchants who sell necessary items at in-     flated prices. Normally, the merchants will make you an offer for every         treasure you have, and then, depending on the amount of gold you have, will"
2100 PRINT " sell you new armor, a new weapon, a potion of strength, intelligence, and       dexterity (no matter how many potions you buy, the maximum amount for these
2110 PRINT " attributes is 18), and a lamp, if you don't already have one. If you chose to   attack the merchant, you will antagonize every one in the temple, and they      will all react as monsters. You will also lose the ability to trade with"
2120 PRINT " them. Killing a merchant, however, will give you new platemail, a sword, one    of each kind of potion, and a lamp (if you don't already have one, in add-      ition to his hoard of between 1 and 1000 gold pieces. To end hostilities"
2130 PRINT " and reestablish trading privileges, you must bribe any Merchant Drow in the     castle with the treasure of his choice.
2140 LOCATE 25,1:INPUT "Press enter to return to main menu";B$
2150 GOTO 10
2160 CLS:COLOR 11,0,1
2170 PRINT "                         MONSTERS AND THE RUNESTAFF"
2180 COLOR 3,0,1:PRINT
2190 PRINT "     There are 12 types of monsters in the temple:
2200 PRINT
2210 PRINT " Green Slime, Orcs, Evil Dwarfs, Goblins, Mind Flayers, Trolls, Giant Spiders    Minotaurs, Driders, Balor Demon, Reds Dragons, and Drow Warriors."
2220 PRINT
2230 PRINT "     Please note that each time you strike a Drow Warrior or a Red Dragon,       there is a chance that your weapon will be shattered."
2240 PRINT
2250 PRINT "     Each monster possesses a hoard of from 1 to 1000 gp's which you obtain      when you kill a monster. In addition, one of the monsters is also carring The   Runestaff, (you won't know which until one until you kill it). You must have"
2260 PRINT " The Runestaff to teleport, and when you teleport into the room with The         Amulet of Chaos, The Runestaff will disappear. (You must find your way out of   the temple without it)."
2270 LOCATE 25,1:INPUT "Press enter to return to main menu";B$
2280 GOTO 10
2290 CLS:COLOR 11,0,1
2300 PRINT "                         WARPS AND ";:COLOR 27,0,1:PRINT "THE AMULET OF CHAOS"
2310 COLOR 3,0,1:PRINT
2320 PRINT "      All but one of the rooms donated as `€' are truly warps. Walking, fall-    ing, or teleporting into one of these warps will cause you to be instantly      transported to anywhere in the temple at random. The one exception to this"
2330 PRINT " rule is the room containing ";:COLOR 11,0,1:PRINT "The Amulet of Chaos";:COLOR 3,0,1:PRINT ". This room is disguised as a"
2340 PRINT " warp. Walking into this room causes you to move one room further in the same    direction. To actually enter this room, you must teleport in using The Rune-"
2350 PRINT " staff. At this point, you will acquire ";:COLOR 11,0,1:PRINT "The Amulet of Chaos";:COLOR 3,0,1:PRINT ". The Runestaff will"
2360 PRINT " disappear at this point. Remember, to win the game, you must leave the temple   with the amulet in your possession."
2370 LOCATE 25,1:INPUT "Press enter to return to the main menu";B$
2380 GOTO 10
2390 CLS:COLOR 11,0,1
2400 PRINT"                             ERROR MESSAGES"
2410 COLOR 3,0,1:PRINT
2420 PRINT "     Anytime you receive a highlighted message with a `**', it means that the     last thing you typed was unacceptable to the program at the time. For in- "
2430 PRINT " stance ";:COLOR 11,0,1:PRINT "** It's hard to gaze without an orb.";:COLOR 3,0,1:PRINT ", this means that you tried to"
2440 PRINT " gaze from a room which did not contain a crystal orb. You are always required   to redo your last response when you receive an `**' message.
2450 LOCATE 25,1:INPUT "Press enter to return to main menu";B$
2460 GOTO 10
2470 CLS:COLOR 11,0,1
2480 PRINT "                               COMMENTS AND SUGGESTION"
2490 COLOR 3,0,1:PRINT
2500 PRINT "      I hope that all enjoy this program. If you have any comments or suggest-   ions, please send them to:"
2510 PRINT
2520 PRINT "                            John Belew
2530 PRINT "                            4329 Lenoso Common
2540 PRINT "                            Fremont CA, 94536
2550 PRINT
2560 PRINT "     if you have any ideas to improve this program yourself please do. Upload    your improved version on Wes Meier's RBBS at area code [disunting - UU PDP No. 27/2022].
2570 PRINT "
2580 LOCATE 25,1:INPUT "Press enter to return to main menu";B$
2590 GOTO 10
2600 CLS:COLOR 11,0,1
2610 PRINT "                                      SCORING "
2620 COLOR 3,0,1:PRINT
2630 PRINT "   Each game that you play you will be given a score. The scoring formula goes   as follows:"
2640 PRINT
2650 PRINT "     1 point for each gold piece  +  100 times your combined attribute scores"
2655 PRINT
2660 PRINT "       + 1000 points for each monster killed  - 5 times the turns played"
2670 PRINT
2680 PRINT " Bonus points are scored as follows:
2690 PRINT "
2700 PRINT "                  5000 for each treasure
2710 PRINT "                 10000 for finding the Runestaff
2720 PRINT "                 20000 for finding the Amulet of Chaos
2730 PRINT "
2740 PRINT " You will then be ranked into one of the following classes:
2750 PRINT
2760 PRINT "             0 - 20000  Whimp                  20000 - 35000  Peasent
2770 PRINT "         35000 - 50000  Ameteur                50000 - 75000  Scout
2780 PRINT "         90000 -110000 Adventurer            110000 -125000  Hero
2790 PRINT "        125000 -140000  Wizard                140000+  Lord
2800 PRINT "
2810 PRINT "  The highest score to date is that of Lord Nur£cc: 142,498
2820 LOCATE 25,1
2830 LINE INPUT "Press enter to return to Main Menu";B$
2840 GOTO 10
3000 CLS
3010 CHAIN "Temple",700
