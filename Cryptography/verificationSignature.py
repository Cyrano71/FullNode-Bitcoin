from ClassElipticCurve import *
import sys, json

curve = EllipticCurve(A, B, P);
G = Point(curve, GX, GY);

lines = sys.stdin.readlines();
listInput = json.loads(lines[0])

txns = listInput[0];

signature = listInput[1];
s = int(signature["s"]);
r = int(signature["r"]);

PublicKey = Point(curve, int(listInput[2][0]), int(listInput[2][1])); 
Mh = int(hashlib.sha256(json.dumps(txns)).hexdigest(), 16);

w = mod_inverse(s, N);
u1 = (Mh * w) % N;
u2 = (r * w) % N;
(xresult, yresult) = u1 * G + u2 * PublicKey

if ((r % N) == (xresult)) :
	print("sign valid");
else :
	print("non valide");