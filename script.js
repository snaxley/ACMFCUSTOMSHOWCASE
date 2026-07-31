function main() {
    // SHIRTS: Shifted down 30 pixels (Baseline dy is now 48). 
    // You can now freely change any "dx" to push pieces left or right without structural breaks!
    // SHIRTS: Re-mapped to drop perfectly into the 4 presentation boxes (RIGHT, FRONT, BACK, LEFT)
// SHIRTS: Kept your perfect placement but cleaned up sizes
const shirtDrawingCoordinates = [
    { sx: 151, sy: 355, sw: 64,  dw: 64,  dx: 45,  dy: 82  }, // RIGHT
    { sx: 231, sy: 74,  sw: 128, dw: 128, dx: 172, dy: 82  }, // FRONT
    { sx: 427, sy: 74,  sw: 128, dw: 128, dx: 404, dy: 82  }, // BACK
    { sx: 85,  sy: 355, sw: 64,  dw: 64,  dx: 595, dy: 82  }  // LEFT
];

// PANTS: FIXED - Changed dw to 64 and centered dx under the shirt blocks
const pantsDrawingCoordinates = [
    { sx: 151, sy: 355, sw: 64,  dw: 64,  dx: 45,  dy: 146 }, // RIGHT leg
    { sx: 217, sy: 355, sw: 64,  dw: 64,  dx: 204, dy: 146 }, // FRONT leg (Centered: 172 + 32)
    { sx: 308, sy: 355, sw: 64,  dw: 64,  dx: 436, dy: 146 }, // BACK leg  (Centered: 404 + 32)
    { sx: 374, sy: 355, sw: 64,  dw: 64,  dx: 595, dy: 146 }  // LEFT leg
];

// SKIN BACKGROUND: Adjusted to sit perfectly under the crisp new layout bounding frames
const skinDrawingCoordinates = [
    { x: 45,  y: 82, w: 64,  h: 192 }, // RIGHT
    { x: 172, y: 82, w: 128, h: 192 }, // FRONT
    { x: 404, y: 82, w: 128, h: 192 }, // BACK
    { x: 595, y: 82, w: 64,  h: 192 }  // LEFT
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
