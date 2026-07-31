function main() {
    const shirtDrawingCoordinates = [
        {
            sx: 151,
            sy: 355,
            sw: 64,
            dx: 10,
            dw: 64,
        },
        {
            sx: 231,
            sy: 74,
            sw: 128,
            dx: 92,
            dw: 128,
        },
        {
            sx: 217,
            sy: 355,
            sw: 64,
            dx: 156,
            dw: 64,
        },
        {
            sx: 308,
            sy: 355,
            sw: 64,
            dx: 286,
            dw: 64,
        },
        {
            sx: 440,
            sy: 355,
            sw: 64,
            dx: 358,
            dw: 64,
        },
        {
            sx: 427,
            sy: 74,
            sw: 128,
            dx: 422,
            dw: 128,
        },
        {
            sx: 85,
            sy: 355,
            sw: 64,
            dx: 550,
            dw: 64,
        },
        {
            sx: 374,
            sy: 355,
            sw: 64,
            dx: 632,
            dw: 64,
        },
    ];

    const pantsDrawingCoordinates = [
        {
            sx: 151,
            sy: 355,
            sw: 64,
            dx: 10,
            dy: 146,
            dw: 64,
        },
        {
            sx: 217,
            sy: 355,
            sw: 64,
            dx: 156,
            dy: 146,
            dw: 64,
        },
        {
            sx: 308,
            sy: 355,
            sw: 64,
            dx: 156,
            dy: 146,
            dw: 64,
        },
        {
            sx: 231,
            sy: 74,
            sw: 128,
            dx: 156,
            dy: 18,
            dw: 128,
        },
        {
            sx: 440,
            sy: 355,
            sw: 64,
            dx: 358,
            dy: 146,
            dw: 64,
        },
        {
            sx: 85,
            sy: 355,
            sw: 64,
            dx: 358,
            dy: 146,
            dw: 64,
        },
        {
            sx: 427,
            sy: 74,
            sw: 128,
            dx: 358,
            dy: 18,
            dw: 128,
        },
        {
            sx: 374,
            sy: 355,
            sw: 64,
            dx: 632,
            dy: 146,
            dw: 64,
        },
    ];

    const skinDrawingCoordinates = [
        {
            x: 31,
            y: 18,
            w: 64,
            h: 256,
        },
        {
            x: 96,
            y: 18,
            w: 256,
            h: 128,
        },
        {
            x: 160,
            y: 18,
            w: 128,
            h: 256,
        },
        {
            x: 353,
            y: 18,
            w: 256,
            h: 128,
        },
        {
            x: 417,
            y: 18,
            w: 128,
            h: 256,
        },
        {
            x: 610,
            y: 18,
            w: 64,
            h: 256,
        },
    ];

    // Offset for drawing content only (not template)
    const DEFAULT_Y_OFFSET = 48; // move shirt, pants, and skin down 48 pixels
    const X_OFFSET_DEFAULT = 0;

    function createShowcase() {
        const canvas = document.querySelector('canvas');
        if (!canvas) {
            console.error('No canvas found on the page.');
            return {
                canvas: null,
                ctx: null,
                generateShowcase: () => {},
            };
        }

        const ctx = canvas.getContext('2d');
        const showcaseTemplate = new Image();
        showcaseTemplate.src = 'showcaseTemplate.png';
        showcaseTemplate.onload = () => {
            // draw template immediately after load so initial state isn't blank
            ctx.drawImage(showcaseTemplate, 0, 0);
        };
        showcaseTemplate.onerror = () => {
            console.warn('Failed to load showcaseTemplate.png');
        };

        function generateShowcase() {
            try {
                // clear first so we don't leave stale pixels
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Draw template at normal position (not offset)
                if (showcaseTemplate.complete && showcaseTemplate.naturalWidth !== 0) {
                    ctx.drawImage(showcaseTemplate, 0, 0);
                } else {
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }

                const { shirt, pants, colorValue: skinColor } = settings;

                // Save state before translating for shirt/pants/skin
                ctx.save();
                // translate according to user controlled offsets (allows aligning the output inside the template)
                ctx.translate(settings.xOffset, settings.yOffset);

                // OPTIONAL: Clip drawing to the template area so the output can't draw outside the visible showcase.
                // If your template has a known inner area where the body should be drawn, set these values to match it.
                // For now we'll clip to the whole canvas; you can narrow these values to the template's inner rect later.
                ctx.beginPath();
                ctx.rect(0, 0, canvas.width, canvas.height);
                ctx.clip();

                // DRAWS SKIN COLOR (use a safe default if no color chosen)
                if (shirt || pants) {
                    ctx.fillStyle = skinColor || '#f1c27d';
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
                        const { sx, sy, sw, sh = 128, dx, dy = 18, dw, dh = 128 } = coordinates;
                        ctx.drawImage(shirt, sx, sy, sw, sh, dx, dy, dw, dh);
                    }
                }

                ctx.restore();
            } catch (err) {
                console.error('Error while generating showcase:', err);
                try { ctx.restore(); } catch (e) {}
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
            if (settingDisplay) {
                settingDisplay.innerText = `${
                    settingName.charAt(0).toUpperCase() + settingName.slice(1)
                }:`;
                settingDisplay.innerText = settingDisplay.innerText + ` ${fileName}`;
            }
            // redraw when a file is set so the user sees the result immediately
            try { showcase.generateShowcase(); } catch (e) {}
        }

        return {
            shirt: undefined,
            pants: undefined,
            colorValue: '',
            xOffset: X_OFFSET_DEFAULT,
            yOffset: DEFAULT_Y_OFFSET,
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
        // make accept case-insensitive and allow common image types
        fileInput.accept = 'image/png,image/jpeg,image/*';
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
                showcase.generateShowcase();
            };
        }
    }

    function listenForXOffsetInput() {
        const xOffsetInput = document.querySelector('[xOffsetInput]');
        if (xOffsetInput) {
            xOffsetInput.addEventListener('input', () => {
                settings.xOffset = parseInt(xOffsetInput.value, 10) || 0;
                showcase.generateShowcase();
            });
        }
    }

    function listenForYOffsetInput() {
        const yOffsetInput = document.querySelector('[yOffsetInput]');
        if (yOffsetInput) {
            yOffsetInput.addEventListener('input', () => {
                settings.yOffset = parseInt(yOffsetInput.value, 10) || 0;
                showcase.generateShowcase();
            });
        }
    }

    function listenForGenerate() {
        const generateButton = document.querySelector('[generateButton]');
        if (generateButton) generateButton.addEventListener('click', () => showcase.generateShowcase());
    }

    function listenForInputs() {
        listenForFileUpload();
        listenForColorInput();
        listenForXOffsetInput();
        listenForYOffsetInput();
        listenForGenerate();
    }

    const showcase = createShowcase();
    const settings = createSettings();
    listenForInputs();
}

setTimeout(() => {
    main();
}, 1000);
