function main() {
    const shirtDrawingCoordinates = [
        {
            sx: 151,
            sy: 355,
            sw: 64,
            dx: 30,
            dy: 48,
            dw: 64,
        },
        {
            sx: 231,
            sy: 74,
            sw: 128,
            dx: 112,
            dy: 48,
            dw: 128,
        },
        {
            sx: 217,
            sy: 355,
            sw: 64,
            dx: 176,
            dy: 48,
            dw: 64,
        },
        {
            sx: 308,
            sy: 355,
            sw: 64,
            dx: 306,
            dy: 48,
            dw: 64,
        },
        {
            sx: 440,
            sy: 355,
            sw: 64,
            dx: 378,
            dy: 48,
            dw: 64,
        },
        {
            sx: 427,
            sy: 74,
            sw: 128,
            dx: 442,
            dy: 48,
            dw: 128,
        },
        {
            sx: 85,
            sy: 355,
            sw: 64,
            dx: 570,
            dy: 48,
            dw: 64,
        },
        {
            sx: 374,
            sy: 355,
            sw: 64,
            dx: 652,
            dy: 48,
            dw: 64,
        },
    ];

    const pantsDrawingCoordinates = [
        {
            sx: 151,
            sy: 355,
            sw: 64,
            dx: 51,
            dy: 214,
            dw: 64,
        },
        {
            sx: 217,
            sy: 355,
            sw: 64,
            dx: 180,
            dy: 214,
            dw: 64,
        },
        {
            sx: 308,
            sy: 355,
            sw: 64,
            dx: 244,
            dy: 214,
            dw: 64,
        },
        {
            sx: 231,
            sy: 74,
            sw: 128,
            dx: 180,
            dy: 86,
            dw: 128,
        },
        {
            sx: 440,
            sy: 355,
            sw: 64,
            dx: 437,
            dy: 214,
            dw: 64,
        },
        {
            sx: 85,
            sy: 355,
            sw: 64,
            dx: 501,
            dy: 214,
            dw: 64,
        },
        {
            sx: 427,
            sy: 74,
            sw: 128,
            dx: 437,
            dy: 86,
            dw: 128,
        },
        {
            sx: 374,
            sy: 355,
            sw: 64,
            dx: 630,
            dy: 214,
            dw: 64,
        },
    ];

    const skinDrawingCoordinates = [
        {
            x: 51,
            y: 86,
            w: 64,
            h: 256,
        },
        {
            x: 116,
            y: 86,
            w: 256,
            h: 128,
        },
        {
            x: 180,
            y: 86,
            w: 128,
            h: 256,
        },
        {
            x: 373,
            y: 86,
            w: 256,
            h: 128,
        },
        {
            x: 437,
            y: 86,
            w: 128,
            h: 256,
        },
        {
            x: 630,
            y: 86,
            w: 64,
            h: 256,
        },
    ];

    function createShowcase() {
        const canvas = document.querySelector('canvas');
        const ctx = canvas.getContext('2d');
        const showcaseTemplate = new Image();
        showcaseTemplate.src = 'showcaseTemplate.png';
        showcaseTemplate.onload = () => ctx.drawImage(showcaseTemplate, 0, 0);

        function generateShowcase() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(showcaseTemplate, 0, 0);
            const { shirt, pants, colorValue: skinColor } = settings;
            // DRAWS SKIN COLOR
            if (shirt || pants) {
                ctx.fillStyle = skinColor;
                for (const coordinates of skinDrawingCoordinates) {
                    const { x, y, w, h } = coordinates;
                    ctx.fillRect(x, y, w, h);
                }
            }

            if (pants) {
                for (const coordinates of pantsDrawingCoordinates) {
                    const { sx, sy, sw, sh = 128, dx, dy, dw, dh = 128 } = coordinates;
                    ctx.drawImage(pants, sx, sy, sw, sh, dx, dy, dw, dh);
                }
            }
            if (shirt) {
                for (const coordinates of shirtDrawingCoordinates) {
                    const { sx, sy, sw, sh = 128, dx, dy, dw, dh = 128 } = coordinates;
                    ctx.drawImage(shirt, sx, sy, sw, sh, dx, dy, dw, dh);
                }
            }
        }

        return {
            canvas,
            ctx,
            generateShowcase,
        };
    }

    function createSettings() {
        function setSettingFile(settingName, file, fileName) {
            const settingDisplay = document.querySelector(
                `[settingDisplay][setting="${settingName}"]`
            );
            this[settingName] = file;
            settingDisplay.innerText = `${
                settingName.charAt(0).toUpperCase() + settingName.slice(1)
            }:`;
            settingDisplay.innerText = settingDisplay.innerText + ` ${fileName}`;
        }

        return {
            shirt: undefined,
            pants: undefined,
            colorValue: '',
            setSettingFile,
        };
    }

    function listenForFileUpload() {
        const uploadButtons = document.querySelectorAll('[uploadButton]');
        uploadButtons.forEach(uploadButton => {
            const uploadButtonSetting = uploadButton.attributes.setting.value;
            uploadButton.addEventListener('click', () => handleFileUpload(uploadButtonSetting));
        });
    }

    async function handleFileUpload(uploadButtonSetting) {
        const [file, fileName] = await getFileUpload();
        settings.setSettingFile(uploadButtonSetting, file, fileName);
    }

    async function getFileUpload() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/PNG';
        fileInput.click();
        return new Promise(resolve => {
            fileInput.onchange = () => {
                const file = fileInput.files[0];
                const fileName = file.name;
                fileInput.remove();
                const image = new Image();
                image.src = URL.createObjectURL(file);
                image.onload = () => URL.revokeObjectURL(image.src);
                resolve([image, fileName]);
            };
        });
    }

    function listenForColorInput() {
        const colorInput = document.querySelector('[colorInput]');
        colorInput.onchange = () => {
            settings.colorValue = colorInput.value;
        };
    }

    function listenForGenerate() {
        const generateButton = document.querySelector('[generateButton]');
        generateButton.addEventListener('click', () => showcase.generateShowcase());
    }

    function listenForInputs() {
        listenForFileUpload();
        listenForColorInput();
        listenForGenerate();
    }

    const showcase = createShowcase();
    const settings = createSettings();
    listenForInputs();
}

setTimeout(() => {
    main();
}, 1000);
