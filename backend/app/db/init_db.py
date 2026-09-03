from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.db.session import engine, SessionLocal
from app.models import (
    Base,
    Role,
    User,
    ModelRegistry,
    AuditLog,
)
from app.utils.security import hash_password
from app.utils.logger import logger


def init_db(db: Session) -> None:
    """Create all tables and seed default RBAC roles and initial accounts."""
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables verified / created.")

    # 1. Seed Roles
    roles_data = [
        {"name": "Admin", "description": "Full access to models, security, audit logs, workflows, and enclaves", "clearance_level": "LEVEL-4 (RESTRICTED)"},
        {"name": "Manager", "description": "Workflows, reviews, approvals, and deliverables oversight", "clearance_level": "LEVEL-3 (OPERATIONS LEAD)"},
        {"name": "Engineer", "description": "AI Workspace, document analysis, knowledge base, and tool executions", "clearance_level": "LEVEL-2 (TECHNICAL SPECIALIST)"},
        {"name": "Auditor", "description": "Read-only access to security, audit trails, and compliance reports", "clearance_level": "LEVEL-3 (COMPLIANCE AUDITOR)"},
    ]

    existing_roles = {r.name: r for r in db.query(Role).all()}
    for r_data in roles_data:
        if r_data["name"] not in existing_roles:
            role = Role(**r_data)
            db.add(role)
            logger.info(f"Seeded role: {role.name}")

    db.commit()
    all_roles = {r.name: r for r in db.query(Role).all()}

    # 2. Seed Default Accounts
    default_password_hash = hash_password("password123")
    default_users = [
        {
            "id": "usr-zn-adm-001",
            "username": "admin",
            "email": "admin@zenith-ai.local",
            "name": "Admin Vance",
            "callsign": "ADM-VANCE",
            "clearance_level": "LEVEL-4 (TOP SECRET / RESTRICTED)",
            "terminal_id": "NODE-ADMIN-01",
            "role_id": all_roles["Admin"].id,
            "hashed_password": default_password_hash,
            "is_active": True,
        },
        {
            "id": "usr-zn-mgr-002",
            "username": "manager",
            "email": "manager@zenith-ai.local",
            "name": "Sarah Connor",
            "callsign": "MGR-SARAH-CONNOR",
            "clearance_level": "LEVEL-3 (OPERATIONS LEAD)",
            "terminal_id": "NODE-MGR-01",
            "role_id": all_roles["Manager"].id,
            "hashed_password": default_password_hash,
            "is_active": True,
        },
        {
            "id": "usr-zn-eng-003",
            "username": "engineer",
            "email": "engineer@zenith-ai.local",
            "name": "Dr. Kai Chen",
            "callsign": "ENG-KAI-CHEN",
            "clearance_level": "LEVEL-2 (TECHNICAL SPECIALIST)",
            "terminal_id": "NODE-WS-02",
            "role_id": all_roles["Engineer"].id,
            "hashed_password": default_password_hash,
            "is_active": True,
        },
        {
            "id": "usr-zn-aud-004",
            "username": "auditor",
            "email": "auditor@zenith-ai.local",
            "name": "Marcus Holt",
            "callsign": "AUD-MARCUS-HOLT",
            "clearance_level": "LEVEL-3 (REGULATORY COMPLIANCE)",
            "terminal_id": "NODE-AUDIT-01",
            "role_id": all_roles["Auditor"].id,
            "hashed_password": default_password_hash,
            "is_active": True,
        },
    ]

    for u_data in default_users:
        existing_user = db.query(User).filter(User.username == u_data["username"]).first()
        if not existing_user:
            user = User(**u_data)
            db.add(user)
            logger.info(f"Seeded user: {user.username} ({user.callsign})")

    # 3. Seed Local Models Registry
    models_data = [
        {
            "id": "mdl-01",
            "name": "Zenith-Engineer-70B-FP8",
            "model_type": "LLM",
            "parameters": "70 Billion",
            "context_window": "128k Tokens",
            "local_path": "/models/zenith-engineer-70b-fp8",
            "status": "ONLINE",
            "is_default": True,
            "latency_ms": 14,
        },
        {
            "id": "mdl-02",
            "name": "DeepCAD-Vision-v2",
            "model_type": "VISION",
            "parameters": "14 Billion",
            "context_window": "64k Tokens",
            "local_path": "/models/deepcad-vision-v2",
            "status": "ONLINE",
            "is_default": False,
            "latency_ms": 28,
        },
        {
            "id": "mdl-03",
            "name": "Enclave-OCR-v5",
            "model_type": "OCR",
            "parameters": "2 Billion",
            "context_window": "32k Tokens",
            "local_path": "/models/enclave-ocr-v5",
            "status": "ONLINE",
            "is_default": False,
            "latency_ms": 8,
        },
        {
            "id": "mdl-04",
            "name": "CodePLC-IEC-61131",
            "model_type": "CODE",
            "parameters": "13 Billion",
            "context_window": "64k Tokens",
            "local_path": "/models/codeplc-iec-61131",
            "status": "ONLINE",
            "is_default": False,
            "latency_ms": 16,
        },
    ]

    for m_data in models_data:
        existing_model = db.query(ModelRegistry).filter(ModelRegistry.name == m_data["name"]).first()
        if not existing_model:
            db.add(ModelRegistry(**m_data))

    # 4. Seed Initial Cryptographic Audit Log
    initial_log = db.query(AuditLog).first()
    if not initial_log:
        db.add(
            AuditLog(
                id="LOG-INITIAL-BOOT",
                timestamp=datetime.now(timezone.utc),
                actor="SYSTEM_TPM_ROOT",
                action="INITIALIZE_SOVEREIGN_ENCLAVE",
                resource="HOST-AIRGAP-CONTROLLER",
                enclave_id="ENCLAVE-TITAN-X8",
                sha256_hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                status="CONFIRMED",
                ip_or_interface="HW-BUS-INTERNAL",
                metadata_payload='{"fips_level": "140-3", "air_gap_status": "enforced"}',
            )
        )

    db.commit()
    logger.info("Database initialization and initial seeding complete.")


if __name__ == "__main__":
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()
