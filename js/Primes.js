
//    Copyright � 2012, 2022 Dudley Fox

var primes = new Array();
primes.push(2);
primes.push(3);

// Build primes
while (primes.length < 50000) {
    var candidate = primes[primes.length - 1] + 2;
    var sqc = Math.sqrt(candidate);
    var flag = 1;
    while (flag) {
        for (var i = 0; i < primes.length; i++) {
            var prime = primes[i];
            if (prime > sqc) {
                primes.push(candidate);
                flag = 0;
                break;
            }
            else if (candidate % prime === 0) {
                candidate += 2;
                sqc = Math.sqrt(candidate);
                break;
            }
        }
    }
}

export default primes;

