# MMV - fast AEC web viewer

<img src="https://user-images.githubusercontent.com/440241/71213288-f83dd880-2267-11ea-99cc-0f43d4706781.gif" width="700px" />
![output](https://user-images.githubusercontent.com/440241/71213288-f83dd880-2267-11ea-99cc-0f43d4706781.gif)

![anim](https://user-images.githubusercontent.com/440241/71212884-17883600-2267-11ea-857f-74ed4223c119.gif)

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


#### Creating Zeux compressed glb from Forge

*Steps:*

1. grab an access token
2. get the URN
3. run the following...

```
export FORGE_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiIsImtpZCI6Imp3dF9zeW1tZXRyaWNfa2V5In0.eyJjbGllbnRfaWQiOiJHYjNobDY5S21YOGpQQkJnQXJtU1RRNmdDR3Bna3VCaiIsImV4cCI6MTU3Njc0NzQ0MSwic2NvcGUiOlsiZGF0YTpyZWFkIiwiZGF0YTp3cml0ZSIsImRhdGE6Y3JlYXRlIiwiYnVja2V0OnJlYWQiLCJidWNrZXQ6ZGVsZXRlIiwiYnVja2V0OnVwZGF0ZSIsImJ1Y2tldDpjcmVhdGUiXSwiYXVkIjoiaHR0cHM6Ly9hdXRvZGVzay5jb20vYXVkL2p3dGV4cDYwIiwianRpIjoiVDVqbTNIV05BWGp4ZkFEd1lhZWJPUXRzcHEzNjVqYXNqYVhLRDBkc25RVXU1YWJoQ29QZHZYam1TQm8yemQzSSJ9.jQA8QR4Y9Nqy9uKFCWMJlWjAmYX2SmitSACOb4MKxHM

 forge-convert dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6cm9tYV90cmUvMDFfUGFsYXp6b1NpbHZlc3RyaVJpdmFsZGlfTWFzdGVyLnJ2dA --output-folder tmp --deduplicate --skip-unused-uvs --ignore-lines --ignore-points

./gltfpack -c -i /Users/michaelbeale/tt/tmp/dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6cm9tYV90cmUvMDFfUGFsYXp6b1NpbHZlc3RyaVJpdmFsZGlfTWFzdGVyLnJ2dA/a90e31dc-c9be-3afd-928a-85c212c91bec/output.gltf -o ./test.glb
```
