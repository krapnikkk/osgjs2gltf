import { glTF } from "../@types/gltf";

var primitiveSet = {
    "POINTS": 0,
    "LINES": 1,
    "LINE_LOOP": 2,
    "LINE_STRIP": 3,
    "TRIANGLES": 4,
    "TRIANGLE_STRIP": 5,
    "TRIANGLE_FAN": 6
};
var gltf: glTF = {
    accessors: [],
    asset: {
        generator: "gltf-creator",
        version: "2.0",
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
    textures: [],
};

let nodes = [], nodeId = 1000;
let scenes = [];
let meshId = 0, meshes = [];
let materials = [], materialIdx = 0;
function decodeScene(node: OSGJS.Node) {
    node.children[0].children.forEach((child) => {
        let name = child._name;
        if (name) name = child._name.replace("_", "")
        // gltf.scenes[0].nodes.push(
        scenes.push(
            +name || 0
        )
    });
}

function decodeNode(rootNodes: OSGJS.Node[], names: number[] = []) {
    for (let i = 0; i < rootNodes.length; i++) {
        let child = rootNodes[i];
        let clz = child.className();
        let { _name, children } = child;
        if (clz == "Geometry") {
            continue;
        }

        if (names.length > 0) { _name = `${names[i]}` }
        if (typeof _name == "undefined") {
            _name = `${++nodeId}`;
        }
        let node = Object.create({});
        if (children.length > 0) {
            decodeNode(children);
            let childIdArr = []
            for (let j = 0; j < children.length; j++) {
                let nodeChild = children[j];
                let id = +parseNodeName(nodeChild._name);
                let nodeClz = nodeChild.constructor.name;
                if (typeof nodeChild._name != "undefined" &&
                    (clz == 'MatrixTransform' || nodeClz == "Geometry") &&
                    (Number.isNaN(id) || id >= nodeId)) {
                    // mesh
                    if (typeof nodeChild['meshId'] == "undefined") {
                        nodeChild['meshId'] = meshId++;
                        nodeChild['name'] = nodeChild._name;
                        node.mesh = meshId;
                        meshes.push(nodeChild);
                    } else {
                        node.mesh = nodeChild['meshId'];
                    }
                } else {
                    childIdArr.push(id);
                }
            }

            if (childIdArr.length > 0) node.children = childIdArr;
        }
        if (child['matrix']) {
            node['matrix'] = JSON.parse(`[${child['matrix'].toString()}]`);
        }

        if (_name) {
            node.name = _name;
        }
        if (typeof _name != "number") {
            nodes[parseNodeName(_name)] = node;
        } else {
            nodes[+_name] = node;
        }

        // gltf.nodes[+_name] = node;

    }
}

function parseNodeName(_name: string) {
    if (_name) {
        if (_name.indexOf("_") == 0) {
            _name = _name.replace("_", "")
        }
        return _name;
    } else {
        return ++nodeId;
    }
}

function decodeMesh(node: OSGJS.Geometry) {
    let { _attributes, _primitives, _cacheVertexAttributeBufferList, _name, stateset } = node;
    let { Normal, Vertex } = _attributes;
    let mesh = { "name": _name, "primitives": [] };
    let primitivesNum = 1;
    if (stateset) { // materials
        if (typeof stateset['materialId'] == 'undefined') {
            stateset['materialId'] = materialIdx++;
            materials.push(stateset);
        } else {

        }
    }
    if (_cacheVertexAttributeBufferList) {
        // debugger;
        let num = Object.keys(_cacheVertexAttributeBufferList).length;
        for (let key in _cacheVertexAttributeBufferList) {
            let VertexAttributeBuffer = _cacheVertexAttributeBufferList[key];
            VertexAttributeBuffer.forEach((bufferArray) => {

            })
        }
    }
    if (Normal) { // accessors->NORMAL
        let {
            _elements,
            _normalize,
            _instanceID,
            _numItems, // count
            _type, //componentType
        } = Normal;
    }
    if (Vertex) { // accessors->POSITION
        let {
            _elements,
            _normalize,
            _instanceID,
            _numItems, //this._elements.length / this._itemSize;
            _type, //componentType
        } = Vertex;
    }
    if (_primitives) {
        _primitives.forEach((primitive) => {
            console.log(primitive);
        })
    }
}

function decodeOSGJS(root: OSGJS.Node) {
    decodeScene(root)
    decodeNode(root.children, scenes)
    meshes.forEach((mesh) => {
        decodeMesh(mesh);
    })
}
