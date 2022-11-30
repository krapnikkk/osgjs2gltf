"use strict";
exports.__esModule = true;
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
var scene;
var nodes = [];
function decodeScene(osgjs) {
    scene = osgjs.children[0];
    osgjs.children[0].children.forEach(function (child) {
        var name = child._name;
        if (name)
            name = child._name.replace("_", "");
        gltf.scenes[0].nodes.push(+name || 0);
    });
}
var idx = 100;
function decodeNode(nodes) {
    for (var i = 0; i < nodes.length; i++) {
        var child = nodes[i];
        var clz = child.constructor.name;
        var matrix = child.matrix, _name = child._name, children = child.children;
        if (clz == "MatrixTransform" || clz == "Node") {
        }
        else if (clz == "Geometry") {
            // if(_name == "Piston_123-844_0_Parts_1"){debugger}
            decodeGeometry(child);
            continue;
        }
        else {
            console.log("clz:", clz);
        }
        if (typeof _name == "undefined") {
            _name = ++idx;
        }
        var node = Object.create({});
        if (children.length > 0) {
            decodeNode(children);
            var arr = [];
            for (var j = 0; j < children.length; j++) {
                var nodeChild = children[j];
                var idx_1 = +parseName(nodeChild._name);
                arr.push(idx_1);
            }
            if (arr.length > 0)
                node.children = arr;
        }
        if (matrix) {
            var _matrix = [].concat(matrix);
            node['matrix'] = JSON.parse("[".concat(matrix.toString(), "]"));
        }
        if (_name) {
            node.name = _name;
        }
        _name = parseName(_name);
        gltf.nodes[+_name] = node;
    }
}
function parseName(_name) {
    // console.log(_name);
    if (typeof _name == "number") {
        return _name;
    }
    else if (_name) {
        var idx_2 = _name.indexOf("_");
        if (idx_2 == 0) {
            _name = _name.replace("_", "");
        }
        // _name = typeof _name == "string" ? _name.replace("_",""):_name;
        return _name;
    }
    else {
        return ++idx;
    }
}
function decodeGeometry(geometry) {
    var _attributes = geometry._attributes, _primitives = geometry._primitives, _cacheVertexAttributeBufferList = geometry._cacheVertexAttributeBufferList, _name = geometry._name;
    var Normal = _attributes.Normal, Vertex = _attributes.Vertex;
    var mesh = { "name": _name };
    var primitivesNum = 1;
    if (_cacheVertexAttributeBufferList) {
        debugger;
        var num = Object.keys(_cacheVertexAttributeBufferList).length;
    }
    if (Normal) { // NORMAL
        var _elements = Normal._elements, _normalize = Normal._normalize, _instanceID = Normal._instanceID, _numItems = Normal._numItems, // count
        _type = Normal._type;
    }
    if (Vertex) { // POSITION
        var _elements = Vertex._elements, _normalize = Vertex._normalize, _instanceID = Vertex._instanceID, _numItems = Vertex._numItems, // count
        _type = Vertex._type;
    }
    var primitives = [];
    if (_primitives) {
        _primitives.forEach(function (primitive) {
            primitives.push(primitive.mode);
        });
        debugger;
    }
}
function decodeAccessors() {
}
// decodeScene(OSGJS.Node)
// decodeNode(scene.children)
