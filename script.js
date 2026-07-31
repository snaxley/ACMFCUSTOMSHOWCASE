function main() {
    // SHIRTS: Base Y position shifted from 18px down to 48px down.
    // You can now freely change any "dx" to adjust horizontal alignment independently.
    const shirtDrawingCoordinates = [
        { sx: 151, sy: 355, sw: 64,  dx: 31,  dw: 64,  dy: 48 },
        { sx: 231, sy: 74,  sw: 128, dx: 160, dw: 128, dy: 48 },
        { sx: 217, sy: 355, sw: 64,  dx: 96,  dw: 64,  dy: 48 },
        { sx: 308, sy: 355, sw: 64,  dx: 288, dw: 64,  dy: 48 },
        { sx: 440, sy: 355, sw: 64,  dx: 353, dw: 64,  dy: 48 },
        { sx: 427, sy: 74,  sw: 128, dx: 417, dw: 128, dy: 48 },
        { sx: 85,  sy: 355, sw: 64,  dx: 545, dw: 64,  dy: 48 },
        { sx: 374, sy: 355, sw: 64,  dx: 610, dw: 64,  dy: 48 }
    ];

    // PANTS: Every piece shifted down by 30px to perfectly match the shirt adjustments.
    const pantsDrawingCoordinates = [
        { sx: 151, sy: 355, sw: 64,  dx: 31,  dw: 64,  dy: 176 }, // 146 + 30
        { sx: 217, sy: 355, sw: 64,  dx: 160, dw: 64,  dy: 176 },
        { sx: 308, sy: 355, sw: 64,  dx: 224, dw: 64,  dy: 176 },
        { sx: 231, sy: 74,  sw: 128, dx: 160, dw: 128, dy: 48  }, // 18 + 30
        { sx: 440, sy: 355, sw: 64,  dx: 417, dw: 64,  dy: 176 },
        { sx: 85,  sy: 355, sw: 64,  dx: 481, dw: 64,  dy: 176 },
        { sx: 427, sy: 74,  sw: 128, dx: 417, dw: 128, dy: 48  },
        { sx: 374, sy: 355, sw: 64,  dx: 610, dw: 64,  dy: 176 }
    ];

    // SKIN BACKGROUND: Y limits adjusted down to 48px to match the layered clothes.
    const skinDrawingCoordinates = [
        { x: 31,  y: 48, w: 64,  h: 256 },
        { x: 96,  y: 48, w: 256, h: 128 },
        { x: 160, y: 48, w: 128, h: 256 },
        { x: 353, y: 48, w: 256, h: 128 },
        { x: 417, y: 48, w: 128, h: 256 },
        { x: 610, y: 48, w: 64,  h: 256 }
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
            
            // 1. DRAWS SKIN COLOR
            if (shirt || pants) {
                ctx.fillStyle = skinColor;
                for (const coordinates of skinDrawingCoordinates) {
                    ctx.fillRect(coordinates.x, coordinates.y, coordinates.w, coordinates.h);
                }
            }

            // 2. DRAWS PANTS (Direct references resolve code freezes)
            if (pants) {
                for (const coord of pantsDrawingCoordinates) {
                    ctx.drawImage(
                        pants, 
                        coord.sx, 
                        coord.sy, 
                        coord.sw, 
                        128, 
                        coord.dx, 
                        coord.dy, 
                        coord.dw, 
                        128
                    );
                }
            }
            
            // 3. DRAWS SHIRT (Direct references resolve code freezes)
            if (shirt) {
                for (const coord of shirtDrawingCoordinates) {
                    ctx.drawImage(
                        shirt, 
                        coord.sx, 
                        coord.sy, 
                        coord.sw, 
                        128, 
                        coord.dx, 
                        coord.dy, 
                        coord.dw, 
                        128
                    );
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
        if (colorInput) {
            colorInput.onchange = () => {
                settings.colorValue = colorInput.value;
            };
        }
    }

    function listenForGenerate() {
        const generateButton = document.querySelector('[generateButton]');
        if (generateButton) {
            generateButton.addEventListener('click', () => showcase.generateShowcase());
        }
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
