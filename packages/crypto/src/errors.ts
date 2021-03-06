// tslint:disable:max-classes-per-file

export class CryptoError extends Error {
    constructor(message: string) {
        super(message);

        Object.defineProperty(this, "message", {
            enumerable: false,
            value: message,
        });

        Object.defineProperty(this, "name", {
            enumerable: false,
            value: this.constructor.name,
        });

        Error.captureStackTrace(this, this.constructor);
    }
}

export class Bip38CompressionError extends CryptoError {
    constructor(expected: string | number, given: string | number) {
        super(`Expected flag to be ${expected}, but got ${given}.`);
    }
}

export class Bip38LengthError extends CryptoError {
    constructor(expected: string | number, given: string | number) {
        super(`Expected length to be ${expected}, but got ${given}.`);
    }
}

export class Bip38PrefixError extends CryptoError {
    constructor(expected: string | number, given: string | number) {
        super(`Expected prefix to be ${expected}, but got ${given}.`);
    }
}

export class Bip38TypeError extends CryptoError {
    constructor(expected: string | number, given: string | number) {
        super(`Expected type to be ${expected}, but got ${given}.`);
    }
}

export class NetworkVersionError extends CryptoError {
    constructor(expected: string | number, given: string | number) {
        super(`Expected version to be ${expected}, but got ${given}.`);
    }
}

export class PrivateKeyLengthError extends CryptoError {
    constructor(expected: string | number, given: string | number) {
        super(`Expected length to be ${expected}, but got ${given}.`);
    }
}

export class PublicKeyError extends CryptoError {
    constructor(given: string) {
        super(`Expected ${given} to be a valid public key.`);
    }
}

export class TransactionTypeError extends CryptoError {
    constructor(given: string) {
        super(`Type ${given} not supported.`);
    }
}

export class TransactionVersionError extends CryptoError {
    constructor(given: number) {
        super(`Version ${given} not supported.`);
    }
}

export class MaximumPaymentCountExceededError extends CryptoError {
    constructor(given: number) {
        super(`Expected a maximum of 2258 payments, but got ${given}.`);
    }
}

export class MissingTransactionSignatureError extends CryptoError {
    constructor() {
        super(`Expected the transaction to be signed.`);
    }
}
