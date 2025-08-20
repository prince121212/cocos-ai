"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenceImageTools = void 0;
class ReferenceImageTools {
    getTools() {
        return [
            // 1. Reference Image Management - Basic operations
            {
                name: 'reference_image_management',
                description: 'REFERENCE IMAGE MANAGEMENT: Add, remove, switch, and clear reference images. Use this for basic reference image operations like adding images to scene, removing them, switching between images, and clearing all images.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['add', 'remove', 'switch', 'clear_all'],
                            description: 'Action: "add" = add reference images to scene | "remove" = remove specific or current reference images | "switch" = switch to specific reference image | "clear_all" = clear all reference images'
                        },
                        // For add action
                        paths: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'Array of reference image absolute paths. Use with action="add". Example: ["/path/to/image1.png", "/path/to/image2.jpg"]'
                        },
                        // For remove action
                        removePaths: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'Array of reference image paths to remove. Use with action="remove". If empty, removes current reference image. Example: ["/path/to/image.png"]'
                        },
                        // For switch action
                        path: {
                            type: 'string',
                            description: 'Reference image absolute path to switch to. Use with action="switch". Example: "/path/to/reference.png"'
                        },
                        sceneUUID: {
                            type: 'string',
                            description: 'Specific scene UUID for switching reference image. Use with action="switch". Optional parameter.'
                        }
                    },
                    required: ['action'],
                    anyOf: [
                        {
                            properties: { action: { const: 'add' } },
                            required: ['paths']
                        },
                        {
                            properties: { action: { const: 'switch' } },
                            required: ['path']
                        }
                    ]
                }
            },
            // 2. Reference Image Query - Get information
            {
                name: 'reference_image_query',
                description: 'REFERENCE IMAGE QUERY: Get reference image configuration, current image data, and list all available images. Use this to inspect reference image settings and current state.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['get_config', 'get_current', 'list_all'],
                            description: 'Action: "get_config" = get reference image configuration | "get_current" = get current reference image data | "list_all" = list all available reference images'
                        }
                    },
                    required: ['action']
                }
            },
            // 3. Reference Image Transform - Position, scale, opacity
            {
                name: 'reference_image_transform',
                description: 'REFERENCE IMAGE TRANSFORM: Set reference image position, scale, opacity, and other transform properties. Use this for adjusting how reference images are displayed in the scene.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['set_position', 'set_scale', 'set_opacity', 'set_data'],
                            description: 'Action: "set_position" = set image position | "set_scale" = set image scale | "set_opacity" = set image opacity | "set_data" = set any transform property'
                        },
                        // For set_position action
                        x: {
                            type: 'number',
                            description: 'X position offset. Use with action="set_position". Example: 100'
                        },
                        y: {
                            type: 'number',
                            description: 'Y position offset. Use with action="set_position". Example: 200'
                        },
                        // For set_scale action
                        sx: {
                            type: 'number',
                            description: 'X scale factor (0.1 to 10). Use with action="set_scale". Example: 1.5',
                            minimum: 0.1,
                            maximum: 10
                        },
                        sy: {
                            type: 'number',
                            description: 'Y scale factor (0.1 to 10). Use with action="set_scale". Example: 1.5',
                            minimum: 0.1,
                            maximum: 10
                        },
                        // For set_opacity action
                        opacity: {
                            type: 'number',
                            description: 'Opacity value (0.0 to 1.0). Use with action="set_opacity". Example: 0.8',
                            minimum: 0,
                            maximum: 1
                        },
                        // For set_data action
                        key: {
                            type: 'string',
                            description: 'Property key to set. Use with action="set_data". Options: "path", "x", "y", "sx", "sy", "opacity"',
                            enum: ['path', 'x', 'y', 'sx', 'sy', 'opacity']
                        },
                        value: {
                            description: 'Property value to set. Use with action="set_data". Type depends on key: string for path, number for x/y/sx/sy/opacity'
                        }
                    },
                    required: ['action'],
                    anyOf: [
                        {
                            properties: { action: { const: 'set_position' } },
                            required: ['x', 'y']
                        },
                        {
                            properties: { action: { const: 'set_scale' } },
                            required: ['sx', 'sy']
                        },
                        {
                            properties: { action: { const: 'set_opacity' } },
                            required: ['opacity']
                        },
                        {
                            properties: { action: { const: 'set_data' } },
                            required: ['key', 'value']
                        }
                    ]
                }
            },
            // 4. Reference Image Display - Refresh and utilities
            {
                name: 'reference_image_display',
                description: 'REFERENCE IMAGE DISPLAY: Refresh reference image display and manage image visibility. Use this for updating the display and managing reference image refresh operations.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['refresh'],
                            description: 'Action: "refresh" = refresh reference image display'
                        }
                    },
                    required: ['action']
                }
            }
        ];
    }
    async execute(toolName, args) {
        switch (toolName) {
            case 'reference_image_management':
                return await this.handleImageManagement(args);
            case 'reference_image_query':
                return await this.handleImageQuery(args);
            case 'reference_image_transform':
                return await this.handleImageTransform(args);
            case 'reference_image_display':
                return await this.handleImageDisplay(args);
            default:
                // Legacy tool support for backward compatibility
                return await this.handleLegacyTools(toolName, args);
        }
    }
    async addReferenceImage(paths) {
        return new Promise((resolve) => {
            // 验证路径格式
            const invalidPaths = paths.filter(path => !path || typeof path !== 'string');
            if (invalidPaths.length > 0) {
                resolve({
                    success: false,
                    error: `Invalid paths provided: ${invalidPaths.join(', ')}`
                });
                return;
            }
            Editor.Message.request('reference-image', 'add-image', paths).then(() => {
                resolve({
                    success: true,
                    data: {
                        addedPaths: paths,
                        count: paths.length,
                        message: `Added ${paths.length} reference image(s)`
                    }
                });
            }).catch((err) => {
                // 增强错误信息
                let errorMessage = err.message;
                if (err.message.includes('not found') || err.message.includes('not exist')) {
                    errorMessage = `Image file not found: ${paths.join(', ')}. Please check if the file exists and the path is correct.`;
                }
                else if (err.message.includes('permission')) {
                    errorMessage = `Permission denied accessing image files: ${paths.join(', ')}. Please check file permissions.`;
                }
                else if (err.message.includes('format')) {
                    errorMessage = `Unsupported image format: ${paths.join(', ')}. Please use supported formats (PNG, JPG, JPEG).`;
                }
                resolve({
                    success: false,
                    error: errorMessage,
                    data: {
                        failedPaths: paths,
                        suggestion: 'Please verify the image paths and file existence.'
                    }
                });
            });
        });
    }
    async removeReferenceImage(paths) {
        return new Promise((resolve) => {
            Editor.Message.request('reference-image', 'remove-image', paths).then(() => {
                const message = paths && paths.length > 0 ?
                    `Removed ${paths.length} reference image(s)` :
                    'Removed current reference image';
                resolve({
                    success: true,
                    message: message
                });
            }).catch((err) => {
                resolve({ success: false, error: err.message });
            });
        });
    }
    async switchReferenceImage(path, sceneUUID) {
        return new Promise((resolve) => {
            // 验证路径格式
            if (!path || typeof path !== 'string') {
                resolve({
                    success: false,
                    error: 'Invalid image path provided. Please provide a valid file path.'
                });
                return;
            }
            const args = sceneUUID ? [path, sceneUUID] : [path];
            Editor.Message.request('reference-image', 'switch-image', ...args).then((result) => {
                var _a, _b;
                // 检查是否有警告信息
                const hasWarning = result && (result.warning || ((_a = result.message) === null || _a === void 0 ? void 0 : _a.includes('blank')) || ((_b = result.message) === null || _b === void 0 ? void 0 : _b.includes('not found')));
                resolve({
                    success: true,
                    data: {
                        path: path,
                        sceneUUID: sceneUUID,
                        message: `Switched to reference image: ${path}`,
                        warning: hasWarning ? 'Image may be blank or not found. Please verify the image file exists.' : undefined
                    },
                    warning: hasWarning ? 'Image may be blank or not found. Please verify the image file exists.' : undefined
                });
            }).catch((err) => {
                let errorMessage = err.message;
                if (err.message.includes('not found') || err.message.includes('not exist')) {
                    errorMessage = `Image file not found: ${path}. Please check if the file exists and the path is correct.`;
                }
                else if (err.message.includes('permission')) {
                    errorMessage = `Permission denied accessing image file: ${path}. Please check file permissions.`;
                }
                else if (err.message.includes('format')) {
                    errorMessage = `Unsupported image format: ${path}. Please use supported formats (PNG, JPG, JPEG).`;
                }
                resolve({
                    success: false,
                    error: errorMessage,
                    data: {
                        failedPath: path,
                        suggestion: 'Please verify the image path and file existence.'
                    }
                });
            });
        });
    }
    async setReferenceImageData(key, value) {
        return new Promise((resolve) => {
            Editor.Message.request('reference-image', 'set-image-data', key, value).then(() => {
                resolve({
                    success: true,
                    data: {
                        key: key,
                        value: value,
                        message: `Reference image ${key} set to ${value}`
                    }
                });
            }).catch((err) => {
                resolve({ success: false, error: err.message });
            });
        });
    }
    async queryReferenceImageConfig() {
        return new Promise((resolve) => {
            Editor.Message.request('reference-image', 'query-config').then((config) => {
                // 数据一致性检查
                const consistencyIssues = this.checkDataConsistency(config);
                resolve({
                    success: true,
                    data: Object.assign(Object.assign({}, config), { dataConsistency: {
                            issues: consistencyIssues,
                            hasIssues: consistencyIssues.length > 0
                        } }),
                    warning: consistencyIssues.length > 0 ?
                        `Data consistency issues detected: ${consistencyIssues.join(', ')}` : undefined
                });
            }).catch((err) => {
                resolve({ success: false, error: err.message });
            });
        });
    }
    checkDataConsistency(config) {
        const issues = [];
        if (!config) {
            issues.push('No configuration data available');
            return issues;
        }
        // 检查配置中的图片列表
        if (config.images && Array.isArray(config.images)) {
            const deletedImages = config.images.filter((img) => img.path && (img.path.includes('deleted') || img.path.includes('nonexistent')));
            if (deletedImages.length > 0) {
                issues.push(`Found ${deletedImages.length} deleted/nonexistent images in configuration`);
            }
            // 检查当前图片是否在列表中
            if (config.current && !config.images.find((img) => img.path === config.current)) {
                issues.push('Current image not found in image list');
            }
            // 检查重复的图片路径
            const paths = config.images.map((img) => img.path).filter(Boolean);
            const uniquePaths = new Set(paths);
            if (paths.length !== uniquePaths.size) {
                issues.push('Duplicate image paths found in configuration');
            }
        }
        // 检查当前图片设置
        if (config.current && typeof config.current !== 'string') {
            issues.push('Invalid current image path format');
        }
        return issues;
    }
    async queryCurrentReferenceImage() {
        return new Promise((resolve) => {
            Editor.Message.request('reference-image', 'query-current').then((current) => {
                resolve({
                    success: true,
                    data: current
                });
            }).catch((err) => {
                resolve({ success: false, error: err.message });
            });
        });
    }
    async refreshReferenceImage() {
        return new Promise((resolve) => {
            Editor.Message.request('reference-image', 'refresh').then(() => {
                resolve({
                    success: true,
                    message: 'Reference image refreshed'
                });
            }).catch((err) => {
                resolve({ success: false, error: err.message });
            });
        });
    }
    async setReferenceImagePosition(x, y) {
        return new Promise(async (resolve) => {
            try {
                await Editor.Message.request('reference-image', 'set-image-data', 'x', x);
                await Editor.Message.request('reference-image', 'set-image-data', 'y', y);
                resolve({
                    success: true,
                    data: {
                        x: x,
                        y: y,
                        message: `Reference image position set to (${x}, ${y})`
                    }
                });
            }
            catch (err) {
                resolve({ success: false, error: err.message });
            }
        });
    }
    async setReferenceImageScale(sx, sy) {
        return new Promise(async (resolve) => {
            try {
                await Editor.Message.request('reference-image', 'set-image-data', 'sx', sx);
                await Editor.Message.request('reference-image', 'set-image-data', 'sy', sy);
                resolve({
                    success: true,
                    data: {
                        sx: sx,
                        sy: sy,
                        message: `Reference image scale set to (${sx}, ${sy})`
                    }
                });
            }
            catch (err) {
                resolve({ success: false, error: err.message });
            }
        });
    }
    async setReferenceImageOpacity(opacity) {
        return new Promise((resolve) => {
            Editor.Message.request('reference-image', 'set-image-data', 'opacity', opacity).then(() => {
                resolve({
                    success: true,
                    data: {
                        opacity: opacity,
                        message: `Reference image opacity set to ${opacity}`
                    }
                });
            }).catch((err) => {
                resolve({ success: false, error: err.message });
            });
        });
    }
    async listReferenceImages() {
        return new Promise(async (resolve) => {
            try {
                const config = await Editor.Message.request('reference-image', 'query-config');
                const current = await Editor.Message.request('reference-image', 'query-current');
                resolve({
                    success: true,
                    data: {
                        config: config,
                        current: current,
                        message: 'Reference image information retrieved'
                    }
                });
            }
            catch (err) {
                resolve({ success: false, error: err.message });
            }
        });
    }
    async clearAllReferenceImages() {
        return new Promise(async (resolve) => {
            try {
                // Remove all reference images by calling remove-image without paths
                await Editor.Message.request('reference-image', 'remove-image');
                resolve({
                    success: true,
                    message: 'All reference images cleared'
                });
            }
            catch (err) {
                resolve({ success: false, error: err.message });
            }
        });
    }
    /**
     * Validate required parameters for specific actions
     * @param {Object} args - Arguments to validate
     * @param {string} action - Action being performed
     * @returns {Object|null} - Error object if validation fails, null if valid
     */
    validateActionParameters(args, action) {
        const requiredParams = {
            'add': ['paths'],
            'switch': ['path'],
            'set_position': ['x', 'y'],
            'set_scale': ['sx', 'sy'],
            'set_opacity': ['opacity'],
            'set_data': ['key', 'value']
        };

        const required = requiredParams[action];
        if (!required) return null; // No specific requirements

        for (const param of required) {
            if (args[param] === undefined || args[param] === null) {
                return { success: false, error: `Missing required parameter: ${param} for action: ${action}` };
            }
        }
        return null; // Valid
    }

    // New handler methods for optimized tools
    async handleImageManagement(args) {
        const { action } = args;

        // Validate required parameters
        const validationError = this.validateActionParameters(args, action);
        if (validationError) return validationError;

        switch (action) {
            case 'add':
                return await this.addReferenceImage(args.paths);
            case 'remove':
                return await this.removeReferenceImage(args.removePaths);
            case 'switch':
                return await this.switchReferenceImage(args.path, args.sceneUUID);
            case 'clear_all':
                return await this.clearAllReferenceImages();
            default:
                return { success: false, error: `Unknown image management action: ${action}` };
        }
    }
    async handleImageQuery(args) {
        const { action } = args;
        switch (action) {
            case 'get_config':
                return await this.queryReferenceImageConfig();
            case 'get_current':
                return await this.queryCurrentReferenceImage();
            case 'list_all':
                return await this.listReferenceImages();
            default:
                return { success: false, error: `Unknown image query action: ${action}` };
        }
    }
    async handleImageTransform(args) {
        const { action } = args;

        // Validate required parameters
        const validationError = this.validateActionParameters(args, action);
        if (validationError) return validationError;

        switch (action) {
            case 'set_position':
                return await this.setReferenceImagePosition(args.x, args.y);
            case 'set_scale':
                return await this.setReferenceImageScale(args.sx, args.sy);
            case 'set_opacity':
                return await this.setReferenceImageOpacity(args.opacity);
            case 'set_data':
                return await this.setReferenceImageData(args.key, args.value);
            default:
                return { success: false, error: `Unknown image transform action: ${action}` };
        }
    }
    async handleImageDisplay(args) {
        const { action } = args;
        switch (action) {
            case 'refresh':
                return await this.refreshReferenceImage();
            default:
                return { success: false, error: `Unknown image display action: ${action}` };
        }
    }
    // Legacy tool support for backward compatibility
    async handleLegacyTools(toolName, args) {
        switch (toolName) {
            case 'add_reference_image':
                return await this.addReferenceImage(args.paths);
            case 'remove_reference_image':
                return await this.removeReferenceImage(args.paths);
            case 'switch_reference_image':
                return await this.switchReferenceImage(args.path, args.sceneUUID);
            case 'set_reference_image_data':
                return await this.setReferenceImageData(args.key, args.value);
            case 'query_reference_image_config':
                return await this.queryReferenceImageConfig();
            case 'query_current_reference_image':
                return await this.queryCurrentReferenceImage();
            case 'refresh_reference_image':
                return await this.refreshReferenceImage();
            case 'set_reference_image_position':
                return await this.setReferenceImagePosition(args.x, args.y);
            case 'set_reference_image_scale':
                return await this.setReferenceImageScale(args.sx, args.sy);
            case 'set_reference_image_opacity':
                return await this.setReferenceImageOpacity(args.opacity);
            case 'list_reference_images':
                return await this.listReferenceImages();
            case 'clear_all_reference_images':
                return await this.clearAllReferenceImages();
            default:
                return { success: false, error: `Unknown tool: ${toolName}` };
        }
    }
}
exports.ReferenceImageTools = ReferenceImageTools;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmZXJlbmNlLWltYWdlLXRvb2xzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc291cmNlL3Rvb2xzL3JlZmVyZW5jZS1pbWFnZS10b29scy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxNQUFhLG1CQUFtQjtJQUM1QixRQUFRO1FBQ0osT0FBTztZQUNILG1EQUFtRDtZQUNuRDtnQkFDSSxJQUFJLEVBQUUsNEJBQTRCO2dCQUNsQyxXQUFXLEVBQUUsMk5BQTJOO2dCQUN4TyxXQUFXLEVBQUU7b0JBQ1QsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsVUFBVSxFQUFFO3dCQUNSLE1BQU0sRUFBRTs0QkFDSixJQUFJLEVBQUUsUUFBUTs0QkFDZCxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxXQUFXLENBQUM7NEJBQzlDLFdBQVcsRUFBRSxtTUFBbU07eUJBQ25OO3dCQUNELGlCQUFpQjt3QkFDakIsS0FBSyxFQUFFOzRCQUNILElBQUksRUFBRSxPQUFPOzRCQUNiLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7NEJBQ3pCLFdBQVcsRUFBRSx5SEFBeUg7eUJBQ3pJO3dCQUNELG9CQUFvQjt3QkFDcEIsV0FBVyxFQUFFOzRCQUNULElBQUksRUFBRSxPQUFPOzRCQUNiLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7NEJBQ3pCLFdBQVcsRUFBRSxnSkFBZ0o7eUJBQ2hLO3dCQUNELG9CQUFvQjt3QkFDcEIsSUFBSSxFQUFFOzRCQUNGLElBQUksRUFBRSxRQUFROzRCQUNkLFdBQVcsRUFBRSx5R0FBeUc7eUJBQ3pIO3dCQUNELFNBQVMsRUFBRTs0QkFDUCxJQUFJLEVBQUUsUUFBUTs0QkFDZCxXQUFXLEVBQUUsa0dBQWtHO3lCQUNsSDtxQkFDSjtvQkFDRCxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUM7b0JBQ3BCLEtBQUssRUFBRTt3QkFDSDs0QkFDSSxVQUFVLEVB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QUMzQixPQUFPLE1BQU0sSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2xFLEtBQUssOEJBQThCO2dCQUMvQixPQUFPLE1BQU0sSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7WUFDbEQsS0FBSywrQkFBK0I7Z0JBQ2hDLE9BQU8sTUFBTSxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztZQUNuRCxLQUFLLHlCQUF5QjtnQkFDMUIsT0FBTyxNQUFNLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1lBQzlDLEtBQUssOEJBQThCO2dCQUMvQixPQUFPLE1BQU0sSUFBSSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hFLEtBQUssMkJBQTJCO2dCQUM1QixPQUFPLE1BQU0sSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQy9ELEtBQUssNkJBQTZCO2dCQUM5QixPQUFPLE1BQU0sSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM3RCxLQUFLLHVCQUF1QjtnQkFDeEIsT0FBTyxNQUFNLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1lBQzVDLEtBQUssNEJBQTRCO2dCQUM3QixPQUFPLE1BQU0sSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7WUFDaEQ7Z0JBQ0ksT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLGlCQUFpQixRQUFRLEVBQUUsRUFBRSxDQUFDO1FBQ3RFLENBQUM7SUFDTCxDQUFDO0NBQ0o7QUE5akJELGtEQThqQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUb29sRGVmaW5pdGlvbiwgVG9vbFJlc3BvbnNlLCBUb29sRXhlY3V0b3IgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBjbGFzcyBSZWZlcmVuY2VJbWFnZVRvb2xzIGltcGxlbWVudHMgVG9vbEV4ZWN1dG9yIHtcbiAgICBnZXRUb29scygpOiBUb29sRGVmaW5pdGlvbltdIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIC8vIDEuIFJlZmVyZW5jZSBJbWFnZSBNYW5hZ2VtZW50IC0gQmFzaWMgb3BlcmF0aW9uc1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdyZWZlcmVuY2VfaW1hZ2VfbWFuYWdlbWVudCcsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdSRUZFUkVOQ0UgSU1BR0UgTUFOQUdFTUVOVDogQWRkLCByZW1vdmUsIHN3aXRjaCwgYW5kIGNsZWFyIHJlZmVyZW5jZSBpbWFnZXMuIFVzZSB0aGlzIGZvciBiYXNpYyByZWZlcmVuY2UgaW1hZ2Ugb3BlcmF0aW9ucyBsaWtlIGFkZGluZyBpbWFnZXMgdG8gc2NlbmUsIHJlbW92aW5nIHRoZW0sIHN3aXRjaGluZyBiZXR3ZWVuIGltYWdlcywgYW5kIGNsZWFyaW5nIGFsbCBpbWFnZXMuJyxcbiAgICAgICAgICAgICAgICBpbnB1dFNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW51bTogWydhZGQnLCAncmVtb3ZlJywgJ3N3aXRjaCcsICdjbGVhcl9hbGwnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0FjdGlvbjogXCJhZGRcIiA9IGFkZCByZWZlcmVuY2UgaW1hZ2VzIHRvIHNjZW5lIHwgXCJyZW1vdmVcIiA9IHJlbW92ZSBzcGVjaWZpYyBvciBjdXJyZW50IHJlZmVyZW5jZSBpbWFnZXMgfCBcInN3aXRjaFwiID0gc3dpdGNoIHRvIHNwZWNpZmljIHJlZmVyZW5jZSBpbWFnZSB8IFwiY2xlYXJfYWxsXCIgPSBjbGVhciBhbGwgcmVmZXJlbmNlIGltYWdlcydcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3IgYWRkIGFjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aHM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdBcnJheSBvZiByZWZlcmVuY2UgaW1hZ2UgYWJzb2x1dGUgcGF0aHMuIFVzZSB3aXRoIGFjdGlvbj1cImFkZFwiLiBFeGFtcGxlOiBbXCIvcGF0aC90by9pbWFnZTEucG5nXCIsIFwiL3BhdGgvdG8vaW1hZ2UyLmpwZ1wiXSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3IgcmVtb3ZlIGFjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlUGF0aHM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdBcnJheSBvZiByZWZlcmVuY2UgaW1hZ2UgcGF0aHMgdG8gcmVtb3ZlLiBVc2Ugd2l0aCBhY3Rpb249XCJyZW1vdmVcIi4gSWYgZW1wdHksIHJlbW92ZXMgY3VycmVudCByZWZlcmVuY2UgaW1hZ2UuIEV4YW1wbGU6IFtcIi9wYXRoL3RvL2ltYWdlLnBuZ1wiXSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3Igc3dpdGNoIGFjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnUmVmZXJlbmNlIGltYWdlIGFic29sdXRlIHBhdGggdG8gc3dpdGNoIHRvLiBVc2Ugd2l0aCBhY3Rpb249XCJzd2l0Y2hcIi4gRXhhbXBsZTogXCIvcGF0aC90by9yZWZlcmVuY2UucG5nXCInXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NlbmVVVUlEOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdTcGVjaWZpYyBzY2VuZSBVVUlEIGZvciBzd2l0Y2hpbmcgcmVmZXJlbmNlIGltYWdlLiBVc2Ugd2l0aCBhY3Rpb249XCJzd2l0Y2hcIi4gT3B0aW9uYWwgcGFyYW1ldGVyLidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsnYWN0aW9uJ10sXG4gICAgICAgICAgICAgICAgICAgIGFueU9mOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczogeyBhY3Rpb246IHsgY29uc3Q6ICdhZGQnIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogWydwYXRocyddXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHsgYWN0aW9uOiB7IGNvbnN0OiAnc3dpdGNoJyB9IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsncGF0aCddXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyAyLiBSZWZlcmVuY2UgSW1hZ2UgUXVlcnkgLSBHZXQgaW5mb3JtYXRpb25cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAncmVmZXJlbmNlX2ltYWdlX3F1ZXJ5JyxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1JFRkVSRU5DRSBJTUFHRSBRVUVSWTogR2V0IHJlZmVyZW5jZSBpbWFnZSBjb25maWd1cmF0aW9uLCBjdXJyZW50IGltYWdlIGRhdGEsIGFuZCBsaXN0IGFsbCBhdmFpbGFibGUgaW1hZ2VzLiBVc2UgdGhpcyB0byBpbnNwZWN0IHJlZmVyZW5jZSBpbWFnZSBzZXR0aW5ncyBhbmQgY3VycmVudCBzdGF0ZS4nLFxuICAgICAgICAgICAgICAgIGlucHV0U2NoZW1hOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnVtOiBbJ2dldF9jb25maWcnLCAnZ2V0X2N1cnJlbnQnLCAnbGlzdF9hbGwnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0FjdGlvbjogXCJnZXRfY29uZmlnXCIgPSBnZXQgcmVmZXJlbmNlIGltYWdlIGNvbmZpZ3VyYXRpb24gfCBcImdldF9jdXJyZW50XCIgPSBnZXQgY3VycmVudCByZWZlcmVuY2UgaW1hZ2UgZGF0YSB8IFwibGlzdF9hbGxcIiA9IGxpc3QgYWxsIGF2YWlsYWJsZSByZWZlcmVuY2UgaW1hZ2VzJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogWydhY3Rpb24nXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIDMuIFJlZmVyZW5jZSBJbWFnZSBUcmFuc2Zvcm0gLSBQb3NpdGlvbiwgc2NhbGUsIG9wYWNpdHlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAncmVmZXJlbmNlX2ltYWdlX3RyYW5zZm9ybScsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdSRUZFUkVOQ0UgSU1BR0UgVFJBTlNGT1JNOiBTZXQgcmVmZXJlbmNlIGltYWdlIHBvc2l0aW9uLCBzY2FsZSwgb3BhY2l0eSwgYW5kIG90aGVyIHRyYW5zZm9ybSBwcm9wZXJ0aWVzLiBVc2UgdGhpcyBmb3IgYWRqdXN0aW5nIGhvdyByZWZlcmVuY2UgaW1hZ2VzIGFyZSBkaXNwbGF5ZWQgaW4gdGhlIHNjZW5lLicsXG4gICAgICAgICAgICAgICAgaW5wdXRTY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudW06IFsnc2V0X3Bvc2l0aW9uJywgJ3NldF9zY2FsZScsICdzZXRfb3BhY2l0eScsICdzZXRfZGF0YSddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQWN0aW9uOiBcInNldF9wb3NpdGlvblwiID0gc2V0IGltYWdlIHBvc2l0aW9uIHwgXCJzZXRfc2NhbGVcIiA9IHNldCBpbWFnZSBzY2FsZSB8IFwic2V0X29wYWNpdHlcIiA9IHNldCBpbWFnZSBvcGFjaXR5IHwgXCJzZXRfZGF0YVwiID0gc2V0IGFueSB0cmFuc2Zvcm0gcHJvcGVydHknXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yIHNldF9wb3NpdGlvbiBhY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIHg6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1ggcG9zaXRpb24gb2Zmc2V0LiBVc2Ugd2l0aCBhY3Rpb249XCJzZXRfcG9zaXRpb25cIi4gRXhhbXBsZTogMTAwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1kgcG9zaXRpb24gb2Zmc2V0LiBVc2Ugd2l0aCBhY3Rpb249XCJzZXRfcG9zaXRpb25cIi4gRXhhbXBsZTogMjAwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvciBzZXRfc2NhbGUgYWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBzeDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnWCBzY2FsZSBmYWN0b3IgKDAuMSB0byAxMCkuIFVzZSB3aXRoIGFjdGlvbj1cInNldF9zY2FsZVwiLiBFeGFtcGxlOiAxLjUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltdW06IDAuMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhpbXVtOiAxMFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdZIHNjYWxlIGZhY3RvciAoMC4xIHRvIDEwKS4gVXNlIHdpdGggYWN0aW9uPVwic2V0X3NjYWxlXCIuIEV4YW1wbGU6IDEuNScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bTogMC4xLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heGltdW06IDEwXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yIHNldF9vcGFjaXR5IGFjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnT3BhY2l0eSB2YWx1ZSAoMC4wIHRvIDEuMCkuIFVzZSB3aXRoIGFjdGlvbj1cInNldF9vcGFjaXR5XCIuIEV4YW1wbGU6IDAuOCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhpbXVtOiAxXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yIHNldF9kYXRhIGFjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdQcm9wZXJ0eSBrZXkgdG8gc2V0LiBVc2Ugd2l0aCBhY3Rpb249XCJzZXRfZGF0YVwiLiBPcHRpb25zOiBcInBhdGhcIiwgXCJ4XCIsIFwieVwiLCBcInN4XCIsIFwic3lcIiwgXCJvcGFjaXR5XCInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudW06IFsncGF0aCcsICd4JywgJ3knLCAnc3gnLCAnc3knLCAnb3BhY2l0eSddXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1Byb3BlcnR5IHZhbHVlIHRvIHNldC4gVXNlIHdpdGggYWN0aW9uPVwic2V0X2RhdGFcIi4gVHlwZSBkZXBlbmRzIG9uIGtleTogc3RyaW5nIGZvciBwYXRoLCBudW1iZXIgZm9yIHgveS9zeC9zeS9vcGFjaXR5J1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogWydhY3Rpb24nXSxcbiAgICAgICAgICAgICAgICAgICAgYW55T2Y6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7IGFjdGlvbjogeyBjb25zdDogJ3NldF9wb3NpdGlvbicgfSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkOiBbJ3gnLCAneSddXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHsgYWN0aW9uOiB7IGNvbnN0OiAnc2V0X3NjYWxlJyB9IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsnc3gnLCAnc3knXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7IGFjdGlvbjogeyBjb25zdDogJ3NldF9vcGFjaXR5JyB9IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsnb3BhY2l0eSddXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHsgYWN0aW9uOiB7IGNvbnN0OiAnc2V0X2RhdGEnIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogWydrZXknLCAndmFsdWUnXVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8gNC4gUmVmZXJlbmNlIEltYWdlIERpc3BsYXkgLSBSZWZyZXNoIGFuZCB1dGlsaXRpZXNcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAncmVmZXJlbmNlX2ltYWdlX2Rpc3BsYXknLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnUkVGRVJFTkNFIElNQUdFIERJU1BMQVk6IFJlZnJlc2ggcmVmZXJlbmNlIGltYWdlIGRpc3BsYXkgYW5kIG1hbmFnZSBpbWFnZSB2aXNpYmlsaXR5LiBVc2UgdGhpcyBmb3IgdXBkYXRpbmcgdGhlIGRpc3BsYXkgYW5kIG1hbmFnaW5nIHJlZmVyZW5jZSBpbWFnZSByZWZyZXNoIG9wZXJhdGlvbnMuJyxcbiAgICAgICAgICAgICAgICBpbnB1dFNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW51bTogWydyZWZyZXNoJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdBY3Rpb246IFwicmVmcmVzaFwiID0gcmVmcmVzaCByZWZlcmVuY2UgaW1hZ2UgZGlzcGxheSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsnYWN0aW9uJ11cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgYXN5bmMgZXhlY3V0ZSh0b29sTmFtZTogc3RyaW5nLCBhcmdzOiBhbnkpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICBzd2l0Y2ggKHRvb2xOYW1lKSB7XG4gICAgICAgICAgICBjYXNlICdyZWZlcmVuY2VfaW1hZ2VfbWFuYWdlbWVudCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuaGFuZGxlSW1hZ2VNYW5hZ2VtZW50KGFyZ3MpO1xuICAgICAgICAgICAgY2FzZSAncmVmZXJlbmNlX2ltYWdlX3F1ZXJ5JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5oYW5kbGVJbWFnZVF1ZXJ5KGFyZ3MpO1xuICAgICAgICAgICAgY2FzZSAncmVmZXJlbmNlX2ltYWdlX3RyYW5zZm9ybSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuaGFuZGxlSW1hZ2VUcmFuc2Zvcm0oYXJncyk7XG4gICAgICAgICAgICBjYXNlICdyZWZlcmVuY2VfaW1hZ2VfZGlzcGxheSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuaGFuZGxlSW1hZ2VEaXNwbGF5KGFyZ3MpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAvLyBMZWdhY3kgdG9vbCBzdXBwb3J0IGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuaGFuZGxlTGVnYWN5VG9vbHModG9vbE5hbWUsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBhZGRSZWZlcmVuY2VJbWFnZShwYXRoczogc3RyaW5nW10pOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIC8vIOmqjOivgei3r+W+hOagvOW8j1xuICAgICAgICAgICAgY29uc3QgaW52YWxpZFBhdGhzID0gcGF0aHMuZmlsdGVyKHBhdGggPT4gIXBhdGggfHwgdHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKTtcbiAgICAgICAgICAgIGlmIChpbnZhbGlkUGF0aHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoeyBcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsIFxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogYEludmFsaWQgcGF0aHMgcHJvdmlkZWQ6ICR7aW52YWxpZFBhdGhzLmpvaW4oJywgJyl9YCBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3JlZmVyZW5jZS1pbWFnZScsICdhZGQtaW1hZ2UnLCBwYXRocykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZGVkUGF0aHM6IHBhdGhzLFxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IHBhdGhzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBBZGRlZCAke3BhdGhzLmxlbmd0aH0gcmVmZXJlbmNlIGltYWdlKHMpYFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyOiBFcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOWinuW8uumUmeivr+S/oeaBr1xuICAgICAgICAgICAgICAgIGxldCBlcnJvck1lc3NhZ2UgPSBlcnIubWVzc2FnZTtcbiAgICAgICAgICAgICAgICBpZiAoZXJyLm1lc3NhZ2UuaW5jbHVkZXMoJ25vdCBmb3VuZCcpIHx8IGVyci5tZXNzYWdlLmluY2x1ZGVzKCdub3QgZXhpc3QnKSkge1xuICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSBgSW1hZ2UgZmlsZSBub3QgZm91bmQ6ICR7cGF0aHMuam9pbignLCAnKX0uIFBsZWFzZSBjaGVjayBpZiB0aGUgZmlsZSBleGlzdHMgYW5kIHRoZSBwYXRoIGlzIGNvcnJlY3QuYDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVyci5tZXNzYWdlLmluY2x1ZGVzKCdwZXJtaXNzaW9uJykpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gYFBlcm1pc3Npb24gZGVuaWVkIGFjY2Vzc2luZyBpbWFnZSBmaWxlczogJHtwYXRocy5qb2luKCcsICcpfS4gUGxlYXNlIGNoZWNrIGZpbGUgcGVybWlzc2lvbnMuYDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVyci5tZXNzYWdlLmluY2x1ZGVzKCdmb3JtYXQnKSkge1xuICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSBgVW5zdXBwb3J0ZWQgaW1hZ2UgZm9ybWF0OiAke3BhdGhzLmpvaW4oJywgJyl9LiBQbGVhc2UgdXNlIHN1cHBvcnRlZCBmb3JtYXRzIChQTkcsIEpQRywgSlBFRykuYDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7IFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSwgXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvck1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhaWxlZFBhdGhzOiBwYXRocyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb246ICdQbGVhc2UgdmVyaWZ5IHRoZSBpbWFnZSBwYXRocyBhbmQgZmlsZSBleGlzdGVuY2UuJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyByZW1vdmVSZWZlcmVuY2VJbWFnZShwYXRocz86IHN0cmluZ1tdKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdyZWZlcmVuY2UtaW1hZ2UnLCAncmVtb3ZlLWltYWdlJywgcGF0aHMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBwYXRocyAmJiBwYXRocy5sZW5ndGggPiAwID8gXG4gICAgICAgICAgICAgICAgICAgIGBSZW1vdmVkICR7cGF0aHMubGVuZ3RofSByZWZlcmVuY2UgaW1hZ2UocylgIDogXG4gICAgICAgICAgICAgICAgICAgICdSZW1vdmVkIGN1cnJlbnQgcmVmZXJlbmNlIGltYWdlJztcbiAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkuY2F0Y2goKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnIubWVzc2FnZSB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHN3aXRjaFJlZmVyZW5jZUltYWdlKHBhdGg6IHN0cmluZywgc2NlbmVVVUlEPzogc3RyaW5nKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICAvLyDpqozor4Hot6/lvoTmoLzlvI9cbiAgICAgICAgICAgIGlmICghcGF0aCB8fCB0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHsgXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLCBcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6ICdJbnZhbGlkIGltYWdlIHBhdGggcHJvdmlkZWQuIFBsZWFzZSBwcm92aWRlIGEgdmFsaWQgZmlsZSBwYXRoLicgXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBhcmdzID0gc2NlbmVVVUlEID8gW3BhdGgsIHNjZW5lVVVJRF0gOiBbcGF0aF07XG4gICAgICAgICAgICBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdyZWZlcmVuY2UtaW1hZ2UnLCAnc3dpdGNoLWltYWdlJywgLi4uYXJncykudGhlbigocmVzdWx0OiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAvLyDmo4Dmn6XmmK/lkKbmnInorablkYrkv6Hmga9cbiAgICAgICAgICAgICAgICBjb25zdCBoYXNXYXJuaW5nID0gcmVzdWx0ICYmIChyZXN1bHQud2FybmluZyB8fCByZXN1bHQubWVzc2FnZT8uaW5jbHVkZXMoJ2JsYW5rJykgfHwgcmVzdWx0Lm1lc3NhZ2U/LmluY2x1ZGVzKCdub3QgZm91bmQnKSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IHBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2VuZVVVSUQ6IHNjZW5lVVVJRCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBTd2l0Y2hlZCB0byByZWZlcmVuY2UgaW1hZ2U6ICR7cGF0aH1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2FybmluZzogaGFzV2FybmluZyA/ICdJbWFnZSBtYXkgYmUgYmxhbmsgb3Igbm90IGZvdW5kLiBQbGVhc2UgdmVyaWZ5IHRoZSBpbWFnZSBmaWxlIGV4aXN0cy4nIDogdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHdhcm5pbmc6IGhhc1dhcm5pbmcgPyAnSW1hZ2UgbWF5IGJlIGJsYW5rIG9yIG5vdCBmb3VuZC4gUGxlYXNlIHZlcmlmeSB0aGUgaW1hZ2UgZmlsZSBleGlzdHMuJyA6IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkuY2F0Y2goKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgZXJyb3JNZXNzYWdlID0gZXJyLm1lc3NhZ2U7XG4gICAgICAgICAgICAgICAgaWYgKGVyci5tZXNzYWdlLmluY2x1ZGVzKCdub3QgZm91bmQnKSB8fCBlcnIubWVzc2FnZS5pbmNsdWRlcygnbm90IGV4aXN0JykpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gYEltYWdlIGZpbGUgbm90IGZvdW5kOiAke3BhdGh9LiBQbGVhc2UgY2hlY2sgaWYgdGhlIGZpbGUgZXhpc3RzIGFuZCB0aGUgcGF0aCBpcyBjb3JyZWN0LmA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlcnIubWVzc2FnZS5pbmNsdWRlcygncGVybWlzc2lvbicpKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9IGBQZXJtaXNzaW9uIGRlbmllZCBhY2Nlc3NpbmcgaW1hZ2UgZmlsZTogJHtwYXRofS4gUGxlYXNlIGNoZWNrIGZpbGUgcGVybWlzc2lvbnMuYDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVyci5tZXNzYWdlLmluY2x1ZGVzKCdmb3JtYXQnKSkge1xuICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSBgVW5zdXBwb3J0ZWQgaW1hZ2UgZm9ybWF0OiAke3BhdGh9LiBQbGVhc2UgdXNlIHN1cHBvcnRlZCBmb3JtYXRzIChQTkcsIEpQRywgSlBFRykuYDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7IFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSwgXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvck1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhaWxlZFBhdGg6IHBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWdnZXN0aW9uOiAnUGxlYXNlIHZlcmlmeSB0aGUgaW1hZ2UgcGF0aCBhbmQgZmlsZSBleGlzdGVuY2UuJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBzZXRSZWZlcmVuY2VJbWFnZURhdGEoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3JlZmVyZW5jZS1pbWFnZScsICdzZXQtaW1hZ2UtZGF0YScsIGtleSwgdmFsdWUpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBSZWZlcmVuY2UgaW1hZ2UgJHtrZXl9IHNldCB0byAke3ZhbHVlfWBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkuY2F0Y2goKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnIubWVzc2FnZSB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHF1ZXJ5UmVmZXJlbmNlSW1hZ2VDb25maWcoKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdyZWZlcmVuY2UtaW1hZ2UnLCAncXVlcnktY29uZmlnJykudGhlbigoY29uZmlnOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAvLyDmlbDmja7kuIDoh7TmgKfmo4Dmn6VcbiAgICAgICAgICAgICAgICBjb25zdCBjb25zaXN0ZW5jeUlzc3VlcyA9IHRoaXMuY2hlY2tEYXRhQ29uc2lzdGVuY3koY29uZmlnKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUNvbnNpc3RlbmN5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNzdWVzOiBjb25zaXN0ZW5jeUlzc3VlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYXNJc3N1ZXM6IGNvbnNpc3RlbmN5SXNzdWVzLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgd2FybmluZzogY29uc2lzdGVuY3lJc3N1ZXMubGVuZ3RoID4gMCA/IFxuICAgICAgICAgICAgICAgICAgICAgICAgYERhdGEgY29uc2lzdGVuY3kgaXNzdWVzIGRldGVjdGVkOiAke2NvbnNpc3RlbmN5SXNzdWVzLmpvaW4oJywgJyl9YCA6IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkuY2F0Y2goKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnIubWVzc2FnZSB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNoZWNrRGF0YUNvbnNpc3RlbmN5KGNvbmZpZzogYW55KTogc3RyaW5nW10ge1xuICAgICAgICBjb25zdCBpc3N1ZXM6IHN0cmluZ1tdID0gW107XG4gICAgICAgIFxuICAgICAgICBpZiAoIWNvbmZpZykge1xuICAgICAgICAgICAgaXNzdWVzLnB1c2goJ05vIGNvbmZpZ3VyYXRpb24gZGF0YSBhdmFpbGFibGUnKTtcbiAgICAgICAgICAgIHJldHVybiBpc3N1ZXM7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDmo4Dmn6XphY3nva7kuK3nmoTlm77niYfliJfooahcbiAgICAgICAgaWYgKGNvbmZpZy5pbWFnZXMgJiYgQXJyYXkuaXNBcnJheShjb25maWcuaW1hZ2VzKSkge1xuICAgICAgICAgICAgY29uc3QgZGVsZXRlZEltYWdlcyA9IGNvbmZpZy5pbWFnZXMuZmlsdGVyKChpbWc6IGFueSkgPT4gXG4gICAgICAgICAgICAgICAgaW1nLnBhdGggJiYgKGltZy5wYXRoLmluY2x1ZGVzKCdkZWxldGVkJykgfHwgaW1nLnBhdGguaW5jbHVkZXMoJ25vbmV4aXN0ZW50JykpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoZGVsZXRlZEltYWdlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgaXNzdWVzLnB1c2goYEZvdW5kICR7ZGVsZXRlZEltYWdlcy5sZW5ndGh9IGRlbGV0ZWQvbm9uZXhpc3RlbnQgaW1hZ2VzIGluIGNvbmZpZ3VyYXRpb25gKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5qOA5p+l5b2T5YmN5Zu+54mH5piv5ZCm5Zyo5YiX6KGo5LitXG4gICAgICAgICAgICBpZiAoY29uZmlnLmN1cnJlbnQgJiYgIWNvbmZpZy5pbWFnZXMuZmluZCgoaW1nOiBhbnkpID0+IGltZy5wYXRoID09PSBjb25maWcuY3VycmVudCkpIHtcbiAgICAgICAgICAgICAgICBpc3N1ZXMucHVzaCgnQ3VycmVudCBpbWFnZSBub3QgZm91bmQgaW4gaW1hZ2UgbGlzdCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDmo4Dmn6Xph43lpI3nmoTlm77niYfot6/lvoRcbiAgICAgICAgICAgIGNvbnN0IHBhdGhzID0gY29uZmlnLmltYWdlcy5tYXAoKGltZzogYW55KSA9PiBpbWcucGF0aCkuZmlsdGVyKEJvb2xlYW4pO1xuICAgICAgICAgICAgY29uc3QgdW5pcXVlUGF0aHMgPSBuZXcgU2V0KHBhdGhzKTtcbiAgICAgICAgICAgIGlmIChwYXRocy5sZW5ndGggIT09IHVuaXF1ZVBhdGhzLnNpemUpIHtcbiAgICAgICAgICAgICAgICBpc3N1ZXMucHVzaCgnRHVwbGljYXRlIGltYWdlIHBhdGhzIGZvdW5kIGluIGNvbmZpZ3VyYXRpb24nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOajgOafpeW9k+WJjeWbvueJh+iuvue9rlxuICAgICAgICBpZiAoY29uZmlnLmN1cnJlbnQgJiYgdHlwZW9mIGNvbmZpZy5jdXJyZW50ICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgaXNzdWVzLnB1c2goJ0ludmFsaWQgY3VycmVudCBpbWFnZSBwYXRoIGZvcm1hdCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlzc3VlcztcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHF1ZXJ5Q3VycmVudFJlZmVyZW5jZUltYWdlKCk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgncmVmZXJlbmNlLWltYWdlJywgJ3F1ZXJ5LWN1cnJlbnQnKS50aGVuKChjdXJyZW50OiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogY3VycmVudFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkuY2F0Y2goKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnIubWVzc2FnZSB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHJlZnJlc2hSZWZlcmVuY2VJbWFnZSgpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3JlZmVyZW5jZS1pbWFnZScsICdyZWZyZXNoJykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdSZWZlcmVuY2UgaW1hZ2UgcmVmcmVzaGVkJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkuY2F0Y2goKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnIubWVzc2FnZSB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHNldFJlZmVyZW5jZUltYWdlUG9zaXRpb24oeDogbnVtYmVyLCB5OiBudW1iZXIpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgncmVmZXJlbmNlLWltYWdlJywgJ3NldC1pbWFnZS1kYXRhJywgJ3gnLCB4KTtcbiAgICAgICAgICAgICAgICBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdyZWZlcmVuY2UtaW1hZ2UnLCAnc2V0LWltYWdlLWRhdGEnLCAneScsIHkpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4OiB4LFxuICAgICAgICAgICAgICAgICAgICAgICAgeTogeSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBSZWZlcmVuY2UgaW1hZ2UgcG9zaXRpb24gc2V0IHRvICgke3h9LCAke3l9KWBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnIubWVzc2FnZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBzZXRSZWZlcmVuY2VJbWFnZVNjYWxlKHN4OiBudW1iZXIsIHN5OiBudW1iZXIpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgncmVmZXJlbmNlLWltYWdlJywgJ3NldC1pbWFnZS1kYXRhJywgJ3N4Jywgc3gpO1xuICAgICAgICAgICAgICAgIGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3JlZmVyZW5jZS1pbWFnZScsICdzZXQtaW1hZ2UtZGF0YScsICdzeScsIHN5KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3g6IHN4LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3k6IHN5LFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYFJlZmVyZW5jZSBpbWFnZSBzY2FsZSBzZXQgdG8gKCR7c3h9LCAke3N5fSlgXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyLm1lc3NhZ2UgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgc2V0UmVmZXJlbmNlSW1hZ2VPcGFjaXR5KG9wYWNpdHk6IG51bWJlcik6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgncmVmZXJlbmNlLWltYWdlJywgJ3NldC1pbWFnZS1kYXRhJywgJ29wYWNpdHknLCBvcGFjaXR5KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogb3BhY2l0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBSZWZlcmVuY2UgaW1hZ2Ugb3BhY2l0eSBzZXQgdG8gJHtvcGFjaXR5fWBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkuY2F0Y2goKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnIubWVzc2FnZSB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGxpc3RSZWZlcmVuY2VJbWFnZXMoKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3JlZmVyZW5jZS1pbWFnZScsICdxdWVyeS1jb25maWcnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50ID0gYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgncmVmZXJlbmNlLWltYWdlJywgJ3F1ZXJ5LWN1cnJlbnQnKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50OiBjdXJyZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1JlZmVyZW5jZSBpbWFnZSBpbmZvcm1hdGlvbiByZXRyaWV2ZWQnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyLm1lc3NhZ2UgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgY2xlYXJBbGxSZWZlcmVuY2VJbWFnZXMoKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBhbGwgcmVmZXJlbmNlIGltYWdlcyBieSBjYWxsaW5nIHJlbW92ZS1pbWFnZSB3aXRob3V0IHBhdGhzXG4gICAgICAgICAgICAgICAgYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgncmVmZXJlbmNlLWltYWdlJywgJ3JlbW92ZS1pbWFnZScpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnQWxsIHJlZmVyZW5jZSBpbWFnZXMgY2xlYXJlZCdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyLm1lc3NhZ2UgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIE5ldyBoYW5kbGVyIG1ldGhvZHMgZm9yIG9wdGltaXplZCB0b29sc1xuICAgIHByaXZhdGUgYXN5bmMgaGFuZGxlSW1hZ2VNYW5hZ2VtZW50KGFyZ3M6IGFueSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIGNvbnN0IHsgYWN0aW9uIH0gPSBhcmdzO1xuICAgICAgICBcbiAgICAgICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgICAgICAgIGNhc2UgJ2FkZCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuYWRkUmVmZXJlbmNlSW1hZ2UoYXJncy5wYXRocyk7XG4gICAgICAgICAgICBjYXNlICdyZW1vdmUnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnJlbW92ZVJlZmVyZW5jZUltYWdlKGFyZ3MucmVtb3ZlUGF0aHMpO1xuICAgICAgICAgICAgY2FzZSAnc3dpdGNoJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5zd2l0Y2hSZWZlcmVuY2VJbWFnZShhcmdzLnBhdGgsIGFyZ3Muc2NlbmVVVUlEKTtcbiAgICAgICAgICAgIGNhc2UgJ2NsZWFyX2FsbCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuY2xlYXJBbGxSZWZlcmVuY2VJbWFnZXMoKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBgVW5rbm93biBpbWFnZSBtYW5hZ2VtZW50IGFjdGlvbjogJHthY3Rpb259YCB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBoYW5kbGVJbWFnZVF1ZXJ5KGFyZ3M6IGFueSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIGNvbnN0IHsgYWN0aW9uIH0gPSBhcmdzO1xuICAgICAgICBcbiAgICAgICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgICAgICAgIGNhc2UgJ2dldF9jb25maWcnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnF1ZXJ5UmVmZXJlbmNlSW1hZ2VDb25maWcoKTtcbiAgICAgICAgICAgIGNhc2UgJ2dldF9jdXJyZW50JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5xdWVyeUN1cnJlbnRSZWZlcmVuY2VJbWFnZSgpO1xuICAgICAgICAgICAgY2FzZSAnbGlzdF9hbGwnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmxpc3RSZWZlcmVuY2VJbWFnZXMoKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBgVW5rbm93biBpbWFnZSBxdWVyeSBhY3Rpb246ICR7YWN0aW9ufWAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgaGFuZGxlSW1hZ2VUcmFuc2Zvcm0oYXJnczogYW55KTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgY29uc3QgeyBhY3Rpb24gfSA9IGFyZ3M7XG4gICAgICAgIFxuICAgICAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgICAgICAgY2FzZSAnc2V0X3Bvc2l0aW9uJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5zZXRSZWZlcmVuY2VJbWFnZVBvc2l0aW9uKGFyZ3MueCwgYXJncy55KTtcbiAgICAgICAgICAgIGNhc2UgJ3NldF9zY2FsZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuc2V0UmVmZXJlbmNlSW1hZ2VTY2FsZShhcmdzLnN4LCBhcmdzLnN5KTtcbiAgICAgICAgICAgIGNhc2UgJ3NldF9vcGFjaXR5JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5zZXRSZWZlcmVuY2VJbWFnZU9wYWNpdHkoYXJncy5vcGFjaXR5KTtcbiAgICAgICAgICAgIGNhc2UgJ3NldF9kYXRhJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5zZXRSZWZlcmVuY2VJbWFnZURhdGEoYXJncy5rZXksIGFyZ3MudmFsdWUpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGBVbmtub3duIGltYWdlIHRyYW5zZm9ybSBhY3Rpb246ICR7YWN0aW9ufWAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgaGFuZGxlSW1hZ2VEaXNwbGF5KGFyZ3M6IGFueSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIGNvbnN0IHsgYWN0aW9uIH0gPSBhcmdzO1xuICAgICAgICBcbiAgICAgICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgICAgICAgIGNhc2UgJ3JlZnJlc2gnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnJlZnJlc2hSZWZlcmVuY2VJbWFnZSgpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGBVbmtub3duIGltYWdlIGRpc3BsYXkgYWN0aW9uOiAke2FjdGlvbn1gIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBMZWdhY3kgdG9vbCBzdXBwb3J0IGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG4gICAgcHJpdmF0ZSBhc3luYyBoYW5kbGVMZWdhY3lUb29scyh0b29sTmFtZTogc3RyaW5nLCBhcmdzOiBhbnkpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICBzd2l0Y2ggKHRvb2xOYW1lKSB7XG4gICAgICAgICAgICBjYXNlICdhZGRfcmVmZXJlbmNlX2ltYWdlJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5hZGRSZWZlcmVuY2VJbWFnZShhcmdzLnBhdGhzKTtcbiAgICAgICAgICAgIGNhc2UgJ3JlbW92ZV9yZWZlcmVuY2VfaW1hZ2UnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnJlbW92ZVJlZmVyZW5jZUltYWdlKGFyZ3MucGF0aHMpO1xuICAgICAgICAgICAgY2FzZSAnc3dpdGNoX3JlZmVyZW5jZV9pbWFnZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuc3dpdGNoUmVmZXJlbmNlSW1hZ2UoYXJncy5wYXRoLCBhcmdzLnNjZW5lVVVJRCk7XG4gICAgICAgICAgICBjYXNlICdzZXRfcmVmZXJlbmNlX2ltYWdlX2RhdGEnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnNldFJlZmVyZW5jZUltYWdlRGF0YShhcmdzLmtleSwgYXJncy52YWx1ZSk7XG4gICAgICAgICAgICBjYXNlICdxdWVyeV9yZWZlcmVuY2VfaW1hZ2VfY29uZmlnJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5xdWVyeVJlZmVyZW5jZUltYWdlQ29uZmlnKCk7XG4gICAgICAgICAgICBjYXNlICdxdWVyeV9jdXJyZW50X3JlZmVyZW5jZV9pbWFnZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMucXVlcnlDdXJyZW50UmVmZXJlbmNlSW1hZ2UoKTtcbiAgICAgICAgICAgIGNhc2UgJ3JlZnJlc2hfcmVmZXJlbmNlX2ltYWdlJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5yZWZyZXNoUmVmZXJlbmNlSW1hZ2UoKTtcbiAgICAgICAgICAgIGNhc2UgJ3NldF9yZWZlcmVuY2VfaW1hZ2VfcG9zaXRpb24nOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnNldFJlZmVyZW5jZUltYWdlUG9zaXRpb24oYXJncy54LCBhcmdzLnkpO1xuICAgICAgICAgICAgY2FzZSAnc2V0X3JlZmVyZW5jZV9pbWFnZV9zY2FsZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuc2V0UmVmZXJlbmNlSW1hZ2VTY2FsZShhcmdzLnN4LCBhcmdzLnN5KTtcbiAgICAgICAgICAgIGNhc2UgJ3NldF9yZWZlcmVuY2VfaW1hZ2Vfb3BhY2l0eSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuc2V0UmVmZXJlbmNlSW1hZ2VPcGFjaXR5KGFyZ3Mub3BhY2l0eSk7XG4gICAgICAgICAgICBjYXNlICdsaXN0X3JlZmVyZW5jZV9pbWFnZXMnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmxpc3RSZWZlcmVuY2VJbWFnZXMoKTtcbiAgICAgICAgICAgIGNhc2UgJ2NsZWFyX2FsbF9yZWZlcmVuY2VfaW1hZ2VzJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5jbGVhckFsbFJlZmVyZW5jZUltYWdlcygpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGBVbmtub3duIHRvb2w6ICR7dG9vbE5hbWV9YCB9O1xuICAgICAgICB9XG4gICAgfVxufSJdfQ==