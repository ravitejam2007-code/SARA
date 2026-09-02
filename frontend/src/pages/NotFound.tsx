import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertOctagon, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export const NotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center text-center p-6 space-y-5">
      <div className="p-4 rounded-full bg-rose-950/40 border border-rose-800/60 text-rose-400">
        <AlertOctagon className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <Badge variant="crimson" size="sm">
          ERROR 404: RESOURCE_NOT_FOUND
        </Badge>
        <h1 className="text-2xl font-mono font-bold text-slate-100">
          ENCLAVE ROUTE DOES NOT EXIST
        </h1>
        <p className="text-xs font-mono text-slate-400 max-w-md mx-auto">
          The requested path could not be resolved within the sovereign industrial workbench navigation table.
        </p>
      </div>

      <Button
        variant="primary"
        size="md"
        leftIcon={<ArrowLeft className="w-4 h-4" />}
        onClick={() => navigate('/dashboard')}
      >
        RETURN TO DASHBOARD
      </Button>
    </div>
  )
}

export default NotFound
