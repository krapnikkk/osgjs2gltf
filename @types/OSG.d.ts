

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

    interface Root {
        "Generator": string,
        "Version": number,
        "osg.Node": OSGNode
    }

    interface OSGNodeMap {
        "osg.Node"?: OSGNode,
        "osg.MatrixTransform"?: OSGMatrixTransform,
        "osg.Geometry"?: OSGGeometry,
    }

    interface BaseData {
        UniqueID: number,
        UserDataContainer?: IUserData
    }

    interface OSGNode extends BaseData {
        Children: OSGNodeMap[];
        Name?: string,
        Matrix?: number[],
    }

    interface OSGGeometry extends OSGNode {
        PrimitiveSetList: IPrimitiveSet[];
        VertexAttributeList: IVertexAttribute;
        StateSet: IStateSet
    }

    interface OSGStateSet extends BaseData {
        AttributeList: IAttribute[]
    }

    interface IAttribute {
        "osg.Material"?: OSGMaterial,
    }

    type DrawElementsType = "DrawElementsUByte" | "DrawElementsUShort" | "DrawElementsUInt";

    type IPrimitiveSet = BaseData & {
        [key in DrawElementsType]: IDrawElement
    }

    interface IVertexAttribute {
        Vertex: IVertex;
    }

    type IVertex = BaseData & {
        [key in ATTRIBUTE_TYPE]: IArray;
    };

    interface IDrawElement extends BaseData {
        Indices: {
            UniqueID: 16,
            Array: IArray,
            ItemSize: number,
            Type: string, // ELEMENT_ARRAY_BUFFER
        },
        Mode: string,// TRIANGLE_STRIP LINES
    }

    interface IArray {
        Int32Array?: IByteArray
        Uint32Array?: IByteArray
        Uint16Array?: IByteArray
        Uint8Array?: IByteArray
    }

    interface IByteArray {
        File: string;// model_file.binz
        Size: number,
        Offset: number,
        Encoding: string,// varint
    }

    interface IStateSet {
        "osg.StateSet": OSGStateSet
    }

    interface OSGMatrixTransform extends OSGNode {

    }

    interface OSGMaterial extends BaseData {
        Ambient: number[],
        Diffuse: number[],
        Emission: number[],
        Shininess: number,
        Specular: number[]
    }

    interface IUserData {
        UniqueID: number,
        Values: IUserDataValue[]
    }

    interface IUserDataValue {
        Name: UserDataValueName,
        Value: string
    }

}