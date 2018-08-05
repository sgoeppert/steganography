
const container = document.querySelector(".container");
const mergeBtn = document.querySelector("#merge");
const bitContainer = document.querySelector(".bits");
const bitRange = document.querySelector("input[type='range']");
const bitDisplay = document.querySelector("#bitNum");

const imageFiles = [];
imageFiles.push("images/host.jpg");
imageFiles.push("images/payload.jpg");

// canvas resolution
const width = 1024;
const height = 768;
let bits = 1;

// setting up canvases
const carrierCan = document.querySelector("#carrier");
const payloadCan = document.querySelector("#payload");
const resultCan = document.querySelector("#result");

carrierCan.width = width;
carrierCan.height = height;
payloadCan.width = width;
payloadCan.height = height;
resultCan.width = width;
resultCan.height = height;

const carrierCtx = carrierCan.getContext("2d");
const payloadCtx = payloadCan.getContext("2d");
const resultCtx = resultCan.getContext("2d");

// load the images
const carrierImg = new Image();
const payloadImg = new Image();

carrierImg.addEventListener("load", function() {
    carrierCtx.drawImage(this, 0, 0, width, height);
});

payloadImg.addEventListener("load", function() {
    payloadCtx.drawImage(this, 0, 0, width, height);
});

carrierImg.src = imageFiles[0];
payloadImg.src = imageFiles[1];

// add bit-selector
bitRange.addEventListener("change", updateBitDisplay);
bitRange.addEventListener("mousemove", updateBitDisplay);

function updateBitDisplay() {
    const val = bitRange.value;
    bitDisplay.textContent = val;
}

// add merge button
mergeBtn.addEventListener("click", mergeImages);

function mergeImages() {
    const carrierData = carrierCtx.getImageData(0, 0, width, height).data;
    const payloadData = payloadCtx.getImageData(0, 0, width, height).data;
    const resultImgDat = resultCtx.getImageData(0, 0, width, height);
    const resultData = resultImgDat.data;

    bits = parseInt(bitRange.value, 10);

    for(let i = 0; i < carrierData.length; i+=4) {
        // Remove bottom n bits from carrier and extract top n bits from payload
        // reassemble them to a new byte
        for(let offset = 0; offset < 3; offset++) {
            const carrierBit = carrierData[i+offset] >> bits;
            const payloadBit = payloadData[i+offset] >> (8-bits);

            resultData[i+offset] = (carrierBit << bits) + payloadBit;
        }
        // just transfer alpha
        resultData[i+3] = carrierData[i+3];
    }

    resultCtx.putImageData(resultImgDat, 0, 0);
    deconstructResult();

    // show results div
    document.querySelector(".results").style.display = "block";
}


function deconstructResult() {
    // clear the bitContainer
    bitContainer.innerHTML = "";
    
    // create canvases
    const contexts = [];
    for(let i = 0; i < 8; i++) {
        const cnv = document.createElement("canvas");
        cnv.classList.add("small");
        cnv.width = width;
        cnv.height = height;
        bitContainer.appendChild(cnv);
        contexts.push(cnv.getContext("2d"));
    }

    const resultData = resultCtx.getImageData(0, 0, width, height).data;

    // draw greyscale images to canvases
    for(let i = 0; i < 8; i++) {
        const bit = 7-i;
        const ctx = contexts[i];
        const imageDat = ctx.getImageData(0, 0, width, height);
        const pixels = imageDat.data;
        const bitmask = 1 << bit;
        for(let j = 0; j < resultData.length; j+=4) {
            const red = (resultData[j] & bitmask) > 0 ? 255 : 0;
            const blue = (resultData[j+1] & bitmask) > 0 ? 255 : 0;
            const green = (resultData[j+2] & bitmask) > 0 ? 255 : 0;
            const alpha = 255;
            const avg = (red + blue + green) / 3;
            pixels[j] = avg;
            pixels[j+1] = avg;
            pixels[j+2] = avg;
            pixels[j+3] = alpha;
        }
        ctx.putImageData(imageDat, 0, 0);
    }

}






