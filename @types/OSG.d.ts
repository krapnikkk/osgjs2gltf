interface OSG {
    "Generator": string,
    "Version": number,
    "osg.Node": OSGBaseNode
}

interface OSGBaseNode {
    "osg.Node"
    "osg.MatrixTransform"?
}

interface OSGNode {
    Children: any[];
    UniqueID?: number,
    Name?: string,
    Matrix: number[],
    UserDataContainer: IUserData
}

interface IUserData {
    UniqueID: number,
    Values: IUserDataValue[]
}

interface IUserDataValue {
    Name: string,
    Value: string
}