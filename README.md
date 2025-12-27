# New Year Celebration 🎆

> 一个自动更新的新年庆祝网站，从2024年的第一个项目发展为现代化的庆祝页面。

A self-updating New Year celebration website, evolved from my first project in 2024 to a modern celebration page.

## ✨ Features

- **自动年份更新**: 根据当前日期自动显示正确的年份
- **倒计时功能**: 实时显示距离新年的倒计时
- **烟花效果**: 精美的Canvas烟花动画
- **生肖祝福**: 根据年份显示对应的生肖祝福语
- **彩蛋**: 访问 `/old/` 可以查看2024年的原始版本

## 🚀 Live Demo

- **主页**: https://newyear-d1x.pages.dev/
- **2024原始版**: https://newyear-d1x.pages.dev/old/

## 📁 Project Structure

```
NewYear/
├── index.html          # 2026年新版主页 (自动更新年份)
├── old/                # 2024年原始版本 (彩蛋)
│   ├── index.html      # 原始的2024龙年庆祝页面
│   ├── README.md       # 原始项目的README
│   ├── README.en.md    # 原始项目的英文README
│   ├── js/             # 原始JavaScript文件
│   ├── media/          # 音频文件
│   └── img/            # 图片资源
├── js/                 # 烟花效果脚本
├── LICENSE             # 木兰宽松许可证 v2
└── README.md           # 本文档
```

## 🎯 How It Works

### 主页 (Root Path)
- 自动检测当前年份并显示
- 12月25日后会显示下一年的内容
- 包含实时倒计时功能
- 集成了原有的烟花效果

### 彩蛋版 (/old/)
- 保留了你2024年的第一个项目代码
- 包含2024龙年的所有原始祝福语和功能
- 作为纪念和回忆保存
- 展示从零开始的学习历程

## 🛠️ Development

### 本地运行
```bash
# 使用任何静态服务器
python -m http.server 8000
# 或
npx serve
```

然后访问:
- 主页: http://localhost:8000
- 旧版: http://localhost:8000/old/

## 📝 License

本项目采用 **木兰宽松许可证 v2 (Mulan PSL v2)** 开源。

Copyright (c) 2024-2026 shijianus

[木兰宽松许可证 v2](http://license.coscl.org.cn/MulanPSL2)

## 🌟 Acknowledgments

- **烟花效果**: 基于Canvas的粒子系统
- **2024原始版本**: 我的第一个开源项目,纪念青春岁月
- **2026新版本**: 现代化的设计,自动更新功能

## 📅 Timeline

- **2024年**: 创建第一个版本,2024龙年庆祝页面
- **2025年12月**: 重构为自动更新的新年庆祝网站
- **2026年及以后**: 自动适应未来年份

---

Made with ❤️ by [shijianus](https://github.com/shijianus)

愿代码如诗,岁月如歌 🎆
