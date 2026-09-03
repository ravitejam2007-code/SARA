import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertOctagon, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export const NotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center text-center p-6 space-y-5 font-sans">
      <div className="p-4 rounded-full bg-red-50 border border-red-200 text-[#ee0000] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <AlertOctagon className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <Badge variant="error" size="sm">
          ERROR 404: RESOURCE_NOT_FOUND
        </Badge>
        <h1 className="text-2xl font-bold tracking-tight text-[#171717]">
          ENCLAVE ROUTE DOES NOT EXIST
        </h1>
        <p className="text-xs text-[#8f8f8f] max-w-md mx-auto font-sans leading-relaxed">
          The requested path could not be resolved within the sovereign industrial workbench navigation table.
        </p>
      </div>

      <Button
        variant="primary"
        size="md"
        leftIcon={<ArrowLeft className="w-4 h-4" />}
        onClick={() => navigate('/dashboard')}
      >
        Return to Dashboard
      </Button>
    </div>
  )
}

export default NotFound
