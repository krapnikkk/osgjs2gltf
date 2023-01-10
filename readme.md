## osg2gltf

[English](./readme_en.md)

### 这是什么？
本项目基于[osgjs](https://github.com/cedricpinson/osgjs)对运行时中的osg数据进行转换为glTF2.0数据并导出的核心代码（[主要参考代码](https://github.com/cedricpinson/osgjs/blob/d3c9a4bebeebfb891eb2d708cd0828c126aeec18/sources/osgPlugins/ReaderWriterGLTF.js)）

**本项目不能独立运行，需要存在osgjs的运行时环境才能运行。**

**[暂不提供构造osgjs的运行时环境的方法]**



### 材质支持情况：

| 功能                             | 支持情况|
|----------------------------------|:------------------:|
| pbrMetallicRoughness | :white_check_mark: |
| normalTexture | :white_check_mark: |
| occlusionTexture | :white_check_mark: |
| emissiveTexture | :white_check_mark: |
| emissiveFactor | :white_check_mark: |
| emissiveFactor | :white_check_mark: |
| bump map |  |
| alphaCutoff |  |
| doubleSided |  |

### 新特性
- [ ] author license
- [ ] camera
- [ ] node's properties
- [ ] animations
- [ ] extensions cover
- [ ] enviroments
- [ ] wireframe
- [ ] lights
- [ ] PBR

### 更新日志
[更新日志/changelog](./changelog.md)

### 参考资料
 - [osgjs](https://github.com/cedricpinson/osgjs)
 - [glTF](https://github.com/KhronosGroup/glTF)
 - [glTF-Tutorials](https://github.com/KhronosGroup/glTF-Tutorials)
 - [glTF-Sample-Models](https://github.com/KhronosGroup/glTF-Sample-Models)