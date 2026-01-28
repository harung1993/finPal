// Simple script to create base64 1x1 PNG placeholders
const fs = require('fs');

// 1x1 transparent PNG in base64
const transparentPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

// 48x48 green icon
const iconPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAKGSURBVGiB7ZnPS1RRFMe/5703o6OOTjqppFhRUS1atAhq06JFEARt2rRoEQRBm/6A2rRoUYsWLYJaBEG0aBMRRYsWRYuIqEWLiKhFRBQtWkRELSKi3q0Wc994M+N7v+bNm6Z+4TLMvXPu+dx77jn3vgtkkEEGGfynkPQGkqwE0AKgHsABAOUA9gD4BOAlgCkRmU5rT0ltILkZwH0AJwGIyxoAL0heFJGpNDaVxAaSRwC8AHAY0coLgPsATonIx6Trl1gBkvUA3gIodVn+AOC4iPzwu34iBUj2ApgAsHuVJR8AHBORz37WTqQAgBEAF9ZY8hFAq4gs+lU78RYi+QjAuTWWzwM46lfxQL7bSDYhWvG97iVE5AOASyLywK+bCaQASdYAeAag1mXJVwBtAOYBgGQhgF4A3QD2e3RTfigQSAGSuwBMAdjnsqQDwKSIDEa/dAOcBVBkcacSwCcvbr0USLJIkywH8Nr1+UPpjGp+JcVqZCLJQgDPATS63GkD8NqtexIFAN0ujyeNvNRvn/HSSaQAvPl9L4CznhWItBMRuQjgo4jcrLnTHEiBMAAE8NL9AUz5UTz6GwWAK2ss6wagdaPfm+IksQnAa0QHqkrMAqgBsCQiW9L4z6MieD0bJFnhR/GVCPwXkvQMks0APqdZd80WSLYB+OVh+QySzSTrSBb5sMd8kidITpMcIjlCctrH+x6tOgEF2Wxp0QIAVST3eVi7aFFbSpIgWQPgsci/BaAt0t8HeGZ7ZVYnwPP2TgHoQnTSWk1hzDNwzmXtzwDOisj3uJdtIvLNyz/B9p+IOD+kxSIyQPIhgHaXhyKAJhF55vYflYH/NfwGXLDFe1uSDvMAAAAASUVORK5CYII=',
  'base64'
);

fs.writeFileSync('assets/favicon.png', iconPng);
fs.writeFileSync('assets/icon.png', iconPng);
fs.writeFileSync('assets/adaptive-icon.png', iconPng);
fs.writeFileSync('assets/splash.png', iconPng);

console.log('Assets created successfully!');
