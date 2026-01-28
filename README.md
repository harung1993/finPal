<p align="center">
  <a href="https://github.com/yourusername/finpal">
    <img src="https://github.com/harung1993/dollardollar/blob/main/static/images/dddby.png" alt="FinPal logo" width="200" />
  </a>
</p>

<h1 align="center">FinPal</h1>

<div align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-AGPL--3.0-blue.svg" alt="license"></a>
  <a href="https://discord.gg/7Z2EqVZYqm"><img src="https://img.shields.io/discord/XXXXX?color=7289da&label=Discord&logo=discord&logoColor=white" alt="Discord"></a>
  <img src="https://img.shields.io/badge/Status-Production%20Ready-green" alt="Status">
</div>

<p align="center">
  <strong>Modern, Privacy-First Financial Management Platform</strong>
</p>

<p align="center">
A self-hosted money management solution with comprehensive expense tracking, budgeting, account synchronization, and bill-splitting. Built with a modular microservices backend and modern React frontend - designed for privacy, security, and complete financial control.
</p>

<div align="center">
  <h3>
    <a href="https://discord.gg/7Z2EqVZYqm">Discord</a>
    <span> | </span>
    <a href="#-installation">Installation</a>
    <span> | </span>
    <a href="LICENSE">License</a>
  </h3>
</div>

---

## 🌟 About FinPal

**FinPal** is a modern fork of DollarDollar Bill Y'all, completely rebuilt with:
- **🏗️ Modular Microservices Backend** - Scalable, maintainable architecture
- **⚛️ React Frontend** - Modern, responsive UI with TypeScript
- **📱 Mobile App** (Coming Soon) - Native mobile experience
- **🔐 Privacy-First Design** - Your data stays with you
- **🤖 AI-Enhanced Development** - Built with responsible AI assistance

### Part of the PalStack Ecosystem

FinPal is the financial management component of **PalStack** - a comprehensive suite of privacy-focused, self-hosted applications designed to give you complete control over your digital life. Each PalStack application prioritizes:
- **Data sovereignty** - Your data, your server, your rules
- **Interoperability** - Seamless integration across the ecosystem
- **Open source** - Transparent, auditable, and community-driven
- **Privacy by design** - Built with security and privacy as core principles

---

## 🚀 Why FinPal?

Born from a desire to move beyond restrictive commercial financial platforms:

- 🔐 **Complete Data Ownership** - Self-hosted on your infrastructure
- 💡 **Flexible Expense Management** - Track expenses your way
- 🔄 **Smart Automation** - Auto-categorization, recurring transactions, pattern detection
- 🤝 **Collaborative Finance** - Advanced bill-splitting with groups
- 🏦 **Bank Integration** - SimpleFin integration for automatic account sync
- 📊 **Powerful Analytics** - Comprehensive insights into your finances
- 🎯 **Budget Management** - Smart budgets with real-time notifications
- 💼 **Investment Tracking** - Portfolio management with auto-updated prices
- 🔒 **Enterprise Security** - OIDC authentication, secure by default

---

## ✨ Key Features

### 💰 Expense Tracking & Management
- Multi-currency support with automatic conversion
- Recurring transactions with flexible scheduling
- Smart auto-categorization with customizable rules
- Transaction importing (CSV, SimpleFin)
- Multi-category transactions
- Multi-card and multi-account support
- Recurring pattern detection
- Transaction rules engine

### 👥 Advanced Bill Splitting
- Multiple split methods: Equal, custom amount, percentage
- Group expense management
- Settlement tracking
- Email invitations for group members
- IOU tracking

### 📊 Budgeting & Analytics
- Custom budgets with real-time tracking and notifications
- Monthly financial summaries via email
- Interactive expense trends visualization
- Category-based analysis
- Financial health metrics
- Net worth tracking
- Cash flow analysis

### 🏷️ Organization & Customization
- Customizable categories with hierarchies
- Smart tagging system
- Auto-categorization engine
- Category-based reporting for tax preparation
- Custom transaction rules

### 🔐 Security & Privacy
- Self-hosted deployment
- Local authentication
- OpenID Connect (OIDC) integration
- User management with password recovery
- Zero third-party tracking
- Audit logging
- Secure API with JWT authentication

### 💼 Portfolio Management
- Multiple portfolios
- Investment tracking
- Automatic price updates
- Portfolio performance monitoring
- Account linking

---

## 🛠️ Technology Stack

### Backend
- Python 3.11+ with Flask
- PostgreSQL database
- SQLAlchemy ORM
- Modular service-based architecture
- RESTful API

### Frontend
- React 18 with TypeScript
- Vite build tool
- Recharts for data visualization
- Responsive design

### Infrastructure
- Docker & Docker Compose
- Nginx reverse proxy
- Gunicorn WSGI server

### Mobile (Coming Soon)
- React Native
- Cross-platform (iOS & Android)

---

## 📦 Installation

### Prerequisites
- Docker and Docker Compose
- 2GB RAM minimum (4GB recommended)
- 10GB disk space

### Quick Start (Pre-built Images)

**Recommended for most users** - Uses pre-built Docker Hub images:

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/finpal.git
cd finpal

# 2. Configure environment
cp .env.example .env
# Edit .env with your settings

# 3. Launch FinPal with Docker Hub images
docker-compose -f docker-compose.hub.yml up -d

