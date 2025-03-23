import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				primary: 'var(--white)'
			},
			fontFamily: {
				geist: ['GeistMono']
			},
			keyframes: {
				'springy-bounce': {
					'0%': {
						transform: 'scale(1)',
						opacity: '0'
					},
					'30%': {
						transform: 'scale(1.1)',
						opacity: '0.7'
					},
					'50%': {
						transform: 'scale(0.95)',
						opacity: '1'
					},
					'70%': {
						transform: 'scale(1.05)',
						opacity: '1'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				}
			},
			animation: {
				'springy-bounce-forwards': 'springy-bounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
				'springy-bounce-backwards':
					'springy-bounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) backwards'
			}
		}
	},

	plugins: [typography, forms, containerQueries]
} satisfies Config;
