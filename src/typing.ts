// * @param {Object} [options] An object with the following properties:
// * @param {Boolean} [options.binary=false] Convert to binary glTF.
// * @param {Boolean} [options.separate=false] Write out separate buffer files and textures instead of embedding them in the glTF.
// * @param {Boolean} [options.separateTextures=false] Write out separate textures only.
// * @param {Boolean} [options.checkTransparency=false] Do a more exhaustive check for texture transparency by looking at the alpha channel of each pixel.
// * @param {Boolean} [options.secure=false] Prevent the converter from reading textures or mtl files outside of the input obj directory.
// * @param {Boolean} [options.packOcclusion=false] Pack the occlusion texture in the red channel of the metallic-roughness texture.
// * @param {Boolean} [options.metallicRoughness=false] The values in the mtl file are already metallic-roughness PBR values and no conversion step should be applied. Metallic is stored in the Ks and map_Ks slots and roughness is stored in the Ns and map_Ns slots.
// * @param {Boolean} [options.specularGlossiness=false] The values in the mtl file are already specular-glossiness PBR values and no conversion step should be applied. Specular is stored in the Ks and map_Ks slots and glossiness is stored in the Ns and map_Ns slots. The glTF will be saved with the KHR_materials_pbrSpecularGlossiness extension.
// * @param {Boolean} [options.unlit=false] The glTF will be saved with the KHR_materials_unlit extension.
// * @param {Object} [options.overridingTextures] An object containing texture paths that override textures defined in the .mtl file. This is often convenient in workflows where the .mtl does not exist or is not set up to use PBR materials. Intended for models with a single material.
// * @param {String} [options.overridingTextures.metallicRoughnessOcclusionTexture] Path to the metallic-roughness-occlusion texture, where occlusion is stored in the red channel, roughness is stored in the green channel, and metallic is stored in the blue channel. The model will be saved with a pbrMetallicRoughness material.
// * @param {String} [options.overridingTextures.specularGlossinessTexture] Path to the specular-glossiness texture, where specular color is stored in the red, green, and blue channels and specular glossiness is stored in the alpha channel. The model will be saved with a material using the KHR_materials_pbrSpecularGlossiness extension.
// * @param {String} [options.overridingTextures.occlusionTexture] Path to the occlusion texture. Ignored if metallicRoughnessOcclusionTexture is also set.
// * @param {String} [options.overridingTextures.normalTexture] Path to the normal texture.
// * @param {String} [options.overridingTextures.baseColorTexture] Path to the baseColor/diffuse texture.
// * @param {String} [options.overridingTextures.emissiveTexture] Path to the emissive texture.
// * @param {String} [options.overridingTextures.alphaTexture] Path to the alpha texture.
// * @param {String} [options.inputUpAxis='Y'] Up axis of the obj. Choices are 'X', 'Y', and 'Z'.
// * @param {String} [options.outputUpAxis='Y'] Up axis of the converted glTF. Choices are 'X', 'Y', and 'Z'.
// * @param {String} [options.triangleWindingOrderSanitization=false] Apply triangle winding order sanitization.
// * @param {Logger} [options.logger] A callback function for handling logged messages. Defaults to console.log.
// * @param {Writer} [options.writer] A callback function that writes files that are saved as separate resources.
// * @param {String} [options.outputDirectory] Output directory for writing separate resources when options.writer is not defined.

import { Buffer } from "buffer"

export interface IOption {
    binary?: boolean,
    separate?: boolean,
    separateTextures?: boolean,
    checkTransparency?: boolean,
    secure?: boolean,
    packOcclusion?: boolean,
    metallicRoughness?: boolean,
    specularGlossiness?: boolean,
    overridingTextures?: IOverridingTextures,
    logger:(res:string)=>{},
    writer:(relativePath:string, contents:Buffer) => {}
}

export interface IOverridingTextures {
    metallicRoughnessOcclusionTexture: string,
    specularGlossinessTexture: string,
    occlusionTexture: string,
    normalTexture: string,
    baseColorTexture: string,
    emissiveTexture: string,
    alphaTexture: string,
    inputUpAxis?: string,
    outputUpAxis?: string,
    triangleWindingOrderSanitization?: boolean,
    outputDirectory?: boolean,
}