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
function decodeUint8Array(e) {
    var i = "";
    for (var n = new Uint8Array(e), r = 0; r < e.length; r += 65535)
        i += String.fromCharCode.apply(null, n.slice(r, r + 65535));
    return i;
}
export {};
