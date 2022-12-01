var primitiveSet = {
    "POINTS": 0,
    "LINES": 1,
    "LINE_LOOP": 2,
    "LINE_STRIP": 3,
    "TRIANGLES": 4,
    "TRIANGLE_STRIP": 5,
    "TRIANGLE_FAN": 6
};
var TYPE_TABLE = {
    1: "SCALAR",
    2: "VEC2",
    3: "VEC3",
    4: "VEC4",
    5: "MAT2",
    6: "MAT3",
    7: "MAT4"
};
var ATTRIBUTE_TABLE = {
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
var gltf = {
    accessors: [],
    asset: {
        generator: "gltf-creator",
        version: "2.0"
    },
    buffers: [],
    bufferViews: [],
    extensionsUsed: [],
    extensionsRequired: [],
    images: [],
    materials: [],
    meshes: [],
    nodes: [],
    samplers: [],
    scene: 0,
    scenes: [
        {
            "nodes": []
        }
    ],
    textures: []
};
var nodes = [], nodeId = 1000;
var scenes = [];
var meshId = 0, meshes = [];
var materials = [], materialIdx = 0;
function decodeScene(node) {
    node.children[0].children.forEach(function (child) {
        var name = child._name;
        if (name)
            name = child._name.replace("_", "");
        // gltf.scenes[0].nodes.push(
        scenes.push(+name || 0);
    });
}
function decodeNode(rootNodes, names) {
    if (names === void 0) { names = []; }
    for (var i = 0; i < rootNodes.length; i++) {
        var child = rootNodes[i];
        var clz = child.className();
        var _name = child._name, children = child.children;
        if (clz == "Geometry") {
            continue;
        }
        if (names.length > 0) {
            _name = "".concat(names[i]);
        }
        if (typeof _name == "undefined") {
            _name = "".concat(++nodeId);
        }
        var node = Object.create({});
        if (children.length > 0) {
            decodeNode(children);
            var childIdArr = [];
            for (var j = 0; j < children.length; j++) {
                var nodeChild = children[j];
                var id = +parseNodeName(nodeChild._name);
                var nodeClz = nodeChild.constructor.name;
                if (typeof nodeChild._name != "undefined" &&
                    (clz == 'MatrixTransform' || nodeClz == "Geometry") &&
                    (Number.isNaN(id) || id >= nodeId)) {
                    // mesh
                    if (typeof nodeChild['meshId'] == "undefined") {
                        nodeChild['meshId'] = meshId++;
                        nodeChild['name'] = nodeChild._name;
                        node.mesh = meshId;
                        meshes.push(nodeChild);
                    }
                    else {
                        node.mesh = nodeChild['meshId'];
                    }
                }
                else {
                    childIdArr.push(id);
                }
            }
            if (childIdArr.length > 0)
                node.children = childIdArr;
        }
        if (child['matrix']) {
            node['matrix'] = JSON.parse("[".concat(child['matrix'].toString(), "]"));
        }
        if (_name) {
            node.name = _name;
        }
        if (typeof _name != "number") {
            nodes[parseNodeName(_name)] = node;
        }
        else {
            nodes[+_name] = node;
        }
        // gltf.nodes[+_name] = node;
    }
}
function parseNodeName(_name) {
    if (_name) {
        if (_name.indexOf("_") == 0) {
            _name = _name.replace("_", "");
        }
        return _name;
    }
    else {
        return ++nodeId;
    }
}
var meshMap = {};
var accessors = [], accessorId = 0;
var bufferViews = [], bufferId = 0;
function decodeMesh(node) {
    var _attributes = node._attributes, _primitives = node._primitives, _cacheVertexAttributeBufferList = node._cacheVertexAttributeBufferList, _name = node._name, stateset = node.stateset;
    var Normal = _attributes.Normal, Vertex = _attributes.Vertex;
    // let mesh = { "name": _name, "primitives": primitives };
    var mesh = meshMap[_name];
    if (!mesh) {
        mesh = meshMap[_name] = [];
    }
    var primitive = Object.create({});
    var attributes = [];
    primitive.attributes = attributes;
    if (_name == "Piston_123-844_0_Parts_1") {
        debugger;
    }
    if (_primitives) {
        if (_primitives.length > 1) {
            debugger;
        }
        ;
        // _primitives.forEach((primitive) => {
        //     console.log(primitive);
        // })
        var _a = _primitives[0], mode = _a.mode, indices = _a.indices, count = _a.count, uType = _a.uType, offset = _a.offset, itemSize = _a.itemSize; // indices ->accessors
        if (hasAttribute(indices['accessorId'])) {
            indices['accessorId'] = accessorId++;
            var _elements = indices._elements;
            if (hasAttribute(_elements['bufferId'])) {
                _elements['bufferId'] = bufferId++;
                bufferViews.push(_elements);
            }
            accessors.push({
                id: indices['accessorId'],
                bufferView: _elements['bufferId'],
                offset: offset,
                componentType: uType,
                count: count,
                // min:0,
                // max:2011, _elements的数据内容范围
                type: TYPE_TABLE[itemSize]
            });
        }
        primitive.mode = mode;
        primitive.indices = indices['accessorId'];
    }
    if (stateset) { // materials
        if (typeof stateset['materialId'] == 'undefined') {
            stateset['materialId'] = materialIdx++;
            materials.push(stateset);
        }
        primitive.material = stateset['materialId'];
    }
    mesh.push(primitive);
    if (Normal) { // accessors->NORMAL
        var _elements = Normal._elements, _normalize = Normal._normalize, _instanceID = Normal._instanceID, _numItems = Normal._numItems, // count
        _type = Normal._type;
    }
    if (Vertex) { // accessors->POSITION
        var _elements = Vertex._elements, _normalize = Vertex._normalize, _instanceID = Vertex._instanceID, _numItems = Vertex._numItems, //this._elements.length / this._itemSize;
        _type = Vertex._type;
    }
    if (_cacheVertexAttributeBufferList) {
        // debugger;
        var num = Object.keys(_cacheVertexAttributeBufferList).length;
        for (var key in _cacheVertexAttributeBufferList) {
            var VertexAttributeBuffer = _cacheVertexAttributeBufferList[key];
            VertexAttributeBuffer.forEach(function (bufferArray) {
            });
        }
    }
}
function hasAttribute(attr) {
    return typeof attr == 'undefined';
}
function decodeOSGJS(root) {
    decodeScene(root);
    decodeNode(root.children, scenes);
    meshes.forEach(function (mesh) {
        decodeMesh(mesh);
    });
}
export {};
