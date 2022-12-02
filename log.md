### 2022-12-02
由于需要记录的东西太多了，因此还是写下来
- 进度到目前为止，已经对osgjs文件(v0.2.9)在运行时下的结构进行全解析[see:(@types/osgjs.d.ts)]，并且转换为gltf2.0进度也过半了
- gltf2.0的格式理解也算是入门了，接下来就是怼工作量，对收集到的数据进行拼接和打包并导出
- 由于运行时没有太多字段记录位置信息，对于osgjs->gltf的转换应该不是完美transform，某种意义上的重构refactor,幸亏当初选案的时候选择了gltf，而不是fbx
- 整理一下收集到的文件，发现[file.binz]里面已经存有osgjs文件的基本框架结构，可以通过交叉映射还原一些重要信息，而不是硬核的读取运行时数据源再进行运算得出结果。
- 从[initializeViewer]中的attributes也获取到很多有趣的信息，无论是作者或者是原模型文件和模型的数据都有概括，如果可以的话，也尽量把它给dump出来~
- 从attributes数据中看到默认有11种postProcess，有时间的话，考虑抽出来玩一下~[flag+1]
- 已dump模型信息
- 在对比gltf文件的时候发现了一个meshes扩展写法[可能别的属性也会有]：

```
写法一（两个mesh，两个primitives）：
{
      "name": "helmetCase_helmetCase_0",
      "primitives": [
        {...}
      ]
},
{
      "name": "helmetCase_helmetCase_0",
      "primitives": [
        {...}
      ]
}
写法二（一个mesh，两个primitives）：
{
      "name": "helmetCase_helmetCase_0",
      "primitives": [
        {...},
        {...}
      ]
}
```
- 发现个有趣的情况，osgjs转为sketchfab专用渲染引擎后，内部版本号一直为0.2.9，没有改过~
- 发现个强力好用的vscode插件:[glTF Tools](https://marketplace.visualstudio.com/items?itemName=cesium.gltf-vscode)

### 2022-12-03