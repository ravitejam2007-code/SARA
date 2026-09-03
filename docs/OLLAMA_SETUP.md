# Zenith AI — Local On-Premise LLM Setup Guide (Ollama)

This guide provides instructions for deploying and configuring **Ollama** as the local inference provider for **Zenith AI — Sovereign Industrial AI Workbench**.

---

## 1. Sovereignty & Air-Gap Compliance

Zenith AI executes inference **strictly on local hardware**.
- **No Cloud API Calls**: No data is ever transmitted to OpenAI, Google Gemini, Anthropic, or external inference APIs.
- **Network Bounded**: The backend connects to `http://127.0.0.1:11434` via kernel loopback.
- **Air-Gap Compatible**: Model weights can be pre-cached into local storage for air-gapped deployments.

---

## 2. Installing Ollama

### Windows
1. Download the Windows installer from [ollama.com/download](https://ollama.com/download/windows).
2. Run `OllamaSetup.exe` and follow the on-screen prompts.
3. Open PowerShell and verify:
   ```powershell
   ollama --version
   ```

### Linux (Ubuntu / RHEL / Debian)
```bash
curl -fsSL https://ollama.com/install.sh | sh
sudo systemctl enable ollama
sudo systemctl start ollama
```

### macOS
Download from [ollama.com/download/mac](https://ollama.com/download/mac) and drag to `/Applications`.

---

## 3. Pulling Recommended Industrial Models

Execute the following commands in your terminal to download models into local on-premise storage:

| Model Purpose | Recommended Model | Pull Command | Size |
|---|---|---|---|
| **Fast Reasoning & Analysis** | Llama 3.2 3B | `ollama pull llama3.2:3b` | ~2.0 GB |
| **Deep Engineering Physics** | Mistral 7B | `ollama pull mistral:7b` | ~4.1 GB |
| **Multi-Modal Vision Inspection** | LLaVA 7B | `ollama pull llava:7b` | ~4.7 GB |
| **Industrial Code & PLC Logic** | Qwen 2.5 Coder 7B | `ollama pull qwen2.5-coder:7b` | ~4.7 GB |

To list models currently stored in your local repository:
```powershell
ollama list
```

---

## 4. Configuring Zenith AI Backend

In [`backend/.env`](file:///c:/Users/ravit/Desktop/s-ai-w/backend/.env), set the following parameters:

```bash
# Local LLM Gateway
OLLAMA_BASE_URL="http://127.0.0.1:11434"
DEFAULT_LLM_MODEL="llama3.2:3b"
DEFAULT_VISION_MODEL="llava:7b"
LLM_TIMEOUT_SECONDS=60.0
LLM_PROVIDER="ollama"
```

---

## 5. Verifying Local Provider Connectivity

### Step 1: Check Ollama Daemon
```powershell
curl http://127.0.0.1:11434/api/version
```
*Expected output: `{"version":"0.x.x"}`*

### Step 2: Check Zenith AI Model Health Endpoint
```powershell
curl http://127.0.0.1:8000/api/models/health
```
*Expected output:*
```json
{
  "status": "ONLINE",
  "provider": "ollama",
  "version": "0.5.x",
  "base_url": "http://127.0.0.1:11434",
  "active_models_count": 4,
  "latency_ms": 12.4
}
```

### Step 3: Run the Predictive Maintenance Test Prompt
```powershell
curl -X POST http://127.0.0.1:8000/api/models/chat `
  -H "Content-Type: application/json" `
  -d '{"messages": [{"role": "user", "content": "Explain predictive maintenance in simple language."}]}'
```

### Step 4: Run the Vision Inspection Test
```powershell
curl -X POST http://127.0.0.1:8000/api/models/vision `
  -F "file=@path/to/turbine_image.png" `
  -F "prompt=Inspect turbine blade root fillet for micro-cracks and thermal erosion."
```

---

## 6. Air-Gapped Room Deployment (Zero-Internet)

For isolated facilities without internet access:
1. On an internet-connected staging machine, pull the required models:
   ```bash
   ollama pull llama3.2:3b
   ollama pull llava:7b
   ```
2. Copy the model manifests and blobs directory:
   - **Windows**: `C:\Users\<user>\.ollama\models`
   - **Linux**: `~/.ollama/models` or `/usr/share/ollama/.ollama/models`
3. Transfer via approved USB media to the air-gapped target machine in the same directory path.
4. Launch Ollama:
   ```bash
   ollama serve
   ```
   All models are immediately available offline with zero external network attempts.
