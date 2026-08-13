import os, re, struct, json, sys

RUN = r"C:\Users\aguna\Downloads\Personal\Games\old_games\run"
TARGET = sys.argv[1] if len(sys.argv) > 1 else "HOPPER.EXE"
d = open(os.path.join(RUN, TARGET), "rb").read()
hdrsize = struct.unpack_from("<H", d, 8)[0] * 16
img = d[hdrsize:]

# BASCOM string literals: length-prefixed OR high-bit terminated, and they live
# in the data segment. Scan the whole image but keep only strings that read as
# real text (>=2 dictionary-ish words) OR are DRAW/PLAY macros.
def runs(buf, minlen=3):
    out=[]; i=0; n=len(buf)
    while i<n:
        if 0x20<=buf[i]<=0x7e:
            j=i
            while j<n and 0x20<=buf[j]<=0x7e: j+=1
            term=""
            if j<n and 0xa0<=buf[j]<=0xfe: term=chr(buf[j]&0x7f)
            s=buf[i:j].decode("latin1")+term
            if len(s)>=minlen: out.append((i,s))
            i=j+1
        else: i+=1
    return out

WORD = re.compile(r"\b(?:[A-Za-z]{2,})\b")
COMMON = set("""the you your to a an of and or is are be for with on in it if not no yes press key keys
game play player score high level lives time hit miss win lose again start end over enter type
would like want try use using move left right up down jump top bottom new old best point points
esc escape pause abort quit exit continue color colour graphics adaptor available switching sorry
need card run this that here there now then when what which how many one two three four five""".split())

def wordiness(s):
    w=[x.lower() for x in WORD.findall(s)]
    if not w: return 0
    hits=sum(1 for x in w if x in COMMON)
    return hits

DRAWC = re.compile(r"^[CBUDLREFGHMANSXPTcbudlrefghmansxpt0-9+\-,;=\. ]+$")
def is_draw(s):
    s=s.strip()
    return len(s)>=10 and DRAWC.match(s) and len(re.findall(r"[BUDLREFGH]",s))>=5 and any(c.isdigit() for c in s)

PLAYC = re.compile(r"^[a-gA-G#\+\-\.oOlLtTmMnNpPsSxX0-9<>]+$")
def is_play(s):
    s=s.strip()
    return len(s)>=10 and PLAYC.match(s) and len(re.findall(r"[a-gA-G]",s))>=6

draw=[];play=[];text=[]
for off,s in runs(img):
    st=s.strip()
    if is_draw(st): draw.append((off,s))
    elif is_play(st): play.append((off,s))
    elif wordiness(st)>=2 or (len(st)>=14 and len(WORD.findall(st))>=3 and sum(c.isupper() or c.islower() or c==' ' for c in st)>=len(st)*0.85):
        text.append((off,s))

DATA_RE = re.compile(rb"(?:\d{1,3},){7,}\d{1,3}")
datablocks=[(m.start(), m.group().decode()) for m in DATA_RE.finditer(img)]

print("== %s ==" % TARGET)
print("DRAW: %d | PLAY: %d | TEXT: %d | DATA blocks: %d" % (len(draw),len(play),len(text),len(datablocks)))
print("\n--- DRAW ---")
for off,s in draw: print("  @%-6d %s" % (off,s))
print("\n--- PLAY ---")
for off,s in play: print("  @%-6d %s" % (off,s))
print("\n--- TEXT ---")
for off,s in text: print("  @%-6d %r" % (off,s))
print("\n--- DATA ---")
for off,s in datablocks:
    nums=s.split(",")
    print("  @%-6d %d numbers: %s ..." % (off,len(nums),",".join(nums[:16])))

json.dump({"file":TARGET,"draw":draw,"play":play,"text":text,"data":datablocks},
          open(TARGET.replace(".","_")+"_assets.json","w"), indent=1)