# 4. Access at http://localhost
```

### Build from Source (Advanced)

For developers or custom builds:

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/finpal.git
cd finpal

# 2. Configure environment
cp .env.example .env
# Edit .env with your settings

# 3. Build and launch FinPal
docker-compose up -d

# 4. Access at http://localhost
```

### Update Procedure

**Using Docker Hub images:**
```bash
docker-compose -f docker-compose.hub.yml pull
docker-compose -f docker-compose.hub.yml up -d
```

**Building from source:**
```bash
git pull
docker-compose build
docker-compose exec backend flask db upgrade
docker-compose up -d
```

### Docker Hub Images

Official pre-built images are available on Docker Hub:
- `finpal/backend` - Backend API service
- `finpal/web` - Frontend web application

See [DOCKER_BUILD.md](DOCKER_BUILD.md) for building and publishing images.

---

## ⚙️ Configuration

### Core Settings

```env
# Database
DB_USER=finpal
DB_PASSWORD=your_secure_password
DB_NAME=finpal

# Security
SECRET_KEY=your_secret_key
JWT_SECRET_KEY=your_jwt_secret

# Application
DEFAULT_CURRENCY=USD
```

### Investment Tracking (Optional)

```env
INVESTMENT_TRACKING_ENABLED=true
```

### OIDC Authentication (Optional)

```env
OIDC_ENABLED=true
OIDC_CLIENT_ID=your_client_id
OIDC_CLIENT_SECRET=your_client_secret
OIDC_PROVIDER_NAME=Your Provider Name
OIDC_DISCOVERY_URL=https://your-provider/.well-known/openid-configuration
```

See [.env.example](.env.example) for complete options.

---

## 🤝 Development Philosophy

### AI-Assisted Development with Privacy Focus

FinPal embraces modern AI-assisted development while maintaining strict privacy and security standards:

#### How We Use AI
- **Rapid prototyping** - Accelerate feature development
- **Code quality** - Generate clean, maintainable code
- **Documentation** - Comprehensive guides and comments
- **Testing** - Automated test generation
- **Architecture** - Design scalable systems

#### AI Tools Used
- **Local LLMs** (Qwen2.5, DeepSeek-V3) - Privacy-preserving code generation
- **Cloud AI** - For non-sensitive development tasks only
- **Human expertise** - Final review and domain knowledge

#### Privacy & Security Commitments
- ❌ **No user data** ever sent to AI services
- ❌ **No financial data** used in AI training
- ✅ **Privacy-first architecture** - Data stays on your server
- ✅ **Transparent development** - Open source code
- ✅ **Security audits** - Regular code reviews
- ✅ **Data encryption** - At rest and in transit
- ✅ **Minimal data collection** - Only what's necessary
- ✅ **GDPR compliant** - Respect user privacy rights

All AI-generated code undergoes rigorous security review and testing.

---

## 📸 Screenshots

<div align="center">
  <img width="45%" alt="Dashboard" src="https://github.com/user-attachments/assets/32542178-011c-4043-801f-75d50f773cf1" />
  <img width="45%" alt="Bill Splitting" src="https://github.com/user-attachments/assets/29f254a0-7773-4050-9251-ed8ba5b4df83" />
  <img width="45%" alt="Settlements" src="https://github.com/user-attachments/assets/1ca55758-5390-413b-b8e6-bb85e31263c0" />
  <img width="45%" alt="Budgets" src="https://github.com/user-attachments/assets/8db5c16b-37e4-4bf4-aa0e-396810e0380d" />
  <img width="45%" alt="Analytics" src="https://github.com/user-attachments/assets/23d17592-b440-49f2-a0c5-dca9e8b57b2f" />
  <img width="45%" alt="Portfolios" src="https://github.com/user-attachments/assets/d20c5142-9261-413e-ae45-7588b21917d4" />
</div>

---

## 🤝 Contributing

Contributions are welcome! Whether fixing bugs, adding features, or improving documentation.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a Pull Request

---

## 📜 License

This project is licensed under the **GNU Affero General Public License v3.0**.

This license ensures that FinPal and its derivatives remain open and available to the community. If you run a modified version as a service, you must provide source code to users.

See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- **DollarDollar Bill Y'all** - The original inspiration
- **Open Source Community** - Tools, libraries, and inspiration
- **JordanDalby** - Unraid template maintenance
- **@elmerfds** - OIDC authentication implementation
- **Contributors** - Everyone who has helped

### Special Thanks

Special thanks to my wife, who endured countless late nights of coding, provided unwavering support, and maintained patience during endless debugging sessions. ❤️

---

## 💬 Community & Support

- 📖 [Documentation](docs/)
- 💬 [Discord](https://discord.gg/7Z2EqVZYqm)
- 🐛 [Issue Tracker](https://github.com/yourusername/finpal/issues)
- 💡 [Discussions](https://github.com/yourusername/finpal/discussions)

---

## ☕ Support the Project

If you find FinPal useful and would like to support its development:

<a href="https://buymeacoffee.com/ccfw6gzz28"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=ccfw6gzz28&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" /></a>

---

<div align="center">
  <p>Built with ❤️ for the community | Part of the PalStack ecosystem</p>
  <p>
    <a href="#finpal">Back to top ↑</a>
  </p>
</div>
