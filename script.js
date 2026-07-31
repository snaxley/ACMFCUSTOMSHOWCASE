function main() {
    // SHIRTS: Shifted down 30 pixels (Baseline dy is now 48). 
    // You can now freely change any "dx" to push pieces left or right without structural breaks!
    const shirtDrawingCoordinates = [
        { sx: 151, sy: 355, sw: 64,  dw: 64,  dx: 31,  dy: 48 },  // Right Arm Side 1
        { sx: 231, sy: 74,  sw: 128, dw: 128, dx: 160, dy: 48 },  // Torso Front
        { sx: 217, sy: 355, sw: 64,  dw: 64,  dx: 96,  dy: 48 },  // Right Arm Side 2
        { sx: 308, sy: 355, sw: 64,  dw: 64,  dx: 288, dy: 48 },  // Left Arm Side 1
        { sx: 440, sy: 355, sw: 64,  dw: 64,  dx: 353, dy: 48 },  // Left Arm Side 2
        { sx: 427, sy: 74,  sw: 128, dw: 128, dx: 417, dy: 48 },  // Torso Back
        { sx: 85,  sy: 355, sw: 64,  dw: 64,  dx: 545, dy: 48 },  // R-Arm Outer
        { sx: 374, sy: 355, sw: 64,  dw: 64,  dx: 610, dy: 48 }   // L-Arm Outer
    ];

    // PANTS: Shifted down 30 pixels to match the exact spacing of the torso pieces above.
    const pantsDrawingCoordinates = [
        { sx: 151, sy: 355, sw: 64,  dw: 64,  dx: 31,  dy: 176 }, // Right Leg (146 + 30)
        { sx: 217, sy: 355, sw: 64,  dw: 64,  dx: 160, dy: 176 }, // Leg Front
        { sx: 308, sy: 355, sw: 64,  dw: 64,  dx: 224, dy: 176 }, // Leg Back
        { sx: 231, sy: 74,  sw: 128, dw: 128, dx: 160, dy: 48  }, // Hip/Pelvis Front (18 + 30)
        { sx: 440, sy: 355, sw: 64,  dw: 64,  dx: 417, dy: 176 }, // Leg Side
        { sx: 85,  sy: 355, sw: 64,  dw: 64,  dx: 481, dy: 176 }, // Leg Outer
        { sx: 427, sy: 74,  sw: 128, dw: 128, dx: 417, dy: 48  }, // Hip/Pelvis Back (18 + 30)
        { sx: 374, sy: 355, sw: 64,  dw: 64,  dx: 610, dy: 176 }  // Leg Outer 2
    ];

    // SKIN BACKGROUND: Shifted down to match the new 48px clothes rendering limits.
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
            
            // 1. DRAWS SKIN BACKGROUND
            if (shirt || pants) {
                ctx.fillStyle = skinColor || 'transparent';
                for (const coordinates of skinDrawingCoordinates) {
                    ctx.fillRect(coordinates.x, coordinates.y, coordinates.w, coordinates.h);
                }
            }

            // 2. DRAWS PANTS (Direct references fix layout freezing bugs)
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
            
            // 3. DRAWS SHIRTS (Direct references fix layout freezing bugs)
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
