

declare module OSG {
    enum primitiveSet {
        POINTS = 0x0000,
        LINES = 0x0001,
        LINE_LOOP = 0x0002,
        LINE_STRIP = 0x0003,
        TRIANGLES = 0x0004,
        TRIANGLE_STRIP = 0x0005,
        TRIANGLE_FAN = 0x0006,
    }

    type ATTRIBUTE_TYPE =
        'Vertex' |
        'Normal' |
        'Tangent' |
        'TexCoord0' |
        'TexCoord1' |
        'TexCoord2' |
        'TexCoord3' |
        'TexCoord4' |
        'TexCoord5' |
        'TexCoord6' |
        'TexCoord7' |
        'TexCoord8' |
        'TexCoord9' |
        'TexCoord10' |
        'TexCoord11' |
        'TexCoord12' |
        'TexCoord13' |
        'TexCoord14' |
        'TexCoord15' |
        'Color' |
        'Bones' |
        'Weights';

    type UserDataValueName =
        "LambertAmbientColor" |
        "LambertAmbientFactor" |
        "LambertBumpFactor" |
        "LambertDiffuseColor" |
        "LambertDiffuseFactor" |
        "LambertEmissiveColor" |
        "LambertEmissiveFactor" |
        "LambertTransparencyFactor" |
        "PhongReflectionFactor" |
        "PhongShininess" |
        "PhongSpecularColor" |
        "PhongSpecularFactor" |
        "source" |
        "UniqueID";

    type TypedArray =
        "Int32Array" |
        "Uint32Array" |
        "Uint16Array" |
        "Uint8Array";


    type GeometryDataValueName =
        "attributes" |
        "vertex_mode" |
        "uv_0_bits" |
        "uv_0_mode" |
        "epsilon" |
        "nphi" |
        "triangle_mode" |
        "vertex_obits" |
        "vtx_bbl_x" |
        "vtx_bbl_y" |
        "vtx_bbl_z" |
        "vtx_h_x" |
        "vtx_h_y" |
        "vtx_h_z" |
        "uv_0_bbl_x" |
        "uv_0_bbl_y" |
        "uv_0_h_x" |
        "uv_0_h_y" |
        "wireframe" |
        "vertex_bits";

    type AttributeType =
        "ELEMENT_ARRAY_BUFFER" |
        "ARRAY_BUFFER";

    interface Root {
        "Generator": string,
        "Version": number,
        "osg.Node": RootNode
    }

    interface RootNode {
        Children: NodeMap[];
    }

    export type NodeMap = {
        // [key in NodeNameType]?:NodeType;
        [key:string]:NodeType;
        // "osg.Node"?: NodeType,
        // "osg.MatrixTransform"?: NodeType,
        // "osg.Geometry"?: NodeType,
    }

    export const enum ENode {
        Node = "osg.Node",
        MatrixTransform = "osg.MatrixTransform",
        Geometry = "osg.Geometry"
    }
    export type NodeNameType = "osg.Node"|"osg.MatrixTransform"|"osg.Geometry";

    type NodeType = Node | MatrixTransform | Geometry;

    interface BaseData {
        Name?: string,
        UniqueID: number,
        UserDataContainer?: IUserData
    }

    interface Node extends BaseData {
        nodeId?:number;
        type?:string;
        Children?: NodeMap[];
    }

    interface Geometry extends Node {
        PrimitiveSetList: IPrimitiveSet[];
        VertexAttributeList: IVertexAttribute;
        StateSet?: IStateSet
    }

    interface StateSet extends BaseData {
        AttributeList?: IAttribute[]
    }

    interface IAttribute {
        "osg.Material"?: Material,
    }

    type DrawElementsType = "DrawElementsUByte" | "DrawElementsUShort" | "DrawElementsUInt";

    type IPrimitiveSet = {
        [key in DrawElementsType]?: IDrawElement
    }

    type IVertexAttribute = {
        [key in ATTRIBUTE_TYPE]?: VertexAttribute;
    }

    interface IDrawElement extends BaseData {
        Indices: IIndices,
        Mode: string,// TRIANGLE_STRIP LINES
    }

    interface IIndices extends BaseData {
        Array: IArray,
        ItemSize: number,
        Type: AttributeType, // ELEMENT_ARRAY_BUFFER
    }

    interface VertexAttribute extends BaseData {
        Array?: IArray,
        ItemSize?: number,
        Type?: AttributeType, // ELEMENT_ARRAY_BUFFER
    }

    type IArray = {
        [key in TypedArray]?: IByteArray
    }

    interface IByteArray {
        File: string;// model_file.binz
        Size: number,
        Offset: number,
        Encoding?: string,// varint
    }

    interface IStateSet {
        "osg.StateSet": StateSet
    }

    interface MatrixTransform extends Node {
        Matrix: number[],
    }

    interface Material extends BaseData {
        Ambient: number[],
        Diffuse: number[],
        Emission: number[],
        Shininess: number,
        Specular: number[]
    }

    interface IUserData {
        UniqueID: number,
        Values: IUserDataValue[] | IGeometryDataValue[]
    }

    interface IUserDataValue {
        Name: UserDataValueName,
        Value: string
    }

    interface IGeometryDataValue {
        Name: GeometryDataValueName,
        Value: string
    }
}