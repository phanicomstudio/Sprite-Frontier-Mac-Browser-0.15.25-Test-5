# 3D model assets

runtime/<model-id>/ contains the game-ready GLB/glTF, accompanying textures and metadata.json. authoring/<model-id>/ holds original source files and is excluded from play packages. Never store original authoring files beside the runtime copy. Events reference a shared model ID; geometry is stored once in the model library.

Engine world coordinates: X east, Y north, Z up. glTF uses Y up; the importer converts glTF (x,y,z) to engine (x,-z,y). Editor angles are degrees; internal transform matrices use radians. Attached boxes use model-local engine coordinates, so model scale and rotation apply to their centers, sizes and orientation.
