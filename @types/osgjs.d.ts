export interface Scene {
    _name: string
    _instanceID: number
    children: Node[]
    _parents: any[]
    nodeMask: number
    _boundingSphere: BoundingSphere
    _boundingSphereComputed: boolean
    _boundingBox: BoundingBox
    _boundingBoxComputed: boolean
    _updateCallbacks: any[]
    _cullingActive: boolean
    _numChildrenWithCullingDisabled: number
    _numChildrenRequiringUpdateTraversal: number
    _tmpBox: TmpBox2
    referenceFrame: number
    matrix: Matrix
    stateset: Stateset
  }
  
  export interface Node {
    _name: string
    matrix: Matrix
    _userdata: Userdata
    _instanceID: number
    children: Node[]
    _parents: Parent[]
    nodeMask: number
    _boundingSphere: BoundingSphere
    _boundingSphereComputed: boolean
    _boundingBox: BoundingBox
    _boundingBoxComputed: boolean
    _updateCallbacks: any[]
    _cullingActive: boolean
    _numChildrenWithCullingDisabled: number
    _numChildrenRequiringUpdateTraversal: number
    _tmpBox: TmpBox
    _attributes: Attributes
    _primitives: Primi[]
    _cacheDrawCall: CacheDrawCall
    _vao: Vao
    _cacheVertexAttributeBufferList: CacheVertexAttributeBufferList
    stateset: Stateset
  }
  
  export interface Userdata {
    pbrWorklow: string,
    $ref?: string
  }
  
  export interface Parent {
    $ref: string
  }
  
  export interface BoundingSphere {
    _center: Center
    _radius: number
  }
  
  export interface Center {
    "0": number
    "1": number
    "2": number
  }
  
  export interface BoundingBox {
    _min: Min
    _max: Max
  }
  
  export interface Min {
    "0": any
    "1": any
    "2": any
  }
  
  export interface Max {
    "0": any
    "1": any
    "2": any
  }
  
  export interface TmpBox {
    _min: Min
    _max: Max
  }
  
  export interface Attributes {
    Vertex: Vertex
  }
  
  export interface Vertex {
    _instanceID: number
    _dirty: boolean
    _itemSize: number
    _target: number
    _type: number
    _normalize: boolean
    _elements: Elements
    _usage: number
  }
  
  export interface Elements {
    "0": number
    "1": number
    "2": number
    "3": number
    "4": number
    "5": number
    "6": number
    "7": number
    "8": number
  }
  
  export interface Primi {
    mode: number
    count: number
    offset: number
    indices: Indices
    uType: number
  }
  
  export interface Indices {
    _instanceID: number
    _dirty: boolean
    _itemSize: number
    _target: number
    _type: number
    _normalize: boolean
    _elements: Elements2
    _usage: number
  }
  
  export interface Elements2 {
    "0": number
    "1": number
    "2": number
  }
  
  export interface CacheDrawCall {}
  
  export interface Vao {}
  
  export interface CacheVertexAttributeBufferList {}
  
  export interface Stateset {
    _userdata?: Userdata
    _instanceID: number
    _parents: Parent2[]
    _attributeArray: any[]
    _textureAttributeArrayList: any[]
    _activeTextureAttributeUnit: any[]
    _activeAttribute: any[]
    _activeTextureAttribute: any[]
    _binNumber: number
    _shaderGeneratorPair: any
    _updateCallbackList: any[]
    uniforms: Uniforms
    _hasUniform: boolean
    _drawID: number
  }
  
  
  export interface Parent2 {
    $ref: string
  }
  
  export interface Uniforms {
    uBaseColorFactor: UBaseColorFactor
    uMetallicFactor: UMetallicFactor
    uRoughnessFactor: URoughnessFactor
  }
  
  export interface UBaseColorFactor {
    _object: Object
    _value: number
  }
  
  export interface Object {
    _data: Data
    _transpose: boolean
    _glCall: string
    _name: string
    _type: string
    _isMatrix: boolean
  }
  
  export interface Data {
    "0": number
    "1": number
    "2": number
    "3": number
  }
  
  export interface UMetallicFactor {
    _object: Object2
    _value: number
  }
  
  export interface Object2 {
    _data: Data2
    _transpose: boolean
    _glCall: string
    _name: string
    _type: string
    _isMatrix: boolean
  }
  
  export interface Data2 {
    "0": number
  }
  
  export interface URoughnessFactor {
    _object: Object3
    _value: number
  }
  
  export interface Object3 {
    _data: Data3
    _transpose: boolean
    _glCall: string
    _name: string
    _type: string
    _isMatrix: boolean
  }
  
  export interface Data3 {
    "0": number
  }
  
  export interface TmpBox2 {
    _min: Min4
    _max: Max4
  }
  
  export interface Min4 {
    "0": any
    "1": any
    "2": any
  }
  
  export interface Max4 {
    "0": any
    "1": any
    "2": any
  }
  
  export interface Matrix {
    "0": number
    "1": number
    "2": number
    "3": number
    "4": number
    "5": number
    "6": number
    "7": number
    "8": number
    "9": number
    "10": number
    "11": number
    "12": number
    "13": number
    "14": number
    "15": number
  }
  
  export interface Parent3 {
    $ref: string
  }
  
  export interface Uniforms2 {
    emissiveMap: EmissiveMap
    aoMap: AoMap
    normalMap: NormalMap
    uEmissiveFactor: UEmissiveFactor
    albedoMap: AlbedoMap
    metallicRoughnessMap: MetallicRoughnessMap
  }
  
  export interface EmissiveMap {
    _object: Object4
    _value: number
  }
  
  export interface Object4 {
    _data: Data4
    _transpose: boolean
    _glCall: string
    _name: string
    _type: string
    _isMatrix: boolean
  }
  
  export interface Data4 {
    "0": number
  }
  
  export interface AoMap {
    _object: Object5
    _value: number
  }
  
  export interface Object5 {
    _data: Data5
    _transpose: boolean
    _glCall: string
    _name: string
    _type: string
    _isMatrix: boolean
  }
  
  export interface Data5 {
    "0": number
  }
  
  export interface NormalMap {
    _object: Object6
    _value: number
  }
  
  export interface Object6 {
    _data: Data6
    _transpose: boolean
    _glCall: string
    _name: string
    _type: string
    _isMatrix: boolean
  }
  
  export interface Data6 {
    "0": number
  }
  
  export interface UEmissiveFactor {
    _object: Object7
    _value: number
  }
  
  export interface Object7 {
    _data: Data7
    _transpose: boolean
    _glCall: string
    _name: string
    _type: string
    _isMatrix: boolean
  }
  
  export interface Data7 {
    "0": number
    "1": number
    "2": number
  }
  
  export interface AlbedoMap {
    _object: Object8
    _value: number
  }
  
  export interface Object8 {
    _data: Data8
    _transpose: boolean
    _glCall: string
    _name: string
    _type: string
    _isMatrix: boolean
  }
  
  export interface Data8 {
    "0": number
  }
  
  export interface MetallicRoughnessMap {
    _object: Object9
    _value: number
  }
  
  export interface Object9 {
    _data: Data9
    _transpose: boolean
    _glCall: string
    _name: string
    _type: string
    _isMatrix: boolean
  }
  
  export interface Data9 {
    "0": number
  }
  