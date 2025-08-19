"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreferencesTools = void 0;
class PreferencesTools {
    getTools() {
        return [
            {
                name: 'preferences_manage',
                description: 'PREFERENCES MANAGEMENT: Open preferences panel, get/set configuration values, and reset preferences. Use this for all preference configuration operations.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['open_panel', 'get_config', 'set_config', 'reset_config'],
                            description: 'Action: "open_panel" = open preferences settings panel | "get_config" = query preference values | "set_config" = update preference values | "reset_config" = reset to defaults'
                        },
                        // For open_panel action
                        tab: {
                            type: 'string',
                            enum: ['general', 'external-tools', 'data-editor', 'laboratory', 'extensions', 'preview', 'console', 'native', 'builder'],
                            description: 'Preferences tab to open (open_panel action only). Choose from available tabs in Cocos Creator preferences.'
                        },
                        // For get_config/set_config/reset_config actions
                        category: {
                            type: 'string',
                            enum: ['general', 'external-tools', 'data-editor', 'laboratory', 'extensions', 'preview', 'console', 'native', 'builder'],
                            description: 'Preference category name (get_config/set_config/reset_config actions)',
                            default: 'general'
                        },
                        path: {
                            type: 'string',
                            description: 'Configuration path within category (get_config/set_config actions only). Use dot notation for nested properties (e.g., "editor.fontSize")'
                        },
                        value: {
                            description: 'New configuration value to set (set_config action only). Can be string, number, boolean, or object.'
                        },
                        scope: {
                            type: 'string',
                            enum: ['global', 'local', 'default'],
                            description: 'Configuration scope: "global" = system-wide settings | "local" = project-specific settings | "default" = factory defaults',
                            default: 'global'
                        }
                    },
                    required: ['action'],
                    anyOf: [
                        {
                            properties: { action: { const: 'open_panel' } }
                        },
                        {
                            properties: { action: { const: 'get_config' } },
                            required: ['category']
                        },
                        {
                            properties: { action: { const: 'set_config' } },
                            required: ['category', 'path', 'value']
                        },
                        {
                            properties: { action: { const: 'reset_config' } },
                            required: ['category']
                        }
                    ]
                }
            },
            {
                name: 'preferences_query',
                description: 'PREFERENCES QUERY: Get all available preferences, list categories, or search for specific preference settings. Use this for preference discovery and inspection.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['get_all', 'list_categories', 'search_settings'],
                            description: 'Query action: "get_all" = retrieve all preference configurations | "list_categories" = get available preference categories | "search_settings" = find settings by keyword'
                        },
                        // For get_all action
                        scope: {
                            type: 'string',
                            enum: ['global', 'local', 'default'],
                            description: 'Configuration scope to query (get_all action only)',
                            default: 'global'
                        },
                        categories: {
                            type: 'array',
                            items: {
                                type: 'string',
                                enum: ['general', 'external-tools', 'data-editor', 'laboratory', 'extensions', 'preview', 'console', 'native', 'builder']
                            },
                            description: 'Specific categories to include (get_all action only). If not specified, all categories are included.'
                        },
                        // For search_settings action
                        keyword: {
                            type: 'string',
                            description: 'Search keyword for finding settings (search_settings action only)'
                        },
                        includeValues: {
                            type: 'boolean',
                            description: 'Include current values in search results (search_settings action only)',
                            default: true
                        }
                    },
                    required: ['action'],
                    anyOf: [
                        {
                            properties: { action: { const: 'get_all' } }
                        },
                        {
                            properties: { action: { const: 'list_categories' } }
                        },
                        {
                            properties: { action: { const: 'search_settings' } },
                            required: ['keyword']
                        }
                    ]
                }
            },
            {
                name: 'preferences_backup',
                description: 'PREFERENCES BACKUP: Export current preferences to JSON format or prepare for backup operations. Use this for preference backup and restore workflows.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['export', 'validate_backup'],
                            description: 'Backup action: "export" = export preferences to JSON | "validate_backup" = check backup file format'
                        },
                        // For export action
                        categories: {
                            type: 'array',
                            items: {
                                type: 'string',
                                enum: ['general', 'external-tools', 'data-editor', 'laboratory', 'extensions', 'preview', 'console', 'native', 'builder']
                            },
                            description: 'Categories to export (export action only). If not specified, all categories are exported.'
                        },
                        scope: {
                            type: 'string',
                            enum: ['global', 'local'],
                            description: 'Configuration scope to export (export action only)',
                            default: 'global'
                        },
                        includeDefaults: {
                            type: 'boolean',
                            description: 'Include default values in export (export action only)',
                            default: false
                        },
                        // For validate_backup action
                        backupData: {
                            type: 'object',
                            description: 'Backup data to validate (validate_backup action only)'
                        }
                    },
                    required: ['action'],
                    anyOf: [
                        {
                            properties: { action: { const: 'export' } }
                        },
                        {
                            properties: { action: { const: 'validate_backup' } },
                            required: ['backupData']
                        }
                    ]
                }
            }
        ];
    }
    async execute(toolName, args) {
        switch (toolName) {
            case 'preferences_manage':
                return await this.handlePreferencesManage(args);
            case 'preferences_query':
                return await this.handlePreferencesQuery(args);
            case 'preferences_backup':
                return await this.handlePreferencesBackup(args);
            default:
                throw new Error(`Unknown tool: ${toolName}`);
        }
    }
    // New consolidated handlers
    async handlePreferencesManage(args) {
        const { action } = args;
        switch (action) {
            case 'open_panel':
                return await this.openPreferencesPanel(args.tab);
            case 'get_config':
                return await this.getPreferencesConfig(args.category, args.path, args.scope);
            case 'set_config':
                return await this.setPreferencesConfig(args.category, args.path, args.value, args.scope);
            case 'reset_config':
                return await this.resetPreferencesConfig(args.category, args.scope);
            default:
                return { success: false, error: `Unknown preferences manage action: ${action}` };
        }
    }
    async handlePreferencesQuery(args) {
        const { action } = args;
        switch (action) {
            case 'get_all':
                return await this.getAllPreferences(args.scope, args.categories);
            case 'list_categories':
                return await this.listPreferencesCategories();
            case 'search_settings':
                return await this.searchPreferencesSettings(args.keyword, args.includeValues);
            default:
                return { success: false, error: `Unknown preferences query action: ${action}` };
        }
    }
    async handlePreferencesBackup(args) {
        const { action } = args;
        switch (action) {
            case 'export':
                return await this.exportPreferences(args.categories, args.scope, args.includeDefaults);
            case 'validate_backup':
                return await this.validateBackupData(args.backupData);
            default:
                return { success: false, error: `Unknown preferences backup action: ${action}` };
        }
    }
    // Implementation methods
    async openPreferencesPanel(tab) {
        return new Promise((resolve) => {
            const requestArgs = tab ? [tab] : [];
            Editor.Message.request('preferences', 'open-settings', ...requestArgs).then(() => {
                resolve({
                    success: true,
                    message: `✅ Preferences panel opened${tab ? ` on "${tab}" tab` : ''}`,
                    data: { tab: tab || 'general' }
                });
            }).catch((err) => {
                resolve({ success: false, error: `Failed to open preferences panel: ${err.message}` });
            });
        });
    }
    async getPreferencesConfig(category, path, scope = 'global') {
        return new Promise((resolve) => {
            // Validate category parameter
            if (!category || typeof category !== 'string' || category.trim().length === 0) {
                resolve({
                    success: false,
                    error: 'Category is required and must be a non-empty string'
                });
                return;
            }
            const trimmedCategory = category.trim();
            const requestArgs = [trimmedCategory];
            if (path && typeof path === 'string' && path.trim().length > 0) {
                requestArgs.push(path.trim());
            }
            requestArgs.push(scope);
            Editor.Message.request('preferences', 'query-config', ...requestArgs).then((config) => {
                resolve({
                    success: true,
                    message: `✅ Configuration retrieved for ${trimmedCategory}${path ? `.${path.trim()}` : ''}`,
                    data: {
                        category: trimmedCategory,
                        path: path ? path.trim() : undefined,
                        scope,
                        config
                    }
                });
            }).catch((err) => {
                resolve({ success: false, error: `Failed to get preference config: ${err.message}` });
            });
        });
    }
    async setPreferencesConfig(category, path, value, scope = 'global') {
        return new Promise((resolve) => {
            // Validate required parameters
            if (!category || typeof category !== 'string' || category.trim().length === 0) {
                resolve({
                    success: false,
                    error: 'Category is required and must be a non-empty string'
                });
                return;
            }
            if (!path || typeof path !== 'string' || path.trim().length === 0) {
                resolve({
                    success: false,
                    error: 'Path is required and must be a non-empty string'
                });
                return;
            }
            if (value === undefined) {
                resolve({
                    success: false,
                    error: 'Value is required and cannot be undefined'
                });
                return;
            }
            const trimmedCategory = category.trim();
            const trimmedPath = path.trim();
            Editor.Message.request('preferences', 'set-config', trimmedCategory, trimmedPath, value, scope).then((success) => {
                if (success) {
                    resolve({
                        success: true,
                        message: `✅ Preference "${trimmedCategory}.${trimmedPath}" updated successfully`,
                        data: {
                            category: trimmedCategory,
                            path: trimmedPath,
                            value,
                            scope
                        }
                    });
                }
                else {
                    resolve({
                        success: false,
                        error: `Failed to update preference "${trimmedCategory}.${trimmedPath}". Value may be invalid or read-only.`
                    });
                }
            }).catch((err) => {
                resolve({ success: false, error: `Error setting preference: ${err.message}` });
            });
        });
    }
    async resetPreferencesConfig(category, scope = 'global') {
        return new Promise((resolve) => {
            // Validate category parameter
            if (!category || typeof category !== 'string' || category.trim().length === 0) {
                resolve({
                    success: false,
                    error: 'Category is required and must be a non-empty string'
                });
                return;
            }
            const trimmedCategory = category.trim();
            // Get default configuration first
            Editor.Message.request('preferences', 'query-config', trimmedCategory, undefined, 'default').then((defaultConfig) => {
                if (!defaultConfig) {
                    throw new Error(`No default configuration found for category "${trimmedCategory}"`);
                }
                // Apply default configuration
                return Editor.Message.request('preferences', 'set-config', trimmedCategory, '', defaultConfig, scope);
            }).then((success) => {
                if (success) {
                    resolve({
                        success: true,
                        message: `✅ Preference category "${trimmedCategory}" reset to defaults`,
                        data: {
                            category: trimmedCategory,
                            scope,
                            action: 'reset'
                        }
                    });
                }
                else {
                    resolve({
                        success: false,
                        error: `Failed to reset preference category "${trimmedCategory}". Category may not support reset operation.`
                    });
                }
            }).catch((err) => {
                resolve({ success: false, error: `Error resetting preferences: ${err.message}` });
            });
        });
    }
    async getAllPreferences(scope = 'global', categories) {
        return new Promise((resolve) => {
            const availableCategories = [
                'general',
                'external-tools',
                'data-editor',
                'laboratory',
                'extensions',
                'preview',
                'console',
                'native',
                'builder'
            ];
            // Use specified categories or all available ones
            const categoriesToQuery = categories || availableCategories;
            const preferences = {};
            const queryPromises = categoriesToQuery.map(category => {
                return Editor.Message.request('preferences', 'query-config', category, undefined, scope)
                    .then((config) => {
                    preferences[category] = config;
                })
                    .catch(() => {
                    // Category doesn't exist or access denied
                    preferences[category] = null;
                });
            });
            Promise.all(queryPromises).then(() => {
                // Filter out null entries
                const validPreferences = Object.fromEntries(Object.entries(preferences).filter(([_, value]) => value !== null));
                resolve({
                    success: true,
                    message: `✅ Retrieved preferences for ${Object.keys(validPreferences).length} categories`,
                    data: {
                        scope,
                        requestedCategories: categoriesToQuery,
                        availableCategories: Object.keys(validPreferences),
                        preferences: validPreferences,
                        summary: {
                            totalCategories: Object.keys(validPreferences).length,
                            scope: scope
                        }
                    }
                });
            }).catch((err) => {
                resolve({ success: false, error: `Error retrieving preferences: ${err.message}` });
            });
        });
    }
    async listPreferencesCategories() {
        return new Promise((resolve) => {
            const categories = [
                { name: 'general', description: 'General editor settings and UI preferences' },
                { name: 'external-tools', description: 'External tool integrations and paths' },
                { name: 'data-editor', description: 'Data editor configurations and templates' },
                { name: 'laboratory', description: 'Experimental features and beta functionality' },
                { name: 'extensions', description: 'Extension manager and plugin settings' },
                { name: 'preview', description: 'Game preview and simulator settings' },
                { name: 'console', description: 'Console panel display and logging options' },
                { name: 'native', description: 'Native platform build configurations' },
                { name: 'builder', description: 'Build system and compilation settings' }
            ];
            resolve({
                success: true,
                message: `✅ Listed ${categories.length} available preference categories`,
                data: {
                    categories,
                    totalCount: categories.length,
                    usage: 'Use these category names with preferences_manage or preferences_query tools'
                }
            });
        });
    }
    async searchPreferencesSettings(keyword, includeValues = true) {
        return new Promise(async (resolve) => {
            var _a;
            try {
                // Validate keyword parameter
                if (!keyword || typeof keyword !== 'string' || keyword.trim().length === 0) {
                    resolve({
                        success: false,
                        error: 'Search keyword is required and must be a non-empty string'
                    });
                    return;
                }
                const trimmedKeyword = keyword.trim();
                const allPrefsResponse = await this.getAllPreferences('global');
                if (!allPrefsResponse.success) {
                    resolve(allPrefsResponse);
                    return;
                }
                const preferences = ((_a = allPrefsResponse.data) === null || _a === void 0 ? void 0 : _a.preferences) || {};
                const searchResults = [];
                // Search through all categories and their settings
                for (const [category, config] of Object.entries(preferences)) {
                    if (config && typeof config === 'object') {
                        this.searchInObject(config, trimmedKeyword, category, '', searchResults, includeValues);
                    }
                }
                resolve({
                    success: true,
                    message: `✅ Found ${searchResults.length} settings matching "${trimmedKeyword}"`,
                    data: {
                        keyword: trimmedKeyword,
                        includeValues,
                        resultCount: searchResults.length,
                        results: searchResults.slice(0, 50), // Limit results to prevent overwhelming output
                        hasMoreResults: searchResults.length > 50
                    }
                });
            }
            catch (error) {
                resolve({
                    success: false,
                    error: `Search failed: ${error.message}`
                });
            }
        });
    }
    searchInObject(obj, keyword, category, pathPrefix, results, includeValues) {
        if (!obj || typeof obj !== 'object' || !keyword || typeof keyword !== 'string') {
            return;
        }
        const lowerKeyword = keyword.toLowerCase();
        try {
            for (const [key, value] of Object.entries(obj)) {
                if (typeof key !== 'string')
                    continue;
                const currentPath = pathPrefix ? `${pathPrefix}.${key}` : key;
                const keyMatches = key.toLowerCase().includes(lowerKeyword);
                const valueMatches = typeof value === 'string' && value.toLowerCase().includes(lowerKeyword);
                if (keyMatches || valueMatches) {
                    const result = {
                        category,
                        path: currentPath,
                        key,
                        matchType: keyMatches ? (valueMatches ? 'both' : 'key') : 'value'
                    };
                    if (includeValues) {
                        result.value = value;
                        result.valueType = typeof value;
                    }
                    results.push(result);
                }
                // Recursively search nested objects (with depth limit to prevent infinite recursion)
                if (value && typeof value === 'object' && !Array.isArray(value) && pathPrefix.split('.').length < 10) {
                    this.searchInObject(value, keyword, category, currentPath, results, includeValues);
                }
            }
        }
        catch (error) {
            // Skip objects that can't be enumerated
        }
    }
    async exportPreferences(categories, scope = 'global', includeDefaults = false) {
        return new Promise(async (resolve) => {
            var _a, _b, _c, _d;
            try {
                // Validate scope parameter
                const validScopes = ['global', 'local'];
                if (!validScopes.includes(scope)) {
                    resolve({
                        success: false,
                        error: `Invalid scope "${scope}". Must be one of: ${validScopes.join(', ')}`
                    });
                    return;
                }
                // Validate categories parameter if provided
                if (categories) {
                    if (!Array.isArray(categories)) {
                        resolve({
                            success: false,
                            error: 'Categories must be an array'
                        });
                        return;
                    }
                    const validCategories = ['general', 'external-tools', 'data-editor', 'laboratory', 'extensions', 'preview', 'console', 'native', 'builder'];
                    const invalidCategories = categories.filter(cat => !validCategories.includes(cat));
                    if (invalidCategories.length > 0) {
                        resolve({
                            success: false,
                            error: `Invalid categories: ${invalidCategories.join(', ')}. Valid categories are: ${validCategories.join(', ')}`
                        });
                        return;
                    }
                }
                const allPrefsResponse = await this.getAllPreferences(scope, categories);
                if (!allPrefsResponse.success) {
                    resolve(allPrefsResponse);
                    return;
                }
                const exportData = {
                    metadata: {
                        exportDate: new Date().toISOString(),
                        scope: scope,
                        includeDefaults: includeDefaults,
                        cocosVersion: ((_a = Editor.versions) === null || _a === void 0 ? void 0 : _a.cocos) || 'Unknown',
                        exportedCategories: Object.keys(((_b = allPrefsResponse.data) === null || _b === void 0 ? void 0 : _b.preferences) || {}),
                        requestedCategories: categories || 'all'
                    },
                    preferences: ((_c = allPrefsResponse.data) === null || _c === void 0 ? void 0 : _c.preferences) || {}
                };
                // Include defaults if requested
                if (includeDefaults) {
                    try {
                        const defaultsResponse = await this.getAllPreferences('default', categories);
                        if (defaultsResponse.success) {
                            exportData.defaults = ((_d = defaultsResponse.data) === null || _d === void 0 ? void 0 : _d.preferences) || {};
                        }
                        else {
                            exportData.metadata.defaultsWarning = 'Could not retrieve default preferences';
                        }
                    }
                    catch (error) {
                        exportData.metadata.defaultsWarning = 'Error retrieving default preferences';
                    }
                }
                const jsonData = JSON.stringify(exportData, null, 2);
                const exportPath = `cocos_preferences_${scope}_${Date.now()}.json`;
                resolve({
                    success: true,
                    message: `✅ Preferences exported for ${exportData.metadata.exportedCategories.length} categories`,
                    data: {
                        exportPath,
                        metadata: exportData.metadata,
                        preferences: exportData.preferences,
                        jsonData,
                        fileSize: Buffer.byteLength(jsonData, 'utf8'),
                        summary: {
                            totalCategories: exportData.metadata.exportedCategories.length,
                            scope: scope,
                            includeDefaults: includeDefaults,
                            hasDefaults: !!exportData.defaults
                        }
                    }
                });
            }
            catch (error) {
                resolve({
                    success: false,
                    error: `Export failed: ${error.message}`
                });
            }
        });
    }
    async validateBackupData(backupData) {
        return new Promise((resolve) => {
            try {
                const validation = {
                    isValid: true,
                    errors: [],
                    warnings: [],
                    metadata: null
                };
                // Check if backupData is provided
                if (backupData === undefined || backupData === null) {
                    validation.isValid = false;
                    validation.errors.push('Backup data is required and cannot be null or undefined');
                    resolve({
                        success: false,
                        error: 'Backup data is required for validation'
                    });
                    return;
                }
                // Check basic structure
                if (typeof backupData !== 'object' || Array.isArray(backupData)) {
                    validation.isValid = false;
                    validation.errors.push('Backup data must be a valid object (not array or primitive type)');
                }
                else {
                    // Check for metadata
                    if (backupData.metadata) {
                        if (typeof backupData.metadata !== 'object') {
                            validation.errors.push('Metadata must be an object');
                            validation.isValid = false;
                        }
                        else {
                            validation.metadata = backupData.metadata;
                            if (!backupData.metadata.exportDate) {
                                validation.warnings.push('Missing export date in metadata');
                            }
                            else if (typeof backupData.metadata.exportDate !== 'string') {
                                validation.warnings.push('Export date should be a string');
                            }
                            if (!backupData.metadata.scope) {
                                validation.warnings.push('Missing scope information in metadata');
                            }
                            else if (!['global', 'local', 'default'].includes(backupData.metadata.scope)) {
                                validation.warnings.push('Invalid scope value in metadata');
                            }
                            if (backupData.metadata.cocosVersion && typeof backupData.metadata.cocosVersion !== 'string') {
                                validation.warnings.push('Cocos version should be a string');
                            }
                        }
                    }
                    else {
                        validation.warnings.push('No metadata found in backup file');
                    }
                    // Check for preferences data
                    if (!backupData.preferences) {
                        validation.errors.push('No preferences data found in backup');
                        validation.isValid = false;
                    }
                    else if (typeof backupData.preferences !== 'object' || Array.isArray(backupData.preferences)) {
                        validation.errors.push('Preferences data must be an object (not array or primitive type)');
                        validation.isValid = false;
                    }
                    else {
                        // Count categories and validate structure
                        const categoryCount = Object.keys(backupData.preferences).length;
                        if (categoryCount === 0) {
                            validation.warnings.push('Backup contains no preference categories');
                        }
                        // Validate category names
                        const validCategories = ['general', 'external-tools', 'data-editor', 'laboratory', 'extensions', 'preview', 'console', 'native', 'builder'];
                        const invalidCategories = Object.keys(backupData.preferences).filter(cat => !validCategories.includes(cat));
                        if (invalidCategories.length > 0) {
                            validation.warnings.push(`Unknown categories found: ${invalidCategories.join(', ')}`);
                        }
                    }
                }
                resolve({
                    success: true,
                    message: `✅ Backup validation completed: ${validation.isValid ? 'Valid' : 'Invalid'}`,
                    data: {
                        isValid: validation.isValid,
                        errors: validation.errors,
                        warnings: validation.warnings,
                        metadata: validation.metadata,
                        summary: {
                            hasErrors: validation.errors.length > 0,
                            hasWarnings: validation.warnings.length > 0,
                            categoryCount: (backupData === null || backupData === void 0 ? void 0 : backupData.preferences) ? Object.keys(backupData.preferences).length : 0,
                            errorCount: validation.errors.length,
                            warningCount: validation.warnings.length
                        }
                    }
                });
            }
            catch (error) {
                resolve({
                    success: false,
                    error: `Validation failed: ${error.message}`
                });
            }
        });
    }
}
exports.PreferencesTools = PreferencesTools;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZmVyZW5jZXMtdG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zb3VyY2UvdG9vbHMvcHJlZmVyZW5jZXMtdG9vbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsTUFBYSxnQkFBZ0I7SUFDekIsUUFBUTtRQUNKLE9BQU87WUFDSDtnQkFDSSxJQUFJLEVBQUUsb0JBQW9CO2dCQUMxQixXQUFXLEVBQUUsNEpBQTRKO2dCQUN6SyxXQUFXLEVBQUU7b0JBQ1QsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsVUFBVSxFQUFFO3dCQUNSLE1BQU0sRUFBRTs0QkFDSixJQUFJLEVBQUUsUUFBUTs0QkFDZCxJQUFJLEVBQUUsQ0FBQyxZQUFZLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxjQUFjLENBQUM7NEJBQ2hFLFdBQVcsRUFBRSxnTEFBZ0w7eUJBQ2hNO3dCQUNELHdCQUF3Qjt3QkFDeEIsR0FBRyxFQUFFOzRCQUNELElBQUksRUFBRSxRQUFROzRCQUNkLElBQUksRUFBRSxDQUFDLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxhQUFhLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUM7NEJBQ3pILFdBQVcsRUFBRSw0R0FBNEc7eUJBQzVIO3dCQUNELGlEQUFpRDt3QkFDakQsUUFBUSxFQUFFOzRCQUNOLElBQUksRUFBRSxRQUFROzRCQUNkLElBQUksRUFBRSxDQUFDLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxhQUFhLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUM7NEJBQ3pILFdBQVcsRUFBRSx1RUFBdUU7NEJBQ3BGLE9BQU8sRUFBRSxTQUFTO3lCQUNyQjt3QkFDRCxJQUFJLEVBQUU7NEJBQ0YsSUFBSSxFQUFFLFFBQVE7NEJBQ2QsV0FBVyxFQUFFLDJJQUEySTt5QkFDM0o7d0JBQ0QsS0FBSyxFQUFFOzRCQUNILFdBQVcsRUFBRSxxR0FBcUc7eUJBQ3JIO3dCQUNELEtBQUssRUFBRTs0QkFDSCxJQUFJLEVBQUUsUUFBUTs0QkFDZCxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQzs0QkFDcEMsV0FBVyxFQUFFLDJIQUEySDs0QkFDeEksT0FBTyxFQUFFLFFBQVE7eUJBQ3BCO3FCQUNKO29CQUNELFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQztvQkFDcEIsS0FBSyxFQUFFO3dCQUNIOzRCQUNJLFVBQVUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsRUFBRTt5QkFDbEQ7d0JBQ0Q7NEJBQ0ksVUFBVSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxFQUFFOzRCQUMvQyxRQUFRLEVBQUUsQ0FBQyxVQUFVLENBQUM7eUJBQ3pCO3dCQUNEOzRCQUNJLFVBQVUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsRUFBRTs0QkFDL0MsUUFBUSxFQUFFLENBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUM7eUJBQzFDO3dCQUNEOzRCQUNJLFVBQVUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUUsRUFBRTs0QkFDakQsUUFBUSxFQUFFLENBQUMsVUFBVSxDQUFDO3lCQUN6QjtxQkFDSjtpQkFDSjthQUNKO1lBQ0Q7Z0JBQ0ksSUFBSSxFQUFFLG1CQUFtQjtnQkFDekIsV0FBVyxFQUFFLGtLQUFrSztnQkFDL0ssV0FBVyxFQUFFO29CQUNULElBQUksRUFBRSxRQUFRO29CQUNkLFVBQVUsRUFBRTt3QkFDUixNQUFNLEVBQUU7NEJBQ0osSUFBSSxFQUFFLFFBQVE7NEJBQ2QsSUFBSSxFQUFFLENBQUMsU0FBUyxFQUFFLGlCQUFpQixFQUFFLGlCQUFpQixDQUFDOzRCQUN2RCxXQUFXLEVBQUUsMktBQTJLO3lCQUMzTDt3QkFDRCxxQkFBcUI7d0JBQ3JCLEtBQUssRUFBRTs0QkFDSCxJQUFJLEVBQUUsUUFBUTs0QkFDZCxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQzs0QkFDcEMsV0FBVyxFQUFFLG9EQUFvRDs0QkFDakUsT0FBTyxFQUFFLFFBQVE7eUJBQ3BCO3dCQUNELFVBQVUsRUFBRTs0QkFDUixJQUFJLEVBQUUsT0FBTzs0QkFDYixLQUFLLEVBQUU7Z0NBQ0gsSUFBSSxFQUFFLFFBQVE7Z0NBQ2QsSUFBSSxFQUFFLENBQUMsU0FBUyxFQUFFLGdCQUFnQixFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQzs2QkFDNUg7NEJBQ0QsV0FBVyxFQUFFLHNHQUFzRzt5QkFDdEg7d0JBQ0QsNkJBQTZCO3dCQUM3QixPQUFPLEVBQUU7NEJBQ0wsSUFBSSxFQUFFLFFBQVE7NEJBQ2QsV0FBVyxFQUFFLG1FQUFtRTt5QkFDbkY7d0JBQ0QsYUFBYSxFQUFFOzRCQUNYLElBQUksRUFBRSxTQUFTOzRCQUNmLFdBQVcsRUFBRSx3RUFBd0U7NEJBQ3JGLE9BQU8sRUFBRSxJQUFJO3lCQUNoQjtxQkFDSjtvQkFDRCxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUM7b0JBQ3BCLEtBQUssRUFBRTt3QkFDSDs0QkFDSSxVQUFVLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLEVBQUU7eUJBQy9DO3dCQUNEOzRCQUNJLFVBQVUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLEtBQUssRUFBRSxpQkFBaUIsRUFBRSxFQUFFO3lCQUN2RDt3QkFDRDs0QkFDSSxVQUFVLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxLQUFLLEVBQUUsaUJBQWlCLEVBQUUsRUFBRTs0QkFDcEQsUUFBUSxFQUFFLENBQUMsU0FBUyxDQUFDO3lCQUN4QjtxQkFDSjtpQkFDSjthQUNKO1lBQ0Q7Z0JBQ0ksSUFBSSxFQUFFLG9CQUFvQjtnQkFDMUIsV0FBVyxFQUFFLHVKQUF1SjtnQkFDcEssV0FBVyxFQUFFO29CQUNULElBQUksRUFBRSxRQUFRO29CQUNkLFVBQVUsRUFBRTt3QkFDUixNQUFNLEVBQUU7NEJBQ0osSUFBSSxFQUFFLFFBQVE7NEJBQ2QsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFLGlCQUFpQixDQUFDOzRCQUNuQyxXQUFXLEVBQUUscUdBQXFHO3lCQUNySDt3QkFDRCxvQkFBb0I7d0JBQ3BCLFVBQVUsRUFBRTs0QkFDUixJQUFJLEVBQUUsT0FBTzs0QkFDYixLQUFLLEVBQUU7Z0NBQ0gsSUFBSSxFQUFFLFFBQVE7Z0NBQ2QsSUFBSSxFQUFFLENBQUMsU0FBUyxFQUFFLGdCQUFnQixFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQzs2QkFDNUg7NEJBQ0QsV0FBVyxFQUFFLDJGQUEyRjt5QkFDM0c7d0JBQ0QsS0FBSyxFQUFFOzRCQUNILElBQUksRUFBRSxRQUFROzRCQUNkLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUM7NEJBQ3pCLFdBQVcsRUFBRSxvREFBb0Q7NEJBQ2pFLE9BQU8sRUFBRSxRQUFRO3lCQUNwQjt3QkFDRCxlQUFlLEVBQUU7NEJBQ2IsSUFBSSxFQUFFLFNBQVM7NEJBQ2YsV0FBVyxFQUFFLHVEQUF1RDs0QkFDcEUsT0FBTyxFQUFFLEtBQUs7eUJBQ2pCO3dCQUNELDZCQUE2Qjt3QkFDN0IsVUFBVSxFQUFFOzRCQUNSLElBQUksRUFBRSxRQUFROzRCQUNkLFdBQVcsRUFBRSx1REFBdUQ7eUJBQ3ZFO3FCQUNKO29CQUNELFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQztvQkFDcEIsS0FBSyxFQUFFO3dCQUNIOzRCQUNJLFVBQVUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsRUFBRTt5QkFDOUM7d0JBQ0Q7NEJBQ0ksVUFBVSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsS0FBSyxFQUFFLGlCQUFpQixFQUFFLEVBQUU7NEJBQ3BELFFBQVEsRUFBRSxDQUFDLFlBQVksQ0FBQzt5QkFDM0I7cUJBQ0o7aUJBQ0o7YUFDSjtTQUNKLENBQUM7SUFDTixDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFnQixFQUFFLElBQVM7UUFDckMsUUFBUSxRQUFRLEVBQUUsQ0FBQztZQUNmLEtBQUssb0JBQW9CO2dCQUNyQixPQUFPLE1BQU0sSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BELEtBQUssbUJBQW1CO2dCQUNwQixPQUFPLE1BQU0sSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ25ELEtBQUssb0JBQW9CO2dCQUNyQixPQUFPLE1BQU0sSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BEO2dCQUNJLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDckQsQ0FBQztJQUNMLENBQUM7SUFFRCw0QkFBNEI7SUFDcEIsS0FBSyxDQUFDLHVCQUF1QixDQUFDLElBQVM7UUFDM0MsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQztRQUV4QixRQUFRLE1BQU0sRUFBRSxDQUFDO1lBQ2IsS0FBSyxZQUFZO2dCQUNiLE9BQU8sTUFBTSxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3JELEtBQUssWUFBWTtnQkFDYixPQUFPLE1BQU0sSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDakYsS0FBSyxZQUFZO2dCQUNiLE9BQU8sTUFBTSxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzdGLEtBQUssY0FBYztnQkFDZixPQUFPLE1BQU0sSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hFO2dCQUNJLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxzQ0FBc0MsTUFBTSxFQUFFLEVBQUUsQ0FBQztRQUN6RixDQUFDO0lBQ0wsQ0FBQztJQUVPLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxJQUFTO1FBQzFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFFeEIsUUFBUSxNQUFNLEVBQUUsQ0FBQztZQUNiLEtBQUssU0FBUztnQkFDVixPQUFPLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3JFLEtBQUssaUJBQWlCO2dCQUNsQixPQUFPLE1BQU0sSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7WUFDbEQsS0FBSyxpQkFBaUI7Z0JBQ2xCLE9BQU8sTUFBTSxJQUFJLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDbEY7Z0JBQ0ksT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLHFDQUFxQyxNQUFNLEVBQUUsRUFBRSxDQUFDO1FBQ3hGLENBQUM7SUFDTCxDQUFDO0lBRU8sS0FBSyxDQUFDLHVCQUF1QixDQUFDLElBQVM7UUFDM0MsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQztRQUV4QixRQUFRLE1BQU0sRUFBRSxDQUFDO1lBQ2IsS0FBSyxRQUFRO2dCQUNULE9BQU8sTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUMzRixLQUFLLGlCQUFpQjtnQkFDbEIsT0FBTyxNQUFNLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDMUQ7Z0JBQ0ksT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLHNDQUFzQyxNQUFNLEVBQUUsRUFBRSxDQUFDO1FBQ3pGLENBQUM7SUFDTCxDQUFDO0lBRUQseUJBQXlCO0lBQ2pCLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxHQUFZO1FBQzNDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtZQUMzQixNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUVwQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQWUsQ0FBQyxhQUFhLEVBQUUsZUFBZSxFQUFFLEdBQUcsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDdEYsT0FBTyxDQUFDO29CQUNKLE9BQU8sRUFBRSxJQUFJO29CQUNiLE9BQU8sRUFBRSw2QkFBNkIsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7b0JBQ3JFLElBQUksRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksU0FBUyxFQUFFO2lCQUNsQyxDQUFDLENBQUM7WUFDUCxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFVLEVBQUUsRUFBRTtnQkFDcEIsT0FBTyxDQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUscUNBQXFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDM0YsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTyxLQUFLLENBQUMsb0JBQW9CLENBQUMsUUFBZ0IsRUFBRSxJQUFhLEVBQUUsUUFBZ0IsUUFBUTtRQUN4RixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDM0IsOEJBQThCO1lBQzlCLElBQUksQ0FBQyxRQUFRLElBQUksT0FBTyxRQUFRLEtBQUssUUFBUSxJQUFJLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7Z0JBQzVFLE9BQU8sQ0FBQztvQkFDSixPQUFPLEVBQUUsS0FBSztvQkFDZCxLQUFLLEVBQUUscURBQXFEO2lCQUMvRCxDQUFDLENBQUM7Z0JBQ0gsT0FBTztZQUNYLENBQUM7WUFFRCxNQUFNLGVBQWUsR0FBRyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDeEMsTUFBTSxXQUFXLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUN0QyxJQUFJLElBQUksSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztnQkFDN0QsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUNsQyxDQUFDO1lBQ0QsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUV2QixNQUFNLENBQUMsT0FBTyxDQUFDLE9BQWUsQ0FBQyxhQUFhLEVBQUUsY0FBYyxFQUFFLEdBQUcsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBVyxFQUFFLEVBQUU7Z0JBQ2hHLE9BQU8sQ0FBQztvQkFDSixPQUFPLEVBQUUsSUFBSTtvQkFDYixPQUFPLEVBQUUsaUNBQWlDLGVBQWUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtvQkFDM0YsSUFBSSxFQUFFO3dCQUNGLFFBQVEsRUFBRSxlQUFlO3dCQUN6QixJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVM7d0JBQ3BDLEtBQUs7d0JBQ0wsTUFBTTtxQkFDVDtpQkFDSixDQUFDLENBQUM7WUFDUCxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFVLEVBQUUsRUFBRTtnQkFDcEIsT0FBTyxDQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsb0NBQW9DLEdBQUcsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDMUYsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTyxLQUFLLENBQUMsb0JBQW9CLENBQUMsUUFBZ0IsRUFBRSxJQUFZLEVBQUUsS0FBVSxFQUFFLFFBQWdCLFFBQVE7UUFDbkcsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQzNCLCtCQUErQjtZQUMvQixJQUFJLENBQUMsUUFBUSxJQUFJLE9BQU8sUUFBUSxLQUFLLFFBQVEsSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO2dCQUM1RSxPQUFPLENBQUM7b0JBQ0osT0FBTyxFQUFFLEtBQUs7b0JBQ2QsS0FBSyxFQUFFLHFEQUFxRDtpQkFDL0QsQ0FBQyxDQUFDO2dCQUNILE9BQU87WUFDWCxDQUFDO1lBRUQsSUFBSSxDQUFDLElBQUksSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQztnQkFDaEUsT0FBTyxDQUFDO29CQUNKLE9BQU8sRUFBRSxLQUFLO29CQUNkLEtBQUssRUFBRSxpREFBaUQ7aUJBQzNELENBQUMsQ0FBQztnQkFDSCxPQUFPO1lBQ1gsQ0FBQztZQUVELElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRSxDQUFDO2dCQUN0QixPQUFPLENBQUM7b0JBQ0osT0FBTyxFQUFFLEtBQUs7b0JBQ2QsS0FBSyxFQUFFLDJDQUEyQztpQkFDckQsQ0FBQyxDQUFDO2dCQUNILE9BQU87WUFDWCxDQUFDO1lBRUQsTUFBTSxlQUFlLEdBQUcsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3hDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUUvQixNQUFNLENBQUMsT0FBTyxDQUFDLE9BQWUsQ0FBQyxhQUFhLEVBQUUsWUFBWSxFQUFFLGVBQWUsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQWdCLEVBQUUsRUFBRTtnQkFDL0gsSUFBSSxPQUFPLEVBQUUsQ0FBQztvQkFDVixPQUFPLENBQUM7d0JBQ0osT0FBTyxFQUFFLElBQUk7d0JBQ2IsT0FBTyxFQUFFLGlCQUFpQixlQUFlLElBQUksV0FBVyx3QkFBd0I7d0JBQ2hGLElBQUksRUFBRTs0QkFDRixRQUFRLEVBQUUsZUFBZTs0QkFDekIsSUFBSSxFQUFFLFdBQVc7NEJBQ2pCLEtBQUs7NEJBQ0wsS0FBSzt5QkFDUjtxQkFDSixDQUFDLENBQUM7Z0JBQ1AsQ0FBQztxQkFBTSxDQUFDO29CQUNKLE9BQU8sQ0FBQzt3QkFDSixPQUFPLEVBQUUsS0FBSzt3QkFDZCxLQUFLLEVBQUUsZ0NBQWdDLGVBQWUsSUFBSSxXQUFXLHVDQUF1QztxQkFDL0csQ0FBQyxDQUFDO2dCQUNQLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFVLEVBQUUsRUFBRTtnQkFDcEIsT0FBTyxDQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsNkJBQTZCLEdBQUcsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDbkYsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTyxLQUFLLENBQUMsc0JBQXNCLENBQUMsUUFBZ0IsRUFBRSxRQUFnQixRQUFRO1FBQzNFLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtZQUMzQiw4QkFBOEI7WUFDOUIsSUFBSSxDQUFDLFFBQVEsSUFBSSxPQUFPLFFBQVEsS0FBSyxRQUFRLElBQUksUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQztnQkFDNUUsT0FBTyxDQUFDO29CQUNKLE9BQU8sRUFBRSxLQUFLO29CQUNkLEtBQUssRUFBRSxxREFBcUQ7aUJBQy9ELENBQUMsQ0FBQztnQkFDSCxPQUFPO1lBQ1gsQ0FBQztZQUVELE1BQU0sZUFBZSxHQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUV4QyxrQ0FBa0M7WUFDakMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFlLENBQUMsYUFBYSxFQUFFLGNBQWMsRUFBRSxlQUFlLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLGFBQWtCLEVBQUUsRUFBRTtnQkFDOUgsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO29CQUNqQixNQUFNLElBQUksS0FBSyxDQUFDLGdEQUFnRCxlQUFlLEdBQUcsQ0FBQyxDQUFDO2dCQUN4RixDQUFDO2dCQUNELDhCQUE4QjtnQkFDOUIsT0FBUSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQWUsQ0FBQyxhQUFhLEVBQUUsWUFBWSxFQUFFLGVBQWUsRUFBRSxFQUFFLEVBQUUsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ25ILENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQWdCLEVBQUUsRUFBRTtnQkFDekIsSUFBSSxPQUFPLEVBQUUsQ0FBQztvQkFDVixPQUFPLENBQUM7d0JBQ0osT0FBTyxFQUFFLElBQUk7d0JBQ2IsT0FBTyxFQUFFLDBCQUEwQixlQUFlLHFCQUFxQjt3QkFDdkUsSUFBSSxFQUFFOzRCQUNGLFFBQVEsRUFBRSxlQUFlOzRCQUN6QixLQUFLOzRCQUNMLE1BQU0sRUFBRSxPQUFPO3lCQUNsQjtxQkFDSixDQUFDLENBQUM7Z0JBQ1AsQ0FBQztxQkFBTSxDQUFDO29CQUNKLE9BQU8sQ0FBQzt3QkFDSixPQUFPLEVBQUUsS0FBSzt3QkFDZCxLQUFLLEVBQUUsd0NBQXdDLGVBQWUsOENBQThDO3FCQUMvRyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQVUsRUFBRSxFQUFFO2dCQUNwQixPQUFPLENBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxnQ0FBZ0MsR0FBRyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN0RixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVPLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxRQUFnQixRQUFRLEVBQUUsVUFBcUI7UUFDM0UsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQzNCLE1BQU0sbUJBQW1CLEdBQUc7Z0JBQ3hCLFNBQVM7Z0JBQ1QsZ0JBQWdCO2dCQUNoQixhQUFhO2dCQUNiLFlBQVk7Z0JBQ1osWUFBWTtnQkFDWixTQUFTO2dCQUNULFNBQVM7Z0JBQ1QsUUFBUTtnQkFDUixTQUFTO2FBQ1osQ0FBQztZQUVGLGlEQUFpRDtZQUNqRCxNQUFNLGlCQUFpQixHQUFHLFVBQVUsSUFBSSxtQkFBbUIsQ0FBQztZQUM1RCxNQUFNLFdBQVcsR0FBUSxFQUFFLENBQUM7WUFFNUIsTUFBTSxhQUFhLEdBQUcsaUJBQWlCLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUNuRCxPQUFRLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBZSxDQUFDLGFBQWEsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUM7cUJBQzVGLElBQUksQ0FBQyxDQUFDLE1BQVcsRUFBRSxFQUFFO29CQUNsQixXQUFXLENBQUMsUUFBUSxDQUFDLEdBQUcsTUFBTSxDQUFDO2dCQUNuQyxDQUFDLENBQUM7cUJBQ0QsS0FBSyxDQUFDLEdBQUcsRUFBRTtvQkFDUiwwQ0FBMEM7b0JBQzFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUM7Z0JBQ2pDLENBQUMsQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxDQUFDLENBQUM7WUFFSCxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7Z0JBQ2pDLDBCQUEwQjtnQkFDMUIsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUN2QyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLENBQ3JFLENBQUM7Z0JBRUYsT0FBTyxDQUFDO29CQUNKLE9BQU8sRUFBRSxJQUFJO29CQUNiLE9BQU8sRUFBRSwrQkFBK0IsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE1BQU0sYUFBYTtvQkFDekYsSUFBSSxFQUFFO3dCQUNGLEtBQUs7d0JBQ0wsbUJBQW1CLEVBQUUsaUJBQWlCO3dCQUN0QyxtQkFBbUIsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDO3dCQUNsRCxXQUFXLEVBQUUsZ0JBQWdCO3dCQUM3QixPQUFPLEVBQUU7NEJBQ0wsZUFBZSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxNQUFNOzRCQUNyRCxLQUFLLEVBQUUsS0FBSzt5QkFDZjtxQkFDSjtpQkFDSixDQUFDLENBQUM7WUFDUCxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFVLEVBQUUsRUFBRTtnQkFDcEIsT0FBTyxDQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsaUNBQWlDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDdkYsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTyxLQUFLLENBQUMseUJBQXlCO1FBQ25DLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtZQUMzQixNQUFNLFVBQVUsR0FBRztnQkFDZixFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLDRDQUE0QyxFQUFFO2dCQUM5RSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsc0NBQXNDLEVBQUU7Z0JBQy9FLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsMENBQTBDLEVBQUU7Z0JBQ2hGLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsOENBQThDLEVBQUU7Z0JBQ25GLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsdUNBQXVDLEVBQUU7Z0JBQzVFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUscUNBQXFDLEVBQUU7Z0JBQ3ZFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsMkNBQTJDLEVBQUU7Z0JBQzdFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsc0NBQXNDLEVBQUU7Z0JBQ3ZFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsdUNBQXVDLEVBQUU7YUFDNUUsQ0FBQztZQUVGLE9BQU8sQ0FBQztnQkFDSixPQUFPLEVBQUUsSUFBSTtnQkFDYixPQUFPLEVBQUUsWUFBWSxVQUFVLENBQUMsTUFBTSxrQ0FBa0M7Z0JBQ3hFLElBQUksRUFBRTtvQkFDRixVQUFVO29CQUNWLFVBQVUsRUFBRSxVQUFVLENBQUMsTUFBTTtvQkFDN0IsS0FBSyxFQUFFLDZFQUE2RTtpQkFDdkY7YUFDSixDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTyxLQUFLLENBQUMseUJBQXlCLENBQUMsT0FBZSxFQUFFLGdCQUF5QixJQUFJO1FBQ2xGLE9BQU8sSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFOztZQUNqQyxJQUFJLENBQUM7Z0JBQ0QsNkJBQTZCO2dCQUM3QixJQUFJLENBQUMsT0FBTyxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO29CQUN6RSxPQUFPLENBQUM7d0JBQ0osT0FBTyxFQUFFLEtBQUs7d0JBQ2QsS0FBSyxFQUFFLDJEQUEyRDtxQkFDckUsQ0FBQyxDQUFDO29CQUNILE9BQU87Z0JBQ1gsQ0FBQztnQkFFRCxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3RDLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ2hFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDNUIsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7b0JBQzFCLE9BQU87Z0JBQ1gsQ0FBQztnQkFFRCxNQUFNLFdBQVcsR0FBRyxDQUFBLE1BQUEsZ0JBQWdCLENBQUMsSUFBSSwwQ0FBRSxXQUFXLEtBQUksRUFBRSxDQUFDO2dCQUM3RCxNQUFNLGFBQWEsR0FBVSxFQUFFLENBQUM7Z0JBRWhDLG1EQUFtRDtnQkFDbkQsS0FBSyxNQUFNLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQztvQkFDM0QsSUFBSSxNQUFNLElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFLENBQUM7d0JBQ3ZDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBYSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLGFBQWEsRUFBRSxhQUFhLENBQUMsQ0FBQztvQkFDbkcsQ0FBQztnQkFDTCxDQUFDO2dCQUVELE9BQU8sQ0FBQztvQkFDSixPQUFPLEVBQUUsSUFBSTtvQkFDYixPQUFPLEVBQUUsV0FBVyxhQUFhLENBQUMsTUFBTSx1QkFBdUIsY0FBYyxHQUFHO29CQUNoRixJQUFJLEVBQUU7d0JBQ0YsT0FBTyxFQUFFLGNBQWM7d0JBQ3ZCLGFBQWE7d0JBQ2IsV0FBVyxFQUFFLGFBQWEsQ0FBQyxNQUFNO3dCQUNqQyxPQUFPLEVBQUUsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsK0NBQStDO3dCQUNwRixjQUFjLEVBQUUsYUFBYSxDQUFDLE1BQU0sR0FBRyxFQUFFO3FCQUM1QztpQkFDSixDQUFDLENBQUM7WUFDUCxDQUFDO1lBQUMsT0FBTyxLQUFVLEVBQUUsQ0FBQztnQkFDbEIsT0FBTyxDQUFDO29CQUNKLE9BQU8sRUFBRSxLQUFLO29CQUNkLEtBQUssRUFBRSxrQkFBa0IsS0FBSyxDQUFDLE9BQU8sRUFBRTtpQkFDM0MsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVPLGNBQWMsQ0FBQyxHQUFRLEVBQUUsT0FBZSxFQUFFLFFBQWdCLEVBQUUsVUFBa0IsRUFBRSxPQUFjLEVBQUUsYUFBc0I7UUFDMUgsSUFBSSxDQUFDLEdBQUcsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLElBQUksQ0FBQyxPQUFPLElBQUksT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFFLENBQUM7WUFDN0UsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUM7UUFFM0MsSUFBSSxDQUFDO1lBQ0QsS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztnQkFDN0MsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRO29CQUFFLFNBQVM7Z0JBRXRDLE1BQU0sV0FBVyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztnQkFDOUQsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDNUQsTUFBTSxZQUFZLEdBQUcsT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBRTdGLElBQUksVUFBVSxJQUFJLFlBQVksRUFBRSxDQUFDO29CQUM3QixNQUFNLE1BQU0sR0FBUTt3QkFDaEIsUUFBUTt3QkFDUixJQUFJLEVBQUUsV0FBVzt3QkFDakIsR0FBRzt3QkFDSCxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTztxQkFDcEUsQ0FBQztvQkFFRixJQUFJLGFBQWEsRUFBRSxDQUFDO3dCQUNoQixNQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzt3QkFDckIsTUFBTSxDQUFDLFNBQVMsR0FBRyxPQUFPLEtBQUssQ0FBQztvQkFDcEMsQ0FBQztvQkFFRCxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN6QixDQUFDO2dCQUVELHFGQUFxRjtnQkFDckYsSUFBSSxLQUFLLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxFQUFFLEVBQUUsQ0FBQztvQkFDbkcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDO2dCQUN2RixDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2Isd0NBQXdDO1FBQzVDLENBQUM7SUFDTCxDQUFDO0lBRU8sS0FBSyxDQUFDLGlCQUFpQixDQUFDLFVBQXFCLEVBQUUsUUFBZ0IsUUFBUSxFQUFFLGtCQUEyQixLQUFLO1FBQzdHLE9BQU8sSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFOztZQUNqQyxJQUFJLENBQUM7Z0JBQ0QsMkJBQTJCO2dCQUMzQixNQUFNLFdBQVcsR0FBRyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDeEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztvQkFDL0IsT0FBTyxDQUFDO3dCQUNKLE9BQU8sRUFBRSxLQUFLO3dCQUNkLEtBQUssRUFBRSxrQkFBa0IsS0FBSyxzQkFBc0IsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtxQkFDL0UsQ0FBQyxDQUFDO29CQUNILE9BQU87Z0JBQ1gsQ0FBQztnQkFFRCw0Q0FBNEM7Z0JBQzVDLElBQUksVUFBVSxFQUFFLENBQUM7b0JBQ2IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQzt3QkFDN0IsT0FBTyxDQUFDOzRCQUNKLE9BQU8sRUFBRSxLQUFLOzRCQUNkLEtBQUssRUFBRSw2QkFBNkI7eUJBQ3ZDLENBQUMsQ0FBQzt3QkFDSCxPQUFPO29CQUNYLENBQUM7b0JBRUQsTUFBTSxlQUFlLEdBQUcsQ0FBQyxTQUFTLEVBQUUsZ0JBQWdCLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7b0JBQzVJLE1BQU0saUJBQWlCLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNuRixJQUFJLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQzt3QkFDL0IsT0FBTyxDQUFDOzRCQUNKLE9BQU8sRUFBRSxLQUFLOzRCQUNkLEtBQUssRUFBRSx1QkFBdUIsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQywyQkFBMkIsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTt5QkFDcEgsQ0FBQyxDQUFDO3dCQUNILE9BQU87b0JBQ1gsQ0FBQztnQkFDTCxDQUFDO2dCQUVELE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUN6RSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQzVCLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO29CQUMxQixPQUFPO2dCQUNYLENBQUM7Z0JBRUQsTUFBTSxVQUFVLEdBQVE7b0JBQ3BCLFFBQVEsRUFBRTt3QkFDTixVQUFVLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUU7d0JBQ3BDLEtBQUssRUFBRSxLQUFLO3dCQUNaLGVBQWUsRUFBRSxlQUFlO3dCQUNoQyxZQUFZLEVBQUUsQ0FBQSxNQUFDLE1BQWMsQ0FBQyxRQUFRLDBDQUFFLEtBQUssS0FBSSxTQUFTO3dCQUMxRCxrQkFBa0IsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUEsTUFBQSxnQkFBZ0IsQ0FBQyxJQUFJLDBDQUFFLFdBQVcsS0FBSSxFQUFFLENBQUM7d0JBQ3pFLG1CQUFtQixFQUFFLFVBQVUsSUFBSSxLQUFLO3FCQUMzQztvQkFDRCxXQUFXLEVBQUUsQ0FBQSxNQUFBLGdCQUFnQixDQUFDLElBQUksMENBQUUsV0FBVyxLQUFJLEVBQUU7aUJBQ3hELENBQUM7Z0JBRUYsZ0NBQWdDO2dCQUNoQyxJQUFJLGVBQWUsRUFBRSxDQUFDO29CQUNsQixJQUFJLENBQUM7d0JBQ0QsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7d0JBQzdFLElBQUksZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUM7NEJBQzNCLFVBQVUsQ0FBQyxRQUFRLEdBQUcsQ0FBQSxNQUFBLGdCQUFnQixDQUFDLElBQUksMENBQUUsV0FBVyxLQUFJLEVBQUUsQ0FBQzt3QkFDbkUsQ0FBQzs2QkFBTSxDQUFDOzRCQUNKLFVBQVUsQ0FBQyxRQUFRLENBQUMsZUFBZSxHQUFHLHdDQUF3QyxDQUFDO3dCQUNuRixDQUFDO29CQUNMLENBQUM7b0JBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQzt3QkFDYixVQUFVLENBQUMsUUFBUSxDQUFDLGVBQWUsR0FBRyxzQ0FBc0MsQ0FBQztvQkFDakYsQ0FBQztnQkFDTCxDQUFDO2dCQUVELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDckQsTUFBTSxVQUFVLEdBQUcscUJBQXFCLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQztnQkFFbkUsT0FBTyxDQUFDO29CQUNKLE9BQU8sRUFBRSxJQUFJO29CQUNiLE9BQU8sRUFBRSw4QkFBOEIsVUFBVSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLGFBQWE7b0JBQ2pHLElBQUksRUFBRTt3QkFDRixVQUFVO3dCQUNWLFFBQVEsRUFBRSxVQUFVLENBQUMsUUFBUTt3QkFDN0IsV0FBVyxFQUFFLFVBQVUsQ0FBQyxXQUFXO3dCQUNuQyxRQUFRO3dCQUNSLFFBQVEsRUFBRSxNQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUM7d0JBQzdDLE9BQU8sRUFBRTs0QkFDTCxlQUFlLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNOzRCQUM5RCxLQUFLLEVBQUUsS0FBSzs0QkFDWixlQUFlLEVBQUUsZUFBZTs0QkFDaEMsV0FBVyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsUUFBUTt5QkFDckM7cUJBQ0o7aUJBQ0osQ0FBQyxDQUFDO1lBQ1AsQ0FBQztZQUFDLE9BQU8sS0FBVSxFQUFFLENBQUM7Z0JBQ2xCLE9BQU8sQ0FBQztvQkFDSixPQUFPLEVBQUUsS0FBSztvQkFDZCxLQUFLLEVBQUUsa0JBQWtCLEtBQUssQ0FBQyxPQUFPLEVBQUU7aUJBQzNDLENBQUMsQ0FBQztZQUNQLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTyxLQUFLLENBQUMsa0JBQWtCLENBQUMsVUFBZTtRQUM1QyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDM0IsSUFBSSxDQUFDO2dCQUNELE1BQU0sVUFBVSxHQUFHO29CQUNmLE9BQU8sRUFBRSxJQUFJO29CQUNiLE1BQU0sRUFBRSxFQUFjO29CQUN0QixRQUFRLEVBQUUsRUFBYztvQkFDeEIsUUFBUSxFQUFFLElBQVc7aUJBQ3hCLENBQUM7Z0JBRUYsa0NBQWtDO2dCQUNsQyxJQUFJLFVBQVUsS0FBSyxTQUFTLElBQUksVUFBVSxLQUFLLElBQUksRUFBRSxDQUFDO29CQUNsRCxVQUFVLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztvQkFDM0IsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMseURBQXlELENBQUMsQ0FBQztvQkFDbEYsT0FBTyxDQUFDO3dCQUNKLE9BQU8sRUFBRSxLQUFLO3dCQUNkLEtBQUssRUFBRSx3Q0FBd0M7cUJBQ2xELENBQUMsQ0FBQztvQkFDSCxPQUFPO2dCQUNYLENBQUM7Z0JBRUQsd0JBQXdCO2dCQUN4QixJQUFJLE9BQU8sVUFBVSxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7b0JBQzlELFVBQVUsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO29CQUMzQixVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxrRUFBa0UsQ0FBQyxDQUFDO2dCQUMvRixDQUFDO3FCQUFNLENBQUM7b0JBQ0oscUJBQXFCO29CQUNyQixJQUFJLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQzt3QkFDdEIsSUFBSSxPQUFPLFVBQVUsQ0FBQyxRQUFRLEtBQUssUUFBUSxFQUFFLENBQUM7NEJBQzFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLENBQUM7NEJBQ3JELFVBQVUsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO3dCQUMvQixDQUFDOzZCQUFNLENBQUM7NEJBQ0osVUFBVSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDOzRCQUUxQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQ0FDbEMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsaUNBQWlDLENBQUMsQ0FBQzs0QkFDaEUsQ0FBQztpQ0FBTSxJQUFJLE9BQU8sVUFBVSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEtBQUssUUFBUSxFQUFFLENBQUM7Z0NBQzVELFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGdDQUFnQyxDQUFDLENBQUM7NEJBQy9ELENBQUM7NEJBRUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7Z0NBQzdCLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLHVDQUF1QyxDQUFDLENBQUM7NEJBQ3RFLENBQUM7aUNBQU0sSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO2dDQUM3RSxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDOzRCQUNoRSxDQUFDOzRCQUVELElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxZQUFZLElBQUksT0FBTyxVQUFVLENBQUMsUUFBUSxDQUFDLFlBQVksS0FBSyxRQUFRLEVBQUUsQ0FBQztnQ0FDM0YsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsa0NBQWtDLENBQUMsQ0FBQzs0QkFDakUsQ0FBQzt3QkFDTCxDQUFDO29CQUNMLENBQUM7eUJBQU0sQ0FBQzt3QkFDSixVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO29CQUNqRSxDQUFDO29CQUVELDZCQUE2QjtvQkFDN0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQzt3QkFDMUIsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMscUNBQXFDLENBQUMsQ0FBQzt3QkFDOUQsVUFBVSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7b0JBQy9CLENBQUM7eUJBQU0sSUFBSSxPQUFPLFVBQVUsQ0FBQyxXQUFXLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUM7d0JBQzdGLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGtFQUFrRSxDQUFDLENBQUM7d0JBQzNGLFVBQVUsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO29CQUMvQixDQUFDO3lCQUFNLENBQUM7d0JBQ0osMENBQTBDO3dCQUMxQyxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLENBQUM7d0JBQ2pFLElBQUksYUFBYSxLQUFLLENBQUMsRUFBRSxDQUFDOzRCQUN0QixVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO3dCQUN6RSxDQUFDO3dCQUVELDBCQUEwQjt3QkFDMUIsTUFBTSxlQUFlLEdBQUcsQ0FBQyxTQUFTLEVBQUUsZ0JBQWdCLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7d0JBQzVJLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQzVHLElBQUksaUJBQWlCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDOzRCQUMvQixVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDMUYsQ0FBQztvQkFDTCxDQUFDO2dCQUNMLENBQUM7Z0JBRUQsT0FBTyxDQUFDO29CQUNKLE9BQU8sRUFBRSxJQUFJO29CQUNiLE9BQU8sRUFBRSxrQ0FBa0MsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUU7b0JBQ3JGLElBQUksRUFBRTt3QkFDRixPQUFPLEVBQUUsVUFBVSxDQUFDLE9BQU87d0JBQzNCLE1BQU0sRUFBRSxVQUFVLENBQUMsTUFBTTt3QkFDekIsUUFBUSxFQUFFLFVBQVUsQ0FBQyxRQUFRO3dCQUM3QixRQUFRLEVBQUUsVUFBVSxDQUFDLFFBQVE7d0JBQzdCLE9BQU8sRUFBRTs0QkFDTCxTQUFTLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQzs0QkFDdkMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUM7NEJBQzNDLGFBQWEsRUFBRSxDQUFBLFVBQVUsYUFBVixVQUFVLHVCQUFWLFVBQVUsQ0FBRSxXQUFXLEVBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDdkYsVUFBVSxFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTTs0QkFDcEMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUMsTUFBTTt5QkFDM0M7cUJBQ0o7aUJBQ0osQ0FBQyxDQUFDO1lBQ1AsQ0FBQztZQUFDLE9BQU8sS0FBVSxFQUFFLENBQUM7Z0JBQ2xCLE9BQU8sQ0FBQztvQkFDSixPQUFPLEVBQUUsS0FBSztvQkFDZCxLQUFLLEVBQUUsc0JBQXNCLEtBQUssQ0FBQyxPQUFPLEVBQUU7aUJBQy9DLENBQUMsQ0FBQztZQUNQLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSjtBQXJ1QkQsNENBcXVCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRvb2xEZWZpbml0aW9uLCBUb29sUmVzcG9uc2UsIFRvb2xFeGVjdXRvciB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGNsYXNzIFByZWZlcmVuY2VzVG9vbHMgaW1wbGVtZW50cyBUb29sRXhlY3V0b3Ige1xuICAgIGdldFRvb2xzKCk6IFRvb2xEZWZpbml0aW9uW10ge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdwcmVmZXJlbmNlc19tYW5hZ2UnLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnUFJFRkVSRU5DRVMgTUFOQUdFTUVOVDogT3BlbiBwcmVmZXJlbmNlcyBwYW5lbCwgZ2V0L3NldCBjb25maWd1cmF0aW9uIHZhbHVlcywgYW5kIHJlc2V0IHByZWZlcmVuY2VzLiBVc2UgdGhpcyBmb3IgYWxsIHByZWZlcmVuY2UgY29uZmlndXJhdGlvbiBvcGVyYXRpb25zLicsXG4gICAgICAgICAgICAgICAgaW5wdXRTY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudW06IFsnb3Blbl9wYW5lbCcsICdnZXRfY29uZmlnJywgJ3NldF9jb25maWcnLCAncmVzZXRfY29uZmlnJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdBY3Rpb246IFwib3Blbl9wYW5lbFwiID0gb3BlbiBwcmVmZXJlbmNlcyBzZXR0aW5ncyBwYW5lbCB8IFwiZ2V0X2NvbmZpZ1wiID0gcXVlcnkgcHJlZmVyZW5jZSB2YWx1ZXMgfCBcInNldF9jb25maWdcIiA9IHVwZGF0ZSBwcmVmZXJlbmNlIHZhbHVlcyB8IFwicmVzZXRfY29uZmlnXCIgPSByZXNldCB0byBkZWZhdWx0cydcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3Igb3Blbl9wYW5lbCBhY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIHRhYjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudW06IFsnZ2VuZXJhbCcsICdleHRlcm5hbC10b29scycsICdkYXRhLWVkaXRvcicsICdsYWJvcmF0b3J5JywgJ2V4dGVuc2lvbnMnLCAncHJldmlldycsICdjb25zb2xlJywgJ25hdGl2ZScsICdidWlsZGVyJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdQcmVmZXJlbmNlcyB0YWIgdG8gb3BlbiAob3Blbl9wYW5lbCBhY3Rpb24gb25seSkuIENob29zZSBmcm9tIGF2YWlsYWJsZSB0YWJzIGluIENvY29zIENyZWF0b3IgcHJlZmVyZW5jZXMuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvciBnZXRfY29uZmlnL3NldF9jb25maWcvcmVzZXRfY29uZmlnIGFjdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW51bTogWydnZW5lcmFsJywgJ2V4dGVybmFsLXRvb2xzJywgJ2RhdGEtZWRpdG9yJywgJ2xhYm9yYXRvcnknLCAnZXh0ZW5zaW9ucycsICdwcmV2aWV3JywgJ2NvbnNvbGUnLCAnbmF0aXZlJywgJ2J1aWxkZXInXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1ByZWZlcmVuY2UgY2F0ZWdvcnkgbmFtZSAoZ2V0X2NvbmZpZy9zZXRfY29uZmlnL3Jlc2V0X2NvbmZpZyBhY3Rpb25zKScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogJ2dlbmVyYWwnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQ29uZmlndXJhdGlvbiBwYXRoIHdpdGhpbiBjYXRlZ29yeSAoZ2V0X2NvbmZpZy9zZXRfY29uZmlnIGFjdGlvbnMgb25seSkuIFVzZSBkb3Qgbm90YXRpb24gZm9yIG5lc3RlZCBwcm9wZXJ0aWVzIChlLmcuLCBcImVkaXRvci5mb250U2l6ZVwiKSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnTmV3IGNvbmZpZ3VyYXRpb24gdmFsdWUgdG8gc2V0IChzZXRfY29uZmlnIGFjdGlvbiBvbmx5KS4gQ2FuIGJlIHN0cmluZywgbnVtYmVyLCBib29sZWFuLCBvciBvYmplY3QuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW51bTogWydnbG9iYWwnLCAnbG9jYWwnLCAnZGVmYXVsdCddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQ29uZmlndXJhdGlvbiBzY29wZTogXCJnbG9iYWxcIiA9IHN5c3RlbS13aWRlIHNldHRpbmdzIHwgXCJsb2NhbFwiID0gcHJvamVjdC1zcGVjaWZpYyBzZXR0aW5ncyB8IFwiZGVmYXVsdFwiID0gZmFjdG9yeSBkZWZhdWx0cycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogJ2dsb2JhbCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsnYWN0aW9uJ10sXG4gICAgICAgICAgICAgICAgICAgIGFueU9mOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczogeyBhY3Rpb246IHsgY29uc3Q6ICdvcGVuX3BhbmVsJyB9IH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczogeyBhY3Rpb246IHsgY29uc3Q6ICdnZXRfY29uZmlnJyB9IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsnY2F0ZWdvcnknXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7IGFjdGlvbjogeyBjb25zdDogJ3NldF9jb25maWcnIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogWydjYXRlZ29yeScsICdwYXRoJywgJ3ZhbHVlJ11cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczogeyBhY3Rpb246IHsgY29uc3Q6ICdyZXNldF9jb25maWcnIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogWydjYXRlZ29yeSddXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdwcmVmZXJlbmNlc19xdWVyeScsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdQUkVGRVJFTkNFUyBRVUVSWTogR2V0IGFsbCBhdmFpbGFibGUgcHJlZmVyZW5jZXMsIGxpc3QgY2F0ZWdvcmllcywgb3Igc2VhcmNoIGZvciBzcGVjaWZpYyBwcmVmZXJlbmNlIHNldHRpbmdzLiBVc2UgdGhpcyBmb3IgcHJlZmVyZW5jZSBkaXNjb3ZlcnkgYW5kIGluc3BlY3Rpb24uJyxcbiAgICAgICAgICAgICAgICBpbnB1dFNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW51bTogWydnZXRfYWxsJywgJ2xpc3RfY2F0ZWdvcmllcycsICdzZWFyY2hfc2V0dGluZ3MnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1F1ZXJ5IGFjdGlvbjogXCJnZXRfYWxsXCIgPSByZXRyaWV2ZSBhbGwgcHJlZmVyZW5jZSBjb25maWd1cmF0aW9ucyB8IFwibGlzdF9jYXRlZ29yaWVzXCIgPSBnZXQgYXZhaWxhYmxlIHByZWZlcmVuY2UgY2F0ZWdvcmllcyB8IFwic2VhcmNoX3NldHRpbmdzXCIgPSBmaW5kIHNldHRpbmdzIGJ5IGtleXdvcmQnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yIGdldF9hbGwgYWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudW06IFsnZ2xvYmFsJywgJ2xvY2FsJywgJ2RlZmF1bHQnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0NvbmZpZ3VyYXRpb24gc2NvcGUgdG8gcXVlcnkgKGdldF9hbGwgYWN0aW9uIG9ubHkpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiAnZ2xvYmFsJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3JpZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnVtOiBbJ2dlbmVyYWwnLCAnZXh0ZXJuYWwtdG9vbHMnLCAnZGF0YS1lZGl0b3InLCAnbGFib3JhdG9yeScsICdleHRlbnNpb25zJywgJ3ByZXZpZXcnLCAnY29uc29sZScsICduYXRpdmUnLCAnYnVpbGRlciddXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1NwZWNpZmljIGNhdGVnb3JpZXMgdG8gaW5jbHVkZSAoZ2V0X2FsbCBhY3Rpb24gb25seSkuIElmIG5vdCBzcGVjaWZpZWQsIGFsbCBjYXRlZ29yaWVzIGFyZSBpbmNsdWRlZC4nXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yIHNlYXJjaF9zZXR0aW5ncyBhY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIGtleXdvcmQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1NlYXJjaCBrZXl3b3JkIGZvciBmaW5kaW5nIHNldHRpbmdzIChzZWFyY2hfc2V0dGluZ3MgYWN0aW9uIG9ubHkpJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVWYWx1ZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdJbmNsdWRlIGN1cnJlbnQgdmFsdWVzIGluIHNlYXJjaCByZXN1bHRzIChzZWFyY2hfc2V0dGluZ3MgYWN0aW9uIG9ubHkpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkOiBbJ2FjdGlvbiddLFxuICAgICAgICAgICAgICAgICAgICBhbnlPZjogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHsgYWN0aW9uOiB7IGNvbnN0OiAnZ2V0X2FsbCcgfSB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHsgYWN0aW9uOiB7IGNvbnN0OiAnbGlzdF9jYXRlZ29yaWVzJyB9IH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczogeyBhY3Rpb246IHsgY29uc3Q6ICdzZWFyY2hfc2V0dGluZ3MnIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogWydrZXl3b3JkJ11cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ3ByZWZlcmVuY2VzX2JhY2t1cCcsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdQUkVGRVJFTkNFUyBCQUNLVVA6IEV4cG9ydCBjdXJyZW50IHByZWZlcmVuY2VzIHRvIEpTT04gZm9ybWF0IG9yIHByZXBhcmUgZm9yIGJhY2t1cCBvcGVyYXRpb25zLiBVc2UgdGhpcyBmb3IgcHJlZmVyZW5jZSBiYWNrdXAgYW5kIHJlc3RvcmUgd29ya2Zsb3dzLicsXG4gICAgICAgICAgICAgICAgaW5wdXRTY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudW06IFsnZXhwb3J0JywgJ3ZhbGlkYXRlX2JhY2t1cCddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQmFja3VwIGFjdGlvbjogXCJleHBvcnRcIiA9IGV4cG9ydCBwcmVmZXJlbmNlcyB0byBKU09OIHwgXCJ2YWxpZGF0ZV9iYWNrdXBcIiA9IGNoZWNrIGJhY2t1cCBmaWxlIGZvcm1hdCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3IgZXhwb3J0IGFjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcmllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudW06IFsnZ2VuZXJhbCcsICdleHRlcm5hbC10b29scycsICdkYXRhLWVkaXRvcicsICdsYWJvcmF0b3J5JywgJ2V4dGVuc2lvbnMnLCAncHJldmlldycsICdjb25zb2xlJywgJ25hdGl2ZScsICdidWlsZGVyJ11cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQ2F0ZWdvcmllcyB0byBleHBvcnQgKGV4cG9ydCBhY3Rpb24gb25seSkuIElmIG5vdCBzcGVjaWZpZWQsIGFsbCBjYXRlZ29yaWVzIGFyZSBleHBvcnRlZC4nXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnVtOiBbJ2dsb2JhbCcsICdsb2NhbCddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQ29uZmlndXJhdGlvbiBzY29wZSB0byBleHBvcnQgKGV4cG9ydCBhY3Rpb24gb25seSknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6ICdnbG9iYWwnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZURlZmF1bHRzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnSW5jbHVkZSBkZWZhdWx0IHZhbHVlcyBpbiBleHBvcnQgKGV4cG9ydCBhY3Rpb24gb25seSknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yIHZhbGlkYXRlX2JhY2t1cCBhY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2t1cERhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0JhY2t1cCBkYXRhIHRvIHZhbGlkYXRlICh2YWxpZGF0ZV9iYWNrdXAgYWN0aW9uIG9ubHkpJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogWydhY3Rpb24nXSxcbiAgICAgICAgICAgICAgICAgICAgYW55T2Y6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7IGFjdGlvbjogeyBjb25zdDogJ2V4cG9ydCcgfSB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHsgYWN0aW9uOiB7IGNvbnN0OiAndmFsaWRhdGVfYmFja3VwJyB9IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsnYmFja3VwRGF0YSddXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgYXN5bmMgZXhlY3V0ZSh0b29sTmFtZTogc3RyaW5nLCBhcmdzOiBhbnkpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICBzd2l0Y2ggKHRvb2xOYW1lKSB7XG4gICAgICAgICAgICBjYXNlICdwcmVmZXJlbmNlc19tYW5hZ2UnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmhhbmRsZVByZWZlcmVuY2VzTWFuYWdlKGFyZ3MpO1xuICAgICAgICAgICAgY2FzZSAncHJlZmVyZW5jZXNfcXVlcnknOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmhhbmRsZVByZWZlcmVuY2VzUXVlcnkoYXJncyk7XG4gICAgICAgICAgICBjYXNlICdwcmVmZXJlbmNlc19iYWNrdXAnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmhhbmRsZVByZWZlcmVuY2VzQmFja3VwKGFyZ3MpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gdG9vbDogJHt0b29sTmFtZX1gKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIE5ldyBjb25zb2xpZGF0ZWQgaGFuZGxlcnNcbiAgICBwcml2YXRlIGFzeW5jIGhhbmRsZVByZWZlcmVuY2VzTWFuYWdlKGFyZ3M6IGFueSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIGNvbnN0IHsgYWN0aW9uIH0gPSBhcmdzO1xuICAgICAgICBcbiAgICAgICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgICAgICAgIGNhc2UgJ29wZW5fcGFuZWwnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLm9wZW5QcmVmZXJlbmNlc1BhbmVsKGFyZ3MudGFiKTtcbiAgICAgICAgICAgIGNhc2UgJ2dldF9jb25maWcnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmdldFByZWZlcmVuY2VzQ29uZmlnKGFyZ3MuY2F0ZWdvcnksIGFyZ3MucGF0aCwgYXJncy5zY29wZSk7XG4gICAgICAgICAgICBjYXNlICdzZXRfY29uZmlnJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5zZXRQcmVmZXJlbmNlc0NvbmZpZyhhcmdzLmNhdGVnb3J5LCBhcmdzLnBhdGgsIGFyZ3MudmFsdWUsIGFyZ3Muc2NvcGUpO1xuICAgICAgICAgICAgY2FzZSAncmVzZXRfY29uZmlnJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5yZXNldFByZWZlcmVuY2VzQ29uZmlnKGFyZ3MuY2F0ZWdvcnksIGFyZ3Muc2NvcGUpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGBVbmtub3duIHByZWZlcmVuY2VzIG1hbmFnZSBhY3Rpb246ICR7YWN0aW9ufWAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgaGFuZGxlUHJlZmVyZW5jZXNRdWVyeShhcmdzOiBhbnkpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICBjb25zdCB7IGFjdGlvbiB9ID0gYXJncztcbiAgICAgICAgXG4gICAgICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICAgICAgICBjYXNlICdnZXRfYWxsJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5nZXRBbGxQcmVmZXJlbmNlcyhhcmdzLnNjb3BlLCBhcmdzLmNhdGVnb3JpZXMpO1xuICAgICAgICAgICAgY2FzZSAnbGlzdF9jYXRlZ29yaWVzJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5saXN0UHJlZmVyZW5jZXNDYXRlZ29yaWVzKCk7XG4gICAgICAgICAgICBjYXNlICdzZWFyY2hfc2V0dGluZ3MnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnNlYXJjaFByZWZlcmVuY2VzU2V0dGluZ3MoYXJncy5rZXl3b3JkLCBhcmdzLmluY2x1ZGVWYWx1ZXMpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGBVbmtub3duIHByZWZlcmVuY2VzIHF1ZXJ5IGFjdGlvbjogJHthY3Rpb259YCB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBoYW5kbGVQcmVmZXJlbmNlc0JhY2t1cChhcmdzOiBhbnkpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICBjb25zdCB7IGFjdGlvbiB9ID0gYXJncztcbiAgICAgICAgXG4gICAgICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICAgICAgICBjYXNlICdleHBvcnQnOlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmV4cG9ydFByZWZlcmVuY2VzKGFyZ3MuY2F0ZWdvcmllcywgYXJncy5zY29wZSwgYXJncy5pbmNsdWRlRGVmYXVsdHMpO1xuICAgICAgICAgICAgY2FzZSAndmFsaWRhdGVfYmFja3VwJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy52YWxpZGF0ZUJhY2t1cERhdGEoYXJncy5iYWNrdXBEYXRhKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBgVW5rbm93biBwcmVmZXJlbmNlcyBiYWNrdXAgYWN0aW9uOiAke2FjdGlvbn1gIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJbXBsZW1lbnRhdGlvbiBtZXRob2RzXG4gICAgcHJpdmF0ZSBhc3luYyBvcGVuUHJlZmVyZW5jZXNQYW5lbCh0YWI/OiBzdHJpbmcpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3RBcmdzID0gdGFiID8gW3RhYl0gOiBbXTtcblxuICAgICAgICAgICAgKEVkaXRvci5NZXNzYWdlLnJlcXVlc3QgYXMgYW55KSgncHJlZmVyZW5jZXMnLCAnb3Blbi1zZXR0aW5ncycsIC4uLnJlcXVlc3RBcmdzKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYOKchSBQcmVmZXJlbmNlcyBwYW5lbCBvcGVuZWQke3RhYiA/IGAgb24gXCIke3RhYn1cIiB0YWJgIDogJyd9YCxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogeyB0YWI6IHRhYiB8fCAnZ2VuZXJhbCcgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkuY2F0Y2goKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBgRmFpbGVkIHRvIG9wZW4gcHJlZmVyZW5jZXMgcGFuZWw6ICR7ZXJyLm1lc3NhZ2V9YCB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGdldFByZWZlcmVuY2VzQ29uZmlnKGNhdGVnb3J5OiBzdHJpbmcsIHBhdGg/OiBzdHJpbmcsIHNjb3BlOiBzdHJpbmcgPSAnZ2xvYmFsJyk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgLy8gVmFsaWRhdGUgY2F0ZWdvcnkgcGFyYW1ldGVyXG4gICAgICAgICAgICBpZiAoIWNhdGVnb3J5IHx8IHR5cGVvZiBjYXRlZ29yeSAhPT0gJ3N0cmluZycgfHwgY2F0ZWdvcnkudHJpbSgpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6ICdDYXRlZ29yeSBpcyByZXF1aXJlZCBhbmQgbXVzdCBiZSBhIG5vbi1lbXB0eSBzdHJpbmcnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB0cmltbWVkQ2F0ZWdvcnkgPSBjYXRlZ29yeS50cmltKCk7XG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0QXJncyA9IFt0cmltbWVkQ2F0ZWdvcnldO1xuICAgICAgICAgICAgaWYgKHBhdGggJiYgdHlwZW9mIHBhdGggPT09ICdzdHJpbmcnICYmIHBhdGgudHJpbSgpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICByZXF1ZXN0QXJncy5wdXNoKHBhdGgudHJpbSgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcXVlc3RBcmdzLnB1c2goc2NvcGUpO1xuXG4gICAgICAgICAgICAoRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCBhcyBhbnkpKCdwcmVmZXJlbmNlcycsICdxdWVyeS1jb25maWcnLCAuLi5yZXF1ZXN0QXJncykudGhlbigoY29uZmlnOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYOKchSBDb25maWd1cmF0aW9uIHJldHJpZXZlZCBmb3IgJHt0cmltbWVkQ2F0ZWdvcnl9JHtwYXRoID8gYC4ke3BhdGgudHJpbSgpfWAgOiAnJ31gLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeTogdHJpbW1lZENhdGVnb3J5LFxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogcGF0aCA/IHBhdGgudHJpbSgpIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkuY2F0Y2goKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBgRmFpbGVkIHRvIGdldCBwcmVmZXJlbmNlIGNvbmZpZzogJHtlcnIubWVzc2FnZX1gIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgc2V0UHJlZmVyZW5jZXNDb25maWcoY2F0ZWdvcnk6IHN0cmluZywgcGF0aDogc3RyaW5nLCB2YWx1ZTogYW55LCBzY29wZTogc3RyaW5nID0gJ2dsb2JhbCcpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIC8vIFZhbGlkYXRlIHJlcXVpcmVkIHBhcmFtZXRlcnNcbiAgICAgICAgICAgIGlmICghY2F0ZWdvcnkgfHwgdHlwZW9mIGNhdGVnb3J5ICE9PSAnc3RyaW5nJyB8fCBjYXRlZ29yeS50cmltKCkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogJ0NhdGVnb3J5IGlzIHJlcXVpcmVkIGFuZCBtdXN0IGJlIGEgbm9uLWVtcHR5IHN0cmluZydcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghcGF0aCB8fCB0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycgfHwgcGF0aC50cmltKCkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogJ1BhdGggaXMgcmVxdWlyZWQgYW5kIG11c3QgYmUgYSBub24tZW1wdHkgc3RyaW5nJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiAnVmFsdWUgaXMgcmVxdWlyZWQgYW5kIGNhbm5vdCBiZSB1bmRlZmluZWQnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB0cmltbWVkQ2F0ZWdvcnkgPSBjYXRlZ29yeS50cmltKCk7XG4gICAgICAgICAgICBjb25zdCB0cmltbWVkUGF0aCA9IHBhdGgudHJpbSgpO1xuXG4gICAgICAgICAgICAoRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCBhcyBhbnkpKCdwcmVmZXJlbmNlcycsICdzZXQtY29uZmlnJywgdHJpbW1lZENhdGVnb3J5LCB0cmltbWVkUGF0aCwgdmFsdWUsIHNjb3BlKS50aGVuKChzdWNjZXNzOiBib29sZWFuKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYOKchSBQcmVmZXJlbmNlIFwiJHt0cmltbWVkQ2F0ZWdvcnl9LiR7dHJpbW1lZFBhdGh9XCIgdXBkYXRlZCBzdWNjZXNzZnVsbHlgLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5OiB0cmltbWVkQ2F0ZWdvcnksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogdHJpbW1lZFBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGVcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBgRmFpbGVkIHRvIHVwZGF0ZSBwcmVmZXJlbmNlIFwiJHt0cmltbWVkQ2F0ZWdvcnl9LiR7dHJpbW1lZFBhdGh9XCIuIFZhbHVlIG1heSBiZSBpbnZhbGlkIG9yIHJlYWQtb25seS5gXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmNhdGNoKChlcnI6IEVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYEVycm9yIHNldHRpbmcgcHJlZmVyZW5jZTogJHtlcnIubWVzc2FnZX1gIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgcmVzZXRQcmVmZXJlbmNlc0NvbmZpZyhjYXRlZ29yeTogc3RyaW5nLCBzY29wZTogc3RyaW5nID0gJ2dsb2JhbCcpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIC8vIFZhbGlkYXRlIGNhdGVnb3J5IHBhcmFtZXRlclxuICAgICAgICAgICAgaWYgKCFjYXRlZ29yeSB8fCB0eXBlb2YgY2F0ZWdvcnkgIT09ICdzdHJpbmcnIHx8IGNhdGVnb3J5LnRyaW0oKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiAnQ2F0ZWdvcnkgaXMgcmVxdWlyZWQgYW5kIG11c3QgYmUgYSBub24tZW1wdHkgc3RyaW5nJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgdHJpbW1lZENhdGVnb3J5ID0gY2F0ZWdvcnkudHJpbSgpO1xuXG4gICAgICAgICAgICAvLyBHZXQgZGVmYXVsdCBjb25maWd1cmF0aW9uIGZpcnN0XG4gICAgICAgICAgICAoRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCBhcyBhbnkpKCdwcmVmZXJlbmNlcycsICdxdWVyeS1jb25maWcnLCB0cmltbWVkQ2F0ZWdvcnksIHVuZGVmaW5lZCwgJ2RlZmF1bHQnKS50aGVuKChkZWZhdWx0Q29uZmlnOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIWRlZmF1bHRDb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBkZWZhdWx0IGNvbmZpZ3VyYXRpb24gZm91bmQgZm9yIGNhdGVnb3J5IFwiJHt0cmltbWVkQ2F0ZWdvcnl9XCJgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gQXBwbHkgZGVmYXVsdCBjb25maWd1cmF0aW9uXG4gICAgICAgICAgICAgICAgcmV0dXJuIChFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0IGFzIGFueSkoJ3ByZWZlcmVuY2VzJywgJ3NldC1jb25maWcnLCB0cmltbWVkQ2F0ZWdvcnksICcnLCBkZWZhdWx0Q29uZmlnLCBzY29wZSk7XG4gICAgICAgICAgICB9KS50aGVuKChzdWNjZXNzOiBib29sZWFuKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYOKchSBQcmVmZXJlbmNlIGNhdGVnb3J5IFwiJHt0cmltbWVkQ2F0ZWdvcnl9XCIgcmVzZXQgdG8gZGVmYXVsdHNgLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5OiB0cmltbWVkQ2F0ZWdvcnksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiAncmVzZXQnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogYEZhaWxlZCB0byByZXNldCBwcmVmZXJlbmNlIGNhdGVnb3J5IFwiJHt0cmltbWVkQ2F0ZWdvcnl9XCIuIENhdGVnb3J5IG1heSBub3Qgc3VwcG9ydCByZXNldCBvcGVyYXRpb24uYFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyOiBFcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGBFcnJvciByZXNldHRpbmcgcHJlZmVyZW5jZXM6ICR7ZXJyLm1lc3NhZ2V9YCB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGdldEFsbFByZWZlcmVuY2VzKHNjb3BlOiBzdHJpbmcgPSAnZ2xvYmFsJywgY2F0ZWdvcmllcz86IHN0cmluZ1tdKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBhdmFpbGFibGVDYXRlZ29yaWVzID0gW1xuICAgICAgICAgICAgICAgICdnZW5lcmFsJyxcbiAgICAgICAgICAgICAgICAnZXh0ZXJuYWwtdG9vbHMnLCBcbiAgICAgICAgICAgICAgICAnZGF0YS1lZGl0b3InLFxuICAgICAgICAgICAgICAgICdsYWJvcmF0b3J5JyxcbiAgICAgICAgICAgICAgICAnZXh0ZW5zaW9ucycsXG4gICAgICAgICAgICAgICAgJ3ByZXZpZXcnLFxuICAgICAgICAgICAgICAgICdjb25zb2xlJyxcbiAgICAgICAgICAgICAgICAnbmF0aXZlJyxcbiAgICAgICAgICAgICAgICAnYnVpbGRlcidcbiAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgIC8vIFVzZSBzcGVjaWZpZWQgY2F0ZWdvcmllcyBvciBhbGwgYXZhaWxhYmxlIG9uZXNcbiAgICAgICAgICAgIGNvbnN0IGNhdGVnb3JpZXNUb1F1ZXJ5ID0gY2F0ZWdvcmllcyB8fCBhdmFpbGFibGVDYXRlZ29yaWVzO1xuICAgICAgICAgICAgY29uc3QgcHJlZmVyZW5jZXM6IGFueSA9IHt9O1xuXG4gICAgICAgICAgICBjb25zdCBxdWVyeVByb21pc2VzID0gY2F0ZWdvcmllc1RvUXVlcnkubWFwKGNhdGVnb3J5ID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKEVkaXRvci5NZXNzYWdlLnJlcXVlc3QgYXMgYW55KSgncHJlZmVyZW5jZXMnLCAncXVlcnktY29uZmlnJywgY2F0ZWdvcnksIHVuZGVmaW5lZCwgc2NvcGUpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKChjb25maWc6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZmVyZW5jZXNbY2F0ZWdvcnldID0gY29uZmlnO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2F0ZWdvcnkgZG9lc24ndCBleGlzdCBvciBhY2Nlc3MgZGVuaWVkXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVmZXJlbmNlc1tjYXRlZ29yeV0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBQcm9taXNlLmFsbChxdWVyeVByb21pc2VzKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBGaWx0ZXIgb3V0IG51bGwgZW50cmllc1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbGlkUHJlZmVyZW5jZXMgPSBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKHByZWZlcmVuY2VzKS5maWx0ZXIoKFtfLCB2YWx1ZV0pID0+IHZhbHVlICE9PSBudWxsKVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYOKchSBSZXRyaWV2ZWQgcHJlZmVyZW5jZXMgZm9yICR7T2JqZWN0LmtleXModmFsaWRQcmVmZXJlbmNlcykubGVuZ3RofSBjYXRlZ29yaWVzYCxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUsXG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0ZWRDYXRlZ29yaWVzOiBjYXRlZ29yaWVzVG9RdWVyeSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGF2YWlsYWJsZUNhdGVnb3JpZXM6IE9iamVjdC5rZXlzKHZhbGlkUHJlZmVyZW5jZXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZmVyZW5jZXM6IHZhbGlkUHJlZmVyZW5jZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdW1tYXJ5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxDYXRlZ29yaWVzOiBPYmplY3Qua2V5cyh2YWxpZFByZWZlcmVuY2VzKS5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGU6IHNjb3BlXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pLmNhdGNoKChlcnI6IEVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYEVycm9yIHJldHJpZXZpbmcgcHJlZmVyZW5jZXM6ICR7ZXJyLm1lc3NhZ2V9YCB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGxpc3RQcmVmZXJlbmNlc0NhdGVnb3JpZXMoKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjYXRlZ29yaWVzID0gW1xuICAgICAgICAgICAgICAgIHsgbmFtZTogJ2dlbmVyYWwnLCBkZXNjcmlwdGlvbjogJ0dlbmVyYWwgZWRpdG9yIHNldHRpbmdzIGFuZCBVSSBwcmVmZXJlbmNlcycgfSxcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdleHRlcm5hbC10b29scycsIGRlc2NyaXB0aW9uOiAnRXh0ZXJuYWwgdG9vbCBpbnRlZ3JhdGlvbnMgYW5kIHBhdGhzJyB9LFxuICAgICAgICAgICAgICAgIHsgbmFtZTogJ2RhdGEtZWRpdG9yJywgZGVzY3JpcHRpb246ICdEYXRhIGVkaXRvciBjb25maWd1cmF0aW9ucyBhbmQgdGVtcGxhdGVzJyB9LFxuICAgICAgICAgICAgICAgIHsgbmFtZTogJ2xhYm9yYXRvcnknLCBkZXNjcmlwdGlvbjogJ0V4cGVyaW1lbnRhbCBmZWF0dXJlcyBhbmQgYmV0YSBmdW5jdGlvbmFsaXR5JyB9LFxuICAgICAgICAgICAgICAgIHsgbmFtZTogJ2V4dGVuc2lvbnMnLCBkZXNjcmlwdGlvbjogJ0V4dGVuc2lvbiBtYW5hZ2VyIGFuZCBwbHVnaW4gc2V0dGluZ3MnIH0sXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAncHJldmlldycsIGRlc2NyaXB0aW9uOiAnR2FtZSBwcmV2aWV3IGFuZCBzaW11bGF0b3Igc2V0dGluZ3MnIH0sXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnY29uc29sZScsIGRlc2NyaXB0aW9uOiAnQ29uc29sZSBwYW5lbCBkaXNwbGF5IGFuZCBsb2dnaW5nIG9wdGlvbnMnIH0sXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnbmF0aXZlJywgZGVzY3JpcHRpb246ICdOYXRpdmUgcGxhdGZvcm0gYnVpbGQgY29uZmlndXJhdGlvbnMnIH0sXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnYnVpbGRlcicsIGRlc2NyaXB0aW9uOiAnQnVpbGQgc3lzdGVtIGFuZCBjb21waWxhdGlvbiBzZXR0aW5ncycgfVxuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBg4pyFIExpc3RlZCAke2NhdGVnb3JpZXMubGVuZ3RofSBhdmFpbGFibGUgcHJlZmVyZW5jZSBjYXRlZ29yaWVzYCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGNhdGVnb3JpZXMsXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsQ291bnQ6IGNhdGVnb3JpZXMubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICB1c2FnZTogJ1VzZSB0aGVzZSBjYXRlZ29yeSBuYW1lcyB3aXRoIHByZWZlcmVuY2VzX21hbmFnZSBvciBwcmVmZXJlbmNlc19xdWVyeSB0b29scydcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBzZWFyY2hQcmVmZXJlbmNlc1NldHRpbmdzKGtleXdvcmQ6IHN0cmluZywgaW5jbHVkZVZhbHVlczogYm9vbGVhbiA9IHRydWUpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgLy8gVmFsaWRhdGUga2V5d29yZCBwYXJhbWV0ZXJcbiAgICAgICAgICAgICAgICBpZiAoIWtleXdvcmQgfHwgdHlwZW9mIGtleXdvcmQgIT09ICdzdHJpbmcnIHx8IGtleXdvcmQudHJpbSgpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6ICdTZWFyY2gga2V5d29yZCBpcyByZXF1aXJlZCBhbmQgbXVzdCBiZSBhIG5vbi1lbXB0eSBzdHJpbmcnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgdHJpbW1lZEtleXdvcmQgPSBrZXl3b3JkLnRyaW0oKTtcbiAgICAgICAgICAgICAgICBjb25zdCBhbGxQcmVmc1Jlc3BvbnNlID0gYXdhaXQgdGhpcy5nZXRBbGxQcmVmZXJlbmNlcygnZ2xvYmFsJyk7XG4gICAgICAgICAgICAgICAgaWYgKCFhbGxQcmVmc1Jlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShhbGxQcmVmc1Jlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IHByZWZlcmVuY2VzID0gYWxsUHJlZnNSZXNwb25zZS5kYXRhPy5wcmVmZXJlbmNlcyB8fCB7fTtcbiAgICAgICAgICAgICAgICBjb25zdCBzZWFyY2hSZXN1bHRzOiBhbnlbXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgLy8gU2VhcmNoIHRocm91Z2ggYWxsIGNhdGVnb3JpZXMgYW5kIHRoZWlyIHNldHRpbmdzXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBbY2F0ZWdvcnksIGNvbmZpZ10gb2YgT2JqZWN0LmVudHJpZXMocHJlZmVyZW5jZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb25maWcgJiYgdHlwZW9mIGNvbmZpZyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoSW5PYmplY3QoY29uZmlnIGFzIGFueSwgdHJpbW1lZEtleXdvcmQsIGNhdGVnb3J5LCAnJywgc2VhcmNoUmVzdWx0cywgaW5jbHVkZVZhbHVlcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYOKchSBGb3VuZCAke3NlYXJjaFJlc3VsdHMubGVuZ3RofSBzZXR0aW5ncyBtYXRjaGluZyBcIiR7dHJpbW1lZEtleXdvcmR9XCJgLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXl3b3JkOiB0cmltbWVkS2V5d29yZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVWYWx1ZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRDb3VudDogc2VhcmNoUmVzdWx0cy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRzOiBzZWFyY2hSZXN1bHRzLnNsaWNlKDAsIDUwKSwgLy8gTGltaXQgcmVzdWx0cyB0byBwcmV2ZW50IG92ZXJ3aGVsbWluZyBvdXRwdXRcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc01vcmVSZXN1bHRzOiBzZWFyY2hSZXN1bHRzLmxlbmd0aCA+IDUwXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBgU2VhcmNoIGZhaWxlZDogJHtlcnJvci5tZXNzYWdlfWBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZWFyY2hJbk9iamVjdChvYmo6IGFueSwga2V5d29yZDogc3RyaW5nLCBjYXRlZ29yeTogc3RyaW5nLCBwYXRoUHJlZml4OiBzdHJpbmcsIHJlc3VsdHM6IGFueVtdLCBpbmNsdWRlVmFsdWVzOiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIGlmICghb2JqIHx8IHR5cGVvZiBvYmogIT09ICdvYmplY3QnIHx8ICFrZXl3b3JkIHx8IHR5cGVvZiBrZXl3b3JkICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbG93ZXJLZXl3b3JkID0ga2V5d29yZC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKG9iaikpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGtleSAhPT0gJ3N0cmluZycpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRQYXRoID0gcGF0aFByZWZpeCA/IGAke3BhdGhQcmVmaXh9LiR7a2V5fWAgOiBrZXk7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5TWF0Y2hlcyA9IGtleS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGxvd2VyS2V5d29yZCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWVNYXRjaGVzID0gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGxvd2VyS2V5d29yZCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKGtleU1hdGNoZXMgfHwgdmFsdWVNYXRjaGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdDogYW55ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnksXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBjdXJyZW50UGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoVHlwZToga2V5TWF0Y2hlcyA/ICh2YWx1ZU1hdGNoZXMgPyAnYm90aCcgOiAna2V5JykgOiAndmFsdWUnXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5jbHVkZVZhbHVlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQudmFsdWVUeXBlID0gdHlwZW9mIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2gocmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gUmVjdXJzaXZlbHkgc2VhcmNoIG5lc3RlZCBvYmplY3RzICh3aXRoIGRlcHRoIGxpbWl0IHRvIHByZXZlbnQgaW5maW5pdGUgcmVjdXJzaW9uKVxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KHZhbHVlKSAmJiBwYXRoUHJlZml4LnNwbGl0KCcuJykubGVuZ3RoIDwgMTApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hJbk9iamVjdCh2YWx1ZSwga2V5d29yZCwgY2F0ZWdvcnksIGN1cnJlbnRQYXRoLCByZXN1bHRzLCBpbmNsdWRlVmFsdWVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAvLyBTa2lwIG9iamVjdHMgdGhhdCBjYW4ndCBiZSBlbnVtZXJhdGVkXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGV4cG9ydFByZWZlcmVuY2VzKGNhdGVnb3JpZXM/OiBzdHJpbmdbXSwgc2NvcGU6IHN0cmluZyA9ICdnbG9iYWwnLCBpbmNsdWRlRGVmYXVsdHM6IGJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAvLyBWYWxpZGF0ZSBzY29wZSBwYXJhbWV0ZXJcbiAgICAgICAgICAgICAgICBjb25zdCB2YWxpZFNjb3BlcyA9IFsnZ2xvYmFsJywgJ2xvY2FsJ107XG4gICAgICAgICAgICAgICAgaWYgKCF2YWxpZFNjb3Blcy5pbmNsdWRlcyhzY29wZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBgSW52YWxpZCBzY29wZSBcIiR7c2NvcGV9XCIuIE11c3QgYmUgb25lIG9mOiAke3ZhbGlkU2NvcGVzLmpvaW4oJywgJyl9YFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIFZhbGlkYXRlIGNhdGVnb3JpZXMgcGFyYW1ldGVyIGlmIHByb3ZpZGVkXG4gICAgICAgICAgICAgICAgaWYgKGNhdGVnb3JpZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGNhdGVnb3JpZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogJ0NhdGVnb3JpZXMgbXVzdCBiZSBhbiBhcnJheSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsaWRDYXRlZ29yaWVzID0gWydnZW5lcmFsJywgJ2V4dGVybmFsLXRvb2xzJywgJ2RhdGEtZWRpdG9yJywgJ2xhYm9yYXRvcnknLCAnZXh0ZW5zaW9ucycsICdwcmV2aWV3JywgJ2NvbnNvbGUnLCAnbmF0aXZlJywgJ2J1aWxkZXInXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW52YWxpZENhdGVnb3JpZXMgPSBjYXRlZ29yaWVzLmZpbHRlcihjYXQgPT4gIXZhbGlkQ2F0ZWdvcmllcy5pbmNsdWRlcyhjYXQpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGludmFsaWRDYXRlZ29yaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBgSW52YWxpZCBjYXRlZ29yaWVzOiAke2ludmFsaWRDYXRlZ29yaWVzLmpvaW4oJywgJyl9LiBWYWxpZCBjYXRlZ29yaWVzIGFyZTogJHt2YWxpZENhdGVnb3JpZXMuam9pbignLCAnKX1gXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGFsbFByZWZzUmVzcG9uc2UgPSBhd2FpdCB0aGlzLmdldEFsbFByZWZlcmVuY2VzKHNjb3BlLCBjYXRlZ29yaWVzKTtcbiAgICAgICAgICAgICAgICBpZiAoIWFsbFByZWZzUmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGFsbFByZWZzUmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgZXhwb3J0RGF0YTogYW55ID0ge1xuICAgICAgICAgICAgICAgICAgICBtZXRhZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXhwb3J0RGF0ZTogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGU6IHNjb3BlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZURlZmF1bHRzOiBpbmNsdWRlRGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2Nvc1ZlcnNpb246IChFZGl0b3IgYXMgYW55KS52ZXJzaW9ucz8uY29jb3MgfHwgJ1Vua25vd24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXhwb3J0ZWRDYXRlZ29yaWVzOiBPYmplY3Qua2V5cyhhbGxQcmVmc1Jlc3BvbnNlLmRhdGE/LnByZWZlcmVuY2VzIHx8IHt9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RlZENhdGVnb3JpZXM6IGNhdGVnb3JpZXMgfHwgJ2FsbCdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcHJlZmVyZW5jZXM6IGFsbFByZWZzUmVzcG9uc2UuZGF0YT8ucHJlZmVyZW5jZXMgfHwge31cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgLy8gSW5jbHVkZSBkZWZhdWx0cyBpZiByZXF1ZXN0ZWRcbiAgICAgICAgICAgICAgICBpZiAoaW5jbHVkZURlZmF1bHRzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWZhdWx0c1Jlc3BvbnNlID0gYXdhaXQgdGhpcy5nZXRBbGxQcmVmZXJlbmNlcygnZGVmYXVsdCcsIGNhdGVnb3JpZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlZmF1bHRzUmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cG9ydERhdGEuZGVmYXVsdHMgPSBkZWZhdWx0c1Jlc3BvbnNlLmRhdGE/LnByZWZlcmVuY2VzIHx8IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBvcnREYXRhLm1ldGFkYXRhLmRlZmF1bHRzV2FybmluZyA9ICdDb3VsZCBub3QgcmV0cmlldmUgZGVmYXVsdCBwcmVmZXJlbmNlcyc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleHBvcnREYXRhLm1ldGFkYXRhLmRlZmF1bHRzV2FybmluZyA9ICdFcnJvciByZXRyaWV2aW5nIGRlZmF1bHQgcHJlZmVyZW5jZXMnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QganNvbkRhdGEgPSBKU09OLnN0cmluZ2lmeShleHBvcnREYXRhLCBudWxsLCAyKTtcbiAgICAgICAgICAgICAgICBjb25zdCBleHBvcnRQYXRoID0gYGNvY29zX3ByZWZlcmVuY2VzXyR7c2NvcGV9XyR7RGF0ZS5ub3coKX0uanNvbmA7XG5cbiAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYOKchSBQcmVmZXJlbmNlcyBleHBvcnRlZCBmb3IgJHtleHBvcnREYXRhLm1ldGFkYXRhLmV4cG9ydGVkQ2F0ZWdvcmllcy5sZW5ndGh9IGNhdGVnb3JpZXNgLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleHBvcnRQYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0YWRhdGE6IGV4cG9ydERhdGEubWV0YWRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVmZXJlbmNlczogZXhwb3J0RGF0YS5wcmVmZXJlbmNlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzb25EYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVNpemU6IEJ1ZmZlci5ieXRlTGVuZ3RoKGpzb25EYXRhLCAndXRmOCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3VtbWFyeToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsQ2F0ZWdvcmllczogZXhwb3J0RGF0YS5tZXRhZGF0YS5leHBvcnRlZENhdGVnb3JpZXMubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlOiBzY29wZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlRGVmYXVsdHM6IGluY2x1ZGVEZWZhdWx0cyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYXNEZWZhdWx0czogISFleHBvcnREYXRhLmRlZmF1bHRzXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBgRXhwb3J0IGZhaWxlZDogJHtlcnJvci5tZXNzYWdlfWBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyB2YWxpZGF0ZUJhY2t1cERhdGEoYmFja3VwRGF0YTogYW55KTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbGlkYXRpb24gPSB7XG4gICAgICAgICAgICAgICAgICAgIGlzVmFsaWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yczogW10gYXMgc3RyaW5nW10sXG4gICAgICAgICAgICAgICAgICAgIHdhcm5pbmdzOiBbXSBhcyBzdHJpbmdbXSxcbiAgICAgICAgICAgICAgICAgICAgbWV0YWRhdGE6IG51bGwgYXMgYW55XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIGJhY2t1cERhdGEgaXMgcHJvdmlkZWRcbiAgICAgICAgICAgICAgICBpZiAoYmFja3VwRGF0YSA9PT0gdW5kZWZpbmVkIHx8IGJhY2t1cERhdGEgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbi5pc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb24uZXJyb3JzLnB1c2goJ0JhY2t1cCBkYXRhIGlzIHJlcXVpcmVkIGFuZCBjYW5ub3QgYmUgbnVsbCBvciB1bmRlZmluZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiAnQmFja3VwIGRhdGEgaXMgcmVxdWlyZWQgZm9yIHZhbGlkYXRpb24nXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgYmFzaWMgc3RydWN0dXJlXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBiYWNrdXBEYXRhICE9PSAnb2JqZWN0JyB8fCBBcnJheS5pc0FycmF5KGJhY2t1cERhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb24uaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uLmVycm9ycy5wdXNoKCdCYWNrdXAgZGF0YSBtdXN0IGJlIGEgdmFsaWQgb2JqZWN0IChub3QgYXJyYXkgb3IgcHJpbWl0aXZlIHR5cGUpJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIG1ldGFkYXRhXG4gICAgICAgICAgICAgICAgICAgIGlmIChiYWNrdXBEYXRhLm1ldGFkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGJhY2t1cERhdGEubWV0YWRhdGEgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbi5lcnJvcnMucHVzaCgnTWV0YWRhdGEgbXVzdCBiZSBhbiBvYmplY3QnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uLmlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbi5tZXRhZGF0YSA9IGJhY2t1cERhdGEubWV0YWRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFiYWNrdXBEYXRhLm1ldGFkYXRhLmV4cG9ydERhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbi53YXJuaW5ncy5wdXNoKCdNaXNzaW5nIGV4cG9ydCBkYXRlIGluIG1ldGFkYXRhJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYmFja3VwRGF0YS5tZXRhZGF0YS5leHBvcnREYXRlICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uLndhcm5pbmdzLnB1c2goJ0V4cG9ydCBkYXRlIHNob3VsZCBiZSBhIHN0cmluZycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWJhY2t1cERhdGEubWV0YWRhdGEuc2NvcGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbi53YXJuaW5ncy5wdXNoKCdNaXNzaW5nIHNjb3BlIGluZm9ybWF0aW9uIGluIG1ldGFkYXRhJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghWydnbG9iYWwnLCAnbG9jYWwnLCAnZGVmYXVsdCddLmluY2x1ZGVzKGJhY2t1cERhdGEubWV0YWRhdGEuc2NvcGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb24ud2FybmluZ3MucHVzaCgnSW52YWxpZCBzY29wZSB2YWx1ZSBpbiBtZXRhZGF0YScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiYWNrdXBEYXRhLm1ldGFkYXRhLmNvY29zVmVyc2lvbiAmJiB0eXBlb2YgYmFja3VwRGF0YS5tZXRhZGF0YS5jb2Nvc1ZlcnNpb24gIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb24ud2FybmluZ3MucHVzaCgnQ29jb3MgdmVyc2lvbiBzaG91bGQgYmUgYSBzdHJpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uLndhcm5pbmdzLnB1c2goJ05vIG1ldGFkYXRhIGZvdW5kIGluIGJhY2t1cCBmaWxlJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBmb3IgcHJlZmVyZW5jZXMgZGF0YVxuICAgICAgICAgICAgICAgICAgICBpZiAoIWJhY2t1cERhdGEucHJlZmVyZW5jZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb24uZXJyb3JzLnB1c2goJ05vIHByZWZlcmVuY2VzIGRhdGEgZm91bmQgaW4gYmFja3VwJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uLmlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYmFja3VwRGF0YS5wcmVmZXJlbmNlcyAhPT0gJ29iamVjdCcgfHwgQXJyYXkuaXNBcnJheShiYWNrdXBEYXRhLnByZWZlcmVuY2VzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbi5lcnJvcnMucHVzaCgnUHJlZmVyZW5jZXMgZGF0YSBtdXN0IGJlIGFuIG9iamVjdCAobm90IGFycmF5IG9yIHByaW1pdGl2ZSB0eXBlKScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbi5pc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDb3VudCBjYXRlZ29yaWVzIGFuZCB2YWxpZGF0ZSBzdHJ1Y3R1cmVcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhdGVnb3J5Q291bnQgPSBPYmplY3Qua2V5cyhiYWNrdXBEYXRhLnByZWZlcmVuY2VzKS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2F0ZWdvcnlDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb24ud2FybmluZ3MucHVzaCgnQmFja3VwIGNvbnRhaW5zIG5vIHByZWZlcmVuY2UgY2F0ZWdvcmllcycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBWYWxpZGF0ZSBjYXRlZ29yeSBuYW1lc1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsaWRDYXRlZ29yaWVzID0gWydnZW5lcmFsJywgJ2V4dGVybmFsLXRvb2xzJywgJ2RhdGEtZWRpdG9yJywgJ2xhYm9yYXRvcnknLCAnZXh0ZW5zaW9ucycsICdwcmV2aWV3JywgJ2NvbnNvbGUnLCAnbmF0aXZlJywgJ2J1aWxkZXInXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGludmFsaWRDYXRlZ29yaWVzID0gT2JqZWN0LmtleXMoYmFja3VwRGF0YS5wcmVmZXJlbmNlcykuZmlsdGVyKGNhdCA9PiAhdmFsaWRDYXRlZ29yaWVzLmluY2x1ZGVzKGNhdCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGludmFsaWRDYXRlZ29yaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uLndhcm5pbmdzLnB1c2goYFVua25vd24gY2F0ZWdvcmllcyBmb3VuZDogJHtpbnZhbGlkQ2F0ZWdvcmllcy5qb2luKCcsICcpfWApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGDinIUgQmFja3VwIHZhbGlkYXRpb24gY29tcGxldGVkOiAke3ZhbGlkYXRpb24uaXNWYWxpZCA/ICdWYWxpZCcgOiAnSW52YWxpZCd9YCxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNWYWxpZDogdmFsaWRhdGlvbi5pc1ZhbGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzOiB2YWxpZGF0aW9uLmVycm9ycyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdhcm5pbmdzOiB2YWxpZGF0aW9uLndhcm5pbmdzLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0YWRhdGE6IHZhbGlkYXRpb24ubWV0YWRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdW1tYXJ5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzRXJyb3JzOiB2YWxpZGF0aW9uLmVycm9ycy5sZW5ndGggPiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc1dhcm5pbmdzOiB2YWxpZGF0aW9uLndhcm5pbmdzLmxlbmd0aCA+IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnlDb3VudDogYmFja3VwRGF0YT8ucHJlZmVyZW5jZXMgPyBPYmplY3Qua2V5cyhiYWNrdXBEYXRhLnByZWZlcmVuY2VzKS5sZW5ndGggOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yQ291bnQ6IHZhbGlkYXRpb24uZXJyb3JzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3YXJuaW5nQ291bnQ6IHZhbGlkYXRpb24ud2FybmluZ3MubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBgVmFsaWRhdGlvbiBmYWlsZWQ6ICR7ZXJyb3IubWVzc2FnZX1gXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn0iXX0=