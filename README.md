# BitCoin-BlockChain

Implementation of a BlockChain Minor Node, and a Complete Fake Client Wallet :
- Creation of Private and Public Key
- Creation Script
- Build a complete Transaction
- Synchronization of the differents Nodes
- Proof of Work
- Verification and update of the BlockChain
- Manage the creatopn of a Fork BlockChain
- Create a maintainable and well organised code

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to install Node JS and Python version 3.0 or more

### Installing

Copy the repository. Go to the repository in your computer. Then type the following :

```
sh settle.sh
```

### Run the Application

Then open 4 terminals screens. 
In the first screen type the following 

```
node Minor1.js
```

And repeat for the second screen 

```
node Minor2.js
```

And then for the third screen 

```
node Minor3.js
```

For the last one go to the folder WalletClient then  

```
node WalletClient1.js 1
node WalletClient1.js 2
node WalletClient1.js 3
node WalletClient1.js 4
```

Theses last command will send 4 transactions to the three Minor Node

## Integrity of BlockChain

To send a request to the Minor Node to retreive the BlockChain
and check if the BlockChain are the same in the 3 node do the following
when you are in the folder WalletClient

```
cd IntegrityBlockChain
node RequestBlockChain.js
```

The three node will write the BlockChain in the log file like
for example Log3005.txt
Then type :

```
sh diff.sh
```

## Authors

* **Jehan-Gabriel de Brosses Berthier** - *Initial work* - [JGdBB](https://github.com/JGdBB)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Inspiration : David Derosa’s for the explications of how works a WalletClient
* Inspiration : Mastering Bitcoin of Andreas M. Antonopoulos to understand the whole
				system of the BlockChain
* Inspiration : lhartikk/naivechain to start with a simple BlockChain in node JS
* Inspiration : https://www.miximum.fr/blog/cryptographie-courbes-elliptiques-ecdsa/
				to understand the elliptic curve if you speak french.
