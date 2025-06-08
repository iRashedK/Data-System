# AI Data Classification System

A production-ready, enterprise-grade data classification system that automatically classifies structured data using AI according to international regulations including NDMO, PDPL, GDPR, NCA, and DAMA frameworks.

## 🚀 Features

### Core Functionality
- **AI-Powered Classification**: Uses OpenRouter (Claude/GPT-4) for intelligent data classification
- **Multi-Source Support**: Upload Excel/CSV files or connect to PostgreSQL, MySQL, SQL Server
- **Regulation Compliance**: Supports NDMO, PDPL, GDPR, NCA, and DAMA frameworks
- **Custom Rules Engine**: Define pattern-based classification rules
- **Real-time Processing**: Instant classification with confidence scoring

### Enterprise Features
- **Role-Based Access Control**: Admin, Data Steward, Analyst, Auditor roles
- **Audit Logging**: Comprehensive activity tracking
- **Dashboard Analytics**: KPIs, compliance metrics, risk assessment
- **Multilingual Support**: Arabic and English interface
- **Dark/Light Mode**: Modern, responsive UI

### Security & Compliance
- **Data Privacy**: Local processing, secure credential handling
- **Access Policies**: Automatic policy generation based on classification
- **Encryption**: Data at rest and in transit
- **Compliance Reporting**: Automated compliance status tracking

## 🏗️ Architecture

