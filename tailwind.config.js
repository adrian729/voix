/** @type {import('tailwindcss').Config} */

function twRgbFromHex(color: string) {
    return `rgb(from var(${color}) r g b / <alpha-value>)`;
}

export default {
    darkMode: 'class',
    content: [
        './index.html',
        './src/**/*.{vue,js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                skin: {
                    'base': twRgbFromHex('--color-text-base'),
                    'inverted': twRgbFromHex('--color-text-inverted'),
                    'fill': twRgbFromHex('--color-fill'),
                    'fill-inverted': twRgbFromHex('--color-fill-inverted'),
                    'primary': twRgbFromHex('--color-primary'),
                    'secondary': twRgbFromHex('--color-secondary'),
                    'tertiary': twRgbFromHex('--color-tertiary'),
                    'danger': twRgbFromHex('--color-danger'),
                },
            },
            backgroundColor: {
                skin: {
                    'fill': twRgbFromHex('--color-fill'),
                    'fill-inverted': twRgbFromHex('--color-fill-inverted'),
                    'primary': twRgbFromHex('--color-primary'),
                    'secondary': twRgbFromHex('--color-secondary'),
                    'tertiary': twRgbFromHex('--color-tertiary'),
                    'danger': twRgbFromHex('--color-danger'),
                },
            },
            textColor: {
                skin: {
                    base: twRgbFromHex('--color-text-base'),
                    inverted: twRgbFromHex('--color-text-inverted'),
                    primary: twRgbFromHex('--color-primary'),
                    secondary: twRgbFromHex('--color-secondary'),
                    tertiary: twRgbFromHex('--color-tertiary'),
                    danger: twRgbFromHex('--color-danger'),
                },
            },
            screens: {
                xs: '475px',
            },
            spacing: {
                13: '3.25rem',
                15: '3.75rem',
                17: '4.25rem',
                18: '4.5rem',
                19: '4.75rem',
                128: '32rem',
                144: '36rem',
                256: '64rem',
            },
            flexGrow: {
                1: '1',
                2: '2',
                3: '3',
                4: '4',
                5: '5',
                6: '6',
                7: '7',
                8: '8',
            },
            gridTemplateColumns: {
                16: 'repeat(16, minmax(0, 1fr))',
                20: 'repeat(20, minmax(0, 1fr))',
                50: 'repeat(50, minmax(0, 1fr))',
            },
            backgroundImage: {
                'logo-pattern': 'linear-gradient(to top, var(--color-fill) 40%, var(--color-primary) 40% 50%, var(--color-fill) 50%)',
            },
            boxShadow: {
                'xs': '0 0.5px 1px 0 rgb rgba(0, 0, 0, 0.05)',
                '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
            },
            blur: {
                xs: '2px',
            },
            ringWidth: {
                6: '6px',
                10: '10px',
            },
            animation: {
                'blink-fast': 'blink-animation 0.5s steps(2, start) infinite',
                'blink': 'blink-animation 1s steps(2, start) infinite',
                'blink-slow': 'blink-animation 1.5s steps(2, start) infinite',
                'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                'blink-animation': {
                    to: {
                        visibility: 'hidden',
                    },
                },
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
