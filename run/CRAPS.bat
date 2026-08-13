@echo off
REM  Nevada Dice (Craps)
REM  Runs CRAPS.BAS under GW-BASIC inside DOSBox-X.
REM
REM  Needs dosbox-x on the PATH.  Hardware profile comes from
REM  ..\dosbox-games.conf (IBM PC / CGA / 4.77 MHz).
cd /d "%~dp0"
dosbox-x -conf "..\dosbox-games.conf" -c "MOUNT C ." -c "C:" -c "GW CRAPS.BAS" -c "EXIT"