\`\`\`
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Next.js)     │◄──►│   (FastAPI)     │◄──►│  (PostgreSQL)   │
│                 │    │                 │    │                 │
│ • Dashboard     │    │ • Classification│    │ • Users         │
│ • Upload UI     │    │ • Rules Engine  │    │ • Results       │
│ • Results View  │    │ • File Service  │    │ • Audit Logs    │
│ • Settings      │    │ • Database Conn │    │ • Custom Rules  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   OpenRouter    │
                       │   (AI Service)  │
                       │                 │
                       │ • Claude-3      │
                       │ • GPT-4         │
                       │ • Classification│
                       └─────────────────┘
\`\`\`

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- OpenRouter API Key ([Get one here](https://openrouter.ai))

### Installation

1. **Clone the repository**
\`\`\`bash
git clone https://github.com/your-org/ai-data-classifier.git
cd ai-data-classifier
\`\`\`

2. **Configure environment**
\`\`\`bash
cp .env.example .env
# Edit .env with your OpenRouter API key and other settings
\`\`\`

3. **Start the system**
\`\`\`bash
docker-compose up -d
\`\`\`

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### First Time Setup

1. **Register an admin user**
   - Go to http://localhost:3000
   - Click "Register" and create an admin account
   - Role: Admin

2. **Upload sample data**
   - Use the provided `sample_data.xlsx` file
   - Or connect to your own database

3. **Review classifications**
   - Check the dashboard for results
   - Approve/reject classifications as needed

## 📊 Usage

### File Upload
1. Navigate to "Upload & Connect"
2. Drag and drop Excel/CSV files
3. AI automatically classifies each column
4. Review results in the dashboard

### Database Connection
1. Select "Database Connection" tab
2. Enter connection details
3. System extracts schema and classifies columns
4. Monitor progress in real-time

### Custom Rules
1. Go to "Custom Rules"
2. Define regex patterns for automatic classification
3. Rules are applied before AI classification
4. Test rules with sample data

### Dashboard Analytics
- **KPI Cards**: Total columns, high-risk fields, compliance scores
- **Compliance Chart**: Regulation adherence percentages
- **Risk Heatmap**: Visual risk assessment
- **Trend Analysis**: Classification activity over time

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENROUTER_API_KEY` | OpenRouter API key for AI classification | Required |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres123@localhost:5432/data_classifier` |
| `JWT_SECRET` | Secret key for JWT tokens | Change in production |
| `ENVIRONMENT` | Environment (development/production) | `development` |
| `MAX_FILE_SIZE` | Maximum upload file size in bytes | `104857600` (100MB) |

### Custom Rules Format

\`\`\`json
{
  "name": "Saudi National ID",
  "pattern": "^[12]\\d{9}$",
  "classification_level": "Top Secret",
  "regulation": "PDPL",
  "description": "Saudi national identification numbers"
}
\`\`\`

### Built-in Rules

The system includes pre-configured rules for:
- Saudi National ID numbers
- Saudi phone numbers
- Email addresses
- IBAN numbers
- Credit card numbers
- IP addresses
- Medical data patterns
- Biometric data patterns

## 🔐 Security

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- Session management
- Password hashing with bcrypt

### Data Protection
- Files processed locally and deleted after classification
- Database credentials not permanently stored
- Encryption for sensitive data
- Audit logging for all actions

### Access Policies
Automatically generated based on classification:

\`\`\`json
{
  "column": "NationalID",
  "classification": "Top Secret",
  "allowed_roles": ["Admin", "Data_Steward"],
  "restrictions": {
    "download": false,
    "email": false,
    "masking": true,
    "log_access": true
  }
}
\`\`\`

## 📈 Monitoring & Maintenance

### Health Checks
- Application health: `GET /health`
- Database connectivity
- Redis connectivity
- OpenRouter API status

### Logging
- Application logs in JSON format
- Audit trail for all user actions
- Error tracking and alerting
- Performance metrics

### Backup & Recovery
- Automated database backups
- Configuration backup
- Disaster recovery procedures

## 🛠️ Development

### Local Development Setup

1. **Backend Development**
\`\`\`bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
\`\`\`

2. **Frontend Development**
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

3. **Database Setup**
\`\`\`bash
# Start PostgreSQL
docker run -d --name postgres -e POSTGRES_PASSWORD=postgres123 -p 5432:5432 postgres:15

# Run migrations
cd backend
alembic upgrade head
\`\`\`

### Testing

\`\`\`bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test

# Integration tests
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
\`\`\`

### API Documentation

The API is fully documented with OpenAPI/Swagger:
- Interactive docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

Key endpoints:
- `POST /auth/login` - User authentication
- `POST /upload` - File upload and classification
- `POST /connect` - Database connection
- `GET /dashboard/stats` - Dashboard statistics
- `POST /rules` - Create custom rules

## 🌍 Internationalization

### Supported Languages
- English (default)
- Arabic (العربية)

### Adding New Languages
1. Add translation files in `frontend/src/locales/`
2. Update language selector component
3. Configure Next.js i18n settings

## 📦 Deployment

### Production Deployment

1. **Environment Setup**
\`\`\`bash
# Production environment file
cp .env.example .env.production
# Configure production values
\`\`\`

2. **SSL Configuration**
\`\`\`bash
# Generate SSL certificates
mkdir nginx/ssl
# Add your SSL certificates
\`\`\`

3. **Deploy with Docker**
\`\`\`bash
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

### Kubernetes Deployment

Kubernetes manifests are provided in the `k8s/` directory:

\`\`\`bash
kubectl apply -f k8s/
\`\`\`

### Cloud Deployment

#### AWS
- Use ECS/Fargate for containers
- RDS for PostgreSQL
- ElastiCache for Redis
- ALB for load balancing

#### Azure
- Use Container Instances
- Azure Database for PostgreSQL
- Azure Cache for Redis
- Application Gateway

#### GCP
- Use Cloud Run
- Cloud SQL for PostgreSQL
- Memorystore for Redis
- Cloud Load Balancing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow PEP 8 for Python code
- Use TypeScript for frontend development
- Write tests for new features
- Update documentation
- Follow semantic versioning

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [User Guide](docs/user-guide.md)
- [API Reference](docs/api-reference.md)
- [Deployment Guide](docs/deployment.md)
- [Troubleshooting](docs/troubleshooting.md)

### Community
- [GitHub Issues](https://github.com/your-org/ai-data-classifier/issues)
- [Discussions](https://github.com/your-org/ai-data-classifier/discussions)
- [Discord Community](https://discord.gg/your-server)

### Commercial Support
For enterprise support, custom development, and consulting services, contact us at support@yourcompany.com

## 🙏 Acknowledgments

- OpenRouter for AI API services
- Saudi NDMO for data classification guidelines
- GDPR compliance framework
- Open source community contributors

---

**Built with ❤️ for data governance and compliance**
