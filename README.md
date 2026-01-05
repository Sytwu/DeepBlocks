# DeepBlocks

> 🎨 Visual Machine Learning Drag-and-Drop Platform - Making Deep Learning Architecture Design as Easy as Building Blocks

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.1.0--dev-orange)](docs/CHANGELOG.md)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?logo=fastapi)](https://fastapi.tiangolo.com/)

---

## ✨ Features

### Core Capabilities
- 🎨 **Drag-and-Drop Design** - Scratch-like visual interface, intuitive and easy to use
- ⚡ **Real-time Code Generation** - Automatically generates complete, executable PyTorch code
- 🔄 **Smart Undo/Redo** - Event-driven history tracking with intelligent state management
- 📋 **Node Duplication** - Ctrl+D to duplicate nodes with preserved connections
- 📚 **Education-Friendly** - Helps beginners understand deep learning architectures
- 🔬 **Research Tool** - Rapid prototyping for faster experimentation

### Node Library (41+ Nodes)
- **Data Processing (3)**: Input, DataLoader, Output
- **CNN Layers (9)**: Conv2d, Conv3d, Linear, BatchNorm2d, MaxPool2d, AvgPool2d, Dropout, Flatten, +more
- **Activations (5)**: ReLU, LeakyReLU, Sigmoid, Softmax, Tanh
- **Operations (3)**: Concat, Add, Reshape
- **Transformer (5)**: Multi-Head Attention, Encoder, Decoder, Positional Encoding, LayerNorm
- **Loss Functions (5)**: CrossEntropy, MSE, BCE, L1, SmoothL1
- **Optimizers (5)**: Adam, SGD, AdamW, RMSprop, LR Scheduler
- **Advanced Blocks (6)**: ResNet Block, U-Net Block, Inception, DenseNet, MobileNet, Attention

### Project Management
- 💾 **Auto-Save** - Automatic project saving every 30 seconds
- 📂 **Project Storage** - LocalStorage-based project management
- 🎨 **Dark/Light Theme** - Customizable UI themes
- 🔍 **Node Search** - Quick node library filtering
- 📋 **Example Projects** - MNIST Classifier, Simple CNN presets

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- Python >= 3.10
- Docker Desktop

### 30-Second Interactive Prototype
```bash
# Open the interactive prototype directly in your browser
open prototype.html
```

### Full Installation (See [Getting Started Guide](docs/GETTING_STARTED.md))
```bash
# 1. Frontend
cd frontend
npm install
npm run dev

# 2. Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# 3. Database
docker-compose up -d
```

**Detailed Steps**: Please refer to [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md)

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [Getting Started](docs/GETTING_STARTED.md) | Environment setup and installation guide |
| [Technical Specification](docs/technical-specification.md) | System architecture, API design |
| [Development Roadmap](docs/development-roadmap.md) | 5-phase development plan |
| [Implementation Guide](docs/implementation-phase1.md) | Phase 1 detailed steps |
| [Visual Design Guide](docs/visual-design-guide.md) | UI/UX design specifications |
| [Deployment Guide](docs/DEPLOYMENT.md) | GitHub Pages deployment |
| [Changelog](docs/CHANGELOG.md) | Version change history |

---

## 🎯 Project Status

**Current Version**: v0.2.0-alpha (Phase 2: Advanced Features Complete)  
**Next Release**: v1.0.0 @ Q2 2026

### Development Progress
- [x] **Phase 0**: Project Planning & Environment Setup ✅
- [x] **Phase 1**: MVP Visual Editor - Complete IDE with 20 nodes ✅
- [x] **Phase 2**: Project Management & Optimization (85% Complete) ✅
  - [x] 2.1: Project Management System (LocalStorage, CRUD) ✅
  - [x] 2.2: Example Projects (MNIST, Simple CNN) ✅
  - [x] 2.3: Node Search & Filtering ✅
  - [x] 2.4: Auto-Save Functionality ✅
  - [x] 2.5: Theme System & Toast Notifications ✅
  - [x] 2.6: Undo/Redo System (Event-driven) ✅
  - [x] 2.7: Node Duplication & Batch Operations ✅
  - [x] 2.8: Advanced Node Library (41 nodes) ✅
- [ ] **Phase 3**: Code Validation & Execution (Planned)
- [ ] **Phase 4**: Collaboration & Deployment (Planned)

**Latest Updates**: See [PROGRESS.md](docs/PROGRESS.md) for detailed progress tracking

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Components**: Shadcn/UI + Tailwind CSS
- **Graph Library**: React Flow
- **State Management**: Zustand

### Backend
- **Framework**: FastAPI
- **Database**: PostgreSQL
- **Authentication**: JWT

### Deployment
- **Frontend**: GitHub Pages / Vercel
- **Backend**: Railway / Render
- **PWA**: Offline support

---

## 📂 Project Structure

```
DeepBlocks/
├── frontend/          # React frontend application
├── backend/           # FastAPI backend service
├── docs/              # 📚 All project documentation
├── prototype.html     # Interactive prototype
└── docker-compose.yml # PostgreSQL container
```

---

## 🎨 Preview

> Design preview based on `prototype.html`

**Main Features**:
- 🎯 Three-column IDE layout
- 📦 Drag nodes to canvas
- ⚙️ Real-time property editing
- 💻 Live code preview

---

## 🗺️ Roadmap

### v0.1.0 (2026-01-04) - MVP Complete ✅
- ✅ Three-column IDE layout
- ✅ 20 nodes with drag-and-drop
- ✅ Real-time property editing
- ✅ PyTorch code generation
- ✅ ZIP export functionality

### v0.2.0 (2026-01-05) - Advanced Features ✅
- ✅ Project management (LocalStorage)
- ✅ Auto-save every 30 seconds
- ✅ Undo/Redo system (event-driven)
- ✅ Node duplication (Ctrl+D)
- ✅ 41 nodes including Transformer, Loss, Optimizers
- ✅ Dark/Light theme
- ✅ Example projects

### v0.3.0 (Q2 2026) - Code Validation
- Model validation & error checking
- Parameter statistics
- Local Python execution

### v1.0.0 (Q2 2026) - Official Release
- Backend integration (FastAPI)
- User authentication
- Cloud project storage
- PWA support

---

## 🤝 Contributing

Contributions are welcome! Please follow this workflow:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**Note**: All documentation should be placed in the `docs/` directory, and major changes must update `docs/CHANGELOG.md`

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

---

## 🌟 Star History

If this project helps you, please give us a ⭐️!

---

## 📞 Contact Us

- 📧 Email: [Coming Soon]
- 💬 Discord: [Coming Soon]
- 🐦 Twitter: [Coming Soon]

---

**Built with ❤️ by DeepBlocks Team**
