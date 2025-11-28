// vite.config.js
export default {
    // config options
    server: {
      fs: {
        // Allow serving files outside of the root
        allow: [
          "../..",
          "./assets"
        ]
      }
    },
    optimizeDeps: { exclude: ["@babylonjs/havok"] }
}
 

// https://forum.babylonjs.com/t/importing-and-implementing-havok-in-vite-react-ts-project-fails/48441/4