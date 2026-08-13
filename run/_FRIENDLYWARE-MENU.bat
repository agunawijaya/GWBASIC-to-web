@echo off
REM  Friendlyware Menu #1
REM  Boots the original 1982 Friendlyware menu, exactly as the diskette did.
REM  Keys A-T pick a program, U switches to the business menu.
REM
REM  Needs dosbox-x on the PATH.  Hardware profile comes from
REM  ..\dosbox-games.conf (IBM PC / CGA / 4.77 MHz).
cd /d "%~dp0"
dosbox-x -conf "..\dosbox-games.conf" -c "MOUNT C ." -c "C:" -c "GW MENU.BAS"
