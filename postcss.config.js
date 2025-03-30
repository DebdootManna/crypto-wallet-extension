// module.exports = {
//   plugins: {
//     tailwindcss: {},
//     autoprefixer: {},
//   },
// }

// export default {
//   plugins: {
//     autoprefixer: {},
//     tailwindcss: {},
//   },
// };

import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';

export default {
  plugins: [tailwindcss, autoprefixer],
};
