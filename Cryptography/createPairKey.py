from ClassElipticCurve import *

curve = EllipticCurve(A, B, P);
G = Point(curve, GX, GY);
#nameClient = "Marc";
#Mh = int(hashlib.sha256(nameClient).hexdigest(), 16);
#random.seed(Mh);
PrivateKey = random.randint(1, N - 1);
PublicKey = PrivateKey * G;
resultForNodJS = [str(PublicKey[0]), str(PublicKey[1]), str(PrivateKey)];

print(resultForNodJS);

#print("The Pair Key of " + nameClient);
#print("Your PublicKey is : ");

#print("Your private Key is : ");
#print(PrivateKey)

#-----------------------------------------------------------------#
#[str(PublicKey[0])[:-2], str(PublicKey[1])[:-2], str(PrivateKey)[:-2]];
'''
#0xBAAEDCE6AF48A;
messageHash = int(hashlib.sha256(b'Hello World').hexdigest(), 16); #"03BBFD25E8CD0364141"
PrivateKey = 0xBAAEDCE6AF48A;
PublicKey = PrivateKey * G;
r, s = signObject.sign(messageHash, PrivateKey);
'''

'''
print(PrivateKey);
print(PublicKey);
print(G);
print(int(messageHash, 16));
print(r);
print(s);
'''

'''
k = 50;
(x1, y1) = k * G;
r = x1 % N;
s = mod_inverse(k, N) * (Mh + r *  PrivateKey)
'''

'''
w = (mod_inverse(s, N))
print(w);
(i, j) = int(messageHash, 16) * w * G + r * w * PublicKey;
print(i);
print(j);
if ((i % N) == r) :
	print("Sign verify");
else :
	print("Try again");
'''
'''
U1 = (mod_inverse(s, N)) * int(messageHash, 16);
U2 = (mod_inverse(s, N)) * r;
(Xr, Yr) = (U1)* G + (U2)* PublicKey;

print(Xr % N);
print(r % N);
if (Xr == r) :
	print("Equal");
else :
	print("Fail");
	'''
