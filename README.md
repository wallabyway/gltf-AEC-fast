# MMV - fast AEC web viewer

Goal: Load AEC models as fast as possible.

The demo uses the glTF 'stack' to load the "Ice Stadium.NWD" in a browser in "less than 1 second". 

### Demo: https://wallabyway.github.io/gltf-AEC-fast/

This is done using Zeux compression and three.js R108 loader.  It is based on the discussions here:  https://github.com/KhronosGroup/glTF/issues/1699

![screenshot](https://user-images.githubusercontent.com/440241/71046504-5c885d00-20ed-11ea-9463-8033a804031c.jpg)


#### Resources:
- https://threejs.org/examples/webgl_clipping.html
- https://threejs.org/docs/#examples/en/controls/DragControls
- https://github.com/zeux/meshoptimizer


#### Note: 
MMV stands for "Medium model viewer", so it only loads things of 'medium size' design files.
