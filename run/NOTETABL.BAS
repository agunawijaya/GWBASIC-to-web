10 OPTION BASE 1
20 CLS
30 noteno = 1: DIM notename$(12)
40 FOR count = 1 TO 12
50	READ note$: notename$(count) = note$
60 NEXT count
70 FOR oct = -3 TO 4
80	LPRINT : LPRINT
90	LPRINT STRING$(79, "-");
100	LPRINT : LPRINT TAB(30);
110	LPRINT "OCTAVE "; oct; "("; oct + 2; ")"
120	LPRINT STRING$(79, "-");
130	LPRINT "NOTE NUMBER       NOTE          ";
140	LPRINT "FREQUENCY IN Htz    PITCH NUMBER"
150	LPRINT
160	FOR note = 1 TO 12
170		freq = 440 * (2 ^ (oct + (note - 10) / 12))
180		pitch = CINT(125000 / freq)
190		LPRINT TAB(3); : LPRINT noteno;
200		LPRINT TAB(19); : LPRINT notename$(note); oct;
210		LPRINT TAB(35); : LPRINT freq;
220		LPRINT TAB(57); : LPRINT pitch
230		noteno = noteno + 1
240	NEXT note
250 NEXT oct
260 DATA C,C#,D,D#,E,F,F#,G,G#,A,A#,B
