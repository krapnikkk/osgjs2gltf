import { glTF,Node as node} from "../@types/gltf";
import { OSGjs,Node } from "../@types/osgjs";

const gltf: glTF = {
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

let scene:Node;
let nodes = [];
function decodeScene(osgjs: OSGjs) {
    scene = osgjs.children[0];
    osgjs.children[0].children.forEach((child) => {
        let name = child._name;
        if(name)name = child._name.replace("_","")
        gltf.scenes[0].nodes.push(
             +name || 0
        )
    });
}

function decodeNode(nodes) {
    for(let i = 0;i<nodes.length;i++){
        let child = nodes[i];
        let {matrix,_name,children} = child;
        if(typeof _name == "undefined"){
            continue;
        }
        let node:any = {

        };
        if(children){
            let arr = []
            for(let j = 0;j<children.length;j++){
                let nodeChild = children[j];
                let idx =  parseNode(nodeChild);
                arr.push(idx);
            }
            
            if(arr.length>0)node.children = arr;
        }
        if(matrix){
            node['matrix'] = `[${matrix.toString()}]`;
        }
        _name = _name.replace("_","");
        nodes[+_name] = node;
    }
}

function parseNode(node){
    let {_name} = node;
    _name = _name.replace("_","");
    return _name || 0;
}