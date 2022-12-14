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
- 在对节点数据进行还原的时候，发现存在重名的情况，有的设计师【无论是2d还是3d】，对命名真的很随意或者是重复名称
- 经过一番对比，发现运行时下osgjs数据精简了大量重要索引类数据，还原文件的精度丢失不是点点[陷入困境]
- 好消息是其实还有plan B，先复盘一下方案：
  - 方案一：以运行时中的osgjs场景节点树作为数据源，实时重构数据
    - 优点：不容易失效，因为作为一个稳定的项目场景树不会大变动
    - 缺点：缺少源码重构还出现遗漏，覆盖率不全
  - 方案二：解析数据源重构
    - 优点：数据结构稳定，能快速还原
    - 缺点：调整了一个字节都需要重新解析

### 2022-12-06
- 一番恶补之后，总算可以为所欲为的从网页中提取想要的数据
- file.binz中的数据类型总算补全了，目前Version为[9]，Generator为[OpenSceneGraph 3.5.6]，开始苦逼转换重构gltf

### 2022-12-07
- 再次遇到挑战，需要补习一下TRIANGLE_STRIP->TRIANGLES和DrawArrays和DrawElements之间的转换关系了
- sketchfab中模型浏览是拥有单独的浏览页，然后作为一个iframe嵌套在页面上的，这样的好处有两个：
  - 方便嵌套到其他网站上去
  - iframe作为一个全新的线程，不用担心列表大量的模型影响主站性能[ps.一些不支持使用worker的浏览器其实可以使用iframe充当worker]
- sketchfab的模型是带有Wireframe数据的,一个geometry节点下有两种mesh，分别是正常的和Wireframe的，暂时推测是因为在inspector是可以看到切换模型Wireframe模式。然后webgl没有geometry shader所以需要额外处理数据，有空的时候实现一下Wireframe[flag+1]

### 2022-12-08
- 终于搞到重构material这块内容了，然后就是PBR需要恶补知识点了，估计进度会慢上很多

### 2023-01-11
- 本来想进攻动画导出的工作的，发现代码有点难看，决定重构一番
- 快速的移除废弃代码和重构一波之后，发现还是有很多模型是使用Blinn-Phong的传统材质进行着色，下面就研究一下支持这种着色方式的obj和fbx文件好了