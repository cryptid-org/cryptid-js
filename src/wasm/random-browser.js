(function randomIIFE() {
    function __cryptid_cryptoRandom(buffer, byteCount) {    
        const FAILURE = 1;
        const SUCCESS = 0;
        
        const tempArray = new Uint8Array(byteCount);
    
        try {
            crypto.getRandomValues(tempArray);
        } catch(e) {
            return FAILURE;
        }

        Module.writeArrayToMemory(tempArray, buffer);

        return SUCCESS;
    };

    mergeInto(LibraryManager.library, {
        __cryptid_cryptoRandom
    });
})();
