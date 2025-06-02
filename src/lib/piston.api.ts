export const supportedLanguages = 
[
    {
      "language": "bash",
      "version": "5.2.0",
      "aliases": [
        "sh"
      ]
    },
    {
      "language": "csharp.net",
      "version": "5.0.201",
      "aliases": [
        "csharp",
        "c#",
        "cs",
        "c#.net",
        "cs.net",
        "c#-dotnet",
        "cs-dotnet",
        "csharp-dotnet",
        "dotnet-c#",
        "dotnet-cs",
        "dotnet-csharp"
      ],
      "runtime": "dotnet"
    },
    {
      "language": "c",
      "version": "10.2.0",
      "aliases": [
        "gcc"
      ],
      "runtime": "gcc"
    },
    {
      "language": "c++",
      "version": "10.2.0",
      "aliases": [
        "cpp",
        "g++"
      ],
      "runtime": "gcc"
    },
    {
      "language": "go",
      "version": "1.16.2",
      "aliases": [
        "go",
        "golang"
      ]
    },
    {
      "language": "java",
      "version": "15.0.2",
      "aliases": []
    },
    {
      "language": "javascript",
      "version": "18.15.0",
      "aliases": [
        "node-javascript",
        "node-js",
        "javascript",
        "js"
      ],
      "runtime": "node"
    },
    {
      "language": "php",
      "version": "8.2.3",
      "aliases": []
    },
    {
      "language": "powershell",
      "version": "7.1.4",
      "aliases": [
        "ps",
        "pwsh",
        "ps1"
      ],
      "runtime": "pwsh"
    },
    {
      "language": "python",
      "version": "3.10.0",
      "aliases": [
        "py",
        "py3",
        "python3",
        "python3.10"
      ]
    },
    {
      "language": "ruby",
      "version": "3.0.1",
      "aliases": [
        "ruby3",
        "rb"
      ]
    },
    {
      "language": "rust",
      "version": "1.68.2",
      "aliases": [
        "rs"
      ]
    },
    {
      "language": "sqlite3",
      "version": "3.36.0",
      "aliases": [
        "sqlite",
        "sql"
      ]
    },
    {
      "language": "typescript",
      "version": "5.0.3",
      "aliases": [
        "ts",
        "node-ts",
        "tsc",
        "typescript5",
        "ts5"
      ]
    }
  ]

//  send post request to piston api
//  url: https://emkc.org/api/v2/piston/execute
//  body: 
//  {
//     "language": "js",
//     "version": "15.10.0",
//     "files": [
//         {
//             "content": "console.log(process.argv) // your code here"
//         }
//     ]
//  }
//  response::
// HTTP/1.1 200 OK
// Content-Type: application/json

// {
//     "language": "js",
//     "version": "15.10.0",
//     "run": {
//         "stdout": "[\n  '/piston/packages/node/15.10.0/bin/node',\n  '/piston/jobs/9501b09d-0105-496b-b61a-e5148cf66384/my_cool_code.js',\n  '1',\n  '2',\n  '3'\n]\n",
//         "stderr": "",
//         "output": "[\n  '/piston/packages/node/15.10.0/bin/node',\n  '/piston/jobs/9501b09d-0105-496b-b61a-e5148cf66384/my_cool_code.js',\n  '1',\n  '2',\n  '3'\n]\n",
//         "code": 0,
//         "signal": null,
//         "message": null,
//         "status": null,
//         "cpu_time": 8,
//         "wall_time": 154,
//         "memory": 1160000
//     }
// }