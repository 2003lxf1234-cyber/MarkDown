
# 项目结构
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Editor.tsx       # Markdown 编辑器（含工具栏、目录）
│   │   ├── Preview.tsx      # 实时预览（含代码高亮）
│   │   ├── Sidebar.tsx      # 侧边栏（文件夹、笔记列表）
│   │   └── TagManager.tsx   # 标签管理组件
│   ├── services/
│   │   └── storage.ts       # LocalStorage 存储服务
│   ├── types/
│   │   └── index.ts         # TypeScript 类型定义
│   ├── App.tsx              # 主应用组件
│   ├── main.tsx             # 入口文件
│   └── index.css            # 全局样式
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── vite.config.ts