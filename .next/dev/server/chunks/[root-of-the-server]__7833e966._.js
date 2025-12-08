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
"[project]/lib/storage.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "storage",
    ()=>storage
]);
// In-memory data stores
let classes = [
    {
        id: "1",
        name: "Mathematics 101",
        teacher: "Dr. Johnson",
        numberOfStudents: 25,
        description: "Introduction to Calculus"
    }
];
let students = [
    {
        id: "1",
        name: "John Doe",
        className: "Mathematics 101",
        email: "john@example.com",
        status: "Active"
    }
];
let attendance = [];
const storage = {
    // Classes
    getAllClasses: ()=>classes,
    getClassById: (id)=>classes.find((c)=>c.id === id),
    createClass: (classData)=>{
        const newClass = {
            ...classData,
            id: Date.now().toString()
        };
        classes.push(newClass);
        return newClass;
    },
    deleteClass: (id)=>{
        const initialLength = classes.length;
        classes = classes.filter((c)=>c.id !== id);
        return initialLength !== classes.length;
    },
    // Students
    getAllStudents: ()=>students,
    getStudentById: (id)=>students.find((s)=>s.id === id),
    createStudent: (studentData)=>{
        const newStudent = {
            ...studentData,
            id: Date.now().toString()
        };
        students.push(newStudent);
        // Update class student count
        const studentClass = classes.find((c)=>c.name === studentData.className);
        if (studentClass) {
            studentClass.numberOfStudents++;
        }
        return newStudent;
    },
    deleteStudent: (id)=>{
        const student = students.find((s)=>s.id === id);
        if (student) {
            const studentClass = classes.find((c)=>c.name === student.className);
            if (studentClass) {
                studentClass.numberOfStudents--;
            }
        }
        const initialLength = students.length;
        students = students.filter((s)=>s.id !== id);
        return initialLength !== students.length;
    },
    // Attendance
    getAttendance: (filters)=>{
        let results = attendance;
        if (filters?.className) {
            results = results.filter((a)=>a.className === filters.className);
        }
        if (filters?.date) {
            results = results.filter((a)=>a.date === filters.date);
        }
        return results;
    },
    saveAttendance: (records)=>{
        const newRecords = records.map((r)=>({
                ...r,
                id: `${Date.now()}-${Math.random()}`
            }));
        attendance.push(...newRecords);
        return newRecords;
    }
};
}),
"[project]/app/api/students/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/storage.ts [app-route] (ecmascript)");
;
;
async function GET() {
    try {
        const students = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storage"].getAllStudents();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(students);
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to fetch students"
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        // Validate input
        if (!body.name || !body.className) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Name and class name are required"
            }, {
                status: 400
            });
        }
        const newStudent = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storage"].createStudent({
            name: body.name,
            className: body.className,
            email: body.email || "",
            status: body.status || "Active"
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(newStudent, {
            status: 201
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to create student"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7833e966._.js.map