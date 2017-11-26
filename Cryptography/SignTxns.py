from ClassElipticCurve import *
import sys, json

class ECDSA(object):
	def __init__(self, curve, generator, order):
		self.curve = curve
		self.G = generator
		self.n = order

	def sign(self, msghash, privkey):
		msg =  msghash #int(msghash, 16);
		k = random.randint(1, self.n - 1);

		i, j = k * self.G
		r = i % self.n
		s = (mod_inverse(k, self.n) * (msg + r * privkey)) % self.n
		return r, s

curve = EllipticCurve(A, B, P);
G = Point(curve, GX, GY);
signObject = ECDSA(curve, G, N);

lines = sys.stdin.readlines();
listInput = json.loads(lines[0])

KeyPair = listInput[0];
txns = listInput[1];

#print(KeyPair["PrivateKey"]);
#print(txns);

Mh = int(hashlib.sha256(json.dumps(txns)).hexdigest(), 16);
r, s = signObject.sign(Mh, int(KeyPair["PrivateKey"]));
resultForNodJS = [str(r), str(s)];

print(resultForNodJS);

#r, s = signObject.sign(Mh, );

#result = [r, s];
#print(result);

'''
print();
print(KeyPair["PublicKey"][0]);
print(KeyPair["PublicKey"][1]);
print(txns);
'''