var primitiveSet = {
    "POINTS": 0,
    "LINES": 1,
    "LINE_LOOP": 2,
    "LINE_STRIP": 3,
    "TRIANGLES": 4,
    "TRIANGLE_STRIP": 5,
    "TRIANGLE_FAN": 6
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
function decodeMesh(node) {
    var _attributes = node._attributes, _primitives = node._primitives, _cacheVertexAttributeBufferList = node._cacheVertexAttributeBufferList, _name = node._name, stateset = node.stateset;
    var Normal = _attributes.Normal, Vertex = _attributes.Vertex;
    var mesh = { "name": _name, "primitives": [] };
    var primitivesNum = 1;
    if (stateset) { // materials
        if (typeof stateset['materialId'] == 'undefined') {
            stateset['materialId'] = materialIdx++;
            materials.push(stateset);
        }
        else {
        }
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
    if (Normal) { // accessors->NORMAL
        var _elements = Normal._elements, _normalize = Normal._normalize, _instanceID = Normal._instanceID, _numItems = Normal._numItems, // count
        _type = Normal._type;
    }
    if (Vertex) { // accessors->POSITION
        var _elements = Vertex._elements, _normalize = Vertex._normalize, _instanceID = Vertex._instanceID, _numItems = Vertex._numItems, //this._elements.length / this._itemSize;
        _type = Vertex._type;
    }
    if (_primitives) {
        _primitives.forEach(function (primitive) {
            console.log(primitive);
        });
    }
}
function decodeOSGJS(root) {
    decodeScene(root);
    decodeNode(root.children, scenes);
    meshes.forEach(function (mesh) {
        decodeMesh(mesh);
    });
}
export {};
