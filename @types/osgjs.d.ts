declare module OSGJS {
  class OSGObject {
    typeID: number;
    _instanceID: number;
    _userdata: { [key: string]: string };
    _name: string;
    center?(result: glMatrix.vec3): number;
    className(): string;
    copy<T extends Object>(other: T): void;
    corner(pos: number, ret: glMatrix.vec3): void;
    expandByBoundingBox(boundingBox: BoundingBox): void;
    expandByBoundingSphere(boundingSphere: BoundingSphere): void;
    expandByVec3(vec3: glMatrix.vec3): void;
    /**deprecated */
    expandByvec3(vec3: glMatrix.vec3): void;
    getMax(): glMatrix.vec3;
    getMin(): glMatrix.vec3;
    getTypeID(): string;
    init(): void;
    libraryClassName(): string;
    libraryName(): string;
    radius(): number;
    radius2(): number;
    setMax(max: glMatrix.vec3): void;
    setMin(min: glMatrix.vec3): void;
    transformMat4(out: glMatrix.mat4, mat: glMatrix.mat4): void;
    xMax(): number;
    xMin(): number;
    yMax(): number;
    yMin(): number;
    zMax(): number;
    zMin(): number;
    getInstanceID(): number;
    setName(name: string): void;
    getName(): string;
    setUserData(data: any): void;
    getUserData(): any;
  }

  class Node extends OSGObject {
    children: Node[];
    nodeMask: number;
    _parents: Node[];
    private _boundingBox: BoundingBox;
    private _boundingBoxComputed: boolean;
    private _boundingSphere: BoundingSphere;
    private _boundingSphereComputed: boolean;
    private _cullCallback?: Function;
    private _cullingActive: boolean;
    accept(nv: NodeVisitor): void;
    addChild(child: OSGObject): void;
    addParent(parents: OSGObject): void;
  }

  class MatrixTransform extends Transform {
    matrix: glMatrix.mat4;
    getMatrix(): glMatrix.mat4;
    setMatrix(mat: glMatrix.mat4): void;
    computeLocalToWorldMatrix(matrix: glMatrix.mat4): boolean;
    computeWorldToLocalMatrix(): boolean;
  }

  class Transform extends Node {
    referenceFrame: number;
    getReferenceFrame(): number;
    setReferenceFrame(val: number): void;
    computeBoundingSphere(): BoundingSphere;
  }

  class Geometry extends Node {
    _attributes: attributes;
    _primitives: DrawElements[];
    stateset: StateSet;
    _cacheVertexAttributeBufferList: { [key: number]: BufferArray[] }
    setVertexAttribArray(key: string, array: BufferArray): void;
    getPrimitives(): DrawElements[];
    getAttributes(): attributes;
    getVertexAttributeList(): attributes;
    getPrimitiveSetList(): DrawElements[];
  }

  class StateSet extends OSGObject {
    _parents: Node[];
    _drawID: number;uniforms: { [key: string]: AttributePair };
  }

  class Uniform {
    _data: glMatrix.mat4;
    _transpose: boolean;
    _glCall: string;
    _cache: undefined;
    _name: string;
    _type: undefined;
    _isMatrix: boolean;
  }

  class AttributePair {
    _object: Uniform;
    _value: string;
  }

  enum DrawElementsDataFormat {
    UNSIGNED_BYTE = 0x1401,
    UNSIGNED_SHORT = 0x1403,
    UNSIGNED_INT = 0x1405,
  }

  enum primitiveSet {
    POINTS = 0x0000,
    LINES = 0x0001,
    LINE_LOOP = 0x0002,
    LINE_STRIP = 0x0003,
    TRIANGLES = 0x0004,
    TRIANGLE_STRIP = 0x0005,
    TRIANGLE_FAN = 0x0006,
  }

  class DrawElements {
    mode: primitiveSet;
    itemSize:number;
    count: number;
    offset: number;
    indices: BufferArray;
    uType: DrawElementsDataFormat;
  }

  class GLObject {
    _sResourcesArrayCache: Map<WebGLRenderingContext, GLObject[]>;
    _gl: WebGLRenderingContext;
    getGraphicContext(): WebGLRenderingContext;
  }

  enum BufferArrayType {
    ELEMENT_ARRAY_BUFFER = 0x8893,
    ARRAY_BUFFER = 0x8892,
    STATIC_DRAW = 0x88e4,
    DYNAMIC_DRAW = 0x88e8,
    STREAM_DRAW = 0x88e0,
  }

  enum AttributeType {
    Float32Array = 0x1406,
    Int16Array = 0x1402,
    Uint16Array = 0x1403,
    Int8Array = 0x1400,
    Uint8Array = 0x1401,
    Uint8ClampedArray = 0x1401,
    Int32Array = 0x1404,
    Uint32Array = 0x1405,
  }

  class BufferArray extends GLObject {
    _instanceID: number;
    _buffer: WebGLBuffer;
    _usage: BufferArrayType;
    _type: AttributeType;
    _target: BufferArrayType;
    _normalize: boolean;
    _dirty: boolean;
    _elements:Float32Array;
    _itemSize: number;
    _numItems:number;//this._elements.length / this._itemSize;
    _sDeletedGLBufferArrayCache: Map<WebGLRenderingContext, WebGLBuffer[]>;
  }

  interface attributes {
    [key:string]: BufferArray;
  }

  class NodeVisitor {

  }

  class BoundingBox {
    private _min: glMatrix.vec3;
    private _max: glMatrix.vec3;
  }

  class BoundingSphere {
    private _radius: number;
    private _center: glMatrix.vec3;
    copyBoundingBox(box: BoundingBox): void;
  }
}
