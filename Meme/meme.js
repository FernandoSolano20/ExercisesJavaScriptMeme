(function () {
    var topTextInput, bottomTextInput, topTextSizeInput, bottomTextSizeInput, imageInput, generateBtn, img, containerImg;
    topTextInput = document.getElementById('top-text');
    topTextInput.addEventListener('keyup', showImage);
    containerImg = document.getElementById("meme-cotainer");
    bottomTextInput = document.getElementById('bottom-text');
    bottomTextInput.addEventListener('keyup', showImage);
    topTextSizeInput = 0.09;
    bottomTextSizeInput = 0.09;
    imageInput = document.getElementById('image-input');
    generateBtn = document.getElementById('generate-btn');
    topTextInput.value = bottomTextInput.value = 'Demo\nText';

    function showImage(event, download = false) {
        if (imageInput.files[0]) {
            showLoadedImage(event, download)
        } else {
            showDefaultImage(event, download)
        }
    }

    generateBtn.addEventListener('click', function (event) {
        showImage(event, true);
    });

    function showLoadedImage(event, download = false) {
        var reader = new FileReader();
        reader.onload = function () {
            img = new Image;

            img.src = reader.result;
            img.width = 400;
            img.height = 400;
            img.onload = function () {
                generateMeme(download);
            }
        };
        reader.readAsDataURL(imageInput.files[0]);
    }
    imageInput.addEventListener('change', showLoadedImage);

    function showDefaultImage(event, download = false) {
        var element = event.target;
        if (element.tagName === 'IMG') {
            img = element;
        }
        imageInput.value = ""
        generateMeme(download);
    }
    containerImg.addEventListener('click', showDefaultImage);

    function generateMeme(download) {
        var fontSize;
        var canvas = document.getElementById('meme-canvas');
        var ctx = canvas.getContext('2d');

        canvas.width = canvas.height = 400;
        // Size canvas to image
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.setAttribute('crossorigin', 'anonymous')

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw main image
        ctx.drawImage(img, 0, 0);

        // Text style: white with black borders
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.textAlign = 'center';

        // Top text font size
        fontSize = canvas.width * topTextSizeInput;
        ctx.font = fontSize + 'px Impact';
        ctx.lineWidth = fontSize / 20;

        // Draw top text
        ctx.textBaseline = 'top';
        var topText = topTextInput.value.split('\n');
        for (var i = 0; i < topText.length; i++) {
            ctx.fillText(topText[i], canvas.width / 2, i * fontSize, canvas.width);
            ctx.strokeText(topText[i], canvas.width / 2, i * fontSize, canvas.width);
        }

        // Bottom text font size
        fontSize = canvas.width * bottomTextSizeInput;
        ctx.font = fontSize + 'px Impact';
        ctx.lineWidth = fontSize / 20;

        // Draw bottom text
        ctx.textBaseline = 'bottom';
        var bottomText = bottomTextInput.value.split('\n').reverse();
        for (var i = 0; i < bottomText.length; i++) {
            ctx.fillText(bottomText[i], canvas.width / 2, canvas.height - i * fontSize, canvas.width);
            ctx.strokeText(bottomText[i], canvas.width / 2, canvas.height - i * fontSize, canvas.width);
        }
        if (download) {
            var link = document.createElement('a');
            link.href = canvas.toDataURL();
            link.download = 'Download.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
})();