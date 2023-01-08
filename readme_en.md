## osg2glTF

### what‘s this:
This project based on [osgjs](https://github.com/cedricpinson/osgjs) in the runtime osg data are converted to glTF2.0 data and export of the core code ([main reference code](https://github.com/cedricpinson/osgjs/blob/d3c9a4bebeebfb891eb2d708cd0828c126aeec18/sources/osgPlugins/ReaderWriterGLTF.js))

**This project cannot be run independently. It requires the osgjs runtime environment to run. **

**[Methods for constructing the osgjs runtime environment are not provided yet]**



### material support：

| properties                   | support |
|----------------------------------|:------------------:|
| pbrMetallicRoughness | :white_check_mark: |
| normalTexture | :white_check_mark: |
| occlusionTexture | :white_check_mark: |
| emissiveTexture | :white_check_mark: |
| emissiveFactor | :white_check_mark: |
| alphaMode |  |
| alphaCutoff |  |
| doubleSided |  |

### features
- [ ] author license
- [ ] camera
- [ ] node's properties
- [ ] animations
- [ ] extensions cover
- [ ] enviroments
- [ ] wireframe
- [ ] lights
- [ ] PBR

### acknowledgements
 - [osgjs](https://github.com/cedricpinson/osgjs)
 - [glTF](https://github.com/KhronosGroup/glTF)
 - [glTF-Tutorials](https://github.com/KhronosGroup/glTF-Tutorials)
 - [glTF-Sample-Models](https://github.com/KhronosGroup/glTF-Sample-Models)