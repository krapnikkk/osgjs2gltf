const primitiveSet = {
    "POINTS": 0,
    "LINES": 1,
    "LINE_LOOP": 2,
    "LINE_STRIP": 3,
    "TRIANGLES": 4,
    "TRIANGLE_STRIP": 5,
    "TRIANGLE_FAN": 6
};
const gltf = {
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

let scene;
let nodes = [];
function decodeScene(osgjs) {
    scene = osgjs.children[0];
    osgjs.children[0].children.forEach((child) => {
        let name = child._name;
        if(name)name = child._name.replace("_","")
        gltf.scenes[0].nodes.push(
             +name || 0
        )
    });
}

let idx = 100;
function decodeNode(nodes) {
    for(let i = 0;i<nodes.length;i++){
        let child = nodes[i];
        let clz = child.constructor.name;
        let {matrix,_name,children} = child;
        if(clz == "MatrixTransform" || clz == "Node"){
            
        }else if(clz == "Geometry"){
            // if(_name == "Piston_123-844_0_Parts_1"){debugger}
            decodeGeometry(child);
            continue;
        }else{
            console.log("clz:",clz);
        }
        if(typeof _name == "undefined"){
            _name = ++idx;
        }
        let node = {
            
        };
        if(children.length>0){
            decodeNode(children)
            let arr = []
            for(let j = 0;j<children.length;j++){
                let nodeChild = children[j];
                let idx =  +parseName(nodeChild._name);
                arr.push(idx);
            }
            
            if(arr.length>0)node.children = arr;
        }
        if(matrix){
            let _matrix = [].concat(matrix)
            node['matrix'] = JSON.parse(`[${matrix.toString()}]`);
        }
        if(_name){
            node.name =_name;
        }
        _name = parseName(_name);
        gltf.nodes[+_name] = node;
    }
}

function parseName(_name){
    // console.log(_name);
    if(typeof _name == "number"){
        return _name;
    }else if(_name){
        let idx = _name.indexOf("_");
        if(idx == 0){
           _name = _name.replace("_","")
        }
        // _name = typeof _name == "string" ? _name.replace("_",""):_name;
        return _name;
    }else{
        return ++idx;
    }
}

function decodeGeometry(geometry){
    let {_attributes,_primitives,_cacheVertexAttributeBufferList,_name} = geometry;
    let {Normal,Vertex} = _attributes;
    let mesh = {"name": _name};
    let primitivesNum = 1;
    if(_cacheVertexAttributeBufferList){
        debugger;
        let num = Object.keys(_cacheVertexAttributeBufferList).length;
    }
    if(Normal){ // NORMAL
        let {
            _elements,
            _normalize,
            _instanceID,
            _numItems, // count
            _type, //componentType
            } = Normal;
    }
    if(Vertex){ // POSITION
        let {
            _elements,
            _normalize,
            _instanceID,
            _numItems, // count
            _type, //componentType
            } = Vertex;
    }
    let primitives = [];
    if(_primitives){
        _primitives.forEach((primitive)=>{
            primitives.push(primitive.mode);
        })
        debugger;
    }

}

function decodeAccessors(){
    
}

decodeScene(temp1)
decodeNode(scene.children)