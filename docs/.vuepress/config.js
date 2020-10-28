const path = require('path');
module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                '@alias': path.join(__dirname, '/public/images')
            }
        }
    },
    title: 'CO2-blog',
    description: 'Just playing around',
    // 注入到当前页面的 HTML <head> 中的标签
    head: [
        ['link', { rel: 'icon', href: '/favicon.ico' }], // 增加一个自定义的 favicon(网页标签的图标)
    ],
    base: '/blog/', // 这是部署到github相关的配置 下面会讲
    markdown: {
        lineNumbers: true // 代码块显示行号
    },
    themeConfig: {
        sidebarDepth: 2, // e'b将同时提取markdown中h2 和 h3 标题，显示在侧边栏上。
        lastUpdated: 'Last Updated', // 文档更新时间：每个文件git最后提交的时间
        nav: [
            { text: '算法', link: '/algorithm/' },
            { text: 'JavaScript', link: '/adancedJs/' },
            { text: '手写系列', link: '/wheels/' },
            { text: 'CSS/图形学', link: '/cssSecret/' },
            { text: '框架', link: '/frameworks/' },
            { text: '工程化', link: '/engineering/' },
            { text: '执行环境', link: '/executionEnvironment/' },
            { text: '源码分析', link: '/soundcode/' },
            { text: '业务场景', link: '/business/' },
            { text: '读书', link: '/bookNotes/' },
            { text: 'GitHub', link: 'https://github.com/CO2-2020' }
        ],
        activeHeaderLinks: true, // 默认值：true
        sidebar: {
            '/algorithm/': [
                {
                    title: '排序',   // 必要的
                    path: '/algorithm/sort/sorts',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
                    collapsable: true, // 可选的, 默认值是 true,
                    sidebarDepth: 1,    // 可选的, 默认值是 1
                    children: [
                        'sort/sorts',
                        'sort/sortsHard',
                    ]
                },
                {
                    title: '字符串',   // 必要的
                    path: '/algorithm/string/string',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
                    collapsable: true, // 可选的, 默认值是 true,
                    sidebarDepth: 1,    // 可选的, 默认值是 1
                    children: [
                        'string/string'
                    ]
                },
                {
                    title: '递归',   // 必要的
                    path: '/algorithm/recursion/recursion',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
                    collapsable: true, // 可选的, 默认值是 true,
                    sidebarDepth: 1,    // 可选的, 默认值是 1
                    children: [
                        'recursion/recursion'
                    ]
                },
                {
                    title: '其他',   // 必要的
                    path: '/algorithm/other/other',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
                    collapsable: true, // 可选的, 默认值是 true,
                    sidebarDepth: 1,    // 可选的, 默认值是 1
                    children: [
                        'other/other'
                    ]
                },
                // 'Sort',
                // 'Trie'
            ],
            '/adancedJs/': [
                {
                    title: 'JavaScript',   // 必要的
                    path: '/adancedJs/base/closure',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
                    collapsable: true, // 可选的, 默认值是 true,
                    sidebarDepth: 1,    // 可选的, 默认值是 1
                    children: [
                        'base/closure',
                        'base/array_like_object',
                    ]
                },
                {
                    title: 'HTTP',   // 必要的
                    path: '/adancedJs/HTTP/HttpSecurity',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
                    collapsable: true, // 可选的, 默认值是 true,
                    sidebarDepth: 1,    // 可选的, 默认值是 1
                    children: [
                        'HTTP/HttpSecurity',
                    ]
                },
            ],
            '/wheels/': [
                // '',
                'promise/Promise.allSettled.md',
                'promise/Promise.md',
                'base/base.md',
                'base/currying.md',
                'base/debounce_throttle.md',
                'base/evnetemitter.md',
                'base/deepClone.md',
            ],
            '/engineering/': [
                // '',
                // 'Webpack',
                {
                    title: 'webpack',   // 必要的
                    path: '/engineering/webpack/webpack',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
                    collapsable: true, // 可选的, 默认值是 true,
                    sidebarDepth: 1,    // 可选的, 默认值是 1
                    children: [
                        'webpack/webpack',
                        'webpack/webpackCombat',
                    ]
                },
            ],
            '/cssSecret/': [
                // '',
                'css',
                'webgl'
            ],
            '/executionEnvironment/': [
                // '',
                'Node',
                'browser'
            ],
            '/frameworks/': [
                // '',
                {
                    title: 'vue',   // 必要的
                    path: '/frameworks/Vue/VuePrinciple',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
                    collapsable: true, // 可选的, 默认值是 true,
                    sidebarDepth: 1,    // 可选的, 默认值是 1
                    children: [
                        'Vue/VuePrinciple',
                        'Vue/VueCombat',
                        
                    ]
                },

            ],
            '/soundcode/': [
                {
                    title: 'vue',   // 必要的
                    path: '/soundcode/vue/dom-diff',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
                    collapsable: true, // 可选的, 默认值是 true,
                    sidebarDepth: 1,    // 可选的, 默认值是 1
                    children: [
                        'vue/dom-diff',
                    ]
                },
                {
                    title: 'webpack',   // 必要的
                    path: '/soundcode/webpack/webpack5',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
                    collapsable: true, // 可选的, 默认值是 true,
                    sidebarDepth: 1,    // 可选的, 默认值是 1
                    children: [
                        'webpack/webpack5',
                    ]
                }
            ],
            '/business/': [
                {
                    title: '文件上传',   // 必要的
                    path: '/business/file/file',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
                    collapsable: true, // 可选的, 默认值是 true,
                    sidebarDepth: 1,    // 可选的, 默认值是 1
                    children: [
                        'file/file',
                    ]
                },
                {
                    title: '性能优化',   // 必要的
                    path: '/business/performance/performance',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
                    collapsable: true, // 可选的, 默认值是 true,
                    sidebarDepth: 1,    // 可选的, 默认值是 1
                    children: [
                        'performance/performance',
                    ]
                },
                {
                    title: '监控',   // 必要的
                    path: '/business/monitor/monitor',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
                    collapsable: true, // 可选的, 默认值是 true,
                    sidebarDepth: 1,    // 可选的, 默认值是 1
                    children: [
                        'monitor/monitor1',
                        'monitor/monitor',
                    ]
                }
            ],

            '/bookNotes/': [
                '算法',
                'JavaScript',
                'TypeScript',
                'Vue',
                'Node',
                'CSS',
                'HTTP',
                '浏览器',
                '正则',
                '操作系统',

            ]

        }
        // sidebar: [
        //     {
        //         title: 'Group 1',   // 必要的
        //         path: '/algorithm/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
        //         collapsable: false, // 可选的, 默认值是 true,
        //         sidebarDepth: 1,    // 可选的, 默认值是 1
        //         children: [
        //             '/'
        //         ]
        //     }
        // ]
    }
};
