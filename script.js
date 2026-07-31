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
            dx: 160,
            dw: 128,
        },
        {
            sx: 217,
            sy: 355,
            sw: 64,
            dx: 96,
            dw: 64,
        },
        {
            sx: 308,
            sy: 355,
            sw: 64,
            dx: 288,
            dw: 64,
        },
        {
            sx: 440,
            sy: 355,
            sw: 64,
            dx: 353,
            dw: 64,
        },
        {
            sx: 427,
            sy: 74,
            sw: 128,
            dx: 417,
            dw: 128,
        },
        {
            sx: 85,
            sy: 355,
            sw: 64,
            dx: 545,
            dw: 64,
        },
        {
            sx: 374,
            sy: 355,
            sw: 64,
            dx: 610,
            dw: 64,
        },
    ];

    const pantsDrawingCoordinates = [
        {
            sx: 151,
            sy: 355,
            sw: 64,
            dx: 31,
            dy: 146,
            dw: 64,
        },
        {
            sx: 217,
            sy: 355,
            sw: 64,
            dx: 160,
            dy: 146,
            dw: 64,
        },
        {
            sx: 308,
            sy: 355,
            sw: 64,
            dx: 224,
            dy: 146,
            dw: 64,
        },
        {
            sx: 231,
            sy: 74,
            sw: 128,
            dx: 160,
            dy: 18,
            dw: 128,
        },
        {
            sx: 440,
            sy: 355,
            sw: 64,
            dx: 417,
            dy: 146,
            dw: 64,
        },
        {
            sx: 85,
            sy: 355,
            sw: 64,
            dx: 481,
            dy: 146,
            dw: 64,
        },
        {
            sx: 427,
            sy: 74,
            sw: 128,
            dx: 417,
            dy: 18,
            dw: 128,
        },
        {
            sx: 374,
            sy: 355,
            sw: 64,
            dx: 610,
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

    // A single place to tweak the vertical offset; declared BEFORE use to avoid TDZ errors
    const Y_OFFSET = 30; // move everything drawn below the template down 30 pixels

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

                ctx.save();
                ctx.translate(0, Y_OFFSET);
                const Y_OFFSET = 44;
                // If the template hasn't loaded yet, draw a neutral background (not black)
                if (showcaseTemplate.complete && showcaseTemplate.naturalWidth !== 0) {
                    ctx.drawImage(showcaseTemplate, 0, 0);
                } else {
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }

                const { shirt, pants, colorValue: skinColor } = settings;

                // DRAWS SKIN COLOR (use a safe default if no](#)
