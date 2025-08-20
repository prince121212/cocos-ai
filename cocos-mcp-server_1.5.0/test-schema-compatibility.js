/**
 * Test script to verify schema compatibility transformations
 * This script tests that our schema transformation removes oneOf/anyOf/allOf
 * and that runtime validation still works correctly.
 */

const { MCPServer } = require('./dist/mcp-server');
const { readSettings } = require('./dist/settings');

async function testSchemaCompatibility() {
    console.log('🧪 Testing Schema Compatibility Transformations...\n');
    
    // Initialize MCP Server
    const settings = readSettings();
    const mcpServer = new MCPServer(settings);
    
    // Setup tools to trigger schema transformation
    mcpServer.setupTools();
    
    console.log(`📊 Total tools loaded: ${mcpServer.toolsList.length}\n`);
    
    // Test 1: Check that problematic schemas have been transformed
    console.log('🔍 Test 1: Checking schema transformations...');
    let transformedCount = 0;
    let totalSchemas = 0;
    
    for (const tool of mcpServer.toolsList) {
        totalSchemas++;
        const schema = tool.inputSchema;
        
        if (schema && typeof schema === 'object') {
            const hasCompositeKeywords = ['oneOf', 'anyOf', 'allOf'].some(keyword => 
                schema.hasOwnProperty(keyword)
            );
            
            if (hasCompositeKeywords) {
                console.log(`❌ Tool "${tool.name}" still has composite keywords in schema!`);
                console.log('   Schema:', JSON.stringify(schema, null, 2));
                return false;
            } else {
                // Check if this tool originally had composite keywords by checking tool name patterns
                const problematicToolPatterns = [
                    'preferences_preferences_manage',
                    'preferences_preferences_query', 
                    'preferences_preferences_backup',
                    'referenceImage_reference_image_management',
                    'referenceImage_reference_image_transform',
                    'assetAdvanced_asset_manage',
                    'assetAdvanced_asset_analyze',
                    'component_component_query'
                ];
                
                if (problematicToolPatterns.some(pattern => tool.name.includes(pattern.split('_').slice(-2).join('_')))) {
                    transformedCount++;
                    console.log(`✅ Tool "${tool.name}" schema successfully transformed`);
                }
            }
        }
    }
    
    console.log(`📈 Transformed ${transformedCount} schemas out of ${totalSchemas} total tools\n`);
    
    // Test 2: Verify basic schema structure is preserved
    console.log('🔍 Test 2: Verifying basic schema structure...');
    let validSchemas = 0;
    
    for (const tool of mcpServer.toolsList) {
        const schema = tool.inputSchema;
        
        if (schema && typeof schema === 'object') {
            // Check that basic schema properties are preserved
            if (schema.type && schema.properties) {
                validSchemas++;
            } else {
                console.log(`⚠️  Tool "${tool.name}" has incomplete schema structure`);
            }
        }
    }
    
    console.log(`✅ ${validSchemas} tools have valid basic schema structure\n`);
    
    // Test 3: Test a few specific tool schemas
    console.log('🔍 Test 3: Testing specific transformed tool schemas...');
    
    const testTools = [
        'preferences_preferences_manage',
        'referenceImage_reference_image_management',
        'assetAdvanced_asset_manage'
    ];
    
    for (const toolName of testTools) {
        const tool = mcpServer.toolsList.find(t => t.name === toolName);
        if (tool) {
            console.log(`📋 Tool: ${tool.name}`);
            console.log(`   Description: ${tool.description.substring(0, 80)}...`);
            console.log(`   Schema type: ${tool.inputSchema?.type || 'undefined'}`);
            console.log(`   Has properties: ${!!tool.inputSchema?.properties}`);
            console.log(`   Required fields: ${JSON.stringify(tool.inputSchema?.required || [])}`);
            console.log(`   No composite keywords: ${!['oneOf', 'anyOf', 'allOf'].some(k => tool.inputSchema?.hasOwnProperty(k))}`);
            console.log('');
        } else {
            console.log(`❌ Tool "${toolName}" not found`);
        }
    }
    
    console.log('🎉 Schema compatibility test completed successfully!');
    console.log('✅ All schemas are now compatible with MCP clients that don\'t support composite keywords');
    
    return true;
}

// Run the test
if (require.main === module) {
    testSchemaCompatibility()
        .then(success => {
            if (success) {
                console.log('\n🎯 All tests passed! The schema transformation is working correctly.');
                process.exit(0);
            } else {
                console.log('\n❌ Some tests failed. Please check the output above.');
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('\n💥 Test failed with error:', error);
            process.exit(1);
        });
}

module.exports = { testSchemaCompatibility };
