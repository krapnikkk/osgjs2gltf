var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
let TARGET_TABLE = {
    "ARRAY_BUFFER": 34962,
    "ELEMENT_ARRAY_BUFFER": 34963
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
let globalNodes = [], nodeId = 1;
let globalAccessors = [], accessorId = 0;
let globalMeshes = [], meshId = 0;
let globalMaterials = [], materialId = 0;
let globalBufferViews = [], bufferViewId = 0;
let globalTextures = [];
let globalImages = [];
let globalSamplers = [];
let globalElementArrayBuffers = [];
let globalArrayBuffersMap = {};
let globalBuffers = [];
function decodeOSGRoot(root) {
    globalNodes.push({
        "children": [
            1
        ],
        "matrix": [1.0, 0.0, 0.0, 0.0, 0.0, 2.220446049250313e-16, -1.0, 0.0, 0.0, 1.0, 2.220446049250313e-16, 0.0, 0.0, 0.0, 0.0, 1.0
        ],
        "name": "Sketchfab_model"
    });
    decodeOSGNode(root);
}
function decodeOSGNode(node, material) {
    let { _name } = node;
    let id = nodeId;
    if (_name) {
        // decodeOSGNode
        let { children } = node;
        let obj = Object.create({});
        nodeId++;
        Object.assign(obj, {
            name: _name
        });
        globalNodes.push(obj);
        let childrenArr = [];
        let { stateset } = node;
        let mtlId;
        // stateset -> materials
        if (stateset) {
            mtlId = decodeOSGJSStateSet(stateset);
        }
        if (children.length > 0) {
            for (let i = 0; i < children.length; i++) {
                let child = children[i];
                if (!child._name) {
                    break;
                }
                childrenArr.push(decodeOSGNode(child, mtlId));
            }
            Object.assign(obj, {
                children: childrenArr
            });
        }
        let nodeType = node.className();
        if (nodeType == "Geometry" /* OSGJS.ENode.Geometry */) {
            // mesh
            if (typeof material == "undefined") {
                debugger;
            }
            let mesh = decodeOSGGeometry(node, material);
            if (mesh != -1) {
                Object.assign(obj, {
                    mesh
                });
            }
        }
        else if (nodeType == "MatrixTransform" /* OSGJS.ENode.MatrixTransform */) {
            let { matrix } = node;
            if (matrix) {
                let arr = [...matrix];
                if (JSON.stringify(arr) != '[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]') {
                    Object.assign(obj, { matrix: arr });
                }
            }
        }
        else if (nodeType == "Node" /* OSGJS.ENode.Node */) {
        }
        else {
            debugger;
        }
        return id;
    }
}
function decodeOSGJSStateSet(stateSet) {
    let id = materialId;
    let { _name, _attributeArray } = stateSet;
    let obj = Object.create({});
    Object.assign(obj, {
        doubleSided: false,
        name: _name
    });
    if (_attributeArray.length <= 3) {
        return;
    }
    // todo
    let attributeArray = _attributeArray[0];
    if (!attributeArray) {
        return;
    }
    let arrtibute = decodeOSGAttributePair(attributeArray);
    Object.assign(obj, arrtibute);
    materialId++;
    globalMaterials.push(obj);
    return id;
}
function decodeOSGAttributePair(attribute) {
    let pbrMetallicRoughness = Object.create({}), emissiveFactor, emissiveTexture, normalTexture, occlusionTexture, alphaMode;
    let { _object } = attribute;
    let { _activeChannels } = _object;
    let attr = Object.create({});
    for (let i = 0; i < _activeChannels.length; i++) {
        let channel = _activeChannels[i];
        let { attributes } = channel;
        let { color, factor, textureModel, displayName, type } = attributes;
        if (displayName == "Base Color") {
            if (color) {
                pbrMetallicRoughness.baseColorFactor = [...color.map((c) => c * factor), 1.0];
            }
            else if (factor != 1) {
                pbrMetallicRoughness.baseColorFactor = [...[1.0, 1.0, 1.0].map((c) => c * factor), 1.0];
            }
            if (textureModel) {
                let index = decodeOSGTexture(textureModel);
                pbrMetallicRoughness.baseColorTexture = {
                    index
                };
            }
        }
        else if (displayName == "Metalness") {
            if (factor) {
                pbrMetallicRoughness.metallicFactor = factor;
            }
            if (textureModel) {
                let index = decodeOSGTexture(textureModel);
                pbrMetallicRoughness.baseColorTexture = {
                    index
                };
            }
        }
        else if (displayName == "Glossiness") {
            factor >= 0 && 1 - factor !== 1 ? pbrMetallicRoughness.roughnessFactor = 1 - factor : null;
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
                let index = decodeOSGTexture(textureModel);
                emissiveTexture = {
                    index
                };
                if (!color) {
                    emissiveFactor = [...[0, 0, 0].map((c) => {
                            if (factor < 1) {
                                return factor;
                            }
                            else {
                                return 1;
                            }
                        })];
                }
            }
        }
        else if (displayName == "Specular F0") {
            // todo export
        }
        else if (displayName == "Opacity") {
            debugger;
            if (type == "alphaBlend") {
                alphaMode = "BLEND";
            }
            else {
                debugger;
            }
        }
        else if (displayName == "Roughness") {
            if (factor && factor != 1) {
                pbrMetallicRoughness.roughnessFactor = factor;
                debugger;
            }
            if (textureModel) {
                let index = decodeOSGTexture(textureModel);
                pbrMetallicRoughness.metallicRoughnessTexture = {
                    index
                };
            }
        }
        else if (displayName == "Normal map") {
            if (textureModel) {
                let index = decodeOSGTexture(textureModel);
                normalTexture = {
                    index
                };
            }
        }
        else if (displayName == "Ambient Occlusion") {
            if (textureModel) {
                let index = decodeOSGTexture(textureModel);
                occlusionTexture = {
                    index
                };
            }
        }
        else if (displayName == "Bump map") {
            // todo export
        }
        else {
            window['_log'](`unsupport display attribute:${displayName}`);
        }
    }
    Object.assign(attr, { pbrMetallicRoughness });
    if (emissiveFactor && JSON.stringify(emissiveFactor) != '[0,0,0]') {
        Object.assign(attr, { emissiveFactor });
    }
    if (emissiveTexture) {
        Object.assign(attr, { emissiveTexture });
    }
    if (normalTexture) {
        Object.assign(attr, { normalTexture });
    }
    if (occlusionTexture) {
        Object.assign(attr, { occlusionTexture });
    }
    if (alphaMode) {
        Object.assign(attr, { alphaMode });
    }
    return attr;
}
function decodeOSGGeometry(geometry, material) {
    let id = -1;
    let { _primitives, _attributes, _name } = geometry;
    // indices
    if (_primitives && _attributes) {
        let obj = Object.create({});
        id = meshId;
        let primitives = [];
        Object.assign(obj, {
            name: _name,
            primitives
        });
        // _attributes -> attributes
        let attributes = decodeOSGVertexAttribute(_attributes, geometry, material);
        // _primitives->indices
        for (let i = 0; i < _primitives.length; i++) {
            let primitive = Object.create({});
            let indices = decodeOSGIndice(_primitives[i]);
            let { id, mode } = indices;
            Object.assign(primitive, {
                attributes,
                indices: id,
                material,
                mode
            });
            primitives.push(primitive);
        }
        meshId++;
        globalMeshes.push(obj);
    }
    else {
        debugger;
    }
    return id;
}
function decodeOSGVertexAttribute(attribute, geometry, material) {
    let attributes = {};
    for (let key in attribute) {
        let type = ATTRIBUTE_TABLE[key];
        if (key == "Tangent") {
            let mtl = globalMaterials[material];
            if (JSON.stringify(mtl).indexOf("normalTexture") == -1) {
                continue;
            }
        }
        ;
        let accessor = decodeOSGAttribute(geometry, key);
        if (accessor) {
            attributes[type] = accessorId;
            globalAccessors.push(accessor);
            accessorId++;
        }
    }
    return attributes;
}
function decodeOSGAttribute(geometry, key) {
    if (!geometry) {
        return;
    }
    let accessor = Object.create({});
    let { _attributes } = geometry;
    let _attribute = _attributes[key];
    if (!_attribute) {
        window['_log'](`can't find key:${key}`);
        return;
    }
    ;
    let { _type, _elements, _itemSize, _numItems, _target, _normalize } = _attribute;
    let { BYTES_PER_ELEMENT, length } = _elements;
    if (key == "Normal" || key == "Tangent") {
        for (let i = 0; i < _elements.length; i += _itemSize) {
            let ab = [_elements[i], _elements[i + 1], _elements[i + 2]];
            let arr = normalizeVec3([], ab);
            _elements[i] = arr[0];
            _elements[i + 1] = arr[1];
            _elements[i + 2] = arr[2];
        }
    }
    let type = TYPE_TABLE[_itemSize];
    let count = _numItems || length / _itemSize;
    var byteStride = BYTES_PER_ELEMENT * _itemSize;
    globalBuffers.push({ data: _elements, byteStride, id: bufferViewId, target: _target });
    Object.assign(accessor, {
        bufferView: bufferViewId,
        componentType: _type,
        count,
        max: getMax(_elements, _itemSize, true),
        min: getMax(_elements, _itemSize, false),
        type,
    });
    if (_normalize) {
        Object.assign(accessor, {
            normalized: _normalize
        });
    }
    bufferViewId++;
    return accessor;
}
function decodeOSGIndice(primitive) {
    let id = accessorId;
    let { indices, mode } = primitive;
    let { _type, _elements, _itemSize, _numItems, _target } = indices; // bufferViews
    let { byteLength, BYTES_PER_ELEMENT } = _elements;
    let type = TYPE_TABLE[_itemSize];
    let count = _numItems || byteLength / _itemSize;
    var byteStride = BYTES_PER_ELEMENT * _itemSize;
    globalBuffers.push({ data: _elements, byteStride, id: bufferViewId, target: _target });
    let accessor = Object.create({});
    Object.assign(accessor, {
        bufferView: 0,
        componentType: _type,
        count,
        type,
    });
    bufferViewId++;
    globalAccessors.push(accessor);
    accessorId++;
    return { id, mode };
}
function decodeOSGTexture(textureModel) {
    let index = 0;
    let { attributes } = textureModel;
    let { image, magFilter, minFilter, wrapS, wrapT } = attributes;
    let { name } = image.attributes;
    let uri = Object.create({});
    Object.assign(uri, {
        uri: name
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
        index = globalTextures.length;
        globalTextures.push(texture);
    }
    else {
        index = globalTextures.findIndex(tex => tex.sampler == samplerId && tex.source == uriId);
    }
    return index;
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
function getMax(arr, interval, max = true) {
    let source = new Array(interval).fill(max ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER);
    for (let i = 0; i < arr.length; i++) {
        let item = arr[i];
        let idx = i % interval;
        source[idx] = max ? Math.max(item, source[idx]) : Math.min(item, source[idx]);
    }
    ;
    return source;
}
function concatArraybuffer(buffers) {
    return __awaiter(this, void 0, void 0, function* () {
        const ab = yield new Blob(buffers).arrayBuffer();
        return ab;
    });
}
function handleBufferViews() {
    for (let i = 0; i < globalBuffers.length; i++) {
        let buffer = globalBuffers[i];
        let { target, byteStride } = buffer;
        if (target == TARGET_TABLE['ELEMENT_ARRAY_BUFFER']) {
            if (byteStride > 4) {
                debugger;
            }
            globalElementArrayBuffers.push(buffer);
        }
        else {
            if (byteStride < 4) {
                debugger;
            }
            if (typeof globalArrayBuffersMap[byteStride] == "undefined") {
                globalArrayBuffersMap[byteStride] = [];
            }
            globalArrayBuffersMap[byteStride].push(buffer);
        }
    }
}
function concatBufferViews() {
    return __awaiter(this, void 0, void 0, function* () {
        let elementArrayBuffers = [], elementArrayBufferOffset = 0;
        for (let i = 0; i < globalElementArrayBuffers.length; i++) {
            let elementArrayBuffer = globalElementArrayBuffers[i];
            let { id, data } = elementArrayBuffer;
            let { buffer } = data;
            let accessor = globalAccessors[id];
            if (elementArrayBufferOffset > 0) {
                accessor.byteOffset = elementArrayBufferOffset;
            }
            elementArrayBufferOffset += buffer.byteLength;
            elementArrayBuffers.push(buffer);
        }
        let elementArrayBufferView = yield concatArraybuffer(elementArrayBuffers);
        let byteLength = elementArrayBufferView.byteLength;
        let byteOffset = byteLength % 4;
        if (byteOffset !== 0) {
            byteLength += byteOffset;
            let buf = new ArrayBuffer(byteOffset);
            elementArrayBufferView = yield concatArraybuffer([elementArrayBufferView, buf]);
        }
        globalBufferViews.push({
            "buffer": 0,
            byteLength,
            "name": "floatBufferViews",
            "target": TARGET_TABLE['ELEMENT_ARRAY_BUFFER']
        });
        let arrayBuffersArr = [], idx = 1, byteLen = elementArrayBufferView.byteLength;
        for (let key in globalArrayBuffersMap) {
            let arrayBuffers = globalArrayBuffersMap[key];
            let offset = 0, arrayBufferArr = [];
            for (let i = 0; i < arrayBuffers.length; i++) {
                let arrayBuffer = arrayBuffers[i];
                let { id, data } = arrayBuffer;
                let { buffer } = data;
                let accessor = globalAccessors[id];
                if (offset > 0) {
                    accessor.byteOffset = offset;
                }
                accessor.bufferView = idx;
                offset += buffer.byteLength;
                arrayBufferArr.push(buffer);
            }
            idx++;
            let buffer = yield concatArraybuffer(arrayBufferArr);
            let byteOffset = byteLen % 4;
            if (byteOffset !== 0) {
                byteLen += byteOffset;
                let buf = new ArrayBuffer(byteOffset);
                buffer = yield concatArraybuffer([buffer, buf]);
            }
            arrayBuffersArr.push(buffer);
            arrayBufferArr.length = 0;
            offset = 0;
            globalBufferViews.push({
                "buffer": 0,
                "byteOffset": byteLen,
                "byteStride": +key,
                "byteLength": buffer.byteLength,
                "name": "floatBufferViews",
                "target": TARGET_TABLE['ARRAY_BUFFER']
            });
            byteLen += buffer.byteLength;
        }
        let ab = yield concatArraybuffer([elementArrayBufferView, ...arrayBuffersArr]);
        return ab;
    });
}
function normalizeVec3(out, a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var len = x * x + y * y + z * z;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
    }
    out[0] = a[0] * len;
    out[1] = a[1] * len;
    out[2] = a[2] * len;
    return out;
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        decodeOSGRoot(_root_);
        handleBufferViews();
        let { attributes } = _model_;
        let { name, license, user, viewerUrl } = attributes;
        if (!license) {
            license = { label: "see viewerUrl", url: viewerUrl };
        }
        let { label, url } = license;
        let { username, profileUrl } = user;
        let buffer = yield concatBufferViews();
        let gltf = {
            accessors: globalAccessors,
            asset: {
                extras: {
                    "author": `${username} (${profileUrl})`,
                    "license": `${label} (${url})`,
                    "source": `${viewerUrl}`,
                    "title": name
                },
                generator: "osg2glTF",
                version: "2.0",
            },
            buffers: [
                {
                    "byteLength": buffer.byteLength,
                    "uri": `${name}.bin`
                }
            ],
            bufferViews: globalBufferViews,
            // extensionsUsed: [],
            // extensionsRequired: [],
            images: globalImages,
            materials: globalMaterials,
            meshes: globalMeshes,
            nodes: globalNodes,
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
        exportFile(`${name}.bin`, buffer);
        exportFile(`${name}.gltf`, JSON.stringify(gltf, null, 4));
    });
}
main();
export {};
