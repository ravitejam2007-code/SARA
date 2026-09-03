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

    # 3. Seed Local Models Registry with full metadata
    models_data = [
        {
            "id": "mdl-reasoning-70b",
            "display_name": "SARA-Reasoning-3B (Open-Weight)",
            "provider": "open-weight-local",
            "local_endpoint": "local://embedded-kernel",
            "model_name": "llama3.2-3b-instruct-q4",
            "capabilities_csv": "reasoning,document,general",
            "context_length": 131072,
            "vision_support": False,
            "coding_support": False,
            "reasoning_support": True,
            "enabled": True,
            "model_type": "LLM",
            "parameters": "3 Billion (Quantized Q4_K_M)",
            "context_window": "128k Tokens",
            "status": "ONLINE",
            "is_default": True,
            "latency_ms": 6,
        },
        {
            "id": "mdl-coding-qwen",
            "display_name": "SARA-Coding-Engine (Open-Weight)",
            "provider": "open-weight-local",
            "local_endpoint": "local://embedded-kernel",
            "model_name": "qwen2.5-coder-3b-q4",
            "capabilities_csv": "coding,plc,python",
            "context_length": 65536,
            "vision_support": False,
            "coding_support": True,
            "reasoning_support": False,
            "enabled": True,
            "model_type": "CODE",
            "parameters": "3 Billion (CPU-Optimized)",
            "context_window": "64k Tokens",
            "status": "ONLINE",
            "is_default": False,
            "latency_ms": 8,
        },
        {
            "id": "mdl-vision-deepcad",
            "display_name": "SARA-Vision-Inspection (Open-Weight)",
            "provider": "open-weight-local",
            "local_endpoint": "local://embedded-kernel",
            "model_name": "qwen2-vl-2b-int4",
            "capabilities_csv": "vision,inspection,drawing",
            "context_length": 65536,
            "vision_support": True,
            "coding_support": False,
            "reasoning_support": False,
            "enabled": True,
            "model_type": "VISION",
            "parameters": "2 Billion (INT4 Low-VRAM)",
            "context_window": "32k Tokens",
            "status": "ONLINE",
            "is_default": False,
            "latency_ms": 12,
        },
        {
            "id": "mdl-document-intel",
            "display_name": "SARA-Document-Intelligence",
            "provider": "open-weight-local",
            "local_endpoint": "local://embedded-kernel",
            "model_name": "docling-parser-local",
            "capabilities_csv": "document,reasoning,summary",
            "context_length": 131072,
            "vision_support": False,
            "coding_support": False,
            "reasoning_support": True,
            "enabled": True,
            "model_type": "LLM",
            "parameters": "1 Billion (CPU-Friendly)",
            "context_window": "128k Tokens",
            "status": "ONLINE",
            "is_default": False,
            "latency_ms": 5,
        },
        {
            "id": "mdl-spreadsheet-calc",
            "display_name": "SARA-Tabular-Spreadsheet",
            "provider": "open-weight-local",
            "local_endpoint": "local://embedded-kernel",
            "model_name": "phi-3.5-mini-instruct",
            "capabilities_csv": "spreadsheet,tabular,calculation",
            "context_length": 131072,
            "vision_support": False,
            "coding_support": False,
            "reasoning_support": True,
            "enabled": True,
            "model_type": "LLM",
            "parameters": "3.8 Billion (Q4_K_M)",
            "context_window": "128k Tokens",
            "status": "ONLINE",
            "is_default": False,
            "latency_ms": 7,
        },
    ]

    for m_data in models_data:
        existing_model = db.query(ModelRegistry).filter(ModelRegistry.id == m_data["id"]).first()
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

    # 5. Seed Flagship Demonstration Tasks & Deliverables if not already present
    from app.models.agent_run import AgentRun
    from app.models.artifact import Artifact
    from app.services.agent_service import AgentWorkflowOrchestrator
    from app.schemas.task import TaskCreateRequest

    existing_task = db.query(AgentRun).filter(AgentRun.id == "TASK-1042").first()
    if not existing_task:
        logger.info("Seeding SIH Flagship Demo 1: Inspection Analysis (TASK-1042)...")
        try:
            # Generate Flagship Task 1
            AgentWorkflowOrchestrator.create_task(
                db=db,
                req=TaskCreateRequest(
                    prompt="Analyze this inspection report, identify key findings, compare them with the applicable internal SOP, perform required calculations, and prepare an approval note.",
                    task_type="inspection_analysis",
                    require_approval=True,
                ),
            )
            # Generate Flagship Task 2
            AgentWorkflowOrchestrator.create_task(
                db=db,
                req=TaskCreateRequest(
                    prompt="Create Python code to calculate the supplied engineering values and verify the result with automated tests.",
                    task_type="agentic_coding",
                    require_approval=False,
                ),
            )
        except Exception as e:
            logger.warning(f"Could not pre-seed tasks: {e}")

    db.commit()
    logger.info("Database initialization and initial seeding complete.")


if __name__ == "__main__":
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()
