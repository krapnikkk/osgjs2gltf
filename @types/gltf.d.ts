/**
 * The root object for a glTF asset.
 */
 export type GlTF = GlTF1 & GlTF2
 export type GlTF1 = GlTFProperty
 /**
  * A typed view into a buffer view that contains raw binary data.
  */
 export type Accessor = GlTFChildOfRootProperty
 export type GlTFChildOfRootProperty = GlTFProperty
 /**
  * A keyframe animation.
  */
 export type Animation = GlTFChildOfRootProperty
 /**
  * Metadata about the glTF asset.
  */
 export type Asset = GlTFProperty
 /**
  * A buffer points to binary geometry, animation, or skins.
  */
 export type Buffer = GlTFChildOfRootProperty
 /**
  * A view into a buffer generally representing a subset of the buffer.
  */
 export type BufferView = GlTFChildOfRootProperty
 /**
  * A camera's projection.  A node **MAY** reference a camera to apply a transform to place the camera in the scene.
  */
 export type Camera = GlTFChildOfRootProperty
 /**
  * Image data used to create a texture. Image **MAY** be referenced by an URI (or IRI) or a buffer view index.
  */
 export type Image = Image1 & Image2
 export type Image1 = GlTFChildOfRootProperty
 export type Image2 =
   | {
       [k: string]: unknown
     }
   | {
       [k: string]: unknown
     }
 export type Image3 = Image1 & Image2
 /**
  * The material appearance of a primitive.
  */
 export type Material = GlTFChildOfRootProperty
 /**
  * A set of primitives to be rendered.  Its global transform is defined by a node that references it.
  */
 export type Mesh = GlTFChildOfRootProperty
 /**
  * A node in the node hierarchy.  When the node contains `skin`, all `mesh.primitives` **MUST** contain `JOINTS_0` and `WEIGHTS_0` attributes.  A node **MAY** have either a `matrix` or any combination of `translation`/`rotation`/`scale` (TRS) properties. TRS properties are converted to matrices and postmultiplied in the `T * R * S` order to compose the transformation matrix; first the scale is applied to the vertices, then the rotation, and then the translation. If none are provided, the transform is the identity. When a node is targeted for animation (referenced by an animation.channel.target), `matrix` **MUST NOT** be present.
  */
 export type Node = GlTFChildOfRootProperty
 /**
  * Texture sampler properties for filtering and wrapping modes.
  */
 export type Sampler = GlTFChildOfRootProperty
 export type GlTFId = number
 /**
  * The root nodes of a scene.
  */
 export type Scene = GlTFChildOfRootProperty
 /**
  * Joints and matrices defining a skin.
  */
 export type Skin = GlTFChildOfRootProperty
 /**
  * A texture and its sampler.
  */
 export type Texture = GlTFChildOfRootProperty
 
 export interface GlTFProperty {
   extensions?: Extension
   extras?: Extras
   [k: string]: unknown
 }
 /**
  * JSON object with extension-specific objects.
  */
 export interface Extension {
   [k: string]: {
     [k: string]: unknown
   }
 }
 /**
  * Application-specific data.
  */
 export interface Extras {
   [k: string]: unknown
 }
 export interface GlTF2 {
   /**
    * Names of glTF extensions used in this asset.
    */
   extensionsUsed?: [string, ...string[]]
   /**
    * Names of glTF extensions required to properly load this asset.
    */
   extensionsRequired?: [string, ...string[]]
   /**
    * An array of accessors.
    */
   accessors?: [Accessor, ...Accessor[]]
   /**
    * An array of keyframe animations.
    */
   animations?: [Animation, ...Animation[]]
   /**
    * Metadata about the glTF asset.
    */
   asset: Asset
   /**
    * An array of buffers.
    */
   buffers?: [Buffer, ...Buffer[]]
   /**
    * An array of bufferViews.
    */
   bufferViews?: [BufferView, ...BufferView[]]
   /**
    * An array of cameras.
    */
   cameras?: [Camera, ...Camera[]]
   /**
    * An array of images.
    */
   images?: [Image, ...Image3[]]
   /**
    * An array of materials.
    */
   materials?: [Material, ...Material[]]
   /**
    * An array of meshes.
    */
   meshes?: [Mesh, ...Mesh[]]
   /**
    * An array of nodes.
    */
   nodes?: [Node, ...Node[]]
   /**
    * An array of samplers.
    */
   samplers?: [Sampler, ...Sampler[]]
   /**
    * The index of the default scene.
    */
   scene?: GlTFId
   /**
    * An array of scenes.
    */
   scenes?: [Scene, ...Scene[]]
   /**
    * An array of skins.
    */
   skins?: [Skin, ...Skin[]]
   /**
    * An array of textures.
    */
   textures?: [Texture, ...Texture[]]
   extensions?: unknown
   extras?: unknown
   [k: string]: unknown
 }
 