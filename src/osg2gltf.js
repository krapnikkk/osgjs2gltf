var PRIMITIVE_TABLE = {
    "POINTS": 0,
    "LINES": 1,
    "LINE_LOOP": 2,
    "LINE_STRIP": 3,
    "TRIANGLES": 4,
    "TRIANGLE_STRIP": 5,
    "TRIANGLE_FAN": 6
};
let TYPE_TABLE = {
    1: "SCALAR",
    2: "VEC2",
    3: "VEC3",
    4: "VEC4",
    5: "MAT2",
    6: "MAT3",
    7: "MAT4"
};
let TYPED_ARRAY = {
    "Float32Array": Float32Array,
    "Float64Array": Float64Array,
    "Int8Array": Int8Array,
    "Int16Array": Int16Array,
    "Int32Array": Int32Array,
    "Uint8Array": Uint8Array,
    "Uint16Array": Uint16Array,
    "Uint32Array": Uint32Array,
    "Uint8ClampedArray": Uint8ClampedArray
};
let TARGET_TABLE = {
    "ARRAY_BUFFER": 34962,
    "ELEMENT_ARRAY_BUFFER": 34963
};
let INDICES_COMPONENT_TYPE_TABE = {
    "DrawElementsUByte": 5121,
    "DrawElementsUShort": 5123,
    "DrawElementsUInt": 5125 // 4
};
let COMPONENT_TYPE_TABE = {
    "BYTE": 5120,
    "UNSIGNED_BYTE": 5121,
    "SHORT": 5122,
    "UNSIGNED_SHORT": 5123,
    "UNSIGNED_INT": 5125,
    "FLOAT": 5126
};
let ATTRIBUTE_TABLE = {
    'Vertex': 'POSITION',
    'Normal': 'NORMAL',
    'Tangent': 'TANGENT',
    'TexCoord0': 'TEXCOORD_0',
    'TexCoord1': 'TEXCOORD_1',
    'TexCoord2': 'TEXCOORD_2',
    'TexCoord3': 'TEXCOORD_3',
    'TexCoord4': 'TEXCOORD_4',
    'TexCoord5': 'TEXCOORD_5',
    'TexCoord6': 'TEXCOORD_6',
    'TexCoord7': 'TEXCOORD_7',
    'TexCoord8': 'TEXCOORD_8',
    'TexCoord9': 'TEXCOORD_9',
    'TexCoord10': 'TEXCOORD_10',
    'TexCoord11': 'TEXCOORD_11',
    'TexCoord12': 'TEXCOORD_12',
    'TexCoord13': 'TEXCOORD_13',
    'TexCoord14': 'TEXCOORD_14',
    'TexCoord15': 'TEXCOORD_15',
    'Color': 'COLOR_0',
    'Bones': 'JOINTS_0',
    'Weights': 'WEIGHTS_0'
};
let nodeMap = {
    "osg.Node": [],
    "osg.MatrixTransform": [],
    "osg.Geometry": [],
};
let globalNodes = [], gltfNodes = [], nodeId = 1;
let globalAccessors = [], accessorId = 0;
let globalMeshes = [], meshId = 0;
let globalMaterials = [], materialId = 0;
let globalBufferViews = [], bufferViewId = 0;
let globalTextures = [], textureId = 0;
let globalImages = [];
let globalSamplers = [];
function decodeUint8Array(e) {
    let i = "";
    for (var n = new Uint8Array(e), r = 0; r < e.length; r += 65535)
        i += String.fromCharCode.apply(null, n.slice(r, r + 65535));
    return i;
}
function decodeFileBinz(file) {
    let txt = decodeUint8Array(file);
    return JSON.parse(txt);
}
function decodeOSGRoot(root) {
    // root as scenes
    gltfNodes.push({
        "children": [
            1
        ],
        "name": "Sketchfab_model"
    });
    splitChildren(root["osg.Node"].Children);
}
function splitChildren(nodes) {
    nodes.forEach((item) => {
        for (let key in item) {
            let element = item[key];
            let elementStr = JSON.stringify(element);
            let hasWireframe = key == "osg.Geometry" && elementStr.indexOf("model_file_wireframe") !== -1;
            if (hasWireframe)
                continue;
            let isWireframeNode = false;
            if (element.Children && element.Children[0] && element.Children[0]["osg.Node"]) {
                let child = element.Children[0]["osg.Node"];
                if (child.Name == element.Name && key == "osg.MatrixTransform") {
                    isWireframeNode = true;
                }
            }
            if (typeof element.nodeId == "undefined" && !isWireframeNode) {
                element.nodeId = nodeId++;
                element.type = key;
            }
            if (globalNodes.indexOf(element) == -1 && !isWireframeNode) {
                globalNodes.push(element);
                nodeMap[key].push(element);
            }
            if (element.Children) {
                splitChildren(element.Children);
            }
        }
    });
}
function decodeOSGNode(nodes) {
    nodes.forEach((node) => {
        gltfNodes.push(generateGltfNode(node));
    });
}
function generateGltfNode(node) {
    let { Name, type, Children } = node;
    let children = Children ? getNodeChildren(Object.values(Children)) : null;
    let obj = { name: Name };
    if (children) {
        Object.assign(obj, { children });
    }
    switch (type) {
        case "osg.Node" /* OSG.ENode.Node */:
            break;
        case "osg.MatrixTransform" /* OSG.ENode.MatrixTransform */:
            let { Matrix } = node;
            if (Matrix && JSON.stringify(Matrix) != '[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]') {
                Object.assign(obj, { matrix: Matrix });
            }
            break;
        case "osg.Geometry" /* OSG.ENode.Geometry */:
            Object.assign(obj, { mesh: meshId++ });
            node['meshId'] = meshId;
            break;
        default:
            debugger;
            break;
    }
    return obj;
}
function decodeOSGGeometries(nodes) {
    nodes.forEach((node) => {
        generateGltfMesh(node);
    });
}
function getNodeChildren(nodes) {
    let ids = [];
    nodes.forEach((node) => {
        let child = Object.values(node)[0];
        let id = child.nodeId || child.Children && Object.values(child.Children[0])[0].nodeId;
        if (typeof id != "undefined") {
            ids.push(id);
        }
    });
    return ids;
}
function generateGltfMesh(node) {
    let { PrimitiveSetList, StateSet, VertexAttributeList, Name } = node;
    let primitives = [];
    let mesh = {
        name: Name,
        primitives
    };
    let primitive = Object.create({});
    primitives.push(primitive);
    if (VertexAttributeList) { //accessors -> attributes
        if (Name == "saberRed_saberRed_0") {
            debugger;
        }
        let attributes = decodeOSGVertexAttribute(VertexAttributeList, Name);
        if (attributes && JSON.stringify(attributes) != "{}") {
            primitive.attributes = attributes;
        }
    }
    if (PrimitiveSetList) { //accessors ->primitives[indices]
        let primitiveArr = decodeOSGPrimitiveSet(PrimitiveSetList);
        if (primitiveArr.length > 1) {
            debugger;
        }
        ;
        Object.assign(primitive, primitiveArr[0]);
    }
    if (StateSet) { // material
        let hasMaterial = decodeOSGStateSet(StateSet['osg.StateSet']);
        if (hasMaterial) {
            Object.assign(primitive, { material: materialId++ });
        }
    }
    globalMeshes.push(mesh);
}
function decodeOSGStateSet(stateSet) {
    let flag = false;
    let { AttributeList, TextureAttributeList } = stateSet;
    if (AttributeList) {
        AttributeList.forEach((attribute) => {
            let material = attribute['osg.Material'];
            let { Name } = material;
            let mtl = Object.create({});
            Object.assign(mtl, {
                name: Name,
                doubleSided: true
            });
            let state = findMaterialFromRoot(Name, _root_);
            if (state) {
                let arrtibute = decodeOSGJSStateSet(state);
                Object.assign(mtl, arrtibute);
            }
            flag = true;
            stateSet.materialId = materialId;
            globalMaterials.push(mtl);
        });
    }
    if (TextureAttributeList) {
        debugger;
    }
    return flag;
}
function decodeOSGJSStateSet(stateSet) {
    let { _attributeArray } = stateSet;
    let attribute = _attributeArray[0];
    let { _object } = attribute;
    let { _activeChannels } = _object;
    if (_activeChannels.length > 5) {
        debugger;
    }
    ;
    // 0->baseColor 1 -> metalness 2-> glossness/roughness 3->emission  4->specularF0
    let pbrMetallicRoughness = Object.create({});
    let emissiveFactor, emissiveTexture;
    _activeChannels.forEach((channel) => {
        let { attributes } = channel;
        let { color, factor, textureModel, displayName } = attributes;
        if (displayName == "Base Color") {
            if (color) {
                pbrMetallicRoughness.baseColorFactor = [...color.map((c) => c * factor), 1.0];
            }
            else if (factor != 1) {
                pbrMetallicRoughness.baseColorFactor = [...[1.0, 1.0, 1.0].map((c) => c * factor), 1.0];
            }
            if (textureModel) {
                pbrMetallicRoughness.baseColorTexture = {
                    index: textureId++
                };
                // todo search by textureModel
                // textureModel['id'] = textureId++;
                decodeOSGTexture(textureModel);
            }
        }
        else {
            if (displayName == "Metalness") {
                pbrMetallicRoughness.metallicFactor = factor;
            }
            else if (displayName == "Glossiness") {
                1 - factor !== 1 ? pbrMetallicRoughness.roughnessFactor = 1 - factor : null;
            }
            else if (displayName == "Emission") {
                if (color) {
                    emissiveFactor = [...color.map((c) => {
                            let res = c * factor;
                            if (res < 1) {
                                return res;
                            }
                            else {
                                return c;
                            }
                        })];
                }
                if (textureModel) {
                    emissiveTexture = {
                        index: textureId++
                    };
                    if (!color) {
                        emissiveFactor = [factor, factor, factor];
                    }
                    decodeOSGTexture(textureModel);
                }
            }
            else if (displayName == "Specular F0") {
            }
            else {
                debugger;
            }
        }
    });
    let attr = Object.create({});
    Object.assign(attr, { pbrMetallicRoughness });
    if (emissiveFactor && JSON.stringify(emissiveFactor) != '[0,0,0]') {
        Object.assign(attr, { emissiveFactor });
    }
    if (emissiveTexture) {
        Object.assign(attr, { emissiveTexture });
    }
    return attr;
}
function findMaterialFromRoot(name, node) {
    let { children } = node;
    let stateSet;
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        stateSet = getMaterialFromOSGJS(name, child);
        if (!stateSet) {
            stateSet = findMaterialFromRoot(name, child);
        }
        if (stateSet) {
            break;
        }
    }
    return stateSet;
}
function getMaterialFromOSGJS(name, node) {
    let res;
    let { stateset } = node;
    if (stateset) {
        let { _name } = stateset;
        if (_name == name && node._name == name) { // todo maybe find all
            res = stateset;
        }
    }
    return res;
}
function findGeometryFromRoot(name, node, key) {
    let { children } = node;
    let geometry;
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        geometry = getGeometryFromOSGJS(name, child, key);
        if (!geometry) {
            geometry = findGeometryFromRoot(name, child, key);
        }
        if (geometry) {
            break;
        }
    }
    return geometry;
}
function getGeometryFromOSGJS(name, node, key) {
    let res;
    if (node.className() == 'Geometry' && node._name == name) { // todo maybe find all
        if (node['getAttributes']()[key] || node['getAttributes']()[`_${key.replace("TexCoord", "")}`]) {
            res = node;
        }
    }
    return res;
}
function decodeOSGPrimitiveSet(primitiveSetList) {
    let primitives = [];
    primitiveSetList.forEach((primitiveSet) => {
        for (let key in primitiveSet) {
            let primitive = primitiveSet[key];
            // globalPrimitiveSetList.push(primitive);
            let gltfPrimitive = {};
            let { Indices, Mode } = primitive;
            let mode = PRIMITIVE_TABLE[Mode];
            let accessor = decodeOSGIndice(Indices, key);
            accessorId++;
            globalAccessors.push(accessor);
            Object.assign(gltfPrimitive, { mode, indices: accessorId });
            primitives.push(gltfPrimitive);
        }
    });
    return primitives;
}
function decodeOSGVertexAttribute(vertextAttribute, Name) {
    let attributes = {};
    for (let key in vertextAttribute) {
        let attribute = vertextAttribute[key];
        delete attribute.UniqueID;
        if (JSON.stringify(attribute) === "{}") {
            continue;
        }
        let type = ATTRIBUTE_TABLE[key];
        let accessor = decodeOSGAttribute(attribute, Name, key);
        if (accessor) {
            accessorId++;
            globalAccessors.push(accessor);
            attributes[type] = accessorId;
        }
        else {
            // other key 
            // debugger;
        }
    }
    return attributes;
}
// primitive.attributes
function decodeOSGAttribute(attribute, Name, key) {
    let accessor = Object.create({});
    let geometry = findGeometryFromRoot(Name, _root_, key);
    if (!geometry) {
        return;
    }
    let { _attributes } = geometry;
    let _attribute = _attributes[key] || _attributes[`_${key.replace("TexCoord", "")}`];
    let { _minMax, _type } = _attribute;
    let { Array, ItemSize, Type } = attribute; // bufferViews
    let byteArray = Object.values(Array)[0];
    let { Size, Offset } = byteArray;
    let type = TYPE_TABLE[ItemSize];
    let bufferView = decodeBufferView(byteArray, Type, ItemSize);
    if (_minMax) {
        Object.assign(accessor, {
            bufferView,
            componentType: _type,
            byteOffset: Offset,
            count: Size,
            max: [_minMax.xmax, _minMax.ymax, _minMax.zmax],
            mim: [_minMax.xmin, _minMax.ymin, _minMax.zmin],
            type,
        });
    }
    else {
        Object.assign(accessor, {
            bufferView,
            componentType: _type,
            byteOffset: Offset,
            count: Size,
            type,
        });
    }
    bufferViewId++;
    return accessor;
}
// primitive.indices
function decodeOSGIndice(indices, uType) {
    let accessor = Object.create({});
    let { Array, ItemSize, Type } = indices; // bufferViews
    let type = TYPE_TABLE[ItemSize];
    let componentType = INDICES_COMPONENT_TYPE_TABE[uType];
    let byteArray = Object.values(Array)[0];
    let { Size, Offset } = byteArray;
    let bufferView = decodeBufferView(byteArray, Type, ItemSize);
    Object.assign(accessor, {
        bufferView,
        byteOffset: Offset,
        componentType,
        count: Size,
        type,
    });
    bufferViewId++;
    return accessor;
}
function decodeBufferView(byteArray, type, itemSize) {
    let bufferView = Object.create({});
    let { Size, Offset } = byteArray;
    Object.assign(bufferView, {
        "buffer": 0,
        "byteLength": Size * itemSize,
        "byteOffset": Offset,
        // "byteStride": itemSize,
        // "name": "floatBufferViews",
        // "target": TARGET_TABLE[type]
    });
    globalBufferViews.push(bufferView);
    return bufferViewId;
}
function decodeOSGTexture(textureModel) {
    let { attributes } = textureModel;
    let { image, magFilter, minFilter, wrapS, wrapT } = attributes;
    let { name } = image.attributes;
    let uri = Object.create({});
    Object.assign(uri, {
        uri: name.replace("_TXTR.tga", "")
    });
    let texture = Object.create({});
    let sampler = Object.create({});
    Object.assign(sampler, {
        magFilter, minFilter, wrapS, wrapT
    });
    let hasSampler = hasSameObjact(globalSamplers, sampler);
    let hasImage = hasSameObjact(globalImages, uri);
    if (!hasSampler) {
        globalSamplers.push(sampler);
    }
    if (!hasImage) {
        globalImages.push(uri);
    }
    let samplerId = findSameObjact(globalSamplers, sampler);
    let uriId = findSameObjact(globalImages, uri);
    if (!hasSampler || !hasImage) {
        Object.assign(texture, {
            sampler: samplerId,
            source: uriId,
        });
        globalTextures.push(texture);
    }
}
function hasSameObjact(arr, obj) {
    return arr.find((object) => JSON.stringify(object) == JSON.stringify(obj));
}
function findSameObjact(arr, obj) {
    return arr.findIndex((object) => JSON.stringify(object) == JSON.stringify(obj));
}
function exportFile(name, data) {
    const blob = new Blob([data]);
    const save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
    save_link.href = window.URL.createObjectURL(blob);
    save_link.download = name;
    const ev = document.createEvent("MouseEvents");
    ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    save_link.dispatchEvent(ev);
}
function main() {
    clearUint8Array();
    let Uint8s = Object.values(Uint8ArrayMap);
    let osg = decodeFileBinz(Uint8s[0]);
    let modelFile = Uint8s[1];
    decodeOSGRoot(osg);
    decodeOSGNode(globalNodes);
    decodeOSGGeometries(nodeMap['osg.Geometry']);
    let gltf = {
        accessors: globalAccessors,
        asset: {
            generator: "gltf-creator",
            version: "2.0",
        },
        buffers: [
            {
                "byteLength": modelFile.byteLength,
                "uri": "scene.bin"
            }
        ],
        bufferViews: globalBufferViews,
        // extensionsUsed: [],
        // extensionsRequired: [],
        images: globalImages,
        materials: globalMaterials,
        meshes: globalMeshes,
        nodes: gltfNodes,
        samplers: globalSamplers,
        scene: 0,
        scenes: [
            {
                "name": "Sketchfab_Scene",
                "nodes": [
                    0
                ]
            }
        ],
        textures: globalTextures,
    };
    exportFile("scene.bin", modelFile.buffer);
    exportFile("scene.gltf", JSON.stringify(gltf, null, 4));
}
main();
