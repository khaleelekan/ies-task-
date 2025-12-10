module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/search/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@neondatabase/serverless/index.mjs [app-route] (ecmascript)");
;
;
// Initialize Neon database connection
const sql = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["neon"])(process.env.DATABASE_URL);
async function GET(request) {
    try {
        console.log('Search API called');
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q')?.trim();
        const limit = parseInt(searchParams.get('limit') || '10');
        console.log('Search query:', query);
        // Validate search query
        if (!query || query.length < 2) {
            console.log('Query too short');
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Search query must be at least 2 characters long',
                results: []
            }, {
                status: 400
            });
        }
        // Check if database connection is available
        if (!process.env.DATABASE_URL) {
            console.error('DATABASE_URL is not set');
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Database connection not configured',
                message: 'DATABASE_URL environment variable is missing'
            }, {
                status: 500
            });
        }
        const searchPattern = `%${query}%`;
        console.log('Executing search with pattern:', searchPattern);
        // Execute the search query - UPDATED TO MATCH YOUR SCHEMA
        const results = await sql`
      -- Search students (using your actual schema)
      SELECT 
        id,
        'student' as type,
        name as title,
        email as subtitle,
        class_name as description,
        created_at
      FROM students 
      WHERE name ILIKE ${searchPattern}
         OR email ILIKE ${searchPattern}
         OR class_name ILIKE ${searchPattern}
      
      UNION ALL
      
      -- Search classes (using your actual schema)
      SELECT 
        id,
        'class' as type,
        name as title,
        teacher as subtitle,
        description,
        created_at
      FROM classes 
      WHERE name ILIKE ${searchPattern}
         OR teacher ILIKE ${searchPattern}
         OR description ILIKE ${searchPattern}
      
      UNION ALL
      
      -- Search attendance (using your actual schema)
      SELECT 
        id,
        'attendance' as type,
        student_name || ' - ' || class_name as title,
        TO_CHAR(date, 'Mon DD, YYYY') as subtitle,
        'Status: ' || status as description,
        created_at
      FROM attendance 
      WHERE student_name ILIKE ${searchPattern}
         OR class_name ILIKE ${searchPattern}
      
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
        console.log('Search returned', results.length, 'results');
        // Format results for the frontend
        const formattedResults = results.map((result)=>{
            let icon = '🔍';
            let href = '';
            switch(result.type){
                case 'student':
                    icon = '👤';
                    href = `/students/${result.id}`;
                    break;
                case 'class':
                    icon = '📚';
                    href = `/classes/${result.id}`;
                    break;
                case 'attendance':
                    icon = '✅';
                    href = `/attendance`;
                    break;
            }
            return {
                id: result.id,
                type: result.type,
                title: result.title,
                subtitle: result.subtitle,
                description: result.description || '',
                icon,
                href,
                createdAt: result.created_at
            };
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            query,
            total: formattedResults.length,
            results: formattedResults
        });
    } catch (error) {
        console.error('Search API error details:', error);
        // Log specific error information
        if (error instanceof Error) {
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to perform search',
            message: error instanceof Error ? error.message : 'Unknown error',
            details: ("TURBOPACK compile-time truthy", 1) ? String(error) : "TURBOPACK unreachable"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4d58b462._.js.map