from typing import List, Optional
from pydantic import BaseModel


class SecurityMetricSchema(BaseModel):
    value: Optional[int] = None
    origin: str = "LIVE_API"
    note: Optional[str] = None
    last_updated: Optional[str] = None


class NetworkEgressSchema(BaseModel):
    bytes: Optional[int] = None
    formatted: str = "0 Bytes"
    origin: str = "LIVE_API"
    note: Optional[str] = None
    last_updated: Optional[str] = None


class SovereigntySummaryResponse(BaseModel):
    external_api_calls: SecurityMetricSchema
    cloud_model_calls: SecurityMetricSchema
    external_dns_requests: SecurityMetricSchema
    network_egress_bytes: NetworkEgressSchema
    local_service_availability_percent: SecurityMetricSchema


class LocalServiceHealthItemSchema(BaseModel):
    id: str
    name: str
    status: str
    latency_ms: Optional[int] = None
    uptime: Optional[str] = None
    memory_vram: Optional[str] = None
    version: Optional[str] = None
    data_origin: str = "LIVE_API"


class SecurityStatusResponse(BaseModel):
    sovereignty: SovereigntySummaryResponse
    services: List[LocalServiceHealthItemSchema]
